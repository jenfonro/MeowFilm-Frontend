export function initDashboardPage(bootstrap = {}) {
  const adminNavs = document.querySelectorAll('.admin-nav');
  const panels = document.querySelectorAll('.admin-panel');
  const videoSourceList = document.getElementById('videoSourceList');
  const videoSourceListSaveStatus = document.getElementById('videoSourceListSaveStatus');
  const videoSourceImportSummary = document.getElementById('videoSourceImportSummary');
  const videoSourceBulkActions = document.getElementById('videoSourceBulkActions');
  const videoSourceBulkEnable = document.getElementById('videoSourceBulkEnable');
  const videoSourceBulkDisable = document.getElementById('videoSourceBulkDisable');
  const panList = document.getElementById('panList');
  const panListSaveStatus = document.getElementById('panListSaveStatus');
  const panHeaderName = document.getElementById('panHeaderName');
  const panHeaderEnable = document.getElementById('panHeaderEnable');
  const panHeaderSort = document.getElementById('panHeaderSort');
  const panSettingsTabs = document.getElementById('panSettingsTabs');
  const panSettingsContent = document.getElementById('panSettingsContent');
  const panSettingsStatus = document.getElementById('panSettingsStatus');
  const panSettingsMoreBtn = document.getElementById('panSettingsMoreBtn');
  const panSettingsMoreMenu = document.getElementById('panSettingsMoreMenu');
  const panSettingsScrollLeft = document.getElementById('panSettingsScrollLeft');
  const panSettingsScrollRight = document.getElementById('panSettingsScrollRight');

  const goProxySettingsForm = document.getElementById('goProxySettingsForm');
  const goProxySaveStatus = document.getElementById('goProxySaveStatus');
  const goProxyEnabledInput = document.getElementById('goProxyEnabled');
  const goProxyAutoSelectInput = document.getElementById('goProxyAutoSelect');
  const goProxyServersJsonInput = document.getElementById('goProxyServersJson');
  const goProxyServerAdd = document.getElementById('goProxyServerAdd');
  const goProxyServerEditor = document.getElementById('goProxyServerEditor');
  const goProxyServerEditorName = document.getElementById('goProxyServerEditorName');
  const goProxyServerEditorDisplayName = document.getElementById('goProxyServerEditorDisplayName');
  const goProxyServerEditorBase = document.getElementById('goProxyServerEditorBase');
  const goProxyServerEditorConfirm = document.getElementById('goProxyServerEditorConfirm');
  const goProxyServerEditorCancel = document.getElementById('goProxyServerEditorCancel');
  const goProxyServerEditorStatus = document.getElementById('goProxyServerEditorStatus');
  const goProxyServerTableBody = document.getElementById('goProxyServerTableBody');
  const videoSourceImportFromcatpawrunnerBtn = document.getElementById('videoSourceImportFromcatpawrunner');
  const videoSourceSitesToggle = document.getElementById('videoSourceSitesToggle');
  const videoSourceSitesToggleIcon = document.getElementById('videoSourceSitesToggleIcon');
  const videoSourceSitesPanel = document.getElementById('videoSourceSitesPanel');
  const catpawrunnerConfigListAdd = document.getElementById('catpawrunnerConfigListAdd');
  const catpawrunnerConfigList = document.getElementById('catpawrunnerConfigList');
  const catpawrunnerConfigListJsonInput = document.getElementById('catpawrunnerConfigListJson');
  const catpawrunnerConfigEditor = document.getElementById('catpawrunnerConfigEditor');
  const catpawrunnerConfigEditorName = document.getElementById('catpawrunnerConfigEditorName');
  const catpawrunnerConfigEditorUrl = document.getElementById('catpawrunnerConfigEditorUrl');
  const catpawrunnerConfigEditorConfirm = document.getElementById('catpawrunnerConfigEditorConfirm');
  const catpawrunnerConfigEditorCancel = document.getElementById('catpawrunnerConfigEditorCancel');
  const catpawrunnerConfigEditorStatus = document.getElementById('catpawrunnerConfigEditorStatus');
  const catpawrunnerPansToggle = document.getElementById('catpawrunnerPansToggle');
  const catpawrunnerPansToggleIcon = document.getElementById('catpawrunnerPansToggleIcon');
  const catpawrunnerPansPanel = document.getElementById('catpawrunnerPansPanel');

  const magicEpisodeRulePatternInput = document.getElementById('magicEpisodeRulePatternInput');
  const magicEpisodeRuleReplaceInput = document.getElementById('magicEpisodeRuleReplaceInput');
  const magicEpisodeRuleAdd = document.getElementById('magicEpisodeRuleAdd');
  const magicEpisodeRuleList = document.getElementById('magicEpisodeRuleList');
  const magicEpisodeRuleStatus = document.getElementById('magicEpisodeRuleStatus');
  const magicEpisodeRuleTestInput = document.getElementById('magicEpisodeRuleTestInput');
  const magicEpisodeRuleTestBtn = document.getElementById('magicEpisodeRuleTestBtn');
  const magicEpisodeRuleTestOutput = document.getElementById('magicEpisodeRuleTestOutput');
  const magicEpisodeCleanRegexRuleInput = document.getElementById('magicEpisodeCleanRegexRuleInput');
  const magicEpisodeCleanRegexRuleAdd = document.getElementById('magicEpisodeCleanRegexRuleAdd');
  const magicEpisodeDefaultsRestore = document.getElementById('magicEpisodeDefaultsRestore');
  const magicEpisodeDefaultsRestoreConfirm = document.getElementById('magicEpisodeDefaultsRestoreConfirm');
  const magicEpisodeDefaultsRestoreCancel = document.getElementById('magicEpisodeDefaultsRestoreCancel');
  const magicEpisodeCleanRegexRuleList = document.getElementById('magicEpisodeCleanRegexRuleList');
  const magicEpisodeCleanRegexRuleStatus = document.getElementById('magicEpisodeCleanRegexRuleStatus');

  const magicMovieRulePatternInput = document.getElementById('magicMovieRulePatternInput');
  const magicMovieRuleReplaceInput = document.getElementById('magicMovieRuleReplaceInput');
  const magicMovieRuleAdd = document.getElementById('magicMovieRuleAdd');
  const magicMovieRuleList = document.getElementById('magicMovieRuleList');
  const magicMovieRuleStatus = document.getElementById('magicMovieRuleStatus');
  const magicMovieRuleTestInput = document.getElementById('magicMovieRuleTestInput');
  const magicMovieRuleTestBtn = document.getElementById('magicMovieRuleTestBtn');
  const magicMovieRuleTestOutput = document.getElementById('magicMovieRuleTestOutput');
  const magicMovieDefaultsRestore = document.getElementById('magicMovieDefaultsRestore');
  const magicMovieDefaultsRestoreConfirm = document.getElementById('magicMovieDefaultsRestoreConfirm');
  const magicMovieDefaultsRestoreCancel = document.getElementById('magicMovieDefaultsRestoreCancel');

  const magicAggregateRuleTestInput = document.getElementById('magicAggregateRuleTestInput');
  const magicAggregateRuleTestQueryInput = document.getElementById('magicAggregateRuleTestQueryInput');
  const magicAggregateRuleTestBtn = document.getElementById('magicAggregateRuleTestBtn');
  const magicAggregateRuleTestOutput = document.getElementById('magicAggregateRuleTestOutput');

  const magicAggregateRegexRuleInput = document.getElementById('magicAggregateRegexRuleInput');
  const magicAggregateRegexRuleAdd = document.getElementById('magicAggregateRegexRuleAdd');
  const magicAggregateRegexRuleList = document.getElementById('magicAggregateRegexRuleList');
  const magicAggregateRegexRuleStatus = document.getElementById('magicAggregateRegexRuleStatus');
  const magicAggregateDefaultsRestore = document.getElementById('magicAggregateDefaultsRestore');
  const magicAggregateDefaultsRestoreConfirm = document.getElementById('magicAggregateDefaultsRestoreConfirm');
  const magicAggregateDefaultsRestoreCancel = document.getElementById('magicAggregateDefaultsRestoreCancel');

  const searchDisplayModeSelect = document.getElementById('searchDisplayModeSelect');
  const searchDisplayModeError = document.getElementById('searchDisplayModeError');
  const netdiskProxyEnabledInput = document.getElementById('netdiskProxyEnabled');
  const netdiskProxyUrlInput = document.getElementById('netdiskProxyUrl');
  const globalSettingsSave = document.getElementById('globalSettingsSave');
  const globalSettingsSaveStatus = document.getElementById('globalSettingsSaveStatus');

  const smartSourcePriorityTokensInput = document.getElementById('smartSourcePriorityTokensInput');
  const smartPanMatchTokensInput = document.getElementById('smartPanMatchTokensInput');
  const smartPanAliasMapPanInput = document.getElementById('smartPanAliasMapPanInput');
  const smartPanAliasMapAliasesInput = document.getElementById('smartPanAliasMapAliasesInput');
  const smartPanAliasMapAdd = document.getElementById('smartPanAliasMapAdd');
  const smartPanAliasMapList = document.getElementById('smartPanAliasMapList');
  const smartSourceExtractPrioritySelect = document.getElementById('smartSourceExtractPriority');
  const smartSiteCleanKeywordsInput = document.getElementById('smartSiteCleanKeywordsInput');
  const smartPanSettingsSave = document.getElementById('smartPanSettingsSave');
  const smartPanDefaultsRestore = document.getElementById('smartPanDefaultsRestore');
  const smartPanDefaultsRestoreConfirm = document.getElementById('smartPanDefaultsRestoreConfirm');
  const smartPanDefaultsRestoreCancel = document.getElementById('smartPanDefaultsRestoreCancel');
  const smartSiteCleanDefaultsRestore = document.getElementById('smartSiteCleanDefaultsRestore');
  const smartSiteCleanDefaultsRestoreConfirm = document.getElementById('smartSiteCleanDefaultsRestoreConfirm');
  const smartSiteCleanDefaultsRestoreCancel = document.getElementById('smartSiteCleanDefaultsRestoreCancel');
  const smartMatchBlockKeywordList = document.getElementById('smartMatchBlockKeywordList');
  const smartMatchBlockItemTableBody = document.getElementById('smartMatchBlockItemTableBody');
  const smartMatchBlockSelectedKeywordEl = document.getElementById('smartMatchBlockSelectedKeyword');

  const metadataSettingsForm = document.getElementById('metadataSettingsForm');
  const metadataSaveStatus = document.getElementById('metadataSaveStatus');

  const doubanDataCustomInput = document.getElementById('doubanDataCustomInput');
  const doubanImgCustomInput = document.getElementById('doubanImgCustomInput');

  const thirdPartySettingsForm = document.getElementById('thirdPartySettingsForm');
  const embyHomeSectionAdd = document.getElementById('embyHomeSectionAdd');
  const embyHomeSectionRestoreDefaults = document.getElementById('embyHomeSectionRestoreDefaults');
  const embyHomeSectionsJson = document.getElementById('embyHomeSectionsJson');
  const embyHomeSectionTableBody = document.getElementById('embyHomeSectionTableBody');
  const embyHomeSettingsStatus = document.getElementById('embyHomeSettingsStatus');

  const tmdbApiTokenInput = document.getElementById('tmdbApiToken');
  const tmdbDataProxyBaseInput = document.getElementById('tmdbDataProxyBase');
  const tmdbImageProxyBaseInput = document.getElementById('tmdbImageProxyBase');
  const tmdbLanguageInput = document.getElementById('tmdbLanguage');
  const tmdbRegionInput = document.getElementById('tmdbRegion');
  const tmdbIncludeAdultInput = document.getElementById('tmdbIncludeAdult');

  const backupExportBtn = document.getElementById('backupExportBtn');
  const backupImportBtn = document.getElementById('backupImportBtn');
  const backupImportFile = document.getElementById('backupImportFile');
  const backupRestoreStatus = document.getElementById('backupRestoreStatus');

  const panelLoaded = {
    site: false,
    user: false,
    video: false,
    pan: false,
    interface: false,
    magic: false,
    metadata: false,
  };
  const panelLoading = {
    site: false,
    user: false,
    video: false,
    pan: false,
    interface: false,
    magic: false,
    metadata: false,
  };

  const CLS = {
    muted: 'text-gray-500 dark:text-gray-400',
    mutedXs: 'text-xs text-gray-500 dark:text-gray-400',
    mutedMonoXs: 'text-xs text-gray-500 dark:text-gray-400 font-mono flex-shrink-0',
  };

  let catpawrunnerConfigListEditor = null;
  let catpawrunnerServers = [];
  let catpawrunnerServerAddMode = false;
  let catpawrunnerServerPrevSelectedKey = '';
  let catpawrunnerServerPrevRemoteState = { state: 'hidden', message: '' };
  let catpawrunnerServerSelectSyncing = false;
  let catpawrunnerSavedApiBaseNorm = '';
  let synccatpawrunnerServerAddModeButtons = () => {};
  let cancelcatpawrunnerServerAddMode = async () => {};

  const normalizecatpawrunnerServers = (raw) => {
    const list = Array.isArray(raw) ? raw : [];
    const out = [];
    list.forEach((it) => {
      const n = it && typeof it.name === 'string' ? it.name.trim() : '';
      const a = it && typeof it.apiBase === 'string' ? String(it.apiBase || '').trim() : '';
      if (!n || !a) return;
      out.push({ name: n, apiBase: a });
    });
    return out;
  };

  const pickcatpawrunnerActiveKey = (servers, desired) => {
    const list = Array.isArray(servers) ? servers : [];
    const k = typeof desired === 'string' ? desired.trim() : '';
    if (k) {
      const hit = list.find((s) => s && s.name === k);
      if (hit) return hit.name;
    }
    return list[0] ? list[0].name : '';
  };

  const resolvecatpawrunnerApiBaseFromSettings = (settings) => {
    const servers = normalizecatpawrunnerServers(settings && settings.catpawrunnerServers);
    const active = settings && typeof settings.catpawrunnerActive === 'string' ? settings.catpawrunnerActive : '';
    const key = pickcatpawrunnerActiveKey(servers, active);
    const server = servers.find((s) => s && s.name === key) || servers[0];
    return server && server.apiBase ? String(server.apiBase || '').trim() : '';
  };

  const normalizeTvUser = (value) => {
    const raw = value != null ? String(value) : '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    // Prevent header injection and keep a single-line header value.
    return trimmed.replace(/[\r\n]+/g, '');
  };

  const resolveTvUser = () => {
    const user = bootstrap && typeof bootstrap === 'object' ? bootstrap.user : null;
    const username = user && typeof user === 'object' ? user.username : '';
    return normalizeTvUser(username);
  };

  const createEl = (tag, options = {}) => {
    const el = document.createElement(tag);
    const className = options.className != null ? String(options.className) : '';
    if (className) el.className = className;
    if (options.text != null) el.textContent = String(options.text);
    if (options.html != null) el.innerHTML = String(options.html);
    return el;
  };

  const setStyles = (el, styles) => {
    if (!el || !styles) return el;
    try {
      Object.assign(el.style, styles);
    } catch (_e) {}
    return el;
  };

  const setEllipsisCell = (el, { width, minWidth, maxWidth, flex = '0 0 auto', display = 'inline-block' } = {}) =>
    setStyles(el, {
      width,
      minWidth,
      maxWidth,
      flex,
      display,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });

  const setCenterCell = (el, { minWidth, width, flex, display = 'inline-flex' } = {}) =>
    setStyles(el, {
      display,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth,
      width,
      flex,
    });

  const SORT_ICON = {
    up: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    down: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  };

  const appendSortButtons = (sortCell, { dirAttr, keyAttr, key, disabledUp, disabledDown } = {}) => {
    if (!sortCell) return;
    const sortGroup = createEl('div', { className: 'sort-btn-group' });
    const upBtn = createEl('button', { className: 'sort-btn', html: SORT_ICON.up });
    upBtn.type = 'button';
    upBtn.setAttribute(String(dirAttr || 'data-sort'), 'up');
    upBtn.setAttribute(String(keyAttr || 'data-site-key'), String(key || ''));
    upBtn.disabled = !!disabledUp;

    const downBtn = createEl('button', { className: 'sort-btn', html: SORT_ICON.down });
    downBtn.type = 'button';
    downBtn.setAttribute(String(dirAttr || 'data-sort'), 'down');
    downBtn.setAttribute(String(keyAttr || 'data-site-key'), String(key || ''));
    downBtn.disabled = !!disabledDown;

    sortGroup.appendChild(upBtn);
    sortGroup.appendChild(downBtn);
    sortCell.appendChild(sortGroup);
  };

  const appendEmptyItem = (listEl, text = '无数据') => {
    if (!listEl) return;
    listEl.appendChild(createEl('li', { className: CLS.muted, text }));
  };

  const setInlineStatus = (el, type, text) => {
    if (!el) return;
    const t = text != null ? String(text) : '';
    if (!t) {
      el.classList.add('hidden');
      try {
        el.hidden = true;
      } catch (_e) {}
      el.textContent = '';
      el.classList.remove('text-green-600', 'text-red-600');
      return;
    }
    el.classList.remove('hidden', 'text-green-600', 'text-red-600');
    try {
      el.hidden = false;
    } catch (_e) {}
    if (type === 'success') el.classList.add('text-green-600');
    if (type === 'error') el.classList.add('text-red-600');
    el.textContent = t;
  };

  const bindInlineStatus = (el) => (type, text) => setInlineStatus(el, type, text);

  const setInlineStatusHtml = (el, type, html) => {
    if (!el) return;
    const t = html != null ? String(html) : '';
    if (!t) {
      el.classList.add('hidden');
      try {
        el.hidden = true;
      } catch (_e) {}
      el.innerHTML = '';
      el.classList.remove('text-green-600', 'text-red-600');
      return;
    }
    el.classList.remove('hidden', 'text-green-600', 'text-red-600');
    try {
      el.hidden = false;
    } catch (_e) {}
    if (type === 'success') el.classList.add('text-green-600');
    if (type === 'error') el.classList.add('text-red-600');
    el.innerHTML = t;
  };

  const bindInlineStatusHtml = (el) => (type, html) => setInlineStatusHtml(el, type, html);

  const ensureToastContainer = () => {
    const existing = document.getElementById('mfToastContainer');
    if (existing) return existing;
    const el = document.createElement('div');
    el.id = 'mfToastContainer';
    el.className = 'mf-toast-container';
    document.body.appendChild(el);
    return el;
  };

  const toastIconSvg = (type) => {
    if (type === 'success') {
      return `<svg class="mf-toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`;
    }
    if (type === 'error') {
      return `<svg class="mf-toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>`;
    }
    return `<svg class="mf-toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16v-4"/><path d="M12 8h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
  };

  let lastToastKey = '';
  let lastToastAt = 0;
  const toast = (type, message, { durationMs = 2600 } = {}) => {
    const msg = message != null ? String(message) : '';
    if (!msg) return;
    const now = Date.now();
    const key = `${type}:${msg}`;
    if (key === lastToastKey && now - lastToastAt < 600) return;
    lastToastKey = key;
    lastToastAt = now;

    const container = ensureToastContainer();
    const el = document.createElement('div');
    const t = type === 'success' || type === 'error' ? type : 'info';
    el.className = `mf-toast mf-toast--${t}`;
    el.innerHTML = `
      <div class="mf-toast-bar"></div>
      ${toastIconSvg(t)}
      <div class="mf-toast-body"><div class="mf-toast-text"></div></div>
      <button type="button" class="mf-toast-close" aria-label="关闭">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    `;
    const textEl = el.querySelector('.mf-toast-text');
    if (textEl) textEl.textContent = msg;
    const closeBtn = el.querySelector('button.mf-toast-close');
    const remove = () => {
      el.style.animation = 'mfToastOut 140ms ease-in forwards';
      setTimeout(() => {
        try {
          el.remove();
        } catch (_e) {}
      }, 160);
    };
    if (closeBtn) closeBtn.addEventListener('click', remove);
    container.appendChild(el);
    const ms = Number.isFinite(Number(durationMs)) ? Math.max(600, Math.trunc(Number(durationMs))) : 2600;
    setTimeout(remove, ms);
  };

  const notify = {
    success: (msg, opts) => toast('success', msg, opts),
    error: (msg, opts) => toast('error', msg, opts),
    info: (msg, opts) => toast('info', msg, opts),
  };

  const setButtonLoading = (btn, loading, { loadingText = '' } = {}) => {
    if (!btn) return;
    const isLoading = !!loading;
    if (btn.dataset && btn.dataset.mfOriginalHtml == null) {
      btn.dataset.mfOriginalHtml = btn.innerHTML;
    }
    const original = btn.dataset ? btn.dataset.mfOriginalHtml || '' : btn.innerHTML;
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `<span class="inline-flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        ${loadingText ? `<span>${String(loadingText)}</span>` : ''}
      </span>`;
      return;
    }
    btn.disabled = false;
    btn.innerHTML = original || btn.innerHTML;
  };

  const setImportSummary = (text, { keepMs = 6000 } = {}) => {
    if (!videoSourceImportSummary) return;
    const t = text != null ? String(text) : '';
    if (!t) {
      videoSourceImportSummary.textContent = '';
      videoSourceImportSummary.classList.add('hidden');
      return;
    }
    videoSourceImportSummary.textContent = t;
    videoSourceImportSummary.classList.remove('hidden');
    const ms = Number.isFinite(Number(keepMs)) ? Math.max(800, Math.trunc(Number(keepMs))) : 6000;
    setTimeout(() => {
      if (!videoSourceImportSummary) return;
      if (videoSourceImportSummary.textContent === t) {
        videoSourceImportSummary.textContent = '';
        videoSourceImportSummary.classList.add('hidden');
      }
    }, ms);
  };

  const bindOnce = (el, fn) => {
    if (!el) return false;
    if (el.dataset && el.dataset.bound === 'true') return false;
    if (el.dataset) el.dataset.bound = 'true';
    if (typeof fn === 'function') fn(el);
    return true;
  };

  const calcMaxTextLength = (items, getText) => {
    const list = Array.isArray(items) ? items : [];
    const getter = typeof getText === 'function' ? getText : () => '';
    return list.reduce((max, item) => {
      const text = getter(item);
      return Math.max(max, (text != null ? String(text) : '').length);
    }, 0);
  };

  const calcChCell = (items, getText, { min = 1, pad = 2 } = {}) => {
    const maxLen = Math.max(calcMaxTextLength(items, getText), Number(min) || 0);
    const safePad = Number.isFinite(Number(pad)) ? Number(pad) : 2;
    return { maxLen, width: `${maxLen}ch`, maxWidth: `${maxLen + safePad}ch` };
  };

  const calcPxCell = (items, getText, { minPx = 0, maxPx = 0, className = '', padPx = 12 } = {}) => {
    const list = Array.isArray(items) ? items : [];
    const getter = typeof getText === 'function' ? getText : () => '';
    const min = Number.isFinite(Number(minPx)) ? Math.max(0, Number(minPx)) : 0;
    const max = Number.isFinite(Number(maxPx)) && Number(maxPx) > 0 ? Number(maxPx) : 0;
    const pad = Number.isFinite(Number(padPx)) ? Math.max(0, Number(padPx)) : 0;

    if (!list.length) {
      const w = min;
      return { px: w, width: `${w}px`, minWidth: `${min}px`, maxWidth: `${w}px`, flex: `0 0 ${w}px` };
    }

    const measure = createEl('span', { className });
    setStyles(measure, {
      position: 'absolute',
      visibility: 'hidden',
      whiteSpace: 'nowrap',
      left: '-99999px',
      top: '-99999px',
      pointerEvents: 'none',
    });
    document.body.appendChild(measure);

    let maxWidthPx = 0;
    list.forEach((it) => {
      const text = getter(it);
      measure.textContent = text != null ? String(text) : '';
      maxWidthPx = Math.max(maxWidthPx, Math.ceil(measure.getBoundingClientRect().width));
    });

    document.body.removeChild(measure);

    let w = Math.max(maxWidthPx, min);
    if (max > 0) w = Math.min(w, max);
    w = Math.ceil(w);
    return { px: w, width: `${w}px`, minWidth: `${min}px`, maxWidth: `${w}px`, flex: `0 0 ${w}px` };
  };

  const fixedCell = (px) => {
    const n = Number(px);
    const v = Number.isFinite(n) ? Math.max(0, n) : 0;
    return { minWidth: `${v}px`, width: `${v}px`, flex: `0 0 ${v}px` };
  };

  const setFixedHeaderCell = (el, px) =>
    setStyles(el, { display: 'inline-block', textAlign: 'center', ...fixedCell(px) });

  const createSwitchLabel = ({ checked, disabled, title, ariaLabel, inputAttrs, onChange }) => {
    const label = createEl('label', { className: 'enable-switch' });
    if (title) label.title = String(title);
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    input.disabled = !!disabled;
    if (ariaLabel) input.setAttribute('aria-label', String(ariaLabel));
    if (inputAttrs && typeof inputAttrs === 'object') {
      Object.entries(inputAttrs).forEach(([k, v]) => {
        if (v == null) return;
        input.setAttribute(String(k), String(v));
      });
    }
    if (typeof onChange === 'function') input.addEventListener('change', onChange);
    const slider = createEl('span', { className: 'enable-slider' });
    label.appendChild(input);
    label.appendChild(slider);
    return { label, input };
  };

  const fetchJsonSafe = async (url, options, fallback) => {
    const resp = await fetch(url, options);
    const fb = fallback == null ? {} : fallback;
    const data = await resp.json().catch(() => fb);
    return { resp, data };
  };

  const postJsonSafe = (url, body) =>
    fetchJsonSafe(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body != null ? body : {}),
      },
      {}
    );

  const getSuccessJson = async (url, options = {}) => {
    try {
      const opts = options && typeof options === 'object' ? options : {};
      const { resp, data } = await fetchJsonSafe(url, { method: 'GET', ...opts }, {});
      if (resp.ok && data && data.success) return data;
    } catch (_e) {}
    return null;
  };

  const postForm = (url, fields) => {
    const body = new URLSearchParams();
    if (fields && typeof fields === 'object') {
      Object.entries(fields).forEach(([k, v]) => {
        body.append(String(k), v != null ? String(v) : '');
      });
    }
    return fetchJsonSafe(
      url,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() },
      {}
    );
  };

  const formToFields = (form) => {
    const fields = {};
    if (!form) return fields;
    try {
      const formData = new FormData(form);
      for (const [k, v] of formData.entries()) fields[k] = v != null ? String(v) : '';
    } catch (_e) {}
    return fields;
  };

  const withDatasetLock = async (el, key, fn) => {
    if (!el || !el.dataset) return (typeof fn === 'function' ? fn() : undefined);
    const k = typeof key === 'string' && key ? key : 'pending';
    if (el.dataset[k] === 'true') return undefined;
    el.dataset[k] = 'true';
    try {
      return await (typeof fn === 'function' ? fn() : undefined);
    } finally {
      try {
        delete el.dataset[k];
      } catch (_e) {}
    }
  };

  const clearStatusLater = (setStatus, delay = 1200) => {
    if (typeof setStatus !== 'function') return;
    const ms = Number(delay);
    const d = Number.isFinite(ms) ? ms : 1200;
    setTimeout(() => setStatus('', ''), d);
  };

  const setBackupStatus = (text, kind) => {
    if (!backupRestoreStatus) return;
    const msg = typeof text === 'string' ? text.trim() : '';
    const k = typeof kind === 'string' ? kind.trim() : '';
    backupRestoreStatus.classList.toggle('hidden', !msg);
    backupRestoreStatus.classList.toggle('text-green-600', k === 'ok');
    backupRestoreStatus.classList.toggle('text-red-600', k === 'err');
    backupRestoreStatus.classList.toggle('text-gray-600', !k);
    backupRestoreStatus.textContent = msg;
  };

  const downloadJson = (obj, filename) => {
    try {
      const json = JSON.stringify(obj != null ? obj : {}, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'meowfilm-backup.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (_e) {}
  };

  const swapCopy = (arr, i, j) => {
    const list = Array.isArray(arr) ? arr.slice() : [];
    const a = Number(i);
    const b = Number(j);
    if (!Number.isInteger(a) || !Number.isInteger(b)) return list;
    if (a < 0 || b < 0 || a >= list.length || b >= list.length || a === b) return list;
    const tmp = list[a];
    list[a] = list[b];
    list[b] = tmp;
    return list;
  };
  let initialPanelKey = null;
  const allowedPanels = new Set(['site', 'user', 'video', 'pan', 'interface', 'magic', 'smart', 'metadata', 'thirdparty']);
  const normalizePanelKey = (key) => {
    const k = typeof key === 'string' ? key.trim().toLowerCase() : '';
    return allowedPanels.has(k) ? k : 'site';
  };
  const readPanelFromHash = () => {
    const hash = typeof window.location.hash === 'string' ? window.location.hash : '';
    const key = hash.replace(/^#/, '').trim();
    return normalizePanelKey(key);
  };
  const writePanelToHash = (key) => {
    const next = normalizePanelKey(key);
    const current = (window.location.hash || '').replace(/^#/, '');
    if (current === next) return;
    window.location.hash = `#${next}`;
  };
  const showPanel = (key) => {
    const safeKey = normalizePanelKey(key);
    panels.forEach((p) => p.classList.add('hidden'));
    adminNavs.forEach((n) => {
      const active = n.dataset.admin === safeKey;
      n.setAttribute('data-active', active ? 'true' : 'false');
    });
    const target = document.querySelector(
      `#admin${safeKey.charAt(0).toUpperCase()}${safeKey.slice(1)}`
    );
    if (target) target.classList.remove('hidden');
  };

  if (backupExportBtn) {
    backupExportBtn.addEventListener('click', () =>
      withDatasetLock(backupExportBtn, 'backup', async () => {
        setBackupStatus('正在导出...', '');
        const data = await getSuccessJson('/dashboard/backup');
        if (!data) {
          setBackupStatus('导出失败', 'err');
          return;
        }
        const ts = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const name = `meowfilm_backup_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.json`;
        downloadJson(data, name);
        setBackupStatus('导出成功', 'ok');
        clearStatusLater(setBackupStatus, 1500);
      })
    );
  }

  const pickImportFile = () => {
    if (!backupImportFile) return;
    try {
      backupImportFile.value = '';
    } catch (_e) {}
    backupImportFile.click();
  };

  if (backupImportBtn) {
    backupImportBtn.addEventListener('click', () => pickImportFile());
  }

  if (backupImportFile) {
    backupImportFile.addEventListener('change', async () => {
      const file = backupImportFile.files && backupImportFile.files[0] ? backupImportFile.files[0] : null;
      if (!file) return;
      setBackupStatus('正在导入...', '');
      try {
        const text = await file.text();
        const parsed = JSON.parse(text || '{}');
        const { resp, data } = await postJsonSafe('/dashboard/restore', parsed);
        if (resp.ok && data && data.success) {
          setBackupStatus('导入成功（建议刷新页面）', 'ok');
          return;
        }
        const msg = (data && (data.message || data.error)) ? String(data.message || data.error) : '导入失败';
        setBackupStatus(msg, 'err');
      } catch (e) {
        setBackupStatus(e && e.message ? String(e.message) : '导入失败', 'err');
      }
    });
  }

  let goProxyServers = [];
  let goProxyProbes = new Map();
  let goProxySaving = false;
  let goProxyEditorMode = 'hidden'; // hidden | add | edit
  let goProxyEditorEditingKey = '';
  let goProxyServerEditorHomeParent = null;
  let goProxyServerEditorHomeNextSibling = null;

  const restoreGoProxyServerEditorHome = () => {
    if (!goProxyServerEditor) return;
    if (!goProxyServerEditorHomeParent) return;
    if (goProxyServerEditor.parentNode === goProxyServerEditorHomeParent) return;
    goProxyServerEditorHomeParent.insertBefore(goProxyServerEditor, goProxyServerEditorHomeNextSibling);
  };

  const normalizeHttpBase = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      u.hash = '';
      u.search = '';
      return u.toString().replace(/\/+$/g, '');
    } catch (_e) {
      return '';
    }
  };

  const safeParseJsonArray = (text) => {
    try {
      const v = JSON.parse(String(text || ''));
      return Array.isArray(v) ? v : [];
    } catch (_e) {
      return [];
    }
  };

  const normalizecatpawrunnerAdminBase = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      u.hash = '';
      u.search = '';
      let p = u.pathname || '/';
      const spiderIdx = p.indexOf('/spider/');
      if (spiderIdx >= 0) p = p.slice(0, spiderIdx) || '/';
      // If user pasted an id-prefixed spider API like "/<id>/spider/...", drop the id segment.
      if (/^\/[a-f0-9]{10}\/?$/.test(p)) p = '/';
      p = p.replace(/\/spider\/?$/, '/') || '/';
      p = p.replace(/\/(full-config|config|website)\/?$/, '/') || '/';
      if (!p.endsWith('/')) p += '/';
      u.pathname = p;
      return u.toString();
    } catch (_e) {
      return '';
    }
  };

  const synccatpawrunnerSettingsVisibility = () => {
    const form = document.getElementById('catpawrunnerSettingsForm');
    const apiInput = form ? form.querySelector('input[name="catpawrunnerApiBase"]') : null;
    const extrasEl = document.getElementById('catpawrunnerSettingsExtras');
    const syncWrap = document.getElementById('catpawrunnerSyncSaveWrap');
    const syncInput = document.getElementById('catpawrunnerSyncSave');
    const syncFromRow = document.getElementById('catpawrunnerSyncFromServerRow');
    const syncFromSelect = document.getElementById('catpawrunnerSyncFromServerSelect');
    if (!apiInput) return;

    const rebuildSyncFromSelect = ({ includeCurrent }) => {
      if (!syncFromSelect) return;
      const prevValue = String(syncFromSelect.value || '');
      syncFromSelect.innerHTML = '';

      const addOpt = (value, label, { disabled = false, selected = false } = {}) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = label;
        opt.disabled = !!disabled;
        opt.selected = !!selected;
        syncFromSelect.appendChild(opt);
      };

      addOpt('', '请选择', { selected: true });
      if (includeCurrent) {
        addOpt('__current__', '当前服务器');
      }

      const serverSelect = document.getElementById('catpawrunnerServerSelect');
      const selectedKey = serverSelect ? String(serverSelect.value || '') : '';
      const omitSelected = includeCurrent && !!selectedKey && selectedKey !== '__new__';

      (catpawrunnerServers || []).forEach((s) => {
        if (!s || typeof s.name !== 'string') return;
        const name = s.name.trim();
        if (!name) return;
        if (omitSelected && name === selectedKey) return;
        addOpt(name, name);
      });

      const stillValid = Array.from(syncFromSelect.options || []).some((o) => o && String(o.value || '') === prevValue);
      syncFromSelect.value = stillValid ? prevValue : '';
      remountCustomSelectElement(syncFromSelect);
    };

    // When adding a new server, never show "sync save" UI.
    if (catpawrunnerServerAddMode) {
      if (extrasEl) extrasEl.classList.add('hidden');
      if (syncWrap) syncWrap.classList.add('hidden');
      if (syncInput) {
        syncInput.checked = false;
        syncInput.disabled = true;
      }
      if (syncFromRow) syncFromRow.classList.remove('hidden');
      rebuildSyncFromSelect({ includeCurrent: false });
      return;
    }

    const currentRaw = typeof apiInput.value === 'string' ? apiInput.value : '';
    const currentNorm = normalizecatpawrunnerAdminBase(currentRaw);

    const showExtras = currentNorm === catpawrunnerSavedApiBaseNorm;
    if (extrasEl) extrasEl.classList.toggle('hidden', !showExtras);

    const showSyncFrom = !!currentNorm && currentNorm !== catpawrunnerSavedApiBaseNorm;
    if (syncWrap) syncWrap.classList.add('hidden');
    if (syncInput) {
      syncInput.checked = false;
      syncInput.disabled = true;
    }
    if (syncFromRow) syncFromRow.classList.toggle('hidden', !showSyncFrom);
    if (showSyncFrom) rebuildSyncFromSelect({ includeCurrent: true });
    else if (syncFromSelect) {
      syncFromSelect.value = '';
      remountCustomSelectElement(syncFromSelect);
    }
  };

  const normalizeHttpUrl = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      u.hash = '';
      return u.toString();
    } catch (_e) {
      return '';
    }
  };

	  const initcatpawrunnerConfigListEditor = () => {
	    if (
	      !catpawrunnerConfigList ||
	      !catpawrunnerConfigListAdd ||
	      !catpawrunnerConfigEditor ||
	      !catpawrunnerConfigEditorName ||
	      !catpawrunnerConfigEditorUrl ||
	      !catpawrunnerConfigEditorConfirm ||
	      !catpawrunnerConfigEditorCancel ||
	      !catpawrunnerConfigEditorStatus
	    )
	      return;

    const CHECK_CACHE_KEY = 'meowfilm_catpawrunner_online_check_v1';
    const loadCheckCache = () => {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(CHECK_CACHE_KEY) : '';
        const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
        const obj = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        const out = new Map();
        Object.entries(obj).forEach(([k, v]) => {
          const url = normalizeHttpUrl(k);
          const val = v && typeof v === 'object' && !Array.isArray(v) ? v : null;
          const sRaw = val ? val.s : '';
          const pRaw = val ? val.p : '';
          const check = normalizeConfigCheckStatus(sRaw);
          const phase = normalizeConfigCheckPhase(pRaw);
          if (url && check && check !== 'unchecked') out.set(url, { status: check, phase });
        });
        return out;
      } catch (_e) {
        return new Map();
      }
    };
    const saveCheckCache = (map) => {
      try {
        if (typeof localStorage === 'undefined') return;
        const obj = {};
        (map instanceof Map ? Array.from(map.entries()) : []).forEach(([k, v]) => {
          const url = normalizeHttpUrl(k);
          const val = v && typeof v === 'object' && !Array.isArray(v) ? v : null;
          const status = normalizeConfigCheckStatus(val ? val.status : '');
          const phase = normalizeConfigCheckPhase(val ? val.phase : '');
          if (url && status && status !== 'unchecked') obj[url] = { s: status, p: phase };
        });
        localStorage.setItem(CHECK_CACHE_KEY, JSON.stringify(obj));
      } catch (_e) {}
    };

    const readCheckCacheEntry = (url) => {
      if (!(checkCache instanceof Map) || !url) return { status: 'unchecked', phase: '' };
      const v = checkCache.get(url);
      const val = v && typeof v === 'object' && !Array.isArray(v) ? v : null;
      const status = normalizeConfigCheckStatus(val ? val.status : '');
      const phase = normalizeConfigCheckPhase(val ? val.phase : '');
      return { status: status || 'unchecked', phase };
    };

    const normalizeConfigItem = (it) => {
      const obj = it && typeof it === 'object' ? it : {};
      const name = typeof obj.name === 'string' ? obj.name.trim() : '';
      const url = normalizeHttpUrl(typeof obj.url === 'string' ? obj.url : '');
      const idRaw = typeof obj.id === 'string' ? obj.id.trim().toLowerCase() : '';
      const id = /^[a-f0-9]{10}$/.test(idRaw) ? idRaw : '';
      const check = normalizeConfigCheckStatus(obj.check);
      const phase = normalizeConfigCheckPhase(obj.checkPhase || obj.phase || '');
      if (!url) return null;
      return { name: name || '未命名', url, id, check, checkPhase: phase };
    };

    const parseInitialItems = () => {
      if (!catpawrunnerConfigListJsonInput) return [];
      const raw = typeof catpawrunnerConfigListJsonInput.value === 'string' ? catpawrunnerConfigListJsonInput.value : '';
      if (!raw.trim()) return [];
      try {
        const arr = JSON.parse(raw);
        const list = Array.isArray(arr) ? arr : [];
        return list.map(normalizeConfigItem).filter(Boolean);
      } catch (_e) {
        return [];
      }
    };

	    let items = parseInitialItems();
	    let checkCache = loadCheckCache();
	    let editorOpen = false;
	    let editorMode = 'add'; // add | edit
	    let editorIndex = -1;

    const editorHome = {
      parent: catpawrunnerConfigEditor.parentElement,
      nextSibling: catpawrunnerConfigEditor.nextSibling,
    };

    const mountEditorHome = () => {
      try {
        if (!editorHome.parent) return;
        catpawrunnerConfigEditor.style.width = '100%';
        if (catpawrunnerConfigEditor.parentElement === editorHome.parent) return;
        editorHome.parent.insertBefore(catpawrunnerConfigEditor, editorHome.nextSibling || null);
      } catch (_e) {}
    };

    const setAddBtnMode = () => {
      if (!catpawrunnerConfigListAdd) return;
      const isAddOpen = editorOpen && editorMode === 'add';
      catpawrunnerConfigListAdd.textContent = isAddOpen ? '取消' : '添加';
    };

    const syncJsonField = () => {
      if (!catpawrunnerConfigListJsonInput) return;
      try {
        const saved = (items || [])
          .filter(Boolean)
          .map((it) => ({ name: it.name, url: it.url, ...(it && it.id ? { id: it.id } : {}) }));
        catpawrunnerConfigListJsonInput.value = JSON.stringify(saved);
      } catch (_e) {
        catpawrunnerConfigListJsonInput.value = '[]';
      }
    };

    const resetEditorStatus = () => {
      if (!catpawrunnerConfigEditorStatus) return;
      catpawrunnerConfigEditorStatus.hidden = true;
      catpawrunnerConfigEditorStatus.textContent = '';
      catpawrunnerConfigEditorStatus.className = 'text-sm mt-2';
    };

    const showEditorError = (msg) => {
      if (!catpawrunnerConfigEditorStatus) return;
      catpawrunnerConfigEditorStatus.hidden = false;
      catpawrunnerConfigEditorStatus.textContent = String(msg || '');
      catpawrunnerConfigEditorStatus.className = 'text-sm mt-2 text-red-600 dark:text-red-300';
    };

    const setConfirmEnabled = () => {
      if (!catpawrunnerConfigEditorConfirm) return;
      const nameRaw =
        typeof catpawrunnerConfigEditorName.value === 'string' ? catpawrunnerConfigEditorName.value.trim() : '';
      const url = normalizeHttpUrl(catpawrunnerConfigEditorUrl.value);
      const enabled = Boolean(nameRaw) && Boolean(url);
      catpawrunnerConfigEditorConfirm.disabled = !enabled;
      if (enabled) {
        catpawrunnerConfigEditorConfirm.classList.add('btn-green');
        catpawrunnerConfigEditorConfirm.classList.remove('btn-add');
      } else {
        catpawrunnerConfigEditorConfirm.classList.add('btn-add');
        catpawrunnerConfigEditorConfirm.classList.remove('btn-green');
      }
    };

    const closeEditor = () => {
      editorOpen = false;
      editorMode = 'add';
      editorIndex = -1;
      mountEditorHome();
      catpawrunnerConfigEditor.classList.add('hidden');
      resetEditorStatus();
      setAddBtnMode();
      setConfirmEnabled();
    };

    const openEditor = ({ mode, index }) => {
      editorOpen = true;
      editorMode = mode === 'edit' ? 'edit' : 'add';
      editorIndex = typeof index === 'number' ? index : -1;
      if (editorMode !== 'edit') mountEditorHome();
      catpawrunnerConfigEditor.classList.remove('hidden');
      resetEditorStatus();
      setAddBtnMode();

      const it = editorMode === 'edit' && editorIndex >= 0 ? items[editorIndex] : null;
      catpawrunnerConfigEditorName.value = it && typeof it.name === 'string' ? it.name : '';
      catpawrunnerConfigEditorUrl.value = it && typeof it.url === 'string' ? it.url : '';
      catpawrunnerConfigEditorConfirm.textContent = editorMode === 'add' ? '添加' : '确定';
      setConfirmEnabled();

      (catpawrunnerConfigEditorName.value ? catpawrunnerConfigEditorUrl : catpawrunnerConfigEditorName).focus();
    };

    const mkBtn = (text, kind = '') => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `action-btn ${kind === 'red' ? 'red' : 'blue'}`;
      btn.textContent = text;
      return btn;
    };

    const render = () => {
      syncJsonField();
      catpawrunnerConfigList.innerHTML = '';
      setAddBtnMode();

      const list = Array.isArray(items) ? items : [];
      if (!list.length) {
        // For "add" mode, keep the editor above the list.
        if (editorOpen && editorMode === 'add') {
          mountEditorHome();
        }
        const tr = createEl('tr', {});
        tr.appendChild(createEl('td', { className: `px-3 py-2 ${CLS.muted}`, text: '-' }));
        tr.appendChild(createEl('td', { className: `px-3 py-2 ${CLS.muted}`, text: '-' }));
        tr.appendChild(createEl('td', { className: `px-3 py-2 ${CLS.muted}`, text: '-' }));
        tr.appendChild(createEl('td', { className: `px-3 py-2 ${CLS.muted}`, text: '-' }));
        catpawrunnerConfigList.appendChild(tr);
        return;
      }

      list.forEach((it, idx) => {
        const tr = createEl('tr', {});
        tr.appendChild(
          createEl('td', {
            className: 'px-3 py-2 font-semibold whitespace-nowrap',
            text: it && typeof it.name === 'string' && it.name.trim() ? it.name.trim() : '未命名',
          })
        );

        const urlTd = createEl('td', { className: 'px-3 py-2' });
        const urlSpan = createEl('span', {
          text: it && typeof it.url === 'string' ? it.url : '',
        });
        urlSpan.style.display = 'inline-block';
        urlSpan.style.minWidth = '30ch';
        urlSpan.style.maxWidth = '60ch';
        urlSpan.style.whiteSpace = 'nowrap';
        urlSpan.style.overflow = 'hidden';
        urlSpan.style.textOverflow = 'ellipsis';
        urlTd.appendChild(urlSpan);
        tr.appendChild(urlTd);

        const checkTd = createEl('td', { className: 'px-3 py-2 whitespace-nowrap' });
        checkTd.appendChild(buildConfigCheckTag(it && it.check ? it.check : 'unchecked', it && it.checkPhase ? it.checkPhase : ''));
        tr.appendChild(checkTd);

      const actionsTd = createEl('td', { className: 'px-3 py-2 whitespace-nowrap' });
      const actionsInner = createEl('div', { className: 'action-group' });

        const isEditingThisRow = editorOpen && editorMode === 'edit' && editorIndex === idx;
        const editBtn = mkBtn(isEditingThisRow ? '取消' : '修改');
        editBtn.addEventListener('click', () => {
          if (isEditingThisRow) {
            closeEditor();
            render();
            return;
          }
          openEditor({ mode: 'edit', index: idx });
          render();
        });

        const delBtn = mkBtn('删除', 'red');
        delBtn.addEventListener('click', () => {
          try {
            const cur = items && items[idx] ? items[idx] : null;
            const url = cur && typeof cur.url === 'string' ? normalizeHttpUrl(cur.url) : '';
            if (url && checkCache instanceof Map && checkCache.has(url)) {
              checkCache.delete(url);
              saveCheckCache(checkCache);
            }
          } catch (_e) {}
          items = (items || []).filter((_x, i) => i !== idx);
          if (editorOpen && editorMode === 'edit') {
            if (editorIndex === idx) closeEditor();
            else if (editorIndex > idx) editorIndex -= 1;
          }
          render();
        });

        actionsInner.appendChild(editBtn);
        actionsInner.appendChild(delBtn);
        actionsTd.appendChild(actionsInner);
        tr.appendChild(actionsTd);
        catpawrunnerConfigList.appendChild(tr);

        if (editorOpen && editorMode === 'edit' && editorIndex === idx) {
          const editorRow = createEl('tr', {});
          const editorCell = createEl('td', { className: 'px-3 py-2' });
          editorCell.colSpan = 4;
          editorRow.appendChild(editorCell);
          catpawrunnerConfigList.appendChild(editorRow);
          try {
            catpawrunnerConfigEditor.style.width = '100%';
            editorCell.appendChild(catpawrunnerConfigEditor);
          } catch (_e) {}
        }
      });

      if (!editorOpen || editorMode === 'add') {
        mountEditorHome();
      }
    };

    const onConfirmEditor = () => {
      const nameRaw =
        typeof catpawrunnerConfigEditorName.value === 'string' ? catpawrunnerConfigEditorName.value.trim() : '';
      if (!nameRaw) {
        showEditorError('名称不能为空');
        catpawrunnerConfigEditorName.focus();
        return;
      }
      const url = normalizeHttpUrl(catpawrunnerConfigEditorUrl.value);
      if (!url) {
        showEditorError('配置地址无效');
        catpawrunnerConfigEditorUrl.focus();
        return;
      }
      const name = nameRaw;

      if (editorMode === 'edit' && editorIndex >= 0 && items && items[editorIndex]) {
        const prev = items[editorIndex];
        const prevCheck = prev && typeof prev.check === 'string' ? prev.check : 'unchecked';
        const prevPhase = prev && typeof prev.checkPhase === 'string' ? prev.checkPhase : '';
        const prevId = prev && typeof prev.id === 'string' ? prev.id : '';
        items = (items || []).map((x, i) => (i === editorIndex ? { name, url, id: prevId, check: prevCheck, checkPhase: prevPhase } : x));
      } else {
        items = (items || []).concat([{ name, url, id: '', check: 'unchecked', checkPhase: '' }]);
      }

      closeEditor();
      render();
    };

    catpawrunnerConfigListAdd.addEventListener('click', (e) => {
      e.preventDefault();
      if (editorOpen) {
        closeEditor();
        render();
      }
      else openEditor({ mode: 'add', index: -1 });
    });
    catpawrunnerConfigEditorCancel.addEventListener('click', (e) => {
      e.preventDefault();
      closeEditor();
      render();
    });
    catpawrunnerConfigEditorConfirm.addEventListener('click', (e) => {
      e.preventDefault();
      onConfirmEditor();
    });
    [catpawrunnerConfigEditorName, catpawrunnerConfigEditorUrl].forEach((el) => {
      el.addEventListener('input', () => setConfirmEnabled());
    });
    [catpawrunnerConfigEditorName, catpawrunnerConfigEditorUrl].forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        onConfirmEditor();
      });
    });

    render();

    const api = {
      getItems: () =>
        (items || [])
          .filter(Boolean)
          .map((it) => ({ name: it.name, url: it.url, ...(it && it.id ? { id: it.id } : {}), check: it.check })),
      setCheckingAll: () => {
        let changed = false;
        items = (items || []).map((it) => {
          if (!it) return it;
          if (normalizeConfigCheckStatus(it.check) === 'checking') return it;
          changed = true;
          return { ...it, check: 'checking', checkPhase: '' };
        });
        if (changed) render();
      },
      setItems: (nextItems = []) => {
        const prevChecksByUrl = new Map(
          (items || [])
            .filter((it) => it && typeof it.url === 'string')
            .map((it) => [
              String(it.url || ''),
              { status: typeof it.check === 'string' ? it.check : '', phase: typeof it.checkPhase === 'string' ? it.checkPhase : '' },
            ])
        );
        const arr = Array.isArray(nextItems) ? nextItems : [];
        items = arr
          .map((it) => normalizeConfigItem(it))
          .filter(Boolean)
          .map((it) => {
            const prev = prevChecksByUrl.get(it.url);
            const cached = readCheckCacheEntry(it.url);
            const status = normalizeConfigCheckStatus(it.check || (prev && prev.status) || cached.status || '');
            const phase = normalizeConfigCheckPhase(
              normalizeConfigCheckStatus(status) === 'error' ? it.checkPhase || (prev && prev.phase) || cached.phase || '' : ''
            );
            return { ...it, check: status, checkPhase: phase };
          });
        render();
      },
      setChecksFromResults: (results = []) => {
        const arr = Array.isArray(results) ? results : [];
        const statusByUrl = new Map();
        arr.forEach((r) => {
          const obj = r && typeof r === 'object' ? r : {};
          const url = normalizeHttpUrl(typeof obj.url === 'string' ? obj.url : '');
          const status = normalizeConfigCheckStatus(obj && obj.status === 'pass' ? 'pass' : 'error');
          const phase = normalizeConfigCheckPhase(obj && typeof obj.phase === 'string' ? obj.phase : '');
          if (url) statusByUrl.set(url, { status, phase });
        });
        let changed = false;
        items = (items || []).map((it) => {
          if (!it) return it;
          const url = typeof it.url === 'string' ? it.url : '';
          if (!url || !statusByUrl.has(url)) return it;
          const next = statusByUrl.get(url);
          const nextCheck = normalizeConfigCheckStatus(next && next.status ? next.status : '') || 'unchecked';
          const nextPhase = normalizeConfigCheckPhase(next && next.phase ? next.phase : '');
          const prevCheck = normalizeConfigCheckStatus(it.check);
          const prevPhase = normalizeConfigCheckPhase(it.checkPhase);
          if (prevCheck === nextCheck && prevPhase === nextPhase) return it;
          changed = true;
          return { ...it, check: nextCheck, checkPhase: nextPhase };
        });
        try {
          if (!(checkCache instanceof Map)) checkCache = loadCheckCache();
          statusByUrl.forEach((v, k) => {
            const check = normalizeConfigCheckStatus(v && v.status ? v.status : '');
            const phase = normalizeConfigCheckPhase(v && v.phase ? v.phase : '');
            if (!k) return;
            if (!check || check === 'unchecked') checkCache.delete(k);
            else checkCache.set(k, { status: check, phase });
          });
          saveCheckCache(checkCache);
        } catch (_e) {}
        if (changed) render();
      },
    };

    return api;
  };

  const getTvUserHeaders = () => {
    const tvUser = resolveTvUser();
    if (!tvUser) return {};
    return { 'X-TV-User': tvUser };
  };

  const requestcatpawrunnerAdminJson = async ({ apiBase, path, method, body, timeoutMs }) => {
    const base = normalizecatpawrunnerAdminBase(apiBase);
    if (!base) throw new Error('CatPawRunner 接口地址无效');
    const cleanPath = String(path || '').replace(/^\//, '');
    const target = new URL(cleanPath, base);

    const headers = { 'Content-Type': 'application/json', ...getTvUserHeaders() };

    const ms = Number.isFinite(Number(timeoutMs)) ? Math.max(0, Math.trunc(Number(timeoutMs))) : 0;
    const controller = ms > 0 && typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), ms) : null;
    try {
      const { resp, data } = await fetchJsonSafe(
        target.toString(),
        {
          method: method || 'GET',
          headers,
          body: body != null ? JSON.stringify(body) : undefined,
          credentials: 'omit',
          signal: controller ? controller.signal : undefined,
        },
        {}
      );
      const status = resp && typeof resp.status === 'number' ? resp.status : 0;
      if (!resp.ok) {
        const msg = data && data.message ? String(data.message) : `HTTP ${status}`;
        const err = new Error(msg);
        err.status = status;
        throw err;
      }
      return data;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const setcatpawrunnerRemoteState = (state, message = '') => {
    const remoteSettingsEl = document.getElementById('catpawrunnerRemoteSettings');
    const remoteErrorEl = document.getElementById('catpawrunnerRemoteError');
    const versionRow = document.getElementById('catpawrunnerVersionRow');
    const versionText = document.getElementById('catpawrunnerVersionText');
    try {
      if (remoteSettingsEl) remoteSettingsEl.classList.toggle('hidden', state !== 'ready');
      if (remoteErrorEl) {
        const showErr = state === 'error';
        remoteErrorEl.classList.toggle('hidden', !showErr);
        remoteErrorEl.textContent = showErr ? (message || 'CatPawRunner 接口异常') : '';
      }
      if (state === 'hidden') {
        if (remoteErrorEl) {
          remoteErrorEl.classList.add('hidden');
          remoteErrorEl.textContent = '';
        }
      }
      if (state !== 'ready') {
        if (versionRow) versionRow.classList.add('hidden');
        if (versionText) versionText.textContent = '';
      }
    } catch (_e) {}
  };

  const refreshcatpawrunnerRemoteSettings = async (apiBaseOverride) => {
    const apiInput = document.querySelector('#catpawrunnerSettingsForm input[name="catpawrunnerApiBase"]');
    const apiBase = typeof apiBaseOverride === 'string'
      ? apiBaseOverride
      : apiInput && typeof apiInput.value === 'string'
        ? apiInput.value
        : '';
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) {
      setcatpawrunnerRemoteState('hidden');
      return { ok: false, skipped: true, reason: 'unconfigured' };
    }
    try {
      const settingsResp = await requestcatpawrunnerAdminJson({
        apiBase: normalizedBase,
        path: 'admin/settings',
        method: 'GET',
      });
      try {
        const versionRow = document.getElementById('catpawrunnerVersionRow');
        const versionText = document.getElementById('catpawrunnerVersionText');
        const raw =
          settingsResp && typeof settingsResp.version === 'string'
            ? settingsResp.version
            : settingsResp && settingsResp.settings && typeof settingsResp.settings.version === 'string'
              ? settingsResp.settings.version
              : '';
        const v = typeof raw === 'string' ? raw.trim() : '';
        if (versionRow && versionText && v) {
          versionText.textContent = `CatPawRunner 版本: ${v}`;
          versionRow.classList.remove('hidden');
        } else {
          if (versionText) versionText.textContent = '';
          if (versionRow) versionRow.classList.add('hidden');
        }
      } catch (_e) {}
      const proxyInput = document.querySelector('#catpawrunnerSettingsForm input[name="catpawrunnerProxy"]');
      if (proxyInput && settingsResp && settingsResp.settings && typeof settingsResp.settings.proxy === 'string') {
        proxyInput.value = settingsResp.settings.proxy || '';
      }
      const goProxyApiInput = document.querySelector('#catpawrunnerSettingsForm input[name="catpawrunnerGoProxyApi"]');
      if (goProxyApiInput && settingsResp && settingsResp.settings && typeof settingsResp.settings.goProxyApi === 'string') {
        goProxyApiInput.value = settingsResp.settings.goProxyApi || '';
      }
      const panBuiltinInput = document.getElementById('catpawrunnerPanBuiltinResolverEnabled');
      if (panBuiltinInput && settingsResp && settingsResp.settings) {
        panBuiltinInput.checked = !!settingsResp.settings.panBuiltinResolverEnabled;
      }
      const panMockInput = document.getElementById('catpawrunnerPanMockEnabled');
      if (panMockInput && settingsResp && settingsResp.settings) {
        panMockInput.checked = !!settingsResp.settings.pan_mock;
      }
      if (catpawrunnerConfigListEditor && settingsResp && Array.isArray(settingsResp.onlineConfigs)) {
        catpawrunnerConfigListEditor.setItems(
          settingsResp.onlineConfigs.map((it) => ({
            name: it && typeof it.name === 'string' ? it.name : '',
            url: it && typeof it.url === 'string' ? it.url : '',
            id: it && typeof it.id === 'string' ? it.id : '',
            check: it && typeof it.status === 'string' ? it.status : '',
            phase: it && typeof it.phase === 'string' ? it.phase : '',
          }))
        );
      }
      setcatpawrunnerRemoteState('ready');
      return { ok: true, data: { settingsResp } };
    } catch (e) {
      const msg = e && e.message ? String(e.message) : '';
      try {
        const versionRow = document.getElementById('catpawrunnerVersionRow');
        const versionText = document.getElementById('catpawrunnerVersionText');
        if (versionText) versionText.textContent = '';
        if (versionRow) versionRow.classList.add('hidden');
      } catch (_e) {}
      setcatpawrunnerRemoteState('error', msg);
      return { ok: false, skipped: false, reason: 'error', error: e };
    }
  };

  const synccatpawrunnerRemoteSettings = async (apiBase) => {
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) return { ok: false, skipped: true, reason: 'unconfigured' };
    const proxyInput = document.querySelector('#catpawrunnerSettingsForm input[name="catpawrunnerProxy"]');
    const proxy = proxyInput && typeof proxyInput.value === 'string' ? proxyInput.value : '';
    const goProxyApiInput = document.querySelector('#catpawrunnerSettingsForm input[name="catpawrunnerGoProxyApi"]');
    const goProxyApi = goProxyApiInput && typeof goProxyApiInput.value === 'string' ? goProxyApiInput.value : '';
    const panBuiltinInput = document.getElementById('catpawrunnerPanBuiltinResolverEnabled');
    const panBuiltinResolverEnabled = !!(panBuiltinInput && panBuiltinInput.checked);
    const panMockInput = document.getElementById('catpawrunnerPanMockEnabled');
    const panMockEnabled = !!(panMockInput && panMockInput.checked);
    const onlineConfigs = catpawrunnerConfigListEditor ? catpawrunnerConfigListEditor.getItems().map((it) => ({ name: it.name, url: it.url })) : [];
    const parts = [];
    try {
      const resp = await requestcatpawrunnerAdminJson({
        apiBase: normalizedBase,
        path: 'admin/settings',
        method: 'PUT',
        body: { proxy: String(proxy || ''), pan_mock: panMockEnabled, panBuiltinResolverEnabled, goProxyApi: String(goProxyApi || ''), onlineConfigs },
      });
      if (proxyInput && resp && resp.settings && typeof resp.settings.proxy === 'string') {
        proxyInput.value = resp.settings.proxy || '';
      }
      if (panBuiltinInput && resp && resp.settings) panBuiltinInput.checked = !!resp.settings.panBuiltinResolverEnabled;
      if (panMockInput && resp && resp.settings) panMockInput.checked = !!resp.settings.pan_mock;
      if (catpawrunnerConfigListEditor && resp && Array.isArray(resp.onlineConfigs)) {
        catpawrunnerConfigListEditor.setChecksFromResults(resp.onlineConfigs);
      }
      return { ok: true, parts: [], data: resp };
    } catch (err) {
      const msg = err && err.message ? String(err.message) : '同步失败';
      parts.push(msg);
      return { ok: false, parts };
    }
  };

  const unwrapcatpawrunnerWebsiteData = (resp) => {
    if (!resp) throw new Error('CatPawRunner 返回为空');
    if (resp && typeof resp === 'object') {
      if (resp.code === 0) return resp.data;
      if (resp.success === true && Object.prototype.hasOwnProperty.call(resp, 'data')) return resp.data;
      if (Object.prototype.hasOwnProperty.call(resp, 'data')) return resp.data;
      const msg = typeof resp.message === 'string' ? resp.message : '';
      if (msg) throw new Error(msg);
    }
    return resp;
  };

  const getcatpawrunnerApiBase = () => {
    const input = catpawrunnerForm ? catpawrunnerForm.querySelector('input[name="catpawrunnerApiBase"]') : null;
    if (input) {
      const v = typeof input.value === 'string' ? input.value.trim() : '';
      if (v) return v;
      const attr = typeof input.getAttribute === 'function' ? String(input.getAttribute('value') || '').trim() : '';
      if (attr) return attr;
    }
    return '';
  };

  const catpawrunnerApiBaseCache = { t: 0, v: '', inFlight: null };

  const readcatpawrunnerApiBaseFromDom = () => {
    try {
      const form = document.getElementById('catpawrunnerSettingsForm');
      const input = form ? form.querySelector('input[name="catpawrunnerApiBase"]') : null;
      if (!input) return '';
      const v = typeof input.value === 'string' ? input.value.trim() : '';
      if (v) return v;
      const attr = typeof input.getAttribute === 'function' ? String(input.getAttribute('value') || '').trim() : '';
      return attr || '';
    } catch (_e) {
      return '';
    }
  };

  const resolvecatpawrunnerApiBase = async (ttlMs = 10 * 1000) => {
    const direct = readcatpawrunnerApiBaseFromDom() || getcatpawrunnerApiBase();
    if (direct) {
      catpawrunnerApiBaseCache.v = direct;
      catpawrunnerApiBaseCache.t = Date.now();
      return direct;
    }

    const now = Date.now();
    if (catpawrunnerApiBaseCache.v && now - catpawrunnerApiBaseCache.t < ttlMs) return catpawrunnerApiBaseCache.v;
    if (catpawrunnerApiBaseCache.inFlight) return await catpawrunnerApiBaseCache.inFlight;

    catpawrunnerApiBaseCache.inFlight = (async () => {
      try {
        const settings = await getSuccessJson('/dashboard/site/settings');
        const base = resolvecatpawrunnerApiBaseFromSettings(settings);
        catpawrunnerApiBaseCache.v = base;
        catpawrunnerApiBaseCache.t = Date.now();
        if (base) {
          try {
            const form = document.getElementById('catpawrunnerSettingsForm');
            const input = form ? form.querySelector('input[name="catpawrunnerApiBase"]') : null;
            if (input) input.value = base;
          } catch (_e) {}
        }
        return base;
      } catch (_e) {
        catpawrunnerApiBaseCache.v = '';
        catpawrunnerApiBaseCache.t = Date.now();
        return '';
      }
    })();

    try {
      return await catpawrunnerApiBaseCache.inFlight;
    } finally {
      catpawrunnerApiBaseCache.inFlight = null;
    }
  };

  const fetchcatpawrunnerStatus = async ({ apiBase, path }) => {
    const base = normalizecatpawrunnerAdminBase(apiBase);
    if (!base) throw new Error('CatPawRunner 接口地址未设置');
    const cleanPath = String(path || '').replace(/^\//, '');
    const target = new URL(cleanPath, base);
    try {
      const targetHost = String(target.hostname || '').toLowerCase();
      const pageHost = String((window && window.location && window.location.hostname) || '').toLowerCase();
      const isTargetLocal = targetHost === 'localhost' || targetHost === '127.0.0.1' || targetHost === '::1';
      const isPageLocal = pageHost === 'localhost' || pageHost === '127.0.0.1' || pageHost === '::1';
      if (isTargetLocal && !isPageLocal) return false;
    } catch (_e) {}
    const headers = getTvUserHeaders();
    const resp = await fetch(target.toString(), { method: 'GET', headers, credentials: 'omit' });
    return resp && resp.ok;
  };

  const setGoProxyStatus = bindInlineStatus(goProxySaveStatus);

  const normalizeGoProxyProbeState = (v) => {
    const raw = typeof v === 'string' ? v.trim() : '';
    if (raw === 'online' || raw === 'offline' || raw === 'checking') return raw;
    return 'checking';
  };
  const goProxyProbeClassFor = (state) => {
    const s = normalizeGoProxyProbeState(state);
    if (s === 'online') return 'tag-green';
    if (s === 'offline') return 'tag-red';
    return 'tag-gray';
  };
  const goProxyProbeTextFor = (state) => {
    const s = normalizeGoProxyProbeState(state);
    if (s === 'online') return '在线';
    if (s === 'offline') return '离线';
    return '检测中';
  };
  const buildGoProxyProbeTag = (state) => {
    const span = document.createElement('span');
    span.className = `availability-tag ${goProxyProbeClassFor(state)}`;
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>${goProxyProbeTextFor(state)}`;
    return span;
  };

  const displayGoProxyBaseHost = (base) => {
    const raw = typeof base === 'string' ? base.trim() : '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      const host = String(u.host || '').trim();
      return host || raw;
    } catch (_e) {
      return raw;
    }
  };

  const buildGoProxyPanSwitch = ({ label, base, panKey, checked }) => {
    const wrap = createEl('div', { className: 'flex items-center gap-2' });
    wrap.appendChild(
      createEl('span', {
        className: 'text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap',
        text: String(label || ''),
      })
    );

    const switchLabel = createEl('label', { className: 'enable-switch' });
    switchLabel.title = String(label || '');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    input.setAttribute('data-goproxy-pan', String(panKey || ''));
    input.setAttribute('data-goproxy-base', String(base || ''));

    const slider = createEl('span', { className: 'enable-slider' });
    switchLabel.appendChild(input);
    switchLabel.appendChild(slider);
    wrap.appendChild(switchLabel);
    return wrap;
  };

  const guessGoProxyNameFromBase = (base) => {
    try {
      const u = new URL(base);
      const host = String(u.host || '').trim();
      return host || '';
    } catch (_e) {
      return '';
    }
  };

  const normalizeGoProxyServers = (servers) => {
    const arr = Array.isArray(servers) ? servers : [];
    const out = [];
    const seen = new Set();
    arr.forEach((s) => {
      const base = typeof s === 'string' ? normalizeHttpBase(s) : normalizeHttpBase(s && s.base);
      if (!base) return;
      const key = base.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      const rawName = s && typeof s === 'object' && typeof s.name === 'string' ? s.name : '';
      const rawDisplayName = s && typeof s === 'object' && typeof s.displayName === 'string' ? s.displayName : '';
      const defaultName = guessGoProxyNameFromBase(base);
      const name = String(rawName || '').trim() || defaultName;
      const displayName = String(rawDisplayName || '').trim() || name;

      const pans = s && typeof s === 'object' && typeof s.pans === 'object' && s.pans ? s.pans : {};
      const hasBaidu = Object.prototype.hasOwnProperty.call(pans, 'baidu');
      const hasQuark = Object.prototype.hasOwnProperty.call(pans, 'quark');

      out.push({
        name,
        displayName,
        base,
        pans: {
          baidu: hasBaidu ? !!pans.baidu : true,
          quark: hasQuark ? !!pans.quark : true,
        },
      });
    });
    return out;
  };

  const ensureGoProxyProbeEntry = (base) => {
    const key = String(base || '').toLowerCase();
    if (!key) return;
    if (goProxyProbes.has(key)) return;
    goProxyProbes.set(key, { state: 'checking', version: '', checkedAt: 0 });
  };

  const writeGoProxyServersJson = () => {
    const serversJson = JSON.stringify(goProxyServers || []);
    if (goProxyServersJsonInput) goProxyServersJsonInput.value = serversJson;
    return serversJson;
  };

  const renderGoProxyServerTable = () => {
    if (!goProxyServerTableBody) return;
    goProxyServerTableBody.innerHTML = '';
    if (!goProxyServers.length) {
      restoreGoProxyServerEditorHome();
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.className = 'px-3 py-2 text-gray-500 dark:text-gray-400';
      td.colSpan = 7;
      td.textContent = '无数据';
      tr.appendChild(td);
      goProxyServerTableBody.appendChild(tr);
      return;
    }

    const editingKey = goProxyEditorMode === 'edit' ? String(goProxyEditorEditingKey || '').toLowerCase() : '';

    goProxyServers.forEach((server) => {
      const base = server && typeof server.base === 'string' ? server.base : '';
      const baseKey = base ? base.toLowerCase() : '';
      const probe = baseKey && goProxyProbes.has(baseKey) ? goProxyProbes.get(baseKey) : { state: 'checking', version: '', checkedAt: 0 };
      const state = probe && probe.state ? probe.state : 'checking';

      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.className = 'px-3 py-2 whitespace-nowrap font-medium';
      tdName.textContent = String(server.name || '');

      const tdDisplay = document.createElement('td');
      tdDisplay.className = 'px-3 py-2 whitespace-nowrap';
      tdDisplay.textContent = String(server.displayName || '');

      const tdBase = document.createElement('td');
      tdBase.className = 'px-3 py-2 font-mono whitespace-nowrap';
      tdBase.textContent = displayGoProxyBaseHost(base);

      const tdVersion = document.createElement('td');
      tdVersion.className = 'px-3 py-2 whitespace-nowrap';
      if (normalizeGoProxyProbeState(state) === 'checking') tdVersion.textContent = '检测中';
      else if (normalizeGoProxyProbeState(state) === 'online') tdVersion.textContent = (probe && probe.version ? String(probe.version) : '未知');
      else tdVersion.textContent = '异常';

      const tdStatus = document.createElement('td');
      tdStatus.className = 'px-3 py-2 whitespace-nowrap';
      tdStatus.appendChild(buildGoProxyProbeTag(state));

      const tdPans = document.createElement('td');
      tdPans.className = 'px-3 py-2 whitespace-nowrap';
      const pansWrap = createEl('div', { className: 'flex items-center gap-4' });
      const pans = server && typeof server.pans === 'object' && server.pans ? server.pans : {};
      pansWrap.appendChild(buildGoProxyPanSwitch({ label: '百度', base, panKey: 'baidu', checked: !!pans.baidu }));
      pansWrap.appendChild(buildGoProxyPanSwitch({ label: '夸克', base, panKey: 'quark', checked: !!pans.quark }));
      tdPans.appendChild(pansWrap);

      const tdActions = document.createElement('td');
      tdActions.className = 'px-3 py-2 whitespace-nowrap';
      const actWrap = createEl('div', { className: 'action-group' });

      const isEditingRow = !!(editingKey && baseKey && editingKey === baseKey);
      const editBtn = createEl('button', { className: 'action-btn blue', text: isEditingRow ? '取消' : '修改' });
      editBtn.type = 'button';
      editBtn.setAttribute('data-goproxy-action', isEditingRow ? 'cancel' : 'edit');
      editBtn.setAttribute('data-goproxy-base', base);

      const delBtn = createEl('button', { className: 'action-btn red', text: '删除' });
      delBtn.type = 'button';
      delBtn.setAttribute('data-goproxy-action', 'delete');
      delBtn.setAttribute('data-goproxy-base', base);

      actWrap.appendChild(editBtn);
      actWrap.appendChild(delBtn);
      tdActions.appendChild(actWrap);

      tr.appendChild(tdName);
      tr.appendChild(tdDisplay);
      tr.appendChild(tdBase);
      tr.appendChild(tdVersion);
      tr.appendChild(tdStatus);
      tr.appendChild(tdPans);
      tr.appendChild(tdActions);
      goProxyServerTableBody.appendChild(tr);

      if (isEditingRow && goProxyServerEditor) {
        const editorRow = document.createElement('tr');
        const editorTd = document.createElement('td');
        editorTd.colSpan = 7;
        editorTd.className = 'px-3 py-2';
        editorRow.appendChild(editorTd);
        try {
          goProxyServerEditor.style.width = '100%';
        } catch (_e) {}
        editorTd.appendChild(goProxyServerEditor);
        goProxyServerTableBody.appendChild(editorRow);
      }
    });

    if (goProxyEditorMode !== 'edit') {
      restoreGoProxyServerEditorHome();
    } else if (goProxyServerEditor && !goProxyServerEditor.parentNode) {
      restoreGoProxyServerEditorHome();
    }
  };

  const probeGoProxyVersion = async (base, { timeoutMs = 4000 } = {}) => {
    const normalized = normalizeHttpBase(base);
    if (!normalized) return { ok: false };
    const key = normalized.toLowerCase();
    const prev = goProxyProbes.has(key) ? goProxyProbes.get(key) : null;
    goProxyProbes.set(key, { state: 'checking', version: '', checkedAt: prev && prev.checkedAt ? prev.checkedAt : 0 });
    renderGoProxyServerTable();

    const baseWithSlash = `${normalized}/`;
    const url = new URL('version', baseWithSlash).toString();
    const ms = Number.isFinite(Number(timeoutMs)) ? Math.max(0, Math.trunc(Number(timeoutMs))) : 0;
    const controller = ms > 0 && typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), ms) : null;
    try {
      const { resp, data } = await fetchJsonSafe(
        url,
        { method: 'GET', credentials: 'omit', signal: controller ? controller.signal : undefined },
        {}
      );
      if (resp && resp.ok) {
        const version = data && typeof data.version === 'string' ? data.version.trim() : '';
        goProxyProbes.set(key, { state: 'online', version, checkedAt: Date.now() });
        renderGoProxyServerTable();
        return { ok: true, version };
      }
      goProxyProbes.set(key, { state: 'offline', version: '', checkedAt: Date.now() });
      renderGoProxyServerTable();
      return { ok: false };
    } catch (_e) {
      goProxyProbes.set(key, { state: 'offline', version: '', checkedAt: Date.now() });
      renderGoProxyServerTable();
      return { ok: false };
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const probeAllGoProxyVersions = async () => {
    const servers = Array.isArray(goProxyServers) ? goProxyServers : [];
    await Promise.all(
      servers
        .map((s) => (s && typeof s.base === 'string' ? normalizeHttpBase(s.base) : ''))
        .filter(Boolean)
        .map((b) => probeGoProxyVersion(b, { timeoutMs: 4000 }))
    );
  };



  adminNavs.forEach((nav) => {
    nav.addEventListener('click', (e) => {
      e.preventDefault();
      const key = normalizePanelKey(nav.dataset.admin || 'site');
      showPanel(key);
      writePanelToHash(key);
      ensurePanelDataLoaded(key);
    });
  });
  if (adminNavs.length && panels.length) {
    initialPanelKey = readPanelFromHash();
    showPanel(initialPanelKey);
  }

  window.addEventListener('hashchange', () => {
    const key = readPanelFromHash();
    showPanel(key);
    ensurePanelDataLoaded(key);
  });

  const dataSelect = document.getElementById('doubanDataSelect');
  const dataCustom = document.getElementById('doubanDataCustom');
  const imgSelect = document.getElementById('doubanImgSelect');
  const imgCustom = document.getElementById('doubanImgCustom');
  const toggleCustom = (selectEl, boxEl) => {
    if (!selectEl || !boxEl) return;
    const val = selectEl.value;
    boxEl.classList.toggle('hidden', val !== 'custom');
  };
  if (dataSelect) dataSelect.addEventListener('change', () => toggleCustom(dataSelect, dataCustom));
  if (imgSelect) imgSelect.addEventListener('change', () => toggleCustom(imgSelect, imgCustom));
  toggleCustom(dataSelect, dataCustom);
  toggleCustom(imgSelect, imgCustom);

  let customDropdownDocBound = false;
  const hideAllCustomDropdowns = () => {
    try {
      document.querySelectorAll('.custom-dropdown-list').forEach((el) => el.classList.add('hidden'));
    } catch (_e) {}
  };
  const ensureCustomDropdownDocBound = () => {
    if (customDropdownDocBound) return;
    customDropdownDocBound = true;
    document.addEventListener('click', () => hideAllCustomDropdowns());
  };

	  const setupCustomSelectElement = (sel) => {
	    if (!sel || !sel.parentNode) return;
	    if (sel.dataset.customDropdownMounted === 'true') return;
	    sel.dataset.customDropdownMounted = 'true';

	    const autoSizeMode = typeof sel.dataset.customDropdownAutosize === 'string' ? sel.dataset.customDropdownAutosize : '';
	    const shouldAutoSizeToMax = autoSizeMode === 'max';

	    const wrapper = document.createElement('div');
	    wrapper.className = 'custom-dropdown';
	    sel.classList.add('hidden-select');
	    sel.parentNode.insertBefore(wrapper, sel);
	    wrapper.appendChild(sel);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'custom-dropdown-btn';
    const currentText =
      (sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text) || '请选择';
	    btn.textContent = currentText;

	    const list = document.createElement('div');
	    list.className = 'custom-dropdown-list hidden';
	    Array.from(sel.options).forEach((opt) => {
      const item = document.createElement('div');
      item.className = 'custom-dropdown-item';
      item.textContent = opt.text;
      item.dataset.value = opt.value;
      if (opt.selected) item.classList.add('active');
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        sel.value = opt.value;
        btn.textContent = opt.text;
        list.classList.add('hidden');
        list.querySelectorAll('.custom-dropdown-item').forEach((n) => n.classList.remove('active'));
        item.classList.add('active');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      list.appendChild(item);
    });

	    btn.addEventListener('click', (e) => {
	      e.stopPropagation();
	      ensureCustomDropdownDocBound();
	      const willOpen = list.classList.contains('hidden');
	      if (willOpen && shouldAutoSizeToMax) {
	        try {
	          list.classList.remove('hidden');
	          const prevVisibility = list.style.visibility;
	          const prevPointer = list.style.pointerEvents;
	          list.style.visibility = 'hidden';
	          list.style.pointerEvents = 'none';

	          let maxW = 0;
	          const btnW = typeof btn.scrollWidth === 'number' ? btn.scrollWidth : 0;
	          if (btnW > maxW) maxW = btnW;
	          list.querySelectorAll('.custom-dropdown-item').forEach((n) => {
	            const w = typeof n.scrollWidth === 'number' ? n.scrollWidth : 0;
	            if (w > maxW) maxW = w;
	          });
	          const nextW = Math.max(0, Math.ceil(maxW));
	          if (nextW) wrapper.style.width = `${nextW}px`;

	          list.style.visibility = prevVisibility;
	          list.style.pointerEvents = prevPointer;
	          list.classList.add('hidden');
	        } catch (_e) {}
	      }
	      hideAllCustomDropdowns();
	      list.classList.toggle('hidden', !willOpen);
	    });

	    wrapper.appendChild(btn);
	    wrapper.appendChild(list);

	    if (shouldAutoSizeToMax) {
	      try {
	        // Initial sizing so the button and the list share the same width.
	        list.classList.remove('hidden');
	        const prevVisibility = list.style.visibility;
	        const prevPointer = list.style.pointerEvents;
	        list.style.visibility = 'hidden';
	        list.style.pointerEvents = 'none';

	        let maxW = 0;
	        const btnW = typeof btn.scrollWidth === 'number' ? btn.scrollWidth : 0;
	        if (btnW > maxW) maxW = btnW;
	        list.querySelectorAll('.custom-dropdown-item').forEach((n) => {
	          const w = typeof n.scrollWidth === 'number' ? n.scrollWidth : 0;
	          if (w > maxW) maxW = w;
	        });
	        const nextW = Math.max(0, Math.ceil(maxW));
	        if (nextW) wrapper.style.width = `${nextW}px`;

	        list.style.visibility = prevVisibility;
	        list.style.pointerEvents = prevPointer;
	        list.classList.add('hidden');
	      } catch (_e) {}
	    }
	  };

  const remountCustomSelectElement = (sel) => {
    if (!sel) return;
    const wrapper = sel.parentNode;
    if (wrapper && wrapper.classList && wrapper.classList.contains('custom-dropdown')) {
      const parent = wrapper.parentNode;
      if (parent) parent.insertBefore(sel, wrapper);
      wrapper.remove();
    }
    try {
      delete sel.dataset.customDropdownMounted;
    } catch (_e) {
      if (sel.dataset) sel.dataset.customDropdownMounted = '';
    }
    sel.classList.remove('hidden-select');
    setupCustomSelectElement(sel);
  };

  const setupCustomSelect = (selectId) => {
    const sel = document.getElementById(selectId);
    setupCustomSelectElement(sel);
  };

  setupCustomSelect('doubanDataSelect');
  setupCustomSelect('doubanImgSelect');
  setupCustomSelect('searchDisplayModeSelect');
  setupCustomSelect('smartSourceExtractPriority');
  setupCustomSelect('catpawrunnerServerSelect');
  setupCustomSelect('catpawrunnerSyncFromServerSelect');

  const panSettingDefs = [
    { key: 'baidu', name: '百度', type: 'cookie' },
    { key: 'quark', name: '夸克', type: 'cookie' },
    { key: 'quark_tv', name: '夸克TV', type: 'quark_tv' },
    { key: '189', name: '天翼', type: 'account' },
    { key: '139', name: '移动', type: 'authorization' },
    { key: 'uc', name: 'UC', type: 'cookie' },
    { key: 'uc_tv', name: 'UC_TV', type: 'uc_tv' },
    { key: 'pan123', name: '123', type: 'account' },
    { key: '115', name: '115', type: 'cookie' },
    { key: 'bili', name: 'Bilibili', type: 'cookie' },
    { key: 'wuming', name: '观影', type: 'cookie' },
    { key: 'yunchao', name: '云巢', type: 'account' },
    { key: 'pan123ziyuan', name: '123资源网', type: 'cookie' },
  ];

  let panLoginSettings = {};
  const loadedPanSettingKeys = new Set();
  let activePanSettingKey = panSettingDefs[0] ? panSettingDefs[0].key : '';

  const setPanSettingsStatus = bindInlineStatus(panSettingsStatus);

  const baiduQrState = {
    qid: '',
    expiresAt: 0,
    imageUrl: '',
    status: '',
    message: '',
    pollTimer: null,
  };

  const quarkQrState = {
    qid: '',
    expiresAt: 0,
    imageUrl: '',
    status: '',
    message: '',
    pollTimer: null,
  };

  const ucQrState = {
    qid: '',
    expiresAt: 0,
    imageUrl: '',
    status: '',
    message: '',
    pollTimer: null,
  };

  const pan115QrState = {
    qid: '',
    expiresAt: 0,
    imageUrl: '',
    status: '',
    message: '',
    pollTimer: null,
  };

  const biliQrState = {
    qid: '',
    expiresAt: 0,
    imageUrl: '',
    status: '',
    message: '',
    pollTimer: null,
  };

  const stopBaiduQrPoll = () => {
    if (baiduQrState.pollTimer) {
      clearInterval(baiduQrState.pollTimer);
      baiduQrState.pollTimer = null;
    }
  };

  const stopQuarkQrPoll = () => {
    if (quarkQrState.pollTimer) {
      clearInterval(quarkQrState.pollTimer);
      quarkQrState.pollTimer = null;
    }
  };

  const stopUcQrPoll = () => {
    if (ucQrState.pollTimer) {
      clearInterval(ucQrState.pollTimer);
      ucQrState.pollTimer = null;
    }
  };

  const stop115QrPoll = () => {
    if (pan115QrState.pollTimer) {
      clearInterval(pan115QrState.pollTimer);
      pan115QrState.pollTimer = null;
    }
  };

  const stopBiliQrPoll = () => {
    if (biliQrState.pollTimer) {
      clearInterval(biliQrState.pollTimer);
      biliQrState.pollTimer = null;
    }
  };

  const isBaiduQrExpired = () => {
    if (!baiduQrState.qid) return true;
    const exp = Number(baiduQrState.expiresAt || 0);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    return Date.now() > exp - 1500;
  };

  const isQuarkQrExpired = () => {
    if (!quarkQrState.qid) return true;
    const exp = Number(quarkQrState.expiresAt || 0);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    return Date.now() > exp - 1500;
  };

  const isUcQrExpired = () => {
    if (!ucQrState.qid) return true;
    const exp = Number(ucQrState.expiresAt || 0);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    return Date.now() > exp - 1500;
  };

  const is115QrExpired = () => {
    if (!pan115QrState.qid) return true;
    const exp = Number(pan115QrState.expiresAt || 0);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    return Date.now() > exp - 1500;
  };

  const isBiliQrExpired = () => {
    if (!biliQrState.qid) return true;
    const exp = Number(biliQrState.expiresAt || 0);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    return Date.now() > exp - 1500;
  };

  const startBaiduQrPoll = () => {
    stopBaiduQrPoll();
    if (!baiduQrState.qid || isBaiduQrExpired()) return;
    const tick = async () => {
      if (!baiduQrState.qid || isBaiduQrExpired()) {
        stopBaiduQrPoll();
        baiduQrState.status = 'expired';
        baiduQrState.imageUrl = '';
        baiduQrState.qid = '';
        baiduQrState.expiresAt = 0;
        setPanSettingsStatus('error', '二维码登录超时/已过期');
        renderPanSettingsContent();
        return;
      }
      try {
        const { resp, data } = await postJsonSafe('/dashboard/pan/baidu/cookie', { qid: baiduQrState.qid });
        if (resp.ok && data && data.success === true && typeof data.cookie === 'string') {
          const cookie = String(data.cookie || '');
          const textarea = panSettingsContent
            ? panSettingsContent.querySelector('textarea[data-pan-cookie-input="baidu"]')
            : null;
          if (textarea) textarea.value = cookie;
          panLoginSettings = Object.assign({}, panLoginSettings, {
            baidu: Object.assign({}, getPanSettingValue('baidu'), { cookie }),
          });
          stopBaiduQrPoll();
          baiduQrState.status = 'confirmed';
          baiduQrState.imageUrl = '';
          baiduQrState.qid = '';
          baiduQrState.expiresAt = 0;
          setPanSettingsStatus('', '');
          notify.success('Cookie已获取并自动保存成功');
          renderPanSettingsContent();
          return;
        }
        if (resp.status === 409) {
          const st = data && data.status ? String(data.status) : 'pending';
          baiduQrState.status = st;
          if (st === 'scanned') setPanSettingsStatus('', '已扫码：请在手机端确认登录…');
          else setPanSettingsStatus('', '等待扫码确认…');
          return;
        }
        const msg = (data && data.message) ? String(data.message) : `HTTP ${resp.status}`;
        stopBaiduQrPoll();
        baiduQrState.status = 'error';
        baiduQrState.imageUrl = '';
        baiduQrState.qid = '';
        baiduQrState.expiresAt = 0;
        setPanSettingsStatus('error', msg);
        renderPanSettingsContent();
      } catch (e) {
        stopBaiduQrPoll();
        baiduQrState.status = 'error';
        baiduQrState.imageUrl = '';
        baiduQrState.qid = '';
        baiduQrState.expiresAt = 0;
        setPanSettingsStatus('error', (e && e.message) ? String(e.message) : '获取失败');
        renderPanSettingsContent();
      }
    };
    tick();
    baiduQrState.pollTimer = setInterval(tick, 1500);
    renderPanSettingsContent();
  };

  const startQuarkQrPoll = () => {
    stopQuarkQrPoll();
    if (!quarkQrState.qid || isQuarkQrExpired()) return;
    const tick = async () => {
      if (!quarkQrState.qid || isQuarkQrExpired()) {
        stopQuarkQrPoll();
        quarkQrState.status = 'expired';
        quarkQrState.imageUrl = '';
        quarkQrState.qid = '';
        quarkQrState.expiresAt = 0;
        setPanSettingsStatus('error', '二维码登录超时/已过期');
        renderPanSettingsContent();
        return;
      }
      try {
        const { resp, data } = await postJsonSafe('/dashboard/pan/quark/cookie', { qid: quarkQrState.qid });
        if (resp.ok && data && data.success === true && typeof data.cookie === 'string') {
          const cookie = String(data.cookie || '');
          const textarea = panSettingsContent
            ? panSettingsContent.querySelector('textarea[data-pan-cookie-input="quark"]')
            : null;
          if (textarea) textarea.value = cookie;
          panLoginSettings = Object.assign({}, panLoginSettings, {
            quark: Object.assign({}, getPanSettingValue('quark'), { cookie }),
          });
          stopQuarkQrPoll();
          quarkQrState.status = 'confirmed';
          quarkQrState.imageUrl = '';
          quarkQrState.qid = '';
          quarkQrState.expiresAt = 0;
          setPanSettingsStatus('', '');
          notify.success('Cookie已获取并自动保存成功');
          renderPanSettingsContent();
          return;
        }
        if (resp.status === 409) {
          const st = data && data.status ? String(data.status) : 'pending';
          quarkQrState.status = st;
          if (st === 'scanned') setPanSettingsStatus('', '已扫码：请在手机端确认登录…');
          else setPanSettingsStatus('', '等待扫码确认…');
          return;
        }
        const msg = (data && data.message) ? String(data.message) : `HTTP ${resp.status}`;
        stopQuarkQrPoll();
        quarkQrState.status = 'error';
        quarkQrState.imageUrl = '';
        quarkQrState.qid = '';
        quarkQrState.expiresAt = 0;
        setPanSettingsStatus('error', msg);
        renderPanSettingsContent();
      } catch (e) {
        stopQuarkQrPoll();
        quarkQrState.status = 'error';
        quarkQrState.imageUrl = '';
        quarkQrState.qid = '';
        quarkQrState.expiresAt = 0;
        setPanSettingsStatus('error', (e && e.message) ? String(e.message) : '获取失败');
        renderPanSettingsContent();
      }
    };
    tick();
    quarkQrState.pollTimer = setInterval(tick, 1500);
    renderPanSettingsContent();
  };

  const startUcQrPoll = () => {
    stopUcQrPoll();
    if (!ucQrState.qid || isUcQrExpired()) return;
    const tick = async () => {
      if (!ucQrState.qid || isUcQrExpired()) {
        stopUcQrPoll();
        ucQrState.status = 'expired';
        ucQrState.imageUrl = '';
        ucQrState.qid = '';
        ucQrState.expiresAt = 0;
        setPanSettingsStatus('error', '二维码登录超时/已过期');
        renderPanSettingsContent();
        return;
      }
      try {
        const { resp, data } = await postJsonSafe('/dashboard/pan/uc/cookie', { qid: ucQrState.qid });
        if (resp.ok && data && data.success === true && typeof data.cookie === 'string') {
          const cookie = String(data.cookie || '');
          const textarea = panSettingsContent
            ? panSettingsContent.querySelector('textarea[data-pan-cookie-input="uc"]')
            : null;
          if (textarea) textarea.value = cookie;
          panLoginSettings = Object.assign({}, panLoginSettings, {
            uc: Object.assign({}, getPanSettingValue('uc'), { cookie }),
          });
          stopUcQrPoll();
          ucQrState.status = 'confirmed';
          ucQrState.imageUrl = '';
          ucQrState.qid = '';
          ucQrState.expiresAt = 0;
          setPanSettingsStatus('', '');
          notify.success('Cookie已获取并自动保存成功');
          renderPanSettingsContent();
          return;
        }
        if (resp.status === 409) {
          const st = data && data.status ? String(data.status) : 'pending';
          ucQrState.status = st;
          if (st === 'scanned') setPanSettingsStatus('', '已扫码：请在手机端确认登录…');
          else setPanSettingsStatus('', '等待扫码确认…');
          return;
        }
        const msg = (data && data.message) ? String(data.message) : `HTTP ${resp.status}`;
        stopUcQrPoll();
        ucQrState.status = 'error';
        ucQrState.imageUrl = '';
        ucQrState.qid = '';
        ucQrState.expiresAt = 0;
        setPanSettingsStatus('error', msg);
        renderPanSettingsContent();
      } catch (e) {
        stopUcQrPoll();
        ucQrState.status = 'error';
        ucQrState.imageUrl = '';
        ucQrState.qid = '';
        ucQrState.expiresAt = 0;
        setPanSettingsStatus('error', (e && e.message) ? String(e.message) : '获取失败');
        renderPanSettingsContent();
      }
    };
    tick();
    ucQrState.pollTimer = setInterval(tick, 1500);
    renderPanSettingsContent();
  };

  const start115QrPoll = () => {
    stop115QrPoll();
    if (!pan115QrState.qid || is115QrExpired()) return;
    const tick = async () => {
      if (!pan115QrState.qid || is115QrExpired()) {
        stop115QrPoll();
        pan115QrState.status = 'expired';
        pan115QrState.imageUrl = '';
        pan115QrState.qid = '';
        pan115QrState.expiresAt = 0;
        setPanSettingsStatus('error', '二维码登录超时/已过期');
        renderPanSettingsContent();
        return;
      }
      try {
        const { resp, data } = await postJsonSafe('/dashboard/pan/115/cookie', { qid: pan115QrState.qid });
        if (resp.ok && data && data.success === true && typeof data.cookie === 'string') {
          const cookie = String(data.cookie || '');
          const textarea = panSettingsContent
            ? panSettingsContent.querySelector('textarea[data-pan-cookie-input="115"]')
            : null;
          if (textarea) textarea.value = cookie;
          panLoginSettings = Object.assign({}, panLoginSettings, {
            '115': Object.assign({}, getPanSettingValue('115'), { cookie }),
          });
          stop115QrPoll();
          pan115QrState.status = 'confirmed';
          pan115QrState.imageUrl = '';
          pan115QrState.qid = '';
          pan115QrState.expiresAt = 0;
          setPanSettingsStatus('', '');
          notify.success('Cookie已获取并自动保存成功');
          renderPanSettingsContent();
          return;
        }
        if (resp.status === 409) {
          const st = data && data.status ? String(data.status) : 'pending';
          pan115QrState.status = st;
          if (st === 'scanned') setPanSettingsStatus('', '已扫码：请在手机端确认登录…');
          else setPanSettingsStatus('', '等待扫码确认…');
          return;
        }
        const msg = (data && data.message) ? String(data.message) : `HTTP ${resp.status}`;
        stop115QrPoll();
        pan115QrState.status = 'error';
        pan115QrState.imageUrl = '';
        pan115QrState.qid = '';
        pan115QrState.expiresAt = 0;
        setPanSettingsStatus('error', msg);
        renderPanSettingsContent();
      } catch (e) {
        stop115QrPoll();
        pan115QrState.status = 'error';
        pan115QrState.imageUrl = '';
        pan115QrState.qid = '';
        pan115QrState.expiresAt = 0;
        setPanSettingsStatus('error', (e && e.message) ? String(e.message) : '获取失败');
        renderPanSettingsContent();
      }
    };
    tick();
    pan115QrState.pollTimer = setInterval(tick, 1500);
    renderPanSettingsContent();
  };

  const startBiliQrPoll = () => {
    stopBiliQrPoll();
    if (!biliQrState.qid || isBiliQrExpired()) return;
    const tick = async () => {
      if (!biliQrState.qid || isBiliQrExpired()) {
        stopBiliQrPoll();
        biliQrState.status = 'expired';
        biliQrState.imageUrl = '';
        biliQrState.qid = '';
        biliQrState.expiresAt = 0;
        setPanSettingsStatus('error', '二维码登录超时/已过期');
        renderPanSettingsContent();
        return;
      }
      try {
        const { resp, data } = await postJsonSafe('/dashboard/pan/bili/cookie', { qid: biliQrState.qid });
        if (resp.ok && data && data.success === true && typeof data.cookie === 'string') {
          const cookie = String(data.cookie || '');
          const textarea = panSettingsContent
            ? panSettingsContent.querySelector('textarea[data-pan-cookie-input="bili"]')
            : null;
          if (textarea) textarea.value = cookie;
          panLoginSettings = Object.assign({}, panLoginSettings, {
            bili: Object.assign({}, getPanSettingValue('bili'), { cookie }),
          });
          stopBiliQrPoll();
          biliQrState.status = 'confirmed';
          biliQrState.imageUrl = '';
          biliQrState.qid = '';
          biliQrState.expiresAt = 0;
          setPanSettingsStatus('', '');
          notify.success('Cookie已获取并自动保存成功');
          renderPanSettingsContent();
          return;
        }
        if (resp.status === 409) {
          const st = data && data.status ? String(data.status) : 'pending';
          biliQrState.status = st;
          if (st === 'scanned') setPanSettingsStatus('', '已扫码：请在手机端确认登录…');
          else setPanSettingsStatus('', '等待扫码确认…');
          return;
        }
        const msg = (data && data.message) ? String(data.message) : `HTTP ${resp.status}`;
        stopBiliQrPoll();
        biliQrState.status = 'error';
        biliQrState.imageUrl = '';
        biliQrState.qid = '';
        biliQrState.expiresAt = 0;
        setPanSettingsStatus('error', msg);
        renderPanSettingsContent();
      } catch (e) {
        stopBiliQrPoll();
        biliQrState.status = 'error';
        biliQrState.imageUrl = '';
        biliQrState.qid = '';
        biliQrState.expiresAt = 0;
        setPanSettingsStatus('error', (e && e.message) ? String(e.message) : '获取失败');
        renderPanSettingsContent();
      }
    };
    tick();
    biliQrState.pollTimer = setInterval(tick, 1500);
    renderPanSettingsContent();
  };

  const fetchPanSettings = async (key) => {
    const qs = key ? `?key=${encodeURIComponent(String(key))}` : '';
    const data = await getSuccessJson(`/dashboard/pan/settings${qs}`);
    if (data && data.settings && typeof data.settings === 'object') return data.settings;
    return {};
  };

  const ensurePanSettingLoaded = async (key) => {
    const k = typeof key === 'string' ? key.trim() : '';
    if (!k) return;
    if (loadedPanSettingKeys.has(k)) return;
    setPanSettingsStatus('', '加载中...');
    const partial = await fetchPanSettings(k);
    panLoginSettings = Object.assign({}, panLoginSettings, partial);
    loadedPanSettingKeys.add(k);
    setPanSettingsStatus('', '');
  };

  const savePanCookie = async (key, cookie) => {
    return savePanSettings(key, 'cookie', { cookie: cookie != null ? String(cookie) : '' });
  };

  const savePanAccount = async (key, username, password, cookie) => {
    return savePanSettings(key, 'account', {
      username: username != null ? String(username) : '',
      password: password != null ? String(password) : '',
      cookie: cookie != null ? String(cookie) : '',
    });
  };

  const savePanAuthorization = async (key, authorization) => {
    return savePanSettings(key, 'authorization', { authorization: authorization != null ? String(authorization) : '' });
  };

  const savePanTv = async (key, tvType, refreshToken, deviceId, accessToken, accessTokenExpAt) => {
    const t = tvType === 'uc_tv' ? 'uc_tv' : 'quark_tv';
    return savePanSettings(key, t, {
      refresh_token: refreshToken != null ? String(refreshToken) : '',
      device_id: deviceId != null ? String(deviceId) : '',
      access_token: accessToken != null ? String(accessToken) : '',
      access_token_exp_at: accessTokenExpAt != null ? String(accessTokenExpAt) : '',
    });
  };

  const savePanSettings = async (key, type, fields) => {
    const t =
      type === 'account' || type === 'authorization' || type === 'cookie' || type === 'quark_tv' || type === 'uc_tv'
        ? type
        : 'cookie';
    const payload = Object.assign({ key, type: t }, fields && typeof fields === 'object' ? fields : {});
    const { resp, data } = await postForm('/dashboard/pan/settings', payload);
    if (resp.ok && data && data.success) return { ok: true, settings: data.settings || {} };
    return { ok: false, message: (data && data.message) || '保存失败', settings: (data && data.settings) || null };
  };

  const syncAllPanLoginSettingsTocatpawrunner = async () => {
    const apiBase = await resolvecatpawrunnerApiBase();
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) return { ok: false, skipped: true, reason: 'unconfigured' };

    const store = await fetchPanSettings('');
    const entries = store && typeof store === 'object' ? Object.entries(store) : [];
    if (!entries.length) return { ok: true, skipped: false, okCount: 0, failCount: 0 };

    try {
      const typeByKey = new Map();
      panSettingDefs.forEach((def) => {
        if (def && def.key && def.type) typeByKey.set(def.key, def.type);
      });
      const pans = {};
      entries.forEach(([k, v]) => {
        const key = typeof k === 'string' ? k.trim() : '';
        if (!key) return;
        const typ = typeByKey.get(key);
        const remoteKey = key;
        const cur = v && typeof v === 'object' ? v : {};
        // catpawrunner `/admin/pan/sync` accepts:
        // - {cookie} or {username,password} for online runtime sync
        // - {authorization} for builtin 139 resolver
        // - {refresh_token, device_id} for builtin quark_tv/uc_tv resolver
        // For "authorization" types, send it as a cookie-equivalent value.
        const payload = {};
        if (typ === 'account') {
          if (typeof cur.username === 'string') payload.username = cur.username;
          if (typeof cur.password === 'string') payload.password = cur.password;
        } else if (typ === 'quark_tv' || typ === 'uc_tv') {
          if (typeof cur.refresh_token === 'string') payload.refresh_token = cur.refresh_token;
          if (typeof cur.device_id === 'string') payload.device_id = cur.device_id;
        } else if (typ === 'authorization') {
          if (typeof cur.authorization === 'string') payload.authorization = cur.authorization;
        } else {
          if (typeof cur.cookie === 'string') payload.cookie = cur.cookie;
        }
        pans[remoteKey] = payload;
      });
      const resp = await requestcatpawrunnerAdminJson({
        apiBase: normalizedBase,
        path: 'admin/pan/sync',
        method: 'POST',
        body: { pans },
      });
      const okCount = resp && typeof resp.okCount === 'number' ? resp.okCount : 0;
      const failCount = resp && typeof resp.failCount === 'number' ? resp.failCount : 0;
      return { ok: failCount <= 0 && resp && resp.success !== false, skipped: false, okCount, failCount };
    } catch (_e) {
      return { ok: false, skipped: false, okCount: 0, failCount: 0 };
    }
  };

  const savePanLoginSettingToServer = async ({ key, save, actionEl }) => {
    const btn = actionEl && actionEl.tagName ? actionEl : null;
    setButtonLoading(btn, true, { loadingText: '保存中' });
    setPanSettingsStatus('', '');
    try {
      const result = await (typeof save === 'function' ? save() : null);

      if (result && result.settings) panLoginSettings = result.settings;
      if (key) loadedPanSettingKeys.add(key);

      if (result && result.ok) {
        setPanSettingsStatus('', '');
        notify.success('保存成功');
        return;
      }
      const msg = (result && result.message) || '保存失败';
      setPanSettingsStatus('error', msg);
      notify.error(msg);
    } catch (e) {
      const msg = (e && e.message) ? String(e.message) : '保存失败';
      setPanSettingsStatus('error', msg);
      notify.error(msg);
    } finally {
      setButtonLoading(btn, false);
    }
  };

  const renderPanSettingsTabs = () => {
    if (!panSettingsTabs) return;
    panSettingsTabs.innerHTML = '';
    const isDark = document && document.documentElement && document.documentElement.classList
      ? document.documentElement.classList.contains('dark')
      : false;
    panSettingDefs.forEach((def) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 whitespace-nowrap text-gray-700 dark:text-gray-100 hover:bg-gray-100/30 dark:hover:bg-white/10';
      const active = def.key === activePanSettingKey;
      if (active) {
        btn.style.backgroundColor = isDark ? 'rgba(34, 197, 94, 0.22)' : 'rgba(34, 197, 94, 0.20)';
        btn.style.border = isDark ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(34, 197, 94, 0.30)';
      } else {
        btn.style.backgroundColor = '';
        btn.style.border = '1px solid transparent';
      }
      btn.dataset.panTab = def.key;
      btn.textContent = def.name;
      panSettingsTabs.appendChild(btn);
    });
  };

  const updatePanMoreMenu = () => {
    if (!panSettingsTabs || !panSettingsMoreBtn || !panSettingsMoreMenu) return;

    const containerRect = panSettingsTabs.getBoundingClientRect();
    if (!containerRect || containerRect.width <= 0) return;
    const epsilon = 2;
    const tabs = Array.from(panSettingsTabs.querySelectorAll('button[data-pan-tab]'));
    const hiddenRightDefs = [];
    tabs.forEach((btn) => {
      const key = btn.dataset ? btn.dataset.panTab : '';
      const btnRect = btn.getBoundingClientRect();
      const hiddenOnRight = btnRect.right > containerRect.right + epsilon;
      if (hiddenOnRight) {
        const def = panSettingDefs.find((d) => d.key === key);
        if (def) hiddenRightDefs.push(def);
      }
    });

    const overflowRight = hiddenRightDefs.length > 0;
    panSettingsMoreBtn.classList.toggle('hidden', !overflowRight);
    if (!overflowRight) {
      hidePanMoreMenu();
      panSettingsMoreMenu.innerHTML = '';
      return;
    }

    panSettingsMoreMenu.innerHTML = '';
    hiddenRightDefs.forEach((def) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className =
        'w-full text-left px-3 py-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150';
      item.textContent = def.name;
      item.dataset.panTab = def.key;
      if (def.key === activePanSettingKey) {
        item.style.backgroundColor = 'rgba(34, 197, 94, 0.12)';
      } else {
        item.style.backgroundColor = '';
      }
      panSettingsMoreMenu.appendChild(item);
    });
  };

  let panMoreMenuRaf = 0;
  const scheduleUpdatePanMoreMenu = () => {
    if (!panSettingsTabs || !panSettingsMoreBtn || !panSettingsMoreMenu) return;
    if (panMoreMenuRaf) cancelAnimationFrame(panMoreMenuRaf);
    panMoreMenuRaf = requestAnimationFrame(() => {
      panMoreMenuRaf = 0;
      updatePanMoreMenu();
      updatePanTabsHints();
    });
  };

  const updatePanTabsHints = () => {
    if (!panSettingsTabs) return;
    const left = panSettingsTabs.scrollLeft || 0;
    const clientWidth = panSettingsTabs.clientWidth || 0;
    const scrollWidth = panSettingsTabs.scrollWidth || 0;
    const epsilon = 2;
    const hasOverflow = scrollWidth > clientWidth + epsilon;
    const atStart = left <= epsilon;
    const atEnd = left + clientWidth >= scrollWidth - epsilon;

    if (panSettingsScrollLeft) {
      panSettingsScrollLeft.classList.toggle('hidden', !hasOverflow || atStart);
    }
    if (panSettingsScrollRight) {
      panSettingsScrollRight.classList.toggle('hidden', !hasOverflow || atEnd);
    }
    if (panSettingsMoreBtn) {
      // 滚到最右侧时隐藏“>”和“...”。
      if (!hasOverflow || atEnd) panSettingsMoreBtn.classList.add('hidden');
    }
  };

  const scrollPanTabsBy = (delta) => {
    if (!panSettingsTabs) return;
    const next = (panSettingsTabs.scrollLeft || 0) + delta;
    panSettingsTabs.scrollTo({ left: next, behavior: 'smooth' });
  };

  const getPanSettingValue = (key) => {
    const v = panLoginSettings && Object.prototype.hasOwnProperty.call(panLoginSettings, key) ? panLoginSettings[key] : {};
    return v && typeof v === 'object' ? v : {};
  };

	  const renderPanSettingsContent = () => {
	    if (!panSettingsContent) return;
	    const def = panSettingDefs.find((d) => d.key === activePanSettingKey) || panSettingDefs[0];
	    if (!def) return;
	    panSettingsContent.innerHTML = '';

	    if (def.type === 'quark_tv' || def.type === 'uc_tv') {
	      const v = getPanSettingValue(def.key);
	      const form = createEl('div', { className: 'space-y-4 max-w-[640px]' });

	      const rtRow = createEl('div');
	      const rtLabel = createEl('label', {
	        className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	        text: '刷新令牌',
	      });
	      const rtInput = createEl('input', { className: 'tv-field' });
	      rtInput.type = 'text';
	      rtInput.autocomplete = 'off';
	      rtInput.value = (v.refresh_token || '').toString();
	      rtInput.setAttribute('data-pan-tv-refresh-token', def.key);
	      rtRow.appendChild(rtLabel);
	      rtRow.appendChild(rtInput);

	      const devRow = createEl('div');
	      const devLabel = createEl('label', {
	        className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	        text: '设备ID',
	      });
	      const devInput = createEl('input', { className: 'tv-field' });
	      devInput.type = 'text';
	      devInput.autocomplete = 'off';
	      devInput.value = (v.device_id || '').toString();
	      devInput.setAttribute('data-pan-tv-device-id', def.key);
	      devRow.appendChild(devLabel);
	      devRow.appendChild(devInput);

	      const atRow = createEl('div');
	      const atLabel = createEl('label', {
	        className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	        text: 'Access Token（可空）',
	      });
	      const atInput = createEl('input', { className: 'tv-field' });
	      atInput.type = 'text';
	      atInput.autocomplete = 'off';
	      atInput.value = (v.access_token || '').toString();
	      atInput.setAttribute('data-pan-tv-access-token', def.key);
	      atRow.appendChild(atLabel);
	      atRow.appendChild(atInput);

	      const expRow = createEl('div');
	      const expLabel = createEl('label', {
	        className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	        text: 'access_token_exp_at（可空）',
	      });
	      const expInput = createEl('input', { className: 'tv-field' });
	      expInput.type = 'text';
	      expInput.autocomplete = 'off';
	      expInput.value = (v.access_token_exp_at || '').toString();
	      expInput.setAttribute('data-pan-tv-access-token-exp-at', def.key);
	      expRow.appendChild(expLabel);
	      expRow.appendChild(expInput);

	      const saveBtn = createEl('button', { className: 'btn-green', text: '保存' });
	      saveBtn.type = 'button';
	      saveBtn.setAttribute('data-pan-action', 'save-tv');
	      saveBtn.setAttribute('data-pan-key', def.key);

	      form.appendChild(rtRow);
	      form.appendChild(devRow);
	      form.appendChild(atRow);
	      form.appendChild(expRow);
	      form.appendChild(saveBtn);
	      panSettingsContent.appendChild(form);
	      return;
	    }

	    if (def.type === 'cookie' || def.type === 'authorization') {
        const isAuthorization = def.type === 'authorization';
	      const saveBtn = createEl('button', { className: 'btn-green', text: '保存' });
	      saveBtn.type = 'button';
	      saveBtn.setAttribute('data-pan-action', isAuthorization ? 'save-authorization' : 'save-cookie');
	      saveBtn.setAttribute('data-pan-key', def.key);

	      const stack = createEl('div', { className: 'flex flex-col items-start gap-3' });
	      setStyles(stack, { width: '100%' });

        if (def.key === 'baidu' && baiduQrState.imageUrl && !isBaiduQrExpired()) {
          const imgRow = createEl('div', { className: 'w-full flex items-center justify-center' });
          const img = createEl('img');
          img.alt = 'baidu qrcode';
          img.src = baiduQrState.imageUrl;
          setStyles(img, {
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.10)',
          });
          imgRow.appendChild(img);
          stack.appendChild(imgRow);
        }
        if (def.key === 'quark' && quarkQrState.imageUrl && !isQuarkQrExpired()) {
          const imgRow = createEl('div', { className: 'w-full flex items-center justify-center' });
          const img = createEl('img');
          img.alt = 'quark qrcode';
          img.src = quarkQrState.imageUrl;
          setStyles(img, {
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.10)',
          });
          imgRow.appendChild(img);
          stack.appendChild(imgRow);
        }
        if (def.key === 'uc' && ucQrState.imageUrl && !isUcQrExpired()) {
          const imgRow = createEl('div', { className: 'w-full flex items-center justify-center' });
          const img = createEl('img');
          img.alt = 'uc qrcode';
          img.src = ucQrState.imageUrl;
          setStyles(img, {
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.10)',
          });
          imgRow.appendChild(img);
          stack.appendChild(imgRow);
        }
        if (def.key === '115' && pan115QrState.imageUrl && !is115QrExpired()) {
          const imgRow = createEl('div', { className: 'w-full flex items-center justify-center' });
          const img = createEl('img');
          img.alt = '115 qrcode';
          img.src = pan115QrState.imageUrl;
          setStyles(img, {
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.10)',
          });
          imgRow.appendChild(img);
          stack.appendChild(imgRow);
        }
        if (def.key === 'bili' && biliQrState.imageUrl && !isBiliQrExpired()) {
          const imgRow = createEl('div', { className: 'w-full flex items-center justify-center' });
          const img = createEl('img');
          img.alt = 'bili qrcode';
          img.src = biliQrState.imageUrl;
          setStyles(img, {
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.10)',
          });
          imgRow.appendChild(img);
          stack.appendChild(imgRow);
        }

	      const textarea = createEl('textarea', { className: 'tv-field' });
	      textarea.rows = 3;
	      setStyles(textarea, { width: '100%' });
	      textarea.placeholder = isAuthorization ? `请输入${def.name} Authorization` : `请输入${def.name} Cookie`;
        if (isAuthorization) {
	        textarea.value = (getPanSettingValue(def.key).authorization || '').toString();
	        textarea.setAttribute('data-pan-authorization-input', def.key);
        } else {
	        textarea.value = (getPanSettingValue(def.key).cookie || '').toString();
	        textarea.setAttribute('data-pan-cookie-input', def.key);
        }
	      stack.appendChild(textarea);

	      const saveWrap = createEl('div');
	      setStyles(saveWrap, {
	        display: 'flex',
	        justifyContent: (def.key === 'baidu' || def.key === 'quark' || def.key === 'uc' || def.key === '115' || def.key === 'bili') ? 'flex-start' : 'center',
	        alignItems: 'center',
	        width: '100%',
	      });
        if (def.key === 'baidu' || def.key === 'quark' || def.key === 'uc' || def.key === '115' || def.key === 'bili') {
          setStyles(saveWrap, { position: 'relative' });
          const isBaidu = def.key === 'baidu';
          const isQuark = def.key === 'quark';
          const isUc = def.key === 'uc';
          const is115 = def.key === '115';
          const isBili = def.key === 'bili';
          const inFlight = isBaidu
            ? !!baiduQrState.pollTimer
            : (isQuark
              ? !!quarkQrState.pollTimer
              : (isUc ? !!ucQrState.pollTimer : (is115 ? !!pan115QrState.pollTimer : !!biliQrState.pollTimer)));
          const action = isBaidu
            ? 'baidu-qr-start'
            : (isQuark
              ? 'quark-qr-start'
              : (isUc ? 'uc-qr-start' : (is115 ? '115-qr-start' : 'bili-qr-start')));
          const qrBtn = createEl('button', { className: 'btn-ghost-blue', text: inFlight ? '二维码登录中...' : '二维码登录' });
          qrBtn.type = 'button';
          qrBtn.disabled = inFlight;
          qrBtn.setAttribute('data-pan-action', action);
          qrBtn.setAttribute('data-pan-key', def.key);
          saveWrap.appendChild(qrBtn);

          const center = createEl('div');
          setStyles(center, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            width: 'max-content',
          });
          center.appendChild(saveBtn);
          saveWrap.appendChild(center);
        } else {
          saveWrap.appendChild(saveBtn);
        }
	      stack.appendChild(saveWrap);

	      panSettingsContent.appendChild(stack);
	      return;
	    }

	    const v = getPanSettingValue(def.key);
	    const form = createEl('div', { className: 'space-y-4 max-w-[640px]' });

	    const userRow = createEl('div');
	    const userLabel = createEl('label', {
	      className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	      text: '账号',
	    });
	    const userInput = createEl('input', { className: 'tv-field' });
	    userInput.type = 'text';
	    userInput.value = (v.username || '').toString();
	    userInput.setAttribute('data-pan-account-username', def.key);
	    userRow.appendChild(userLabel);
	    userRow.appendChild(userInput);

	    const passRow = createEl('div');
	    const passLabel = createEl('label', {
	      className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	      text: '密码',
	    });
	    const passInput = createEl('input', { className: 'tv-field' });
	    passInput.type = 'password';
	    passInput.value = (v.password || '').toString();
	    passInput.setAttribute('data-pan-account-password', def.key);
	    passRow.appendChild(passLabel);
	    passRow.appendChild(passInput);

	    const saveBtn = createEl('button', { className: 'btn-green', text: '保存' });
	    saveBtn.type = 'button';
	    saveBtn.setAttribute('data-pan-action', 'save-account');
	    saveBtn.setAttribute('data-pan-key', def.key);

	    form.appendChild(userRow);
	    form.appendChild(passRow);
	    if (def.key === '189') {
	      const cookieRow = createEl('div');
	      const cookieLabel = createEl('label', {
	        className: 'block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
	        text: 'Cookie（可空）',
	      });
	      const cookieTextarea = createEl('textarea', { className: 'tv-field' });
	      cookieTextarea.rows = 4;
	      setStyles(cookieTextarea, { width: '100%' });
	      cookieTextarea.placeholder = '';
	      cookieTextarea.value = (v.cookie || '').toString();
	      cookieTextarea.setAttribute('data-pan-account-cookie', def.key);
	      cookieRow.appendChild(cookieLabel);
	      cookieRow.appendChild(cookieTextarea);
	      form.appendChild(cookieRow);
	    }
	    form.appendChild(saveBtn);
	    panSettingsContent.appendChild(form);
	  };

  bindOnce(panSettingsTabs, () => {
    panSettingsTabs.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const btn = target.closest('button[data-pan-tab]');
      if (!btn) return;
      const key = btn.dataset.panTab || '';
      if (!key || key === activePanSettingKey) return;
      if (activePanSettingKey === 'baidu') stopBaiduQrPoll();
      if (activePanSettingKey === 'quark') stopQuarkQrPoll();
      if (activePanSettingKey === 'uc') stopUcQrPoll();
      if (activePanSettingKey === '115') stop115QrPoll();
      if (activePanSettingKey === 'bili') stopBiliQrPoll();
      activePanSettingKey = key;
      setPanSettingsStatus('', '');
      renderPanSettingsTabs();
      scheduleUpdatePanMoreMenu();
      await ensurePanSettingLoaded(activePanSettingKey);
      renderPanSettingsContent();
    });

    panSettingsTabs.addEventListener(
      'wheel',
      (e) => {
        if (!panSettingsTabs) return;
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        panSettingsTabs.scrollLeft += e.deltaY;
        e.preventDefault();
      },
      { passive: false }
    );

    panSettingsTabs.addEventListener('scroll', () => scheduleUpdatePanMoreMenu());
    window.addEventListener('resize', () => scheduleUpdatePanMoreMenu());
  });

  const hidePanMoreMenu = () => {
    if (!panSettingsMoreMenu) return;
    panSettingsMoreMenu.classList.add('hidden');
  };

  bindOnce(panSettingsScrollLeft, () => {
    panSettingsScrollLeft.addEventListener('click', (e) => {
      e.preventDefault();
      scrollPanTabsBy(-220);
    });
  });
  bindOnce(panSettingsScrollRight, () => {
    panSettingsScrollRight.addEventListener('click', (e) => {
      e.preventDefault();
      scrollPanTabsBy(220);
    });
  });

  bindOnce(panSettingsMoreBtn, () => {
    if (!panSettingsMoreMenu) return;
    panSettingsMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scheduleUpdatePanMoreMenu();
      panSettingsMoreMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;
      if (panSettingsMoreBtn.contains(target)) return;
      if (panSettingsMoreMenu.contains(target)) return;
      hidePanMoreMenu();
    });
    panSettingsMoreMenu.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const btn = target.closest('button[data-pan-tab]');
      if (!btn) return;
      const key = btn.dataset.panTab || '';
      if (!key) return;
      if (activePanSettingKey === 'baidu') stopBaiduQrPoll();
      if (activePanSettingKey === 'quark') stopQuarkQrPoll();
      if (activePanSettingKey === 'uc') stopUcQrPoll();
      if (activePanSettingKey === '115') stop115QrPoll();
      if (activePanSettingKey === 'bili') stopBiliQrPoll();
      activePanSettingKey = key;
      hidePanMoreMenu();
      setPanSettingsStatus('', '');
      renderPanSettingsTabs();
      scheduleUpdatePanMoreMenu();
      await ensurePanSettingLoaded(activePanSettingKey);
      renderPanSettingsContent();
    });
  });

  bindOnce(panSettingsContent, () => {
    panSettingsContent.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const actionEl = target.closest('[data-pan-action]');
      if (!actionEl) return;
      const action = actionEl.getAttribute('data-pan-action') || '';
      const key = actionEl.getAttribute('data-pan-key') || '';
      if (!key) return;
      const def = panSettingDefs.find((d) => d.key === key);
      if (!def) return;

      if (action === 'save-cookie') {
        const textarea = panSettingsContent.querySelector(`textarea[data-pan-cookie-input="${key}"]`);
        const value = textarea ? textarea.value : '';
        await savePanLoginSettingToServer({
          key,
          actionEl,
          save: () => savePanCookie(key, value),
        });
        return;
      }

      if (action === 'save-tv') {
        const rtEl = panSettingsContent.querySelector(`input[data-pan-tv-refresh-token="${key}"]`);
        const devEl = panSettingsContent.querySelector(`input[data-pan-tv-device-id="${key}"]`);
        const atEl = panSettingsContent.querySelector(`input[data-pan-tv-access-token="${key}"]`);
        const expEl = panSettingsContent.querySelector(`input[data-pan-tv-access-token-exp-at="${key}"]`);
        const refreshToken = rtEl ? rtEl.value : '';
        const deviceId = devEl ? devEl.value : '';
        const accessToken = atEl ? atEl.value : '';
        const accessTokenExpAt = expEl ? expEl.value : '';
        await savePanLoginSettingToServer({
          key,
          actionEl,
          save: () => savePanTv(key, def.type, refreshToken, deviceId, accessToken, accessTokenExpAt),
        });
        return;
      }

      if (action === 'save-authorization') {
        const textarea = panSettingsContent.querySelector(`textarea[data-pan-authorization-input="${key}"]`);
        const value = textarea ? textarea.value : '';
        await savePanLoginSettingToServer({
          key,
          actionEl,
          save: () => savePanAuthorization(key, value),
        });
        return;
      }

      if (action === 'baidu-qr-start' && key === 'baidu') {
        await withDatasetLock(actionEl, 'baiduQrStartPending', async () => {
          stopBaiduQrPoll();
          baiduQrState.status = '';
          baiduQrState.message = '';
          baiduQrState.imageUrl = '';
          baiduQrState.qid = '';
          baiduQrState.expiresAt = 0;
          renderPanSettingsContent();
          setPanSettingsStatus('', '生成二维码...');
          baiduQrState.status = 'starting';
          baiduQrState.message = '';
          const { resp, data } = await postJsonSafe('/dashboard/pan/baidu/start', {});
          if (!resp.ok || !data || data.success !== true) {
            const msg = (data && data.message) ? String(data.message) : '生成失败';
            baiduQrState.status = 'error';
            baiduQrState.message = msg;
            setPanSettingsStatus('error', msg);
            renderPanSettingsContent();
            return;
          }
          baiduQrState.qid = (data && data.qid) ? String(data.qid) : '';
          baiduQrState.expiresAt = Number(data && data.expiresAt ? data.expiresAt : 0);
          baiduQrState.imageUrl = (data && data.imageUrl) ? String(data.imageUrl) : '';
          baiduQrState.status = 'pending';
          baiduQrState.message = '二维码已生成：请扫码并在手机端确认登录…';
          setPanSettingsStatus('', '二维码已生成，等待扫码确认…');
          renderPanSettingsContent();
          startBaiduQrPoll();
        });
        return;
      }

      if (action === 'quark-qr-start' && key === 'quark') {
        await withDatasetLock(actionEl, 'quarkQrStartPending', async () => {
          stopQuarkQrPoll();
          quarkQrState.status = '';
          quarkQrState.message = '';
          quarkQrState.imageUrl = '';
          quarkQrState.qid = '';
          quarkQrState.expiresAt = 0;
          renderPanSettingsContent();
          setPanSettingsStatus('', '生成二维码...');
          quarkQrState.status = 'starting';
          quarkQrState.message = '';
          const { resp, data } = await postJsonSafe('/dashboard/pan/quark/start', {});
          if (!resp.ok || !data || data.success !== true) {
            const msg = (data && data.message) ? String(data.message) : '生成失败';
            quarkQrState.status = 'error';
            quarkQrState.message = msg;
            setPanSettingsStatus('error', msg);
            renderPanSettingsContent();
            return;
          }
          quarkQrState.qid = (data && data.qid) ? String(data.qid) : '';
          quarkQrState.expiresAt = Number(data && data.expiresAt ? data.expiresAt : 0);
          quarkQrState.imageUrl = (data && data.imageUrl) ? String(data.imageUrl) : '';
          quarkQrState.status = 'pending';
          quarkQrState.message = '二维码已生成：请使用夸克 App（已登录）扫码并在手机端确认登录…';
          setPanSettingsStatus('', '二维码已生成，等待扫码确认…');
          renderPanSettingsContent();
          startQuarkQrPoll();
        });
        return;
      }

      if (action === 'uc-qr-start' && key === 'uc') {
        await withDatasetLock(actionEl, 'ucQrStartPending', async () => {
          stopUcQrPoll();
          ucQrState.status = '';
          ucQrState.message = '';
          ucQrState.imageUrl = '';
          ucQrState.qid = '';
          ucQrState.expiresAt = 0;
          renderPanSettingsContent();
          setPanSettingsStatus('', '生成二维码...');
          ucQrState.status = 'starting';
          ucQrState.message = '';
          const { resp, data } = await postJsonSafe('/dashboard/pan/uc/start', {});
          if (!resp.ok || !data || data.success !== true) {
            const msg = (data && data.message) ? String(data.message) : '生成失败';
            ucQrState.status = 'error';
            ucQrState.message = msg;
            setPanSettingsStatus('error', msg);
            renderPanSettingsContent();
            return;
          }
          ucQrState.qid = (data && data.qid) ? String(data.qid) : '';
          ucQrState.expiresAt = Number(data && data.expiresAt ? data.expiresAt : 0);
          ucQrState.imageUrl = (data && data.imageUrl) ? String(data.imageUrl) : '';
          ucQrState.status = 'pending';
          ucQrState.message = '二维码已生成：请使用 UC App（已登录）扫码并在手机端确认登录…';
          setPanSettingsStatus('', '二维码已生成，等待扫码确认…');
          renderPanSettingsContent();
          startUcQrPoll();
        });
        return;
      }

      if (action === '115-qr-start' && key === '115') {
        await withDatasetLock(actionEl, 'pan115QrStartPending', async () => {
          stop115QrPoll();
          pan115QrState.status = '';
          pan115QrState.message = '';
          pan115QrState.imageUrl = '';
          pan115QrState.qid = '';
          pan115QrState.expiresAt = 0;
          renderPanSettingsContent();
          setPanSettingsStatus('', '生成二维码...');
          pan115QrState.status = 'starting';
          pan115QrState.message = '';
          const { resp, data } = await postJsonSafe('/dashboard/pan/115/start', {});
          if (!resp.ok || !data || data.success !== true) {
            const msg = (data && data.message) ? String(data.message) : '生成失败';
            pan115QrState.status = 'error';
            pan115QrState.message = msg;
            setPanSettingsStatus('error', msg);
            renderPanSettingsContent();
            return;
          }
          pan115QrState.qid = (data && data.qid) ? String(data.qid) : '';
          pan115QrState.expiresAt = Number(data && data.expiresAt ? data.expiresAt : 0);
          pan115QrState.imageUrl = (data && data.imageUrl) ? String(data.imageUrl) : '';
          pan115QrState.status = 'pending';
          pan115QrState.message = '二维码已生成：请使用 115 App（已登录）扫码并在手机端确认登录…';
          setPanSettingsStatus('', '二维码已生成，等待扫码确认…');
          renderPanSettingsContent();
          start115QrPoll();
        });
        return;
      }

      if (action === 'bili-qr-start' && key === 'bili') {
        await withDatasetLock(actionEl, 'biliQrStartPending', async () => {
          stopBiliQrPoll();
          biliQrState.status = '';
          biliQrState.message = '';
          biliQrState.imageUrl = '';
          biliQrState.qid = '';
          biliQrState.expiresAt = 0;
          renderPanSettingsContent();
          setPanSettingsStatus('', '生成二维码...');
          biliQrState.status = 'starting';
          biliQrState.message = '';
          const { resp, data } = await postJsonSafe('/dashboard/pan/bili/start', {});
          if (!resp.ok || !data || data.success !== true) {
            const msg = (data && data.message) ? String(data.message) : '生成失败';
            biliQrState.status = 'error';
            biliQrState.message = msg;
            setPanSettingsStatus('error', msg);
            renderPanSettingsContent();
            return;
          }
          biliQrState.qid = (data && data.qid) ? String(data.qid) : '';
          biliQrState.expiresAt = Number(data && data.expiresAt ? data.expiresAt : 0);
          biliQrState.imageUrl = (data && data.imageUrl) ? String(data.imageUrl) : '';
          biliQrState.status = 'pending';
          biliQrState.message = '二维码已生成：请使用 Bilibili App（已登录）扫码并在手机端确认登录…';
          setPanSettingsStatus('', '二维码已生成，等待扫码确认…');
          renderPanSettingsContent();
          startBiliQrPoll();
        });
        return;
      }

      if (action === 'save-account') {
        const usernameEl = panSettingsContent.querySelector(`input[data-pan-account-username="${key}"]`);
        const passwordEl = panSettingsContent.querySelector(`input[data-pan-account-password="${key}"]`);
        const cookieEl = panSettingsContent.querySelector(`textarea[data-pan-account-cookie="${key}"]`);
        const username = usernameEl ? usernameEl.value : '';
        const password = passwordEl ? passwordEl.value : '';
        const cookie = cookieEl ? cookieEl.value : '';
        await savePanLoginSettingToServer({
          key,
          actionEl,
          save: () => savePanAccount(key, username, password, cookie),
        });
        return;
      }

      return;
    });
  });

  let currentPans = [];

  const setPanListStatus = bindInlineStatus(panListSaveStatus);

  const normalizePans = (pans) => {
    if (!Array.isArray(pans)) return [];
    return pans
      .map((p) => ({
        key: p && typeof p.key === 'string' ? p.key : '',
        name: p && typeof p.name === 'string' ? p.name : '',
        enable: !!(p && p.enable),
      }))
      .filter((p) => p.key);
  };

  async function cachePansListToServer(pans) {
    const { resp, data } = await postForm('/dashboard/video/pans/list', {
      list: JSON.stringify(Array.isArray(pans) ? pans : []),
    });
    if (resp.ok && data && data.success) return { ok: true, pans: Array.isArray(data.pans) ? data.pans : [] };
    return { ok: false, message: (data && data.message) || '保存失败' };
  }

  const getRuntimeIdFromOnlineConfigs = () => {
    try {
      if (!catpawrunnerConfigListEditor || typeof catpawrunnerConfigListEditor.getItems !== 'function') return '';
      const list = catpawrunnerConfigListEditor.getItems();
      if (!Array.isArray(list)) return '';
      for (const it of list) {
        const idRaw = it && typeof it.id === 'string' ? it.id.trim().toLowerCase() : '';
        if (/^[a-f0-9]{10}$/.test(idRaw)) return idRaw;
      }
    } catch (_e) {}
    return '';
  };

  const fetchPansList = async () => {
    const apiBase = await resolvecatpawrunnerApiBase();
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    const runtimeId = getRuntimeIdFromOnlineConfigs();
    if (normalizedBase) {
      try {
        if (!runtimeId) throw new Error('CatPawRunner runtime id 未配置');
        const resp = await requestcatpawrunnerAdminJson({
          apiBase: normalizedBase,
          path: `${runtimeId}/website/pans/list`,
          method: 'GET',
        });
        const data = unwrapcatpawrunnerWebsiteData(resp);
        const pans = normalizePans(data);
        try {
          await cachePansListToServer(pans);
        } catch (_e) {}
        return pans;
      } catch (_e) {}
    }
    try {
      const { resp: r, data } = await fetchJsonSafe('/dashboard/video/pans/list', { method: 'GET' }, {});
      if (r.ok && data && data.success && Array.isArray(data.pans)) return data.pans;
    } catch (_e) {}
    return [];
  };

  const savePansList = async (pans) => {
    const apiBase = await resolvecatpawrunnerApiBase();
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) return { ok: false, message: 'CatPawRunner 接口地址未设置' };
    const runtimeId = getRuntimeIdFromOnlineConfigs();
    if (!runtimeId) return { ok: false, message: 'CatPawRunner runtime id 未配置' };
    const list = normalizePans(pans);
    try {
      const putResp = await requestcatpawrunnerAdminJson({
        apiBase: normalizedBase,
        path: `${runtimeId}/website/pans/list`,
        method: 'PUT',
        body: { list },
      });
      const putData = unwrapcatpawrunnerWebsiteData(putResp);
      const updated = Array.isArray(putData) ? normalizePans(putData) : null;
      const next = updated || (await fetchPansList());
      await cachePansListToServer(next);
      return { ok: true, pans: next };
    } catch (e) {
      return { ok: false, message: 'CatPawRunner 接口异常' };
    }
  };

  function renderPanList(pans) {
    if (!panList) return;
    currentPans = normalizePans(pans);
	    panList.innerHTML = '';
	    if (!currentPans.length) {
	      appendEmptyItem(panList);
	      return;
	    }
	    const measure = createEl('span', { className: 'text-sm font-medium' });
	    setStyles(measure, {
	      position: 'absolute',
	      visibility: 'hidden',
	      whiteSpace: 'nowrap',
	      left: '-99999px',
	      top: '-99999px',
	    });
	    document.body.appendChild(measure);

    let maxNamePx = 0;
    currentPans.forEach((p) => {
      const text = (p && (p.name || p.key)) || '';
      measure.textContent = text;
      maxNamePx = Math.max(maxNamePx, Math.ceil(measure.getBoundingClientRect().width));
    });
    document.body.removeChild(measure);

    const nameWidthPx = Math.max(maxNamePx, 80);

    if (panHeaderName) {
      setStyles(panHeaderName, { width: `${nameWidthPx}px`, flex: '0 0 auto', display: 'inline-block', whiteSpace: 'nowrap' });
    }
    if (panHeaderEnable) {
      setFixedHeaderCell(panHeaderEnable, 72);
    }
    if (panHeaderSort) {
      setFixedHeaderCell(panHeaderSort, 72);
    }

	    currentPans.forEach((p, idx) => {
	      const li = createEl('li', { className: 'tv-row' });

      const key = p.key || '';
      const enabled = !!p.enable;

      const name = document.createElement('span');
      name.className = 'text-sm font-medium text-gray-800 dark:text-gray-100';
      name.textContent = p.name || p.key || '';
      setStyles(name, { width: `${nameWidthPx}px`, flex: '0 0 auto', display: 'inline-block', whiteSpace: 'nowrap' });

      const { label: switchLabel } = createSwitchLabel({
        checked: enabled,
        title: enabled ? '已启用' : '已禁用',
        ariaLabel: enabled ? '已启用' : '已禁用',
        inputAttrs: { 'data-pan-enable-key': key },
      });

      const enableCell = document.createElement('span');
      setCenterCell(enableCell, fixedCell(72));
      enableCell.appendChild(switchLabel);

      const sortCell = document.createElement('span');
      setCenterCell(sortCell, fixedCell(72));
      appendSortButtons(sortCell, {
        dirAttr: 'data-pan-sort',
        keyAttr: 'data-pan-key',
        key,
        disabledUp: idx === 0,
        disabledDown: idx === currentPans.length - 1,
      });

      li.appendChild(name);
      li.appendChild(enableCell);
      li.appendChild(sortCell);
      panList.appendChild(li);
    });
  }

  bindOnce(catpawrunnerPansToggle, () => {
    if (!catpawrunnerPansPanel) return;
    let open = false;
    let loading = false;

    const setOpen = (next) => {
      open = !!next;
      catpawrunnerPansPanel.classList.toggle('hidden', !open);
      if (catpawrunnerPansToggleIcon && catpawrunnerPansToggleIcon.dataset) {
        catpawrunnerPansToggleIcon.dataset.open = open ? 'true' : 'false';
      }
    };

    setOpen(false);

    catpawrunnerPansToggle.addEventListener('click', async (e) => {
      e.preventDefault();
      if (loading) return;
      const next = !open;
      setOpen(next);
      if (!next) return;

      loading = true;
      setPanListStatus('', '加载中...');
      try {
        renderPanList(await fetchPansList());
        setPanListStatus('', '');
      } finally {
        loading = false;
      }
    });
  });

  bindOnce(videoSourceSitesToggle, () => {
    if (!videoSourceSitesPanel) return;
    let open = false;
    const setOpen = (next) => {
      open = !!next;
      videoSourceSitesPanel.classList.toggle('hidden', !open);
      if (videoSourceSitesToggleIcon && videoSourceSitesToggleIcon.dataset) {
        videoSourceSitesToggleIcon.dataset.open = open ? 'true' : 'false';
      }
    };
    setOpen(false);
    videoSourceSitesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(!open);
    });
  });

  let currentVideoSourceSites = [];
  let videoSourceCoverSite =
    bootstrap && bootstrap.settings && typeof bootstrap.settings.searchCoverSite === 'string'
      ? String(bootstrap.settings.searchCoverSite || '').trim()
      : '';
  let videoSourceCoverSaving = false;
  const selectedVideoSourceKeys = new Set();
  const videoSourceHeaderName = document.getElementById('videoSourceHeaderName');
  const videoSourceHeaderApi = document.getElementById('videoSourceHeaderApi');
  const videoSourceHeaderAvailability = document.getElementById('videoSourceHeaderAvailability');
  const videoSourceHeaderStatus = document.getElementById('videoSourceHeaderStatus');
  const videoSourceHeaderHome = document.getElementById('videoSourceHeaderHome');
  const videoSourceHeaderSearch = document.getElementById('videoSourceHeaderSearch');
  const videoSourceHeaderCover = document.getElementById('videoSourceHeaderCover');
  const videoSourceHeaderSort = document.getElementById('videoSourceHeaderSort');
  const videoSourceHeaderError = document.getElementById('videoSourceHeaderError');
  const videoSourceHeaderCheckbox = document.getElementById('videoSourceHeaderCheckbox');
  const videoSourceResetOrder = document.getElementById('videoSourceResetOrder');
  const videoSourceJsonImport = document.getElementById('videoSourceJsonImport');
  const videoSourceJsonExport = document.getElementById('videoSourceJsonExport');
  const videoSourceJsonImportFile = document.getElementById('videoSourceJsonImportFile');
  const videoSourceBulkCheckDisable = document.getElementById('videoSourceBulkCheckDisable');

  const formatVideoSourceApi = (api) => {
    const raw = typeof api === 'string' ? api : '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (trimmed.indexOf('/spider/') === 0) {
      const parts = trimmed.split('/').filter(Boolean);
      if (parts.length >= 2 && parts[0] === 'spider') return parts[1];
    }
    return trimmed.replace(/^\/spider\//, '').replace(/\/\d+\/?$/, '');
  };

  const normalizeAvailability = (v) => {
    const raw = typeof v === 'string' ? v.trim() : '';
    if (
      raw === 'valid' ||
      raw === 'invalid' ||
      raw === 'unknown' ||
      raw === 'skipped' ||
      raw === 'unchecked' ||
      raw === 'category_error' ||
      raw === 'search_error'
    )
      return raw;
    return 'unchecked';
  };
  const formatAvailabilityText = (status) => {
    const s = normalizeAvailability(status);
    if (s === 'valid') return '有效';
    if (s === 'invalid') return '无效';
    if (s === 'category_error') return '分类异常';
    if (s === 'search_error') return '搜索异常';
    if (s === 'unknown') return '未知';
    if (s === 'skipped') return '跳过';
    return '未检测';
  };
  const availabilityClassFor = (status) => {
    const s = normalizeAvailability(status);
    if (s === 'valid') return 'tag-green';
    if (s === 'invalid') return 'tag-red';
    if (s === 'unknown' || s === 'category_error' || s === 'search_error') return 'tag-yellow';
    return 'tag-gray';
  };
  const buildAvailabilityTag = (status) => {
    const span = document.createElement('span');
    span.className = `availability-tag ${availabilityClassFor(status)}`;
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>${formatAvailabilityText(status)}`;
    return span;
  };

  const normalizeSiteNameForMatch = (name) => {
    const raw = name != null ? String(name) : '';
    if (!raw) return '';
    // Remove emoji + variation selectors + zero-width.
    let s = raw.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\uFE0F/g, '');
    try {
      s = s.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
    } catch (_e) {
      // ignore
    }
    // Drop punctuation/symbols and whitespace.
    s = s.replace(/[^\p{L}\p{N}\u4e00-\u9fff]+/gu, '');
    return s.trim();
  };

  const shouldSkipVideoSourceCheck = (site) => {
    const api = site && typeof site.api === 'string' ? site.api.trim() : '';
    if (!api) return false;
    const apiLower = api.toLowerCase();
    const nameRaw = site && typeof site.name === 'string' ? site.name : '';
    const name = normalizeSiteNameForMatch(nameRaw);
    if (name === '豆瓣首页' && apiLower.includes('douban')) return true;
    if (name === '配置中心' && apiLower.includes('baseset')) return true;
    return false;
  };

  const normalizeConfigCheckStatus = (v) => {
    const raw = typeof v === 'string' ? v.trim() : '';
    if (raw === 'pass' || raw === 'error' || raw === 'unchecked' || raw === 'checking') return raw;
    return 'unchecked';
  };
  const formatConfigCheckText = (status) => {
    const s = normalizeConfigCheckStatus(status);
    if (s === 'pass') return '通过';
    if (s === 'error') return '异常';
    if (s === 'checking') return '检测中';
    return '未检测';
  };
  const configCheckClassFor = (status) => {
    const s = normalizeConfigCheckStatus(status);
    if (s === 'pass') return 'tag-green';
    if (s === 'error') return 'tag-yellow';
    if (s === 'checking') return 'tag-gray';
    return 'tag-gray';
  };
  const normalizeConfigCheckPhase = (phase) => {
    const p = typeof phase === 'string' ? phase.trim().toLowerCase() : '';
    if (p === 'download') return 'download';
    if (p === 'runtime') return 'runtime';
    return '';
  };
  const formatConfigCheckTextWithPhase = (status, phase) => {
    const s = normalizeConfigCheckStatus(status);
    if (s === 'error') {
      const p = normalizeConfigCheckPhase(phase);
      if (p === 'download') return '下载失败';
      if (p === 'runtime') return '运行失败';
    }
    return formatConfigCheckText(s);
  };
  const buildConfigCheckTag = (status, phase) => {
    const span = document.createElement('span');
    span.className = `availability-tag ${configCheckClassFor(status)}`;
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>${formatConfigCheckTextWithPhase(status, phase)}`;
    return span;
  };

  const syncVideoSourceHeaderCheckbox = () => {
    if (!videoSourceHeaderCheckbox) return;
    const keys = currentVideoSourceSites.map((s) => (s && s.key) || '').filter(Boolean);
    if (!keys.length) {
      videoSourceHeaderCheckbox.checked = false;
      videoSourceHeaderCheckbox.indeterminate = false;
      return;
    }
    let selected = 0;
    keys.forEach((k) => {
      if (selectedVideoSourceKeys.has(k)) selected += 1;
    });
    videoSourceHeaderCheckbox.checked = selected === keys.length;
    videoSourceHeaderCheckbox.indeterminate = selected > 0 && selected < keys.length;
  };

  const syncVideoSourceBulkActions = () => {
    if (!videoSourceBulkActions) return;
    const keys = currentVideoSourceSites.map((s) => (s && s.key) || '').filter(Boolean);
    let selected = 0;
    keys.forEach((k) => {
      if (selectedVideoSourceKeys.has(k)) selected += 1;
    });
    videoSourceBulkActions.classList.toggle('hidden', selected <= 0);
  };

  const normalizeVideoSourceSelection = () => {
    const keys = currentVideoSourceSites.map((s) => (s && s.key) || '').filter(Boolean);
    const existing = new Set(keys);
    Array.from(selectedVideoSourceKeys).forEach((k) => {
      if (!existing.has(k)) selectedVideoSourceKeys.delete(k);
    });
  };

	  function renderVideoSourceList(sites) {
	    if (!videoSourceList) return;
	    currentVideoSourceSites = Array.isArray(sites) ? sites : [];
	    videoSourceList.innerHTML = '';
	    normalizeVideoSourceSelection();
	    syncVideoSourceHeaderCheckbox();
	    syncVideoSourceBulkActions();
	    if (!currentVideoSourceSites.length) {
	      appendEmptyItem(videoSourceList);
	      return;
	    }
    // Use pixel-based width so header + rows align even if font-size differs.
    const nameCell = calcPxCell(
      currentVideoSourceSites,
      (site) => (site && (site.name || site.key)) || '',
      { minPx: 80, maxPx: 420, className: 'text-sm font-medium' }
    );
    const apiCell = calcPxCell(
      currentVideoSourceSites,
      (site) => formatVideoSourceApi(site && site.api),
      { minPx: 90, maxPx: 360, className: 'text-xs' }
    );
    if (videoSourceHeaderName) {
      setEllipsisCell(videoSourceHeaderName, {
        width: nameCell.width,
        minWidth: '80px',
        maxWidth: nameCell.maxWidth,
        flex: nameCell.flex,
      });
    }
    if (videoSourceHeaderApi) {
      setEllipsisCell(videoSourceHeaderApi, {
        width: apiCell.width,
        minWidth: '90px',
        maxWidth: apiCell.maxWidth,
        flex: apiCell.flex,
      });
    }
    if (videoSourceHeaderStatus) {
      setFixedHeaderCell(videoSourceHeaderStatus, 72);
    }
	    if (videoSourceHeaderHome) {
	      setFixedHeaderCell(videoSourceHeaderHome, 72);
	    }
	    if (videoSourceHeaderSearch) {
	      setFixedHeaderCell(videoSourceHeaderSearch, 72);
	    }
	    if (videoSourceHeaderCover) {
	      setFixedHeaderCell(videoSourceHeaderCover, 96);
	    }
	    if (videoSourceHeaderSort) {
	      setFixedHeaderCell(videoSourceHeaderSort, 72);
	    }
	    if (videoSourceHeaderError) {
	      setStyles(videoSourceHeaderError, { display: 'inline-block', minWidth: '240px', flex: '1 1 240px' });
	    }
	    if (videoSourceHeaderAvailability) {
	      setFixedHeaderCell(videoSourceHeaderAvailability, 96);
    }

	    currentVideoSourceSites.forEach((site, idx) => {
	      const li = createEl('li', { className: 'tv-row' });

      const key = (site && site.key) || '';
	      const enabled = site && site.enabled !== false;
	      const homeShown = site && site.home !== false;
	      const searchEnabled = site && site.search !== false;
	      const coverShown = !!(key && videoSourceCoverSite === key);

      const selectBox = document.createElement('input');
      selectBox.type = 'checkbox';
      selectBox.className =
        'h-4 w-4 rounded border-gray-300 dark:border-white/20 text-green-600 focus:ring-green-500';
      selectBox.setAttribute('data-select-key', key);
      selectBox.checked = key ? selectedVideoSourceKeys.has(key) : false;

      const name = document.createElement('span');
      name.className = 'text-sm font-medium text-gray-800 dark:text-gray-100 truncate';
      name.textContent = (site && (site.name || site.key)) || '';
      setEllipsisCell(name, {
        width: nameCell.width,
        minWidth: '80px',
        maxWidth: nameCell.maxWidth,
        flex: nameCell.flex,
      });

      const keyEl = document.createElement('span');
      keyEl.className = `${CLS.mutedXs} truncate`;
      keyEl.textContent = formatVideoSourceApi(site && site.api) || '';
      setEllipsisCell(keyEl, {
        width: apiCell.width,
        minWidth: '90px',
        maxWidth: apiCell.maxWidth,
        flex: apiCell.flex,
      });

      const availabilityCell = document.createElement('span');
      setCenterCell(availabilityCell, fixedCell(96));
      availabilityCell.appendChild(buildAvailabilityTag(site && site.availability));

      const { label: switchLabel } = createSwitchLabel({
        checked: !!enabled,
        title: enabled ? '已启用' : '已禁用',
        ariaLabel: enabled ? '已启用' : '已禁用',
        inputAttrs: { 'data-enable-key': key },
      });

      const enableCell = document.createElement('span');
      setCenterCell(enableCell, fixedCell(72));
      enableCell.appendChild(switchLabel);

	      const { label: homeSwitchLabel } = createSwitchLabel({
	        checked: !!homeShown,
	        disabled: !enabled,
	        title: homeShown ? '首页显示' : '首页隐藏',
	        ariaLabel: homeShown ? '首页显示' : '首页隐藏',
	        inputAttrs: { 'data-home-key': key },
	      });

	      const homeCell = document.createElement('span');
	      setCenterCell(homeCell, fixedCell(72));
	      homeCell.appendChild(homeSwitchLabel);

      const { label: searchSwitchLabel } = createSwitchLabel({
        checked: !!searchEnabled,
        disabled: !enabled,
        title: searchEnabled ? '搜索启用' : '搜索禁用',
        ariaLabel: searchEnabled ? '搜索启用' : '搜索禁用',
        inputAttrs: { 'data-search-key': key },
      });

      const searchCell = document.createElement('span');
      setCenterCell(searchCell, fixedCell(72));
      searchCell.appendChild(searchSwitchLabel);

	      const { label: coverSwitchLabel } = createSwitchLabel({
	        checked: coverShown,
	        disabled: videoSourceCoverSaving || !enabled,
	        title: coverShown ? '已启用' : '未启用',
	        ariaLabel: coverShown ? '已启用' : '未启用',
	        inputAttrs: { 'data-cover-key': key },
	      });

	      const coverCell = document.createElement('span');
	      setCenterCell(coverCell, fixedCell(96));
	      coverCell.appendChild(coverSwitchLabel);

      const sortCell = document.createElement('span');
      setCenterCell(sortCell, fixedCell(72));
      appendSortButtons(sortCell, {
        dirAttr: 'data-sort',
        keyAttr: 'data-site-key',
        key,
        disabledUp: idx === 0,
        disabledDown: idx === currentVideoSourceSites.length - 1,
      });

      const errorCell = document.createElement('span');
      errorCell.className = `${CLS.mutedXs}`;
      const rawError =
        site && typeof site.error === 'string'
          ? site.error
          : site && typeof site.errorMessage === 'string'
            ? site.errorMessage
            : site && typeof site.err === 'string'
              ? site.err
              : '';
      errorCell.textContent = rawError || '';
      setStyles(errorCell, {
        minWidth: '240px',
        flex: '1 1 240px',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
      });

      li.appendChild(selectBox);
      li.appendChild(name);
      li.appendChild(keyEl);
      li.appendChild(availabilityCell);
      li.appendChild(enableCell);
      li.appendChild(homeCell);
      li.appendChild(searchCell);
      li.appendChild(coverCell);
      li.appendChild(sortCell);
      li.appendChild(errorCell);
      videoSourceList.appendChild(li);
    });
  }

  if (videoSourceList) {
    renderVideoSourceList([]);
  }

  const setVideoSourceListStatus = bindInlineStatus(videoSourceListSaveStatus);

  const updateVideoSourceSiteStatus = async (key, enabled) => {
    const { resp, data } = await postForm('/dashboard/video/source/sites/status', {
      key,
      enabled: enabled ? '1' : '0',
    });
    if (resp.ok && data && data.success) return { ok: true, enabled: !!data.enabled };
    return { ok: false, message: (data && data.message) || '保存失败' };
  };

  const updateVideoSourceSiteHome = async (key, home) => {
    const { resp, data } = await postForm('/dashboard/video/source/sites/home', {
      key,
      home: home ? '1' : '0',
    });
    if (resp.ok && data && data.success) return { ok: true, home: !!data.home };
    return { ok: false, message: (data && data.message) || '保存失败' };
  };

  const updateVideoSourceSiteSearch = async (key, search) => {
    const { resp, data } = await postForm('/dashboard/video/source/sites/search', {
      key,
      search: search ? '1' : '0',
    });
    if (resp.ok && data && data.success) return { ok: true, search: !!data.search };
    return { ok: false, message: (data && data.message) || '保存失败' };
  };

  const updateVideoSourceCoverSite = async (key) => {
    const { resp, data } = await postForm('/dashboard/video/source/sites/cover', { key });
    if (resp.ok && data && data.success) {
      return { ok: true, coverSite: typeof data.coverSite === 'string' ? data.coverSite : '' };
    }
    return { ok: false, message: (data && data.message) || '保存失败' };
  };

  const saveVideoSourceOrder = async (sites) => {
    const order = (Array.isArray(sites) ? sites : [])
      .map((s) => (s && s.key) || '')
      .filter(Boolean);
    const { resp, data } = await postForm('/dashboard/video/source/sites/order', {
      order: JSON.stringify(order),
    });
    if (resp.ok && data && data.success) return { ok: true };
    return { ok: false, message: (data && data.message) || '保存失败' };
  };

  const exportVideoSourceSitesToJson = () => {
    const safeSites = Array.isArray(currentVideoSourceSites) ? currentVideoSourceSites : [];
    const orderKeys = safeSites.map((s) => (s && s.key) || '').filter(Boolean);
    const payload = {
      format: 'meowfilm.video_source.sites.v1',
      exportedAt: new Date().toISOString(),
      coverSite: videoSourceCoverSite || '',
      order: orderKeys,
      sites: safeSites.map((site, idx) => {
        const key = (site && site.key) || '';
        const rawError =
          site && typeof site.error === 'string'
            ? site.error
            : site && typeof site.errorMessage === 'string'
              ? site.errorMessage
              : site && typeof site.err === 'string'
                ? site.err
                : '';
        return {
          key,
          name: (site && site.name) || '',
          api: (site && site.api) || '',
          type: site && site.type != null ? site.type : undefined,
          availability: (site && site.availability) || 'unchecked',
          enabled: site && site.enabled !== false,
          home: site && site.home !== false,
          search: site && site.search !== false,
          cover: !!(key && videoSourceCoverSite === key),
          order: idx + 1,
          error: rawError || '',
        };
      }),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meowfilm_sites_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const normalizeImportedVideoSourcePayload = (input) => {
    if (!input) return { sites: [], order: [], coverSite: '' };
    if (Array.isArray(input)) return { sites: input, order: [], coverSite: '' };
    const sites = Array.isArray(input.sites) ? input.sites : [];
    const order = Array.isArray(input.order) ? input.order : [];
    const coverSite = typeof input.coverSite === 'string' ? input.coverSite : '';
    return { sites, order, coverSite };
  };

  const restoreVideoSourceSitesFromJson = async (rawText) => {
    const text = typeof rawText === 'string' ? rawText : '';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_e) {
      setVideoSourceListStatus('error', 'JSON 解析失败');
      notify.error('JSON 解析失败');
      return;
    }

    const { sites: importedSites, order: importedOrder, coverSite: importedCoverSite } =
      normalizeImportedVideoSourcePayload(parsed);
    if (!Array.isArray(importedSites) || importedSites.length === 0) {
      setVideoSourceListStatus('error', '导入数据无站点');
      notify.error('导入数据无站点');
      return;
    }

    let currentSites = Array.isArray(currentVideoSourceSites) ? currentVideoSourceSites : [];
    let existing = new Set(currentSites.map((s) => (s && s.key) || '').filter(Boolean));
    if (existing.size === 0) {
      try {
        const data = await getSuccessJson('/dashboard/video/source/sites');
        if (data && typeof data.coverSite === 'string') {
          videoSourceCoverSite = String(data.coverSite || '').trim();
        }
        renderVideoSourceList(data && Array.isArray(data.sites) ? data.sites : []);
        currentSites = Array.isArray(currentVideoSourceSites) ? currentVideoSourceSites : [];
        existing = new Set(currentSites.map((s) => (s && s.key) || '').filter(Boolean));
      } catch (_e) {}
    }
    if (existing.size === 0) {
      setVideoSourceListStatus('error', '当前站点列表为空，请先导入站源');
      notify.error('当前站点列表为空，请先导入站源');
      return;
    }

    const results = {};
    const errors = {};
    const desiredStatus = {};
    const desiredHome = {};
    const desiredSearch = {};
    const desiredOrder = [];
    const coverCandidates = [];

    importedSites.forEach((it, idx) => {
      if (!it) return;
      const key = typeof it.key === 'string' ? it.key.trim() : '';
      if (!key || !existing.has(key)) return;

      desiredOrder.push({
        key,
        order: Number.isFinite(Number(it.order)) ? Number(it.order) : idx + 1,
        idx,
      });

      const availability =
        typeof it.availability === 'string'
          ? it.availability
          : typeof it.siteAvailability === 'string'
            ? it.siteAvailability
            : 'unchecked';
      results[key] = String(availability || 'unchecked');

      const err =
        typeof it.error === 'string'
          ? it.error
          : typeof it.errorMessage === 'string'
            ? it.errorMessage
            : typeof it.err === 'string'
              ? it.err
              : '';
      if (err && String(err).trim()) errors[key] = String(err).trim();

      desiredStatus[key] = it.enabled !== false;
      desiredHome[key] = it.home !== false;
      desiredSearch[key] = it.search !== false;

      const cover = !!(it.cover || it.coverShown);
      if (cover) coverCandidates.push(key);
    });

    const keys = Object.keys(desiredStatus);
    if (keys.length === 0) {
      setVideoSourceListStatus('error', '没有可导入的站点（key 不匹配当前列表）');
      notify.error('没有可导入的站点（key 不匹配当前列表）');
      return;
    }

    const coverKey = (() => {
      const raw = typeof importedCoverSite === 'string' ? importedCoverSite.trim() : '';
      if (raw && existing.has(raw)) return raw;
      return coverCandidates.length ? coverCandidates[0] : '';
    })();

    // Prefer imported explicit order list (if present and valid), otherwise use per-item `order`.
    let orderKeys = [];
    if (Array.isArray(importedOrder) && importedOrder.length) {
      orderKeys = importedOrder
        .map((k) => (typeof k === 'string' ? k.trim() : ''))
        .filter((k) => k && existing.has(k));
    } else {
      desiredOrder.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.idx - b.idx;
      });
      orderKeys = desiredOrder.map((it) => it.key).filter(Boolean);
    }

    setVideoSourceListStatus('', '');
    try {
      // Restore availability + error first (may have side effects we override below).
      await postForm('/dashboard/video/source/sites/check', {
        results: JSON.stringify(results),
        errors: JSON.stringify(errors),
      }).catch(() => {});

      // Restore ordering.
      if (orderKeys.length) {
        await postForm('/dashboard/video/source/sites/order', { order: JSON.stringify(orderKeys) }).catch(() => {});
      }

      // Restore cover site.
      if (coverKey) {
        await updateVideoSourceCoverSite(coverKey).catch(() => {});
      }

      // Restore per-site switches.
      for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        await updateVideoSourceSiteStatus(k, !!desiredStatus[k]).catch(() => {});
        await updateVideoSourceSiteHome(k, !!desiredHome[k]).catch(() => {});
        await updateVideoSourceSiteSearch(k, !!desiredSearch[k]).catch(() => {});
      }

      const data = await getSuccessJson('/dashboard/video/source/sites');
      if (data && typeof data.coverSite === 'string') {
        videoSourceCoverSite = String(data.coverSite || '').trim();
      }
      renderVideoSourceList(data && Array.isArray(data.sites) ? data.sites : []);

      setVideoSourceListStatus('', '');
      setImportSummary(`已导入 ${keys.length} 个站点`);
      notify.success(`导入成功（${keys.length} 个站点）`);
    } catch (e) {
      const status = e && typeof e.status === 'number' ? e.status : 0;
      const msg = e && e.message ? String(e.message) : '导入失败';
      if (status) setVideoSourceListStatus('error', `HTTP ${status}：${msg}`);
      else setVideoSourceListStatus('error', msg);
      notify.error(status ? `HTTP ${status}：${msg}` : msg);
    }
  };

  bindOnce(videoSourceJsonExport, (btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (!Array.isArray(currentVideoSourceSites) || currentVideoSourceSites.length === 0) {
          const data = await getSuccessJson('/dashboard/video/source/sites');
          if (data && typeof data.coverSite === 'string') {
            videoSourceCoverSite = String(data.coverSite || '').trim();
          }
          renderVideoSourceList(data && Array.isArray(data.sites) ? data.sites : []);
        }
      } catch (_e) {}
      exportVideoSourceSitesToJson();
    });
  });

  bindOnce(videoSourceJsonImport, (btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!videoSourceJsonImportFile) return;
      try {
        videoSourceJsonImportFile.value = '';
      } catch (_e) {}
      videoSourceJsonImportFile.click();
    });
  });

  bindOnce(videoSourceJsonImportFile, (input) => {
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0] ? input.files[0] : null;
      if (!file) return;
      setButtonLoading(videoSourceJsonImport, true, { loadingText: '导入中' });
      try {
        const text = await file.text();
        await restoreVideoSourceSitesFromJson(text);
      } catch (_e) {
        setVideoSourceListStatus('error', '读取文件失败');
        notify.error('读取文件失败');
      } finally {
        setButtonLoading(videoSourceJsonImport, false);
        try {
          input.value = '';
        } catch (_e) {}
      }
    });
  });

  const resetVideoSourceOrderFromcatpawrunner = async () => {
    const apiBase = await resolvecatpawrunnerApiBase();
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) {
      setVideoSourceListStatus('error', 'CatPawRunner 接口地址未设置');
      return;
    }

    setVideoSourceListStatus('', '对齐中...');
    try {
      const fullConfig = await requestcatpawrunnerAdminJson({
        apiBase: normalizedBase,
        path: 'admin/full-config',
        method: 'GET',
      });
      const remote = fullConfig && fullConfig.video && Array.isArray(fullConfig.video.sites) ? fullConfig.video.sites : [];
      const remoteOrderKeys = remote
        .map((s) => (s && typeof s.key === 'string' ? s.key.trim() : ''))
        .filter(Boolean);
      if (!remoteOrderKeys.length) {
        setVideoSourceListStatus('error', '未获取到排序');
        return;
      }

      const byKey = new Map();
      (currentVideoSourceSites || []).forEach((s) => {
        if (s && s.key) byKey.set(s.key, s);
      });

      const used = new Set();
      const nextSites = [];
      for (let i = 0; i < remoteOrderKeys.length; i += 1) {
        const k = remoteOrderKeys[i];
        if (!k || used.has(k)) continue;
        const s = byKey.get(k);
        if (!s) continue;
        used.add(k);
        nextSites.push(s);
      }
      // Append any local-only sites at the end, keeping their existing relative order.
      (currentVideoSourceSites || []).forEach((s) => {
        const k = s && s.key ? String(s.key) : '';
        if (!k || used.has(k)) return;
        used.add(k);
        nextSites.push(s);
      });

      if (!nextSites.length) {
        setVideoSourceListStatus('error', '未获取到站源');
        return;
      }

      const saved = await saveVideoSourceOrder(nextSites);
      if (!saved || !saved.ok) {
        setVideoSourceListStatus('error', (saved && saved.message) || '保存失败');
        return;
      }

      renderVideoSourceList(nextSites);
      setVideoSourceListStatus('success', '排序已对齐');
      clearStatusLater(setVideoSourceListStatus, 1200);
    } catch (e) {
      const status = e && typeof e.status === 'number' ? e.status : 0;
      const msg = e && e.message ? String(e.message) : '对齐失败';
      if (status) setVideoSourceListStatus('error', `HTTP ${status}：${msg}`);
      else setVideoSourceListStatus('error', msg);
    }
  };

	  const checkVideoSourceSites = async (keys) => {
	    const apiBase = await resolvecatpawrunnerApiBase();
	    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
	    if (!normalizedBase) return { ok: false, message: 'CatPawRunner 接口地址未设置' };

    const uniq = (Array.isArray(keys) ? keys : [])
      .map((k) => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean);
    if (!uniq.length) return { ok: true, sites: currentVideoSourceSites || [], results: {} };

    const byKey = new Map();
    (currentVideoSourceSites || []).forEach((s) => {
      if (s && s.key) byKey.set(s.key, s);
    });

    const extractList = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.list)) return data.list;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.data && Array.isArray(data.data.list)) return data.data.list;
      if (data.data && Array.isArray(data.data.vod_list)) return data.data.vod_list;
      if (data.data && Array.isArray(data.data.items)) return data.data.items;
      return [];
    };

    const extractClasses = (data) => {
      if (!data) return [];
      if (Array.isArray(data.class)) return data.class;
      if (Array.isArray(data.classes)) return data.classes;
      if (data.data && Array.isArray(data.data.class)) return data.data.class;
      if (data.data && Array.isArray(data.data.classes)) return data.data.classes;
      if (data.data && Array.isArray(data.data.types)) return data.data.types;
      if (Array.isArray(data.types)) return data.types;
      return [];
    };

    const extractClassId = (c) => {
      if (!c) return '';
      const pick = (v) => (v != null ? String(v).trim() : '');
      return (
        pick(c.type_id) ||
        pick(c.tid) ||
        pick(c.id) ||
        pick(c.typeId) ||
        ''
      );
    };

    const normalizeStatusCode = (resp) => {
      if (resp && typeof resp.statusCode === 'number') return resp.statusCode;
      if (resp && resp.data && typeof resp.data.statusCode === 'number') return resp.data.statusCode;
      return 0;
    };

	    const normalizeMessage = (resp) => {
	      if (resp && typeof resp.message === 'string') return resp.message;
	      if (resp && typeof resp.msg === 'string') return resp.msg;
	      if (resp && resp.data && typeof resp.data.message === 'string') return resp.data.message;
	      return '';
	    };

	    const readPanMockFlag = (resp) => {
	      if (!resp || typeof resp !== 'object') return false;
	      if (resp.pan_mock === true) return true;
	      if (resp.data && typeof resp.data === 'object' && resp.data.pan_mock === true) return true;
	      return false;
	    };

	    const formatHttpError = (e) => {
	      const status = e && typeof e.status === 'number' ? e.status : 0;
	      const msg = e && e.message ? String(e.message) : '请求失败';
	      if (!status) return msg;
	      if (msg.startsWith(`HTTP ${status}`)) return msg;
	      return `HTTP ${status}：${msg}`;
	    };

	    const panMockProviderFromFlag = (flag) => {
	      const s = typeof flag === 'string' ? flag.trim() : '';
	      if (!s) return '';
	      const headSeg = (s.split('-')[0] || '').trim();
	      if (!headSeg) return '';
	      const head2 = Array.from(headSeg).slice(0, 2).join('');
	      if (head2 === '天意') return '189';
	      if (head2 === '逸动') return '139';
	      if (head2 === '夸父') return 'quark';
	      if (head2 === '优夕') return 'uc';
	      if (head2 === '百度') return 'baidu';
	      return '';
	    };

	    const extractTianyiShareCodeLike = (flagOrURL) => {
	      const s = typeof flagOrURL === 'string' ? flagOrURL.trim() : '';
	      if (!s) return '';
	      const m1 = s.match(/(?:天意|天翼)-([A-Za-z0-9]{6,64})/);
	      if (m1 && m1[1]) return String(m1[1]).trim();
	      const m2 = s.match(/^https?:\/\/cloud\.189\.cn\/t\/([A-Za-z0-9]{6,64})(?:\b|\/|$)/i);
	      if (m2 && m2[1]) return String(m2[1]).trim();
	      const m3 = s.match(/^[A-Za-z0-9]{6,64}$/);
	      if (m3) return s;
	      return '';
	    };

	    const deriveTianyiMockMeta = (flag, rawPasscode) => {
	      const out = { shareCode: '', accessCode: '' };
	      const fromFlag = extractTianyiShareCodeLike(flag);
	      if (fromFlag) out.shareCode = fromFlag;
	      const pass = normalizePanMockPasscode(rawPasscode);
	      if (!pass) return out;
	      if (pass.toLowerCase() === 'nopass') return out;
	      const looksShare = (v) => /^[A-Za-z0-9]{6,64}$/.test(String(v || '').trim());
	      if (pass.includes('-')) {
	        const seg = pass.split('-', 2).map((x) => String(x || '').trim());
	        const left = String(seg[0] || '').trim();
	        const right = String(seg[1] || '').trim();
	        if (!out.shareCode && looksShare(left)) out.shareCode = left;
	        if (right && right.toLowerCase() !== 'nopass') out.accessCode = right;
	        return out;
	      }
	      if (!out.shareCode && looksShare(pass)) {
	        out.shareCode = pass;
	        return out;
	      }
	      out.accessCode = pass;
	      return out;
	    };

	    const callPanPlayResolver = async (provider, { flag = '', id = '', passcode = '' } = {}) => {
	      const p = String(provider || '').trim();
	      const panFlag = String(flag || '').trim();
	      const panID = String(id || '').trim();
	      const panPasscode = String(passcode || '').trim();
	      if (!p || !panID) return '';
	      const pathByProvider = {
	        '189': '/api/pan/189/play',
	        '139': '/api/pan/139/play',
	        quark: '/api/pan/quark/play',
	        uc: '/api/pan/uc/play',
	        baidu: '/api/pan/baidu/play',
	      };
	      const target = pathByProvider[p] || '';
	      if (!target) return '';
	      const headers = { 'Content-Type': 'application/json', ...getTvUserHeaders() };
	      const body = p === '189'
	        ? (panPasscode ? { id: panID, accessCode: panPasscode } : { id: panID })
	        : { flag: panFlag, id: panID };
	      const { resp, data } = await fetchJsonSafe(
	        target,
	        { method: 'POST', headers, body: JSON.stringify(body) },
	        {}
	      );
	      if (!resp.ok || !data || data.ok === false) {
	        const msg = data && data.message ? String(data.message) : `HTTP ${resp.status}`;
	        const err = new Error(msg);
	        try {
	          err.status = resp.status;
	        } catch (_e) {}
	        throw err;
	      }
	      const pick = (v) => (typeof v === 'string' ? v.trim() : '');
	      const resolved = pick(data.url) || pick(data.playUrl) || (data.data && (pick(data.data.url) || pick(data.data.playUrl))) || '';
	      return resolved;
	    };

	    const parseFirstPanEpisodeID = (vodPlayURL) => {
	      const raw = typeof vodPlayURL === 'string' ? vodPlayURL.trim() : '';
	      if (!raw) return '';
	      const block = String(raw.split('$$$')[0] || '').trim();
	      if (!block) return '';
	      const firstLine = String(block.split('#')[0] || '').trim();
	      if (!firstLine) return '';
	      const idx = firstLine.indexOf('$');
	      if (idx < 0) return firstLine;
	      return String(firstLine.slice(idx + 1) || '').trim();
	    };

	    const callPanListResolver = async (provider, { flag = '', passcode = '' } = {}) => {
	      const p = String(provider || '').trim();
	      const panFlag = String(flag || '').trim();
	      const rawPasscode = String(passcode || '').trim();
	      const tianyiMeta = p === '189' ? deriveTianyiMockMeta(panFlag, rawPasscode) : null;
	      const panPasscode = p === '189' ? String((tianyiMeta && tianyiMeta.accessCode) || '').trim() : rawPasscode;
	      if (!p || !panFlag) return '';
	      const pathByProvider = {
	        '189': '/api/pan/189/list',
	        '139': '/api/pan/139/list',
	        quark: '/api/pan/quark/list',
	        uc: '/api/pan/uc/list',
	        baidu: '/api/pan/baidu/list',
	      };
	      const target = pathByProvider[p] || '';
	      if (!target) return '';
	      const headers = { 'Content-Type': 'application/json', ...getTvUserHeaders() };
	      const listBody = { flag: panFlag };
	      if (p === '189' && tianyiMeta && tianyiMeta.shareCode) {
	        const sc = String(tianyiMeta.shareCode || '').trim();
	        listBody.shareCode = sc;
	        // Keep backward-compat with backends that only read `flag`.
	        listBody.flag = `天意-${sc}`;
	      }
	      if (panPasscode) {
	        if (p === '189') listBody.accessCode = panPasscode;
	        if (p === '139' || p === 'quark' || p === 'uc') listBody.passcode = panPasscode;
	        if (p === 'baidu') listBody.pwd = panPasscode;
	      }
	      const { resp, data } = await fetchJsonSafe(
	        target,
	        { method: 'POST', headers, body: JSON.stringify(listBody) },
	        {}
	      );
	      if (!resp.ok || !data || data.ok === false) {
	        const msg = data && data.message ? String(data.message) : `HTTP ${resp.status}`;
	        const err = new Error(msg);
	        try {
	          err.status = resp.status;
	        } catch (_e) {}
	        throw err;
	      }
	      const vodPlayURL = data && typeof data.vod_play_url === 'string' ? data.vod_play_url : '';
	      return parseFirstPanEpisodeID(vodPlayURL);
	    };

	    const normalizePanMockPasscode = (raw) => {
	      let s = typeof raw === 'string' ? raw.trim() : '';
	      if (!s) return '';
	      s = s.replace(/\s*\[[^\]]*]\s*$/g, '').trim();
	      if (s.toLowerCase().endsWith('.mp4')) s = s.slice(0, -4).trim();
	      if (s.toLowerCase().endsWith('-nopass')) s = s.slice(0, -7).trim();
	      if (s.toLowerCase().endsWith('_nopass')) s = s.slice(0, -7).trim();
	      if (!s) return '';
	      const lower = s.toLowerCase();
	      if (lower === 'nopass' || lower === 'none' || s === '无密码') return '';
	      const firstToken = String(s.split(/\s+/)[0] || '').trim();
	      return firstToken || '';
	    };

	    const derivePanMockPasscode = (episodeName, episodeID) => {
	      const nameRaw = typeof episodeName === 'string' ? episodeName.trim() : '';
	      if (nameRaw) return normalizePanMockPasscode(nameRaw);
	      const idRaw = typeof episodeID === 'string' ? episodeID.trim() : '';
	      if (idRaw && idRaw.includes('***')) return normalizePanMockPasscode(String(idRaw.split('***').pop() || '').trim());
	      return '';
	    };

    const extractSpiderNameFromApi = (api) => {
      const raw = typeof api === 'string' ? api.trim() : '';
      if (!raw) return '';
      try {
        const u = raw.startsWith('http://') || raw.startsWith('https://') ? new URL(raw) : null;
        const p = u ? u.pathname : raw;
        if (p.indexOf('/spider/') === 0) {
          const parts = p.split('/').filter(Boolean);
          return parts.length >= 2 ? parts[1] : '';
        }
      } catch (_e) {}
      if (raw.indexOf('/spider/') === 0) {
        const parts = raw.split('/').filter(Boolean);
        return parts.length >= 2 ? parts[1] : '';
      }
      return '';
    };

    const results = {};
    const errors = {};
    const disableSearchKeys = [];

	    const isMyPanSite = (site) => {
	      const nameRaw = site && typeof site.name === 'string' ? site.name : '';
	      const name = normalizeSiteNameForMatch(nameRaw);
	      if (!name) return false;
	      if (!name.includes('我的')) return false;
	      const keys = ['夸克', '百度', '天逸', '115', '123', 'quark', 'baidu'];
	      const lower = name.toLowerCase();
	      return keys.some((k) => (/[a-z]/i.test(k) ? lower.includes(k) : name.includes(k)));
	    };

	    for (let i = 0; i < uniq.length; i += 1) {
	      const key = uniq[i];
	      const site = byKey.get(key);
	      if (!site || !site.api) {
	        results[key] = 'invalid';
	        errors[key] = '分类接口:站点配置无效';
	        continue;
	      }
	      try {
	        const apiRaw = String(site.api || '').trim();
	        const spiderPath = apiRaw.replace(/\/+$/, '').replace(/^\//, '');

          if (shouldSkipVideoSourceCheck(site)) {
            results[key] = 'skipped';
            continue;
          }

	        const spiderName = extractSpiderNameFromApi(site.api);
	        if (spiderName === 'baseset') {
	          // `baseset` is a non-content settings site; keep it enabled and avoid full probing here.
	          results[key] = 'valid';
	          continue;
	        }
	        if (isMyPanSite(site)) {
	          // "我的xxx" pan browsing sources depend on user storage and may not be probe-able here.
	          results[key] = 'valid';
	          disableSearchKeys.push(key);
	          continue;
	        }

	        const isFatalHttpProbeError = (err) => {
	          const status = err && typeof err.status === 'number' ? err.status : 0;
	          const msg = err && err.message ? String(err.message) : '';
	          if (status === 403 || status === 404) return true;
          if (status === 500 && /ECONNREFUSED/i.test(msg)) return true;
          return false;
        };

        const extractVodId = (vod) => {
          if (!vod) return '';
          const pick = (v) => (v != null ? String(v).trim() : '');
          return pick(vod.vod_id) || pick(vod.vodId) || pick(vod.id) || pick(vod.ID) || '';
        };

	        const parsePlayCandidates = (fromStr, urlStr) => {
	          const fromRaw = typeof fromStr === 'string' ? fromStr : '';
	          const urlRaw = typeof urlStr === 'string' ? urlStr : '';
	          const splitTop = (s) => (s ? s.split('$$$') : []);
	          const fromParts = splitTop(fromRaw);
	          const urlParts = splitTop(urlRaw);
	          const len = Math.max(fromParts.length, urlParts.length);
	          const out = [];
	          const seen = new Set();
	          for (let i = 0; i < len; i += 1) {
	            const baseLabel = String(fromParts[i] || '').trim() || `源${i + 1}`;
	            const baseURL = String(urlParts[i] || '').trim();
	            if (!baseURL) continue;
	            const fromSubs = baseLabel.includes('|||')
	              ? baseLabel.split('|||').map((x) => String(x || '').trim())
	              : [baseLabel];
	            const urlSubs = baseLabel.includes('|||') && baseURL.includes('|||')
	              ? baseURL.split('|||').map((x) => String(x || '').trim())
	              : [baseURL];
	            const subLen = Math.max(fromSubs.length, urlSubs.length);
		            for (let j = 0; j < subLen; j += 1) {
		              const flag = String(fromSubs[j] || '').trim() || baseLabel;
		              const urlBlock = String(urlSubs[j] || '').trim();
		              if (!urlBlock) continue;
		              const firstLine = String(urlBlock.split('#')[0] || '').trim();
		              if (!firstLine) continue;
		              const idx = firstLine.indexOf('$');
		              const id = String(idx >= 0 ? firstLine.slice(idx + 1) : firstLine).trim();
		              const episodeName = String(idx >= 0 ? firstLine.slice(0, idx) : '').trim();
		              const passcode = derivePanMockPasscode(episodeName, id);
		              if (!flag || !id) continue;
		              const uniqKey = `${flag}@@${id}`;
		              if (seen.has(uniqKey)) continue;
		              seen.add(uniqKey);
		              out.push({ flag, id, passcode });
		            }
		          }
		          return out;
		        };

	        const extractPlayCandidatesFromVod = (vod) => {
	          if (!vod || typeof vod !== 'object') return [];
	          const from =
	            (typeof vod.vod_play_from === 'string' ? vod.vod_play_from : '') ||
	            (typeof vod.play_from === 'string' ? vod.play_from : '') ||
	            (typeof vod.playFrom === 'string' ? vod.playFrom : '');
	          const url =
	            (typeof vod.vod_play_url === 'string' ? vod.vod_play_url : '') ||
	            (typeof vod.play_url === 'string' ? vod.play_url : '') ||
	            (typeof vod.playUrl === 'string' ? vod.playUrl : '');
	          return parsePlayCandidates(from, url);
	        };

	        const extractPlayUrl = (resp) => {
	          if (!resp) return '';
	          const pickStr = (v) => (typeof v === 'string' ? v.trim() : '');
	          const pickUrlLike = (v) => {
	            const direct = pickStr(v);
	            if (direct) return direct;
	            if (!Array.isArray(v)) return '';
	            // CatPawRunner may return `url: ["原画", "https://..."]` (or other array shapes).
	            // Prefer an http(s) URL, starting from the end.
	            for (let i = v.length - 1; i >= 0; i -= 1) {
	              const s = pickStr(v[i]);
	              if (s && /^https?:\/\//i.test(s)) return s;
	            }
	            for (let i = 0; i < v.length; i += 1) {
	              const s = pickStr(v[i]);
	              if (s) return s;
	            }
	            return '';
	          };
	          return pickUrlLike(resp.url) || pickUrlLike(resp.playUrl) || (resp.data && pickUrlLike(resp.data.url)) || '';
	        };

	        // 1) Home probe
	        let homeOk = false;
	        let homeErr = '';
	        let homeClasses = [];
	        try {
	          const homeResp = await requestcatpawrunnerAdminJson({
	            apiBase: normalizedBase,
	            path: `${spiderPath}/home`,
            method: 'POST',
            body: {},
          });
          const sc = normalizeStatusCode(homeResp);
          if (sc >= 400) {
            const msg = normalizeMessage(homeResp) || '请求失败';
            homeErr = msg.startsWith('HTTP') ? msg : `HTTP ${sc}：${msg}`;
	          } else {
	            homeOk = true;
	            homeClasses = extractClasses(homeResp);
	          }
	        } catch (e) {
	          homeErr = formatHttpError(e);
	        }

        // 2) Category probe (collect candidates)
        let categoryOk = false;
        let categoryErr = '';
        let categoryEmpty = false;
        let vodCandidates = [];
	        let categoryPanMock = false;
	        if (homeOk) {
          const firstWithId = Array.isArray(homeClasses) ? homeClasses.find((c) => !!extractClassId(c)) : null;
          const tid = extractClassId(firstWithId);
          const body = tid ? { id: tid, page: 1, filter: true, filters: {} } : { id: '0', page: 1, filter: true, filters: {} };
          try {
            const catResp = await requestcatpawrunnerAdminJson({
              apiBase: normalizedBase,
              path: `${spiderPath}/category`,
              method: 'POST',
              body,
            });
            const sc2 = normalizeStatusCode(catResp);
            if (sc2 >= 400) {
              const msg = normalizeMessage(catResp) || '请求失败';
              categoryErr = msg.startsWith('HTTP') ? msg : `HTTP ${sc2}：${msg}`;
	            } else {
	              categoryOk = true;
	              categoryPanMock = readPanMockFlag(catResp);
	              const list = extractList(catResp);
	              vodCandidates = Array.isArray(list) ? list.slice(0, 10) : [];
	              categoryEmpty = vodCandidates.length === 0;
	            }
	          } catch (e) {
	            categoryErr = formatHttpError(e);
	          }
	        }

	        // 3) Play probe (use category candidates; up to 3)
	        let playOkFromCategory = false;
	        let playOkFromSearch = false;
	        let playErr = '';

		        const tryPlayFromCandidates = async (items, meta) => {
		          const state = meta && typeof meta === 'object' ? meta : null;
		          let panMockFlow = !!(state && state.panMock === true);
		          const candidates = (Array.isArray(items) ? items : [])
		            .filter((v) => v && typeof v === 'object')
		            .slice(0, 3);
			          for (let j = 0; j < candidates.length; j += 1) {
			            const vod = candidates[j];
			            let playCandidates = extractPlayCandidatesFromVod(vod);
			            try {
			              let detailFetched = false;
			              let detailOK = false;
			              let detailCandidates = [];
			              const loadDetailOnce = async () => {
			                if (detailFetched) return detailOK;
			                detailFetched = true;
			                const vodId = extractVodId(vod);
			                if (!vodId) return false;
			                const detailResp = await requestcatpawrunnerAdminJson({
			                  apiBase: normalizedBase,
			                  path: `${spiderPath}/detail`,
			                  method: 'POST',
			                  body: { id: vodId, vod_id: vodId },
			                });
			                const dsc = normalizeStatusCode(detailResp);
			                if (dsc >= 400) return false;
			                if (state && readPanMockFlag(detailResp)) {
			                  state.panMock = true;
			                  panMockFlow = true;
			                }
			                const detailList = extractList(detailResp);
			                const first = Array.isArray(detailList) && detailList.length ? detailList[0] : null;
			                detailCandidates = extractPlayCandidatesFromVod(first);
			                detailOK = true;
			                return true;
			              };
			              if (!playCandidates.length) {
			                const ok = await loadDetailOnce();
			                if (!ok) continue;
			                playCandidates = detailCandidates;
			              }
			              if (!panMockFlow) {
			                const hasPanProvider = Array.isArray(playCandidates) && playCandidates.some((c) => !!panMockProviderFromFlag(c && c.flag));
			                if (hasPanProvider) {
			                  const ok = await loadDetailOnce();
			                  if (ok && detailCandidates.length) playCandidates = detailCandidates;
			                }
			              }
				              if (!playCandidates.length) {
				                if (state) state.missingPlayMeta = true;
				                if (!playErr) playErr = '缺少播放信息';
			                continue;
			              }
				              const orderedCandidates = playCandidates.slice();
			              let candidateOk = false;
				              for (let k = 0; k < orderedCandidates.length; k += 1) {
				                const playCandidate = orderedCandidates[k];
				                if (!playCandidate || !playCandidate.flag || !playCandidate.id) continue;
				                const panProvider = panMockProviderFromFlag(playCandidate.flag);
				                if (panMockFlow && panProvider) {
				                  try {
				                    const panPasscode = panProvider === '189'
				                      ? deriveTianyiMockMeta(playCandidate.flag, playCandidate.passcode).accessCode
				                      : playCandidate.passcode;
				                    const resolvedID = await callPanListResolver(panProvider, {
				                      flag: playCandidate.flag,
				                      passcode: playCandidate.passcode,
				                    });
				                    if (!resolvedID) {
				                      if (!playErr) playErr = '网盘列表为空';
				                      continue;
				                    }
				                    const panURL = await callPanPlayResolver(panProvider, {
				                      flag: playCandidate.flag,
				                      id: resolvedID,
				                      passcode: panPasscode,
				                    });
				                    if (panURL) {
				                      candidateOk = true;
				                      break;
				                    }
				                    playErr = '未提取到地址';
				                  } catch (pe) {
				                    playErr = formatHttpError(pe);
				                    if (isFatalHttpProbeError(pe)) break;
				                  }
				                  continue;
				                }
				                const playResp = await requestcatpawrunnerAdminJson({
			                  apiBase: normalizedBase,
			                  path: `play`,
			                  method: 'POST',
			                  body: {
			                    flag: playCandidate.flag,
			                    id: playCandidate.id,
			                    siteApi: `/${spiderPath}`.replace(/\/{2,}/g, '/'),
			                  },
			                });
			                const psc = normalizeStatusCode(playResp);
			                if (psc >= 400) continue;
			                const url = extractPlayUrl(playResp);
			                if (url) {
			                  candidateOk = true;
			                  break;
			                }
				                playErr = '未提取到地址';
				              }
				              if (candidateOk) {
				                if (state) state.missingPlayMeta = false;
				                playErr = '';
				                return true;
				              }
		            } catch (e) {
		              playErr = formatHttpError(e);
		              if (isFatalHttpProbeError(e)) break;
		            }
	          }
	          return false;
	        };

	          const categoryPlayMeta = { missingPlayMeta: false, panMock: categoryPanMock };
	        if (categoryOk && !categoryEmpty) {
	          playOkFromCategory = await tryPlayFromCandidates(vodCandidates, categoryPlayMeta);
	        }

	        // 4) Search probe
	        // - If category failed/empty => use search to find candidates, then play them.
	        // - If category+play ok => lastly test search endpoint (no need to play from search).
	        let searchOk = false;
	        let searchErr = '';
		        let searchCandidates = [];
		        let searchPanMock = false;
	        const shouldUseSearchForPlay =
	          !categoryOk || categoryEmpty || (!playOkFromCategory && categoryPlayMeta.missingPlayMeta);
	        const shouldProbeSearchFinally = playOkFromCategory;
	        if (shouldUseSearchForPlay || shouldProbeSearchFinally) {
	          try {
	            const searchResp = await requestcatpawrunnerAdminJson({
	              apiBase: normalizedBase,
	              path: `${spiderPath}/search`,
	              method: 'POST',
	              body: { wd: '斗破', page: 1 },
	            });
	            const sc = normalizeStatusCode(searchResp);
	            if (sc >= 400) {
	              const msg = normalizeMessage(searchResp) || '请求失败';
	              searchErr = msg.startsWith('HTTP') ? msg : `HTTP ${sc}：${msg}`;
		            } else {
		              searchCandidates = extractList(searchResp);
		              searchPanMock = readPanMockFlag(searchResp);
		              searchOk = true;
		            }
	          } catch (e) {
	            searchErr = formatHttpError(e);
	            if (isFatalHttpProbeError(e)) searchOk = false;
	          }
	        }

		        if (shouldUseSearchForPlay && searchOk && Array.isArray(searchCandidates) && searchCandidates.length) {
		          playOkFromSearch = await tryPlayFromCandidates(searchCandidates, { panMock: searchPanMock });
		        }

	        // Final decision.
	        // - Category flow yields playable => valid (and optionally mark search_error when search probe fails)
	        // - Category failed due missing play meta, but search yields playable => valid
	        // - Category failed/empty but search play yields playable => category_error
	        // - Otherwise => invalid
	        if (playOkFromCategory) {
	          results[key] = searchOk ? 'valid' : 'search_error';
	        } else if (playOkFromSearch) {
	          results[key] = categoryPlayMeta.missingPlayMeta ? 'valid' : 'category_error';
	          playErr = '';
	        } else {
	          results[key] = 'invalid';
	        }

	        const parts = [];
	        if (homeErr) parts.push(`首页接口:${homeErr}`);
	        if (categoryErr) parts.push(`分类接口:${categoryErr}`);
	        if (playErr) parts.push(`播放接口:${playErr}`);
        if (searchErr) parts.push(`搜索接口:${searchErr}`);
        if (parts.length) errors[key] = parts.join('  ');
      } catch (_e) {
        results[key] = 'invalid';
        errors[key] = '首页接口:检测失败  分类接口:检测失败  播放接口:检测失败  搜索接口:检测失败';
      }
    }

    const { resp, data } = await postForm('/dashboard/video/source/sites/check', {
      results: JSON.stringify(results),
      errors: JSON.stringify(errors),
    });

    // Apply search disable for "我的xxx" sources (best-effort).
    if (resp.ok && data && data.success && disableSearchKeys.length) {
      for (let i = 0; i < disableSearchKeys.length; i += 1) {
        const k = disableSearchKeys[i];
        // Disable homepage for these sources so category browsing won't be triggered by the UI.
        // eslint-disable-next-line no-await-in-loop
        await postForm('/dashboard/video/source/sites/home', { key: k, home: '0' }).catch(() => {});
        // eslint-disable-next-line no-await-in-loop
        await postForm('/dashboard/video/source/sites/search', { key: k, search: '0' }).catch(() => {});
      }
    }
    if (resp.ok && data && data.success) {
      return { ok: true, sites: Array.isArray(data.sites) ? data.sites : [], results: data.results || {} };
    }
    return { ok: false, message: (data && data.message) || '检测失败' };
  };

  if (videoSourceHeaderCheckbox) {
    videoSourceHeaderCheckbox.addEventListener('change', () => {
      const checked = !!videoSourceHeaderCheckbox.checked;
      currentVideoSourceSites.forEach((s) => {
        const k = (s && s.key) || '';
        if (!k) return;
        if (checked) selectedVideoSourceKeys.add(k);
        else selectedVideoSourceKeys.delete(k);
      });
      renderVideoSourceList(currentVideoSourceSites);
    });
  }

  const applyVideoSourceBulkEnabled = async (enabled) => {
    const keys = currentVideoSourceSites
      .map((s) => (s && s.key) || '')
      .filter((k) => k && selectedVideoSourceKeys.has(k));
    if (!keys.length) return;

    if (videoSourceBulkCheckDisable) videoSourceBulkCheckDisable.disabled = true;
    if (videoSourceBulkEnable) videoSourceBulkEnable.disabled = true;
    if (videoSourceBulkDisable) videoSourceBulkDisable.disabled = true;
    setVideoSourceListStatus('', '保存中...');
    try {
      let okCount = 0;
      let errCount = 0;
      for (let i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await updateVideoSourceSiteStatus(keys[i], enabled);
        if (result && result.ok) okCount += 1;
        else errCount += 1;
      }
      currentVideoSourceSites = currentVideoSourceSites.map((s) => {
        if (!s || !s.key || !selectedVideoSourceKeys.has(s.key)) return s;
        return { ...s, enabled };
      });
      renderVideoSourceList(currentVideoSourceSites);
      if (errCount <= 0) {
        setVideoSourceListStatus('', '');
        notify.success('保存成功');
      } else if (okCount > 0) {
        const msg = `部分失败：${errCount}/${keys.length}`;
        setVideoSourceListStatus('error', msg);
        notify.error(msg);
      } else {
        setVideoSourceListStatus('error', '保存失败');
        notify.error('保存失败');
      }
    } catch (_e) {
      setVideoSourceListStatus('error', '保存失败');
      notify.error('保存失败');
    } finally {
      if (videoSourceBulkCheckDisable) videoSourceBulkCheckDisable.disabled = false;
      if (videoSourceBulkEnable) videoSourceBulkEnable.disabled = false;
      if (videoSourceBulkDisable) videoSourceBulkDisable.disabled = false;
    }
  };

  const applyVideoSourceBulkCheckDisable = async () => {
    const keys = currentVideoSourceSites
      .map((s) => (s && s.key) || '')
      .filter((k) => k && selectedVideoSourceKeys.has(k));
    if (!keys.length) return;

    if (videoSourceBulkCheckDisable) videoSourceBulkCheckDisable.disabled = true;
    if (videoSourceBulkEnable) videoSourceBulkEnable.disabled = true;
    if (videoSourceBulkDisable) videoSourceBulkDisable.disabled = true;
    const formatCheckingText = (progress, total, counts) =>
      `检测中：有效${counts.valid} 无效${counts.invalid} 跳过${counts.skipped} 分类异常${counts.categoryErr} 搜索异常${counts.searchErr} （${progress}/${total}）`;
    const counts = { valid: 0, invalid: 0, skipped: 0, categoryErr: 0, searchErr: 0 };
    setVideoSourceListStatus('', formatCheckingText(0, keys.length, counts));
    try {
      for (let i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await checkVideoSourceSites([keys[i]]);
        if (result && result.ok) {
          const sites = Array.isArray(result.sites) ? result.sites : [];
          renderVideoSourceList(sites);
          const status =
            result.results && result.results[keys[i]]
              ? normalizeAvailability(result.results[keys[i]])
              : 'unchecked';
          if (status === 'valid') counts.valid += 1;
          else if (status === 'invalid') counts.invalid += 1;
          else if (status === 'category_error') counts.categoryErr += 1;
          else if (status === 'search_error') counts.searchErr += 1;
          else if (status === 'skipped') counts.skipped += 1;
        } else {
          counts.invalid += 1;
        }
        setVideoSourceListStatus('', formatCheckingText(i + 1, keys.length, counts));
      }
      setVideoSourceListStatus(
        counts.invalid > 0 ? 'error' : 'success',
        `检测完成：有效${counts.valid} 无效${counts.invalid} 跳过${counts.skipped} 分类异常${counts.categoryErr} 搜索异常${counts.searchErr}`
      );
      notify.info('检测完成');
    } catch (_e) {
      setVideoSourceListStatus('error', '检测失败');
      notify.error('检测失败');
    } finally {
      if (videoSourceBulkCheckDisable) videoSourceBulkCheckDisable.disabled = false;
      if (videoSourceBulkEnable) videoSourceBulkEnable.disabled = false;
      if (videoSourceBulkDisable) videoSourceBulkDisable.disabled = false;
    }
  };

  if (videoSourceResetOrder) {
    videoSourceResetOrder.addEventListener('click', async (e) => {
      e.preventDefault();
      await withDatasetLock(videoSourceResetOrder, 'pending', async () => {
        videoSourceResetOrder.disabled = true;
        try {
          await resetVideoSourceOrderFromcatpawrunner();
        } finally {
          videoSourceResetOrder.disabled = false;
        }
      });
    });
  }

  if (videoSourceBulkCheckDisable) {
    videoSourceBulkCheckDisable.addEventListener('click', (e) => {
      e.preventDefault();
      applyVideoSourceBulkCheckDisable();
    });
  }
  if (videoSourceBulkEnable) {
    videoSourceBulkEnable.addEventListener('click', (e) => {
      e.preventDefault();
      applyVideoSourceBulkEnabled(true);
    });
  }
  if (videoSourceBulkDisable) {
    videoSourceBulkDisable.addEventListener('click', (e) => {
      e.preventDefault();
      applyVideoSourceBulkEnabled(false);
    });
  }

  if (videoSourceList) {
    const saveVideoSourceCheckbox = async ({ target, keyAttr, save, updateSite }) => {
      if (!target || !target.getAttribute) return;
      const key = target.getAttribute(keyAttr) || '';
      if (!key) return;
      const nextValue = !!target.checked;
      const prevValue = !nextValue;

      target.disabled = true;
      setVideoSourceListStatus('', '');
      try {
        const result = await (typeof save === 'function' ? save(key, nextValue) : null);
        if (result && result.ok) {
          currentVideoSourceSites = currentVideoSourceSites.map((s) => {
            if (!s || s.key !== key) return s;
            return typeof updateSite === 'function' ? updateSite(s, result) : s;
          });
          setVideoSourceListStatus('', '');
          notify.success('保存成功');
          renderVideoSourceList(currentVideoSourceSites);
        } else {
          target.checked = prevValue;
          const msg = (result && result.message) || '保存失败';
          setVideoSourceListStatus('error', msg);
          notify.error(msg);
        }
      } catch (_err) {
        target.checked = prevValue;
        setVideoSourceListStatus('error', '保存失败');
        notify.error('保存失败');
      } finally {
        target.disabled = false;
      }
    };

    videoSourceList.addEventListener('change', (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (!target.matches('input[type="checkbox"][data-select-key]')) return;
      const key = target.getAttribute('data-select-key') || '';
      if (!key) return;
      if (target.checked) selectedVideoSourceKeys.add(key);
      else selectedVideoSourceKeys.delete(key);
      syncVideoSourceHeaderCheckbox();
      syncVideoSourceBulkActions();
    });

    videoSourceList.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const btn = target.closest('button[data-sort][data-site-key]');
      if (!btn) return;
      const dir = btn.getAttribute('data-sort') || '';
      const key = btn.getAttribute('data-site-key') || '';
      if (!key || (dir !== 'up' && dir !== 'down')) return;

      const idx = currentVideoSourceSites.findIndex((s) => s && s.key === key);
      if (idx < 0) return;
      const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= currentVideoSourceSites.length) return;

      const next = swapCopy(currentVideoSourceSites, idx, nextIdx);
      currentVideoSourceSites = next;
      renderVideoSourceList(currentVideoSourceSites);

      btn.disabled = true;
      setVideoSourceListStatus('', '');
      try {
        const result = await saveVideoSourceOrder(currentVideoSourceSites);
        if (result && result.ok) {
          setVideoSourceListStatus('', '');
          notify.success('保存成功');
        } else {
          const msg = (result && result.message) || '保存失败';
          setVideoSourceListStatus('error', msg);
          notify.error(msg);
        }
      } catch (_err) {
        setVideoSourceListStatus('error', '保存失败');
        notify.error('保存失败');
      } finally {
        btn.disabled = false;
      }
    });

    videoSourceList.addEventListener('change', async (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (!target.matches('input[type="checkbox"][data-enable-key]')) return;
      await saveVideoSourceCheckbox({
        target,
        keyAttr: 'data-enable-key',
        save: updateVideoSourceSiteStatus,
        updateSite: (site, result) => ({ ...site, enabled: !!result.enabled }),
      });
    });

	    videoSourceList.addEventListener('change', async (e) => {
	      const target = e.target;
	      if (!target || !target.matches) return;
	      if (!target.matches('input[type="checkbox"][data-home-key]')) return;
	      await saveVideoSourceCheckbox({
	        target,
	        keyAttr: 'data-home-key',
	        save: updateVideoSourceSiteHome,
	        updateSite: (site, result) => ({ ...site, home: !!result.home }),
	      });
	    });

    videoSourceList.addEventListener('change', async (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (!target.matches('input[type="checkbox"][data-search-key]')) return;
      await saveVideoSourceCheckbox({
        target,
        keyAttr: 'data-search-key',
        save: updateVideoSourceSiteSearch,
        updateSite: (site, result) => ({ ...site, search: !!result.search }),
      });
    });

	    videoSourceList.addEventListener('change', async (e) => {
	      const target = e.target;
	      if (!target || !target.matches) return;
	      if (!target.matches('input[type="checkbox"][data-cover-key]')) return;
	      const key = (target.getAttribute('data-cover-key') || '').trim();
	      if (!key) return;
	      if (videoSourceCoverSaving) {
	        renderVideoSourceList(currentVideoSourceSites);
	        return;
	      }
	      if (!target.checked) {
	        renderVideoSourceList(currentVideoSourceSites);
	        return;
	      }

	      const prevCover = videoSourceCoverSite;
	      videoSourceCoverSite = key;
	      videoSourceCoverSaving = true;
	      renderVideoSourceList(currentVideoSourceSites);
	      setVideoSourceListStatus('', '保存中...');
	      try {
	        const result = await updateVideoSourceCoverSite(key);
	        if (result && result.ok) {
	          videoSourceCoverSite = (result.coverSite || key).trim();
	          setVideoSourceListStatus('success', '保存成功');
	          clearStatusLater(setVideoSourceListStatus, 1200);
	        } else {
	          videoSourceCoverSite = prevCover;
	          setVideoSourceListStatus('error', (result && result.message) || '保存失败');
	        }
	      } catch (_err) {
	        videoSourceCoverSite = prevCover;
	        setVideoSourceListStatus('error', '保存失败');
	      } finally {
	        videoSourceCoverSaving = false;
	        renderVideoSourceList(currentVideoSourceSites);
	      }
	    });
	  }

  if (panList) {
    panList.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const btn = target.closest('button[data-pan-sort][data-pan-key]');
      if (!btn) return;
      const dir = btn.getAttribute('data-pan-sort') || '';
      const key = btn.getAttribute('data-pan-key') || '';
      if (!key || (dir !== 'up' && dir !== 'down')) return;

      const idx = currentPans.findIndex((p) => p && p.key === key);
      if (idx < 0) return;
      const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= currentPans.length) return;

      const prev = currentPans.slice();
      const next = swapCopy(currentPans, idx, nextIdx);
      currentPans = next;
      renderPanList(currentPans);

      const rollback = (message) => {
        currentPans = prev;
        renderPanList(currentPans);
        setPanListStatus('error', message || '保存失败');
      };

      btn.disabled = true;
      setPanListStatus('', '保存中...');
      try {
        const result = await savePansList(currentPans);
        if (result && result.ok) {
          renderPanList(result.pans);
          setPanListStatus('success', '保存成功');
          clearStatusLater(setPanListStatus, 1200);
        } else {
          rollback((result && result.message) || '保存失败');
        }
      } catch (_err) {
        rollback('保存失败');
      } finally {
        btn.disabled = false;
      }
    });

    panList.addEventListener('change', async (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (!target.matches('input[type="checkbox"][data-pan-enable-key]')) return;
      const key = target.getAttribute('data-pan-enable-key') || '';
      if (!key) return;
      const nextEnabled = !!target.checked;
      const prevEnabled = !nextEnabled;

      const prev = currentPans.slice();
      currentPans = currentPans.map((p) => {
        if (!p || p.key !== key) return p;
        return { ...p, enable: nextEnabled };
      });

      const rollback = (message) => {
        target.checked = prevEnabled;
        currentPans = prev;
        renderPanList(currentPans);
        setPanListStatus('error', message || '保存失败');
      };

      target.disabled = true;
      setPanListStatus('', '保存中...');
      try {
        const result = await savePansList(currentPans);
        if (result && result.ok) {
          renderPanList(result.pans);
          setPanListStatus('success', '保存成功');
          clearStatusLater(setPanListStatus, 1200);
        } else {
          rollback((result && result.message) || '保存失败');
        }
      } catch (_err) {
        rollback('保存失败');
      } finally {
        target.disabled = false;
      }
    });
  }

  const fetchVideoSourceSites = async () => {
    const data = await getSuccessJson('/dashboard/video/source/sites');
    return {
      sites: data && Array.isArray(data.sites) ? data.sites : [],
      coverSite: data && typeof data.coverSite === 'string' ? data.coverSite : '',
    };
  };

  const loadVideoPanel = async () => {
    if (panelLoaded.video || panelLoading.video) return;
    panelLoading.video = true;
    try {
      const data = await fetchVideoSourceSites();
      if (data && typeof data.coverSite === 'string') {
        videoSourceCoverSite = String(data.coverSite || '').trim();
      }
      renderVideoSourceList(data && Array.isArray(data.sites) ? data.sites : []);
      panelLoaded.video = true;
    } finally {
      panelLoading.video = false;
    }
  };

  const loadPanPanel = async () => {
    if (panelLoaded.pan || panelLoading.pan) return;
    panelLoading.pan = true;
    try {
      const first = panSettingDefs[0] ? panSettingDefs[0].key : '';
      if (first && !activePanSettingKey) activePanSettingKey = first;
      renderPanSettingsTabs();
      scheduleUpdatePanMoreMenu();
      await ensurePanSettingLoaded(activePanSettingKey);
      renderPanSettingsContent();
      panelLoaded.pan = true;
    } finally {
      panelLoading.pan = false;
    }
  };

  const loadInterfacePanel = async () => {
    if (panelLoaded.interface || panelLoading.interface) return;
    panelLoading.interface = true;
    try {
	      const settings = await fetchSiteSettings();
	        if (settings) {
	          const catForm = document.getElementById('catpawrunnerSettingsForm');
	          const serverSelect = document.getElementById('catpawrunnerServerSelect');
	          const serverAddBtn = document.getElementById('catpawrunnerServerAdd');
          const serverDeleteBtn = document.getElementById('catpawrunnerServerDelete');
          const serverDeleteCancelBtn = document.getElementById('catpawrunnerServerDeleteCancel');
          const nameRow = document.getElementById('catpawrunnerNameRow');
          const apiRow = document.getElementById('catpawrunnerApiRow');
          const extrasEl = document.getElementById('catpawrunnerSettingsExtras');
          const nameInput = catForm ? catForm.querySelector('input[name="catpawrunnerName"]') : null;
          const apiInput = catForm ? catForm.querySelector('input[name="catpawrunnerApiBase"]') : null;
          const syncConfigToOtherBtn = document.getElementById('catpawrunnerSyncConfigToOtherBtn');
          const syncConfigToOtherPicker = document.getElementById('catpawrunnerSyncConfigToOtherPicker');
          const syncConfigToOtherSelect = document.getElementById('catpawrunnerSyncConfigToOtherSelect');
          const syncConfigToOtherConfirm = document.getElementById('catpawrunnerSyncConfigToOtherConfirm');
          const syncConfigToOtherCancel = document.getElementById('catpawrunnerSyncConfigToOtherCancel');
          const syncConfigToOtherStatus = document.getElementById('catpawrunnerSyncConfigToOtherStatus');

          const setRowVisible = (el, visible) => {
            if (!el || !el.classList) return;
            el.classList.toggle('hidden', !visible);
          };

          const setInputEnabled = (el, enabled) => {
            if (!el) return;
            try {
              el.disabled = !enabled;
            } catch (_e) {}
          };

          const syncServerEditorVisibility = () => {
            const hasServers = !!(catpawrunnerServers && catpawrunnerServers.length);
            const showEditor = !!catpawrunnerServerAddMode || hasServers;
            setRowVisible(nameRow, showEditor);
            setRowVisible(apiRow, showEditor);
            setInputEnabled(nameInput, showEditor);
            setInputEnabled(apiInput, showEditor);
            const syncFromRow = document.getElementById('catpawrunnerSyncFromServerRow');
            if (!showEditor) setRowVisible(syncFromRow, false);
            // Extras are only meaningful once a server exists and we're not in "add" mode.
            setRowVisible(extrasEl, hasServers && !catpawrunnerServerAddMode);
          };

          let catpawrunnerServerDeleteConfirming = false;

          const setDeleteConfirming = (value) => {
            catpawrunnerServerDeleteConfirming = !!value;
            if (serverDeleteBtn) serverDeleteBtn.textContent = catpawrunnerServerDeleteConfirming ? '确定' : '删除';
            if (serverDeleteCancelBtn) serverDeleteCancelBtn.classList.toggle('hidden', !catpawrunnerServerDeleteConfirming);
          };

          const syncDeleteButtonsVisibility = () => {
            const selected = serverSelect ? String(serverSelect.value || '') : '';
            const hasServers = !!(catpawrunnerServers && catpawrunnerServers.length);
            const canShow = hasServers && !catpawrunnerServerAddMode && !!selected && selected !== '__new__';
            if (serverDeleteBtn) serverDeleteBtn.classList.toggle('hidden', !canShow);
            if (!canShow) setDeleteConfirming(false);
          };

          const normalizeServers = (raw) => {
            return normalizecatpawrunnerServers(raw);
          };

          catpawrunnerServers = normalizeServers(settings.catpawrunnerServers);
          const initialKey = pickcatpawrunnerActiveKey(catpawrunnerServers, settings.catpawrunnerActive);

          const syncCustomDropdownDisplayOnly = (sel) => {
            if (!sel) return;
            const wrapper = sel.parentNode;
            if (!(wrapper && wrapper.classList && wrapper.classList.contains('custom-dropdown'))) return;
            const btn = wrapper.querySelector('.custom-dropdown-btn');
            const list = wrapper.querySelector('.custom-dropdown-list');
            const opt = sel.options[sel.selectedIndex];
            if (btn) btn.textContent = (opt && opt.text) || '请选择';
            if (list) {
              list.querySelectorAll('.custom-dropdown-item').forEach((n) => {
                const v = n && n.dataset ? n.dataset.value : '';
                n.classList.toggle('active', v === sel.value);
              });
            }
          };

	          const setAddButtonLabel = (isAdd) => {
	            if (!serverAddBtn) return;
	            serverAddBtn.textContent = isAdd ? '取消' : '添加服务器';
	          };

          const setSyncConfigToOtherStatus = (msg) => {
            if (!syncConfigToOtherStatus) return;
            syncConfigToOtherStatus.textContent = '';
            syncConfigToOtherStatus.classList.add('hidden');
          };

          const hideSyncConfigToOtherPicker = () => {
            if (syncConfigToOtherPicker) syncConfigToOtherPicker.classList.add('hidden');
            if (syncConfigToOtherSelect) syncConfigToOtherSelect.value = '';
            if (syncConfigToOtherConfirm) syncConfigToOtherConfirm.disabled = true;
            setSyncConfigToOtherStatus('');
            try {
              remountCustomSelectElement(syncConfigToOtherSelect);
            } catch (_e) {}
          };

          const buildcatpawrunnerRemoteSettingsPayload = () => {
            const proxyInput = document.querySelector('#catpawrunnerSettingsForm input[name=\"catpawrunnerProxy\"]');
            const proxy = proxyInput && typeof proxyInput.value === 'string' ? proxyInput.value : '';
            const goProxyApiInput = document.querySelector('#catpawrunnerSettingsForm input[name=\"catpawrunnerGoProxyApi\"]');
            const goProxyApi = goProxyApiInput && typeof goProxyApiInput.value === 'string' ? goProxyApiInput.value : '';
            const panBuiltinInput = document.getElementById('catpawrunnerPanBuiltinResolverEnabled');
            const panBuiltinResolverEnabled = !!(panBuiltinInput && panBuiltinInput.checked);
	            const rawItems = catpawrunnerConfigListEditor ? catpawrunnerConfigListEditor.getItems() : [];
	            const onlineConfigs = Array.isArray(rawItems)
	              ? rawItems
	                  .map((it) => ({ name: String(it.name || ''), url: String(it.url || '') }))
	                  .filter((it) => it.name && it.url)
	              : [];
	            return { proxy: String(proxy || ''), panBuiltinResolverEnabled, goProxyApi: String(goProxyApi || ''), onlineConfigs };
	          };

          const renderSyncConfigToOtherTargets = () => {
            if (!syncConfigToOtherSelect) return;
            const current = serverSelect ? String(serverSelect.value || '') : '';
            const targets = (catpawrunnerServers || []).filter((s) => s && s.name && s.name !== current);

            syncConfigToOtherSelect.innerHTML = '';
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = '请选择';
            placeholder.selected = true;
            syncConfigToOtherSelect.appendChild(placeholder);

            targets.forEach((s) => {
              const opt = document.createElement('option');
              opt.value = s.name;
              opt.textContent = s.name;
              syncConfigToOtherSelect.appendChild(opt);
            });

            remountCustomSelectElement(syncConfigToOtherSelect);
            syncCustomDropdownDisplayOnly(syncConfigToOtherSelect);
            if (syncConfigToOtherConfirm) syncConfigToOtherConfirm.disabled = true;
          };

          const captureRemoteState = () => {
            const remoteErrorEl = document.getElementById('catpawrunnerRemoteError');
            const remoteSettingsEl = document.getElementById('catpawrunnerRemoteSettings');
            const errorVisible = !!(remoteErrorEl && !remoteErrorEl.classList.contains('hidden') && remoteErrorEl.textContent);
            if (errorVisible) {
              return { state: 'error', message: String(remoteErrorEl.textContent || '') };
            }
            const ready = !!(remoteSettingsEl && !remoteSettingsEl.classList.contains('hidden'));
            if (ready) return { state: 'ready', message: '' };
            return { state: 'hidden', message: '' };
          };

          const renderServerOptions = (selectedKey) => {
            if (!serverSelect) return;
            const targetKey = typeof selectedKey === 'string' ? selectedKey : '';
            const prev = serverSelect.value;
            serverSelect.innerHTML = '';

            if (catpawrunnerServerAddMode) {
              const opt = document.createElement('option');
              opt.value = '__new__';
              opt.textContent = '新建服务器';
              opt.selected = true;
              serverSelect.appendChild(opt);
            }

            if (!catpawrunnerServers.length) {
              if (!catpawrunnerServerAddMode) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.disabled = true;
                opt.selected = true;
                opt.textContent = '暂无数据';
                serverSelect.appendChild(opt);
              }
              remountCustomSelectElement(serverSelect);
              return;
            }

            catpawrunnerServers.forEach((s) => {
              const opt = document.createElement('option');
              opt.value = s.name;
              opt.textContent = s.name;
              serverSelect.appendChild(opt);
            });

            const next =
              targetKey ||
              prev ||
              (catpawrunnerServerAddMode ? '__new__' : '') ||
              (catpawrunnerServers[0] ? catpawrunnerServers[0].name : '');
            if (next) serverSelect.value = next;
            remountCustomSelectElement(serverSelect);
            syncCustomDropdownDisplayOnly(serverSelect);
          };

          const selectServer = async (key, { refreshRemote = true } = {}) => {
            const k = typeof key === 'string' ? key : '';
            const server = catpawrunnerServers.find((s) => s && s.name === k) || catpawrunnerServers[0];
            if (!server) {
              if (nameInput) nameInput.value = '';
              if (apiInput) apiInput.value = '';
              catpawrunnerSavedApiBaseNorm = '';
              synccatpawrunnerSettingsVisibility();
              setcatpawrunnerRemoteState('hidden');
              syncServerEditorVisibility();
              hideSyncConfigToOtherPicker();
              return;
            }
            if (serverSelect) {
              catpawrunnerServerSelectSyncing = true;
              serverSelect.value = server.name;
              syncCustomDropdownDisplayOnly(serverSelect);
              catpawrunnerServerSelectSyncing = false;
            }
            if (nameInput) nameInput.value = server.name;
            if (apiInput) apiInput.value = server.apiBase;
            catpawrunnerSavedApiBaseNorm = normalizecatpawrunnerAdminBase(server.apiBase || '');
            synccatpawrunnerSettingsVisibility();
            if (refreshRemote) {
              await refreshcatpawrunnerRemoteSettings(server.apiBase || '');
            }
            syncServerEditorVisibility();
            hideSyncConfigToOtherPicker();
          };

	          renderServerOptions();
	          if (catpawrunnerServers.length) {
	            await selectServer(initialKey, { refreshRemote: true });
	          } else {
            if (nameInput) nameInput.value = '';
            if (apiInput) apiInput.value = '';
            catpawrunnerSavedApiBaseNorm = '';
            synccatpawrunnerSettingsVisibility();
            setcatpawrunnerRemoteState('hidden');
            syncServerEditorVisibility();
	          }
	          syncDeleteButtonsVisibility();

	          const enterAddMode = () => {
	            if (!serverSelect) return;
	            catpawrunnerServerAddMode = true;
	            catpawrunnerServerPrevSelectedKey = serverSelect.value || '';
	            catpawrunnerServerPrevRemoteState = captureRemoteState();
	            setAddButtonLabel(true);
	            syncDeleteButtonsVisibility();
	            hideSyncConfigToOtherPicker();

	            renderServerOptions('__new__');

	            if (nameInput) nameInput.value = '';
	            if (apiInput) apiInput.value = '';
	            setcatpawrunnerRemoteState('hidden');

	            syncServerEditorVisibility();
	            synccatpawrunnerSettingsVisibility();
	            const syncWrap = document.getElementById('catpawrunnerSyncSaveWrap');
	            const syncInput = document.getElementById('catpawrunnerSyncSave');
	            if (syncWrap) syncWrap.classList.add('hidden');
	            if (syncInput) {
	              syncInput.checked = false;
	              syncInput.disabled = true;
	            }

	            try {
	              synccatpawrunnerServerAddModeButtons();
	            } catch (_e) {}
	          };

	          const exitAddMode = async () => {
	            if (!serverSelect) return;
	            catpawrunnerServerAddMode = false;
	            setAddButtonLabel(false);
	            hideSyncConfigToOtherPicker();

	            renderServerOptions(catpawrunnerServerPrevSelectedKey);

	            if (catpawrunnerServerPrevSelectedKey) {
	              await selectServer(catpawrunnerServerPrevSelectedKey, { refreshRemote: false });
	            } else if (catpawrunnerServers.length) {
	              await selectServer(catpawrunnerServers[0].name, { refreshRemote: false });
	            }

	            const syncInput = document.getElementById('catpawrunnerSyncSave');
	            if (syncInput) syncInput.disabled = false;

	            setcatpawrunnerRemoteState(catpawrunnerServerPrevRemoteState.state, catpawrunnerServerPrevRemoteState.message);
	            synccatpawrunnerSettingsVisibility();
	            syncServerEditorVisibility();
	            syncDeleteButtonsVisibility();

	            try {
	              synccatpawrunnerServerAddModeButtons();
	            } catch (_e) {}
	          };

	          cancelcatpawrunnerServerAddMode = async () => {
	            if (!catpawrunnerServerAddMode) return;
	            await exitAddMode();
	          };

	          bindOnce(serverSelect, () => {
	            serverSelect.addEventListener('change', async () => {
	              if (catpawrunnerServerSelectSyncing) return;
	              setDeleteConfirming(false);
	              hideSyncConfigToOtherPicker();

	              const k = serverSelect.value || '';
	              if (catpawrunnerServerAddMode) {
	                if (!k || k === '__new__') return;

	                catpawrunnerServerAddMode = false;
	                setAddButtonLabel(false);

	                const syncInput = document.getElementById('catpawrunnerSyncSave');
	                if (syncInput) syncInput.disabled = false;

	                renderServerOptions(k);

	                const reusePrev = !!catpawrunnerServerPrevSelectedKey && k === catpawrunnerServerPrevSelectedKey;
	                await selectServer(k, { refreshRemote: !reusePrev });
	                if (reusePrev) {
	                  setcatpawrunnerRemoteState(catpawrunnerServerPrevRemoteState.state, catpawrunnerServerPrevRemoteState.message);
	                }

	                synccatpawrunnerSettingsVisibility();
	                syncServerEditorVisibility();
	                syncDeleteButtonsVisibility();

	                try {
	                  synccatpawrunnerServerAddModeButtons();
	                } catch (_e) {}
	                return;
	              }

	              await selectServer(k, { refreshRemote: true });
	              syncServerEditorVisibility();
	              syncDeleteButtonsVisibility();
            });
	          });

	          bindOnce(serverAddBtn, () => {
	            serverAddBtn.addEventListener('click', async () => {
	              if (!serverSelect) return;
	              if (!catpawrunnerServerAddMode) enterAddMode();
	              else await exitAddMode();
	            });
	          });

	          bindOnce(syncConfigToOtherBtn, () => {
            if (!syncConfigToOtherBtn) return;
            syncConfigToOtherBtn.addEventListener('click', () => {
              if (!syncConfigToOtherPicker || !syncConfigToOtherSelect) return;
              const currentlyHidden = syncConfigToOtherPicker.classList.contains('hidden');
              if (!currentlyHidden) {
                hideSyncConfigToOtherPicker();
                return;
              }
              renderSyncConfigToOtherTargets();
              syncConfigToOtherPicker.classList.remove('hidden');
            });
          });

          bindOnce(syncConfigToOtherSelect, () => {
            if (!syncConfigToOtherSelect) return;
            syncConfigToOtherSelect.addEventListener('change', () => {
              const v = String(syncConfigToOtherSelect.value || '');
              if (syncConfigToOtherConfirm) syncConfigToOtherConfirm.disabled = !v;
              setSyncConfigToOtherStatus('');
            });
          });

          bindOnce(syncConfigToOtherCancel, () => {
            if (!syncConfigToOtherCancel) return;
            syncConfigToOtherCancel.addEventListener('click', () => {
              hideSyncConfigToOtherPicker();
            });
          });

          bindOnce(syncConfigToOtherConfirm, () => {
            if (!syncConfigToOtherConfirm) return;
            syncConfigToOtherConfirm.addEventListener('click', async () => {
              if (!syncConfigToOtherSelect) return;
              const key = String(syncConfigToOtherSelect.value || '');
              const server = (catpawrunnerServers || []).find((s) => s && s.name === key);
              if (!server) return;
              const apiBase = server.apiBase || '';
              const payload = buildcatpawrunnerRemoteSettingsPayload();

              const prevDisabled = {
                btn: !!(syncConfigToOtherBtn && syncConfigToOtherBtn.disabled),
                select: !!(syncConfigToOtherSelect && syncConfigToOtherSelect.disabled),
                ok: !!syncConfigToOtherConfirm.disabled,
                cancel: !!(syncConfigToOtherCancel && syncConfigToOtherCancel.disabled),
              };

              try {
                if (syncConfigToOtherBtn) syncConfigToOtherBtn.disabled = true;
                if (syncConfigToOtherSelect) syncConfigToOtherSelect.disabled = true;
                if (syncConfigToOtherConfirm) syncConfigToOtherConfirm.disabled = true;
                if (syncConfigToOtherCancel) syncConfigToOtherCancel.disabled = true;
                setSyncConfigToOtherStatus('');
                setButtonLoading(syncConfigToOtherConfirm, true);

                await requestcatpawrunnerAdminJson({
                  apiBase,
                  path: 'admin/settings',
                  method: 'PUT',
                  body: payload,
                  timeoutMs: 12000,
                });

                setSyncConfigToOtherStatus('');
                notify.success('同步成功');
                setTimeout(() => {
                  hideSyncConfigToOtherPicker();
                }, 800);
              } catch (e) {
                const msg = e && e.message ? String(e.message) : '同步失败';
                setSyncConfigToOtherStatus('');
                notify.error(msg);
              } finally {
                setButtonLoading(syncConfigToOtherConfirm, false);
                if (syncConfigToOtherBtn) syncConfigToOtherBtn.disabled = prevDisabled.btn;
                if (syncConfigToOtherSelect) syncConfigToOtherSelect.disabled = prevDisabled.select;
                if (syncConfigToOtherConfirm) syncConfigToOtherConfirm.disabled = prevDisabled.ok || !String(syncConfigToOtherSelect.value || '');
                if (syncConfigToOtherCancel) syncConfigToOtherCancel.disabled = prevDisabled.cancel;
              }
            });
          });

          bindOnce(serverDeleteBtn, () => {
            serverDeleteBtn.addEventListener('click', async () => {
              const key = serverSelect ? String(serverSelect.value || '') : '';
              if (!key || key === '__new__') return;
              if (!catpawrunnerServerDeleteConfirming) {
                setDeleteConfirming(true);
                syncDeleteButtonsVisibility();
                return;
              }

              if (!serverDeleteBtn || serverDeleteBtn.disabled) return;
              serverDeleteBtn.disabled = true;
              if (serverDeleteCancelBtn) serverDeleteCancelBtn.disabled = true;
              try {
                const { resp, data } = await postForm('/dashboard/catpawrunner/delete', { catpawrunnerServerKey: key });
                if (!(resp.ok && data && data.success)) {
                  setcatpawrunnerSaveStatus('error', (data && data.message) || '删除失败');
                  setDeleteConfirming(false);
                  syncDeleteButtonsVisibility();
                  return;
                }

                catpawrunnerServers = normalizeServers(data.servers);
                catpawrunnerServerAddMode = false;
                setAddButtonLabel(false);
                setDeleteConfirming(false);

                renderServerOptions();
                if (catpawrunnerServers.length) {
                  await selectServer(catpawrunnerServers[0].name, { refreshRemote: true });
                } else {
                  if (nameInput) nameInput.value = '';
                  if (apiInput) apiInput.value = '';
                  catpawrunnerSavedApiBaseNorm = '';
                  synccatpawrunnerSettingsVisibility();
                  setcatpawrunnerRemoteState('hidden');
                  syncServerEditorVisibility();
                }
                syncDeleteButtonsVisibility();
                setcatpawrunnerSaveStatus('', '');
                notify.success('删除成功');
              } catch (_e) {
                setcatpawrunnerSaveStatus('error', '删除失败');
                setDeleteConfirming(false);
                syncDeleteButtonsVisibility();
              } finally {
                serverDeleteBtn.disabled = false;
                if (serverDeleteCancelBtn) serverDeleteCancelBtn.disabled = false;
              }
            });
          });

          bindOnce(serverDeleteCancelBtn, () => {
            serverDeleteCancelBtn.addEventListener('click', () => {
              setDeleteConfirming(false);
              syncDeleteButtonsVisibility();
            });
          });

        if (goProxyEnabledInput) goProxyEnabledInput.checked = !!settings.goProxyEnabled;
        if (goProxyAutoSelectInput) goProxyAutoSelectInput.checked = !!settings.goProxyAutoSelect;
        const parsedServers = normalizeGoProxyServers(
          safeParseJsonArray(settings.goProxyServersJson || settings.goProxyServers || '[]')
        );
        goProxyServers = parsedServers;
        goProxyServers.forEach((s) => ensureGoProxyProbeEntry(s && s.base));
        writeGoProxyServersJson();
        renderGoProxyServerTable();
        probeAllGoProxyVersions().catch(() => {});
	      }
	      panelLoaded.interface = true;
    } finally {
      panelLoading.interface = false;
    }
  };

	  let thirdPartyLoaded = false;
	  let thirdPartyLoading = false;
	  let embyHomeSections = [];
	  let embyHomeHandlersBound = false;
	  let thirdPartyHomeSites = [];
	  const thirdPartySiteCategoryCache = new Map(); // siteKey -> [{id,name}]
	
	  const DEFAULT_EMBY_HOME_SECTIONS = [
	    { id: 'view_history', name: '历史', module: 'history', mediaType: 'tv' },
	    { id: 'view_tmdb_tv', name: '剧集', module: 'douban_tv', mediaType: 'tv' },
	    { id: 'view_tmdb_movies', name: '电影', module: 'douban_movie', mediaType: 'movie' },
	    { id: 'view_tmdb_anime', name: '动漫', module: 'bangumi_anime', mediaType: 'tv' },
	    { id: 'view_tmdb_show', name: '综艺', module: 'douban_variety', mediaType: 'tv' },
	  ];
	
	  const EM_BY_MODULE_OPTIONS = [
	    { value: 'douban_tv', label: '豆瓣剧集' },
	    { value: 'douban_movie', label: '豆瓣电影' },
	    { value: 'bangumi_anime', label: 'Bangumi动漫' },
	    { value: 'douban_variety', label: '豆瓣综艺' },
	    { value: 'history', label: '历史记录' },
	    { value: 'site_data', label: '站点数据' },
	  ];
	
	  const EM_BY_MEDIA_TYPE_OPTIONS = [
	    { value: 'tv', label: '电视剧' },
	    { value: 'movie', label: '电影' },
	  ];

	  const EM_BY_CARD_STYLE_OPTIONS = [
	    { value: 'tmdb', label: 'TMDB' },
	    { value: 'site', label: '站点数据' },
	  ];

	  const isModuleRequiringSite = (m) => String(m || '').trim().toLowerCase() === 'site_data';
	
	  const setEmbyHomeStatus = (kind, msg) => {
	    if (!embyHomeSettingsStatus) return;
	    const text = typeof msg === 'string' ? msg.trim() : '';
	    const k = typeof kind === 'string' ? kind.trim() : '';
	    embyHomeSettingsStatus.classList.toggle('hidden', !text);
    embyHomeSettingsStatus.classList.toggle('text-green-600', k === 'success');
    embyHomeSettingsStatus.classList.toggle('text-red-600', k === 'error');
    embyHomeSettingsStatus.classList.toggle('text-gray-500', !k);
    embyHomeSettingsStatus.textContent = text;
	  };
	
	  const normalizeEmbyHomeSection = (s) => {
	    const obj = s && typeof s === 'object' ? s : {};
	    const id = typeof obj.id === 'string' ? obj.id.trim() : '';
	    const name = typeof obj.name === 'string' ? obj.name.trim() : '';
	    const moduleRaw = typeof obj.module === 'string' ? obj.module.trim().toLowerCase() : '';
	    const mediaTypeRaw = typeof obj.mediaType === 'string' ? obj.mediaType.trim().toLowerCase() : '';
	    const siteKey = typeof obj.siteKey === 'string' ? obj.siteKey.trim() : '';
	    const categoryId = typeof obj.categoryId === 'string' ? obj.categoryId.trim() : '';
	    const cardStyleRaw = typeof obj.cardStyle === 'string' ? obj.cardStyle.trim().toLowerCase() : '';
	    if (!name) return null;
	    const moduleAllowed = new Set(EM_BY_MODULE_OPTIONS.map((x) => x.value));
	    const module = moduleAllowed.has(moduleRaw) ? moduleRaw : 'douban_tv';
	    let mediaType = mediaTypeRaw === 'movie' || mediaTypeRaw === 'tv' ? mediaTypeRaw : '';
	    if (!mediaType) {
	      mediaType = module === 'douban_movie' ? 'movie' : 'tv';
	    }
	    const finalId = (id || `view_custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`).startsWith('view_')
	      ? (id || `view_custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`)
	      : `view_${id || `custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`}`;
	    const out = { id: finalId, name, module, mediaType };
	    if (isModuleRequiringSite(module)) {
	      out.siteKey = siteKey;
	      out.categoryId = categoryId;
	      out.cardStyle = cardStyleRaw === 'site' || cardStyleRaw === 'tmdb' ? cardStyleRaw : 'tmdb';
	    } else {
	      out.siteKey = '';
	      out.categoryId = '';
	      out.cardStyle = '';
	    }
	    return out;
	  };

  const syncEmbyHomeJson = () => {
    if (!embyHomeSectionsJson) return;
    try {
      embyHomeSectionsJson.value = JSON.stringify(embyHomeSections || []);
    } catch (_e) {
      embyHomeSectionsJson.value = '[]';
    }
  };

	  const renderEmbyHomeSections = () => {
	    if (!embyHomeSectionTableBody) return;
	    const list = Array.isArray(embyHomeSections) ? embyHomeSections : [];
	    if (!list.length) {
	      embyHomeSectionTableBody.innerHTML = '<tr><td class="px-3 py-2 text-gray-500 dark:text-gray-400" colspan="7">无数据</td></tr>';
	      syncEmbyHomeJson();
	      return;
	    }
	    const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
	    const moduleOptionsHtml = EM_BY_MODULE_OPTIONS.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
	    const mediaTypeOptionsHtml = EM_BY_MEDIA_TYPE_OPTIONS.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
	    const cardStyleOptionsHtml = EM_BY_CARD_STYLE_OPTIONS.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
	    const siteOptionsHtml = (thirdPartyHomeSites || [])
	      .filter((s) => s && s.key && s.name)
	      .map((s) => `<option value="${esc(s.key)}">${esc(s.name)}</option>`)
	      .join('');
	    embyHomeSectionTableBody.innerHTML = list
	      .map((s, i) => {
	        const upDisabled = i === 0 ? 'disabled' : '';
	        const downDisabled = i === list.length - 1 ? 'disabled' : '';
	        const module = String(s.module || '').trim().toLowerCase();
	        const siteEnabled = isModuleRequiringSite(module);
	        const siteKey = String(s.siteKey || '').trim();
	        const categories = siteEnabled && siteKey ? (thirdPartySiteCategoryCache.get(siteKey) || []) : [];
	        const categoryOptionsHtml = categories
	          .filter((c) => c && c.id && c.name)
	          .map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`)
	          .join('');
	        const siteDisabledAttr = siteEnabled ? '' : 'disabled';
	        const categoryDisabledAttr = siteEnabled && siteKey ? '' : 'disabled';
	        const cardStyleDisabledAttr = siteEnabled ? '' : 'disabled';
	        return `
	          <tr data-index="${i}">
	            <td class="px-3 py-2">
	              <input class="tv-field" data-field="name" data-index="${i}" value="${esc(s.name)}" autocomplete="off" />
	            </td>
	            <td class="px-3 py-2">
	              <select class="custom-select tv-field" data-field="module" data-index="${i}">
	                ${moduleOptionsHtml}
	              </select>
	            </td>
	            <td class="px-3 py-2">
	              <select class="custom-select tv-field" data-field="mediaType" data-index="${i}">
	                ${mediaTypeOptionsHtml}
	              </select>
	            </td>
	            <td class="px-3 py-2">
	              <select class="custom-select tv-field" data-field="siteKey" data-index="${i}" ${siteDisabledAttr}>
	                <option value="">选择站点</option>
	                ${siteOptionsHtml}
	              </select>
	            </td>
	            <td class="px-3 py-2">
	              <select class="custom-select tv-field" data-field="categoryId" data-index="${i}" ${categoryDisabledAttr}>
	                <option value="">选择分类</option>
	                ${categoryOptionsHtml}
	              </select>
	            </td>
	            <td class="px-3 py-2">
	              <select class="custom-select tv-field" data-field="cardStyle" data-index="${i}" ${cardStyleDisabledAttr}>
	                ${cardStyleOptionsHtml}
	              </select>
	            </td>
	            <td class="px-3 py-2 whitespace-nowrap">
	              <button type="button" class="btn-ghost-blue" data-action="up" data-index="${i}" ${upDisabled}>上移</button>
	              <button type="button" class="btn-ghost-blue" data-action="down" data-index="${i}" ${downDisabled}>下移</button>
	              <button type="button" class="btn-ghost-red" data-action="delete" data-index="${i}">删除</button>
	            </td>
	          </tr>
	        `;
	      })
	      .join('');
	    list.forEach((s, i) => {
	      const row = embyHomeSectionTableBody.querySelector(`tr[data-index="${i}"]`);
	      if (!row) return;
	      const moduleEl = row.querySelector('select[data-field="module"]');
	      const mediaTypeEl = row.querySelector('select[data-field="mediaType"]');
	      const siteKeyEl = row.querySelector('select[data-field="siteKey"]');
	      const categoryEl = row.querySelector('select[data-field="categoryId"]');
	      const cardStyleEl = row.querySelector('select[data-field="cardStyle"]');
	      if (moduleEl) moduleEl.value = String(s.module || '');
	      if (mediaTypeEl) mediaTypeEl.value = String(s.mediaType || '');
	      if (siteKeyEl) siteKeyEl.value = String(s.siteKey || '');
	      if (categoryEl) categoryEl.value = String(s.categoryId || '');
	      if (cardStyleEl) cardStyleEl.value = String(s.cardStyle || 'tmdb');
	    });
	    syncEmbyHomeJson();
	  };
	
	  const loadThirdPartyHomeSites = async () => {
	    try {
	      const data = await getSuccessJson('/dashboard/video/source/sites');
	      const sites = data && Array.isArray(data.sites) ? data.sites : [];
	      thirdPartyHomeSites = sites
	        .filter((s) => s && s.home && s.enabled && s.key && s.name && s.api)
	        .map((s) => ({ key: String(s.key), name: String(s.name), api: String(s.api) }));
	    } catch (_e) {
	      thirdPartyHomeSites = [];
	    }
	  };
	
	  const ensureThirdPartySiteCategories = async (siteKey) => {
	    const key = String(siteKey || '').trim();
	    if (!key) return [];
	    if (thirdPartySiteCategoryCache.has(key)) return thirdPartySiteCategoryCache.get(key) || [];
	    try {
	      const data = await getSuccessJson(`/dashboard/thirdparty/site/categories?siteKey=${encodeURIComponent(key)}`);
	      const list = data && Array.isArray(data.categories) ? data.categories : [];
	      const normalized = list
	        .map((c) => ({
	          id: c && typeof c.id === 'string' ? c.id.trim() : '',
	          name: c && typeof c.name === 'string' ? c.name.trim() : '',
	        }))
	        .filter((c) => c.id && c.name)
	        .slice(0, 200);
	      thirdPartySiteCategoryCache.set(key, normalized);
	      return normalized;
	    } catch (_e) {
	      thirdPartySiteCategoryCache.set(key, []);
	      return [];
	    }
	  };
	
	  const validateEmbyHomeSections = (list) => {
	    const rows = Array.isArray(list) ? list : [];
	    for (let i = 0; i < rows.length; i++) {
	      const r = rows[i] && typeof rows[i] === 'object' ? rows[i] : {};
	      const name = typeof r.name === 'string' ? r.name.trim() : '';
	      const module = typeof r.module === 'string' ? r.module.trim().toLowerCase() : '';
	      const mediaType = typeof r.mediaType === 'string' ? r.mediaType.trim().toLowerCase() : '';
	      if (!name) return `第 ${i + 1} 行：显示名称不能为空`;
	      if (!module) return `第 ${i + 1} 行：主模块不能为空`;
	      if (mediaType !== 'tv' && mediaType !== 'movie') return `第 ${i + 1} 行：栏目类型必须是 电视剧/电影`;
	      if (isModuleRequiringSite(module)) {
	        const siteKey = typeof r.siteKey === 'string' ? r.siteKey.trim() : '';
	        const categoryId = typeof r.categoryId === 'string' ? r.categoryId.trim() : '';
	        const cardStyle = typeof r.cardStyle === 'string' ? r.cardStyle.trim().toLowerCase() : '';
	        if (!siteKey) return `第 ${i + 1} 行：请选择站点`;
	        if (!categoryId) return `第 ${i + 1} 行：请选择分类`;
	        if (cardStyle !== 'tmdb' && cardStyle !== 'site') return `第 ${i + 1} 行：请选择卡片属性`;
	      }
	    }
	    return '';
	  };
	
	  const bindEmbyHomeHandlers = () => {
	    if (embyHomeHandlersBound) return;
	    embyHomeHandlersBound = true;

	    if (embyHomeSectionAdd) {
	      embyHomeSectionAdd.addEventListener('click', () => {
	        const base = { name: '新栏目', module: 'douban_tv', mediaType: 'tv', siteKey: '', categoryId: '' };
	        const next = normalizeEmbyHomeSection(base);
	        if (!next) return;
	        embyHomeSections = (Array.isArray(embyHomeSections) ? embyHomeSections.slice() : []).concat([next]);
	        renderEmbyHomeSections();
        setEmbyHomeStatus('', '');
      });
    }

    if (embyHomeSectionRestoreDefaults) {
      embyHomeSectionRestoreDefaults.addEventListener('click', () => {
        embyHomeSections = DEFAULT_EMBY_HOME_SECTIONS.map((s) => normalizeEmbyHomeSection(s)).filter(Boolean);
        renderEmbyHomeSections();
        setEmbyHomeStatus('', '');
      });
    }

		    if (embyHomeSectionTableBody) {
		      const onFieldUpdate = (e) => {
		        const el = e && e.target ? e.target : null;
		        const idx = el && el.dataset ? parseInt(el.dataset.index || '', 10) : -1;
		        const field = el && el.dataset ? String(el.dataset.field || '') : '';
		        if (!Number.isInteger(idx) || idx < 0) return;
	        if (!field) return;
		        const list = Array.isArray(embyHomeSections) ? embyHomeSections.slice() : [];
		        if (!list[idx]) return;
		        const value = el && typeof el.value === 'string' ? el.value : '';
		        // Avoid re-rendering the whole table on each keystroke.
		        // The "显示名称" input is a plain <input>, and re-rendering on every `input`
		        // event will replace the DOM node, causing focus loss and "cannot type" behavior.
		        if (e && e.type === 'input' && field === 'name') {
		          list[idx] = { ...list[idx], name: value };
		          embyHomeSections = list;
		          syncEmbyHomeJson();
		          setEmbyHomeStatus('', '');
		          return;
		        }

		        list[idx] = { ...list[idx], [field]: value };
		        if (field === 'module') {
		          const m = String(value || '').trim().toLowerCase();
		          if (!isModuleRequiringSite(m)) {
		            list[idx].siteKey = '';
		            list[idx].categoryId = '';
	            list[idx].cardStyle = '';
	          }
	          if (!list[idx].mediaType) {
	            list[idx].mediaType = m === 'douban_movie' ? 'movie' : 'tv';
	          }
	          if (isModuleRequiringSite(m) && !list[idx].cardStyle) {
	            list[idx].cardStyle = 'tmdb';
	          }
	        }
	        if (field === 'siteKey') {
	          list[idx].categoryId = '';
	          const sk = String(value || '').trim();
	          embyHomeSections = list.map(normalizeEmbyHomeSection).filter(Boolean);
	          renderEmbyHomeSections();
	          setEmbyHomeStatus('', '');
	          if (sk) {
	            ensureThirdPartySiteCategories(sk).then((cats) => {
	              const cur = Array.isArray(embyHomeSections) ? embyHomeSections.slice() : [];
	              const row = cur[idx];
	              if (!row || String(row.siteKey || '').trim() !== sk) return;
	              if (!row.categoryId && cats && cats.length) {
	                row.categoryId = cats[0].id;
	                cur[idx] = row;
	                embyHomeSections = cur.map(normalizeEmbyHomeSection).filter(Boolean);
	                renderEmbyHomeSections();
	              }
	            });
		          }
		          return;
		        }
		        embyHomeSections = list.map(normalizeEmbyHomeSection).filter(Boolean);
		        // Only re-render when necessary; for simple select updates the DOM already reflects the value.
		        if (field === 'module') {
		          renderEmbyHomeSections();
		        } else {
		          syncEmbyHomeJson();
		        }
		        setEmbyHomeStatus('', '');
		      };
		      embyHomeSectionTableBody.addEventListener('input', onFieldUpdate);
		      embyHomeSectionTableBody.addEventListener('change', onFieldUpdate);
	
	      embyHomeSectionTableBody.addEventListener('click', (e) => {
	        const el = e && e.target ? e.target : null;
	        const action = el && el.dataset ? String(el.dataset.action || '') : '';
        const idx = el && el.dataset ? parseInt(el.dataset.index || '', 10) : -1;
        if (!action || !Number.isInteger(idx) || idx < 0) return;
        const list = Array.isArray(embyHomeSections) ? embyHomeSections.slice() : [];
        if (action === 'delete') {
          list.splice(idx, 1);
        } else if (action === 'up' && idx > 0) {
          const tmp = list[idx - 1];
          list[idx - 1] = list[idx];
          list[idx] = tmp;
        } else if (action === 'down' && idx < list.length - 1) {
          const tmp = list[idx + 1];
          list[idx + 1] = list[idx];
          list[idx] = tmp;
        } else {
          return;
        }
        embyHomeSections = list;
        renderEmbyHomeSections();
        setEmbyHomeStatus('', '');
      });
    }

	    if (thirdPartySettingsForm) {
	      thirdPartySettingsForm.addEventListener('submit', async (e) => {
	        e.preventDefault();
	        const errMsg = validateEmbyHomeSections(embyHomeSections);
	        if (errMsg) {
	          setEmbyHomeStatus('error', errMsg);
	          return;
	        }
	        syncEmbyHomeJson();
	        setEmbyHomeStatus('', '');
	        setEmbyHomeStatus('info', '保存中...');
        try {
          const { resp, data } = await postForm('/dashboard/thirdparty/save', {
            embyHomeSectionsJson: embyHomeSectionsJson ? embyHomeSectionsJson.value : '[]',
          });
          if (resp.ok && data && data.success) {
            setEmbyHomeStatus('success', '保存成功');
            clearStatusLater(setEmbyHomeStatus, 1500);
            return;
          }
          setEmbyHomeStatus('error', (data && data.message) || '保存失败');
        } catch (err) {
          setEmbyHomeStatus('error', (err && err.message) || '保存失败');
        }
      });
    }
  };

	  const loadThirdpartyPanel = async () => {
	    if (thirdPartyLoaded || thirdPartyLoading) return;
	    thirdPartyLoading = true;
	    try {
	      bindEmbyHomeHandlers();
	      await loadThirdPartyHomeSites();
	      const data = await getSuccessJson('/dashboard/thirdparty/settings');
	      const list = data && Array.isArray(data.embyHomeSections) ? data.embyHomeSections : [];
	      const normalized = list.map(normalizeEmbyHomeSection).filter(Boolean);
	      embyHomeSections = normalized.length ? normalized : DEFAULT_EMBY_HOME_SECTIONS.map((s) => normalizeEmbyHomeSection(s)).filter(Boolean);
	      const siteKeys = Array.from(
	        new Set(
	          embyHomeSections
	            .filter((s) => s && isModuleRequiringSite(s.module))
	            .map((s) => String(s.siteKey || '').trim())
	            .filter(Boolean)
	        )
	      );
	      for (const sk of siteKeys) {
	        await ensureThirdPartySiteCategories(sk);
	      }
	      renderEmbyHomeSections();
	      thirdPartyLoaded = true;
	    } finally {
	      thirdPartyLoading = false;
	    }
	  };

  const siteForm = document.getElementById('siteSettingsForm');
  const saveStatus = document.getElementById('saveStatus');
  const setSiteSaveStatus = bindInlineStatus(saveStatus);
  bindOnce(siteForm, () => {
    siteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await withDatasetLock(siteForm, 'pending', async () => {
        const submitBtn = siteForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, { loadingText: '保存中' });
        setSiteSaveStatus('', '');
        try {
          const { resp, data } = await postForm(siteForm.action, formToFields(siteForm));
          if (resp.ok && data && data.success) {
            setSiteSaveStatus('', '');
            notify.success('保存成功');
          } else {
            const msg = (data && data.message) || '保存失败';
            setSiteSaveStatus('', '');
            notify.error(msg);
          }
        } catch (_err) {
          setSiteSaveStatus('', '');
          notify.error('保存失败');
        } finally {
          setButtonLoading(submitBtn, false);
        }
      });
    });
  });

	  const catpawrunnerForm = document.getElementById('catpawrunnerSettingsForm');
	  const catpawrunnerSaveStatus = document.getElementById('catpawrunnerSaveStatus');
    const stripHtml = (input) => String(input || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	  const setcatpawrunnerSaveStatus = (type, text) => {
      setInlineStatus(catpawrunnerSaveStatus, '', '');
      const t = text != null ? String(text).trim() : '';
      if (!t) return;
      if (type === 'error') notify.error(t);
    };
	  const setcatpawrunnerSaveStatusHtml = (type, html) => {
      setInlineStatusHtml(catpawrunnerSaveStatus, '', '');
      const t = stripHtml(html);
      if (!t) return;
      if (type === 'error') notify.error(t);
    };
	  bindOnce(catpawrunnerForm, () => {
    const apiInput = catpawrunnerForm ? catpawrunnerForm.querySelector('input[name="catpawrunnerApiBase"]') : null;
    const nameInput = catpawrunnerForm ? catpawrunnerForm.querySelector('input[name="catpawrunnerName"]') : null;
	    const serverSelect = document.getElementById('catpawrunnerServerSelect');
	    const serverAddBtn = document.getElementById('catpawrunnerServerAdd');
	    const serverAddCancelBottomBtn = document.getElementById('catpawrunnerServerAddCancelBottom');
	    catpawrunnerConfigListEditor = initcatpawrunnerConfigListEditor();
	    const syncSaveInput = document.getElementById('catpawrunnerSyncSave');

    catpawrunnerSavedApiBaseNorm = normalizecatpawrunnerAdminBase(
      apiInput && typeof apiInput.value === 'string' ? apiInput.value : ''
    );
    synccatpawrunnerSettingsVisibility();
    if (apiInput) {
      apiInput.addEventListener('input', () => {
        synccatpawrunnerSettingsVisibility();
      });
	    }

	    const submitBtn = catpawrunnerForm ? catpawrunnerForm.querySelector('button[type="submit"]') : null;
	    const submitBtnOriginalHtml = submitBtn ? submitBtn.innerHTML : '';
	    let submitBtnLoading = false;
	    const getSubmitLabelHtml = () => (catpawrunnerServerAddMode ? '添加' : submitBtnOriginalHtml || '保存');
	    const setSubmitBtnLoading = (loading) => {
	      if (!submitBtn) return;
	      submitBtnLoading = !!loading;
	      if (loading) {
	        submitBtn.disabled = true;
	        submitBtn.innerHTML = `<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>`;
	      } else {
	        submitBtn.disabled = false;
	        submitBtn.innerHTML = getSubmitLabelHtml();
	      }
	    };

	    const syncServerAddModeButtons = () => {
	      if (serverAddCancelBottomBtn) {
	        serverAddCancelBottomBtn.classList.toggle('hidden', !catpawrunnerServerAddMode);
	        serverAddCancelBottomBtn.disabled = false;
	      }
	      if (submitBtn && !submitBtnLoading) submitBtn.innerHTML = getSubmitLabelHtml();
	    };

	    synccatpawrunnerServerAddModeButtons = syncServerAddModeButtons;
	    syncServerAddModeButtons();

	    bindOnce(serverAddCancelBottomBtn, () => {
	      serverAddCancelBottomBtn.addEventListener('click', async () => {
	        if (!catpawrunnerServerAddMode) return;
	        if (serverSelect && serverSelect.value) {
	          // ensure custom dropdown highlights are not stuck
	          try {
	            serverSelect.blur();
	          } catch (_e) {}
	        }
	        try {
	          await cancelcatpawrunnerServerAddMode();
	        } catch (_e) {
	          if (serverAddBtn) serverAddBtn.click();
	        }
	      });
	    });

	    let checkingDotsTimer = null;
	    let restartDotsTimer = null;
    let restartPollTimer = null;
    let restartStartedAt = 0;
    let restartToken = 0;

    const stopRestartWatch = () => {
      restartToken += 1;
      if (checkingDotsTimer) clearInterval(checkingDotsTimer);
      if (restartDotsTimer) clearInterval(restartDotsTimer);
      if (restartPollTimer) clearInterval(restartPollTimer);
      checkingDotsTimer = null;
      restartDotsTimer = null;
      restartPollTimer = null;
      restartStartedAt = 0;
    };

    const renderCheckingStatus = ({ dots = 0, failed = false } = {}) => {
      const dotText = failed ? '' : '.'.repeat(Math.max(0, Math.min(3, dots)));
      const inner = failed
        ? `<span class="text-red-600">CatPawRunner 检测配置异常</span>`
        : `<span class="text-gray-500 dark:text-gray-400">CatPawRunner 检测配置中${dotText}</span>`;
      setcatpawrunnerSaveStatusHtml('success', `保存成功(${inner})`);
    };

    const renderRestartingStatus = ({ dots = 0, failed = false } = {}) => {
      const dotText = failed ? '' : '.'.repeat(Math.max(0, Math.min(3, dots)));
      const inner = failed
        ? `<span class="text-red-600">CatPawRunner 启动异常</span>`
        : `<span class="text-gray-500 dark:text-gray-400">CatPawRunner 重启中${dotText}</span>`;
      setcatpawrunnerSaveStatusHtml('success', `保存成功(${inner})`);
    };

    const renderRestartDoneStatus = () => {
      setcatpawrunnerSaveStatusHtml('success', `保存成功(<span class="text-gray-500 dark:text-gray-400">CatPawRunner 重启完成</span>)`);
    };

    const startCheckingWatch = () => {
      const token = restartToken;
      if (checkingDotsTimer) clearInterval(checkingDotsTimer);
      let dots = 0;
      renderCheckingStatus({ dots, failed: false });
      checkingDotsTimer = setInterval(() => {
        if (token !== restartToken) return;
        dots = (dots + 1) % 4;
        renderCheckingStatus({ dots, failed: false });
      }, 500);
    };

    const startRestartWatch = (apiBase) => {
      stopRestartWatch();
      const token = restartToken;
      restartStartedAt = Date.now();

      let dots = 0;
      renderRestartingStatus({ dots, failed: false });
      restartDotsTimer = setInterval(() => {
        dots = (dots + 1) % 4;
        renderRestartingStatus({ dots, failed: false });
      }, 500);

      setTimeout(() => {
        if (token !== restartToken) return;
        const startPoll = () => {
          const checkOnce = async () => {
            if (token !== restartToken) return;
            const elapsed = Date.now() - restartStartedAt;
            if (elapsed > 60000) {
              stopRestartWatch();
              renderRestartingStatus({ failed: true });
              return;
            }
            try {
              await requestcatpawrunnerAdminJson({
                apiBase,
                path: 'admin/settings',
                method: 'GET',
                timeoutMs: 4000,
              });
              stopRestartWatch();
              renderRestartDoneStatus();
            } catch (_e) {
              // keep polling
            }
          };
          checkOnce();
          restartPollTimer = setInterval(checkOnce, 2000);
        };
        startPoll();
      }, 1000);
    };

    const syncPanLoginBtn = document.getElementById('catpawrunnerSyncPanLoginSettingsBtn');
    const syncPanLoginStatus = document.getElementById('catpawrunnerSyncPanLoginSettingsStatus');
    const setSyncPanLoginStatus = bindInlineStatus(syncPanLoginStatus);
    bindOnce(syncPanLoginBtn, () => {
      syncPanLoginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await withDatasetLock(syncPanLoginBtn, 'pending', async () => {
          setSyncPanLoginStatus('', '');
          setButtonLoading(syncPanLoginBtn, true, { loadingText: '同步中' });
          try {
            const sync = await syncAllPanLoginSettingsTocatpawrunner();
            if (sync && sync.ok === false && sync.skipped === true && sync.reason === 'unconfigured') {
              notify.error('CatPawRunner 接口地址未设置');
              return;
            }

            const okCount = sync && typeof sync.okCount === 'number' ? sync.okCount : 0;
            const failCount = sync && typeof sync.failCount === 'number' ? sync.failCount : 0;

            if (sync && sync.ok === false) {
              notify.error(`同步完成：成功 ${okCount}，失败 ${failCount}`);
              return;
            }
            if (!okCount && !failCount) {
              notify.info('无可同步账号');
              return;
            }
            if (failCount > 0) {
              notify.error(`同步完成：成功 ${okCount}，失败 ${failCount}`);
              return;
            }
            notify.success(`同步完成：成功 ${okCount}`);
          } catch (_err) {
            notify.error('同步失败');
          } finally {
            setButtonLoading(syncPanLoginBtn, false);
            setSyncPanLoginStatus('', '');
          }
        });
      });
    });

    catpawrunnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await withDatasetLock(catpawrunnerForm, 'pending', async () => {
        stopRestartWatch();
        setSubmitBtnLoading(true);
        setcatpawrunnerSaveStatus('', '保存中...');
        let shouldToastSuccess = false;
        try {
          const selectedServerKeyBefore = serverSelect ? String(serverSelect.value || '') : '';
          const isAddingServer = catpawrunnerServerAddMode || selectedServerKeyBefore === '__new__';
          const syncFromSelect = document.getElementById('catpawrunnerSyncFromServerSelect');
          const syncFromKey = syncFromSelect ? String(syncFromSelect.value || '') : '';
          const apiBaseRaw = apiInput && typeof apiInput.value === 'string' ? apiInput.value : '';
          const normalizedBase = normalizecatpawrunnerAdminBase(apiBaseRaw);
          const savedBaseBefore = catpawrunnerSavedApiBaseNorm;
          const baseChanged = normalizedBase !== savedBaseBefore;
          const wantsSyncSave = !!(syncSaveInput && syncSaveInput.checked) && !isAddingServer;

          const { resp, data } = await postForm(catpawrunnerForm.action, formToFields(catpawrunnerForm));
          if (!(resp.ok && data && data.success)) {
            setcatpawrunnerSaveStatus('error', (data && data.message) || '保存失败');
            return;
          }
          // Dashboard setting persisted; toast only after the whole workflow completes.
          setcatpawrunnerSaveStatus('', '');

          // If we were adding a server, update the dropdown immediately to the saved name.
          if (serverSelect && nameInput) {
            const savedName = String(nameInput.value || '').trim();
            const savedApi = normalizedBase || normalizecatpawrunnerAdminBase(apiInput && apiInput.value ? apiInput.value : '');
            const rebuildServerOptions = (selectedKey) => {
              if (!serverSelect) return;
              serverSelect.innerHTML = '';
              if (!catpawrunnerServers.length) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.disabled = true;
                opt.selected = true;
                opt.textContent = '暂无数据';
                serverSelect.appendChild(opt);
                remountCustomSelectElement(serverSelect);
                return;
              }
              catpawrunnerServers.forEach((s) => {
                const opt = document.createElement('option');
                opt.value = s.name;
                opt.textContent = s.name;
                serverSelect.appendChild(opt);
              });
              serverSelect.value = selectedKey || (catpawrunnerServers[0] ? catpawrunnerServers[0].name : '');
              remountCustomSelectElement(serverSelect);
            };

            if (isAddingServer && savedName) {
              catpawrunnerServerAddMode = false;
              if (serverAddBtn) serverAddBtn.textContent = '添加服务器';

              const entry = { name: savedName, apiBase: savedApi || '' };
              const next = Array.isArray(catpawrunnerServers) ? catpawrunnerServers.slice() : [];
              const existsIdx = next.findIndex((s) => s && s.name === savedName);
              if (existsIdx >= 0) next[existsIdx] = entry;
              else next.push(entry);
              catpawrunnerServers = next;

              rebuildServerOptions(savedName);

              const extrasEl = document.getElementById('catpawrunnerSettingsExtras');
              if (extrasEl) extrasEl.classList.remove('hidden');
              if (syncSaveInput) syncSaveInput.disabled = false;
            } else if (!isAddingServer && savedName) {
              const next = Array.isArray(catpawrunnerServers) ? catpawrunnerServers.slice() : [];
              const idx = next.findIndex((s) => s && s.name === selectedServerKeyBefore);
              if (idx >= 0) next[idx] = { name: savedName, apiBase: savedApi || '' };
              catpawrunnerServers = next;

              rebuildServerOptions(savedName);
            }
          }

          // If API base changed, hide previous remote block immediately and only show it again after the new server responds.
          if (baseChanged) {
            setcatpawrunnerRemoteState('hidden');
          }

          if (!normalizedBase) {
            await refreshcatpawrunnerRemoteSettings(apiBaseRaw);
            shouldToastSuccess = true;
            return;
          }

          if (apiInput) apiInput.value = normalizedBase;
          catpawrunnerSavedApiBaseNorm = normalizedBase;
          synccatpawrunnerSettingsVisibility();

          if ((isAddingServer || baseChanged) && syncFromKey) {
            const resolveSourceApiBase = () => {
              if (syncFromKey === '__current__') return savedBaseBefore;
              const s = (catpawrunnerServers || []).find((it) => it && it.name === syncFromKey);
              return s && typeof s.apiBase === 'string' ? s.apiBase : '';
            };
            const sourceBase = normalizecatpawrunnerAdminBase(resolveSourceApiBase());
            if (!sourceBase) {
              setcatpawrunnerSaveStatus('error', '同步来源服务器无效（已保存）');
            } else {
              try {
                const sourceSettings = await requestcatpawrunnerAdminJson({
                  apiBase: sourceBase,
                  path: 'admin/settings',
                  method: 'GET',
                  timeoutMs: 8000,
                });
                const proxy =
                  sourceSettings && sourceSettings.settings && typeof sourceSettings.settings.proxy === 'string'
                    ? sourceSettings.settings.proxy
                    : '';
                const goProxyApi =
                  sourceSettings && sourceSettings.settings && typeof sourceSettings.settings.goProxyApi === 'string'
                    ? sourceSettings.settings.goProxyApi
                    : '';
                const panBuiltinResolverEnabled = !!(
                  sourceSettings &&
                  sourceSettings.settings &&
                  sourceSettings.settings.panBuiltinResolverEnabled
                );
                const onlineConfigs = Array.isArray(sourceSettings && sourceSettings.onlineConfigs)
                  ? sourceSettings.onlineConfigs
                      .map((it) => ({
                        name: it && typeof it.name === 'string' ? it.name : '',
                        url: it && typeof it.url === 'string' ? it.url : '',
                      }))
                      .filter((it) => it && it.name && it.url)
                  : [];

                await requestcatpawrunnerAdminJson({
                  apiBase: normalizedBase,
                  path: 'admin/settings',
                  method: 'PUT',
                  timeoutMs: 12000,
                  body: {
                    proxy: String(proxy || ''),
                    panBuiltinResolverEnabled,
                    goProxyApi: String(goProxyApi || ''),
                    onlineConfigs,
                  },
                });

                await refreshcatpawrunnerRemoteSettings(normalizedBase);
                setcatpawrunnerSaveStatus('', '');
                shouldToastSuccess = true;
                return;
              } catch (err) {
                const msg = err && err.message ? String(err.message) : '同步失败';
                setcatpawrunnerSaveStatus('error', `${msg}（已保存）`);
              }
            }
          }

          if (baseChanged && !wantsSyncSave) {
            await refreshcatpawrunnerRemoteSettings(normalizedBase);
            shouldToastSuccess = true;
            return;
          }

          if (baseChanged && wantsSyncSave) {
            try {
              await requestcatpawrunnerAdminJson({
                apiBase: normalizedBase,
                path: 'admin/settings',
                method: 'GET',
                timeoutMs: 4000,
              });
              setcatpawrunnerRemoteState('ready');
            } catch (err) {
              const msg = err && err.message ? String(err.message) : 'CatPawRunner 接口异常';
              setcatpawrunnerRemoteState('error', msg);
              return;
            }
          }

          if (!baseChanged) {
            const remoteSettingsEl = document.getElementById('catpawrunnerRemoteSettings');
            const canSync = !!(remoteSettingsEl && !remoteSettingsEl.classList.contains('hidden'));
            if (!canSync) {
              await refreshcatpawrunnerRemoteSettings(normalizedBase);
              shouldToastSuccess = true;
              return;
            }
          }

          if (catpawrunnerConfigListEditor && typeof catpawrunnerConfigListEditor.setCheckingAll === 'function') {
            catpawrunnerConfigListEditor.setCheckingAll();
          }
          startCheckingWatch();
          const sync = await synccatpawrunnerRemoteSettings(normalizedBase);
          if (checkingDotsTimer) {
            clearInterval(checkingDotsTimer);
            checkingDotsTimer = null;
          }
          if (sync && sync.ok === false) {
            renderCheckingStatus({ failed: true });
            return;
          }
          setcatpawrunnerSaveStatus('', '');
          shouldToastSuccess = true;
        } catch (_err) {
          stopRestartWatch();
          setcatpawrunnerSaveStatus('error', '保存失败');
        } finally {
          setSubmitBtnLoading(false);
          if (shouldToastSuccess) notify.success('保存成功');
        }
      });
    });
  });

  bindOnce(goProxySettingsForm, () => {
    if (goProxyServerEditor && !goProxyServerEditorHomeParent) {
      goProxyServerEditorHomeParent = goProxyServerEditor.parentNode;
      goProxyServerEditorHomeNextSibling = goProxyServerEditor.nextSibling;
    }

    const setEditorStatus = bindInlineStatus(goProxyServerEditorStatus);

    const setEditorConfirmEnabled = (enabled) => {
      if (!goProxyServerEditorConfirm) return;
      goProxyServerEditorConfirm.disabled = !enabled;
      if (enabled) {
        goProxyServerEditorConfirm.classList.add('btn-green');
        goProxyServerEditorConfirm.classList.remove('btn-add');
      } else {
        goProxyServerEditorConfirm.classList.add('btn-add');
        goProxyServerEditorConfirm.classList.remove('btn-green');
      }
    };

    const hideEditor = () => {
      restoreGoProxyServerEditorHome();
      goProxyEditorMode = 'hidden';
      goProxyEditorEditingKey = '';
      if (goProxyServerEditor) goProxyServerEditor.classList.add('hidden');
      if (goProxyServerEditorName) goProxyServerEditorName.value = '';
      if (goProxyServerEditorDisplayName) goProxyServerEditorDisplayName.value = '';
      if (goProxyServerEditorBase) goProxyServerEditorBase.value = '';
      setEditorStatus('', '');
      setEditorConfirmEnabled(false);
      if (goProxyServerAdd) goProxyServerAdd.textContent = '添加';
      if (goProxyServerEditorConfirm) goProxyServerEditorConfirm.textContent = '添加';
    };

    const showEditorAdd = () => {
      restoreGoProxyServerEditorHome();
      goProxyEditorMode = 'add';
      goProxyEditorEditingKey = '';
      if (goProxyServerEditor) goProxyServerEditor.classList.remove('hidden');
      if (goProxyServerEditorName) goProxyServerEditorName.value = '';
      if (goProxyServerEditorDisplayName) goProxyServerEditorDisplayName.value = '';
      if (goProxyServerEditorBase) goProxyServerEditorBase.value = '';
      setEditorStatus('', '');
      setEditorConfirmEnabled(false);
      if (goProxyServerAdd) goProxyServerAdd.textContent = '取消';
      if (goProxyServerEditorConfirm) goProxyServerEditorConfirm.textContent = '添加';
      try {
        if (goProxyServerEditorName) goProxyServerEditorName.focus();
      } catch (_e) {}
    };

    const showEditorEdit = (server) => {
      const base = server && typeof server.base === 'string' ? server.base : '';
      const key = base ? base.toLowerCase() : '';
      if (!key) return;
      goProxyEditorMode = 'edit';
      goProxyEditorEditingKey = key;
      if (goProxyServerEditor) goProxyServerEditor.classList.remove('hidden');
      if (goProxyServerEditorName) goProxyServerEditorName.value = String(server.name || '');
      if (goProxyServerEditorDisplayName) goProxyServerEditorDisplayName.value = String(server.displayName || '');
      if (goProxyServerEditorBase) goProxyServerEditorBase.value = String(server.base || '');
      setEditorStatus('', '');
      if (goProxyServerAdd) goProxyServerAdd.textContent = '添加';
      if (goProxyServerEditorConfirm) goProxyServerEditorConfirm.textContent = '确定';
      syncEditorConfirmState();
      renderGoProxyServerTable();
      try {
        if (goProxyServerEditorName) goProxyServerEditorName.focus();
      } catch (_e) {}
    };

    const getEditorDraft = () => {
      const name = goProxyServerEditorName ? String(goProxyServerEditorName.value || '').trim() : '';
      const displayName = goProxyServerEditorDisplayName ? String(goProxyServerEditorDisplayName.value || '').trim() : '';
      const baseRaw = goProxyServerEditorBase ? String(goProxyServerEditorBase.value || '').trim() : '';
      const base = normalizeHttpBase(baseRaw);
      return { name, displayName, baseRaw, base };
    };

    const validateEditorDraft = (draft) => {
      if (!draft.name) return { ok: false, message: '' };
      if (!draft.base) return { ok: false, message: '' };
      return { ok: true, message: '' };
    };

    const syncEditorConfirmState = () => {
      if (!goProxyServerEditorConfirm) return;
      const draft = getEditorDraft();
      const v = validateEditorDraft(draft);
      setEditorConfirmEnabled(!!v.ok);
    };

    if (goProxyServerEditorName) goProxyServerEditorName.addEventListener('input', () => {
      setEditorStatus('', '');
      syncEditorConfirmState();
    });
    if (goProxyServerEditorDisplayName) goProxyServerEditorDisplayName.addEventListener('input', () => {
      setEditorStatus('', '');
      syncEditorConfirmState();
    });
    if (goProxyServerEditorBase) goProxyServerEditorBase.addEventListener('input', () => {
      setEditorStatus('', '');
      syncEditorConfirmState();
    });

    if (goProxyServerAdd) {
      goProxyServerAdd.addEventListener('click', () => {
        if (goProxyEditorMode === 'add') {
          hideEditor();
          renderGoProxyServerTable();
          return;
        }
        showEditorAdd();
      });
    }

    if (goProxyServerEditorCancel) {
      goProxyServerEditorCancel.addEventListener('click', () => {
        hideEditor();
        renderGoProxyServerTable();
      });
    }

    const findServerIndexByBaseKey = (baseKey) => {
      const key = String(baseKey || '').toLowerCase();
      if (!key) return -1;
      return goProxyServers.findIndex((s) => (s && typeof s.base === 'string' ? s.base.toLowerCase() : '') === key);
    };

    const isBaseTaken = (baseKey, { exceptKey = '' } = {}) => {
      const key = String(baseKey || '').toLowerCase();
      if (!key) return false;
      const ex = String(exceptKey || '').toLowerCase();
      return goProxyServers.some((s) => {
        const b = s && typeof s.base === 'string' ? s.base.toLowerCase() : '';
        if (!b) return false;
        if (ex && b === ex) return false;
        return b === key;
      });
    };

    if (goProxyServerEditorConfirm) {
      goProxyServerEditorConfirm.addEventListener('click', async () => {
        const draft = getEditorDraft();
        if (!draft.name) {
          setEditorStatus('error', '名称不能为空');
          return;
        }
        if (!draft.base) {
          setEditorStatus('error', '接口地址不是合法 URL');
          return;
        }

        const baseKey = draft.base.toLowerCase();
        const displayName = draft.displayName || draft.name;

        if (goProxyEditorMode === 'add') {
          if (isBaseTaken(baseKey)) {
            setEditorStatus('error', '服务器已存在');
            return;
          }
          goProxyServers = normalizeGoProxyServers(
            goProxyServers.concat([{ name: draft.name, displayName, base: draft.base, pans: { baidu: true, quark: true } }])
          );
          ensureGoProxyProbeEntry(draft.base);
          writeGoProxyServersJson();
          hideEditor();
          renderGoProxyServerTable();
          probeGoProxyVersion(draft.base, { timeoutMs: 4000 }).catch(() => {});
          return;
        }

        if (goProxyEditorMode === 'edit') {
          const idx = findServerIndexByBaseKey(goProxyEditorEditingKey);
          if (idx < 0) {
            hideEditor();
            return;
          }
          if (isBaseTaken(baseKey, { exceptKey: goProxyEditorEditingKey })) {
            setEditorStatus('error', '接口地址已被占用');
            return;
          }
          const prev = goProxyServers[idx];
          const next = goProxyServers.slice();
          next[idx] = {
            name: draft.name,
            displayName,
            base: draft.base,
            pans: prev && prev.pans ? prev.pans : { baidu: true, quark: true },
          };
          goProxyServers = normalizeGoProxyServers(next);
          ensureGoProxyProbeEntry(draft.base);
          writeGoProxyServersJson();
          hideEditor();
          renderGoProxyServerTable();
          probeGoProxyVersion(draft.base, { timeoutMs: 4000 }).catch(() => {});
        }
      });
    }

    if (goProxyServerTableBody) {
      goProxyServerTableBody.addEventListener('click', (e) => {
        const target = e && e.target && e.target.closest ? e.target.closest('button[data-goproxy-action]') : null;
        if (!target) return;
        const action = String(target.getAttribute('data-goproxy-action') || '');
        const base = String(target.getAttribute('data-goproxy-base') || '');
        const baseKey = base ? base.toLowerCase() : '';
        if (!baseKey) return;
        if (action === 'cancel') {
          if (goProxyEditorMode === 'edit' && goProxyEditorEditingKey === baseKey) {
            hideEditor();
            renderGoProxyServerTable();
          }
          return;
        }
        if (action === 'delete') {
          goProxyServers = goProxyServers.filter((s) => (s && s.base ? s.base.toLowerCase() : '') !== baseKey);
          goProxyProbes.delete(baseKey);
          if (goProxyEditorMode === 'edit' && goProxyEditorEditingKey === baseKey) hideEditor();
          writeGoProxyServersJson();
          renderGoProxyServerTable();
          return;
        }
        if (action === 'edit') {
          const idx = findServerIndexByBaseKey(baseKey);
          if (idx < 0) return;
          showEditorEdit(goProxyServers[idx]);
        }
      });

      goProxyServerTableBody.addEventListener('change', (e) => {
        const input = e && e.target && e.target.closest ? e.target.closest('input[type="checkbox"][data-goproxy-pan]') : null;
        if (!input) return;
        const panKey = String(input.getAttribute('data-goproxy-pan') || '').trim();
        const base = String(input.getAttribute('data-goproxy-base') || '');
        const baseKey = base ? base.toLowerCase() : '';
        if (!panKey || !baseKey) return;
        const idx = findServerIndexByBaseKey(baseKey);
        if (idx < 0) return;
        const next = goProxyServers.slice();
        const prev = next[idx] || {};
        const prevPans = prev && typeof prev.pans === 'object' && prev.pans ? prev.pans : { baidu: true, quark: true };
        next[idx] = { ...prev, pans: { ...prevPans, [panKey]: !!input.checked } };
        goProxyServers = normalizeGoProxyServers(next);
        writeGoProxyServersJson();
      });
    }

	    goProxySettingsForm.addEventListener('submit', async (e) => {
	      e.preventDefault();
	      if (goProxySaving) return;
	      goProxySaving = true;
        const submitBtn = goProxySettingsForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, { loadingText: '保存中' });
	      setGoProxyStatus('', '');
	      try {
        const serversJson = writeGoProxyServersJson();
        const { resp, data } = await postForm(goProxySettingsForm.action, {
          goProxyEnabled: goProxyEnabledInput && goProxyEnabledInput.checked ? '1' : '0',
          goProxyAutoSelect: goProxyAutoSelectInput && goProxyAutoSelectInput.checked ? '1' : '0',
          goProxyServersJson: serversJson,
        });
        if (resp.ok && data && data.success) {
          setGoProxyStatus('', '');
          notify.success('保存成功');
        } else {
          const msg = (data && data.message) || '保存失败';
          setGoProxyStatus('', '');
          notify.error(msg);
        }
	      } catch (_e) {
        setGoProxyStatus('', '');
        notify.error('保存失败');
      } finally {
        goProxySaving = false;
        setButtonLoading(submitBtn, false);
      }
    });

    renderGoProxyServerTable();
    if (goProxyServerEditor && !goProxyServerEditor.classList.contains('hidden') && goProxyEditorMode === 'hidden') {
      hideEditor();
    }
  });


  const videoSourceSaveStatus = document.getElementById('videoSourceSaveStatus');
  const setVideoSourceSaveStatus = bindInlineStatus(videoSourceSaveStatus);

  const importVideoSourceSitesFromcatpawrunner = async () => {
    const apiBase = await resolvecatpawrunnerApiBase();
    const normalizedBase = normalizecatpawrunnerAdminBase(apiBase);
    if (!normalizedBase) {
      setVideoSourceSaveStatus('', '');
      notify.error('CatPawRunner 接口地址未设置');
      return;
    }
    setVideoSourceSaveStatus('', '');
    try {
	      const fullConfig = await requestcatpawrunnerAdminJson({
	        apiBase: normalizedBase,
	        path: 'admin/full-config',
	        method: 'GET',
	      });
      const list = fullConfig && fullConfig.video && Array.isArray(fullConfig.video.sites) ? fullConfig.video.sites : [];
      const sitesPayload = list
        .map((s) => ({
          key: s && typeof s.key === 'string' ? s.key : '',
          name: s && typeof s.name === 'string' ? s.name : '',
          api: s && typeof s.api === 'string' ? s.api : '',
          type: s && typeof s.type === 'number' ? s.type : undefined,
        }))
        .filter((s) => s.key && s.api);
      if (!sitesPayload.length) {
        setVideoSourceSaveStatus('', '');
        notify.error('未获取到站源');
        return;
      }
	      const { resp: r2, data: d2 } = await postForm('/dashboard/video/source/sites/import', {
	        sites: JSON.stringify(sitesPayload),
	      });
	      if (r2.ok && d2 && d2.success && Array.isArray(d2.sites)) {
	        if (d2 && typeof d2.coverSite === 'string') {
	          videoSourceCoverSite = String(d2.coverSite || '').trim();
	        }
	        // Mark special "skipped check" sources and `baseset` settings sources on import
          // so the UI doesn't keep showing "未检测".
	        try {
	          const sites = d2.sites || [];
	          const skippedKeys = sites
	            .filter((s) => s && typeof s.key === 'string' && shouldSkipVideoSourceCheck(s))
	            .map((s) => s.key)
	            .filter(Boolean);
            const basesetKeys = sites
              .filter(
                (s) =>
                  s &&
                  typeof s.key === 'string' &&
                  typeof s.api === 'string' &&
                  !shouldSkipVideoSourceCheck(s) &&
                  /^\/(?:[a-f0-9]{10}\/)?spider\/baseset(?:\/|$)/.test(s.api)
              )
              .map((s) => s.key)
              .filter(Boolean);

	          if (basesetKeys.length || skippedKeys.length) {
	            const results = {};
	            basesetKeys.forEach((k) => {
	              results[k] = 'valid';
	            });
	            skippedKeys.forEach((k) => {
	              results[k] = 'skipped';
	            });
	            const { resp: r3, data: d3 } = await postForm('/dashboard/video/source/sites/check', {
	              results: JSON.stringify(results),
	            });
	            if (r3.ok && d3 && d3.success && Array.isArray(d3.sites)) {
	              renderVideoSourceList(d3.sites);
	            } else {
	              renderVideoSourceList(d2.sites);
	            }
	          } else {
	            renderVideoSourceList(d2.sites);
	          }
	        } catch (_e) {
	          renderVideoSourceList(d2.sites);
	        }
          setVideoSourceSaveStatus('', '');
          const count = Array.isArray(d2.sites) ? d2.sites.length : sitesPayload.length;
          setImportSummary(`已导入 ${count} 个站点`);
          notify.success(`导入成功（${count} 个站点）`);
	        return;
	      }
      const msg = (d2 && d2.message) || '导入失败';
      setVideoSourceSaveStatus('', '');
      notify.error(msg);
    } catch (_e) {
      setVideoSourceSaveStatus('', '');
      notify.error('导入失败');
    }
  };

  bindOnce(videoSourceImportFromcatpawrunnerBtn, () => {
    videoSourceImportFromcatpawrunnerBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await withDatasetLock(videoSourceImportFromcatpawrunnerBtn, 'pending', async () => {
        setButtonLoading(videoSourceImportFromcatpawrunnerBtn, true, { loadingText: '导入中' });
        try {
          await importVideoSourceSitesFromcatpawrunner();
        } finally {
          setButtonLoading(videoSourceImportFromcatpawrunnerBtn, false);
        }
      });
    });
  });

  const addUserBtn = document.getElementById('openAddUser');
  const addUserForm = document.getElementById('addUserForm');
  const addUserStatus = document.getElementById('addUserStatus');
  const addUserName = document.getElementById('addUserName');
  const addUserPassword = document.getElementById('addUserPassword');
  const confirmAddUser = document.getElementById('confirmAddUser');
  const userCountEl = document.getElementById('userCount');
  const userTableBody = document.getElementById('userTableBody');

  const clearEl = (el) => {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  const tagSpan = (className, text) => createEl('span', { className, text });

  const renderTag = (cell, className, text) => {
    if (!cell) return;
    clearEl(cell);
    cell.appendChild(tagSpan(className, text));
  };

  const roleLabel = (role) => {
    if (role === 'admin') return { className: 'tag-yellow', text: '管理员' };
    return { className: 'tag-gray', text: '用户' };
  };

  const renderRole = (cell, role) => {
    const { className, text } = roleLabel(role);
    renderTag(cell, className, text);
  };

  const renderConfigured = (cell, value, { whenSet, whenEmpty }) => {
    const has = typeof value === 'string' ? value.trim().length > 0 : !!value;
    const cls = has ? whenSet.className : whenEmpty.className;
    const text = has ? whenSet.text : whenEmpty.text;
    renderTag(cell, cls, text);
  };

  const refreshUserRowCells = (row) => {
    if (!row) return;
    const username = row.getAttribute('data-username') || '';
    const role = row.getAttribute('data-role') || 'user';
    const status = row.getAttribute('data-status') || 'active';

    const nameCell = row.querySelector('td[data-col="username"]') || row.querySelector('td');
    if (nameCell) nameCell.textContent = username;

    renderRole(row.querySelector('td[data-col="role"]'), role);
    renderStatus(row.querySelector('td[data-col="status"]'), status);
  };

  const renderStatus = (cell, status) => {
    if (!cell) return;
    if (status === 'active') {
      renderTag(cell, 'tag-green', '正常');
    } else if (status === 'banned') {
      renderTag(cell, 'tag-red', '封禁');
    } else {
      renderTag(cell, 'tag-gray', status || '');
    }
  };

  const appendUserRow = (user) => {
    if (!userTableBody) return;
    const tr = document.createElement('tr');
    tr.setAttribute('data-username', user.username || '');
    tr.setAttribute('data-role', user.role || 'user');
    tr.setAttribute('data-status', user.status || 'active');

    const tdUser = document.createElement('td');
    tdUser.className = 'px-3 py-2 font-semibold whitespace-nowrap';
    tdUser.setAttribute('data-col', 'username');
    tdUser.textContent = user.username || '';

    const tdRole = document.createElement('td');
    tdRole.className = 'px-3 py-2 whitespace-nowrap';
    tdRole.setAttribute('data-col', 'role');
    renderRole(tdRole, user.role || 'user');

    const tdStatus = document.createElement('td');
    tdStatus.className = 'px-3 py-2 whitespace-nowrap';
    tdStatus.setAttribute('data-col', 'status');
    renderStatus(tdStatus, user.status || 'active');

    const tdActions = document.createElement('td');
    tdActions.className = 'px-3 py-2 whitespace-nowrap';
    const actionGroup = document.createElement('div');
    actionGroup.className = 'action-group';
    const makeBtn = (cls, action, text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `action-btn ${cls}`;
      b.setAttribute('data-action', action);
      b.textContent = text;
      return b;
    };
    actionGroup.appendChild(makeBtn('blue', 'edit', '修改'));
    if (user.role !== 'admin') {
      const banText = user.status === 'active' ? '封禁' : '解封';
      actionGroup.appendChild(makeBtn('rose', 'ban', banText));
      actionGroup.appendChild(makeBtn('red', 'delete', '删除'));
    }
    tdActions.appendChild(actionGroup);

    tr.appendChild(tdUser);
    tr.appendChild(tdRole);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);
    userTableBody.appendChild(tr);
  };

  const loadUserPanel = async () => {
    if (panelLoaded.user || panelLoading.user) return;
    if (!userTableBody) return;
    panelLoading.user = true;
    try {
      const data = await getSuccessJson('/dashboard/user/list');
      if (!(data && Array.isArray(data.users))) return;

      userTableBody.innerHTML = '';
      data.users.forEach((u) => appendUserRow(u || {}));
      if (userCountEl) {
        const count =
          typeof data.userCount === 'number'
            ? data.userCount
            : Array.isArray(data.users)
              ? data.users.length
              : 0;
        userCountEl.textContent = String(count);
      }
      panelLoaded.user = true;
    } finally {
      panelLoading.user = false;
    }
  };

  const fetchSiteSettings = async () => getSuccessJson('/dashboard/site/settings');
  const fetchMetadataSettings = async () => getSuccessJson('/dashboard/metadata/settings');

  let metadataSettingsCache = null;
  let metadataSettingsCachePromise = null;
  const getMetadataSettingsCached = async ({ force = false } = {}) => {
    if (!force) {
      if (metadataSettingsCache && typeof metadataSettingsCache === 'object') return metadataSettingsCache;
      if (metadataSettingsCachePromise) return metadataSettingsCachePromise;
    }

    metadataSettingsCachePromise = (async () => {
      const data = await fetchMetadataSettings();
      metadataSettingsCache = data && typeof data === 'object' ? data : null;
      metadataSettingsCachePromise = null;
      return metadataSettingsCache;
    })();

    try {
      return await metadataSettingsCachePromise;
    } catch (e) {
      metadataSettingsCachePromise = null;
      throw e;
    }
  };

  const setInputValueByName = (name, value) => {
    const el = document.querySelector(`input[name="${name}"]`);
    if (!el) return;
    el.value = value != null ? String(value) : '';
  };

  const syncCustomSelectValue = (selectId, value, { dispatch = true } = {}) => {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.value = value != null ? String(value) : '';

    const wrapper = sel.parentNode;
    if (wrapper && wrapper.classList && wrapper.classList.contains('custom-dropdown')) {
      const btn = wrapper.querySelector('.custom-dropdown-btn');
      const list = wrapper.querySelector('.custom-dropdown-list');
      const opt = sel.options[sel.selectedIndex];
      if (btn) btn.textContent = (opt && opt.text) || '请选择';
      if (list) {
        list.querySelectorAll('.custom-dropdown-item').forEach((n) => {
          const v = n && n.dataset ? n.dataset.value : '';
          n.classList.toggle('active', v === sel.value);
        });
      }
    }

    if (dispatch) sel.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const setSearchDisplayModeError = bindInlineStatus(searchDisplayModeError);
  const validateSearchDisplayModeToken = async ({ toast = false } = {}) => {
    if (!searchDisplayModeSelect) return true;
    const mode = (searchDisplayModeSelect.value || '').trim();
    const needsTMDB = mode === 'tmdb' || mode === 'both';
    if (!needsTMDB) return true;

    let s = null;
    try {
      s = await getMetadataSettingsCached();
    } catch (_e) {
      s = null;
    }
    const token = s && typeof s.tmdbApiToken === 'string' ? s.tmdbApiToken.trim() : '';
    if (token) {
      setSearchDisplayModeError('', '');
      return true;
    }
    setSearchDisplayModeError('', '');
    syncCustomSelectValue('searchDisplayModeSelect', 'sites', { dispatch: false });
    if (toast) notify.error('TMDB API TOKEN 未设置');
    return false;
  };

  const syncNetdiskProxyForm = () => {
    const enabled = !!(netdiskProxyEnabledInput && netdiskProxyEnabledInput.checked);
    if (netdiskProxyUrlInput) {
      netdiskProxyUrlInput.readOnly = !enabled;
      netdiskProxyUrlInput.classList.toggle('opacity-60', !enabled);
    }
  };
  if (netdiskProxyEnabledInput) {
    netdiskProxyEnabledInput.addEventListener('change', syncNetdiskProxyForm);
  }

  const loadSitePanel = async () => {
    if (panelLoaded.site || panelLoading.site) return;
    panelLoading.site = true;
    try {
      const settings = await fetchSiteSettings();
      if (!settings) return;

      setInputValueByName('siteName', settings.siteName || '');
      syncCustomSelectValue('searchDisplayModeSelect', settings.searchDisplayMode || 'sites');
      if (netdiskProxyEnabledInput) netdiskProxyEnabledInput.checked = !!settings.netdiskProxyEnabled;
      if (netdiskProxyUrlInput) netdiskProxyUrlInput.value = settings.netdiskProxyUrl || '';
      syncNetdiskProxyForm();

      await validateSearchDisplayModeToken({ toast: false });

      panelLoaded.site = true;
    } finally {
      panelLoading.site = false;
    }
  };

  let magicEpisodeRules = [];
  let magicEpisodeCleanRegexRules = [];
  let episodeDefaultsConfirming = false;
  let magicMovieRules = [];
  let movieDefaultsConfirming = false;
  let magicAggregateRegexRules = [];
  let aggregateDefaultsConfirming = false;
  let magicSaving = false;

  let smartSourceExtractPriority = '无';
  let smartSourcePriorityTokens = [];
  let smartPanMatchTokens = [];
  let smartPanAliasMappings = [];
  let smartSiteCleanKeywords = '';
  let smartPanDefaultsConfirming = false;
  let smartSiteCleanDefaultsConfirming = false;
  let smartSaving = false;

  const parseDelimitedTokens = (
    input,
    { split = /,/, allow = null, keyOf = (v) => v, defaultList = [] } = {}
  ) => {
    const raw = typeof input === 'string' ? input : String(input || '');
    const text = raw.replaceAll('，', ',');
    const parts = text
      .split(split)
      .map((x) => String(x || '').trim())
      .filter(Boolean);
    const allowSet = allow instanceof Set ? allow : null;
    const seen = new Set();
    const out = [];
    parts.forEach((p) => {
      if (allowSet && !allowSet.has(p)) return;
      const key = String(keyOf(p) || '');
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push(p);
    });
    if (!out.length) return Array.isArray(defaultList) ? defaultList.slice() : [];
    return out;
  };

  const normalizeSmartSourceExtractPriorityMode = (raw) => {
    const s = typeof raw === 'string' ? raw.trim() : String(raw || '').trim();
    if (s === '无' || s === '网盘' || s === '关键字') return s;
    return '无';
  };

  const normalizeCommaTokenLine = (text) =>
    parseDelimitedTokens(text, {
      split: /,/,
      keyOf: (v) => String(v || '').toLowerCase(),
      defaultList: [],
    });

  // Sequence labels are display-only. Strip common "1. " / "2) " prefixes
  // before persisting user-edited values to avoid polluting saved config/cache.
  const stripDisplaySequencePrefix = (text) => {
    const raw = typeof text === 'string' ? text : String(text || '');
    return raw.replace(/^\s*\d+\s*[.．、)）]\s+/u, '').trim();
  };

  const normalizeSmartPanAliasMappings = (list) => {
    const arr = Array.isArray(list) ? list : [];
    const out = [];
    const seen = new Set();
    arr.forEach((it) => {
      const pan = stripDisplaySequencePrefix(it && it.pan != null ? String(it.pan) : '');
      if (!pan) return;
      const aliases = normalizeCommaTokenLine(it && it.aliases != null ? String(it.aliases) : '').join(',');
      const key = pan.toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ pan, aliases });
    });
    return out;
  };

  const syncSmartDraftFromInputs = () => {
    smartSourceExtractPriority = normalizeSmartSourceExtractPriorityMode(
      smartSourceExtractPrioritySelect ? smartSourceExtractPrioritySelect.value : smartSourceExtractPriority
    );
    smartSourcePriorityTokens = normalizeCommaTokenLine(smartSourcePriorityTokensInput ? smartSourcePriorityTokensInput.value : '');
    smartPanMatchTokens = normalizeCommaTokenLine(smartPanMatchTokensInput ? smartPanMatchTokensInput.value : '');
    smartSiteCleanKeywords = normalizeCommaTokenLine(smartSiteCleanKeywordsInput ? smartSiteCleanKeywordsInput.value : '').join(',');
  };

  const renderSmartPanAliasMapList = () => {
    if (!smartPanAliasMapList) return;
    smartPanAliasMapList.innerHTML = '';
    const list = Array.isArray(smartPanAliasMappings) ? smartPanAliasMappings : [];
    if (!list.length) {
      appendEmptyItem(smartPanAliasMapList);
      return;
    }
    list.forEach((it, idx) => {
      const li = createEl('li', { className: 'flex items-center gap-3' });
      const row = createEl('div', { className: 'tv-row tv-row-fit min-w-0' });
      const seq = createEl('span', { className: CLS.mutedMonoXs, text: `${idx + 1}.` });
      const inputs = createEl('div', { className: 'flex items-center gap-2 min-w-0' });
      setStyles(inputs, { width: 'min(900px, 70vw)', maxWidth: '100%', minWidth: '240px' });

      const panInput = createEl('input', { className: 'tv-field min-w-0' });
      setStyles(panInput, { flex: '1 1 0', minWidth: '0' });
      panInput.value = it && it.pan ? String(it.pan) : '';
      panInput.disabled = smartSaving;
      panInput.setAttribute('data-smart-pan-alias-idx', String(idx));
      panInput.setAttribute('data-smart-pan-alias-field', 'pan');

      const aliasesInput = createEl('input', { className: 'tv-field min-w-0' });
      setStyles(aliasesInput, { flex: '2 1 0', minWidth: '0' });
      aliasesInput.value = it && it.aliases ? String(it.aliases) : '';
      aliasesInput.disabled = smartSaving;
      aliasesInput.setAttribute('data-smart-pan-alias-idx', String(idx));
      aliasesInput.setAttribute('data-smart-pan-alias-field', 'aliases');

      const saveBtn = createEl('button', { className: 'action-btn green', text: '保存' });
      saveBtn.type = 'button';
      saveBtn.disabled = smartSaving;
      saveBtn.setAttribute('data-smart-pan-alias-save', String(idx));

      const delBtn = createEl('button', { className: 'action-btn red', text: '删除' });
      delBtn.type = 'button';
      delBtn.disabled = smartSaving;
      delBtn.setAttribute('data-smart-pan-alias-del', String(idx));

      inputs.appendChild(panInput);
      inputs.appendChild(aliasesInput);
      row.appendChild(seq);
      row.appendChild(inputs);
      row.appendChild(saveBtn);
      row.appendChild(delBtn);
      li.appendChild(row);
      smartPanAliasMapList.appendChild(li);
    });
  };

  const renderSmartPanSettings = () => {
    if (smartSourcePriorityTokensInput) {
      smartSourcePriorityTokensInput.value = Array.isArray(smartSourcePriorityTokens) ? smartSourcePriorityTokens.join(',') : '';
      smartSourcePriorityTokensInput.disabled = smartSaving;
    }
    if (smartPanMatchTokensInput) {
      smartPanMatchTokensInput.value = Array.isArray(smartPanMatchTokens) ? smartPanMatchTokens.join(',') : '';
      smartPanMatchTokensInput.disabled = smartSaving;
    }
    if (smartPanAliasMapPanInput) smartPanAliasMapPanInput.disabled = smartSaving;
    if (smartPanAliasMapAliasesInput) smartPanAliasMapAliasesInput.disabled = smartSaving;
    if (smartPanAliasMapAdd) smartPanAliasMapAdd.disabled = smartSaving;
    renderSmartPanAliasMapList();
    if (smartSiteCleanKeywordsInput) {
      smartSiteCleanKeywordsInput.value = smartSiteCleanKeywords || '';
      smartSiteCleanKeywordsInput.disabled = smartSaving;
    }
    if (smartSourceExtractPrioritySelect) {
      syncCustomSelectValue('smartSourceExtractPriority', normalizeSmartSourceExtractPriorityMode(smartSourceExtractPriority), { dispatch: false });
      smartSourceExtractPrioritySelect.disabled = smartSaving;
    }
    if (smartPanSettingsSave) smartPanSettingsSave.disabled = smartSaving;
    if (smartPanDefaultsRestore) smartPanDefaultsRestore.disabled = smartSaving;
    if (smartPanDefaultsRestoreConfirm) smartPanDefaultsRestoreConfirm.disabled = smartSaving;
    if (smartPanDefaultsRestoreCancel) smartPanDefaultsRestoreCancel.disabled = smartSaving;
    if (smartPanDefaultsRestore) smartPanDefaultsRestore.classList.toggle('hidden', smartPanDefaultsConfirming);
    if (smartPanDefaultsRestoreConfirm) smartPanDefaultsRestoreConfirm.classList.toggle('hidden', !smartPanDefaultsConfirming);
    if (smartPanDefaultsRestoreCancel) smartPanDefaultsRestoreCancel.classList.toggle('hidden', !smartPanDefaultsConfirming);
    if (smartSiteCleanDefaultsRestore) smartSiteCleanDefaultsRestore.disabled = smartSaving;
    if (smartSiteCleanDefaultsRestoreConfirm) smartSiteCleanDefaultsRestoreConfirm.disabled = smartSaving;
    if (smartSiteCleanDefaultsRestoreCancel) smartSiteCleanDefaultsRestoreCancel.disabled = smartSaving;
    if (smartSiteCleanDefaultsRestore) smartSiteCleanDefaultsRestore.classList.toggle('hidden', smartSiteCleanDefaultsConfirming);
    if (smartSiteCleanDefaultsRestoreConfirm) smartSiteCleanDefaultsRestoreConfirm.classList.toggle('hidden', !smartSiteCleanDefaultsConfirming);
    if (smartSiteCleanDefaultsRestoreCancel) smartSiteCleanDefaultsRestoreCancel.classList.toggle('hidden', !smartSiteCleanDefaultsConfirming);
  };

  // Normalize common escapes from pasted regex strings (e.g. `\\d` -> `\d`).
  const normalizeRegexText = (text) => {
    const raw = typeof text === 'string' ? text : '';
    if (!raw) return '';
    return raw.replace(/\\\\(?=[dDsSwWbB.()[\]{}+*?^$|\\\-_/])/g, '\\');
  };

  const decodeEpisodeRule = (rule) => {
    const raw = stripDisplaySequencePrefix(typeof rule === 'string' ? rule : '');
    if (!raw) return null;
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === 'object' && typeof obj.pattern === 'string' && obj.pattern.trim()) {
          return {
            pattern: normalizeRegexText(String(obj.pattern || '').trim()),
            replace: typeof obj.replace === 'string' ? obj.replace : '',
            flags: typeof obj.flags === 'string' ? obj.flags : '',
          };
        }
      } catch (_e) {}
    }
    if (raw.startsWith('/') && raw.lastIndexOf('/') > 0) {
      const last = raw.lastIndexOf('/');
      const pattern = raw.slice(1, last);
      const flags = raw.slice(last + 1);
      if (pattern.trim()) return { pattern: normalizeRegexText(pattern.trim()), replace: '', flags: flags || '' };
    }
    return { pattern: normalizeRegexText(raw), replace: '', flags: '' };
  };

  const encodeEpisodeRule = (rule) => {
    const patternRaw = rule && typeof rule.pattern === 'string' ? rule.pattern.trim() : '';
    const pattern = normalizeRegexText(patternRaw);
    if (!pattern) return '';
    const replace = rule && typeof rule.replace === 'string' ? rule.replace : '';
    const flags = rule && typeof rule.flags === 'string' ? rule.flags.trim() : '';
    const obj = { pattern, replace: replace || '' };
    if (flags) obj.flags = flags;
    try {
      return JSON.stringify(obj);
    } catch (_e) {
      return '';
    }
  };

  const normalizePatternInput = (text) => {
    const raw = typeof text === 'string' ? text.trim() : '';
    if (!raw) return null;
    if (raw.startsWith('/') && raw.lastIndexOf('/') > 0) {
      const last = raw.lastIndexOf('/');
      const pattern = normalizeRegexText(raw.slice(1, last).trim());
      const flags = raw.slice(last + 1).trim();
      if (!pattern) return null;
      return { pattern, flags };
    }
    return { pattern: normalizeRegexText(raw) };
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

  const normalizeAggregateRegexRuleInput = (text) => {
    const p = normalizePatternInput(stripDisplaySequencePrefix(text));
    if (!p || !p.pattern) return '';
    const flags = typeof p.flags === 'string' ? p.flags.trim() : '';
    if (flags) return `/${p.pattern}/${flags}`;
    return p.pattern;
  };

  const setMagicStatus = (el, type, text) => setInlineStatus(el, type, text);

  const setMagicTestOutput = bindInlineStatus(magicEpisodeRuleTestOutput);
  const setMagicMovieTestOutput = bindInlineStatus(magicMovieRuleTestOutput);
  const setMagicAggregateTestOutput = bindInlineStatus(magicAggregateRuleTestOutput);

  const normalizeReplaceTemplate = (replaceRaw) => {
    const r = typeof replaceRaw === 'string' ? replaceRaw : '';
    return r ? r.replace(/\\(\d+)/g, '$$$1') : '';
  };

	  const runMagicEpisodeRuleTest = () => {
	    if (!magicEpisodeRuleTestInput) return;
	    const filename = (magicEpisodeRuleTestInput.value || '').trim();
	    if (!filename) {
	      setMagicTestOutput('', '请输入文件名');
      return;
    }
    const list = Array.isArray(magicEpisodeRules) ? magicEpisodeRules : [];
    if (!list.length) {
      setMagicTestOutput('error', '无匹配规则');
      return;
	    }
	
	    let cleaned = filename;
	    const cleanRules = Array.isArray(magicEpisodeCleanRegexRules) ? magicEpisodeCleanRegexRules : [];
	    cleanRules.forEach((r) => {
	      const raw = typeof r === 'string' ? r.trim() : '';
	      if (!raw) return;
	      const re = buildRegexFromInput(raw, { defaultFlags: 'ig', forceGlobal: true });
	      if (!re) return;
	      cleaned = cleaned.replace(re, '');
	    });
	    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    const failures = [];
    for (let i = 0; i < list.length; i += 1) {
      const rule = list[i] && typeof list[i] === 'object' ? list[i] : null;
      const pattern = rule && typeof rule.pattern === 'string' ? rule.pattern.trim() : '';
      if (!pattern) continue;
      const flags = rule && typeof rule.flags === 'string' && rule.flags.trim() ? rule.flags.trim() : 'i';
      let re = null;
      try {
        re = new RegExp(pattern, flags);
      } catch (e) {
        failures.push(`#${i + 1} 正则无效`);
        continue;
      }
      if (!re.test(cleaned)) continue;
      const replace = normalizeReplaceTemplate(rule && typeof rule.replace === 'string' ? rule.replace : '');
      if (!replace) {
        setMagicTestOutput('success', `命中第 ${i + 1} 条：未设置 replace（无改写）`);
        return;
      }
      let out = '';
      try {
        out = cleaned.replace(re, replace);
      } catch (_e) {
        out = '';
      }
      if (!out) {
        setMagicTestOutput('error', `命中第 ${i + 1} 条，但改写失败`);
        return;
      }
      setMagicTestOutput('success', `命中第 ${i + 1} 条：${out}`);
      return;
    }

    if (failures.length) {
      setMagicTestOutput('error', `未命中（${failures.join('，')}）`);
      return;
    }
    setMagicTestOutput('error', '未命中');
  };

  const runMagicMovieRuleTest = () => {
    if (!magicMovieRuleTestInput) return;
    const filename = (magicMovieRuleTestInput.value || '').trim();
    if (!filename) {
      setMagicMovieTestOutput('', '请输入文件名');
      return;
    }

    const list = Array.isArray(magicMovieRules) ? magicMovieRules : [];
    if (!list.length) {
      setMagicMovieTestOutput('error', '无匹配规则');
      return;
    }

    const failures = [];
    for (let i = 0; i < list.length; i += 1) {
      const rule = list[i] && typeof list[i] === 'object' ? list[i] : null;
      const pattern = rule && typeof rule.pattern === 'string' ? rule.pattern.trim() : '';
      if (!pattern) continue;
      const flags = rule && typeof rule.flags === 'string' && rule.flags.trim() ? rule.flags.trim() : 'i';
      let re = null;
      try {
        re = new RegExp(pattern, flags);
      } catch (_e) {
        failures.push(`#${i + 1} 正则无效`);
        continue;
      }
      if (!re.test(filename)) continue;

      const replace = normalizeReplaceTemplate(rule && typeof rule.replace === 'string' ? rule.replace : '');
      if (!replace) {
        setMagicMovieTestOutput('success', `命中第 ${i + 1} 条：未设置 replace（无改写）`);
        return;
      }
      let out = '';
      try {
        out = filename.replace(re, replace);
      } catch (_e) {
        out = '';
      }
      if (!out) {
        setMagicMovieTestOutput('error', `命中第 ${i + 1} 条，但改写失败`);
        return;
      }
      setMagicMovieTestOutput('success', `命中第 ${i + 1} 条：${out}`);
      return;
    }

    if (failures.length) {
      setMagicMovieTestOutput('error', `未命中（${failures.join('，')}）`);
      return;
    }
    setMagicMovieTestOutput('error', '未命中');
  };

  const runMagicAggregateRuleTest = () => {
    if (!magicAggregateRuleTestInput) return;
    const query = (magicAggregateRuleTestQueryInput && magicAggregateRuleTestQueryInput.value ? magicAggregateRuleTestQueryInput.value : '').trim();
    const raw = (magicAggregateRuleTestInput.value || '').trim();
    if (!raw) {
      setMagicAggregateTestOutput('', '请输入文本');
      return;
    }

    const regexRules = Array.isArray(magicAggregateRegexRules) ? magicAggregateRegexRules : [];

    const qTrailingDigitsMatch = query.match(/(\d+)\s*$/);
    const qTrailingDigits = qTrailingDigitsMatch ? String(qTrailingDigitsMatch[1] || '') : '';

    const sanitizeDisplayTitle = (s) =>
      String(s || '')
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    let out = sanitizeDisplayTitle(raw);

    const buildEmojiCleaner = () => {
      try {
        // eslint-disable-next-line no-new
        new RegExp('\\p{Extended_Pictographic}', 'u');
        return (s) =>
          String(s || '')
            // Do NOT include `\\p{Emoji}` here: it also matches ASCII digits (keycap emoji),
            // which would break test cases like "仙逆4K".
            .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, '')
            .replace(/[\uFE0E\uFE0F]/g, '');
      } catch (_e) {
        return (s) =>
          String(s || '')
            .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
            .replace(/[\u2600-\u27BF]/g, '')
            .replace(/[\uFE0E\uFE0F]/g, '');
      }
    };
    const stripEmojiSymbols = buildEmojiCleaner();
    out = stripEmojiSymbols(out);

    const failures = [];
    regexRules.forEach((rule, idx) => {
      const s = typeof rule === 'string' ? rule.trim() : '';
      if (!s) return;
      try {
        const re = buildRegexFromInput(s, { defaultFlags: 'ig', forceGlobal: true });
        if (!re) throw new Error('invalid');

        if (qTrailingDigits) {
          // Keep behavior aligned with search aggregation:
          // if the keyword ends with digits, skip rules that only strip trailing digits.
          try {
            const t1 = `x${qTrailingDigits}`;
            const t2 = `x${qTrailingDigits}y`;
            const r1 = t1.replace(re, '');
            const r2 = t2.replace(re, '');
            const isTrailingDigitsRule = r1 === 'x' && r2 === t2;
            if (isTrailingDigitsRule) return;
          } catch (_e) {}
        }

        out = out.replace(re, '');
      } catch (_e) {
        failures.push(`#${idx + 1} 正则无效`);
      }
    });

    if (failures.length) {
      setMagicAggregateTestOutput('error', `清洗失败（${failures.join('，')}）`);
      return;
    }

    // Keep the test output aligned with actual search aggregation behavior:
    // - apply user clean rules
    // - apply default emoji cleaning
    // - normalize whitespace + punctuation separators (not brackets)
    const normalizeAggregateDisplay = (s) =>
      String(s || '')
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        .replace(/[\s.\-_,，:：;；!！?？·•/\\|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const normalizeAggregateKey = (s) =>
      String(s || '')
        .toLowerCase()
        .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
        .replace(/[\s.\-_,，:：;；!！?？·•/\\|]+/g, '')
        .trim();

    const display = normalizeAggregateDisplay(out);
    const key = normalizeAggregateKey(out);
    const suffix = key ? `（聚合Key：${key}）` : '';
    const hint = qTrailingDigits ? `（搜索尾号保护：${qTrailingDigits}）` : '';
    const noneHint = !regexRules.length ? '（仅默认清洗）' : '';
    setMagicAggregateTestOutput('success', `净化后：${display}${suffix}${hint}${noneHint}`);
  };

  const fetchMagicSettings = async () => getSuccessJson('/dashboard/magic/settings');

	  const saveMagicSettings = async (episodeCleanRegexRules, episodeRules, movieRules, aggregateRegexRules, smartSettings = {}) => {
	    const cleanRules = Array.isArray(episodeCleanRegexRules) ? episodeCleanRegexRules : [];
	    const { resp, data } = await postJsonSafe('/dashboard/magic/settings', {
	      episodeCleanRegex: cleanRules[0] || '',
	      episodeCleanRegexRules: cleanRules,
	      episodeRules,
        movieRules,
	      aggregateRegexRules,
        smartSourcePriorityTokens: Array.isArray(smartSettings.smartSourcePriorityTokens) ? smartSettings.smartSourcePriorityTokens : [],
        smartPanMatchTokens: Array.isArray(smartSettings.smartPanMatchTokens) ? smartSettings.smartPanMatchTokens : [],
        smartSourceExtractPriority: typeof smartSettings.smartSourceExtractPriority === 'string' ? smartSettings.smartSourceExtractPriority : '',
	    });
	    if (!resp.ok || !data || data.success !== true) {
	      throw new Error((data && data.message) || `HTTP ${resp.status}`);
    }
    return data;
  };

		  const renderMagicRuleList = (listEl, rules, kind) => {
		    if (!listEl) return;
		    listEl.innerHTML = '';
		    const list = Array.isArray(rules) ? rules : [];
		    if (!list.length) {
		      appendEmptyItem(listEl);
		      return;
		    }

		    list.forEach((rule, idx) => {
		      const li = createEl('li', { className: 'flex items-center gap-3' });
          const row = createEl('div', { className: 'tv-row tv-row-fit min-w-0' });
		      const seq = createEl('span', { className: CLS.mutedMonoXs, text: `${idx + 1}.` });

		      if (kind === 'episode' || kind === 'movie') {
		        const r = rule && typeof rule === 'object' ? rule : { pattern: '', replace: '', flags: '' };

		        const inputs = createEl('div', { className: 'flex items-center gap-2 min-w-0' });
		        setStyles(inputs, { width: 'min(900px, 70vw)', maxWidth: '100%', minWidth: '240px' });

		        const patternInput = createEl('input', { className: 'tv-field min-w-0' });
		        setStyles(patternInput, { flex: '5 1 0', minWidth: '0' });
		        patternInput.value = typeof r.pattern === 'string' ? r.pattern : '';
	        patternInput.disabled = magicSaving;
	        patternInput.setAttribute('data-magic-kind', kind);
	        patternInput.setAttribute('data-magic-idx', String(idx));
	        patternInput.setAttribute('data-magic-field', 'pattern');

	        const replaceInput = createEl('input', { className: 'tv-field min-w-0' });
	        setStyles(replaceInput, { flex: '1 1 0', minWidth: '0' });
	        replaceInput.value = typeof r.replace === 'string' ? r.replace : '';
	        replaceInput.placeholder = 'replace（可空）';
	        replaceInput.disabled = magicSaving;
	        replaceInput.setAttribute('data-magic-kind', kind);
	        replaceInput.setAttribute('data-magic-idx', String(idx));
	        replaceInput.setAttribute('data-magic-field', 'replace');

	        inputs.appendChild(patternInput);
	        inputs.appendChild(replaceInput);
	        row.appendChild(seq);
		        row.appendChild(inputs);
		      } else {
		        const inputs = createEl('div', { className: 'min-w-0' });
		        setStyles(inputs, { width: 'min(900px, 70vw)', maxWidth: '100%', minWidth: '240px' });

		        const input = createEl('input', { className: 'tv-field min-w-0' });
		        input.value = typeof rule === 'string' ? rule : '';
		        input.disabled = magicSaving;
	        input.setAttribute('data-magic-kind', kind);
	        input.setAttribute('data-magic-idx', String(idx));
	        inputs.appendChild(input);

	        row.appendChild(seq);
	        row.appendChild(inputs);
	      }

	      if (kind === 'episode' || kind === 'movie') {
	        const save = createEl('button', { className: 'action-btn green', text: '保存' });
	        save.type = 'button';
	        save.disabled = magicSaving;
	        save.setAttribute('data-magic-save', kind);
	        save.setAttribute('data-magic-idx', String(idx));
	        row.appendChild(save);
	      }
	      if (kind === 'episodeCleanRegex' || kind === 'aggregateRegex') {
	        const save = createEl('button', { className: 'action-btn green', text: '保存' });
	        save.type = 'button';
	        save.disabled = magicSaving;
	        save.setAttribute('data-magic-save', kind);
	        save.setAttribute('data-magic-idx', String(idx));
	        row.appendChild(save);
	      }

	      const del = createEl('button', { className: 'action-btn red', text: '删除' });
	      del.type = 'button';
	      del.disabled = magicSaving;
	      del.setAttribute('data-magic-del', kind);
	      del.setAttribute('data-magic-idx', String(idx));
	      row.appendChild(del);

        // Rule preview (processed text) for easier maintenance.
        if (kind === 'aggregateRegex' || kind === 'episodeCleanRegex') {
          const preview = createEl('div', { className: 'tv-magic-preview truncate' });
          preview.setAttribute('data-magic-preview-kind', kind);
          preview.setAttribute('data-magic-preview-idx', String(idx));
          setStyles(preview, { width: '260px', maxWidth: '260px', minWidth: '180px' });
          li.appendChild(row);
          li.appendChild(preview);
          listEl.appendChild(li);
          return;
        }
        li.appendChild(row);
	      listEl.appendChild(li);
	    });
	  };

	  const renderMagicPanels = () => {
	    renderMagicRuleList(magicEpisodeCleanRegexRuleList, magicEpisodeCleanRegexRules, 'episodeCleanRegex');
	    renderMagicRuleList(magicEpisodeRuleList, magicEpisodeRules, 'episode');
	    renderMagicRuleList(magicMovieRuleList, magicMovieRules, 'movie');
	    renderMagicRuleList(magicAggregateRegexRuleList, magicAggregateRegexRules, 'aggregateRegex');
      if (magicEpisodeDefaultsRestore) magicEpisodeDefaultsRestore.disabled = magicSaving;
      if (magicEpisodeDefaultsRestoreConfirm) magicEpisodeDefaultsRestoreConfirm.disabled = magicSaving;
      if (magicEpisodeDefaultsRestoreCancel) magicEpisodeDefaultsRestoreCancel.disabled = magicSaving;
      if (magicEpisodeDefaultsRestore) magicEpisodeDefaultsRestore.classList.toggle('hidden', episodeDefaultsConfirming);
      if (magicEpisodeDefaultsRestoreConfirm) magicEpisodeDefaultsRestoreConfirm.classList.toggle('hidden', !episodeDefaultsConfirming);
      if (magicEpisodeDefaultsRestoreCancel) magicEpisodeDefaultsRestoreCancel.classList.toggle('hidden', !episodeDefaultsConfirming);
      if (magicMovieDefaultsRestore) magicMovieDefaultsRestore.disabled = magicSaving;
      if (magicMovieDefaultsRestoreConfirm) magicMovieDefaultsRestoreConfirm.disabled = magicSaving;
      if (magicMovieDefaultsRestoreCancel) magicMovieDefaultsRestoreCancel.disabled = magicSaving;
      if (magicMovieDefaultsRestore) magicMovieDefaultsRestore.classList.toggle('hidden', movieDefaultsConfirming);
      if (magicMovieDefaultsRestoreConfirm) magicMovieDefaultsRestoreConfirm.classList.toggle('hidden', !movieDefaultsConfirming);
      if (magicMovieDefaultsRestoreCancel) magicMovieDefaultsRestoreCancel.classList.toggle('hidden', !movieDefaultsConfirming);
      if (magicAggregateDefaultsRestore) magicAggregateDefaultsRestore.disabled = magicSaving;
      if (magicAggregateDefaultsRestoreConfirm) magicAggregateDefaultsRestoreConfirm.disabled = magicSaving;
      if (magicAggregateDefaultsRestoreCancel) magicAggregateDefaultsRestoreCancel.disabled = magicSaving;
      if (magicAggregateDefaultsRestore) magicAggregateDefaultsRestore.classList.toggle('hidden', aggregateDefaultsConfirming);
      if (magicAggregateDefaultsRestoreConfirm) magicAggregateDefaultsRestoreConfirm.classList.toggle('hidden', !aggregateDefaultsConfirming);
      if (magicAggregateDefaultsRestoreCancel) magicAggregateDefaultsRestoreCancel.classList.toggle('hidden', !aggregateDefaultsConfirming);
	    setMagicTestOutput('', '');
	    setMagicMovieTestOutput('', '');
	    setMagicAggregateTestOutput('', '');
      updateMagicRulePreviews();
	  };

    function updateMagicRulePreviews() {
      const sanitizeDisplayTitle = (s) =>
        String(s || '')
          .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      const buildEmojiCleaner = () => {
        try {
          // eslint-disable-next-line no-new
          new RegExp('\\p{Extended_Pictographic}', 'u');
          return (s) =>
            String(s || '')
              // Do NOT include `\\p{Emoji}` here: it also matches ASCII digits (keycap emoji),
              // which would break test cases like "仙逆4K".
              .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, '')
              .replace(/[\uFE0E\uFE0F]/g, '');
        } catch (_e) {
          return (s) =>
            String(s || '')
              .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
              .replace(/[\u2600-\u27BF]/g, '')
              .replace(/[\uFE0E\uFE0F]/g, '');
        }
      };
      const stripEmojiSymbols = buildEmojiCleaner();

      const normalizeAggregateDisplay = (s) =>
        String(s || '')
          .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
          .replace(/[\s.\-_,，:：;；!！?？·•/\\|]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

      const normalizeReplaceTemplate = (replaceRaw) => {
        const r = typeof replaceRaw === 'string' ? replaceRaw : '';
        return r ? r.replace(/\\(\d+)/g, '$$$1') : '';
      };

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

      const computeAggregateRegexPreviews = () => {
        const rules = Array.isArray(magicAggregateRegexRules) ? magicAggregateRegexRules : [];
        if (!rules.length) return [];
        const query = (magicAggregateRuleTestQueryInput && magicAggregateRuleTestQueryInput.value ? magicAggregateRuleTestQueryInput.value : '').trim();
        const raw = (magicAggregateRuleTestInput && magicAggregateRuleTestInput.value ? magicAggregateRuleTestInput.value : '').trim();
        const qTrailingDigitsMatch = query.match(/(\d+)\s*$/);
        const qTrailingDigits = qTrailingDigitsMatch ? String(qTrailingDigitsMatch[1] || '') : '';
        let out = stripEmojiSymbols(sanitizeDisplayTitle(raw));
        const previews = [];
        rules.forEach((rule, idx) => {
          const s = typeof rule === 'string' ? rule.trim() : '';
          if (!s) {
            previews[idx] = normalizeAggregateDisplay(out);
            return;
          }
          try {
            const re = buildRegexFromInput(s, { defaultFlags: 'ig', forceGlobal: true });
            if (!re) throw new Error('invalid');

            if (qTrailingDigits) {
              try {
                const t1 = `x${qTrailingDigits}`;
                const t2 = `x${qTrailingDigits}y`;
                const r1 = t1.replace(re, '');
                const r2 = t2.replace(re, '');
                const isTrailingDigitsRule = r1 === 'x' && r2 === t2;
                if (isTrailingDigitsRule) {
                  previews[idx] = `${normalizeAggregateDisplay(out)}（跳过尾号规则）`;
                  return;
                }
              } catch (_e) {}
            }
            out = out.replace(re, '');
            previews[idx] = normalizeAggregateDisplay(out);
          } catch (_e) {
            previews[idx] = '正则无效';
          }
        });
        return previews;
      };

      const computeEpisodeCleanRegexPreviews = () => {
        const rules = Array.isArray(magicEpisodeCleanRegexRules) ? magicEpisodeCleanRegexRules : [];
        if (!rules.length) return [];
        const raw = (magicEpisodeRuleTestInput && magicEpisodeRuleTestInput.value ? magicEpisodeRuleTestInput.value : '').trim();
        let out = String(raw || '');
        const previews = [];
        rules.forEach((rule, idx) => {
          const s = typeof rule === 'string' ? rule.trim() : '';
          if (!s) {
            previews[idx] = out.replace(/\s+/g, ' ').trim();
            return;
          }
          const re = buildRegexFromInput(s, { defaultFlags: 'ig', forceGlobal: true });
          if (!re) {
            previews[idx] = '正则无效';
            return;
          }
          try {
            out = out.replace(re, '');
          } catch (_e) {}
          previews[idx] = out.replace(/\s+/g, ' ').trim();
        });
        return previews;
      };

      const aggregatePreviews = computeAggregateRegexPreviews();
      const episodeCleanPreviews = computeEpisodeCleanRegexPreviews();

      document.querySelectorAll('[data-magic-preview-kind][data-magic-preview-idx]').forEach((el) => {
        const kind = (el.getAttribute('data-magic-preview-kind') || '').trim();
        const idx = Number(el.getAttribute('data-magic-preview-idx') || -1);
        if (!Number.isFinite(idx) || idx < 0) return;
        let text = '';
        if (kind === 'aggregateRegex') text = aggregatePreviews[idx] || '';
        else if (kind === 'episodeCleanRegex') text = episodeCleanPreviews[idx] || '';
        el.textContent = text;
        el.classList.toggle('hidden', !text);
      });
    }

	  const persistMagic = async ({ successMessage = '' } = {}) => {
	    if (magicSaving) return;
	    magicSaving = true;
	    setMagicStatus(magicEpisodeCleanRegexRuleStatus, '', '保存中...');
	    setMagicStatus(magicEpisodeRuleStatus, '', '保存中...');
	    setMagicStatus(magicMovieRuleStatus, '', '保存中...');
	    setMagicStatus(magicAggregateRegexRuleStatus, '', '保存中...');
	    try {
	      const episodeRulesForSave = (Array.isArray(magicEpisodeRules) ? magicEpisodeRules : [])
	        .map(encodeEpisodeRule)
	        .filter(Boolean);
        const movieRulesForSave = (Array.isArray(magicMovieRules) ? magicMovieRules : [])
          .map(encodeEpisodeRule)
          .filter(Boolean);
	      const data = await saveMagicSettings(
	        magicEpisodeCleanRegexRules,
	        episodeRulesForSave,
          movieRulesForSave,
	        Array.isArray(magicAggregateRegexRules) ? magicAggregateRegexRules : [],
          {}
	      );
	      magicEpisodeCleanRegexRules = Array.isArray(data.episodeCleanRegexRules)
	        ? data.episodeCleanRegexRules
	        : typeof data.episodeCleanRegex === 'string' && data.episodeCleanRegex.trim()
	          ? [data.episodeCleanRegex.trim()]
	          : magicEpisodeCleanRegexRules;
	      magicEpisodeRules = Array.isArray(data.episodeRules)
	        ? data.episodeRules.map(decodeEpisodeRule).filter(Boolean)
	        : magicEpisodeRules;
        magicMovieRules = Array.isArray(data.movieRules)
          ? data.movieRules.map(decodeEpisodeRule).filter(Boolean)
          : magicMovieRules;
	      magicAggregateRegexRules = Array.isArray(data.aggregateRegexRules)
	        ? data.aggregateRegexRules
	        : magicAggregateRegexRules;
	      renderMagicPanels();
	      setMagicStatus(magicEpisodeCleanRegexRuleStatus, '', '');
	      setMagicStatus(magicEpisodeRuleStatus, '', '');
	      setMagicStatus(magicMovieRuleStatus, '', '');
	      setMagicStatus(magicAggregateRegexRuleStatus, '', '');
	      notify.success(successMessage || '保存成功');
	    } catch (err) {
	      const msg = (err && err.message) || '保存失败';
	      setMagicStatus(magicEpisodeCleanRegexRuleStatus, 'error', msg);
	      setMagicStatus(magicEpisodeRuleStatus, 'error', msg);
	      setMagicStatus(magicMovieRuleStatus, 'error', msg);
	      setMagicStatus(magicAggregateRegexRuleStatus, 'error', msg);
	      notify.error(msg);
	    } finally {
	      magicSaving = false;
	      renderMagicPanels();
	    }
	  };

	  const saveMetadataSettings = async (payload) => {
	    const { resp, data } = await postJsonSafe('/dashboard/metadata/settings', payload);
	    if (!resp.ok || !data || data.success !== true) {
	      throw new Error((data && data.message) || `HTTP ${resp.status}`);
	    }
	    return data;
	  };

	  let metadataSaving = false;
	  const setMetadataStatus = bindInlineStatus(metadataSaveStatus);

	  const renderMetadataPanel = (data) => {
	    const s = data && typeof data === 'object' ? data : {};

      syncCustomSelectValue('doubanDataSelect', s.doubanDataProxy || 'server-proxy');
      syncCustomSelectValue('doubanImgSelect', s.doubanImgProxy || 'server-proxy');
      if (doubanDataCustomInput) doubanDataCustomInput.value = typeof s.doubanDataCustom === 'string' ? s.doubanDataCustom : '';
      if (doubanImgCustomInput) doubanImgCustomInput.value = typeof s.doubanImgCustom === 'string' ? s.doubanImgCustom : '';

	    if (tmdbApiTokenInput) tmdbApiTokenInput.value = typeof s.tmdbApiToken === 'string' ? s.tmdbApiToken : '';
      if (tmdbDataProxyBaseInput) tmdbDataProxyBaseInput.value = typeof s.tmdbDataProxyBase === 'string' ? s.tmdbDataProxyBase : '';
      if (tmdbImageProxyBaseInput) tmdbImageProxyBaseInput.value = typeof s.tmdbImageProxyBase === 'string' ? s.tmdbImageProxyBase : '';
	    if (tmdbLanguageInput) tmdbLanguageInput.value = typeof s.language === 'string' ? s.language : 'zh-CN';
	    if (tmdbRegionInput) tmdbRegionInput.value = typeof s.region === 'string' ? s.region : 'CN';
	    if (tmdbIncludeAdultInput) tmdbIncludeAdultInput.checked = !!s.includeAdult;
	  };

	  const loadMetadataPanel = async () => {
	    if (panelLoaded.metadata || panelLoading.metadata) return;
	    if (!metadataSettingsForm) return;
	    panelLoading.metadata = true;
	    setMetadataStatus('', '加载中...');
	    try {
	      const data = await getMetadataSettingsCached();
	      if (!data) {
	        setMetadataStatus('error', '加载失败');
	        return;
	      }
	      renderMetadataPanel(data);
	      setMetadataStatus('', '');
	      panelLoaded.metadata = true;
	    } finally {
	      panelLoading.metadata = false;
	    }
	  };

	  if (metadataSettingsForm) {
	    metadataSettingsForm.addEventListener('submit', async (e) => {
	      e.preventDefault();
	      if (metadataSaving) return;
	      metadataSaving = true;
	      const submitBtn = metadataSettingsForm.querySelector('button[type="submit"]');
	      setButtonLoading(submitBtn, true);
	      setMetadataStatus('', '');
	      try {
	        const payload = {
            doubanDataProxy: dataSelect ? (dataSelect.value || '').trim() : '',
            doubanDataCustom: doubanDataCustomInput ? (doubanDataCustomInput.value || '').trim() : '',
            doubanImgProxy: imgSelect ? (imgSelect.value || '').trim() : '',
            doubanImgCustom: doubanImgCustomInput ? (doubanImgCustomInput.value || '').trim() : '',
	          tmdbApiToken: tmdbApiTokenInput ? (tmdbApiTokenInput.value || '').trim() : '',
	          tmdbDataProxyBase: tmdbDataProxyBaseInput ? (tmdbDataProxyBaseInput.value || '').trim() : '',
	          tmdbImageProxyBase: tmdbImageProxyBaseInput ? (tmdbImageProxyBaseInput.value || '').trim() : '',
	          language: tmdbLanguageInput ? (tmdbLanguageInput.value || '').trim() : '',
	          region: tmdbRegionInput ? (tmdbRegionInput.value || '').trim() : '',
	          includeAdult: !!(tmdbIncludeAdultInput && tmdbIncludeAdultInput.checked),
	        };
	        const data = await saveMetadataSettings(payload);
	        metadataSettingsCache = data && typeof data === 'object' ? data : metadataSettingsCache;
	        renderMetadataPanel(data);
          void validateSearchDisplayModeToken({ toast: false });
	        setMetadataStatus('', '');
	        notify.success('保存成功');
	      } catch (err) {
	        const msg = (err && err.message) || '保存失败';
	        setMetadataStatus('', '');
	        notify.error(msg);
	      } finally {
	        metadataSaving = false;
	        setButtonLoading(submitBtn, false);
	      }
	    });
	  }

  const fetchSmartSettings = async () => getSuccessJson('/dashboard/smart/settings');

  const saveSmartSettings = async (payload) => {
    const { resp, data } = await postJsonSafe('/dashboard/smart/settings', payload);
    if (!resp.ok || !data || data.success !== true) {
      throw new Error((data && data.message) || `HTTP ${resp.status}`);
    }
    return data;
  };

  const fetchSmartMatchBlockKeywords = async () => getSuccessJson('/dashboard/smart/matchblock/keywords');
  const fetchSmartMatchBlockItems = async (keyword) =>
    getSuccessJson(`/dashboard/smart/matchblock/items?keyword=${encodeURIComponent(keyword || '')}`);

  const deleteSmartMatchBlockItem = async ({ keyword, siteKey, videoId }) => {
    const { resp, data } = await postJsonSafe('/dashboard/smart/matchblock/delete', { keyword, siteKey, videoId });
    if (!resp.ok || !data || data.success !== true) {
      throw new Error((data && data.message) || `HTTP ${resp.status}`);
    }
    return data;
  };

  const deleteSmartMatchBlockKeyword = async ({ keyword }) => {
    const { resp, data } = await postJsonSafe('/dashboard/smart/matchblock/keyword/delete', { keyword });
    if (!resp.ok || !data || data.success !== true) {
      throw new Error((data && data.message) || `HTTP ${resp.status}`);
    }
    return data;
  };

  const persistSmartPreferences = async ({ silent = false } = {}) => {
    if (smartSaving) return;
    smartSaving = true;
    try {
      syncSmartDraftFromInputs();

      const data = await saveSmartSettings({
        smartSourceExtractPriority,
        siteCleanKeywords: smartSiteCleanKeywords,
        smartSourcePriorityTokens,
        smartPanMatchTokens,
        smartPanAliasMappings,
      });

      smartSourceExtractPriority = normalizeSmartSourceExtractPriorityMode(data.smartSourceExtractPriority);
      smartSiteCleanKeywords = typeof data.siteCleanKeywords === 'string' ? data.siteCleanKeywords : smartSiteCleanKeywords;
      smartSourcePriorityTokens = Array.isArray(data.smartSourcePriorityTokens) ? data.smartSourcePriorityTokens : smartSourcePriorityTokens;
      smartPanMatchTokens = Array.isArray(data.smartPanMatchTokens) ? data.smartPanMatchTokens : smartPanMatchTokens;
      smartPanAliasMappings = normalizeSmartPanAliasMappings(Array.isArray(data.smartPanAliasMappings) ? data.smartPanAliasMappings : smartPanAliasMappings);

      renderSmartPanSettings();
    } catch (err) {
      const msg = (err && err.message) || '保存失败';
      throw new Error(msg);
    } finally {
      smartSaving = false;
      renderSmartPanSettings();
    }
  };

  let smartMatchBlockKeywordsCache = [];
  let smartMatchBlockSelectedKeyword = '';
  let smartMatchBlockItemsCache = [];
  let smartMatchBlockKeywordsLoading = false;
  let smartMatchBlockItemsLoading = false;

  try {
    window.addEventListener('tv:smart-matchblock-updated', async (e) => {
      if (!smartSettingsLoaded) return;
      const kw = e && e.detail && typeof e.detail.keyword === 'string' ? e.detail.keyword.trim() : '';
      await loadSmartMatchBlockKeywords();
      if (kw && kw === smartMatchBlockSelectedKeyword) {
        await loadSmartMatchBlockItems(kw);
      }
    });
  } catch (_e) {}

  const renderSmartMatchBlock = () => {
    const fillEmptyRow = (tbody, text, colspan) => {
      if (!tbody) return;
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.className = 'px-3 py-2 text-gray-500 dark:text-gray-400';
      td.colSpan = colspan;
      td.textContent = text;
      tr.appendChild(td);
      tbody.appendChild(tr);
    };

    if (smartMatchBlockSelectedKeywordEl) {
      smartMatchBlockSelectedKeywordEl.textContent = smartMatchBlockSelectedKeyword ? smartMatchBlockSelectedKeyword : '';
    }

    if (smartMatchBlockKeywordList) {
      smartMatchBlockKeywordList.innerHTML = '';
      const list = Array.isArray(smartMatchBlockKeywordsCache) ? smartMatchBlockKeywordsCache : [];
      if (!list.length) {
        const li = document.createElement('li');
        li.className = 'px-4 py-3 text-gray-500 dark:text-gray-400 text-sm';
        li.textContent = '无数据';
        smartMatchBlockKeywordList.appendChild(li);
      } else {
        list.forEach((row) => {
          const keyword = row && typeof row.keyword === 'string' ? row.keyword.trim() : '';
          if (!keyword) return;
          const count = row && Number.isFinite(Number(row.count)) ? Math.max(0, Math.floor(Number(row.count))) : 0;

          const li = document.createElement('li');
          li.dataset.keyword = keyword;
          li.className = 'px-4 py-2 rounded-full border flex items-center gap-2 cursor-pointer transition-colors';
          if (keyword === smartMatchBlockSelectedKeyword) {
            li.classList.add('bg-green-500/10', 'border-green-500/30', 'dark:border-green-400/20');
          } else {
            li.classList.add('border-gray-200', 'hover:bg-gray-500/5', 'dark:border-white/10', 'dark:hover:bg-white/5');
          }

          const name = document.createElement('div');
          name.className = 'flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-200 truncate';
          name.textContent = keyword;

          const badge = document.createElement('div');
          badge.className = 'text-xs px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-700 dark:text-gray-200';
          badge.textContent = String(count);

          const del = document.createElement('button');
          del.type = 'button';
          del.className = 'px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10';
          del.textContent = '删除';
          del.dataset.action = 'deleteKeyword';

          li.appendChild(name);
          li.appendChild(badge);
          li.appendChild(del);
          smartMatchBlockKeywordList.appendChild(li);
        });
      }
    }

    if (smartMatchBlockItemTableBody) {
      const keyword = smartMatchBlockSelectedKeyword;
      if (!keyword) {
        fillEmptyRow(smartMatchBlockItemTableBody, '请选择关键字', 5);
        return;
      }
      const list = Array.isArray(smartMatchBlockItemsCache) ? smartMatchBlockItemsCache : [];
      if (!list.length) {
        fillEmptyRow(smartMatchBlockItemTableBody, '无数据', 5);
        return;
      }
      smartMatchBlockItemTableBody.innerHTML = '';
      list.forEach((row) => {
        const siteKey = row && typeof row.siteKey === 'string' ? row.siteKey.trim() : '';
        const siteName = row && typeof row.siteName === 'string' ? row.siteName.trim() : '';
        const spiderApi = row && typeof row.spiderApi === 'string' ? row.spiderApi.trim() : '';
        const videoId = row && typeof row.videoId === 'string' ? row.videoId.trim() : '';
        const poster = row && typeof row.poster === 'string' ? row.poster.trim() : '';
        if (!siteKey || !videoId) return;

        const tr = document.createElement('tr');
        tr.dataset.keyword = keyword;
        tr.dataset.siteKey = siteKey;
        tr.dataset.videoId = videoId;

        const tdPoster = document.createElement('td');
        tdPoster.className = 'px-3 py-2';
        if (poster) {
          const img = document.createElement('img');
          img.src = poster;
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.referrerPolicy = 'no-referrer';
          img.className = 'w-10 h-14 object-cover rounded-md bg-gray-200 dark:bg-white/10';
          tdPoster.appendChild(img);
        } else {
          const box = document.createElement('div');
          box.className = 'w-10 h-14 rounded-md bg-gray-200 dark:bg-white/10';
          tdPoster.appendChild(box);
        }

        const tdSite = document.createElement('td');
        tdSite.className = 'px-3 py-2 text-sm text-gray-700 dark:text-gray-200';
        tdSite.textContent = siteName || siteKey;

        const tdApi = document.createElement('td');
        tdApi.className = 'px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200';
        tdApi.textContent = spiderApi || '';

        const tdId = document.createElement('td');
        tdId.className = 'px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200';
        tdId.textContent = videoId;

        const tdOps = document.createElement('td');
        tdOps.className = 'px-3 py-2 whitespace-nowrap';
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn-ghost-red whitespace-nowrap';
        del.textContent = '删除';
        del.dataset.action = 'deleteItem';
        tdOps.appendChild(del);

        tr.appendChild(tdPoster);
        tr.appendChild(tdSite);
        tr.appendChild(tdApi);
        tr.appendChild(tdId);
        tr.appendChild(tdOps);
        smartMatchBlockItemTableBody.appendChild(tr);
      });
    }
  };

  const loadSmartMatchBlockKeywords = async () => {
    if (smartMatchBlockKeywordsLoading) return;
    if (!smartMatchBlockKeywordList) return;
    smartMatchBlockKeywordsLoading = true;
    try {
      const data = await fetchSmartMatchBlockKeywords();
      smartMatchBlockKeywordsCache = data && Array.isArray(data.keywords) ? data.keywords : [];
      const hasSelected = smartMatchBlockSelectedKeyword && smartMatchBlockKeywordsCache.some((x) => x && x.keyword === smartMatchBlockSelectedKeyword);
      if (!hasSelected) {
        smartMatchBlockSelectedKeyword = '';
        smartMatchBlockItemsCache = [];
      }
      renderSmartMatchBlock();
    } catch (err) {
      notify.error((err && err.message) || '加载失败');
    } finally {
      smartMatchBlockKeywordsLoading = false;
      renderSmartMatchBlock();
    }
  };

  const loadSmartMatchBlockItems = async (keyword) => {
    const kw = typeof keyword === 'string' ? keyword.trim() : '';
    if (!kw) {
      smartMatchBlockSelectedKeyword = '';
      smartMatchBlockItemsCache = [];
      renderSmartMatchBlock();
      return;
    }
    if (smartMatchBlockItemsLoading) return;
    if (!smartMatchBlockItemTableBody) return;
    smartMatchBlockItemsLoading = true;
    smartMatchBlockSelectedKeyword = kw;
    renderSmartMatchBlock();
    try {
      const data = await fetchSmartMatchBlockItems(kw);
      smartMatchBlockItemsCache = data && Array.isArray(data.items) ? data.items : [];
      renderSmartMatchBlock();
    } catch (err) {
      smartMatchBlockItemsCache = [];
      renderSmartMatchBlock();
      notify.error((err && err.message) || '加载失败');
    } finally {
      smartMatchBlockItemsLoading = false;
      renderSmartMatchBlock();
    }
  };

  if (smartMatchBlockKeywordList) {
    smartMatchBlockKeywordList.addEventListener('click', async (e) => {
      const target = e && e.target ? e.target : null;
      const li = target && target.closest ? target.closest('li[data-keyword]') : null;
      const keyword = li ? String(li.dataset.keyword || '').trim() : '';
      if (!keyword) return;
      if (target && target.dataset && target.dataset.action === 'deleteKeyword') {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`删除关键字「${keyword}」及其禁用项？`)) return;
        try {
          await deleteSmartMatchBlockKeyword({ keyword });
          if (smartMatchBlockSelectedKeyword === keyword) {
            smartMatchBlockSelectedKeyword = '';
            smartMatchBlockItemsCache = [];
          }
          await loadSmartMatchBlockKeywords();
          renderSmartMatchBlock();
          notify.success('已删除');
        } catch (err) {
          notify.error((err && err.message) || '删除失败');
        }
        return;
      }
      if (keyword === smartMatchBlockSelectedKeyword) return;
      await loadSmartMatchBlockItems(keyword);
    });
  }

  if (smartMatchBlockItemTableBody) {
    smartMatchBlockItemTableBody.addEventListener('click', async (e) => {
      const target = e && e.target ? e.target : null;
      if (!target || !target.closest) return;
      if (!(target.dataset && target.dataset.action === 'deleteItem')) return;
      const tr = target.closest('tr[data-site-key][data-video-id]');
      if (!tr) return;
      const keyword = String(tr.dataset.keyword || '').trim();
      const siteKey = String(tr.dataset.siteKey || '').trim();
      const videoId = String(tr.dataset.videoId || '').trim();
      if (!keyword || !siteKey || !videoId) return;
      e.preventDefault();
      e.stopPropagation();
      try {
        await deleteSmartMatchBlockItem({ keyword, siteKey, videoId });
        await loadSmartMatchBlockItems(keyword);
        await loadSmartMatchBlockKeywords();
        notify.success('已删除');
      } catch (err) {
        notify.error((err && err.message) || '删除失败');
      }
    });
  }

  const setGlobalSettingsSaveStatus = bindInlineStatus(globalSettingsSaveStatus);
  let globalSettingsSaving = false;
  const renderGlobalSettingsSave = () => {
    if (globalSettingsSave) globalSettingsSave.disabled = globalSettingsSaving || smartSaving;
  };
  const persistGlobalSettings = async () => {
    if (globalSettingsSaving) return;
    globalSettingsSaving = true;
    renderGlobalSettingsSave();
    setGlobalSettingsSaveStatus('', '');
    setButtonLoading(globalSettingsSave, true, { loadingText: '保存中' });
    try {
      // Unified save: report via the global info box only.
      setSiteSaveStatus('', '');

      await validateSearchDisplayModeToken();
      if (siteForm) {
        await withDatasetLock(siteForm, 'pending', async () => {
          setSiteSaveStatus('', '');
          try {
            const { resp, data } = await postForm(siteForm.action, formToFields(siteForm));
            if (resp.ok && data && data.success) return;
            const msg = (data && data.message) || '保存失败';
            throw new Error(msg);
          } catch (e) {
            throw e;
          }
        });
      }
      setGlobalSettingsSaveStatus('', '');
      notify.success('保存成功');
    } catch (err) {
      const msg = (err && err.message) || '保存失败';
      setGlobalSettingsSaveStatus('', '');
      notify.error(msg);
    } finally {
      globalSettingsSaving = false;
      setButtonLoading(globalSettingsSave, false);
      renderGlobalSettingsSave();
    }
  };
  if (globalSettingsSave) {
    globalSettingsSave.addEventListener('click', () => void persistGlobalSettings());
    renderGlobalSettingsSave();
  }
  if (searchDisplayModeSelect) {
    searchDisplayModeSelect.addEventListener('change', () => void validateSearchDisplayModeToken({ toast: true }));
  }

  let smartSettingsLoaded = false;
  let smartSettingsLoading = false;

  const loadSmartPanel = async () => {
    if (smartSettingsLoaded || smartSettingsLoading) return;
    smartSettingsLoading = true;
    try {
      const data = await fetchSmartSettings();
      if (!data) {
        notify.error('加载失败');
        return;
      }
      smartSourceExtractPriority = normalizeSmartSourceExtractPriorityMode(data.smartSourceExtractPriority);
      smartSiteCleanKeywords = typeof data.siteCleanKeywords === 'string' ? data.siteCleanKeywords : '';
      smartSourcePriorityTokens = Array.isArray(data.smartSourcePriorityTokens) ? data.smartSourcePriorityTokens : [];
      smartPanMatchTokens = Array.isArray(data.smartPanMatchTokens) ? data.smartPanMatchTokens : [];
      smartPanAliasMappings = normalizeSmartPanAliasMappings(Array.isArray(data.smartPanAliasMappings) ? data.smartPanAliasMappings : []);
      renderSmartPanSettings();
      await loadSmartMatchBlockKeywords();
      smartSettingsLoaded = true;
    } catch (err) {
      notify.error((err && err.message) || '加载失败');
    } finally {
      smartSettingsLoading = false;
    }
  };

	  const loadMagicPanel = async () => {
	    if (panelLoaded.magic || panelLoading.magic) return;
	    if (!magicEpisodeRuleList && !magicMovieRuleList && !magicAggregateRegexRuleList) return;
	    panelLoading.magic = true;
	    setMagicStatus(magicEpisodeCleanRegexRuleStatus, '', '加载中...');
	    setMagicStatus(magicEpisodeRuleStatus, '', '加载中...');
	    setMagicStatus(magicMovieRuleStatus, '', '加载中...');
	    setMagicStatus(magicAggregateRegexRuleStatus, '', '加载中...');
	    try {
	      const data = await fetchMagicSettings();
	      if (!data) {
	        setMagicStatus(magicEpisodeCleanRegexRuleStatus, 'error', '加载失败');
	        setMagicStatus(magicEpisodeRuleStatus, 'error', '加载失败');
	        setMagicStatus(magicMovieRuleStatus, 'error', '加载失败');
	        setMagicStatus(magicAggregateRegexRuleStatus, 'error', '加载失败');
	        return;
      }
	      magicEpisodeRules = Array.isArray(data.episodeRules)
	        ? data.episodeRules.map(decodeEpisodeRule).filter(Boolean)
	        : [];
        magicMovieRules = Array.isArray(data.movieRules)
          ? data.movieRules.map(decodeEpisodeRule).filter(Boolean)
          : [];
	      magicEpisodeCleanRegexRules = Array.isArray(data.episodeCleanRegexRules)
	        ? data.episodeCleanRegexRules
	        : typeof data.episodeCleanRegex === 'string' && data.episodeCleanRegex.trim()
	          ? [data.episodeCleanRegex.trim()]
	          : [];
	      magicAggregateRegexRules = Array.isArray(data.aggregateRegexRules) ? data.aggregateRegexRules : [];
	      renderMagicPanels();
        updateMagicRulePreviews();
	      setMagicStatus(magicEpisodeCleanRegexRuleStatus, '', '');
	      setMagicStatus(magicEpisodeRuleStatus, '', '');
	      setMagicStatus(magicMovieRuleStatus, '', '');
	      setMagicStatus(magicAggregateRegexRuleStatus, '', '');
	      panelLoaded.magic = true;
	    } finally {
      panelLoading.magic = false;
    }
  };

  if (magicEpisodeRuleAdd && magicEpisodeRulePatternInput && magicEpisodeRuleReplaceInput) {
    magicEpisodeRuleAdd.addEventListener('click', async () => {
      const p = normalizePatternInput(magicEpisodeRulePatternInput.value || '');
      if (!p) return;
      const replace = (magicEpisodeRuleReplaceInput.value || '').trim();
      magicEpisodeRulePatternInput.value = '';
      magicEpisodeRuleReplaceInput.value = '';
      magicEpisodeRules = (Array.isArray(magicEpisodeRules) ? magicEpisodeRules : []).concat([
        { pattern: p.pattern, replace, flags: p.flags || '' },
      ]);
      episodeDefaultsConfirming = false;
      renderMagicPanels();
      await persistMagic();
    });
  }

  const DEFAULT_EPISODE_RULES = [
    {
      pattern: '.*?([Ss]\\d{1,2})?(?:第\\s*(\\d{1,4})\\s*(?:集|话)|[Ee][Pp]?\\s*(\\d{1,4})(?:$|\\D)).*?.*',
      replace: '$1E$2$3',
      flags: 'i',
    },
    {
      pattern: '^[\\s\\[\\]\\(\\){}【】._-]*0*(\\d{1,4})[\\s\\[\\]\\(\\){}【】._-]*(?:\\.[A-Za-z0-9]{1,6})?\\s*$',
      replace: 'E$1',
      flags: 'i',
    },
  ];

  if (magicEpisodeRuleTestBtn) {
    magicEpisodeRuleTestBtn.addEventListener('click', () => runMagicEpisodeRuleTest());
  }
  if (magicEpisodeRuleTestInput) {
    magicEpisodeRuleTestInput.addEventListener('keydown', (e) => {
      if (!e) return;
      const key = e.key || '';
      if (key === 'Enter') {
        e.preventDefault();
        runMagicEpisodeRuleTest();
      }
    });
  }

  if (magicMovieRuleAdd && magicMovieRulePatternInput && magicMovieRuleReplaceInput) {
    magicMovieRuleAdd.addEventListener('click', async () => {
      const p = normalizePatternInput(magicMovieRulePatternInput.value || '');
      if (!p) return;
      const replace = (magicMovieRuleReplaceInput.value || '').trim();
      magicMovieRulePatternInput.value = '';
      magicMovieRuleReplaceInput.value = '';
      magicMovieRules = (Array.isArray(magicMovieRules) ? magicMovieRules : []).concat([{ pattern: p.pattern, replace, flags: p.flags || '' }]);
      movieDefaultsConfirming = false;
      renderMagicPanels();
      await persistMagic();
    });
  }

  const DEFAULT_MOVIE_RULES = [
    {
      pattern:
        '^\\s*(?!.*(?:S\\d{1,2}\\s*E\\d{1,3}|第\\s*\\d+\\s*[集话期]|(?:^|[\\s._-])(?:EP?|E)\\s*\\d+(?:$|[\\s._-])))(?=.*\\b(?:19\\d{2}|20\\d{2})\\b).*\\.(?:mkv|mp4)\\s*$',
      replace: '',
      flags: 'i',
    },
  ];

  if (magicMovieDefaultsRestore) {
    magicMovieDefaultsRestore.addEventListener('click', () => {
      if (magicSaving) return;
      movieDefaultsConfirming = true;
      renderMagicPanels();
    });
  }
  if (magicMovieDefaultsRestoreCancel) {
    magicMovieDefaultsRestoreCancel.addEventListener('click', () => {
      if (magicSaving) return;
      movieDefaultsConfirming = false;
      renderMagicPanels();
    });
  }
  if (magicMovieDefaultsRestoreConfirm) {
    magicMovieDefaultsRestoreConfirm.addEventListener('click', async () => {
      if (magicSaving) return;
      magicMovieRules = DEFAULT_MOVIE_RULES.map((r) => ({ ...r }));
      if (magicMovieRulePatternInput) magicMovieRulePatternInput.value = '';
      if (magicMovieRuleReplaceInput) magicMovieRuleReplaceInput.value = '';
      renderMagicPanels();
      setButtonLoading(magicMovieDefaultsRestoreConfirm, true);
      try {
        await persistMagic({ successMessage: '恢复默认并保存成功' });
      } finally {
        setButtonLoading(magicMovieDefaultsRestoreConfirm, false);
        movieDefaultsConfirming = false;
        renderMagicPanels();
      }
    });
  }

  if (magicMovieRuleTestBtn) {
    magicMovieRuleTestBtn.addEventListener('click', () => runMagicMovieRuleTest());
  }
  if (magicMovieRuleTestInput) {
    magicMovieRuleTestInput.addEventListener('keydown', (e) => {
      if (!e) return;
      const key = e.key || '';
      if (key === 'Enter') {
        e.preventDefault();
        runMagicMovieRuleTest();
      }
    });
  }
  if (magicEpisodeRuleTestInput) {
    magicEpisodeRuleTestInput.addEventListener('input', () => updateMagicRulePreviews());
  }
  if (magicAggregateRuleTestInput) {
    magicAggregateRuleTestInput.addEventListener('input', () => updateMagicRulePreviews());
  }
  if (magicAggregateRuleTestQueryInput) {
    magicAggregateRuleTestQueryInput.addEventListener('input', () => updateMagicRulePreviews());
  }

	  if (magicEpisodeCleanRegexRuleAdd && magicEpisodeCleanRegexRuleInput) {
	    magicEpisodeCleanRegexRuleAdd.addEventListener('click', async () => {
	      const v = normalizeAggregateRegexRuleInput(magicEpisodeCleanRegexRuleInput.value || '');
	      if (!v) return;
	      magicEpisodeCleanRegexRuleInput.value = '';
	      magicEpisodeCleanRegexRules = (Array.isArray(magicEpisodeCleanRegexRules) ? magicEpisodeCleanRegexRules : []).concat([v]);
        episodeDefaultsConfirming = false;
	      renderMagicPanels();
	      await persistMagic();
	    });
	  }

    const DEFAULT_EPISODE_CLEAN_RULES = [
      String.raw`\[(?!\s*[Ss]\d{1,2}(?:\s*[Ee]\d{1,5})?\s*\])[^\]]*\]`,
      String.raw`【(?!\s*[Ss]\d{1,2}(?:\s*[Ee]\d{1,5})?\s*】)[^】]*】`,
      String.raw`\((?!\s*[Ss]\d{1,2}(?:\s*[Ee]\d{1,5})?\s*\))[^)]*\)`,
      String.raw`（(?!\s*[Ss]\d{1,2}(?:\s*[Ee]\d{1,5})?\s*）)[^）]*）`,
      String.raw`(?:^|[\s\[\]\(\){}【】._-])(?:4k|8k|2160p|1080p|720p)(?=$|[\s\[\]\(\){}【】._-])`,
      String.raw`高\s*码\s*(?:率|资源|直链)?|码\s*率`,
    ];

    if (magicEpisodeDefaultsRestore) {
      magicEpisodeDefaultsRestore.addEventListener('click', () => {
        if (magicSaving) return;
        episodeDefaultsConfirming = true;
        renderMagicPanels();
      });
    }
    if (magicEpisodeDefaultsRestoreCancel) {
      magicEpisodeDefaultsRestoreCancel.addEventListener('click', () => {
        if (magicSaving) return;
        episodeDefaultsConfirming = false;
        renderMagicPanels();
      });
    }
    if (magicEpisodeDefaultsRestoreConfirm) {
      magicEpisodeDefaultsRestoreConfirm.addEventListener('click', async () => {
        if (magicSaving) return;
        magicEpisodeCleanRegexRules = DEFAULT_EPISODE_CLEAN_RULES.slice();
        magicEpisodeRules = DEFAULT_EPISODE_RULES.map((r) => ({ ...r }));
        if (magicEpisodeCleanRegexRuleInput) magicEpisodeCleanRegexRuleInput.value = '';
        if (magicEpisodeRulePatternInput) magicEpisodeRulePatternInput.value = '';
        if (magicEpisodeRuleReplaceInput) magicEpisodeRuleReplaceInput.value = '';
        renderMagicPanels();
        setButtonLoading(magicEpisodeDefaultsRestoreConfirm, true);
        try {
          await persistMagic({ successMessage: '恢复默认并保存成功' });
        } finally {
          setButtonLoading(magicEpisodeDefaultsRestoreConfirm, false);
          episodeDefaultsConfirming = false;
          renderMagicPanels();
        }
      });
    }

  if (magicAggregateRegexRuleAdd && magicAggregateRegexRuleInput) {
    magicAggregateRegexRuleAdd.addEventListener('click', async () => {
      const v = normalizeAggregateRegexRuleInput(magicAggregateRegexRuleInput.value || '');
      if (!v) return;
      magicAggregateRegexRuleInput.value = '';
      magicAggregateRegexRules = (Array.isArray(magicAggregateRegexRules) ? magicAggregateRegexRules : []).concat([v]);
      aggregateDefaultsConfirming = false;
      renderMagicPanels();
      await persistMagic();
    });
  }

  const DEFAULT_AGGREGATE_REGEX_RULES = [
    String.raw`\([^)]*\)|（[^）]*）|\[[^\]]*\]|\{[^}]*\}|【[^】]*】`,
    String.raw`(?<!新)年\s*番\s*\d+|(?<!新)年\s*番`,
    String.raw`更新\s*中|(?:更新(?:至|到)?|更(?:至|到)?|更|首\s*更)\s*(?:EP|E)?\s*\d{1,4}\s*(?:集|话)?|首\s*更`,
    String.raw`(?:HD\s*)?(?:4[kK]|8[kK])|(?:2160|1080|720)[pP]|国\s*漫|臻\s*彩|杜\s*比\s*音\s*效|已\s*刮\s*削|连\s*载\s*中|10\s*[- ]?bit`,
    String.raw`(?:19\d{2}|20\d{2})(?=\s*(?:(?:HD\s*)?(?:4[kK]|8[kK])|(?:更新|更)))`,
    String.raw`最\s*新\s*(?:一\s*集|更\s*新)`,
    String.raw`(?<=\D)\d{1,4}$`,
  ];

  if (magicAggregateDefaultsRestore) {
    magicAggregateDefaultsRestore.addEventListener('click', () => {
      if (magicSaving) return;
      aggregateDefaultsConfirming = true;
      renderMagicPanels();
    });
  }
  if (magicAggregateDefaultsRestoreCancel) {
    magicAggregateDefaultsRestoreCancel.addEventListener('click', () => {
      if (magicSaving) return;
      aggregateDefaultsConfirming = false;
      renderMagicPanels();
    });
  }
  if (magicAggregateDefaultsRestoreConfirm) {
    magicAggregateDefaultsRestoreConfirm.addEventListener('click', async () => {
      if (magicSaving) return;
      magicAggregateRegexRules = DEFAULT_AGGREGATE_REGEX_RULES.slice();
      if (magicAggregateRegexRuleInput) magicAggregateRegexRuleInput.value = '';
      renderMagicPanels();
      setButtonLoading(magicAggregateDefaultsRestoreConfirm, true);
      try {
        await persistMagic({ successMessage: '恢复默认并保存成功' });
      } finally {
        setButtonLoading(magicAggregateDefaultsRestoreConfirm, false);
        aggregateDefaultsConfirming = false;
        renderMagicPanels();
      }
    });
  }

  if (magicAggregateRuleTestBtn) {
    magicAggregateRuleTestBtn.addEventListener('click', () => runMagicAggregateRuleTest());
  }
  if (magicAggregateRuleTestInput) {
    magicAggregateRuleTestInput.addEventListener('keydown', (e) => {
      if (!e) return;
      const key = e.key || '';
      if (key === 'Enter') {
        e.preventDefault();
        runMagicAggregateRuleTest();
      }
    });
  }
  if (magicAggregateRuleTestQueryInput) {
    magicAggregateRuleTestQueryInput.addEventListener('keydown', (e) => {
      if (!e) return;
      const key = e.key || '';
      if (key === 'Enter') {
        e.preventDefault();
        runMagicAggregateRuleTest();
      }
    });
  }

  if (smartPanSettingsSave) {
    smartPanSettingsSave.addEventListener('click', async () => {
      if (smartSaving) return;
      try {
        await persistSmartPreferences();
        notify.success('保存成功');
      } catch (e) {
        notify.error((e && e.message) || '保存失败');
      }
    });
  }

  if (smartPanAliasMapAdd) {
    smartPanAliasMapAdd.addEventListener('click', () => {
      if (smartSaving) return;
      const pan = smartPanAliasMapPanInput ? stripDisplaySequencePrefix(smartPanAliasMapPanInput.value || '') : '';
      const aliases = smartPanAliasMapAliasesInput ? normalizeCommaTokenLine(smartPanAliasMapAliasesInput.value || '').join(',') : '';
      if (!pan) {
        notify.error('请先填写网盘');
        return;
      }
      const next = (Array.isArray(smartPanAliasMappings) ? smartPanAliasMappings : []).slice();
      const idx = next.findIndex((it) => String((it && it.pan) || '').trim().toLowerCase() === pan.toLowerCase());
      const row = { pan, aliases };
      if (idx >= 0) next[idx] = row;
      else next.push(row);
      smartPanAliasMappings = normalizeSmartPanAliasMappings(next);
      if (smartPanAliasMapPanInput) smartPanAliasMapPanInput.value = '';
      if (smartPanAliasMapAliasesInput) smartPanAliasMapAliasesInput.value = '';
      renderSmartPanSettings();
    });
  }
  if (smartPanAliasMapList) {
    smartPanAliasMapList.addEventListener('click', async (e) => {
      const target = e && e.target ? e.target : null;
      const delBtn = target && target.closest ? target.closest('button[data-smart-pan-alias-del]') : null;
      if (delBtn) {
        if (smartSaving) return;
        const idx = Number(delBtn.getAttribute('data-smart-pan-alias-del') || -1);
        if (!Number.isFinite(idx) || idx < 0) return;
        smartPanAliasMappings = (Array.isArray(smartPanAliasMappings) ? smartPanAliasMappings : []).filter((_r, i) => i !== idx);
        renderSmartPanSettings();
        return;
      }
      const saveBtn = target && target.closest ? target.closest('button[data-smart-pan-alias-save]') : null;
      if (saveBtn) {
        if (smartSaving) return;
        try {
          await persistSmartPreferences({ silent: true });
          notify.success('保存成功');
        } catch (err) {
          notify.error((err && err.message) || '保存失败');
        }
      }
    });
    smartPanAliasMapList.addEventListener('change', (e) => {
      const target = e && e.target ? e.target : null;
      const input = target && target.closest ? target.closest('input[data-smart-pan-alias-idx][data-smart-pan-alias-field]') : null;
      if (!input) return;
      const idx = Number(input.getAttribute('data-smart-pan-alias-idx') || -1);
      const field = String(input.getAttribute('data-smart-pan-alias-field') || '').trim();
      if (!Number.isFinite(idx) || idx < 0) return;
      const list = (Array.isArray(smartPanAliasMappings) ? smartPanAliasMappings : []).slice();
      const row = list[idx] && typeof list[idx] === 'object' ? { ...list[idx] } : { pan: '', aliases: '' };
      if (field === 'pan') row.pan = stripDisplaySequencePrefix(input.value || '');
      if (field === 'aliases') row.aliases = normalizeCommaTokenLine(input.value || '').join(',');
      list[idx] = row;
      smartPanAliasMappings = normalizeSmartPanAliasMappings(list);
      renderSmartPanSettings();
    });
  }

  const DEFAULT_SMART_SOURCE_PRIORITY_TOKENS = [];
  const DEFAULT_SMART_PAN_MATCH_TOKENS = ['移动', '天翼', '夸克', 'uc', '百度', '115'];
  const DEFAULT_SMART_PAN_ALIAS_MAPPINGS = [
    { pan: '百度', aliases: '百度,baidu' },
    { pan: '夸克', aliases: '夸克,quark,夸父' },
    { pan: 'uc', aliases: 'uc,优夕' },
    { pan: '天翼', aliases: '天翼,天意,189' },
    { pan: '移动', aliases: '移动,139,逸动' },
    { pan: '115', aliases: '115,Pan115' },
  ];
  const DEFAULT_SMART_SITE_CLEAN_KEYWORDS = ['直播', '体育', '短剧', '听书', '舞曲', '哔哩'];

  if (smartPanDefaultsRestore) {
    smartPanDefaultsRestore.addEventListener('click', () => {
      if (smartSaving) return;
      syncSmartDraftFromInputs();
      smartPanDefaultsConfirming = true;
      renderSmartPanSettings();
    });
  }
  if (smartPanDefaultsRestoreCancel) {
    smartPanDefaultsRestoreCancel.addEventListener('click', () => {
      if (smartSaving) return;
      syncSmartDraftFromInputs();
      smartPanDefaultsConfirming = false;
      renderSmartPanSettings();
    });
  }
  if (smartPanDefaultsRestoreConfirm) {
    smartPanDefaultsRestoreConfirm.addEventListener('click', async () => {
      if (smartSaving) return;
      smartPanDefaultsConfirming = false;
      smartSourceExtractPriority = '无';
      smartSourcePriorityTokens = DEFAULT_SMART_SOURCE_PRIORITY_TOKENS.slice();
      smartPanMatchTokens = DEFAULT_SMART_PAN_MATCH_TOKENS.slice();
      smartPanAliasMappings = DEFAULT_SMART_PAN_ALIAS_MAPPINGS.map((it) => ({ ...it }));
      renderSmartPanSettings();
      setButtonLoading(smartPanDefaultsRestoreConfirm, true);
      try {
        await persistSmartPreferences();
        notify.success('恢复默认并保存成功');
      } catch (e) {
        notify.error((e && e.message) || '保存失败');
      } finally {
        setButtonLoading(smartPanDefaultsRestoreConfirm, false);
      }
    });
  }

  if (smartSiteCleanDefaultsRestore) {
    smartSiteCleanDefaultsRestore.addEventListener('click', () => {
      if (smartSaving) return;
      syncSmartDraftFromInputs();
      smartSiteCleanDefaultsConfirming = true;
      renderSmartPanSettings();
    });
  }
  if (smartSiteCleanDefaultsRestoreCancel) {
    smartSiteCleanDefaultsRestoreCancel.addEventListener('click', () => {
      if (smartSaving) return;
      syncSmartDraftFromInputs();
      smartSiteCleanDefaultsConfirming = false;
      renderSmartPanSettings();
    });
  }
  if (smartSiteCleanDefaultsRestoreConfirm) {
    smartSiteCleanDefaultsRestoreConfirm.addEventListener('click', async () => {
      if (smartSaving) return;
      smartSiteCleanDefaultsConfirming = false;
      smartSiteCleanKeywords = DEFAULT_SMART_SITE_CLEAN_KEYWORDS.join(',');
      renderSmartPanSettings();
      setButtonLoading(smartSiteCleanDefaultsRestoreConfirm, true);
      try {
        await persistSmartPreferences();
        notify.success('恢复默认并保存成功');
      } catch (e) {
        notify.error((e && e.message) || '保存失败');
      } finally {
        setButtonLoading(smartSiteCleanDefaultsRestoreConfirm, false);
      }
    });
  }
  // Unified save button persists smart preferences; no auto-save on change/enter.

	  const onMagicListClick = async (e) => {
	    const target = e && e.target ? e.target : null;
	    const saveBtn = target && target.closest ? target.closest('button[data-magic-save][data-magic-idx]') : null;
	    if (saveBtn) {
	      if (magicSaving) return;
	      await persistMagic();
	      return;
	    }
	    const btn = target && target.closest ? target.closest('button[data-magic-del][data-magic-idx]') : null;
	    if (!btn) return;
	    const kind = (btn.getAttribute('data-magic-del') || '').trim();
	    const idx = Number(btn.getAttribute('data-magic-idx') || -1);
	    if (!Number.isFinite(idx) || idx < 0) return;
	    if (magicSaving) return;
	    if (kind === 'episodeCleanRegex')
	      magicEpisodeCleanRegexRules = magicEpisodeCleanRegexRules.filter((_r, i) => i !== idx);
	    if (kind === 'episode') magicEpisodeRules = magicEpisodeRules.filter((_r, i) => i !== idx);
	    if (kind === 'movie') magicMovieRules = magicMovieRules.filter((_r, i) => i !== idx);
	    if (kind === 'aggregateRegex') magicAggregateRegexRules = magicAggregateRegexRules.filter((_r, i) => i !== idx);
	    renderMagicPanels();
	    await persistMagic();
	  };

	  const onMagicListChange = async (e) => {
	    const target = e && e.target ? e.target : null;
	    const input = target && target.closest ? target.closest('input[data-magic-kind][data-magic-idx]') : null;
	    if (!input) return;
	    const kind = (input.getAttribute('data-magic-kind') || '').trim();
	    const idx = Number(input.getAttribute('data-magic-idx') || -1);
	    const val = (input.value || '').trim();
	    if (!Number.isFinite(idx) || idx < 0) return;
	    if (kind === 'episode' && idx < magicEpisodeRules.length) {
	      const field = (input.getAttribute('data-magic-field') || '').trim();
	      const r = magicEpisodeRules[idx] && typeof magicEpisodeRules[idx] === 'object' ? magicEpisodeRules[idx] : {};
	      if (field === 'replace') r.replace = val;
	      else r.pattern = normalizeRegexText(val);
	      magicEpisodeRules[idx] = r;
	      renderMagicPanels();
	      return;
	    }
	    if (kind === 'movie' && idx < magicMovieRules.length) {
	      const field = (input.getAttribute('data-magic-field') || '').trim();
	      const r = magicMovieRules[idx] && typeof magicMovieRules[idx] === 'object' ? magicMovieRules[idx] : {};
	      if (field === 'replace') r.replace = val;
	      else r.pattern = normalizeRegexText(val);
	      magicMovieRules[idx] = r;
	      renderMagicPanels();
	      return;
	    }
	    if (kind === 'aggregateRegex' && idx < magicAggregateRegexRules.length) {
	      magicAggregateRegexRules[idx] = normalizeAggregateRegexRuleInput(val);
	      renderMagicPanels();
	      return;
	    }
	    if (kind === 'episodeCleanRegex' && idx < magicEpisodeCleanRegexRules.length) {
	      magicEpisodeCleanRegexRules[idx] = normalizeAggregateRegexRuleInput(val);
	      renderMagicPanels();
	      return;
	    }
	    await persistMagic();
	  };

	  if (magicEpisodeCleanRegexRuleList) {
	    magicEpisodeCleanRegexRuleList.addEventListener('click', onMagicListClick);
	    magicEpisodeCleanRegexRuleList.addEventListener('change', onMagicListChange);
	  }
	  if (magicEpisodeRuleList) {
	    magicEpisodeRuleList.addEventListener('click', onMagicListClick);
	    magicEpisodeRuleList.addEventListener('change', onMagicListChange);
	  }
    if (magicMovieRuleList) {
      magicMovieRuleList.addEventListener('click', onMagicListClick);
      magicMovieRuleList.addEventListener('change', onMagicListChange);
    }
  if (magicAggregateRegexRuleList) {
    magicAggregateRegexRuleList.addEventListener('click', onMagicListClick);
    magicAggregateRegexRuleList.addEventListener('change', onMagicListChange);
  }

  function ensurePanelDataLoaded(key) {
    if (key === 'site') return loadSitePanel();
    if (key === 'user') return loadUserPanel();
    if (key === 'video') return loadVideoPanel();
    if (key === 'pan') return loadPanPanel();
    if (key === 'interface') return loadInterfacePanel();
    if (key === 'magic') return loadMagicPanel();
    if (key === 'smart') return loadSmartPanel();
    if (key === 'metadata') return loadMetadataPanel();
    if (key === 'thirdparty') return loadThirdpartyPanel();
    return null;
  }

  if (initialPanelKey) {
    ensurePanelDataLoaded(initialPanelKey);
  }

  if (
    addUserBtn &&
    addUserForm &&
    addUserName &&
    addUserPassword &&
    confirmAddUser
  ) {
    addUserBtn.type = 'button';
    addUserBtn.setAttribute('aria-controls', 'addUserForm');
    addUserBtn.setAttribute('aria-expanded', 'false');

    const setAddUserStatus = bindInlineStatus(addUserStatus);

    const syncSubmitState = () => {
      const enabled =
        (addUserName.value || '').trim().length > 0 &&
        (addUserPassword.value || '').trim().length > 0;
      confirmAddUser.disabled = !enabled;
      confirmAddUser.classList.toggle('active', enabled);
    };

    const setFormVisible = (visible) => {
      addUserForm.hidden = !visible;
      addUserBtn.textContent = visible ? '取消' : '添加用户';
      addUserBtn.setAttribute('aria-expanded', visible ? 'true' : 'false');
      if (visible) {
        addUserName.focus();
      }
      else setAddUserStatus('', '');
      syncSubmitState();
    };

    setFormVisible(false);

    addUserBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setFormVisible(addUserForm.hidden);
    });

    addUserForm.addEventListener('input', () => {
      setAddUserStatus('', '');
      syncSubmitState();
    });

    addUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      syncSubmitState();
      if (confirmAddUser.disabled) return;
      const fields = formToFields(addUserForm);
      const username = (fields.username || '').trim();
      const password = (fields.password || '').trim();
      if (!username || !password) return;

      confirmAddUser.disabled = true;
      confirmAddUser.classList.remove('active');
      setAddUserStatus('info', '添加中...');

      try {
        const { resp, data } = await postForm('/dashboard/user/add', {
          username,
          password,
        });
        if (resp.ok && data.success) {
          setAddUserStatus('success', '添加成功');
          appendUserRow({
            username,
            role: 'user',
            status: 'active',
          });
          addUserForm.reset();
          if (userCountEl) {
            const num = parseInt(userCountEl.textContent || '0', 10);
            userCountEl.textContent = (num + 1).toString();
          }
          syncSubmitState();
          setFormVisible(false);
        } else {
          setAddUserStatus('error', data.message || '添加失败');
          syncSubmitState();
        }
      } catch (err) {
        setAddUserStatus('error', '添加失败');
        syncSubmitState();
      }
    });
  }

  if (userTableBody) {
    userTableBody.addEventListener('click', async (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const btn = target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (!action) return;
      const row = btn.closest('tr');
      if (!row) return;
      const username = row.getAttribute('data-username') || '';
      const role = row.getAttribute('data-role') || '';
      if (!username) return;
      if (role === 'admin' && (action === 'ban' || action === 'delete')) return;

      const removeEditor = () => {
        const existing = userTableBody.querySelector('tr.user-edit-row');
        if (existing) existing.remove();
      };

      if (action === 'edit') {
        const existing = userTableBody.querySelector('tr.user-edit-row');
        const existingFor = existing ? existing.getAttribute('data-for') || '' : '';
        if (existing && existingFor === username) {
          existing.remove();
          return;
        }
        removeEditor();

        const editTr = document.createElement('tr');
        editTr.className = 'user-edit-row';
        editTr.setAttribute('data-for', username);

        const editTd = document.createElement('td');
        editTd.colSpan = 4;
        editTd.className = 'px-3 py-3';

        const box = document.createElement('div');
        box.className = 'user-edit-box';

        const grid = document.createElement('div');
        grid.className = 'grid items-center';
        grid.style.gridTemplateColumns = 'max-content 1fr';
        grid.style.gap = '14px 18px';

        const appendLabeledField = (labelText, controlEl) => {
          const labelEl = document.createElement('span');
          labelEl.className =
            'text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap';
          labelEl.textContent = labelText;

          const controlCell = document.createElement('div');
          controlCell.className = 'min-w-0';
          controlCell.appendChild(controlEl);

          grid.appendChild(labelEl);
          grid.appendChild(controlCell);
          return controlCell;
        };

	        const newUserInput = document.createElement('input');
	        newUserInput.type = 'text';
	        newUserInput.placeholder = '新用户名';
	        newUserInput.className = 'tv-field';

	        const newPassInput = document.createElement('input');
	        newPassInput.type = 'password';
	        newPassInput.placeholder = '新密码';
	        newPassInput.className = 'tv-field';

        const originalRole = (row.getAttribute('data-role') || '').trim() || 'user';
        // roles are fixed: admin/user

	        appendLabeledField('新用户名：', newUserInput);
	        appendLabeledField('新密码：', newPassInput);

        const actions = document.createElement('div');
        actions.className = 'action-group mt-3';

        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'action-btn green';
        okBtn.textContent = '确定';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'action-btn gray';
        cancelBtn.textContent = '取消';

	        const status = document.createElement('div');
	        status.className = 'text-sm mt-2 hidden';
	        const setEditStatus = bindInlineStatus(status);

	        const setButtonEnabled = (button, enabled) => {
	          if (!button) return;
	          const ok = !!enabled;
	          button.disabled = !ok;
	          button.style.opacity = ok ? '1' : '0.6';
	          button.style.cursor = ok ? 'pointer' : 'not-allowed';
	        };

	        const syncOk = () => {
	          const hasUser = (newUserInput.value || '').trim().length > 0;
	          const hasPass = (newPassInput.value || '').trim().length > 0;
		          const enabled = hasUser || hasPass;
		          setButtonEnabled(okBtn, enabled);
		        };

        newUserInput.addEventListener('input', () => {
          setEditStatus('', '');
          syncOk();
        });
        newPassInput.addEventListener('input', () => {
          setEditStatus('', '');
          syncOk();
        });
        syncOk();

        cancelBtn.addEventListener('click', () => editTr.remove());

	        okBtn.addEventListener('click', async () => {
	          syncOk();
	          if (okBtn.disabled) return;
	          okBtn.disabled = true;
	          setEditStatus('', '保存中...');
	          try {
	            const fields = { username };
	            const newU = (newUserInput.value || '').trim();
		            const newP = (newPassInput.value || '').trim();
		            if (newU) fields.newUsername = newU;
		            if (newP) fields.newPassword = newP;
	            const { resp, data } = await postForm('/dashboard/user/update', fields);
			            if (resp.ok && data.success) {
			              const finalUsername = data.username || username;
			              row.setAttribute('data-username', finalUsername);
			              row.setAttribute('data-role', originalRole === 'admin' ? 'admin' : 'user');
		              refreshUserRowCells(row);
		              setEditStatus('success', '保存成功');
		              editTr.remove();
		            } else {
		              setEditStatus('error', data.message || '保存失败');
            }
          } catch (err) {
            setEditStatus('error', '保存失败');
          } finally {
            okBtn.disabled = false;
            syncOk();
          }
        });

        actions.appendChild(okBtn);
        actions.appendChild(cancelBtn);

        box.appendChild(grid);
        box.appendChild(actions);
        box.appendChild(status);
        editTd.appendChild(box);
        editTr.appendChild(editTd);

        row.insertAdjacentElement('afterend', editTr);
        newUserInput.focus();
        return;
      }

      if (action === 'ban') {
        btn.disabled = true;
        try {
          const { resp, data } = await postForm('/dashboard/user/ban', { username });
          if (resp.ok && data.success && data.status) {
            const nextStatus = data.status;
            row.setAttribute('data-status', nextStatus);
            const statusCell = row.querySelector('td[data-col="status"]');
            renderStatus(statusCell, nextStatus);
            btn.textContent = nextStatus === 'active' ? '封禁' : '解封';
          } else {
            // eslint-disable-next-line no-alert
            alert(data.message || '操作失败');
          }
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert('操作失败');
        } finally {
          btn.disabled = false;
        }
      }

      if (action === 'delete') {
        // eslint-disable-next-line no-alert
        if (!confirm(`确定删除用户：${username}？`)) return;
        btn.disabled = true;
        try {
          const { resp, data } = await postForm('/dashboard/user/delete', { username });
          if (resp.ok && data.success) {
            removeEditor();
            row.remove();
            if (userCountEl) {
              const num = parseInt(userCountEl.textContent || '0', 10);
              userCountEl.textContent = Math.max(0, num - 1).toString();
            }
          } else {
            // eslint-disable-next-line no-alert
            alert(data.message || '删除失败');
          }
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert('删除失败');
        } finally {
          btn.disabled = false;
        }
      }
    });
  }
}
