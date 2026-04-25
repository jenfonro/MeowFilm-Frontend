<template>
  <main id="searchPage" class="search-page">
    <div class="search-page__content">
      <div class="search-hero">
        <form class="search-form" @submit.prevent="submitSearch">
          <div class="search-input">
            <svg
              class="search-input__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              v-model="inputValue"
              type="text"
              placeholder="搜索电影、电视剧..."
              autocomplete="off"
              class="search-input__field"
            />
            <button
              v-show="inputValue"
              type="button"
              class="search-input__clear"
              aria-label="清除搜索内容"
              @click="clearQuery"
            >
              <svg
                class="search-input__clearIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div class="search-sections">
        <section v-if="showResultsSection" class="search-section">
          <div class="search-section__head">
            <div class="search-section__titleWrap">
              <h2 class="search-section__title">搜索结果</h2>
              <div v-if="progressText" class="search-section__statusMeta">{{ progressText }}</div>
            </div>
            <div v-if="showRawListToggle" class="search-section__toggle">
              <span class="search-section__toggleLabel">原始列表</span>
              <label class="search-switch" title="原始列表">
                <input v-model="rawListMode" type="checkbox" />
                <span class="search-switch__slider"></span>
              </label>
            </div>
          </div>

          <div v-if="summaryText" class="search-section__statusMeta">{{ summaryText }}</div>
          <div v-if="statusText" class="search-section__status" :class="{ 'search-section__status--error': hasError }">
            {{ statusText }}
          </div>

          <div v-if="displayedItems.length" class="search-results">
            <div
              v-for="item in displayedItems"
              :key="item.id"
              class="search-results__item"
            >
              <div
                class="media-card"
                role="link"
                tabindex="0"
                @click="openItem(item)"
                @contextmenu.prevent="openMatchBlockMenu($event, item)"
                @keydown.enter.prevent="openItem(item)"
                @keydown.space.prevent="openItem(item)"
              >
                <div class="media-card__poster" :class="{ 'media-card__poster--placeholder': !item.poster }">
                  <div class="media-card__hoverGradient"></div>
                  <div class="media-card__hoverPlay">
                    <div class="media-card__hoverPlayIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    </div>
                  </div>
                  <img
                    v-if="item.poster"
                    :src="displayPosterFor(item)"
                    :alt="item.title"
                    loading="lazy"
                  >
                  <span v-if="item.textBadge" class="media-card__badge">{{ item.textBadge }}</span>
                </div>
                <div class="media-card__title">{{ item.title }}</div>
                <div v-if="item.siteLabel" class="media-card__site">
                  <div class="media-card__siteLabel">{{ item.siteLabel }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="showHistorySection" class="search-section">
          <div class="search-section__head">
            <h2 class="search-section__title">搜索历史</h2>
            <div class="search-section__actions">
              <button type="button" class="search-link-danger" @click="clearHistoryItems">清空</button>
            </div>
          </div>
          <div class="search-history">
            <button
              v-for="item in historyItems"
              :key="item"
              type="button"
              class="search-history__chip"
              @click="searchFromHistory(item)"
            >{{ item }}</button>
          </div>
        </section>
      </div>
    </div>
    <div
      v-if="matchBlockMenu.open"
      ref="matchBlockMenuRef"
      class="search-matchblock-menu"
      :style="matchBlockMenuStyle"
      @click.stop
    >
      <button
        type="button"
        class="search-matchblock-menu__action"
        :class="{ 'search-matchblock-menu__action--danger': !matchBlockMenu.blocked }"
        :disabled="matchBlockMenu.busy"
        @click="toggleMatchBlockMenuItem"
      >
        {{ matchBlockMenuLabel }}
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import '../../shared/contextMenu.css';
import { rewriteDisplayPosterUrl } from '../../shared/posterUrl';
import { useSearchSession } from '../../shared/searchSession';
import {
  addSmartMatchBlockItem,
  deleteSmartMatchBlockItem,
  fetchBlockedMatchIndex,
} from '../../shared/searchRuntime';
import { normalizeString } from '../../shared/normalize';

const props = defineProps({
  bootstrap: { type: Object, default: () => ({}) },
  searchRequest: {
    type: Object,
    default: () => ({
      query: '',
      token: 0,
    }),
  },
});

const emit = defineEmits(['open-item']);
const externalToken = ref(0);
const matchBlockMenuRef = ref(null);
const {
  inputValue,
  activeQuery,
  rawListMode,
  historyItems,
  loading,
  errorText,
  hasError,
  displayedItems,
  showResultsSection,
  showHistorySection,
  showRawListToggle,
  progressText,
  summaryText,
  statusText,
  runtimeConfig,
  ensureConfig,
  ensureHistory,
  performSearch: performSearchSession,
  clearQuery: clearQuerySession,
  clearHistory: clearHistorySession,
} = useSearchSession();

const matchBlockedIndex = ref({});
const matchBlockMenu = ref({
  open: false,
  x: 0,
  y: 0,
  busy: false,
  blocked: false,
  item: null,
});

const displayPosterFor = (item) => rewriteDisplayPosterUrl(item && item.poster, runtimeConfig.value || {});

const matchBlockMenuLabel = computed(() => {
  if (matchBlockMenu.value.busy) return '处理中...';
  return matchBlockMenu.value.blocked ? '取消匹配禁用' : '加入匹配禁用';
});

const matchBlockMenuStyle = computed(() => ({
  left: `${Math.max(8, Number(matchBlockMenu.value.x) || 0)}px`,
  top: `${Math.max(8, Number(matchBlockMenu.value.y) || 0)}px`,
}));

const getAggregateRules = () =>
  runtimeConfig.value && Array.isArray(runtimeConfig.value.aggregateRules) ? runtimeConfig.value.aggregateRules : [];

const closeMatchBlockMenu = () => {
  matchBlockMenu.value = {
    open: false,
    x: 0,
    y: 0,
    busy: false,
    blocked: false,
    item: null,
  };
};

const loadMatchBlockedIndex = async () => {
  const keyword = normalizeString(activeQuery.value);
  if (!keyword) {
    matchBlockedIndex.value = {};
    return matchBlockedIndex.value;
  }
  const next = await fetchBlockedMatchIndex(keyword, getAggregateRules()).catch(() => ({}));
  matchBlockedIndex.value = next && typeof next === 'object' ? next : {};
  return matchBlockedIndex.value;
};

const isItemMatchBlocked = (item) => {
  const current = item && typeof item === 'object' ? item : null;
  if (!current || current.sourceKind !== 'site' || current.aggregateKind) return false;
  const siteKey = normalizeString(current.siteKey);
  const siteDetail = normalizeString(current.siteDetail);
  if (!siteKey || !siteDetail) return false;
  const entry = matchBlockedIndex.value && typeof matchBlockedIndex.value === 'object'
    ? matchBlockedIndex.value[`${siteKey}::${siteDetail}`]
    : null;
  return !!(entry && entry.blockAll);
};

const buildMatchBlockedEntryKey = (siteKey, siteDetail) => {
  const safeSiteKey = normalizeString(siteKey);
  const safeSiteDetail = normalizeString(siteDetail);
  if (!safeSiteKey || !safeSiteDetail) return '';
  return `${safeSiteKey}::${safeSiteDetail}`;
};

const applyMatchBlockedIndexMutation = (payload, blocked) => {
  const current = matchBlockedIndex.value && typeof matchBlockedIndex.value === 'object'
    ? { ...matchBlockedIndex.value }
    : {};
  const entryKey = buildMatchBlockedEntryKey(payload && payload.siteKey, payload && payload.siteDetail);
  if (!entryKey) {
    matchBlockedIndex.value = current;
    return current;
  }
  if (blocked) {
    current[entryKey] = {
      ...(current[entryKey] && typeof current[entryKey] === 'object' ? current[entryKey] : {}),
      blockAll: true,
      siteKey: normalizeString(payload && payload.siteKey),
      siteDetail: normalizeString(payload && payload.siteDetail),
      spiderApi: normalizeString(payload && payload.spiderApi),
      poster: normalizeString(payload && payload.poster),
    };
  } else {
    delete current[entryKey];
  }
  matchBlockedIndex.value = current;
  return current;
};

const openMatchBlockMenu = async (event, item) => {
  const current = item && typeof item === 'object' ? item : null;
  if (!current || current.sourceKind !== 'site' || current.aggregateKind) {
    closeMatchBlockMenu();
    return;
  }
  const keyword = normalizeString(activeQuery.value);
  const siteKey = normalizeString(current.siteKey);
  const siteDetail = normalizeString(current.siteDetail);
  if (!keyword || !siteKey || !siteDetail) {
    closeMatchBlockMenu();
    return;
  }
  matchBlockMenu.value = {
    open: true,
    x: event && typeof event.clientX === 'number' ? event.clientX : 0,
    y: event && typeof event.clientY === 'number' ? event.clientY : 0,
    busy: false,
    blocked: isItemMatchBlocked(current),
    item: current,
  };
};

const toggleMatchBlockMenuItem = async () => {
  const current = matchBlockMenu.value.item && typeof matchBlockMenu.value.item === 'object'
    ? matchBlockMenu.value.item
    : null;
  const keyword = normalizeString(activeQuery.value);
  if (!current || !keyword || matchBlockMenu.value.busy) return;
  const nextBlocked = !matchBlockMenu.value.blocked;
  const payload = {
    keyword,
    siteKey: normalizeString(current.siteKey),
    spiderApi: normalizeString(current.spiderApi),
    siteDetail: normalizeString(current.siteDetail),
    poster: normalizeString(current.poster),
  };
  if (!payload.siteKey || !payload.siteDetail) return;
  matchBlockMenu.value = { ...matchBlockMenu.value, busy: true };
  try {
    if (matchBlockMenu.value.blocked) {
      await deleteSmartMatchBlockItem(payload);
    } else {
      await addSmartMatchBlockItem(payload);
    }
    applyMatchBlockedIndexMutation(payload, nextBlocked);
    try {
      window.dispatchEvent(new CustomEvent('tv:smart-matchblock-updated', { detail: { keyword, payload, blocked: nextBlocked } }));
    } catch (_error) {}
  } finally {
    closeMatchBlockMenu();
  }
};

const handleDocumentPointer = (event) => {
  const menuEl = matchBlockMenuRef.value;
  const target = event && event.target ? event.target : null;
  if (menuEl && target && typeof menuEl.contains === 'function' && menuEl.contains(target)) return;
  closeMatchBlockMenu();
};

const handleWindowEscape = (event) => {
  if (event && event.key === 'Escape') closeMatchBlockMenu();
};

const handleSmartMatchBlockUpdated = async (event) => {
  const updatedKeyword = normalizeString(event && event.detail && event.detail.keyword);
  const activeKeyword = normalizeString(activeQuery.value);
  if (updatedKeyword && activeKeyword && updatedKeyword !== activeKeyword) return;
  const payload = event && event.detail && event.detail.payload && typeof event.detail.payload === 'object'
    ? event.detail.payload
    : null;
  const blocked = !!(event && event.detail && event.detail.blocked);
  if (payload) {
    applyMatchBlockedIndexMutation(payload, blocked);
  }
};

const performSearch = async (query, { saveHistoryEnabled = true } = {}) => {
  await performSearchSession(query, props.bootstrap, { saveHistoryEnabled });
  await loadMatchBlockedIndex();
};

const submitSearch = async () => {
  await performSearch(inputValue.value, { saveHistoryEnabled: true });
};

const clearQuery = async () => {
  await clearQuerySession();
};

const searchFromHistory = async (keyword) => {
  await performSearch(keyword, { saveHistoryEnabled: true });
};

const clearHistoryItems = async () => {
  await clearHistorySession();
};

const openItem = (item) => {
  const current = item && typeof item === 'object' ? item : null;
  if (!current) return;
  const activeKeyword = normalizeString(activeQuery.value);
  const playTitle = current.title ? String(current.title) : '';
  const playSearchOriginal = normalizeString(playTitle);
  const displayRemark = normalizeString(current.textBadge);
  if (current.sourceKind === 'site') {
    emit('open-item', {
      sourceKind: 'site',
      isTmdbMode: false,
      contentKey: current.contentKey ? String(current.contentKey) : '',
      title: playTitle,
      poster: current.poster ? String(current.poster) : '',
      remark: displayRemark,
      siteKey: current.siteKey ? String(current.siteKey) : '',
      siteName: current.siteName ? String(current.siteName) : '',
      spiderApi: current.spiderApi ? String(current.spiderApi) : '',
      siteDetail: current.siteDetail ? String(current.siteDetail) : '',
      tmdbId: 0,
      tmdbType: '',
    });
    return;
  }
  emit('open-item', {
    sourceKind: 'tmdb',
    isTmdbMode: true,
    contentKey: current.contentKey ? String(current.contentKey) : (current.id ? String(current.id) : ''),
    title: playTitle,
    poster: current.poster ? String(current.poster) : '',
    remark: displayRemark,
    tmdbId: current.tmdbId,
    tmdbType: current.tmdbType,
    searchQueryOriginal: playSearchOriginal || activeKeyword,
  });
};

watch(
  () => props.searchRequest,
  async (value) => {
    const token = Number.isFinite(Number(value && value.token)) ? Number(value.token) : 0;
    if (token <= 0 || token === externalToken.value) return;
    const keyword = value && typeof value.query === 'string' ? value.query : '';
    externalToken.value = token;
    await performSearch(keyword, { saveHistoryEnabled: true });
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  try {
    await ensureConfig(props.bootstrap);
  } catch (error) {
    errorText.value = `搜索配置加载失败：${error && error.message ? error.message : '未知错误'}`;
  }
  await ensureHistory();
  document.addEventListener('click', handleDocumentPointer, true);
  window.addEventListener('keydown', handleWindowEscape);
  window.addEventListener('scroll', handleDocumentPointer, { passive: true });
  window.addEventListener('resize', handleDocumentPointer, { passive: true });
  window.addEventListener('tv:smart-matchblock-updated', handleSmartMatchBlockUpdated);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentPointer, true);
  window.removeEventListener('keydown', handleWindowEscape);
  window.removeEventListener('scroll', handleDocumentPointer);
  window.removeEventListener('resize', handleDocumentPointer);
  window.removeEventListener('tv:smart-matchblock-updated', handleSmartMatchBlockUpdated);
});

watch(activeQuery, async () => {
  closeMatchBlockMenu();
  if (!normalizeString(activeQuery.value)) {
    matchBlockedIndex.value = {};
  }
});
</script>

<style>
.search-page {
  margin-bottom: 3.5rem;
}

@media (min-width: 768px) {
  .search-page {
    margin-bottom: 0;
  }
}

.search-page__content {
  margin-bottom: 40px;
  overflow: visible;
}

.search-hero {
  margin-bottom: 32px;
}

.search-form {
  max-width: 42rem;
  margin: 0 auto;
}

.search-input {
  position: relative;
}

.search-input__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 20px;
  height: 20px;
  transform: translateY(-50%);
  color: rgba(156, 163, 175, 1);
}

.search-input__field {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  padding: 12px 48px 12px 40px;
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.6);
  color: rgba(55, 65, 81, 1);
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.search-input__field:focus {
  outline: none;
  border-color: rgba(52, 211, 153, 1);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.25), 0 10px 20px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.search-input__field::placeholder {
  color: rgba(156, 163, 175, 1);
}

.search-input__clear {
  appearance: none;
  -webkit-appearance: none;
  position: absolute;
  right: 12px;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateY(-50%);
  color: rgba(156, 163, 175, 1);
  cursor: pointer;
  transition: color 0.15s ease;
}

.search-input__clear:hover {
  color: rgba(75, 85, 99, 1);
}

.search-input__clearIcon {
  width: 20px;
  height: 20px;
}

.search-sections {
  max-width: 95%;
  margin: 24px auto 0;
  overflow: visible;
}

.search-section {
  margin-bottom: 2rem;
}

.search-section__head {
  justify-content: space-between;
}

.search-section__statusMeta {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
}

.dark .search-section__statusMeta {
  color: rgba(255, 255, 255, 0.65);
}

.search-section__titleWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.search-section__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-section__toggleLabel {
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
}

.dark .search-section__toggleLabel {
  color: rgba(255, 255, 255, 0.65);
}

.search-section__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-section__status {
  text-align: center;
  color: rgba(107, 114, 128, 1);
  padding: 24px 0;
}

.search-section__status--error {
  color: #ef4444;
}

.search-results {
  padding: 0 1rem 2rem;
}

.search-results__item {
  width: 100%;
}

@media (max-width: 640px) {
  .search-results {
    gap: 1.5rem 1rem;
    padding: 0 0.5rem 1.5rem;
  }
}

.search-history {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.search-history__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.625rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(229, 231, 235, 0.75);
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.2;
  box-shadow: 0 10px 28px rgba(148, 163, 184, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.search-history__chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(148, 163, 184, 0.18);
  border-color: rgba(167, 243, 208, 1);
}

.search-link-danger {
  appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ef4444;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  cursor: pointer;
}

.search-link-danger:hover {
  color: #dc2626;
}

.search-switch {
  position: relative;
  display: inline-flex;
  width: 44px;
  height: 24px;
  align-items: center;
}

.search-switch input {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.search-switch__slider {
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(203, 213, 225, 0.9);
  position: relative;
  transition: background-color 0.2s ease;
}

.search-switch__slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.15);
  transition: transform 0.2s ease;
}

.search-switch input:checked + .search-switch__slider {
  background: rgba(52, 211, 153, 1);
}

.search-switch input:checked + .search-switch__slider::after {
  transform: translateX(20px);
}
</style>
