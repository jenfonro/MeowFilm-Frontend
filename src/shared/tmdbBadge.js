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

export const formatTMDBTVRemark = ({ badge, status, seasonCount, episodeCount } = {}) => {
  const raw = typeof badge === 'string' ? badge.trim() : '';
  const sc = normalizeInt(seasonCount);
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

  if (!raw) return '';

  const mCn = raw.match(/第\s*(\d{1,3})\s*季\s*第\s*(\d{1,5})\s*(?:集|话|回|期)/i);
  if (mCn && mCn[1] && mCn[2]) {
    const s = normalizeInt(mCn[1]);
    const e = normalizeInt(mCn[2]);
    if (s > 0 && e > 0) {
      if (sc === 1 && s === 1) return `更新至第${e}集`;
      return `更新至第${s}季第${e}集`;
    }
  }
  const mSe = raw.match(/\bS\s*(\d{1,3})\s*E\s*(\d{1,5})\b/i);
  if (mSe && mSe[1] && mSe[2]) {
    const s = normalizeInt(mSe[1]);
    const e = normalizeInt(mSe[2]);
    if (s > 0 && e > 0) {
      if (sc === 1 && s === 1) return `更新至第${e}集`;
      return `更新至第${s}季第${e}集`;
    }
  }
  const mUp = raw.match(/更新至\s*(\d{1,6})\s*(?:集|话|回|期)/i);
  if (mUp && mUp[1]) {
    const e = normalizeInt(mUp[1]);
    if (e > 0) return `更新至第${e}集`;
  }
  return raw;
};
