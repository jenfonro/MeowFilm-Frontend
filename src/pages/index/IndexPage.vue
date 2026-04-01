<template>
  <div
    v-if="!bootstrap || !bootstrap.authenticated"
    class="index-login"
  >
    <div class="index-login__inner">
      <LoginPage :bootstrap="bootstrap || {}" />
    </div>
  </div>

  <div v-else class="index-shell">
    <!-- 桌面端右上角操作区 -->
    <div class="index-top-actions">
      <button class="index-top-btn" aria-label="切换主题" type="button" @click="toggleTheme">
        <svg
          class="index-top-icon index-top-icon--sun"
          :class="{ 'is-hidden': isDarkTheme }"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364-1.414 1.414M8.05 17.95l-1.414 1.414m12.728 0-1.414-1.414M8.05 6.05 6.636 4.636"></path></svg>
        <svg
          class="index-top-icon index-top-icon--moon"
          :class="{ 'is-hidden': !isDarkTheme }"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>
      </button>
      <div class="index-top-user">
        <button
          id="userMenuBtn"
          ref="desktopUserMenuBtnEl"
          class="index-top-btn"
          aria-label="用户菜单"
          type="button"
          @click.stop="toggleDesktopUserMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        <div
          id="userMenu"
          ref="desktopUserMenuEl"
          class="index-user-menu"
          :class="{ 'index-user-menu--open': desktopUserMenuOpen }"
        >
          <div class="index-user-menu__header">
            <div>
              <div class="index-user-menu__hint">当前用户</div>
              <div class="index-user-menu__name">{{ bootstrap.user.username }}</div>
            </div>
            <span class="index-user-menu__badge">{{
              bootstrap.user.role === 'admin' ? '管理员' : '用户'
            }}</span>
          </div>
          <a
            id="managePanelLink"
            class="index-user-menu__item"
            href="/dashboard"
            v-if="bootstrap.user.role === 'admin'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 7"></path><path d="M12 11l1.5 1.5"></path><rect width="18" height="11" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M3 11h11"></path></svg>
            <span>管理面板</span>
          </a>
          <div class="index-user-menu__divider"></div>
          <a class="index-user-menu__item index-user-menu__item--danger" href="/logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17h8"></path><path d="M13 7h8"></path><path d="M13 12h8"></path><path d="M3 7l6 5-6 5V7Z"></path></svg>
            <span>登出</span>
          </a>
          <div class="index-user-menu__footer">
            <div class="index-user-menu__meta">
              <span class="index-user-menu__meta-line">{{ appVersion }}</span>
              <span v-if="backendCommit && backendCommit !== appVersion" class="index-user-menu__meta-line">后端 {{ backendCommit }}</span>
              <span v-if="frontendCommit && frontendCommit !== appVersion" class="index-user-menu__meta-line">前端 {{ frontendCommit }}</span>
            </div>
            <span class="index-user-menu__dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端顶部栏 -->
    <header
      ref="mobileHeaderEl"
      class="index-mobile-header"
      style="padding-top:env(safe-area-inset-top)"
      v-show="!isPlayView"
    >
      <div class="index-mobile-header__bar">
        <div class="index-mobile-header__left">
          <button
            type="button"
            class="index-mobile-header__btn"
            aria-label="菜单"
            @click="toggleMobileMenu"
          >
            <svg class="index-mobile-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div class="index-mobile-header__right">
          <div class="index-mobile-header__spacer"></div>
          <div class="index-mobile-header__user">
            <button
              type="button"
              class="index-mobile-header__btn"
              aria-label="用户菜单"
              @click.stop="toggleMobileUserMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="index-mobile-header__icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
            <div
              v-show="mobileUserMenuOpen"
              class="index-mobile-user-menu"
            >
              <button
                type="button"
                class="index-mobile-user-item"
                @click="openUserSettings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
                <span>设置</span>
              </button>
              <a
                class="index-mobile-user-item index-mobile-user-item--danger"
                href="/logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17h8"></path><path d="M13 7h8"></path><path d="M13 12h8"></path><path d="M3 7l6 5-6 5V7Z"></path></svg>
                <span>登出</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="index-mobile-header__title">
        <button
          type="button"
          class="index-mobile-header__title-btn"
          @click="switchHome"
        >
          {{ mobileHeaderTitle }}
        </button>
      </div>
    </header>

    <div class="index-layout">
      <!-- 侧边栏：桌面固定 / 移动端抽屉 -->
      <div
        id="tvSidebarDrawer"
        class="index-sidebar-drawer"
        :class="{ 'is-open': mobileMenuOpen }"
      >
        <div class="index-sidebar-panel">
          <AppSidebar
            :bootstrap="bootstrap"
            :active-page="currentView"
            :douban-type="categoryType"
            :active-site-key="sidebarActiveSiteKey"
            site-nav-variant="index"
            show-site-nav-overlays
            @navigate="handleSidebarNavigate"
          />
        </div>
      </div>

      <div ref="indexMainEl" class="index-main">
        <div ref="indexContentEl" v-show="!isPlayView" class="index-content">
          <HomePage
            v-if="currentView === 'home'"
            :bootstrap="bootstrap"
            :mode="homeSection"
            :source="homeSource"
            @change-mode="handleHomeModeChange"
            @open-category="handleHomeOpenCategory"
            @open-item="handleCategoryOpenItem"
          />
          <SearchPage
            v-else-if="currentView === 'search'"
            :bootstrap="bootstrap"
            :search-request="searchRequest"
            @open-item="handleCategoryOpenItem"
          />
          <CategoryPage
            v-else-if="currentView === 'category'"
            :bootstrap="bootstrap"
            :category-type="categoryType"
            :source="categorySource"
            @back="handleCategoryBack"
            @open-item="handleCategoryOpenItem"
            @select-type="switchCategory"
          />
        </div>

        <PlayPage
          v-if="isPlayView"
          :key="playKey"
          :bootstrap="bootstrap"
          v-bind="playParams"
          @back="handlePlayBack"
        />
      </div>
    </div>

    <!-- 移动端底部导航 -->
    <div class="index-bottom">
      <nav id="homeMobileBottomNav" class="index-bottom-nav" style="bottom:0;padding-bottom:env(safe-area-inset-bottom)">
        <ul class="index-bottom-nav__list">
          <li class="index-bottom-nav__item">
            <button type="button" class="index-bottom-nav__btn" @click="switchHome">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="index-bottom-nav__icon" :class="mobileActiveTab === 'home' ? 'is-active' : ''"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              <span class="index-bottom-nav__label" :class="mobileActiveTab === 'home' ? 'is-active' : ''">首页</span>
            </button>
          </li>
          <li class="index-bottom-nav__item">
            <button type="button" class="index-bottom-nav__btn" @click="switchFavorites">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="index-bottom-nav__icon"
                :class="mobileActiveTab === 'favorites' ? 'is-active' : ''"
              ><path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18Z"></path></svg>
              <span class="index-bottom-nav__label" :class="mobileActiveTab === 'favorites' ? 'is-active' : ''">收藏</span>
            </button>
          </li>
          <li class="index-bottom-nav__item">
            <button type="button" class="index-bottom-nav__btn" @click="switchSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="index-bottom-nav__icon" :class="mobileActiveTab === 'search' ? 'is-active' : ''"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              <span class="index-bottom-nav__label" :class="mobileActiveTab === 'search' ? 'is-active' : ''">搜索</span>
            </button>
          </li>
          <li class="index-bottom-nav__item">
            <button type="button" class="index-bottom-nav__btn" @click="switchHistory">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="index-bottom-nav__icon" :class="mobileActiveTab === 'history' ? 'is-active' : ''"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              <span class="index-bottom-nav__label" :class="mobileActiveTab === 'history' ? 'is-active' : ''">历史</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <div id="adminPage" class="index-admin">
    <div class="index-admin__wrap">
      <aside class="index-admin__sidebar">
        <div class="index-admin__sidebar-title">管理面板</div>
        <nav class="index-admin__nav">
          <a data-admin="site" class="index-admin__nav-item" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>站点配置</span>
          </a>
          <a data-admin="user" class="index-admin__nav-item" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>用户管理</span>
          </a>
          <a data-admin="video" class="index-admin__nav-item" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg>
            <span>视频源管理</span>
          </a>
        </nav>
      </aside>
      <div class="index-admin__content">
        <div class="index-admin__topbar">
          <div class="index-admin__topbar-title">站点配置</div>
          <button id="adminBackBtn" class="index-admin__back">返回首页</button>
        </div>
        <div class="index-admin__panel">
          <section id="adminSite" class="index-admin__section">
            <h3 class="index-admin__section-title">站点信息</h3>
            <div class="index-admin__form">
              <div>
                <label class="index-admin__label">站点名称</label>
                <input class="index-admin__input" :placeholder="bootstrap.siteName" />
              </div>
              <div>
                <label class="index-admin__label">站点公告</label>
                <textarea rows="3" class="index-admin__textarea" placeholder="本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性负责。"></textarea>
              </div>
              <div>
                <label class="index-admin__label">豆瓣数据代理</label>
                <select class="index-admin__select">
                  <option>豆瓣 API By CMLiussss（腾讯云）</option>
                  <option>官方直连</option>
                  <option>自定义代理</option>
                </select>
                <p class="index-admin__hint">选择获取豆瓣数据的方式</p>
              </div>
              <div>
                <label class="index-admin__label">豆瓣图片代理</label>
                <select class="index-admin__select">
                  <option>豆瓣 CDN By CMLiussss（腾讯云）</option>
                  <option>官方直连</option>
                  <option>自定义代理</option>
                </select>
                <p class="index-admin__hint">选择获取豆瓣图片的方式</p>
              </div>
              <div>
                <label class="index-admin__label">搜索接口可拉取最大页数</label>
                <input class="index-admin__input" placeholder="5" />
              </div>
            </div>
          </section>
          <section id="adminUser" class="index-admin__section">
            <div class="index-admin__placeholder">用户管理内容占位</div>
          </section>
          <section id="adminVideo" class="index-admin__section">
            <div class="index-admin__placeholder">视频源管理内容占位</div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AppSidebar from '../../shared/AppSidebar.vue';
import HomePage from '../home/HomePage.vue';
import PlayPage from '../play/PlayPage.vue';
import SearchPage from '../search/SearchPage.vue';
import CategoryPage from '../category/CategoryPage.vue';
import LoginPage from '../login/LoginPage.vue';
import { clearCurrentPlaybackContext } from '../../shared/playbackRuntime';
import { clearActivePlayHistoryContext, flushHistoryProgressBestEffort } from '../../shared/playHistoryRuntime';

const props = defineProps({ bootstrap: { type: Object, required: true } });
const bootstrap = props.bootstrap;

const appVersion =
  (typeof window !== 'undefined' && window.__MEOWFILM_VERSION__) || 'beta';
const backendCommit =
  (typeof window !== 'undefined' && window.__MEOWFILM_BACKEND_COMMIT__) || appVersion;
const frontendCommit =
  (typeof window !== 'undefined' && window.__MEOWFILM_FRONTEND_COMMIT__) || appVersion;
const THEME_STORAGE_KEY = 'meowfilm_theme';
const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};

const isPlayView = ref(false);
const mobileHeaderEl = ref(null);
const indexMainEl = ref(null);
const indexContentEl = ref(null);
const desktopUserMenuBtnEl = ref(null);
const desktopUserMenuEl = ref(null);
const desktopUserMenuOpen = ref(false);
const isDarkTheme = ref(false);
const mobileMenuOpen = ref(false);
const mobileUserMenuOpen = ref(false);
const mobileActiveTab = ref('home');
const mobileContext = ref({ kind: 'home', siteName: '' });
const currentView = ref('home');
const homeSection = ref('home');
const categoryType = ref('movie');
const categorySource = ref({
  kind: 'douban',
  siteKey: '',
  siteName: '',
  siteApi: '',
  categoryId: '',
  categoryName: '',
  initialItems: [],
  initialHasMore: false,
  initialPage: 1,
  initialSeedCount: 0,
});
const homeSource = ref({
  kind: 'douban',
  siteKey: '',
  siteName: '',
  siteApi: '',
});

const playKey = ref(0);
const searchRequest = ref({
  query: '',
  token: 0,
});
const playParams = ref({
  isTmdbMode: false,
  contentKey: '',
  searchQueryOriginal: '',
  searchQueryCanonical: '',
  videoYear: '',
  searchType: '',
  siteKey: '',
  siteName: '',
  spiderApi: '',
  siteDetail: '',
  tmdbId: 0,
  tmdbType: '',
  videoIntro: '',
  Poster: '',
  Remark: '',
  switchOnlyToken: 0,
});

const mobileHeaderTitle = computed(() => {
  if (currentView.value === 'search') return '搜索';
  if (currentView.value === 'category') {
    if (categorySource.value.kind === 'site') {
      return categorySource.value.categoryName || categorySource.value.siteName || '分类';
    }
    if (categoryType.value === 'tv') return '剧集';
    if (categoryType.value === 'anime') return '动漫';
    if (categoryType.value === 'show') return '综艺';
    return '电影';
  }
  if (homeSection.value === 'favorites') return '收藏夹';
  if (currentView.value === 'home' && homeSource.value.kind === 'site' && homeSource.value.siteName) {
    return homeSource.value.siteName;
  }
  return (bootstrap && bootstrap.siteName ? String(bootstrap.siteName) : '').trim();
});

const sidebarActiveSiteKey = computed(() => {
  if (currentView.value === 'category' && categorySource.value.kind === 'site') {
    return typeof categorySource.value.siteKey === 'string' ? categorySource.value.siteKey : '';
  }
  if (currentView.value === 'home' && homeSource.value.kind === 'site') {
    return typeof homeSource.value.siteKey === 'string' ? homeSource.value.siteKey : '';
  }
  return '';
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
const toggleMobileUserMenu = () => {
  mobileUserMenuOpen.value = !mobileUserMenuOpen.value;
};
const toggleDesktopUserMenu = () => {
  desktopUserMenuOpen.value = !desktopUserMenuOpen.value;
};
const applyThemeState = (dark) => {
  isDarkTheme.value = !!dark;
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', !!dark);
  document.body.classList.toggle('dark', !!dark);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  } catch (_error) {}
};
const toggleTheme = () => {
  applyThemeState(!isDarkTheme.value);
};
const buildHomeIdentity = (source = {}) => {
  const resolved = source && typeof source === 'object' ? source : {};
  if (normalizeString(resolved.kind) === 'site') {
    const siteKey = normalizeString(resolved.siteKey);
    return siteKey ? `home:site:${siteKey}` : 'home:site';
  }
  return 'home:douban';
};
const buildCategoryIdentity = ({ source = {}, type = '' } = {}) => {
  const resolved = source && typeof source === 'object' ? source : {};
  if (normalizeString(resolved.kind) === 'site') {
    const siteKey = normalizeString(resolved.siteKey);
    const categoryId = normalizeString(resolved.categoryId);
    return `category:site:${siteKey}:${categoryId}`;
  }
  return `category:douban:${normalizeString(type) || 'movie'}`;
};
const getCurrentPageIdentity = () => {
  if (isPlayView.value) {
    const siteKey = normalizeString(playParams.value.siteKey);
    return siteKey ? `play:site:${siteKey}` : 'play';
  }
  if (currentView.value === 'search') return 'search';
  if (currentView.value === 'category') {
    return buildCategoryIdentity({
      source: categorySource.value,
      type: categoryType.value,
    });
  }
  if (currentView.value === 'home') {
    if (homeSection.value === 'favorites') return 'home:favorites';
    return buildHomeIdentity(homeSource.value);
  }
  return '';
};
const isScrollableElement = (el) => {
  if (!el || typeof window === 'undefined' || !(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  const overflowY = `${style.overflowY || ''}`.toLowerCase();
  const overflow = `${style.overflow || ''}`.toLowerCase();
  const canScrollByStyle = ['auto', 'scroll', 'overlay'].includes(overflowY) || ['auto', 'scroll', 'overlay'].includes(overflow);
  return canScrollByStyle && el.scrollHeight > el.clientHeight + 4;
};
const collectScrollTargets = () => {
  const targets = [];
  const pushTarget = (el) => {
    if (!el) return;
    if (targets.includes(el)) return;
    targets.push(el);
  };
  const pageIds = ['homePage', 'searchPage', 'categoryPage', 'playPage'];
  const pageRoots = pageIds
    .map((id) => (typeof document !== 'undefined' ? document.getElementById(id) : null))
    .filter(Boolean);
  pageRoots.forEach((el) => {
    let current = el;
    while (current && current instanceof HTMLElement) {
      if (isScrollableElement(current)) pushTarget(current);
      current = current.parentElement;
    }
  });
  if (indexContentEl.value) pushTarget(indexContentEl.value);
  if (indexMainEl.value) pushTarget(indexMainEl.value);
  if (typeof document !== 'undefined') {
    pushTarget(document.scrollingElement || document.documentElement || document.body);
    pushTarget(document.documentElement);
    pushTarget(document.body);
  }
  return targets;
};
const scrollCurrentContentToTop = ({ behavior = 'smooth' } = {}) => {
  if (typeof window === 'undefined') return;
  const targets = collectScrollTargets();
  targets.forEach((target) => {
    if (!target) return;
    try {
      if (typeof target.scrollTo === 'function') {
        target.scrollTo({ top: 0, behavior });
      } else if ('scrollTop' in target) {
        target.scrollTop = 0;
      }
    } catch (_error) {
      if (target && 'scrollTop' in target) target.scrollTop = 0;
    }
  });
  try {
    window.scrollTo({ top: 0, behavior });
  } catch (_error) {
    window.scrollTo(0, 0);
  }
};
const isSameHomeTarget = (payload = {}) => {
  const targetSource = payload && payload.sourceKind === 'site'
    ? {
      kind: 'site',
      siteKey: typeof payload.siteKey === 'string' ? payload.siteKey : '',
      siteName: typeof payload.siteName === 'string' ? payload.siteName : '',
      siteApi: typeof payload.siteApi === 'string' ? payload.siteApi : '',
    }
    : { kind: 'douban' };
  return getCurrentPageIdentity() === buildHomeIdentity(targetSource);
};
const isSameCategoryTarget = (payload = {}) => {
  return getCurrentPageIdentity() === buildCategoryIdentity({
    source: payload && payload.sourceKind === 'site'
      ? {
        kind: 'site',
        siteKey: typeof payload.siteKey === 'string' ? payload.siteKey : '',
        categoryId: typeof payload.categoryId === 'string' ? payload.categoryId : '',
      }
      : { kind: 'douban' },
    type: typeof payload.categoryType === 'string' ? payload.categoryType : categoryType.value,
  });
};
const switchHome = () => {
  if (!isPlayView.value && currentView.value === 'home' && homeSection.value === 'home' && buildHomeIdentity(homeSource.value) === 'home:douban') {
    scrollCurrentContentToTop();
    return;
  }
  isPlayView.value = false;
  currentView.value = 'home';
  homeSection.value = 'home';
  homeSource.value = {
    kind: 'douban',
    siteKey: '',
    siteName: '',
    siteApi: '',
  };
  mobileActiveTab.value = 'home';
  mobileContext.value = { kind: 'home', siteName: '' };
  mobileMenuOpen.value = false;
};
const switchSearch = (query = '') => {
  if (!query && !isPlayView.value && currentView.value === 'search') {
    scrollCurrentContentToTop();
    return;
  }
  isPlayView.value = false;
  currentView.value = 'search';
  if (typeof query === 'string' && query.trim()) {
    searchRequest.value = {
      query: query.trim(),
      token: Number(searchRequest.value.token || 0) + 1,
    };
  }
  mobileActiveTab.value = 'search';
  mobileMenuOpen.value = false;
};
const switchFavorites = () => {
  isPlayView.value = false;
  currentView.value = 'home';
  homeSection.value = 'favorites';
  mobileActiveTab.value = 'favorites';
  mobileMenuOpen.value = false;
};
const switchCategory = (type = 'movie') => {
  const nextType = ['movie', 'tv', 'anime', 'show'].includes(type) ? type : 'movie';
  if (
    !isPlayView.value
    && currentView.value === 'category'
    && categorySource.value.kind !== 'site'
    && buildCategoryIdentity({ source: { kind: 'douban' }, type: nextType }) === getCurrentPageIdentity()
  ) {
    scrollCurrentContentToTop();
    return;
  }
  isPlayView.value = false;
  currentView.value = 'category';
  categoryType.value = nextType;
  categorySource.value = {
    kind: 'douban',
    siteKey: '',
    siteName: '',
    siteApi: '',
    categoryId: '',
    categoryName: '',
    initialItems: [],
    initialHasMore: false,
    initialPage: 1,
    initialSeedCount: 0,
  };
  mobileActiveTab.value = 'category';
  mobileMenuOpen.value = false;
};
const switchHistory = () => {
  mobileActiveTab.value = 'history';
};
const handleHomeModeChange = (mode) => {
  if (mode === 'favorites') {
    switchFavorites();
    return;
  }
  switchHome();
};
const handleHomeOpenCategory = (payload = {}) => {
  const sourceKind = payload && payload.sourceKind === 'site' ? 'site' : 'douban';
  isPlayView.value = false;
  currentView.value = 'category';
  mobileActiveTab.value = 'category';
  mobileMenuOpen.value = false;
  if (sourceKind === 'site') {
    categoryType.value = 'movie';
    categorySource.value = {
      kind: 'site',
      siteKey: typeof payload.siteKey === 'string' ? payload.siteKey : '',
      siteName: typeof payload.siteName === 'string' ? payload.siteName : '',
      siteApi: typeof payload.siteApi === 'string' ? payload.siteApi : '',
      categoryId: typeof payload.categoryId === 'string' ? payload.categoryId : '',
      categoryName: typeof payload.categoryName === 'string' ? payload.categoryName : '',
      initialItems: Array.isArray(payload.initialItems) ? payload.initialItems.slice() : [],
      initialHasMore: !!payload.initialHasMore,
      initialPage: Number(payload.initialPage || 1) || 1,
      initialSeedCount: 0,
    };
    return;
  }
  categoryType.value = ['movie', 'tv', 'anime', 'show'].includes(payload.categoryType) ? payload.categoryType : 'movie';
  categorySource.value = {
    kind: 'douban',
    siteKey: '',
    siteName: '',
    siteApi: '',
    categoryId: '',
    categoryName: '',
    initialItems: Array.isArray(payload.initialItems) ? payload.initialItems.slice() : [],
    initialHasMore: !!payload.initialHasMore,
    initialPage: 1,
    initialSeedCount: Number(payload.initialSeedCount || 0) || 0,
  };
};
const handleCategoryBack = () => {
  isPlayView.value = false;
  currentView.value = 'home';
  homeSection.value = 'home';
  mobileActiveTab.value = 'home';
  mobileMenuOpen.value = false;
  if (categorySource.value.kind === 'site') {
    homeSource.value = {
      kind: 'site',
      siteKey: typeof categorySource.value.siteKey === 'string' ? categorySource.value.siteKey : '',
      siteName: typeof categorySource.value.siteName === 'string' ? categorySource.value.siteName : '',
      siteApi: typeof categorySource.value.siteApi === 'string' ? categorySource.value.siteApi : '',
    };
    mobileContext.value = {
      kind: 'site',
      siteName: typeof categorySource.value.siteName === 'string' ? categorySource.value.siteName : '',
    };
    return;
  }
  homeSource.value = {
    kind: 'douban',
    siteKey: '',
    siteName: '',
    siteApi: '',
  };
  mobileContext.value = { kind: 'home', siteName: '' };
};
const handleCategoryOpenItem = (payload = {}) => {
  if (payload.sourceKind === 'site' || payload.sourceKind === 'tmdb') {
    const tmdbType = typeof payload.tmdbType === 'string' ? payload.tmdbType.trim().toLowerCase() : '';
    const tmdbId = Math.max(0, normalizeInt(payload.tmdbId));
    const isTmdbMode = tmdbId > 0 && (tmdbType === 'movie' || tmdbType === 'tv');
    isPlayView.value = true;
    playKey.value += 1;
    playParams.value = {
      ...playParams.value,
      isTmdbMode,
      contentKey: typeof payload.contentKey === 'string' ? payload.contentKey : '',
      searchQueryOriginal: typeof payload.searchQueryOriginal === 'string' ? payload.searchQueryOriginal : '',
      searchQueryCanonical: typeof payload.searchQueryCanonical === 'string' ? payload.searchQueryCanonical : '',
      videoYear: '',
      searchType: isTmdbMode ? tmdbType : '',
      siteKey: typeof payload.siteKey === 'string' ? payload.siteKey : '',
      siteName: typeof payload.siteName === 'string' ? payload.siteName : '',
      spiderApi: typeof payload.spiderApi === 'string' ? payload.spiderApi : '',
      siteDetail: typeof payload.siteDetail === 'string' ? payload.siteDetail : '',
      tmdbId,
      tmdbType,
      videoIntro: '',
      Poster: typeof payload.poster === 'string' ? payload.poster : '',
      Remark: typeof payload.remark === 'string' ? payload.remark : '',
      switchOnlyToken: Number(playParams.value.switchOnlyToken || 0) + 1,
    };
    mobileMenuOpen.value = false;
    return;
  }
  const keyword = typeof payload.title === 'string' ? payload.title.trim() : '';
  switchSearch(keyword);
};
const handlePlayBack = () => {
  flushHistoryProgressBestEffort();
  clearActivePlayHistoryContext();
  clearCurrentPlaybackContext();
  isPlayView.value = false;
  mobileMenuOpen.value = false;
  mobileUserMenuOpen.value = false;
  desktopUserMenuOpen.value = false;
};
const handleSidebarNavigate = (payload = {}) => {
  desktopUserMenuOpen.value = false;
  if (payload.view === 'home' && payload.sourceKind === 'site') {
    if (isSameHomeTarget(payload)) {
      scrollCurrentContentToTop();
      mobileMenuOpen.value = false;
      return;
    }
    isPlayView.value = false;
    currentView.value = 'home';
    homeSection.value = 'home';
    homeSource.value = {
      kind: 'site',
      siteKey: typeof payload.siteKey === 'string' ? payload.siteKey : '',
      siteName: typeof payload.siteName === 'string' ? payload.siteName : '',
      siteApi: typeof payload.siteApi === 'string' ? payload.siteApi : '',
    };
    mobileActiveTab.value = 'home';
    mobileContext.value = {
      kind: 'site',
      siteName: typeof payload.siteName === 'string' ? payload.siteName : '',
    };
    mobileMenuOpen.value = false;
    return;
  }
  if (payload.view === 'search') {
    if (!isPlayView.value && currentView.value === 'search') {
      scrollCurrentContentToTop();
      mobileMenuOpen.value = false;
      return;
    }
    switchSearch();
    return;
  }
  if (payload.view === 'category') {
    if (isSameCategoryTarget(payload)) {
      scrollCurrentContentToTop();
      mobileMenuOpen.value = false;
      return;
    }
    switchCategory(payload.categoryType);
    return;
  }
  if (isSameHomeTarget(payload)) {
    scrollCurrentContentToTop();
    mobileMenuOpen.value = false;
    return;
  }
  switchHome();
};
const openUserSettings = () => {};

const handleDocumentPointerDown = (event) => {
  const target = event && event.target ? event.target : null;
  if (!target) return;
  if (desktopUserMenuOpen.value) {
    const menuEl = desktopUserMenuEl.value;
    const btnEl = desktopUserMenuBtnEl.value;
    if (!(menuEl && menuEl.contains(target)) && !(btnEl && btnEl.contains(target))) {
      desktopUserMenuOpen.value = false;
    }
  }
  if (mobileUserMenuOpen.value) {
    if (target.closest && target.closest('.index-mobile-user-menu')) return;
    if (target.closest && target.closest('.index-mobile-header__user')) return;
    mobileUserMenuOpen.value = false;
  }
};

onMounted(() => {
  let initialDark = false;
  try {
    initialDark = window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch (_error) {}
  applyThemeState(initialDark);
  document.addEventListener('pointerdown', handleDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown);
});
</script>

<style>
.index-login {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, #e6f2fb 0%, #f8f9fa 40%, #f2f4f7 100%);
}

.index-login__inner {
  width: 100%;
}

.index-shell {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.index-top-actions {
  position: fixed;
  top: 16px;
  right: 24px;
  z-index: 20000;
  display: none;
  align-items: center;
  gap: 16px;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .index-top-actions {
    display: flex;
  }
}

.index-top-btn {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  box-shadow: none;
  transition: all 0.2s ease;
  pointer-events: auto;
}

.index-top-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
}

.index-top-icon {
  width: 22px;
  height: 22px;
}

.index-top-icon.is-hidden {
  display: none;
}

.index-top-user {
  position: relative;
}

.index-user-menu {
  display: none;
  position: absolute;
  right: 0;
  top: 48px;
  width: 220px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.16);
  padding: 12px 0 8px;
  z-index: 20010;
}

.index-user-menu--open {
  display: block;
}

.index-user-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px 12px;
}

.index-user-menu__hint {
  font-size: 0.75rem;
  color: #6b7280;
}

.index-user-menu__name {
  font-weight: 600;
  color: #1f2937;
}

.index-user-menu__badge {
  font-size: 12px;
  background: #ede9fe;
  color: #6b21a8;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.index-user-menu__item {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  background: transparent;
  border: 0;
  width: 100%;
  text-align: left;
  text-decoration: none;
}

.index-user-menu__item--danger {
  color: #dc2626;
}

.index-user-menu__item:hover {
  background: rgba(55, 94, 148, 0.06);
}

.index-user-menu__divider {
  height: 1px;
  margin: 4px 0;
  background: rgba(0, 0, 0, 0.07);
}

.index-user-menu__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 0 4px;
  color: #6b7280;
}

.index-user-menu__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.index-user-menu__meta-line {
  font-size: 0.75rem;
  color: #6b7280;
}

.index-user-menu__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
}

.dark .index-top-btn {
  color: #e5e7eb;
}

.dark .index-top-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.dark .index-user-menu {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}

.dark .index-user-menu__item {
  color: #e5e7eb;
}

.dark .index-user-menu__item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.dark .index-user-menu__item--danger {
  color: #f87171;
}

.dark .index-user-menu__divider {
  background: rgba(255, 255, 255, 0.1);
}

.dark .index-user-menu__badge {
  background: rgba(139, 92, 246, 0.25);
  color: #e9d5ff;
}

.dark .index-user-menu__footer {
  color: #94a3b8;
}

.index-mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(24px);
}

@media (min-width: 768px) {
  .index-mobile-header {
    display: none;
  }
}

.index-mobile-header__bar {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.index-mobile-header__btn {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.index-mobile-header__btn:hover {
  background: rgba(229, 231, 235, 0.5);
}

.index-mobile-header__icon {
  width: 24px;
  height: 24px;
}

.index-mobile-header__left,
.index-mobile-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.index-mobile-header__spacer {
  width: 40px;
  height: 40px;
}

.index-mobile-header__user {
  position: relative;
}

.index-mobile-user-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  border-radius: 8px;
  border: 1px solid rgba(229, 231, 235, 0.8);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  z-index: 1201;
  display: inline-flex;
  flex-direction: column;
  width: max-content;
  max-width: calc(100vw - 2rem);
}

.index-mobile-user-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  color: #374151;
  background: transparent;
  border: none;
  width: 100%;
  text-decoration: none;
  white-space: nowrap;
}

.index-mobile-user-item--danger {
  color: #ef4444;
}

.index-mobile-user-item:hover {
  background: rgba(243, 244, 246, 0.6);
}

.index-mobile-header__title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.index-mobile-header__title-btn {
  font-size: 1.25rem;
  font-weight: 700;
  color: #16a34a;
  border: none;
  background: transparent;
  max-width: 60vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.index-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .index-layout {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}

.index-sidebar-drawer {
  z-index: 1200;
}

@media (min-width: 768px) {
  .index-sidebar-drawer {
    z-index: auto;
  }
}

.index-sidebar-panel {
  width: auto;
}

.index-main {
  position: relative;
  min-width: 0;
  flex: 1 1 auto;
}

.index-content {
  padding-top: 0;
}

.index-bottom {
  display: block;
}

@media (min-width: 768px) {
  .index-bottom {
    display: none;
  }
}

.index-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 600;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(18px);
  min-height: calc(3.5rem + env(safe-area-inset-bottom));
}

.index-bottom-nav__list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
}

.index-bottom-nav__item {
  flex: 1 1 20%;
}

.index-bottom-nav__btn {
  width: 100%;
  height: 56px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.index-bottom-nav__icon {
  width: 22px;
  height: 22px;
  color: inherit;
}

.index-bottom-nav__label {
  color: inherit;
}

.index-bottom-nav__icon.is-active,
.index-bottom-nav__label.is-active {
  color: #16a34a;
}

.index-admin {
  display: none;
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
}

.index-admin__wrap {
  display: flex;
  min-height: 100vh;
}

.index-admin__sidebar {
  width: 16rem;
  background: rgba(255, 255, 255, 0.7);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  padding: 24px 16px;
}

.index-admin__sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #0f172a;
}

.index-admin__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.index-admin__nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  text-decoration: none;
  color: #334155;
}

.index-admin__content {
  flex: 1 1 auto;
}

.index-admin__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  background: rgba(255, 255, 255, 0.8);
}

.index-admin__topbar-title {
  font-size: 1rem;
  font-weight: 600;
}

.index-admin__back {
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  background: rgba(226, 232, 240, 0.8);
  color: #334155;
}

.index-admin__panel {
  padding: 24px;
}

.index-admin__section {
  margin-bottom: 24px;
}

.index-admin__section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.index-admin__form {
  display: grid;
  gap: 16px;
}

.index-admin__label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.index-admin__input,
.index-admin__textarea,
.index-admin__select {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  padding: 10px 12px;
  font-size: 0.9rem;
}

.index-admin__hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 6px;
}

.index-admin__placeholder {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 767.98px) {
  #tvSidebarDrawer.index-sidebar-drawer {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--tv-drawer-w, 33vw);
    min-width: 33vw;
    max-width: 70vw;
    z-index: 20000;
    pointer-events: none;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    transform: translateX(-100%);
    transition: transform 0.2s ease-out;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
  }

  #tvSidebarDrawer.index-sidebar-drawer.is-open .index-sidebar-panel {
    transform: translateX(0);
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #desktopSidebar.app-sidebar {
    position: static !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    height: 100% !important;
    border-right: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: auto !important;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #desktopSidebar.app-sidebar .app-sidebar__brand-title {
    white-space: nowrap;
    display: block;
    max-width: 100%;
    line-height: 1.1;
    font-size: clamp(18px, 5.2vw, 24px);
    overflow: visible;
    text-overflow: clip;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #desktopSidebar.app-sidebar .app-sidebar__nav {
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #desktopSidebar.app-sidebar .app-sidebar__item {
    min-width: 0;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #desktopSidebar.app-sidebar .app-sidebar__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #tvSidebarDrawer.index-sidebar-drawer .index-sidebar-panel #sidebarOffset {
    display: none !important;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    flex: 0 0 0 !important;
  }
}

@media (min-width: 768px) {
  #tvSidebarDrawer.index-sidebar-drawer {
    display: block !important;
    position: static !important;
    inset: auto !important;
    pointer-events: auto !important;
    z-index: auto !important;
    width: auto !important;
  }

  #tvSidebarDrawer .index-sidebar-panel {
    position: static !important;
    transform: none !important;
    width: auto !important;
    max-width: none !important;
  }
}
</style>
