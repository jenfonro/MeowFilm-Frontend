import { reactive } from 'vue';
import { normalizecatpawrunnerApiBase, requestCatPlay } from './catpawrunner';
import { extractTianyiShareCodeAndAccessCode } from '../utils/matchCore';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const normalizeHttpBase = (value) => {
  const raw = normalizeString(value);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (!/^https?:$/i.test(url.protocol)) return '';
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/+$/, '');
  } catch (_error) {
    return '';
  }
};

export const playbackSessionState = reactive({
  currentContext: {
    itemId: '',
    siteKey: '',
    siteName: '',
    spiderApi: '',
    videoId: '',
    panKey: '',
    panFlag: '',
    selectionKey: '',
    globalEpisode: 0,
    itemIndex: -1,
    quality: '',
    pathName: '',
    rawFileName: '',
    fileIdentity: '',
    sourceKind: '',
    sourceSignature: '',
  },
  lastBrowseContext: {
    itemId: '',
    panKey: '',
  },
});

export const setCurrentPlaybackContext = (payload = {}) => {
  const raw = payload && typeof payload === 'object' ? payload : {};
  playbackSessionState.currentContext = {
    itemId: normalizeString(raw.itemId),
    siteKey: normalizeString(raw.siteKey),
    siteName: normalizeString(raw.siteName),
    spiderApi: normalizeString(raw.spiderApi),
    videoId: normalizeString(raw.videoId),
    panKey: normalizeString(raw.panKey),
    panFlag: normalizeString(raw.panFlag),
    selectionKey: normalizeString(raw.selectionKey),
    globalEpisode: Math.max(0, normalizeInt(raw.globalEpisode)),
    itemIndex: normalizeInt(raw.itemIndex),
    quality: normalizeString(raw.quality),
    pathName: normalizeString(raw.pathName),
    rawFileName: normalizeString(raw.rawFileName),
    fileIdentity: normalizeString(raw.fileIdentity),
    sourceKind: normalizeString(raw.sourceKind),
    sourceSignature: normalizeString(raw.sourceSignature),
  };
  return playbackSessionState.currentContext;
};

export const patchCurrentPlaybackContext = (payload = {}) => {
  const current = playbackSessionState.currentContext && typeof playbackSessionState.currentContext === 'object'
    ? playbackSessionState.currentContext
    : {};
  return setCurrentPlaybackContext({
    ...current,
    ...(payload && typeof payload === 'object' ? payload : {}),
  });
};

export const clearCurrentPlaybackContext = () => {
  setCurrentPlaybackContext({});
};

const DEFAULT_PLAYER_QUALITY_OPTIONS = [
  { value: '4k_hdr', label: '4K·HDR' },
  { value: '4k_fps', label: '4K·60帧' },
  { value: '4k', label: '4K' },
  { value: '1080p', label: '1080P' },
  { value: '720p', label: '720P' },
];

export const setLastBrowsePlaybackContext = (payload = {}) => {
  const raw = payload && typeof payload === 'object' ? payload : {};
  playbackSessionState.lastBrowseContext = {
    itemId: normalizeString(raw.itemId),
    panKey: normalizeString(raw.panKey),
  };
  return playbackSessionState.lastBrowseContext;
};

export const patchLastBrowsePlaybackContext = (payload = {}) => {
  const current = playbackSessionState.lastBrowseContext && typeof playbackSessionState.lastBrowseContext === 'object'
    ? playbackSessionState.lastBrowseContext
    : {};
  return setLastBrowsePlaybackContext({
    ...current,
    ...(payload && typeof payload === 'object' ? payload : {}),
  });
};

export const normalizePanAliasMappingsForUi = (list) => {
  const arr = Array.isArray(list) ? list : [];
  const out = [];
  const seen = new Set();
  arr.forEach((item) => {
    const pan = normalizeString(item && item.pan);
    if (!pan) return;
    const key = pan.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const aliases = normalizeString(item && item.aliases)
      .split(',')
      .map(normalizeString)
      .filter(Boolean);
    out.push({ pan, aliases });
  });
  return out;
};

export const resolvePanFamilyLabelForUi = (value, runtimeSettings) => {
  const hay = normalizeString(value).toLowerCase();
  if (!hay) return '';
  const mappings = normalizePanAliasMappingsForUi(runtimeSettings && runtimeSettings.smartPanAliasMappings);
  for (let i = 0; i < mappings.length; i += 1) {
    const item = mappings[i];
    const aliases = [item.pan].concat(Array.isArray(item.aliases) ? item.aliases : []);
    const hit = aliases.some((alias) => {
      const token = normalizeString(alias).toLowerCase();
      return token && hay.includes(token);
    });
    if (hit) return item.pan;
  }
  const tokens = Array.isArray(runtimeSettings && runtimeSettings.smartPanMatchTokens)
    ? runtimeSettings.smartPanMatchTokens.map(normalizeString).filter(Boolean)
    : [];
  return tokens.find((token) => hay.includes(token.toLowerCase())) || '';
};

export const groupPanSourceOptionsForUi = (options, runtimeSettings) => {
  const list = Array.isArray(options) ? options : [];
  const out = [];
  const seen = new Set();
  let hasUnknown = false;
  list.forEach((option) => {
    const label = normalizeString(option && option.label);
    const key = normalizeString(option && option.key);
    const family = resolvePanFamilyLabelForUi(`${label} ${key}`, runtimeSettings);
    const next = family || '未知';
    if (next === '未知') {
      hasUnknown = true;
      return;
    }
    const id = next.toLowerCase();
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ value: next, label: next });
  });
  if (hasUnknown) out.push({ value: '未知', label: '未知' });
  return out;
};

export const normalizeQualityModeKeyForUi = (value) => {
  const raw = normalizeString(value).toLowerCase();
  if (!raw) return '';
  if (raw === '4k·hdr' || raw === '4k_hdr') return '4k_hdr';
  if (raw === '4k·60帧' || raw === '4k_fps') return '4k_fps';
  if (raw === '4k') return '4k';
  if (raw === '1080p') return '1080p';
  if (raw === '720p') return '720p';
  return '';
};

export const formatQualityLabelForUi = (value) => {
  const key = normalizeQualityModeKeyForUi(value);
  const hit = DEFAULT_PLAYER_QUALITY_OPTIONS.find((item) => item.value === key) || null;
  if (hit) return hit.label;
  return '未知';
};

export const inferQualityFromResolution = ({ width = 0, height = 0 } = {}) => {
  const w = Math.max(0, normalizeInt(width));
  const h = Math.max(0, normalizeInt(height));
  const maxEdge = Math.max(w, h);
  if (maxEdge >= 3000) return '4K';
  if (maxEdge >= 1800) return '1080P';
  if (maxEdge >= 1200) return '720P';
  return '';
};

export const doesQualityMatchResolution = (qualityValue, resolutionQuality) => {
  const currentKey = normalizeQualityModeKeyForUi(qualityValue);
  const inferredKey = normalizeQualityModeKeyForUi(resolutionQuality);
  if (!currentKey || !inferredKey) return false;
  if (currentKey === inferredKey) return true;
  if (inferredKey === '4k') return currentKey === '4k_hdr' || currentKey === '4k_fps' || currentKey === '4k';
  return false;
};

export const buildPlayerControlUiState = ({
  isPrimaryTmdbMode = false,
  currentContext,
  runtimeSettings,
  currentPanSourceOptions,
} = {}) => {
  const playback = currentContext && typeof currentContext === 'object' ? currentContext : {};
  const currentPanFamilyLabel =
    resolvePanFamilyLabelForUi(
      `${normalizeString(playback.panFlag)} ${normalizeString(playback.panKey)}`,
      runtimeSettings,
    ) || '未知';
  const currentQualityKey = normalizeQualityModeKeyForUi(playback.quality);
  const currentQualityLabel = formatQualityLabelForUi(playback.quality);

  const playerPanMenuOptions = (() => {
    if (isPrimaryTmdbMode) {
      const mappings = normalizePanAliasMappingsForUi(runtimeSettings && runtimeSettings.smartPanAliasMappings);
      const mapped = mappings.map((item) => ({ value: item.pan, label: item.pan }));
      if (mapped.length) return mapped;
      const tokens = Array.isArray(runtimeSettings && runtimeSettings.smartPanMatchTokens)
        ? runtimeSettings.smartPanMatchTokens.map(normalizeString).filter(Boolean)
        : [];
      return tokens.map((item) => ({ value: item, label: item }));
    }
    const grouped = groupPanSourceOptionsForUi(currentPanSourceOptions, runtimeSettings);
    return grouped.length ? grouped : [{ value: '未知', label: '未知' }];
  })();

  const playerQualityMenuOptions = isPrimaryTmdbMode
    ? DEFAULT_PLAYER_QUALITY_OPTIONS.slice()
    : currentQualityKey
      ? [{ value: currentQualityKey, label: currentQualityLabel }]
      : [];

  const panValue = playerPanMenuOptions.some((item) => normalizeString(item && item.value) === currentPanFamilyLabel)
    ? currentPanFamilyLabel
    : '';
  const qualityValue = playerQualityMenuOptions.some((item) => normalizeString(item && item.value) === currentQualityKey)
    ? currentQualityKey
    : '';

  return {
    currentPanFamilyLabel,
    currentQualityKey,
    currentQualityLabel,
    playerExtraMenus: [
      {
        key: 'pan',
        label: currentPanFamilyLabel || '未知',
        ariaLabel: '网盘',
        value: panValue,
        disabled: !playerPanMenuOptions.length,
        options: playerPanMenuOptions,
      },
      {
        key: 'quality',
        label: currentQualityLabel || '未知',
        ariaLabel: '画质',
        value: qualityValue,
        disabled: !playerQualityMenuOptions.length,
        options: playerQualityMenuOptions,
      },
    ],
    playerExtraActions:
      isPrimaryTmdbMode && Math.max(0, normalizeInt(playback.globalEpisode)) > 0
        ? [
            { key: 'switch', label: '换源', ariaLabel: '换源' },
            { key: 'wrong-source', label: '片源错误', ariaLabel: '片源错误' },
          ]
        : [],
  };
};

export const resolveCandidatePanFamilyForPlayback = (candidate, runtimeSettings) => {
  const target = candidate && typeof candidate === 'object' ? candidate : {};
  return resolvePanFamilyLabelForUi(
    [
      normalizeString(target.panToken),
      normalizeString(target.panFlag),
      normalizeString(target.provider),
      normalizeString(target.displayName),
    ].join(' '),
    runtimeSettings,
  ) || '';
};

export const resolveCandidateQualityModeKeyForPlayback = (candidate) => {
  const target = candidate && typeof candidate === 'object' ? candidate : {};
  const quality = normalizeString(target.quality).toUpperCase();
  const hay = [
    normalizeString(target.displayName),
    normalizeString(target.rawName),
    normalizeString(target.fileName),
  ].join(' ');
  if (quality === '4K') {
    if (/\bhdr\b/i.test(hay)) return '4k_hdr';
    if (/(?:60fps|60帧|2160p60|4k60|\b60p\b)/i.test(hay)) return '4k_fps';
    return '4k';
  }
  if (quality === '1080P') return '1080p';
  if (quality === '720P') return '720p';
  return '';
};

export const buildSmartPlaybackConstraintStages = ({
  actionKey,
  selectedValue = '',
  currentContext,
  runtimeSettings,
} = {}) => {
  const action = normalizeString(actionKey);
  const playback = currentContext && typeof currentContext === 'object' ? currentContext : {};
  const currentPanFamily = resolvePanFamilyLabelForUi(
    `${normalizeString(playback.panFlag)} ${normalizeString(playback.panKey)}`,
    runtimeSettings,
  );
  const currentQualityKey = normalizeQualityModeKeyForUi(playback.quality);
  const targetPanFamily = normalizeString(selectedValue);
  const targetQualityKey = normalizeString(selectedValue);
  const stages = [];
  const pushStage = ({ key, afterFinalize = false, panFamily = '', qualityKey = '' } = {}) => {
    const pan = normalizeString(panFamily);
    const quality = normalizeString(qualityKey);
    const dedupeKey = `${afterFinalize ? 'after' : 'before'}::${pan || '*'}::${quality || '*'}`;
    if (stages.some((item) => item && item.__dedupeKey === dedupeKey)) return;
    stages.push({
      key: normalizeString(key) || `stage_${stages.length + 1}`,
      afterFinalize: !!afterFinalize,
      __dedupeKey: dedupeKey,
      isCandidateAllowed: (wrapper) => {
        const picked = wrapper && wrapper.candidate && typeof wrapper.candidate === 'object'
          ? wrapper.candidate
          : null;
        if (!picked) return false;
        const candidatePanFamily = resolveCandidatePanFamilyForPlayback(picked, runtimeSettings);
        const candidateQualityKey = resolveCandidateQualityModeKeyForPlayback(picked);
        if (pan && candidatePanFamily !== pan) return false;
        if (quality && candidateQualityKey !== quality) return false;
        return true;
      },
    });
  };

  if (action === 'pan') {
    if (!targetPanFamily) return [];
    pushStage({ key: 'pan_keep_quality', panFamily: targetPanFamily, qualityKey: currentQualityKey });
    pushStage({ key: 'pan_any_quality', panFamily: targetPanFamily });
  } else if (action === 'quality') {
    if (!targetQualityKey) return [];
    pushStage({ key: 'quality_keep_pan', panFamily: currentPanFamily, qualityKey: targetQualityKey });
    pushStage({ key: 'quality_any_pan', qualityKey: targetQualityKey });
  } else if (action === 'switch') {
    pushStage({ key: 'switch_keep_pan_quality', panFamily: currentPanFamily, qualityKey: currentQualityKey });
    pushStage({ key: 'switch_keep_quality', qualityKey: currentQualityKey });
    pushStage({ key: 'switch_any_after_finalize', afterFinalize: true });
  }

  return stages.map(({ __dedupeKey, ...item }) => item);
};

export const normalizePlayPayload = (data) => {
  if (!data) return null;
  if (typeof data === 'string') {
    const text = data.trim();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (_error) {
      return null;
    }
  }
  return typeof data === 'object' ? data : null;
};

export const isHttpPlayableUrl = (value) => /^https?:\/\//i.test(normalizeString(value));

export const pickFirstPlayableUrl = (payload) => {
  const direct = normalizeString(payload && payload.url);
  if (isHttpPlayableUrl(direct)) return direct;
  const arr = Array.isArray(payload && payload.url) ? payload.url : [];
  if (arr.length >= 2) {
    const left = normalizeString(arr[0]);
    const right = normalizeString(arr[1]);
    if (!isHttpPlayableUrl(left) && isHttpPlayableUrl(right)) return right;
  }
  for (let i = 0; i < arr.length; i += 1) {
    const current = normalizeString(arr[i]);
    if (isHttpPlayableUrl(current)) return current;
  }
  return '';
};

export const parseLabeledPlayUrlEntries = (payload) => {
  const arr = Array.isArray(payload && payload.url) ? payload.url : [];
  const out = [];
  for (let i = 0; i + 1 < arr.length; i += 2) {
    const label = normalizeString(arr[i]);
    const url = normalizeString(arr[i + 1]);
    if (!label || !url) continue;
    if (isHttpPlayableUrl(label) || !isHttpPlayableUrl(url)) continue;
    out.push({ label, url });
  }
  return out;
};

export const hasNonEmptyHeaders = (headers) => {
  const target = headers && typeof headers === 'object' ? headers : {};
  return Object.keys(target).some((key) => normalizeString(target[key]));
};

export const resolvePlayTargetForPlayback = ({ payload, rawHeaders }) => {
  const headers = rawHeaders && typeof rawHeaders === 'object' ? rawHeaders : {};
  const fallbackUrl = pickFirstPlayableUrl(payload);
  if (!fallbackUrl) return { url: '', headers, proxySourceUrl: '' };
  if (!hasNonEmptyHeaders(headers)) return { url: fallbackUrl, headers, proxySourceUrl: '' };
  let sourceUrl = '';
  const direct = normalizeString(payload && payload.url);
  if (isHttpPlayableUrl(direct)) sourceUrl = direct;
  const labeled = parseLabeledPlayUrlEntries(payload);
  if (labeled.length) {
    const byLabel = (name) =>
      labeled.find((item) => normalizeString(item.label).toLowerCase() === String(name).trim().toLowerCase()) || null;
    const proxyRaw = byLabel('代理raw');
    const raw = byLabel('raw');
    if (proxyRaw && raw && isHttpPlayableUrl(raw.url)) {
      sourceUrl = raw.url;
    } else if (labeled.length === 1 && isHttpPlayableUrl(labeled[0].url)) {
      sourceUrl = labeled[0].url;
    }
  }
  if (!sourceUrl) sourceUrl = fallbackUrl;
  return { url: sourceUrl, headers, proxySourceUrl: sourceUrl };
};

const rewriteProxyUrlToBase = (urlString, apiBase, tvUser) => {
  const raw = normalizeString(urlString);
  const base = normalizecatpawrunnerApiBase(apiBase);
  if (!raw || !base) return raw;
  try {
    const target = new URL(raw);
    const host = normalizeString(target.hostname).toLowerCase();
    const loopback = new Set(['127.0.0.1', '0.0.0.0', 'localhost']);
    const baseUrl = new URL(base);
    const sameHost = host && normalizeString(baseUrl.hostname).toLowerCase() === host;
    const needsRewrite = loopback.has(host) || (sameHost && target.port === '3006' && baseUrl.port !== '3006');
    if (!needsRewrite) return raw;
    const next = new URL(String(target.pathname || '/').replace(/^\//, ''), base);
    next.search = target.search || '';
    next.hash = target.hash || '';
    const safeUser = normalizeString(tvUser);
    if (safeUser && !next.searchParams.has('__tvuser')) next.searchParams.set('__tvuser', safeUser);
    return next.toString();
  } catch (_error) {
    return raw;
  }
};

export const rewritePlayPayloadUrls = (payload, apiBase, tvUser) => {
  if (!payload || typeof payload !== 'object') return payload;
  if (typeof payload.url === 'string') {
    return { ...payload, url: rewriteProxyUrlToBase(payload.url, apiBase, tvUser) };
  }
  if (!Array.isArray(payload.url)) return payload;
  return {
    ...payload,
    url: payload.url.map((item) => (typeof item === 'string' ? rewriteProxyUrlToBase(item, apiBase, tvUser) : item)),
  };
};

export const buildLocalProxyPlaybackUrl = ({ apiBase, sourceUrl, headers }) => {
  const base = normalizecatpawrunnerApiBase(apiBase);
  const target = normalizeString(sourceUrl);
  if (!base || !isHttpPlayableUrl(target)) return '';
  try {
    const url = new URL('proxy', base);
    url.searchParams.set('url', target);
    if (headers && typeof headers === 'object' && Object.keys(headers).length) {
      url.searchParams.set('header', JSON.stringify(headers));
    }
    return url.toString();
  } catch (_error) {
    return '';
  }
};

const joinBaseUrl = (base, relativePath) => {
  const normalizedBase = normalizeHttpBase(base);
  const rel = normalizeString(relativePath);
  if (!normalizedBase || !rel) return '';
  const baseWithSlash = normalizedBase.endsWith('/') ? normalizedBase : `${normalizedBase}/`;
  try {
    return new URL(rel.startsWith('./') ? rel : `./${rel.replace(/^\//, '')}`, baseWithSlash).toString();
  } catch (_error) {
    return '';
  }
};

export const normalizeGoProxyServers = (value) => {
  const list = Array.isArray(value) ? value : [];
  const out = [];
  const seen = new Set();
  list.forEach((item) => {
    const base = normalizeHttpBase(
      typeof item === 'string'
        ? item
        : ((item && (item.base || item.apiBase || item.api || item.url)) || '')
    );
    if (!base || seen.has(base)) return;
    const pans = item && typeof item === 'object' && item.pans && typeof item.pans === 'object' ? item.pans : {};
    const hasBaidu = Object.prototype.hasOwnProperty.call(pans, 'baidu');
    const hasQuark = Object.prototype.hasOwnProperty.call(pans, 'quark');
    let label = '';
    if (item && typeof item === 'object') {
      label = normalizeString(item.displayName || item.name);
    }
    if (!label) {
      try {
        label = new URL(base).host || base;
      } catch (_error) {
        label = base;
      }
    }
    out.push({
      base,
      label,
      pans: {
        baidu: hasBaidu ? !!pans.baidu : true,
        quark: hasQuark ? !!pans.quark : true,
      },
    });
    seen.add(base);
  });
  return out;
};

export const registerGoProxyToken = async ({ base, url, headers }) => {
  const normalizedBase = normalizeHttpBase(base);
  const targetUrl = normalizeString(url);
  if (!normalizedBase) throw new Error('缺少 GoProxy 地址');
  if (!targetUrl) throw new Error('缺少播放地址');
  const headerList = [];
  const rawHeaders = headers && typeof headers === 'object' ? headers : {};
  Object.keys(rawHeaders).forEach((key) => {
    const normalizedKey = normalizeString(key);
    if (!normalizedKey) return;
    const value = rawHeaders[key];
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        const text = normalizeString(item);
        if (!text) return;
        headerList.push({ key: normalizedKey, value: text });
      });
      return;
    }
    const text = normalizeString(value);
    if (!text) return;
    headerList.push({ key: normalizedKey, value: text });
  });
  const registerUrl = joinBaseUrl(normalizedBase, 'register');
  if (!registerUrl) throw new Error('GoProxy 注册地址无效');
  const resp = await fetch(registerUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl, headersList: headerList }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data && (data.message || data.error) ? String(data.message || data.error) : `HTTP ${resp.status}`);
  }
  const token = normalizeString(data && data.token);
  if (!token) throw new Error('GoProxy 返回 token 无效');
  const proxyUrl = joinBaseUrl(normalizedBase, encodeURIComponent(token));
  if (!proxyUrl) throw new Error('GoProxy 代理地址无效');
  return { token, proxyUrl };
};

export const maybeUseGoProxyForPlayback = async ({
  playUrl,
  playHeaders,
  goProxyEnabled,
  goProxyServers,
  preferredPan,
  selectedBase,
}) => {
  const finalUrl = normalizeString(playUrl);
  const finalHeaders = playHeaders && typeof playHeaders === 'object' ? playHeaders : {};
  if (!goProxyEnabled || !finalUrl || !hasNonEmptyHeaders(finalHeaders)) {
    return { url: finalUrl, headers: finalHeaders, goProxyBase: '' };
  }
  const servers = normalizeGoProxyServers(goProxyServers);
  if (!servers.length) return { url: finalUrl, headers: finalHeaders, goProxyBase: '' };
  const pan = normalizeString(preferredPan).toLowerCase();
  const eligible = (pan === 'baidu' || pan === 'quark')
    ? servers.filter((item) => item && item.pans && item.pans[pan])
    : servers;
  if (!eligible.length) return { url: finalUrl, headers: finalHeaders, goProxyBase: '' };
  const manual = normalizeHttpBase(selectedBase);
  const picked = (manual && eligible.find((item) => item.base === manual)) || eligible[0];
  if (!picked || !picked.base) return { url: finalUrl, headers: finalHeaders, goProxyBase: '' };
  const { proxyUrl } = await registerGoProxyToken({
    base: picked.base,
    url: finalUrl,
    headers: finalHeaders,
  });
  const decorated = (() => {
    if (!isProbablyM3U8Url(finalUrl)) return proxyUrl;
    try {
      const next = new URL(proxyUrl);
      next.searchParams.set('__tv_fmt', 'm3u8');
      return next.toString();
    } catch (_error) {
      const sep = proxyUrl.includes('?') ? '&' : '?';
      return `${proxyUrl}${sep}__tv_fmt=m3u8`;
    }
  })();
  return {
    url: decorated,
    headers: {},
    goProxyBase: picked.base,
  };
};

export const registerCatProxyToken = async ({ apiBase, tvUser, url, headers }) => {
  const base = normalizecatpawrunnerApiBase(apiBase);
  if (!base) throw new Error('catpawrunner 接口地址未设置');
  const target = new URL('api/proxy/register', base);
  const safeUser = normalizeString(tvUser);
  const resp = await fetch(target.toString(), {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      ...(safeUser ? { 'X-TV-User': safeUser } : {}),
    },
    body: JSON.stringify({
      url: normalizeString(url),
      headers: headers && typeof headers === 'object' ? headers : {},
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data || data.ok === false) {
    throw new Error(data && (data.message || data.error) ? String(data.message || data.error) : `HTTP ${resp.status}`);
  }
  const proxyPath = normalizeString(data && data.proxy);
  if (!proxyPath) throw new Error('catpawrunner proxy register 返回无效');
  return {
    proxyUrl: new URL(proxyPath.replace(/^\//, ''), base).toString(),
  };
};

export const resolveBuiltinPanPlayBody = ({
  provider,
  flag,
  id,
  rawName,
  panMock189AccessByShareId,
} = {}) => {
  const body = {
    flag: normalizeString(flag),
    id: normalizeString(id),
  };
  if (normalizeString(provider) !== '189') return body;
  const idRaw = normalizeString(id);
  const parts = idRaw.split('*');
  const shareId = parts.length >= 2 ? normalizeString(parts[1]) : '';
  const accessMap = panMock189AccessByShareId && typeof panMock189AccessByShareId === 'object'
    ? panMock189AccessByShareId
    : {};
  const mappedAccessCode =
    shareId && typeof accessMap[shareId] === 'string' ? normalizeString(accessMap[shareId]) : '';
  const extracted = extractTianyiShareCodeAndAccessCode(normalizeString(flag), normalizeString(rawName));
  return {
    id: idRaw,
    accessCode: mappedAccessCode || normalizeString(extracted && extracted.accessCode),
  };
};

export const requestBuiltinPanPlay = async ({
  provider,
  flag,
  id,
  rawName,
  tvUser,
  panMock189AccessByShareId,
} = {}) => {
  const routes = {
    quark: '/api/pan/quark/play',
    uc: '/api/pan/uc/play',
    baidu: '/api/pan/baidu/play',
    '139': '/api/pan/139/play',
    '189': '/api/pan/189/play',
  };
  const path = routes[normalizeString(provider)] || '';
  if (!path) throw new Error('不支持的网盘源');
  const body = resolveBuiltinPanPlayBody({
    provider,
    flag,
    id,
    rawName,
    panMock189AccessByShareId,
  });
  const username = normalizeString(tvUser);
  const headers = { 'Content-Type': 'application/json' };
  if (username) headers['X-TV-User'] = username;
  const resp = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data || data.ok === false) {
    throw new Error(data && data.message ? String(data.message) : `HTTP ${resp.status}`);
  }
  return data;
};

export const applyPlaybackProxyChain = async ({
  apiBase,
  tvUser,
  sourceUrl,
  playUrl,
  playHeaders,
  preferredPan,
  runtimeSettings,
  selectedGoProxyBase,
} = {}) => {
  let finalUrl = normalizeString(playUrl);
  let finalHeaders = playHeaders && typeof playHeaders === 'object' ? playHeaders : {};
  let goProxyBase = '';
  if (!finalUrl) return { url: '', headers: {}, goProxyBase: '' };
  const settings = runtimeSettings && typeof runtimeSettings === 'object' ? runtimeSettings : null;
  if (hasNonEmptyHeaders(finalHeaders) && settings && settings.goProxyEnabled) {
    try {
      const out = await maybeUseGoProxyForPlayback({
        playUrl: finalUrl,
        playHeaders: finalHeaders,
        goProxyEnabled: !!settings.goProxyEnabled,
        goProxyServers: settings.goProxyServers,
        preferredPan,
        selectedBase: selectedGoProxyBase,
      });
      if (out && normalizeString(out.url)) {
        finalUrl = normalizeString(out.url);
        finalHeaders = out.headers && typeof out.headers === 'object' ? out.headers : {};
        goProxyBase = normalizeString(out.goProxyBase);
      }
    } catch (_error) {}
  }
  if (hasNonEmptyHeaders(finalHeaders) && isProbablyM3U8Url(finalUrl)) {
    try {
      const out = await maybeUseCatM3U8ProxyForPlayback({
        apiBase,
        tvUser,
        playUrl: finalUrl,
        playHeaders: finalHeaders,
      });
      if (out && normalizeString(out.url)) {
        finalUrl = normalizeString(out.url);
        finalHeaders = out.headers && typeof out.headers === 'object' ? out.headers : {};
      }
    } catch (_error) {}
  }
  if (hasNonEmptyHeaders(finalHeaders)) {
    try {
      const out = await registerCatProxyToken({
        apiBase,
        tvUser,
        url: normalizeString(sourceUrl) || finalUrl,
        headers: finalHeaders,
      });
      if (out && normalizeString(out.proxyUrl)) {
        finalUrl = normalizeString(out.proxyUrl);
        finalHeaders = {};
      }
    } catch (_error) {
      const localProxyUrl = buildLocalProxyPlaybackUrl({
        apiBase,
        sourceUrl: normalizeString(sourceUrl) || finalUrl,
        headers: finalHeaders,
      });
      if (localProxyUrl) {
        finalUrl = localProxyUrl;
        finalHeaders = {};
      }
    }
  }
  return { url: finalUrl, headers: finalHeaders, goProxyBase };
};

export const executeResolvedSitePlayback = async ({
  runtimeSettings,
  bootstrapUser,
  siteItem,
  panEntry,
  segment,
  selectionKey,
  apiBase,
  forceProxy = false,
  selectedGoProxyBase = '',
} = {}) => {
  const item = siteItem && typeof siteItem === 'object' ? siteItem : null;
  const pan = panEntry && typeof panEntry === 'object' ? panEntry : null;
  const targetSegment = segment && typeof segment === 'object' ? segment : null;
  const settings = runtimeSettings && typeof runtimeSettings === 'object' ? runtimeSettings : null;
  const resolvedApiBase = normalizeString(apiBase) || normalizecatpawrunnerApiBase(settings && settings.catpawrunnerApiBase);
  if (!item || !pan || !targetSegment || !normalizeString(targetSegment.episodeUrl) || !resolvedApiBase) {
    throw new Error('播放参数不完整');
  }
  const tvUser = normalizeString(bootstrapUser);
  const spiderApi = normalizeString(item && item.spiderApi);
  const siteIdMatch = /^\/([a-f0-9]{10})\/spider\//.exec(spiderApi);
  const siteId = siteIdMatch && siteIdMatch[1] ? normalizeString(siteIdMatch[1]) : '';
  const provider = normalizeString(pan && pan.provider);
  const flag = normalizeString(pan && pan.label);
  const detailData = item && item.detailData && typeof item.detailData === 'object' ? item.detailData : {};
  let raw;
  if (provider) {
    raw = await requestBuiltinPanPlay({
      provider,
      flag,
      id: targetSegment.episodeUrl,
      rawName: targetSegment.rawName,
      tvUser,
      panMock189AccessByShareId:
        detailData.panMock189AccessByShareId && typeof detailData.panMock189AccessByShareId === 'object'
          ? detailData.panMock189AccessByShareId
          : {},
    });
  } else {
    raw = await requestCatPlay({
      apiBase: resolvedApiBase,
      username: tvUser,
      payload: {
        flag,
        id: targetSegment.episodeUrl,
        siteApi: spiderApi,
        ...(siteId ? { siteId } : {}),
      },
    });
  }
  const rewritten = rewritePlayPayloadUrls(raw, resolvedApiBase, tvUser);
  const payload = normalizePlayPayload(rewritten);
  const rawHeaders = payload && payload.header && typeof payload.header === 'object' ? payload.header : {};
  const resolvedPlay = resolvePlayTargetForPlayback({ payload, rawHeaders });
  let finalUrl = normalizeString(resolvedPlay && resolvedPlay.url);
  let finalHeaders = resolvedPlay && resolvedPlay.headers && typeof resolvedPlay.headers === 'object'
    ? resolvedPlay.headers
    : {};
  if (!finalUrl) throw new Error('无可用播放地址');
  const preferredPan = (() => {
    const key = normalizeString(provider).toLowerCase();
    if (key === 'baidu') return 'baidu';
    if (key === 'quark' || key === 'uc') return 'quark';
    return '';
  })();
  const sourceUrl = normalizeString(resolvedPlay && resolvedPlay.proxySourceUrl) || finalUrl;
  let goProxyBase = '';
  if (forceProxy) {
    const proxied = await applyPlaybackProxyChain({
      apiBase: resolvedApiBase,
      tvUser,
      sourceUrl,
      playUrl: finalUrl,
      playHeaders: finalHeaders,
      preferredPan,
      runtimeSettings: settings,
      selectedGoProxyBase,
    });
    finalUrl = normalizeString(proxied && proxied.url);
    finalHeaders = proxied && proxied.headers && typeof proxied.headers === 'object'
      ? proxied.headers
      : {};
    goProxyBase = normalizeString(proxied && proxied.goProxyBase);
    if (!finalUrl) throw new Error('无可用播放地址');
  }
  const lastGoProxyCandidate = {
    apiBase: resolvedApiBase,
    tvUser,
    url: finalUrl,
    sourceUrl,
    headers: finalHeaders,
    preferredPan,
    enabled: hasNonEmptyHeaders(finalHeaders),
  };
  const pendingProxyRetry = hasNonEmptyHeaders(finalHeaders)
    ? {
      selectionKey: normalizeString(selectionKey),
      apiBase: resolvedApiBase,
      tvUser,
      url: finalUrl,
      sourceUrl,
      headers: finalHeaders,
      preferredPan,
    }
    : null;
  return {
    playerUrl: finalUrl,
    playerHeaders: finalHeaders,
    goProxyBase,
    lastGoProxyCandidate,
    pendingProxyRetry,
  };
};

export const executeProxyRetryPlayback = async ({
  candidate,
  runtimeSettings,
  selectedGoProxyBase,
} = {}) => {
  const target = candidate && typeof candidate === 'object' ? candidate : null;
  if (!target || !normalizeString(target.url)) {
    return { ok: false, playerUrl: '', playerHeaders: {}, goProxyBase: '' };
  }
  const out = await applyPlaybackProxyChain({
    apiBase: target.apiBase,
    tvUser: target.tvUser,
    sourceUrl: target.sourceUrl,
    playUrl: target.url,
    playHeaders: target.headers,
    preferredPan: target.preferredPan,
    runtimeSettings,
    selectedGoProxyBase,
  });
  const nextUrl = normalizeString(out && out.url);
  if (!nextUrl) {
    return { ok: false, playerUrl: '', playerHeaders: {}, goProxyBase: '' };
  }
  return {
    ok: true,
    playerUrl: nextUrl,
    playerHeaders: out && out.headers && typeof out.headers === 'object' ? out.headers : {},
    goProxyBase: normalizeString(out && out.goProxyBase),
  };
};

export const isProbablyM3U8Url = (value) => {
  const raw = normalizeString(value);
  if (!raw) return false;
  try {
    const url = new URL(raw, window.location.href);
    const hinted = normalizeString(url.searchParams.get('__tv_fmt')).toLowerCase();
    if (hinted === 'm3u8' || hinted === 'hls') return true;
    return String(url.pathname || '').toLowerCase().endsWith('.m3u8');
  } catch (_error) {
    const noQuery = raw.split('#')[0].split('?')[0].toLowerCase();
    return noQuery.endsWith('.m3u8');
  }
};

const fetchM3U8Text = async ({ url, tvUser }) => {
  const target = normalizeString(url);
  if (!target) throw new Error('missing m3u8 url');
  const safeUser = normalizeString(tvUser);
  const resp = await fetch(target, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    headers: safeUser ? { 'X-TV-User': safeUser } : {},
  });
  if (!resp.ok) throw new Error(`m3u8 http ${resp.status}`);
  return await resp.text();
};

const parseM3U8FirstUrls = (text) => {
  const lines = String(text || '').split(/\r?\n/);
  let firstUri = '';
  let keyUri = '';
  for (let i = 0; i < lines.length; i += 1) {
    const current = normalizeString(lines[i]);
    if (!current) continue;
    if (current.startsWith('#')) {
      if (!keyUri && /^#EXT-X-KEY\b/i.test(current) && /URI\s*=\s*"/i.test(current)) {
        const match = /URI\s*=\s*"([^"]+)"/i.exec(current);
        if (match && match[1]) keyUri = normalizeString(match[1]);
      }
      continue;
    }
    if (!firstUri) firstUri = current;
    if (firstUri && keyUri) break;
  }
  return { firstUri, keyUri };
};

const buildProbeRequestHeaders = (rawHeaders) => {
  const out = { Range: 'bytes=0-0' };
  const headers = rawHeaders && typeof rawHeaders === 'object' ? rawHeaders : {};
  const blocked = new Set(['origin', 'referer', 'host', 'cookie', 'user-agent', 'content-length', 'content-encoding', 'accept-encoding', 'connection', 'range']);
  Object.keys(headers).forEach((key) => {
    const normalizedKey = normalizeString(key);
    if (!normalizedKey) return;
    const lower = normalizedKey.toLowerCase();
    if (blocked.has(lower) || lower.startsWith('sec-')) return;
    const value = headers[key];
    const text = Array.isArray(value) ? normalizeString(value[0]) : normalizeString(value);
    if (!text) return;
    out[normalizedKey] = text;
  });
  return out;
};

const probeFetchSmall = async (urlString, timeoutMs = 6000, requestHeaders = {}) => {
  const target = normalizeString(urlString);
  if (!target) return { ok: false, message: 'missing url' };
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = setTimeout(() => {
    try {
      if (controller) controller.abort();
    } catch (_error) {}
  }, timeoutMs);
  try {
    const resp = await fetch(target, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: buildProbeRequestHeaders(requestHeaders),
      signal: controller ? controller.signal : undefined,
    });
    if (!resp || !resp.ok) return { ok: false, message: `http ${resp && resp.status ? resp.status : 0}` };
    return { ok: resp.status === 200 || resp.status === 206, message: '' };
  } catch (error) {
    return { ok: false, message: error && error.name === 'AbortError' ? 'timeout' : (error && error.message ? String(error.message) : 'fetch failed') };
  } finally {
    clearTimeout(timer);
  }
};

export const registerCatM3U8 = async ({ apiBase, tvUser, url, headers }) => {
  const base = normalizecatpawrunnerApiBase(apiBase);
  if (!base) throw new Error('catpawrunner 接口地址未设置');
  const target = new URL('api/m3u8/register', base);
  const safeUser = normalizeString(tvUser);
  const resp = await fetch(target.toString(), {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      ...(safeUser ? { 'X-TV-User': safeUser } : {}),
    },
    body: JSON.stringify({
      url: normalizeString(url),
      headers: headers && typeof headers === 'object' ? headers : {},
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data || data.ok === false) {
    throw new Error(data && (data.message || data.error) ? String(data.message || data.error) : `HTTP ${resp.status}`);
  }
  const indexPath = normalizeString(data && data.index);
  const proxyPath = normalizeString(data && data.proxy);
  if (!indexPath || !proxyPath) throw new Error('catpawrunner m3u8 register 返回无效');
  return {
    indexUrl: new URL(indexPath.replace(/^\//, ''), base).toString(),
    proxyUrl: new URL(proxyPath.replace(/^\//, ''), base).toString(),
  };
};

export const maybeUseCatM3U8ProxyForPlayback = async ({ apiBase, tvUser, playUrl, playHeaders }) => {
  if (!isProbablyM3U8Url(playUrl) || !apiBase) return null;
  if (!hasNonEmptyHeaders(playHeaders)) {
    try {
      await fetchM3U8Text({ url: playUrl, tvUser });
      return { url: playUrl, headers: playHeaders || {} };
    } catch (_error) {}
  }
  const { indexUrl, proxyUrl } = await registerCatM3U8({ apiBase, tvUser, url: playUrl, headers: playHeaders });
  let text = '';
  try {
    text = await fetchM3U8Text({ url: indexUrl, tvUser });
  } catch (_error) {
    return { url: proxyUrl, headers: {} };
  }
  const { firstUri, keyUri } = parseM3U8FirstUrls(text);
  if (!firstUri) return { url: proxyUrl, headers: {} };
  if (String(firstUri).toLowerCase().endsWith('.m3u8')) return { url: proxyUrl, headers: {} };
  if (keyUri) {
    const keyProbe = await probeFetchSmall(keyUri, 6000, playHeaders);
    if (!keyProbe.ok) return { url: proxyUrl, headers: {} };
  }
  const segProbe = await probeFetchSmall(firstUri, 6000, playHeaders);
  if (!segProbe.ok) return { url: proxyUrl, headers: {} };
  return { url: indexUrl, headers: {} };
};
