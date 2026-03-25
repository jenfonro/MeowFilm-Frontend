const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const normalizePositiveInteger = (value) => (
  typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 0
);

export const normalizeTMDBMediaType = (value) => {
  const raw = normalizeString(value).toLowerCase();
  if (raw === 'movie' || raw === 'tv') return raw;
  return '';
};

export const normalizeTMDBID = (value) => {
  const id = normalizePositiveInteger(value);
  return id > 0 ? id : 0;
};

export const getTMDBSearchResults = (payload) => (
  payload && Array.isArray(payload.results) ? payload.results : []
);

export const getTMDBSearchTitle = (item) => {
  const target = item && typeof item === 'object' ? item : null;
  const tmdbType = normalizeTMDBMediaType(target && target.media_type);
  if (tmdbType === 'movie') {
    return normalizeString(target && target.title) || normalizeString(target && target.original_title);
  }
  if (tmdbType === 'tv') {
    return normalizeString(target && target.name) || normalizeString(target && target.original_name);
  }
  return '';
};

export const getTMDBDetailTitle = (detail, tmdbType = '') => {
  const target = detail && typeof detail === 'object' ? detail : null;
  const normalizedType = normalizeTMDBMediaType(tmdbType);
  if (normalizedType === 'movie') {
    return normalizeString(target && target.title) || normalizeString(target && target.original_title);
  }
  if (normalizedType === 'tv') {
    return normalizeString(target && target.name) || normalizeString(target && target.original_name);
  }
  return '';
};

export const getTMDBReleaseDateText = (payload) => {
  const target = payload && typeof payload === 'object' ? payload : null;
  return normalizeString(target && target.release_date) || normalizeString(target && target.first_air_date);
};

export const getTMDBYear = (payload) => {
  const raw = getTMDBReleaseDateText(payload);
  const match = raw.match(/^(\d{4})/);
  return match && match[1] ? normalizeInt(match[1]) : 0;
};

export const getTMDBPosterPath = (payload) => {
  const target = payload && typeof payload === 'object' ? payload : null;
  return normalizeString(target && target.poster_path);
};

export const getTMDBBackdropPath = (payload) => {
  const target = payload && typeof payload === 'object' ? payload : null;
  return normalizeString(target && target.backdrop_path);
};

export const getTMDBOrdinarySeasons = (detail) => {
  const target = detail && typeof detail === 'object' ? detail : null;
  const seasons = Array.isArray(target && target.seasons) ? target.seasons : [];
  return seasons
    .map((item) => ({
      season: normalizeInt(item && item.season_number),
      episodes: normalizeInt(item && item.episode_count),
    }))
    .filter((item) => item.season > 0 && item.episodes > 0)
    .sort((left, right) => left.season - right.season);
};

export const getTMDBNextEpisodeToAir = (detail) => {
  const target = detail && typeof detail === 'object' ? detail : null;
  const next = target && typeof target.next_episode_to_air === 'object' ? target.next_episode_to_air : null;
  if (!next) return null;
  return {
    seasonNumber: normalizeInt(next.season_number),
    episodeNumber: normalizeInt(next.episode_number),
    airDate: normalizeString(next.air_date),
  };
};

export const getTMDBStatus = (detail) => normalizeString(detail && detail.status);

const getTodayDateText = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const buildTMDBDetailTextBadge = (detail, tmdbType = '') => {
  const type = normalizeTMDBMediaType(tmdbType);
  if (type === 'movie') {
    const year = getTMDBYear(detail);
    return year > 0 ? String(year) : '';
  }
  if (type !== 'tv') return '';

  const ordinarySeasons = getTMDBOrdinarySeasons(detail);
  const seasonCount = ordinarySeasons.length;
  const totalEpisodes = ordinarySeasons.reduce((sum, item) => sum + normalizeInt(item && item.episodes), 0);
  const status = getTMDBStatus(detail).toLowerCase();
  const nextEpisode = getTMDBNextEpisodeToAir(detail);
  const nextSeasonNumber = normalizeInt(nextEpisode && nextEpisode.seasonNumber);
  const nextEpisodeNumber = normalizeInt(nextEpisode && nextEpisode.episodeNumber);
  const nextAirDate = normalizeString(nextEpisode && nextEpisode.airDate);

  if (status === 'ended') {
    if (totalEpisodes <= 0) return '';
    return seasonCount > 1 ? `共${seasonCount}季${totalEpisodes}集` : `共${totalEpisodes}集`;
  }

  const currentEpisodeNumber = nextAirDate && nextAirDate <= getTodayDateText()
    ? nextEpisodeNumber
    : Math.max(0, nextEpisodeNumber - 1);
  if (currentEpisodeNumber > 0) {
    if (nextSeasonNumber > 1 && seasonCount > 1) {
      return `更新至第${nextSeasonNumber}季第${currentEpisodeNumber}集`;
    }
    return `更新至第${currentEpisodeNumber}集`;
  }

  return normalizeString(status) ? '持续更新' : '';
};
