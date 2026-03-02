import { pauseCatLowPriority } from './catpawopen';
import { normalizeDoubanImageProxyMode, normalizeImageUrl, rewriteDoubanImageUrl } from './doubanImage';

export const TV_CARD_PLAY_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" class="tv-card-play-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>';

function readDoubanImgConfigFromDom() {
  if (typeof document === 'undefined') return { mode: 'server-proxy', custom: '' };
  const el = document.getElementById('homeDoubanConfig');
  if (!el) return { mode: 'server-proxy', custom: '' };
  const rawMode = (el.getAttribute('data-douban-img-proxy') || 'server-proxy').trim();
  const mode = normalizeDoubanImageProxyMode(rawMode, 'server-proxy');
  const custom = (el.getAttribute('data-douban-img-custom') || '').trim();
  return { mode, custom };
}

export function processPosterUrl(posterUrl) {
  const original = normalizeImageUrl(posterUrl);
  if (!original) return '';

  const cfg = readDoubanImgConfigFromDom();
  return rewriteDoubanImageUrl(original, {
    mode: cfg && typeof cfg.mode === 'string' ? cfg.mode : 'server-proxy',
    custom: cfg && typeof cfg.custom === 'string' ? cfg.custom : '',
    defaultMode: 'server-proxy',
  });
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
      // Prioritize detail/play by pausing low-priority (search) spider requests for a short window.
      // The play page will take over priority handling; this is just to stop new search dispatches immediately.
      try {
        const release = pauseCatLowPriority();
        if (typeof window !== 'undefined') {
          const prev = window.__tvLowPriorityPauseRelease;
          if (typeof prev === 'function') {
            try {
              prev();
            } catch (_e) {}
          }
          window.__tvLowPriorityPauseRelease = release;
          window.__tvLowPriorityPauseAt = Date.now();
        }
      } catch (_e) {}
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
