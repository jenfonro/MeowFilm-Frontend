const normalizeInt = (v) => {
  const n = Number.isFinite(Number(v)) ? Math.floor(Number(v)) : 0;
  return n > 0 ? n : 0;
};

const isEndedStatus = (status) => String(status || '').trim().toLowerCase() === 'ended';

const parseTotalFromBadge = (badge) => {
  const s = typeof badge === 'string' ? badge.trim() : '';
  if (!s) return 0;
  const m = s.match(/共\s*(\d{1,6})\s*(?:集|话|回|期)/i);
  if (!m || !m[1]) return 0;
  return normalizeInt(m[1]);
};

const parseLatestFromBadge = (badge) => {
  const raw = typeof badge === 'string' ? badge.trim() : '';
  if (!raw) return { season: 0, episode: 0, kind: '' };

  const mCn = raw.match(/第\s*(\d{1,3})\s*季\s*第\s*(\d{1,5})\s*(?:集|话|回|期)/i);
  if (mCn && mCn[1] && mCn[2]) {
    const season = normalizeInt(mCn[1]);
    const episode = normalizeInt(mCn[2]);
    return { season, episode, kind: 'seasoned' };
  }

  const mSe = raw.match(/\bS\s*(\d{1,3})\s*E\s*(\d{1,5})\b/i);
  if (mSe && mSe[1] && mSe[2]) {
    const season = normalizeInt(mSe[1]);
    const episode = normalizeInt(mSe[2]);
    return { season, episode, kind: 'seasoned' };
  }

  const mUp = raw.match(/更新至\s*(\d{1,6})\s*(?:集|话|回|期)/i);
  if (mUp && mUp[1]) {
    const episode = normalizeInt(mUp[1]);
    return { season: 0, episode, kind: 'unseasoned' };
  }

  return { season: 0, episode: 0, kind: '' };
};

const resolveEffectiveSeasonCount = (seasonCount, latestSeason) => {
  const sc = normalizeInt(seasonCount);
  const ls = normalizeInt(latestSeason);
  if (ls >= 2) return Math.max(sc, ls);
  if (sc === 2 && ls === 1) return 1;
  return sc;
};

const parseSeasonFromTitle = (title) => {
  const raw = typeof title === 'string' ? title.trim() : '';
  if (!raw) return 0;

  const mCn = raw.match(/第\s*(\d{1,3})\s*季/i);
  if (mCn && mCn[1]) return normalizeInt(mCn[1]);

  const mSe = raw.match(/\bS\s*(\d{1,3})\b/i);
  if (mSe && mSe[1]) return normalizeInt(mSe[1]);

  const mEn = raw.match(/\bSeason\s*(\d{1,3})\b/i);
  if (mEn && mEn[1]) return normalizeInt(mEn[1]);

  // Very small chinese numerals subset (1-10) for common season suffixes.
  const cn = raw.match(/第\s*([一二三四五六七八九十])\s*季/);
  if (cn && cn[1]) {
    const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
    return map[cn[1]] || 0;
  }
  return 0;
};

export const formatTMDBTVRemark = ({ badge, status, seasonCount, episodeCount, title } = {}) => {
  const raw = typeof badge === 'string' ? badge.trim() : '';
  const latest = parseLatestFromBadge(raw);
  const sc = resolveEffectiveSeasonCount(seasonCount, latest.season);
  const ec = normalizeInt(episodeCount) || parseTotalFromBadge(raw);
  const ended = isEndedStatus(status);

  if (ended) {
    if (sc >= 2 && ec > 0) return `共${sc}季${ec}集`;
    if (ec > 0) return `共${ec}集`;
    return '已完结';
  }

  let ls = normalizeInt(latest.season);
  let le = normalizeInt(latest.episode);
  const titleSeason = parseSeasonFromTitle(title);
  if (latest.kind === 'unseasoned') {
    if (titleSeason > 0) {
      ls = titleSeason;
    } else if (sc <= 1) {
      ls = 1;
    } else {
      // Multi-season without an explicit season marker: ignore "更新至第xx集" as ambiguous.
      le = 0;
      ls = 0;
    }
  }
  const multi = sc >= 2 || ls >= 2;

  const updatePart = (() => {
    if (le <= 0) return '';
    if (!multi) return `更新至第${le}集`;
    if (ls > 0) return `更新至第${ls}季第${le}集`;
    return `更新至第${le}集`;
  })();

  // Not ended: only trust explicit "更新至 ..." progress. Totals like "共xx集/全xx集" are often inaccurate here.
  if (updatePart) return updatePart;
  return '';
};
