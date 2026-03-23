import { extractRawNamesFromEpisodeUrl } from './catpawrunner';
import {
  doubanGlobalEpisodeNoOf,
  doubanSeasonEpisodeOfGlobal,
  tmdbGlobalEpisodeNoOf,
  tmdbSeasonEpisodeOfGlobal,
} from './smartEpisodeMapping';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};

const splitRawPathSegments = (value) =>
  normalizeString(value)
    .replace(/\\/g, '/')
    .split('/')
    .map(normalizeString)
    .filter(Boolean);

const getRawFileName = (value) => {
  const parts = splitRawPathSegments(value);
  return parts.length ? parts[parts.length - 1] : normalizeString(value);
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

const normalizeRegexText = (text) => {
  const raw = typeof text === 'string' ? text : '';
  if (!raw) return '';
  return raw.replace(/\\\\(?=[dDsSwWbB.()[\]{}+*?^$|\\\-_/])/g, '\\');
};

const buildRegexFromInput = (value, { defaultFlags = '', forceGlobal = false } = {}) => {
  const parsed = normalizePatternInput(value);
  if (!parsed || !parsed.pattern) return null;
  let flags = parsed.flags || defaultFlags;
  if (forceGlobal && !flags.includes('g')) flags += 'g';
  try {
    return new RegExp(normalizeRegexText(parsed.pattern), flags);
  } catch (_error) {
    return null;
  }
};

const compileMagicCleanRules = (rawRules) =>
  (Array.isArray(rawRules) ? rawRules : [])
    .map((rule) => buildRegexFromInput(rule, { defaultFlags: 'ig', forceGlobal: true }))
    .filter(Boolean);

const compileMagicRules = (rawRules) =>
  (Array.isArray(rawRules) ? rawRules : [])
    .map((rule) => {
      if (!rule) return null;

      if (typeof rule === 'string') {
        const raw = normalizeString(rule);
        if (!raw) return null;
        if (raw.startsWith('{') && raw.endsWith('}')) {
          try {
            const obj = JSON.parse(raw);
            if (obj && typeof obj === 'object' && typeof obj.pattern === 'string') {
              const re = buildRegexFromInput(`/${obj.pattern}/${normalizeString(obj.flags) || 'i'}`);
              if (!re) return null;
              const replaceRaw = typeof obj.replace === 'string' ? obj.replace : '';
              return {
                re,
                replace: replaceRaw ? replaceRaw.replace(/\\(\d+)/g, '$$$1') : '',
              };
            }
          } catch (_error) {}
        }
        const re = buildRegexFromInput(raw, { defaultFlags: 'i' });
        return re ? { re, replace: '' } : null;
      }

      const pattern = normalizeString(rule.pattern || rule.regex || rule.re || '');
      if (!pattern) return null;
      const flags = normalizeString(rule.flags) || 'i';
      try {
        return {
          re: new RegExp(normalizeRegexText(pattern), flags),
          replace: typeof rule.replace === 'string' ? rule.replace.replace(/\\(\d+)/g, '$$$1') : '',
        };
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean);

const compileMagicEpisodeRules = (rawRules) => compileMagicRules(rawRules);
const compileMagicMovieRules = (rawRules) => compileMagicRules(rawRules);

const cleanMagicEpisodeText = (text, cleanRules) => {
  let out = normalizeString(text);
  (Array.isArray(cleanRules) ? cleanRules : []).forEach((rule) => {
    try {
      if (rule.global || rule.sticky) rule.lastIndex = 0;
      out = out.replace(rule, '');
    } catch (_error) {}
  });
  return normalizeString(out);
};

const parseChineseNumeralToInt = (raw) => {
  const s = normalizeString(raw).replace(/两/g, '二');
  if (!s) return 0;
  if (/^\d+$/.test(s)) return normalizeInt(s);
  const digit = (ch) => ({ 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }[ch] ?? -1);
  const parseSection = (sec) => {
    let total = 0;
    let num = 0;
    for (let i = 0; i < sec.length; i += 1) {
      const ch = sec[i];
      const d = digit(ch);
      if (d >= 0) {
        num = d;
        continue;
      }
      const unit = ch === '十' ? 10 : ch === '百' ? 100 : ch === '千' ? 1000 : 0;
      if (!unit) continue;
      if (!num) num = 1;
      total += num * unit;
      num = 0;
    }
    return total + num;
  };
  if (s.includes('万')) {
    const [left, right] = s.split('万');
    return parseSection(left || '') * 10000 + parseSection(right || '');
  }
  return parseSection(s);
};

const extractSeasonHintFromText = (text) => {
  const raw = normalizeString(text);
  if (!raw) return 0;
  const mSe = raw.match(/S(\d{1,2})\s*E\d{1,5}/i);
  if (mSe && mSe[1]) return normalizeInt(mSe[1]);
  const mSeason = raw.match(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/i);
  if (!mSeason || !mSeason[1]) return 0;
  const normalized = String(mSeason[1]).replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
  return /^\d+$/.test(normalized) ? normalizeInt(normalized) : parseChineseNumeralToInt(mSeason[1]);
};

const extractNormalizedSeasonEpisode = (text, compiledRules, cleanRules) => {
  const rawText = normalizeString(text);
  const cleaned = cleanMagicEpisodeText(rawText, cleanRules);
  if (!rawText && !cleaned) return { season: 0, episode: 0 };
  const parseNormalized = (value) => {
    const input = normalizeString(value);
    if (!input) return null;
    const seasonMatch = input.match(/S\s*0*(\d{1,2})\s*E\s*0*(\d{1,5})/i);
    if (seasonMatch && seasonMatch[1] && seasonMatch[2]) {
      return {
        season: normalizeInt(seasonMatch[1]),
        episode: normalizeInt(seasonMatch[2]),
      };
    }
    const epMatch = input.match(/\bE\s*0*(\d{1,5})\b/i);
    if (epMatch && epMatch[1]) {
      return { season: 0, episode: normalizeInt(epMatch[1]) };
    }
    return null;
  };
  const direct = parseNormalized(rawText) || parseNormalized(cleaned);
  if (direct && direct.episode > 0) return direct;
  for (let i = 0; i < compiledRules.length; i += 1) {
    const rule = compiledRules[i];
    const re = rule && rule.re ? rule.re : null;
    if (!re) continue;
    const matched = cleaned.match(re);
    if (!matched) continue;
    const normalized = rule && rule.replace
      ? (() => {
          try {
            return cleaned.replace(re, rule.replace);
          } catch (_error) {
            return '';
          }
        })()
      : ((matched[2] != null ? String(matched[2]) : '') || (matched[1] != null ? String(matched[1]) : '') || String(matched[0] || ''));
    const parsed = parseNormalized(normalized);
    if (parsed && parsed.episode > 0) return parsed;
  }
  return { season: 0, episode: 0 };
};

const extractQualityMark = (text) => {
  const raw = normalizeString(text).toLowerCase();
  if (!raw) return '';
  if (/(?:2160p|4k|uhd)/i.test(raw)) return '4K';
  if (/(?:1080p|1080i|fhd)/i.test(raw)) return '1080P';
  if (/(?:720p|hd)/i.test(raw)) return '720P';
  return '';
};

const matchesAnyMagicRule = (text, rules) => {
  const normalizeForMagic = (input) => {
    const raw = typeof input === 'string' ? input : '';
    if (!raw) return '';
    return raw
      .trim()
      .replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)))
      .replace(/\s+/g, ' ');
  };

  const input = normalizeForMagic(text);
  const list = Array.isArray(rules) ? rules : [];
  if (!input || !list.length) return false;
  for (let i = 0; i < list.length; i += 1) {
    const re = list[i] && list[i].re ? list[i].re : null;
    if (!re) continue;
    try {
      if (re.global || re.sticky) re.lastIndex = 0;
    } catch (_error) {}
    if (re.test(input)) return true;
  }
  const noSpace = input.replace(/\s+/g, '');
  if (noSpace && noSpace !== input) {
    for (let i = 0; i < list.length; i += 1) {
      const re = list[i] && list[i].re ? list[i].re : null;
      if (!re) continue;
      try {
        if (re.global || re.sticky) re.lastIndex = 0;
      } catch (_error) {}
      if (re.test(noSpace)) return true;
    }
  }
  return false;
};

const isInformativeEpisodeText = (text, rules) => {
  const input = normalizeString(text);
  const compiled = Array.isArray(rules) ? rules : [];
  if (!input) return false;
  if (!compiled.length) return true;
  return matchesAnyMagicRule(input, compiled);
};

const extractEpisodeCandidateTextsFromSegment = (segment, compiledEpisodeRules) => {
  const fileName = normalizeString(segment && segment.fileName);
  const displayName = normalizeString(segment && segment.displayName);
  const rawNames = [normalizeString(segment && segment.rawName)].filter(Boolean);
  const currentDir = normalizeString(segment && segment.currentDir);
  const parentDir = normalizeString(segment && segment.parentDir);
  const rawLooksUseful = rawNames.some((item) => isInformativeEpisodeText(item, compiledEpisodeRules));
  const out = [];
  const push = (value) => {
    const text = normalizeString(value);
    if (!text) return;
    if (!out.includes(text)) out.push(text);
  };
  if (fileName) push(fileName);
  if (!rawLooksUseful && !fileName && displayName) push(displayName);
  rawNames.forEach((item) => push(item));
  const fileHasSeason = !!extractSeasonHintFromText(fileName);
  if (!fileHasSeason && currentDir) {
    const currentSeasonMarker = extractSeasonHintFromText(currentDir);
    if (currentSeasonMarker > 0) push(`第${currentSeasonMarker}季`);
    push(currentDir);
    if (!currentSeasonMarker) {
      const currentQuality = extractQualityMark(currentDir);
      if (currentQuality && parentDir) {
        const parentSeasonMarker = extractSeasonHintFromText(parentDir);
        if (parentSeasonMarker > 0) {
          push(`第${parentSeasonMarker}季`);
          push(parentDir);
        }
      }
    }
  }
  if (displayName && rawLooksUseful) {
    if (!fileName || displayName !== fileName) push(displayName);
  }
  return out;
};

const buildPanAliasMatchers = (tokens, mappings) => {
  const tokenList = (Array.isArray(tokens) ? tokens : []).map(normalizeString).filter(Boolean);
  const aliasRows = Array.isArray(mappings) ? mappings : [];
  const aliasMap = new Map();
  aliasRows.forEach((row) => {
    const pan = normalizeString(row && row.pan).toLowerCase();
    if (!pan) return;
    const aliases = String((row && row.aliases) || '')
      .replaceAll('，', ',')
      .split(',')
      .map((item) => normalizeString(item).toLowerCase())
      .filter(Boolean);
    aliasMap.set(pan, aliases);
  });
  return tokenList.map((token, index) => ({
    token,
    index,
    probes: [token.toLowerCase()].concat(aliasMap.get(token.toLowerCase()) || []),
  }));
};

const normalizePanMatchLabelText = (label) =>
  normalizeString(label)
    .toLowerCase()
    .replace(/[\s\-_—–·|:：/\\()[\]{}<>【】（）「」『』《》、，,。.！!？?~～]+/g, '');

const resolvePanMatch = (label, tokens, mappings) => {
  const hay = normalizePanMatchLabelText(label);
  if (!hay) return { token: '', index: -1 };
  const matchers = buildPanAliasMatchers(tokens, mappings);
  for (let i = 0; i < matchers.length; i += 1) {
    const matcher = matchers[i];
    if (matcher.probes.some((probe) => probe && hay.includes(probe))) {
      return { token: matcher.token, index: matcher.index };
    }
  }
  return { token: '', index: -1 };
};

const buildFolderStats = (items) => {
  const stats = new Map();
  const touch = (path) => {
    const key = normalizeString(path);
    if (!stats.has(key)) {
      stats.set(key, { seasons: new Set(), qualities: new Set() });
    }
    return stats.get(key);
  };
  (Array.isArray(items) ? items : []).forEach((item) => {
    const dirs = Array.isArray(item.dirs) ? item.dirs : [];
    const currentPath = normalizeString(item.currentPath);
    const currentDir = normalizeString(item.currentDir);
    const parentPath = normalizeString(item.parentPath);
    const current = touch(currentPath);
    const season = extractSeasonHintFromText(currentDir);
    const quality = extractQualityMark(currentDir);
    if (season > 0) current.seasons.add(season);
    if (quality) current.qualities.add(quality);
    if (parentPath) touch(parentPath);
    dirs.forEach((_, index) => touch(dirs.slice(0, index + 1).join('/')));
  });
  return stats;
};

const pickUniqueFolderSeason = (stats, path) => {
  const hit = stats.get(normalizeString(path));
  if (!hit || hit.seasons.size !== 1) return 0;
  return Array.from(hit.seasons)[0] || 0;
};

const pickUniqueFolderQuality = (stats, path) => {
  const hit = stats.get(normalizeString(path));
  if (!hit || hit.qualities.size !== 1) return '';
  return normalizeString(Array.from(hit.qualities)[0]);
};

const buildSegmentItems = (entry) => {
  const url = normalizeString(entry && entry.url);
  if (!url) return [];
  return url
    .split('#')
    .map((segment, index) => {
      const raw = normalizeString(segment);
      if (!raw) return null;
      const dollarIdx = raw.indexOf('$');
      const displayName = dollarIdx >= 0 ? normalizeString(raw.slice(0, dollarIdx)) : raw;
      const episodeUrl = dollarIdx >= 0 ? normalizeString(raw.slice(dollarIdx + 1)) : raw;
      const rawName = extractRawNamesFromEpisodeUrl(episodeUrl)[0] || '';
      const fileName = getRawFileName(rawName);
      const rawDirs = splitRawPathSegments(rawName).slice(0, -1);
      const displayDirs = splitRawPathSegments(displayName).slice(0, -1);
      const fileDirs = rawDirs.length ? rawDirs : displayDirs;
      return {
        index,
        segmentIdentity: raw,
        displayName,
        episodeUrl,
        rawName,
        fileName,
        dirs: fileDirs,
        currentDir: fileDirs[fileDirs.length - 1] || '',
        currentPath: fileDirs.join('/'),
        parentDir: fileDirs.length >= 2 ? fileDirs[fileDirs.length - 2] : '',
        parentPath: fileDirs.length >= 2 ? fileDirs.slice(0, -1).join('/') : '',
      };
    })
    .filter(Boolean);
};

const buildSeasonCountLookup = (rows, field) => {
  const out = new Map();
  (Array.isArray(rows) ? rows : []).forEach((item) => {
    const season = normalizeInt(item && item.season);
    const count = normalizeInt(item && item[field]);
    if (season > 0 && count > 0) out.set(season, count);
  });
  return out;
};

const buildMappingCandidate = ({
  from,
  global,
  tmdbDetail,
  doubanMeta,
  tmdb,
  douban,
  resolutionMode = '',
} = {}) => {
  const globalNo = normalizeInt(global);
  if (globalNo <= 0) return [];
  const tmdbValue = tmdb || tmdbSeasonEpisodeOfGlobal(tmdbDetail, globalNo);
  const doubanValue = douban || doubanSeasonEpisodeOfGlobal(doubanMeta, globalNo);
  const tmdbEpisode = normalizeInt(tmdbValue && tmdbValue.episode);
  const doubanEpisode = normalizeInt(doubanValue && doubanValue.episode);
  if (tmdbEpisode <= 0 && doubanEpisode <= 0) return [];
  const key = `${globalNo}:${normalizeInt(tmdbValue && tmdbValue.season)}:${tmdbEpisode}:${normalizeInt(doubanValue && doubanValue.season)}:${doubanEpisode}`;
  return [{
    key,
    from,
    global: globalNo,
    tmdb: tmdbValue,
    douban: doubanValue,
    resolutionMode: normalizeString(resolutionMode),
  }];
};

const resolveStrictTMDBGlobal = ({ seasonNo, episodeNo, tmdbDetail, tmdbCounts }) => {
  const seasonCount = normalizeInt(tmdbCounts && tmdbCounts.get(seasonNo));
  if (seasonNo <= 0 || episodeNo <= 0 || seasonCount <= 0 || episodeNo > seasonCount) return 0;
  return tmdbGlobalEpisodeNoOf(tmdbDetail, seasonNo, episodeNo);
};

const resolveAssistedGlobalFromDouban = ({ seasonNo, episodeNo, doubanMeta, doubanCounts }) => {
  const seasonCount = normalizeInt(doubanCounts && doubanCounts.get(seasonNo));
  if (seasonNo <= 0 || episodeNo <= 0 || seasonCount <= 0 || episodeNo > seasonCount) return 0;
  return doubanGlobalEpisodeNoOf(doubanMeta, seasonNo, episodeNo);
};

const getFirstSeasonCount = (rows, field) => {
  const list = Array.isArray(rows) ? rows : [];
  const first = list.find((item) => normalizeInt(item && item.season) === 1);
  return normalizeInt(first && first[field]);
};

const hasEpisodeBeyondFirstSeason = (episodes, firstSeasonCount) => (
  firstSeasonCount > 0
  && (Array.isArray(episodes) ? episodes : []).some((item) => normalizeInt(item) > firstSeasonCount)
);

const resolveSingleBaselineFallback = ({
  episodeNo,
  tmdbDetail,
  doubanMeta,
  tmdbMultiSeason,
  doubanMultiSeason,
  sourceEpisodeNos = [],
}) => {
  const global = normalizeInt(episodeNo);
  if (global <= 0) return [];
  const tmdbRows = Array.isArray(tmdbDetail && tmdbDetail.seasons) ? tmdbDetail.seasons : [];
  const doubanRows = Array.isArray(doubanMeta && doubanMeta.seasons) ? doubanMeta.seasons : [];
  if (!tmdbMultiSeason && doubanMultiSeason) {
    const doubanFirstSeasonCount = getFirstSeasonCount(doubanRows, 'episodeCount');
    const tmdb = tmdbSeasonEpisodeOfGlobal(tmdbDetail, global);
    if (normalizeInt(tmdb && tmdb.season) !== 1 || normalizeInt(tmdb && tmdb.episode) !== global) return [];
    if (doubanFirstSeasonCount > 0 && global <= doubanFirstSeasonCount && !hasEpisodeBeyondFirstSeason(sourceEpisodeNos, doubanFirstSeasonCount)) return [];
    return buildMappingCandidate({
      from: 'global',
      global,
      tmdbDetail,
      doubanMeta,
      tmdb,
      resolutionMode: 'degraded-single-baseline',
    });
  }
  if (tmdbMultiSeason && !doubanMultiSeason) {
    const tmdbFirstSeasonCount = getFirstSeasonCount(tmdbRows, 'episodes');
    const douban = doubanSeasonEpisodeOfGlobal(doubanMeta, global);
    if (normalizeInt(douban && douban.season) !== 1 || normalizeInt(douban && douban.episode) !== global) return [];
    if (tmdbFirstSeasonCount > 0 && global <= tmdbFirstSeasonCount && !hasEpisodeBeyondFirstSeason(sourceEpisodeNos, tmdbFirstSeasonCount)) return [];
    return buildMappingCandidate({
      from: 'global',
      global,
      tmdbDetail,
      doubanMeta,
      douban,
      resolutionMode: 'degraded-single-baseline',
    });
  }
  if (!tmdbMultiSeason && !doubanMultiSeason) {
    const tmdb = tmdbSeasonEpisodeOfGlobal(tmdbDetail, global);
    if (normalizeInt(tmdb && tmdb.season) !== 1 || normalizeInt(tmdb && tmdb.episode) !== global) return [];
    return buildMappingCandidate({
      from: 'single',
      global,
      tmdbDetail,
      doubanMeta,
      tmdb,
      resolutionMode: 'degraded-single-baseline',
    });
  }
  return [];
};

const resolveSeasonMarkedStrictTMDB = ({
  seasonNo,
  episodeNo,
  tmdbDetail,
  tmdbCounts,
}) => {
  const tmdbGlobal = resolveStrictTMDBGlobal({ seasonNo, episodeNo, tmdbDetail, tmdbCounts });
  if (tmdbGlobal <= 0) return [];
  return buildMappingCandidate({
    from: 'tmdb',
    global: tmdbGlobal,
    tmdbDetail,
    tmdb: { season: seasonNo, episode: episodeNo },
    resolutionMode: 'strict-tmdb',
  });
};

const resolveSeasonMarkedStrictDouban = ({
  seasonNo,
  episodeNo,
  tmdbDetail,
  doubanMeta,
  doubanCounts,
}) => {
  const doubanGlobal = resolveAssistedGlobalFromDouban({ seasonNo, episodeNo, doubanMeta, doubanCounts });
  if (doubanGlobal <= 0) return [];
  return buildMappingCandidate({
    from: 'assist',
    global: doubanGlobal,
    tmdbDetail,
    doubanMeta,
    douban: { season: seasonNo, episode: episodeNo },
    resolutionMode: 'strict-douban',
  });
};

const resolveEpisodeOnlyStrictTMDB = ({
  episodeNo,
  tmdbDetail,
  tmdbMultiSeason,
}) => {
  if (tmdbMultiSeason || episodeNo <= 0) return [];
  const tmdb = tmdbSeasonEpisodeOfGlobal(tmdbDetail, episodeNo);
  if (normalizeInt(tmdb && tmdb.season) !== 1 || normalizeInt(tmdb && tmdb.episode) !== episodeNo) return [];
  return buildMappingCandidate({
    from: 'tmdb',
    global: episodeNo,
    tmdbDetail,
    tmdb,
    resolutionMode: 'strict-tmdb',
  });
};

const resolveSeasonMarkedDegradedSingleBaseline = ({
  episodeNo,
  tmdbDetail,
  doubanMeta,
  tmdbMultiSeason,
  doubanMultiSeason,
  sourceEpisodeNos,
}) => {
  return resolveSingleBaselineFallback({
    episodeNo,
    tmdbDetail,
    doubanMeta,
    tmdbMultiSeason,
    doubanMultiSeason,
    sourceEpisodeNos,
  });
};

const buildSeasonMarkedMappings = ({
  seasonNo,
  episodeNo,
  tmdbDetail,
  doubanMeta,
  tmdbMultiSeason,
  doubanMultiSeason,
  sourceEpisodeNos,
  allowDegradedMapping = true,
  requireDoubanReadyForMultiSeasonFallback = true,
}) => {
  const tmdbSeasonRows = Array.isArray(tmdbDetail && tmdbDetail.seasons) ? tmdbDetail.seasons : [];
  const doubanSeasonRows = Array.isArray(doubanMeta && doubanMeta.seasons) ? doubanMeta.seasons : [];
  const tmdbCounts = buildSeasonCountLookup(tmdbSeasonRows, 'episodes');
  const doubanCounts = buildSeasonCountLookup(doubanSeasonRows, 'episodeCount');

  const strictTMDB = resolveSeasonMarkedStrictTMDB({
    seasonNo,
    episodeNo,
    tmdbDetail,
    tmdbCounts,
  });
  if (strictTMDB.length) return strictTMDB;

  const doubanReady = doubanCounts.size > 0 || !requireDoubanReadyForMultiSeasonFallback;
  if (doubanReady) {
    const strictDouban = resolveSeasonMarkedStrictDouban({
      seasonNo,
      episodeNo,
      tmdbDetail,
      doubanMeta,
      doubanCounts,
    });
    if (strictDouban.length) return strictDouban;
  }

  if (!allowDegradedMapping) return [];
  if (requireDoubanReadyForMultiSeasonFallback && !doubanReady) return [];
  return resolveSeasonMarkedDegradedSingleBaseline({
    episodeNo,
    tmdbDetail,
    doubanMeta,
    tmdbMultiSeason,
    doubanMultiSeason,
    sourceEpisodeNos,
  });
};

const buildEpisodeOnlyMappings = ({
  episodeNo,
  tmdbDetail,
  doubanMeta,
  tmdbMultiSeason,
  doubanMultiSeason,
  sourceEpisodeNos,
  allowDegradedMapping = true,
  requireDoubanReadyForMultiSeasonFallback = true,
}) => {
  const strictTMDB = resolveEpisodeOnlyStrictTMDB({
    episodeNo,
    tmdbDetail,
    tmdbMultiSeason,
  });
  if (strictTMDB.length) return strictTMDB;
  if (!allowDegradedMapping) return [];
  const doubanReady = Array.isArray(doubanMeta && doubanMeta.seasons) && doubanMeta.seasons.length > 0;
  if (requireDoubanReadyForMultiSeasonFallback && !doubanReady) return [];
  if (!tmdbMultiSeason || !doubanMultiSeason) {
    return resolveSingleBaselineFallback({
      episodeNo,
      tmdbDetail,
      doubanMeta,
      tmdbMultiSeason,
      doubanMultiSeason,
      sourceEpisodeNos,
    });
  }
  return [];
};

const buildCandidateMappings = ({
  season,
  episode,
  tmdbDetail,
  doubanMeta,
  tmdbMultiSeason,
  doubanMultiSeason,
  sourceEpisodeNos,
  allowDegradedMapping = true,
  requireDoubanReadyForMultiSeasonFallback = true,
}) => {
  const seasonNo = normalizeInt(season);
  const episodeNo = normalizeInt(episode);
  if (episodeNo <= 0) return [];
  if (seasonNo <= 0) {
    return buildEpisodeOnlyMappings({
      episodeNo,
      tmdbDetail,
      doubanMeta,
      tmdbMultiSeason,
      doubanMultiSeason,
      sourceEpisodeNos,
      allowDegradedMapping,
      requireDoubanReadyForMultiSeasonFallback,
    });
  }
  return buildSeasonMarkedMappings({
    seasonNo,
    episodeNo,
    tmdbDetail,
    doubanMeta,
    tmdbMultiSeason,
    doubanMultiSeason,
    sourceEpisodeNos,
    allowDegradedMapping,
    requireDoubanReadyForMultiSeasonFallback,
  });
};

export const buildPlaybackRecognitionData = ({
  entry,
  siteResultItem,
  runtimeSettings,
  smartEpisodeMapping,
  allowDegradedMapping = true,
  requireDoubanReadyForMultiSeasonFallback = true,
} = {}) => {
  const source = siteResultItem && typeof siteResultItem === 'object'
    ? {
        key: normalizeString(entry && entry.key),
        siteKey: normalizeString(siteResultItem.siteKey),
        siteName: normalizeString(siteResultItem.siteName),
        spiderApi: normalizeString(siteResultItem.spiderApi),
        videoId: normalizeString(siteResultItem.videoId),
        panFlag: normalizeString(entry && entry.label),
      }
    : null;
  if (!entry || !entry.url) {
    return { source, items: [], tier1: [], tier2: [], tier3: [] };
  }

  const compiledRules = compileMagicEpisodeRules(runtimeSettings && runtimeSettings.magicEpisodeRules);
  const cleanRules = compileMagicCleanRules(runtimeSettings && runtimeSettings.magicEpisodeCleanRegexRules);
  const movieRules = compileMagicMovieRules(runtimeSettings && runtimeSettings.magicMovieRules);
  const panTokens = Array.isArray(runtimeSettings && runtimeSettings.smartPanMatchTokens)
    ? runtimeSettings.smartPanMatchTokens
    : [];
  const panMappings = Array.isArray(runtimeSettings && runtimeSettings.smartPanAliasMappings)
    ? runtimeSettings.smartPanAliasMappings
    : [];
  const segments = buildSegmentItems(entry);
  const folderStats = buildFolderStats(segments);
  const tmdbDetail = smartEpisodeMapping && Array.isArray(smartEpisodeMapping.tmdbSeasons) && smartEpisodeMapping.tmdbSeasons.length
    ? {
        latestGlobal: normalizeInt(smartEpisodeMapping.totalEpisodes),
        seasons: smartEpisodeMapping.tmdbSeasons.map((item) => ({
          season: item.season,
          episodes: item.episodeCount,
        })),
      }
    : null;
  const doubanMeta = smartEpisodeMapping && Array.isArray(smartEpisodeMapping.doubanSeasons)
    ? {
        seasons: smartEpisodeMapping.doubanSeasons.map((item) => ({
          season: item.season,
          episodeCount: item.episodeCount,
        })),
      }
    : null;
  const tmdbMultiSeason = !!(smartEpisodeMapping && Array.isArray(smartEpisodeMapping.tmdbSeasons) && smartEpisodeMapping.tmdbSeasons.length > 1);
  const doubanMultiSeason = !!(smartEpisodeMapping && Array.isArray(smartEpisodeMapping.doubanSeasons) && smartEpisodeMapping.doubanSeasons.length > 1);
  const panMatch = resolvePanMatch(entry.label, panTokens, panMappings);
  const items = [];
  const tier1 = [];
  const tier2 = [];
  const tier3 = [];
  const sourceEpisodeNos = [];

  segments.forEach((segment) => {
    const fileParsed = extractNormalizedSeasonEpisode(segment.fileName, compiledRules, cleanRules);
    const displayParsed = !fileParsed.episode
      ? extractNormalizedSeasonEpisode(segment.displayName, compiledRules, cleanRules)
      : { season: 0, episode: 0 };

    let season = fileParsed.season;
    let episode = fileParsed.episode;
    let quality = extractQualityMark(segment.fileName);

    if (!episode && displayParsed.episode) {
      season = displayParsed.season;
      episode = displayParsed.episode;
    }
    if (episode > 0) sourceEpisodeNos.push(episode);

    const isPanMockList = !!normalizeString(entry.provider);
    if (isPanMockList && episode > 0 && season <= 0) {
      const currentQuality = pickUniqueFolderQuality(folderStats, segment.currentPath);
      const currentSeason = pickUniqueFolderSeason(folderStats, segment.currentPath);
      const parentQuality = pickUniqueFolderQuality(folderStats, segment.parentPath);
      const parentSeason = pickUniqueFolderSeason(folderStats, segment.parentPath);
      if (currentSeason > 0) {
        season = currentSeason;
      } else if (currentQuality === '4K' && parentSeason > 0) {
        season = parentSeason;
      }
      if (!quality) {
        if (currentQuality) quality = currentQuality;
        else if (currentSeason > 0 && parentQuality) quality = parentQuality;
      }
    }

    if (!quality) {
      quality = extractQualityMark(segment.displayName);
    }

    const mappings = buildCandidateMappings({
      season,
      episode,
      tmdbDetail,
      doubanMeta,
      tmdbMultiSeason,
      doubanMultiSeason,
      sourceEpisodeNos,
      allowDegradedMapping,
      requireDoubanReadyForMultiSeasonFallback,
    });
    mappings.forEach((mapping, candidateIndex) => {
      const resolutionMode = normalizeString(mapping && mapping.resolutionMode);
      const candidate = {
        key: `${normalizeString(entry.key)}:${segment.index}:${candidateIndex}`,
        matchKind: 'episode',
        source,
        panFlag: normalizeString(entry.label),
        panToken: panMatch.token,
        panTokenIndex: panMatch.index,
        provider: normalizeString(entry.provider),
        itemIndex: segment.index,
        displayName: segment.displayName,
        rawName: segment.rawName,
        fileName: segment.fileName,
        segmentIdentity: normalizeString(segment.segmentIdentity),
        pathName: segment.currentPath ? `/${segment.currentPath}` : '',
        quality,
        extracted: {
          season: normalizeInt(season),
          episode: normalizeInt(episode),
        },
        mapping,
        resolutionMode,
      };
      items.push(candidate);
      if (quality === '4K' && panMatch.index >= 0) tier1.push(candidate);
      else if (quality === '4K') tier2.push(candidate);
      else tier3.push(candidate);
    });

    const movieMatched = movieRules.length
      && extractEpisodeCandidateTextsFromSegment(segment, []).some((text) => matchesAnyMagicRule(text, movieRules));
    if (!movieMatched) return;
    const movieCandidate = {
      key: `${normalizeString(entry.key)}:${segment.index}:movie`,
      matchKind: 'movie',
      movieMatched: true,
      source,
      panFlag: normalizeString(entry.label),
      panToken: panMatch.token,
      panTokenIndex: panMatch.index,
      provider: normalizeString(entry.provider),
      itemIndex: segment.index,
      displayName: segment.displayName,
      rawName: segment.rawName,
      fileName: segment.fileName,
      segmentIdentity: normalizeString(segment.segmentIdentity),
      pathName: segment.currentPath ? `/${segment.currentPath}` : '',
      quality,
      extracted: {
        season: 0,
        episode: 0,
      },
      mapping: null,
    };
    items.push(movieCandidate);
    if (quality === '4K' && panMatch.index >= 0) tier1.push(movieCandidate);
    else if (quality === '4K') tier2.push(movieCandidate);
    else tier3.push(movieCandidate);
  });

  return { source, items, tier1, tier2, tier3 };
};

export const detectPlaybackSiteContentKind = ({ panSources, runtimeSettings } = {}) => {
  const pans = Array.isArray(panSources) ? panSources : [];
  if (!pans.length) return 'unknown';

  const episodeRules = compileMagicEpisodeRules(runtimeSettings && runtimeSettings.magicEpisodeRules);
  const movieRules = compileMagicMovieRules(runtimeSettings && runtimeSettings.magicMovieRules);
  const maxPerPan = 20;
  const maxTotal = 80;
  let seen = 0;

  if (episodeRules.length) {
    for (let p = 0; p < pans.length && seen < maxTotal; p += 1) {
      const segments = buildSegmentItems(pans[p]);
      const take = Math.min(maxPerPan, segments.length);
      for (let i = 0; i < take && seen < maxTotal; i += 1) {
        const candidates = extractEpisodeCandidateTextsFromSegment(segments[i], episodeRules);
        if (candidates.some((text) => matchesAnyMagicRule(text, episodeRules))) return 'series';
        seen += 1;
      }
    }
  }

  if (pans.length === 1) {
    const singleSegments = buildSegmentItems(pans[0]);
    if (singleSegments.length > 10) return 'unknown';
  }

  if (movieRules.length) {
    seen = 0;
    for (let p = 0; p < pans.length && seen < maxTotal; p += 1) {
      const segments = buildSegmentItems(pans[p]);
      const take = Math.min(maxPerPan, segments.length);
      for (let i = 0; i < take && seen < maxTotal; i += 1) {
        const candidates = extractEpisodeCandidateTextsFromSegment(segments[i], episodeRules);
        if (candidates.some((text) => matchesAnyMagicRule(text, movieRules))) return 'movie';
        seen += 1;
      }
    }
  }

  return 'unknown';
};
