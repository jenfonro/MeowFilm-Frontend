const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};

const buildTMDBRenderedSeasonRows = (detail) => {
  const latestGlobal = Math.max(0, normalizeInt(detail && detail.latestGlobal));
  if (latestGlobal <= 0) return [];
  const seasons = Array.isArray(detail && detail.seasons) ? detail.seasons : [];
  const rows = seasons
    .map((item) => ({
      season: normalizeInt(item && item.season),
      episodeCount: normalizeInt(item && item.episodes),
    }))
    .filter((item) => item.season > 0 && item.episodeCount > 0)
    .sort((left, right) => left.season - right.season);
  if (!rows.length) return [];
  if (rows.length === 1) {
    return [{ season: rows[0].season, episodeCount: latestGlobal }];
  }
  let remaining = latestGlobal;
  return rows
    .map((item) => {
      if (remaining <= 0) return null;
      const count = Math.min(item.episodeCount, remaining);
      remaining -= count;
      if (count <= 0) return null;
      return {
        season: item.season,
        episodeCount: count,
      };
    })
    .filter(Boolean);
};

const buildDoubanSeasonRows = (meta) => {
  const seasons = Array.isArray(meta && meta.seasons) ? meta.seasons : [];
  return seasons
    .map((item) => ({
      season: normalizeInt(item && item.season),
      episodeCount: normalizeInt(item && item.episodeCount),
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      displayLabel: typeof item?.displayLabel === 'string' ? item.displayLabel.trim() : '',
      doubanId: typeof item?.doubanId === 'string' ? item.doubanId.trim() : '',
    }))
    .filter((item) => item.season > 0 && item.episodeCount > 0)
    .sort((left, right) => left.season - right.season);
};

export const tmdbSeasonEpisodeOfGlobal = (detail, globalNo) => {
  const g = normalizeInt(globalNo);
  if (g <= 0) return { season: 0, episode: 0 };
  const rows = buildTMDBRenderedSeasonRows(detail);
  if (!rows.length) return { season: 0, episode: g };
  let left = g;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.episodeCount <= 0) continue;
    if (left > row.episodeCount) {
      left -= row.episodeCount;
      continue;
    }
    return { season: row.season, episode: left };
  }
  return { season: 0, episode: g };
};

export const tmdbGlobalEpisodeNoOf = (detail, seasonNo, episodeNo) => {
  const season = normalizeInt(seasonNo);
  const episode = normalizeInt(episodeNo);
  if (season <= 0 || episode <= 0) return 0;
  const rows = buildTMDBRenderedSeasonRows(detail);
  if (!rows.length) return 0;
  let sum = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row) continue;
    if (row.season < season) {
      sum += row.episodeCount;
      continue;
    }
    if (row.season === season) return sum + episode;
  }
  return 0;
};

export const doubanGlobalEpisodeNoOf = (meta, seasonNo, episodeNo) => {
  const season = normalizeInt(seasonNo);
  const episode = normalizeInt(episodeNo);
  if (season <= 0 || episode <= 0) return 0;
  const rows = buildDoubanSeasonRows(meta);
  if (!rows.length) return 0;
  let sum = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row) continue;
    if (row.season < season) {
      sum += row.episodeCount;
      continue;
    }
    if (row.season === season) return sum + episode;
  }
  return 0;
};

export const doubanSeasonEpisodeOfGlobal = (meta, globalNo) => {
  const g = normalizeInt(globalNo);
  if (g <= 0) return { season: 0, episode: 0 };
  const rows = buildDoubanSeasonRows(meta);
  if (!rows.length) return { season: 0, episode: g };
  let left = g;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.episodeCount <= 0) continue;
    if (left > row.episodeCount) {
      left -= row.episodeCount;
      continue;
    }
    return { season: row.season, episode: left };
  }
  return { season: 0, episode: g };
};

export const buildSmartEpisodeMapping = ({ tmdbDetail, doubanMeta } = {}) => {
  const tmdbRows = buildTMDBRenderedSeasonRows(tmdbDetail);
  const doubanRows = buildDoubanSeasonRows(doubanMeta);
  const totalEpisodes = Math.max(0, normalizeInt(tmdbDetail && tmdbDetail.latestGlobal));
  if (!tmdbRows.length || totalEpisodes <= 0) {
    return {
      totalEpisodes: 0,
      tmdbSeasons: tmdbRows,
      doubanSeasons: doubanRows,
      items: [],
    };
  }
  const items = [];
  for (let global = 1; global <= totalEpisodes; global += 1) {
    items.push({
      global,
      tmdb: tmdbSeasonEpisodeOfGlobal(tmdbDetail, global),
      douban: doubanSeasonEpisodeOfGlobal(doubanMeta, global),
    });
  }
  return {
    totalEpisodes,
    tmdbSeasons: tmdbRows,
    doubanSeasons: doubanRows,
    items,
  };
};
