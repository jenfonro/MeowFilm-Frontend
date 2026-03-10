import { computed, ref } from 'vue';
import {
  buildDisplayedResults,
  clearSearchHistory,
  fetchSearchHistory,
  loadSearchConfig,
  saveSearchHistory,
  streamSearch,
} from './searchRuntime';

const inputValue = ref('');
const activeQuery = ref('');
const rawListMode = ref(false);
const historyItems = ref([]);
const loading = ref(false);
const errorText = ref('');
const runtimeConfig = ref(null);
const searchState = ref({
  displayMode: 'sites',
  tmdbItems: [],
  siteItems: [],
  displayedItems: [],
  pinTmdbFirst: false,
  siteTotal: 0,
});
const progressDone = ref(0);
const progressTotal = ref(0);
const completedQueries = ref([]);
const queryStateCache = new Map();
const queryStatusCache = new Map();
const queryListeners = new Map();
let searchRunSeq = 0;
let configInFlight = null;
let historyLoaded = false;

const normalizeQueryKey = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeQueryScope = (value) => {
  const raw = normalizeQueryKey(value);
  return raw || 'default';
};
const buildScopedQueryKey = (scope, query) => `${normalizeQueryScope(scope)}::${normalizeQueryKey(query)}`;

const hasError = computed(() => !!errorText.value);

const displayedItems = computed(() => {
  if (!runtimeConfig.value) return [];
  return buildDisplayedResults(searchState.value, runtimeConfig.value, { rawListMode: rawListMode.value });
});

const showResultsSection = computed(() => !!activeQuery.value || loading.value || !!errorText.value);
const showHistorySection = computed(() => !activeQuery.value && historyItems.value.length > 0);

const showRawListToggle = computed(() => {
  if (!runtimeConfig.value) return false;
  if (runtimeConfig.value.searchDisplayMode === 'tmdb') return false;
  return searchState.value.siteItems.length > 0;
});

const progressText = computed(() => {
  if (!loading.value) return '';
  if (progressTotal.value <= 0) return '';
  return `(${progressDone.value}/${progressTotal.value})`;
});

const summaryText = computed(() => {
  if (!activeQuery.value || errorText.value) return '';
  return displayedItems.value.length ? `共 ${displayedItems.value.length} 条` : '';
});

const statusText = computed(() => {
  if (errorText.value) return errorText.value;
  if (!loading.value && activeQuery.value && !displayedItems.value.length) return '暂无搜索结果';
  return '';
});

const createEmptySearchState = () => ({
  displayMode: runtimeConfig.value ? runtimeConfig.value.searchDisplayMode : 'sites',
  tmdbItems: [],
  siteItems: [],
  displayedItems: [],
  pinTmdbFirst: false,
  siteTotal: 0,
});

const resetSearchResultState = () => {
  errorText.value = '';
  searchState.value = createEmptySearchState();
  progressDone.value = 0;
  progressTotal.value = 0;
};

const cloneSearchSnapshot = (state) => ({
  displayMode: state && state.displayMode ? state.displayMode : 'sites',
  tmdbItems: Array.isArray(state && state.tmdbItems) ? state.tmdbItems.slice() : [],
  siteItems: Array.isArray(state && state.siteItems) ? state.siteItems.slice() : [],
  displayedItems: Array.isArray(state && state.displayedItems) ? state.displayedItems.slice() : [],
  pinTmdbFirst: !!(state && state.pinTmdbFirst),
  siteTotal: Number.isFinite(Number(state && state.siteTotal)) ? Number(state.siteTotal) : 0,
  progressDone: Number.isFinite(Number(state && state.progressDone)) ? Number(state.progressDone) : 0,
  progressTotal: Number.isFinite(Number(state && state.progressTotal)) ? Number(state.progressTotal) : 0,
});

const notifyQueryListeners = (query, snapshot, status, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  if (!safeQuery) return;
  const listeners = queryListeners.get(buildScopedQueryKey(scope, safeQuery));
  if (!listeners || !listeners.size) return;
  const nextSnapshot = snapshot ? cloneSearchSnapshot(snapshot) : null;
  listeners.forEach((listener) => {
    try {
      listener(nextSnapshot, status);
    } catch (_error) {}
  });
};

const getCachedQueryStatus = (safeQuery, scope = 'default') => {
  if (!safeQuery) return 'idle';
  const scopedKey = buildScopedQueryKey(scope, safeQuery);
  const cached = normalizeQueryKey(queryStatusCache.get(scopedKey));
  if (cached === 'loading' || cached === 'completed' || cached === 'error') return cached;
  if (completedQueries.value.includes(scopedKey)) return 'completed';
  return 'idle';
};

const getCachedQuerySnapshot = (safeQuery, scope = 'default') => {
  if (!safeQuery) return null;
  const cached = queryStateCache.get(buildScopedQueryKey(scope, safeQuery));
  return cached ? cloneSearchSnapshot(cached) : null;
};

export const ensureSearchSessionConfig = async (baseBootstrap = {}) => {
  if (runtimeConfig.value) return runtimeConfig.value;
  if (configInFlight) return configInFlight;
  configInFlight = loadSearchConfig(baseBootstrap)
    .then((config) => {
      runtimeConfig.value = config;
      return config;
    })
    .finally(() => {
      configInFlight = null;
    });
  return configInFlight;
};

export const refreshSearchSessionHistory = async () => {
  historyItems.value = await fetchSearchHistory().catch(() => []);
  historyLoaded = true;
  return historyItems.value;
};

export const ensureSearchSessionHistory = async () => {
  if (historyLoaded) return historyItems.value;
  return refreshSearchSessionHistory();
};

export const performSearchSessionSearch = async (
  query,
  baseBootstrap = {},
  {
    saveHistoryEnabled = true,
    blockedSiteKeys = [],
    affectUi = true,
    scope = 'default',
    searchDisplayModeOverride = '',
    contentKind = 'tv',
  } = {}
) => {
  const safeQuery = normalizeQueryKey(query);
  const safeScope = normalizeQueryScope(scope);
  const scopedKey = buildScopedQueryKey(safeScope, safeQuery);
  const runSeq = ++searchRunSeq;
  if (affectUi) {
    inputValue.value = safeQuery;
    activeQuery.value = safeQuery;
    resetSearchResultState();
  }
  if (!safeQuery) return;
  completedQueries.value = completedQueries.value.filter((item) => item !== scopedKey);
  queryStatusCache.set(scopedKey, 'loading');
  notifyQueryListeners(safeQuery, createEmptySearchState(), 'loading', safeScope);

  if (affectUi) loading.value = true;
  try {
    const config = await ensureSearchSessionConfig(baseBootstrap);
    if (runSeq !== searchRunSeq) return;
    const effectiveConfig = normalizeQueryKey(searchDisplayModeOverride)
      ? { ...config, searchDisplayMode: normalizeQueryKey(searchDisplayModeOverride) }
      : config;
    if (saveHistoryEnabled) {
      const nextHistory = await saveSearchHistory(safeQuery).catch(() => historyItems.value);
      if (runSeq !== searchRunSeq) return;
      historyItems.value = nextHistory;
      historyLoaded = true;
    }
    await streamSearch(safeQuery, effectiveConfig, {
      blockedSiteKeys,
      contentKind,
      onUpdate(nextState) {
        if (runSeq !== searchRunSeq) return;
        if (affectUi) searchState.value = nextState;
        queryStateCache.set(scopedKey, cloneSearchSnapshot(nextState));
        if (affectUi) {
          progressDone.value = Number.isFinite(Number(nextState.progressDone)) ? Number(nextState.progressDone) : 0;
          progressTotal.value = Number.isFinite(Number(nextState.progressTotal)) ? Number(nextState.progressTotal) : 0;
        }
        notifyQueryListeners(safeQuery, nextState, 'loading', safeScope);
      },
    });
    if (runSeq === searchRunSeq && !errorText.value && safeQuery) {
      completedQueries.value = completedQueries.value.includes(scopedKey)
        ? completedQueries.value
        : [...completedQueries.value, scopedKey];
      queryStatusCache.set(scopedKey, 'completed');
      notifyQueryListeners(
        safeQuery,
        {
          ...(affectUi ? searchState.value : (queryStateCache.get(scopedKey) || createEmptySearchState())),
          progressDone: affectUi ? progressDone.value : Number(queryStateCache.get(scopedKey)?.progressDone || 0),
          progressTotal: affectUi ? progressTotal.value : Number(queryStateCache.get(scopedKey)?.progressTotal || 0),
        },
        'completed',
        safeScope
      );
    }
  } catch (error) {
    if (runSeq !== searchRunSeq) return;
    if (affectUi) errorText.value = `搜索失败：${error && error.message ? error.message : '未知错误'}`;
    queryStatusCache.set(scopedKey, 'error');
    notifyQueryListeners(
      safeQuery,
      {
        ...(affectUi ? searchState.value : (queryStateCache.get(scopedKey) || createEmptySearchState())),
        progressDone: affectUi ? progressDone.value : Number(queryStateCache.get(scopedKey)?.progressDone || 0),
        progressTotal: affectUi ? progressTotal.value : Number(queryStateCache.get(scopedKey)?.progressTotal || 0),
      },
      'error',
      safeScope
    );
  } finally {
    if (runSeq !== searchRunSeq) return;
    if (affectUi) loading.value = false;
  }
};

export const clearSearchSessionQuery = async () => {
  inputValue.value = '';
  activeQuery.value = '';
  resetSearchResultState();
  await refreshSearchSessionHistory();
};

export const clearSearchSessionHistory = async () => {
  historyItems.value = await clearSearchHistory().catch(() => historyItems.value);
  historyLoaded = true;
  return historyItems.value;
};

export const getSearchSessionQueryStatus = (query, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  if (!safeQuery) return 'idle';
  const cachedStatus = getCachedQueryStatus(safeQuery, scope);
  if (cachedStatus !== 'idle') return cachedStatus;
  if (normalizeQueryScope(scope) === 'default' && normalizeQueryKey(activeQuery.value) === safeQuery && loading.value) return 'loading';
  return 'idle';
};

export const getSearchSessionQuerySnapshot = (query, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  if (!safeQuery) return null;
  if (normalizeQueryScope(scope) === 'default' && normalizeQueryKey(activeQuery.value) === safeQuery) {
    return cloneSearchSnapshot({
      ...searchState.value,
      progressDone: progressDone.value,
      progressTotal: progressTotal.value,
    });
  }
  return getCachedQuerySnapshot(safeQuery, scope);
};

export const getSearchSessionRuntimeQueryStatus = (query, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  return getCachedQueryStatus(safeQuery, scope);
};

export const getSearchSessionRuntimeQuerySnapshot = (query, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  return getCachedQuerySnapshot(safeQuery, scope);
};

export const getSearchSessionAnyQueryStatus = (query, scope = 'default') => {
  const safeScope = normalizeQueryScope(scope);
  return safeScope === 'default'
    ? getSearchSessionQueryStatus(query, safeScope)
    : getSearchSessionRuntimeQueryStatus(query, safeScope);
};

export const getSearchSessionAnyQuerySnapshot = (query, scope = 'default') => {
  const safeScope = normalizeQueryScope(scope);
  return safeScope === 'default'
    ? getSearchSessionQuerySnapshot(query, safeScope)
    : getSearchSessionRuntimeQuerySnapshot(query, safeScope);
};

export const subscribeSearchSessionQuery = (query, listener, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  const safeScope = normalizeQueryScope(scope);
  const fn = typeof listener === 'function' ? listener : null;
  if (!safeQuery || !fn) return () => {};
  const scopedKey = buildScopedQueryKey(safeScope, safeQuery);
  if (!queryListeners.has(scopedKey)) queryListeners.set(scopedKey, new Set());
  const listeners = queryListeners.get(scopedKey);
  listeners.add(fn);
  const status = getSearchSessionQueryStatus(safeQuery, safeScope);
  const snapshot = getSearchSessionQuerySnapshot(safeQuery, safeScope);
  try {
    fn(snapshot, status);
  } catch (_error) {}
  return () => {
    const current = queryListeners.get(scopedKey);
    if (!current) return;
    current.delete(fn);
    if (!current.size) queryListeners.delete(scopedKey);
  };
};

export const subscribeSearchSessionRuntimeQuery = (query, listener, scope = 'default') => {
  const safeQuery = normalizeQueryKey(query);
  const safeScope = normalizeQueryScope(scope);
  const fn = typeof listener === 'function' ? listener : null;
  if (!safeQuery || !fn) return () => {};
  const scopedKey = buildScopedQueryKey(safeScope, safeQuery);
  if (!queryListeners.has(scopedKey)) queryListeners.set(scopedKey, new Set());
  const listeners = queryListeners.get(scopedKey);
  listeners.add(fn);
  const status = getSearchSessionRuntimeQueryStatus(safeQuery, safeScope);
  const snapshot = getSearchSessionRuntimeQuerySnapshot(safeQuery, safeScope);
  try {
    fn(snapshot, status);
  } catch (_error) {}
  return () => {
    const current = queryListeners.get(scopedKey);
    if (!current) return;
    current.delete(fn);
    if (!current.size) queryListeners.delete(scopedKey);
  };
};

export const useSearchSession = () => ({
  inputValue,
  activeQuery,
  rawListMode,
  historyItems,
  loading,
  errorText,
  runtimeConfig,
  searchState,
  progressDone,
  progressTotal,
  hasError,
  displayedItems,
  showResultsSection,
  showHistorySection,
  showRawListToggle,
  progressText,
  summaryText,
  statusText,
  ensureConfig: ensureSearchSessionConfig,
  ensureHistory: ensureSearchSessionHistory,
  refreshHistory: refreshSearchSessionHistory,
  performSearch: performSearchSessionSearch,
  clearQuery: clearSearchSessionQuery,
  clearHistory: clearSearchSessionHistory,
});
