import { fetchBootstrap } from './bootstrap';
import { requestCatSpider } from './catpawrunner';
import { rewriteDoubanImageUrl } from './doubanImage';
import { formatTMDBTVRemark } from './tmdbBadge';
import { fetchTMDBDetailCached } from './tmdbRuntime';

const SEARCH_HISTORY_ENDPOINT = '/api/searchhistory';
const USER_SITES_ENDPOINT = '/api/user/sites';
const SMART_MATCHBLOCK_ITEMS_ENDPOINT = '/api/smart/matchblock/items';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const buildTMDBDataURL = (path, params = {}) => {
  const rel = normalizeString(path).replace(/^\/+/, '');
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value == null) return;
    const text = String(value).trim();
    if (!text) return;
    searchParams.set(key, text);
  });
  const url = `/api/tmdb/${rel}`;
  return searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
};

const requestJson = async (url, options = {}) => {
  const resp = await fetch(url, options);
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const message = data && (data.error || data.message) ? String(data.error || data.message) : `HTTP ${resp.status}`;
    throw new Error(message);
  }
  return data;
};

const normalizeTmdbMediaType = (value) => {
  const raw = normalizeString(value).toLowerCase();
  if (raw === 'movie' || raw === 'tv') return raw;
  if (raw === 'film') return 'movie';
  if (raw === 'series') return 'tv';
  return '';
};

const normalizeForMatch = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '')
    .trim();

const normalizeForGroupKey = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
    .replace(/[\s.\-_,，:：;；!！?？·•/\\|]+/g, '')
    .trim();

const normalizeDisplayTitle = (value) =>
  String(value || '')
    .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
    .replace(/[\s.\-_,，:：;；!！?？·•/\\|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeDisplayTitle = (value) =>
  String(value || '')
    .replace(/[\u200b\u200c\u200d\ufeff]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const buildEmojiCleaner = () => {
  try {
    new RegExp('\\p{Extended_Pictographic}', 'u');
    return (value) =>
      String(value || '')
        .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, '')
        .replace(/[\uFE0E\uFE0F]/g, '');
  } catch (_error) {
    return (value) =>
      String(value || '')
        .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
        .replace(/[\u2600-\u27BF]/g, '')
        .replace(/[\uFE0E\uFE0F]/g, '');
  }
};

const stripEmojiSymbols = buildEmojiCleaner();

const preCleanForRules = (value) => stripEmojiSymbols(sanitizeDisplayTitle(value));

const stripSeasonMarkers = (value) =>
  String(value || '')
    .replace(/第\s*(?:[0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})\s*季/gi, ' ')
    .replace(/(?:^|\s)([0-9０-９]{1,3})\s*季(?![度节])/gi, ' ')
    .replace(/\bS\s*\d{1,2}\b/gi, ' ')
    .replace(/\bSeason\s*\d{1,2}\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stripYearbangMarkers = (value) =>
  String(value || '')
    .replace(/年番\s*(?:[0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stripSeriesVariantMarkers = (value) =>
  stripYearbangMarkers(stripSeasonMarkers(value));

const parseChineseSeasonNo = (rawValue) => {
  const raw = normalizeString(rawValue);
  if (!raw) return 0;
  const digits = raw.replace(/[０-９]/g, (char) => String('０１２３４５６７８９'.indexOf(char)));
  if (/^\d+$/.test(digits)) {
    const parsed = Number.parseInt(digits, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  const map = {
    零: 0,
    〇: 0,
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };
  if (raw === '十') return 10;
  if (raw.includes('十')) {
    const [tensRaw, onesRaw] = raw.split('十');
    const tens = tensRaw ? map[tensRaw] || 0 : 1;
    const ones = onesRaw ? map[onesRaw] || 0 : 0;
    const next = tens * 10 + ones;
    return next > 0 ? next : 0;
  }
  return map[raw] || 0;
};

const extractSeriesVariantMetaFromText = (rawValue) => {
  const text = normalizeString(rawValue);
  if (!text) return { kind: '', index: 0 };
  const cleaned = preCleanForRules(text) || text;
  const matchSeasonEpisode = cleaned.match(/\bS\s*(\d{1,2})\s*E\s*\d{1,5}\b/i);
  if (matchSeasonEpisode && matchSeasonEpisode[1]) {
    const parsed = Number.parseInt(String(matchSeasonEpisode[1]), 10);
    if (Number.isFinite(parsed) && parsed > 0) return { kind: 'season', index: parsed };
  }
  const matchCnSeason = cleaned.match(/(?:第\s*)?([0-9０-９]{1,3}|[一二三四五六七八九十两〇零]{1,6})\s*季/i);
  if (matchCnSeason && matchCnSeason[1]) {
    return { kind: 'season', index: parseChineseSeasonNo(String(matchCnSeason[1])) };
  }
  const matchYearbang = cleaned.match(/年番\s*([0-9０-９]{1,3}|[一二三四五六七八九十两〇零]{1,6})/i);
  if (matchYearbang && matchYearbang[1]) {
    return { kind: 'yearbang', index: parseChineseSeasonNo(String(matchYearbang[1])) };
  }
  if (/年番/i.test(cleaned)) return { kind: 'yearbang', index: 1 };
  return { kind: '', index: 0 };
};

const resolveDisplayedSiteGroupKey = (item, tmdbByGroup, displayMode) => {
  const baseGroupKey = normalizeString(item && item.groupKey);
  if (!baseGroupKey) return '';
  if (displayMode !== 'tmdb' && displayMode !== 'both') return baseGroupKey;
  const title = normalizeString(item && item.title);
  if (!title) return baseGroupKey;
  const strippedTitle = stripSeriesVariantMarkers(preCleanForRules(title) || title);
  if (!strippedTitle || strippedTitle === (preCleanForRules(title) || title)) return baseGroupKey;
  const strippedGroupKey = normalizeForGroupKey(strippedTitle);
  if (!strippedGroupKey) return baseGroupKey;
  const tmdbMatch = tmdbByGroup.get(strippedGroupKey) || null;
  if (!tmdbMatch || tmdbMatch.tmdbType !== 'tv') return baseGroupKey;
  const seasonHint = normalizeInt(item && item.seasonHint);
  const tmdbSeasonCount = normalizeInt(tmdbMatch && tmdbMatch.seasonCount);
  if (seasonHint > 0 && tmdbSeasonCount > 0 && seasonHint > tmdbSeasonCount) return baseGroupKey;
  return strippedGroupKey;
};

const buildCanonicalSearchTitle = (title, compiledRules, { queryTrailingDigits = '', contentKind = 'tv' } = {}) => {
  const base = sanitizeDisplayTitle(title);
  if (!base) return '';
  if (normalizeString(contentKind) === 'movie') return normalizeDisplayTitle(base) || base;
  const preCleaned = preCleanForRules(base) || base;
  const cleaned = sanitizeDisplayTitle(
    applyCleanRules(preCleaned, compiledRules, {
      skipTrailingDigitsRule: !!normalizeString(queryTrailingDigits),
      queryTrailingDigits,
    }) || preCleaned
  );
  const canonical = stripSeriesVariantMarkers(cleaned) || cleaned || base;
  return normalizeDisplayTitle(canonical) || canonical || base;
};

const normalizePatternInput = (value) => {
  const raw = normalizeString(value);
  if (!raw) return null;
  if (raw.startsWith('/') && raw.lastIndexOf('/') > 0) {
    const last = raw.lastIndexOf('/');
    const pattern = raw.slice(1, last).trim();
    const flags = raw.slice(last + 1).trim();
    if (!pattern) return null;
    return { pattern, flags };
  }
  return { pattern: raw, flags: '' };
};

const buildRegexFromInput = (value, { defaultFlags = '', forceGlobal = false } = {}) => {
  const parsed = normalizePatternInput(value);
  if (!parsed || !parsed.pattern) return null;
  let flags = parsed.flags || defaultFlags;
  if (forceGlobal && !flags.includes('g')) flags += 'g';
  try {
    return new RegExp(parsed.pattern, flags);
  } catch (_error) {
    return null;
  }
};

const isTrailingDigitsRuleForQuery = (rule, queryTrailingDigits) => {
  const tailDigits = normalizeString(queryTrailingDigits);
  if (!rule || typeof rule.test !== 'function' || !tailDigits) return false;
  try {
    if (rule.global || rule.sticky) rule.lastIndex = 0;
  } catch (_error) {}
  try {
    const t1 = `x${tailDigits}`;
    const t2 = `x${tailDigits}y`;
    const r1 = t1.replace(rule, '');
    const r2 = t2.replace(rule, '');
    return r1 === 'x' && r2 === t2;
  } catch (_error) {
    return false;
  }
};

const compileCleanRules = (rawRules) => {
  const list = Array.isArray(rawRules) ? rawRules : [];
  return list
    .map((rule) => buildRegexFromInput(rule, { defaultFlags: 'ig', forceGlobal: true }))
    .filter(Boolean);
};

const applyCleanRules = (text, compiledRules, { skipTrailingDigitsRule = false, queryTrailingDigits = '' } = {}) => {
  let out = String(text || '');
  compiledRules.forEach((rule) => {
    if (skipTrailingDigitsRule && isTrailingDigitsRuleForQuery(rule, queryTrailingDigits)) return;
    try {
      if (rule.global || rule.sticky) rule.lastIndex = 0;
      out = out.replace(rule, '');
    } catch (_error) {}
  });
  return out;
};

const computeMatchScoreFactory = (query) => {
  const rawQuery = normalizeString(query);
  const normalizedQuery = normalizeForMatch(rawQuery);
  return (title) => {
    const name = normalizeForMatch(title);
    if (!normalizedQuery || !name) return 0;
    if (name === normalizedQuery) return 1000;
    if (name.startsWith(normalizedQuery)) return 900;
    const index = name.indexOf(normalizedQuery);
    if (index >= 0) {
      const positionBoost = 60 - Math.min(60, index);
      const lengthBoost = 40 - Math.min(40, Math.max(0, name.length - normalizedQuery.length));
      return 800 + positionBoost + lengthBoost;
    }
    const tokens = rawQuery
      .toLowerCase()
      .split(/\s+/g)
      .map((token) => token.trim())
      .filter(Boolean);
    if (tokens.length >= 2) {
      let hits = 0;
      tokens.forEach((token) => {
        if (token && name.includes(token)) hits += 1;
      });
      if (hits) return 600 + hits * 20;
    }
    return 0;
  };
};

const isConfigCenterSite = (site) => {
  const api = normalizeString(site && site.api);
  const key = normalizeString(site && site.key).toLowerCase();
  return api.includes('/spider/baseset/') || key.includes('baseset');
};

const buildSiteOrderMap = (settings = {}) => {
  const fallback = Array.isArray(settings.searchSiteOrder) ? settings.searchSiteOrder : [];
  const orderMap = new Map();
  fallback.forEach((key, index) => {
    const safeKey = normalizeString(key);
    if (safeKey && !orderMap.has(safeKey)) orderMap.set(safeKey, index);
  });
  return orderMap;
};

const compareRepresentative = (candidate, current, context) => {
  if (!current) return -1;
  if (candidate.score !== current.score) return current.score - candidate.score;
  const candidateTitleLength = candidate.title ? candidate.title.length : 0;
  const currentTitleLength = current.title ? current.title.length : 0;
  if (candidateTitleLength !== currentTitleLength) return candidateTitleLength - currentTitleLength;
  const preferredCoverSite = normalizeString(context && context.searchCoverSite);
  const siteOrderMap = context && context.siteOrderMap instanceof Map ? context.siteOrderMap : new Map();
  const candidatePreferred = preferredCoverSite && candidate.siteKey === preferredCoverSite ? 1 : 0;
  const currentPreferred = preferredCoverSite && current.siteKey === preferredCoverSite ? 1 : 0;
  if (candidatePreferred !== currentPreferred) return currentPreferred - candidatePreferred;
  const candidateOrder = siteOrderMap.has(candidate.siteKey) ? siteOrderMap.get(candidate.siteKey) : 999999;
  const currentOrder = siteOrderMap.has(current.siteKey) ? siteOrderMap.get(current.siteKey) : 999999;
  if (candidateOrder !== currentOrder) return candidateOrder - currentOrder;
  return candidate.seq - current.seq;
};

const compareDisplayedResults = (left, right, context) => {
  const siteOrderMap = context && context.siteOrderMap instanceof Map ? context.siteOrderMap : new Map();
  const pinTmdbFirst = !!(context && context.pinTmdbFirst);
  const leftKind = pinTmdbFirst ? (left.sourceKind === 'tmdb' ? 0 : 1) : 0;
  const rightKind = pinTmdbFirst ? (right.sourceKind === 'tmdb' ? 0 : 1) : 0;
  if (leftKind !== rightKind) return leftKind - rightKind;
  if (left.score !== right.score) return right.score - left.score;
  if (left.sourceKind === 'tmdb' && right.sourceKind === 'tmdb' && left.tmdbRank !== right.tmdbRank) {
    return left.tmdbRank - right.tmdbRank;
  }
  const leftOrder = siteOrderMap.has(left.siteKey) ? siteOrderMap.get(left.siteKey) : 999999;
  const rightOrder = siteOrderMap.has(right.siteKey) ? siteOrderMap.get(right.siteKey) : 999999;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  const leftTitleLength = left.title ? left.title.length : 0;
  const rightTitleLength = right.title ? right.title.length : 0;
  if (leftTitleLength !== rightTitleLength) return leftTitleLength - rightTitleLength;
  return left.seq - right.seq;
};

const snapshotSearchState = (state, { progressDone = 0, progressTotal = 0 } = {}) => ({
  displayMode: state.displayMode,
  tmdbItems: state.tmdbItems.slice(),
  siteItems: state.siteItems.slice(),
  displayedItems: [],
  pinTmdbFirst: state.pinTmdbFirst,
  siteTotal: state.siteTotal,
  progressDone,
  progressTotal,
});

const buildTmdbPoster = (item, settings) => {
  const poster = normalizeString(item && (item.poster || item.backdrop || item.image));
  if (!poster) return '';
  return rewriteDoubanImageUrl(poster, {
    mode: normalizeString(settings.doubanImgProxy) || 'server-proxy',
    custom: normalizeString(settings.doubanImgCustom),
    defaultMode: 'server-proxy',
  });
};

const normalizeInt = (value) => {
  const n = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : 0;
  return n > 0 ? n : 0;
};

const compareSeasonEpisode = (left, right) => {
  if (!left && !right) return 0;
  if (left && !right) return 1;
  if (!left && right) return -1;
  const leftSeason = normalizeInt(left && left.season);
  const rightSeason = normalizeInt(right && right.season);
  if (leftSeason !== rightSeason) return leftSeason > rightSeason ? 1 : -1;
  const leftEpisode = normalizeInt(left && left.episode);
  const rightEpisode = normalizeInt(right && right.episode);
  if (leftEpisode !== rightEpisode) return leftEpisode > rightEpisode ? 1 : -1;
  return 0;
};

const parseSeasonedProgress = (rawText) => {
  const raw = typeof rawText === 'string' ? rawText : '';
  const text = raw.trim();
  if (!text) return null;
  const cleaned = preCleanForRules(text) || text;

  const mCn = cleaned.match(/第\s*(\d{1,2})\s*季\s*第\s*(\d{1,4})\s*(?:集|话|回|期)/i);
  if (mCn && mCn[1] && mCn[2]) {
    const season = Number.parseInt(String(mCn[1]), 10) || 0;
    const episode = Number.parseInt(String(mCn[2]), 10) || 0;
    if (season > 0 && episode > 0) return { season, episode };
  }

  const mSe = cleaned.match(/\bS\s*(\d{1,2})\s*E\s*(\d{1,4})\b/i);
  if (mSe && mSe[1] && mSe[2]) {
    const season = Number.parseInt(String(mSe[1]), 10) || 0;
    const episode = Number.parseInt(String(mSe[2]), 10) || 0;
    if (season > 0 && episode > 0) return { season, episode };
  }

  return null;
};

const hasAnySeasonMarker = (rawText) => {
  const raw = typeof rawText === 'string' ? rawText : '';
  const text = raw.trim();
  if (!text) return false;
  const cleaned = preCleanForRules(text) || text;
  return /(?:第\s*\d{1,2}\s*季|\bS\s*\d{1,2}\b|\bSeason\s*\d{1,2}\b)/i.test(cleaned);
};

const parseUnseasonedUpdateEpisode = (rawText) => {
  const raw = typeof rawText === 'string' ? rawText : '';
  const text = raw.trim();
  if (!text) return 0;
  const cleaned = preCleanForRules(text) || text;

  const mUp = cleaned.match(/(?:更新至|更至|更)\s*(\d{1,4})\s*(?:集|话|回|期)/i);
  if (mUp && mUp[1]) {
    const episode = Number.parseInt(String(mUp[1]), 10) || 0;
    if (episode > 0 && episode <= 2000) return episode;
  }

  const mRange = cleaned.match(/(\d{1,4})\s*\/\s*(\d{1,4})/i);
  if (mRange && mRange[1] && mRange[2]) {
    const left = Number.parseInt(String(mRange[1]), 10) || 0;
    const right = Number.parseInt(String(mRange[2]), 10) || 0;
    if (left > 0 && right > 0 && right >= left && left <= 2000 && right <= 2000) return left;
  }

  return 0;
};

export const buildSearchGroupKey = (title, compiledRules, { queryTrailingDigits = '', contentKind = 'tv' } = {}) => {
  return normalizeForGroupKey(
    buildCanonicalSearchTitle(title, compiledRules, { queryTrailingDigits, contentKind }) || sanitizeDisplayTitle(title)
  );
};

const formatAggregateTVRemark = ({ tmdbMatch, groupTitle, sources } = {}) => {
  const title = normalizeString(groupTitle);
  const tmdbItem = tmdbMatch && typeof tmdbMatch === 'object' ? tmdbMatch : null;
  const tmdbSeasonCount = normalizeInt(tmdbItem && tmdbItem.seasonCount);
  const tmdbEpisodeCount = normalizeInt(tmdbItem && tmdbItem.episodeCount);
  const tmdbLatest = {
    season: normalizeInt(tmdbItem && tmdbItem.latestSeason),
    episode: normalizeInt(tmdbItem && tmdbItem.latestEpisode),
  };
  const tmdbEnded = String(tmdbItem && tmdbItem.status ? tmdbItem.status : '').trim().toLowerCase() === 'ended';

  if (tmdbEnded) {
    if (tmdbSeasonCount >= 2 && tmdbEpisodeCount > 0) return `共${tmdbSeasonCount}季${tmdbEpisodeCount}集`;
    if (tmdbEpisodeCount > 0) return `共${tmdbEpisodeCount}集`;
    return '已完结';
  }

  const tmdbBaseRemark = tmdbItem
    ? formatTMDBTVRemark({
        badge: tmdbItem.baseTextBadge || tmdbItem.textBadge,
        status: tmdbItem.status,
        seasonCount: tmdbSeasonCount,
        episodeCount: tmdbEpisodeCount,
        title: tmdbItem.title || title,
      }) || ''
    : '';

  const list = Array.isArray(sources) ? sources : [];
  const isMulti = tmdbItem ? tmdbSeasonCount >= 2 || tmdbLatest.season >= 2 : false;

  if (!isMulti) {
    let bestEpisode = 0;
    list.forEach((source) => {
      const joined = `${source && source.textBadge ? String(source.textBadge) : ''} ${source && source.title ? String(source.title) : ''}`.trim();
      if (!joined || hasAnySeasonMarker(joined)) return;
      const episode = parseUnseasonedUpdateEpisode(joined);
      if (episode > bestEpisode) bestEpisode = episode;
    });
    if (tmdbLatest.episode > 0 && bestEpisode > tmdbLatest.episode + 5) bestEpisode = 0;
    if (bestEpisode > tmdbLatest.episode) return `更新至第${bestEpisode}集`;
    return tmdbBaseRemark || '';
  }

  let best = null;
  list.forEach((source) => {
    const joined = `${source && source.textBadge ? String(source.textBadge) : ''} ${source && source.title ? String(source.title) : ''}`.trim();
    if (!joined) return;
    const parsed = parseSeasonedProgress(joined);
    if (!parsed) return;
    if (tmdbSeasonCount >= 2 && parsed.season > tmdbSeasonCount) return;
    if (
      tmdbLatest.season > 0 &&
      tmdbLatest.episode > 0 &&
      parsed.season === tmdbLatest.season &&
      parsed.episode > tmdbLatest.episode + 5
    ) {
      return;
    }
    if (!best || compareSeasonEpisode(parsed, best) > 0) best = parsed;
  });
  if (best && compareSeasonEpisode(best, tmdbLatest) > 0) return `更新至第${best.season}季第${best.episode}集`;
  return tmdbBaseRemark || '';
};

const hydrateTmdbDetails = async (items) => {
  const list = Array.isArray(items) ? items : [];
  await Promise.all(
    list.map(async (item) => {
      if (!item || item.sourceKind !== 'tmdb') return;
      if (item.tmdbType !== 'tv') return;
      try {
        const detail = await fetchTMDBDetailCached({
          type: item.tmdbType,
          id: String(item.tmdbId),
        });
        const badge = normalizeString(detail && detail.badge);
        const status = normalizeString(detail && detail.status);
        const seasonCount = normalizeInt(detail && detail.seasonCount);
        const episodeCount = normalizeInt(detail && detail.episodeCount);
        const latestSeason = normalizeInt(detail && detail.latestSeason);
        const latestEpisode = normalizeInt(detail && detail.latestEpisode);
        item.baseTextBadge = formatTMDBTVRemark({
          badge,
          status,
          seasonCount,
          episodeCount,
          title: item.title,
        });
        item.textBadge = item.baseTextBadge;
        item.status = status;
        item.seasonCount = seasonCount;
        item.episodeCount = episodeCount;
        item.latestSeason = latestSeason;
        item.latestEpisode = latestEpisode;
      } catch (_error) {}
    })
  );
};

const mapTmdbItems = (data, settings, computeMatchScore) => {
  const list = data && Array.isArray(data.list) ? data.list : [];
  const seen = new Set();
  return list
    .map((item, index) => {
      const title = sanitizeDisplayTitle(item && item.title);
      const tmdbType = normalizeTmdbMediaType(item && item.type);
      const tmdbId = normalizeInt(item && item.id);
      if (!title || !tmdbType || tmdbId <= 0) return null;
      const groupKey = buildSearchGroupKey(title, [], { contentKind: tmdbType });
      const dedupeKey = `${tmdbType}::${groupKey}`;
      if (dedupeKey && seen.has(dedupeKey)) return null;
      seen.add(dedupeKey);
      const year = normalizeInt(item && item.year);
      return {
        id: `tmdb:${tmdbType}:${tmdbId}`,
        contentKey: `tmdb:${tmdbType}:${tmdbId}`,
        sourceKind: 'tmdb',
        siteKey: 'tmdb',
        siteName: 'TMDB',
        spiderApi: '',
        videoId: String(tmdbId),
        title,
        poster: buildTmdbPoster(item, settings),
        textBadge: tmdbType === 'movie' && year > 0 ? String(year) : '',
        siteLabel: tmdbType === 'movie' ? '电影' : '剧集',
        score: computeMatchScore(title),
        seq: index,
        groupKey,
        tmdbId,
        tmdbType,
        tmdbRank: index + 1,
        baseTextBadge: '',
        status: '',
        seasonCount: 0,
        episodeCount: 0,
        latestSeason: 0,
        latestEpisode: 0,
      };
    })
    .filter(Boolean);
};

const normalizeSiteSearchList = (data) => {
  const list = data && Array.isArray(data.list) ? data.list : [];
  return list
    .map((item) => ({
      id: normalizeString(item && (item.vod_id != null ? String(item.vod_id) : item.id != null ? String(item.id) : '')),
      title: sanitizeDisplayTitle(item && (item.vod_name != null ? String(item.vod_name) : item.name != null ? String(item.name) : '')),
      poster: normalizeString(item && (item.vod_pic != null ? String(item.vod_pic) : item.pic != null ? String(item.pic) : '')),
      remark: normalizeString(item && (item.vod_remarks != null ? String(item.vod_remarks) : item.remark != null ? String(item.remark) : '')),
    }))
    .filter((item) => item.id && item.title);
};

export async function loadSearchConfig(baseBootstrap = {}) {
  const bootstrap = await fetchBootstrap('search');
  const mergedSettings = {
    ...(baseBootstrap && baseBootstrap.settings ? baseBootstrap.settings : {}),
    ...(bootstrap && bootstrap.settings ? bootstrap.settings : {}),
  };
  const searchDisplayMode = normalizeString(mergedSettings.searchDisplayMode);
  return {
    bootstrap,
    settings: mergedSettings,
    searchDisplayMode:
      searchDisplayMode === 'tmdb' || searchDisplayMode === 'both' || searchDisplayMode === 'sites'
        ? searchDisplayMode
        : 'sites',
    searchThreadCount: Number.isFinite(Number(mergedSettings.searchThreadCount))
      ? Math.max(1, Math.min(50, Math.floor(Number(mergedSettings.searchThreadCount))))
      : 5,
    searchCoverSite: normalizeString(mergedSettings.searchCoverSite),
    siteOrderMap: buildSiteOrderMap(mergedSettings),
    aggregateRules: compileCleanRules(mergedSettings.magicAggregateRegexRules),
    catpawrunnerApiBase: normalizeString(mergedSettings.catpawrunnerApiBase),
    doubanDataProxy: normalizeString(mergedSettings.doubanDataProxy),
    doubanDataCustom: normalizeString(mergedSettings.doubanDataCustom),
    doubanImgProxy: normalizeString(mergedSettings.doubanImgProxy),
    doubanImgCustom: normalizeString(mergedSettings.doubanImgCustom),
  };
}

export async function fetchSearchHistory() {
  const list = await requestJson(SEARCH_HISTORY_ENDPOINT, { method: 'GET', credentials: 'same-origin' });
  return Array.isArray(list) ? list.map((item) => normalizeString(item)).filter(Boolean) : [];
}

export async function saveSearchHistory(keyword) {
  const safeKeyword = normalizeString(keyword);
  if (!safeKeyword) return [];
  const list = await requestJson(SEARCH_HISTORY_ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: safeKeyword }),
  });
  return Array.isArray(list) ? list.map((item) => normalizeString(item)).filter(Boolean) : [];
}

export async function clearSearchHistory() {
  const list = await requestJson(SEARCH_HISTORY_ENDPOINT, { method: 'DELETE', credentials: 'same-origin' });
  return Array.isArray(list) ? list.map((item) => normalizeString(item)).filter(Boolean) : [];
}

export async function loadSearchableSites() {
  const payload = await requestJson(USER_SITES_ENDPOINT, { method: 'GET', credentials: 'same-origin' });
  const sites = payload && Array.isArray(payload.sites) ? payload.sites : [];
  return sites.filter((site) => {
    if (!site) return false;
    if (site.enabled === false || site.search === false) return false;
    if (!normalizeString(site.api) || !normalizeString(site.key)) return false;
    return !isConfigCenterSite(site);
  });
}

const blockedSiteKeyCache = new Map();
const blockedMatchIndexCache = new Map();

export const clearBlockedMatchCaches = () => {
  blockedSiteKeyCache.clear();
  blockedMatchIndexCache.clear();
};

export const buildSmartMatchBlockKeyword = (title, aggregateRules = []) => {
  const raw = normalizeString(title);
  if (!raw) return '';
  const compiledRules = compileCleanRules(aggregateRules);
  const preCleaned = preCleanForRules(raw) || raw;
  const cleaned = sanitizeDisplayTitle(applyCleanRules(preCleaned, compiledRules) || preCleaned);
  return normalizeString(cleaned || raw);
};

const cloneBlockedMatchIndex = (index) => {
  const source = index && typeof index === 'object' ? index : {};
  const out = {};
  Object.entries(source).forEach(([key, entry]) => {
    const item = entry && typeof entry === 'object' ? entry : null;
    if (!item) return;
    out[key] = {
      blockAll: !!item.blockAll,
      panFlags: Array.isArray(item.panFlags) ? item.panFlags.slice() : [],
    };
  });
  return out;
};

const buildBlockedMatchIndex = (items) => {
  const list = Array.isArray(items) ? items : [];
  const out = {};
  list.forEach((item) => {
    const siteKey = normalizeString(item && item.siteKey);
    const videoId = normalizeString(item && item.videoId);
    if (!siteKey || !videoId) return;
    const key = `${siteKey}::${videoId}`;
    const source = normalizeString(item && item.source);
    const panFlag = normalizeString(item && item.panFlag);
    const entry = out[key] || { blockAll: false, panFlags: [] };
    if (!source || source === 'search') {
      entry.blockAll = true;
      entry.panFlags = [];
      out[key] = entry;
      return;
    }
    if (source === 'play' && panFlag && !entry.blockAll && !entry.panFlags.includes(panFlag)) {
      entry.panFlags.push(panFlag);
    }
    out[key] = entry;
  });
  return out;
};

const fetchBlockedMatchItemsByKeyword = async (keyword) => {
  const safeKeyword = normalizeString(keyword);
  if (!safeKeyword) return [];
  const cacheKey = safeKeyword.toLowerCase();
  if (blockedMatchIndexCache.has(cacheKey)) {
    const cached = blockedMatchIndexCache.get(cacheKey);
    return Array.isArray(cached && cached.items) ? cached.items.slice() : [];
  }
  try {
    const payload = await requestJson(
      `${SMART_MATCHBLOCK_ITEMS_ENDPOINT}?keyword=${encodeURIComponent(safeKeyword)}`,
      { method: 'GET', credentials: 'same-origin' }
    );
    const items = payload && Array.isArray(payload.items) ? payload.items : [];
    blockedMatchIndexCache.set(cacheKey, { items: items.slice() });
    return items.slice();
  } catch (_error) {
    return [];
  }
};

export const fetchBlockedMatchIndex = async (keyword, aggregateRules = []) => {
  const rawKeyword = normalizeString(keyword);
  if (!rawKeyword) return {};
  const derivedKeyword = buildSmartMatchBlockKeyword(rawKeyword, aggregateRules);
  const keywordList = Array.from(new Set([rawKeyword, derivedKeyword].map(normalizeString).filter(Boolean)));
  const cacheKey = keywordList.map((item) => item.toLowerCase()).join('||');
  if (blockedMatchIndexCache.has(cacheKey)) {
    const cached = blockedMatchIndexCache.get(cacheKey);
    return cloneBlockedMatchIndex(cached && cached.index);
  }
  const merged = [];
  const seen = new Set();
  for (let i = 0; i < keywordList.length; i += 1) {
    const list = await fetchBlockedMatchItemsByKeyword(keywordList[i]).catch(() => []);
    (Array.isArray(list) ? list : []).forEach((item) => {
      const dedupeKey = [
        normalizeString(item && item.siteKey),
        normalizeString(item && item.videoId),
        normalizeString(item && item.panFlag),
        normalizeString(item && item.source),
      ].join('::');
      if (!dedupeKey || seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      merged.push(item);
    });
  }
  const index = buildBlockedMatchIndex(merged);
  blockedMatchIndexCache.set(cacheKey, { index: cloneBlockedMatchIndex(index) });
  return index;
};

export const addSmartMatchBlockItem = async (payload) => {
  const body = payload && typeof payload === 'object' ? payload : {};
  const response = await requestJson('/api/smart/matchblock/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  clearBlockedMatchCaches();
  return response;
};

export const deleteSmartMatchBlockItem = async (payload) => {
  const body = payload && typeof payload === 'object' ? payload : {};
  const response = await requestJson('/api/smart/matchblock/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  clearBlockedMatchCaches();
  return response;
};

export const fetchBlockedSiteKeys = async (keyword) => {
  const safeKeyword = normalizeString(keyword);
  if (!safeKeyword) return new Set();
  if (blockedSiteKeyCache.has(safeKeyword)) {
    const cached = blockedSiteKeyCache.get(safeKeyword);
    return cached instanceof Set ? new Set(cached) : new Set();
  }
  try {
    const payload = await requestJson(
      `${SMART_MATCHBLOCK_ITEMS_ENDPOINT}?keyword=${encodeURIComponent(safeKeyword)}`,
      { method: 'GET', credentials: 'same-origin' }
    );
    const items = payload && Array.isArray(payload.items) ? payload.items : [];
    const next = new Set(
      items
        .map((item) => normalizeString(item && item.siteKey))
        .filter(Boolean)
    );
    blockedSiteKeyCache.set(safeKeyword, new Set(next));
    return next;
  } catch (_error) {
    return new Set();
  }
};

export async function streamSearch(query, config, { onUpdate, blockedSiteKeys = [], contentKind = 'tv' } = {}) {
  const safeQuery = normalizeString(query);
  if (!safeQuery) {
    const emptyState = {
      displayMode: config.searchDisplayMode,
      tmdbItems: [],
      siteItems: [],
      displayedItems: [],
      pinTmdbFirst: false,
      siteTotal: 0,
      progressDone: 0,
      progressTotal: 0,
    };
    if (typeof onUpdate === 'function') onUpdate(emptyState);
    return emptyState;
  }

  const computeMatchScore = computeMatchScoreFactory(safeQuery);
  const queryTrailingDigitsMatch = safeQuery.match(/(\d+)\s*$/);
  const queryTrailingDigits = queryTrailingDigitsMatch ? String(queryTrailingDigitsMatch[1] || '') : '';
  const blockedSiteKeySet = new Set(
    (Array.isArray(blockedSiteKeys) ? blockedSiteKeys : [])
      .map((item) => normalizeString(item))
      .filter(Boolean)
  );
  const output = {
    displayMode: config.searchDisplayMode,
    tmdbItems: [],
    siteItems: [],
    displayedItems: [],
    pinTmdbFirst: false,
    siteTotal: 0,
  };
  let progressDone = 0;
  let progressTotal = config.searchDisplayMode === 'tmdb' ? 1 : 0;

  const publish = () => {
    if (typeof onUpdate !== 'function') return;
    onUpdate(snapshotSearchState(output, { progressDone, progressTotal }));
  };

  const tmdbPromise =
    config.searchDisplayMode === 'tmdb' || config.searchDisplayMode === 'both'
      ? (async () => {
          try {
            if (config.searchDisplayMode === 'both') progressTotal += 1;
            const tmdbPayload = await requestJson(buildTMDBDataURL('search', { q: safeQuery }), {
              method: 'GET',
              credentials: 'same-origin',
            });
            output.tmdbItems = mapTmdbItems(tmdbPayload, config.settings, computeMatchScore);
            output.pinTmdbFirst = output.tmdbItems.some((item) => item.score >= 1000);
            progressDone += 1;
            publish();
            await hydrateTmdbDetails(output.tmdbItems);
            publish();
          } catch (error) {
            if (config.searchDisplayMode === 'tmdb') throw error;
            output.tmdbItems = [];
            output.pinTmdbFirst = false;
            progressDone += 1;
            publish();
          }
        })()
      : Promise.resolve();

  const sitePromise =
    config.searchDisplayMode === 'sites' || config.searchDisplayMode === 'both'
      ? (async () => {
          if (!config.catpawrunnerApiBase) throw new Error('catpawrunner 接口未配置');
          const sites = (await loadSearchableSites()).filter(
            (site) => !blockedSiteKeySet.has(normalizeString(site && site.key))
          );
          output.siteTotal = sites.length;
          progressTotal += sites.length;
          publish();
          const siteItems = [];
          await Promise.all(
            sites.map(async (site, index) => {
              try {
                const payload = await requestCatSpider({
                  apiBase: config.catpawrunnerApiBase,
                  action: 'search',
                  spiderApi: site.api,
                  payload: { wd: safeQuery, page: 1 },
                  timeoutMs: 10000,
                });
                const list = normalizeSiteSearchList(payload);
                list.slice(0, 12).forEach((item, innerIndex) => {
                  const variantMeta = (() => {
                    const titleMeta = extractSeriesVariantMetaFromText(item.title);
                    if (normalizeInt(titleMeta && titleMeta.index) > 0) return titleMeta;
                    return extractSeriesVariantMetaFromText(item.remark);
                  })();
                  const seasonHint = normalizeInt(variantMeta && variantMeta.index);
                  const seasonHintLabel = normalizeString(variantMeta && variantMeta.kind) === 'yearbang'
                    ? `年番${Math.floor(seasonHint) || 1}`
                    : (seasonHint > 0 ? `第${Math.floor(seasonHint)}季` : '');
                  siteItems.push({
                    id: `${normalizeString(site.key)}:${item.id}`,
                    sourceKind: 'site',
                    siteKey: normalizeString(site.key),
                    siteName: normalizeString(site.name) || normalizeString(site.key),
                    spiderApi: normalizeString(site.api),
                    videoId: item.id,
                    title: item.title,
                    poster: item.poster,
                    textBadge: item.remark,
                    siteLabel: normalizeString(site.name) || normalizeString(site.key),
                    score: computeMatchScore(item.title),
                    seq: index * 100 + innerIndex,
                    groupKey: buildSearchGroupKey(item.title, config.aggregateRules, {
                      queryTrailingDigits,
                      contentKind,
                    }),
                    seasonHint,
                    seasonHintLabel,
                  });
                });
              } catch (_error) {
              } finally {
                progressDone += 1;
                output.siteItems = siteItems.slice();
                publish();
              }
            })
          );
          output.siteItems = siteItems;
        })()
      : Promise.resolve();

  await Promise.all([tmdbPromise, sitePromise]);

  const finalState = snapshotSearchState(output, { progressDone, progressTotal });
  if (typeof onUpdate === 'function') onUpdate(finalState);
  return finalState;
}

export function buildDisplayedResults(searchState, config, { rawListMode = false } = {}) {
  const tmdbItems = Array.isArray(searchState && searchState.tmdbItems) ? searchState.tmdbItems : [];
  const siteItems = Array.isArray(searchState && searchState.siteItems) ? searchState.siteItems : [];
  const displayMode = normalizeString(searchState && searchState.displayMode) || normalizeString(config && config.searchDisplayMode);
  let siteDisplay = siteItems.slice();

  if (!rawListMode) {
    const tmdbByGroup = new Map();
    tmdbItems.forEach((item) => {
      const groupKey = normalizeString(item && item.groupKey);
      if (!groupKey) return;
      tmdbByGroup.set(groupKey, item);
    });

    const groups = new Map();
    siteItems.forEach((item) => {
      const key = resolveDisplayedSiteGroupKey(item, tmdbByGroup, displayMode);
      if (!key) return;
      const current = groups.get(key) || { representative: null, items: [], siteKeys: new Set(), title: '' };
      current.items.push(item);
      current.siteKeys.add(item.siteKey);
      current.title = current.title || item.title;
      if (!current.representative || compareRepresentative(item, current.representative, config) < 0) {
        current.representative = item;
      }
      groups.set(key, current);
    });

    siteDisplay = Array.from(groups.entries()).flatMap(([groupKey, group]) => {
      const representative = group.representative;
      if (!representative) return [];
      const siteCount = group.siteKeys.size;
      const itemCount = Array.isArray(group.items) ? group.items.length : 0;
      const tmdbMatch = tmdbByGroup.get(groupKey) || null;
      const aggregateRemark = formatAggregateTVRemark({
        tmdbMatch,
        groupTitle: (tmdbMatch && tmdbMatch.title) || group.title || (representative && representative.title) || '',
        sources: group.items,
      });

      if (tmdbMatch) {
        tmdbMatch.aggregateSourceCount = siteCount;
        tmdbMatch.aggregateItems = group.items.slice();
        tmdbMatch.aggregateKind = 'tmdb';
        if (aggregateRemark) tmdbMatch.textBadge = aggregateRemark;
        return [];
      }

      if (itemCount <= 1) {
        return [
          {
            ...representative,
            groupKey,
            textBadge: aggregateRemark || representative.textBadge,
            siteLabel: normalizeString(representative && representative.siteLabel)
              || normalizeString(representative && representative.siteName),
          },
        ];
      }

      return [
        {
          ...representative,
          id: `aggregate:${groupKey}`,
          groupKey,
          textBadge: aggregateRemark || representative.textBadge,
          siteLabel: '聚合',
          aggregateSourceCount: siteCount,
          aggregateItems: group.items.slice(),
          aggregateKind: 'site',
        },
      ];
    });
  }

  return [...tmdbItems, ...siteDisplay].sort((left, right) =>
    compareDisplayedResults(left, right, {
      siteOrderMap: config.siteOrderMap,
      pinTmdbFirst: !!(searchState && searchState.pinTmdbFirst),
    })
  );
}
