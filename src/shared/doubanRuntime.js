import { buildDoubanDataUrl } from './bootstrap';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};

const requestJsonWithTimeout = async (url, { timeoutMs = 12000, mode = 'server-proxy' } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json, text/plain, */*' },
      mode: mode === 'server-proxy' ? 'same-origin' : 'cors',
      credentials: mode === 'server-proxy' ? 'same-origin' : 'omit',
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const message = data && (data.error || data.message) ? String(data.error || data.message) : `HTTP ${resp.status}`;
      throw new Error(message);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
};

const requestDoubanJson = async (path, settings = {}, { timeoutMs = 12000 } = {}) => {
  const { url, mode } = buildDoubanDataUrl(path, settings || {});
  if (!url) throw new Error('Missing douban api url');
  return requestJsonWithTimeout(url, { timeoutMs, mode });
};

const requestDoubanSearchJson = async (keyword, { timeoutMs = 12000 } = {}) => {
  const q = normalizeString(keyword);
  if (!q) throw new Error('Missing douban search keyword');
  return requestJsonWithTimeout(`/api/douban/search?q=${encodeURIComponent(q)}`, { timeoutMs, mode: 'server-proxy' });
};

const normalizeForPrefixCompare = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[\s\-_—–·|:：/\\()[\]{}<>【】（）「」『』《》、，,。.！!？?~～]+/g, '')
    .trim();

const extractYearFromText = (text) => {
  const s = typeof text === 'string' ? text : String(text || '');
  const m = s.match(/\b(19|20)\d{2}\b/);
  if (!m) return 0;
  return normalizeInt(m[0]);
};

const extractDoubanAliasesFromDetail = (detail) => {
  const aliases = [];
  const push = (value) => {
    const text = normalizeString(value);
    if (text) aliases.push(text);
  };
  push(detail && detail.title);
  push(detail && detail.original_title);
  (Array.isArray(detail && detail.localized_name) ? detail.localized_name : []).forEach(push);
  (Array.isArray(detail && detail.aka) ? detail.aka : []).forEach(push);
  return Array.from(new Set(aliases));
};

const extractEpisodeRangeHint = (text) => {
  const raw = normalizeString(text);
  if (!raw) return null;
  const m = raw.match(/(\d{1,4})\s*[-~～至]\s*(\d{1,4})/);
  if (!m) return null;
  const start = normalizeInt(m[1]);
  const end = normalizeInt(m[2]);
  if (start <= 0 || end <= 0 || end < start) return null;
  return { start, end };
};

const extractDoubanAirDateFromDetail = (detail) => {
  const pubdate = Array.isArray(detail && detail.pubdate) ? detail.pubdate : [];
  for (let i = 0; i < pubdate.length; i += 1) {
    const match = String(pubdate[i] || '').match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
    if (match) return match[0];
  }
  return '';
};

const stripLeadingByNormalizedPrefix = (text, prefix) => {
  const raw = typeof text === 'string' ? text : String(text || '');
  const want = normalizeForPrefixCompare(prefix);
  if (!raw || !want || want.length < 2) return raw.trim();
  let acc = '';
  let endIdx = 0;
  for (let i = 0; i < raw.length && acc.length < want.length; i += 1) {
    const ch = raw[i];
    const norm = normalizeForPrefixCompare(ch);
    if (!norm) {
      endIdx = i + 1;
      continue;
    }
    acc += norm;
    endIdx = i + 1;
  }
  if (acc !== want) return raw.trim();
  return raw
    .slice(endIdx)
    .replace(/^[\s\-_—–·|:：/\\]+/g, '')
    .trim();
};

const sanitizeDoubanDisplayTitle = (title, keywordBase) => {
  const t = normalizeString(title);
  const baseRaw = normalizeString(keywordBase);
  if (!t || !baseRaw) return t;
  const base = baseRaw.replace(/[(（]\s*(19|20)\d{2}\s*[)）]/g, '').split(/\s+/g)[0].trim();
  if (!base) return t;
  return stripLeadingByNormalizedPrefix(t, base) || t;
};

const computeDoubanDisplayAndMarker = (title, aliases = []) => {
  const rawTitle = normalizeString(title);
  const all = [rawTitle, ...aliases.map(normalizeString).filter(Boolean)];
  for (let i = 0; i < all.length; i += 1) {
    const value = all[i];
    const seasonMatch = value.match(/第\s*([0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})\s*季/);
    if (seasonMatch) {
      return { displayLabel: rawTitle, markerKind: 'season', markerIndex: i + 1 };
    }
    const bangMatch = value.match(/年番\s*([0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})/);
    if (bangMatch) {
      return { displayLabel: rawTitle, markerKind: 'yearbang', markerIndex: i + 1 };
    }
  }
  return { displayLabel: rawTitle, markerKind: '', markerIndex: 0 };
};

const doubanSeasonMetaCacheByTmdbId = new Map();

const normalizeSearchCandidates = (payload) => {
  const subjects = Array.isArray(payload?.subjects?.items) ? payload.subjects.items : [];
  const smartBox = Array.isArray(payload?.smart_box) ? payload.smart_box : [];
  const items = [];
  const push = (it) => {
    const typ = normalizeString(it && it.target_type);
    if (typ !== 'tv') return;
    const target = it && it.target && typeof it.target === 'object' ? it.target : {};
    const title = normalizeString(target.title);
    const doubanId = normalizeString(target.id || it?.target_id);
    if (!title || !doubanId) return;
    items.push({
      doubanId,
      title,
      year: normalizeString(target.year),
      subtitle: normalizeString(target.card_subtitle || target.cardSubtitle || target.subtitle || target.sub_title),
      nullRatingReason: normalizeString(target.null_rating_reason || target.nullRatingReason),
      isReleased: typeof target.is_released === 'boolean' ? target.is_released : (typeof target.isReleased === 'boolean' ? target.isReleased : null),
      canRate: typeof target.can_rate === 'boolean' ? target.can_rate : (typeof target.canRate === 'boolean' ? target.canRate : null),
      vendorCount: normalizeInt(target.vendor_count || target.vendorCount),
      pubdate: Array.isArray(target.pubdate) ? target.pubdate.map((x) => normalizeString(x)).filter(Boolean) : [],
    });
  };
  subjects.forEach(push);
  smartBox.forEach(push);
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.doubanId)) return false;
    seen.add(item.doubanId);
    return true;
  });
};

const isLikelyUnreleased = (item) => {
  const subtitle = normalizeString(item && item.subtitle);
  if (subtitle && /(尚未上映|尚未播出|即将上映|即将播出)/.test(subtitle)) return true;
  const reason = normalizeString(item && item.nullRatingReason);
  if (reason && /(尚未上映|尚未播出)/.test(reason)) return true;
  if (item && item.isReleased === false) return true;
  if (item && item.canRate === false && normalizeInt(item.vendorCount) <= 0) return true;
  return false;
};

const isStrictTitleMatch = (title, keyword) => {
  const t = normalizeString(title);
  const q = normalizeString(keyword);
  if (!t || !q) return false;
  const baseKey = normalizeForPrefixCompare(q.replace(/[(（]\s*(19|20)\d{2}\s*[)）]/g, '').split(/\s+/g)[0]);
  let titleKey = normalizeForPrefixCompare(t).replace(/(19|20)\d{2}$/g, '');
  if (!baseKey || baseKey.length < 2) return true;
  if (!titleKey.startsWith(baseKey)) return false;
  const tail = titleKey.slice(baseKey.length);
  if (!tail) return true;
  if (/^第(?:[0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})季$/.test(tail)) return true;
  if (/^年番(?:[0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})$/.test(tail)) return true;
  return false;
};

const shouldUseManagedDoubanSearch = (settings = {}) => !!settings?.doubanSearchCookieConfigured;

export const fetchDoubanSeasonMetaCached = async ({ keyword = '', tmdbId = 0, settings = {}, maxSeasons = 10 } = {}) => {
  const safeKeyword = normalizeString(keyword);
  const safeTmdbId = normalizeInt(tmdbId);
  if (!safeKeyword || safeTmdbId <= 0) throw new Error('豆瓣元数据参数无效');

  const byTmdbId = doubanSeasonMetaCacheByTmdbId.get(safeTmdbId);
  if (byTmdbId && byTmdbId.status === 'resolved') return byTmdbId.data;
  if (byTmdbId && byTmdbId.status === 'pending') return byTmdbId.promise;

  const promise = (async () => {
    const searchPayload = shouldUseManagedDoubanSearch(settings)
      ? await requestDoubanSearchJson(safeKeyword, { timeoutMs: 12000 })
      : await requestDoubanJson(
        `/rexxar/api/v2/search?q=${encodeURIComponent(safeKeyword)}&type=tv&start=0&count=20`,
        settings,
        { timeoutMs: 12000 }
      );
    const candidates = normalizeSearchCandidates(searchPayload)
      .filter((item) => isStrictTitleMatch(item.title, safeKeyword))
      .filter((item) => !isLikelyUnreleased(item))
      .slice(0, Math.max(1, Math.min(50, normalizeInt(maxSeasons) || 10)));
    if (!candidates.length) return { seasons: [] };

    const results = await Promise.all(candidates.map(async (item) => {
      const detail = await requestDoubanJson(`/rexxar/api/v2/tv/${encodeURIComponent(item.doubanId)}`, settings, { timeoutMs: 12000 });
      const episodeCount = normalizeInt(detail && detail.episodes_count);
      if (episodeCount <= 0) return null;
      const aliases = extractDoubanAliasesFromDetail(detail);
      const cleanedTitle = sanitizeDoubanDisplayTitle(item.title, safeKeyword);
      const mergedAliases = [item.title, cleanedTitle, ...aliases].filter(Boolean);
      const rangeHint = mergedAliases.map(extractEpisodeRangeHint).find(Boolean) || null;
      const display = computeDoubanDisplayAndMarker(cleanedTitle || item.title, mergedAliases);
      return {
        season: 0,
        episodeCount,
        doubanId: item.doubanId,
        title: item.title,
        aliases: mergedAliases,
        hints: rangeHint ? { episodeRange: rangeHint } : null,
        airDate: extractDoubanAirDateFromDetail(detail),
        displayLabel: normalizeString(display.displayLabel || cleanedTitle || item.title),
        markerKind: normalizeString(display.markerKind),
        markerIndex: normalizeInt(display.markerIndex),
      };
    }));

    const seasonsRaw = results.filter(Boolean);
    const hasAnyDate = seasonsRaw.some((item) => normalizeString(item && item.airDate));
    const hasAnyMarker = !hasAnyDate && seasonsRaw.some((item) => normalizeString(item && item.markerKind) && normalizeInt(item && item.markerIndex) > 0);
    const hasAnyRange = !hasAnyDate && !hasAnyMarker && seasonsRaw.some((item) => normalizeInt(item?.hints?.episodeRange?.start) > 0);

    const seasonsSorted = seasonsRaw.slice().sort((left, right) => {
      if (hasAnyDate) {
        const ad = normalizeString(left && left.airDate);
        const bd = normalizeString(right && right.airDate);
        if (ad && bd && ad !== bd) return ad.localeCompare(bd);
        if (ad && !bd) return -1;
        if (!ad && bd) return 1;
      }
      if (hasAnyMarker) {
        const leftGroup = normalizeString(left && left.markerKind) === 'season' ? 0 : normalizeString(left && left.markerKind) === 'yearbang' ? 1 : 9;
        const rightGroup = normalizeString(right && right.markerKind) === 'season' ? 0 : normalizeString(right && right.markerKind) === 'yearbang' ? 1 : 9;
        if (leftGroup !== rightGroup) return leftGroup - rightGroup;
        const leftIndex = normalizeInt(left && left.markerIndex);
        const rightIndex = normalizeInt(right && right.markerIndex);
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
      }
      if (hasAnyRange) {
        const leftStart = normalizeInt(left?.hints?.episodeRange?.start);
        const rightStart = normalizeInt(right?.hints?.episodeRange?.start);
        if (leftStart !== rightStart) return leftStart - rightStart;
      }
      const leftYear = extractYearFromText(left && left.title);
      const rightYear = extractYearFromText(right && right.title);
      if (leftYear && rightYear && leftYear !== rightYear) return leftYear - rightYear;
      return 0;
    });

    return {
      seasons: seasonsSorted.map((item, index) => ({
        season: index + 1,
        episodeCount: normalizeInt(item && item.episodeCount),
        doubanId: normalizeString(item && item.doubanId),
        title: normalizeString(item && item.title),
        aliases: Array.isArray(item && item.aliases) ? item.aliases.map(normalizeString).filter(Boolean) : [],
        hints: item && typeof item.hints === 'object' ? item.hints : null,
        airDate: normalizeString(item && item.airDate),
        displayLabel: normalizeString(item && item.displayLabel),
      })),
    };
  })()
    .then((data) => {
      doubanSeasonMetaCacheByTmdbId.set(safeTmdbId, { status: 'resolved', data });
      return data;
    })
    .catch((error) => {
      const currentById = doubanSeasonMetaCacheByTmdbId.get(safeTmdbId);
      if (currentById && currentById.promise === promise) {
        doubanSeasonMetaCacheByTmdbId.delete(safeTmdbId);
      }
      throw error;
    });

  doubanSeasonMetaCacheByTmdbId.set(safeTmdbId, { status: 'pending', promise });
  return promise;
};

export const clearDoubanSeasonMetaCache = () => {
  doubanSeasonMetaCacheByTmdbId.clear();
};
