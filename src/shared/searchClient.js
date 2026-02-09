import { requestCatSpider } from './catpawopen';
import { createPosterCard } from './posterCard';

export function initSearchPage() {
  const historyEndpoint = '/api/searchhistory';
  const sitesEndpoint = '/api/user/sites';
  const AGG_STORAGE_KEY = 'tv:search:aggregate:sources:v1';

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
  let searchBadgePreferEpisode = false;

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

    const preferRaw = ((configEl && configEl.getAttribute('data-search-badge-prefer-episode')) || '').trim();
    searchBadgePreferEpisode = preferRaw === '1' || preferRaw.toLowerCase() === 'true' || preferRaw.toLowerCase() === 'yes';
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
        el.classList.toggle('hidden', rawListMode);
        return;
      }
      if (isTMDB) {
        if (gk && aggKeys.has(gk)) el.classList.toggle('hidden', !rawListMode);
        else el.classList.remove('hidden');
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
      wrapper.dataset.videoId = id || '';
      if (it && typeof it.__groupKey === 'string' && it.__groupKey) wrapper.dataset.titleAggKey = it.__groupKey;
      if (isAggregate) wrapper.dataset.aggregate = '1';
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

      const mediaType = it && it.mediaType ? String(it.mediaType) : '';
      const tmdbIdRaw = it && it.tmdbId != null ? Number(it.tmdbId) : 0;
      const tmdbId = Number.isFinite(tmdbIdRaw) && tmdbIdRaw > 0 ? Math.floor(tmdbIdRaw) : 0;
      const badgeText = it && typeof it.badge === 'string' ? it.badge.trim() : '';

      const titleText = it && it.name ? String(it.name) : '';
      const fallbackTitleLen = titleText.replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').length;
      const titleLen = Number.isFinite(Number(it && it.__titleLen)) ? Number(it.__titleLen) : fallbackTitleLen;

      const wrapper = document.createElement('div');
      wrapper.className = 'w-full';
      wrapper.dataset.siteKey = 'tmdb';
      wrapper.dataset.videoId = id;
      if (it && typeof it.__groupKey === 'string' && it.__groupKey) wrapper.dataset.titleAggKey = it.__groupKey;
      wrapper.dataset.siteOrder = '-1';
      wrapper.dataset.titleLen = String(Math.max(0, Math.floor(titleLen)));
      if (typeof computeMatchScore === 'function' && computeMatchScore(titleText) === 1000) {
        wrapper.dataset.exactMatch = '1';
      }

      const openUrl =
        tmdbId && (mediaType === 'movie' || mediaType === 'tv')
          ? `https://www.themoviedb.org/${mediaType}/${tmdbId}`
          : '';

      const score = typeof computeMatchScore === 'function' ? computeMatchScore(titleText) : 0;
      const scoreFinal = Number.isFinite(Number(it && it.__score)) ? Number(it.__score) : score;

      const tmdbLabel = rawListMode && (searchDisplayMode === 'both' || searchDisplayMode === 'tmdb') ? 'TMDB' : '';
      const cardWrapper = createPosterCard({
        wrapperEl: wrapper,
        wrapperClass: 'w-full',
        io,
        onActivate: () => {
          if (!openUrl) return;
          try {
            window.open(openUrl, '_blank', 'noopener,noreferrer');
          } catch (_e) {}
        },
        title: titleText,
        poster: it && it.pic ? String(it.pic) : '',
        remark: badgeText,
        siteName: tmdbLabel,
        cornerBadgeText: '',
        placeholder: true,
        overlays: false,
      });
      if (!cardWrapper) return;

      if (typeof insertCardSorted === 'function') insertCardSorted(wrapper, scoreFinal);
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
  const runSearch = async (keyword) => {
    const runId = (currentRunId += 1);
    const q = (keyword || '').trim();
    if (!q) return;

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
        const re = buildRegexFromInput(raw, { defaultFlags: 'g', forceGlobal: true });
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

    const parseEpisodeNumber = (text) => {
      const s = typeof text === 'string' ? text : '';
      if (!s) return 0;
      const mE = s.match(/\bE\s*(\d{1,5})\b/i);
      if (mE && mE[1]) return Math.max(0, Number.parseInt(mE[1], 10) || 0);
      const mCn = s.match(/(?:更新至|更至|第)\s*(\d{1,5})\s*(?:集|话|期)/);
      if (mCn && mCn[1]) return Math.max(0, Number.parseInt(mCn[1], 10) || 0);
      const mNum = s.match(/(\d{1,5})/);
      if (mNum && mNum[1]) return Math.max(0, Number.parseInt(mNum[1], 10) || 0);
      return 0;
    };

    const extractMaxEpisodeFromSources = (sources) => {
      if (!searchBadgePreferEpisode) return 0;
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
    const insertCardSorted = (wrapperEl, score) => {
      wrapperEl.dataset.score = String(score);
      wrapperEl.dataset.seq = String((insertSeq += 1));
      const wrapperScore = Number(wrapperEl.dataset.score || 0);
      const wrapperTitleLen = Number(wrapperEl.dataset.titleLen || 0);
      const wrapperSeq = Number(wrapperEl.dataset.seq || 0);
      const children = Array.from(grid.children || []);
      for (let i = 0; i < children.length; i += 1) {
        const el = children[i];
        const elScore = Number(el && el.dataset ? el.dataset.score : 0);
        const elTitleLen = Number(el && el.dataset ? el.dataset.titleLen : 0);
        const elSeq = Number(el && el.dataset ? el.dataset.seq : 0);

        if (Number.isFinite(elScore) && elScore < wrapperScore) {
          grid.insertBefore(wrapperEl, el);
          return;
        }
        if (Number.isFinite(elScore) && elScore === wrapperScore) {
          if (Number.isFinite(elTitleLen) && Number.isFinite(wrapperTitleLen) && elTitleLen > wrapperTitleLen) {
            grid.insertBefore(wrapperEl, el);
            return;
          }
          if (Number.isFinite(elTitleLen) && Number.isFinite(wrapperTitleLen) && elTitleLen === wrapperTitleLen && Number.isFinite(elSeq) && elSeq > wrapperSeq) {
            grid.insertBefore(wrapperEl, el);
            return;
          }
        }
      }
      grid.appendChild(wrapperEl);
    };

    const seenKeys = new Set();
    const tmdbByGroupKey = new Map(); // groupKey -> tmdb item (best match)

    const runTMDBSearch = async () => {
      if (searchDisplayMode !== 'tmdb' && searchDisplayMode !== 'both') return 0;
      try {
        const data = await requestJson(`/api/tmdb/search?q=${encodeURIComponent(q)}`, {
          method: 'GET',
          credentials: 'same-origin',
        });
        const rawItems = data && Array.isArray(data.list) ? data.list : [];
        const items = rawItems
          .map((it) => {
            const name = it && it.name ? String(it.name) : '';
            const originalTitle = sanitizeDisplayTitle(name) || name;
            const base = preCleanForRules(originalTitle) || originalTitle || name;
            const cleanedRaw =
              applyCleanRules(base, compiledAggregateCleanRules, { skipTrailingDigitsRule: Boolean(qTrailingDigits) }) || base;
            const cleanedTitle = sanitizeDisplayTitle(cleanedRaw) || cleanedRaw || base || name;
            const cleanedForMatch = normalizeDisplayTitle(cleanedTitle) || cleanedTitle || name;
            const groupKey = normalizeForGroupKey(cleanedForMatch) || normalizeForGroupKey(name);
            const score = computeMatchScore(cleanedForMatch || name);
            const titleLen = cleanedForMatch.replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').length;
            const out = {
              ...it,
              __groupKey: groupKey || '',
              __displayTitle: originalTitle || name,
              __score: score,
              __titleLen: titleLen,
            };
            if (groupKey) {
              const prev = tmdbByGroupKey.get(groupKey) || null;
              if (!prev) tmdbByGroupKey.set(groupKey, out);
              else {
                const ps = Number(prev.__score || 0);
                const ns = Number(out.__score || 0);
                if (ns > ps) tmdbByGroupKey.set(groupKey, out);
                else if (ns === ps) {
                  const pl = Number(prev.__titleLen || 0);
                  const nl = Number(out.__titleLen || 0);
                  if (nl > 0 && (pl <= 0 || nl < pl)) tmdbByGroupKey.set(groupKey, out);
                }
              }
            }
            return out;
          })
          .filter(Boolean);
        if (!items.length) return 0;
        const appended = appendTMDBItemsToGrid({
          gridEl: grid,
          items,
          siteName: 'TMDB',
          seenKeys,
          insertCardSorted,
          computeMatchScore,
        });
        updateProgressAndCount(0, 0);
        return appended;
      } catch (err) {
        const msg = (err && err.message) || '服务器连接 TMDB 失败';
        setStatus(msg, true);
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
    const sites = (await loadSites()).filter((s) => s && s.enabled !== false && s.search !== false && s.api && !isConfigCenter(s));
    if (runId !== currentRunId) return;
    if (!sites.length) {
      setStatus(grid.children.length ? '' : '暂无可用站点');
      return;
    }

    let done = 0;
    let failed = 0;
    let totalFound = 0;

    const aggregateByGroup = new Map(); // groupKey -> { groupKey, title, bySite: Map(siteKey -> {meta..., matches: Map(videoId -> source)}) }
    const aggregateCardByGroup = new Map(); // groupKey -> { el, uniq, sourceSiteCount, storageKey }

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
      const badge = el.querySelector && el.querySelector('.tv-aggregate-source-count');
      if (!badge) return;
      const n = Number.isFinite(Number(count)) ? Number(count) : 0;
      badge.textContent = formatSourceCountText(n);
      badge.title = `${Math.max(0, Math.floor(n))}个源`;
    };

    const syncAggregateStorage = (storageKey, cover, sources) => {
      const key = typeof storageKey === 'string' ? storageKey.trim() : '';
      if (!key || !cover || !cover.siteKey || !cover.videoId) return;
      try {
        const prevRaw = sessionStorage.getItem(AGG_STORAGE_KEY) || '';
        const prev = prevRaw && prevRaw.trim() ? JSON.parse(prevRaw) : null;
        const groups = prev && prev.groups && typeof prev.groups === 'object' ? prev.groups : {};
        groups[key] = {
          createdAt: Date.now(),
          forSiteKey: cover.siteKey,
          forVideoId: cover.videoId,
          sources,
        };
        sessionStorage.setItem(AGG_STORAGE_KEY, JSON.stringify({ version: 2, q, groups, lastKey: key }));
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

      // Replace per-site cards with one aggregate card as soon as we have >=2 sources.
      const removed = removeExistingGroupCards(gk);
      if (removed) totalFound = Math.max(0, totalFound - removed);

      const tmdbCover = !rawListMode && searchDisplayMode === 'both' ? tmdbByGroupKey.get(gk) : null;
      const title =
        tmdbCover && tmdbCover.__displayTitle
          ? String(tmdbCover.__displayTitle)
          : group && group.title
            ? String(group.title)
            : '';
      const poster = tmdbCover && tmdbCover.pic ? String(tmdbCover.pic) : cover.videoPoster || '';
      const siteMaxEp = extractMaxEpisodeFromSources(sources);
      let remark = tmdbCover && tmdbCover.badge ? String(tmdbCover.badge) : cover.videoRemark || '';
      if (searchBadgePreferEpisode && siteMaxEp > 0) {
        if (tmdbCover && tmdbCover.badge) {
          const tmdbEp = parseEpisodeNumber(String(tmdbCover.badge || ''));
          if (siteMaxEp > tmdbEp) remark = `更新至${siteMaxEp}集`;
        } else {
          remark = `更新至${siteMaxEp}集`;
        }
      }
      const storageKey = normalizeAggStorageKey(title);
      if (!storageKey) return;

      const uniq = `${cover.siteKey}::${String(cover.videoId)}`;
      const cached = aggregateCardByGroup.get(gk) || null;
      if (cached && cached.el && cached.uniq && cached.uniq !== uniq) {
        try {
          cached.el.remove();
          totalFound = Math.max(0, totalFound - 1);
        } catch (_e) {}
        aggregateCardByGroup.delete(gk);
      }

      // Ensure insertion isn't blocked by previous cards with the same uniq.
      seenKeys.delete(uniq);

      // Keep raw cards in DOM for "原始列表" toggle; visibility is controlled by applyRawListModeToGrid().

      syncAggregateStorage(storageKey, cover, sources);

      const existing = aggregateCardByGroup.get(gk) || null;
      if (existing && existing.el) {
        if (sourceSiteCount !== existing.sourceSiteCount) {
          existing.sourceSiteCount = sourceSiteCount;
          applyAggregateSourceBadge(existing.el, sourceSiteCount);
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
          },
        ],
        siteKey: cover.siteKey,
        siteApi: cover.spiderApi,
        siteName: '',
        cornerBadgeText: formatSourceCountText(sourceSiteCount),
        cornerBadgeTitle: `${sourceSiteCount}个源`,
        seenKeys,
        insertCardSorted,
        computeMatchScore,
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
              const base = preCleanForRules(originalTitle) || originalTitle || name;
              const cleanedRaw =
                applyCleanRules(base, compiledAggregateCleanRules, { skipTrailingDigitsRule: Boolean(qTrailingDigits) }) || base;
              const cleanedTitle = sanitizeDisplayTitle(cleanedRaw) || cleanedRaw || base || name;
              const cleanedForMatch = normalizeDisplayTitle(cleanedTitle) || cleanedTitle || name;
              const groupKey = normalizeForGroupKey(cleanedForMatch);
              const groupKeySafe = groupKey || normalizeForGroupKey(name);
              if (!groupKeySafe) return { ...it, __groupKey: '', __displayTitle: originalTitle || name };
              return { ...it, __groupKey: groupKeySafe, __displayTitle: originalTitle || name };
            })
            .filter(Boolean);

          // Always update groups for this site so we can build aggregate cards after toggling off "原始列表".
          if (site && site.key) {
            const sk = String(site.key);
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
                });
              }
              group.bySite.set(sk, entry);
              aggregateByGroup.set(groupKey, group);
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
