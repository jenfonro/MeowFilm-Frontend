import { requestCatSpider } from './catpawrunner';
import { createPosterCard } from './posterCard';
import { formatTMDBTVRemark } from './tmdbBadge';

export function initSearchPage() {
  const historyEndpoint = '/api/searchhistory';
  const sitesEndpoint = '/api/user/sites';
  const AGG_STORAGE_KEY = 'tv:search:aggregate:sources:v3';
  const SEARCH_AGG_RUNTIME_KEY = '__tvSearchAggregateState';
  const SEARCH_AGG_EVENT = 'tv:search-aggregate-state';

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const clearQueryBtn = document.getElementById('clearQueryBtn');

  const resultsSection = document.getElementById('searchResultsSection');
  const rawListToggleWrap = document.getElementById('searchRawListToggleWrap');
  const rawListToggle = document.getElementById('searchRawListToggle');
  const resultsProgress = document.getElementById('searchResultsProgress');
  const resultsSummary = document.getElementById('searchResultsSummary');
  const resultsStatus = document.getElementById('searchResultsStatus');
  const resultsList = document.getElementById('searchResultsList');

  const historySection = document.getElementById('searchHistorySection');
  const chipsBox = document.getElementById('searchHistoryChips');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  if (
    !form ||
    !input ||
    !clearQueryBtn ||
    !resultsSection ||
    !rawListToggleWrap ||
    !rawListToggle ||
    !resultsProgress ||
    !resultsSummary ||
    !resultsStatus ||
    !resultsList ||
    !historySection ||
    !chipsBox ||
    !clearHistoryBtn
  ) {
    return;
  }

  const configEl = document.getElementById('homeDoubanConfig');
  let catApiBase = (configEl && configEl.getAttribute('data-cat-api-base')) || '';
  const tvUser = (configEl && configEl.getAttribute('data-tv-user')) || '';
  let searchConcurrency = 5;
  let searchCoverSiteKey = '';
  let siteOrderList = [];
  let siteOrderMap = new Map();
  let magicSearchCleanRules = [];
  let searchDisplayMode = 'sites'; // sites | tmdb | both

  const safeParseJsonArray = (text) => {
    try {
      const arr = JSON.parse(typeof text === 'string' ? text : '');
      return Array.isArray(arr) ? arr : [];
    } catch (_e) {
      return [];
    }
  };

  const refreshSearchConfigFromDom = () => {
    catApiBase = (configEl && configEl.getAttribute('data-cat-api-base')) || '';
    const threadRaw = (configEl && configEl.getAttribute('data-search-thread-count')) || '5';
    const threadNum = Number(threadRaw);
    searchConcurrency =
      Number.isFinite(threadNum) && threadNum > 0 ? Math.min(50, Math.floor(threadNum)) : 5;

    const orderRaw = (configEl && configEl.getAttribute('data-search-site-order')) || '[]';
    siteOrderList = safeParseJsonArray(orderRaw)
      .map((k) => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean);
    siteOrderMap = new Map();
    siteOrderList.forEach((k, idx) => {
      if (!siteOrderMap.has(k)) siteOrderMap.set(k, idx);
    });

    searchCoverSiteKey = ((configEl && configEl.getAttribute('data-search-cover-site')) || '').trim();

    const magicRaw =
      (configEl && (configEl.getAttribute('data-magic-search-clean-rules') || configEl.getAttribute('data-magic-aggregate-rules'))) ||
      '[]';
    magicSearchCleanRules = safeParseJsonArray(magicRaw)
      .map((x) => (typeof x === 'string' ? x.trim() : ''))
      .filter(Boolean);

    const modeRaw = ((configEl && configEl.getAttribute('data-search-display-mode')) || 'sites').trim();
    searchDisplayMode = modeRaw === 'tmdb' || modeRaw === 'both' || modeRaw === 'sites' ? modeRaw : 'sites';

  };

  refreshSearchConfigFromDom();

  const requestJson = async (url, options = {}) => {
    const resp = await fetch(url, options);
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : '请求失败';
      const err = new Error(msg);
      err.status = resp.status;
      err.code = data && (data.code || data.errorCode) ? String(data.code || data.errorCode) : '';
      throw err;
    }
    return data;
  };

  const publishSearchAggregateState = (state) => {
    try {
      if (typeof window === 'undefined') return;
      const payload = state && typeof state === 'object' ? state : {};
      window[SEARCH_AGG_RUNTIME_KEY] = payload;
      window.dispatchEvent(
        new CustomEvent(SEARCH_AGG_EVENT, {
          detail: { state: payload },
        })
      );
    } catch (_e) {}
  };

  // TMDB detail hydration cache (in-memory, per page session).
  const TMDB_DETAIL_CACHE_TTL_MS = 10 * 60 * 1000;
  const tmdbDetailCache = new Map(); // key: `${type}::${id}` -> { at, badge, status, seasonCount, episodeCount }
  const readTMDBDetailCache = (type, id) => {
    const k = `${normalizeTmdbMediaType(type)}::${String(id || '').trim()}`;
    const hit = tmdbDetailCache.get(k) || null;
    if (!hit || !hit.at) return null;
    if (Date.now() - Number(hit.at) > TMDB_DETAIL_CACHE_TTL_MS) {
      tmdbDetailCache.delete(k);
      return null;
    }
    return hit;
  };
  const writeTMDBDetailCache = (type, id, data) => {
    const t = normalizeTmdbMediaType(type);
    const i = Number.isFinite(Number(id)) ? Math.floor(Number(id)) : 0;
    if (!t || i <= 0) return;
    const badge = data && typeof data.badge === 'string' ? data.badge.trim() : '';
    const status = data && typeof data.status === 'string' ? data.status.trim() : '';
    const seasonCount = data && Number.isFinite(Number(data.seasonCount)) ? Math.floor(Number(data.seasonCount)) : 0;
    const episodeCount = data && Number.isFinite(Number(data.episodeCount)) ? Math.floor(Number(data.episodeCount)) : 0;
    tmdbDetailCache.set(`${t}::${String(i)}`, { at: Date.now(), badge, status, seasonCount, episodeCount });
  };

  const normalizeTmdbMediaType = (t) => {
    const raw = typeof t === 'string' ? t.trim().toLowerCase() : '';
    if (raw === 'tv' || raw === 'movie') return raw;
    if (raw === 'series') return 'tv';
    if (raw === 'film') return 'movie';
    return '';
  };

  const setStatus = (text, isError = false) => {
    const value = text || '';
    resultsStatus.textContent = value;
    resultsStatus.classList.toggle('hidden', !value);
    resultsStatus.classList.remove(
      'text-red-500',
      'dark:text-red-400',
      'text-gray-500',
      'dark:text-gray-400'
    );
    if (value) {
      resultsStatus.classList.add(isError ? 'text-red-500' : 'text-gray-500');
      resultsStatus.classList.add(isError ? 'dark:text-red-400' : 'dark:text-gray-400');
    }
  };

  const setSummary = (text) => {
    const value = text || '';
    resultsSummary.textContent = value;
    resultsSummary.classList.toggle('hidden', !value);
  };

  const setProgress = (done, total) => {
    const d = Number.isFinite(Number(done)) ? Number(done) : 0;
    const t = Number.isFinite(Number(total)) ? Number(total) : 0;
    const show = t > 0 && d >= 0 && d < t;
    resultsProgress.textContent = show ? `(${d}/${t})` : '';
    resultsProgress.classList.toggle('hidden', !show);
  };

  const setCount = (count) => {
    const n = Number.isFinite(Number(count)) ? Math.max(0, Math.floor(Number(count))) : 0;
    setSummary(`共 ${n} 条`);
  };

  const RAW_LIST_KEY = 'tv:search:raw_list:v1';
  let rawListMode = false;
  try {
    rawListMode = localStorage.getItem(RAW_LIST_KEY) === '1';
  } catch (_e) {
    rawListMode = false;
  }
  rawListToggle.checked = rawListMode;

  let activeResultsGrid = null;
  let refreshAggregatesForCurrentRun = null;

  const syncRawListToggleVisibility = () => {
    const show = searchDisplayMode === 'sites' || searchDisplayMode === 'both';
    rawListToggleWrap.classList.toggle('hidden', !show);
  };

  const getAggregatedGroupKeys = () => {
    const grid = activeResultsGrid;
    if (!grid) return new Set();
    const keys = new Set();
    Array.from(grid.children || []).forEach((el) => {
      if (!el || !el.dataset) return;
      if (el.dataset.aggregate !== '1') return;
      const gk = (el.dataset.titleAggKey || '').trim();
      if (gk) keys.add(gk);
    });
    return keys;
  };

  const applyRawListModeToGrid = () => {
    const grid = activeResultsGrid;
    if (!grid) return;
    const aggKeys = getAggregatedGroupKeys();
    Array.from(grid.children || []).forEach((el) => {
      if (!el || !el.dataset || !el.classList) return;
      const isAgg = el.dataset.aggregate === '1';
      const gk = (el.dataset.titleAggKey || '').trim();
      const isTMDB = (el.dataset.siteKey || '') === 'tmdb';
      if (isAgg) {
        if (isTMDB) el.classList.remove('hidden');
        else el.classList.toggle('hidden', rawListMode);
        return;
      }
      if (isTMDB) {
        el.classList.remove('hidden');
        return;
      }
      if (gk && aggKeys.has(gk)) {
        el.classList.toggle('hidden', !rawListMode);
        return;
      }
      el.classList.remove('hidden');
    });
  };

  const getVisibleCardCount = () => {
    const grid = activeResultsGrid;
    if (!grid) return 0;
    return Array.from(grid.children || []).filter((el) => el && el.classList && !el.classList.contains('hidden')).length;
  };

  rawListToggle.addEventListener('change', () => {
    rawListMode = !!rawListToggle.checked;
    try {
      localStorage.setItem(RAW_LIST_KEY, rawListMode ? '1' : '0');
    } catch (_e) {}
    if (!rawListMode && typeof refreshAggregatesForCurrentRun === 'function') {
      try {
        refreshAggregatesForCurrentRun();
      } catch (_e) {}
    }
    applyRawListModeToGrid();
    setCount(getVisibleCardCount());
  });

  let showingResults = false;
  const setShowResults = (show) => {
    showingResults = show;
    resultsSection.classList.toggle('hidden', !show);
    historySection.classList.toggle('hidden', show);
  };

  const normalizeSearchList = (data) => {
    const list = data && Array.isArray(data.list) ? data.list : [];
    return list
      .map((it) => ({
        id: it && (it.vod_id != null ? String(it.vod_id) : it.id != null ? String(it.id) : ''),
        name: it && (it.vod_name != null ? String(it.vod_name) : it.name != null ? String(it.name) : ''),
        pic: it && (it.vod_pic != null ? String(it.vod_pic) : it.pic != null ? String(it.pic) : ''),
        remark:
          it && (it.vod_remarks != null ? String(it.vod_remarks) : it.remark != null ? String(it.remark) : ''),
      }))
      .filter((it) => it.name);
  };

  const appendItemsToGrid = ({
    gridEl,
    items,
    siteKey,
    siteApi,
    siteName,
    cornerBadgeText,
    cornerBadgeTitle,
    seenKeys,
    insertCardSorted,
    computeMatchScore,
    siteOrderOverride,
    scoreOverride,
    isAggregate,
  }) => {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return 0;
    let appended = 0;

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      try {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              const img = en.target;
              const src = img && img.dataset ? img.dataset.src : '';
              if (src && !img.getAttribute('src')) img.setAttribute('src', src);
              if (io) io.unobserve(img);
            });
          },
          { root: null, rootMargin: '0px', threshold: 0.01 }
        );
      } catch (_e) {
        io = null;
      }
    }

    list.forEach((it) => {
      const id = it && it.id ? String(it.id) : '';
      const uniq = `${siteKey || ''}::${id}`;
      if (id && seenKeys && seenKeys.has(uniq)) return;
      if (id && seenKeys) seenKeys.add(uniq);

      const wrapper = document.createElement('div');
      wrapper.className = 'w-full';
      wrapper.dataset.siteKey = siteKey || '';
      wrapper.dataset.spiderApi = siteApi || '';
      wrapper.dataset.videoId = id || '';
      if (siteKey && id && matchBlockedKeySet && matchBlockedKeySet.has(`${siteKey}::${id}`)) {
        wrapper.dataset.matchBlocked = '1';
      }
      if (it && typeof it.__groupKey === 'string' && it.__groupKey) wrapper.dataset.titleAggKey = it.__groupKey;
      if (isAggregate) wrapper.dataset.aggregate = '1';
      if (it && (it.__tmdbRank != null || it.tmdbRank != null)) {
        const r = Number.isFinite(Number(it.__tmdbRank))
          ? Number(it.__tmdbRank)
          : Number.isFinite(Number(it.tmdbRank))
            ? Number(it.tmdbRank)
            : 0;
        if (r > 0) wrapper.dataset.tmdbRank = String(Math.max(1, Math.floor(r)));
      }
      wrapper.dataset.siteOrder = String(
        Number.isFinite(Number(siteOrderOverride))
          ? Number(siteOrderOverride)
          : siteOrderMap.has(siteKey)
            ? siteOrderMap.get(siteKey)
            : 999999
      );
      const titleText = it && it.name ? String(it.name) : '';
      const fallbackTitleLen = titleText.replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').length;
      const titleLen = Number.isFinite(Number(it && it.__titleLen)) ? Number(it.__titleLen) : fallbackTitleLen;
      wrapper.dataset.titleLen = String(Math.max(0, Math.floor(titleLen)));
      if (typeof computeMatchScore === 'function' && computeMatchScore(titleText) === 1000) {
        wrapper.dataset.exactMatch = '1';
      }
      const name = titleText;
      const cardWrapper = createPosterCard({
        wrapperEl: wrapper,
        wrapperClass: 'w-full',
        io,
	        detail: {
	          siteKey: siteKey || '',
	          spiderApi: siteApi || '',
	          videoId: it && it.id ? String(it.id) : '',
	          videoTitle: name,
	          videoPoster: it && it.pic ? String(it.pic) : '',
	          videoRemark: it && it.remark ? String(it.remark) : '',
	          contentKey: it && typeof it.__groupKey === 'string' ? it.__groupKey : '',
	          videoYear: it && it.year != null ? String(it.year) : '',
	          searchType:
	            it && typeof it.__searchType === 'string'
	              ? it.__searchType
	              : it && typeof it.searchType === 'string'
	                ? it.searchType
	                : '',
	          tmdbId: it && it.tmdbId != null && Number.isFinite(Number(it.tmdbId)) ? Number(it.tmdbId) : 0,
	          tmdbType:
	            it && typeof it.mediaType === 'string'
	              ? it.mediaType
              : it && typeof it.tmdbType === 'string'
                ? it.tmdbType
                : '',
            openFromSearch: 1,
        },
        title: name,
        poster: it && it.pic ? String(it.pic) : '',
        remark: it && it.remark ? String(it.remark) : '',
        siteName: typeof siteName === 'string' ? siteName : '',
        cornerBadgeText: typeof cornerBadgeText === 'string' ? cornerBadgeText : '',
        cornerBadgeTitle: typeof cornerBadgeTitle === 'string' ? cornerBadgeTitle : '',
        placeholder: true,
      });
      if (!cardWrapper) return;

      try {
        const seasonLabel = it && typeof it.__seasonHintLabel === 'string' ? it.__seasonHintLabel.trim() : '';
        if (seasonLabel) {
          const badge = wrapper.querySelector && wrapper.querySelector('.tv-site-badge');
          if (badge && badge.textContent && !String(badge.textContent).includes(seasonLabel)) {
            badge.textContent = `${String(badge.textContent)}·${seasonLabel}`;
          }
        }
      } catch (_e) {}

      if (typeof insertCardSorted === 'function') {
        const score = Number.isFinite(Number(scoreOverride))
          ? Number(scoreOverride)
          : typeof computeMatchScore === 'function'
            ? computeMatchScore(it && it.name ? it.name : '')
            : 0;
        insertCardSorted(wrapper, score);
      } else {
        gridEl.appendChild(wrapper);
      }
      appended += 1;
    });
    return appended;
  };

  const appendTMDBItemsToGrid = ({
    gridEl,
    items,
    siteName,
    seenKeys,
    insertCardSorted,
    computeMatchScore,
  }) => {
    const grid = gridEl;
    const list = Array.isArray(items) ? items : [];
    if (!grid || !list.length) return 0;
    let appended = 0;

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      try {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              const img = en.target;
              const src = img && img.dataset ? img.dataset.src : '';
              if (src && !img.getAttribute('src')) img.setAttribute('src', src);
              if (io) io.unobserve(img);
            });
          },
          { root: null, rootMargin: '0px', threshold: 0.01 }
        );
      } catch (_e) {
        io = null;
      }
    }

    list.forEach((it) => {
      const id = it && it.id ? String(it.id) : '';
      if (!id) return;
      const uniq = `tmdb::${id}`;
      if (seenKeys && seenKeys.has(uniq)) return;
      if (seenKeys) seenKeys.add(uniq);

      const mediaType = it && it.type ? String(it.type) : '';
      const mediaTypeNormalized = normalizeTmdbMediaType(mediaType);
      const tmdbIdRaw = it && it.id != null ? Number(it.id) : 0;
      const tmdbId = Number.isFinite(tmdbIdRaw) && tmdbIdRaw > 0 ? Math.floor(tmdbIdRaw) : 0;
	      const badgeText = it && typeof it.badge === 'string' ? it.badge.trim() : '';
	      const badgeStatus = it && typeof it.status === 'string' ? it.status.trim() : '';
	      const badgeSeasonCount = it && Number.isFinite(Number(it.seasonCount)) ? Math.floor(Number(it.seasonCount)) : 0;
	      const badgeEpisodeCount = it && Number.isFinite(Number(it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0;
      const yearText = (() => {
        const y = it && it.year != null ? Number(it.year) : 0;
        return Number.isFinite(y) && y > 0 ? String(Math.floor(y)) : '';
      })();
      const titleText = it && it.title ? String(it.title) : '';
	      const remarkText = (() => {
	        const mt = mediaType && mediaType.trim().toLowerCase() === 'movie' ? 'movie' : mediaTypeNormalized;
	        if (mt === 'movie') return yearText;
	        if (mt === 'tv') return formatTMDBTVRemark({ badge: badgeText, status: badgeStatus, seasonCount: badgeSeasonCount, episodeCount: badgeEpisodeCount, title: titleText });
	        return '';
	      })();
      const fallbackTitleLen = titleText.replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').length;
      const titleLen = Number.isFinite(Number(it && it.__titleLen)) ? Number(it.__titleLen) : fallbackTitleLen;

      const wrapper = document.createElement('div');
      wrapper.className = 'w-full';
      wrapper.dataset.siteKey = 'tmdb';
      wrapper.dataset.videoId = id;
      if (mediaTypeNormalized) wrapper.dataset.tmdbType = mediaTypeNormalized;
      if (it && typeof it.__groupKey === 'string' && it.__groupKey) wrapper.dataset.titleAggKey = it.__groupKey;
      wrapper.dataset.siteOrder = '-1';
      if (it && it.__tmdbRank != null) {
        const r = Number.isFinite(Number(it.__tmdbRank)) ? Number(it.__tmdbRank) : 0;
        if (r > 0) wrapper.dataset.tmdbRank = String(Math.max(1, Math.floor(r)));
      }
      wrapper.dataset.titleLen = String(Math.max(0, Math.floor(titleLen)));
      if (typeof computeMatchScore === 'function' && computeMatchScore(titleText) === 1000) {
        wrapper.dataset.exactMatch = '1';
      }

      const score = typeof computeMatchScore === 'function' ? computeMatchScore(titleText) : 0;
      const scoreFinal = Number.isFinite(Number(it && it.__score)) ? Number(it.__score) : score;
      const scoreFinalBoosted = scoreFinal;

	      const mt = mediaTypeNormalized;
	      const typeLabel = mt === 'tv' ? '剧集' : mt === 'movie' ? '电影' : '';
	      const siteLabel = typeLabel;
	      const groupKey = it && typeof it.__groupKey === 'string' ? String(it.__groupKey) : '';
      const detail = {
        tmdbId,
        tmdbType: mt,
        contentKey: groupKey || '',
        videoTitle: titleText,
        videoYear: it && it.year != null ? String(it.year) : '',
        searchType: mt,
        siteKey: '',
        spiderApi: '',
        videoId: it && it.id != null ? String(it.id) : '',
        videoPoster: it && it.poster ? String(it.poster) : '',
        videoRemark: remarkText,
        openFromSearch: 1,
      };
      const cardWrapper = createPosterCard({
        wrapperEl: wrapper,
        wrapperClass: 'w-full',
        io,
        detail,
        title: titleText,
        poster: it && it.poster ? String(it.poster) : '',
        remark: remarkText,
        siteName: siteLabel,
        cornerBadgeText: '',
        placeholder: true,
        overlays: true,
      });
      if (!cardWrapper) return;

      if (typeof insertCardSorted === 'function') insertCardSorted(wrapper, scoreFinalBoosted);
      else grid.appendChild(wrapper);
      appended += 1;
    });

    return appended;
  };

  let cachedSitesPromise = null;
  const loadSites = async () => {
    if (cachedSitesPromise) return cachedSitesPromise;
    cachedSitesPromise = requestJson(sitesEndpoint, { method: 'GET', credentials: 'same-origin' })
      .then((data) => (data && Array.isArray(data.sites) ? data.sites : []))
      .catch(() => []);
    return cachedSitesPromise;
  };
  try {
    window.addEventListener('tv:user-settings-updated', () => {
      cachedSitesPromise = null;
      refreshSearchConfigFromDom();
    });
  } catch (_e) {}

  const formatHttpError = (err) => {
    const status = err && typeof err.status === 'number' ? err.status : 0;
    const msg = err && err.message ? String(err.message) : '请求失败';
    if (status) return `HTTP ${status}：${msg}`;
    return msg;
  };

  let currentRunId = 0;
  let lastSearchKeyword = '';
  let matchBlockedKeySet = new Set(); // `${siteKey}::${videoId}` for current keyword
  const runSearch = async (keyword) => {
    refreshSearchConfigFromDom();

    const runId = (currentRunId += 1);
    const q = (keyword || '').trim();
    if (!q) return;
    lastSearchKeyword = q;
    matchBlockedKeySet = new Set();
    publishSearchAggregateState({
      runId,
      keyword: q,
      done: 0,
      total: 0,
      failed: 0,
      running: true,
      updatedAt: Date.now(),
      groups: {},
    });

    const debugEnabled = (() => {
      try {
        return String(window.location && window.location.search ? window.location.search : '').includes('debug=1');
      } catch (_e) {
        return false;
      }
    })();
    const dbg = (event, payload) => {
      if (!debugEnabled) return;
      try {
        const row = { t: Date.now(), event, ...(payload || {}) };
        window.__tvSearchDebug = Array.isArray(window.__tvSearchDebug) ? window.__tvSearchDebug : [];
        window.__tvSearchDebug.push(row);
        // eslint-disable-next-line no-console
        console.log('[search-debug]', row);
      } catch (_e) {}
    };
    dbg('run_start', { q, searchDisplayMode });

    refreshAggregatesForCurrentRun = null;

    try {
      sessionStorage.removeItem(AGG_STORAGE_KEY);
    } catch (_e) {}

    setShowResults(true);
    resultsList.innerHTML = '';
    setSummary('');
    setProgress(0, 0);
    setCount(0);
    setStatus('');
    syncRawListToggleVisibility();

    try {
      const data = await requestJson(`/api/smart/matchblock/items?keyword=${encodeURIComponent(q)}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      const items = data && Array.isArray(data.items) ? data.items : [];
      items.forEach((it) => {
        const sk = it && typeof it.siteKey === 'string' ? it.siteKey.trim() : '';
        const vid = it && typeof it.videoId === 'string' ? it.videoId.trim() : '';
        if (!sk || !vid) return;
        matchBlockedKeySet.add(`${sk}::${vid}`);
      });
    } catch (_e) {
      matchBlockedKeySet = new Set();
    }

    const grid = document.createElement('div');
    grid.className = 'douban-grid';
    resultsList.appendChild(grid);
    activeResultsGrid = grid;

    const updateProgressAndCount = (done, total) => {
      setProgress(done, total);
      applyRawListModeToGrid();
      setCount(getVisibleCardCount());
    };

    const normalizeForMatch = (s) =>
      String(s || '')
        .toLowerCase()
        .replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '')
        .trim();
    const qNorm = normalizeForMatch(q);

    const normalizePatternInput = (text) => {
      const raw = typeof text === 'string' ? text.trim() : '';
      if (!raw) return null;
      if (raw.startsWith('/') && raw.lastIndexOf('/') > 0) {
        const last = raw.lastIndexOf('/');
        const pattern = raw.slice(1, last).trim();
        const flags = raw.slice(last + 1).trim();
        if (!pattern) return null;
        return { pattern, flags };
      }
      return { pattern: raw };
    };

    const buildRegexFromInput = (raw, { defaultFlags = '', forceGlobal = false } = {}) => {
      const parsed = normalizePatternInput(raw);
      if (!parsed || !parsed.pattern) return null;
      const fRaw = typeof parsed.flags === 'string' ? parsed.flags : '';
      let flags = fRaw || (typeof defaultFlags === 'string' ? defaultFlags : '');
      if (forceGlobal && !flags.includes('g')) flags += 'g';
      try {
        return new RegExp(parsed.pattern, flags);
      } catch (_e) {
        return null;
      }
    };

    const compileCleanRules = (rawRules, { queryTrailingDigits = '' } = {}) => {
      const list = Array.isArray(rawRules) ? rawRules : [];
      const out = [];
      const tailDigits = typeof queryTrailingDigits === 'string' ? queryTrailingDigits : '';
      list.forEach((rule) => {
        const raw = typeof rule === 'string' ? rule.trim() : '';
        if (!raw) return;
        const re = buildRegexFromInput(raw, { defaultFlags: 'ig', forceGlobal: true });
        if (!re) return;
        let isTrailingDigitsRule = false;
        if (tailDigits) {
          try {
            // Heuristic: if this rule removes digits only when they are at the end of the string,
            // treat it as a "trailing digits stripping" rule and allow skipping it for numeric queries.
            const t1 = `x${tailDigits}`;
            const t2 = `x${tailDigits}y`;
            const r1 = t1.replace(re, '');
            const r2 = t2.replace(re, '');
            if (r1 === 'x' && r2 === t2) isTrailingDigitsRule = true;
          } catch (_e) {
            isTrailingDigitsRule = false;
          }
        }
        out.push({ re, isTrailingDigitsRule });
      });
      return out;
    };

    const applyCleanRules = (text, rules, { skipTrailingDigitsRule = false } = {}) => {
      let out = String(text || '');
      const list = Array.isArray(rules) ? rules : [];
      list.forEach((entry) => {
        const re = entry && entry.re ? entry.re : entry;
        const isTrailingDigitsRule = Boolean(entry && entry.isTrailingDigitsRule);
        if (skipTrailingDigitsRule && isTrailingDigitsRule) return;
        if (!re || typeof re !== 'object' || typeof re.test !== 'function') return;
        try {
          if (re && (re.global || re.sticky)) re.lastIndex = 0;
        } catch (_e) {}
        try {
          out = out.replace(re, '');
        } catch (_e) {}
      });
      return out;
    };

    // Used only for retrieving aggregated sources on the play page.
    // Keep letters/numbers/CJK to be resilient against site-specific punctuation/emoji.
    const normalizeAggStorageKey = (s) =>
      String(s || '')
        .toLowerCase()
        .replace(/[^0-9a-z\u4e00-\u9fa5]+/gi, '')
        .trim();

    // Used for title grouping; keep more characters than storage key to reduce over-merging.
    const normalizeForGroupKey = (s) =>
      String(s || '')
        .toLowerCase()
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        // Only treat whitespace + punctuation separators as ignorable.
        // Brackets/parentheses are preserved so users can control them via clean rules.
        .replace(/[\s\.\-_,，:：;；!！?？·•/\\|]+/g, '')
        .trim();

    const buildEmojiCleaner = () => {
      // Prefer Unicode property escapes when supported.
      try {
        // eslint-disable-next-line no-new
        new RegExp('\\p{Extended_Pictographic}', 'u');
        return (s) =>
          String(s || '')
            // Do NOT include `\\p{Emoji}` here: it also matches ASCII digits (keycap emoji),
            // which would break titles like "仙逆4K".
            .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, '')
            .replace(/[\uFE0E\uFE0F]/g, '');
      } catch (_e) {
        // Fallback: remove surrogate-pair emoji + common BMP symbol blocks.
        return (s) =>
          String(s || '')
            .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
            .replace(/[\u2600-\u27BF]/g, '')
            .replace(/[\uFE0E\uFE0F]/g, '');
      }
    };
    const stripEmojiSymbols = buildEmojiCleaner();

    const normalizeDisplayTitle = (s) =>
      String(s || '')
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        // Only normalize whitespace + punctuation separators; preserve brackets/parentheses.
        .replace(/[\s\.\-_,，:：;；!！?？·•/\\|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Built-in episode extraction patterns for search result badges.
    // Keep it simple and stable; controlled by the global toggle only.
    const EPISODE_BADGE_PATTERNS = [
      /(\d{1,5})\s*\/\s*(\d{1,5})/i,
      /(?:更新至|更至|更)\s*(\d{1,5})\s*(?:集|话|回|期)/i,
      /第\s*(\d{1,5})\s*(?:集|话|回|期)/i,
      /(\d{1,5})\s*(?:集|话|回|期)\b/i,
      /\bEP?\s*(\d{1,5})\b/i,
      /\bE\s*(\d{1,5})\b/i,
    ];

    // Used for what we actually show on the card title. Keep original punctuation (like `:` / `：`)
    // and only collapse whitespace + strip zero-width chars.
    const sanitizeDisplayTitle = (s) =>
      String(s || '')
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Pre-clean before applying user regex rules: remove zero-width chars, normalize whitespace,
    // and strip emoji/pictographs to keep user rules stable.
    const preCleanForRules = (s) => stripEmojiSymbols(sanitizeDisplayTitle(s));

	    const stripSeasonMarkers = (s) =>
	      String(s || '')
	        .replace(/第\s*(?:[0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})\s*季/gi, ' ')
	        .replace(/(?:^|\s)([0-9０-９]{1,3})\s*季(?![度节])/gi, ' ')
	        .replace(/\s+/g, ' ')
	        .trim();

    const parseChineseSeasonNo = (raw) => {
      const s = typeof raw === 'string' ? raw.trim() : '';
      if (!s) return 0;
      const digits = s.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
      if (/^\d+$/.test(digits)) {
        const n = Number.parseInt(digits, 10);
        return Number.isFinite(n) && n > 0 ? n : 0;
      }
      const map = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
      if (s === '十') return 10;
      if (s.includes('十')) {
        const [a, b] = s.split('十');
        const tens = a ? (map[a] || 0) : 1;
        const ones = b ? (map[b] || 0) : 0;
        const n = tens * 10 + ones;
        return n > 0 ? n : 0;
      }
      return map[s] || 0;
    };

    const extractSeasonHintFromText = (text) => {
      const s = typeof text === 'string' ? text.trim() : '';
      if (!s) return 0;
      const mSe = s.match(/S(\d{1,2})\s*E\d{1,5}/i);
      if (mSe && mSe[1]) {
        const n = Number.parseInt(String(mSe[1]), 10);
        if (Number.isFinite(n) && n > 0) return n;
      }
      const mCn = s.match(/(?:第\s*)?([0-9０-９]{1,3}|[一二三四五六七八九十两〇零]{1,6})\s*季/i);
      if (mCn && mCn[1]) return parseChineseSeasonNo(String(mCn[1]));
      return 0;
    };

    const parseEpisodeNumber = (text) => {
      const s = typeof text === 'string' ? text : '';
      if (!s) return 0;
      const mE = s.match(/\bE\s*(\d{1,5})\b/i);
      if (mE && mE[1]) return Math.max(0, Number.parseInt(mE[1], 10) || 0);
      const mCn = s.match(/(?:更新至|更至|第)\s*(\d{1,5})\s*(?:集|话|期)/);
      if (mCn && mCn[1]) return Math.max(0, Number.parseInt(mCn[1], 10) || 0);
      // Fallback: pick the first number that is NOT a file-size token like "915MB".
      const re = /(\d{1,5})(?!\s*(?:kb|mb|gb|tb)\b)/gi;
      let m = null;
      while ((m = re.exec(s))) {
        const n = Number.parseInt(String(m[1] || ''), 10);
        if (Number.isFinite(n) && n > 0) return n;
      }
      return 0;
    };

    const extractMaxEpisodeFromSources = (sources) => {
      const list = Array.isArray(sources) ? sources : [];
      if (!list.length) return 0;
      let maxEp = 0;
      list.forEach((src) => {
        const title = src && src.videoTitle != null ? String(src.videoTitle) : '';
        const remark = src && src.videoRemark != null ? String(src.videoRemark) : '';
        const candidates = [remark, title].filter(Boolean);
        candidates.forEach((raw) => {
          const input = preCleanForRules(raw);
          if (!input) return;
          EPISODE_BADGE_PATTERNS.forEach((re) => {
            if (!re) return;
            const m = input.match(re);
            if (!m || !m[1]) return;
            const n = Number.parseInt(String(m[1]), 10);
            if (!Number.isFinite(n) || n <= 0) return;
            if (n > maxEp) maxEp = n;
          });
        });
      });
      return maxEp;
    };

    const normalizeNoSpace = (s) =>
      String(s || '')
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        .replace(/\s+/g, '')
        .trim();

    const normalizeNoSpaceNoColon = (s) => normalizeNoSpace(s).replace(/[:：]/g, '');

    const isColonOnlyVariant = (a, b) => {
      const sa = normalizeNoSpace(a);
      const sb = normalizeNoSpace(b);
      if (!sa || !sb) return false;
      const ba = normalizeNoSpaceNoColon(sa);
      const bb = normalizeNoSpaceNoColon(sb);
      if (!ba || !bb || ba !== bb) return false;
      // Ensure the only difference is presence/absence of ':'/ '：' (after removing whitespace).
      const na = sa.replace(/[:：]/g, '');
      const nb = sb.replace(/[:：]/g, '');
      return na === nb;
    };

    const pickPreferredGroupTitle = (prevTitle, candidateTitle) => {
      const prev = typeof prevTitle === 'string' ? prevTitle.trim() : '';
      const cand = typeof candidateTitle === 'string' ? candidateTitle.trim() : '';
      if (!prev) return cand;
      if (!cand) return prev;

      if (isColonOnlyVariant(prev, cand)) {
        const prevHasColon = /[:：]/.test(prev);
        const candHasColon = /[:：]/.test(cand);
        if (candHasColon && !prevHasColon) return cand;
        if (prevHasColon && !candHasColon) return prev;
        // If both have colon (or neither), fall through to length heuristic.
      }

      if (cand.length > 0 && cand.length < prev.length) return cand;
      return prev;
    };

    const qTrailingDigitsMatch = q.match(/(\d+)\s*$/);
    const qTrailingDigits = qTrailingDigitsMatch ? String(qTrailingDigitsMatch[1] || '') : '';
    const compiledAggregateCleanRules = compileCleanRules(magicSearchCleanRules, { queryTrailingDigits: qTrailingDigits });

    const computeMatchScore = (title) => {
      const name = normalizeForMatch(title);
      if (!qNorm || !name) return 0;
      if (name === qNorm) return 1000;
      if (name.startsWith(qNorm)) return 900;
      const idx = name.indexOf(qNorm);
      if (idx >= 0) {
        const posBoost = 60 - Math.min(60, idx);
        const lenBoost = 40 - Math.min(40, Math.max(0, name.length - qNorm.length));
        return 800 + posBoost + lenBoost;
      }
      const tokens = q
        .toLowerCase()
        .split(/\s+/g)
        .map((t) => t.trim())
        .filter(Boolean);
      if (tokens.length >= 2) {
        let hit = 0;
        tokens.forEach((t) => {
          if (t && name.includes(t)) hit += 1;
        });
        if (hit) return 600 + hit * 20;
      }
      return 0;
    };

    let insertSeq = 0;
    let pinTMDBFirstByExactHit = false;
    const insertCardSorted = (wrapperEl, score) => {
      const kindPriorityOf = (siteKey) => {
        if (!pinTMDBFirstByExactHit) return 0;
        return siteKey === 'tmdb' ? 0 : 1;
      };
      wrapperEl.dataset.score = String(score);
      wrapperEl.dataset.seq = String((insertSeq += 1));
      const wrapperScore = Number(wrapperEl.dataset.score || 0);
      const wrapperTitleLen = Number(wrapperEl.dataset.titleLen || 0);
      const wrapperSeq = Number(wrapperEl.dataset.seq || 0);
      const wrapperSiteKey = wrapperEl && wrapperEl.dataset ? String(wrapperEl.dataset.siteKey || '') : '';
      const wrapperKindPriority = kindPriorityOf(wrapperSiteKey);
      const wrapperSiteOrder = Number(wrapperEl && wrapperEl.dataset ? wrapperEl.dataset.siteOrder : 0);
      const wrapperTmdbRank = Number(wrapperEl && wrapperEl.dataset ? wrapperEl.dataset.tmdbRank : 0);
      const children = Array.from(grid.children || []);
      for (let i = 0; i < children.length; i += 1) {
        const el = children[i];
        const elScore = Number(el && el.dataset ? el.dataset.score : 0);
        const elTitleLen = Number(el && el.dataset ? el.dataset.titleLen : 0);
        const elSeq = Number(el && el.dataset ? el.dataset.seq : 0);
        const elSiteKey = el && el.dataset ? String(el.dataset.siteKey || '') : '';
        const elKindPriority = kindPriorityOf(elSiteKey);
        const elSiteOrder = Number(el && el.dataset ? el.dataset.siteOrder : 0);
        const elTmdbRank = Number(el && el.dataset ? el.dataset.tmdbRank : 0);

	        if (elKindPriority > wrapperKindPriority) {
	          grid.insertBefore(wrapperEl, el);
	          return;
	        }
        if (elKindPriority < wrapperKindPriority) continue;

        if (Number.isFinite(elScore) && elScore < wrapperScore) {
          grid.insertBefore(wrapperEl, el);
          return;
        }
        if (Number.isFinite(elScore) && elScore === wrapperScore) {
          if (Number.isFinite(elTmdbRank) && Number.isFinite(wrapperTmdbRank) && elTmdbRank > 0 && wrapperTmdbRank > 0 && elTmdbRank !== wrapperTmdbRank) {
            if (elTmdbRank > wrapperTmdbRank) {
              grid.insertBefore(wrapperEl, el);
              return;
            }
            continue;
          }
          if (Number.isFinite(elSiteOrder) && Number.isFinite(wrapperSiteOrder) && elSiteOrder !== wrapperSiteOrder) {
            if (elSiteOrder > wrapperSiteOrder) {
              grid.insertBefore(wrapperEl, el);
              return;
            }
            continue;
          }
          if (Number.isFinite(elTitleLen) && Number.isFinite(wrapperTitleLen) && elTitleLen > wrapperTitleLen) {
            grid.insertBefore(wrapperEl, el);
            return;
          }
          if (
            Number.isFinite(elTitleLen) &&
            Number.isFinite(wrapperTitleLen) &&
            elTitleLen === wrapperTitleLen &&
            Number.isFinite(elSeq) &&
            elSeq > wrapperSeq
          ) {
            grid.insertBefore(wrapperEl, el);
            return;
          }
        }
      }
      grid.appendChild(wrapperEl);
		    };

		    const seenKeys = new Set();
		    const tmdbByGroupKeyByType = new Map();

        const hydrateTMDBDetailsForItems = (items) => {
          const list = Array.isArray(items) ? items : [];
          const applyTMDBRemarkBadge = (wrapperEl, remarkText) => {
            if (!wrapperEl) return;
            const txt = typeof remarkText === 'string' ? remarkText.trim() : '';
            const posterWrap = wrapperEl.querySelector && wrapperEl.querySelector('.douban-poster');
            if (!posterWrap) return;
            let tag = wrapperEl.querySelector && wrapperEl.querySelector('.tv-card-badge');
            if (!tag && txt) {
              tag = document.createElement('div');
              tag.className = 'tv-card-badge';
              posterWrap.appendChild(tag);
            }
            if (!tag) return;
            tag.textContent = txt;
            const hasCount = !!(wrapperEl.querySelector && wrapperEl.querySelector('.tv-aggregate-source-count'));
            tag.classList.toggle('tv-card-badge--left', hasCount);
          };
          const tasks = list
            .map((it) => {
              const type = normalizeTmdbMediaType(it && typeof it.type === 'string' ? it.type : '');
              const id = it && Number.isFinite(Number(it.id)) ? Math.floor(Number(it.id)) : 0;
              const groupKey = it && typeof it.__groupKey === 'string' ? it.__groupKey : '';
              if (!type || type !== 'tv' || id <= 0) return null;
              const cached = readTMDBDetailCache(type, id);
              const hasBadge = it && typeof it.badge === 'string' && it.badge.trim();
              const hasSeasonCount = it && Number.isFinite(Number(it.seasonCount)) && Math.floor(Number(it.seasonCount)) > 0;
              if (cached && cached.badge && !hasBadge) return { type, id, groupKey, cached };
              if (hasBadge && hasSeasonCount) return null;
              return { type, id, groupKey, cached: null };
            })
            .filter(Boolean);
          if (!tasks.length) return;

          const concurrency = 4;
          let cursor = 0;

          const runOne = async () => {
            while (cursor < tasks.length) {
              const idx = cursor;
              cursor += 1;
              const task = tasks[idx];
              if (!task) continue;
              if (runId !== currentRunId) return;

	              const apply = (data) => {
	                if (!data || data.success !== true) return;
	                const title = typeof data.title === 'string' ? data.title.trim() : '';
	                const badgeText = typeof data.badge === 'string' ? data.badge.trim() : '';
	                const status = data && typeof data.status === 'string' ? data.status.trim() : '';
	                const seasonCount = Number.isFinite(Number(data.seasonCount)) ? Math.floor(Number(data.seasonCount)) : 0;
	                const episodeCount = Number.isFinite(Number(data.episodeCount)) ? Math.floor(Number(data.episodeCount)) : 0;
	                const latestSeason = Number.isFinite(Number(data.latestSeason)) ? Math.floor(Number(data.latestSeason)) : 0;
	                const latestEpisode = Number.isFinite(Number(data.latestEpisode)) ? Math.floor(Number(data.latestEpisode)) : 0;
	                if (!badgeText && seasonCount <= 0 && episodeCount <= 0) return;

                writeTMDBDetailCache(task.type, task.id, data);

                if (task.groupKey) {
                  const typed = tmdbByGroupKeyByType.get(task.groupKey) || null;
                  const prev = typed && typed[task.type] ? typed[task.type] : null;
	                  if (prev && Number(prev.id) === Number(task.id)) {
	                    const nextItem = {
	                      ...prev,
	                      badge: badgeText || (typeof prev.badge === 'string' ? prev.badge : ''),
	                      status: status || (typeof prev.status === 'string' ? prev.status : ''),
	                      seasonCount: seasonCount > 0 ? seasonCount : (Number(prev.seasonCount) || 0),
	                      episodeCount: episodeCount > 0 ? episodeCount : (Number(prev.episodeCount) || 0),
	                      latestSeason: latestSeason > 0 ? latestSeason : (Number(prev.latestSeason) || 0),
	                      latestEpisode: latestEpisode > 0 ? latestEpisode : (Number(prev.latestEpisode) || 0),
	                    };
	                    tmdbByGroupKeyByType.set(task.groupKey, { ...typed, [task.type]: nextItem });
	                  }
	                }

                let wrapper = null;
                try {
                  const children = Array.from(grid.children || []);
                  for (let i = 0; i < children.length; i += 1) {
                    const el = children[i];
                    if (!el || !el.dataset) continue;
                    if ((el.dataset.siteKey || '') !== 'tmdb') continue;
                    if (String(el.dataset.videoId || '') !== String(task.id)) continue;
                    wrapper = el;
                    break;
                  }
                } catch (_e) {}
                if (!wrapper) return;
                if (wrapper.dataset && normalizeTmdbMediaType(wrapper.dataset.tmdbType || '') === 'tv') {
                  const remark = formatTMDBTVRemark({ badge: badgeText, status, seasonCount, episodeCount, title });
                  applyTMDBRemarkBadge(wrapper, remark);
                }
                if (wrapper.dataset && wrapper.dataset.aggregate === '1') {
                  if (typeof refreshAggregatesForCurrentRun === 'function') refreshAggregatesForCurrentRun();
                }
              };

	              if (task.cached && task.cached.badge) {
	                apply({
	                  success: true,
	                  badge: task.cached.badge,
	                  status: task.cached.status || '',
	                  seasonCount: task.cached.seasonCount,
	                  episodeCount: task.cached.episodeCount,
	                  latestSeason: task.cached.latestSeason,
	                  latestEpisode: task.cached.latestEpisode,
	                });
	                continue;
	              }

              try {
                const data = await requestJson(`/api/tmdb/detail?type=${encodeURIComponent(task.type)}&id=${encodeURIComponent(String(task.id))}`, {
                  method: 'GET',
                  credentials: 'same-origin',
                });
                if (runId !== currentRunId) return;
                apply(data);
              } catch (_e) {
                // ignore per-item detail errors; base search results still render
              }
            }
          };

          for (let i = 0; i < Math.min(concurrency, tasks.length); i += 1) {
            runOne();
          }
        };

	    const hasTMDBTVForGroupKey = (groupKey) => {
	      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
	      if (!gk) return false;
	      const typed = tmdbByGroupKeyByType.get(gk) || null;
	      return Boolean(typed && typed.tv);
	    };

	    const getTMDBTVLatestForGroupKey = (groupKey) => {
	      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
	      if (!gk) return { season: 0, episode: 0 };
	      const typed = tmdbByGroupKeyByType.get(gk) || null;
	      const tv = typed && typed.tv ? typed.tv : null;
	      if (!tv) return { season: 0, episode: 0 };
	      const latestSeason = Number.isFinite(Number(tv.latestSeason)) ? Math.floor(Number(tv.latestSeason)) : 0;
	      const latestEpisode = Number.isFinite(Number(tv.latestEpisode)) ? Math.floor(Number(tv.latestEpisode)) : 0;
	      if (latestSeason > 0 && latestEpisode > 0) return { season: latestSeason, episode: latestEpisode };
	      const badge = tv && typeof tv.badge === 'string' ? tv.badge : '';
	      const m = badge.match(/\bS\s*(\d{1,2})\s*E\s*(\d{1,5})\b/i);
	      if (m && m[1] && m[2]) {
	        const sNo = Number.parseInt(String(m[1]), 10);
	        const eNo = Number.parseInt(String(m[2]), 10);
	        return {
	          season: Number.isFinite(sNo) && sNo > 0 ? sNo : 0,
	          episode: Number.isFinite(eNo) && eNo > 0 ? eNo : 0,
	        };
	      }
	      return { season: 0, episode: 0 };
	    };

	    const getTMDBTVEndedStatsForGroupKey = (groupKey) => {
	      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
	      if (!gk) return { ended: false, seasonCount: 0, episodeCount: 0 };
	      const typed = tmdbByGroupKeyByType.get(gk) || null;
	      const tv = typed && typed.tv ? typed.tv : null;
	      if (!tv) return { ended: false, seasonCount: 0, episodeCount: 0 };
	      const status = tv && typeof tv.status === 'string' ? tv.status.trim().toLowerCase() : '';
	      const ended = status === 'ended';
	      const seasonCount = tv && Number.isFinite(Number(tv.seasonCount)) ? Math.floor(Number(tv.seasonCount)) : 0;
	      const episodeCount = tv && Number.isFinite(Number(tv.episodeCount)) ? Math.floor(Number(tv.episodeCount)) : 0;
	      return { ended, seasonCount: seasonCount > 0 ? seasonCount : 0, episodeCount: episodeCount > 0 ? episodeCount : 0 };
	    };

	    const getTMDBTVSeasonCountForGroupKey = (groupKey) => {
	      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
	      if (!gk) return 0;
	      const typed = tmdbByGroupKeyByType.get(gk) || null;
	      const tv = typed && typed.tv ? typed.tv : null;
	      const n = tv && Number.isFinite(Number(tv.seasonCount)) ? Math.floor(Number(tv.seasonCount)) : 0;
	      return n > 0 ? n : 0;
	    };

	    const pickBetterTMDBItem = (prev, out) => {
	      if (!prev) return out;
	      const ps = Number(prev.__score || 0);
	      const ns = Number(out.__score || 0);
	      if (ns > ps) return out;
	      if (ns < ps) return prev;
	      const pr = Number.isFinite(Number(prev.__tmdbRank)) ? Number(prev.__tmdbRank) : 0;
	      const nr = Number.isFinite(Number(out.__tmdbRank)) ? Number(out.__tmdbRank) : 0;
	      if (pr > 0 && nr > 0 && nr !== pr) return nr < pr ? out : prev;
	      const pl = Number(prev.__titleLen || 0);
	      const nl = Number(out.__titleLen || 0);
	      if (nl > 0 && (pl <= 0 || nl < pl)) return out;
	      return prev;
	    };

	    const pickTMDBCoverForGroup = (groupKey) => {
	      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
	      if (!gk) return null;
	      const typed = tmdbByGroupKeyByType.get(gk) || null;
	      if (!typed) return null;
	      return typed.tv || typed.movie || null;
	    };

	    const runTMDBSearch = async () => {
	        if (searchDisplayMode !== 'tmdb' && searchDisplayMode !== 'both') return 0;
	        try {
        const data = await requestJson(`/api/tmdb/search?q=${encodeURIComponent(q)}`, {
          method: 'GET',
          credentials: 'same-origin',
        });
        const rawItems = data && Array.isArray(data.list) ? data.list : [];
        const tmdbSeenTitleType = new Set();
        const items = rawItems
          .map((it, idx) => {
            const name = it && it.title ? String(it.title) : '';
            const originalTitle = sanitizeDisplayTitle(name) || name;
            // TMDB titles should NOT be aggressively "cleaned" for aggregation; otherwise distinct titles
            // like "xx 0 剧场版" may be merged into "xx 剧场版".
            const groupKey = normalizeForGroupKey(originalTitle) || normalizeForGroupKey(name);
            const score = computeMatchScore(originalTitle || name);
            const titleLen = String(originalTitle || name).replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').length;
            const typeKey = normalizeTmdbMediaType(it && typeof it.type === 'string' ? it.type : '');
            const id = it && Number.isFinite(Number(it.id)) ? Math.floor(Number(it.id)) : 0;
	            const cached = typeKey && id > 0 ? readTMDBDetailCache(typeKey, id) : null;
	            const cachedBadge = cached && typeof cached.badge === 'string' ? cached.badge.trim() : '';
	            const cachedStatus = cached && typeof cached.status === 'string' ? cached.status.trim() : '';
	            const cachedSeasonCount = cached && Number.isFinite(Number(cached.seasonCount)) ? Math.floor(Number(cached.seasonCount)) : 0;
	            const cachedEpisodeCount = cached && Number.isFinite(Number(cached.episodeCount)) ? Math.floor(Number(cached.episodeCount)) : 0;
	            const cachedLatestSeason = cached && Number.isFinite(Number(cached.latestSeason)) ? Math.floor(Number(cached.latestSeason)) : 0;
	            const cachedLatestEpisode = cached && Number.isFinite(Number(cached.latestEpisode)) ? Math.floor(Number(cached.latestEpisode)) : 0;
	            const seasonCount = it && Number.isFinite(Number(it.seasonCount))
	              ? Math.floor(Number(it.seasonCount))
	              : cachedSeasonCount > 0
	                ? cachedSeasonCount
	                : 0;
	            const episodeCount = it && Number.isFinite(Number(it.episodeCount))
	              ? Math.floor(Number(it.episodeCount))
	              : cachedEpisodeCount > 0
	                ? cachedEpisodeCount
	                : 0;
		            const out = {
		              ...it,
	                badge: (it && typeof it.badge === 'string' && it.badge.trim()) ? it.badge : (cachedBadge || ''),
	                status: (it && typeof it.status === 'string' && it.status.trim()) ? it.status : (cachedStatus || ''),
	                episodeCount: episodeCount > 0 ? episodeCount : 0,
	                latestSeason: cachedLatestSeason > 0 ? cachedLatestSeason : 0,
	                latestEpisode: cachedLatestEpisode > 0 ? cachedLatestEpisode : 0,
		              __groupKey: groupKey || '',
		              __displayTitle: originalTitle || name,
		              __score: score,
		              __tmdbRank: Math.max(1, Math.floor(Number(idx) + 1)),
	              __titleLen: titleLen,
	              seasonCount: seasonCount > 0 ? seasonCount : 0,
	            };
	            if (groupKey) {
	              const key = normalizeTmdbMediaType(out && typeof out.type === 'string' ? out.type : '');
	              if (key) {
	                const prev = tmdbByGroupKeyByType.get(groupKey) || {};
	                const next = { ...prev };
	                next[key] = pickBetterTMDBItem(prev[key] || null, out);
	                tmdbByGroupKeyByType.set(groupKey, next);
	              }
	            }
	            return out;
	          })
	          .filter(Boolean)
	          .filter((out) => {
	            // TMDB sometimes returns duplicates for the same title + media type.
	            // Keep the first occurrence (lower rank) to avoid duplicate TMDB cards.
	            const typeKey = normalizeTmdbMediaType(out && typeof out.type === 'string' ? out.type : '');
	            const titleKey = normalizeForGroupKey(out && typeof out.__displayTitle === 'string' ? out.__displayTitle : '');
	            if (!typeKey || !titleKey) return true;
	            const k = `${typeKey}::${titleKey}`;
	            if (tmdbSeenTitleType.has(k)) return false;
	            tmdbSeenTitleType.add(k);
	            return true;
	          });
        pinTMDBFirstByExactHit = items.some((it) => Number(it && it.__score) >= 1000);
        dbg('tmdb_map', { size: tmdbByGroupKeyByType.size, items: items.length, tmdbPinned: pinTMDBFirstByExactHit ? 1 : 0 });
        if (!items.length) return 0;
        const appended = appendTMDBItemsToGrid({
          gridEl: grid,
          items,
          siteName: 'TMDB',
          seenKeys,
          insertCardSorted,
          computeMatchScore,
        });
        hydrateTMDBDetailsForItems(items);
        updateProgressAndCount(0, 0);
        return appended;
      } catch (err) {
        const msg = (err && err.message) || '服务器连接 TMDB 失败';
        setStatus(msg, true);
        dbg('tmdb_error', { message: msg });
        return -1;
      }
    };

    const tmdbCount = await runTMDBSearch();
    if (runId !== currentRunId) return;
    if (tmdbCount >= 0 && grid.children.length) setStatus('');

    const isConfigCenter = (s) => {
      const api = s && typeof s.api === 'string' ? s.api : '';
      const key = s && typeof s.key === 'string' ? s.key : '';
      return api.includes('/spider/baseset/') || key.toLowerCase().includes('baseset');
    };
    const sites = (await loadSites()).filter((s) => {
      if (!s || s.enabled === false || s.search === false || !s.api || isConfigCenter(s)) return false;
      return true;
    });
    if (runId !== currentRunId) return;
    if (!sites.length) {
      setStatus(grid.children.length ? '' : '暂无可用站点');
      publishSearchAggregateState({
        runId,
        keyword: q,
        done: 0,
        total: 0,
        failed: 0,
        running: false,
        updatedAt: Date.now(),
        groups: {},
      });
      return;
    }

    let done = 0;
    let failed = 0;
    let totalFound = 0;

	    const aggregateByGroup = new Map();
	    const aggregateCardByGroup = new Map();
    const buildSearchAggregateBridgeGroups = () => {
      const groups = {};
      aggregateByGroup.forEach((group, groupKey) => {
        const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
        const nk = normalizeAggStorageKey(gk);
        const key = nk || gk;
        if (!key) return;
        const bySite = group && group.bySite instanceof Map ? group.bySite : new Map();
        const sources = [];
        bySite.forEach((entry) => {
          const matches = entry && entry.matches instanceof Map ? entry.matches : new Map();
          matches.forEach((m) => {
            const siteKey = m && m.siteKey ? String(m.siteKey).trim() : '';
            const spiderApi = m && m.spiderApi ? String(m.spiderApi).trim() : '';
            const videoId = m && m.videoId ? String(m.videoId).trim() : '';
            if (!siteKey || !spiderApi || !videoId) return;
            sources.push({
              siteKey,
              spiderApi,
              siteName: m && m.siteName ? String(m.siteName) : siteKey,
              videoId,
              videoTitle: m && m.videoTitle ? String(m.videoTitle) : '',
              videoPoster: m && m.videoPoster ? String(m.videoPoster) : '',
              videoRemark: m && m.videoRemark ? String(m.videoRemark) : '',
            });
          });
        });
        groups[key] = {
          groupKey: gk,
          contentKey: key,
          title: group && group.title ? String(group.title) : '',
          siteCount: computeAggregateSourceSiteCount(bySite),
          updatedAt: Date.now(),
          sources,
        };
      });
      return groups;
    };
    const publishSearchAggregateBridgeState = ({ running }) => {
      if (runId !== currentRunId) return;
      publishSearchAggregateState({
        runId,
        keyword: q,
        done,
        total: sites.length,
        failed,
        running: !!running,
        updatedAt: Date.now(),
        groups: buildSearchAggregateBridgeGroups(),
      });
    };

	    const parseSeasonedProgress = (rawText) => {
	      const raw = typeof rawText === 'string' ? rawText : '';
	      const text = raw.trim();
	      if (!text) return null;
	      const cleaned = preCleanForRules(text) || text;

	      const mCn = cleaned.match(/第\s*(\d{1,3})\s*季\s*第\s*(\d{1,5})\s*(?:集|话|回|期)/i);
	      if (mCn && mCn[1] && mCn[2]) {
	        const season = Number.parseInt(String(mCn[1]), 10) || 0;
	        const episode = Number.parseInt(String(mCn[2]), 10) || 0;
	        if (season > 0 && episode > 0) return { season, episode };
	      }

	      const mSe = cleaned.match(/\bS\s*(\d{1,3})\s*E\s*(\d{1,5})\b/i);
	      if (mSe && mSe[1] && mSe[2]) {
	        const season = Number.parseInt(String(mSe[1]), 10) || 0;
	        const episode = Number.parseInt(String(mSe[2]), 10) || 0;
	        if (season > 0 && episode > 0) return { season, episode };
	      }

	      return null;
	    };

	    const hasAnySeasonMarker = (rawText) => {
	      const raw = typeof rawText === 'string' ? rawText : '';
	      const text = raw.trim();
	      if (!text) return false;
	      const cleaned = preCleanForRules(text) || text;
	      return /(?:第\s*\d{1,3}\s*季|\bS\s*\d{1,3}\b|\bSeason\s*\d{1,3}\b)/i.test(cleaned);
	    };

	    const parseUnseasonedUpdateEpisode = (rawText) => {
	      const raw = typeof rawText === 'string' ? rawText : '';
	      const text = raw.trim();
	      if (!text) return 0;
	      const cleaned = preCleanForRules(text) || text;

	      const mUp = cleaned.match(/(?:更新至|更至|更)\s*(\d{1,5})\s*(?:集|话|回|期)/i);
	      if (mUp && mUp[1]) {
	        const ep = Number.parseInt(String(mUp[1]), 10) || 0;
	        if (ep > 0 && ep <= 2000) return ep;
	      }

	      const mRange = cleaned.match(/(\d{1,5})\s*\/\s*(\d{1,5})/i);
	      if (mRange && mRange[1] && mRange[2]) {
	        const left = Number.parseInt(String(mRange[1]), 10) || 0;
	        const right = Number.parseInt(String(mRange[2]), 10) || 0;
	        if (left > 0 && right > 0 && right >= left && left <= 2000 && right <= 2000) return left;
	      }

	      return 0;
	    };

	    const compareSeasonEpisode = (a, b) => {
	      if (!a && !b) return 0;
	      if (a && !b) return 1;
	      if (!a && b) return -1;
	      const as = Number(a.season || 0);
	      const bs = Number(b.season || 0);
	      if (as !== bs) return as > bs ? 1 : -1;
	      const ae = Number(a.episode || 0);
	      const be = Number(b.episode || 0);
	      if (ae !== be) return ae > be ? 1 : -1;
	      return 0;
	    };

		    const formatAggregateTVRemark = ({ groupKey, groupTitle, sources } = {}) => {
		      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
		      const title = typeof groupTitle === 'string' ? groupTitle.trim() : '';

		      const hasTMDB = gk && hasTMDBTVForGroupKey(gk);
		      const tmdbSeasonCount = hasTMDB ? getTMDBTVSeasonCountForGroupKey(gk) : 0;
		      const tmdbEnded = hasTMDB ? getTMDBTVEndedStatsForGroupKey(gk) : { ended: false, seasonCount: 0, episodeCount: 0 };
		      const tmdbLatest = hasTMDB ? getTMDBTVLatestForGroupKey(gk) : { season: 0, episode: 0 };

		      if (tmdbEnded && tmdbEnded.ended) {
		        const seasonCount = tmdbEnded.seasonCount;
		        const totalEpisode = tmdbEnded.episodeCount;
		        if (seasonCount >= 2 && totalEpisode > 0) return `共${seasonCount}季${totalEpisode}集`;
		        if (totalEpisode > 0) return `共${totalEpisode}集`;
		        return '已完结';
		      }

		      // Search page does not fetch Douban; when TMDB exists, treat it as the ground truth baseline.
		      const tmdbBaseRemark = (() => {
		        if (!hasTMDB) return '';
		        const typed = tmdbByGroupKeyByType.get(gk) || null;
		        const tv = typed && typed.tv ? typed.tv : null;
		        if (!tv) return '';
		        const badge = typeof tv.badge === 'string' ? tv.badge : '';
		        const status = typeof tv.status === 'string' ? tv.status : '';
		        const sc = Number.isFinite(Number(tv.seasonCount)) ? Math.floor(Number(tv.seasonCount)) : 0;
		        const ec = Number.isFinite(Number(tv.episodeCount)) ? Math.floor(Number(tv.episodeCount)) : 0;
		        const t = typeof tv.__displayTitle === 'string' && tv.__displayTitle.trim() ? tv.__displayTitle : (typeof tv.title === 'string' ? tv.title : title);
		        return formatTMDBTVRemark({ badge, status, seasonCount: sc, episodeCount: ec, title: t }) || '';
		      })();

		      const list = Array.isArray(sources) ? sources : [];
		      const isMulti = hasTMDB ? (tmdbSeasonCount >= 2 || (tmdbLatest && tmdbLatest.season >= 2)) : false;

		      if (!isMulti) {
		        // Single-season + not ended: only accept unseasoned "update to xx" from sources,
		        // and ignore any season-marked items/titles.
		        let bestEp = 0;
		        list.forEach((src) => {
		          const t = src && src.videoTitle != null ? String(src.videoTitle) : '';
		          const r = src && src.videoRemark != null ? String(src.videoRemark) : '';
		          const joined = `${r} ${t}`.trim();
		          if (!joined) return;
		          if (hasAnySeasonMarker(joined)) return;
		          const ep = parseUnseasonedUpdateEpisode(joined);
		          if (ep > bestEp) bestEp = ep;
		        });
		        const baseSeason = tmdbLatest && tmdbLatest.season > 0 ? tmdbLatest.season : 1;
		        const baseEp = tmdbLatest && tmdbLatest.episode > 0 ? tmdbLatest.episode : 0;
		        if (bestEp > baseEp) return `更新至第${bestEp}集`;
		        return tmdbBaseRemark || '';
		      }

		      // Multi-season + not ended: only accept explicit season-marked progress from sources.
		      let best = null;
		      list.forEach((src) => {
		        const t = src && src.videoTitle != null ? String(src.videoTitle) : '';
		        const r = src && src.videoRemark != null ? String(src.videoRemark) : '';
		        const joined = `${r} ${t}`.trim();
		        if (!joined) return;
		        const p = parseSeasonedProgress(joined);
		        if (!p) return;
		        if (tmdbSeasonCount >= 2 && p.season > tmdbSeasonCount) return;
		        if (!best || compareSeasonEpisode(p, best) > 0) best = p;
		      });
		      const base = { season: Number(tmdbLatest.season || 0), episode: Number(tmdbLatest.episode || 0) };
		      if (best && compareSeasonEpisode(best, base) > 0) return `更新至第${best.season}季第${best.episode}集`;
		      return tmdbBaseRemark || '';
		    };

    const removeExistingGroupCards = (groupKey) => {
      if (!groupKey) return 0;
      const children = Array.from(grid.children || []);
      children.forEach((el) => {
        if (!el || !el.dataset) return;
        const tag = (el.dataset.titleAggKey || '').trim();
        if (!tag || tag !== groupKey) return;
        if (el.dataset.aggregate === '1') return;
        // Keep raw cards in DOM for "原始列表" toggle; visibility is controlled by applyRawListModeToGrid().
      });
      return 0;
    };

    const pickAggregateCover = (bySite) => {
      const pickFirstByKey = (k) => {
        const entry = bySite.get(k);
        if (!entry || !entry.matches) return null;
        const first = Array.from(entry.matches.values())[0];
        return first || null;
      };
      if (searchCoverSiteKey) {
        const preferred = pickFirstByKey(searchCoverSiteKey);
        if (preferred) return preferred;
      }
      for (const k of siteOrderList) {
        const candidate = pickFirstByKey(k);
        if (candidate) return candidate;
      }
      for (const entry of bySite.values()) {
        if (!entry || !entry.matches) continue;
        const any = Array.from(entry.matches.values())[0];
        if (any) return any;
      }
      return null;
    };

    const computeAggregateSourceSiteCount = (bySite) => {
      let n = 0;
      for (const entry of bySite.values()) {
        if (!entry || !entry.matches || entry.matches.size < 1) continue;
        n += 1;
      }
      return n;
    };

    const formatSourceCountText = (count) => {
      const n = Number.isFinite(Number(count)) ? Number(count) : 0;
      if (n > 99) return '99+';
      return String(Math.max(0, Math.floor(n)));
    };

    const applyAggregateSourceBadge = (el, count) => {
      if (!el) return;
      // Aggregation count badge is intentionally hidden (no longer useful in the UI).
      try {
        const existing = el.querySelector && el.querySelector('.tv-aggregate-source-count');
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      } catch (_e) {}
    };

    const applyAggregateRemarkBadge = (el, remarkText) => {
      if (!el) return;
      const txt = typeof remarkText === 'string' ? remarkText.trim() : '';
      const posterWrap = el.querySelector && el.querySelector('.douban-poster');
      if (!posterWrap) return;
      let tag = el.querySelector && el.querySelector('.tv-card-badge');
      if (!tag && txt) {
        tag = document.createElement('div');
        tag.className = 'tv-card-badge';
        posterWrap.appendChild(tag);
      }
      if (!tag) return;
      if (txt) tag.textContent = txt;
      else tag.textContent = '';
      const hasCount = !!(el.querySelector && el.querySelector('.tv-aggregate-source-count'));
      tag.classList.toggle('tv-card-badge--left', hasCount);
    };

    const syncAggregateStorage = (storageKey, sources) => {
      const key = typeof storageKey === 'string' ? storageKey.trim() : '';
      if (!key) return;
      try {
        const prevRaw = sessionStorage.getItem(AGG_STORAGE_KEY) || '';
        const prev = prevRaw && prevRaw.trim() ? JSON.parse(prevRaw) : null;
        const groups =
          prev && prev.version === 4 && prev.groups && typeof prev.groups === 'object'
            ? { ...prev.groups }
            : {};
        groups[key] = { sources, updatedAt: Date.now(), q };
        sessionStorage.setItem(AGG_STORAGE_KEY, JSON.stringify({ version: 4, q, groups, lastKey: key }));
      } catch (_e) {}
    };

	      const ensureStreamingAggregateCardForGroup = (groupKey) => {
      const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
      if (!gk) return;
      const group = aggregateByGroup.get(gk);
      if (!group || !group.bySite) return;

      const bySite = group.bySite;
      const sourceSiteCount = computeAggregateSourceSiteCount(bySite);
      if (sourceSiteCount < 2) return;

      const sources = Array.from(bySite.values()).flatMap((entry) => {
        if (!entry || !entry.matches) return [];
        return Array.from(entry.matches.values());
      });
      const cover = pickAggregateCover(bySite);
      if (!cover || !cover.siteKey || !cover.videoId) return;
      if (sources.length < 1) return;

      const removed = removeExistingGroupCards(gk);
      if (removed) totalFound = Math.max(0, totalFound - removed);

	      const tmdbCover = !rawListMode && searchDisplayMode === 'both' ? pickTMDBCoverForGroup(gk) : null;
	      const title =
	        tmdbCover && tmdbCover.__displayTitle
	          ? String(tmdbCover.__displayTitle)
	          : group && group.title
	            ? String(group.title)
            : '';
      const poster = tmdbCover && tmdbCover.poster ? String(tmdbCover.poster) : cover.videoPoster || '';
      const tmdbCoverType = normalizeTmdbMediaType(tmdbCover && tmdbCover.type);
      const tmdbCoverTypeLabel = tmdbCoverType === 'tv' ? '剧集' : tmdbCoverType === 'movie' ? '电影' : '';
      const inferAggregateTypeLabel = (t) => {
        const s = typeof t === 'string' ? t.trim() : '';
        if (!s) return '剧集';
        if (/剧场版|總集篇|总集篇|电影版|劇場版/i.test(s)) return '电影';
        return '剧集';
      };
      const aggregateTypeLabel = tmdbCoverTypeLabel || inferAggregateTypeLabel(title || cover.videoTitle || '');
      let remark = '';
      if (tmdbCoverType === 'movie') {
        const y = tmdbCover && tmdbCover.year != null ? Number(tmdbCover.year) : 0;
        remark = Number.isFinite(y) && y > 0 ? String(Math.floor(y)) : '';
      } else {
	        const aggRemark = formatAggregateTVRemark({ groupKey: gk, groupTitle: title || cover.videoTitle || '', sources });
        remark = aggRemark || '';
      }
      const storageKey = normalizeAggStorageKey(gk) || normalizeAggStorageKey(title);
      if (!storageKey) return;

      const removeNonTmdbAggregateCardsForGroup = () => {
        try {
          Array.from(grid.children || []).forEach((el) => {
            if (!el || !el.dataset) return;
            if (el.dataset.aggregate !== '1') return;
            if ((el.dataset.titleAggKey || '') !== gk) return;
            if ((el.dataset.siteKey || '') === 'tmdb') return;
            try {
              el.remove();
            } catch (_e) {}
          });
        } catch (_e) {}
      };

      const findTmdbCardForGroup = () => {
        try {
          const wantType = tmdbCoverType || '';
          let first = null;
          let typed = null;
          Array.from(grid.children || []).forEach((el) => {
            if (!el || !el.dataset) return;
            if ((el.dataset.siteKey || '') !== 'tmdb') return;
            if ((el.dataset.titleAggKey || '') !== gk) return;
            if (!first) first = el;
            const t = normalizeTmdbMediaType(el.dataset.tmdbType || '');
            if (wantType && t && t === wantType) typed = el;
          });
          return typed || first || null;
        } catch (_e) {
          return null;
        }
      };

      // If a TMDB card exists for this group, aggregate sources directly into that TMDB card
      // instead of creating a separate aggregate card (prevents duplicates in "both" mode).
      if (tmdbCover && !rawListMode && searchDisplayMode === 'both') {
        const tmdbEl = findTmdbCardForGroup();
        if (tmdbEl) {
          removeNonTmdbAggregateCardsForGroup();
          tmdbEl.dataset.aggregate = '1';
          applyAggregateSourceBadge(tmdbEl, sourceSiteCount);
          // Never clear TMDB's own remark badge; only apply when aggregate remark is non-empty.
          if (remark) applyAggregateRemarkBadge(tmdbEl, remark);
          syncAggregateStorage(storageKey, sources);
          aggregateCardByGroup.set(gk, {
            el: tmdbEl,
            uniq: `tmdb::${String(tmdbEl.dataset.videoId || '')}`,
            sourceSiteCount,
            storageKey,
          });
          applyRawListModeToGrid();
          updateProgressAndCount(done, sites.length);
          return;
        }
      }

      const uniq = `${cover.siteKey}::${String(cover.videoId)}`;
      const cached = aggregateCardByGroup.get(gk) || null;
      if (cached && cached.el && cached.uniq && cached.uniq !== uniq) {
        try {
          cached.el.remove();
          totalFound = Math.max(0, totalFound - 1);
        } catch (_e) {}
        aggregateCardByGroup.delete(gk);
      }

      seenKeys.delete(uniq);

      syncAggregateStorage(storageKey, sources);

      const existing = aggregateCardByGroup.get(gk) || null;
      if (existing && existing.el) {
        if (sourceSiteCount !== existing.sourceSiteCount) {
          existing.sourceSiteCount = sourceSiteCount;
          applyAggregateSourceBadge(existing.el, sourceSiteCount);
          // Keep TMDB remark when aggregate remark is empty.
          if (remark || (existing.el && (existing.el.dataset.siteKey || '') !== 'tmdb')) {
            applyAggregateRemarkBadge(existing.el, remark || '');
          }
          aggregateCardByGroup.set(gk, existing);
        }
        return;
      }

      appendItemsToGrid({
        gridEl: grid,
        items: [
          {
            id: cover.videoId,
            name: title || cover.videoTitle || '',
            pic: poster || '',
            remark: remark || '',
            __groupKey: gk,
            __tmdbRank: tmdbCover && tmdbCover.__tmdbRank != null ? tmdbCover.__tmdbRank : 0,
            tmdbId: tmdbCover && tmdbCover.id != null ? tmdbCover.id : 0,
            mediaType: tmdbCover && typeof tmdbCover.type === 'string' ? tmdbCover.type : '',
            year: tmdbCover && tmdbCover.year != null ? tmdbCover.year : 0,
          },
        ],
        siteKey: cover.siteKey,
        siteApi: cover.spiderApi,
        siteName: aggregateTypeLabel,
        cornerBadgeText: formatSourceCountText(sourceSiteCount),
        cornerBadgeTitle: `${sourceSiteCount}个源`,
        seenKeys,
        insertCardSorted,
        computeMatchScore,
        scoreOverride:
          computeMatchScore(title || cover.videoTitle || ''),
        isAggregate: true,
      });

      const after = Array.from(grid.children || []).find(
        (el) =>
          el &&
          el.dataset &&
          el.dataset.aggregate === '1' &&
          (el.dataset.titleAggKey || '') === gk &&
          el.dataset.siteKey === cover.siteKey &&
          el.dataset.videoId === String(cover.videoId)
      );
      if (after) {
        totalFound += 1;
        applyAggregateSourceBadge(after, sourceSiteCount);
        aggregateCardByGroup.set(gk, { el: after, uniq, sourceSiteCount, storageKey });
        applyRawListModeToGrid();
        updateProgressAndCount(done, sites.length);
      }
    };

    const updateMeta = () => updateProgressAndCount(done, sites.length);
    updateMeta();
    publishSearchAggregateBridgeState({ running: true });

    const queue = sites.slice();
    const runners = new Array(Math.max(1, searchConcurrency)).fill(null).map(async () => {
      while (queue.length) {
        const site = queue.shift();
        if (!site) continue;

        try {
          const data = await requestCatSpider({
            apiBase: catApiBase,
            username: tvUser,
            action: 'search',
            spiderApi: site.api,
            payload: { wd: q, page: 1 },
          });
          if (runId !== currentRunId) return;
          const items = normalizeSearchList(data);

          const sliced = items.slice(0, 12);
          const groupKeysActivated = new Set();

          const normalItems = sliced
            .map((it) => {
              const name = it && it.name ? String(it.name) : '';
              const originalTitle = sanitizeDisplayTitle(name) || name;
              const seasonHint = extractSeasonHintFromText(originalTitle) || extractSeasonHintFromText(it && it.remark ? String(it.remark) : '');
              const base = preCleanForRules(originalTitle) || originalTitle || name;
              const cleanedRaw =
                applyCleanRules(base, compiledAggregateCleanRules, { skipTrailingDigitsRule: Boolean(qTrailingDigits) }) || base;
              const cleanedTitle = sanitizeDisplayTitle(cleanedRaw) || cleanedRaw || base || name;
              const cleanedForMatch = normalizeDisplayTitle(cleanedTitle) || cleanedTitle || name;
              const groupKey = normalizeForGroupKey(cleanedForMatch);
              let groupKeySafe = groupKey || normalizeForGroupKey(name);
              if ((searchDisplayMode === 'tmdb' || searchDisplayMode === 'both') && tmdbByGroupKeyByType.size) {
                const seasonStripped = stripSeasonMarkers(cleanedForMatch);
                if (seasonStripped && seasonStripped !== cleanedForMatch) {
                  const gkStripped = normalizeForGroupKey(seasonStripped);
                  if (gkStripped && hasTMDBTVForGroupKey(gkStripped)) {
                    const tmdbSeasonCount = getTMDBTVSeasonCountForGroupKey(gkStripped);
                    if (tmdbSeasonCount > 0 && seasonHint > tmdbSeasonCount) {
                      // Do not merge site titles beyond TMDB-known seasons.
                    } else {
                      groupKeySafe = gkStripped;
                    }
                  }
                }
              }
              const seasonHintLabel = seasonHint > 0 ? `第${Math.floor(seasonHint)}季` : '';
              if (!groupKeySafe) return { ...it, __groupKey: '', __displayTitle: originalTitle || name, __seasonHint: seasonHint, __seasonHintLabel: seasonHintLabel };
              return { ...it, __groupKey: groupKeySafe, __displayTitle: originalTitle || name, __seasonHint: seasonHint, __seasonHintLabel: seasonHintLabel };
            })
            .filter(Boolean);

          // Always update groups for this site so we can build aggregate cards after toggling off "原始列表".
          if (site && site.key) {
            const sk = String(site.key);
            let groupTouched = false;
            normalItems.forEach((it) => {
              const vid = it && it.id != null ? String(it.id) : '';
              const rawName = it && it.name ? String(it.name) : '';
              const groupKey = it && it.__groupKey ? String(it.__groupKey) : '';
              if (!sk || !vid || !groupKey || !rawName) return;

              const group = aggregateByGroup.get(groupKey) || {
                groupKey,
                title: '',
                bySite: new Map(),
              };

              const displayTitle = it && it.__displayTitle ? String(it.__displayTitle) : rawName;
              const candidateTitle = sanitizeDisplayTitle(displayTitle) || rawName;
              group.title = pickPreferredGroupTitle(group.title, candidateTitle);

              const entry = group.bySite.get(sk) || {
                siteKey: sk,
                spiderApi: site.api,
                siteName: site.name || site.key || '',
                matches: new Map(),
              };
              if (!entry.matches.has(vid)) {
                entry.matches.set(vid, {
                  siteKey: sk,
                  spiderApi: site.api,
                  siteName: site.name || site.key || '',
                  videoId: vid,
                  videoTitle: rawName,
                  videoPoster: it && it.pic ? String(it.pic) : '',
                  videoRemark: it && it.remark ? String(it.remark) : '',
                  seasonHint:
                    it && Number.isFinite(Number(it.__seasonHint)) && Number(it.__seasonHint) > 0
                      ? Math.floor(Number(it.__seasonHint))
                      : 0,
                });
              }
              group.bySite.set(sk, entry);
              aggregateByGroup.set(groupKey, group);
              groupTouched = true;
            });

            // After updating groups, activate aggregate cards for any group that now has >=2 sites.
            if (!rawListMode) {
              normalItems.forEach((it) => {
                const gk = it && it.__groupKey ? String(it.__groupKey) : '';
                if (!gk) return;
                const group = aggregateByGroup.get(gk);
                if (!group || !group.bySite) return;
                if (computeAggregateSourceSiteCount(group.bySite) < 2) return;
                groupKeysActivated.add(gk);
                ensureStreamingAggregateCardForGroup(gk);
              });
            }
            if (groupTouched) publishSearchAggregateBridgeState({ running: true });
          }

          const filteredItems = normalItems;

          if (searchDisplayMode !== 'tmdb') {
            totalFound += appendItemsToGrid({
              gridEl: grid,
              items: filteredItems,
              siteKey: site.key,
              siteApi: site.api,
              siteName: site.name || site.key || '',
              seenKeys,
              insertCardSorted,
              computeMatchScore,
            });
          }
          updateMeta();

          // Defensive: concurrent runners can insert cards before aggregation activates.
          // Re-run group aggregation after appending so duplicates collapse promptly.
          if (!rawListMode && groupKeysActivated.size) {
            Array.from(groupKeysActivated.values()).forEach((gk) => ensureStreamingAggregateCardForGroup(gk));
          }
        } catch (e) {
          if (runId !== currentRunId) return;
          failed += 1;
        } finally {
          done += 1;
          updateMeta();
          publishSearchAggregateBridgeState({ running: done < sites.length });
          if (done >= sites.length) {
            if (!grid.children.length) {
              setStatus('暂无搜索结果');
            } else {
              setStatus('');
            }
          }
        }
      }
    });

    await Promise.allSettled(runners);
    if (runId !== currentRunId) return;

    // Ensure aggregate cards are present after the search ends too (in case the last runner discovered a group).
    if (!rawListMode) {
      for (const gk of aggregateByGroup.keys()) {
        ensureStreamingAggregateCardForGroup(gk);
      }
    }

    updateMeta();
    if (!grid.children.length) {
      setStatus('暂无搜索结果');
    } else {
      setStatus('');
    }
    publishSearchAggregateBridgeState({ running: false });

    // Allow toggling off "原始列表" to build aggregate cards without re-searching.
    refreshAggregatesForCurrentRun = () => {
      if (!activeResultsGrid || activeResultsGrid !== grid) return;
      for (const gk of aggregateByGroup.keys()) {
        ensureStreamingAggregateCardForGroup(gk);
      }
      applyRawListModeToGrid();
      setCount(getVisibleCardCount());
    };
  };

  const flashStatus = (text, { ms = 1600 } = {}) => {
    const msg = typeof text === 'string' ? text.trim() : '';
    if (!msg) return;
    setStatus(msg);
    window.setTimeout(() => {
      if ((resultsStatus && resultsStatus.textContent ? resultsStatus.textContent.trim() : '') === msg) {
        setStatus('');
      }
    }, Math.max(400, Math.floor(ms)));
  };

  let matchBlockMenuEl = null;
  let matchBlockMenuCtx = null;
  let matchBlockMenuActionBtn = null;

  const hideMatchBlockMenu = () => {
    if (!matchBlockMenuEl) return;
    matchBlockMenuEl.classList.add('hidden');
    matchBlockMenuCtx = null;
  };

  const ensureMatchBlockMenu = () => {
    if (matchBlockMenuEl) return matchBlockMenuEl;
    const el = document.createElement('div');
    el.id = 'tvMatchBlockMenu';
    el.className = 'fixed z-50 hidden';
    el.innerHTML = `
      <div class="min-w-[220px] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden dark:border-white/10 dark:bg-[#0b1220]">
        <button type="button" data-action="toggle" class="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
          加入匹配禁用
        </button>
      </div>
    `;
    matchBlockMenuActionBtn = el.querySelector('button[data-action="toggle"]');
    el.addEventListener('click', async (e) => {
      const target = e && e.target ? e.target : null;
      const btn = target && target.closest ? target.closest('button[data-action]') : null;
      const action = btn ? String(btn.dataset.action || '').trim() : '';
      if (!action) return;
      e.preventDefault();
      e.stopPropagation();
      if (action !== 'toggle') return;
      const ctx = matchBlockMenuCtx;
      hideMatchBlockMenu();
      if (!ctx || !ctx.keyword || !ctx.siteKey || !ctx.videoId) return;
      try {
        const blocked = !!ctx.blocked;
        const endpoint = blocked ? '/api/smart/matchblock/delete' : '/api/smart/matchblock/add';
        await requestJson(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            keyword: ctx.keyword,
            siteKey: ctx.siteKey,
            spiderApi: ctx.spiderApi,
            videoId: ctx.videoId,
            poster: ctx.poster,
          }),
        });
        const key = `${ctx.siteKey}::${ctx.videoId}`;
        if (blocked) {
          matchBlockedKeySet.delete(key);
          if (ctx.wrapperEl && ctx.wrapperEl.dataset) delete ctx.wrapperEl.dataset.matchBlocked;
          flashStatus('已取消禁用', { ms: 1200 });
        } else {
          matchBlockedKeySet.add(key);
          if (ctx.wrapperEl && ctx.wrapperEl.dataset) ctx.wrapperEl.dataset.matchBlocked = '1';
          flashStatus('已加入禁用', { ms: 1200 });
        }
        try {
          window.dispatchEvent(new CustomEvent('tv:smart-matchblock-updated', { detail: { keyword: ctx.keyword } }));
        } catch (_e) {}
      } catch (err) {
        flashStatus(formatHttpError(err), { ms: 2600 });
      }
    });
    document.body.appendChild(el);
    matchBlockMenuEl = el;

    document.addEventListener(
      'click',
      (ev) => {
        const t = ev && ev.target ? ev.target : null;
        if (t && matchBlockMenuEl && matchBlockMenuEl.contains(t)) return;
        hideMatchBlockMenu();
      },
      { capture: true }
    );
    document.addEventListener('keydown', (e) => {
      if (!e) return;
      if (e.key === 'Escape') hideMatchBlockMenu();
    });
    window.addEventListener('scroll', () => hideMatchBlockMenu(), { passive: true });
    window.addEventListener('resize', () => hideMatchBlockMenu(), { passive: true });
    return el;
  };

  resultsList.addEventListener('contextmenu', (e) => {
    if (!e || !e.target || !e.target.closest) return;

    const wrapper = e.target.closest('div[data-site-key][data-video-id]');
    if (!wrapper || !wrapper.dataset) return;
    if ((wrapper.dataset.aggregate || '') === '1') return;

    const siteKey = String(wrapper.dataset.siteKey || '').trim();
    const spiderApi = String(wrapper.dataset.spiderApi || '').trim();
    const videoId = String(wrapper.dataset.videoId || '').trim();
    if (!siteKey || !videoId || siteKey === 'tmdb') return;

    const keyword = String(lastSearchKeyword || '').trim();
    if (!keyword) return;

    const isBlocked =
      (wrapper.dataset.matchBlocked || '') === '1' || (matchBlockedKeySet && matchBlockedKeySet.has(`${siteKey}::${videoId}`));

    let poster = '';
    try {
      const img = wrapper.querySelector && wrapper.querySelector('img');
      poster = (img && img.dataset && (img.dataset.originalSrc || img.dataset.src)) || (img && img.getAttribute && img.getAttribute('src')) || '';
    } catch (_e) {
      poster = '';
    }

    e.preventDefault();
    e.stopPropagation();

    matchBlockMenuCtx = {
      keyword,
      siteKey,
      spiderApi,
      videoId,
      poster: typeof poster === 'string' ? poster.trim() : '',
      blocked: isBlocked,
      wrapperEl: wrapper,
    };

    const menu = ensureMatchBlockMenu();
    if (matchBlockMenuActionBtn) {
      if (isBlocked) {
        matchBlockMenuActionBtn.textContent = '取消匹配禁用';
        matchBlockMenuActionBtn.className =
          'w-full px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/5';
      } else {
        matchBlockMenuActionBtn.textContent = '加入匹配禁用';
        matchBlockMenuActionBtn.className =
          'w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10';
      }
    }
    const x = typeof e.clientX === 'number' ? e.clientX : 0;
    const y = typeof e.clientY === 'number' ? e.clientY : 0;
    menu.style.left = `${Math.max(8, x)}px`;
    menu.style.top = `${Math.max(8, y)}px`;
    menu.classList.remove('hidden');
  });

  const startSearch = (keyword, { saveHistory } = { saveHistory: true }) => {
    const q = (keyword || '').trim().replace(/\s+/g, ' ');
    input.value = q;
    setClearQueryVisible();
    if (!q) return;
    if (saveHistory) {
      requestJson(historyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: q }),
      })
        .then((list) => renderHistory(list))
        .catch(() => {});
    }
    runSearch(q);
  };

  const setClearQueryVisible = () => {
    const v = (input.value || '').trim();
    clearQueryBtn.classList.toggle('hidden', !v);
  };

  const renderHistory = (items) => {
    chipsBox.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      historySection.classList.add('hidden');
      return;
    }
    historySection.classList.toggle('hidden', showingResults);

    const frag = document.createDocumentFragment();
    items.forEach((kw) => {
      const item = (kw || '').trim();
      if (!item) return;
      const wrap = document.createElement('div');
      wrap.className = 'relative group';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'px-4 py-2 bg-gray-500/10 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition-colors duration-200 dark:bg-gray-700/50 dark:hover:bg-gray-600 dark:text-gray-300';
      btn.textContent = item;
      btn.addEventListener('click', () => {
        input.value = item;
        setClearQueryVisible();
        runSearch(item);
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.setAttribute('aria-label', '删除搜索历史');
      del.className =
        'absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 bg-gray-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] transition-colors';
      del.innerHTML = '&times;';
      del.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
          await requestJson(`${historyEndpoint}?keyword=${encodeURIComponent(item)}`, { method: 'DELETE' });
          await loadHistory();
        } catch (_) {}
      });

      wrap.appendChild(btn);
      wrap.appendChild(del);
      frag.appendChild(wrap);
    });
    chipsBox.appendChild(frag);
  };

  const loadHistory = async () => {
    try {
      const list = await requestJson(historyEndpoint, { method: 'GET' });
      renderHistory(list);
    } catch (_) {
      renderHistory([]);
    }
  };

  clearHistoryBtn.addEventListener('click', async () => {
    try {
      await requestJson(historyEndpoint, { method: 'DELETE' });
      await loadHistory();
    } catch (_) {}
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    startSearch(input.value, { saveHistory: true });
  });

  clearQueryBtn.addEventListener('click', () => {
    input.value = '';
    setClearQueryVisible();
    setShowResults(false);
    setSummary('');
    setStatus('');
    resultsList.innerHTML = '';
    input.focus();
  });

  input.addEventListener('input', () => setClearQueryVisible());

  window.addEventListener('tv:search', (e) => {
    const q = e && e.detail && typeof e.detail.q === 'string' ? e.detail.q : '';
    startSearch(q, { saveHistory: true });
  });

  input.value = '';
  setClearQueryVisible();
  setShowResults(false);
  loadHistory();
}
