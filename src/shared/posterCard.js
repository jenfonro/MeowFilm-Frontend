export const TV_CARD_PLAY_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" class="tv-card-play-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>';

function normalizeProxyBase(base) {
  const raw = typeof base === 'string' ? base.trim() : '';
  if (!raw) return '';
  if (/[?&=]$/.test(raw)) return raw;
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function normalizeImageUrl(url) {
  const raw = typeof url === 'string' ? url.trim() : '';
  if (!raw) return '';
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('http://')) return `https://${raw.slice('http://'.length)}`;
  return raw;
}

function isAllowedDoubanImageHost(hostname) {
  const host = typeof hostname === 'string' ? hostname.trim().toLowerCase() : '';
  if (!host) return false;
  if (/^img\d+\.doubanio\.com$/.test(host)) return true;
  if (host === 'img3.doubanio.com') return true;
  if (host === 'img.doubanio.cmliussss.net') return true;
  if (host === 'img.doubanio.cmliussss.com') return true;
  return false;
}

function swapDoubanImageHost(urlStr, nextHost) {
  const original = normalizeImageUrl(urlStr);
  const target = typeof nextHost === 'string' ? nextHost.trim() : '';
  if (!original || !target) return original;
  try {
    const u = new URL(original);
    if (!isAllowedDoubanImageHost(u.hostname || '')) return original;
    u.protocol = 'https:';
    u.hostname = target;
    return u.toString();
  } catch (_e) {
    return original.replace(
      /(img\d+\.doubanio\.com|img3\.doubanio\.com|img\.doubanio\.cmliussss\.(net|com))/gi,
      target
    );
  }
}

function readDoubanImgConfigFromDom() {
  if (typeof document === 'undefined') return { mode: 'direct-browser', custom: '' };
  const el = document.getElementById('homeDoubanConfig');
  if (!el) return { mode: 'direct-browser', custom: '' };
  const rawMode = (el.getAttribute('data-douban-img-proxy') || 'direct-browser').trim();
  const mode = rawMode.split(/[\\s,]+/g)[0] || 'direct-browser';
  const custom = (el.getAttribute('data-douban-img-custom') || '').trim();
  return { mode, custom };
}

export function processPosterUrl(posterUrl) {
  const original = normalizeImageUrl(posterUrl);
  if (!original) return '';

  let host = '';
  try {
    host = new URL(original).hostname || '';
  } catch (_e) {
    host = '';
  }
  if (!isAllowedDoubanImageHost(host) && !original.includes('doubanio')) return original;

  const cfg = readDoubanImgConfigFromDom();
  const mode = cfg && typeof cfg.mode === 'string' ? cfg.mode.trim() : 'direct-browser';

  if (mode === 'server-proxy') return `/api/douban/image?url=${encodeURIComponent(original)}`;
  if (mode === 'custom') {
    const base = normalizeProxyBase(cfg && typeof cfg.custom === 'string' ? cfg.custom : '');
    return base ? `${base}${encodeURIComponent(original)}` : original;
  }

  switch (mode) {
    case 'douban-cdn-ali':
    case 'img3':
      return swapDoubanImageHost(original, 'img3.doubanio.com');
    case 'cdn-tx':
    case 'cmliussss-cdn-tencent':
      return swapDoubanImageHost(original, 'img.doubanio.cmliussss.net');
    case 'cdn-ali':
    case 'cmliussss-cdn-ali':
      return swapDoubanImageHost(original, 'img.doubanio.cmliussss.com');
    default:
      return original;
  }
}

export function bindActivate(el, activate) {
  if (!el || typeof activate !== 'function') return;
  el.addEventListener('click', activate);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });
}

export function appendTvCardHoverOverlays(posterWrap) {
  if (!posterWrap) return;
  const hoverOverlay = document.createElement('div');
  hoverOverlay.className = 'tv-card-hover-gradient';
  posterWrap.appendChild(hoverOverlay);

  const playOverlay = document.createElement('div');
  playOverlay.className = 'tv-card-hover-play';
  playOverlay.innerHTML = TV_CARD_PLAY_ICON_SVG;
  posterWrap.appendChild(playOverlay);
}

export function appendLazyPosterImage(posterWrap, { poster, alt, io, placeholder = true } = {}) {
  if (!posterWrap) return;
  const original = typeof poster === 'string' ? poster.trim() : '';
  if (!original) return;
  const normalized = normalizeImageUrl(original);
  if (!normalized) return;
  const url = processPosterUrl(normalized);

  let placeholderEl = null;
  if (placeholder) {
    placeholderEl = document.createElement('div');
    placeholderEl.className = 'absolute inset-0 bg-gray-300 dark:bg-white/10 animate-pulse';
    posterWrap.appendChild(placeholderEl);
  }

  const img = document.createElement('img');
  img.dataset.src = url;
  img.dataset.originalSrc = normalized;
  img.dataset.posterFallback = '0';
  img.alt = typeof alt === 'string' ? alt : '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.referrerPolicy = 'no-referrer';
  img.className =
    'w-full h-full object-cover opacity-0 transition-opacity transition-transform duration-300 ease-out group-hover:scale-105';
  img.addEventListener(
    'load',
    () => {
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
      if (placeholderEl) placeholderEl.remove();
    },
    { once: true }
  );
  img.addEventListener(
    'error',
    () => {
      const tried = img.dataset.posterFallback === '1';
      const orig = img.dataset.originalSrc || '';
      if (!tried && orig && orig.includes('doubanio')) {
        img.dataset.posterFallback = '1';
        const rewritten = processPosterUrl(orig);
        const apiTarget =
          rewritten && typeof rewritten === 'string' && !rewritten.startsWith('/api/')
            ? rewritten
            : orig;
        img.setAttribute('src', `/api/douban/image?url=${encodeURIComponent(apiTarget)}`);
        return;
      }
      if (placeholderEl) placeholderEl.remove();
      img.remove();
    },
    { once: false }
  );
  posterWrap.appendChild(img);

  if (io) io.observe(img);
  else img.setAttribute('src', url);
}

export function createPosterCard({
  wrapperEl,
  wrapperClass,
  cardClass = 'douban-card group w-full',
  io = null,
  detail,
  onActivate,
  title,
  poster,
  remark,
  siteName,
  cornerBadgeText,
  cornerBadgeTitle,
  placeholder = true,
  overlays = true,
} = {}) {
  const d = detail && typeof detail === 'object' ? detail : null;
  const activateOverride = typeof onActivate === 'function' ? onActivate : null;
  if (!d && !activateOverride) return null;

  const wrapper = wrapperEl || document.createElement('div');
  if (wrapperClass) wrapper.className = wrapperClass;
  else if (!wrapperEl) wrapper.className = 'w-full';

  const card = document.createElement('div');
  card.className = cardClass;
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');

  const activate = () => {
    try {
      if (activateOverride) {
        activateOverride();
        return;
      }
      if (typeof window === 'undefined') return;
      window.dispatchEvent(new CustomEvent('tv:open-play', { detail: d }));
    } catch (_e) {}
  };
  bindActivate(card, activate);

  const posterWrap = document.createElement('div');
  posterWrap.className = 'douban-poster';
  appendLazyPosterImage(posterWrap, { poster, alt: title, io, placeholder });
  if (overlays) appendTvCardHoverOverlays(posterWrap);

  const cbText = typeof cornerBadgeText === 'string' ? cornerBadgeText.trim() : '';
  if (cbText) {
    const badge = document.createElement('div');
    badge.className = 'douban-rate tv-aggregate-source-count';
    badge.textContent = cbText;
    const cbTitle = typeof cornerBadgeTitle === 'string' ? cornerBadgeTitle.trim() : '';
    if (cbTitle) badge.title = cbTitle;
    posterWrap.appendChild(badge);
  }

  const r = typeof remark === 'string' ? remark.trim() : '';
  if (r) {
    const tag = document.createElement('div');
    tag.className = 'tv-card-badge';
    tag.textContent = r;
    if (cbText) tag.classList.add('tv-card-badge--left');
    posterWrap.appendChild(tag);
  }

  const titleEl = document.createElement('div');
  titleEl.className = 'douban-card-title';
  titleEl.textContent = typeof title === 'string' ? title : '';

  card.appendChild(posterWrap);
  card.appendChild(titleEl);

  const sn = typeof siteName === 'string' ? siteName.trim() : '';
  if (sn) {
    const siteBadgeWrap = document.createElement('div');
    siteBadgeWrap.className = 'tv-site-badge-wrap';

    const siteBadge = document.createElement('div');
    siteBadge.className = 'tv-site-badge';
    siteBadge.title = sn;
    siteBadge.textContent = sn;
    siteBadgeWrap.appendChild(siteBadge);
    card.appendChild(siteBadgeWrap);
  }

  wrapper.appendChild(card);
  return wrapper;
}
