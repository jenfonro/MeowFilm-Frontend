import {
  getSearchSessionAnyQuerySnapshot,
  getSearchSessionAnyQueryStatus,
  performSearchSessionSearch,
  subscribeSearchSessionQuery,
} from './searchSession';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const normalizeMatchKind = (options) => (normalizeString(options && options.kind).toLowerCase() === 'movie' ? 'movie' : 'episode');

export const runSmartPlaybackController = async ({
  runSeq,
  query,
  bootstrap,
  searchScope = 'default',
  searchDisplayModeOverride = '',
  blockedSiteKeys = [],
  singleSiteThread = false,
  matchOptions = null,
  constraintStages = null,
  globalEpisode = 0,
  wantEpisodeInSeason = 0,
  isRunStopped,
  isCandidateAllowed,
  buildSiteItemsFromSnapshot,
  collectRecognitionCandidatesForTarget,
  getCachedSiteResultDetail,
  ensureSiteResultDetailCached,
  buildPanSourcesFromDetail,
  buildPanSegment,
  buildSelectionKey,
  playResolvedSiteSegment,
  setAttemptRunSeq,
  setPendingRunSeq,
  setResume,
  clearPendingAttempt,
  onLoadingStateChange,
  onErrorTextChange,
  onStreamCleanupChange,
  onConfirmedStop,
  getSearchState,
} = {}) => {
  const targetGlobal = Math.max(0, normalizeInt(globalEpisode));
  const targetLoose = Math.max(0, normalizeInt(wantEpisodeInSeason));
  const matchKind = normalizeMatchKind(matchOptions);
  if (!runSeq || !query || (matchKind === 'episode' && targetGlobal <= 0)) return;

  const candidateBuckets = { 1: [], 2: [], 3: [] };
  const candidateRegistry = new Map();
  const failedCandidateKeys = new Set();
  const startedSiteKeys = new Set();
  const queuedSiteKeys = new Set();
  const pendingSiteQueue = [];
  let activeThreads = 0;
  let searchCompleted = false;
  let finalized = false;
  let playAttemptRunning = false;
  let queuedAllowRelaxed = false;
  let currentPendingCandidateKey = '';
  const pendingDetailAbortControllers = new Set();
  let unsubscribe = () => {};

  const safeStopped = () => (typeof isRunStopped === 'function' ? !!isRunStopped() : false);
  const safeBuildSiteItems = (snapshot) =>
    (typeof buildSiteItemsFromSnapshot === 'function' ? buildSiteItemsFromSnapshot(snapshot) : []) || [];
  const safeGetSearchState = (targetQuery, scope) => {
    if (typeof getSearchState === 'function') {
      try {
        const payload = getSearchState(targetQuery, scope);
        if (payload && typeof payload === 'object') {
          return {
            snapshot: payload.snapshot || null,
            status: normalizeString(payload.status) || 'idle',
          };
        }
      } catch (_error) {}
    }
    return {
      snapshot: getSearchSessionAnyQuerySnapshot(targetQuery, scope),
      status: getSearchSessionAnyQueryStatus(targetQuery, scope),
    };
  };
  const safeCandidateAllowed = (candidate) => {
    if (typeof isCandidateAllowed !== 'function') return true;
    try {
      return !!isCandidateAllowed(candidate, matchOptions || {});
    } catch (_error) {
      return true;
    }
  };
  const normalizedConstraintStages = (() => {
    const list = Array.isArray(constraintStages) ? constraintStages : [];
    const stages = list
      .map((stage, index) => {
        const target = stage && typeof stage === 'object' ? stage : null;
        return {
          key: normalizeString(target && target.key) || `stage_${index + 1}`,
          afterFinalize: !!(target && target.afterFinalize),
          isCandidateAllowed: typeof (target && target.isCandidateAllowed) === 'function'
            ? target.isCandidateAllowed
            : null,
        };
      })
      .filter((stage) => stage && stage.isCandidateAllowed);
    if (stages.length) return stages;
    return [{
      key: 'default',
      afterFinalize: false,
      isCandidateAllowed: (candidate) => safeCandidateAllowed(candidate),
    }];
  })();
  const isStageCandidateAllowed = (stage, candidate) => {
    const target = stage && typeof stage === 'object' ? stage : null;
    if (!target || typeof target.isCandidateAllowed !== 'function') return safeCandidateAllowed(candidate);
    try {
      return !!target.isCandidateAllowed(candidate, matchOptions || {});
    } catch (_error) {
      return safeCandidateAllowed(candidate);
    }
  };

  const clearPending = () => {
    if (typeof clearPendingAttempt === 'function') clearPendingAttempt();
  };

  const abortPendingDetails = () => {
    if (!pendingDetailAbortControllers.size) return;
    Array.from(pendingDetailAbortControllers).forEach((controller) => {
      try {
        controller.abort();
      } catch (_error) {}
    });
    pendingDetailAbortControllers.clear();
  };

  const sortBuckets = () => {
    candidateBuckets[1] = [];
    candidateBuckets[2] = [];
    candidateBuckets[3] = [];
    candidateRegistry.forEach((candidate) => {
      const tier = Math.max(1, Math.min(3, normalizeInt(candidate && candidate.tierRank) || 3));
      candidateBuckets[tier].push(candidate);
    });
    const orderMap = new Map(
      safeBuildSiteItems(safeGetSearchState(query, searchScope).snapshot)
        .map((entry, index) => [normalizeString(entry && entry.id), index])
    );
    [1, 2, 3].forEach((tier) => {
      candidateBuckets[tier].sort((left, right) => {
        const leftOrder = orderMap.has(normalizeString(left && left.siteItem && left.siteItem.id))
          ? orderMap.get(normalizeString(left.siteItem.id))
          : 999999;
        const rightOrder = orderMap.has(normalizeString(right && right.siteItem && right.siteItem.id))
          ? orderMap.get(normalizeString(right.siteItem.id))
          : 999999;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        if (normalizeString(left && left.panKey) !== normalizeString(right && right.panKey)) {
          return String(left && left.panKey || '').localeCompare(String(right && right.panKey || ''), 'zh');
        }
        return normalizeInt(left && left.itemIndex) - normalizeInt(right && right.itemIndex);
      });
    });
  };

  const tryResolvePlayback = async (allowRelaxed = false) => {
    if (safeStopped()) return false;
    const tiers = allowRelaxed ? [1, 2, 3] : [1];
    const stages = normalizedConstraintStages.filter((stage) => allowRelaxed || !stage.afterFinalize);
    for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
      const stage = stages[stageIndex];
      for (let i = 0; i < tiers.length; i += 1) {
        const tier = tiers[i];
        const pickedList = Array.isArray(candidateBuckets[tier]) ? candidateBuckets[tier] : [];
        for (let j = 0; j < pickedList.length; j += 1) {
          const picked = pickedList[j];
          if (!isStageCandidateAllowed(stage, picked)) continue;
          const candidateKey = `${normalizeString(picked && picked.siteItem && picked.siteItem.id)}::${normalizeString(picked && picked.panKey)}::${normalizeInt(picked && picked.itemIndex)}`;
          if (!candidateKey || failedCandidateKeys.has(candidateKey)) continue;
          const detail = (typeof getCachedSiteResultDetail === 'function' ? getCachedSiteResultDetail(picked.siteItem) : null)
            || await (typeof ensureSiteResultDetailCached === 'function'
              ? ensureSiteResultDetailCached(picked.siteItem).catch(() => null)
              : null);
          if (!detail) {
            failedCandidateKeys.add(candidateKey);
            continue;
          }
          const panSources = typeof buildPanSourcesFromDetail === 'function' ? buildPanSourcesFromDetail(detail) : [];
          const panEntry = Array.isArray(panSources)
            ? panSources.find((entry) => normalizeString(entry && entry.key) === normalizeString(picked && picked.panKey)) || null
            : null;
          const segment = typeof buildPanSegment === 'function'
            ? buildPanSegment(panEntry, picked && picked.itemIndex)
            : null;
          if (!panEntry || !segment || !normalizeString(segment && segment.episodeUrl)) {
            failedCandidateKeys.add(candidateKey);
            continue;
          }
          if (typeof setAttemptRunSeq === 'function') setAttemptRunSeq(runSeq);
          const ok = await (typeof playResolvedSiteSegment === 'function'
            ? playResolvedSiteSegment({
              siteItem: picked.siteItem,
              panEntry,
              segment,
              candidate: picked && picked.candidate ? picked.candidate : null,
              selectionKey: typeof buildSelectionKey === 'function'
                ? buildSelectionKey(panEntry && panEntry.key, segment && segment.index)
                : '',
              globalEpisode: targetGlobal,
            })
            : false);
          if (!ok) {
            failedCandidateKeys.add(candidateKey);
            currentPendingCandidateKey = '';
            if (typeof setAttemptRunSeq === 'function') setAttemptRunSeq(0);
            continue;
          }
          currentPendingCandidateKey = candidateKey;
          if (typeof setPendingRunSeq === 'function') setPendingRunSeq(runSeq);
          if (typeof setResume === 'function') {
            setResume(async () => {
              if (safeStopped()) return;
              if (currentPendingCandidateKey) failedCandidateKeys.add(currentPendingCandidateKey);
              currentPendingCandidateKey = '';
              clearPending();
              await requestResolvePlayback(searchCompleted && activeThreads <= 0);
            });
          }
          return true;
        }
      }
    }
    return false;
  };

  const requestResolvePlayback = async (allowRelaxed = false) => {
    if (safeStopped()) return false;
    if (currentPendingCandidateKey) {
      queuedAllowRelaxed = queuedAllowRelaxed || !!allowRelaxed;
      return false;
    }
    if (playAttemptRunning) {
      queuedAllowRelaxed = queuedAllowRelaxed || !!allowRelaxed;
      return false;
    }
    playAttemptRunning = true;
    try {
      return await tryResolvePlayback(allowRelaxed);
    } finally {
      playAttemptRunning = false;
      if (!safeStopped() && queuedAllowRelaxed) {
        const nextAllowRelaxed = queuedAllowRelaxed;
        queuedAllowRelaxed = false;
        void requestResolvePlayback(nextAllowRelaxed);
      }
    }
  };

  const finalizeIfComplete = async () => {
    if (finalized || safeStopped()) return;
    if (!searchCompleted || activeThreads > 0) return;
    finalized = true;
    if (await requestResolvePlayback(true)) return;
    if (safeStopped()) return;
    if (typeof onLoadingStateChange === 'function') onLoadingStateChange(false);
    if (typeof onErrorTextChange === 'function') onErrorTextChange('暂无可匹配片源');
  };

  const registerCandidates = async (siteItem) => {
    const candidates = typeof collectRecognitionCandidatesForTarget === 'function'
      ? collectRecognitionCandidatesForTarget(siteItem, {
        matchOptions,
        globalEpisode: targetGlobal,
        wantEpisodeInSeason: targetLoose,
      })
      : [];
    if (!Array.isArray(candidates) || !candidates.length) return false;
    candidates.forEach((candidate) => {
      if (!safeCandidateAllowed(candidate)) return;
      const dedupeKey = `${normalizeString(candidate && candidate.siteItem && candidate.siteItem.id)}::${normalizeString(candidate && candidate.panKey)}::${normalizeInt(candidate && candidate.itemIndex)}`;
      if (!dedupeKey) return;
      candidateRegistry.set(dedupeKey, candidate);
    });
    sortBuckets();
    return requestResolvePlayback(false);
  };

  const runNextQueuedSiteThread = () => {
    if (!singleSiteThread || safeStopped()) return;
    if (activeThreads > 0) return;
    const next = pendingSiteQueue.shift();
    if (!next) return;
    startSiteThread(next.siteKey, next.items);
  };

  const startSiteThread = (siteKey, items) => {
    const key = normalizeString(siteKey);
    if (!key || safeStopped() || startedSiteKeys.has(key) || !Array.isArray(items) || !items.length) return;
    startedSiteKeys.add(key);
    activeThreads += 1;
    Promise.resolve()
      .then(async () => {
        for (let i = 0; i < items.length; i += 1) {
          if (safeStopped()) return;
          const siteItem = items[i];
          const detailAbortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
          if (detailAbortController) pendingDetailAbortControllers.add(detailAbortController);
          const detail = await Promise.resolve()
            .then(() => (typeof ensureSiteResultDetailCached === 'function'
              ? ensureSiteResultDetailCached(siteItem, {
                signal: detailAbortController ? detailAbortController.signal : null,
                onUpdate: (nextDetail) => {
                  const payload = nextDetail && typeof nextDetail === 'object' ? nextDetail : null;
                  if (!payload || safeStopped()) return;
                  void registerCandidates(siteItem);
                },
              }).catch(() => null)
              : null))
            .finally(() => {
              if (detailAbortController) pendingDetailAbortControllers.delete(detailAbortController);
            });
          if (!detail || safeStopped()) continue;
          await registerCandidates(siteItem);
        }
      })
      .finally(async () => {
        activeThreads = Math.max(0, activeThreads - 1);
        if (singleSiteThread) {
          queuedSiteKeys.delete(key);
          runNextQueuedSiteThread();
        }
        await finalizeIfComplete();
      });
  };

  const enqueueSiteThread = (siteKey, items) => {
    const key = normalizeString(siteKey);
    if (!key || safeStopped() || startedSiteKeys.has(key) || queuedSiteKeys.has(key) || !Array.isArray(items) || !items.length) return;
    queuedSiteKeys.add(key);
    pendingSiteQueue.push({ siteKey: key, items });
    runNextQueuedSiteThread();
  };

  const scheduleThreadsFromSnapshot = (snapshot) => {
    if (safeStopped()) return;
    const items = safeBuildSiteItems(snapshot);
    if (!items.length) return;
    const grouped = new Map();
    items.forEach((siteItem) => {
      const key = normalizeString(siteItem && siteItem.siteKey);
      if (!key) return;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(siteItem);
    });
    grouped.forEach((groupItems, siteKey) => {
      if (singleSiteThread) enqueueSiteThread(siteKey, groupItems);
      else startSiteThread(siteKey, groupItems);
    });
  };

  unsubscribe = subscribeSearchSessionQuery(query, (snapshot, status) => {
    if (safeStopped()) return;
    scheduleThreadsFromSnapshot(snapshot);
    if (status === 'completed' || status === 'error') {
      searchCompleted = true;
      void finalizeIfComplete();
    }
  }, searchScope);

  if (typeof onStreamCleanupChange === 'function') {
    onStreamCleanupChange(() => {
      abortPendingDetails();
      try {
        unsubscribe();
      } catch (_error) {}
    });
  }

  const initialSearchState = safeGetSearchState(query, searchScope);
  if (initialSearchState.snapshot) {
    scheduleThreadsFromSnapshot(initialSearchState.snapshot);
  }
  if (initialSearchState.status === 'completed' || initialSearchState.status === 'error') {
    searchCompleted = true;
    await finalizeIfComplete();
  }
  if (initialSearchState.status === 'idle' && !initialSearchState.snapshot) {
    void performSearchSessionSearch(query, bootstrap, {
      saveHistoryEnabled: false,
      blockedSiteKeys,
      affectUi: false,
      scope: searchScope,
      searchDisplayModeOverride,
      contentKind: matchKind === 'movie' ? 'movie' : 'tv',
    }).then(() => {
      if (safeStopped()) return;
      searchCompleted = true;
      void finalizeIfComplete();
    }).catch(() => {
      if (safeStopped()) return;
      searchCompleted = true;
      void finalizeIfComplete();
    });
    return;
  }
  if (safeStopped() && typeof onConfirmedStop === 'function') onConfirmedStop();
};
