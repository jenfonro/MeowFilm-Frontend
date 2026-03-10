import { reactive } from 'vue';
import { apiDeleteJson, apiGetJson, apiInvalidateCache, apiPostJson, buildQuery } from './apiClient';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const normalizeInt64 = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const toTicks = (seconds) => {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value * 10_000_000);
};
const fromTicks = (ticks) => {
  const value = Number(ticks);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value / 10_000_000);
};

const buildEpisodePlaybackItemId = ({ tmdbType = '', tmdbId = 0, season = 0, episode = 0 } = {}) => {
  const type = normalizeString(tmdbType).toLowerCase();
  const id = Math.max(0, normalizeInt(tmdbId));
  if (id <= 0) return '';
  if (type === 'movie') return `tmdb_movie_${id}`;
  if (type !== 'tv') return '';
  const seasonNo = Math.max(0, normalizeInt(season));
  const episodeNo = Math.max(0, normalizeInt(episode));
  if (seasonNo <= 0 || episodeNo <= 0) return '';
  return `tmdb_tv_${id}_s${String(seasonNo).padStart(2, '0')}_e${String(episodeNo).padStart(3, '0')}`;
};

const buildHistoryIdentity = (context) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return '';
  const contentKey = normalizeString(target.contentKey).toLowerCase();
  const globalEpisode = Math.max(0, normalizeInt(target.globalEpisode));
  if (contentKey && globalEpisode > 0) return `${contentKey}::ep:${globalEpisode}`;
  const siteKey = normalizeString(target.siteKey);
  const videoId = normalizeString(target.videoId);
  if (!siteKey || !videoId) return '';
  const selectionKey = normalizeString(target.selectionKey);
  if (selectionKey) return `${siteKey}::${videoId}::selection:${selectionKey}`;
  const playFlag = normalizeString(target.playFlag);
  const episodeIndex = Math.max(0, normalizeInt(target.episodeIndex));
  if (playFlag) return `${siteKey}::${videoId}::flag:${playFlag}::${episodeIndex}`;
  return `${siteKey}::${videoId}::idx:${episodeIndex}`;
};

const buildHistoryCommitKey = (context) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return '';
  return [
    normalizeString(target.siteKey),
    normalizeString(target.spiderApi),
    normalizeString(target.videoId),
    normalizeString(target.playFlag),
    String(Math.max(0, normalizeInt(target.episodeIndex))),
    normalizeString(target.playbackItemId),
    normalizeString(target.identity),
  ].join('::');
};

const isSameEpisodeHistoryRow = (row, context) => {
  const item = row && typeof row === 'object' ? row : null;
  const target = context && typeof context === 'object' ? context : null;
  if (!item || !target) return false;
  const targetContentKey = normalizeString(target.contentKey).toLowerCase();
  const targetGlobal = Math.max(0, normalizeInt(target.globalEpisode));
  if (targetContentKey && targetGlobal > 0) {
    const rowContentKey = normalizeString(item.contentKey).toLowerCase();
    if (rowContentKey !== targetContentKey) return false;
    const rowPlaybackItemId = normalizeString(item.playbackItemId);
    const targetPlaybackItemId = normalizeString(target.playbackItemId);
    if (rowPlaybackItemId && targetPlaybackItemId) {
      return rowPlaybackItemId === targetPlaybackItemId;
    }
    return (
      Math.max(0, normalizeInt(item.tmdbSeason)) === Math.max(0, normalizeInt(target.tmdbSeason))
      && Math.max(0, normalizeInt(item.tmdbEpisode)) === Math.max(0, normalizeInt(target.tmdbEpisode))
    );
  }
  const rowSiteKey = normalizeString(item.siteKey);
  const rowVideoId = normalizeString(item.videoId);
  if (rowSiteKey !== normalizeString(target.siteKey) || rowVideoId !== normalizeString(target.videoId)) return false;
  const targetEpisodeIndex = Math.max(0, normalizeInt(target.episodeIndex));
  return Math.max(0, normalizeInt(item.episodeIndex)) === targetEpisodeIndex;
};

export const playHistoryListState = reactive({
  items: [],
  at: 0,
  dirty: true,
  loading: false,
  error: '',
});

const historyListState = {
  inFlight: null,
  requestedLimit: 0,
};

const historyCommitState = {
  key: '',
  inFlight: null,
};

const historyProgressState = {
  at: 0,
  inFlight: null,
};

const cloneHistoryRows = (items) => (Array.isArray(items) ? items.map((item) => ({ ...(item || {}) })) : []);

const removePlayHistoryRowLocally = ({ contentKey = '', siteKey = '', videoId = '' } = {}) => {
  const normalizedContentKey = normalizeString(contentKey);
  const normalizedSiteKey = normalizeString(siteKey);
  const normalizedVideoId = normalizeString(videoId);
  const list = Array.isArray(playHistoryListState.items) ? playHistoryListState.items : [];
  const nextItems = list.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    if (normalizedContentKey) return normalizeString(item.contentKey) !== normalizedContentKey;
    return !(
      normalizeString(item.siteKey) === normalizedSiteKey
      && normalizeString(item.videoId) === normalizedVideoId
    );
  });
  updateHistoryListState({
    items: nextItems,
    at: Date.now(),
    dirty: false,
    error: '',
  });
  return nextItems;
};

const sameBaseHistoryTarget = (row, context) => {
  const item = row && typeof row === 'object' ? row : null;
  const target = context && typeof context === 'object' ? context : null;
  if (!item || !target) return false;
  const targetContentKey = normalizeString(target.contentKey).toLowerCase();
  if (targetContentKey) {
    return normalizeString(item.contentKey).toLowerCase() === targetContentKey;
  }
  return (
    normalizeString(item.siteKey) === normalizeString(target.siteKey)
    && normalizeString(item.videoId) === normalizeString(target.videoId)
  );
};

const buildHistoryRowFromContext = (context, extra = {}) => {
  const target = context && typeof context === 'object' ? context : {};
  const patch = extra && typeof extra === 'object' ? extra : {};
  return {
    contentKey: normalizeString(target.contentKey),
    siteKey: normalizeString(target.siteKey),
    siteName: normalizeString(target.siteName),
    spiderApi: normalizeString(target.spiderApi),
    videoId: normalizeString(target.videoId),
    videoTitle: normalizeString(target.videoTitle),
    videoPoster: normalizeString(target.videoPoster),
    videoRemark: normalizeString(target.videoRemark),
    tmdbId: Math.max(0, normalizeInt(target.tmdbId)),
    tmdbType: normalizeString(target.tmdbType),
    tmdbSeason: Math.max(0, normalizeInt(target.tmdbSeason)),
    tmdbEpisode: Math.max(0, normalizeInt(target.tmdbEpisode)),
    globalEpisode: Math.max(0, normalizeInt(target.globalEpisode)),
    // Canonical history pan identity is playFlag. Keep panLabel empty for
    // compatibility fields and old rows only.
    panLabel: '',
    playFlag: normalizeString(target.playFlag),
    episodeIndex: Math.max(0, normalizeInt(target.episodeIndex)),
    episodeName: normalizeString(target.episodeName),
    playbackItemId: normalizeString(target.playbackItemId),
    playbackPositionTicks: Math.max(0, normalizeInt64(patch.playbackPositionTicks)),
    playbackRuntimeTicks: Math.max(0, normalizeInt64(patch.playbackRuntimeTicks)),
    updatedAt: new Date().toISOString(),
  };
};

const mergeHistoryRowLocally = (context, extra = {}) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return;
  const nextRow = buildHistoryRowFromContext(target, extra);
  const list = Array.isArray(playHistoryListState.items) ? playHistoryListState.items.slice() : [];
  const index = list.findIndex((item) => isSameEpisodeHistoryRow(item, target));
  if (index >= 0) {
    list.splice(index, 1);
  }
  list.unshift(nextRow);
  updateHistoryListState({
    items: list,
    at: Date.now(),
    dirty: false,
    error: '',
  });
};

const updateHistoryListState = ({ items, at = Date.now(), dirty = false, error = '' } = {}) => {
  playHistoryListState.items = cloneHistoryRows(items);
  playHistoryListState.at = Math.max(0, normalizeInt64(at)) || Date.now();
  playHistoryListState.dirty = !!dirty;
  playHistoryListState.error = normalizeString(error);
  return playHistoryListState.items;
};

export const seedPlayHistoryItems = (items, { at = Date.now(), dirty = false } = {}) => {
  const nextItems = cloneHistoryRows(items);
  if (!nextItems.length) return playHistoryListState.items;
  historyListState.requestedLimit = Math.max(historyListState.requestedLimit, nextItems.length);
  if (!playHistoryListState.items.length || Math.max(0, normalizeInt64(at)) >= Math.max(0, normalizeInt64(playHistoryListState.at))) {
    updateHistoryListState({ items: nextItems, at, dirty, error: '' });
  }
  return playHistoryListState.items;
};

export const ensurePlayHistoryItems = async ({ limit = 50, force = false } = {}) => {
  const targetLimit = Math.max(1, normalizeInt(limit) || 50);
  if (
    !force
    && !playHistoryListState.dirty
    && Array.isArray(playHistoryListState.items)
    && playHistoryListState.items.length > 0
    && historyListState.requestedLimit >= targetLimit
  ) {
    return playHistoryListState.items.slice(0, targetLimit);
  }
  if (!historyListState.inFlight) {
    historyListState.requestedLimit = Math.max(historyListState.requestedLimit, targetLimit);
    playHistoryListState.loading = true;
    playHistoryListState.error = '';
    historyListState.inFlight = (async () => {
      try {
        const list = await apiGetJson(`/api/playhistory${buildQuery({ limit: targetLimit })}`, { cacheMs: 0 });
        updateHistoryListState({
          items: Array.isArray(list) ? list : [],
          at: Date.now(),
          dirty: false,
          error: '',
        });
      } catch (error) {
        playHistoryListState.error = error && error.message ? String(error.message) : '历史记录加载失败';
      } finally {
        playHistoryListState.loading = false;
      }
    })();
    historyListState.inFlight.finally(() => {
      historyListState.inFlight = null;
    });
  }
  await historyListState.inFlight.catch(() => null);
  if (!force && historyListState.requestedLimit < targetLimit) {
    return ensurePlayHistoryItems({ limit: targetLimit, force: true });
  }
  return playHistoryListState.items.slice(0, targetLimit);
};

export const deletePlayHistoryItem = async ({ contentKey = '', siteKey = '', videoId = '' } = {}) => {
  const normalizedContentKey = normalizeString(contentKey);
  const normalizedSiteKey = normalizeString(siteKey);
  const normalizedVideoId = normalizeString(videoId);
  if (!normalizedContentKey && (!normalizedSiteKey || !normalizedVideoId)) {
    throw new Error('缺少历史记录标识');
  }
  const query = normalizedContentKey
    ? { contentKey: normalizedContentKey }
    : { siteKey: normalizedSiteKey, videoId: normalizedVideoId };
  const data = await apiDeleteJson(`/api/playhistory${buildQuery(query)}`, { dedupe: false });
  if (data && typeof data === 'object' && !Array.isArray(data) && data.success === false) {
    throw new Error(normalizeString(data.message || data.error || data.msg) || '删除失败');
  }
  apiInvalidateCache({ urlPrefix: '/api/playhistory', method: 'GET' });
  removePlayHistoryRowLocally({
    contentKey: normalizedContentKey,
    siteKey: normalizedSiteKey,
    videoId: normalizedVideoId,
  });
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
  }
};

export const warmPlayHistoryForContext = async (context = {}, { limit = 50 } = {}) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return playHistoryListState.items;
  const existing = Array.isArray(playHistoryListState.items) ? playHistoryListState.items : [];
  if (existing.some((item) => sameBaseHistoryTarget(item, target))) return existing;
  return ensurePlayHistoryItems({ limit, force: false });
};

export const findPlayHistoryRowForContext = (context = {}, { sameEpisodeOnly = false } = {}) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return null;
  const list = Array.isArray(playHistoryListState.items) ? playHistoryListState.items : [];
  if (sameEpisodeOnly) {
    return list.find((item) => isSameEpisodeHistoryRow(item, target)) || null;
  }
  return list.find((item) => sameBaseHistoryTarget(item, target)) || null;
};

export const ensurePlayHistoryRowForContext = async (context = {}, { limit = 50, sameEpisodeOnly = false } = {}) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return null;
  const existing = findPlayHistoryRowForContext(target, { sameEpisodeOnly });
  if (existing) return existing;
  await warmPlayHistoryForContext(target, { limit });
  return findPlayHistoryRowForContext(target, { sameEpisodeOnly });
};

export const playHistorySessionState = reactive({
  activeContext: {
    identity: '',
    reportEnabled: false,
    contentKey: '',
    siteKey: '',
    siteName: '',
    spiderApi: '',
    videoId: '',
    videoTitle: '',
    videoPoster: '',
    videoRemark: '',
    tmdbId: 0,
    tmdbType: '',
    tmdbSeason: 0,
    tmdbEpisode: 0,
    globalEpisode: 0,
    panLabel: '',
    playFlag: '',
    episodeIndex: 0,
    episodeName: '',
    playbackItemId: '',
    selectionKey: '',
  },
  playerTime: {
    currentTime: 0,
    duration: 0,
    at: 0,
    playing: false,
  },
  resumePlan: {
    identity: '',
    seconds: 0,
    applied: false,
    tryKey: '',
    tryAt: 0,
    frozen: false,
  },
  resumeOverride: {
    identity: '',
    seconds: 0,
    at: 0,
  },
});

const setResumePlan = ({ identity = '', seconds = 0 } = {}) => {
  playHistorySessionState.resumePlan = {
    identity: normalizeString(identity),
    seconds: Math.max(0, normalizeInt(seconds)),
    applied: false,
    tryKey: '',
    tryAt: 0,
    frozen: false,
  };
  return playHistorySessionState.resumePlan;
};

const rememberResumeOverride = (identity, seconds) => {
  const nextIdentity = normalizeString(identity);
  const nextSeconds = Math.max(0, normalizeInt(seconds));
  if (!nextIdentity || nextSeconds <= 0) return;
  playHistorySessionState.resumeOverride = {
    identity: nextIdentity,
    seconds: nextSeconds,
    at: Date.now(),
  };
};

const readResumeSecondsFromHistory = async (context) => {
  const target = context && typeof context === 'object' ? context : null;
  if (!target) return 0;
  const now = Date.now();
  if (
    !playHistoryListState.dirty
    && playHistoryListState.at > 0
    && now - playHistoryListState.at < 15_000
    && Array.isArray(playHistoryListState.items)
  ) {
    const hit = playHistoryListState.items.find((item) => isSameEpisodeHistoryRow(item, target)) || null;
    return fromTicks(hit && hit.playbackPositionTicks);
  }
  try {
    await warmPlayHistoryForContext(target, { limit: 50 });
  } catch (_error) {
    return 0;
  }
  const hit = (Array.isArray(playHistoryListState.items) ? playHistoryListState.items : []).find((item) => isSameEpisodeHistoryRow(item, target)) || null;
  return fromTicks(hit && hit.playbackPositionTicks);
};

export const preparePlayHistoryContext = async (payload = {}) => {
  const raw = payload && typeof payload === 'object' ? payload : {};
  const current = playHistorySessionState.activeContext && typeof playHistorySessionState.activeContext === 'object'
    ? playHistorySessionState.activeContext
    : {};
  const currentIdentity = normalizeString(current.identity);
  const currentSeconds = Math.max(0, normalizeInt(playHistorySessionState.playerTime.currentTime));
  if (currentIdentity && currentSeconds > 0) {
    rememberResumeOverride(currentIdentity, currentSeconds);
  }

  const nextContext = {
    identity: '',
    reportEnabled: !!raw.reportEnabled,
    contentKey: normalizeString(raw.contentKey),
    siteKey: normalizeString(raw.siteKey),
    siteName: normalizeString(raw.siteName),
    spiderApi: normalizeString(raw.spiderApi),
    videoId: normalizeString(raw.videoId),
    videoTitle: normalizeString(raw.videoTitle),
    videoPoster: normalizeString(raw.videoPoster),
    videoRemark: normalizeString(raw.videoRemark),
    tmdbId: Math.max(0, normalizeInt(raw.tmdbId)),
    tmdbType: normalizeString(raw.tmdbType).toLowerCase(),
    tmdbSeason: Math.max(0, normalizeInt(raw.tmdbSeason)),
    tmdbEpisode: Math.max(0, normalizeInt(raw.tmdbEpisode)),
    globalEpisode: Math.max(0, normalizeInt(raw.globalEpisode)),
    panLabel: '',
    playFlag: normalizeString(raw.playFlag),
    episodeIndex: Math.max(0, normalizeInt(raw.episodeIndex)),
    episodeName: normalizeString(raw.episodeName),
    playbackItemId: normalizeString(raw.playbackItemId),
    selectionKey: normalizeString(raw.selectionKey),
  };
  nextContext.identity = buildHistoryIdentity(nextContext);
  playHistorySessionState.activeContext = nextContext;

  if (!nextContext.identity || !nextContext.reportEnabled) {
    setResumePlan({});
    return nextContext;
  }

  const override = playHistorySessionState.resumeOverride && typeof playHistorySessionState.resumeOverride === 'object'
    ? playHistorySessionState.resumeOverride
    : null;
  const overrideIdentity = normalizeString(override && override.identity);
  const overrideSeconds = Math.max(0, normalizeInt(override && override.seconds));
  const overrideAt = Math.max(0, normalizeInt64(override && override.at));
  if (
    overrideIdentity
    && overrideIdentity === nextContext.identity
    && overrideSeconds > 0
    && overrideAt > 0
    && Date.now() - overrideAt < 6 * 60 * 60 * 1000
  ) {
    setResumePlan({ identity: nextContext.identity, seconds: overrideSeconds });
    return nextContext;
  }

  const resumeSeconds = await readResumeSecondsFromHistory(nextContext);
  setResumePlan({ identity: nextContext.identity, seconds: resumeSeconds });
  return nextContext;
};

export const clearActivePlayHistoryContext = () => {
  playHistorySessionState.activeContext = {
    identity: '',
    reportEnabled: false,
    contentKey: '',
    siteKey: '',
    siteName: '',
    spiderApi: '',
    videoId: '',
    videoTitle: '',
    videoPoster: '',
    videoRemark: '',
    tmdbId: 0,
    tmdbType: '',
    tmdbSeason: 0,
    tmdbEpisode: 0,
    globalEpisode: 0,
    panLabel: '',
    playFlag: '',
    episodeIndex: 0,
    episodeName: '',
    playbackItemId: '',
    selectionKey: '',
  };
  setResumePlan({});
};

export const onPlayerHistoryTimeUpdate = (info = {}) => {
  const currentTime = Math.max(0, Number(info && info.currentTime) || 0);
  const duration = Math.max(0, Number(info && info.duration) || 0);
  playHistorySessionState.playerTime = {
    currentTime,
    duration,
    at: Date.now(),
    playing: !!(info && info.playing),
  };
};

const commitHistoryBaseIfNeeded = async (reason = '') => {
  const context = playHistorySessionState.activeContext && typeof playHistorySessionState.activeContext === 'object'
    ? playHistorySessionState.activeContext
    : null;
  if (!context || !context.reportEnabled) return;
  const key = buildHistoryCommitKey(context);
  if (!key) return;
  if (historyCommitState.key === key || historyCommitState.inFlight) return;
  historyCommitState.key = key;
  historyCommitState.inFlight = (async () => {
    try {
      await apiPostJson('/api/playhistory', {
        contentKey: context.contentKey,
        siteKey: context.siteKey,
        siteName: context.siteName,
        spiderApi: context.spiderApi,
        videoId: context.videoId,
        videoTitle: context.videoTitle,
        videoPoster: context.videoPoster,
        videoRemark: context.videoRemark,
        tmdbId: context.tmdbId,
        tmdbType: context.tmdbType,
        tmdbSeason: context.tmdbSeason,
        tmdbEpisode: context.tmdbEpisode,
    panLabel: '',
        playFlag: context.playFlag,
        episodeIndex: context.episodeIndex,
        episodeName: context.episodeName,
        playbackItemId: context.playbackItemId,
      }, { dedupe: false });
      mergeHistoryRowLocally(context);
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
      }
    } catch (_error) {
      // ignore
    }
  })();
  try {
    await historyCommitState.inFlight;
  } finally {
    if (historyCommitState.key === key) historyCommitState.inFlight = null;
  }
  void reason;
};

export const onPlayerHistoryPlaybackStart = async (reason = '') => {
  await commitHistoryBaseIfNeeded(reason);
  historyProgressState.at = Date.now();
  const plan = playHistorySessionState.resumePlan && typeof playHistorySessionState.resumePlan === 'object'
    ? playHistorySessionState.resumePlan
    : null;
  const context = playHistorySessionState.activeContext && typeof playHistorySessionState.activeContext === 'object'
    ? playHistorySessionState.activeContext
    : null;
  const identity = normalizeString(context && context.identity);
  const seconds = Math.max(0, normalizeInt(plan && plan.seconds));
  if (!identity || !plan || plan.frozen || seconds <= 0 || normalizeString(plan.identity) !== identity) return 0;
  const now = Date.now();
  if (plan.applied) return 0;
  if (normalizeString(plan.tryKey) === identity && now - Math.max(0, normalizeInt64(plan.tryAt)) < 800) return 0;
  plan.tryKey = identity;
  plan.tryAt = now;
  plan.applied = true;
  plan.frozen = true;
  return seconds;
};

export const syncHistoryProgressIfPossible = async ({ force = false } = {}) => {
  const context = playHistorySessionState.activeContext && typeof playHistorySessionState.activeContext === 'object'
    ? playHistorySessionState.activeContext
    : null;
  if (!context || !context.reportEnabled) return;
  const playerTime = playHistorySessionState.playerTime && typeof playHistorySessionState.playerTime === 'object'
    ? playHistorySessionState.playerTime
    : null;
  if (!playerTime || !playerTime.playing) return;
  const positionTicks = toTicks(playerTime.currentTime);
  const runtimeTicks = toTicks(playerTime.duration);
  if (positionTicks <= 0) return;
  const now = Date.now();
  if (!force && now - historyProgressState.at < 12_000) return;
  if (historyProgressState.inFlight) return;
  historyProgressState.at = now;
  historyProgressState.inFlight = (async () => {
    try {
      await commitHistoryBaseIfNeeded('timeupdate');
      await apiPostJson('/api/playhistory', {
        contentKey: context.contentKey,
        siteKey: context.siteKey,
        siteName: context.siteName,
        spiderApi: context.spiderApi,
        videoId: context.videoId,
        videoTitle: context.videoTitle,
        videoPoster: context.videoPoster,
        videoRemark: context.videoRemark,
        tmdbId: context.tmdbId,
        tmdbType: context.tmdbType,
        tmdbSeason: context.tmdbSeason,
        tmdbEpisode: context.tmdbEpisode,
        panLabel: '',
        playFlag: context.playFlag,
        episodeIndex: context.episodeIndex,
        episodeName: context.episodeName,
        playbackItemId: context.playbackItemId,
        playbackPositionTicks: positionTicks,
        playbackRuntimeTicks: runtimeTicks,
      }, { dedupe: false });
      mergeHistoryRowLocally(context, {
        playbackPositionTicks: positionTicks,
        playbackRuntimeTicks: runtimeTicks,
      });
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
      }
    } catch (_error) {
      // ignore
    }
  })();
  try {
    await historyProgressState.inFlight;
  } finally {
    historyProgressState.inFlight = null;
  }
};

export const flushHistoryProgressBestEffort = () => {
  void syncHistoryProgressIfPossible({ force: true });
};

export const buildPlayHistoryPayload = ({
  contentKey = '',
  reportEnabled = false,
  siteKey = '',
  siteName = '',
  spiderApi = '',
  videoId = '',
  videoTitle = '',
  videoPoster = '',
  videoRemark = '',
  tmdbId = 0,
  tmdbType = '',
  tmdbSeason = 0,
  tmdbEpisode = 0,
  globalEpisode = 0,
  panLabel = '',
  playFlag = '',
  episodeIndex = 0,
  episodeName = '',
  selectionKey = '',
} = {}) => {
  const payload = {
    contentKey: normalizeString(contentKey),
    reportEnabled: !!reportEnabled,
    siteKey: normalizeString(siteKey),
    siteName: normalizeString(siteName),
    spiderApi: normalizeString(spiderApi),
    videoId: normalizeString(videoId),
    videoTitle: normalizeString(videoTitle),
    videoPoster: normalizeString(videoPoster),
    videoRemark: normalizeString(videoRemark),
    tmdbId: Math.max(0, normalizeInt(tmdbId)),
    tmdbType: normalizeString(tmdbType).toLowerCase(),
    tmdbSeason: Math.max(0, normalizeInt(tmdbSeason)),
    tmdbEpisode: Math.max(0, normalizeInt(tmdbEpisode)),
    globalEpisode: Math.max(0, normalizeInt(globalEpisode)),
    panLabel: '',
    playFlag: normalizeString(playFlag),
    episodeIndex: Math.max(0, normalizeInt(episodeIndex)),
    episodeName: normalizeString(episodeName),
    selectionKey: normalizeString(selectionKey),
    playbackItemId: '',
  };
  payload.playbackItemId = buildEpisodePlaybackItemId({
    tmdbType: payload.tmdbType,
    tmdbId: payload.tmdbId,
    season: payload.tmdbSeason,
    episode: payload.tmdbEpisode,
  });
  payload.identity = buildHistoryIdentity(payload);
  return payload;
};
