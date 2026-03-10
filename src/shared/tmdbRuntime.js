const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const requestJson = async (url, options = {}) => {
  const resp = await fetch(url, options);
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const message = data && (data.error || data.message) ? String(data.error || data.message) : `HTTP ${resp.status}`;
    throw new Error(message);
  }
  return data;
};

const buildTMDBDetailURL = ({ type, id } = {}) => {
  const tmdbType = normalizeString(type).toLowerCase();
  const tmdbId = normalizeString(id);
  if (!tmdbId || (tmdbType !== 'movie' && tmdbType !== 'tv')) return '';
  const searchParams = new URLSearchParams({ type: tmdbType, id: tmdbId });
  return `/api/tmdb/detail?${searchParams.toString()}`;
};

const tmdbDetailCache = new Map();

export const fetchTMDBDetailCached = async ({ type, id } = {}) => {
  const tmdbType = normalizeString(type).toLowerCase();
  const tmdbId = normalizeString(id);
  if (!tmdbId || (tmdbType !== 'movie' && tmdbType !== 'tv')) {
    throw new Error('TMDB 参数无效');
  }

  const cacheKey = `${tmdbType}:${tmdbId}`;
  const cached = tmdbDetailCache.get(cacheKey);
  if (cached && cached.status === 'resolved') return cached.data;
  if (cached && cached.status === 'pending') return cached.promise;

  const promise = requestJson(buildTMDBDetailURL({ type: tmdbType, id: tmdbId }), {
    method: 'GET',
    credentials: 'same-origin',
  })
    .then((data) => {
      tmdbDetailCache.set(cacheKey, { status: 'resolved', data });
      return data;
    })
    .catch((error) => {
      tmdbDetailCache.delete(cacheKey);
      throw error;
    });

  tmdbDetailCache.set(cacheKey, { status: 'pending', promise });
  return promise;
};

export const clearTMDBDetailCache = () => {
  tmdbDetailCache.clear();
};
