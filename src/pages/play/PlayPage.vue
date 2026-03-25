<template>
  <main
    id="playPage"
    class="play-page play-page-root"
  >
    <div class="play-page__content">
      <div class="play-header ui-page-header">
        <div class="play-header__row ui-page-header__row">
          <button type="button" class="ui-nav-back-btn" aria-label="返回" @click="$emit('back')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <div class="play-header__main ui-page-header__main">
            <div class="play-header__titleRow ui-page-header__titleRow">
              <h1 class="play-header__title">
              <span id="playTitle" class="play-header__titleText">{{ displayTitle }}</span>
              </h1>
              <button type="button" class="play-detail__favBtn" aria-label="收藏">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="play-detail__favIcon" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="play-page__main">
        <div class="play-episode-toggle-wrap">
          <button id="episodePanelToggle" class="play-episode-toggle" type="button" title="隐藏选集面板">
            <svg id="episodePanelToggleIcon" class="play-episode-toggle__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span id="episodePanelToggleLabel" class="play-episode-toggle__label">隐藏</span>
            <div id="episodePanelToggleDot" class="play-episode-toggle__dot"></div>
          </button>
        </div>

        <div id="playGrid" ref="playGridEl" class="play-grid">
          <div id="playerArea" ref="playerAreaEl" class="play-player-area">
            <div class="play-player-stack">
              <div class="play-video-ratio">
                <div class="play-video-ratio__inner">
                  <ArtPlayer
                    ref="artPlayerRef"
                    :url="playerUrl"
                    :poster="''"
                    :headers="playerHeaders"
                    :title="displayTitle"
                    :stats-extra="playerStatsExtra"
                    :extra-menus="playerExtraMenus"
                    :extra-actions="playerExtraActions"
                    :go-proxy-options="goProxyUiOptions"
                    :go-proxy-selected-base="goProxyManualBase"
                    :go-proxy-label="goProxyUiLabel"
                    :show-buffer-ring="playerPhase === 'buffering'"
                    :toast-text="playerToastText"
                    @error="onPlayerError"
                    @buffering="onPlayerBuffering"
                    @playing="onPlayerPlaying"
                    @firstframe="onPlayerFirstFrame"
                    @ended="onPlayerEnded"
                    @loadedmetadata="onPlayerVideoInfo"
                    @videoinfo="onPlayerVideoInfo"
                    @timeupdate="onPlayerTimeUpdate"
                    @goproxyselect="onGoProxySelect"
                    @extramenuselect="onPlayerExtraMenuSelect"
                    @extraaction="onPlayerExtraAction"
                  />
                  <div
                    v-show="showPlayerStatusOverlay"
                    class="play-player-overlay"
                    :class="{ 'play-player-overlay--error': playerPhase === 'error' }"
                  >
                    <div class="play-player-overlay__panel" :style="{ '--play-stage-p': playerStageProgress }">
                      <div class="play-player-overlay__text">
                        <div class="play-player-overlay__status">
                          <div class="play-player-overlay__statusText">{{ playerPhaseText }}</div>
                          <div v-if="playerPhaseLoading" class="tv-spinner play-player-overlay__spinner" aria-hidden="true"></div>
                        </div>
                      </div>
                      <div
                        class="play-player-overlay__progress"
                        role="progressbar"
                        :aria-label="`加载进度：${Math.round(playerStageProgress * 100)}%`"
                        :aria-valuenow="Math.round(playerStageProgress * 100)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div class="play-player-overlay__track" aria-hidden="true">
                          <div class="play-player-overlay__fill"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="play-thirdparty-bar">
                <div class="play-thirdparty-bar__inner">
                  <button
                    v-for="player in thirdPartyVisiblePlayers"
                    :key="player.icon"
                    type="button"
                    class="play-thirdparty-btn"
                    :aria-label="player.name"
                    :title="player.name"
                    :disabled="!playerUrl"
                    @click="openWithThirdPartyPlayer(player)"
                  >
                    <img :src="`/images/${player.icon}.webp`" :alt="player.name" class="play-thirdparty-icon" />
                  </button>
                  <button
                    type="button"
                    class="play-thirdparty-expand"
                    :aria-label="thirdPartyExpanded ? '收起' : '展开'"
                    :title="thirdPartyExpanded ? '收起' : '展开'"
                    @click="toggleThirdPartyExpanded"
                  >
                    <svg
                      class="play-thirdparty-expand__ico"
                      :class="{ 'play-thirdparty-expand__ico--open': thirdPartyExpanded }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="episodePanel" ref="episodePanelEl" class="play-episode-panel" :style="episodePanelStyle">
            <div id="episodePanelResizer" ref="episodePanelResizerEl" class="episode-resizer" aria-hidden="true"></div>
            <div id="episodeSelector" class="play-episode-selector">
              <div class="episode-tab-header play-episode-tabs">
                <button id="tabEpisodes" type="button" class="episode-tab-btn episode-tab-btn--active">
                  选集
                </button>
                <button id="tabSources" type="button" class="episode-tab-btn">
                  换源
                </button>
              </div>
              <div class="play-episode-body">
                <div id="playSiteSourceRow" class="ui-select-row play-picker-row">
                  <div class="ui-select-row__main">
                    <div
                      id="playSiteSourceSelect"
                      ref="siteSourceSelectEl"
                      class="ui-selectbox ui-selectbox--compact play-picker"
                    >
                      <button
                        id="playSiteSourceTrigger"
                        type="button"
                        class="ui-selectbox__trigger"
                        aria-haspopup="listbox"
                        aria-controls="playSiteSourceMenu"
                        :aria-expanded="siteSourceOpen ? 'true' : 'false'"
                        @click.stop="toggleSiteSourceMenu"
                      >
                        {{ siteSourceTriggerLabel }}
                      </button>
                      <div
                        v-show="siteSourceOpen"
                        id="playSiteSourceMenu"
                        class="ui-selectbox__menu"
                        role="listbox"
                        aria-label="站点源列表"
                      >
                        <div
                          v-for="option in siteSourceOptions"
                          :key="option"
                          class="ui-selectbox__option"
                          :class="{ 'is-active': !selectedSiteResultItem && option === selectedSiteSource }"
                          role="option"
                          :aria-selected="!selectedSiteResultItem && option === selectedSiteSource ? 'true' : 'false'"
                          @click.stop="selectSiteSource(option)"
                        >{{ option }}</div>
                        <div
                          v-for="item in siteSourceResultItems"
                          :key="item.id"
                          class="ui-selectbox__option"
                          :class="{ 'is-active': item.id === selectedSearchResultId }"
                          role="option"
                          :aria-selected="item.id === selectedSearchResultId ? 'true' : 'false'"
                          @click.stop="selectSiteSourceResult(item)"
                        >{{ item.displayLabel }}</div>
                        <div
                          v-if="showSiteSourceSearchOption"
                          class="ui-selectbox__option"
                          :class="{ 'is-disabled': !siteSourceSearchInteractive }"
                          role="option"
                          aria-selected="false"
                          @click.stop="triggerSiteSourceSearchMore"
                        >{{ siteSourceSearchLabel }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="showPanSourceRow" id="playPanSourceRow" class="ui-select-row play-picker-row">
                  <div class="ui-select-row__main">
                    <div id="playPanSourceSelect" ref="panSourceSelectEl" class="ui-selectbox ui-selectbox--compact play-picker">
                      <button
                        id="playPanSourceTrigger"
                        type="button"
                        class="ui-selectbox__trigger"
                        aria-haspopup="listbox"
                        aria-controls="playPanSourceMenu"
                        :aria-expanded="panSourceOpen ? 'true' : 'false'"
                        @click.stop="togglePanSourceMenu"
                      >
                        {{ currentPanSourceLabel }}
                      </button>
                      <div
                        v-show="panSourceOpen"
                        id="playPanSourceMenu"
                        class="ui-selectbox__menu"
                        role="listbox"
                        aria-label="网盘源列表"
                        :style="panSourceMenuStyle"
                      >
                        <div
                          v-for="option in currentPanSourceOptions"
                          :key="option.key"
                          class="ui-selectbox__option"
                          :class="{ 'is-active': option.key === selectedPanSource }"
                          role="option"
                          :aria-selected="option.key === selectedPanSource ? 'true' : 'false'"
                          @click.stop="selectPanSource(option.key)"
                        >{{ option.label }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="ui-select-row__actions">
                    <button v-if="showProjectionSwitchButton" type="button" class="ui-control-btn" @click="cycleProjectionSource">切换</button>
                    <button v-if="!forceRawListMode" type="button" class="ui-control-btn" @click="toggleRawList">
                      {{ rawListMode ? '返回选集' : '原始列表' }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="showSeasonBar"
                  class="play-season-bar"
                  :class="{ 'play-season-bar--with-range': showRangeBar, 'play-season-bar--tight': !showRangeBar }"
                >
                  <div class="play-season-tabs">
                    <button
                      v-for="season in episodeSeasonOptions"
                      :key="season.season"
                      type="button"
                      class="play-season-btn"
                      :class="{ 'play-season-btn--active': season.season === currentEpisodeSeasonNumber }"
                      @click.prevent="selectEpisodeSeason(season.season)"
                    >{{ season.label }}</button>
                  </div>
                </div>
                <div
                  v-if="showRangeBar"
                  class="play-range-bar"
                  :class="{ 'play-range-bar--tight': !showSeasonBar }"
                >
                  <div class="play-range-tabs">
                    <button
                      v-for="range in episodeRangeOptions"
                      :key="range.start"
                      type="button"
                      class="play-range-btn"
                      :class="{ 'play-range-btn--active': range.start === currentEpisodeRangeStart }"
                      @click.prevent="selectEpisodeRange(range.start)"
                    >{{ range.label }}</button>
                  </div>
                </div>
                <div class="play-episode-content">
                  <div v-if="showSeasonBar || showRangeBar" class="play-episode-divider"></div>
                  <div v-if="showEpisodeLoadingState" class="play-episode-loading ui-loading-state">
                    <div class="ui-loading-state__spinner" aria-hidden="true"></div>
                    <div class="ui-loading-state__text">加载中...</div>
                  </div>
                  <div v-else-if="rawListMode && showPanSourceRow" class="play-raw-list">
                    <div v-if="rawListDisplayPath" class="play-raw-list__path">
                      <span class="play-raw-list__pathText" :title="rawListDisplayPath">{{ rawListDisplayPath }}</span>
                      <button
                        v-if="canGoRawDirBack"
                        type="button"
                        class="ui-control-btn play-raw-list__pathBtn"
                        @click.prevent="goRawDirBack"
                      >返回</button>
                    </div>
                    <div v-if="rawListItems.length" class="play-raw-list__items">
                      <button
                      v-for="item in rawListItems"
                      :key="item.key"
                      type="button"
                      class="play-raw-list__row"
                      :class="{
                          'play-raw-list__row--dir': item.kind === 'dir',
                          'play-raw-list__row--active': item.kind === 'file' && isCurrentRawListPlaybackSelection(item),
                          'is-current': item.kind === 'file' && !isRawListFileInteractive(item),
                        }"
                        :aria-disabled="item.kind === 'file' && !isRawListFileInteractive(item) ? 'true' : null"
                        @click.prevent="onRawListItemClick(item)"
                      >
                        <span class="play-raw-list__text">{{ item.text }}</span>
                      </button>
                    </div>
                    <div v-else class="play-episode-overlay">
                      <div class="play-episode-overlay__inner">
                        <div class="play-raw-list__empty">{{ rawListEmptyText }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="siteResultEpisodeStatusText" class="play-episode-overlay">
                    <div class="play-episode-overlay__inner">
                      <div class="play-raw-list__empty">
                    {{ siteResultEpisodeStatusText }}
                      </div>
                    </div>
                  </div>
                  <div v-else-if="showTmdbMovieCandidateList" class="play-raw-list">
                    <div v-if="tmdbMovieCandidateItems.length" class="play-raw-list__items">
                      <button
                        v-for="item in tmdbMovieCandidateItems"
                        :key="item.key"
                        type="button"
                        class="play-raw-list__row"
                        :class="{
                          'play-raw-list__row--active': isCurrentTmdbMovieCandidateSelection(item),
                          'is-current': !isTmdbMovieCandidateInteractive(item),
                        }"
                        :aria-disabled="!isTmdbMovieCandidateInteractive(item) ? 'true' : null"
                        @click.prevent="onTmdbMovieCandidateClick(item)"
                      >
                        <span class="play-raw-list__text">{{ item.displayText }}</span>
                      </button>
                    </div>
                    <div v-else class="play-episode-overlay">
                      <div class="play-episode-overlay__inner">
                        <div class="play-raw-list__empty">暂无数据</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="play-episode-grid">
                    <button
                      v-for="episode in episodeButtons"
                      :key="episode.key"
                      type="button"
                      class="play-episode-btn"
                      :class="{
                        'play-episode-btn--active': isEpisodeButtonActive(episode),
                        'is-current': !isEpisodeItemInteractive(episode),
                      }"
                      :aria-disabled="!isEpisodeItemInteractive(episode) ? 'true' : null"
                      :title="selectedSiteResultItem ? (episode.tooltip || '') : null"
                      @click.prevent="onEpisodeItemClick(episode)"
                    >
                      <span v-if="selectedSiteResultItem && episode.is4k" class="play-episode-btn__badge">4K</span>
                      <span class="play-episode-btn__text">{{ episode.text }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="play-detail">
        <div class="play-detail__inner">
          <div class="play-detail__poster">
            <div class="play-detail__posterWrap">
              <img v-if="detailPoster" :src="detailPosterDisplay" :alt="displayTitle" class="play-detail__posterImg">
              <div v-else class="play-detail__posterSkeleton"></div>
            </div>
          </div>
          <div class="play-detail__info">
            <div class="play-detail__titleRow">
              <h1 class="play-detail__title">
                <span class="play-detail__titleText">{{ displayTitle }}</span>
              </h1>
              <button type="button" class="play-detail__favBtn" aria-label="收藏">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="play-detail__favIcon"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
            <div class="play-detail__meta">
              <span
                v-for="tag in detailMetaTags"
                :key="tag"
                class="play-pill"
              >{{ tag }}</span>
            </div>
            <div class="play-detail__desc" style="white-space: pre-line;">
              {{ detailDescription }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ArtPlayer from '../../shared/ArtPlayer.vue';
import { fetchBootstrap } from '../../shared/bootstrap';
import { extractRawNamesFromEpisodeUrl, fetchCatResolvedDetailCached, requestCatPlay } from '../../shared/catpawrunner';
import { fetchDoubanSeasonMetaCached } from '../../shared/doubanRuntime';
import {
  playbackSessionState,
  buildPlayerControlUiState,
  buildSmartPlaybackConstraintStages,
  patchLastBrowsePlaybackContext,
  patchCurrentPlaybackContext,
  clearCurrentPlaybackContext,
  executeResolvedSitePlayback,
  executeProxyRetryPlayback,
  hasNonEmptyHeaders,
  doesQualityMatchResolution,
  inferQualityFromResolution,
  normalizeGoProxyServers,
} from '../../shared/playbackRuntime';
import {
  findPlayHistoryRowForContext,
  ensurePlayHistoryRowForContext,
  buildPlayHistoryPayload,
  clearActivePlayHistoryContext,
  flushHistoryProgressBestEffort,
  confirmPlayerHistoryPlaybackReady,
  onPlayerHistoryPlaybackStart,
  onPlayerHistoryTimeUpdate,
  preparePlayHistoryContext,
  syncHistoryProgressIfPossible,
  warmPlayHistoryForContext,
} from '../../shared/playHistoryRuntime';
import {
  ensureSearchSessionConfig,
  getSearchSessionAnyQuerySnapshot,
  getSearchSessionAnyQueryStatus,
  subscribeSearchSessionQuery,
  performSearchSessionSearch,
} from '../../shared/searchSession';
import { rewriteDisplayPosterUrl } from '../../shared/posterUrl';
import { addSmartMatchBlockItem, buildSearchGroupKey, clearBlockedMatchCaches, fetchBlockedMatchIndex } from '../../shared/searchRuntime';
import { runSmartPlaybackController } from '../../shared/smartPlaybackController';
import {
  buildSmartEpisodeMapping,
  doubanGlobalEpisodeNoOf,
  doubanSeasonEpisodeOfGlobal,
  tmdbGlobalEpisodeNoOf,
  tmdbSeasonEpisodeOfGlobal,
} from '../../shared/smartEpisodeMapping';
import { detectPlaybackSiteContentKind } from '../../shared/smartSourceRecognition';
import {
  buildPanSourcesFromDetail as buildPanSourcesFromDetailRuntime,
  buildSiteSourceResultItemsFromSnapshot as buildSiteSourceResultItemsFromSnapshotRuntime,
  buildPanSegment as buildPanSegmentRuntime,
  buildHistorySitePlaybackItem as buildHistorySitePlaybackItemRuntime,
  cacheRecognitionForSiteResult as cacheRecognitionForSiteResultRuntime,
  collectRecognitionCandidatesForTarget as collectRecognitionCandidatesForTargetRuntime,
  ensureSiteResultDetailCached as ensureSiteResultDetailCachedRuntime,
  getRecognitionCandidatesForSiteResult as getRecognitionCandidatesForSiteResultRuntime,
  getSiteResultDetail as getSiteResultDetailRuntime,
  resolveHistoryBootstrapPlaybackTarget as resolveHistoryBootstrapPlaybackTargetRuntime,
  resolveCachedPlaybackTarget as resolveCachedPlaybackTargetRuntime,
  setSiteResultDetailCacheEntry as setSiteResultDetailCacheEntryRuntime,
} from '../../shared/smartPlaybackRuntime';
import { fetchTMDBDetailCached } from '../../shared/tmdbRuntime';
import { scoreEpisodeDisplayName } from '../../utils/matchCore';

const THIRD_PARTY_PLAYERS = [
  { icon: 'iina', name: 'IINA', scheme: 'iina://weblink?url=$edurl' },
  { icon: 'potplayer', name: 'PotPlayer', scheme: 'potplayer://$durl' },
  { icon: 'vlc', name: 'VLC', scheme: 'vlc://$durl' },
  { icon: 'nplayer', name: 'nPlayer', scheme: 'nplayer-$durl' },
  { icon: 'omniplayer', name: 'OmniPlayer', scheme: 'omniplayer://weblink?url=$edurl' },
  { icon: 'infuse', name: 'Infuse', scheme: 'infuse://x-callback-url/play?url=$edurl' },
  { icon: 'mxplayer', name: 'MX Player', scheme: 'intent:$durl#Intent;package=com.mxtech.videoplayer.ad;S.title=$name;end' },
  { icon: 'mxplayer-pro', name: 'MX Player Pro', scheme: 'intent:$durl#Intent;package=com.mxtech.videoplayer.pro;S.title=$name;end' },
  { icon: 'iPlay', name: 'iPlay', scheme: 'iplay://play/any?type=url&url=$bdurl' },
  { icon: 'mpv', name: 'mpv', scheme: 'mpv://$edurl' },
];
const PLAY_SEARCH_SCOPE = 'play-site-only';
const TMDB_MOVIE_RECOGNITION_SIGNATURE = 'tmdb-movie';

const CIRCLED_DIGITS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
const formatCircledIndex = (index) => CIRCLED_DIGITS[index] || `(${index + 1})`;
const withSiteSourceDisplayLabels = (items) => {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const titleCounts = new Map();
  list.forEach((item) => {
    const duplicateKey = `${normalizeString(item && item.siteKey)}::${normalizeString(item && item.title)}`;
    titleCounts.set(duplicateKey, (titleCounts.get(duplicateKey) || 0) + 1);
  });
  const titleIndexes = new Map();
  return list.map((item) => {
    const duplicateKey = `${normalizeString(item && item.siteKey)}::${normalizeString(item && item.title)}`;
    const nextIndex = titleIndexes.has(duplicateKey) ? titleIndexes.get(duplicateKey) + 1 : 0;
    titleIndexes.set(duplicateKey, nextIndex);
    const duplicateCount = titleCounts.get(duplicateKey) || 0;
    return {
      ...(item || {}),
      displayLabel: `${normalizeString(item && item.siteName)}-${normalizeString(item && item.title)}${duplicateCount > 1 ? ` ${formatCircledIndex(nextIndex)}` : ''}`,
    };
  });
};

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};
const stripMarkupText = (value) =>
  String(value || '')
    .replace(/\[a=[^\]]*\/\]([\s\S]*?)\[\/a\]/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const normalizeSearchKey = (value) => normalizeString(value);
const SEASON_CN_NUMERALS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const formatChineseNumber = (value) => {
  const num = normalizeInt(value);
  if (num <= 10) return SEASON_CN_NUMERALS[num] || String(num);
  if (num < 20) return `十${SEASON_CN_NUMERALS[num - 10] || ''}`;
  if (num % 10 === 0 && num < 100) return `${SEASON_CN_NUMERALS[Math.floor(num / 10)] || String(Math.floor(num / 10))}十`;
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return `${SEASON_CN_NUMERALS[tens] || String(tens)}十${SEASON_CN_NUMERALS[ones] || String(ones)}`;
  }
  return String(num);
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

const getRawDirPath = (value) => {
  const parts = splitRawPathSegments(value);
  if (parts.length <= 1) return '';
  return `/${parts.slice(0, -1).join('/')}`;
};

const pickRawFileNameForStats = (_displayName, rawName) => getRawFileName(rawName);

const resolvePlayerStatsPathName = ({ segment, candidate } = {}) => {
  const seg = segment && typeof segment === 'object' ? segment : null;
  const cand = candidate && typeof candidate === 'object' ? candidate : null;
  const displayPath = normalizeString(seg && seg.displayName);
  if (displayPath.startsWith('/')) return displayPath;
  return normalizeString(cand && cand.pathName) || normalizeString(seg && seg.pathName);
};

const buildSegmentPlaybackIdentity = (segment) => {
  const seg = segment && typeof segment === 'object' ? segment : null;
  return normalizeString(seg && seg.segmentIdentity);
};

const buildEpisodeMappingSignature = (mapping) => {
  const target = mapping && typeof mapping === 'object' ? mapping : null;
  if (!target) return '';
  const total = normalizeInt(target.totalEpisodes);
  const tmdb = Array.isArray(target.tmdbSeasons)
    ? target.tmdbSeasons.map((item) => `${normalizeInt(item && item.season)}:${normalizeInt((item && (item.episodeCount ?? item.episodes)) || 0)}`).join('|')
    : '';
  const douban = Array.isArray(target.doubanSeasons)
    ? target.doubanSeasons.map((item) => `${normalizeInt(item && item.season)}:${normalizeInt((item && (item.episodeCount ?? item.episodes)) || 0)}`).join('|')
    : '';
  return `${total}::${tmdb}::${douban}`;
};

const isElementFullyVisibleInContainer = (element, container) => {
  if (!element || !container) return true;
  const elRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const padding = 4;
  return elRect.top >= containerRect.top + padding
    && elRect.bottom <= containerRect.bottom - padding;
};

const scrollElementIntoContainerCenter = (element, container) => {
  if (!element || !container) return;
  const elRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const relativeTop = (elRect.top - containerRect.top) + container.scrollTop;
  const nextTop = relativeTop - (container.clientHeight / 2) + (elRect.height / 2);
  container.scrollTop = Math.max(0, Math.round(nextTop));
};

const ensureElementVisibleInContainer = (element, container) => {
  if (!element || !container) return;
  if (isElementFullyVisibleInContainer(element, container)) return;
  scrollElementIntoContainerCenter(element, container);
};

const findScrollableEpisodeContainer = (element, root) => {
  let current = element && element.parentElement ? element.parentElement : null;
  const boundary = root || null;
  while (current) {
    if (
      current.classList
      && (
        current.classList.contains('play-episode-grid')
        || current.classList.contains('play-raw-list__items')
      )
    ) {
      return current;
    }
    if (boundary && current === boundary) break;
    current = current.parentElement;
  }
  return null;
};

const buildPlaybackSiteLabel = (item) => {
  const target = item && typeof item === 'object' ? item : null;
  const displayLabel = normalizeString(target && target.displayLabel);
  if (displayLabel) return displayLabel;
  const siteName = normalizeString(target && target.siteName);
  const title = normalizeString(target && target.title);
  if (siteName && title) return `${siteName}-${title}`;
  return siteName || title;
};

const buildProjectedEpisodeTooltip = (candidate) => {
  const rawName = normalizeString(candidate && candidate.rawName);
  const fileName = normalizeString(candidate && candidate.fileName) || getRawFileName(rawName);
  const dirPath = getRawDirPath(rawName);
  if (dirPath && fileName) return `${dirPath}\n${fileName}`;
  if (fileName) return fileName;
  return dirPath;
};

const buildSiteEpisodeSelectionKey = (panKey, itemIndex) => {
  const key = normalizeString(panKey);
  const index = normalizeInt(itemIndex);
  if (!key || index < 0) return '';
  return `${key}::${index}`;
};

const convertThirdPartyUrl = (scheme, args) => {
  let url = String(scheme || '');
  url = url.replace('$name', args.name || '');
  url = url.replace(/\$[eb_]*url/g, (placeholder) => {
    const ops = placeholder.match(/[eb]/g);
    let next = String(args.raw_url || '');
    if (ops) {
      for (const op of ops.reverse()) {
        if (op === 'e') next = encodeURIComponent(next);
        else if (op === 'b') next = window.btoa(next);
      }
    }
    return next;
  });
  url = url.replace(/\$[eb_]*durl/g, (placeholder) => {
    const ops = placeholder.match(/[eb]/g);
    let next = String(args.d_url || '');
    if (ops) {
      for (const op of ops.reverse()) {
        if (op === 'e') next = encodeURIComponent(next);
        else if (op === 'b') next = window.btoa(next);
      }
    }
    return next;
  });
  return url;
};

const buildProjectedSiteEpisodeItems = (recognitionData, sourceKind) => {
  const data = recognitionData && typeof recognitionData === 'object' ? recognitionData : null;
  const sourceKey = normalizeString(data && data.source && data.source.key);
  const mode = normalizeString(sourceKind) === '豆瓣' ? 'douban' : 'tmdb';
  const tierRankMap = new Map();
  const assignTier = (list, rank) => {
    (Array.isArray(list) ? list : []).forEach((item) => {
      const key = normalizeString(item && item.key);
      if (!key || tierRankMap.has(key)) return;
      tierRankMap.set(key, rank);
    });
  };
  assignTier(data && data.tier1, 1);
  assignTier(data && data.tier2, 2);
  assignTier(data && data.tier3, 3);
  return (Array.isArray(data && data.items) ? data.items : [])
    .map((item) => {
      const mapping = item && item.mapping && typeof item.mapping === 'object'
        ? (mode === 'douban' ? item.mapping.douban : item.mapping.tmdb)
        : null;
      const no = normalizeInt(mapping && mapping.episode);
      if (no <= 0) return null;
      return {
        key: normalizeString(item && item.key) || `${mode}:${normalizeInt(mapping && mapping.season)}:${no}:${normalizeInt(item?.mapping?.global)}`,
        season: Math.max(1, normalizeInt(mapping && mapping.season) || 1),
        no,
        text: String(no),
        tooltip: buildProjectedEpisodeTooltip(item),
        is4k: normalizeString(item && item.quality) === '4K',
        selectionKey: buildSiteEpisodeSelectionKey(sourceKey, item && item.itemIndex),
        global: normalizeInt(item && item.mapping && item.mapping.global),
        itemIndex: normalizeInt(item && item.itemIndex),
        tierRank: tierRankMap.get(normalizeString(item && item.key)) || 3,
        candidate: item,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftGlobal = normalizeInt(left && left.global);
      const rightGlobal = normalizeInt(right && right.global);
      if (leftGlobal > 0 && rightGlobal > 0 && leftGlobal !== rightGlobal) return leftGlobal - rightGlobal;
      const leftSeason = normalizeInt(left && left.season);
      const rightSeason = normalizeInt(right && right.season);
      if (leftSeason !== rightSeason) return leftSeason - rightSeason;
      const leftNo = normalizeInt(left && left.no);
      const rightNo = normalizeInt(right && right.no);
      if (leftNo !== rightNo) return leftNo - rightNo;
      const leftTier = normalizeInt(left && left.tierRank) || 99;
      const rightTier = normalizeInt(right && right.tierRank) || 99;
      if (leftTier !== rightTier) return leftTier - rightTier;
      return normalizeInt(left && left.itemIndex) - normalizeInt(right && right.itemIndex);
    });
};

const MOVIE_QUALITY_PRIORITY = {
  '4k_hdr': 1,
  '4k_fps': 2,
  '4k': 3,
  '1080p': 4,
  '720p': 5,
  'unknown': 6,
};

const resolveMovieCandidateQualityKey = (item) => {
  const target = item && typeof item === 'object' ? item : null;
  const quality = normalizeString(target && target.quality).toUpperCase();
  const hay = [
    normalizeString(target && target.displayName),
    normalizeString(target && target.rawName),
    normalizeString(target && target.fileName),
  ].join(' ');
  if (quality === '4K') {
    if (/\bhdr\b/i.test(hay)) return '4k_hdr';
    if (/(?:60fps|60帧|2160p60|4k60|\b60p\b)/i.test(hay)) return '4k_fps';
    return '4k';
  }
  if (quality === '1080P') return '1080p';
  if (quality === '720P') return '720p';
  return 'unknown';
};

const formatMovieCandidateQualityLabel = (qualityKey) => {
  const key = normalizeString(qualityKey).toLowerCase();
  if (key === '4k_hdr') return '4K HDR';
  if (key === '4k_fps') return '4K 60帧';
  if (key === '4k') return '4K';
  if (key === '1080p') return '1080P';
  if (key === '720p') return '720P';
  return '未知';
};

const buildTmdbMovieCandidateItems = ({
  siteItems,
  detailStore,
  recognitionStore,
  signature,
  runtimeConfig,
} = {}) => {
  const list = Array.isArray(siteItems) ? siteItems : [];
  const store = detailStore && typeof detailStore === 'object' ? detailStore : {};
  const recognitionRoot = recognitionStore && typeof recognitionStore === 'object' ? recognitionStore : {};
  const signatureKey = normalizeString(signature);
  const siteOrderMap = runtimeConfig && runtimeConfig.siteOrderMap instanceof Map ? runtimeConfig.siteOrderMap : new Map();
  const grouped = new Map();

  list.forEach((siteItem, siteSeq) => {
    const item = siteItem && typeof siteItem === 'object' ? siteItem : null;
    const itemId = normalizeString(item && item.id);
    if (!item || !itemId || !signatureKey) return;
    const detailEntry = store[itemId] && typeof store[itemId] === 'object' ? store[itemId] : null;
    const detail = detailEntry && detailEntry.detail && typeof detailEntry.detail === 'object' ? detailEntry.detail : null;
    const recognitionEntry = recognitionRoot[itemId] && typeof recognitionRoot[itemId] === 'object' ? recognitionRoot[itemId] : null;
    const bySignature = recognitionEntry && recognitionEntry[signatureKey] && typeof recognitionEntry[signatureKey] === 'object'
      ? recognitionEntry[signatureKey]
      : null;
    if (!detail || !bySignature) return;
    const panSources = buildPanSourcesFromDetailRuntime(detail);
    const siteKey = normalizeString(item.siteKey);
    const groupKey = siteKey || `site:${siteSeq}`;
    const siteRows = grouped.get(groupKey) || [];

    panSources.forEach((panEntry, panIndex) => {
      const pan = panEntry && typeof panEntry === 'object' ? panEntry : null;
      const panKey = normalizeString(pan && pan.key);
      if (!pan || !panKey) return;
      const recognitionData = bySignature[panKey] && typeof bySignature[panKey] === 'object' ? bySignature[panKey] : null;
      if (!recognitionData) return;
      const tierRankMap = new Map();
      [1, 2, 3].forEach((rank) => {
        const rows = Array.isArray(recognitionData[`tier${rank}`]) ? recognitionData[`tier${rank}`] : [];
        rows.forEach((candidate) => {
          const candidateKey = normalizeString(candidate && candidate.key);
          if (candidateKey && !tierRankMap.has(candidateKey)) tierRankMap.set(candidateKey, rank);
        });
      });
      const items = Array.isArray(recognitionData.items) ? recognitionData.items : [];
      items.forEach((candidate, candidateIndex) => {
        if (normalizeString(candidate && candidate.matchKind) !== 'movie' || !(candidate && candidate.movieMatched)) return;
        const itemIndex = normalizeInt(candidate && candidate.itemIndex);
        if (itemIndex < 0) return;
        const qualityKey = resolveMovieCandidateQualityKey(candidate);
        const qualityLabel = formatMovieCandidateQualityLabel(qualityKey);
        const selectionKey = buildSiteEpisodeSelectionKey(panKey, itemIndex);
        siteRows.push({
          key: `${normalizeString(item.siteKey)}::${normalizeString(item.siteDetail)}::${panKey}::${itemIndex}`,
          siteKey: normalizeString(item.siteKey),
          siteDetail: normalizeString(item.siteDetail),
          siteName: normalizeString(item.siteName) || normalizeString(item.siteLabel) || '站点',
          panKey,
          panFlag: normalizeString(pan && pan.label),
          itemIndex,
          selectionKey,
          fileIdentity: normalizeString(candidate && candidate.segmentIdentity),
          qualityKey,
          qualityLabel,
          displayText: '',
          suffix: '',
          tierRank: tierRankMap.get(normalizeString(candidate && candidate.key)) || 3,
          candidate,
          siteItem: item,
          panEntry: pan,
          segment: buildPanSegmentRuntime(pan, itemIndex),
          siteOrder: siteOrderMap.has(siteKey) ? siteOrderMap.get(siteKey) : 999999,
          panOrder: panIndex,
          candidateOrder: candidateIndex,
        });
      });
    });

    if (siteRows.length) grouped.set(groupKey, siteRows);
  });

  const output = [];
  Array.from(grouped.values())
    .sort((left, right) => {
      const leftOrder = normalizeInt(left[0] && left[0].siteOrder) || 999999;
      const rightOrder = normalizeInt(right[0] && right[0].siteOrder) || 999999;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return normalizeString(left[0] && left[0].siteName).localeCompare(normalizeString(right[0] && right[0].siteName), 'zh');
    })
    .forEach((rows) => {
      const sorted = rows.slice().sort((left, right) => {
        const leftTier = normalizeInt(left && left.tierRank) || 99;
        const rightTier = normalizeInt(right && right.tierRank) || 99;
        if (leftTier !== rightTier) return leftTier - rightTier;
        const leftQuality = MOVIE_QUALITY_PRIORITY[normalizeString(left && left.qualityKey).toLowerCase()] || 99;
        const rightQuality = MOVIE_QUALITY_PRIORITY[normalizeString(right && right.qualityKey).toLowerCase()] || 99;
        if (leftQuality !== rightQuality) return leftQuality - rightQuality;
        const leftPanOrder = normalizeInt(left && left.panOrder);
        const rightPanOrder = normalizeInt(right && right.panOrder);
        if (leftPanOrder !== rightPanOrder) return leftPanOrder - rightPanOrder;
        const leftIndex = normalizeInt(left && left.itemIndex);
        const rightIndex = normalizeInt(right && right.itemIndex);
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        return normalizeInt(left && left.candidateOrder) - normalizeInt(right && right.candidateOrder);
      });
      const duplicateCounts = new Map();
      sorted.forEach((row) => {
        const duplicateKey = `${normalizeString(row && row.siteKey)}::${normalizeString(row && row.qualityKey)}`;
        duplicateCounts.set(duplicateKey, (duplicateCounts.get(duplicateKey) || 0) + 1);
      });
      const duplicateIndexes = new Map();
      sorted.forEach((row) => {
        const duplicateKey = `${normalizeString(row && row.siteKey)}::${normalizeString(row && row.qualityKey)}`;
        const nextIndex = (duplicateIndexes.get(duplicateKey) || 0) + 1;
        duplicateIndexes.set(duplicateKey, nextIndex);
        const count = duplicateCounts.get(duplicateKey) || 0;
        const suffix = count > 1 && nextIndex > 1 ? ` ${nextIndex}` : '';
        output.push({
          ...row,
          suffix,
          displayText: `${normalizeString(row && row.qualityLabel) || '未知'} - ${normalizeString(row && row.siteName) || '站点'}${suffix}`,
        });
      });
    });

  return output;
};

const EP_VIEW_MODE_STORAGE_KEY = 'meowfilm_episode_view_mode';
const EP_META_MODE_STORAGE_PREFIX = 'meowfilm_episode_meta_mode::';

const readPlayLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage || !key) return '';
    return normalizeString(window.localStorage.getItem(key));
  } catch (_error) {
    return '';
  }
};

const writePlayLocalStorage = (key, value) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage || !key) return;
    const nextValue = normalizeString(value);
    if (!nextValue) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, nextValue);
  } catch (_error) {
    // ignore storage errors
  }
};

export default {
  name: 'PlayPage',
  components: { ArtPlayer },
  emits: ['back'],
  props: {
    bootstrap: { type: Object, default: () => ({}) },
    isTmdbMode: { type: Boolean, default: false },
    contentKey: { type: String, default: '' },
    videoYear: { type: String, default: '' },
    searchType: { type: String, default: '' },
    siteKey: { type: String, default: '' },
    siteName: { type: String, default: '' },
    spiderApi: { type: String, default: '' },
    siteDetail: { type: String, default: '' },
    tmdbId: { type: [String, Number], default: '' },
    tmdbType: { type: String, default: '' },
    videoIntro: { type: String, default: '' },
    Poster: { type: String, default: '' },
    Remark: { type: String, default: '' },
    switchOnlyToken: { type: Number, default: 0 },
    openFromSearch: { type: Number, default: 0 },
    originSearchQuery: { type: String, default: '' },
  },
  computed: {
    episodeButtonWidth() {
      return 44;
    },
    episodeButtonGap() {
      return 12;
    },
    episodeGridSidePadding() {
      return 4;
    },
    episodeSelectorSidePadding() {
      return 32;
    },
    episodeSelectorDesktopOffset() {
      return 8;
    },
    episodeSelectorBorderWidth() {
      return 2;
    },
    defaultEpisodePanelWidth() {
      return this.getEpisodePanelWidthForColumns(5);
    },
    minEpisodePanelWidth() {
      return this.defaultEpisodePanelWidth;
    },
    maxEpisodePanelWidth() {
      return this.getEpisodePanelWidthForColumns(8);
    },
    panSourceMenuStyle() {
      if (!this.siteSourceSelectWidth) return null;
      return { width: `${this.siteSourceSelectWidth}px` };
    },
    episodePanelStyle() {
      if (this.playerAreaHeight <= 0 || typeof window === 'undefined' || window.innerWidth < 768) return null;
      return { height: `${this.playerAreaHeight}px` };
    },
    thirdPartyCollapsedPlayers() {
      return THIRD_PARTY_PLAYERS.slice(0, 3);
    },
    thirdPartyVisiblePlayers() {
      return this.thirdPartyExpanded ? THIRD_PARTY_PLAYERS : this.thirdPartyCollapsedPlayers;
    },
    activeSitePlaybackItem() {
      if (this.selectedSiteResultItem) return this.selectedSiteResultItem;
      if (this.isTmdbMode) return null;
      const spiderApi = normalizeString(this.spiderApi);
      const siteDetail = normalizeString(this.siteDetail);
      if (!spiderApi || !siteDetail) return null;
      return {
        id: `direct:${spiderApi}::${siteDetail}`,
        siteKey: normalizeString(this.siteKey),
        siteName: normalizeString(this.siteName),
        spiderApi,
        siteDetail,
      };
    },
    currentPanSourceOptions() {
      if (!this.activeSitePlaybackItem) return [];
      return this.siteDetailPanSources;
    },
    currentPanSourceLabel() {
      const current = this.currentPanSourceOptions.find((item) => item.key === this.selectedPanSource) || this.currentPanSourceOptions[0] || null;
      return current ? current.label : '暂无数据';
    },
    showProjectionSwitchButton() {
      return !this.rawListMode
        && !this.forceRawListMode
        && !!this.selectedSiteResultItem
        && this.isTmdbMode
        && this.projectionSourceOptions.length > 1;
    },
    projectionSourceOptions() {
      if (!this.selectedSiteResultItem || !this.isTmdbMode) return [];
      const options = [];
      if (buildProjectedSiteEpisodeItems(this.playbackRecognitionData, 'TMDB').length) options.push('TMDB');
      if (buildProjectedSiteEpisodeItems(this.playbackRecognitionData, '豆瓣').length) options.push('豆瓣');
      return options;
    },
    forceRawListMode() {
      return this.contentKind === 'movie';
    },
    showTmdbMovieCandidateList() {
      return !this.selectedSiteResultItem && this.isTmdbMode && this.tmdbMovieMode;
    },
    showPanSourceRow() {
      if (!this.activeSitePlaybackItem) return false;
      if (this.selectedSiteResultItem) {
        return !this.siteResultDetailLoading && this.currentPanSourceOptions.length > 0;
      }
      return !this.detailLoading && this.currentPanSourceOptions.length > 0;
    },
    siteResultDetailResolutionPending() {
      if (!this.selectedSiteResultItem) return false;
      if (this.siteResultDetailLoading) return true;
      const detail = this.siteResultDetailData && typeof this.siteResultDetailData === 'object'
        ? this.siteResultDetailData
        : null;
      if (!detail) return false;
      return detail.resolutionComplete !== true;
    },
    siteSourceTriggerLabel() {
      if (this.selectedSiteResultItem) {
        return normalizeString(this.selectedSiteResultItem.displayLabel)
          || normalizeString(this.selectedSiteResultItem.siteName)
          || this.selectedSiteSource;
      }
      return this.selectedSiteSource;
    },
    isTMDBEpisodeSource() {
      return !this.selectedSiteResultItem && this.selectedSiteSource === 'TMDB' && this.isTmdbMode;
    },
    isDoubanEpisodeSource() {
      return !this.selectedSiteResultItem && this.selectedSiteSource === '豆瓣' && this.isTmdbMode;
    },
    isProjectedSiteTMDBSource() {
      return !!this.selectedSiteResultItem && this.selectedProjectionSource === 'TMDB' && this.isTmdbMode;
    },
    isProjectedSiteDoubanSource() {
      return !!this.selectedSiteResultItem && this.selectedProjectionSource === '豆瓣' && this.isTmdbMode;
    },
    projectedSiteEpisodeItems() {
      if (!this.selectedSiteResultItem) return [];
      if (!this.isProjectedSiteTMDBSource && !this.isProjectedSiteDoubanSource) return [];
      return buildProjectedSiteEpisodeItems(this.playbackRecognitionData, this.selectedProjectionSource);
    },
    tmdbMovieCandidateItems() {
      if (this.selectedSiteResultItem || !this.isTmdbMode || !this.tmdbMovieMode) return [];
      const siteItems = buildSiteSourceResultItemsFromSnapshotRuntime({
        snapshot: this.playSearchSnapshot,
        runtimeConfig: this.playSearchRuntimeConfig,
        blockedSiteKeys: this.playBlockedSiteKeys,
        blockedMatchIndex: this.playBlockedMatchIndex,
        title: this.displayTitle,
        contentKind: 'movie',
      });
      return buildTmdbMovieCandidateItems({
        siteItems,
        detailStore: this.siteResultDetailStore,
        recognitionStore: this.siteResultRecognitionStore,
        signature: this.activeRecognitionSignature,
        runtimeConfig: this.playSearchRuntimeConfig,
      });
    },
    projectedSeasonRows() {
      if (this.isProjectedSiteTMDBSource) return this.projectedTMDBSeasonRows;
      if (this.isProjectedSiteDoubanSource) return this.projectedDoubanSeasonRows;
      return [];
    },
    tmdbMovieMode() {
      return normalizeString(this.tmdbType || this.searchType).toLowerCase() === 'movie';
    },
    siteContentKind() {
      if (this.isTmdbMode) return 'unknown';
      return detectPlaybackSiteContentKind({
        panSources: this.siteDetailPanSources,
        runtimeSettings: this.runtimeSettings,
      });
    },
    contentKind() {
      if (this.isTmdbMode) return this.tmdbMovieMode ? 'movie' : 'tv';
      return this.siteContentKind;
    },
    contentKindLabel() {
      if (this.contentKind === 'movie') return '电影';
      if (this.contentKind === 'tv' || this.contentKind === 'series') return '剧集';
      return '';
    },
    playContentPreferenceKey() {
      return normalizeString(this.contentKey);
    },
    episodeMetaModeStorageKey() {
      const key = normalizeString(this.playContentPreferenceKey);
      return key ? `${EP_META_MODE_STORAGE_PREFIX}${key}` : '';
    },
    directSiteEpisodeCount() {
      if (this.isTmdbMode || this.selectedSiteResultItem || this.contentKind !== 'series') return 0;
      const entry = this.currentPanSourceEntry;
      if (!entry || !normalizeString(entry.url)) return 0;
      return String(entry.url || '').split('#').map(normalizeString).filter(Boolean).length;
    },
    tmdbSeasonRows() {
      if (!this.isTMDBEpisodeSource || this.tmdbMovieMode) return [];
      const seasons = Array.isArray(this.detailTMDBData && this.detailTMDBData.seasons)
        ? this.detailTMDBData.seasons
        : [];
      return seasons
        .map((item) => ({
          season: normalizeInt(item && item.season),
          episodes: normalizeInt(item && item.episodes),
        }))
        .filter((item) => item.season > 0 && item.episodes > 0)
        .sort((left, right) => left.season - right.season);
    },
    tmdbRenderedSeasonRows() {
      const latestGlobal = Math.max(0, normalizeInt(this.detailTMDBData && this.detailTMDBData.latestGlobal));
      if (!this.tmdbSeasonRows.length || latestGlobal <= 0) return [];
      if (this.tmdbSeasonRows.length === 1) {
        return [{ season: this.tmdbSeasonRows[0].season, episodes: latestGlobal }];
      }
      let remaining = latestGlobal;
      return this.tmdbSeasonRows
        .map((item) => {
          if (remaining <= 0) return null;
          const renderedEpisodes = Math.min(item.episodes, remaining);
          remaining -= renderedEpisodes;
          if (renderedEpisodes <= 0) return null;
          return {
            season: item.season,
            episodes: renderedEpisodes,
          };
        })
        .filter(Boolean);
    },
    doubanBaseSeasonRows() {
      if (this.tmdbMovieMode) return [];
      const seasons = Array.isArray(this.detailDoubanData && this.detailDoubanData.seasons)
        ? this.detailDoubanData.seasons
        : [];
      return seasons
        .map((item) => ({
          season: normalizeInt(item && item.season),
          episodes: normalizeInt(item && item.episodeCount),
          label: normalizeString(item && (item.displayLabel || item.title)),
        }))
        .filter((item) => item.season > 0 && item.episodes > 0)
        .sort((left, right) => left.season - right.season);
    },
    doubanSeasonRows() {
      if (!this.isDoubanEpisodeSource) return [];
      return this.doubanBaseSeasonRows;
    },
    projectedTMDBSeasonRows() {
      if (!this.isProjectedSiteTMDBSource || !this.projectedSiteEpisodeItems.length) return [];
      const rows = new Map();
      this.projectedSiteEpisodeItems.forEach((item) => {
        const season = normalizeInt(item && item.season);
        const no = normalizeInt(item && item.no);
        if (season <= 0 || no <= 0) return;
        const current = rows.get(season) || { season, episodes: 0 };
        current.episodes = Math.max(current.episodes, no);
        rows.set(season, current);
      });
      return Array.from(rows.values()).sort((left, right) => left.season - right.season);
    },
    projectedDoubanSeasonRows() {
      if (!this.isProjectedSiteDoubanSource || !this.projectedSiteEpisodeItems.length) return [];
      const labelMap = new Map(
        this.doubanBaseSeasonRows.map((item) => [
          normalizeInt(item && item.season),
          normalizeString(item && item.label),
        ])
      );
      const rows = new Map();
      this.projectedSiteEpisodeItems.forEach((item) => {
        const season = normalizeInt(item && item.season);
        const no = normalizeInt(item && item.no);
        if (season <= 0 || no <= 0) return;
        const current = rows.get(season) || {
          season,
          episodes: 0,
          label: labelMap.get(season) || '',
        };
        current.episodes = Math.max(current.episodes, no);
        rows.set(season, current);
      });
      return Array.from(rows.values()).sort((left, right) => left.season - right.season);
    },
    episodeSeasonRows() {
      if (this.selectedSiteResultItem) return this.projectedSeasonRows;
      if (!this.isTmdbMode) return [];
      if (this.isTMDBEpisodeSource) return this.tmdbRenderedSeasonRows;
      if (this.isDoubanEpisodeSource) return this.doubanSeasonRows;
      return [];
    },
    episodeSeasonOptions() {
      if (this.selectedSiteResultItem) {
        if (this.episodeSeasonRows.length <= 1) return [];
      } else if (this.episodeSeasonRows.length <= 1) {
        return [];
      }
      return this.episodeSeasonRows.map((item) => ({
        season: item.season,
        episodeCount: item.episodes,
        label: (this.isDoubanEpisodeSource || this.isProjectedSiteDoubanSource)
          ? (normalizeString(item.label) || `第${formatChineseNumber(item.season)}季`)
          : `第${formatChineseNumber(item.season)}季`,
      }));
    },
    defaultEpisodeSeasonNumber() {
      if (!this.episodeSeasonRows.length) return 0;
      return this.episodeSeasonRows[0].season;
    },
    currentEpisodeSeasonNumber() {
      const selected = normalizeInt(this.selectedViewSeasonNumber);
      if (selected > 0 && this.episodeSeasonRows.some((item) => item.season === selected)) return selected;
      return this.defaultEpisodeSeasonNumber;
    },
    projectedRangeOptions() {
      if (!this.selectedSiteResultItem || !this.projectedSiteEpisodeItems.length) return [];
      const filtered = this.projectedSiteEpisodeItems.filter((item) => {
        if (this.projectedSeasonRows.length <= 1) return true;
        return normalizeInt(item && item.season) === this.currentEpisodeSeasonNumber;
      });
      const nos = filtered
        .map((item) => normalizeInt(item && item.no))
        .filter((no) => no > 0)
        .sort((left, right) => left - right);
      if (!nos.length) return [];
      const minNo = nos[0];
      const maxNo = nos[nos.length - 1];
      if (maxNo <= minNo) return [];
      const ranges = [];
      for (let start = minNo; start <= maxNo; start += 50) {
        const end = Math.min(start + 49, maxNo);
        ranges.push({
          start,
          end,
          label: `${start}-${end}`,
        });
      }
      return ranges;
    },
    defaultProjectedRangeStart() {
      if (!this.selectedSiteResultItem || !this.projectedRangeOptions.length) return 1;
      const filtered = this.projectedSiteEpisodeItems.filter((item) => {
        const no = normalizeInt(item && item.no);
        if (no <= 0) return false;
        if (this.projectedSeasonRows.length <= 1) return true;
        return normalizeInt(item && item.season) === this.currentEpisodeSeasonNumber;
      });
      if (!filtered.length) return this.projectedRangeOptions[0].start;
      const firstNo = filtered.reduce((min, item) => {
        const no = normalizeInt(item && item.no);
        return min > 0 ? Math.min(min, no) : no;
      }, 0);
      const hit = this.projectedRangeOptions.find((item) => firstNo >= item.start && firstNo <= item.end);
      return hit ? hit.start : this.projectedRangeOptions[0].start;
    },
    projectedEpisodeButtons() {
      if (!this.selectedSiteResultItem || !this.projectedSiteEpisodeItems.length) return [];
      const rangeStart = this.projectedRangeOptions.length ? this.currentEpisodeRangeStart : 1;
      const end = this.projectedRangeOptions.length
        ? (this.projectedRangeOptions.find((item) => item.start === rangeStart)?.end || rangeStart + 49)
        : Number.MAX_SAFE_INTEGER;
      return this.projectedSiteEpisodeItems.filter((item) => {
        const no = normalizeInt(item && item.no);
        if (no <= 0) return false;
        if (this.projectedSeasonRows.length > 1 && normalizeInt(item && item.season) !== this.currentEpisodeSeasonNumber) return false;
        return no >= rangeStart && no <= end;
      });
    },
    episodeCountForDisplay() {
      if (!this.isTmdbMode && !this.selectedSiteResultItem) {
        return this.directSiteEpisodeCount;
      }
      if (!this.episodeSeasonRows.length) return 0;
      if (this.episodeSeasonRows.length > 1) {
        const currentSeason = this.episodeSeasonRows.find((item) => item.season === this.currentEpisodeSeasonNumber) || null;
        return currentSeason ? currentSeason.episodes : 0;
      }
      if (this.isTMDBEpisodeSource) {
        return Math.max(0, normalizeInt(this.detailTMDBData && this.detailTMDBData.latestGlobal));
      }
      return this.episodeSeasonRows[0].episodes;
    },
    episodeRangeOptions() {
      if (this.selectedSiteResultItem) return this.projectedRangeOptions;
      const episodeCount = this.episodeCountForDisplay;
      if (episodeCount <= 50) return [];
      const ranges = [];
      for (let start = 1; start <= episodeCount; start += 50) {
        const end = Math.min(start + 49, episodeCount);
        ranges.push({ start, end, label: `${start}-${end}` });
      }
      return ranges;
    },
    currentEpisodeRangeStart() {
      if (!this.episodeRangeOptions.length) return 1;
      const selected = normalizeInt(this.selectedViewRangeStart);
      if (selected > 0 && this.episodeRangeOptions.some((item) => item.start === selected)) return selected;
      if (this.selectedSiteResultItem) return this.defaultProjectedRangeStart;
      return this.episodeRangeOptions[0].start;
    },
    episodeButtons() {
      if (this.selectedSiteResultItem) return this.projectedEpisodeButtons;
      if (!this.isTmdbMode && !this.selectedSiteResultItem) {
        const episodeCount = this.directSiteEpisodeCount;
        if (episodeCount <= 0) return [];
        const rangeStart = this.episodeRangeOptions.length ? this.currentEpisodeRangeStart : 1;
        const end = this.episodeRangeOptions.length
          ? (this.episodeRangeOptions.find((item) => item.start === rangeStart)?.end || Math.min(rangeStart + 49, episodeCount))
          : episodeCount;
        const items = [];
        for (let episode = rangeStart; episode <= end; episode += 1) {
          items.push({
            key: `site-episode:${episode}`,
            text: String(episode),
            itemIndex: episode - 1,
          });
        }
        return items;
      }
      const episodeCount = this.episodeCountForDisplay;
      if (episodeCount <= 0) return [];
      const rangeStart = this.episodeRangeOptions.length ? this.currentEpisodeRangeStart : 1;
      const end = this.episodeRangeOptions.length
        ? (this.episodeRangeOptions.find((item) => item.start === rangeStart)?.end || Math.min(rangeStart + 49, episodeCount))
        : episodeCount;
      const items = [];
      for (let episode = rangeStart; episode <= end; episode += 1) {
        items.push({ key: `episode:${episode}`, text: String(episode) });
      }
      return items;
    },
    showSeasonBar() {
      if (this.rawListMode) return false;
      if (this.siteResultDetailResolutionPending) return false;
      return this.episodeSeasonOptions.length > 0;
    },
    showRangeBar() {
      if (this.rawListMode) return false;
      if (this.siteResultDetailResolutionPending) return false;
      return this.episodeRangeOptions.length > 1;
    },
    showEpisodeLoadingState() {
      if (this.showTmdbMovieCandidateList) {
        if (this.tmdbMovieCandidateItems.length > 0) return false;
        if (this.playLoading) return true;
        if (normalizeInt(this.smartPlaybackPendingRunSeq) > 0 || normalizeInt(this.smartPlaybackAttemptRunSeq) > 0) return true;
        return this.siteSourceSearchState === 'loading';
      }
      if (this.selectedSiteResultItem) return this.siteResultDetailResolutionPending;
      if (!this.isTmdbMode && this.activeSitePlaybackItem) return this.detailLoading;
      if (this.isTMDBEpisodeSource) return this.detailLoading;
      if (this.isDoubanEpisodeSource) return this.doubanLoading;
      return false;
    },
    playSearchQuery() {
      return normalizeSearchKey(this.displayTitle);
    },
    searchReuseQuery() {
      return normalizeSearchKey(this.originSearchQuery);
    },
    playSearchContentKind() {
      return this.isTmdbMode && this.tmdbMovieMode ? 'movie' : 'tv';
    },
    playSearchScope() {
      return `${PLAY_SEARCH_SCOPE}:${this.playSearchContentKind}`;
    },
    searchReuseEligible() {
      if (!normalizeInt(this.openFromSearch) || !this.searchReuseQuery || !this.playSearchQuery) return false;
      const runtimeConfig = this.playSearchRuntimeConfig;
      const aggregateRules = runtimeConfig && Array.isArray(runtimeConfig.aggregateRules)
        ? runtimeConfig.aggregateRules
        : [];
      const contentKind = this.playSearchContentKind;
      const queryGroupKey = buildSearchGroupKey(this.searchReuseQuery, aggregateRules, { contentKind });
      const titleGroupKey = buildSearchGroupKey(this.playSearchQuery, aggregateRules, { contentKind });
      return !!queryGroupKey && queryGroupKey === titleGroupKey;
    },
    effectivePlaySearchScope() {
      return this.searchReuseEligible ? 'default' : this.playSearchScope;
    },
    isUsingSearchOriginScope() {
      return this.effectivePlaySearchScope === 'default';
    },
    siteSourceSearchState() {
      return normalizeString(this.playSearchLiveStatus) || getSearchSessionAnyQueryStatus(this.playSearchQuery, this.effectivePlaySearchScope);
    },
    showSiteSourceSearchOption() {
      if (!this.playSearchQuery) return false;
      if (this.isUsingSearchOriginScope) return this.siteSourceSearchState === 'loading';
      return this.siteSourceSearchState !== 'completed';
    },
    siteSourceSearchBusy() {
      return this.siteSourceSearchManualLoading || this.siteSourceSearchState === 'loading';
    },
    siteSourceSearchInteractive() {
      return !this.isUsingSearchOriginScope && !this.siteSourceSearchBusy;
    },
    siteSourceSearchLabel() {
      return this.siteSourceSearchBusy ? '加载中...' : '加载更多...';
    },
    playSearchSnapshot() {
      return this.playSearchLiveSnapshot || getSearchSessionAnyQuerySnapshot(this.playSearchQuery, this.effectivePlaySearchScope);
    },
    playSearchRuntimeConfig() {
      return this.playSearchRuntimeConfigData;
    },
    playHistoryRowForMenu() {
      return findPlayHistoryRowForContext(this.buildPlayHistoryWarmContext()) || null;
    },
    initialAutoPlaybackReadyKey() {
      return [
        this.isTmdbMode ? 'tmdb' : 'site',
        this.tmdbMovieMode ? 'movie' : 'tv',
        this.selectedSearchResultId ? 'site-result' : 'primary',
        this.detailLoading ? 'detail-loading' : 'detail-ready',
        this.siteResultDetailLoading ? 'site-detail-loading' : 'site-detail-ready',
        this.doubanLoading ? 'douban-loading' : 'douban-ready',
        this.canRunStrictFastSmartPlayback ? 'strict-fast-ready' : 'strict-fast-pending',
        this.canRunFullSmartPlayback ? 'full-ready' : 'full-pending',
        normalizeString(this.strictFastEpisodeMappingSignature),
        normalizeString(this.smartEpisodeMappingSignature),
        String(this.episodeButtons.length),
        String(this.tmdbMovieCandidateItems.length),
        String(this.currentPanSourceOptions.length),
        String(this.rawListItems.length),
        normalizeString(this.selectedPanSource),
      ].join('|');
    },
    siteSourceResultItems() {
      const items = buildSiteSourceResultItemsFromSnapshotRuntime({
        snapshot: this.playSearchSnapshot,
        runtimeConfig: this.playSearchRuntimeConfig,
        blockedSiteKeys: this.playBlockedSiteKeys,
        title: this.displayTitle,
      });
      if (!this.isTmdbMode) return items;
      const historyItem = buildHistorySitePlaybackItemRuntime(this.playHistoryRowForMenu);
      return withSiteSourceDisplayLabels(historyItem ? [historyItem].concat(items) : items);
    },
    selectedSiteResultItem() {
      if (!this.selectedSearchResultId) return null;
      return this.siteSourceResultItems.find((item) => String(item.id) === String(this.selectedSearchResultId)) || null;
    },
    siteDetailPanSources() {
      return buildPanSourcesFromDetailRuntime(this.siteResultDetailData);
    },
    siteResultEpisodeStatusText() {
      if (this.showTmdbMovieCandidateList) {
        if (this.showEpisodeLoadingState) return '';
        if (normalizeString(this.playError)) return normalizeString(this.playError);
        if (this.tmdbMovieCandidateItems.length) return '';
        return '暂无数据';
      }
      if (!this.activeSitePlaybackItem) return '';
      if (this.selectedSiteResultItem) {
        if (this.siteResultDetailResolutionPending) return '';
        if (this.siteResultDetailError) return this.siteResultDetailError;
      } else if (this.detailLoading) {
        return '';
      }
      if (!this.currentPanSourceOptions.length) return '暂无数据';
      if (this.currentPanSourceEntry && this.currentPanSourceEntry.error) {
        return this.currentPanSourceEntry.error;
      }
      if (this.currentPanSourceEntry && !normalizeString(this.currentPanSourceEntry.url)) {
        return '暂无数据';
      }
      if (!this.isTmdbMode && !this.selectedSiteResultItem && this.contentKind === 'series' && !this.episodeButtons.length) {
        return '暂无数据';
      }
      if ((this.isProjectedSiteTMDBSource || this.isProjectedSiteDoubanSource) && !this.projectedEpisodeButtons.length) {
        return '暂无数据';
      }
      return '';
    },
    currentPanSourceEntry() {
      if (!this.siteDetailPanSources.length) return null;
      return this.siteDetailPanSources.find((item) => item.key === this.selectedPanSource) || this.siteDetailPanSources[0] || null;
    },
    rawDirModeEnabled() {
      const entry = this.currentPanSourceEntry;
      if (!this.rawListMode || !entry) return false;
      if (!(this.siteResultDetailData && this.siteResultDetailData.panMock)) return false;
      return !!normalizeString(entry.provider) && !!normalizeString(entry.url);
    },
    rawDirIdentity() {
      const entry = this.currentPanSourceEntry;
      if (!this.rawDirModeEnabled || !entry) return '';
      return [
        normalizeString(entry.label),
        normalizeString(entry.url),
      ].join('::');
    },
    rawDirTree() {
      const entry = this.currentPanSourceEntry;
      if (!this.rawDirModeEnabled || !entry || !entry.url) return null;
      const root = { dirs: new Map(), files: [] };
      const ensureDir = (node, name) => {
        const key = normalizeString(name);
        if (!key) return node;
        if (!node.dirs.has(key)) node.dirs.set(key, { name: key, dirs: new Map(), files: [] });
        return node.dirs.get(key);
      };
      entry.url.split('#').forEach((segment, index) => {
        const raw = normalizeString(segment);
        if (!raw) return;
        const dollarIdx = raw.indexOf('$');
        const displayName = dollarIdx >= 0 ? normalizeString(raw.slice(0, dollarIdx)) : raw;
        const episodeUrl = dollarIdx >= 0 ? normalizeString(raw.slice(dollarIdx + 1)) : raw;
        const rawName = extractRawNamesFromEpisodeUrl(episodeUrl)[0] || '';
        const fileName = getRawFileName(rawName);
        if (!fileName) return;
        const dirs = splitRawPathSegments(displayName);
        let node = root;
        dirs.forEach((dir) => {
          node = ensureDir(node, dir);
        });
        node.files.push({
          name: fileName,
          index,
          url: episodeUrl,
          displayName,
          rawName,
        });
      });
      return root;
    },
    rawDirNode() {
      const tree = this.rawDirTree;
      if (!tree) return null;
      const path = Array.isArray(this.rawDirPath) ? this.rawDirPath : [];
      let node = tree;
      for (let i = 0; i < path.length; i += 1) {
        const seg = normalizeString(path[i]);
        if (!seg) continue;
        if (!node.dirs || !node.dirs.has(seg)) return null;
        node = node.dirs.get(seg);
      }
      return node;
    },
    rawDirEntries() {
      if (!this.rawDirModeEnabled) return [];
      const node = this.rawDirNode;
      if (!node) return [];
      const dirs = node.dirs ? Array.from(node.dirs.keys()) : [];
      const files = Array.isArray(node.files) ? node.files : [];
      dirs.sort((a, b) => String(a).localeCompare(String(b), 'zh'));
      const sortedFiles = files.slice().sort((a, b) => String(a && a.name).localeCompare(String(b && b.name), 'zh'));
      const out = [];
      dirs.forEach((name) => {
        out.push({
          key: `d:${(this.rawDirPath || []).join('/')}:${name}`,
          kind: 'dir',
          name: String(name),
          index: -1,
          text: `${String(name)}/`,
        });
      });
      sortedFiles.forEach((item) => {
        const text = normalizeString(item.name);
        if (!text) return;
        out.push({
          key: `f:${item.index}:${item.url}`,
          kind: 'file',
          index: item.index,
          text,
          selectionKey: buildSiteEpisodeSelectionKey(this.currentPanSourceEntry && this.currentPanSourceEntry.key, item.index),
        });
      });
      return out;
    },
    rawListDisplayPath() {
      if (!this.rawDirModeEnabled) return '';
      const path = Array.isArray(this.rawDirPath) ? this.rawDirPath : [];
      if (!path.length) return '';
      return `/${path.map((item) => normalizeString(item)).filter(Boolean).join('/')}`;
    },
    canGoRawDirBack() {
      if (!this.rawDirModeEnabled) return false;
      const depth = Array.isArray(this.rawDirPath) ? this.rawDirPath.length : 0;
      return depth > Math.max(0, normalizeInt(this.rawDirLockedDepth));
    },
    rawListItems() {
      if (this.rawDirModeEnabled) return this.rawDirEntries;
      const entry = this.currentPanSourceEntry;
      if (!entry || !entry.url) return [];
      const segments = entry.url.split('#').map(normalizeString).filter(Boolean);
      let allFileNamesSame = true;
      let firstFileName = null;
      segments.forEach((segment) => {
        const dollarIdx = segment.indexOf('$');
        const episodeUrl = dollarIdx >= 0 ? normalizeString(segment.slice(dollarIdx + 1)) : segment;
        const fileName = extractRawNamesFromEpisodeUrl(episodeUrl)[0] || '';
        if (firstFileName == null) {
          firstFileName = fileName;
        } else if (fileName !== firstFileName) {
          allFileNamesSame = false;
        }
      });
      const titleLower = normalizeString(this.displayTitle).toLowerCase();
      const isPanMockList = !!normalizeString(entry.provider);
      return segments
        .map((segment, index) => {
          const dollarIdx = segment.indexOf('$');
          const label = dollarIdx >= 0 ? normalizeString(segment.slice(0, dollarIdx)) : segment;
          const episodeUrl = dollarIdx >= 0 ? normalizeString(segment.slice(dollarIdx + 1)) : segment;
          const rawName = extractRawNamesFromEpisodeUrl(episodeUrl)[0] || '';
          const fileName = getRawFileName(rawName);
          const displayName = label;
          let text = '';
          if (isPanMockList) {
            text = fileName;
          } else if (allFileNamesSame) {
            text = displayName;
          } else {
            const displayScore = scoreEpisodeDisplayName(displayName, titleLower);
            const fileScore = scoreEpisodeDisplayName(fileName, titleLower);
            text = displayScore >= fileScore ? displayName : fileName;
          }
          text = normalizeString(text);
          if (!text) return null;
          return {
            key: `${entry.key}:${index}:${text}`,
            kind: 'file',
            index,
            text,
            selectionKey: buildSiteEpisodeSelectionKey(entry.key, index),
          };
        })
        .filter(Boolean);
    },
    rawListEmptyText() {
      return this.siteResultEpisodeStatusText || '暂无数据';
    },
    playerToastText() {
      return normalizeString(this.playerTransientToastText);
    },
    showPlayerStatusOverlay() {
      return this.playerUiTransitionMode !== 'switch' && this.playerPhase !== 'ready' && this.playerPhase !== 'buffering';
    },
    playerPhase() {
      if (normalizeString(this.playError) || normalizeString(this.playerRuntimeError)) return 'error';
      if (!normalizeString(this.playerUrl)) {
        if (this.playRequestStage === 'play_url') return 'play_url';
        if (
          this.detailLoading
          || (this.isTmdbMode && !this.tmdbMovieMode && !this.strictFastEpisodeMapping)
          || (this.tmdbMovieMode && !(this.detailTMDBData && typeof this.detailTMDBData === 'object'))
        ) {
          return 'idle';
        }
        if (
          this.playRequestStage === 'detail'
          || normalizeInt(this.smartPlaybackPendingRunSeq) > 0
          || this.initialAutoPlaybackInFlight
          || this.playLoading
        ) {
          return 'detail';
        }
        return 'idle';
      }
      if (this.playRequestStage === 'play_info' || !this.playerMetaReady || !this.playerFirstFrameReady) {
        return 'play_info';
      }
      if (this.playerBuffering) return 'buffering';
      return 'ready';
    },
    playerPhaseLoading() {
      return ['idle', 'detail', 'play_url', 'play_info'].includes(this.playerPhase);
    },
    playerPhaseText() {
      switch (this.playerPhase) {
        case 'detail':
          return '正在获取视频...';
        case 'play_url':
          return '正在获取播放地址...';
        case 'play_info':
          return '正在获取视频信息...';
        case 'error':
          return normalizeString(this.playerRuntimeError || this.playError) || '请求失败';
        case 'idle':
        default:
          return '加载中...';
      }
    },
    playerStageIndex() {
      switch (this.playerPhase) {
        case 'detail':
          return 0;
        case 'play_url':
          return 1;
        case 'play_info':
          return 2;
        case 'buffering':
        case 'ready':
          return 3;
        case 'error':
          if (normalizeString(this.playerUrl) && this.playerMetaReady) return 3;
          if (normalizeString(this.playerUrl)) return 2;
          if (this.playRequestStage === 'play_url') return 1;
          return 0;
        case 'idle':
        default:
          return 0;
      }
    },
    playerStageDoneCount() {
      return Math.max(0, Math.min(this.playerStageIndex, this.playerStageItems.length));
    },
    playerStageProgress() {
      const total = this.playerStageItems.length || 3;
      if (this.playerPhase === 'idle') return 0;
      if (this.playerStageIndex >= total) return 1;
      if (this.playerPhase === 'error') return this.playerStageDoneCount / total;
      return (this.playerStageDoneCount + 0.5) / total;
    },
    playerStatsExtra() {
      return {
        displayName: this.displayTitle,
        siteName: normalizeString(this.playerStatsSiteName),
        panName: normalizeString(this.playerStatsPanName),
        pathName: normalizeString(this.playerStatsPathName),
        rawFileName: normalizeString(this.playerStatsRawFileName),
      };
    },
    currentPlaybackContext() {
      const raw = playbackSessionState.currentContext && typeof playbackSessionState.currentContext === 'object'
        ? playbackSessionState.currentContext
        : null;
      return {
        itemId: normalizeString(raw && raw.itemId),
        siteKey: normalizeString(raw && raw.siteKey),
        siteName: normalizeString(raw && raw.siteName),
        spiderApi: normalizeString(raw && raw.spiderApi),
        siteDetail: normalizeString(raw && raw.siteDetail),
        panKey: normalizeString(raw && raw.panKey),
        panFlag: normalizeString(raw && raw.panFlag),
        selectionKey: normalizeString(raw && raw.selectionKey),
        globalEpisode: Math.max(0, normalizeInt(raw && raw.globalEpisode)),
        itemIndex: normalizeInt(raw && raw.itemIndex),
        sourceQuality: normalizeString(raw && raw.sourceQuality),
        quality: normalizeString(raw && raw.quality),
        pathName: normalizeString(raw && raw.pathName),
        rawFileName: normalizeString(raw && raw.rawFileName),
        fileIdentity: normalizeString(raw && raw.fileIdentity),
        sourceKind: normalizeString(raw && raw.sourceKind),
        sourceSignature: normalizeString(raw && raw.sourceSignature),
      };
    },
    isPlayerInTmdbMode() {
      return this.isTmdbMode;
    },
    playerControlUiState() {
      return buildPlayerControlUiState({
        isPrimaryTmdbMode: this.isPlayerInTmdbMode,
        currentContext: this.currentPlaybackContext,
        runtimeSettings: this.runtimeSettings,
        currentPanSourceOptions: this.currentPanSourceOptions,
      });
    },
    currentPlaybackPanFamilyLabel() {
      return normalizeString(this.playerControlUiState && this.playerControlUiState.currentPanFamilyLabel) || '未知';
    },
    currentPlaybackQualityKey() {
      return normalizeString(this.playerControlUiState && this.playerControlUiState.currentQualityKey) || 'auto';
    },
    currentPlaybackQualityLabel() {
      return normalizeString(this.playerControlUiState && this.playerControlUiState.currentQualityLabel) || '未知';
    },
    strictFastEpisodeMapping() {
      if (!this.isTmdbMode || this.tmdbMovieMode) return null;
      return buildSmartEpisodeMapping({
        tmdbDetail: this.detailTMDBData,
        doubanMeta: null,
      });
    },
    fullEpisodeMapping() {
      return this.smartEpisodeMapping;
    },
    strictFastEpisodeMappingSignature() {
      return buildEpisodeMappingSignature(this.strictFastEpisodeMapping);
    },
    playerExtraMenus() {
      const state = this.playerControlUiState && typeof this.playerControlUiState === 'object'
        ? this.playerControlUiState
        : null;
      return Array.isArray(state && state.playerExtraMenus) ? state.playerExtraMenus : [];
    },
    playerExtraActions() {
      const state = this.playerControlUiState && typeof this.playerControlUiState === 'object'
        ? this.playerControlUiState
        : null;
      return Array.isArray(state && state.playerExtraActions) ? state.playerExtraActions : [];
    },
    currentPrimaryPlaybackEpisodeTarget() {
      if (this.selectedSiteResultItem || !this.isTmdbMode) return null;
      const globalEpisode = Math.max(0, normalizeInt(this.currentPlaybackContext.globalEpisode));
      if (globalEpisode <= 0) return null;
      if (this.isTMDBEpisodeSource) {
        const tmdb = tmdbSeasonEpisodeOfGlobal(this.detailTMDBData, globalEpisode);
        const season = normalizeInt(tmdb && tmdb.season);
        const episode = normalizeInt(tmdb && tmdb.episode);
        return season > 0 && episode > 0 ? { season, episode } : null;
      }
      if (this.isDoubanEpisodeSource) {
        const douban = doubanSeasonEpisodeOfGlobal(this.detailDoubanData, globalEpisode);
        const season = normalizeInt(douban && douban.season);
        const episode = normalizeInt(douban && douban.episode);
        return season > 0 && episode > 0 ? { season, episode } : null;
      }
      return null;
    },
    goProxyUiEligible() {
      const settings = this.runtimeSettings && typeof this.runtimeSettings === 'object' ? this.runtimeSettings : null;
      if (!settings || !settings.goProxyEnabled) return false;
      const candidate = this.lastGoProxyCandidate && typeof this.lastGoProxyCandidate === 'object'
        ? this.lastGoProxyCandidate
        : null;
      if (!candidate || !candidate.enabled) return false;
      return hasNonEmptyHeaders(candidate.headers);
    },
    goProxyUiOptions() {
      if (!this.goProxyUiEligible) return [];
      return normalizeGoProxyServers(this.runtimeSettings && this.runtimeSettings.goProxyServers);
    },
    goProxyUiLabel() {
      if (!this.goProxyUiEligible || !this.goProxyUiOptions.length) return '';
      const activeBase = normalizeString(this.goProxyInUseBase) || normalizeString(this.goProxyManualBase);
      const active = activeBase
        ? this.goProxyUiOptions.find((item) => normalizeString(item.base) === activeBase)
        : null;
      return (active && active.label) || this.goProxyUiOptions[0].label || 'GoProxy';
    },
    smartEpisodeMappingSignature() {
      return buildEpisodeMappingSignature(this.fullEpisodeMapping);
    },
    activeRecognitionSignature() {
      if (this.isTmdbMode && this.tmdbMovieMode) return TMDB_MOVIE_RECOGNITION_SIGNATURE;
      return normalizeString(this.smartEpisodeMappingSignature) || normalizeString(this.strictFastEpisodeMappingSignature);
    },
    canRunStrictFastSmartPlayback() {
      if (!this.isTmdbMode || this.tmdbMovieMode) return false;
      if (this.detailLoading) return false;
      const mapping = this.strictFastEpisodeMapping;
      return !!(mapping && normalizeInt(mapping.totalEpisodes) > 0);
    },
    canRunFullSmartPlayback() {
      if (!this.isTmdbMode || this.tmdbMovieMode) return false;
      if (this.detailLoading || this.doubanLoading) return false;
      const mapping = this.fullEpisodeMapping;
      return !!(mapping && normalizeInt(mapping.totalEpisodes) > 0);
    },
    playbackRecognitionData() {
      const item = this.selectedSiteResultItem;
      const entry = this.currentPanSourceEntry;
      if (!item || !entry || !entry.key) {
        return { source: null, items: [], tier1: [], tier2: [], tier3: [] };
      }
      const itemKey = normalizeString(item.id);
      const signature = this.activeRecognitionSignature;
      const group = itemKey && this.siteResultRecognitionStore[itemKey] && typeof this.siteResultRecognitionStore[itemKey] === 'object'
        ? this.siteResultRecognitionStore[itemKey]
        : null;
      const bySignature = group && signature && group[signature] && typeof group[signature] === 'object'
        ? group[signature]
        : null;
      return bySignature && bySignature[entry.key]
        ? bySignature[entry.key]
        : { source: null, items: [], tier1: [], tier2: [], tier3: [] };
    },
    displayTitle() {
      return normalizeString(this.contentKey) || '未命名内容';
    },
    detailPoster() {
      return normalizeString(this.Poster);
    },
    detailPosterDisplay() {
      return rewriteDisplayPosterUrl(this.detailPoster, this.runtimeSettings || {});
    },
    detailMetaTags() {
      const tags = this.isTmdbMode
        ? [
          this.tmdbMediaLabel,
          this.detailYearText,
          this.detailRemarkText,
        ]
        : this.selectedSiteResultItem
          ? [normalizeString(this.selectedSiteResultItem.siteName), this.detailYearText]
          : [
            this.detailSiteNameText,
            this.detailYearText,
          ];
      return tags.filter((tag) => !!normalizeString(tag));
    },
    detailDescription() {
      if (this.isTmdbMode) {
        return this.detailOverview || (this.detailLoading ? '加载中' : '暂无简介');
      }
      if (this.selectedSiteResultItem) {
        return this.detailOverview || (this.siteResultDetailLoading ? '加载中' : '暂无简介');
      }
      return this.detailOverview || (this.detailLoading ? '加载中' : '暂无简介');
    },
    tmdbMediaLabel() {
      const type = normalizeString(this.tmdbType || this.searchType).toLowerCase();
      return type === 'movie' ? '电影' : '剧集';
    },
    detailYearText() {
      return this.detailYear || '';
    },
    historyRemarkText() {
      return normalizeString(this.Remark);
    },
    detailRemarkText() {
      return this.detailRemark || '';
    },
    detailSiteNameText() {
      return normalizeString(this.siteName) || '';
    },
  },
  data() {
    return {
      siteSourceSelectWidth: 0,
      siteSourceOpen: false,
      panSourceOpen: false,
      siteSourceSearchManualLoading: false,
      playSearchRuntimeConfigData: null,
      playSearchLiveSnapshot: null,
      playSearchLiveStatus: 'idle',
      playSearchUnsubscribe: null,
      siteSourceOptions: [],
      selectedSiteSource: '',
      selectedPanSource: '',
      siteSourceResizeObserver: null,
      playerAreaHeight: 0,
      playerAreaResizeObserver: null,
      thirdPartyExpanded: false,
      runtimeSettings: null,
      detailLoading: false,
      detailOverview: '',
      detailYear: '',
      detailRemark: '',
      detailTMDBData: null,
      detailDoubanData: null,
      detailDoubanMetaKey: '',
      smartEpisodeMapping: null,
      doubanLoading: false,
      siteResultDetailData: null,
      siteResultDetailStore: {},
      siteResultRecognitionStore: {},
      playBlockedSiteKeys: [],
      playBlockedMatchIndex: {},
      siteResultDetailLoading: false,
      siteResultDetailError: '',
      playerUrl: '',
      playerHeaders: {},
      playLoading: false,
      autoNextInFlight: false,
      playError: '',
      playerRuntimeError: '',
      playerBuffering: false,
      playerMetaReady: false,
      playerFirstFrameReady: false,
      playerPlaybackStarted: false,
      playRequestStage: '',
      playerUiTransitionMode: '',
      playerTransientToastText: '',
      playerTransientToastTimer: 0,
      switchSkipByEpisodeKey: {},
      activePlayerControlAction: '',
      playerStatsSiteName: '',
      playerStatsPanName: '',
      playerStatsPathName: '',
      playerStatsRawFileName: '',
      playerStageItems: [
        { key: 'detail', label: '信息' },
        { key: 'play_url', label: '地址' },
        { key: 'play_info', label: '信息' },
      ],
      initialAutoPlaybackDone: false,
      initialAutoPlaybackStageDone: '',
      initialAutoPlaybackInFlight: false,
      historySmartBootstrapStageDone: {},
      playRequestSeq: 0,
      lastResolvedPlaybackPayload: null,
      smartPlaybackRunSeq: 0,
      smartPlaybackStage: 'idle',
      smartPlaybackResolvedStage: '',
      rawListMode: false,
      rawDirPath: [],
      rawDirLockedDepth: 0,
      lastRawDirIdentity: '',
      selectedViewSeasonNumber: 0,
      selectedViewRangeStart: 0,
      selectedSiteEpisodeSelectionKey: '',
      detailFetchSeq: 0,
      selectedSearchResultId: '',
      selectedProjectionSource: 'TMDB',
      smartPlaybackPendingRunSeq: 0,
      smartPlaybackConfirmedRunSeq: 0,
      smartPlaybackAttemptRunSeq: 0,
      smartPlaybackResume: null,
      smartPlaybackStreamCleanup: null,
      goProxyManualBase: '',
      goProxyInUseBase: '',
      lastGoProxyCandidate: null,
      autoProxyRetriedSeq: 0,
      proxyRetryInFlight: false,
      episodePanelResizeState: {
        dragging: false,
        startX: 0,
        startWidth: 0,
      },
    };
  },
  mounted() {
    this.resetSwitchSkipState();
    document.addEventListener('click', this.handleDocumentClick, true);
    window.addEventListener('tv:smart-matchblock-updated', this.handleSmartMatchBlockUpdated);
    this.bindSiteSourceWidth();
    this.bindPlayerAreaHeight();
    this.setEpisodePanelWidth(this.defaultEpisodePanelWidth);
    this.bindEpisodePanelResizer();
    void this.prefetchPlayHistoryForPage();
    this.bindPlaySearchQuerySubscription();
    this.loadPlayRuntimeAndDetail();
  },
  beforeUnmount() {
    this.resetSwitchSkipState();
    this.resetSmartPlaybackRuntimeState({ stopStream: true });
    this.detailFetchSeq += 1;
    this.playRequestSeq += 1;
    this.selectedSearchResultId = '';
    flushHistoryProgressBestEffort();
    clearActivePlayHistoryContext();
    clearCurrentPlaybackContext();
    document.removeEventListener('click', this.handleDocumentClick, true);
    window.removeEventListener('tv:smart-matchblock-updated', this.handleSmartMatchBlockUpdated);
    if (this.siteSourceResizeObserver) {
      this.siteSourceResizeObserver.disconnect();
      this.siteSourceResizeObserver = null;
    }
    if (this.playerAreaResizeObserver) {
      this.playerAreaResizeObserver.disconnect();
      this.playerAreaResizeObserver = null;
    }
    if (this.playerTransientToastTimer) {
      window.clearTimeout(this.playerTransientToastTimer);
      this.playerTransientToastTimer = 0;
    }
    this.unbindPlaySearchQuerySubscription();
    this.unbindEpisodePanelResizer();
  },
  methods: {
    buildSwitchEpisodeKey() {
      const contentKey = normalizeString(this.playContentPreferenceKey);
      const globalEpisode = Math.max(0, normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.globalEpisode));
      if (!contentKey || globalEpisode <= 0) return '';
      return `${contentKey}::${globalEpisode}`;
    },
    buildSwitchCandidateIdentity(wrapper) {
      const target = wrapper && typeof wrapper === 'object' ? wrapper : null;
      const siteItem = target && target.siteItem && typeof target.siteItem === 'object' ? target.siteItem : null;
      const candidate = target && target.candidate && typeof target.candidate === 'object' ? target.candidate : null;
      const source = candidate && candidate.source && typeof candidate.source === 'object' ? candidate.source : null;
      const siteKey = normalizeString(target && target.siteKey)
        || normalizeString(siteItem && siteItem.siteKey)
        || normalizeString(source && source.siteKey);
      const siteDetail = normalizeString(target && target.siteDetail)
        || normalizeString(siteItem && siteItem.siteDetail)
        || normalizeString(source && source.siteDetail);
      const fileIdentity = this.buildSwitchFileIdentity(target);
      if (!siteKey || !siteDetail || !fileIdentity) return '';
      return `${siteKey}::${siteDetail}::${fileIdentity}`;
    },
    buildSwitchFileIdentity(wrapper) {
      const target = wrapper && typeof wrapper === 'object' ? wrapper : null;
      const candidate = target && target.candidate && typeof target.candidate === 'object' ? target.candidate : null;
      const direct = normalizeString(target && target.fileIdentity);
      if (direct) return direct;
      const segmentIdentity = normalizeString(candidate && candidate.segmentIdentity);
      if (segmentIdentity) return segmentIdentity;
      return '';
    },
    buildPlaybackSourceSignature({ siteKey = '', siteDetail = '', panKey = '', itemIndex = -1 } = {}) {
      const nextSiteKey = normalizeString(siteKey);
      const nextVideoId = normalizeString(siteDetail);
      const nextPanKey = normalizeString(panKey);
      const nextItemIndex = normalizeInt(itemIndex);
      if (!nextSiteKey || !nextVideoId || !nextPanKey || nextItemIndex < 0) return '';
      return `${nextSiteKey}::${nextVideoId}::${nextPanKey}::${nextItemIndex}`;
    },
    resolvePlaybackSourceKind({ sourceKind = '', fromHistoryPlayFlag = false, fromHistoryDetail = false } = {}) {
      const explicit = normalizeString(sourceKind);
      if (explicit) return explicit;
      if (fromHistoryPlayFlag) return 'history-list';
      if (fromHistoryDetail) return 'history-detail';
      if (!this.isTmdbMode && !this.selectedSiteResultItem) return 'direct-site';
      return 'site-detail';
    },
    resetSwitchSkipState() {
      this.switchSkipByEpisodeKey = {};
      this.activePlayerControlAction = '';
    },
    getSwitchSkippedIdsForEpisode(episodeKey) {
      const key = normalizeString(episodeKey);
      if (!key) return [];
      const store = this.switchSkipByEpisodeKey && typeof this.switchSkipByEpisodeKey === 'object'
        ? this.switchSkipByEpisodeKey
        : {};
      const list = store[key];
      return Array.isArray(list) ? list.slice() : [];
    },
    setSwitchSkippedIdsForEpisode(episodeKey, ids) {
      const key = normalizeString(episodeKey);
      if (!key) return;
      const nextIds = Array.isArray(ids)
        ? ids.map((item) => normalizeString(item)).filter(Boolean)
        : [];
      this.switchSkipByEpisodeKey = {
        ...(this.switchSkipByEpisodeKey && typeof this.switchSkipByEpisodeKey === 'object' ? this.switchSkipByEpisodeKey : {}),
        [key]: nextIds,
      };
    },
    appendSwitchSkippedCandidate(episodeKey, wrapper) {
      const key = normalizeString(episodeKey);
      const identity = this.buildSwitchCandidateIdentity(wrapper);
      if (!key || !identity) return;
      const current = this.getSwitchSkippedIdsForEpisode(key);
      if (current.includes(identity)) return;
      this.setSwitchSkippedIdsForEpisode(key, current.concat(identity));
    },
    recordCurrentPlaybackIntoSwitchSkipBucket() {
      const episodeKey = this.buildSwitchEpisodeKey();
      if (!episodeKey) return;
      const playback = this.currentPlaybackContext && typeof this.currentPlaybackContext === 'object'
        ? this.currentPlaybackContext
        : null;
      const siteKey = normalizeString(playback && playback.siteKey);
      const siteDetail = normalizeString(playback && playback.siteDetail);
      const fileIdentity = normalizeString(playback && playback.fileIdentity);
      if (!siteKey || !siteDetail || !fileIdentity) return;
      this.appendSwitchSkippedCandidate(episodeKey, {
        siteKey,
        siteDetail,
        fileIdentity,
      });
    },
    recordResolvedPayloadIntoSwitchSkipBucket(payload) {
      const episodeKey = this.buildSwitchEpisodeKey();
      const target = payload && typeof payload === 'object' ? payload : null;
      const siteItem = target && target.siteItem && typeof target.siteItem === 'object' ? target.siteItem : null;
      const segment = target && target.segment && typeof target.segment === 'object' ? target.segment : null;
      const fileIdentity = buildSegmentPlaybackIdentity(segment);
      if (!episodeKey || !siteItem || !fileIdentity) return;
      this.appendSwitchSkippedCandidate(episodeKey, {
        siteItem,
        fileIdentity,
      });
    },
    clearPlayerActionToast() {
      if (this.playerTransientToastTimer) {
        window.clearTimeout(this.playerTransientToastTimer);
        this.playerTransientToastTimer = 0;
      }
      this.playerTransientToastText = '';
    },
    showPlayerActionToast(text) {
      const nextText = normalizeString(text);
      if (!nextText) return;
      this.clearPlayerActionToast();
      this.playerTransientToastText = nextText;
      this.playerTransientToastTimer = window.setTimeout(() => {
        this.playerTransientToastTimer = 0;
        this.playerTransientToastText = '';
      }, 1800);
    },
    resetPlayerReadyState() {
      this.playerMetaReady = false;
      this.playerFirstFrameReady = false;
      this.playerPlaybackStarted = false;
      this.playerBuffering = false;
    },
    beginExplicitPlaybackTransition(stage = 'play_url') {
      this.playerUiTransitionMode = '';
      this.clearPlayerActionToast();
      this.playerUrl = '';
      this.playerHeaders = {};
      this.playLoading = false;
      this.playError = '';
      this.playerRuntimeError = '';
      this.playRequestStage = normalizeString(stage) || 'play_url';
      this.lastGoProxyCandidate = null;
      this.resetPlayerReadyState();
    },
    finishPlayerSwitchTransition() {
      this.playerUiTransitionMode = '';
    },
    getNoMatchPlayerActionText(actionKey) {
      const action = normalizeString(actionKey);
      if (action === 'pan') return '暂无匹配网盘片源';
      if (action === 'quality') return '暂无匹配画质片源';
      return '未匹配到相关片源';
    },
    bindPlaySearchQuerySubscription() {
      this.unbindPlaySearchQuerySubscription();
      const query = normalizeSearchKey(this.playSearchQuery);
      const scope = normalizeString(this.effectivePlaySearchScope) || this.playSearchScope;
      if (!query) {
        this.playSearchLiveSnapshot = null;
        this.playSearchLiveStatus = 'idle';
        return;
      }
      this.playSearchLiveSnapshot = getSearchSessionAnyQuerySnapshot(query, scope);
      this.playSearchLiveStatus = getSearchSessionAnyQueryStatus(query, scope);
      this.playSearchUnsubscribe = subscribeSearchSessionQuery(query, (snapshot, status) => {
        if (normalizeSearchKey(this.playSearchQuery) !== query) return;
        if ((normalizeString(this.effectivePlaySearchScope) || this.playSearchScope) !== scope) return;
        this.playSearchLiveSnapshot = snapshot;
        this.playSearchLiveStatus = normalizeString(status) || 'idle';
      }, scope);
    },
    unbindPlaySearchQuerySubscription() {
      if (typeof this.playSearchUnsubscribe === 'function') {
        this.playSearchUnsubscribe();
      }
      this.playSearchUnsubscribe = null;
    },
    async ensurePlaySearchRuntimeConfig() {
      if (this.playSearchRuntimeConfigData) return this.playSearchRuntimeConfigData;
      const config = await ensureSearchSessionConfig(this.bootstrap).catch(() => null);
      this.playSearchRuntimeConfigData = config || null;
      return this.playSearchRuntimeConfigData;
    },
    async ensurePlayBlockedMatchIndexLoaded() {
      const query = normalizeString(this.playSearchQuery || this.displayTitle);
      if (!query) {
        this.playBlockedMatchIndex = {};
        return this.playBlockedMatchIndex;
      }
      const runtimeConfig = await this.ensurePlaySearchRuntimeConfig();
      const aggregateRules = runtimeConfig && Array.isArray(runtimeConfig.aggregateRules)
        ? runtimeConfig.aggregateRules
        : [];
      const next = await fetchBlockedMatchIndex(query, aggregateRules).catch(() => ({}));
      this.playBlockedMatchIndex = next && typeof next === 'object' ? next : {};
      return this.playBlockedMatchIndex;
    },
    async handleSmartMatchBlockUpdated(event) {
      const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : null;
      const keyword = normalizeString(this.playSearchQuery || this.displayTitle);
      const nextKeyword = normalizeString(detail && detail.keyword);
      if (nextKeyword && keyword && nextKeyword !== keyword) return;
      clearBlockedMatchCaches();
      await this.ensurePlayBlockedMatchIndexLoaded();
    },
    async loadPlayRuntimeAndDetail() {
      this.historySmartBootstrapStageDone = {};
      this.initialAutoPlaybackStageDone = '';
      this.smartPlaybackResolvedStage = '';
      this.syncPrimarySiteSourceOptions();
      await this.ensurePlayRuntimeSettings();
      await this.ensurePlayBlockedSiteKeysLoaded();
      await this.ensurePlaySearchRuntimeConfig();
      await this.ensurePlayBlockedMatchIndexLoaded();
      if (this.isTmdbMode && !this.tmdbMovieMode) {
        await Promise.allSettled([
          this.loadDetailData(),
          this.ensureDoubanSeasonMetaLoaded(),
        ]);
        this.syncSmartEpisodeMapping();
        this.$nextTick(() => this.syncPlaybackDisplayFocus());
        return;
      }
      await this.loadDetailData();
      this.syncSmartEpisodeMapping();
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    syncPrimarySiteSourceOptions() {
      if (this.isTmdbMode) {
        this.siteSourceOptions = ['TMDB', '豆瓣'];
        if (!normalizeString(this.selectedSiteSource) || !this.siteSourceOptions.includes(this.selectedSiteSource)) {
          this.selectedSiteSource = 'TMDB';
        }
        return;
      }
      const siteLabel = normalizeString(this.siteName) || '站点';
      this.siteSourceOptions = [siteLabel];
      this.selectedSiteSource = siteLabel;
    },
    toggleSiteSourceMenu() {
      this.siteSourceOpen = !this.siteSourceOpen;
      if (this.siteSourceOpen) this.panSourceOpen = false;
    },
    togglePanSourceMenu() {
      this.panSourceOpen = !this.panSourceOpen;
      if (this.panSourceOpen) this.siteSourceOpen = false;
    },
    async selectSiteSource(option) {
      if (!this.isTmdbMode) {
        this.siteSourceOpen = false;
        return;
      }
      if (this.selectedSiteResultItem && this.currentPanSourceEntry) {
        patchLastBrowsePlaybackContext({
          itemId: normalizeString(this.selectedSiteResultItem.id),
          panKey: normalizeString(this.currentPanSourceEntry.key),
        });
      }
      const hadSelectedSiteResult = !!this.selectedSiteResultItem;
      this.selectedSiteSource = option;
      this.applyEpisodeViewModePreference();
      this.selectedViewSeasonNumber = 0;
      this.selectedViewRangeStart = 0;
      this.siteSourceOpen = false;
      this.selectedSearchResultId = '';
      this.selectedPanSource = '';
      this.siteResultDetailData = null;
      this.siteResultDetailLoading = false;
      this.siteResultDetailError = '';
      if (hadSelectedSiteResult && this.isTmdbMode) {
        this.$nextTick(() => this.syncPlaybackDisplayFocus());
        return;
      }
      if (option === '豆瓣') {
        await this.ensureDoubanSeasonMetaLoaded();
      }
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    async triggerSiteSourceSearchMore() {
      if (!this.playSearchQuery || !this.siteSourceSearchInteractive) return;
      await this.ensurePlayBlockedSiteKeysLoaded();
      this.siteSourceSearchManualLoading = true;
      try {
        await performSearchSessionSearch(this.playSearchQuery, this.bootstrap, {
          saveHistoryEnabled: false,
          blockedSiteKeys: this.playBlockedSiteKeys,
          affectUi: false,
          scope: this.playSearchScope,
          searchDisplayModeOverride: 'sites',
          contentKind: this.playSearchContentKind,
        });
      } finally {
        this.siteSourceSearchManualLoading = false;
      }
    },
    async ensurePlayBlockedSiteKeysLoaded() {
      const raw = this.runtimeSettings && Array.isArray(this.runtimeSettings.smartSkipSiteKeys)
        ? this.runtimeSettings.smartSkipSiteKeys
        : [];
      this.playBlockedSiteKeys = raw.map((item) => normalizeString(item)).filter(Boolean);
    },
    selectSiteSourceResult(item) {
      if (!item || !item.id) return;
      this.selectedSearchResultId = String(item.id);
      this.selectedProjectionSource = this.readEpisodeMetaModePreference() || 'TMDB';
      this.selectedPanSource = '';
      this.selectedSiteEpisodeSelectionKey = '';
      this.applyEpisodeViewModePreference();
      this.selectedViewSeasonNumber = 0;
      this.selectedViewRangeStart = 0;
      this.siteSourceOpen = false;
      this.loadSelectedSiteResultDetail(item);
      patchLastBrowsePlaybackContext({
        itemId: normalizeString(item.id),
        panKey: '',
      });
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    selectPanSource(option) {
      this.selectedPanSource = option;
      this.panSourceOpen = false;
      if (this.selectedSiteResultItem) {
        patchLastBrowsePlaybackContext({
          itemId: normalizeString(this.selectedSiteResultItem.id),
          panKey: normalizeString(option),
        });
      }
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    syncCurrentPlaybackContextFromPage({
      siteItem,
      panEntry,
      segment,
      candidate,
      selectionKey,
      globalEpisode = 0,
      sourceKind = '',
      fromHistoryPlayFlag = false,
      fromHistoryDetail = false,
    } = {}) {
      const item = siteItem && typeof siteItem === 'object' ? siteItem : null;
      const pan = panEntry && typeof panEntry === 'object' ? panEntry : null;
      const seg = segment && typeof segment === 'object' ? segment : null;
      const cand = candidate && typeof candidate === 'object' ? candidate : null;
      const nextSelectionKey = normalizeString(selectionKey);
      const nextSourceKind = this.resolvePlaybackSourceKind({
        sourceKind,
        fromHistoryPlayFlag,
        fromHistoryDetail,
      });
      const nextSiteKey = normalizeString(item && item.siteKey);
      const nextVideoId = normalizeString(item && item.siteDetail);
      const nextPanKey = normalizeString(pan && pan.key);
      const nextItemIndex = normalizeInt(seg && seg.index);
      const nextRawFileName = pickRawFileNameForStats(seg && seg.displayName, seg && seg.rawName);
      const nextFileIdentity = buildSegmentPlaybackIdentity(seg);
      patchCurrentPlaybackContext({
        itemId: normalizeString(item && item.id),
        siteKey: nextSiteKey,
        siteName: normalizeString(item && item.siteName),
        spiderApi: normalizeString(item && item.spiderApi),
        siteDetail: nextVideoId,
        panKey: nextPanKey,
        panFlag: normalizeString(pan && pan.label),
        selectionKey: nextSelectionKey,
        globalEpisode: Math.max(0, normalizeInt(globalEpisode)),
        itemIndex: nextItemIndex,
        sourceQuality: normalizeString(cand && cand.quality),
        quality: normalizeString(cand && cand.quality),
        pathName: normalizeString(seg && seg.pathName),
        rawFileName: nextRawFileName,
        fileIdentity: nextFileIdentity,
        sourceKind: nextSourceKind,
        sourceSignature: this.buildPlaybackSourceSignature({
          siteKey: nextSiteKey,
          siteDetail: nextVideoId,
          panKey: nextPanKey,
          itemIndex: nextItemIndex,
        }),
      });
      this.selectedSiteEpisodeSelectionKey = nextSelectionKey;
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    selectSiteEpisodeFile(index, { globalEpisode = 0 } = {}) {
      const item = this.activeSitePlaybackItem;
      const pan = this.currentPanSourceEntry;
      const segment = this.buildCurrentPanSegment(index);
      const candidate = this.getCurrentPanRecognitionCandidate(index);
      if (!item || !pan || !segment || !normalizeString(segment.episodeUrl)) return null;
      const selectionKey = buildSiteEpisodeSelectionKey(pan.key, segment.index);
      if (!selectionKey) return null;
      this.syncPlayerStatsForSegment({ item, pan, segment });
      this.selectedSiteEpisodeSelectionKey = selectionKey;
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
      return { item, pan, segment, candidate, selectionKey };
    },
    isEpisodeItemInteractive(item) {
      return !this.isEpisodeButtonActive(item);
    },
    isRawListFileInteractive(item) {
      const entry = item && typeof item === 'object' ? item : null;
      if (!entry || normalizeString(entry.kind) !== 'file') return true;
      return !this.isCurrentRawListPlaybackSelection(entry);
    },
    isTmdbMovieCandidateInteractive(item) {
      return !this.isCurrentTmdbMovieCandidateSelection(item);
    },
    async onTmdbMovieCandidateClick(item) {
      if (!this.isTmdbMovieCandidateInteractive(item)) return;
      const target = item && typeof item === 'object' ? item : null;
      const siteItem = target && target.siteItem && typeof target.siteItem === 'object' ? target.siteItem : null;
      const panEntry = target && target.panEntry && typeof target.panEntry === 'object'
        ? target.panEntry
        : (() => {
          const detail = siteItem ? this.getCachedSiteResultDetail(siteItem) : null;
          const panKey = normalizeString(target && target.panKey);
          return detail
            ? this.buildPanSourcesFromDetail(detail).find((entry) => normalizeString(entry && entry.key) === panKey) || null
            : null;
        })();
      const itemIndex = normalizeInt(target && target.itemIndex);
      const segment = target && target.segment && typeof target.segment === 'object'
        ? target.segment
        : this.buildPanSegment(panEntry, itemIndex);
      if (!siteItem || !panEntry || itemIndex < 0 || !segment || !normalizeString(segment.episodeUrl)) return;
      this.beginExplicitPlaybackTransition('play_url');
      await this.playResolvedSiteSegment({
        siteItem,
        panEntry,
        segment,
        candidate: target && target.candidate ? target.candidate : null,
        selectionKey: normalizeString(target && target.selectionKey) || buildSiteEpisodeSelectionKey(panEntry.key, itemIndex),
        globalEpisode: 0,
      });
    },
    cycleProjectionSource() {
      const list = Array.isArray(this.projectionSourceOptions) ? this.projectionSourceOptions : [];
      if (list.length <= 1) return;
      const currentIndex = list.findIndex((item) => normalizeString(item) === normalizeString(this.selectedProjectionSource));
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % list.length : 0;
      const next = normalizeString(list[nextIndex]);
      if (!next) return;
      this.selectedProjectionSource = next;
      this.persistEpisodeMetaModePreference(next);
      this.selectedViewSeasonNumber = 0;
      this.selectedViewRangeStart = 0;
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    toggleRawList() {
      if (!this.activeSitePlaybackItem || this.forceRawListMode) return;
      this.rawListMode = !this.rawListMode;
      this.persistEpisodeViewModePreference();
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    applyEpisodeViewModePreference() {
      if (!this.activeSitePlaybackItem) {
        this.rawListMode = false;
        return;
      }
      if (this.forceRawListMode) {
        this.rawListMode = true;
        return;
      }
      this.rawListMode = this.readEpisodeViewModePreference() === 'raw';
    },
    readEpisodeViewModePreference() {
      const mode = normalizeString(readPlayLocalStorage(EP_VIEW_MODE_STORAGE_KEY)).toLowerCase();
      return mode === 'raw' || mode === 'episodes' ? mode : '';
    },
    persistEpisodeViewModePreference() {
      if (this.forceRawListMode) return;
      writePlayLocalStorage(EP_VIEW_MODE_STORAGE_KEY, this.rawListMode ? 'raw' : 'episodes');
    },
    readEpisodeMetaModePreference() {
      const key = normalizeString(this.episodeMetaModeStorageKey);
      if (!key || !this.isTmdbMode || this.tmdbMovieMode) return '';
      const mode = normalizeString(readPlayLocalStorage(key)).toLowerCase();
      if (mode === 'douban') return '豆瓣';
      if (mode === 'tmdb') return 'TMDB';
      return '';
    },
    persistEpisodeMetaModePreference(source) {
      const key = normalizeString(this.episodeMetaModeStorageKey);
      if (!key || !this.isTmdbMode || this.tmdbMovieMode) return;
      const next = normalizeString(source);
      if (next === '豆瓣') {
        writePlayLocalStorage(key, 'douban');
        return;
      }
      if (next === 'TMDB') {
        writePlayLocalStorage(key, 'tmdb');
        return;
      }
      writePlayLocalStorage(key, '');
    },
    onRawListItemClick(item) {
      if (!item) return;
      if (this.rawDirModeEnabled && item.kind === 'dir' && item.name) {
        const current = Array.isArray(this.rawDirPath) ? this.rawDirPath : [];
        this.rawDirPath = current.concat([normalizeString(item.name)]);
        this.$nextTick(() => this.ensureActivePlaybackRowVisible());
        return;
      }
      if (!this.isRawListFileInteractive(item)) return;
      if (item.kind === 'file') {
        const selected = this.selectSiteEpisodeFile(item.index, {
          globalEpisode: this.getCurrentPanSegmentGlobalEpisode(item.index),
        });
        if (!selected) return;
        this.beginExplicitPlaybackTransition('play_url');
        this.playSiteResultItemByIndex(item.index);
      }
    },
    onEpisodeItemClick(item) {
      if (!this.isEpisodeItemInteractive(item)) return;
      if (!this.selectedSiteResultItem && this.isTmdbMode) {
        this.beginExplicitPlaybackTransition('detail');
        void this.playPrimaryEpisodeItem(item);
        return;
      }
      const itemIndex = normalizeInt(item && item.itemIndex);
      if (itemIndex < 0) return;
      const selected = this.selectSiteEpisodeFile(itemIndex, {
        globalEpisode: normalizeInt(item && item.global),
      });
      if (!selected) return;
      this.beginExplicitPlaybackTransition('play_url');
      this.playSiteResultItemByIndex(itemIndex);
    },
    buildPanSegment(entry, index) {
      return buildPanSegmentRuntime(entry, index);
    },
    buildCurrentPanSegment(index) {
      return this.buildPanSegment(this.currentPanSourceEntry, index);
    },
    buildPanSourcesFromDetail(detail) {
      return buildPanSourcesFromDetailRuntime(detail);
    },
    buildSiteSourceResultItemsFromSnapshot(snapshot) {
      return buildSiteSourceResultItemsFromSnapshotRuntime({
        snapshot,
        runtimeConfig: this.playSearchRuntimeConfig,
        blockedSiteKeys: this.playBlockedSiteKeys,
        blockedMatchIndex: this.playBlockedMatchIndex,
        title: this.displayTitle,
        contentKind: this.playSearchContentKind,
      });
    },
    getPlayMatchBlockEntry(siteKey, siteDetail) {
      const key = `${normalizeString(siteKey)}::${normalizeString(siteDetail)}`;
      if (!key || key === '::') return null;
      const index = this.playBlockedMatchIndex && typeof this.playBlockedMatchIndex === 'object'
        ? this.playBlockedMatchIndex
        : {};
      const entry = index[key];
      return entry && typeof entry === 'object' ? entry : null;
    },
    isPlaybackCandidateBlockedByMatchBlock(wrapper) {
      const item = wrapper && wrapper.siteItem && typeof wrapper.siteItem === 'object' ? wrapper.siteItem : null;
      const candidate = wrapper && wrapper.candidate && typeof wrapper.candidate === 'object' ? wrapper.candidate : null;
      const source = candidate && candidate.source && typeof candidate.source === 'object' ? candidate.source : null;
      const siteKey = normalizeString(source && source.siteKey) || normalizeString(item && item.siteKey);
      const siteDetail = normalizeString(source && source.siteDetail) || normalizeString(item && item.siteDetail);
      const entry = this.getPlayMatchBlockEntry(siteKey, siteDetail);
      if (!entry) return false;
      if (entry.blockAll) return true;
      const panFlag = normalizeString(candidate && candidate.panFlag)
        || normalizeString(source && source.panFlag)
        || normalizeString(wrapper && wrapper.panFlag);
      if (!panFlag) return false;
      const blockedPanFlags = Array.isArray(entry.panFlags) ? entry.panFlags : [];
      return blockedPanFlags.some((itemFlag) => normalizeString(itemFlag) === panFlag);
    },
    buildUnifiedSmartCandidateAllowed(extraAllowed = null) {
      return (wrapper) => {
        if (this.isPlaybackCandidateBlockedByMatchBlock(wrapper)) return false;
        if (typeof extraAllowed !== 'function') return true;
        try {
          return !!extraAllowed(wrapper);
        } catch (_error) {
          return true;
        }
      };
    },
    syncPlayerStatsForResolvedSegment({ siteResultItem, pan, segment, candidate }) {
      this.playerStatsSiteName = buildPlaybackSiteLabel(siteResultItem);
      this.playerStatsPanName = normalizeString(pan && pan.label);
      this.playerStatsPathName = resolvePlayerStatsPathName({ segment, candidate });
      this.playerStatsRawFileName = pickRawFileNameForStats(segment && segment.displayName, segment && segment.rawName);
    },
    buildPlayHistoryWarmContext() {
      return {
        contentKey: this.playContentPreferenceKey,
      };
    },
    syncPlaybackContextFromHistoryRow(row) {
      const item = row && typeof row === 'object' ? row : null;
      if (!item) return;
      const nextGlobalEpisode = this.getHistoryRowGlobalEpisode(item);
      const nextPlayFlag = normalizeString(item.playFlag);
      const nextSelectionKey = normalizeString(item.selectionKey);
      const nextSiteEpisodeIndex = Math.max(0, normalizeInt(item.siteEpisodeIndex) - 1);
      const nextSiteEpisodeFile = normalizeString(item.siteEpisodeFile);
      patchCurrentPlaybackContext({
        globalEpisode: nextGlobalEpisode,
        panFlag: nextPlayFlag,
        selectionKey: nextSelectionKey,
        itemIndex: nextSiteEpisodeIndex,
        rawFileName: nextSiteEpisodeFile,
      });
      this.$nextTick(() => this.syncPlaybackDisplayFocus());
    },
    syncHistoryDisplayContextIfReady() {
      if (normalizeString(this.playerUrl) || this.playLoading) return;
      const row = this.playHistoryRowForMenu;
      if (!row) return;
      if (this.isTmdbMode) {
        if (this.tmdbMovieMode || this.detailLoading || !(this.detailTMDBData && typeof this.detailTMDBData === 'object')) return;
        this.syncPlaybackContextFromHistoryRow(row);
        return;
      }
      if (this.selectedSiteResultItem) {
        if (this.siteResultDetailResolutionPending || !this.currentPanSourceOptions.length || !this.rawListItems.length) return;
        this.syncPlaybackContextFromHistoryRow(row);
        return;
      }
      if (this.detailLoading || !this.currentPanSourceOptions.length || !this.rawListItems.length) return;
      this.syncPlaybackContextFromHistoryRow(row);
    },
    async prefetchPlayHistoryForPage() {
      const context = this.buildPlayHistoryWarmContext();
      if (!normalizeString(context.contentKey) && (!normalizeString(context.siteKey) || !normalizeString(context.siteDetail))) return;
      await warmPlayHistoryForContext(context, { limit: 50 });
    },
    parseHistoryPlaybackItemId(row) {
      const value = normalizeString(row && row.playbackItemId);
      if (!value) return { season: 0, episode: 0 };
      const match = value.match(/^tmdb_tv_\d+_s(\d{2})_e(\d{3})$/i);
      if (!match) return { season: 0, episode: 0 };
      return {
        season: normalizeInt(match[1]),
        episode: normalizeInt(match[2]),
      };
    },
    getHistoryRowGlobalEpisode(row) {
      const item = row && typeof row === 'object' ? row : null;
      if (!item) return 0;
      const direct = Math.max(0, normalizeInt(item.globalEpisode));
      if (direct > 0) return direct;
      const parsed = this.parseHistoryPlaybackItemId(item);
      const season = Math.max(0, normalizeInt(item.tmdbSeason)) || Math.max(0, normalizeInt(parsed.season));
      const episode = Math.max(0, normalizeInt(item.tmdbEpisode)) || Math.max(0, normalizeInt(parsed.episode));
      if (season > 0 && episode > 0) {
        return tmdbGlobalEpisodeNoOf(this.detailTMDBData, season, episode);
      }
      return 0;
    },
    async focusPrimaryEpisodeByGlobal(globalEpisode) {
      const targetGlobal = Math.max(0, normalizeInt(globalEpisode));
      if (targetGlobal <= 0) return null;
      const target = tmdbSeasonEpisodeOfGlobal(this.detailTMDBData, targetGlobal);
      const season = Math.max(0, normalizeInt(target && target.season));
      const episode = Math.max(0, normalizeInt(target && target.episode));
      if (season > 0 && this.episodeSeasonRows.length > 1 && season !== this.currentEpisodeSeasonNumber) {
        this.selectedViewSeasonNumber = season;
      }
      await this.$nextTick();
      if (episode > 0 && this.episodeRangeOptions.length > 1) {
        const range = this.episodeRangeOptions.find((item) => episode >= item.start && episode <= item.end) || null;
        if (range && normalizeInt(range.start) !== this.currentEpisodeRangeStart) {
          this.selectedViewRangeStart = range.start;
        }
      }
      await this.$nextTick();
      return this.episodeButtons.find((item) => normalizeInt(item && item.text) === episode) || null;
    },
    normalizeHistoryEpisodeName(value) {
      return normalizeString(value).replace(/\s+/g, '').toLowerCase();
    },
    async resolveInitialSitePlaybackTarget(row) {
      const panOptions = Array.isArray(this.currentPanSourceOptions) ? this.currentPanSourceOptions : [];
      if (!panOptions.length) return null;
      const history = row && typeof row === 'object' ? row : null;
      const wantedPlayFlag = normalizeString(history && history.playFlag);
      const wantedSelectionKey = normalizeString(history && history.selectionKey);
      const wantedEpisodeName = this.normalizeHistoryEpisodeName(history && history.siteEpisodeFile);
      const wantedIndex = Math.max(0, normalizeInt(history && history.siteEpisodeIndex) - 1);
      const wantPanNorm = this.normalizeHistoryEpisodeName(wantedPlayFlag);
      let panKey = normalizeString(this.selectedPanSource);
      if (wantPanNorm) {
        const hit = panOptions.find((item) => {
          const key = this.normalizeHistoryEpisodeName(item && item.key);
          const label = this.normalizeHistoryEpisodeName(item && item.label);
          return !!wantPanNorm && (wantPanNorm === key || wantPanNorm === label);
        }) || null;
        if (hit) panKey = normalizeString(hit.key);
      }
      if (!panKey) panKey = normalizeString(panOptions[0] && panOptions[0].key);
      if (!panKey) return null;
      if (normalizeString(this.selectedPanSource) !== panKey) {
        this.selectedPanSource = panKey;
        await this.$nextTick();
      }
      const list = Array.isArray(this.rawListItems) ? this.rawListItems : [];
      if (!list.length) return null;
      let item = null;
      if (wantedSelectionKey) {
        item = list.find((entry) => normalizeString(entry && entry.selectionKey) === wantedSelectionKey) || null;
      }
      if (!item && wantedEpisodeName) {
        item = list.find((entry) => this.normalizeHistoryEpisodeName(entry && entry.text) === wantedEpisodeName) || null;
      }
      if (!item && wantedIndex >= 0) {
        item = list.find((entry) => normalizeInt(entry && entry.index) === wantedIndex) || null;
      }
      if (!item) item = list.find((entry) => entry && entry.kind === 'file') || null;
      if (!item) return null;
      return {
        panKey,
        itemIndex: normalizeInt(item.index),
      };
    },
    getSmartPlaybackStageConfig(preferredStage = '') {
      const stage = normalizeString(preferredStage);
      if (this.isTmdbMode && this.tmdbMovieMode) {
        return {
          stage: 'movie',
          mapping: null,
          mappingSignature: TMDB_MOVIE_RECOGNITION_SIGNATURE,
          episodeSource: this.selectedSiteSource,
          matchOptions: this.buildSmartMatchOptions(),
        };
      }
      if (stage === 'full') {
        return this.canRunFullSmartPlayback
          ? {
            stage: 'full',
            mapping: this.fullEpisodeMapping,
            mappingSignature: this.smartEpisodeMappingSignature,
            episodeSource: this.selectedSiteSource,
            allowDegradedMapping: true,
            requireDoubanReadyForMultiSeasonFallback: true,
          }
          : null;
      }
      if (stage === 'strict-fast') {
        return this.canRunStrictFastSmartPlayback
          ? {
            stage: 'strict-fast',
            mapping: this.strictFastEpisodeMapping,
            mappingSignature: this.strictFastEpisodeMappingSignature,
            episodeSource: 'TMDB',
            allowDegradedMapping: false,
            requireDoubanReadyForMultiSeasonFallback: true,
          }
          : null;
      }
      if (
        this.canRunStrictFastSmartPlayback
        && !normalizeString(this.smartPlaybackResolvedStage)
        && this.initialAutoPlaybackStageDone !== 'strict-fast'
      ) {
        return {
          stage: 'strict-fast',
          mapping: this.strictFastEpisodeMapping,
          mappingSignature: this.strictFastEpisodeMappingSignature,
          episodeSource: 'TMDB',
          allowDegradedMapping: false,
          requireDoubanReadyForMultiSeasonFallback: true,
        };
      }
      if (this.canRunFullSmartPlayback && !normalizeString(this.playerUrl) && this.smartPlaybackResolvedStage !== 'full') {
        return {
          stage: 'full',
          mapping: this.fullEpisodeMapping,
          mappingSignature: this.smartEpisodeMappingSignature,
          episodeSource: this.selectedSiteSource,
          allowDegradedMapping: true,
          requireDoubanReadyForMultiSeasonFallback: true,
        };
      }
      return null;
    },
    async tryInitialAutoPlayback() {
      if (this.initialAutoPlaybackDone || this.initialAutoPlaybackInFlight) return;
      if (this.selectedSiteResultItem) return;
      if (this.playLoading || normalizeString(this.playerUrl)) return;
      const stageConfig = this.isTmdbMode ? this.getSmartPlaybackStageConfig() : null;
      if (this.isTmdbMode && !this.tmdbMovieMode && !stageConfig) return;
      if (stageConfig && this.initialAutoPlaybackStageDone === stageConfig.stage) return;
      this.initialAutoPlaybackInFlight = true;
      try {
        const row = await ensurePlayHistoryRowForContext(this.buildPlayHistoryWarmContext(), { limit: 50 });
        if (this.isTmdbMode) {
        if (this.tmdbMovieMode) {
          const ok = await this.runSmartPlaybackWithConstraints({
            globalEpisode: 0,
            wantEpisodeInSeason: 0,
            matchOptions: stageConfig && stageConfig.matchOptions ? stageConfig.matchOptions : this.buildSmartMatchOptions(),
              stage: stageConfig && stageConfig.stage,
              mapping: stageConfig && stageConfig.mapping,
              mappingSignature: stageConfig && stageConfig.mappingSignature,
              episodeSource: stageConfig && stageConfig.episodeSource,
            }).then(() => normalizeString(this.playerUrl).length > 0);
            this.initialAutoPlaybackStageDone = stageConfig && stageConfig.stage ? stageConfig.stage : 'movie';
            if (ok) this.initialAutoPlaybackDone = true;
            return;
          }
          if (!stageConfig || !this.episodeButtons.length) return;
          const targetGlobal = this.getHistoryRowGlobalEpisode(row) || 1;
          const targetItem = await this.focusPrimaryEpisodeByGlobal(targetGlobal);
          const firstItem = this.episodeButtons[0] || null;
          const picked = targetItem || firstItem || null;
          if (!picked) return;
          let ok = await this.playPrimaryEpisodeItem(picked, stageConfig);
          this.initialAutoPlaybackStageDone = stageConfig.stage;
          if (!ok && stageConfig.stage === 'strict-fast') {
            const fullStageConfig = this.getSmartPlaybackStageConfig('full');
            if (fullStageConfig && !normalizeString(this.playerUrl)) {
              ok = await this.playPrimaryEpisodeItem(picked, fullStageConfig);
              this.initialAutoPlaybackStageDone = fullStageConfig.stage;
            }
          }
          if (ok) this.initialAutoPlaybackDone = true;
          return;
        }
        if (this.detailLoading || !this.currentPanSourceOptions.length || !this.rawListItems.length) return;
        const target = await this.resolveInitialSitePlaybackTarget(row);
        if (!target || target.itemIndex < 0) return;
        this.initialAutoPlaybackDone = true;
        const selected = this.selectSiteEpisodeFile(target.itemIndex, {
          globalEpisode: this.getCurrentPanSegmentGlobalEpisode(target.itemIndex),
        });
        if (!selected) return;
        await this.playSiteResultItemByIndex(target.itemIndex);
      } finally {
        this.initialAutoPlaybackInFlight = false;
      }
    },
    buildPlayHistoryPayloadForResolvedSegment({ siteItem, pan, segment, selectionKey, globalEpisode = 0 } = {}) {
      const item = siteItem && typeof siteItem === 'object' ? siteItem : null;
      const playback = this.currentPlaybackContext && typeof this.currentPlaybackContext === 'object'
        ? this.currentPlaybackContext
        : null;
      const nextGlobalEpisode = Math.max(0, normalizeInt(globalEpisode));
      const canReportTMDBHistory = !!this.isTmdbMode;
      const tmdbTarget = canReportTMDBHistory && nextGlobalEpisode > 0
        ? tmdbSeasonEpisodeOfGlobal(this.detailTMDBData, nextGlobalEpisode)
        : null;
      return buildPlayHistoryPayload({
        contentKey: this.playContentPreferenceKey,
        reportEnabled: canReportTMDBHistory ? (this.tmdbMovieMode || nextGlobalEpisode > 0) : true,
        siteKey: normalizeString(item && item.siteKey) || normalizeString(this.siteKey),
        siteName: normalizeString(item && item.siteName) || normalizeString(this.siteName),
        spiderApi: normalizeString(item && item.spiderApi) || normalizeString(this.spiderApi),
        siteDetail: normalizeString(item && item.siteDetail)
          || normalizeString(playback && playback.siteDetail)
          || (!canReportTMDBHistory ? normalizeString(this.siteDetail) : ''),
        Poster: this.detailPoster,
        Remark: this.historyRemarkText,
        tmdbId: canReportTMDBHistory ? this.tmdbId : 0,
        tmdbType: canReportTMDBHistory ? (this.tmdbType || this.searchType) : '',
        tmdbSeason: canReportTMDBHistory ? normalizeInt(tmdbTarget && tmdbTarget.season) : 0,
        tmdbEpisode: canReportTMDBHistory ? normalizeInt(tmdbTarget && tmdbTarget.episode) : 0,
        globalEpisode: nextGlobalEpisode,
        playFlag: normalizeString(pan && pan.label),
        siteEpisodeIndex: Math.max(1, normalizeInt(segment && segment.index) + 1),
        siteEpisodeFile: pickRawFileNameForStats(segment && segment.displayName, segment && segment.rawName),
        selectionKey,
      });
    },
    async applyPlayHistoryResume(reason = '') {
      const seconds = await onPlayerHistoryPlaybackStart(reason);
      if (seconds > 0) {
        await this.$nextTick();
        const art = this.$refs.artPlayerRef;
        if (art && typeof art.seekTo === 'function') {
          try {
            art.seekTo(seconds);
          } catch (_error) {}
        }
      }
      await confirmPlayerHistoryPlaybackReady(reason);
    },
    isEpisodeButtonActive(episode) {
      const item = episode && typeof episode === 'object' ? episode : null;
      if (!item) return false;
      if (this.selectedSiteResultItem) {
        return this.isCurrentProjectedPlaybackSelection(item);
      }
      const target = this.currentPrimaryPlaybackEpisodeTarget;
      if (!target) return false;
      if (this.episodeSeasonRows.length > 1 && this.currentEpisodeSeasonNumber !== normalizeInt(target.season)) {
        return false;
      }
      if (this.episodeRangeOptions.length > 1) {
        const currentRange = this.episodeRangeOptions.find((range) => range.start === this.currentEpisodeRangeStart) || null;
        const targetEpisode = normalizeInt(target.episode);
        if (!currentRange || targetEpisode < normalizeInt(currentRange.start) || targetEpisode > normalizeInt(currentRange.end)) {
          return false;
        }
      }
      return normalizeInt(item && item.text) === normalizeInt(target.episode);
    },
    isCurrentProjectedPlaybackSelection(target) {
      const playback = this.currentPlaybackContext;
      if (!this.selectedSiteResultItem) return false;
      const item = target && typeof target === 'object'
        ? target
        : { selectionKey: target };
      const currentPan = this.currentPanSourceEntry;
      const currentPanFlag = normalizeString(currentPan && currentPan.label);
      const playbackPanFlag = normalizeString(playback && playback.panFlag);
      if (!currentPanFlag || currentPanFlag !== playbackPanFlag) return false;
      const playbackItemIndex = normalizeInt(playback && playback.itemIndex);
      const itemIndex = normalizeInt(item && item.itemIndex);
      return playbackItemIndex >= 0 && itemIndex >= 0 && playbackItemIndex === itemIndex;
    },
    isCurrentTmdbMovieCandidateSelection(target) {
      const item = target && typeof target === 'object' ? target : null;
      const playback = this.currentPlaybackContext && typeof this.currentPlaybackContext === 'object'
        ? this.currentPlaybackContext
        : null;
      if (!item || !playback) return false;
      const playbackSiteKey = normalizeString(playback.siteKey);
      const playbackVideoId = normalizeString(playback.siteDetail);
      const itemSiteKey = normalizeString(item.siteKey);
      const itemVideoId = normalizeString(item.siteDetail);
      if (!playbackSiteKey || !playbackVideoId || playbackSiteKey !== itemSiteKey || playbackVideoId !== itemVideoId) return false;
      const playbackPanKey = normalizeString(playback.panKey);
      const itemPanKey = normalizeString(item.panKey);
      if (playbackPanKey && itemPanKey && playbackPanKey !== itemPanKey) return false;
      const playbackPanFlag = normalizeString(playback.panFlag);
      const itemPanFlag = normalizeString(item.panFlag);
      if (!playbackPanKey && playbackPanFlag && itemPanFlag && playbackPanFlag !== itemPanFlag) return false;
      const playbackIndex = normalizeInt(playback.itemIndex);
      const itemIndex = normalizeInt(item.itemIndex);
      if (playbackIndex >= 0 && itemIndex >= 0 && playbackIndex === itemIndex) return true;
      const playbackSelectionKey = normalizeString(playback.selectionKey);
      const itemSelectionKey = normalizeString(item.selectionKey);
      if (playbackSelectionKey && itemSelectionKey && playbackSelectionKey === itemSelectionKey) return true;
      const playbackFileIdentity = normalizeString(playback.fileIdentity);
      const itemFileIdentity = normalizeString(item.fileIdentity);
      return !!playbackFileIdentity && !!itemFileIdentity && playbackFileIdentity === itemFileIdentity;
    },
    isCurrentRawListPlaybackSelection(item) {
      if (!this.selectedSiteResultItem || !this.rawDirModeEnabled) return false;
      const entry = item && typeof item === 'object' ? item : null;
      if (!entry || entry.kind !== 'file') return false;
      const currentPanFlag = normalizeString(this.currentPanSourceEntry && this.currentPanSourceEntry.label);
      const playbackPanFlag = normalizeString(this.currentPlaybackContext && this.currentPlaybackContext.panFlag);
      if (!currentPanFlag || currentPanFlag !== playbackPanFlag) return false;
      const viewingPath = normalizeString(this.rawListDisplayPath);
      const playbackPath = normalizeString(this.playerStatsPathName);
      if (!viewingPath || !playbackPath || viewingPath !== playbackPath) return false;
      const playbackIndex = normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.itemIndex);
      const entryIndex = normalizeInt(entry.index);
      return playbackIndex >= 0 && entryIndex >= 0 && playbackIndex === entryIndex;
    },
    ensureActivePlaybackRowVisible() {
      this.$nextTick(() => {
        const root = this.$el && this.$el.querySelector('.play-episode-content');
        if (!root) return;
        const active = root.querySelector('.play-raw-list__row--active, .play-episode-btn--active');
        if (!active) return;
        const container = findScrollableEpisodeContainer(active, root);
        if (!container) return;
        ensureElementVisibleInContainer(active, container);
      });
    },
    syncPlaybackDisplayFocus() {
      const playback = this.currentPlaybackContext;
      if (this.selectedSiteResultItem) {
        const targetItem = this.projectedSiteEpisodeItems.find((item) => this.isCurrentProjectedPlaybackSelection(item)) || null;
        if (!this.rawListMode) {
          if (targetItem) {
            const season = normalizeInt(targetItem && targetItem.season);
            const no = normalizeInt(targetItem && targetItem.no);
            if (season > 0 && this.episodeSeasonRows.length > 1 && season !== this.currentEpisodeSeasonNumber) {
              this.selectedViewSeasonNumber = season;
            }
            if (no > 0 && this.projectedRangeOptions.length > 1) {
              const hit = this.projectedRangeOptions.find((item) => no >= item.start && no <= item.end) || null;
              if (hit && normalizeInt(hit.start) !== this.currentEpisodeRangeStart) {
                this.selectedViewRangeStart = hit.start;
              }
            }
          }
          this.ensureActivePlaybackRowVisible();
          return;
        }
        this.ensureActivePlaybackRowVisible();
        return;
      }
      if (this.showTmdbMovieCandidateList) {
        const hit = this.tmdbMovieCandidateItems.find((item) => this.isCurrentTmdbMovieCandidateSelection(item)) || null;
        if (hit) this.ensureActivePlaybackRowVisible();
        return;
      }
      const target = this.currentPrimaryPlaybackEpisodeTarget;
      if (!target) return;
      if (this.episodeSeasonRows.length > 1 && normalizeInt(target.season) !== this.currentEpisodeSeasonNumber) {
        this.selectedViewSeasonNumber = normalizeInt(target.season);
      }
      if (this.episodeRangeOptions.length > 1) {
        const hit = this.episodeRangeOptions.find((item) => normalizeInt(target.episode) >= item.start && normalizeInt(target.episode) <= item.end) || null;
        if (hit && normalizeInt(hit.start) !== this.currentEpisodeRangeStart) {
          this.selectedViewRangeStart = hit.start;
        }
      }
      this.ensureActivePlaybackRowVisible();
    },
    getSiteItemByIdFromSnapshot(itemId) {
      const targetId = normalizeString(itemId);
      if (!targetId) return null;
      const current = this.selectedSiteResultItem;
      if (current && normalizeString(current.id) === targetId) return current;
      const items = Array.isArray(this.siteSourceResultItems) ? this.siteSourceResultItems : [];
      return items.find((item) => normalizeString(item && item.id) === targetId) || null;
    },
    getCurrentPanSegmentGlobalEpisode(index) {
      const hit = this.getCurrentPanRecognitionCandidate(index);
      return Math.max(0, normalizeInt(hit && hit.mapping && hit.mapping.global));
    },
    getCurrentPanRecognitionCandidate(index) {
      const itemIndex = normalizeInt(index);
      if (itemIndex < 0) return null;
      const data = this.playbackRecognitionData && typeof this.playbackRecognitionData === 'object'
        ? this.playbackRecognitionData
        : null;
      const items = Array.isArray(data && data.items) ? data.items : [];
      return items.find((item) => normalizeInt(item && item.itemIndex) === itemIndex) || null;
    },
    async findNextPrimaryEpisodeButton() {
      const currentGlobal = Math.max(0, normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.globalEpisode));
      if (currentGlobal <= 0) return null;
      return this.focusPrimaryEpisodeByGlobal(currentGlobal + 1);
    },
    findNextProjectedSiteEpisodeItem() {
      const list = Array.isArray(this.projectedSiteEpisodeItems) ? this.projectedSiteEpisodeItems : [];
      if (!list.length) return null;
      const currentGlobal = Math.max(0, normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.globalEpisode));
      if (currentGlobal > 0) {
        const exact = list.find((item) => normalizeInt(item && item.global) === currentGlobal + 1) || null;
        if (exact) return exact;
      }
      const currentItemIndex = normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.itemIndex);
      const currentIndex = list.findIndex((item) => normalizeInt(item && item.itemIndex) === currentItemIndex);
      if (currentIndex < 0) return null;
      return list[currentIndex + 1] || null;
    },
    async playNextSiteListItem(itemIndex, globalEpisode = 0) {
      const targetIndex = normalizeInt(itemIndex);
      if (targetIndex < 0) return false;
      const selected = this.selectSiteEpisodeFile(targetIndex, {
        globalEpisode: Math.max(0, normalizeInt(globalEpisode)),
      });
      if (!selected) return false;
      await this.playSiteResultItemByIndex(targetIndex);
      return true;
    },
    async playNextFromCurrentContext() {
      if (this.selectedSiteResultItem) {
        if (!this.rawListMode) {
          const nextProjected = this.findNextProjectedSiteEpisodeItem();
          if (!nextProjected) return false;
          return this.playNextSiteListItem(
            normalizeInt(nextProjected.itemIndex),
            normalizeInt(nextProjected.global),
          );
        }
        const nextIndex = normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.itemIndex) + 1;
        return this.playNextSiteListItem(nextIndex, this.getCurrentPanSegmentGlobalEpisode(nextIndex));
      }
      if (this.isTmdbMode) {
        const nextPrimary = await this.findNextPrimaryEpisodeButton();
        if (!nextPrimary) return false;
        await this.playPrimaryEpisodeItem(nextPrimary);
        return true;
      }
      const nextIndex = normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.itemIndex) + 1;
      return this.playNextSiteListItem(nextIndex, this.getCurrentPanSegmentGlobalEpisode(nextIndex));
    },
    resolveCachedPlaybackTarget(globalEpisode, wantEpisodeInSeason = 0, {
      matchOptions = null,
      isCandidateAllowed = null,
      mapping = null,
      mappingSignature = '',
      episodeSource = '',
      allowDegradedMapping = true,
      requireDoubanReadyForMultiSeasonFallback = true,
      includeSelectedContext = true,
      includeBrowseContext = true,
    } = {}) {
      const unifiedAllowed = this.buildUnifiedSmartCandidateAllowed(isCandidateAllowed);
      const signature = normalizeString(mappingSignature)
        || (this.isTmdbMode && this.tmdbMovieMode ? TMDB_MOVIE_RECOGNITION_SIGNATURE : normalizeString(this.smartEpisodeMappingSignature));
      return resolveCachedPlaybackTargetRuntime({
        matchOptions,
        globalEpisode,
        wantEpisodeInSeason,
        selectedSiteResultItem: includeSelectedContext ? this.selectedSiteResultItem : null,
        currentPanSourceEntry: includeSelectedContext ? this.currentPanSourceEntry : null,
        includeSelectedContext,
        lastResolvedPlaybackContext: this.currentPlaybackContext,
        lastBrowsePlaybackContext: playbackSessionState.lastBrowseContext,
        includeBrowseContext,
        getSiteItemById: (itemId) => this.getSiteItemByIdFromSnapshot(itemId),
        detailStore: this.siteResultDetailStore,
        collectCandidates: (siteItem, nextGlobal, nextLoose, nextMatchOptions) =>
          this.collectRecognitionCandidatesForTarget(siteItem, nextGlobal, nextLoose, {
            matchOptions: nextMatchOptions || matchOptions,
            mappingSignature: signature,
            episodeSource: normalizeString(episodeSource) || this.selectedSiteSource,
            allowResolutionModes: this.buildAllowedResolutionModes(allowDegradedMapping),
          }),
        buildSelectionKey: (panKey, index) => buildSiteEpisodeSelectionKey(panKey, index),
        isCandidateAllowed: unifiedAllowed,
        ensureRecognitionForSiteItem: (siteItem, detail) => {
          this.cacheRecognitionForSiteResult(siteItem, detail, {
            mapping,
            mappingSignature: signature,
            allowDegradedMapping,
            requireDoubanReadyForMultiSeasonFallback,
          });
        },
      });
    },
    async tryHistorySmartBootstrap(globalEpisode, wantEpisodeInSeason = 0, {
      matchOptions = null,
      isCandidateAllowed = null,
      stage = '',
      mapping = null,
      mappingSignature = '',
      episodeSource = '',
      allowDegradedMapping = true,
      requireDoubanReadyForMultiSeasonFallback = true,
      skipHistoryList = false,
    } = {}) {
      const stageKey = normalizeString(stage) || 'default';
      if (this.historySmartBootstrapStageDone[stageKey]) return false;
      if (!this.isTmdbMode) {
        this.historySmartBootstrapStageDone = {
          ...this.historySmartBootstrapStageDone,
          [stageKey]: true,
        };
        return false;
      }
      this.historySmartBootstrapStageDone = {
        ...this.historySmartBootstrapStageDone,
        [stageKey]: true,
      };
      const signature = normalizeString(mappingSignature)
        || (this.isTmdbMode && this.tmdbMovieMode ? TMDB_MOVIE_RECOGNITION_SIGNATURE : normalizeString(this.smartEpisodeMappingSignature));
      const target = await resolveHistoryBootstrapPlaybackTargetRuntime({
        matchOptions,
        historyContext: this.buildPlayHistoryWarmContext(),
        globalEpisode,
        wantEpisodeInSeason,
        skipHistoryList: !!skipHistoryList,
        runtimeSettings: this.runtimeSettings,
        smartEpisodeMapping: mapping || this.smartEpisodeMapping,
        episodeSource: normalizeString(episodeSource) || this.selectedSiteSource,
        allowDegradedMapping,
        requireDoubanReadyForMultiSeasonFallback,
        allowResolutionModes: this.buildAllowedResolutionModes(allowDegradedMapping),
        isCandidateAllowed: this.buildUnifiedSmartCandidateAllowed(isCandidateAllowed),
        buildSelectionKey: (panKey, index) => buildSiteEpisodeSelectionKey(panKey, index),
        getCachedSiteResultDetail: (siteItem) => this.getCachedSiteResultDetail(siteItem),
        cacheHistoryDetail: (siteItem, payload) => {
          const target = payload && typeof payload === 'object' ? payload : {};
          const detail = target.detail && typeof target.detail === 'object' ? target.detail : null;
          const cacheMeta = target.cacheMeta && typeof target.cacheMeta === 'object' ? target.cacheMeta : null;
          if (!detail) return;
          this.siteResultDetailStore = setSiteResultDetailCacheEntryRuntime({
            store: this.siteResultDetailStore,
            item: siteItem,
            detail,
            cacheMeta,
          });
          this.cacheRecognitionForSiteResult(siteItem, detail, {
            mapping,
            mappingSignature: signature,
            allowDegradedMapping,
            requireDoubanReadyForMultiSeasonFallback,
          });
        },
        ensureRecognitionForSiteItem: (siteItem, detail) => {
          this.cacheRecognitionForSiteResult(siteItem, detail, {
            mapping,
            mappingSignature: signature,
            allowDegradedMapping,
            requireDoubanReadyForMultiSeasonFallback,
          });
        },
        collectCandidates: (siteItem, nextGlobal, nextLoose, nextMatchOptions) =>
          this.collectRecognitionCandidatesForTarget(siteItem, nextGlobal, nextLoose, {
            matchOptions: nextMatchOptions || matchOptions,
            mappingSignature: signature,
            episodeSource: normalizeString(episodeSource) || this.selectedSiteSource,
            allowResolutionModes: this.buildAllowedResolutionModes(allowDegradedMapping),
          }),
        ensureSiteResultDetailCached: (siteItem, options) =>
          this.ensureSiteResultDetailCached(siteItem, options),
      }).catch(() => null);
      if (!target) return false;
      const ok = await this.playResolvedSiteSegment({
        ...target,
        globalEpisode,
      });
      if (ok && stageKey) this.smartPlaybackResolvedStage = stageKey;
      return !!ok;
    },
    getCachedSiteResultDetail(item) {
      return getSiteResultDetailRuntime(this.siteResultDetailStore, item);
    },
    buildPrimaryEpisodeGlobalNo(item) {
      const episodeNo = normalizeInt(item && (item.no != null ? item.no : item.text));
      const seasonNo = this.currentEpisodeSeasonNumber;
      if (episodeNo <= 0 || seasonNo <= 0) return 0;
      if (this.isTMDBEpisodeSource) {
        return tmdbGlobalEpisodeNoOf(this.detailTMDBData, seasonNo, episodeNo);
      }
      if (this.isDoubanEpisodeSource) {
        return doubanGlobalEpisodeNoOf(this.detailDoubanData, seasonNo, episodeNo);
      }
      return 0;
    },
    applySiteResultDetailUpdate(item, detail) {
      const target = item && typeof item === 'object' ? item : null;
      const nextDetail = detail && typeof detail === 'object' ? detail : null;
      const itemKey = normalizeString(target && target.id);
      if (!target || !nextDetail || !itemKey) return;
      this.siteResultDetailStore = setSiteResultDetailCacheEntryRuntime({
        store: this.siteResultDetailStore,
        item: target,
        detail: nextDetail,
      });
      if (!this.selectedSiteResultItem || normalizeString(this.selectedSiteResultItem.id) !== itemKey) return;
      this.siteResultDetailData = nextDetail;
      if (!this.isTmdbMode) {
        this.detailOverview = stripMarkupText(nextDetail && nextDetail.content);
        this.detailYear = normalizeString(nextDetail && nextDetail.year);
        this.detailRemark = '';
      }
      const panSources = this.buildPanSourcesFromDetail(nextDetail);
      const selectedExists = panSources.some((entry) => normalizeString(entry && entry.key) === normalizeString(this.selectedPanSource));
      if (!selectedExists) {
        this.selectedPanSource = panSources[0] ? panSources[0].key : '';
      }
      const projectionOptions = this.projectionSourceOptions;
      if (projectionOptions.length && !projectionOptions.includes(this.selectedProjectionSource)) {
        this.selectedProjectionSource = projectionOptions[0];
      }
      if (normalizeString(this.selectedPanSource)) {
        patchLastBrowsePlaybackContext({
          itemId: itemKey,
          panKey: normalizeString(this.selectedPanSource),
        });
      }
    },
    async ensureSiteResultDetailCached(item, { onUpdate, signal } = {}) {
      const target = item && typeof item === 'object' ? item : null;
      if (!target) return null;
      const settings = await this.ensurePlayRuntimeSettings();
      return ensureSiteResultDetailCachedRuntime({
        item: target,
        store: this.siteResultDetailStore,
        runtimeSettings: settings,
        timeoutMs: 15000,
        signal,
        onUpdate: (nextDetail) => {
          const payload = nextDetail && typeof nextDetail === 'object' ? nextDetail : null;
          if (!payload) return;
          this.applySiteResultDetailUpdate(target, payload);
          if (typeof onUpdate === 'function') onUpdate(payload);
        },
      });
    },
    cacheRecognitionForSiteResult(item, detail, {
      mapping = null,
      mappingSignature = '',
      allowDegradedMapping = true,
      requireDoubanReadyForMultiSeasonFallback = true,
    } = {}) {
      const targetMapping = mapping && typeof mapping === 'object' ? mapping : this.smartEpisodeMapping;
      const signature = normalizeString(mappingSignature)
        || (this.isTmdbMode && this.tmdbMovieMode ? TMDB_MOVIE_RECOGNITION_SIGNATURE : buildEpisodeMappingSignature(targetMapping));
      const result = cacheRecognitionForSiteResultRuntime({
        store: this.siteResultRecognitionStore,
        item,
        detail,
        signature,
        runtimeSettings: this.runtimeSettings,
        smartEpisodeMapping: targetMapping,
        allowDegradedMapping,
        requireDoubanReadyForMultiSeasonFallback,
      });
      this.siteResultRecognitionStore = result && result.store && typeof result.store === 'object'
        ? result.store
        : this.siteResultRecognitionStore;
      return result && result.byEntry && typeof result.byEntry === 'object' ? result.byEntry : {};
    },
    getRecognitionCandidatesForSiteResult(item, { mappingSignature = '' } = {}) {
      return getRecognitionCandidatesForSiteResultRuntime({
        store: this.siteResultRecognitionStore,
        item,
        signature: normalizeString(mappingSignature) || this.activeRecognitionSignature,
      });
    },
    collectRecognitionCandidatesForTarget(siteItem, globalEpisodeNo, wantEpisodeInSeason = 0, {
      matchOptions = null,
      mappingSignature = '',
      episodeSource = '',
      allowResolutionModes = null,
    } = {}) {
      return collectRecognitionCandidatesForTargetRuntime({
        store: this.siteResultRecognitionStore,
        item: siteItem,
        signature: normalizeString(mappingSignature) || this.activeRecognitionSignature,
        matchOptions: matchOptions || this.buildSmartMatchOptions(),
        globalEpisodeNo,
        wantEpisodeInSeason,
        episodeSource: normalizeString(episodeSource) || this.selectedSiteSource,
        allowResolutionModes,
      });
    },
    resetSmartPlaybackRuntimeState({ stopStream = false } = {}) {
      if (stopStream && typeof this.smartPlaybackStreamCleanup === 'function') {
        try {
          this.smartPlaybackStreamCleanup();
        } catch (_error) {}
      }
      this.smartPlaybackStreamCleanup = null;
      this.smartPlaybackResume = null;
      this.smartPlaybackPendingRunSeq = 0;
      this.smartPlaybackConfirmedRunSeq = 0;
      this.smartPlaybackAttemptRunSeq = 0;
      this.smartPlaybackRunSeq += 1;
    },
    async playCachedResolvedTarget(payload = {}, { stage = '' } = {}) {
      this.resetSmartPlaybackRuntimeState({ stopStream: true });
      const ok = await this.playResolvedSiteSegment(payload);
      if (ok && normalizeString(stage)) this.smartPlaybackResolvedStage = normalizeString(stage);
    },
    async playResolvedSiteSegment({
      siteItem,
      panEntry,
      segment,
      candidate,
      selectionKey,
      globalEpisode,
      sourceKind = '',
      fromHistoryPlayFlag = false,
      fromHistoryDetail = false,
      selectedGoProxyBase = '',
    }) {
      if (!siteItem || !panEntry || !segment || !normalizeString(segment.episodeUrl)) return;
      const resolvedSourceKind = this.resolvePlaybackSourceKind({
        sourceKind,
        fromHistoryPlayFlag,
        fromHistoryDetail,
      });
      this.lastResolvedPlaybackPayload = {
        siteItem,
        panEntry,
        segment,
        candidate: candidate && typeof candidate === 'object' ? candidate : null,
        selectionKey: normalizeString(selectionKey),
        globalEpisode: Math.max(0, normalizeInt(globalEpisode)),
        sourceKind: resolvedSourceKind,
        fromHistoryPlayFlag: !!fromHistoryPlayFlag,
        fromHistoryDetail: !!fromHistoryDetail,
      };
      this.syncCurrentPlaybackContextFromPage({
        siteItem,
        panEntry,
        segment,
        candidate,
        selectionKey,
        globalEpisode,
        sourceKind: resolvedSourceKind,
        fromHistoryPlayFlag,
        fromHistoryDetail,
      });
      await preparePlayHistoryContext(
        this.buildPlayHistoryPayloadForResolvedSegment({
          siteItem,
          pan: panEntry,
          segment,
          selectionKey,
          globalEpisode,
        }),
      );
      const seq = this.playRequestSeq + 1;
      this.playRequestSeq = seq;
      this.playLoading = true;
      this.playRequestStage = 'play_url';
      this.playError = '';
      this.playerRuntimeError = '';
      this.autoProxyRetriedSeq = 0;
      this.playerMetaReady = false;
      this.playerFirstFrameReady = false;
      this.playerPlaybackStarted = false;
      this.playerBuffering = false;
      this.goProxyInUseBase = '';
      this.lastGoProxyCandidate = null;
      this.syncPlayerStatsForResolvedSegment({ siteResultItem: siteItem, pan: panEntry, segment, candidate });
      try {
        const settings = await this.ensurePlayRuntimeSettings();
        const resolvedDetail = this.getCachedSiteResultDetail(siteItem);
        const playbackSiteItem = {
          ...siteItem,
          detailData: resolvedDetail && typeof resolvedDetail === 'object'
            ? resolvedDetail
            : null,
        };
        const result = await executeResolvedSitePlayback({
          runtimeSettings: settings,
          bootstrapUser: this.bootstrap && this.bootstrap.user && this.bootstrap.user.username,
          siteItem: playbackSiteItem,
          panEntry,
          segment,
          selectionKey,
          apiBase: normalizeString(settings && settings.catpawrunnerApiBase),
          selectedGoProxyBase: normalizeString(selectedGoProxyBase),
        });
        if (seq !== this.playRequestSeq) return;
        this.lastGoProxyCandidate = result && result.lastGoProxyCandidate ? result.lastGoProxyCandidate : null;
        this.goProxyInUseBase = normalizeString(result && result.goProxyBase);
        this.playerUrl = normalizeString(result && result.playerUrl);
        this.playerHeaders = result && result.playerHeaders && typeof result.playerHeaders === 'object'
          ? result.playerHeaders
          : {};
        if (this.activePlayerControlAction === 'switch') {
          this.recordResolvedPayloadIntoSwitchSkipBucket({
            siteItem,
            panEntry,
            segment,
          });
        }
        this.playRequestStage = 'play_info';
        this.playError = '';
        this.playerRuntimeError = '';
        await this.$nextTick();
        const art = this.$refs.artPlayerRef;
        if (art && typeof art.tryAutoplay === 'function') {
          try {
            await art.tryAutoplay();
          } catch (_error) {}
        }
        if (normalizeString(this.smartPlaybackStage)) {
          this.smartPlaybackResolvedStage = normalizeString(this.smartPlaybackStage);
        }
        return true;
      } catch (error) {
        if (seq !== this.playRequestSeq) return;
        this.playerUrl = '';
        this.playerHeaders = {};
        this.playRequestStage = '';
        this.clearPlayerStats();
        this.lastGoProxyCandidate = null;
        this.playError = error && error.message ? String(error.message) : '播放失败';
        return false;
      } finally {
        if (seq === this.playRequestSeq) this.playLoading = false;
      }
    },
    async playPrimaryEpisodeItem(item, stageConfig = null) {
      const globalEpisode = this.buildPrimaryEpisodeGlobalNo(item);
      const wantEpisodeInSeason = normalizeInt(item && (item.no != null ? item.no : item.text));
      if (globalEpisode <= 0) return;
      const stage = stageConfig && typeof stageConfig === 'object' ? stageConfig : null;
      const cachedTarget = this.resolveCachedPlaybackTarget(globalEpisode, wantEpisodeInSeason, {
        matchOptions: this.buildSmartMatchOptions({
          trigger: 'primary',
        }),
        mapping: stage && stage.mapping,
        mappingSignature: stage && stage.mappingSignature,
        episodeSource: stage && stage.episodeSource,
        allowDegradedMapping: !(stage && stage.allowDegradedMapping === false),
        requireDoubanReadyForMultiSeasonFallback: !(stage && stage.requireDoubanReadyForMultiSeasonFallback === false),
      });
      if (cachedTarget) {
        await this.playCachedResolvedTarget({
          ...cachedTarget,
          globalEpisode,
        }, {
          stage: stage && stage.stage,
        });
        return true;
      }
      await this.runSmartPlaybackWithConstraints({
        globalEpisode,
        wantEpisodeInSeason,
        matchOptions: this.buildSmartMatchOptions({
          trigger: 'primary',
        }),
        stage: stage && stage.stage,
        mapping: stage && stage.mapping,
        mappingSignature: stage && stage.mappingSignature,
        episodeSource: stage && stage.episodeSource,
        allowDegradedMapping: !(stage && stage.allowDegradedMapping === false),
        requireDoubanReadyForMultiSeasonFallback: !(stage && stage.requireDoubanReadyForMultiSeasonFallback === false),
      });
      return normalizeString(this.playerUrl).length > 0;
    },
    buildSmartMatchOptions(extra = {}) {
      const base = this.isTmdbMode && this.tmdbMovieMode
        ? { kind: 'movie' }
        : { kind: 'episode' };
      return {
        ...base,
        ...(extra && typeof extra === 'object' ? extra : {}),
      };
    },
    buildAllowedResolutionModes(allowDegradedMapping = true) {
      return allowDegradedMapping
        ? ['strict-tmdb', 'strict-douban', 'degraded-single-baseline']
        : ['strict-tmdb'];
    },
    getWantEpisodeInSeasonByGlobal(globalEpisode) {
      const targetGlobal = Math.max(0, normalizeInt(globalEpisode));
      if (targetGlobal <= 0) return 0;
      const mapping = this.fullEpisodeMapping || this.strictFastEpisodeMapping;
      const tmdbValue = Array.isArray(mapping && mapping.items)
        ? mapping.items.find((item) => normalizeInt(item && item.global) === targetGlobal)?.tmdb
        : null;
      return Math.max(0, normalizeInt(tmdbValue && tmdbValue.episode));
    },
    async runSmartPlaybackWithConstraints({
      globalEpisode,
      wantEpisodeInSeason = 0,
      matchOptions = null,
      constraintStages = null,
      isCandidateAllowed = null,
      stage = '',
      mapping = null,
      mappingSignature = '',
      episodeSource = '',
      allowDegradedMapping = true,
      requireDoubanReadyForMultiSeasonFallback = true,
      skipHistoryList = false,
    } = {}) {
      const normalizedMatchOptions = this.buildSmartMatchOptions(matchOptions);
      const matchKind = normalizeString(normalizedMatchOptions && normalizedMatchOptions.kind).toLowerCase();
      const targetGlobal = Math.max(0, normalizeInt(globalEpisode));
      const targetLoose = Math.max(0, normalizeInt(wantEpisodeInSeason));
      if (matchKind !== 'movie' && targetGlobal <= 0) return;
      const unifiedAllowed = this.buildUnifiedSmartCandidateAllowed(isCandidateAllowed);
      const currentStage = normalizeString(stage) || 'full';
      const targetMapping = mapping && typeof mapping === 'object' ? mapping : this.smartEpisodeMapping;
      const targetSignature = normalizeString(mappingSignature)
        || (matchKind === 'movie' ? TMDB_MOVIE_RECOGNITION_SIGNATURE : buildEpisodeMappingSignature(targetMapping));
      const targetEpisodeSource = normalizeString(episodeSource) || this.selectedSiteSource;
      const historyBootstrapped = await this.tryHistorySmartBootstrap(targetGlobal, targetLoose, {
        matchOptions: normalizedMatchOptions,
        isCandidateAllowed: unifiedAllowed,
        stage: currentStage,
        mapping: targetMapping,
        mappingSignature: targetSignature,
        episodeSource: targetEpisodeSource,
        allowDegradedMapping,
        requireDoubanReadyForMultiSeasonFallback,
        skipHistoryList,
      });
      if (historyBootstrapped) return;
      if (typeof this.smartPlaybackStreamCleanup === 'function') {
        try {
          this.smartPlaybackStreamCleanup();
        } catch (_e) {}
      }
      this.smartPlaybackStreamCleanup = null;
      this.smartPlaybackResume = null;
      this.smartPlaybackPendingRunSeq = 0;
      this.smartPlaybackConfirmedRunSeq = 0;
      this.smartPlaybackAttemptRunSeq = 0;
      const runSeq = this.smartPlaybackRunSeq + 1;
      this.smartPlaybackRunSeq = runSeq;
      this.smartPlaybackStage = currentStage;
      patchCurrentPlaybackContext({ globalEpisode: targetGlobal });
      this.playLoading = true;
      this.playRequestStage = 'detail';
      this.playError = '';
      this.playerRuntimeError = '';
      this.playerMetaReady = false;
      this.playerFirstFrameReady = false;
      this.playerPlaybackStarted = false;
      this.playerBuffering = false;
      await this.ensurePlayRuntimeSettings();
      await this.ensurePlayBlockedSiteKeysLoaded();
      await this.ensurePlayBlockedMatchIndexLoaded();
      try {
        await runSmartPlaybackController({
          runSeq,
          query: this.playSearchQuery,
          bootstrap: this.bootstrap,
          searchScope: this.effectivePlaySearchScope,
          searchDisplayModeOverride: 'sites',
          blockedSiteKeys: this.playBlockedSiteKeys,
          matchOptions: normalizedMatchOptions,
          constraintStages,
          allowDegradedMapping,
          requireDoubanReadyForMultiSeasonFallback,
          globalEpisode: targetGlobal,
          wantEpisodeInSeason: targetLoose,
          isRunStopped: () => runSeq !== this.smartPlaybackRunSeq || this.smartPlaybackConfirmedRunSeq === runSeq,
          isCandidateAllowed: unifiedAllowed,
          buildSiteItemsFromSnapshot: (snapshot) => this.buildSiteSourceResultItemsFromSnapshot(snapshot),
          collectRecognitionCandidatesForTarget: (siteItem, payload) =>
            this.collectRecognitionCandidatesForTarget(
              siteItem,
              payload && payload.globalEpisode,
              payload && payload.wantEpisodeInSeason,
              {
                matchOptions: payload && payload.matchOptions ? payload.matchOptions : normalizedMatchOptions,
                mappingSignature: targetSignature,
                episodeSource: targetEpisodeSource,
                allowResolutionModes: this.buildAllowedResolutionModes(allowDegradedMapping),
              },
            ),
          getCachedSiteResultDetail: (siteItem) => this.getCachedSiteResultDetail(siteItem),
          ensureSiteResultDetailCached: (siteItem, options) =>
            this.ensureSiteResultDetailCached(siteItem, {
              onUpdate: (nextDetail) => {
                const payload = nextDetail && typeof nextDetail === 'object' ? nextDetail : null;
                if (!payload) return;
                this.cacheRecognitionForSiteResult(siteItem, payload, {
                  mapping: targetMapping,
                  mappingSignature: targetSignature,
                  allowDegradedMapping,
                  requireDoubanReadyForMultiSeasonFallback,
                });
                if (options && typeof options.onUpdate === 'function') options.onUpdate(payload);
              },
            }),
          buildPanSourcesFromDetail: (detail) => this.buildPanSourcesFromDetail(detail),
          buildPanSegment: (panEntry, index) => this.buildPanSegment(panEntry, index),
          buildSelectionKey: (panKey, index) => buildSiteEpisodeSelectionKey(panKey, index),
          playResolvedSiteSegment: (payload) => this.playResolvedSiteSegment(payload),
          getSearchState: (query, scope) => ({
            snapshot: getSearchSessionAnyQuerySnapshot(query, scope),
            status: getSearchSessionAnyQueryStatus(query, scope),
          }),
          setAttemptRunSeq: (value) => { this.smartPlaybackAttemptRunSeq = normalizeInt(value); },
          setPendingRunSeq: (value) => { this.smartPlaybackPendingRunSeq = normalizeInt(value); },
          setResume: (fn) => { this.smartPlaybackResume = typeof fn === 'function' ? fn : null; },
          clearPendingAttempt: () => {
            if (this.smartPlaybackPendingRunSeq === runSeq) this.smartPlaybackPendingRunSeq = 0;
            if (this.smartPlaybackAttemptRunSeq === runSeq) this.smartPlaybackAttemptRunSeq = 0;
          },
          onLoadingStateChange: (value) => { this.playLoading = !!value; },
          onErrorTextChange: (value) => { this.playError = normalizeString(value); },
          onStreamCleanupChange: (fn) => { this.smartPlaybackStreamCleanup = typeof fn === 'function' ? fn : null; },
        });
      } finally {
        this.smartPlaybackStage = 'idle';
        if (!normalizeString(this.playerUrl) && this.playRequestStage === 'detail') {
          this.playRequestStage = '';
        }
      }
    },
    async runPlayerControlSmartPlayback({ actionKey, selectedValue = '' } = {}) {
      if (!this.isPlayerInTmdbMode) return;
      const globalEpisode = Math.max(0, normalizeInt(this.currentPlaybackContext && this.currentPlaybackContext.globalEpisode));
      if (globalEpisode <= 0) return;
      const action = normalizeString(actionKey);
      const value = normalizeString(selectedValue);
      const currentPanFamily = normalizeString(this.currentPlaybackPanFamilyLabel);
      const currentQualityKey = normalizeString(this.currentPlaybackQualityKey);
      if (action === 'pan' && value && value === currentPanFamily) return;
      if (action === 'quality' && value && value === currentQualityKey) return;
      const suppressStatusUi = action === 'switch' || action === 'pan' || action === 'quality';
      const beforePlayRequestSeq = this.playRequestSeq;
      if (suppressStatusUi) {
        this.playerUiTransitionMode = 'switch';
        this.clearPlayerActionToast();
        this.playError = '';
        this.playerRuntimeError = '';
      }
      if (action === 'switch') {
        this.activePlayerControlAction = 'switch';
        this.recordCurrentPlaybackIntoSwitchSkipBucket();
      }
      const stages = buildSmartPlaybackConstraintStages({
        actionKey: action,
        selectedValue: value,
        currentContext: this.currentPlaybackContext,
        runtimeSettings: this.runtimeSettings,
      });
      if (!Array.isArray(stages) || !stages.length) {
        if (suppressStatusUi) this.finishPlayerSwitchTransition();
        return;
      }
      const switchEpisodeKey = action === 'switch' ? this.buildSwitchEpisodeKey() : '';
      const skipHistoryList = false;
      const sharedCandidateAllowed = (wrapper) => {
        if (action !== 'switch') return true;
        const identity = this.buildSwitchCandidateIdentity(wrapper);
        if (!identity) return true;
        return !this.getSwitchSkippedIdsForEpisode(switchEpisodeKey).includes(identity);
      };
      const preFinalizeStages = stages.filter((stage) => !stage.afterFinalize);
      const cachedTarget = this.resolveCachedPlaybackTarget(
        globalEpisode,
        this.getWantEpisodeInSeasonByGlobal(globalEpisode),
        {
          isCandidateAllowed: (wrapper) =>
            sharedCandidateAllowed(wrapper)
            && preFinalizeStages.some((stage) => {
              if (!stage || typeof stage.isCandidateAllowed !== 'function') return false;
              try {
                return !!stage.isCandidateAllowed(wrapper, {});
              } catch (_error) {
                return false;
              }
            }),
          includeSelectedContext: action !== 'switch',
          includeBrowseContext: action !== 'switch',
        },
      );
      if (cachedTarget) {
        await this.playCachedResolvedTarget({
          ...cachedTarget,
          globalEpisode,
        });
        if (suppressStatusUi && !normalizeString(this.playerUrl)) {
          this.finishPlayerSwitchTransition();
          this.activePlayerControlAction = '';
          if (normalizeString(this.playError)) {
            this.showPlayerActionToast(this.playError);
            this.playError = '';
          } else {
            this.showPlayerActionToast('匹配成功但播放启动失败');
          }
        }
        return;
      }
      await this.runSmartPlaybackWithConstraints({
        globalEpisode,
        wantEpisodeInSeason: this.getWantEpisodeInSeasonByGlobal(globalEpisode),
        matchOptions: this.buildSmartMatchOptions({
          trigger: action,
          value,
        }),
        constraintStages: stages,
        isCandidateAllowed: sharedCandidateAllowed,
        skipHistoryList,
      });
      if (!suppressStatusUi) return;
      if (normalizeString(this.playerUrl)) return;
      this.finishPlayerSwitchTransition();
      this.activePlayerControlAction = '';
      if (normalizeString(this.playError)) {
        this.showPlayerActionToast(this.playError);
        this.playError = '';
        return;
      }
      if (this.playRequestSeq > beforePlayRequestSeq) {
        this.showPlayerActionToast('匹配成功但播放启动失败');
        return;
      }
      this.showPlayerActionToast(this.getNoMatchPlayerActionText(action));
    },
    async markCurrentPlaybackSourceWrong() {
      const keyword = normalizeString(this.playSearchQuery || this.displayTitle);
      const payload = this.lastResolvedPlaybackPayload && typeof this.lastResolvedPlaybackPayload === 'object'
        ? this.lastResolvedPlaybackPayload
        : null;
      const playback = this.currentPlaybackContext && typeof this.currentPlaybackContext === 'object'
        ? this.currentPlaybackContext
        : null;
      const siteItem = payload && payload.siteItem && typeof payload.siteItem === 'object'
        ? payload.siteItem
        : {
          siteKey: normalizeString(playback && playback.siteKey),
          siteName: normalizeString(playback && playback.siteName),
          spiderApi: normalizeString(playback && playback.spiderApi),
          siteDetail: normalizeString(playback && playback.siteDetail),
        };
      const panFlag = normalizeString(this.currentPlaybackContext && this.currentPlaybackContext.panFlag)
        || normalizeString(payload && payload.panEntry && payload.panEntry.label);
      const siteKey = normalizeString(siteItem && siteItem.siteKey);
      const spiderApi = normalizeString(siteItem && siteItem.spiderApi);
      const siteDetail = normalizeString(siteItem && siteItem.siteDetail);
      if (!keyword || !siteKey || !siteDetail || !panFlag) {
        this.playError = '当前片源信息不完整';
        return false;
      }
      await addSmartMatchBlockItem({
        keyword,
        siteKey,
        spiderApi,
        siteDetail,
        poster: normalizeString(this.detailPoster),
        panFlag,
        source: 'play',
      });
      clearBlockedMatchCaches();
      await this.ensurePlayBlockedMatchIndexLoaded();
      return true;
    },
    async handleWrongSourceAction() {
      if (!this.isPlayerInTmdbMode || this.playLoading) return;
      try {
        const saved = await this.markCurrentPlaybackSourceWrong();
        if (!saved) return;
      } catch (error) {
        this.playError = error && error.message ? String(error.message) : '片源错误处理失败';
        return;
      }
      await this.runPlayerControlSmartPlayback({ actionKey: 'switch' });
    },
    syncPlayerStatsForSegment({ item, pan, segment }) {
      this.playerStatsSiteName = buildPlaybackSiteLabel(item);
      this.playerStatsPanName = normalizeString(pan && pan.label);
      this.playerStatsPathName = resolvePlayerStatsPathName({ segment });
      this.playerStatsRawFileName = pickRawFileNameForStats(segment && segment.displayName, segment && segment.rawName);
    },
    clearPlayerStats() {
      this.playerStatsSiteName = '';
      this.playerStatsPanName = '';
      this.playerStatsPathName = '';
      this.playerStatsRawFileName = '';
    },
    async onGoProxySelect(base) {
      const nextBase = normalizeString(base);
      this.goProxyManualBase = nextBase;
      const candidate = this.lastGoProxyCandidate && typeof this.lastGoProxyCandidate === 'object'
        ? this.lastGoProxyCandidate
        : null;
      if (!candidate || !candidate.enabled || !normalizeString(candidate.url) || this.proxyRetryInFlight) return;
      this.goProxyInUseBase = '';
      this.proxyRetryInFlight = true;
      try {
        this.playerUrl = '';
        this.playerHeaders = {};
        this.playLoading = true;
        this.playRequestStage = 'play_info';
        this.playError = '';
        this.playerRuntimeError = '';
        await this.$nextTick();
        const out = await executeProxyRetryPlayback({
          candidate,
          runtimeSettings: this.runtimeSettings,
          selectedGoProxyBase: this.goProxyManualBase,
        });
        if (!out || !out.ok || !normalizeString(out.playerUrl)) {
          this.playError = '代理切换失败';
          return;
        }
        this.playerUrl = normalizeString(out.playerUrl);
        this.playerHeaders = out.playerHeaders && typeof out.playerHeaders === 'object'
          ? out.playerHeaders
          : {};
        this.goProxyInUseBase = normalizeString(out.goProxyBase);
        this.playError = '';
        this.playerRuntimeError = '';
      } finally {
        this.playLoading = false;
        this.playRequestStage = '';
        this.proxyRetryInFlight = false;
      }
    },
    onPlayerExtraMenuSelect(payload) {
      const key = normalizeString(payload && payload.key);
      const value = normalizeString(payload && payload.value);
      if (!key || !value) return;
      void this.runPlayerControlSmartPlayback({ actionKey: key, selectedValue: value });
    },
    onPlayerExtraAction(keyRaw) {
      const key = normalizeString(keyRaw);
      if (!key) return;
      if (key === 'wrong-source') {
        void this.handleWrongSourceAction();
        return;
      }
      void this.runPlayerControlSmartPlayback({ actionKey: key });
    },
    async playSiteResultItemByIndex(index) {
      const item = this.activeSitePlaybackItem;
      const pan = this.currentPanSourceEntry;
      const segment = this.buildCurrentPanSegment(index);
      if (!item || !pan || !segment || !normalizeString(segment.episodeUrl)) return;
      const globalEpisode = this.getCurrentPanSegmentGlobalEpisode(index);
      this.resetSmartPlaybackRuntimeState({ stopStream: true });
      await this.playResolvedSiteSegment({
        siteItem: item,
        panEntry: pan,
        segment,
        selectionKey: buildSiteEpisodeSelectionKey(pan.key, segment.index),
        globalEpisode,
        sourceKind: (!this.isTmdbMode && !this.selectedSiteResultItem) ? 'direct-site' : 'site-detail',
      });
    },
    onPlayerError(event) {
      this.playerRuntimeError = event && event.message ? String(event.message) : '播放失败';
      this.playLoading = false;
      this.playRequestStage = '';
      this.playerBuffering = false;
      this.activePlayerControlAction = '';
      if (this.playerUiTransitionMode === 'switch') {
        const text = normalizeString(this.playerRuntimeError || this.playError) || '播放失败';
        this.finishPlayerSwitchTransition();
        this.showPlayerActionToast(text);
        this.playError = '';
        this.playerRuntimeError = '';
      }
      const candidate = this.lastGoProxyCandidate && typeof this.lastGoProxyCandidate === 'object'
        ? this.lastGoProxyCandidate
        : null;
      const canRetryWithProxy =
        !this.proxyRetryInFlight
        && normalizeInt(this.autoProxyRetriedSeq) !== normalizeInt(this.playRequestSeq)
        && candidate
        && candidate.enabled
        && hasNonEmptyHeaders(candidate.headers)
        && normalizeString(candidate.url);
      if (canRetryWithProxy) {
        this.autoProxyRetriedSeq = normalizeInt(this.playRequestSeq);
        this.proxyRetryInFlight = true;
        this.playerUrl = '';
        this.playerHeaders = {};
        this.playLoading = true;
        this.playRequestStage = 'play_info';
        this.$nextTick().then(async () => {
          try {
            const out = await executeProxyRetryPlayback({
              candidate,
              runtimeSettings: this.runtimeSettings,
              selectedGoProxyBase: this.goProxyManualBase,
            });
            if (!out || !out.ok || !normalizeString(out.playerUrl)) return;
            this.playerUrl = normalizeString(out.playerUrl);
            this.playerHeaders = out.playerHeaders && typeof out.playerHeaders === 'object'
              ? out.playerHeaders
              : {};
            this.goProxyInUseBase = normalizeString(out.goProxyBase);
            this.playError = '';
            this.playerRuntimeError = '';
          } finally {
            this.playLoading = false;
            this.playRequestStage = '';
            this.proxyRetryInFlight = false;
          }
        });
        return;
      }
      const pendingRunSeq = normalizeInt(this.smartPlaybackPendingRunSeq);
      const confirmedRunSeq = normalizeInt(this.smartPlaybackConfirmedRunSeq);
      if (pendingRunSeq > 0 && pendingRunSeq === this.smartPlaybackRunSeq && pendingRunSeq !== confirmedRunSeq) {
        const resume = typeof this.smartPlaybackResume === 'function' ? this.smartPlaybackResume : null;
        this.smartPlaybackPendingRunSeq = 0;
        if (this.smartPlaybackAttemptRunSeq === pendingRunSeq) this.smartPlaybackAttemptRunSeq = 0;
        if (resume) void resume();
      }
    },
    onPlayerBuffering(value) {
      this.playerBuffering = !!value;
    },
    onPlayerVideoInfo(info) {
      this.playerMetaReady = true;
      const payload = info && typeof info === 'object' ? info : {};
      const inferredQuality = inferQualityFromResolution({
        width: payload.width,
        height: payload.height,
      });
      if (!inferredQuality) return;
      const currentQuality = normalizeString(this.currentPlaybackContext && this.currentPlaybackContext.quality);
      if (!currentQuality || currentQuality === '未知') {
        patchCurrentPlaybackContext({ quality: inferredQuality });
        return;
      }
      if (!doesQualityMatchResolution(currentQuality, inferredQuality)) {
        patchCurrentPlaybackContext({ quality: inferredQuality });
      }
    },
    onPlayerTimeUpdate(info) {
      onPlayerHistoryTimeUpdate(info);
      void syncHistoryProgressIfPossible();
    },
    onPlayerPlaying() {
      this.playLoading = false;
      this.playerRuntimeError = '';
      this.playerPlaybackStarted = true;
      this.activePlayerControlAction = '';
      this.finishPlayerSwitchTransition();
    },
    async onPlayerFirstFrame() {
      this.playLoading = false;
      this.playerRuntimeError = '';
      this.playerBuffering = false;
      this.playerFirstFrameReady = true;
      this.playRequestStage = '';
      this.activePlayerControlAction = '';
      this.finishPlayerSwitchTransition();
      await this.applyPlayHistoryResume('firstframe');
      const pendingRunSeq = normalizeInt(this.smartPlaybackPendingRunSeq);
      if (pendingRunSeq > 0 && pendingRunSeq === this.smartPlaybackRunSeq) {
        this.smartPlaybackConfirmedRunSeq = pendingRunSeq;
        this.smartPlaybackAttemptRunSeq = 0;
        if (typeof this.smartPlaybackStreamCleanup === 'function') {
          try {
            this.smartPlaybackStreamCleanup();
          } catch (_e) {}
        }
        this.smartPlaybackStreamCleanup = null;
      }
    },
    onPlayerEnded() {
      if (this.autoNextInFlight || this.playLoading || normalizeInt(this.smartPlaybackPendingRunSeq) > 0) return;
      this.autoNextInFlight = true;
      void (async () => {
        try {
          await syncHistoryProgressIfPossible({ force: true });
        } catch (_error) {}
        try {
          await this.playNextFromCurrentContext();
        } finally {
          window.setTimeout(() => {
            this.autoNextInFlight = false;
          }, 800);
        }
      })();
    },
    goRawDirBack() {
      if (!this.canGoRawDirBack) return;
      const current = Array.isArray(this.rawDirPath) ? this.rawDirPath : [];
      this.rawDirPath = current.slice(0, -1);
    },
    cacheRecognitionForCurrentSiteResult() {
      const item = this.selectedSiteResultItem;
      const detail = this.siteResultDetailData;
      if (!item || !detail) return;
      if (this.isTmdbMode && this.tmdbMovieMode) {
        this.cacheRecognitionForSiteResult(item, detail, {
          mapping: null,
          mappingSignature: TMDB_MOVIE_RECOGNITION_SIGNATURE,
          allowDegradedMapping: true,
          requireDoubanReadyForMultiSeasonFallback: true,
        });
        return;
      }
      if (this.strictFastEpisodeMapping && this.strictFastEpisodeMappingSignature) {
        this.cacheRecognitionForSiteResult(item, detail, {
          mapping: this.strictFastEpisodeMapping,
          mappingSignature: this.strictFastEpisodeMappingSignature,
          allowDegradedMapping: false,
          requireDoubanReadyForMultiSeasonFallback: true,
        });
      }
      if (this.fullEpisodeMapping && this.smartEpisodeMappingSignature) {
        this.cacheRecognitionForSiteResult(item, detail, {
          mapping: this.fullEpisodeMapping,
          mappingSignature: this.smartEpisodeMappingSignature,
          allowDegradedMapping: true,
          requireDoubanReadyForMultiSeasonFallback: true,
        });
      }
    },
    syncSmartEpisodeMapping() {
      if (!this.isTmdbMode || this.tmdbMovieMode) {
        this.smartEpisodeMapping = null;
        return;
      }
      this.smartEpisodeMapping = buildSmartEpisodeMapping({
        tmdbDetail: this.detailTMDBData,
        doubanMeta: this.detailDoubanData,
      });
      this.cacheRecognitionForCurrentSiteResult();
      this.syncHistoryDisplayContextIfReady();
    },
    toggleThirdPartyExpanded() {
      this.thirdPartyExpanded = !this.thirdPartyExpanded;
    },
    openWithThirdPartyPlayer(player) {
      const target = player && typeof player === 'object' ? player : null;
      if (!target || !target.scheme) return;
      const durl = normalizeString(this.playerUrl);
      if (!durl) return;
      const name = normalizeString(this.displayTitle);
      const href = convertThirdPartyUrl(target.scheme, {
        raw_url: '',
        d_url: durl,
        name,
      });
      try {
        if (this.$refs.artPlayerRef && typeof this.$refs.artPlayerRef.pause === 'function') {
          this.$refs.artPlayerRef.pause();
        }
      } catch (_error) {
        // ignore player pause failure
      }
      window.setTimeout(() => {
        try {
          window.location.href = href;
        } catch (_error) {
          try {
            window.open(href, '_self');
          } catch (_error2) {
            // ignore scheme open failure
          }
        }
      }, 0);
    },
    async ensurePlayRuntimeSettings() {
      if (this.runtimeSettings) return this.runtimeSettings;
      const baseSettings =
        this.bootstrap && this.bootstrap.settings && typeof this.bootstrap.settings === 'object'
          ? this.bootstrap.settings
          : {};
      const playBootstrap = await fetchBootstrap('play').catch(() => ({}));
      const nextSettings = {
        ...baseSettings,
        ...(playBootstrap && playBootstrap.settings && typeof playBootstrap.settings === 'object'
          ? playBootstrap.settings
          : {}),
      };
      this.runtimeSettings = nextSettings;
      return nextSettings;
    },
    async loadDetailData() {
      const seq = this.detailFetchSeq + 1;
      this.detailFetchSeq = seq;
      this.detailLoading = true;
      this.detailOverview = '';
      this.detailYear = '';
      this.detailRemark = '';
      this.detailTMDBData = null;
      this.detailDoubanData = null;
      this.smartEpisodeMapping = null;
      this.doubanLoading = false;
      this.siteResultDetailData = null;
      this.siteResultDetailLoading = false;
      this.siteResultDetailError = '';
      this.initialAutoPlaybackDone = false;
      this.initialAutoPlaybackStageDone = '';
      this.historySmartBootstrapStageDone = {};
      this.smartPlaybackResolvedStage = '';
      this.applyEpisodeViewModePreference();
      this.selectedViewSeasonNumber = 0;
      this.selectedViewRangeStart = 0;

      try {
        if (this.isTmdbMode) {
          const tmdbType = normalizeString(this.tmdbType || this.searchType).toLowerCase();
          const tmdbId = normalizeString(this.tmdbId);
          if (!tmdbId || (tmdbType !== 'movie' && tmdbType !== 'tv')) {
            this.detailLoading = false;
            return;
          }
          const detail = await fetchTMDBDetailCached({
            type: tmdbType,
            id: tmdbId,
          });
          if (seq !== this.detailFetchSeq) return;
        this.detailOverview = normalizeString(detail && detail.overview);
        this.detailYear = normalizeString(detail && detail.year ? String(detail.year) : '');
        this.detailRemark = normalizeString(detail && detail.badge);
        this.detailTMDBData = detail && typeof detail === 'object' ? detail : null;
        this.syncSmartEpisodeMapping();
        this.$nextTick(() => this.applyEpisodeViewModePreference());
        this.detailLoading = false;
        return;
        }

        const settings = await this.ensurePlayRuntimeSettings();
        const apiBase = normalizeString(settings && settings.catpawrunnerApiBase);
        const spiderApi = normalizeString(this.spiderApi);
        const siteDetail = normalizeString(this.siteDetail);
        if (!apiBase || !spiderApi || !siteDetail) {
          this.detailLoading = false;
          return;
        }
        const raw = await fetchCatResolvedDetailCached({ apiBase, spiderApi, siteDetail, timeoutMs: 15000 });
        if (seq !== this.detailFetchSeq) return;
        this.detailOverview = stripMarkupText(raw && raw.content);
        this.detailYear = normalizeString(raw && raw.year);
        this.detailRemark = '';
        this.detailTMDBData = null;
        this.siteResultDetailData = raw && typeof raw === 'object' ? raw : null;
        this.selectedPanSource = this.siteDetailPanSources[0] ? this.siteDetailPanSources[0].key : '';
        this.syncSmartEpisodeMapping();
        this.syncHistoryDisplayContextIfReady();
        this.$nextTick(() => this.applyEpisodeViewModePreference());
        this.detailLoading = false;
      } catch (_error) {
        if (seq !== this.detailFetchSeq) return;
        this.detailLoading = false;
      }
    },
    async ensureDoubanSeasonMetaLoaded() {
      const currentKey = String(normalizeInt(this.tmdbId));
      if (!this.isTmdbMode || this.tmdbMovieMode) {
        this.detailDoubanData = null;
        this.detailDoubanMetaKey = '';
        this.doubanLoading = false;
        this.syncSmartEpisodeMapping();
        return null;
      }
      if (
        this.detailDoubanMetaKey === currentKey
        && this.detailDoubanData
        && typeof this.detailDoubanData === 'object'
      ) {
        const seasons = Array.isArray(this.detailDoubanData.seasons) ? this.detailDoubanData.seasons : [];
        if (seasons.length || this.doubanLoading === false) {
          return this.detailDoubanData;
        }
      }
      const keyword = normalizeString(this.playSearchQuery);
      const tmdbId = normalizeInt(this.tmdbId);
      if (!keyword || tmdbId <= 0) {
        this.detailDoubanData = null;
        this.detailDoubanMetaKey = '';
        this.doubanLoading = false;
        this.syncSmartEpisodeMapping();
        return null;
      }
      this.doubanLoading = true;
      try {
        const settings = await this.ensurePlayRuntimeSettings();
        const payload = await fetchDoubanSeasonMetaCached({
          keyword,
          tmdbId,
          settings,
        });
        this.detailDoubanData = payload && typeof payload === 'object' ? payload : { seasons: [] };
        this.detailDoubanMetaKey = currentKey;
        this.syncSmartEpisodeMapping();
        return this.detailDoubanData;
      } catch (_error) {
        this.detailDoubanData = { seasons: [] };
        this.detailDoubanMetaKey = currentKey;
        this.syncSmartEpisodeMapping();
        return this.detailDoubanData;
      } finally {
        this.doubanLoading = false;
      }
    },
    async loadSelectedSiteResultDetail(item) {
      const target = item && typeof item === 'object' ? item : null;
      if (!target) {
        this.siteResultDetailData = null;
        this.siteResultDetailLoading = false;
        this.siteResultDetailError = '';
        return;
      }
      const targetKey = normalizeString(target.id);
      const cachedDetail = this.getCachedSiteResultDetail(target);
      if (cachedDetail && cachedDetail.resolutionComplete === true) {
        this.cacheRecognitionForSiteResult(target, cachedDetail);
        this.applySiteResultDetailUpdate(target, cachedDetail);
        this.siteResultDetailLoading = false;
        this.siteResultDetailError = '';
        this.$nextTick(() => this.applyEpisodeViewModePreference());
        return;
      }
      this.siteResultDetailData = null;
      this.siteResultDetailLoading = true;
      this.siteResultDetailError = '';
      const settings = await this.ensurePlayRuntimeSettings();
      const apiBase = normalizeString(settings && settings.catpawrunnerApiBase);
      const spiderApi = normalizeString(target.spiderApi);
      const siteDetail = normalizeString(target.siteDetail);
      if (!apiBase || !spiderApi || !siteDetail) {
        this.siteResultDetailData = null;
        this.siteResultDetailLoading = false;
        this.siteResultDetailError = '';
        return;
      }
      try {
        const detail = await this.ensureSiteResultDetailCached(target, {
          onUpdate: (nextDetail) => {
            const payload = nextDetail && typeof nextDetail === 'object' ? nextDetail : null;
            if (!payload) return;
            if (normalizeString(this.selectedSearchResultId) !== targetKey) return;
            this.cacheRecognitionForSiteResult(target, payload);
            this.applySiteResultDetailUpdate(target, payload);
          },
        });
        if (detail && typeof detail === 'object' && normalizeString(this.selectedSearchResultId) === targetKey) {
          this.cacheRecognitionForSiteResult(target, detail);
          this.applySiteResultDetailUpdate(target, detail);
        }
        this.syncHistoryDisplayContextIfReady();
        this.$nextTick(() => this.applyEpisodeViewModePreference());
        this.$nextTick(() => this.syncPlaybackDisplayFocus());
      } catch (_error) {
        this.siteResultDetailData = null;
        this.selectedPanSource = '';
        this.siteResultDetailError = _error && _error.message ? String(_error.message) : '暂无数据';
      } finally {
        this.siteResultDetailLoading = false;
      }
    },
    selectEpisodeSeason(seasonNumber) {
      const nextSeason = normalizeInt(seasonNumber);
      if (nextSeason <= 0) return;
      this.selectedViewSeasonNumber = nextSeason;
      const seasonRow = this.episodeSeasonRows.find((item) => item.season === nextSeason) || null;
      const episodeCount = seasonRow ? normalizeInt(seasonRow.episodes) : 0;
      if (episodeCount > 50) {
        this.selectedViewRangeStart = 1;
        this.$nextTick(() => this.ensureActivePlaybackRowVisible());
        return;
      }
      this.selectedViewRangeStart = 0;
      this.$nextTick(() => this.ensureActivePlaybackRowVisible());
    },
    selectEpisodeRange(rangeStart) {
      const nextStart = normalizeInt(rangeStart);
      if (nextStart <= 0) return;
      if (!this.episodeRangeOptions.some((item) => item.start === nextStart)) return;
      this.selectedViewRangeStart = nextStart;
      this.$nextTick(() => this.ensureActivePlaybackRowVisible());
    },
    syncSiteSourceWidth() {
      const el = this.$refs.siteSourceSelectEl;
      const width = el && typeof el.getBoundingClientRect === 'function'
        ? Math.round(el.getBoundingClientRect().width)
        : 0;
      this.siteSourceSelectWidth = width > 0 ? width : 0;
    },
    bindSiteSourceWidth() {
      this.$nextTick(() => {
        this.syncSiteSourceWidth();
        if (this.siteSourceResizeObserver) {
          this.siteSourceResizeObserver.disconnect();
          this.siteSourceResizeObserver = null;
        }
        const el = this.$refs.siteSourceSelectEl;
        if (typeof ResizeObserver === 'function' && el) {
          this.siteSourceResizeObserver = new ResizeObserver(() => this.syncSiteSourceWidth());
          this.siteSourceResizeObserver.observe(el);
        }
      });
    },
    syncPlayerAreaHeight() {
      const el = this.$refs.playerAreaEl;
      const height = el && typeof el.getBoundingClientRect === 'function'
        ? Math.round(el.getBoundingClientRect().height)
        : 0;
      this.playerAreaHeight = height > 0 ? height : 0;
    },
    bindPlayerAreaHeight() {
      this.$nextTick(() => {
        this.syncPlayerAreaHeight();
        if (this.playerAreaResizeObserver) {
          this.playerAreaResizeObserver.disconnect();
          this.playerAreaResizeObserver = null;
        }
        const el = this.$refs.playerAreaEl;
        if (typeof ResizeObserver === 'function' && el) {
          this.playerAreaResizeObserver = new ResizeObserver(() => this.syncPlayerAreaHeight());
          this.playerAreaResizeObserver.observe(el);
        }
      });
    },
    getEpisodePanelWidthForColumns(columns) {
      const count = Math.max(1, Math.round(Number(columns) || 1));
      const gridWidth = (count * this.episodeButtonWidth)
        + ((count - 1) * this.episodeButtonGap)
        + this.episodeGridSidePadding;
      return gridWidth
        + this.episodeSelectorSidePadding
        + this.episodeSelectorDesktopOffset
        + this.episodeSelectorBorderWidth;
    },
    setEpisodePanelWidth(width) {
      const grid = this.$refs.playGridEl;
      if (!grid) return;
      const next = Math.max(this.minEpisodePanelWidth, Math.min(this.maxEpisodePanelWidth, Math.round(Number(width) || 0)));
      if (!next) return;
      grid.style.setProperty('--episode-panel-width', `${next}px`);
    },
    handleEpisodePanelResizeMove(event) {
      const state = this.episodePanelResizeState;
      if (!state.dragging) return;
      const x = event && typeof event.clientX === 'number' ? event.clientX : 0;
      const delta = x - state.startX;
      this.setEpisodePanelWidth(state.startWidth - delta);
    },
    handleEpisodePanelResizeUp() {
      const state = this.episodePanelResizeState;
      if (!state.dragging) return;
      state.dragging = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', this.handleEpisodePanelResizeMove, true);
      window.removeEventListener('mouseup', this.handleEpisodePanelResizeUp, true);
    },
    handleEpisodePanelResizeDown(event) {
      if (window.innerWidth < 768) return;
      if (event && typeof event.preventDefault === 'function') event.preventDefault();
      const panel = this.$refs.episodePanelEl;
      if (!panel) return;
      const state = this.episodePanelResizeState;
      state.dragging = true;
      state.startX = event && typeof event.clientX === 'number' ? event.clientX : 0;
      state.startWidth = panel.getBoundingClientRect().width || 308;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', this.handleEpisodePanelResizeMove, true);
      window.addEventListener('mouseup', this.handleEpisodePanelResizeUp, true);
    },
    bindEpisodePanelResizer() {
      const resizer = this.$refs.episodePanelResizerEl;
      if (!resizer) return;
      resizer.addEventListener('mousedown', this.handleEpisodePanelResizeDown);
    },
    unbindEpisodePanelResizer() {
      const resizer = this.$refs.episodePanelResizerEl;
      if (resizer) {
        resizer.removeEventListener('mousedown', this.handleEpisodePanelResizeDown);
      }
      this.handleEpisodePanelResizeUp();
    },
    handleDocumentClick(event) {
      const target = event.target;
      const siteSelect = this.$refs.siteSourceSelectEl;
      const panSelect = this.$refs.panSourceSelectEl;
      if (siteSelect && !siteSelect.contains(target)) this.siteSourceOpen = false;
      if (panSelect && !panSelect.contains(target)) this.panSourceOpen = false;
    },
  },
  watch: {
    switchOnlyToken() {
      this.initialAutoPlaybackDone = false;
      this.initialAutoPlaybackStageDone = '';
      this.initialAutoPlaybackInFlight = false;
      this.historySmartBootstrapStageDone = {};
      this.smartPlaybackResolvedStage = '';
      this.loadPlayRuntimeAndDetail();
    },
    playSearchQuery: {
      immediate: true,
      handler() {
        this.bindPlaySearchQuerySubscription();
      },
    },
    effectivePlaySearchScope() {
      this.bindPlaySearchQuerySubscription();
    },
    initialAutoPlaybackReadyKey: {
      immediate: true,
      handler() {
        void this.tryInitialAutoPlayback();
      },
    },
    forceRawListMode: {
      immediate: true,
      handler(next) {
        if (next) {
          this.rawListMode = true;
          return;
        }
        this.applyEpisodeViewModePreference();
      },
    },
    rawDirIdentity: {
      immediate: true,
      handler(next) {
        const identity = normalizeString(next);
        if (!this.rawDirModeEnabled) {
          this.rawDirPath = [];
          this.rawDirLockedDepth = 0;
          this.lastRawDirIdentity = identity;
          return;
        }
        const tree = this.rawDirTree;
        if (!tree) return;
        const panChanged = identity !== this.lastRawDirIdentity;
        this.lastRawDirIdentity = identity;
        if (panChanged) {
          this.rawDirPath = [];
          this.rawDirLockedDepth = 0;
        }

        const tryGetNode = (path) => {
          let node = tree;
          for (let i = 0; i < path.length; i += 1) {
            const seg = normalizeString(path[i]);
            if (!seg) continue;
            if (!node.dirs || !node.dirs.has(seg)) return null;
            node = node.dirs.get(seg);
          }
          return node;
        };

        const currentPath = Array.isArray(this.rawDirPath) ? this.rawDirPath : [];
        if (currentPath.length && !tryGetNode(currentPath)) {
          this.rawDirPath = [];
          this.rawDirLockedDepth = 0;
        }

        if (!this.rawDirPath.length) {
          const nextPath = [];
          let node = tree;
          while (node) {
            const dirs = node.dirs ? Array.from(node.dirs.keys()) : [];
            const hasFiles = Array.isArray(node.files) && node.files.length > 0;
            if (hasFiles) break;
            if (dirs.length !== 1) break;
            const only = normalizeString(dirs[0]);
            if (!only) break;
            nextPath.push(only);
            node = node.dirs.get(only);
          }
          if (nextPath.length) {
            this.rawDirPath = nextPath;
            this.rawDirLockedDepth = nextPath.length;
          }
        }
      },
    },
  },
};
</script>
<style>
.play-page {
  flex: 1 1 auto;
  padding-top: calc(3rem + env(safe-area-inset-top));
  padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
}

.play-page-root {
  background: transparent;
  color: inherit;
}

.dark .play-page-root {
  background: #0f172a;
  color: #e5e7eb;
}

@media (min-width: 768px) {
  .play-page {
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.play-page__content {
  --play-main-inset: 0px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

@media (min-width: 768px) {
  .play-page__content {
    --play-main-inset: 40px;
  }
}

.play-header {
  margin: 0 0 8px;
}

.play-header__title {
  min-width: 0;
  font-size: 20px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  margin: 0;
}

.dark .play-header__title {
  color: rgba(243, 244, 246, 1);
}

.play-page__main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: var(--play-main-inset);
  padding-right: var(--play-main-inset);
}

.play-episode-toggle-wrap {
  display: none;
}

@media (min-width: 1024px) {
  .play-episode-toggle-wrap {
    display: flex;
    justify-content: flex-end;
  }
}

.play-episode-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(229, 231, 235, 0.5);
  background: rgba(255, 255, 255, 0.8);
  color: rgba(55, 65, 81, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.play-episode-toggle:hover {
  background: #fff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.dark .play-episode-toggle {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(55, 65, 81, 0.5);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .play-episode-toggle:hover {
  background: rgba(31, 41, 55, 1);
}

.play-episode-toggle__icon {
  width: 14px;
  height: 14px;
  color: rgba(107, 114, 128, 1);
  transition: transform 0.2s ease;
}

.dark .play-episode-toggle__icon {
  color: rgba(156, 163, 175, 1);
}

.play-episode-toggle__label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(75, 85, 99, 1);
}

.dark .play-episode-toggle__label {
  color: rgba(209, 213, 219, 1);
}

.play-episode-toggle__dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(74, 222, 128, 1);
}

.play-grid {
  display: grid;
  gap: 16px;
}

.play-player-area {
  border-radius: 12px;
  border: 1px solid transparent;
}

.dark .play-player-area {
  border-color: rgba(255, 255, 255, 0.3);
}

.play-episode-panel {
  position: relative;
  width: 100%;
  min-height: 0;
}

@media (min-width: 768px) {
  .play-episode-panel {
    min-height: 0;
    overflow: hidden;
  }
}

@media (min-width: 1024px) {
  .play-episode-panel {
    opacity: 1;
    transform: scale(1);
  }
}

.play-episode-selector {
  height: 100%;
  min-height: 0;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 768px) {
  .play-episode-selector {
    margin-left: 8px;
  }
}

.dark .play-episode-selector {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.play-episode-tabs {
  display: flex;
  margin: 0 -24px 4px;
  flex-shrink: 0;
}

.play-episode-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 4px;
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

.play-episode-content {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.play-episode-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  flex: 1 1 auto;
  min-height: 0;
}

.play-episode-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: rgba(107, 114, 128, 1);
}

.play-episode-overlay__inner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.play-player-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 20;
  padding: 18px;
  background: radial-gradient(circle at 50% 45%, rgba(2, 6, 23, 0.78) 0%, rgba(2, 6, 23, 0.35) 55%, rgba(2, 6, 23, 0) 100%);
  backdrop-filter: none;
}

.play-player-overlay__panel {
  width: min(760px, 92%);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-radius: 22px;
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
  backdrop-filter: none;
}

.play-player-overlay__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0;
}

.play-player-overlay__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(248, 250, 252, 0.96);
}

.play-player-overlay--error .play-player-overlay__status {
  color: rgba(254, 226, 226, 0.98);
}

.play-player-overlay__statusText {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.2px;
  line-height: 1.05;
}

.play-player-overlay__spinner {
  border-color: rgba(255, 255, 255, 0.26);
  border-top-color: rgba(255, 255, 255, 0.96);
}

.play-player-overlay__progress {
  width: min(520px, 100%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.play-player-overlay__track {
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.play-player-overlay__fill {
  height: 100%;
  width: calc(var(--play-stage-p, 0) * 100%);
  border-radius: 9999px;
  background: linear-gradient(90deg, #0ea5e9, #22c55e, #6366f1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset;
}

.play-player-overlay--error .play-player-overlay__fill {
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.95), rgba(251, 146, 60, 0.95));
}

.play-picker-row {
  margin: 0 -24px 12px;
  padding: 0 24px;
}

.play-picker {
  width: 100%;
}

.play-picker .ui-selectbox__option.is-disabled {
  color: rgba(107, 114, 128, 1);
  cursor: default;
  pointer-events: none;
}

.dark .play-picker .ui-selectbox__option.is-disabled {
  color: rgba(156, 163, 175, 1);
}

.play-season-bar,
.play-range-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
}

.play-season-bar--with-range {
  margin-bottom: 10px;
}

.play-season-bar--tight,
.play-range-bar--tight {
  margin-bottom: 0;
}

.play-season-tabs,
.play-range-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px 0;
  scrollbar-width: none;
}

.play-season-tabs::-webkit-scrollbar,
.play-range-tabs::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.play-season-btn,
.play-range-btn {
  flex: 0 0 auto;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.04);
  color: rgba(107, 114, 128, 1);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}

.play-season-btn:hover,
.play-range-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.play-season-btn--active,
.play-range-btn--active {
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.4);
  color: rgba(22, 163, 74, 1);
}

.dark .play-season-btn,
.dark .play-range-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(209, 213, 219, 1);
}

.dark .play-season-btn:hover,
.dark .play-range-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dark .play-season-btn--active,
.dark .play-range-btn--active {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.42);
  color: rgba(74, 222, 128, 1);
}

.play-episode-divider {
  height: 1px;
  width: 100%;
  background: rgba(0, 0, 0, 0.08);
  margin-top: 0;
  margin-bottom: 12px;
}

.dark .play-episode-divider {
  background: rgba(255, 255, 255, 0.12);
}

.play-episode-grid {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  align-content: flex-start;
  padding: 4px 2px 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.play-episode-grid::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.play-raw-list {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.play-raw-list__path {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: rgba(75, 85, 99, 1);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.play-raw-list__pathText {
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.play-raw-list__pathBtn {
  flex: 0 0 auto;
  min-width: 52px;
  white-space: nowrap;
}


.play-raw-list__items {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.play-raw-list__items::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.play-raw-list__row {
  appearance: none;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.55);
  color: rgba(31, 41, 55, 1);
  font-size: 13px;
  font-weight: 600;
  box-shadow: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.play-raw-list__row:hover {
  background: rgba(255, 255, 255, 0.72);
}

.play-raw-list__row.is-current {
  cursor: default;
}

.play-raw-list__row.is-current:hover {
  background: rgba(34, 197, 94, 0.12);
}

.play-raw-list__row--active {
  border-color: rgba(34, 197, 94, 0.42);
  background: rgba(34, 197, 94, 0.12);
  color: rgba(22, 163, 74, 1);
}

.play-raw-list__text {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.play-raw-list__empty {
  color: rgba(107, 114, 128, 1);
  font-size: 13px;
  font-weight: 600;
}

.play-episode-overlay .play-raw-list__empty {
  color: inherit;
}

.dark .play-raw-list__path {
  color: rgba(209, 213, 219, 1);
}


.dark .play-raw-list__row {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .play-raw-list__row:hover {
  background: rgba(255, 255, 255, 0.09);
}

.dark .play-raw-list__row.is-current:hover {
  background: rgba(34, 197, 94, 0.18);
}

.dark .play-raw-list__row--active {
  border-color: rgba(34, 197, 94, 0.42);
  background: rgba(34, 197, 94, 0.18);
  color: rgba(74, 222, 128, 1);
}

.dark .play-raw-list__empty {
  color: rgba(156, 163, 175, 1);
}

.dark .play-episode-overlay {
  color: rgba(156, 163, 175, 1);
}

.play-episode-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(229, 231, 235, 1);
  color: rgba(55, 65, 81, 1);
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.play-episode-btn__text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.play-episode-btn__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 12px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 1);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  line-height: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.24);
}

.play-episode-btn--active {
  background: rgba(34, 197, 94, 1);
  border-color: rgba(34, 197, 94, 1);
  color: #fff;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.25);
}

.play-episode-btn:hover {
  background: rgba(209, 213, 219, 1);
  border-color: rgba(148, 163, 184, 0.7);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
}

.play-episode-btn.is-current {
  cursor: default;
}

.play-episode-btn.is-current:hover {
  background: rgba(34, 197, 94, 1);
  border-color: rgba(34, 197, 94, 1);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.25);
}

.dark .play-episode-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(209, 213, 219, 1);
}

.dark .play-episode-btn--active {
  background: rgba(22, 163, 74, 1);
  border-color: rgba(22, 163, 74, 1);
  color: #fff;
}

.dark .play-episode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.dark .play-episode-btn.is-current:hover {
  background: rgba(22, 163, 74, 1);
  border-color: rgba(22, 163, 74, 1);
}

@media (min-width: 768px) {
  .play-episode-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(44px, 44px));
    justify-content: start;
  }
}

.episode-tab-btn {
  appearance: none;
  -webkit-appearance: none;
  flex: 1 1 0;
  padding: 12px 24px;
  border: 0;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
  font-weight: 500;
  color: rgba(55, 65, 81, 1);
  background: rgba(0, 0, 0, 0.05);
  box-shadow: none;
}

.episode-tab-btn:hover {
  color: rgba(22, 163, 74, 1);
}

.episode-tab-btn--active {
  color: rgba(22, 163, 74, 1);
  background: transparent;
}

.dark .episode-tab-btn {
  color: rgba(209, 213, 219, 1);
  background: rgba(255, 255, 255, 0.05);
}

.dark .episode-tab-btn:hover,
.dark .episode-tab-btn--active {
  color: rgba(74, 222, 128, 1);
}

.play-thirdparty-bar {
  width: 100%;
  border-radius: 12px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.dark .play-thirdparty-bar {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.play-thirdparty-bar__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
}

@media (min-width: 768px) {
  #playGrid {
    grid-template-columns: minmax(0, 1fr) var(--episode-panel-width, 314px);
  }


  #playerArea {
    grid-column: 1 / 2 !important;
  }

  #episodePanel {
    grid-column: 2 / 3 !important;
    min-height: 0;
  }


}

.play-video-ratio {
  position: relative;
  width: 100%;
  background: #000;
  min-height: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
}

.play-video-ratio::before {
  content: "";
  display: block;
  padding-top: 56.25%;
}

.play-video-ratio__inner {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.play-player-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.play-thirdparty-btn,
.play-thirdparty-expand {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  color: rgba(55, 65, 81, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: transform 0.12s ease, background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  user-select: none;
}

.play-thirdparty-btn:hover,
.play-thirdparty-expand:hover {
  background: rgba(255, 255, 255, 0.8);
}

.play-thirdparty-btn:active,
.play-thirdparty-expand:active {
  transform: translateY(1px);
}

.play-thirdparty-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.play-thirdparty-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.play-thirdparty-expand__ico {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.play-thirdparty-expand__ico--open {
  transform: rotate(180deg);
}


.dark .play-thirdparty-btn,
.dark .play-thirdparty-expand {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .play-thirdparty-btn:hover,
.dark .play-thirdparty-expand:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 767px) {
  .play-thirdparty-bar__inner {
    position: relative;
    justify-content: center;
    padding-left: 48px;
    padding-right: 48px;
  }

  .play-thirdparty-expand {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* iOS Safari: videos can go "audio-only black screen" when their parent clips (border-radius + overflow hidden).
   On iOS, avoid clipping the video element; keep layout responsive without relying on fixed pixels. */
@supports (-webkit-touch-callout: none) {
  .play-video-ratio {
    border-radius: 0 !important;
    overflow: visible !important;
    box-shadow: none !important;
  }
}


.episode-resizer {
  display: none;
}

.episode-resizer::before {
  content: "";
  position: absolute;
  left: 13px;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.14);
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.episode-resizer:hover::before {
  opacity: 0.9;
}

.dark .episode-resizer::before {
  background: rgba(255, 255, 255, 0.22);
}

@media (min-width: 768px) {
  .episode-resizer {
    position: absolute;
    display: block;
    left: -14px;
    top: 10px;
    bottom: 10px;
    width: 28px;
    cursor: col-resize;
    z-index: 20;
  }
}

#episodeSelector {
  overflow-x: hidden;
  overflow-y: visible;
}

.episode-tab-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.06);
}

.dark .episode-tab-header {
  background: rgba(255, 255, 255, 0.06);
}



.play-detail__inner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.play-detail {
  margin-top: 16px;
  margin-left: var(--play-main-inset, 0px);
  margin-right: var(--play-main-inset, 0px);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(229, 231, 235, 0.3);
  backdrop-filter: blur(8px);
}

@media (min-width: 640px) {
  .play-detail {
    padding: 24px;
  }
}

.dark .play-detail {
  background: rgba(31, 41, 55, 0.4);
  border-color: rgba(55, 65, 81, 0.3);
}

.play-detail__poster {
  flex: 0 0 200px;
}

.play-detail__posterWrap {
  position: relative;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.04);
  aspect-ratio: 2 / 3;
}

.play-detail__posterImg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-detail__posterSkeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 100%);
  background-size: 200% 100%;
  animation: play-skeleton 1.2s ease-in-out infinite;
}


.play-detail__info {
  flex: 1 1 auto;
  min-width: 0;
}

.play-detail__titleRow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-detail__favBtn {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.72);
  color: rgba(71, 85, 105, 1);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
}
.play-detail__favBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}
.play-detail__favBtn.is-active {
  border-color: rgba(236, 72, 153, 0.35);
  color: rgba(236, 72, 153, 1);
}
.dark .play-detail__favBtn {
  background: rgba(15, 23, 42, 0.55);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(226, 232, 240, 1);
  box-shadow: none;
}
.dark .play-detail__favBtn:hover {
  background: rgba(15, 23, 42, 0.75);
}
.dark .play-detail__favBtn.is-active {
  border-color: rgba(244, 114, 182, 0.35);
  color: rgba(244, 114, 182, 1);
}

.play-detail__title {
  flex: 0 1 auto;
  min-width: 0;
  max-width: calc(100% - 54px);
  font-size: 26px;
  line-height: 1.2;
  font-weight: 800;
  color: rgba(17, 24, 39, 1);
  letter-spacing: -0.02em;
  margin: 0;
}

.play-header__titleText,
.play-detail__titleText {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.play-detail__favIcon {
  width: 16px;
  height: 16px;
}

.play-detail__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.play-pill {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(55, 65, 81, 1);
  background: rgba(0, 0, 0, 0.06);
}

.play-detail__desc {
  margin-top: 14px;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(31, 41, 55, 0.92);
}


@media (max-width: 768px) {
  .play-detail__inner {
    flex-direction: column;
  }
  .play-detail__poster {
    flex-basis: auto;
    width: 220px;
  }
  .play-detail__title {
    font-size: 22px;
  }
}

@media (max-width: 520px) {
  .play-player-overlay__panel {
    width: min(520px, 92%);
    min-height: 180px;
    padding: 16px 14px 14px;
  }

  .play-player-overlay__status {
    justify-content: center;
  }

  .play-player-overlay__progress {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .play-player-overlay__text {
    padding-right: 0;
    gap: 0;
  }

  .play-player-overlay__statusText {
    font-size: 20px;
  }
}

.dark .play-detail__posterWrap {
  background: rgba(255, 255, 255, 0.06);
}

.dark .play-detail__posterSkeleton {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.06) 100%);
  background-size: 200% 100%;
}

.dark .play-detail__title {
  color: rgba(243, 244, 246, 1);
}

.dark .play-pill {
  color: rgba(229, 231, 235, 1);
  background: rgba(255, 255, 255, 0.08);
}

.dark .play-detail__desc {
  color: rgba(229, 231, 235, 0.9);
}


@keyframes play-skeleton {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

</style>
