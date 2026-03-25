const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const normalizeTMDBID = (value) => (
  typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 0
);

const requestJson = async (url, options = {}) => {
  const resp = await fetch(url, options);
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const message = data && (data.error || data.message) ? String(data.error || data.message) : `HTTP ${resp.status}`;
    throw new Error(message);
  }
  return data;
};

const buildTVMetaURL = ({ tmdbId } = {}) => {
  const id = Math.max(0, normalizeTMDBID(tmdbId));
  if (id <= 0) return '';
  const searchParams = new URLSearchParams({ id: String(id) });
  return `/api/tv/meta?${searchParams.toString()}`;
};

const tvMetaCache = new Map();

export const fetchTVMetaCached = async ({ tmdbId } = {}) => {
  const id = Math.max(0, normalizeTMDBID(tmdbId));
  if (id <= 0) throw new Error('TV Meta 参数无效');

  const cacheKey = String(id);
  const cached = tvMetaCache.get(cacheKey);
  if (cached && cached.status === 'resolved') return cached.data;
  if (cached && cached.status === 'pending') return cached.promise;

  const promise = requestJson(buildTVMetaURL({ tmdbId: id }), {
    method: 'GET',
    credentials: 'same-origin',
  })
    .then((data) => {
      tvMetaCache.set(cacheKey, { status: 'resolved', data });
      return data;
    })
    .catch((error) => {
      tvMetaCache.delete(cacheKey);
      throw error;
    });

  tvMetaCache.set(cacheKey, { status: 'pending', promise });
  return promise;
};

export const clearTVMetaCache = () => {
  tvMetaCache.clear();
};

export const normalizeTVMetaSeasonRows = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  return list
    .map((item) => ({
      season: Math.max(0, normalizeInt(item && item.season_number)),
      episodeCount: Math.max(0, normalizeInt(item && item.episode_count)),
    }))
    .filter((item) => item.season > 0 && item.episodeCount > 0)
    .sort((left, right) => left.season - right.season);
};

export const normalizeTVMetaPayload = (payload) => {
  const raw = payload && typeof payload === 'object' ? payload : {};
  const tmdbSeasons = normalizeTVMetaSeasonRows(raw.tmdb_seasons);
  const doubanSeasons = normalizeTVMetaSeasonRows(raw.douban_seasons);
  return {
    tmdbId: Math.max(0, normalizeTMDBID(raw.tmdb_id)),
    seasonCount: Math.max(0, normalizeInt(raw.season_count)),
    tmdbTotalEpisodeCount: Math.max(
      0,
      normalizeInt(raw.tmdb_total_episode_count),
    ),
    doubanTotalEpisodeCount: Math.max(
      0,
      normalizeInt(raw.douban_total_episode_count),
    ),
    doubanLeads: !!raw.douban_leads,
    tmdbSeasons,
    doubanSeasons,
  };
};
