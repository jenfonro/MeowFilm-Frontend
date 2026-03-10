<template>
  <main
    id="homePage"
    class="home-page"
  >
    <div class="home-page__content">
      <div class="home-seg-toggle">
        <div class="home-seg-toggle__track">
          <button
            type="button"
            class="home-seg-toggle__btn"
            :class="{ 'home-seg-toggle__btn--active': modeResolved === 'home' }"
            @click="emit('change-mode', 'home')"
          >首页</button>
          <button
            type="button"
            class="home-seg-toggle__btn"
            :class="{ 'home-seg-toggle__btn--active': modeResolved === 'favorites' }"
            @click="emit('change-mode', 'favorites')"
          >收藏夹</button>
        </div>
      </div>

      <template v-if="modeResolved === 'home'">
      <section
        v-for="section in homeSections"
        :key="section.key"
        class="home-section"
      >
        <div class="home-section__head">
          <h2 class="home-section__title">{{ section.title }}</h2>
          <button
            v-show="section.showMore !== false"
            type="button"
            class="home-section__more"
            @click="emitSectionMore(section)"
          >查看更多</button>
        </div>
        <div class="home-scroll">
          <div v-if="section.loading" class="home-scroll__row home-scroll__row--empty">
            <div class="home-empty">{{ section.loadingText }}</div>
          </div>
          <div
            v-else-if="section.items.length"
            class="home-scroll__track"
          >
            <div
              class="home-scroll__control home-scroll__control--left"
              v-if="rowControls[section.key] && rowControls[section.key].canScrollLeft"
            >
              <div class="home-scroll__controlInner">
                <button type="button" class="home-scroll__btn" aria-label="向左滚动" @click="scrollRowBy(section.key, -1000)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
              </div>
            </div>
            <div :ref="ensureRowRefSetter(section.key)" class="home-scroll__row">
              <div
                v-for="item in section.items"
                :key="item.id"
                class="media-card media-card--rail"
                role="link"
                tabindex="0"
                @click.capture="openHomeCard(section, item, $event)"
                @contextmenu.prevent="section.key === 'history' ? openHistoryContextMenu($event, item) : null"
                @keydown.enter.prevent="openHomeCard(section, item)"
                @keydown.space.prevent="openHomeCard(section, item)"
              >
                <div
                  class="media-card__poster"
                  :class="{ 'media-card__poster--placeholder': !item.poster }"
                >
                  <div class="media-card__hoverGradient"></div>
                  <div class="media-card__hoverPlay">
                    <div class="media-card__hoverPlayIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    </div>
                  </div>
                  <a
                    v-if="item.detailUrl"
                    class="media-card__linkBadge"
                    :href="item.detailUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="打开豆瓣详情页"
                    @click.stop
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </a>
                  <img
                    v-if="item.poster"
                    :src="item.poster"
                    :alt="item.title || section.title"
                    loading="lazy"
                  >
                  <span v-if="item.scoreBadge" class="media-card__scoreBadge">{{ item.scoreBadge }}</span>
                  <span v-else-if="item.textBadge" class="media-card__badge">{{ item.textBadge }}</span>
                </div>
                <div class="media-card__title">{{ item.title }}</div>
                <div v-if="item.siteLabel" class="media-card__site">
                  <div class="media-card__siteLabel">{{ item.siteLabel }}</div>
                </div>
              </div>
            </div>
            <div
              class="home-scroll__control home-scroll__control--right"
              v-if="rowControls[section.key] && rowControls[section.key].canScrollRight"
            >
              <div class="home-scroll__controlInner">
                <button type="button" class="home-scroll__btn" aria-label="向右滚动" @click="scrollRowBy(section.key, 1000)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="home-scroll__row home-scroll__row--empty">
            <div class="home-empty">{{ section.emptyText }}</div>
          </div>
        </div>
      </section>
      </template>

      <section v-else class="home-section">
        <div class="home-section__head">
          <h2 class="home-section__title">收藏夹</h2>
        </div>
        <div class="home-section__body">
          <div class="home-grid home-grid--empty">
            <div class="home-empty">暂无收藏</div>
          </div>
        </div>
      </section>
    </div>
    <div
      v-if="historyContextMenu.open"
      class="search-matchblock-menu"
      :style="historyContextMenuStyle"
      @click.stop
    >
      <button
        type="button"
        class="search-matchblock-menu__action search-matchblock-menu__action--danger"
        :disabled="historyContextMenu.busy"
        @click="deleteHistoryContextMenuItem"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="M19 6l-1 14H6L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
        </svg>
        <span>{{ historyContextMenu.busy ? '删除中...' : '删除' }}</span>
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import '../../shared/contextMenu.css';
import { requestCatSpider } from '../../shared/catpawrunner';
import { buildDoubanDataUrl as buildSharedDoubanDataUrl } from '../../shared/bootstrap';
import { normalizeImageUrl, rewriteDoubanImageUrl as rewriteSharedDoubanImageUrl } from '../../shared/doubanImage';
import { buildHomeCacheKey, ensureHomeCacheEntry, getHomeCacheEntry, resolveCachedHomeSections, setHomeCacheEntry } from '../../shared/homeRuntime';
import { deletePlayHistoryItem, ensurePlayHistoryItems, playHistoryListState } from '../../shared/playHistoryRuntime';
import { formatTMDBTVRemark } from '../../shared/tmdbBadge';

const props = defineProps({
  bootstrap: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'home' },
  source: { type: Object, default: () => ({ kind: 'douban', siteKey: '', siteName: '', siteApi: '' }) },
});

const emit = defineEmits(['change-mode', 'open-category', 'open-item']);

const modeResolved = computed(() => {
  if (props.mode === 'favorites') return 'favorites';
  return 'home';
});

const historyItems = computed(() => {
  const list = Array.isArray(playHistoryListState.items) ? playHistoryListState.items : [];
  return list.slice(0, 12);
});
const historyLoading = computed(() => !!playHistoryListState.loading);
const historyError = computed(() => playHistoryListState.error || '');
const historyContextMenu = ref({
  open: false,
  x: 0,
  y: 0,
  busy: false,
  item: null,
});
const rowElements = Object.create(null);
const rowRefSetters = Object.create(null);
const rowControls = ref({});
let rowResizeObserver = null;
const doubanSections = [
  { key: 'movie', title: '热门电影', kind: 'movie', category: '热门', type: '全部' },
  { key: 'tv', title: '热门剧集', kind: 'tv', category: 'tv', type: 'tv' },
  { key: 'anime', title: '新番放送', kind: 'tv', category: 'tv', type: 'tv_animation' },
  { key: 'show', title: '热门综艺', kind: 'tv', category: 'show', type: 'show' },
];
const sourceSectionStates = ref([]);
let siteHomeLoadSeq = 0;

const normalizeHistoryCard = (item) => {
  const title = item && item.videoTitle ? String(item.videoTitle) : '未命名内容';
  const poster = item && item.videoPoster ? String(item.videoPoster) : '';
  const isTmdb = isTmdbHistoryItem(item);
  const tmdbParsed = parseTmdbFromContentKey(item && item.contentKey ? String(item.contentKey) : '');
  const rawRemark = item && item.videoRemark ? String(item.videoRemark) : '';
  const textBadge = isTmdb && tmdbParsed.tmdbType === 'tv'
    ? formatTMDBTVRemark({
        badge: rawRemark,
        title,
      }) || rawRemark
    : rawRemark;
  const itemKey = item && (item.contentKey || `${item.siteKey || 'tmdb'}:${item.videoId || item.tmdbId || title}`)
    ? String(item.contentKey || `${item.siteKey || 'tmdb'}:${item.videoId || item.tmdbId || title}`)
    : title;
  return {
    id: itemKey,
    title,
    poster,
    detailUrl: '',
    scoreBadge: '',
    textBadge,
    siteLabel: !isTmdb && item && item.siteName ? String(item.siteName) : '',
    rawSiteKey: item && item.siteKey ? String(item.siteKey) : '',
    rawSpiderApi: item && item.spiderApi ? String(item.spiderApi) : '',
    rawVideoId: item && item.videoId ? String(item.videoId) : '',
    rawContentKey: item && item.contentKey ? String(item.contentKey) : '',
  };
};

const normalizeDoubanCard = (sectionKey, item, sectionTitle) => ({
  id: `${sectionKey}:${item && item.id ? String(item.id) : item && item.title ? String(item.title) : sectionTitle}`,
  title: item && item.title ? String(item.title) : '未命名内容',
  poster: item && item.poster ? String(item.poster) : '',
  detailUrl: item && item.detailUrl ? String(item.detailUrl) : '',
  scoreBadge: item && item.badge ? String(item.badge) : '',
  textBadge: '',
  siteLabel: '',
});

const sourceResolved = computed(() => {
  const input = props.source && typeof props.source === 'object' ? props.source : {};
  const kind = input.kind === 'site' ? 'site' : 'douban';
  return {
    kind,
    siteKey: typeof input.siteKey === 'string' ? input.siteKey.trim() : '',
    siteName: typeof input.siteName === 'string' ? input.siteName.trim() : '',
    siteApi: typeof input.siteApi === 'string' ? input.siteApi.trim() : '',
  };
});

const homeSections = computed(() => {
  const historyItemsResolved = historyItems.value.map((item) => normalizeHistoryCard(item));
  const historySection = historyLoading.value || historyItemsResolved.length
      ? {
        key: 'history',
        title: '继续观看',
        loading: historyLoading.value,
        loadingText: '加载历史记录中...',
        items: historyItemsResolved,
        emptyText: '',
        showMore: true,
      }
    : null;
  const sourceSections = sourceSectionStates.value;
  return historySection ? [historySection, ...sourceSections] : sourceSections;
});

const historyContextMenuStyle = computed(() => ({
  left: `${Math.max(8, Number(historyContextMenu.value.x) || 0)}px`,
  top: `${Math.max(8, Number(historyContextMenu.value.y) || 0)}px`,
}));

const closeHistoryContextMenu = () => {
  historyContextMenu.value = {
    open: false,
    x: 0,
    y: 0,
    busy: false,
    item: null,
  };
};

const openHistoryContextMenu = (event, item) => {
  const currentItem = item && typeof item === 'object' ? item : null;
  if (!currentItem) {
    closeHistoryContextMenu();
    return;
  }
  const contentKey = currentItem.rawContentKey ? String(currentItem.rawContentKey).trim() : '';
  const siteKey = currentItem.rawSiteKey ? String(currentItem.rawSiteKey).trim() : '';
  const videoId = currentItem.rawVideoId ? String(currentItem.rawVideoId).trim() : '';
  if (!contentKey && (!siteKey || !videoId)) {
    closeHistoryContextMenu();
    return;
  }
  historyContextMenu.value = {
    open: true,
    x: event && typeof event.clientX === 'number' ? event.clientX : 0,
    y: event && typeof event.clientY === 'number' ? event.clientY : 0,
    busy: false,
    item: currentItem,
  };
};

const deleteHistoryContextMenuItem = async () => {
  const currentItem = historyContextMenu.value.item && typeof historyContextMenu.value.item === 'object'
    ? historyContextMenu.value.item
    : null;
  if (!currentItem || historyContextMenu.value.busy) return;
  historyContextMenu.value = {
    ...historyContextMenu.value,
    busy: true,
  };
  try {
    await deletePlayHistoryItem({
      contentKey: currentItem.rawContentKey ? String(currentItem.rawContentKey) : '',
      siteKey: currentItem.rawSiteKey ? String(currentItem.rawSiteKey) : '',
      videoId: currentItem.rawVideoId ? String(currentItem.rawVideoId) : '',
    });
  } catch (_error) {
    // ignore
  } finally {
    closeHistoryContextMenu();
  }
};

const handleHistoryContextPointer = (event) => {
  const target = event && event.target ? event.target : null;
  if (target && target.closest && target.closest('.search-matchblock-menu')) return;
  closeHistoryContextMenu();
};

const handleHistoryContextEscape = (event) => {
  if (event && event.key === 'Escape') closeHistoryContextMenu();
};

const emitSectionMore = (section) => {
  const current = section && typeof section === 'object' ? section : null;
  if (!current) return;
  if (current.key === 'history') return;
  if (sourceResolved.value.kind === 'site') {
    emit('open-category', {
      sourceKind: 'site',
      siteKey: sourceResolved.value.siteKey,
      siteName: sourceResolved.value.siteName,
      siteApi: sourceResolved.value.siteApi,
      categoryId: current.categoryId ? String(current.categoryId) : '',
      categoryName: current.title ? String(current.title) : '',
      initialItems: Array.isArray(current.items) ? current.items.slice() : [],
      initialHasMore: true,
      initialPage: 1,
    });
    return;
  }
  const typeMap = {
    movie: 'movie',
    tv: 'tv',
    anime: 'anime',
    show: 'show',
  };
  const nextType = typeMap[current.key] || 'movie';
  emit('open-category', {
    sourceKind: 'douban',
    categoryType: nextType,
    initialItems: Array.isArray(current.items) ? current.items.slice() : [],
    initialHasMore: true,
    initialSeedCount: Array.isArray(current.items) ? current.items.length : 0,
  });
};

const openHomeCard = (section, item, event = null) => {
  closeHistoryContextMenu();
  const currentSection = section && typeof section === 'object' ? section : null;
  const currentItem = item && typeof item === 'object' ? item : null;
  if (!currentSection || !currentItem) return;
  const target = event && event.target && typeof event.target.closest === 'function' ? event.target : null;
  if (target && target.closest('.media-card__linkBadge')) return;
  if (currentSection.key === 'history') {
    const tmdbParsed = parseTmdbFromContentKey(currentItem.rawContentKey);
    const isTmdb = !!(tmdbParsed.tmdbType && tmdbParsed.tmdbId);
    emit('open-item', {
      sourceKind: isTmdb ? 'tmdb' : 'site',
      isTmdbMode: isTmdb,
      contentKey: currentItem.rawContentKey ? String(currentItem.rawContentKey) : '',
      title: currentItem.title ? String(currentItem.title) : '',
      poster: currentItem.poster ? String(currentItem.poster) : '',
      remark: currentItem.textBadge ? String(currentItem.textBadge) : '',
      siteKey: currentItem.rawSiteKey ? String(currentItem.rawSiteKey) : '',
      siteName: currentItem.siteLabel ? String(currentItem.siteLabel) : '',
      spiderApi: currentItem.rawSpiderApi ? String(currentItem.rawSpiderApi) : '',
      videoId: currentItem.rawVideoId ? String(currentItem.rawVideoId) : '',
      tmdbId: tmdbParsed.tmdbId,
      tmdbType: tmdbParsed.tmdbType,
    });
    return;
  }
  if (sourceResolved.value.kind === 'site') {
    emit('open-item', {
      sourceKind: 'site',
      isTmdbMode: false,
      contentKey: currentItem.rawContentKey ? String(currentItem.rawContentKey) : '',
      title: currentItem.title ? String(currentItem.title) : '',
      poster: currentItem.poster ? String(currentItem.poster) : '',
      remark: currentItem.textBadge ? String(currentItem.textBadge) : '',
      siteKey: currentItem.rawSiteKey ? String(currentItem.rawSiteKey) : '',
      siteName: currentItem.siteLabel ? String(currentItem.siteLabel) : sourceResolved.value.siteName,
      spiderApi: currentItem.rawSpiderApi ? String(currentItem.rawSpiderApi) : '',
      videoId: currentItem.rawVideoId ? String(currentItem.rawVideoId) : '',
    });
    return;
  }
  emit('open-item', {
    sourceKind: 'douban',
    isTmdbMode: false,
    contentKey: currentItem.rawContentKey ? String(currentItem.rawContentKey) : '',
    title: currentItem.title ? String(currentItem.title) : '',
  });
};

const homeSectionKeys = computed(() => homeSections.value.map((section) => section.key));

const ensureRowRefSetter = (key) => {
  const safeKey = typeof key === 'string' ? key.trim() : '';
  if (!safeKey) return null;
  if (!rowRefSetters[safeKey]) {
    rowRefSetters[safeKey] = (el) => {
      if (el) rowElements[safeKey] = el;
      else delete rowElements[safeKey];
    };
  }
  return rowRefSetters[safeKey];
};

const getRowElement = (key) => {
  const safeKey = typeof key === 'string' ? key.trim() : '';
  return safeKey ? rowElements[safeKey] || null : null;
};

const syncRowControlKeys = () => {
  const nextKeys = new Set(homeSectionKeys.value);
  Object.keys(rowElements).forEach((key) => {
    if (!nextKeys.has(key)) delete rowElements[key];
  });
  const next = {};
  nextKeys.forEach((key) => {
    const current = rowControls.value[key];
    next[key] = current && typeof current === 'object'
      ? {
          canScrollLeft: !!current.canScrollLeft,
          canScrollRight: !!current.canScrollRight,
        }
      : { canScrollLeft: false, canScrollRight: false };
  });
  rowControls.value = next;
};

const syncRowControls = (key) => {
  const safeKey = typeof key === 'string' ? key.trim() : '';
  if (!safeKey) return;
  const el = getRowElement(key);
  const current = rowControls.value[safeKey] || { canScrollLeft: false, canScrollRight: false };
  if (!el) {
    if (!current.canScrollLeft && !current.canScrollRight) return;
    rowControls.value = {
      ...rowControls.value,
      [safeKey]: { canScrollLeft: false, canScrollRight: false },
    };
    return;
  }
  const threshold = 1;
  const canScrollRight = el.scrollWidth - (el.scrollLeft + el.clientWidth) > threshold;
  const canScrollLeft = el.scrollLeft > threshold;
  if (current.canScrollLeft === canScrollLeft && current.canScrollRight === canScrollRight) return;
  rowControls.value = {
    ...rowControls.value,
    [safeKey]: { canScrollLeft, canScrollRight },
  };
};

const scrollRowBy = (key, delta) => {
  const el = getRowElement(key);
  if (!el) return;
  el.scrollBy({ left: delta, behavior: 'smooth' });
};

const bindRowElement = (key, el) => {
  if (!el || el.dataset.scrollBound === '1') return;
  el.dataset.scrollBound = '1';
  el.addEventListener('scroll', () => syncRowControls(key), { passive: true });
  if (rowResizeObserver) rowResizeObserver.observe(el);
};

const bindAndSyncRow = (key) => {
  const el = getRowElement(key);
  bindRowElement(key, el);
  syncRowControls(key);
};

const bindAndSyncVisibleRows = async () => {
  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  syncRowControlKeys();
  homeSectionKeys.value.forEach((key) => bindAndSyncRow(key));
};

const normalizeHistoryItems = (payload) => {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((item) => ({
      contentKey: item && item.contentKey ? String(item.contentKey) : '',
      siteKey: item && item.siteKey ? String(item.siteKey) : '',
      siteName: item && item.siteName ? String(item.siteName) : '',
      spiderApi: item && item.spiderApi ? String(item.spiderApi) : '',
      videoId: item && item.videoId ? String(item.videoId) : '',
      tmdbId: item && item.tmdbId != null ? String(item.tmdbId) : '',
      videoTitle: item && item.videoTitle ? String(item.videoTitle) : '',
      videoPoster: item && item.videoPoster ? String(item.videoPoster) : '',
      videoRemark: item && item.videoRemark ? String(item.videoRemark) : '',
    }))
    .filter((item) => item.videoTitle);
};

const isTmdbHistoryItem = (item) => {
  if (!item || typeof item !== 'object') return false;
  const contentKey = typeof item.contentKey === 'string' ? item.contentKey.trim().toLowerCase() : '';
  return contentKey.startsWith('tmdb');
};

const parseTmdbFromContentKey = (contentKey) => {
  const raw = typeof contentKey === 'string' ? contentKey.trim().toLowerCase() : '';
  const match = raw.match(/^tmdb:(movie|tv):(\d+)$/);
  if (!match) return { tmdbType: '', tmdbId: '' };
  return {
    tmdbType: match[1] ? String(match[1]) : '',
    tmdbId: match[2] ? String(match[2]) : '',
  };
};

const readHomeSettings = () => {
  const settings = props.bootstrap && typeof props.bootstrap === 'object' && props.bootstrap.settings && typeof props.bootstrap.settings === 'object'
    ? props.bootstrap.settings
    : {};
  return {
    catpawrunnerApiBase: typeof settings.catpawrunnerApiBase === 'string' ? settings.catpawrunnerApiBase.trim() : '',
    doubanDataProxy: typeof settings.doubanDataProxy === 'string' ? settings.doubanDataProxy.trim() : 'server-proxy',
    doubanDataCustom: typeof settings.doubanDataCustom === 'string' ? settings.doubanDataCustom.trim() : '',
    doubanImgProxy: typeof settings.doubanImgProxy === 'string' ? settings.doubanImgProxy.trim() : 'server-proxy',
    doubanImgCustom: typeof settings.doubanImgCustom === 'string' ? settings.doubanImgCustom.trim() : '',
  };
};

const buildDoubanDataUrl = (path) => {
  return buildSharedDoubanDataUrl(path, readHomeSettings()).url;
};

const rewriteDoubanImageUrl = (url) => {
  return rewriteSharedDoubanImageUrl(url, {
    mode: readHomeSettings().doubanImgProxy,
    custom: readHomeSettings().doubanImgCustom,
    defaultMode: 'server-proxy',
  });
};

const pickDoubanPoster = (item) => {
  if (!item || typeof item !== 'object') return '';
  const direct = [
    item.pic && item.pic.normal,
    item.pic && item.pic.large,
    item.cover && item.cover.url,
    item.cover_url,
    item.poster,
    item.image,
  ];
  const hit = direct.find((value) => typeof value === 'string' && value.trim());
  return rewriteDoubanImageUrl(hit || '');
};

const pickDoubanBadge = (item) => {
  if (!item || typeof item !== 'object') return '';
  const ratingValue = item.rating && item.rating.value != null ? String(item.rating.value).trim() : '';
  if (ratingValue && ratingValue !== '0') return ratingValue;
  return '';
};

const buildDoubanDetailUrl = (item) => {
  if (!item || typeof item !== 'object') return '';
  const id = item.id != null ? String(item.id).trim() : '';
  if (!id) return '';
  return `https://movie.douban.com/subject/${encodeURIComponent(id)}`;
};

const normalizeDoubanSectionItems = (payload) => {
  const list = payload && Array.isArray(payload.items) ? payload.items : [];
  return list
    .map((item) => ({
      id: item && item.id != null ? String(item.id) : '',
      title: item && item.title ? String(item.title).trim() : '',
      poster: pickDoubanPoster(item),
      badge: pickDoubanBadge(item),
      detailUrl: buildDoubanDetailUrl(item),
    }))
    .filter((item) => item.title);
};

const normalizeSiteClasses = (data) => {
  const cls = data && Array.isArray(data.class) ? data.class : data && Array.isArray(data.classes) ? data.classes : [];
  return cls
    .map((c) => ({
      id: c && (c.type_id != null ? String(c.type_id) : c.tid != null ? String(c.tid) : ''),
      name: c && (c.type_name != null ? String(c.type_name) : c.name != null ? String(c.name) : ''),
    }))
    .filter((c) => c.id && c.name);
};

const normalizeSiteList = (data) => {
  const list = data && Array.isArray(data.list) ? data.list : [];
  return list
    .slice(0, 20)
    .map((it) => ({
      id: it && (it.vod_id != null ? String(it.vod_id) : it.id != null ? String(it.id) : ''),
      name: it && (it.vod_name != null ? String(it.vod_name) : it.name != null ? String(it.name) : ''),
      pic: it && (it.vod_pic != null ? String(it.vod_pic) : it.pic != null ? String(it.pic) : ''),
      remark: it && (it.vod_remarks != null ? String(it.vod_remarks) : it.remark != null ? String(it.remark) : ''),
    }))
    .filter((it) => it.name);
};

const normalizeSiteCard = (siteKey, categoryId, item) => ({
  id: `${siteKey}:${categoryId}:${item && item.id ? String(item.id) : item && item.name ? String(item.name) : ''}`,
  title: item && item.name ? String(item.name) : '未命名内容',
  poster: item && item.pic ? normalizeImageUrl(item.pic) : '',
  detailUrl: '',
  scoreBadge: '',
  textBadge: item && item.remark ? String(item.remark) : '',
  siteLabel: '',
  rawSiteKey: siteKey ? String(siteKey) : '',
  rawSpiderApi: sourceResolved.value.siteApi ? String(sourceResolved.value.siteApi) : '',
  rawVideoId: item && item.id ? String(item.id) : '',
});

const cloneSectionStates = (sections) => (
  Array.isArray(sections)
    ? sections.map((section) => ({
      ...(section && typeof section === 'object' ? section : {}),
      items: Array.isArray(section && section.items)
        ? section.items.map((item) => (item && typeof item === 'object' ? { ...item } : item))
        : [],
    }))
    : []
);

const applyHomeSections = (sections) => {
  sourceSectionStates.value = cloneSectionStates(sections);
};

const buildCurrentHomeCacheKey = () => buildHomeCacheKey({ source: sourceResolved.value });

const buildPendingHomeSections = () => {
  if (sourceResolved.value.kind === 'site') {
    const siteKey = sourceResolved.value.siteKey || 'site';
    return [{
      key: `site:${siteKey}:loading`,
      title: '',
      loading: true,
      loadingText: '加载中...',
      items: [],
      emptyText: '',
      showMore: false,
    }];
  }
  return doubanSections.map((section) => ({
    key: section.key,
    title: section.title,
    loading: true,
    loadingText: '加载中...',
    items: [],
    emptyText: '',
    showMore: true,
  }));
};

const buildErrorHomeSections = (message) => [{
  key: `${sourceResolved.value.kind || 'home'}:error`,
  title: '',
  loading: false,
  loadingText: '',
  items: [],
  emptyText: message || '加载失败',
  showMore: false,
}];

const loadSiteSectionCategoryRaw = async ({ apiBase, siteApi, siteKey, categoryId }) => {
  try {
    const resp = await requestCatSpider({
      apiBase,
      action: 'category',
      spiderApi: siteApi,
      payload: {
        id: categoryId,
        page: 1,
        filter: true,
        filters: {},
      },
      timeoutMs: 15000,
    });
    const items = normalizeSiteList(resp).map((item) => normalizeSiteCard(siteKey, categoryId, item));
    return {
      items,
      emptyText: items.length ? '暂无数据' : '暂无相关内容',
    };
  } catch (_err) {
    return {
      items: [],
      emptyText: '栏目加载失败',
    };
  }
};

const loadSiteHomeSectionsRaw = async () => {
  const source = sourceResolved.value;
  const settings = readHomeSettings();
  const apiBase = settings.catpawrunnerApiBase;
  if (source.kind !== 'site' || !source.siteKey || !source.siteApi) {
    return { sections: [] };
  }
  if (!apiBase) {
    return { sections: buildErrorHomeSections('catpawrunner 接口未配置') };
  }
  try {
    const homeResp = await requestCatSpider({
      apiBase,
      action: 'home',
      spiderApi: source.siteApi,
      payload: {},
      timeoutMs: 15000,
    });
    const classes = normalizeSiteClasses(homeResp);
    if (!classes.length) {
      return {
        sections: [{
          key: `site:${source.siteKey}:empty`,
          title: '',
          loading: false,
          loadingText: '',
          items: [],
          emptyText: '无分类数据',
          showMore: false,
        }],
      };
    }
    const tasks = classes.map(async (category) => {
      const current = await loadSiteSectionCategoryRaw({
        apiBase,
        siteApi: source.siteApi,
        siteKey: source.siteKey,
        categoryId: category.id,
      });
      return {
        key: `site:${source.siteKey}:${category.id}`,
        title: category.name,
        categoryId: category.id,
        loading: false,
        loadingText: '加载中...',
        items: current.items,
        emptyText: current.emptyText,
        showMore: true,
      };
    });
    const sections = await Promise.all(tasks);
    return { sections };
  } catch (_err) {
    return { sections: buildErrorHomeSections('站点首页加载失败') };
  }
};

const loadHistoryItems = async () => {
  await ensurePlayHistoryItems({ limit: 12 });
};

const loadDoubanSectionRaw = async (section) => {
  const key = section && section.key ? section.key : '';
  if (!key) return null;
  try {
    const path = `/rexxar/api/v2/subject/recent_hot/${encodeURIComponent(section.kind)}?start=0&limit=12&category=${encodeURIComponent(section.category)}&type=${encodeURIComponent(section.type)}`;
    const resp = await fetch(buildDoubanDataUrl(path), {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json, text/plain, */*' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return {
      key,
      title: section.title,
      loading: false,
      loadingText: '加载中...',
      items: normalizeDoubanSectionItems(data).map((item) => normalizeDoubanCard(key, item, section.title)),
      emptyText: '暂无数据',
      showMore: true,
    };
  } catch (_err) {
    return {
      key,
      title: section.title,
      loading: false,
      loadingText: '加载中...',
      items: [],
      emptyText: '栏目加载失败',
      showMore: true,
    };
  }
};

const loadDoubanSectionsRaw = async () => {
  const sections = await Promise.all(doubanSections.map((section) => loadDoubanSectionRaw(section)));
  return {
    sections: sections.filter(Boolean),
  };
};

const loadActiveHomeSourceWithCache = async () => {
  siteHomeLoadSeq += 1;
  const loadSeq = siteHomeLoadSeq;
  const cacheKey = buildCurrentHomeCacheKey();
  if (!cacheKey) {
    applyHomeSections([]);
    return;
  }
  const cached = ensureHomeCacheEntry(cacheKey);
  if (cached && Array.isArray(cached.sections) && cached.sections.length) {
    applyHomeSections(cached.sections);
    if (cached.status === 'resolved' || cached.status === 'error') return;
  } else {
    const pendingSections = buildPendingHomeSections();
    applyHomeSections(pendingSections);
    setHomeCacheEntry(cacheKey, {
      sourceKey: cacheKey,
      sections: pendingSections,
    });
  }
  const result = await resolveCachedHomeSections({
    key: cacheKey,
    loader: () => (sourceResolved.value.kind === 'site' ? loadSiteHomeSectionsRaw() : loadDoubanSectionsRaw()),
  });
  if (loadSeq !== siteHomeLoadSeq) return;
  const latest = getHomeCacheEntry(cacheKey) || result;
  applyHomeSections(latest && Array.isArray(latest.sections) ? latest.sections : []);
};

onMounted(() => {
  rowResizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    homeSectionKeys.value.forEach((key) => syncRowControls(key));
  }) : null;
  document.addEventListener('click', handleHistoryContextPointer, true);
  window.addEventListener('keydown', handleHistoryContextEscape);
  window.addEventListener('scroll', handleHistoryContextPointer, { passive: true });
  window.addEventListener('resize', handleHistoryContextPointer, { passive: true });
  window.addEventListener('resize', handleWindowResize, { passive: true });
  window.addEventListener('tv:play-history-updated', loadHistoryItems);
  void loadHistoryItems();
  void loadActiveHomeSourceWithCache();
});

const handleWindowResize = () => {
  homeSectionKeys.value.forEach((key) => syncRowControls(key));
};

watch(modeResolved, async (mode) => {
  if (mode !== 'home') return;
  await loadActiveHomeSourceWithCache();
  await bindAndSyncVisibleRows();
});

watch(sourceResolved, async () => {
  if (modeResolved.value !== 'home') return;
  await loadActiveHomeSourceWithCache();
  await bindAndSyncVisibleRows();
}, { deep: true });

watch(homeSections, async () => {
  if (modeResolved.value !== 'home') return;
  closeHistoryContextMenu();
  await bindAndSyncVisibleRows();
}, { flush: 'post' });

onBeforeUnmount(() => {
  document.removeEventListener('click', handleHistoryContextPointer, true);
  window.removeEventListener('keydown', handleHistoryContextEscape);
  window.removeEventListener('scroll', handleHistoryContextPointer);
  window.removeEventListener('resize', handleHistoryContextPointer);
  window.removeEventListener('resize', handleWindowResize);
  window.removeEventListener('tv:play-history-updated', loadHistoryItems);
  if (rowResizeObserver) {
    rowResizeObserver.disconnect();
    rowResizeObserver = null;
  }
});
</script>

<style>
.home-page {
  margin-bottom: 3.5rem;
}

@media (min-width: 768px) {
  .home-page {
    margin-bottom: 0;
    margin-top: 0;
  }
}

.home-seg-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.home-seg-toggle__track {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 9999px;
  background: rgba(209, 213, 219, 0.8);
}

.home-seg-toggle__btn {
  border: 0;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 9999px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.home-seg-toggle__btn--active {
  background: #fff;
  color: #111827;
}

.home-section {
  margin-bottom: 28px;
}

.home-section__more {
  border: 0;
  background: transparent;
  padding: 0;
  margin-left: auto;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s ease;
  text-align: right;
}

.home-section__more:hover {
  color: #374151;
}

.home-section__body {
  padding: 0 16px;
}

@media (min-width: 640px) {
  .home-section__body {
    padding: 0 24px;
  }
}

.home-scroll {
  position: relative;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .home-scroll {
    padding: 0 24px;
  }
}

.home-scroll__track {
  position: relative;
}

.home-scroll__row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.home-scroll__row::-webkit-scrollbar {
  display: none;
}

.home-scroll__row--empty {
  min-height: clamp(210px, 35vw, 380px);
  align-items: center;
  justify-content: center;
}

.home-scroll__control {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 64px;
  z-index: 600;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity .2s ease;
  pointer-events: none;
}

.home-scroll__track:hover .home-scroll__control,
.home-scroll__track:focus-within .home-scroll__control {
  opacity: 1;
  pointer-events: auto;
}

.home-scroll__control--left {
  left: 0;
}

.home-scroll__control--right {
  right: 0;
}

.home-scroll__controlInner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 40%;
  bottom: 60%;
  pointer-events: auto;
}

.home-scroll__control--left .home-scroll__controlInner {
  left: -4.5rem;
}

.home-scroll__control--right .home-scroll__controlInner {
  right: -4.5rem;
}

.home-scroll__btn {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  color: #4b5563;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform .2s ease, background-color .2s ease;
}

.home-scroll__btn svg {
  width: 24px;
  height: 24px;
}

.home-scroll__btn:hover {
  background: #ffffff;
  transform: scale(1.05);
}

@media (min-width: 640px) {
  .home-scroll__control {
    display: flex;
  }
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  min-height: 160px;
}

.home-grid--empty {
  place-items: center;
  background: rgba(241, 245, 249, 0.6);
  border-radius: 16px;
  padding: 32px;
}

.home-empty {
  color: #94a3b8;
  font-size: 0.95rem;
}

.dark .home-seg-toggle__track {
  background: rgba(30, 41, 59, 0.7);
}

.dark .home-seg-toggle__btn {
  color: rgba(226, 232, 240, 0.8);
}

.dark .home-seg-toggle__btn--active {
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
}

.dark .home-section__more {
  color: #8fa0b6;
}

.dark .home-section__more:hover {
  color: #c3cedd;
}

.dark .home-grid--empty {
  background: rgba(15, 23, 42, 0.6);
}

.dark .home-empty {
  color: rgba(226, 232, 240, 0.7);
}

.dark .home-scroll__btn {
  background: rgba(31, 41, 55, 0.9);
  border-color: rgba(75, 85, 99, 1);
  color: #d1d5db;
  box-shadow: none;
}

.dark .home-scroll__btn:hover {
  background: rgba(55, 65, 81, 1);
}
</style>
