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
  if (!raw) return { season: 0, episode: 0 };

  const mCn = raw.match(/第\s*(\d{1,3})\s*季\s*第\s*(\d{1,5})\s*(?:集|话|回|期)/i);
  if (mCn && mCn[1] && mCn[2]) {
    const season = normalizeInt(mCn[1]);
    const episode = normalizeInt(mCn[2]);
    return { season, episode };
  }

  const mSe = raw.match(/\bS\s*(\d{1,3})\s*E\s*(\d{1,5})\b/i);
  if (mSe && mSe[1] && mSe[2]) {
    const season = normalizeInt(mSe[1]);
    const episode = normalizeInt(mSe[2]);
    return { season, episode };
  }

  const mUp = raw.match(/更新至\s*(\d{1,6})\s*(?:集|话|回|期)/i);
  if (mUp && mUp[1]) {
    const episode = normalizeInt(mUp[1]);
    return { season: 1, episode };
  }

  return { season: 0, episode: 0 };
};

const resolveEffectiveSeasonCount = (seasonCount, latestSeason) => {
  const sc = normalizeInt(seasonCount);
  const ls = normalizeInt(latestSeason);
  if (ls >= 2) return Math.max(sc, ls);
  if (sc === 2 && ls === 1) return 1;
  return sc;
};

export const formatTMDBTVRemark = ({ badge, status, seasonCount, episodeCount } = {}) => {
  const raw = typeof badge === 'string' ? badge.trim() : '';
  const latest = parseLatestFromBadge(raw);
  const sc = resolveEffectiveSeasonCount(seasonCount, latest.season);
  const ec = normalizeInt(episodeCount) || parseTotalFromBadge(raw);
  const ended =
    isEndedStatus(status) ||
    /^共\s*\d{1,6}\s*(?:集|话|回|期)/i.test(raw) ||
    /(?:已完结|完结|全集)/i.test(raw);

  if (ended) {
    if (sc >= 2 && ec > 0) return `共${sc}季${ec}集`;
    if (ec > 0) return `共${ec}集`;
    return raw || '';
  }

  let ls = normalizeInt(latest.season);
  let le = normalizeInt(latest.episode);
  const multi = sc >= 2 || ls >= 2;

  const updatePart = (() => {
    if (le <= 0) return '';
    if (!multi) return `更新至第${le}集`;
    if (ls > 0) return `更新至第${ls}季第${le}集`;
    return `更新至第${le}集`;
  })();

  if (updatePart) return updatePart;
  if (ec > 0) {
    if (!multi) return `共${ec}集`;
    if (sc > 0) return `共${sc}季${ec}集`;
    return `共${ec}集`;
  }
  return raw || '';
};
