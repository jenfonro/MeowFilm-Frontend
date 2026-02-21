<template>
  <main
    id="playPage"
    class="content-main flex-1 md:min-h-0 md:mt-0"
    style="padding-top:var(--tv-topbar-h, calc(3rem + env(safe-area-inset-top)));padding-bottom:calc(3.5rem + env(safe-area-inset-bottom))"
  >
          <div class="flex flex-col gap-3 py-4 px-5 lg:px-[3rem] 2xl:px-20">
            <div class="py-1">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="tv-icon-btn"
                  aria-label="返回"
                  @click="exitPlay"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                </button>
                <div class="flex flex-1 items-center gap-2 min-w-0">
                  <h1 class="min-w-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    <span id="playTitle" class="block truncate">{{ topLeftTitle }}</span>
                  </h1>
                  <button
                    type="button"
                    class="tv-icon-btn flex-shrink-0"
                    :class="isFavorited ? 'text-pink-600 dark:text-pink-400 border-pink-200/60 dark:border-pink-500/30' : ''"
                    :disabled="favoriteLoading || !canFavorite"
                    aria-label="收藏/取消收藏"
                    @click="toggleFavorite"
                  >
                    <svg
                      v-if="isFavorited"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-4 h-4"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="tvFavGradTop" x1="2" y1="4" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stop-color="#fb7185" />
                          <stop offset="0.55" stop-color="#ec4899" />
                          <stop offset="1" stop-color="#a855f7" />
                        </linearGradient>
                      </defs>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="url(#tvFavGradTop)"
                        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-1.344-.728 25.18 25.18 0 0 1-3.67-3.295 24.257 24.257 0 0 1-3.168-4.269c-.63-1.001-.839-2.145-.73-3.253.108-1.108.532-2.166 1.235-3.048a4.793 4.793 0 0 1 3.462-1.795c1.567-.08 3.113.582 4.084 1.816.97-1.234 2.517-1.896 4.084-1.816a4.793 4.793 0 0 1 3.462 1.795c.703.882 1.127 1.94 1.235 3.048.109 1.108-.1 2.252-.73 3.253a24.257 24.257 0 0 1-3.168 4.269 25.18 25.18 0 0 1-3.67 3.295 15.247 15.247 0 0 1-1.344.728l-.022.012-.007.003a.752.752 0 0 1-.704 0Z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-4 h-4 text-slate-400 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="hidden lg:flex justify-end">
                <button id="episodePanelToggle" class="group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200" type="button" title="隐藏选集面板">
                  <svg id="episodePanelToggleIcon" class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span id="episodePanelToggleLabel" class="text-xs font-medium text-gray-600 dark:text-gray-300">隐藏</span>
                  <div id="episodePanelToggleDot" class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full transition-all duration-200 bg-green-400"></div>
                </button>
              </div>

	              <div id="playGrid" class="grid gap-4 transition-all duration-300 ease-in-out grid-cols-1 md:grid-cols-4">
	                <div id="playerArea" class="transition-all duration-300 ease-in-out rounded-xl border border-white/0 dark:border-white/30 md:col-span-3">
                    <div class="tv-player-stack flex flex-col gap-2">
	                    <div class="play-video-ratio rounded-xl overflow-hidden shadow-lg">
		                      <div class="play-video-ratio__inner">
			                        <ArtPlayer
                              ref="artPlayerRef"
			                          :url="playerUrl"
			                          :headers="playerHeaders"
			                          :title="displayTitle"
                              :stats-extra="playerStatsExtra"
			                          :autoplay="true"
                              :go-proxy-options="goProxyUiOptions"
                              :go-proxy-selected-base="goProxyManualBase"
                              :go-proxy-label="goProxyUiLabel"
                              :extra-menus="playerExtraMenus"
                              :extra-actions="playerExtraActions"
                              :toast-text="playerToastText"
                              :show-buffer-ring="playerPhase === 'buffering'"
			                          @loadedmetadata="onPlayerLoadedMetadata"
                              @videoinfo="onPlayerVideoInfo"
	                              @buffering="onPlayerBuffering"
	                              @playing="onPlayerPlaying"
                              @timeupdate="onPlayerTimeUpdate"
	                              @ended="onPlayerEnded"
	                              @firstframe="onPlayerFirstFrame"
	                              @error="onPlayerError"
                              @goproxyselect="onGoProxySelect"
                              @extramenuselect="onPlayerExtraMenuSelect"
                              @extraaction="onPlayerExtraAction"
			                        />
	                      <div
	                        v-show="playerPhase !== 'ready' && playerPhase !== 'buffering'"
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

                      <div class="tv-thirdparty-bar w-full rounded-xl border border-white/0 dark:border-white/30 bg-white/75 dark:bg-white/5 backdrop-blur-sm shadow-sm">
                        <div class="tv-thirdparty-bar__inner flex flex-wrap items-center justify-center gap-1.5 px-2 py-2">
                          <button
                            v-for="p in thirdPartyVisiblePlayers"
                            :key="p.icon"
                            type="button"
                            class="tv-thirdparty-btn"
                            :disabled="!playerUrl"
                            :title="p.name"
                            :aria-label="`使用${p.name}播放`"
                            @click="openWithThirdPartyPlayer(p)"
                          >
                            <img :src="`/images/${p.icon}.webp`" :alt="p.name" class="tv-thirdparty-icon" />
                          </button>

                          <button
                            type="button"
                            class="tv-thirdparty-expand"
                            :aria-label="thirdPartyExpanded ? '收起' : '展开'"
                            :title="thirdPartyExpanded ? '收起' : '展开'"
                            @click="toggleThirdPartyExpanded"
                          >
                            <svg
                              class="tv-thirdparty-expand__ico"
                              :class="{ 'tv-thirdparty-expand__ico--open': thirdPartyExpanded }"
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

                <div id="episodePanel" class="relative w-full h-[320px] sm:h-[360px] md:h-auto md:overflow-hidden transition-all duration-300 ease-in-out md:col-span-1 lg:opacity-100 lg:scale-100">
                  <div id="episodePanelResizer" class="episode-resizer" aria-hidden="true"></div>
                  <div id="episodeSelector" class="md:ml-2 px-4 py-0 h-full min-h-0 rounded-xl bg-black/10 dark:bg-white/5 flex flex-col border border-white/0 dark:border-white/30 overflow-hidden">
                    <!-- Tab header -->
                    <div class="episode-tab-header flex mb-1 -mx-6 flex-shrink-0">
                      <button
                        id="tabEpisodes"
                        type="button"
                        class="flex-1 py-3 px-6 text-center cursor-pointer transition-all duration-200 font-medium"
                        :class="activeTab === 'episodes' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 hover:text-green-600 bg-black/5 dark:bg-white/5 dark:text-gray-300 dark:hover:text-green-400 hover:bg-black/3 dark:hover:bg-white/3'"
                        @click="activeTab = 'episodes'"
                      >
                        选集
                      </button>
                      <button
                        id="tabSources"
                        type="button"
                        class="flex-1 py-3 px-6 text-center cursor-pointer transition-all duration-200 font-medium"
                        :class="activeTab === 'sources' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 hover:text-green-600 bg-black/5 dark:bg-white/5 dark:text-gray-300 dark:hover:text-green-400 hover:bg-black/3 dark:hover:bg-white/3'"
                        @click="activeTab = 'sources'"
                      >
                        换源
                      </button>
                    </div>

                    <!-- Episodes tab -->
                    <div id="episodesTab" class="flex flex-col flex-1 min-h-0" v-show="activeTab === 'episodes'">
                      <div class="episode-controls-row flex items-center gap-2.5 mb-3 -mx-6 px-6 flex-shrink-0">
                        <div class="flex-1 min-w-0">
                          <div ref="panDropdownEl" class="custom-dropdown play-pan-dropdown">
                            <button
                              type="button"
                              class="custom-dropdown-btn play-pan-btn"
                              :disabled="panDropdownOptions.length === 0 && !smartListAvailable"
                              @click="panDropdownOpen = !panDropdownOpen"
                            >
                              {{ selectedPanLabel }}
                            </button>
                            <div class="custom-dropdown-list" :class="{ hidden: !panDropdownOpen }">
                              <div
                                v-if="smartListAvailable"
                                class="custom-dropdown-item"
                                :class="{ active: SMART_PAN_KEY === selectedPanKey }"
                                role="option"
                                @click="selectPan(SMART_PAN_KEY)"
                              >
                                {{ SMART_PAN_LABEL }}
                              </div>
                              <div
                                v-for="o in panDropdownOptions"
                                :key="o.key"
                                class="custom-dropdown-item"
                                :class="{ active: o.key === selectedPanKey }"
                                role="option"
                                @click="selectPan(o.key)"
                              >
                                {{ o.label }}
                              </div>
                              <div v-if="panDropdownOptions.length === 0 && !smartListAvailable" class="custom-dropdown-item">
                                {{ introLoading ? '加载中...' : '暂无数据' }}
                              </div>
                            </div>
                          </div>
	                        </div>
                        <div v-if="introLoading" class="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-label="加载中">
                          <div class="tv-spinner" aria-hidden="true"></div>
                        </div>
                        <template v-if="!tmdbSmartListAvailable">
                          <button
                            id="rawListBtn"
                            type="button"
                            class="episode-control episode-control--btn flex-shrink-0"
                            :data-active="rawListMode ? 'true' : 'false'"
                            v-show="!forceRawListMode"
                            @click="toggleRawList"
                          >
                            {{ rawListMode ? '返回选集' : '原始列表' }}
                          </button>
                          <select
                            v-if="rawListMode && thirdPartyIsMobile && rawListPageOptions.length"
                            v-model.number="rawListPage"
                            class="episode-control episode-control--btn flex-shrink-0"
                            aria-label="原始列表范围"
                          >
                            <option v-for="o in rawListPageOptions" :key="o.page" :value="o.page">
                              {{ o.label }}
                            </option>
                          </select>
                        </template>
	                      </div>

	                      <div
	                        v-if="tmdbSmartListAvailable && selectedPanKey !== SMART_PAN_KEY"
	                        class="episode-controls-row flex items-center gap-2.5 mb-3 -mx-6 px-6 flex-shrink-0"
	                      >
	                        <div class="flex-1 min-w-0">
	                          <div ref="tmdbPanDropdownEl" class="custom-dropdown play-pan-dropdown">
	                            <button
	                              type="button"
	                              class="custom-dropdown-btn play-pan-btn"
	                              :disabled="tmdbSelectedSitePanOptions.length === 0 && !selectedPanAuxLoading"
	                              @click="tmdbPanDropdownOpen = !tmdbPanDropdownOpen"
	                            >
	                              {{ tmdbSelectedSitePanLabel }}
	                            </button>
	                            <div class="custom-dropdown-list" :class="{ hidden: !tmdbPanDropdownOpen }">
	                              <div
	                                class="custom-dropdown-item"
	                                :class="{ active: SMART_PAN_KEY === selectedPanKey }"
	                                role="option"
	                                @click="selectPan(SMART_PAN_KEY)"
	                              >
	                                {{ SMART_PAN_LABEL }}
	                              </div>
	                              <div
	                                v-for="p in tmdbSelectedSitePanOptions"
	                                :key="p.key"
	                                class="custom-dropdown-item"
	                                :class="{ active: p.key === tmdbSelectedSitePanKey }"
	                                role="option"
	                                :title="p.label"
	                                @click="selectTMDBSitePan(p.key)"
	                              >
	                                {{ p.label }}
	                              </div>
	                              <div v-if="tmdbSelectedSitePanOptions.length === 0" class="custom-dropdown-item">
	                                {{ selectedPanAuxLoading ? '加载中...' : '暂无数据' }}
	                              </div>
	                            </div>
	                          </div>
	                        </div>
	                        <button
	                          id="rawListBtn"
	                          type="button"
	                          class="episode-control episode-control--btn flex-shrink-0"
	                          :data-active="rawListMode ? 'true' : 'false'"
	                          v-show="!forceRawListMode"
	                          @click="toggleRawList"
	                        >
	                          {{ rawListMode ? '返回选集' : '原始列表' }}
	                        </button>
	                        <select
	                          v-if="rawListMode && thirdPartyIsMobile && rawListPageOptions.length"
	                          v-model.number="rawListPage"
	                          class="episode-control episode-control--btn flex-shrink-0"
	                          aria-label="原始列表范围"
	                        >
	                          <option v-for="o in rawListPageOptions" :key="o.page" :value="o.page">
	                            {{ o.label }}
	                          </option>
	                        </select>
	                      </div>

	                      <div class="flex items-center gap-4 mb-4 border-b border-gray-300 dark:border-gray-700 -mx-6 px-6 flex-shrink-0" v-show="!rawListMode">
	                        <div class="flex-1 min-w-0">
	                          <div v-if="seasonTabs.length" class="episode-season-bar">
	                            <div class="episode-season-tabs">
	                              <button
	                                v-for="s in seasonTabs"
	                                :key="s.key"
	                                type="button"
	                                class="episode-season-btn"
	                                :data-active="Number(s.season) === Number(selectedSeason) ? 'true' : 'false'"
	                                @click="selectSeason(s.season)"
	                              >
	                                {{ s.label }}
	                              </button>
	                            </div>
	                          </div>
	                          <div class="episode-group-bar">
	                            <div ref="episodeGroupTabsEl" class="episode-group-tabs" @scroll.passive="updateHiddenEpisodeGroups">
	                              <button
	                                v-for="g in episodeGroups"
	                                :key="g.key"
                                type="button"
                                class="episode-group-btn"
                                :data-active="g.key === selectedEpisodeGroupKey ? 'true' : 'false'"
                                @click="selectEpisodeGroup(g.key)"
                              >
                                {{ g.label }}
                              </button>
                            </div>

                            <div
                              class="episode-group-more"
                              v-show="hiddenEpisodeGroups.length"
                              ref="episodeGroupMoreEl"
                              @mouseleave="episodeGroupMoreOpen = false"
                            >
                              <div
                                class="episode-group-more__btn"
                                role="button"
                                tabindex="0"
                                @mouseenter="onEpisodeGroupMoreEnter"
                                @click="episodeGroupMoreOpen = !episodeGroupMoreOpen"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </div>
                              <div
                                class="episode-group-more__menu"
                                :class="{ 'episode-group-more__menu--open': episodeGroupMoreOpen }"
                              >
                                <button
                                  v-for="g in episodeGroups"
                                  :key="g.key"
                                  type="button"
                                  class="episode-group-more__item"
                                  :data-active="g.key === selectedEpisodeGroupKey ? 'true' : 'false'"
                                  @click="selectEpisodeGroup(g.key); episodeGroupMoreOpen = false"
                                >
                                  {{ g.label }}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button id="episodeSortBtn" type="button" class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-gray-700 hover:text-green-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-white/20 transition-colors transform translate-y-[-4px]" aria-label="切换集数排序" @click="episodeDescending = !episodeDescending">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                          </svg>
                        </button>
                      </div>

	                      <div id="rawListView" ref="rawListViewEl" class="raw-list flex-1 overflow-y-auto content-start pb-4" v-show="rawListMode">
	                        <div v-if="introLoading || selectedPanAuxLoading" class="tv-center-loading">
	                          <div class="tv-spinner" aria-hidden="true"></div>
	                          <div class="tv-center-loading__text">加载中...</div>
	                        </div>
		                        <div v-else-if="(selectedPanAuxError || introError) && !isSmartPanActive" class="raw-list__hint raw-list__hint--error">{{ selectedPanAuxError || introError }}</div>
	                        <div v-else-if="rawListItems.length === 0" class="tv-episode-overlay">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-center-loading__text">暂无数据</div>
	                          </div>
	                        </div>
	                        <div v-else class="raw-list__items">
                          <button
                            v-for="it in rawListPagedItems"
                            :key="it.key"
                            type="button"
                            class="raw-list__row"
                            :class="{ 'raw-list__row--active': it.index === selectedEpisodeIndex }"
                            :title="it.text"
                            @click="onRawListSelectEpisode(it.index)"
                          >
                            <span class="raw-list__text">{{ it.text }}</span>
                          </button>
                        </div>
                      </div>

	                      <div
	                        id="episodeButtons"
	                        class="relative flex flex-wrap gap-3 overflow-y-auto flex-1 content-start pb-4"
	                        v-show="!rawListMode"
	                      >
	                        <div v-if="introLoading && !smartListAvailable" class="tv-episode-overlay" aria-hidden="true">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-spinner" aria-hidden="true"></div>
	                            <div class="tv-center-loading__text">加载中...</div>
	                          </div>
	                        </div>
		                        <div v-else-if="introError && !isSmartPanActive" class="tv-episode-overlay">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-center-loading__text text-red-600 dark:text-red-400">{{ introError }}</div>
	                          </div>
	                        </div>
	                        <template v-else>
	                          <template v-if="groupedDisplayedEpisodes.length">
	                            <button
	                              v-for="ep in groupedDisplayedEpisodes"
	                              :key="ep.key"
	                              type="button"
	                              class="episode-num-btn flex items-center justify-center text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap font-mono"
	                              :class="ep.index === selectedEpisodeIndex ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 dark:bg-green-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'"
	                              :title="ep.name"
	                              @click="selectEpisode(ep.index)"
	                            >
	                              {{ ep.displayNo != null ? ep.displayNo : ep.no }}
	                            </button>
	                          </template>
	                          <div v-else class="tv-episode-overlay">
	                            <div class="tv-episode-overlay__inner">
	                              <div class="tv-center-loading__text">暂无数据</div>
	                            </div>
	                          </div>
	                        </template>
	                      </div>
                    </div>

                    <!-- Sources tab -->
                    <div id="sourcesTab" class="flex flex-col flex-1 min-h-0 pt-4" v-show="activeTab === 'sources'">
                      <div ref="sourcesListEl" class="flex-1 min-h-0 overflow-y-auto space-y-2 pb-6">
                        <div
                          v-for="src in sourcesTabItems"
                          :key="src.key"
                          :ref="src.active ? setActiveSourceCardEl : null"
                          class="source-card flex items-start gap-3 px-2 py-3 rounded-lg transition-all select-none duration-200 relative"
                          :class="[src.active ? 'source-card--active' : 'source-card--idle', src.kind === 'smart' ? 'source-card--smart' : '']"
                          @click="src.active ? null : switchAggregatedSource(src)"
                        >
                          <div v-if="src.kind !== 'smart'" class="source-card__cover flex-shrink-0 w-12 h-20 rounded overflow-hidden">
                            <img
                              v-if="src.poster"
                              :src="src.poster"
                              :alt="src.title"
                              loading="lazy"
                              decoding="async"
                              referrerpolicy="no-referrer"
                              class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
                          </div>

                          <div :class="src.kind === 'smart' ? 'flex-1 min-w-0 flex flex-col gap-1.5' : 'flex-1 min-w-0 flex flex-col gap-1 h-20'">
                            <template v-if="src.kind === 'smart'">
                              <div class="flex items-center justify-between gap-3">
                                <h3 class="flex-1 min-w-0 font-semibold text-[15px] truncate text-gray-900 dark:text-gray-100 leading-tight">
                                  {{ src.qualityTitle || '未知' }}
                                </h3>
                                <span v-if="src.active" class="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-700 dark:bg-green-400/15 dark:text-green-300">
                                  当前
                                </span>
                              </div>

                              <div class="text-xs text-gray-600 dark:text-gray-300 truncate" :title="src.siteName || ''">
                                {{ src.siteName || '站点' }}
                              </div>
                            </template>
                            <template v-else>
                              <div class="flex items-start justify-between gap-3 h-6">
                                <div class="flex-1 min-w-0">
                                  <h3 class="font-medium text-base truncate text-gray-900 dark:text-gray-100 leading-none">
                                    {{ src.title || '未命名' }}
                                  </h3>
                                </div>
                                <div
                                  v-if="src.active && siteQuality"
                                  class="source-card__quality bg-gray-500/10 dark:bg-gray-400/20 text-green-600 dark:text-green-400 px-1.5 py-0 rounded text-xs flex-shrink-0 min-w-[50px] text-center"
                                >
                                  {{ siteQuality }}
                                </div>
                              </div>

                              <div v-if="src.remark" class="h-5 flex items-center">
                                <span
                                  class="inline-flex max-w-full items-center truncate bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm"
                                  :title="src.remark"
                                >
                                  {{ src.remark }}
                                </span>
                              </div>
                              <div v-else class="h-5"></div>

                              <div class="mt-auto flex items-center justify-between">
                                <span class="source-card__site text-xs px-2 py-1 border border-gray-500/60 rounded text-gray-700 dark:text-gray-200 truncate max-w-[70%]">
                                  {{ src.siteName || '站点' }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {{ src.active ? `${siteEpisodes} 集` : '—' }}
                                </span>
                              </div>
                            </template>
                          </div>
                        </div>

                        <button
                          v-if="sourcesLoading || sourcesError || canLoadMoreSources || sourcesSearchedOnce || sourcesTabItems.length <= 1"
                          type="button"
                          class="source-more-btn flex items-center justify-center gap-2"
                          :class="canLoadMoreSources ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5' : 'cursor-default'"
                          :disabled="!canLoadMoreSources"
                          @click="canLoadMoreSources ? loadMoreSources() : null"
                        >
                          <template v-if="sourcesLoading">
                            <div class="tv-spinner" aria-hidden="true"></div>
                            <span>正在加载...</span>
                          </template>
                          <template v-else-if="sourcesError">
                            <span class="text-red-600 dark:text-red-400">{{ sourcesError }}</span>
                          </template>
                          <template v-else-if="canLoadMoreSources">
                            <span>加载更多</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">剩余 {{ sourcesSearchRemainingCount }} 个站点</span>
                          </template>
                          <template v-else>
                            <span>暂无更多</span>
                          </template>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-4 sm:p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm play-detail">
                <div class="play-detail__inner">
                  <div class="play-detail__poster">
                    <div class="play-detail__posterWrap">
                      <div class="play-detail__posterSkeleton" aria-hidden="true"></div>
                      <img
                        v-if="displayPoster"
                        :src="displayPoster"
                        :alt="displayTitle"
                        loading="lazy"
                        decoding="async"
                        referrerpolicy="no-referrer"
                        class="play-detail__posterImg"
                      />
                      <div v-else class="play-detail__posterFallback">
                        暂无封面
                      </div>
                    </div>
                  </div>

                    <div class="play-detail__info">
                      <div class="play-detail__titleRow">
                      <h1 class="play-detail__title">
                        <span class="block truncate">{{ displayTitle || '未命名' }}</span>
                      </h1>
                      <button
                        type="button"
                        class="play-detail__favBtn"
                        :class="isFavorited ? 'is-active' : ''"
                        :disabled="favoriteLoading || !canFavorite"
                        aria-label="收藏/取消收藏"
                        @click="toggleFavorite"
                      >
                        <svg
                          v-if="isFavorited"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-4 h-4 text-pink-500 dark:text-pink-400"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-1.344-.728 25.18 25.18 0 0 1-3.67-3.295 24.257 24.257 0 0 1-3.168-4.269c-.63-1.001-.839-2.145-.73-3.253.108-1.108.532-2.166 1.235-3.048a4.793 4.793 0 0 1 3.462-1.795c1.567-.08 3.113.582 4.084 1.816.97-1.234 2.517-1.896 4.084-1.816a4.793 4.793 0 0 1 3.462 1.795c.703.882 1.127 1.94 1.235 3.048.109 1.108-.1 2.252-.73 3.253a24.257 24.257 0 0 1-3.168 4.269 25.18 25.18 0 0 1-3.67 3.295 15.247 15.247 0 0 1-1.344.728l-.022.012-.007.003a.752.752 0 0 1-.704 0Z"
                          />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-4 h-4 text-slate-400 dark:text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div v-if="metaPills.length" class="play-detail__meta">
                      <span v-for="p in metaPills" :key="p" class="play-pill">{{ p }}</span>
                    </div>

	                    <div class="play-detail__desc" style="white-space: pre-line;">
		                      <template v-if="introLoading">简介加载中...</template>
		                      <template v-else-if="!introText && introError && !isSmartPanActive">{{ introError }}</template>
		                      <template v-else>{{ introText || '暂无简介' }}</template>
		                    </div>

		                    <pre v-if="debugEnabled" class="play-detail__debug">{{ playDebugText }}</pre>
		                  </div>
		                </div>
	              </div>
            </div>
          </div>
        </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, onBeforeUpdate, ref, watch } from 'vue';
import { initPlayPage } from './playClient.js';
	import ArtPlayer from '../../shared/ArtPlayer.vue';
import { grantCatLowPrioritySearchTickets, normalizeCatPawOpenApiBase, pauseCatLowPriority, requestCatPlay, requestCatSpider } from '../../shared/catpawopen';
import { apiGetJson, apiPostJson, buildQuery } from '../../shared/apiClient';
import { fetchBootstrap } from '../../shared/bootstrap';
import { processPosterUrl } from '../../shared/posterCard';

const props = defineProps({
  bootstrap: { type: Object, required: true },
  videoTitle: { type: String, default: '' },
  videoYear: { type: String, default: '' },
  searchType: { type: String, default: '' },
  siteKey: { type: String, default: '' },
  spiderApi: { type: String, default: '' },
  videoId: { type: String, default: '' },
  videoIntro: { type: String, default: '' },
  videoPoster: { type: String, default: '' },
  videoRemark: { type: String, default: '' },
  videoPanDir: { type: String, default: '' },
  contentKey: { type: String, default: '' },
  tmdbId: { type: Number, default: 0 },
	tmdbType: { type: String, default: '' },
});

const artPlayerRef = ref(null);

const playBootstrapSettings = ref(null);
const effectiveBootstrapSettings = computed(() => {
  const base = props && props.bootstrap && typeof props.bootstrap.settings === 'object' && props.bootstrap.settings ? props.bootstrap.settings : {};
  const extra = playBootstrapSettings.value && typeof playBootstrapSettings.value === 'object' ? playBootstrapSettings.value : {};
  return Object.assign({}, base, extra);
});

const ensurePlaySettingsLoaded = async () => {
  // Index bootstrap is intentionally light; fetch the play-specific settings only when needed.
  if (playBootstrapSettings.value) return;
  const base = props && props.bootstrap && typeof props.bootstrap.settings === 'object' && props.bootstrap.settings ? props.bootstrap.settings : {};
  const needs =
    !Array.isArray(base.goProxyServers) ||
    !Array.isArray(base.magicEpisodeRules) ||
    !Array.isArray(base.magicEpisodeCleanRegexRules) ||
    !Array.isArray(base.magicMovieRules) ||
    !Array.isArray(base.smartSourcePriorityTokens) ||
    !Array.isArray(base.smartPanMatchTokens);
  if (!needs) return;
  try {
    const b = await fetchBootstrap('play');
    if (b && b.authenticated && b.settings && typeof b.settings === 'object') {
      playBootstrapSettings.value = b.settings;
    }
  } catch (_e) {}
};

const debugEnabled = computed(() => {
  try {
    if (typeof window === 'undefined') return false;
    const sp = new URLSearchParams(window.location.search || '');
    return sp.get('debug') === '1';
  } catch (_e) {
    return false;
  }
});

const playerStatsSiteName = ref('');
const playerStatsPanName = ref('');
const playerStatsRawFileName = ref('');
const playerStatsExtra = computed(() => {
  return {
    displayName: displayTitle.value || '',
    siteName: playerStatsSiteName.value || '',
    panName: playerStatsPanName.value || '',
    rawFileName: playerStatsRawFileName.value || '',
  };
});

const playerToastText = ref('');
let playerToastTimer = 0;
const showPlayerToast = (msg) => {
  try {
    const text = typeof msg === 'string' ? msg.trim() : String(msg || '').trim();
	    if (!text) return;
	    if (playerToastTimer) window.clearTimeout(playerToastTimer);
	    playerToastTimer = 0;
	    playerToastText.value = '';
	    window.setTimeout(() => {
	      playerToastText.value = text;
	    }, 0);
    playerToastTimer = window.setTimeout(() => {
      playerToastTimer = 0;
      playerToastText.value = '';
    }, 2600);
  } catch (_e) {}
};

onMounted(() => {
  void ensurePlaySettingsLoaded();
});

const THIRD_PARTY_PLAYERS = [
  { icon: 'iina', name: 'IINA', scheme: 'iina://weblink?url=$edurl', platforms: ['MacOS'] },
  { icon: 'potplayer', name: 'PotPlayer', scheme: 'potplayer://$durl', platforms: ['Windows'] },
  { icon: 'vlc', name: 'VLC', scheme: 'vlc://$durl', platforms: ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'] },
  { icon: 'nplayer', name: 'nPlayer', scheme: 'nplayer-$durl', platforms: ['Android', 'iOS'] },
  { icon: 'omniplayer', name: 'OmniPlayer', scheme: 'omniplayer://weblink?url=$edurl', platforms: ['MacOS'] },
  { icon: 'figplayer', name: 'Fig Player', scheme: 'figplayer://weblink?url=$edurl', platforms: ['MacOS'] },
  { icon: 'infuse', name: 'Infuse', scheme: 'infuse://x-callback-url/play?url=$edurl', platforms: ['MacOS', 'iOS'] },
  { icon: 'fileball', name: 'Fileball', scheme: 'filebox://play?url=$edurl', platforms: ['MacOS', 'iOS'] },
  {
    icon: 'mxplayer',
    name: 'MX Player',
    scheme: 'intent:$durl#Intent;package=com.mxtech.videoplayer.ad;S.title=$name;end',
    platforms: ['Android'],
  },
  {
    icon: 'mxplayer-pro',
    name: 'MX Player Pro',
    scheme: 'intent:$durl#Intent;package=com.mxtech.videoplayer.pro;S.title=$name;end',
    platforms: ['Android'],
  },
  { icon: 'iPlay', name: 'iPlay', scheme: 'iplay://play/any?type=url&url=$bdurl', platforms: ['iOS'] },
  { icon: 'mpv', name: 'mpv', scheme: 'mpv://$edurl', platforms: ['Windows', 'MacOS', 'Linux', 'Android'] },
];

const THIRD_PARTY_EXPANDED_KEY = 'tv:play:third_party_players:expanded';
const thirdPartyExpanded = ref(false);
try {
  thirdPartyExpanded.value = localStorage.getItem(THIRD_PARTY_EXPANDED_KEY) === 'true';
} catch (_e) {}

const thirdPartyIsMobile = ref(false);
const updateThirdPartyIsMobile = () => {
  try {
    if (typeof window === 'undefined') return;
    thirdPartyIsMobile.value = window.innerWidth < 768;
  } catch (_e) {
    thirdPartyIsMobile.value = false;
  }
};
updateThirdPartyIsMobile();

const getPlatform = () => {
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'Unknown';
    const ua = navigator.userAgent ? String(navigator.userAgent) : '';
    const touch =
      (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) ||
      'ontouchstart' in window;
    const isIos = /iPad|iPhone|iPod/i.test(ua) || (!!touch && /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1);
    if (isIos) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'MacOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown';
  } catch (_e) {
    return 'Unknown';
  }
};

const thirdPartyCollapsedPlayers = computed(() => {
  if (thirdPartyIsMobile.value) {
    const wanted = ['mxplayer', 'infuse', 'nplayer'];
    const byIcon = new Map(THIRD_PARTY_PLAYERS.map((p) => [p.icon, p]));
    const out = [];
    const seen = new Set();
    for (const icon of wanted) {
      const p = byIcon.get(icon);
      if (!p) continue;
      if (seen.has(p.icon)) continue;
      seen.add(p.icon);
      out.push(p);
    }
    if (out.length >= 3) return out.slice(0, 3);
    // Fill to 3 (best-effort) to keep the bar consistent even if the list changes.
    const platform = getPlatform();
    const platformPlayers = platform === 'Unknown' ? THIRD_PARTY_PLAYERS : THIRD_PARTY_PLAYERS.filter((p) => p.platforms.includes(platform));
    for (const p of platformPlayers) {
      if (out.length >= 3) break;
      if (seen.has(p.icon)) continue;
      seen.add(p.icon);
      out.push(p);
    }
    return out.slice(0, 3);
  }

  const platform = getPlatform();
  const platformPlayers =
    platform === 'Unknown' ? THIRD_PARTY_PLAYERS : THIRD_PARTY_PLAYERS.filter((p) => p.platforms.includes(platform));
  return platformPlayers.slice(0, 3);
});

const thirdPartyVisiblePlayers = computed(() => {
  return thirdPartyExpanded.value ? THIRD_PARTY_PLAYERS : thirdPartyCollapsedPlayers.value;
});

const toggleThirdPartyExpanded = () => {
  thirdPartyExpanded.value = !thirdPartyExpanded.value;
  try {
    localStorage.setItem(THIRD_PARTY_EXPANDED_KEY, thirdPartyExpanded.value.toString());
  } catch (_e) {}
};

onMounted(() => {
  try {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', updateThirdPartyIsMobile, { passive: true });
  } catch (_e) {}
});

onBeforeUnmount(() => {
  try {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', updateThirdPartyIsMobile);
  } catch (_e) {}
});

const convertThirdPartyUrl = (scheme, args) => {
  let ans = String(scheme || '');
  ans = ans.replace('$name', args.name || '');
  ans = ans.replace(/\$[eb_]*url/g, (old) => {
    const op = old.match(/[eb]/g);
    let u = String(args.raw_url || '');
    if (op) {
      for (const o of op.reverse()) {
        if (o === 'e') u = encodeURIComponent(u);
        else if (o === 'b') u = window.btoa(u);
      }
    }
    return u;
  });
  ans = ans.replace(/\$[eb_]*durl/g, (old) => {
    const op = old.match(/[eb]/g);
    let u = String(args.d_url || '');
    if (op) {
      for (const o of op.reverse()) {
        if (o === 'e') u = encodeURIComponent(u);
        else if (o === 'b') u = window.btoa(u);
      }
    }
    return u;
  });
  return ans;
};

const openWithThirdPartyPlayer = (player) => {
  try {
    const p = player && typeof player === 'object' ? player : null;
    if (!p || !p.scheme) return;
    let durl = playerUrl && playerUrl.value ? String(playerUrl.value || '').trim() : '';
    if (!durl) return;

    const name = (displayTitle && displayTitle.value ? String(displayTitle.value) : props.videoTitle) || '';
    const href = convertThirdPartyUrl(p.scheme, { raw_url: '', name, d_url: durl });

    try {
      if (artPlayerRef.value && typeof artPlayerRef.value.pause === 'function') artPlayerRef.value.pause();
    } catch (_e) {}

    window.setTimeout(() => {
      try {
        window.location.href = href;
      } catch (_e) {
        try {
          window.open(href, '_self');
        } catch (_e2) {}
      }
    }, 0);
  } catch (_e) {}
};

const AGG_STORAGE_KEY = 'tv:search:aggregate:sources:v3';
const aggregatedSources = ref([]);
const aggregatedFromStorage = ref(false);

const normalizeForAggKey = (s) =>
  String(s || '')
    .toLowerCase()
    // Keep only letters/numbers/CJK to avoid source-specific punctuation/emoji breaking identity checks.
    .replace(/[^0-9a-z\u4e00-\u9fa5]+/gi, '')
    .trim();

const applyAggregateCleanRules = (title) => {
  const raw = typeof title === 'string' ? title : String(title || '');
  if (!raw) return '';
  const rules = compiledMagicAggregateRegexRules.value;
  let out = raw;
  if (Array.isArray(rules) && rules.length) {
    rules.forEach((re) => {
      if (!re) return;
      try {
        if (re.global || re.sticky) re.lastIndex = 0;
      } catch (_e) {}
      try {
        out = out.replace(re, '');
      } catch (_e) {}
    });
  }
  return String(out || '').trim();
};

const topLeftTitle = computed(() => {
  const base = (displayTitle.value || props.videoTitle || '').trim();
  const cleaned = applyAggregateCleanRules(base);
  return cleaned || base || '未命名';
});

const getStableContentKey = () => {
  const fromProps = normalizeForAggKey(props.contentKey || '');
  if (fromProps) return fromProps;
  const fromHistory = normalizeForAggKey(resumeHistory.value && resumeHistory.value.contentKey ? resumeHistory.value.contentKey : '');
  if (fromHistory) return fromHistory;
  const base = computeHistoryContentKey(props.videoTitle || '');
  if (base) return base;
  return normalizeForAggKey(props.videoTitle || '');
};

const getSourcesSearchQuery = () => {
  const cleaned = applyAggregateCleanRules(props.videoTitle || '');
  if (cleaned) return cleaned;
  const fromHistory = resumeHistory.value && typeof resumeHistory.value.contentKey === 'string' ? resumeHistory.value.contentKey.trim() : '';
  if (fromHistory) return fromHistory;
  const fromProps = typeof props.contentKey === 'string' ? props.contentKey.trim() : '';
  if (fromProps) return fromProps;
  return (props.videoTitle || '').trim();
};

const loadAggregatedSourcesFromStorage = () => {
  const titleKey = getStableContentKey();
  if (!titleKey) {
    aggregatedSources.value = [];
    aggregatedFromStorage.value = false;
    return;
  }
  try {
    const raw = sessionStorage.getItem(AGG_STORAGE_KEY);
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.version === 4 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : null;
    const group = groups && groups[titleKey] && typeof groups[titleKey] === 'object' ? groups[titleKey] : null;
    if (!group) {
      aggregatedSources.value = [];
      aggregatedFromStorage.value = false;
      return;
    }
    const sources = Array.isArray(group.sources) ? group.sources : [];
    const uniq = new Set();
    aggregatedSources.value = sources
      .map((s) => ({
        siteKey: s && s.siteKey ? String(s.siteKey) : '',
        spiderApi: s && s.spiderApi ? String(s.spiderApi) : '',
        siteName: s && s.siteName ? String(s.siteName) : '',
        videoId: s && s.videoId ? String(s.videoId) : '',
        videoTitle: s && s.videoTitle ? String(s.videoTitle) : '',
        videoPoster: s && s.videoPoster ? String(s.videoPoster) : '',
        videoRemark: s && s.videoRemark ? String(s.videoRemark) : '',
        __noNoiseMatch: !!(s && s.__noNoiseMatch),
        __score: Number(s && s.__score) || 0,
        __seq: Number(s && s.__seq) || 0,
        seasonHint: Number(s && s.seasonHint) || 0,
        __seasonTitleMatch: Number(s && s.__seasonTitleMatch) || 0,
      }))
      .filter((s) => {
        if (!s.siteKey || !s.spiderApi || !s.videoId) return false;
        const k = `${s.siteKey}::${s.videoId}`;
        if (uniq.has(k)) return false;
        uniq.add(k);
        return true;
      });
    aggregatedFromStorage.value = aggregatedSources.value.length > 0;
  } catch (_e) {
    aggregatedSources.value = [];
    aggregatedFromStorage.value = false;
  }
};

const sourcesLoading = ref(false);
const sourcesError = ref('');
const sourcesSearchedOnce = ref(false);
const sourcesSearchRemainingCount = ref(0);
const sourcesSearchState = { seq: 0 };
const sourcesSearchDone = ref(false);
const sourcesSearchRuntime = {
  key: '',
  queue: [],
  outUniq: new Set(),
  insertSeq: 0,
};

const lowPriorityHoldRelease = ref(null);
const takeoverLowPriorityPause = () => {
  try {
    const prev = typeof window !== 'undefined' ? window.__tvLowPriorityPauseRelease : null;
    if (typeof prev === 'function') {
      try {
        window.__tvLowPriorityPauseRelease = null;
      } catch (_e) {}
      try {
        prev();
      } catch (_e2) {}
    }
  } catch (_e) {}

  if (lowPriorityHoldRelease.value) return;
  lowPriorityHoldRelease.value = pauseCatLowPriority();
};

const releaseLowPriorityHold = () => {
  const rel = lowPriorityHoldRelease.value;
  if (typeof rel !== 'function') return;
  lowPriorityHoldRelease.value = null;
  try {
    rel();
  } catch (_e) {}
};

const consumeClickPauseIfAny = (opts = {}) => {
  const takeover = !!(opts && typeof opts === 'object' && opts.takeover);
  try {
    if (typeof window === 'undefined') return;
    const clickRelease = window.__tvLowPriorityPauseRelease;
    if (typeof clickRelease !== 'function') return;
    if (takeover) takeoverLowPriorityPause();
    window.__tvLowPriorityPauseRelease = null;
    clickRelease();
  } catch (_e) {}
};

const invalidateSourcesSearch = () => {
  sourcesSearchState.seq += 1;
  sourcesLoading.value = false;
  sourcesSearchDone.value = false;
  sourcesSearchRemainingCount.value = 0;
  sourcesSearchRuntime.key = '';
  sourcesSearchRuntime.queue = [];
  sourcesSearchRuntime.outUniq = new Set();
  sourcesSearchRuntime.insertSeq = 0;
};

const fetchUserSitesCached = async (ttlMs = 15 * 1000) => {
  const data = await apiGetJson('/api/user/sites', { cacheMs: ttlMs });
  return data && typeof data === 'object' ? data : {};
};

const resolveCatApiBaseForPlay = () => {
  const s = effectiveBootstrapSettings.value || {};
  const serverBase = s.catPawOpenApiBase || '';
  return String(serverBase || '').trim();
};

const isConfigCenterSite = (s) => {
  const api = s && typeof s.api === 'string' ? s.api : '';
  const key = s && typeof s.key === 'string' ? s.key : '';
  return api.includes('/spider/baseset/') || key.toLowerCase().includes('baseset');
};

const normalizeSearchList = (data) => {
  const list = data && Array.isArray(data.list) ? data.list : [];
  return list
    .map((it) => ({
      id: it && (it.vod_id != null ? String(it.vod_id) : it.id != null ? String(it.id) : ''),
      name: it && (it.vod_name != null ? String(it.vod_name) : it.name != null ? String(it.name) : ''),
      pic: it && (it.vod_pic != null ? String(it.vod_pic) : it.pic != null ? String(it.pic) : ''),
      remark:
        it && (it.vod_remarks != null ? String(it.vod_remarks) : it.remark != null ? String(it.remark) : ''),
    }))
    .filter((it) => it && it.name);
};

const fetchAggregatedSourcesExactMatches = async (opts = {}) => {
  if (sourcesLoading.value) return;
  const appendMode = !!(opts && typeof opts === 'object' && opts.append === true);
  const qRaw = getSourcesSearchQuery();
  const qKey = getStableContentKey();
  if (!qRaw || !qKey) return;

  const stripSeasonMarkers = (s) => {
    const raw = typeof s === 'string' ? s : String(s || '');
    return raw
      .replace(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/gi, '')
      .replace(/\bseason\s*\d{1,3}\b/gi, '')
      .replace(/\bS\d{1,2}\b/gi, '')
      .trim();
  };
  const qKeyLoose = normalizeForAggKey(stripSeasonMarkers(qRaw));

  const normalizeForMatch = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '')
      .trim();
  const qNorm = normalizeForMatch(qRaw);
  const computeMatchScore = (title) => {
    const name = normalizeForMatch(title);
    if (!qNorm || !name) return 0;
    if (name === qNorm) return 1000;
    if (name.startsWith(qNorm)) return 900;
    const idx = name.indexOf(qNorm);
    if (idx >= 0) {
      const posBoost = 60 - Math.min(60, idx);
      const lenBoost = 40 - Math.min(40, Math.max(0, name.length - qNorm.length));
      return 800 + posBoost + lenBoost;
    }
    const tokens = String(qRaw || '')
      .toLowerCase()
      .split(/\s+/g)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length >= 2) {
      let hit = 0;
      tokens.forEach((t) => {
        if (t && name.includes(t)) hit += 1;
      });
      if (hit) return 600 + hit * 20;
    }
    return 0;
  };

  const siteOrderMap = (() => {
    const s = effectiveBootstrapSettings.value || {};
    const homeSites = Array.isArray(s.homeSites) ? s.homeSites : [];
    const homeOrder = homeSites
      .map((s) => (s && typeof s.key === 'string' ? s.key.trim() : ''))
      .filter((k) => k);
    const fallbackOrder = Array.isArray(s.searchSiteOrder) ? s.searchSiteOrder : [];
    const order = homeOrder.length ? homeOrder : fallbackOrder;
    const orderMap = new Map();
    order.forEach((k, idx) => {
      const kk = typeof k === 'string' ? k.trim() : '';
      if (kk && !orderMap.has(kk)) orderMap.set(kk, idx);
    });
    return orderMap;
  })();

  const compareAgg = (a, b) => {
    const an = a && a.__noNoiseMatch ? 1 : 0;
    const bn = b && b.__noNoiseMatch ? 1 : 0;
    if (an !== bn) return bn - an;
    const ase = Number(a && a.__seasonTitleMatch) || 0;
    const bse = Number(b && b.__seasonTitleMatch) || 0;
    if (ase !== bse) return bse - ase;
    const as = Number(a && a.__score) || 0;
    const bs = Number(b && b.__score) || 0;
    if (as !== bs) return bs - as;
    const ak = a && a.siteKey ? String(a.siteKey) : '';
    const bk = b && b.siteKey ? String(b.siteKey) : '';
    const ao = siteOrderMap.has(ak) ? siteOrderMap.get(ak) : 999999;
    const bo = siteOrderMap.has(bk) ? siteOrderMap.get(bk) : 999999;
    if (ao !== bo) return ao - bo;
    const aq = Number(a && a.__seq) || 0;
    const bq = Number(b && b.__seq) || 0;
    return aq - bq;
  };

  const insertAggSorted = (entry) => {
    const list = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
	    if (!list.length) {
	      aggregatedSources.value = [entry];
	      return;
	    }
	    let lo = 0;
	    let hi = list.length;
	    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (compareAgg(entry, list[mid]) < 0) hi = mid;
      else lo = mid + 1;
    }
    list.splice(lo, 0, entry);
    aggregatedSources.value = list;
  };

  const pendingAppend = [];
  const insertAgg = appendMode
    ? (entry) => {
        pendingAppend.push(entry);
      }
    : insertAggSorted;

  sourcesSearchState.seq += 1;
  const seqAtCall = sourcesSearchState.seq;

  sourcesLoading.value = true;
  sourcesError.value = '';
  const runtimeKey = `${qKey}::${qRaw}`;
  const isNew = sourcesSearchRuntime.key !== runtimeKey;
  if (isNew) {
    sourcesSearchRuntime.key = runtimeKey;
    sourcesSearchRuntime.queue = [];
    sourcesSearchRuntime.outUniq = new Set();
    sourcesSearchRuntime.insertSeq = 0;
    aggregatedSources.value = [];
    sourcesSearchDone.value = false;
    sourcesSearchRemainingCount.value = 0;
  }
  const wantedSeason = (() => {
    try {
      const eps = selectedEpisodes.value;
      const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
      const idx = idxRaw >= 0 ? idxRaw : 0;
      const ep = Array.isArray(eps) && eps.length ? eps[idx] : null;
      const s = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
      return s > 0 ? s : 0;
    } catch (_e) {
      return 0;
    }
  })();
  const extractSeasonHintFromText = (text) => {
    const s = typeof text === 'string' ? text.trim() : '';
    if (!s) return 0;
    const mSe = s.match(/S(\d{1,2})\s*E\d{1,5}/i);
    if (mSe && mSe[1]) {
      const n = Number.parseInt(String(mSe[1]), 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    const mSeason = s.match(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/i);
    if (mSeason && mSeason[1]) {
      const raw = String(mSeason[1]);
      const digits = raw.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
      const n = /^\d+$/.test(digits) ? Number.parseInt(digits, 10) : parseChineseNumeralToInt(raw);
      if (Number.isFinite(n) && n > 0) return Math.floor(n);
    }
    return 0;
  };
  const yieldToUi = () =>
    new Promise((resolve) => {
      try {
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => resolve());
          return;
        }
      } catch (_e) {}
      setTimeout(resolve, 0);
    });
  try {
    const data = await fetchUserSitesCached();
    if (seqAtCall !== sourcesSearchState.seq) return;
    const sites = Array.isArray(data && data.sites) ? data.sites : [];
    const enabledSites = sites.filter((s) => s && s.enabled !== false && s.search !== false && s.api && !isConfigCenterSite(s));

    const apiBase = resolveCatApiBaseForPlay();
    const tvUser = props.bootstrap?.user?.username || '';
    if (!apiBase) throw new Error('CatPawOpen 接口地址未设置');

    const concurrencyRaw = effectiveBootstrapSettings.value.searchThreadCount;
    const concurrencyNum = Number(concurrencyRaw);
    const concurrency =
      Number.isFinite(concurrencyNum) && concurrencyNum > 0 ? Math.min(50, Math.floor(concurrencyNum)) : 5;

    if (isNew || !sourcesSearchRuntime.queue.length) sourcesSearchRuntime.queue = enabledSites.slice();
    const batch = sourcesSearchRuntime.queue.splice(0, Math.max(1, concurrency));
    sourcesSearchRemainingCount.value = sourcesSearchRuntime.queue.length;
    if (!batch.length) {
      sourcesSearchDone.value = true;
      sourcesSearchedOnce.value = true;
      sourcesSearchRemainingCount.value = 0;
      return;
    }

    if (lowPriorityHoldRelease.value) grantCatLowPrioritySearchTickets(batch.length);

    const runOne = async (site) => {
      if (seqAtCall !== sourcesSearchState.seq) return;
      if (!site) return;
      try {
        const raw = await requestCatSpider({
          apiBase,
          username: tvUser,
          action: 'search',
          spiderApi: site.api,
          payload: { wd: qRaw, page: 1 },
        });
        if (seqAtCall !== sourcesSearchState.seq) return;
        const items = normalizeSearchList(raw);
        let pushed = false;
        items.forEach((it) => {
          if (seqAtCall !== sourcesSearchState.seq) return;
          const rawTitle = it && it.name ? String(it.name) : '';
          const cleanedTitle = applyAggregateCleanRules(rawTitle || '') || rawTitle;
          const key = normalizeForAggKey(cleanedTitle);
          const looseKey = normalizeForAggKey(stripSeasonMarkers(cleanedTitle));
          const okKey = (key && key === qKey) || (qKeyLoose && looseKey && looseKey === qKeyLoose);
          if (!okKey) return;
          const noNoiseExact = normalizeForAggKey(rawTitle) === qKey;
          const noNoiseLoose = qKeyLoose && normalizeForAggKey(stripSeasonMarkers(rawTitle)) === qKeyLoose;
          const noNoiseMatch = !!(noNoiseExact || noNoiseLoose);
          const score = computeMatchScore(rawTitle);
          const seasonHint = extractSeasonHintFromText(rawTitle) || extractSeasonHintFromText(it && it.remark ? String(it.remark) : '') || 0;
          const seasonTitleMatch = wantedSeason > 0 && seasonHint === wantedSeason ? 1 : 0;
          const siteKey = site && site.key ? String(site.key) : '';
          const spiderApi = site && site.api ? String(site.api) : '';
          const videoId = it && it.id ? String(it.id) : '';
          if (!siteKey || !spiderApi || !videoId) return;
          const uniq = `${siteKey}::${videoId}`;
          if (sourcesSearchRuntime.outUniq.has(uniq)) return;
          sourcesSearchRuntime.outUniq.add(uniq);
          const entry = {
            siteKey,
            spiderApi,
            siteName: site && site.name ? String(site.name) : siteKey,
            videoId,
            videoTitle: rawTitle,
            videoPoster: it && it.pic ? String(it.pic) : '',
            videoRemark: it && it.remark ? String(it.remark) : '',
            __noNoiseMatch: !!noNoiseMatch,
            __score: Number.isFinite(Number(score)) ? Number(score) : 0,
            __seq: (sourcesSearchRuntime.insertSeq += 1),
            seasonHint,
            __seasonTitleMatch: seasonTitleMatch,
          };
          insertAgg(entry);
          pushed = true;
        });
        if (pushed && seqAtCall === sourcesSearchState.seq) await yieldToUi();
	      } catch (_e) {
	      }
	    };

    await Promise.allSettled(batch.map(runOne));
    if (seqAtCall !== sourcesSearchState.seq) return;
    sourcesSearchedOnce.value = true;
    sourcesSearchDone.value = sourcesSearchRuntime.queue.length === 0;
    sourcesSearchRemainingCount.value = sourcesSearchRuntime.queue.length;

    if (appendMode && pendingAppend.length) {
      const current = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
      const sorted = pendingAppend
        .slice()
        .sort((a, b) => {
          const ak = a && a.siteKey ? String(a.siteKey) : '';
          const bk = b && b.siteKey ? String(b.siteKey) : '';
          const ao = siteOrderMap.has(ak) ? siteOrderMap.get(ak) : 999999;
          const bo = siteOrderMap.has(bk) ? siteOrderMap.get(bk) : 999999;
          if (ao !== bo) return ao - bo;
          const aq = Number(a && a.__seq) || 0;
          const bq = Number(b && b.__seq) || 0;
          return aq - bq;
        });
      aggregatedSources.value = current.concat(sorted);
    }

    try {
      const prevRaw = sessionStorage.getItem(AGG_STORAGE_KEY) || '';
      const prev = prevRaw && prevRaw.trim() ? JSON.parse(prevRaw) : null;
      const groups =
        prev && prev.version === 4 && prev.groups && typeof prev.groups === 'object'
          ? { ...prev.groups }
          : {};
      groups[qKey] = { sources: aggregatedSources.value, updatedAt: Date.now(), q: qRaw };
      sessionStorage.setItem(AGG_STORAGE_KEY, JSON.stringify({ version: 4, q: qRaw, groups, lastKey: qKey }));
    } catch (_e) {}
  } catch (e) {
    if (seqAtCall === sourcesSearchState.seq) {
      sourcesError.value = e && e.message ? String(e.message) : '换源搜索失败';
    }
  } finally {
    if (seqAtCall === sourcesSearchState.seq) sourcesLoading.value = false;
  }
};

const exitPlay = () => {
  try {
    // Stop playback immediately (avoid continuing audio in background).
    if (artPlayerRef.value && typeof artPlayerRef.value.destroy === 'function') {
      artPlayerRef.value.destroy();
    }
    playerUrl.value = '';
    playerHeaders.value = {};
    playerMetaReady.value = false;
    playerBuffering.value = false;
    playerPlaybackStarted.value = false;
    playerFirstFrameReady.value = false;
    if (playerFirstFrameTimer) {
      window.clearTimeout(playerFirstFrameTimer);
      playerFirstFrameTimer = 0;
    }
    window.dispatchEvent(new CustomEvent('tv:exit-play'));
  } catch (_e) {}
};

const resetForNewVideo = () => {
  try {
    if (artPlayerRef.value && typeof artPlayerRef.value.destroy === 'function') {
      artPlayerRef.value.destroy();
    }
  } catch (_e) {}
  playerUrl.value = '';
  playerHeaders.value = {};
  playerMetaReady.value = false;
  playerBuffering.value = false;
  playerPlaybackStarted.value = false;
  playerFirstFrameReady.value = false;
  if (playerFirstFrameTimer) {
    window.clearTimeout(playerFirstFrameTimer);
    playerFirstFrameTimer = 0;
  }
  playLoading.value = false;
  playError.value = '';
  playerRuntimeError.value = '';
  playingPanKey.value = '';
  playingEpisodeIndex.value = -1;
  playingTMDBSubPanKey.value = '';
  selectedPan.value = '';
  panDropdownOpen.value = false;
  selectedEpisodeIndex.value = 0;
  selectedEpisodeGroup.value = '';
  selectedSeason.value = 0;
  episodeGroupMoreOpen.value = false;
  historyCoverPoster.value = '';
  historyCoverLocked.value = false;
  lastHistoryPayload.value = null;
  introError.value = '';
  introLoading.value = false;
  introText.value = (props.videoIntro || '').trim();
  autoPickedEpisodeFromVideoId.value = false;
  detail.value = {
    title: '',
    poster: '',
    year: '',
    type: '',
    remark: '',
    content: '',
    playFrom: '',
    playUrl: '',
  };
};

const resetForNewSource = () => {
  try {
    if (artPlayerRef.value && typeof artPlayerRef.value.destroy === 'function') {
      artPlayerRef.value.destroy();
    }
  } catch (_e) {}
  playerUrl.value = '';
  playerHeaders.value = {};
  playerMetaReady.value = false;
  playerBuffering.value = false;
  playerPlaybackStarted.value = false;
  playerFirstFrameReady.value = false;
  if (playerFirstFrameTimer) {
    window.clearTimeout(playerFirstFrameTimer);
    playerFirstFrameTimer = 0;
  }
  playLoading.value = false;
  playError.value = '';
  playerRuntimeError.value = '';
  playingPanKey.value = '';
  playingEpisodeIndex.value = -1;
  playingTMDBSubPanKey.value = '';
  selectedPan.value = '';
  panDropdownOpen.value = false;
  selectedEpisodeGroup.value = '';
  selectedSeason.value = 0;
  episodeGroupMoreOpen.value = false;
  introLoading.value = false;
  introError.value = '';
  autoPickedEpisodeFromVideoId.value = false;
  // Keep intro/meta, but refresh episode list from the new source.
  detail.value = {
    ...detail.value,
    playFrom: '',
    playUrl: '',
  };
};

const cleanupFns = [];

const isIos = ref(false);
onMounted(() => {
  try {
    const ua = typeof navigator !== 'undefined' && navigator.userAgent ? String(navigator.userAgent) : '';
    const touch =
      (typeof navigator !== 'undefined' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) ||
      (typeof window !== 'undefined' && 'ontouchstart' in window);
    const ios = /iPad|iPhone|iPod/i.test(ua) || (!!touch && /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1);
    isIos.value = !!ios;
  } catch (_e) {
    isIos.value = false;
  }
});

const introLoading = ref(false);
const introError = ref('');
const introText = ref((props.videoIntro || '').trim());
const rawListMode = ref(false);
const autoRawListMode = ref(false);
const viewModeTouchedKey = ref('');
const activeTab = ref('episodes');
const episodeDescending = ref(false);
const sourcesListEl = ref(null);
const activeSourceCardEl = ref(null);
const rawListViewEl = ref(null);
const RAW_LIST_PAGE_SIZE = 20;
const rawListPage = ref(0);
const setActiveSourceCardEl = (el) => {
  if (el) activeSourceCardEl.value = el;
};

const scrollSourcesToActive = async (opts = {}) => {
  const { behavior = 'auto' } = opts && typeof opts === 'object' ? opts : {};
  await nextTick();
  const container = sourcesListEl.value;
  const el = activeSourceCardEl.value;
  if (!container || !el) return;
  try {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const fullyVisible = eRect.top >= cRect.top && eRect.bottom <= cRect.bottom;
    if (fullyVisible) return;

    const targetTop =
      container.scrollTop + (eRect.top - cRect.top) - (container.clientHeight / 2 - el.clientHeight / 2);
    const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
    const top = Math.max(0, Math.min(maxTop, Math.round(targetTop)));
    if (Math.abs(container.scrollTop - top) <= 2) return;
    if (typeof container.scrollTo === 'function') container.scrollTo({ top, behavior });
    else container.scrollTop = top;
  } catch (_e) {}
};

onBeforeUpdate(() => {
  activeSourceCardEl.value = null;
});
const selectedEpisodeIndex = ref(0);
const autoPickedEpisodeFromVideoId = ref(false);
const playLoading = ref(false);
const playError = ref('');
const playerRuntimeError = ref('');
const favoriteLoading = ref(false);
const isFavorited = ref(false);
const playerUrl = ref('');
const playerHeaders = ref({});
const playerMetaReady = ref(false);
const playerBuffering = ref(false);
const playerPlaybackStarted = ref(false);
const playerFirstFrameReady = ref(false);
let playerFirstFrameTimer = 0;
const playingPanKey = ref('');
const playingEpisodeIndex = ref(-1);
const playingTMDBSubPanKey = ref('');
const initialAutoPlayTriggered = ref(false);
const selectedPan = ref('');
const panDropdownOpen = ref(false);
const panDropdownEl = ref(null);
const tmdbPanDropdownOpen = ref(false);
const tmdbPanDropdownEl = ref(null);
const tmdbSelectedSitePanKey = ref('');
const resumeHistory = ref(null);
const resumeHistoryLoaded = ref(false);
const resumeHistoryApplied = ref(false);
const panPrefApplied = ref(false);
const resumeHistoryState = { seq: 0, key: '', inFlight: null };
const detail = ref({
  title: '',
  poster: '',
  year: '',
  type: '',
  remark: '',
  content: '',
  playFrom: '',
  playUrl: '',
});

// pan_mock is returned by CatPawOpen detail; in TMDB smart flows we might not populate `detail`,
// so keep a lightweight hint/cache for pan_mock state and Tianyi access codes.
const panMockEnabledHint = ref(false);
const panMock189AccessByShareIdHint = ref({});

		const tmdbMeta = ref(null);
		const doubanSeasonMeta = ref(null);
		const tmdbMovieSmartEpisodes = ref([]);
		const tmdbMovieSmartFetchState = { key: '', seq: 0, inFlight: null };

	const readDoubanSeasonMetaFromSession = (tmdbId) => {
	  const id = Number.isFinite(Number(tmdbId)) ? Math.floor(Number(tmdbId)) : 0;
	  if (id <= 0) return null;
	  try {
	    const raw = sessionStorage.getItem(`tv:douban:tmdbSeasons:${id}`);
	    if (!raw) return null;
	    const parsed = JSON.parse(raw);
	    if (!parsed || typeof parsed !== 'object') return null;
	    const seasons = Array.isArray(parsed.seasons) ? parsed.seasons : [];
	    const out = {
	      tmdbId: Number.isFinite(Number(parsed.tmdbId)) ? Math.floor(Number(parsed.tmdbId)) : id,
	      seasonCount: Number.isFinite(Number(parsed.seasonCount)) ? Math.floor(Number(parsed.seasonCount)) : 0,
	      seasons: seasons
	        .map((s) => ({
	          season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
	          episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
	        }))
	        .filter((s) => s.season > 0 && s.episodeCount > 0),
	      updatedAt: Number.isFinite(Number(parsed.updatedAt)) ? Number(parsed.updatedAt) : 0,
	    };
	    if (!out.seasonCount) out.seasonCount = out.seasons.length;
	    if (out.seasonCount < 2 || out.seasons.length < 2) return null;
	    return out;
	  } catch (_e) {
	    return null;
	  }
	};

	const refreshDoubanSeasonMeta = () => {
	  if (!tmdbMode.value) {
	    doubanSeasonMeta.value = null;
	    return;
	  }
	  const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
	  if (typRaw !== 'tv') {
	    doubanSeasonMeta.value = null;
	    return;
	  }
	  doubanSeasonMeta.value = readDoubanSeasonMetaFromSession(props.tmdbId || 0);
	};

const resolvedSpiderApi = computed(() => {
  const direct = (props.spiderApi || '').trim();
  if (direct) return direct;
  const key = (props.siteKey || '').trim();
  if (!key) return '';
  const sites = Array.isArray(effectiveBootstrapSettings.value.homeSites) ? effectiveBootstrapSettings.value.homeSites : [];
  const found = sites.find((s) => s && s.key === key);
  const fromHome = found && found.api ? String(found.api) : '';
  return fromHome;
});

const resolvedSpiderApiFallback = ref('');
const ensureResolvedSpiderApiFallback = async () => {
  try {
    if ((props.spiderApi || '').trim()) return;
    if (resolvedSpiderApiFallback.value) return;
    const siteKey = (props.siteKey || '').trim();
    if (!siteKey) return;
    const data = await fetchUserSitesCached(10 * 1000);
    const sites = Array.isArray(data && data.sites) ? data.sites : [];
    const found = sites.find((s) => s && String(s.key || '').trim() === siteKey) || null;
    const api = found && typeof found.api === 'string' ? found.api.trim() : '';
    if (api) resolvedSpiderApiFallback.value = api;
  } catch (_e) {}
};

const resolvedSpiderApiFinal = computed(() => {
  const direct = (props.spiderApi || '').trim();
  if (direct) return direct;
  const fromHome = resolvedSpiderApi.value;
  if (fromHome) return fromHome;
  return (resolvedSpiderApiFallback.value || '').trim();
});

watch(
  () => `${(props.siteKey || '').trim()}|${(props.spiderApi || '').trim()}`,
  () => {
    resolvedSpiderApiFallback.value = '';
    void ensureResolvedSpiderApiFallback();
  },
  { immediate: true }
);

watch(
  () => (resumeHistory.value && typeof resumeHistory.value.spiderApi === 'string' ? resumeHistory.value.spiderApi.trim() : ''),
  (api) => {
    if ((props.spiderApi || '').trim()) return;
    if (resolvedSpiderApi.value) return;
    if (resolvedSpiderApiFallback.value) return;
    if (api) resolvedSpiderApiFallback.value = api;
  }
);

const resolvedSiteName = computed(() => {
  const key = (props.siteKey || '').trim();
  if (!key) return '';
  const sites = Array.isArray(effectiveBootstrapSettings.value.homeSites) ? effectiveBootstrapSettings.value.homeSites : [];
  const found = sites.find((s) => s && s.key === key);
  const name = found && found.name ? String(found.name) : '';
  return name.trim();
});

const orderedSiteSources = computed(() => {
  const currentSiteKey = (props.siteKey || '').trim();
  const currentVideoId = (props.videoId || '').trim();
  const currentSourceTitle = (props.videoTitle || '').trim();
  const homeSites = Array.isArray(effectiveBootstrapSettings.value.homeSites) ? effectiveBootstrapSettings.value.homeSites : [];
  const homeOrder = homeSites
    .map((s) => (s && typeof s.key === 'string' ? s.key.trim() : ''))
    .filter((k) => k);
  const fallbackOrder = Array.isArray(effectiveBootstrapSettings.value.searchSiteOrder) ? effectiveBootstrapSettings.value.searchSiteOrder : [];
  const order = homeOrder.length ? homeOrder : fallbackOrder;
  const orderMap = new Map();
  order.forEach((k, idx) => {
    const kk = typeof k === 'string' ? k.trim() : '';
    if (kk && !orderMap.has(kk)) orderMap.set(kk, idx);
  });

  const list = [];
  const uniq = new Set();
  const pushOne = (x) => {
    if (!x || !x.siteKey || !x.spiderApi || !x.videoId) return;
    const k = `${x.siteKey}::${x.videoId}`;
    if (uniq.has(k)) return;
    uniq.add(k);
    list.push(x);
  };

  pushOne({
    kind: 'site',
    key: `${currentSiteKey}::${currentVideoId}`,
    active: true,
    siteKey: currentSiteKey,
    spiderApi: resolvedSpiderApiFinal.value,
    siteName: resolvedSiteName.value || currentSiteKey || '站点',
    videoId: currentVideoId,
    sourceTitle: currentSourceTitle,
  });

  (aggregatedSources.value || []).forEach((s) => {
    pushOne({
      kind: 'site',
      key: `${s.siteKey}::${s.videoId}`,
      active: false,
      siteKey: s.siteKey,
      spiderApi: s.spiderApi,
      siteName: s.siteName || s.siteKey,
      videoId: s.videoId,
      sourceTitle: s.videoTitle || '',
    });
  });

  return list
    .filter((x) => x && x.siteKey && x.spiderApi && x.videoId)
    .slice()
    .sort((a, b) => {
      const ao = orderMap.has(a.siteKey) ? orderMap.get(a.siteKey) : 999999;
      const bo = orderMap.has(b.siteKey) ? orderMap.get(b.siteKey) : 999999;
      if (ao !== bo) return ao - bo;
      return (a.siteName || a.siteKey).localeCompare(b.siteName || b.siteKey, 'zh');
    });
});

const sourcesTabItems = computed(() => {
	  const buildSmartSwitchItems = () => {
	    try {
      const eps = selectedEpisodes.value;
      const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
      const idx = idxRaw >= 0 ? idxRaw : 0;
      const ep = Array.isArray(eps) && eps.length ? eps[idx] : null;
      const wantEpisode = resolveSmartEpisodeNo(ep);
      if (!wantEpisode) return [];

      const wantSeason = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
      const wantSeasonEp = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;

      const explicit =
        smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
          ? smartSourceExtractPrioritySetting.value.explicit
          : [];
      const orderKeys =
        smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
          ? smartSourceExtractPrioritySetting.value.order
          : ['网盘'];

	      const _cacheVersion = tmdbSmartPickCacheVersion.value + tmdbSmartDetailCacheVersion.value;
	      if (_cacheVersion < 0) return [];

      const computeHitCount = (m) => {
        const conds = Array.isArray(explicit) ? explicit : [];
        let hit = 0;
        conds.forEach((k) => {
          if (k === '网盘') {
            if (m && Number.isFinite(Number(m.panTokenIdx)) && Number(m.panTokenIdx) >= 0) hit += 1;
            return;
          }
          if (k === '画质') {
            const labelHit = m && Number.isFinite(Number(m.__smartQualityRank)) && Number(m.__smartQualityRank) > 0;
            if (labelHit) hit += 1;
            return;
          }
          if (k === '帧率') {
            const labelHit = m && m.__smartFps60 === true;
            if (labelHit) hit += 1;
            return;
          }
          if (k === '关键字' && m && m.matchKeyword && m.matchKeyword.count > 0) hit += 1;
        });
        return hit;
      };

      const comparePanTokenIdx = (a, b) => {
        const av = Number.isFinite(Number(a)) ? Number(a) : -1;
        const bv = Number.isFinite(Number(b)) ? Number(b) : -1;
        if (av < 0 && bv < 0) return 0;
        if (av < 0) return 1;
        if (bv < 0) return -1;
        return av - bv;
      };

      const compareSmartCandidate = (a, b) => {
        const aTier = (() => {
          const q = Number(a && a.__smartQualityRank) || 0;
          const fps = a && a.__smartFps60 === true;
          if (q === 3 && fps) return 50;
          if (q === 3) return 40;
          if (q === 2) return 30;
          if (q === 1) return 20;
          return 10;
        })();
        const bTier = (() => {
          const q = Number(b && b.__smartQualityRank) || 0;
          const fps = b && b.__smartFps60 === true;
          if (q === 3 && fps) return 50;
          if (q === 3) return 40;
          if (q === 2) return 30;
          if (q === 1) return 20;
          return 10;
        })();
        if (aTier !== bTier) return bTier - aTier;

        const ah = computeHitCount(a);
        const bh = computeHitCount(b);
        if (ah !== bh) return bh - ah;
        for (let i = 0; i < orderKeys.length; i += 1) {
          const key = orderKeys[i];
          if (key === '网盘') {
            const q = comparePanTokenIdx(a && a.panTokenIdx, b && b.panTokenIdx);
            if (q) return q;
            continue;
          }
          const q =
            key === '画质'
              ? (Number(b && b.__smartQualityRank) || 0) - (Number(a && a.__smartQualityRank) || 0)
              : key === '帧率'
                ? (b && b.__smartFps60 === true ? 1 : 0) - (a && a.__smartFps60 === true ? 1 : 0)
                : comparePriorityMatch(a.matchKeyword, b.matchKeyword);
          if (q) return q;
        }

	        const aEx = a && a.__smartEnhanceMatch ? a.__smartEnhanceMatch : { count: 0, indices: [] };
	        const bEx = b && b.__smartEnhanceMatch ? b.__smartEnhanceMatch : { count: 0, indices: [] };
	        const ex = comparePriorityMatch(aEx, bEx);
        if (ex) return ex;

        return 0;
      };

      const sameCandidate = (a, b) => {
        if (!a || !b) return false;
        const au = a.ep && a.ep.url != null ? String(a.ep.url) : '';
        const bu = b.ep && b.ep.url != null ? String(b.ep.url) : '';
        return (
          String(a.siteKey || '') === String(b.siteKey || '') &&
          String(a.spiderApi || '') === String(b.spiderApi || '') &&
          String(a.videoId || '') === String(b.videoId || '') &&
          String(a.panLabel || '') === String(b.panLabel || '') &&
          au === bu
        );
      };

      const guessQuality = (hayRaw) => {
        const hay = String(hayRaw || '').toUpperCase();
        if (/(2160P|2160|4K)/.test(hay)) return '4K';
        if (/(1080P|1080)/.test(hay)) return '1080P';
        if (/(720P|720)/.test(hay)) return '720P';
        return '';
      };

      const guessFps60 = (hayRaw) => {
        const hay = String(hayRaw || '').toLowerCase();
        return hay.includes('60fps') || hay.includes('60帧');
      };

      const enhanceTokens = ['60fps', '60帧', 'hdr', 'ddp', '臻彩'];

      const qualityRankOf = (q) => {
        const s = typeof q === 'string' ? q.trim().toUpperCase() : '';
        if (s === '4K') return 3;
        if (s === '1080P') return 2;
        if (s === '720P') return 1;
        return 0;
      };

      const formatQualityTitle = (cand) => {
        const rawLower = cand && typeof cand.rawLower === 'string' ? cand.rawLower : '';
        const epName = cand && cand.ep && cand.ep.name != null ? String(cand.ep.name) : '';
        const srcTitleLower = cand && typeof cand.srcTitleLower === 'string' ? cand.srcTitleLower : '';
        const srcRemarkLower = cand && typeof cand.srcRemarkLower === 'string' ? cand.srcRemarkLower : '';
        const epUrl = cand && cand.ep && cand.ep.url != null ? String(cand.ep.url) : '';
        const urlRawNames = epUrl ? extractRawNamesFromEpisodeUrl(epUrl) : [];
        const urlRaw = Array.isArray(urlRawNames) && urlRawNames.length ? String(urlRawNames.join(' ')) : '';
        const hay = `${rawLower} ${epName} ${srcTitleLower} ${srcRemarkLower} ${urlRaw}`;
        const quality = guessQuality(hay);
        const fps60 = guessFps60(hay);
        const label = quality || '未知';
        if (label === '4K' && fps60) return '4K·60帧';
        return label;
      };

      const cleanPanName = (raw) => {
        const label = typeof raw === 'string' ? raw.trim() : '';
        if (!label) return '';
        const tokens = Array.isArray(smartPanMatchTokensSetting.value) ? smartPanMatchTokensSetting.value : [];
        const low = label.toLowerCase();
        for (let i = 0; i < tokens.length; i += 1) {
          const t = typeof tokens[i] === 'string' ? tokens[i].trim() : '';
          if (!t) continue;
          if (low.includes(t.toLowerCase())) return t;
        }
        const stripped = label
          .replace(/[（(].*?[）)]/g, '')
          .replace(/[#|｜|\\|/].*$/g, '')
          .replace(/[-_—].*$/g, '')
          .replace(/\s+.*$/g, '')
          .trim();
        return stripped || label;
      };

	      const homeSites = Array.isArray(effectiveBootstrapSettings.value.homeSites) ? effectiveBootstrapSettings.value.homeSites : [];
	      const siteNameOf = (siteKey, fallbackName = '') => {
	        const k = typeof siteKey === 'string' ? siteKey.trim() : String(siteKey || '').trim();
	        if (!k) return (fallbackName || '').trim();
	        const found = homeSites.find((s) => s && String(s.key || '').trim() === k) || null;
	        const name = found && typeof found.name === 'string' ? found.name.trim() : '';
	        return (name || fallbackName || k).trim();
	      };
	      const homeOrder = homeSites
	        .map((s) => (s && typeof s.key === 'string' ? s.key.trim() : ''))
	        .filter((k) => k);
      const fallbackOrder =
        Array.isArray(effectiveBootstrapSettings.value.searchSiteOrder) ? effectiveBootstrapSettings.value.searchSiteOrder : [];
      const order = homeOrder.length ? homeOrder : fallbackOrder;
      const orderMap = new Map();
      order.forEach((k, idx2) => {
        const kk = typeof k === 'string' ? k.trim() : '';
        if (kk && !orderMap.has(kk)) orderMap.set(kk, idx2);
      });

      const picked = tmdbSmartPickCache.get(wantEpisode) || null;

      const list = [];
      const uniq = new Set();
	      const pushCand = (cand, { force = false } = {}) => {
	        if (!cand || !cand.siteKey || !cand.spiderApi || !cand.videoId || !cand.ep || !cand.ep.url) return;
        const rawLower = typeof cand.rawLower === 'string' ? cand.rawLower : '';
        const epName = cand.ep && cand.ep.name != null ? String(cand.ep.name) : '';
        const epUrl = cand.ep && cand.ep.url != null ? String(cand.ep.url) : '';
        const urlRawNamesLower = (() => {
          try {
            const list = epUrl ? extractRawNamesFromEpisodeUrl(epUrl) : [];
            if (!Array.isArray(list) || !list.length) return '';
            return list
              .map((x) => String(x || '').trim().toLowerCase())
              .filter(Boolean)
              .join(' ');
          } catch (_e) {
            return '';
          }
        })();
        const quality = guessQuality(`${rawLower} ${epName} ${urlRawNamesLower}`);
        const qualityRank = qualityRankOf(quality);
        const srcTitleLower = cand && typeof cand.srcTitleLower === 'string' ? cand.srcTitleLower : '';
        const srcRemarkLower = cand && typeof cand.srcRemarkLower === 'string' ? cand.srcRemarkLower : '';
        const hayLower = `${rawLower} ${String(epName || '').toLowerCase()} ${srcTitleLower} ${srcRemarkLower} ${urlRawNamesLower}`.trim();
        const enhanceMatch = computePriorityMatch(hayLower, enhanceTokens);
        const enhanceIdx = enhanceMatch && Array.isArray(enhanceMatch.indices) ? enhanceMatch.indices : [];
        const enhanceFps60 = enhanceIdx.includes(0) || enhanceIdx.includes(1);
        const fps60 = guessFps60(hayLower) || enhanceFps60;
        const enriched = { ...cand, __smartQualityRank: qualityRank, __smartFps60: !!fps60, __smartEnhanceMatch: enhanceMatch };
        const mode =
          smartSourceExtractPrioritySetting.value && smartSourceExtractPrioritySetting.value.mode
            ? String(smartSourceExtractPrioritySetting.value.mode)
            : '无';
        const requireHit = mode !== '无';
        if (!force && requireHit && computeHitCount(enriched) <= 0) return;
        const panName = cleanPanName(cand.panLabel || '');
        const panKey = panName || '网盘';
        const key = `${cand.siteKey}::${cand.videoId}::${panKey}::${String(cand.ep.url)}`;
        if (uniq.has(key)) return;
        uniq.add(key);
	        list.push({
	          kind: 'smart',
	          key,
	          active: !!(picked && sameCandidate(cand, picked)),
	          siteKey: String(cand.siteKey),
	          spiderApi: String(cand.spiderApi),
	          siteName: siteNameOf(String(cand.siteKey || ''), String(cand.siteName || '')),
	          videoId: String(cand.videoId),
	          poster: displayPoster.value,
	          title: displayTitle.value || '未命名',
	          qualityTitle: formatQualityTitle(enriched),
	          panName,
	          __smartCand: enriched,
	        });
	      };

      try {
        Array.from(tmdbSmartDetailCache.values()).forEach((entry) => {
          if (!entry || entry.ok === false) return;
          const exact = entry.episodeMap && entry.episodeMap.get ? entry.episodeMap.get(wantEpisode) : null;
          let candidates = Array.isArray(exact) ? exact : [];
          if (!candidates.length && wantSeasonEp > 0 && entry.episodeMapLoose && entry.episodeMapLoose.get) {
            const loose = entry.episodeMapLoose.get(wantSeasonEp);
            const looseList = Array.isArray(loose) ? loose : [];
            if (wantSeason > 0) {
              const seasonExact = looseList.filter((c) => c && Number(c.matchSeason) === wantSeason);
              candidates = seasonExact.length ? seasonExact : looseList;
            } else {
              candidates = looseList;
            }
          }
          candidates.forEach(pushCand);
        });
      } catch (_e) {}

      if (picked) pushCand(picked, { force: true });

	      const qualityTierRankOf = (label) => {
	        const s = typeof label === 'string' ? label.trim() : '';
	        if (!s) return 0;
	        if (s.includes('4K') && s.includes('60')) return 50;
	        if (s.includes('4K')) return 40;
	        if (s.includes('1080')) return 30;
	        if (s.includes('720')) return 20;
	        if (s.includes('未知')) return 10;
	        return 1;
	      };

	      const bySite = new Map();
	      list.forEach((it) => {
	        if (!it || !it.siteKey) return;
	        const k = String(it.siteKey);
        const hit = bySite.get(k);
        if (!hit) {
          bySite.set(k, {
            siteKey: it.siteKey,
            siteName: it.siteName || it.siteKey,
            items: [it],
            bestItem: it,
            activeItem: it.active ? it : null,
          });
          return;
        }
        hit.items.push(it);
        if (it.active && !hit.activeItem) hit.activeItem = it;
        if (!hit.siteName && it.siteName) hit.siteName = it.siteName;
        if (compareSmartCandidate(hit.bestItem.__smartCand, it.__smartCand) > 0) hit.bestItem = it;
      });

      const merged = Array.from(bySite.values()).map((g) => {
        const best = g.bestItem;
        const activeItem = g.activeItem;
        return {
          kind: 'smart',
          key: `site::${g.siteKey}`,
          active: !!activeItem,
          siteKey: g.siteKey,
          spiderApi: best.spiderApi,
          siteName: (activeItem && activeItem.siteName) || best.siteName || g.siteName || g.siteKey,
          videoId: best.videoId,
          qualityTitle: best.qualityTitle,
          __smartCand: best.__smartCand,
          __smartQualityTierRank: qualityTierRankOf(best.qualityTitle),
        };
      });

      return merged
        .slice()
        .sort((a, b) => {
          const ar = Number(a && a.__smartQualityTierRank) || 0;
          const br = Number(b && b.__smartQualityTierRank) || 0;
          if (ar !== br) return br - ar;
          const q = compareSmartCandidate(a && a.__smartCand, b && b.__smartCand);
          if (q) return q;
          const ao = orderMap.has(a.siteKey) ? orderMap.get(a.siteKey) : 999999;
          const bo = orderMap.has(b.siteKey) ? orderMap.get(b.siteKey) : 999999;
          if (ao !== bo) return ao - bo;
          return (a.siteName || a.siteKey).localeCompare(b.siteName || b.siteKey, 'zh');
        });
    } catch (_e) {
      return [];
    }
  };

  if (isSmartPanActive.value) return buildSmartSwitchItems();

  const currentSiteKey = (props.siteKey || '').trim();
  const currentVideoId = (props.videoId || '').trim();

  const list = [];
  const uniq = new Set();
  const pushOne = (x) => {
    if (!x || !x.siteKey || !x.spiderApi || !x.videoId) return;
    const k = `${x.siteKey}::${x.videoId}`;
    if (uniq.has(k)) return;
    uniq.add(k);
    list.push(x);
  };

  pushOne({
    kind: 'site',
    key: `${currentSiteKey}::${currentVideoId}`,
    active: true,
    siteKey: currentSiteKey,
    spiderApi: resolvedSpiderApiFinal.value,
    siteName: resolvedSiteName.value || '站点',
    videoId: currentVideoId,
    title: displayTitle.value || '未命名',
    poster: displayPoster.value,
    remark: (detail.value.remark || props.videoRemark || '').trim(),
  });

  (aggregatedSources.value || []).forEach((s) => {
    pushOne({
      kind: 'site',
      key: `${s.siteKey}::${s.videoId}`,
      active: false,
      siteKey: s.siteKey,
      spiderApi: s.spiderApi,
      siteName: s.siteName || s.siteKey,
      videoId: s.videoId,
      title: s.videoTitle || '未命名',
      poster: processPosterUrl(s.videoPoster || ''),
      remark: (s.videoRemark || '').trim(),
    });
  });

  return list.filter((x) => x && x.siteKey && x.spiderApi && x.videoId);
});

const switchAggregatedSource = async (src) => {
  if (!src || src.active) return;
  if (src.kind === 'smart') {
    try {
      const qTitle = src && typeof src.qualityTitle === 'string' ? src.qualityTitle.trim() : '';
      const qualityMode =
        qTitle.includes('4K') && qTitle.includes('HDR')
          ? '4k_hdr'
          : qTitle.includes('4K') && (qTitle.includes('60') || qTitle.toUpperCase().includes('FPS'))
            ? '4k_fps'
            : qTitle.includes('4K')
              ? '4k'
              : qTitle.includes('1080')
                ? '1080p'
                : 'auto';
      const preferredPan = smartCurrentPanToken.value || '';
      const ok = await smartSwitchTo({
        panToken: preferredPan,
        panMode: 'require',
        qualityMode,
        switchKind: 'source_tab',
        targetSiteKey: src.siteKey || '',
        excludeCurrent: true,
        excludePlayed: false,
      });
      if (!ok && preferredPan) {
        await smartSwitchTo({
          panToken: '',
          panMode: 'any',
          qualityMode,
          switchKind: 'source_tab',
          targetSiteKey: src.siteKey || '',
          excludeCurrent: true,
          excludePlayed: false,
        });
      }
    } catch (_e) {}
    return;
  }
  try {
    const meta = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
    const metaTitle = meta && meta.title ? String(meta.title).trim() : '';
    const metaPoster = meta && meta.pic ? String(meta.pic).trim() : '';
    const metaType = meta && typeof meta.mediaType === 'string' ? meta.mediaType.trim() : '';
    const metaId = meta && Number.isFinite(Number(meta.tmdbId)) ? Number(meta.tmdbId) : 0;
    window.dispatchEvent(
      new CustomEvent('tv:open-play', {
        detail: {
          siteKey: src.siteKey || '',
          spiderApi: src.spiderApi || '',
          videoId: src.videoId || '',
          videoTitle: metaTitle || displayTitle.value || src.title || '',
          videoPoster: metaPoster || displayPoster.value || src.poster || '',
          videoRemark: (tmdbMode.value ? tmdbHistoryRemark.value : '') || displayRemark.value || src.remark || '',
          contentKey: getStableContentKey(),
          tmdbId: metaId || (tmdbMode.value ? Number(props.tmdbId || 0) : 0),
          tmdbType: metaType || (tmdbMode.value ? String(props.tmdbType || '').trim().toLowerCase() : ''),
        },
      })
    );
  } catch (_e) {}
};

const canLoadMoreSources = computed(() => {
  if (sourcesLoading.value) return false;
  if (sourcesError.value) return false;
  if (!sourcesSearchedOnce.value) return false;
  return sourcesSearchRemainingCount.value > 0 && sourcesSearchDone.value === false;
});

const loadMoreSources = async () => {
  if (!canLoadMoreSources.value) return;
  await fetchAggregatedSourcesExactMatches({ append: true });
};

const displayTitle = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const t = m && typeof m.title === 'string' ? m.title.trim() : '';
  return (t || detail.value.title || props.videoTitle || '').trim();
});

const displayPoster = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const p = m && typeof m.pic === 'string' ? m.pic.trim() : '';
  return processPosterUrl((p || detail.value.poster || props.videoPoster || '').trim());
});

const displayRemark = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const r = m && typeof m.badge === 'string' ? m.badge.trim() : '';
  return (r || detail.value.remark || props.videoRemark || '').trim();
});

const historyCoverPoster = ref('');
const historyCoverLocked = ref(false);
const lastHistoryPayload = ref(null);

watch(
  () => displayPoster.value,
  (p) => {
    if (historyCoverPoster.value) return;
    const next = typeof p === 'string' ? p.trim() : '';
    if (next) historyCoverPoster.value = next;
  },
  { immediate: true }
);

const pickHistoryPoster = () => {
  if (tmdbMode.value && displayPoster.value) return displayPoster.value;
  const currentSiteKey = (props.siteKey || '').trim();
  const preferred = effectiveBootstrapSettings.value.searchCoverSite ? String(effectiveBootstrapSettings.value.searchCoverSite).trim() : '';
  const order =
    Array.isArray(effectiveBootstrapSettings.value.searchSiteOrder) ? effectiveBootstrapSettings.value.searchSiteOrder : [];
  const orderMap = new Map();
  order.forEach((k, idx) => {
    const kk = typeof k === 'string' ? k.trim() : '';
    if (kk && !orderMap.has(kk)) orderMap.set(kk, idx);
  });

  const list = [];
  if (currentSiteKey && displayPoster.value) {
    list.push({ siteKey: currentSiteKey, poster: displayPoster.value });
  }
  (aggregatedSources.value || []).forEach((s) => {
    if (!s || !s.siteKey || !s.videoPoster) return;
    list.push({ siteKey: s.siteKey, poster: processPosterUrl(s.videoPoster) });
  });

  const pickFrom = (siteKey) => {
    const found = list.find((x) => x && x.siteKey === siteKey && x.poster);
    return found ? found.poster : '';
  };

  if (preferred) {
    const p = pickFrom(preferred);
    if (p) return p;
  }
  const ordered = list
    .slice()
    .sort((a, b) => {
      const ao = orderMap.has(a.siteKey) ? orderMap.get(a.siteKey) : 999999;
      const bo = orderMap.has(b.siteKey) ? orderMap.get(b.siteKey) : 999999;
      return ao - bo;
    });
  const first = ordered.find((x) => x && x.poster);
  return first ? first.poster : displayPoster.value || '';
};

const persistHistoryPosterIfPossible = async () => {
  const base = lastHistoryPayload.value && typeof lastHistoryPayload.value === 'object' ? lastHistoryPayload.value : null;
  if (!base) return;
  try {
    await apiPostJson(
      '/api/playhistory',
      {
        ...base,
        videoPoster: historyCoverPoster.value || base.videoPoster || '',
        forcePosterUpdate: true,
      },
      { dedupe: false }
    );
    window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
  } catch (_e) {
    // ignore
  }
};

const tryLockHistoryPoster = async (opts = {}) => {
  const { force = false, allowFallback = false } = opts || {};
  if (historyCoverLocked.value) return;

  const preferred = effectiveBootstrapSettings.value.searchCoverSite ? String(effectiveBootstrapSettings.value.searchCoverSite).trim() : '';
  if (!force && preferred) {
    const hit = (aggregatedSources.value || []).find((s) => s && s.siteKey === preferred && s.videoPoster);
    if (!hit) return;
  }

  const picked = pickHistoryPoster();
  const next = typeof picked === 'string' ? picked.trim() : '';
  if (!next) {
    if (!allowFallback) return;
    const fallback = displayPoster.value || '';
    if (!fallback) return;
    historyCoverPoster.value = fallback;
    historyCoverLocked.value = true;
    return;
  }

  historyCoverPoster.value = next;
  historyCoverLocked.value = true;
  await persistHistoryPosterIfPossible();
};

const canFavorite = computed(() => {
  const siteKey = (props.siteKey || '').trim();
  const spiderApi = (resolvedSpiderApiFinal.value || '').trim();
  const videoId = (props.videoId || '').trim();
  const title = displayTitle.value || '';
  return !!(siteKey && spiderApi && videoId && title);
});

const favoriteStatusState = { key: '', inFlight: null, seq: 0 };

const loadFavoriteStatus = async () => {
  const siteKey = (props.siteKey || '').trim();
  const videoId = (props.videoId || '').trim();
  if (!siteKey || !videoId) {
    isFavorited.value = false;
    return;
  }
  const k = `${siteKey}::${videoId}`;
  if (favoriteStatusState.inFlight && favoriteStatusState.key === k) {
    await favoriteStatusState.inFlight;
    return;
  }
  let seqAtCall = 0;
  try {
    favoriteStatusState.seq += 1;
    seqAtCall = favoriteStatusState.seq;
    favoriteStatusState.key = k;
    favoriteStatusState.inFlight = (async () => {
      const data = await apiGetJson(`/api/favorites/status${buildQuery({ siteKey, videoId })}`, { cacheMs: 2000 });
      if (seqAtCall === favoriteStatusState.seq) {
        isFavorited.value = !!(data && data.favorited);
      }
    })();
    await favoriteStatusState.inFlight;
  } catch (_e) {
    isFavorited.value = false;
  } finally {
    if (seqAtCall && favoriteStatusState.key === k && favoriteStatusState.seq === seqAtCall) {
      favoriteStatusState.inFlight = null;
    }
  }
};

const toggleFavorite = async () => {
  if (favoriteLoading.value) return;
  if (!canFavorite.value) return;
  favoriteLoading.value = true;
  try {
    const siteKey = (props.siteKey || '').trim();
    const spiderApi = (resolvedSpiderApiFinal.value || '').trim();
    const videoId = (props.videoId || '').trim();
    const videoTitle = displayTitle.value || '';
    const data = await apiPostJson(
      '/api/favorites/toggle',
      {
        siteKey,
        siteName: resolvedSiteName.value || '',
        spiderApi,
        videoId,
        videoTitle,
        videoPoster: displayPoster.value || '',
        videoRemark: (props.videoRemark || '').trim(),
      },
      { dedupe: false }
    );
    if (!data || data.success !== true) throw new Error((data && data.message) || '保存失败');
    isFavorited.value = !!data.favorited;
    window.dispatchEvent(new CustomEvent('tv:favorites-updated'));
  } catch (_e) {
    // ignore
  } finally {
    favoriteLoading.value = false;
  }
};

const displayYear = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const y = m && Number.isFinite(Number(m.year)) && Number(m.year) > 0 ? String(Math.floor(Number(m.year))) : '';
  return (y || detail.value.year || props.videoYear || '').trim();
});

const splitTags = (v) => {
  const raw = typeof v === 'string' ? v.trim() : '';
  if (!raw) return [];
  return raw
    .split(/[,\s/|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

const metaPills = computed(() => {
  const pills = [];
  const isTMDB = !!tmdbMode.value;
  const tmdbType = String(props.tmdbType || '').trim().toLowerCase();
  if (!isTMDB) {
    const typeLabel = (detail.value.type || '').trim();
    if (typeLabel) pills.push(...splitTags(typeLabel));
  }
  if (isTMDB && (tmdbType === 'tv' || tmdbType === 'movie')) pills.push(tmdbType === 'tv' ? '剧集' : '电影');
  if (searchTypeLabel.value) pills.push(searchTypeLabel.value);
  const y = displayYear.value;
  if (y) pills.push(y);
  if (!isTMDB) {
    const siteName = resolvedSiteName.value;
    if (siteName) pills.push(siteName);
  }
  const remark = displayRemark.value;
  if (remark) pills.push(remark);
  const uniq = [];
  const seen = new Set();
  pills.forEach((p) => {
    const key = p.toLowerCase();
    if (!p || seen.has(key)) return;
    seen.add(key);
    uniq.push(p);
  });
  return uniq;
});

const parsePlaySources = (fromRaw, urlRaw) => {
  const fromStr = typeof fromRaw === 'string' ? fromRaw.trim() : '';
  const urlStr = typeof urlRaw === 'string' ? urlRaw.trim() : '';
  if (!fromStr && !urlStr) return [];

  const splitTop = (s) => (s ? s.split('$$$') : []);
  const fromParts = splitTop(fromStr);
  const urlParts = splitTop(urlStr);
  const len = Math.max(fromParts.length, urlParts.length);
  const rawItems = [];
  for (let i = 0; i < len; i += 1) {
    const baseLabel = (fromParts[i] || '').trim() || `源${i + 1}`;
    const baseUrl = (urlParts[i] || '').trim();
    if (!baseUrl && !baseLabel) continue;

    // Only split by `|||` when the label side explicitly includes it.
    // Some scripts emit `|||` only on the URL side, which would otherwise create fake sub-sources like `xxx-2`.
    const fromSubs = baseLabel.includes('|||') ? baseLabel.split('|||').map((x) => x.trim()) : [baseLabel];
    const urlSubs = baseLabel.includes('|||') && baseUrl.includes('|||') ? baseUrl.split('|||').map((x) => x.trim()) : [baseUrl];
    const subLen = Math.max(fromSubs.length, urlSubs.length);

    for (let j = 0; j < subLen; j += 1) {
      const label = (fromSubs[j] || '').trim() || (subLen > 1 ? `${baseLabel}-${j + 1}` : baseLabel);
      const u = (urlSubs[j] || '').trim();
      if (!u) continue;

      const parseEpisodeSeg = (seg, flag) => {
        const s = String(seg || '').trim();
        if (!s) return null;
        const idx = s.indexOf('$');
        if (idx <= 0) {
          // Some sources return bare ids (no `$`), which are still valid play ids.
          return { name: s, url: s, flag };
        }
        const name = s.slice(0, idx).trim();
        const url = s.slice(idx + 1).trim();
        return { name: name || s, url: url || s, flag };
      };

      const segs = u
        .split('#')
        .map((seg) => String(seg || '').trim())
        .filter(Boolean);

      // Some scripts encode per-episode "flag" in vod_play_from like:
      //   百度原画-xxxx#01$$$百度原画-xxxx#02 ...
      // In that case, each `$$$` entry holds exactly one episode, and the flag must come from that entry.
      const flagForThisItem = String(label || '').trim();
      const episodes = segs.map((seg) => parseEpisodeSeg(seg, flagForThisItem)).filter(Boolean);
      rawItems.push({ label: flagForThisItem, episodes });
    }
  }

  const normalizeLabelForGrouping = (label) => {
    const s = typeof label === 'string' ? label.trim() : '';
    if (!s) return '';
    return s.replace(/#\d{1,3}\s*$/i, '').trim();
  };

  // Group by normalized label to avoid exploding pan options (e.g. `xxx#01`, `xxx#02`).
  const groups = new Map();
  rawItems.forEach((it) => {
    const rawLabel = (it && it.label ? String(it.label) : '').trim();
    const label = normalizeLabelForGrouping(rawLabel) || rawLabel || '未知源';
    const key = label.toLowerCase();
    const existing = groups.get(key);
    const nextEps = it && Array.isArray(it.episodes) ? it.episodes : [];
    if (!existing) {
      groups.set(key, { label, episodes: nextEps.slice() });
      return;
    }
    // Keep episode order; de-dupe by (flag,url) to avoid exact duplicates.
    const seen = new Set(existing.episodes.map((e) => `${(e && e.flag) || ''}::${(e && e.url) || ''}`));
    nextEps.forEach((e) => {
      const k = `${(e && e.flag) || ''}::${(e && e.url) || ''}`;
      if (!e || !e.url || seen.has(k)) return;
      seen.add(k);
      existing.episodes.push(e);
    });
  });

  const out = [];
  Array.from(groups.values()).forEach((g, idx) => {
    const episodes = Array.isArray(g.episodes) ? g.episodes.filter((e) => e && e.url) : [];
    if (!episodes.length) return;
    out.push({ key: `p${idx}`, label: g.label, episodes });
  });
  return out;
};

const SMART_PAN_KEY = 'smart';
const SMART_PAN_LABEL = '智能播放';

const sitePanOptions = computed(() => parsePlaySources(detail.value.playFrom, detail.value.playUrl));

const TMDB_SITE_PAN_KEY_PREFIX = 'tmdb_site_pan::';
const buildTMDBSitePanKey = (siteKey, spiderApi, videoId) => {
  const sk = typeof siteKey === 'string' ? siteKey.trim() : '';
  const api = typeof spiderApi === 'string' ? spiderApi.trim() : '';
  const id = typeof videoId === 'string' ? videoId.trim() : '';
  return `${TMDB_SITE_PAN_KEY_PREFIX}${sk}::${api}::${id}`;
};
const isTMDBSitePanKey = (key) => typeof key === 'string' && key.startsWith(TMDB_SITE_PAN_KEY_PREFIX);

const smartLimitChars = (text, maxChars) => {
  const s = typeof text === 'string' ? text.trim() : '';
  const n = Number.isFinite(Number(maxChars)) ? Math.floor(Number(maxChars)) : 0;
  if (!s || n <= 0) return '';
  return Array.from(s).slice(0, n).join('');
};

const tmdbSitePanOptions = computed(() => {
  if (!tmdbMode.value) return [];
  const list = Array.isArray(orderedSiteSources.value) ? orderedSiteSources.value : [];
  const out = [];
  const seen = new Set();
  list.forEach((src) => {
    if (!src || src.kind !== 'site') return;
    const siteKey = typeof src.siteKey === 'string' ? src.siteKey.trim() : '';
    const spiderApi = typeof src.spiderApi === 'string' ? src.spiderApi.trim() : '';
    const videoId = typeof src.videoId === 'string' ? src.videoId.trim() : '';
    if (!siteKey || !spiderApi || !videoId) return;
    const key = buildTMDBSitePanKey(siteKey, spiderApi, videoId);
    if (seen.has(key)) return;
    seen.add(key);
    const siteName = typeof src.siteName === 'string' && src.siteName.trim() ? src.siteName.trim() : siteKey;
    const sourceTitle = typeof src.sourceTitle === 'string' ? src.sourceTitle.trim() : '';

    const tail = sourceTitle || getSourcesSearchQuery() || topLeftTitle.value || '';
    out.push({
      kind: 'tmdb_site_pan',
      key,
      label: `${siteName}-${tail}`,
      siteKey,
      siteName,
      spiderApi,
      videoId,
    });
  });
  return out;
});

const panDropdownOptions = computed(() => (tmdbMode.value ? tmdbSitePanOptions.value : sitePanOptions.value));

const tmdbSitePanCache = new Map();
const tmdbSitePanCacheVersion = ref(0);
const tmdbSitePanInFlight = new Map();

const readTMDBSitePanCacheEntry = (key) => {
  void tmdbSitePanCacheVersion.value;
  return tmdbSitePanCache.get(key) || null;
};

const ensureTMDBSitePanLoaded = async (opt) => {
  if (!opt || opt.kind !== 'tmdb_site_pan' || !opt.key) return null;
  const key = String(opt.key || '');
  const existing = tmdbSitePanCache.get(key) || null;
  if (existing && existing.ok === true && Array.isArray(existing.pans)) return existing;

  const inflight = tmdbSitePanInFlight.get(key) || null;
  if (inflight) {
    await inflight;
    return tmdbSitePanCache.get(key) || null;
  }

  const task = (async () => {
    tmdbSitePanCache.set(key, {
      ok: false,
      loading: true,
      error: '',
      pans: [],
      siteKey: opt.siteKey || '',
      siteName: opt.siteName || '',
      spiderApi: opt.spiderApi || '',
      videoId: opt.videoId || '',
    });
    tmdbSitePanCacheVersion.value += 1;

    try {
      const entry = await ensureTMDBSmartDetailCacheEntry({
        siteKey: opt.siteKey,
        siteName: opt.siteName,
        spiderApi: opt.spiderApi,
        videoId: opt.videoId,
        videoTitle: opt.siteName,
        videoRemark: '',
      });
      const pansRaw = entry && Array.isArray(entry.pans) ? entry.pans : [];
      const pans = pansRaw
        .map((pan, idx) => {
          const label = pan && pan.label != null ? String(pan.label) : '';
          const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
          return { key: `tpan${idx}`, label, episodes };
        })
        .filter((p) => p && p.label && Array.isArray(p.episodes) && p.episodes.length);

      tmdbSitePanCache.set(key, {
        ok: true,
        loading: false,
        error: '',
        pans,
        siteKey: opt.siteKey || '',
        siteName: opt.siteName || '',
        spiderApi: opt.spiderApi || '',
        videoId: opt.videoId || '',
      });
      tmdbSitePanCacheVersion.value += 1;
    } catch (e) {
      tmdbSitePanCache.set(key, {
        ok: false,
        loading: false,
        error: e && e.message ? String(e.message) : '加载网盘列表失败',
        pans: [],
        siteKey: opt.siteKey || '',
        siteName: opt.siteName || '',
        spiderApi: opt.spiderApi || '',
        videoId: opt.videoId || '',
      });
      tmdbSitePanCacheVersion.value += 1;
    }
  })();

  tmdbSitePanInFlight.set(key, task);
  try {
    await task;
  } finally {
    tmdbSitePanInFlight.delete(key);
  }
  return tmdbSitePanCache.get(key) || null;
};
const selectedPanKey = computed(() => {
  if (selectedPan.value) return selectedPan.value;
  if (smartListAvailable.value) return SMART_PAN_KEY;
  return panDropdownOptions.value[0]?.key || '';
});

const isSmartPanActive = computed(() => smartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY);

const maxPanEpisodeCount = computed(() => {
  const list = sitePanOptions.value;
  if (!list.length) return 0;
  let max = 0;
  list.forEach((s) => {
    const n = s && Array.isArray(s.episodes) ? s.episodes.length : 0;
    if (n > max) max = n;
  });
  return max;
});

const pickEpisodeByUrlAcrossPans = (targetId) => {
  const wanted = String(targetId || '').trim();
  if (!wanted) return null;
  if (smartListAvailable.value) {
    const episodes = Array.isArray(smartListEpisodes.value) ? smartListEpisodes.value : [];
    for (let i = 0; i < episodes.length; i += 1) {
      const ep = episodes[i];
      const url = ep && ep.url != null ? String(ep.url) : '';
      if (!url) continue;
      if (url === wanted || url.includes(wanted) || wanted.includes(url)) {
        return { panKey: SMART_PAN_KEY, index: i };
      }
    }
  }
  const list = sitePanOptions.value;
  for (const pan of list) {
    const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
    for (let i = 0; i < episodes.length; i += 1) {
      const ep = episodes[i];
      const url = ep && ep.url != null ? String(ep.url) : '';
      if (!url) continue;
      if (url === wanted || url.includes(wanted) || wanted.includes(url)) {
        return { panKey: pan.key, index: i };
      }
    }
  }
  return null;
};

const selectedPanLabel = computed(() => {
  if (selectedPanKey.value === SMART_PAN_KEY && smartListAvailable.value) return SMART_PAN_LABEL;
  if (introLoading.value) return '加载中...';
  const list = panDropdownOptions.value;
  if (!list.length) return smartListAvailable.value ? SMART_PAN_LABEL : '暂无数据';
  const found = list.find((o) => o && o.key === selectedPanKey.value);
  return (found && found.label ? String(found.label) : list[0].label) || '暂无数据';
});

const preferBaiduPanKey = computed(() => {
  const list = sitePanOptions.value;
  if (!list.length) return '';
  const idx = list.findIndex((o) => o && typeof o.label === 'string' && o.label.includes('百度'));
  return idx >= 0 ? list[idx].key : '';
});

const PAN_PREF_STORAGE_PREFIX = 'meowfilm_pan_pref::';
const normalizeContentKeyForPanPref = (s) => {
  const raw = typeof s === 'string' ? s : String(s || '');
  return raw.trim().toLowerCase().replace(/\s+/g, '');
};
const normalizePanLabelForPanPref = (label) => {
  return String(label || '').trim().replace(/#\d{1,3}\s*$/i, '').trim().toLowerCase();
};
const panPrefStorageKey = computed(() => {
  const k = normalizeContentKeyForPanPref(displayTitle.value);
  return k ? `${PAN_PREF_STORAGE_PREFIX}${k}` : '';
});
const readPanPref = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    const key = panPrefStorageKey.value;
    if (!key) return '';
    return String(window.localStorage.getItem(key) || '').trim().toLowerCase();
  } catch (_e) {
    return '';
  }
};
const writePanPref = (value) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const key = panPrefStorageKey.value;
    if (!key) return;
    const v = String(value || '').trim().toLowerCase();
    if (!v) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, v);
  } catch (_e) {}
};
const findPanKeyByPrefLabel = (prefLabel) => {
  const wanted = String(prefLabel || '').trim().toLowerCase();
  if (!wanted) return '';
  const list = panDropdownOptions.value;
  for (let i = 0; i < list.length; i += 1) {
    const it = list[i];
    const label = it && it.label ? normalizePanLabelForPanPref(it.label) : '';
    if (label && label === wanted) return it.key || '';
  }
  return '';
};

const EP_VIEW_MODE_STORAGE_PREFIX = 'meowfilm_episode_view_mode::';
const episodeViewModeStorageKey = computed(() => {
  const k = computeHistoryContentKey(displayTitle.value) || normalizeContentKeyForPanPref(displayTitle.value);
  return k ? `${EP_VIEW_MODE_STORAGE_PREFIX}${k}` : '';
});
const readEpisodeViewMode = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    const key = episodeViewModeStorageKey.value;
    if (!key) return '';
    const v = String(window.localStorage.getItem(key) || '').trim().toLowerCase();
    if (v === 'raw' || v === 'episodes') return v;
    return '';
  } catch (_e) {
    return '';
  }
};
const writeEpisodeViewMode = (mode) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const key = episodeViewModeStorageKey.value;
    if (!key) return;
    const v = String(mode || '').trim().toLowerCase();
    if (v !== 'raw' && v !== 'episodes') {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, v);
  } catch (_e) {}
};

watch(
  () => `${isIos.value ? '1' : '0'}|${sitePanOptions.value.length}|${selectedPan.value}`,
  () => {
    if (!isIos.value) return;
    if (tmdbSmartListAvailable.value) return;
    if (smartListAvailable.value) return;
    if (selectedPan.value) return;
    const k = preferBaiduPanKey.value;
    if (k) selectedPan.value = k;
  },
  { immediate: true }
);

const toggleRawList = (e) => {
  rawListMode.value = !rawListMode.value;
  autoRawListMode.value = false;
  if (!forceRawListMode.value) {
    writeEpisodeViewMode(rawListMode.value ? 'raw' : 'episodes');
    viewModeTouchedKey.value = episodeViewModeStorageKey.value || '';
  }
  try {
    if (e && e.currentTarget && typeof e.currentTarget.blur === 'function') e.currentTarget.blur();
  } catch (_e) {}
};

const selectPan = (key) => {
  const k = typeof key === 'string' ? key : '';
  if (!k) return;
  if (k === SMART_PAN_KEY && !smartListAvailable.value) return;
  // Keep the current episode list view mode when switching pan source.
  // If the user is currently in raw list mode, treat the switch as an explicit choice and stop auto-toggling.
  if (rawListMode.value) autoRawListMode.value = false;
  selectedPan.value = k;
  panDropdownOpen.value = false;
  selectedEpisodeGroup.value = '';
  tmdbPanDropdownOpen.value = false;

  if (tmdbMode.value) {
    if (k === SMART_PAN_KEY) {
      // For TMDB TV smart list we force episode buttons view, but do not persist user preference.
      if (tmdbSmartListAvailable.value) {
        rawListMode.value = false;
        autoRawListMode.value = false;
      }
      tmdbSelectedSitePanKey.value = '';
    } else if (isTMDBSitePanKey(k)) {
      tmdbSelectedSitePanKey.value = '';
      const opt =
        (Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : []).find((o) => o && o.key === k) || null;
      if (opt) void ensureTMDBSitePanLoaded(opt);
    }
  }

  if (k === SMART_PAN_KEY) {
    writePanPref(SMART_PAN_KEY);
  } else if (tmdbMode.value && isTMDBSitePanKey(k)) {
  } else {
    const src = panDropdownOptions.value.find((o) => o && o.key === k) || null;
    const labelNorm = src && src.label ? normalizePanLabelForPanPref(String(src.label)) : '';
    if (labelNorm) writePanPref(labelNorm);
  }

  if (playingPanKey.value && playingPanKey.value === k && playingEpisodeIndex.value >= 0) {
    const src =
      k === SMART_PAN_KEY
        ? { label: SMART_PAN_LABEL, episodes: Array.isArray(smartListEpisodes.value) ? smartListEpisodes.value : [] }
        : (sitePanOptions.value.find((o) => o && o.key === k) || null);
    const total = src && Array.isArray(src.episodes) ? src.episodes.length : 0;
    if (total && playingEpisodeIndex.value < total) {
      selectedEpisodeIndex.value = playingEpisodeIndex.value;
      return;
    }
  }
  selectedEpisodeIndex.value = -1;
};

const selectedPanSource = computed(() => {
  if (selectedPanKey.value === SMART_PAN_KEY && smartListAvailable.value) {
    return { key: SMART_PAN_KEY, label: SMART_PAN_LABEL, episodes: smartListEpisodes.value || [], smart: true };
  }
  const k = selectedPanKey.value;
  if (tmdbMode.value && isTMDBSitePanKey(k)) {
    const opt = (Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : []).find((o) => o && o.key === k) || null;
    const cached = readTMDBSitePanCacheEntry(k);
    const pans = cached && Array.isArray(cached.pans) ? cached.pans : [];
    const picked =
      (tmdbSelectedSitePanKey.value && pans.find((p) => p && p.key === tmdbSelectedSitePanKey.value)) || pans[0] || null;
    const episodes = picked && Array.isArray(picked.episodes) ? picked.episodes : [];
    return {
      key: k,
      label: (picked && picked.label ? String(picked.label) : '') || (opt && opt.label) || (cached && cached.siteName ? String(cached.siteName) : '') || '网盘',
      episodes,
      kind: 'tmdb_site_pan',
      siteKey: (opt && opt.siteKey) || (cached && cached.siteKey) || '',
      siteName: (opt && opt.siteName) || (cached && cached.siteName) || '',
      spiderApi: (opt && opt.spiderApi) || (cached && cached.spiderApi) || '',
      videoId: (opt && opt.videoId) || (cached && cached.videoId) || '',
      loading: cached ? !!cached.loading : false,
      error: cached && cached.error ? String(cached.error) : '',
    };
  }
  const list = sitePanOptions.value;
  if (!list.length) return null;
  return list.find((o) => o && o.key === k) || list[0] || null;
});

const selectedEpisodes = computed(() => {
  const src = selectedPanSource.value;
  return src && Array.isArray(src.episodes) ? src.episodes : [];
});

const selectedPanAuxLoading = computed(() => {
  const src = selectedPanSource.value;
  return !!(src && src.kind === 'tmdb_site_pan' && src.loading);
});

const selectedPanAuxError = computed(() => {
  const src = selectedPanSource.value;
  if (!src || src.kind !== 'tmdb_site_pan') return '';
  return src && src.error ? String(src.error) : '';
});

const tmdbSelectedSitePanOptions = computed(() => {
  if (!tmdbSmartListAvailable.value) return [];
  const k = selectedPanKey.value;
  if (!isTMDBSitePanKey(k)) return [];
  const cached = readTMDBSitePanCacheEntry(k);
  const pans = cached && Array.isArray(cached.pans) ? cached.pans : [];
  return pans.map((p) => ({
    key: p.key,
    label: p && p.label != null ? String(p.label) : '',
  }));
});

const tmdbSelectedSitePanLabel = computed(() => {
  const opts = tmdbSelectedSitePanOptions.value;
  if (!opts.length) return selectedPanAuxLoading.value ? '加载中...' : '暂无数据';
  const cur = tmdbSelectedSitePanKey.value;
  const hit = cur ? opts.find((o) => o && o.key === cur) : null;
  return (hit && hit.label ? String(hit.label) : '') || (opts[0] && opts[0].label ? String(opts[0].label) : '') || '网盘';
});

const selectTMDBSitePan = (key) => {
  const k = typeof key === 'string' ? key : '';
  if (!k) return;
  tmdbSelectedSitePanKey.value = k;
  tmdbPanDropdownOpen.value = false;
};

watch(
  () => `${tmdbMode.value ? '1' : '0'}|${selectedPanKey.value}`,
  () => {
    if (!tmdbMode.value) return;
    const k = selectedPanKey.value;
    if (!isTMDBSitePanKey(k)) return;
    const opt = (Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : []).find((o) => o && o.key === k) || null;
    if (!opt) return;
    void ensureTMDBSitePanLoaded(opt);
  },
  { immediate: true }
);

watch(
  () => `${tmdbMode.value ? '1' : '0'}|${selectedPanKey.value}|${tmdbSitePanCacheVersion.value}`,
  () => {
    if (!tmdbMode.value) return;
    const k = selectedPanKey.value;
    if (!isTMDBSitePanKey(k)) return;
    const cached = readTMDBSitePanCacheEntry(k);
    const pans = cached && Array.isArray(cached.pans) ? cached.pans : [];
    if (!pans.length) return;
    const cur = tmdbSelectedSitePanKey.value;
    if (cur && pans.some((p) => p && p.key === cur)) return;
    tmdbSelectedSitePanKey.value = pans[0].key || '';
  },
  { immediate: true }
);

const extractRawNamesFromEpisodeUrl = (episodeUrl) => {
  const raw = typeof episodeUrl === 'string' ? episodeUrl : '';
  if (!raw) return [];

  const stripMeta = (s) => {
	    let out = typeof s === 'string' ? s.trim() : '';
	    if (!out) return '';
	    const dollarIdx = out.indexOf('$');
	    if (dollarIdx > 0) out = out.slice(0, dollarIdx);
	    out = out.replace(/#\[[^\]]*\]\s*$/g, '');
	    out = out.replace(/\s*\[\s*\d+(?:\.\d+)?\s*(?:[KMGT]?B)\s*\]\s*$/gi, '');
	    out = out.replace(/^【[^】]{1,16}】\s*/g, '');
	    return out.trim();
	  };

	  const pickSuffix = () => {
	    if (raw.includes('***')) return raw.split('***').pop() || '';
	    if (raw.includes('|||')) return raw.split('|||').pop() || '';
	    const pipeParts = raw.split('|');
	    if (pipeParts.length >= 4) return pipeParts[pipeParts.length - 1] || '';
	    return '';
	  };

	  const suffix = pickSuffix();
	  if (!suffix) {
	    // Fallback for ids that embed filename as the last "*" segment (e.g. Tianyi: "<fileId>*<shareId>*<name>").
	    if (raw.includes('*')) {
	      const starParts = raw
	        .split('*')
	        .map((s) => stripMeta(String(s || '')))
	        .filter(Boolean);
	      if (starParts.length) return [starParts[starParts.length - 1]];
	    }
	    return [];
	  }

	  const parts = String(suffix || '')
	    .split('#')
	    .map((s) => stripMeta(String(s || '')))
	    .filter(Boolean);

  return parts;
};

const panMockProviderFromFlag = (flag) => {
  const s = typeof flag === 'string' ? flag.trim() : '';
  if (!s) return '';
  const lower = s.toLowerCase();
  if (s.includes('天意') || s.includes('天翼') || lower.includes('tianyi') || lower.includes('189')) return '189';
  if (s.includes('逸动') || s.includes('和彩云') || lower.includes('yidong') || lower.includes('139')) return '139';
  if (s.includes('夸父') || s.includes('夸克') || lower.includes('quark')) return 'quark';
  if (s.includes('优夕') || lower.includes('uc')) return 'uc';
  if (s.includes('百度') || lower.includes('baidu')) return 'baidu';
  return '';
};

const parseMockPasscodeFromUrl = (episodeUrl) => {
  const names = extractRawNamesFromEpisodeUrl(episodeUrl);
  const raw = Array.isArray(names) && names.length ? String(names[0] || '').trim() : '';
  if (!raw) return '';
  let t = raw;
  if (t.toLowerCase().endsWith('.mp4')) t = t.slice(0, -4);
  t = String(t || '').trim();
  if (!t || t.toLowerCase() === 'nopass') return '';
  return t;
};

const extractTianyiShareCodeAndAccessCode = (flag, urlRaw) => {
  const label = typeof flag === 'string' ? flag.trim() : '';
  const urlStr = typeof urlRaw === 'string' ? urlRaw.trim() : '';
  if (!label || !urlStr) return { shareCode: '', accessCode: '' };
  const firstSeg = (urlStr.split('#')[0] || '').trim();
  const idx = firstSeg.indexOf('$');
  const epUrl = idx >= 0 ? firstSeg.slice(idx + 1).trim() : firstSeg;
  const pass = parseMockPasscodeFromUrl(epUrl);
  // Some Tianyi interceptors encode shareCode/accessCode in the filename and keep a "-nopass" placeholder suffix:
  // - "<shareCode>_<accessCode>-nopass.mp4"
  // - "<shareCode>-<accessCode>.mp4"
  // Treat "-nopass" as a placeholder instead of a real accessCode.
  const normalizeTianyiPass = (raw) => {
    let t = typeof raw === 'string' ? raw.trim() : '';
    if (!t) return '';
    const lower = t.toLowerCase();
    if (lower.endsWith('-nopass')) t = t.slice(0, -7);
    else if (lower.endsWith('_nopass')) t = t.slice(0, -7);
    return t.trim();
  };
  const normPass = normalizeTianyiPass(pass);
  if (normPass) {
    if (normPass.includes('_')) {
      const [a, b] = normPass.split('_', 2);
      return { shareCode: String(a || '').trim(), accessCode: String(b || '').trim() };
    }
    if (normPass.includes('-')) {
      const [a, b] = normPass.split('-', 2);
      return { shareCode: String(a || '').trim(), accessCode: String(b || '').trim() };
    }
  }
  // Fallback: shareCode might already be embedded in the label like "天意-XXXX".
  const m = /天意-([A-Za-z0-9]{6,64})/.exec(label);
  const shareCode = m && m[1] ? String(m[1]).trim() : '';
  return { shareCode, accessCode: normPass || pass };
};

const resolvePanMockPlaySources = async ({ raw, playFrom, playUrl, onUpdate } = {}) => {
  const panMockEnabled = !!(raw && typeof raw === 'object' && raw.pan_mock);
  if (panMockEnabled) panMockEnabledHint.value = true;
  const fromStr = typeof playFrom === 'string' ? playFrom.trim() : '';
  const urlStr = typeof playUrl === 'string' ? playUrl.trim() : '';
  if (!panMockEnabled || !fromStr || !urlStr) {
    return { panMockEnabled, playFrom: fromStr, playUrl: urlStr, panMock189AccessByShareId: {} };
  }

  try {
    const splitTop = (s) => (s ? String(s || '').split('$$$') : []);
    const fromParts = splitTop(fromStr);
    const urlParts = splitTop(urlStr);
    const len = Math.max(fromParts.length, urlParts.length);

    const listReqsRaw = [];
    for (let i = 0; i < len; i += 1) {
      const baseLabel = (fromParts[i] || '').trim() || `源${i + 1}`;
      const baseUrl = (urlParts[i] || '').trim();
      if (!baseLabel || !baseUrl) continue;
      const fromSubs = baseLabel.includes('|||') ? baseLabel.split('|||').map((x) => String(x || '').trim()) : [baseLabel];
      const urlSubs = baseLabel.includes('|||') && baseUrl.includes('|||') ? baseUrl.split('|||').map((x) => String(x || '').trim()) : [baseUrl];
      const subLen = Math.max(fromSubs.length, urlSubs.length);
      for (let j = 0; j < subLen; j += 1) {
        const label = (fromSubs[j] || '').trim() || baseLabel;
        const u = (urlSubs[j] || '').trim();
        if (!label || !u) continue;
        const provider = panMockProviderFromFlag(label);
        if (!provider) continue;
        if (provider === '189') {
          const { shareCode, accessCode } = extractTianyiShareCodeAndAccessCode(label, u);
          if (!shareCode) continue;
          listReqsRaw.push({ provider: '189', label, flag: `天意-${shareCode}`, accessCode: accessCode || '' });
          continue;
        }
        const firstSeg = (u.split('#')[0] || '').trim();
        const idx = firstSeg.indexOf('$');
        const epUrl = idx >= 0 ? firstSeg.slice(idx + 1).trim() : firstSeg;
        const pass = parseMockPasscodeFromUrl(epUrl);
        listReqsRaw.push({ provider, label, flag: label, passcode: pass || '' });
      }
    }

    if (!listReqsRaw.length) return { panMockEnabled, playFrom: fromStr, playUrl: urlStr, panMock189AccessByShareId: {} };

    const listReqs = new Map();
    listReqsRaw.forEach((it) => {
      const p = it && it.provider ? String(it.provider).trim() : '';
      const l = it && it.label ? String(it.label).trim() : '';
      if (!p || !l) return;
      const key = `${p}::${l}`;
      if (!listReqs.has(key)) listReqs.set(key, it);
    });

    const resolvedVodByKey = new Map(); // `${provider}::${label}` -> vod_play_url
    const tianyiAccessByShareId = new Map();
    const onPartial = typeof onUpdate === 'function' ? onUpdate : null;

    const computeOut = () => {
      const outFrom = [];
      const outUrl = [];
      for (let i = 0; i < len; i += 1) {
        const baseLabel = (fromParts[i] || '').trim() || `源${i + 1}`;
        const baseUrl = (urlParts[i] || '').trim();
        if (!baseLabel || !baseUrl) continue;
        const hasSubs = baseLabel.includes('|||') && baseUrl.includes('|||');
        const fromSubs = baseLabel.includes('|||') ? baseLabel.split('|||').map((x) => String(x || '').trim()) : [baseLabel];
        const urlSubs = hasSubs ? baseUrl.split('|||').map((x) => String(x || '').trim()) : [baseUrl];
        const subLen = Math.max(fromSubs.length, urlSubs.length);
        const nextFromSubs = [];
        const nextUrlSubs = [];
        for (let j = 0; j < subLen; j += 1) {
          const label = (fromSubs[j] || '').trim() || baseLabel;
          const u = (urlSubs[j] || '').trim();
          if (!label || !u) continue;
          const provider = panMockProviderFromFlag(label);
          if (!provider) {
            nextFromSubs.push(label);
            nextUrlSubs.push(u);
            continue;
          }
          const hit = resolvedVodByKey.get(`${provider}::${label}`) || '';
          if (hit) {
            nextFromSubs.push(label);
            nextUrlSubs.push(hit);
          } else {
            nextFromSubs.push(label);
            nextUrlSubs.push(u);
          }
        }
        outFrom.push(nextFromSubs.join('|||'));
        outUrl.push(nextUrlSubs.join('|||'));
      }
      return {
        panMockEnabled,
        playFrom: outFrom.join('$$$') || fromStr,
        playUrl: outUrl.join('$$$') || urlStr,
        panMock189AccessByShareId: Object.fromEntries(Array.from(tianyiAccessByShareId.entries())),
      };
    };

    const emitPartial = () => {
      if (!onPartial) return;
      try {
        onPartial(computeOut());
      } catch (_e) {}
    };

    const callList = async (req) => {
      const provider = req && req.provider ? String(req.provider).trim() : '';
      const label = req && req.label ? String(req.label).trim() : '';
      if (!provider || !label) return;

      const call = async (path, body) => {
        const resp = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body || {}),
          credentials: 'include',
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data || data.ok === false) return null;
        return data && typeof data === 'object' ? data : null;
      };

      const flag = req && req.flag ? String(req.flag).trim() : '';
      const passcode = req && req.passcode ? String(req.passcode).trim() : '';
      const accessCode = req && req.accessCode ? String(req.accessCode).trim() : '';

      let data = null;
      if (provider === 'quark') data = await call('/api/pan/quark/list', { flag: flag || label, passcode });
      else if (provider === 'uc') data = await call('/api/pan/uc/list', { flag: flag || label, passcode });
      else if (provider === 'baidu') data = await call('/api/pan/baidu/list', { flag: flag || label, pwd: passcode });
      else if (provider === '139') data = await call('/api/pan/139/list', { flag: flag || label, passcode: passcode || '' });
      else if (provider === '189') data = await call('/api/pan/189/list', { flag: flag || label, accessCode });
      if (!data) return;

      const vod = typeof data.vod_play_url === 'string' ? String(data.vod_play_url || '').trim() : '';
      if (!vod) return;
      resolvedVodByKey.set(`${provider}::${label}`, vod);

      if (provider === '189' && accessCode) {
        try {
          vod.split('#').forEach((segRaw) => {
            const seg = String(segRaw || '').trim();
            if (!seg) return;
            const dollarIdx = seg.indexOf('$');
            if (dollarIdx < 0) return;
            const id = seg.slice(dollarIdx + 1).trim();
            const parts = id.split('*');
            const shareId = parts.length >= 2 ? String(parts[1] || '').trim() : '';
            if (!shareId) return;
            if (!tianyiAccessByShareId.has(shareId)) tianyiAccessByShareId.set(shareId, accessCode);
          });
        } catch (_e) {}
      }

      emitPartial();
    };

    const tasks = Array.from(listReqs.values()).map((req) => callList(req));
    await Promise.allSettled(tasks);
    const finalOut = computeOut();
    if (finalOut && finalOut.panMock189AccessByShareId && typeof finalOut.panMock189AccessByShareId === 'object') {
      const prev = panMock189AccessByShareIdHint.value && typeof panMock189AccessByShareIdHint.value === 'object' ? panMock189AccessByShareIdHint.value : {};
      panMock189AccessByShareIdHint.value = { ...prev, ...finalOut.panMock189AccessByShareId };
    }
    return finalOut;
  } catch (_e) {
    return { panMockEnabled, playFrom: fromStr, playUrl: urlStr, panMock189AccessByShareId: {} };
  }
};

const magicEpisodeRules = computed(() => {
  const list = effectiveBootstrapSettings.value && Array.isArray(effectiveBootstrapSettings.value.magicEpisodeRules)
    ? effectiveBootstrapSettings.value.magicEpisodeRules
    : [];
  return list
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean);
});

const magicMovieRules = computed(() => {
  const listRaw = effectiveBootstrapSettings.value ? effectiveBootstrapSettings.value.magicMovieRules : null;
  const list = Array.isArray(listRaw) ? listRaw : [];
  return list
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean);
});

const magicEpisodeCleanRegexRules = computed(() => {
  const listRaw = effectiveBootstrapSettings.value ? effectiveBootstrapSettings.value.magicEpisodeCleanRegexRules : null;
  if (Array.isArray(listRaw)) {
    return listRaw.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
  }
  return [];
});

const magicAggregateRegexRules = computed(() => {
  const listRaw = effectiveBootstrapSettings.value ? effectiveBootstrapSettings.value.magicAggregateRegexRules : null;
  const list = Array.isArray(listRaw) ? listRaw : [];
  return list
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean);
});

// Users often paste patterns that contain doubled backslashes like `\\d` (from JSON/JS literals).
// Normalize common escapes: treat `\\d` as `\d`, `\\[` as `\[`, etc.
const normalizeRegexText = (text) => {
  const raw = typeof text === 'string' ? text : '';
  if (!raw) return '';
  return raw.replace(/\\\\(?=[dDsSwWbB.()[\]{}+*?^$|\\\-_/])/g, '\\');
};

const compiledMagicEpisodeCleanRegexRules = computed(() => {
  const list = Array.isArray(magicEpisodeCleanRegexRules.value) ? magicEpisodeCleanRegexRules.value : [];
  if (!list.length) return [];

  const compile = (pattern, flags) => {
    const p = typeof pattern === 'string' ? pattern : '';
    if (!p) return null;
    const f = typeof flags === 'string' ? flags : '';
    const withGlobal = f.includes('g') ? f : `${f}g`;
    try {
      return new RegExp(normalizeRegexText(p), withGlobal || 'g');
    } catch (_e) {
      return null;
    }
  };

  return list
    .map((raw) => {
      const s = typeof raw === 'string' ? raw.trim() : '';
      if (!s) return null;
      const asLiteral = s.startsWith('/') && s.lastIndexOf('/') > 0;
      if (asLiteral) {
        const last = s.lastIndexOf('/');
        const pattern = s.slice(1, last);
        const flags = s.slice(last + 1) || 'i';
        return compile(pattern, flags);
      }
      return compile(s, 'i');
    })
    .filter(Boolean);
});

const compiledMagicAggregateRegexRules = computed(() => {
  const list = Array.isArray(magicAggregateRegexRules.value) ? magicAggregateRegexRules.value : [];
  if (!list.length) return [];

  const compile = (pattern, flags) => {
    const p = typeof pattern === 'string' ? pattern : '';
    if (!p) return null;
    const f = typeof flags === 'string' ? flags : '';
    const withGlobal = f.includes('g') ? f : `${f}g`;
    try {
      return new RegExp(normalizeRegexText(p), withGlobal || 'g');
    } catch (_e) {
      return null;
    }
  };

  return list
    .map((raw) => {
      const s = typeof raw === 'string' ? raw.trim() : '';
      if (!s) return null;
      const asLiteral = s.startsWith('/') && s.lastIndexOf('/') > 0;
      if (asLiteral) {
        const last = s.lastIndexOf('/');
        const pattern = s.slice(1, last);
        const flags = s.slice(last + 1) || 'i';
        return compile(pattern, flags);
      }
      return compile(s, 'i');
    })
    .filter(Boolean);
});

const compileMagicRule = (ruleText) => {
  const raw = typeof ruleText === 'string' ? ruleText.trim() : '';
  if (!raw) return null;

  const compileRegex = (pattern, flags) => {
    const p = typeof pattern === 'string' ? pattern : '';
    if (!p) return null;
    const f = typeof flags === 'string' && flags ? flags : 'i';
    try {
      return new RegExp(p, f);
    } catch (_e) {
      return null;
    }
  };

  // Allow JSON rule strings like:
  //   {"pattern":"...","replace":"...","flags":"i"}
  // `replace` can use `\\1` (python-style) and will be normalized to `$1` for JS.
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && typeof obj.pattern === 'string') {
        const re = compileRegex(obj.pattern, obj.flags);
        if (!re) return null;
        const replaceRaw = typeof obj.replace === 'string' ? obj.replace : '';
        const replace = replaceRaw ? replaceRaw.replace(/\\(\d+)/g, '$$$1') : '';
        return { re, replace };
      }
    } catch (_e) {
      // fall through
    }
  }

  const asLiteral = raw.startsWith('/') && raw.lastIndexOf('/') > 0;
  if (asLiteral) {
    const last = raw.lastIndexOf('/');
    const pattern = raw.slice(1, last);
    const flags = raw.slice(last + 1);
    const re = compileRegex(pattern, flags);
    return re ? { re, replace: '' } : null;
  }

  const re = compileRegex(raw, 'i');
  return re ? { re, replace: '' } : null;
};

const compiledMagicEpisodeRules = computed(() => {
  return magicEpisodeRules.value.map(compileMagicRule).filter(Boolean);
});

const compiledMagicMovieRules = computed(() => {
  return magicMovieRules.value.map(compileMagicRule).filter(Boolean);
});

const hasMagicEpisodeRules = computed(() => compiledMagicEpisodeRules.value.length > 0);

const smartSourceExtractPrioritySetting = computed(() => {
  const raw = effectiveBootstrapSettings.value.smartSourceExtractPriority;
  const text = typeof raw === 'string' ? raw.trim() : String(raw || '').trim();

	  const mode = (() => {
	    if (text === '网盘') return '网盘';
	    if (text === '关键字') return '关键字';
	    return '无';
	  })();

	  const explicit = mode === '网盘' ? ['网盘'] : mode === '关键字' ? ['关键字'] : [];
	  const order = mode === '关键字' ? ['关键字', '网盘'] : ['网盘'];
	  return { mode, explicit, order };
	});

const smartSourcePriorityTokensSetting = computed(() => {
  const list = effectiveBootstrapSettings.value.smartSourcePriorityTokens;
  if (!Array.isArray(list)) return [];
  return list.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
});

const smartPanMatchTokensSetting = computed(() => {
  const list = effectiveBootstrapSettings.value.smartPanMatchTokens;
  if (!Array.isArray(list)) return [];
  return list.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
});

const tmdbMode = computed(() => {
  const id = Number(props.tmdbId || 0);
  const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
  return Number.isFinite(id) && id > 0 && (typRaw === 'tv' || typRaw === 'movie');
});

const tmdbMovieMode = computed(() => {
  if (!tmdbMode.value) return false;
  const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
  return typRaw === 'movie';
});

watch(
  () => `${props.tmdbType || ''}::${String(props.tmdbId || '')}`,
  () => refreshDoubanSeasonMeta(),
  { immediate: true }
);

const tmdbFetchState = { key: '', seq: 0, inFlight: null };

const fetchTMDBMetaIfNeeded = async () => {
  if (!tmdbMode.value) {
    tmdbMeta.value = null;
    return;
  }
	  const id = Number(props.tmdbId || 0);
	  const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
	  const typ = typRaw;
	  const k = `${typRaw}::${id}`;

  if (tmdbFetchState.inFlight && tmdbFetchState.key === k) {
    await tmdbFetchState.inFlight;
    return;
  }

  tmdbFetchState.seq += 1;
  const seqAtCall = tmdbFetchState.seq;
  tmdbFetchState.key = k;
	  tmdbFetchState.inFlight = (async () => {
	    try {
	      const data = await apiGetJson(`/api/tmdb/detail${buildQuery({ id, type: typ })}`, { cacheMs: 10 * 60 * 1000 });
	      if (seqAtCall !== tmdbFetchState.seq) return;
	      if (!data || data.success !== true) throw new Error((data && (data.error || data.message)) || 'TMDB 请求失败');
	      const meta = {
	        tmdbId: Number.isFinite(Number(data.id)) ? Number(data.id) : id,
	        mediaType: typeof data.type === 'string' ? data.type.trim() : typ,
	        title: typeof data.title === 'string' ? data.title.trim() : '',
	        year: Number.isFinite(Number(data.year)) ? Math.floor(Number(data.year)) : 0,
	        pic: typeof data.poster === 'string' ? data.poster.trim() : '',
	        overview: typeof data.overview === 'string' ? data.overview.trim() : '',
	        badge: typeof data.badge === 'string' ? data.badge.trim() : '',
	        status: typeof data.status === 'string' ? data.status.trim() : '',
	        latestSeason: Number.isFinite(Number(data.latestSeason)) ? Math.floor(Number(data.latestSeason)) : 0,
	        latestEpisode: Number.isFinite(Number(data.latestEpisode)) ? Math.floor(Number(data.latestEpisode)) : 0,
	        episodeCount: Number.isFinite(Number(data.episodeCount)) ? Math.floor(Number(data.episodeCount)) : 0,
	        seasons: Array.isArray(data.seasons) ? data.seasons : [],
	      };
      tmdbMeta.value = meta;
	    if (meta && meta.overview) introText.value = meta.overview;
	  } catch (_e) {
	      if (seqAtCall === tmdbFetchState.seq) tmdbMeta.value = null;
	  } finally {
      if (tmdbFetchState.key === k && tmdbFetchState.seq === seqAtCall) tmdbFetchState.inFlight = null;
    }
  })();
  await tmdbFetchState.inFlight;
};


const playDebugText = computed(() => {
  if (!debugEnabled.value) return '';
  const p = props || {};
  const tm = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const seasons = tm && Array.isArray(tm.seasons) ? tm.seasons : [];
  const tmdbSeasonCount = (Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : []).filter((s) => s && Number(s.season) > 0).length;
  const tabs = Array.isArray(seasonTabs.value) ? seasonTabs.value : [];
  const settings = effectiveBootstrapSettings.value || {};
  const rules = Array.isArray(settings.magicEpisodeRules) ? settings.magicEpisodeRules : [];
  const cleanRules = Array.isArray(settings.magicEpisodeCleanRegexRules) ? settings.magicEpisodeCleanRegexRules : [];
  const pickDbg = tmdbSmartLastPickDebug.value && typeof tmdbSmartLastPickDebug.value === 'object' ? tmdbSmartLastPickDebug.value : null;
  const sources = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
  const pans = Array.isArray(sitePanOptions.value) ? sitePanOptions.value : [];
  const now = Date.now();
  let smartDetailCacheOk = 0;
  let smartDetailCacheFail = 0;
  let smartDetailCacheCooldown = 0;
  try {
    tmdbSmartDetailCache.forEach((v) => {
      if (!v) return;
      if (v.ok === false) {
        smartDetailCacheFail += 1;
        const nextRetryAt = Number.isFinite(Number(v.nextRetryAt)) ? Number(v.nextRetryAt) : 0;
        if (nextRetryAt > 0 && now < nextRetryAt) smartDetailCacheCooldown += 1;
        return;
      }
      if (v.episodeMap && v.episodeMapLoose && v.pans) smartDetailCacheOk += 1;
    });
  } catch (_e) {}
  const panLabels = pans
    .slice(0, 10)
    .map((x) => (x && x.label != null ? String(x.label).trim() : ''))
    .filter(Boolean)
    .join(',');
	  const lines = [
	    `debug=1`,
	    `tmdbId=${Number(p.tmdbId || 0)}`,
	    `tmdbType=${String(p.tmdbType || '')}`,
	    `searchType=${String(p.searchType || '')}`,
	    `tmdbMode=${tmdbMode.value ? '1' : '0'}`,
	    `doubanSeasonOverride=${doubanSeasonOverrideActive.value ? '1' : '0'}`,
	    `doubanSeasonCount=${dm && Number.isFinite(Number(dm.seasonCount)) ? Math.floor(Number(dm.seasonCount)) : 0}`,
	    `doubanSeasonItems=${dm && Array.isArray(dm.seasons) ? dm.seasons.length : 0}`,
	    `contentKind=${String(contentKind.value || '')}`,
	    `introError=${introError.value ? '1' : '0'}`,
	    `playError=${playError.value ? '1' : '0'}`,
	    `playerRuntimeError=${playerRuntimeError.value ? '1' : '0'}`,
	    `isSmartPanActive=${isSmartPanActive.value ? '1' : '0'}`,
	    `tmdbFetchKey=${String(tmdbFetchState.key || '')}`,
	    `tmdbMetaType=${tm && tm.mediaType ? String(tm.mediaType) : ''}`,
	    `tmdbMetaSeasons=${seasons.length}`,
	    `tmdbSeasonTabsFromMeta=${tmdbSeasonCount}`,
    `tmdbMetaLatest=${tm ? `${Number(tm.latestSeason || 0)}-${Number(tm.latestEpisode || 0)}` : ''}`,
    `tmdbMetaCount=${tm ? Number(tm.episodeCount || 0) : 0}`,
    `tmdbLatestEpisode=${tmdbLatestEpisode.value}`,
    `tmdbSmartEpisodeCount=${tmdbSmartEpisodeCount.value}`,
    `tmdbSmartEpisodes=${Array.isArray(tmdbSmartEpisodes.value) ? tmdbSmartEpisodes.value.length : 0}`,
    `magicEpisodeRules=${rules.length}`,
    `magicEpisodeCleanRules=${cleanRules.length}`,
    `tmdbSmartListAvailable=${tmdbSmartListAvailable.value ? '1' : '0'}`,
    `rawListMode=${rawListMode.value ? '1' : '0'}`,
    `forceRawListMode=${forceRawListMode.value ? '1' : '0'}`,
    `selectedPan=${String(selectedPanKey.value || '')}`,
    `selectedSeason=${Number(selectedSeason.value || 0)}`,
    `seasonTabs=${tabs.map((t) => t && t.label ? t.label : '').filter(Boolean).join(',')}`,
    `panOptions=${pans.length}`,
    `panLabels=${panLabels}`,
    `aggregatedSources=${sources.length}`,
    `smartDetailCacheOk=${smartDetailCacheOk}`,
    `smartDetailCacheFail=${smartDetailCacheFail}`,
    `smartDetailCacheCooldown=${smartDetailCacheCooldown}`,
    `sourcesLoading=${sourcesLoading.value ? '1' : '0'}`,
    `sourcesSearchDone=${sourcesSearchDone.value ? '1' : '0'}`,
    `sourcesQueue=${sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0}`,
    `smartPick=${pickDbg ? JSON.stringify(pickDbg) : ''}`,
  ];
  return lines.join('\n');
});

watch(
  () => `${tmdbMode.value ? '1' : '0'}|${(props.videoPoster || '').trim()}|${(props.videoTitle || '').trim()}|${String(props.videoYear || '').trim()}|${(props.videoRemark || '').trim()}`,
  () => {
    if (!tmdbMode.value) return;
    const poster = typeof props.videoPoster === 'string' ? props.videoPoster.trim() : '';
    const title = typeof props.videoTitle === 'string' ? props.videoTitle.trim() : '';
    const year = typeof props.videoYear === 'string' ? props.videoYear.trim() : '';
    const remark = typeof props.videoRemark === 'string' ? props.videoRemark.trim() : '';

    if (title && !detail.value.title) detail.value.title = title;
    if (poster && !detail.value.poster) detail.value.poster = poster;
    if (year && !detail.value.year) detail.value.year = year;
    if (remark && !detail.value.remark) detail.value.remark = remark;
  },
  { immediate: true }
);

const compiledSmartSourcePriorityTokenGroups = computed(() => {
  const rawKeyword = Array.isArray(smartSourcePriorityTokensSetting.value) ? smartSourcePriorityTokensSetting.value : [];
  const keywordTokens = [];
  const keywordSeen = new Set();
  rawKeyword.forEach((t) => {
    const s = typeof t === 'string' ? t.trim() : '';
    if (!s) return;
    const key = s.toLowerCase();
    if (!key || keywordSeen.has(key)) return;
    keywordSeen.add(key);
    keywordTokens.push(key);
  });

	  return { keywordTokens, qualityTokens: [], fpsTokens: [] };
	});

const compiledSmartSourcePriorityTokens = computed(() => {
  const { keywordTokens, qualityTokens, fpsTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
  const priorityOrder =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];

  const tokenGroups = {
    画质: Array.isArray(qualityTokens) ? qualityTokens : [],
    帧率: Array.isArray(fpsTokens) ? fpsTokens : [],
    关键字: Array.isArray(keywordTokens) ? keywordTokens : [],
  };

  const prefix = [];
  priorityOrder.forEach((key) => {
    if (key === '网盘') return;
    const group = tokenGroups[key];
    if (Array.isArray(group) && group.length) prefix.push(...group);
  });

  const out = [];
  const seen = new Set();
  prefix.forEach((t) => {
    const s = typeof t === 'string' ? t.trim().toLowerCase() : '';
    if (!s || seen.has(s)) return;
    seen.add(s);
    out.push(s);
  });
  return out;
});

const compiledSmartPanMatchTokens = computed(() => {
  const list = Array.isArray(smartPanMatchTokensSetting.value) ? smartPanMatchTokensSetting.value : [];
  const out = [];
  const seen = new Set();
  list.forEach((t) => {
    const s = typeof t === 'string' ? t.trim() : '';
    if (!s) return;
    const key = s.toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(key);
  });
  return out;
});

const matchesAnyMagicRule = (text, rules) => {
  const normalizeForMagic = (input) => {
    const raw = typeof input === 'string' ? input : '';
    if (!raw) return '';
    return raw
      .trim()
      .replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)))
      .replace(/\s+/g, ' ');
  };

  const s = normalizeForMagic(text);
  const list = Array.isArray(rules) ? rules : [];
  if (!s || !list.length) return false;
  for (let i = 0; i < list.length; i += 1) {
    const re = list[i] && list[i].re ? list[i].re : null;
    if (!re) continue;
    try {
      if (re.global || re.sticky) re.lastIndex = 0;
    } catch (_e) {}
    if (re.test(s)) return true;
  }
  const sNoSpace = s.replace(/\s+/g, '');
  if (sNoSpace && sNoSpace !== s) {
    for (let i = 0; i < list.length; i += 1) {
      const re = list[i] && list[i].re ? list[i].re : null;
      if (!re) continue;
      try {
        if (re.global || re.sticky) re.lastIndex = 0;
      } catch (_e) {}
      if (re.test(sNoSpace)) return true;
    }
  }
  return false;
};

const isInformativeEpisodeText = (text) => {
  const s = typeof text === 'string' ? text.trim() : '';
  if (!s) return false;
  const rules = compiledMagicEpisodeRules.value;
  if (!Array.isArray(rules) || !rules.length) return true;
  return matchesAnyMagicRule(s, rules);
};

const buildCandidateLowerText = (texts) => {
  const list = Array.isArray(texts) ? texts : [];
  if (!list.length) return '';
  const seen = new Set();
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    const t = list[i] != null ? String(list[i]).trim() : '';
    if (!t) continue;
    const key = t.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out.join(' ');
};

const extractEpisodeCandidateTexts = (ep) => {
  const rawNames = [];
  if (ep && ep.url != null) {
    const list = extractRawNamesFromEpisodeUrl(String(ep.url || ''));
    list.forEach((n) => {
      const s = String(n || '').trim();
      if (s) rawNames.push(s);
    });
  }

  const displayName = ep && ep.name != null ? String(ep.name || '').trim() : '';
  const rawLooksUseful = rawNames.some((n) => isInformativeEpisodeText(n));

  const out = [];
  const push = (s) => {
    const v = typeof s === 'string' ? s.trim() : '';
    if (!v) return;
    if (!out.includes(v)) out.push(v);
  };

  if (!rawLooksUseful && displayName) push(displayName);
  rawNames.forEach((n) => push(n));
  if (ep && ep.name != null) {
    if (rawLooksUseful) push(displayName);
  }
  return out;
};

	const contentKind = computed(() => {
	  if (tmdbMode.value) {
	    const typ = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
	    if (typ === 'movie') return 'movie';
	    if (typ === 'tv') return 'series';
  }

  const pans = sitePanOptions.value;
  if (!Array.isArray(pans) || !pans.length) return 'unknown';

  const maxPerPan = 20;
  const maxTotal = 80;
  let seen = 0;

  const episodeRules = compiledMagicEpisodeRules.value;
  if (Array.isArray(episodeRules) && episodeRules.length) {
    for (let p = 0; p < pans.length && seen < maxTotal; p += 1) {
      const eps = pans[p] && Array.isArray(pans[p].episodes) ? pans[p].episodes : [];
      const take = Math.min(maxPerPan, eps.length);
      for (let i = 0; i < take && seen < maxTotal; i += 1) {
        const ep = eps[i];
        const candidates = extractEpisodeCandidateTexts(ep);
        if (candidates.some((t) => matchesAnyMagicRule(t, episodeRules))) return 'series';
        seen += 1;
      }
    }
  }

  for (let p = 0; p < pans.length && seen < maxTotal; p += 1) {
    const eps = pans[p] && Array.isArray(pans[p].episodes) ? pans[p].episodes : [];
    const take = Math.min(maxPerPan, eps.length);
    for (let i = 0; i < take && seen < maxTotal; i += 1) {
      const ep = eps[i];
      const candidates = extractEpisodeCandidateTexts(ep);
      seen += 1;
    }
  }

  // If it's a single-pan source with many items, prefer "unknown" so we can
  // fall back to episode extraction (unknown>10) instead of being classified as movie
  // by a single "year-style" filename mixed into a mostly-numeric list.
  if (pans.length === 1 && maxPanEpisodeCount.value > 10) return 'unknown';

  const movieRules = compiledMagicMovieRules.value;
  if (Array.isArray(movieRules) && movieRules.length) {
    seen = 0;
    for (let p = 0; p < pans.length && seen < maxTotal; p += 1) {
      const eps = pans[p] && Array.isArray(pans[p].episodes) ? pans[p].episodes : [];
      const take = Math.min(maxPerPan, eps.length);
      for (let i = 0; i < take && seen < maxTotal; i += 1) {
        const ep = eps[i];
        const candidates = extractEpisodeCandidateTexts(ep);
        if (candidates.some((t) => matchesAnyMagicRule(t, movieRules))) return 'movie';
        seen += 1;
      }
    }
  }

  return 'unknown';
});

function computeHistoryContentKey(title) {
  const raw = typeof title === 'string' ? title : String(title || '');
  if (!raw) return '';
  const rules = compiledMagicAggregateRegexRules.value;
  let out = raw;
  if (Array.isArray(rules) && rules.length) {
    rules.forEach((re) => {
      if (!re) return;
      try {
        if (re.global || re.sticky) re.lastIndex = 0;
      } catch (_e) {}
      try {
        out = out.replace(re, '');
      } catch (_e) {}
    });
  }
  return normalizeForAggKey(out);
}

const forceRawListMode = computed(() => {
  if (contentKind.value === 'movie') return true;
  return false;
});

watch(
  () => `${contentKind.value}|${forceRawListMode.value ? '1' : '0'}`,
  () => {
    if (!forceRawListMode.value) return;
    rawListMode.value = true;
    autoRawListMode.value = false;
  },
  { immediate: true }
);

watch(
  () => `${tmdbSmartListAvailable.value ? '1' : '0'}|${selectedPanKey.value}`,
  () => {
    if (!tmdbSmartListAvailable.value) return;
    if (selectedPanKey.value !== SMART_PAN_KEY) return;
    rawListMode.value = false;
    autoRawListMode.value = false;
  },
  { immediate: true }
);

const computePriorityMatch = (textLower, tokensLower) => {
  const text = typeof textLower === 'string' ? textLower : '';
  const tokens = Array.isArray(tokensLower) ? tokensLower : [];
  const indices = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (!t) continue;
    if (text.includes(t)) indices.push(i);
  }
  return { count: indices.length, indices };
};

const comparePriorityMatch = (a, b) => {
  const ac = a && Number.isFinite(Number(a.count)) ? Number(a.count) : 0;
  const bc = b && Number.isFinite(Number(b.count)) ? Number(b.count) : 0;
  if (ac !== bc) return bc - ac; // more matches first
  const ai = a && Array.isArray(a.indices) ? a.indices : [];
  const bi = b && Array.isArray(b.indices) ? b.indices : [];
  const n = Math.min(ai.length, bi.length);
  for (let i = 0; i < n; i += 1) {
    const av = Number(ai[i]);
    const bv = Number(bi[i]);
    if (av !== bv) return av - bv; // earlier token first
  }
  return ai.length - bi.length;
};

const cleanMagicEpisodeText = (text, cleanRules) => {
  const s = typeof text === 'string' ? text.trim() : '';
  if (!s || !Array.isArray(cleanRules) || !cleanRules.length) return s;
  try {
    let out = s;
    cleanRules.forEach((re) => {
      if (!re) return;
      out = out.replace(re, '');
    });
    return out.replace(/\s+/g, ' ').trim();
  } catch (_e) {
    return s;
  }
};

const parseChineseNumeralToInt = (text) => {
  const raw = typeof text === 'string' ? text : String(text || '');
  const s = raw.replace(/\s+/g, '').replace(/两/g, '二').replace(/〇/g, '零');
  if (!s) return 0;

  const digit = (ch) => {
    switch (ch) {
      case '零':
        return 0;
      case '一':
        return 1;
      case '二':
        return 2;
      case '三':
        return 3;
      case '四':
        return 4;
      case '五':
        return 5;
      case '六':
        return 6;
      case '七':
        return 7;
      case '八':
        return 8;
      case '九':
        return 9;
      default:
        return -1;
    }
  };

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
      let unit = 0;
      if (ch === '十') unit = 10;
      else if (ch === '百') unit = 100;
      else if (ch === '千') unit = 1000;
      else if (ch === '零') unit = 0;
      else return NaN;

      if (!unit) continue;
      if (!num) num = 1;
      total += num * unit;
      num = 0;
    }
    return total + num;
  };

  if (s.includes('万')) {
    const parts = s.split('万');
    if (!parts.length || parts.length > 2) return 0;
    const left = parts[0] || '';
    const right = parts[1] || '';
    const a = left ? parseSection(left) : 0;
    const b = right ? parseSection(right) : 0;
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
    const n = a * 10000 + b;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  const n = parseSection(s);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

const extractSeasonEpisodeFromText = (text, rules, cleanRules) => {
  const s = cleanMagicEpisodeText(text, cleanRules);
  if (!s || !Array.isArray(rules) || !rules.length) return { season: 0, episode: 0 };
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    const re = rule && rule.re ? rule.re : null;
    if (!re) continue;
    const m = s.match(re);
    if (!m) continue;

    if (rule && rule.replace) {
      let normalized = '';
      try {
        normalized = s.replace(re, rule.replace);
      } catch (_e) {
        normalized = '';
      }
      const mm = normalized.match(/(?:S(\d{1,2}))?\s*E(\d{1,3})/i);
      if (mm && mm[2]) {
        const seasonRaw = mm[1] ? Number.parseInt(String(mm[1]), 10) : 0;
        const episodeRaw = Number.parseInt(String(mm[2]), 10);
        const season = Number.isFinite(seasonRaw) && seasonRaw >= 0 && seasonRaw <= 99 ? seasonRaw : 0;
        const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
        if (episode) return { season, episode };
      }
    }

    const seasonFrom = (val) => {
      const ss = typeof val === 'string' ? val : String(val || '');
      const sm = ss.match(/S(\d{1,2})/i);
      if (!sm || !sm[1]) return 0;
      const n = Number.parseInt(String(sm[1]), 10);
      return Number.isFinite(n) && n >= 0 && n <= 99 ? n : 0;
    };
    const picked =
      (m.length > 2 && m[2] != null ? String(m[2]) : '') ||
      (m.length > 1 && m[1] != null ? String(m[1]) : '') ||
      String(m[0] || '');
    const season = seasonFrom(m.length > 1 ? m[1] : '') || seasonFrom(picked) || seasonFrom(m[0] || '') || 0;
    const digits = String(picked || '').trim().replace(/\D+/g, '');
    if (digits) {
      const episode = Number.parseInt(digits, 10);
      if (Number.isFinite(episode) && episode >= 1 && episode <= 99999) return { season, episode };
      continue;
    }

    const cn = String(picked || '').match(/第\s*([一二三四五六七八九十百千两零〇万]{1,16})\s*(?:集|话|回|期)/);
    if (!cn || !cn[1]) continue;
    const episode = parseChineseNumeralToInt(cn[1]);
    if (Number.isFinite(episode) && episode >= 1 && episode <= 99999) return { season, episode };
  }
  return { season: 0, episode: 0 };
};

const extractSeasonEpisodeFromCandidates = (candidates, rules, cleanRules) => {
  const list = Array.isArray(candidates) ? candidates : [];
  for (let i = 0; i < list.length; i += 1) {
    const r = extractSeasonEpisodeFromText(list[i], rules, cleanRules);
    if (r && r.episode) return r;
  }
  return { season: 0, episode: 0 };
};

const smartPanEpisodes = computed(() => {
  if (!hasMagicEpisodeRules.value) return [];

  const panTokenOrder = compiledSmartPanMatchTokens.value;
  if (!Array.isArray(panTokenOrder) || panTokenOrder.length < 2) return [];

  const rawPans = sitePanOptions.value;
  if (!Array.isArray(rawPans) || rawPans.length < 2) return [];

  const priorityExplicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const priorityOrder =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];
  const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};

  const labelTokenIdxOf = (label) => {
    const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
    if (!s) return -1;
    for (let i = 0; i < panTokenOrder.length; i += 1) {
      const t = panTokenOrder[i];
      if (t && s.includes(t)) return i;
    }
    return -1;
  };

  const candidatePans = [];
  const tokenSet = new Set();
  rawPans.forEach((pan) => {
    if (!pan || !pan.label || !Array.isArray(pan.episodes) || !pan.episodes.length) return;
    const idx = labelTokenIdxOf(pan.label);
    if (idx < 0) return;
    tokenSet.add(idx);
    candidatePans.push({ pan, tokenIdx: idx });
  });
  if (tokenSet.size < 2) return [];

  const rules = compiledMagicEpisodeRules.value;
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;
  if (!Array.isArray(rules) || !rules.length) return [];

  const candidates = [];
  const matchSeasonSet = new Set();

  const enhanceTokens = ['60fps', '60帧', 'hdr', 'ddp', '臻彩'];
  const guessQualityRank = (hayLower) => {
    const s = String(hayLower || '');
    if (/(2160p|2160|4k)/i.test(s)) return 3;
    if (/(1080p|1080)/i.test(s)) return 2;
    if (/(720p|720)/i.test(s)) return 1;
    return 0;
  };
  const guessFps60 = (hayLower) => {
    const s = String(hayLower || '');
    return /60\s*fps/i.test(s) || s.includes('60帧');
  };

  candidatePans.forEach(({ pan, tokenIdx }) => {
    const eps = Array.isArray(pan.episodes) ? pan.episodes : [];
    eps.forEach((ep, index) => {
      if (!ep || !ep.url) return;
      const url = String(ep.url || '').trim();
      if (!url) return;
      const name = ep && ep.name != null ? String(ep.name) : '';
      const rawNames = extractRawNamesFromEpisodeUrl(url);
      const matchTexts = [name, ...rawNames].filter(Boolean);
      const rawText = (rawNames[0] || name || '').trim();
      const candidateLower = buildCandidateLowerText(matchTexts) || String(rawText || '').toLowerCase();

      const match = extractSeasonEpisodeFromCandidates(matchTexts, rules, cleanRules);
      const normalizedMatch = normalizeMaybeGlobalSeasonEpisode(match);
      const episodeNo = normalizedMatch && Number.isFinite(Number(normalizedMatch.episode)) ? Math.floor(Number(normalizedMatch.episode)) : 0;
      if (episodeNo <= 0) return;
      const seasonNo = normalizedMatch && Number.isFinite(Number(normalizedMatch.season)) ? Math.floor(Number(normalizedMatch.season)) : 0;
      if (seasonNo > 0) matchSeasonSet.add(seasonNo);

      const enhanceMatch = computePriorityMatch(candidateLower, enhanceTokens);
      const enhanceIdx = enhanceMatch && Array.isArray(enhanceMatch.indices) ? enhanceMatch.indices : [];
      const qualityRank = guessQualityRank(candidateLower);
      const fps60 = guessFps60(candidateLower) || enhanceIdx.includes(0) || enhanceIdx.includes(1);
      const hasHdr = enhanceIdx.includes(2) || candidateLower.includes('hdr');
      const tierRank = (() => {
        if (qualityRank === 3 && hasHdr && fps60) return 65;
        if (qualityRank === 3 && hasHdr) return 60;
        if (qualityRank === 3 && fps60) return 55;
        if (qualityRank === 3) return 50;
        if (qualityRank === 2) return 40;
        if (qualityRank === 1) return 30;
        return 10;
      })();

      candidates.push({
        tokenIdx,
        panLabel: String(pan.label || '').trim(),
        index,
        ep,
        matchSeason: seasonNo,
        episodeNo,
        __smartQualityRank: qualityRank,
        __smartFps60: !!fps60,
        __smartTierRank: tierRank,
        __smartEnhanceMatch: enhanceMatch,
        matchKeyword: computePriorityMatch(candidateLower, Array.isArray(keywordTokens) ? keywordTokens : []),
      });
    });
  });
  if (!candidates.length) return [];

  const multiSeason = matchSeasonSet.size >= 2;

  const byKey = new Map();
  candidates.forEach((c) => {
    const episodeNo = c.episodeNo;
    if (!episodeNo) return;

    if (!multiSeason) {
      const key = `E${episodeNo}`;
      const list = byKey.get(key) || [];
      list.push({ ...c, key, seasonForKey: 0, episodeForKey: episodeNo });
      byKey.set(key, list);
      return;
    }

    const seasonPicked = c.matchSeason > 0 ? c.matchSeason : 0;
    if (!seasonPicked) return;
    const key = `S${seasonPicked}E${episodeNo}`;
    const list = byKey.get(key) || [];
    list.push({ ...c, key, seasonForKey: seasonPicked, episodeForKey: episodeNo });
    byKey.set(key, list);
  });

  const countCriteriaMatches = (c) => {
    if (!c) return 0;
    let n = 0;
    for (let i = 0; i < priorityExplicit.length; i += 1) {
      const key = priorityExplicit[i];
      if (key === '网盘') {
        if (Number.isFinite(Number(c.tokenIdx)) && Number(c.tokenIdx) >= 0) n += 1;
      } else if (key === '关键字' && c.matchKeyword && c.matchKeyword.count > 0) n += 1;
    }
    return n;
  };

  const compareByCriteria = (a, b) => {
    if (!a || !b) return 0;
    const at = Number(a.__smartTierRank) || 0;
    const bt = Number(b.__smartTierRank) || 0;
    if (at !== bt) return bt - at;
    const am = countCriteriaMatches(a);
    const bm = countCriteriaMatches(b);
    if (am !== bm) return bm - am; // more big-condition matches first
    for (let i = 0; i < priorityOrder.length; i += 1) {
      const c = priorityOrder[i];
      if (c === '网盘') {
        if ((a.tokenIdx || 0) !== (b.tokenIdx || 0)) return (a.tokenIdx || 0) - (b.tokenIdx || 0);
        continue;
      }
      const q =
        c === '关键字' ? comparePriorityMatch(a && a.matchKeyword, b && b.matchKeyword) : 0;
      if (q) return q;
    }
    return (a.index || 0) - (b.index || 0);
  };

  const pickBest = (list) => {
    if (!Array.isArray(list) || !list.length) return null;
    const sorted = list.slice().sort(compareByCriteria);
    return sorted[0] || null;
  };

  const pad2 = (n) => String(Math.max(0, Math.min(99, Number(n) || 0))).padStart(2, '0');
  const padEp = (n) => {
    const x = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0;
    if (x <= 99) return String(x).padStart(2, '0');
    if (x <= 999) return String(x).padStart(3, '0');
    return String(x);
  };

  const chosen = [];
  byKey.forEach((list) => {
    const items = Array.isArray(list) ? list.filter(Boolean) : [];
    if (!items.length) return;
    const hasSeasoned = items.some((it) => it && Number(it.matchSeason) > 0);
    const picked = pickBest(hasSeasoned ? items.filter((it) => it && Number(it.matchSeason) > 0) : items);
    if (!picked || !picked.ep || !picked.ep.url) return;
    chosen.push(picked);
  });
  if (!chosen.length) return [];

  chosen.sort((a, b) => {
    if (!multiSeason) return a.episodeForKey - b.episodeForKey;
    if (a.seasonForKey !== b.seasonForKey) return a.seasonForKey - b.seasonForKey;
    return a.episodeForKey - b.episodeForKey;
  });

  return chosen.map((c) => {
    const season = multiSeason ? Number(c.seasonForKey) || 0 : 0;
    const episode = Number(c.episodeForKey) || 0;
    const name = multiSeason ? `S${pad2(season)}E${padEp(episode)}` : `第${episode}集`;
    return { ...c.ep, name };
  });
});

const smartSeriesListAvailable = computed(() => Array.isArray(smartPanEpisodes.value) && smartPanEpisodes.value.length > 0);

const normalizeMovieDedupBase = (text) => {
  const raw = typeof text === 'string' ? text : '';
  if (!raw) return '';
  let s = raw.toLowerCase();
  s = s.replace(/【[^】]*】/g, ' ');
  s = s.replace(/\[[^\]]*\]/g, ' ');
  s = s.replace(/\([^)]+\)/g, ' ');
  s = s.replace(/\.[a-z0-9]{1,6}\s*$/i, ' ');
  s = s.replace(/[._-]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
};

const extractMovieSignatureParts = (textLower) => {
  const s = typeof textLower === 'string' ? textLower : '';
  if (!s) return [];
  const parts = [];
  if (/\b8k\b/.test(s) || /\b4320p\b/.test(s)) parts.push('8k');
  if (/\b4k\b/.test(s) || /\b2160p\b/.test(s)) parts.push('2160p');
  if (/\b1080p\b/.test(s)) parts.push('1080p');
  if (/\b720p\b/.test(s)) parts.push('720p');
  if (/\b60\s*fps\b/.test(s) || /60\s*帧/.test(s)) parts.push('60fps');
  if (/\b120\s*fps\b/.test(s) || /120\s*帧/.test(s)) parts.push('120fps');
  if (/\b(?:x265|h\.?265|hevc)\b/.test(s)) parts.push('h265');
  if (/\b(?:x264|h\.?264|avc)\b/.test(s)) parts.push('h264');
  if (/\bhdr10\+\b/.test(s)) parts.push('hdr10+');
  else if (/\bhdr10\b/.test(s)) parts.push('hdr10');
  else if (/\bhdr\b/.test(s)) parts.push('hdr');
  if (/\b(?:dv|dolby\s*vision)\b/.test(s)) parts.push('dv');
  if (/\batmos\b/.test(s)) parts.push('atmos');
  if (/\bddp\b/.test(s)) parts.push('ddp');
  return parts;
};

const smartMovieEpisodes = computed(() => {
  if (contentKind.value !== 'movie') return [];
  const rules = compiledMagicMovieRules.value;
  if (!Array.isArray(rules) || !rules.length) return [];

  const priorityExplicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const priorityOrder =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];
  const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
  const pans = sitePanOptions.value;
  if (!Array.isArray(pans) || !pans.length) return [];

  const candidates = [];
  const panTokenOrder = compiledSmartPanMatchTokens.value;
  const labelTokenIdxOf = (label) => {
    const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
    if (!s) return -1;
    for (let i = 0; i < panTokenOrder.length; i += 1) {
      const t = panTokenOrder[i];
      if (t && s.includes(t)) return i;
    }
    return -1;
  };
  pans.forEach((pan, panIdx) => {
    const eps = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
    eps.forEach((ep, index) => {
      if (!ep || !ep.url) return;
      const url = String(ep.url || '').trim();
      if (!url) return;
      const rawNames = extractRawNamesFromEpisodeUrl(url);
      const name = ep && ep.name != null ? String(ep.name) : '';
      const rawText = (rawNames[0] || name || '').trim();
      const candidatesText = extractEpisodeCandidateTexts(ep);
      if (!candidatesText.length) return;
      if (!candidatesText.some((t) => matchesAnyMagicRule(t, rules))) return;

      const rawLower = rawText.toLowerCase();
      const enhanceMatch = computePriorityMatch(rawLower, ['60fps', '60帧', 'hdr', 'ddp', '臻彩']);
      const enhanceIdx = enhanceMatch && Array.isArray(enhanceMatch.indices) ? enhanceMatch.indices : [];
      const qualityRank = (() => {
        if (/(2160p|2160|4k)/i.test(rawLower)) return 3;
        if (/(1080p|1080)/i.test(rawLower)) return 2;
        if (/(720p|720)/i.test(rawLower)) return 1;
        return 0;
      })();
      const fps60 = /60\s*fps/i.test(rawLower) || rawLower.includes('60帧') || enhanceIdx.includes(0) || enhanceIdx.includes(1);
      const hasHdr = enhanceIdx.includes(2) || rawLower.includes('hdr');
      const tierRank = (() => {
        if (qualityRank === 3 && hasHdr && fps60) return 65;
        if (qualityRank === 3 && hasHdr) return 60;
        if (qualityRank === 3 && fps60) return 55;
        if (qualityRank === 3) return 50;
        if (qualityRank === 2) return 40;
        if (qualityRank === 1) return 30;
        return 10;
      })();
      const tokenIdx = labelTokenIdxOf(pan && pan.label != null ? String(pan.label) : '');
      candidates.push({
        panIdx,
        tokenIdx,
        index,
        ep,
        url,
        rawText: rawText || name || url,
        rawLower: rawLower || '',
        __smartQualityRank: qualityRank,
        __smartFps60: !!fps60,
        __smartTierRank: tierRank,
        __smartEnhanceMatch: enhanceMatch,
        matchKeyword: computePriorityMatch(rawLower || '', Array.isArray(keywordTokens) ? keywordTokens : []),
        dedupBase: normalizeMovieDedupBase(rawLower || ''),
        sig: extractMovieSignatureParts(rawLower || '').join('|'),
      });
    });
  });
  if (!candidates.length) return [];

  const countCriteriaMatches = (c) => {
    if (!c) return 0;
    let n = 0;
    for (let i = 0; i < priorityExplicit.length; i += 1) {
      const key = priorityExplicit[i];
      if (key === '网盘') {
        if (Number.isFinite(Number(c.tokenIdx)) && Number(c.tokenIdx) >= 0) n += 1;
      } else if (key === '关键字' && c.matchKeyword && c.matchKeyword.count > 0) n += 1;
    }
    return n;
  };

  const compareByCriteria = (a, b) => {
    if (!a || !b) return 0;
    const at = Number(a.__smartTierRank) || 0;
    const bt = Number(b.__smartTierRank) || 0;
    if (at !== bt) return bt - at;
    const am = countCriteriaMatches(a);
    const bm = countCriteriaMatches(b);
    if (am !== bm) return bm - am;
    for (let i = 0; i < priorityOrder.length; i += 1) {
      const key = priorityOrder[i];
      if (key === '网盘') {
        const at = Number.isFinite(Number(a.tokenIdx)) ? Number(a.tokenIdx) : 99999;
        const bt = Number.isFinite(Number(b.tokenIdx)) ? Number(b.tokenIdx) : 99999;
        if (at !== bt) return at - bt;
        continue;
      }
      const q =
        key === '关键字' ? comparePriorityMatch(a.matchKeyword, b.matchKeyword) : 0;
      if (q) return q;
    }
    if ((a.panIdx || 0) !== (b.panIdx || 0)) return (a.panIdx || 0) - (b.panIdx || 0);
    return (a.index || 0) - (b.index || 0);
  };

  const better = (a, b) => {
    const q = compareByCriteria(a, b);
    return q <= 0 ? a : b;
  };

  const byUrl = new Map();
  candidates.forEach((c) => {
    const k = c.url;
    const prev = byUrl.get(k);
    byUrl.set(k, prev ? better(prev, c) : c);
  });

  const byKey = new Map();
  Array.from(byUrl.values()).forEach((c) => {
    const key = `${c.dedupBase || ''}::${c.sig || ''}`;
    const prev = byKey.get(key);
    byKey.set(key, prev ? better(prev, c) : c);
  });

  const out = Array.from(byKey.values());
  out.sort(compareByCriteria);

  return out.map((c) => {
    const ep = c && c.ep ? c.ep : {};
    const name = c && c.rawText ? c.rawText : (ep && ep.name != null ? String(ep.name) : '');
    return { ...ep, name };
  });
});

const extractMaxEpisodeFromBadgeText = (text) => {
  const s = typeof text === 'string' ? text.trim() : '';
  if (!s) return 0;
  const m = s.match(/(?:更新至|更至|更)?\s*(\d{1,5})\s*(?:集|话|回|期|EP|E)\b/i);
  if (!m || !m[1]) return 0;
  const n = Number.parseInt(String(m[1]), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const doubanSeasonOverrideActive = computed(() => {
  if (!tmdbMode.value) return false;
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const typ = (m && typeof m.mediaType === 'string' ? m.mediaType : String(props.tmdbType || '')).trim().toLowerCase();
  if (typ !== 'tv') return false;

  const list = m && Array.isArray(m.seasons) ? m.seasons : [];
  const metaSeasonSet = new Set();
  list.forEach((it) => {
    if (!it || typeof it !== 'object') return;
    const s = Number.isFinite(Number(it.season)) ? Math.floor(Number(it.season)) : 0;
    if (s > 0) metaSeasonSet.add(s);
  });
  if (metaSeasonSet.size >= 2) return false;

  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const cnt = dm && Number.isFinite(Number(dm.seasonCount)) ? Math.floor(Number(dm.seasonCount)) : 0;
  const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
  return cnt >= 2 && seasons.length >= 2;
});

const tmdbSeasons = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const list = m && Array.isArray(m.seasons) ? m.seasons : [];
  const out = [];
  list.forEach((it) => {
    if (!it || typeof it !== 'object') return;
    const s = Number.isFinite(Number(it.season)) ? Math.floor(Number(it.season)) : 0;
    const n = Number.isFinite(Number(it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0;
    if (s < 0 || n < 0) return;
    out.push({ season: s, episodeCount: n, airDate: typeof it.airDate === 'string' ? it.airDate.trim() : '' });
  });
  out.sort((a, b) => a.season - b.season);
  if (doubanSeasonOverrideActive.value) {
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
    const over = seasons
      .map((s) => ({
        season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
        episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
        airDate: '',
      }))
      .filter((s) => s.season > 0 && s.episodeCount > 0)
      .sort((a, b) => a.season - b.season);
    if (over.length >= 2) return over;
  }
  return out;
});

const tmdbGlobalEpisodeNoOf = (seasonNo, episodeNo) => {
  const s = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;
  const e = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (s <= 0 || e <= 0) return 0;
  const seasons = tmdbSeasons.value;
  if (!Array.isArray(seasons) || !seasons.length) return e;
  let sum = 0;
  for (let i = 0; i < seasons.length; i += 1) {
    const it = seasons[i];
    if (!it) continue;
    const sn = Number.isFinite(Number(it.season)) ? Number(it.season) : 0;
    if (sn <= 0) continue;
    if (sn < s) sum += Math.max(0, Number(it.episodeCount) || 0);
    else if (sn === s) return sum + e;
  }
  return sum + e;
};

const tmdbSeasonEpisodeOfGlobal = (globalNo) => {
  const g = Number.isFinite(Number(globalNo)) ? Math.floor(Number(globalNo)) : 0;
  if (g <= 0) return { season: 0, episode: 0 };
  const seasons = tmdbSeasons.value;
  if (!Array.isArray(seasons) || !seasons.length) return { season: 0, episode: g };
  let left = g;
  for (let i = 0; i < seasons.length; i += 1) {
    const it = seasons[i];
    if (!it) continue;
    const sn = Number.isFinite(Number(it.season)) ? Math.floor(Number(it.season)) : 0;
    const cnt = Number.isFinite(Number(it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0;
    if (sn <= 0 || cnt <= 0) continue;
    if (left > cnt) {
      left -= cnt;
      continue;
    }
    return { season: sn, episode: left };
  }
  return { season: 0, episode: g };
};

// Some releases tag "SxxEyy" where yy is actually a GLOBAL episode number (cumulative),
// e.g. when a season has <= 24 eps but filename shows "S03E48", which should map to "S03E01"
// if earlier seasons have 47 episodes in total.
const normalizeMaybeGlobalSeasonEpisode = ({ season = 0, episode = 0 } = {}) => {
  const s = Number.isFinite(Number(season)) ? Math.floor(Number(season)) : 0;
  const e = Number.isFinite(Number(episode)) ? Math.floor(Number(episode)) : 0;
  if (e <= 0) return { season: s, episode: 0 };
  if (s <= 0) return { season: 0, episode: e };
  const seasons = tmdbSeasons.value;
  if (!Array.isArray(seasons) || !seasons.length) return { season: s, episode: e };
  const seasonCount = (() => {
    const hit = seasons.find((it) => it && Number(it.season) === s) || null;
    const n = hit && Number.isFinite(Number(hit.episodeCount)) ? Math.floor(Number(hit.episodeCount)) : 0;
    return n > 0 ? n : 0;
  })();
  if (!seasonCount || e <= seasonCount) return { season: s, episode: e };
  const mapped = tmdbSeasonEpisodeOfGlobal(e);
  if (!mapped || !mapped.episode) return { season: s, episode: e };
  if (mapped.season && mapped.season !== s) return { season: s, episode: e };
  if (mapped.episode > seasonCount) return { season: s, episode: e };
  return { season: s, episode: mapped.episode };
};

const maxEpisodeFromSourceBadges = computed(() => {
  let max = 0;
  max = Math.max(max, extractMaxEpisodeFromBadgeText(props.videoRemark || ''));
  const sources = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
  sources.forEach((s) => {
    if (!s) return;
    const r = typeof s.videoRemark === 'string' ? s.videoRemark : '';
    const n = extractMaxEpisodeFromBadgeText(r);
    if (n > max) max = n;
  });
  return max;
});

const tmdbLatestEpisode = computed(() => {
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  if (!m) return 0;
  const latestSeason = Number.isFinite(Number(m.latestSeason)) ? Math.floor(Number(m.latestSeason)) : 0;
  const latestEpisode = Number.isFinite(Number(m.latestEpisode)) ? Math.floor(Number(m.latestEpisode)) : 0;
  if (latestSeason > 0 && latestEpisode > 0) return tmdbGlobalEpisodeNoOf(latestSeason, latestEpisode);
  const badge = m && typeof m.badge === 'string' ? m.badge : '';
  const c = extractMaxEpisodeFromBadgeText(badge);
  if (c > 0) return c;
  const seasons = tmdbSeasons.value;
  if (Array.isArray(seasons) && seasons.length) {
    const sum = seasons.reduce((acc, it) => acc + Math.max(0, Number(it.episodeCount) || 0), 0);
    if (sum > 0) return sum;
  }
  const b = Number.isFinite(Number(m.episodeCount)) ? Math.floor(Number(m.episodeCount)) : 0;
  return Math.max(0, b);
});

const tmdbSmartEpisodeCount = computed(() => {
  if (!tmdbMode.value) return 0;
  const base = tmdbLatestEpisode.value;
  const extra = maxEpisodeFromSourceBadges.value;
  if (base > 0 && extra === base + 1) return extra;
  if (base <= 0) return Math.max(0, extra);
  return Math.max(0, base);
});

const tmdbSmartEpisodes = computed(() => {
  const total = tmdbSmartEpisodeCount.value;
  if (!total) return [];
  const out = [];
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const status = m && typeof m.status === 'string' ? m.status.trim() : '';
  const ended = status === 'Ended' || doubanSeasonOverrideActive.value;
  const latestSeason = m && Number.isFinite(Number(m.latestSeason)) ? Math.floor(Number(m.latestSeason)) : 0;
  const latestEpInSeason = m && Number.isFinite(Number(m.latestEpisode)) ? Math.floor(Number(m.latestEpisode)) : 0;
  const seasons = tmdbSeasons.value.filter((s) => s && Number(s.season) > 0);
  const baseGlobal = tmdbLatestEpisode.value;

  if (!seasons.length) {
    for (let i = 1; i <= total; i += 1) out.push({ name: `第${i}集`, url: `tmdb_ep:${i}`, __tmdbEpisode: i, __tmdbSeason: 1, __tmdbSeasonEpisode: i });
    return out;
  }

  let globalIdx = 0;
  for (let i = 0; i < seasons.length; i += 1) {
    const s = seasons[i];
    const sn = Number(s.season) || 0;
    const cnt = Math.max(0, Number(s.episodeCount) || 0);
    let aired = cnt;
    if (!ended && latestSeason > 0) {
      if (sn < latestSeason) aired = cnt;
      else if (sn === latestSeason) aired = Math.min(cnt || latestEpInSeason, latestEpInSeason || cnt);
      else aired = 0;
    }
    for (let ep = 1; ep <= aired; ep += 1) {
      globalIdx += 1;
      out.push({
        name: `第${ep}集`,
        url: `tmdb_ep:${globalIdx}`,
        __tmdbEpisode: globalIdx,
        __tmdbSeason: sn,
        __tmdbSeasonEpisode: ep,
      });
      if (globalIdx >= total) return out;
    }
  }

  if (total === baseGlobal + 1 && latestSeason > 0) {
    globalIdx = baseGlobal;
    const extraGlobal = baseGlobal + 1;
    const extraSeason = latestSeason;
    const extraEp = Math.max(1, latestEpInSeason + 1);
    out.push({
      name: `第${extraEp}集`,
      url: `tmdb_ep:${extraGlobal}`,
      __tmdbEpisode: extraGlobal,
      __tmdbSeason: extraSeason,
      __tmdbSeasonEpisode: extraEp,
    });
  }

  return out;
});

const tmdbSmartListAvailable = computed(() => {
  if (!tmdbMode.value) return false;
  if (tmdbMovieMode.value) return false;
  return tmdbSmartEpisodeCount.value > 0;
});

const tmdbMovieSmartListAvailable = computed(() => {
  if (!tmdbMovieMode.value) return false;
  return Array.isArray(tmdbMovieSmartEpisodes.value) && tmdbMovieSmartEpisodes.value.length > 0;
});

const tmdbHistoryRemark = computed(() => {
  const maxEp = tmdbSmartEpisodeCount.value;
  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const base = m && typeof m.badge === 'string' ? m.badge.trim() : '';
  const typ = m && typeof m.mediaType === 'string' ? m.mediaType.trim().toLowerCase() : String(props.tmdbType || '').trim().toLowerCase();
  if (typ === 'movie') {
    const y = m && Number.isFinite(Number(m.year)) && Number(m.year) > 0 ? String(Math.floor(Number(m.year))) : '';
    return y || base || '';
  }
  if (typ === 'tv') {
    const status = m && typeof m.status === 'string' ? m.status.trim() : '';
    if (status === 'Ended') {
      const epCount = m && Number.isFinite(Number(m.episodeCount)) && Number(m.episodeCount) > 0 ? Math.floor(Number(m.episodeCount)) : 0;
      const seasonCount = (Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : []).filter((s) => s && Number(s.season) > 0).length;
      if (epCount > 0) {
        if (seasonCount >= 2) return `共${seasonCount}季${epCount}集`;
        return `共${epCount}集`;
      }
    }
  }
  if (maxEp > 0) return `更新至${maxEp}集`;
  return base;
});

const smartListEpisodes = computed(() => {
  if (tmdbSmartListAvailable.value) return tmdbSmartEpisodes.value;
  if (tmdbMovieSmartListAvailable.value) return tmdbMovieSmartEpisodes.value;
  if (contentKind.value === 'movie') return smartMovieEpisodes.value;
  return smartPanEpisodes.value;
});

const smartListAvailable = computed(() => {
  if (tmdbSmartListAvailable.value) return true;
  if (tmdbMovieSmartListAvailable.value) return true;
  if (contentKind.value === 'movie') return Array.isArray(smartMovieEpisodes.value) && smartMovieEpisodes.value.length > 0;
  return smartSeriesListAvailable.value;
});

const parseLooseSeasonEpisodeFromText = (text) => {
  const s = typeof text === 'string' ? text.trim() : '';
  if (!s) return { season: 0, episode: 0 };

  const se = s.match(/(?:S(\d{1,2}))?\s*E(\d{1,5})/i);
  if (se && se[2]) {
    const seasonRaw = se[1] ? Number.parseInt(String(se[1]), 10) : 0;
    const episodeRaw = Number.parseInt(String(se[2]), 10);
    const season = Number.isFinite(seasonRaw) && seasonRaw >= 0 && seasonRaw <= 99 ? seasonRaw : 0;
    const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
    if (episode) return normalizeMaybeGlobalSeasonEpisode({ season, episode });
  }

  const cn = s.match(/第\s*(\d{1,5})\s*(?:集|话|回)/);
  if (cn && cn[1]) {
    const episode = Number.parseInt(String(cn[1]), 10);
    if (Number.isFinite(episode) && episode >= 1 && episode <= 99999) return { season: 0, episode };
  }

  const ep = s.match(/(?:ep|episode|e)\s*(\d{1,5})/i);
  if (ep && ep[1]) {
    const episode = Number.parseInt(String(ep[1]), 10);
    if (Number.isFinite(episode) && episode >= 1 && episode <= 99999) return { season: 0, episode };
  }

  const groups = s.match(/\d{1,5}/g) || [];
  if (!groups.length) return { season: 0, episode: 0 };
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const n = Number.parseInt(String(groups[i]), 10);
    if (!Number.isFinite(n) || n <= 0 || n > 99999) continue;
    if (n >= 1900 && n <= 2100) continue;
    return { season: 0, episode: n };
  }
  return { season: 0, episode: 0 };
};

// For magic matching:
// - raw list ALWAYS shows all episodes (no filtering)
// - episode buttons ONLY show episodes that match a rule (extracting season/episode)
const episodeMatchByIndex = computed(() => {
  if (tmdbSmartListAvailable.value && selectedPanKey.value !== SMART_PAN_KEY && rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  if (!eps.length) return [];
  const rules = compiledMagicEpisodeRules.value;
  if (!rules.length) return eps.map((_ep, idx) => ({ season: 0, episode: idx + 1 }));
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  return eps.map((ep, idx) => {
    const tmdbSeason = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
    const tmdbEp = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
    if (tmdbSeason > 0 && tmdbEp > 0) return { season: tmdbSeason, episode: tmdbEp };
    const candidates = [];
    if (ep && ep.name != null) candidates.push(String(ep.name));
    if (ep && ep.url != null) {
      const rawNames = extractRawNamesFromEpisodeUrl(String(ep.url));
      if (rawNames[0]) candidates.push(rawNames[0]);
    }
    return normalizeMaybeGlobalSeasonEpisode(extractSeasonEpisodeFromCandidates(candidates, rules, cleanRules));
  });
});

const pickResumeEpisodeIndex = ({ wantedSeason = 0, wantedEpisode = 0, wantedIndex = 0 } = {}) => {
  const eps = selectedEpisodes.value;
  const total = Array.isArray(eps) ? eps.length : 0;
  if (!total) return 0;

  const idxRaw = Number.isFinite(Number(wantedIndex)) ? Math.floor(Number(wantedIndex)) : 0;
  const idxFallback = Math.max(0, Math.min(idxRaw, total - 1));

  const desiredEpisodeRaw = Number.isFinite(Number(wantedEpisode)) ? Math.floor(Number(wantedEpisode)) : 0;
  const desiredEpisode = desiredEpisodeRaw > 0 ? desiredEpisodeRaw : 0;
  if (!desiredEpisode) return idxFallback;

  const desiredSeasonRaw = Number.isFinite(Number(wantedSeason)) ? Math.floor(Number(wantedSeason)) : 0;
  const desiredSeason = desiredSeasonRaw > 0 ? desiredSeasonRaw : 0;

  const matches = episodeMatchByIndex.value;
  const list = Array.isArray(matches) ? matches : [];

  const pickFromMatches = (seasonConstraint) => {
    let bestBelow = null; // { epNo, idx }
    let bestAbove = null; // { epNo, idx }
    for (let i = 0; i < list.length; i += 1) {
      const m = list[i];
      const epNo = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
      if (epNo <= 0) continue;
      const seasonNo = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      if (seasonConstraint > 0 && seasonNo !== seasonConstraint) continue;

      if (epNo <= desiredEpisode) {
        if (!bestBelow || epNo > bestBelow.epNo) bestBelow = { epNo, idx: i };
      } else {
        if (!bestAbove || epNo < bestAbove.epNo) bestAbove = { epNo, idx: i };
      }
    }
    if (bestBelow) return bestBelow.idx;
    if (bestAbove) return bestAbove.idx;
    return null;
  };

  const picked = pickFromMatches(desiredSeason);
  if (picked != null) return picked;
  const pickedAnySeason = pickFromMatches(0);
  if (pickedAnySeason != null) return pickedAnySeason;
  return idxFallback;
};

const normalizeEpisodeNameForExactMatch = (name) => {
  const s = typeof name === 'string' ? name : String(name || '');
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
};

const pickExactResumeEpisodeIndexFromName = (episodeName, cleanRules) => {
  const want = normalizeEpisodeNameForExactMatch(episodeName);
  if (!want) return null;
  const eps = selectedEpisodes.value;
  const total = Array.isArray(eps) ? eps.length : 0;
  if (!total) return null;

  const candidatesOf = (ep) => {
    const out = [];
    if (ep && ep.name != null) out.push(String(ep.name));
    if (ep && ep.url != null) {
      const rawNames = extractRawNamesFromEpisodeUrl(String(ep.url));
      rawNames.forEach((n) => {
        if (n) out.push(String(n));
      });
    }
    return out;
  };

  // Pass 1: strict normalized equality.
  for (let idx = 0; idx < eps.length; idx += 1) {
    const list = candidatesOf(eps[idx]);
    for (let i = 0; i < list.length; i += 1) {
      if (normalizeEpisodeNameForExactMatch(list[i]) === want) return idx;
    }
  }

  // Pass 2: equality after applying user's clean regex rules (best-effort).
  const wantClean = normalizeEpisodeNameForExactMatch(cleanMagicEpisodeText(episodeName, cleanRules));
  if (wantClean) {
    for (let idx = 0; idx < eps.length; idx += 1) {
      const list = candidatesOf(eps[idx]);
      for (let i = 0; i < list.length; i += 1) {
        const candClean = normalizeEpisodeNameForExactMatch(cleanMagicEpisodeText(list[i], cleanRules));
        if (candClean === wantClean) return idx;
      }
    }
  }

  return null;
};

const allDisplayedEpisodes = computed(() => {
  if (forceRawListMode.value) return [];
  if (tmdbSmartListAvailable.value && selectedPanKey.value !== SMART_PAN_KEY && rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  const total = eps.length;
  if (!total) return [];
  const matches = episodeMatchByIndex.value;
  const hasMagic = hasMagicEpisodeRules.value;

  const items = [];
  let unmatchedCount = 0;
  for (let idx = 0; idx < eps.length; idx += 1) {
    const ep = eps[idx];
    const url = (ep && ep.url ? String(ep.url) : '').trim();
    const name = (ep && ep.name ? String(ep.name) : '').trim() || `第${idx + 1}集`;
    const m = matches && matches[idx] && typeof matches[idx] === 'object' ? matches[idx] : { season: 0, episode: 0 };
    const season = Number.isFinite(Number(m.season)) ? Number(m.season) : 0;
    const no = Number.isFinite(Number(m.episode)) ? Number(m.episode) : 0;

    if (hasMagic) {
      if (!Number.isFinite(no) || no <= 0) {
        unmatchedCount += 1;
        items.push({
          key: `${idx}-${url}`,
          index: idx,
          no: 0,
          season,
          name,
          url,
          unmatched: true,
          displayNo: unmatchedCount,
        });
        continue;
      }
      items.push({ key: `${idx}-${url}`, index: idx, no, season, name, url, unmatched: false, displayNo: no });
    } else {
      items.push({ key: `${idx}-${url}`, index: idx, no: idx + 1, season: 0, name, url, unmatched: false, displayNo: idx + 1 });
    }
  }

  if (!items.length) return [];

  if (hasMagic) {
    const recognized = items.filter((it) => it && !it.unmatched && Number.isFinite(Number(it.no)) && Number(it.no) > 0);
    const unrecognized = items.filter((it) => it && it.unmatched);

    const seasonSet = new Set();
    recognized.forEach((it) => {
      const s = it && Number.isFinite(Number(it.season)) ? Number(it.season) : 0;
      if (s > 0) seasonSet.add(s);
    });
    const multipleSeasons = seasonSet.size >= 2;

    recognized.sort((a, b) => {
      const saRaw = a && Number.isFinite(Number(a.season)) ? Number(a.season) : 0;
      const sbRaw = b && Number.isFinite(Number(b.season)) ? Number(b.season) : 0;
      const sa = multipleSeasons && saRaw === 0 ? 1000 : saRaw;
      const sb = multipleSeasons && sbRaw === 0 ? 1000 : sbRaw;
      if (multipleSeasons && sa !== sb) return sa - sb;
      return a.no === b.no ? a.index - b.index : a.no - b.no;
    });
    if (episodeDescending.value) recognized.reverse();
    return recognized.concat(unrecognized);
  }

  if (!episodeDescending.value) return items;
  return items.slice().reverse();
});

watch(
  () => `${episodeViewModeStorageKey.value}|${forceRawListMode.value ? '1' : '0'}|${selectedEpisodes.value.length}`,
  () => {
    const key = episodeViewModeStorageKey.value;
    if (!key) return;
    if (forceRawListMode.value) {
      rawListMode.value = true;
      autoRawListMode.value = false;
      return;
    }
    if (tmdbSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY) {
      rawListMode.value = false;
      autoRawListMode.value = false;
      return;
    }
    // Don't override the current session after the user explicitly toggled.
    if (viewModeTouchedKey.value === key) return;

    const saved = readEpisodeViewMode();
    rawListMode.value = saved === 'raw';
    autoRawListMode.value = false;
  },
  { immediate: true }
);

const seasonTabs = computed(() => {
  const list = allDisplayedEpisodes.value;
  if (!list.length) return [];
  const set = new Set();
  let hasZeroSeason = false;
  let hasSpecialSeason0 = false;
  const specialRe = /S0{1,2}\s*E\d{1,5}/i;
  list.forEach((it) => {
    const s = it && Number.isFinite(Number(it.season)) ? Number(it.season) : 0;
    if (s > 0) set.add(s);
    else {
      hasZeroSeason = true;
      if (!hasSpecialSeason0) {
        const candidates = [];
        if (it && it.name != null) candidates.push(String(it.name));
        if (it && it.url != null) {
          const rawNames = extractRawNamesFromEpisodeUrl(String(it.url));
          rawNames.forEach((n) => {
            if (n) candidates.push(String(n));
          });
        }
        if (candidates.some((t) => specialRe.test(String(t || '')))) hasSpecialSeason0 = true;
      }
    }
  });
  const seasons = Array.from(set).sort((a, b) => a - b);
  if (seasons.length < 2 && !(seasons.length >= 1 && hasSpecialSeason0)) return [];

  const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const labelOf = (s) => {
    const n = Number(s);
    if (!Number.isFinite(n) || n <= 0) return '未分季';
    if (n <= 10) return `第${cn[n]}季`;
    return `第${n}季`;
  };

  const tabs = seasons.map((s) => ({ key: `S${s}`, season: s, label: labelOf(s) }));
  if (hasZeroSeason) tabs.push({ key: 'S0', season: 0, label: hasSpecialSeason0 ? '特别篇' : '未分季' });
  return tabs;
});

const selectedSeason = ref(0);
watch(
  () => seasonTabs.value.map((t) => t.key).join(','),
  () => {
    const tabs = seasonTabs.value;
    if (!tabs.length) {
      selectedSeason.value = 0;
      return;
    }
    const exists = tabs.some((t) => Number(t.season) === Number(selectedSeason.value));
    if (!exists) selectedSeason.value = Number(tabs[0].season) || 0;
  },
  { immediate: true }
);

const selectSeason = (season) => {
  const n = Number(season);
  if (!Number.isFinite(n)) return;
  selectedSeason.value = n;
  selectedEpisodeGroup.value = '';
};

const displayedEpisodes = computed(() => {
  const list = allDisplayedEpisodes.value;
  const tabs = seasonTabs.value;
  if (!tabs.length) return list;
  return list.filter((it) => Number(it.season) === Number(selectedSeason.value));
});

const EPISODE_GROUP_SIZE = 50;
const UNRECOGNIZED_EPISODE_GROUP_KEY = 'g_unrecognized';

const episodeGroups = computed(() => {
  const hasMagic = hasMagicEpisodeRules.value;
  const list = displayedEpisodes.value;
  if (!list.length) return [];

  const makeLabel = (startNo, endNo) => {
    return episodeDescending.value ? `${endNo}-${startNo}` : `${startNo}-${endNo}`;
  };

  if (hasMagic) {
    const recognized = list.filter((it) => it && !it.unmatched && Number.isFinite(Number(it.no)) && Number(it.no) > 0);
    const unrecognized = list.filter((it) => it && it.unmatched);
    const maxNo = recognized.reduce((m, it) => (it && Number.isFinite(Number(it.no)) ? Math.max(m, Number(it.no)) : m), 0);
    if (!maxNo && !unrecognized.length) return [];
    const byIdx = new Map();
    recognized.forEach((it) => {
      const no = it && Number.isFinite(it.no) ? Number(it.no) : 0;
      if (!no) return;
      const idx = Math.floor((no - 1) / EPISODE_GROUP_SIZE);
      byIdx.set(idx, true);
    });
    const indices = Array.from(byIdx.keys()).sort((a, b) => a - b);
    const groups = indices.map((i) => {
      const startNo = i * EPISODE_GROUP_SIZE + 1;
      const endNo = Math.min(maxNo, (i + 1) * EPISODE_GROUP_SIZE);
      const key = `g${startNo}-${endNo}`;
      return { key, startNo, endNo, label: makeLabel(startNo, endNo) };
    });
    if (episodeDescending.value) groups.reverse();
    if (unrecognized.length) {
      groups.push({ key: UNRECOGNIZED_EPISODE_GROUP_KEY, startNo: 0, endNo: 0, label: '未识别分类', unrecognized: true });
    }
    return groups;
  }

  const total = selectedEpisodes.value.length;
  if (!total) return [];
  const groups = [];
  const count = Math.ceil(total / EPISODE_GROUP_SIZE);
  for (let i = 0; i < count; i += 1) {
    const startNo = i * EPISODE_GROUP_SIZE + 1;
    const endNo = Math.min(total, (i + 1) * EPISODE_GROUP_SIZE);
    const key = `g${startNo}-${endNo}`;
    groups.push({ key, startNo, endNo, label: makeLabel(startNo, endNo) });
  }
  if (episodeDescending.value) groups.reverse();
  return groups;
});

const selectedEpisodeGroup = ref('');
const selectedEpisodeGroupKey = computed(() => selectedEpisodeGroup.value || episodeGroups.value[0]?.key || '');

watch(
  () => String(selectedSeason.value),
  () => {
    if (!seasonTabs.value.length) return;
    selectedEpisodeGroup.value = '';
    scheduleUpdateHiddenEpisodeGroups();
  }
);

watch(
  () => episodeGroups.value.map((g) => g.key).join(','),
  () => {
    const groups = episodeGroups.value;
    if (!groups.length) {
      selectedEpisodeGroup.value = '';
      return;
    }
    const k = selectedEpisodeGroup.value;
    if (!k) return;
    const exists = groups.some((g) => g && g.key === k);
    if (!exists) selectedEpisodeGroup.value = '';
  },
  { immediate: true }
);

const groupedDisplayedEpisodes = computed(() => {
  const list = displayedEpisodes.value;
  const groups = episodeGroups.value;
  if (!list.length || !groups.length) return list;
  const g = groups.find((x) => x.key === selectedEpisodeGroupKey.value) || groups[0];
  if (!g) return list;
  if (g.key === UNRECOGNIZED_EPISODE_GROUP_KEY || g.unrecognized) {
    const unrecognized = list.filter((ep) => ep && ep.unmatched);
    return unrecognized.map((ep, idx) => {
      const displayNo = idx + 1;
      if (ep && ep.displayNo === displayNo) return ep;
      return { ...ep, displayNo };
    });
  }
  return list.filter((ep) => ep && ep.no >= g.startNo && ep.no <= g.endNo);
});

const episodeGroupTabsEl = ref(null);
const episodeGroupMoreEl = ref(null);
const episodeGroupMoreOpen = ref(false);
const episodeGroupHoverArmed = ref(false);
const hiddenEpisodeGroups = ref([]);

const updateHiddenEpisodeGroups = () => {
  try {
    const el = episodeGroupTabsEl.value;
    const groups = episodeGroups.value;
    if (!el || !groups.length) {
      hiddenEpisodeGroups.value = [];
      return;
    }
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    const nodes = Array.from(el.querySelectorAll('.episode-group-btn'));
    const hidden = [];
    nodes.forEach((btn, idx) => {
      const g = groups[idx];
      if (!g) return;
      const bLeft = btn.offsetLeft;
      const bRight = bLeft + btn.offsetWidth;
      const fullyVisible = bLeft >= left && bRight <= right;
      if (!fullyVisible) hidden.push(g);
    });
    hiddenEpisodeGroups.value = hidden;
  } catch (_e) {
    hiddenEpisodeGroups.value = [];
  }
};

let hiddenEpisodeGroupsRaf = 0;
const scheduleUpdateHiddenEpisodeGroups = () => {
  try {
    if (hiddenEpisodeGroupsRaf) cancelAnimationFrame(hiddenEpisodeGroupsRaf);
    hiddenEpisodeGroupsRaf = window.requestAnimationFrame(() => {
      hiddenEpisodeGroupsRaf = 0;
      updateHiddenEpisodeGroups();
    });
  } catch (_e) {}
};

const selectEpisodeGroup = (key) => {
  selectedEpisodeGroup.value = key;
  try {
    const el = episodeGroupTabsEl.value;
    if (!el) return;
    const idx = episodeGroups.value.findIndex((g) => g.key === key);
    if (idx < 0) return;
    const btn = el.querySelectorAll('.episode-group-btn')[idx];
    if (btn && typeof btn.scrollIntoView === 'function') {
      btn.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    scheduleUpdateHiddenEpisodeGroups();
  } catch (_e) {}
};

const normalizePlayPayload = (data) => {
  if (!data) return null;
  if (typeof data === 'string') {
    const t = data.trim();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch (_e) {
      return null;
    }
  }
  if (typeof data === 'object') return data;
  return null;
};

const pickFirstPlayableUrl = (payload) => {
  const direct = payload && typeof payload.url === 'string' ? payload.url.trim() : '';
  if (direct) return direct;

  const arr = payload && Array.isArray(payload.url) ? payload.url : [];
  if (arr.length >= 2) {
    const s0 = typeof arr[0] === 'string' ? arr[0].trim() : '';
    const s1 = typeof arr[1] === 'string' ? arr[1].trim() : '';
    if (!/^https?:\/\//i.test(s0) && /^https?:\/\//i.test(s1)) return s1;
  }
  for (const v of arr) {
    const s = typeof v === 'string' ? v.trim() : '';
    if (s && /^https?:\/\//i.test(s)) return s;
  }
  return '';
};

const rewriteProxyUrlToBase = (urlString, apiBase, tvUser) => {
  const raw = typeof urlString === 'string' ? urlString.trim() : '';
  if (!raw) return '';
  const normalized = normalizeCatPawOpenApiBase(apiBase);
  if (!normalized) return raw;
  try {
    const u = new URL(raw);
    const host = (u.hostname || '').toLowerCase();
    const loopback = ['127.0.0.1', '0.0.0.0', 'localhost'];
    const base = new URL(normalized);
    const baseHost = (base.hostname || '').toLowerCase();
    const isLoopback = loopback.includes(host);
    const isSameHost = host && baseHost && host === baseHost;
    const needsDeport = u.port === '3006' && base.port !== '3006';
    if (!isLoopback && !(isSameHost && needsDeport)) return raw;

    // Drop origin/port from CatPawOpen raw URL, then resolve against configured base
    // (this keeps any base-path prefix and avoids leaking :3006 when not configured).
    const next = new URL(String(u.pathname || '/').replace(/^\//, ''), normalized);
    next.search = u.search || '';
    next.hash = u.hash || '';

    const safeUser = typeof tvUser === 'string' ? tvUser.trim() : '';
    if (safeUser && !next.searchParams.has('__tvuser')) next.searchParams.set('__tvuser', safeUser);
    return next.toString();
  } catch (_e) {
    return raw;
  }
};

const rewritePlayPayloadUrls = (payload, apiBase, tvUser) => {
  if (!payload || typeof payload !== 'object') return payload;
  if (typeof payload.url === 'string') {
    const u = payload.url;
    const rewritten = rewriteProxyUrlToBase(u, apiBase, tvUser);
    if (rewritten && rewritten !== u) return { ...payload, url: rewritten };
    return payload;
  }
  if (!Array.isArray(payload.url)) return payload;

  const next = { ...payload, url: payload.url.slice() };
  for (let i = 0; i < next.url.length; i += 1) {
    const u = next.url[i];
    if (typeof u !== 'string') continue;
    if (u.includes(':3006') || u.includes('127.0.0.1') || u.includes('0.0.0.0') || u.toLowerCase().includes('localhost')) {
      next.url[i] = rewriteProxyUrlToBase(u, apiBase, tvUser) || u;
    }
  }
  return next;
};

const normalizeHttpBase = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return '';
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    u.search = '';
    u.hash = '';
    return u.toString().replace(/\/+$/g, '');
  } catch (_e) {
    return '';
  }
};

const normalizeGoProxyServers = (value) => {
  const list = Array.isArray(value) ? value : [];
  const out = [];
  const seen = new Set();
  for (const it of list) {
    let base = '';
    if (typeof it === 'string') {
      base = normalizeHttpBase(it);
    } else if (it && typeof it === 'object') {
      const rawBase =
        (typeof it.base === 'string' && it.base) ||
        (typeof it.apiBase === 'string' && it.apiBase) ||
        (typeof it.api === 'string' && it.api) ||
        (typeof it.url === 'string' && it.url) ||
        '';
      base = normalizeHttpBase(rawBase);
    }
    if (!base || seen.has(base)) continue;
    const pans = it && typeof it === 'object' && typeof it.pans === 'object' && it.pans ? it.pans : {};
    const hasBaidu = Object.prototype.hasOwnProperty.call(pans, 'baidu');
    const hasQuark = Object.prototype.hasOwnProperty.call(pans, 'quark');
    out.push({
      base,
      label: (() => {
        if (it && typeof it === 'object') {
          const d = it.displayName != null ? String(it.displayName).trim() : '';
          if (d) return d;
          const n = it.name != null ? String(it.name).trim() : '';
          if (n) return n;
        }
        try {
          const u = new URL(base);
          return u.host || base;
        } catch (_e) {
          return base;
        }
      })(),
      pans: {
        baidu: hasBaidu ? !!pans.baidu : true,
        quark: hasQuark ? !!pans.quark : true,
      },
    });
    seen.add(base);
  }
  return out;
};

const GO_PROXY_SELECTED_BASE_STORAGE_KEY = 'meowfilm:goproxy:selectedBase';

const goProxyManualBase = ref('');
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    goProxyManualBase.value = normalizeHttpBase(window.localStorage.getItem(GO_PROXY_SELECTED_BASE_STORAGE_KEY) || '');
  }
} catch (_e) {
  goProxyManualBase.value = '';
}

const goProxyInUseBase = ref('');
const lastGoProxyCandidate = ref(null);

const guessPreferredPanFromFlag = (flag) => {
  const raw = typeof flag === 'string' ? flag.trim() : '';
  if (!raw) return '';
  if (raw.includes('百度')) return 'baidu';
  const lower = raw.toLowerCase();
  if (raw.includes('夸父') || raw.includes('夸克') || lower.includes('quark') || lower.includes('kuafu')) return 'quark';
  return '';
};

const joinBaseUrl = (base, relativePath) => {
  const b = normalizeHttpBase(base);
  const rel = typeof relativePath === 'string' ? relativePath.trim() : '';
  if (!b || !rel) return '';
  const baseWithSlash = b.endsWith('/') ? b : `${b}/`;
  try {
    return new URL(rel.startsWith('./') ? rel : `./${rel.replace(/^\//, '')}`, baseWithSlash).toString();
  } catch (_e) {
    return '';
  }
};

const normalizeHttpBaseWithSlash = (value) => {
  const b = normalizeHttpBase(value);
  return b ? `${b}/` : '';
};

const isWodePanVideoId = (videoId) => {
  const id = String(videoId || '').trim();
  if (!id) return false;
  return /######wodepan$/i.test(id);
};

const goProxyPickState = {
  selectedBase: '',
  selectedPan: '',
  inFlight: null,
  inFlightPan: '',
};

const speedTestGoProxyBase = async (base, bytes = 2 * 1024 * 1024, timeoutMs = 8000) => {
  const url = joinBaseUrl(base, `speed?bytes=${encodeURIComponent(String(bytes))}&_=${Date.now()}`);
  if (!url) throw new Error('invalid speed url');
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = setTimeout(() => {
    try {
      if (controller) controller.abort();
    } catch (_e) {}
  }, timeoutMs);
  const started = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  try {
    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller ? controller.signal : undefined,
    });
    if (!resp.ok) throw new Error(`speed http ${resp.status}`);
    const body = resp.body;
    let total = 0;
    if (body && typeof body.getReader === 'function') {
      const reader = body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.byteLength) total += value.byteLength;
      }
    } else {
      const buf = await resp.arrayBuffer();
      total = buf ? buf.byteLength : 0;
    }
    const ended = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const seconds = Math.max(0.001, (ended - started) / 1000);
    return total / seconds; // bytes/sec
  } finally {
    clearTimeout(t);
  }
};

const pickGoProxyBaseForPlayback = async (pan = '') => {
  const servers = normalizeGoProxyServers(effectiveBootstrapSettings.value.goProxyServers);
  if (!servers.length) return '';
  const p = typeof pan === 'string' ? pan.trim().toLowerCase() : '';
  const eligible = (p === 'baidu' || p === 'quark')
    ? servers.filter((s) => !!(s && s.pans && s.pans[p]))
    : servers;
  if (!eligible.length) return '';

  const manual = normalizeHttpBase(goProxyManualBase.value);
  if (manual && eligible.some((s) => s && s.base === manual)) {
    goProxyPickState.selectedBase = manual;
    goProxyPickState.selectedPan = p;
    goProxyPickState.inFlight = null;
    goProxyPickState.inFlightPan = '';
    return manual;
  }

  const autoSelect = !!effectiveBootstrapSettings.value.goProxyAutoSelect;
  if (!autoSelect) return eligible[0].base;

  if (goProxyPickState.selectedBase && goProxyPickState.selectedPan === p) return goProxyPickState.selectedBase;
  if (goProxyPickState.inFlight && goProxyPickState.inFlightPan === p) return await goProxyPickState.inFlight;

  goProxyPickState.inFlight = (async () => {
    const tests = eligible.map(async (s) => {
      const base = s && s.base ? s.base : '';
      if (!base) return { base: '', bps: 0, ok: false };
      try {
        const bps = await speedTestGoProxyBase(base);
        return { base, bps, ok: true };
      } catch (_e) {
        return { base, bps: 0, ok: false };
      }
    });
    const results = await Promise.all(tests);
    const best = results
      .filter((r) => r && r.ok && r.base)
      .sort((a, b) => (b.bps || 0) - (a.bps || 0))[0];
    const chosen = best && best.base ? best.base : eligible[0].base;
    goProxyPickState.selectedBase = chosen || '';
    goProxyPickState.selectedPan = p;
    return goProxyPickState.selectedBase;
  })();
  goProxyPickState.inFlightPan = p;
  try {
    return await goProxyPickState.inFlight;
  } finally {
    if (goProxyPickState.inFlightPan === p) {
      goProxyPickState.inFlight = null;
      goProxyPickState.inFlightPan = '';
    }
  }
};

const registerGoProxyToken = async ({ base, url, headers }) => {
  const b = normalizeHttpBase(base);
  if (!b) throw new Error('missing goProxy base');
  const targetUrl = typeof url === 'string' ? url.trim() : '';
  if (!targetUrl) throw new Error('missing play url');
  const h = headers && typeof headers === 'object' ? headers : {};
  const headersList = [];
  Object.keys(h).forEach((k) => {
    const key = typeof k === 'string' ? k.trim() : '';
    if (!key) return;
    const v = h[k];
    if (v == null) return;
    if (Array.isArray(v)) {
      v.forEach((it) => {
        if (it == null) return;
        const s = String(it).trim();
        if (!s) return;
        headersList.push({ key, value: s });
      });
      return;
    }
    const s = String(v).trim();
    if (!s) return;
    headersList.push({ key, value: s });
  });
  const registerUrl = joinBaseUrl(b, 'register');
  if (!registerUrl) throw new Error('invalid register url');
  const resp = await fetch(registerUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl, headersList }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (data && (data.message || data.error)) ? String(data.message || data.error) : 'request failed';
    const err = new Error(msg);
    err.status = resp.status;
    throw err;
  }
  const token = data && data.token ? String(data.token).trim() : '';
  if (!token) throw new Error('missing token');
  const proxyUrl = joinBaseUrl(b, encodeURIComponent(token));
  if (!proxyUrl) throw new Error('invalid proxy url');
  return { token, proxyUrl };
};

const isProbablyM3U8Url = (urlString) => {
  const raw = typeof urlString === 'string' ? urlString.trim() : '';
  if (!raw) return false;
  try {
    const u = new URL(raw, window.location.href);
    const hinted = String(u.searchParams.get('__tv_fmt') || '').trim().toLowerCase();
    if (hinted === 'm3u8' || hinted === 'hls') return true;
    return String(u.pathname || '').toLowerCase().endsWith('.m3u8');
  } catch (_e) {
    const noQuery = raw.split('#')[0].split('?')[0].toLowerCase();
    return noQuery.endsWith('.m3u8');
  }
};

const parseM3U8FirstUrls = (text) => {
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.split(/\r?\n/);
  let firstUri = '';
  let keyUri = '';
  for (const line of lines) {
    const t = String(line || '').trim();
    if (!t) continue;
    if (t.startsWith('#')) {
      if (!keyUri && /^#EXT-X-KEY\b/i.test(t) && /URI\s*=\s*"/i.test(t)) {
        const m = /URI\s*=\s*"([^"]+)"/i.exec(t);
        if (m && m[1]) keyUri = String(m[1]).trim();
      }
      continue;
    }
    if (!firstUri) firstUri = t;
    if (firstUri && keyUri) break;
  }
  return { firstUri, keyUri };
};

const probeFetchSmall = async (urlString, timeoutMs = 6000) => {
  const url = typeof urlString === 'string' ? urlString.trim() : '';
  if (!url) return { ok: false, status: 0, message: 'missing url' };
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = setTimeout(() => {
    try {
      if (controller) controller.abort();
    } catch (_e) {}
  }, timeoutMs);
  try {
    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
      signal: controller ? controller.signal : undefined,
    });
    const status = resp && typeof resp.status === 'number' ? resp.status : 0;
    if (!resp || !resp.ok) return { ok: false, status, message: `http ${status}` };
    if (status !== 200 && status !== 206) return { ok: false, status, message: `unexpected http ${status}` };
    return { ok: true, status, message: '' };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? 'timeout' : (e && e.message ? String(e.message) : 'fetch failed');
    return { ok: false, status: 0, message: msg };
  } finally {
    clearTimeout(t);
  }
};

const registerCatM3U8 = async ({ apiBase, tvUser, url, headers }) => {
  const base = normalizeCatPawOpenApiBase(apiBase);
  if (!base) throw new Error('CatPawOpen 接口地址未设置');
  const target = new URL('api/m3u8/register', base);
  const u = typeof tvUser === 'string' ? tvUser.trim() : '';
  const resp = await fetch(target.toString(), {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json', ...(u ? { 'X-TV-User': u } : {}) },
    body: JSON.stringify({
      url: typeof url === 'string' ? url.trim() : '',
      headers: headers && typeof headers === 'object' ? headers : {},
    }),
  });
  const status = resp && typeof resp.status === 'number' ? resp.status : 0;
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data || data.ok === false) {
    const msg = data && (data.message || data.error) ? String(data.message || data.error) : `HTTP ${status}`;
    const err = new Error(msg);
    err.status = status;
    throw err;
  }
  const token = data && data.token ? String(data.token).trim() : '';
  const indexPath = data && data.index ? String(data.index).trim() : '';
  const proxyPath = data && data.proxy ? String(data.proxy).trim() : '';
  if (!token || !indexPath || !proxyPath) throw new Error('CatPawOpen m3u8 register 返回无效');
  const indexUrl = new URL(indexPath.replace(/^\//, ''), base).toString();
  const proxyUrl = new URL(proxyPath.replace(/^\//, ''), base).toString();
  return { token, indexUrl, proxyUrl };
};

const fetchM3U8Text = async ({ url, tvUser }) => {
  const target = typeof url === 'string' ? url.trim() : '';
  if (!target) throw new Error('missing m3u8 url');
  const u = typeof tvUser === 'string' ? tvUser.trim() : '';
  const resp = await fetch(target, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    headers: { ...(u ? { 'X-TV-User': u } : {}) },
  });
  if (!resp.ok) {
    const err = new Error(`m3u8 http ${resp.status}`);
    err.status = resp.status;
    throw err;
  }
  return await resp.text();
};

const hasNonEmptyHeaders = (headers) => {
  const h = headers && typeof headers === 'object' ? headers : {};
  return Object.keys(h).some((k) => {
    if (!k || typeof k !== 'string') return false;
    const v = h[k];
    if (v == null) return false;
    if (Array.isArray(v)) return v.some((it) => it != null && String(it).trim());
    return String(v).trim();
  });
};

const maybeUseCatM3U8ProxyForPlayback = async ({
  apiBase,
  tvUser,
  playUrl,
  playHeaders,
}) => {
  if (!isProbablyM3U8Url(playUrl)) return null;
  if (!apiBase) return null;

  const hasHeader = hasNonEmptyHeaders(playHeaders);

  // If server doesn't require headers, prefer direct m3u8 fetch first. If it fails (CORS/IP/anti-leech),
  // then fall back to CatPawOpen m3u8 registration + proxy rewrite.
  if (!hasHeader) {
    try {
      await fetchM3U8Text({ url: playUrl, tvUser });
      return { url: playUrl, headers: playHeaders, reason: 'direct-m3u8-fetch-ok' };
    } catch (_e) {
      // continue to register flow
    }
  }

  // 1) Ask CatPawOpen to fetch the m3u8 with required headers and give us both playlists.
  const { indexUrl, proxyUrl } = await registerCatM3U8({ apiBase, tvUser, url: playUrl, headers: playHeaders });

  // 2) Fetch the normalized "index" playlist (absolute URIs), then probe first segment (and key if present)
  // from the client side to decide whether direct segment fetching works (CORS / IP-binding / anti-leech).
  let text = '';
  try {
    text = await fetchM3U8Text({ url: indexUrl, tvUser });
  } catch (_e) {
    // If we can't even fetch index, fall back to proxy playlist.
    return { url: proxyUrl, headers: {}, reason: 'index-fetch-failed' };
  }
  const { firstUri, keyUri } = parseM3U8FirstUrls(text);
  if (!firstUri) return { url: proxyUrl, headers: {}, reason: 'no-segment' };

  // If this is a master playlist (child m3u8), prefer proxy mode to avoid cross-site m3u8 fetches.
  if (String(firstUri).toLowerCase().endsWith('.m3u8')) return { url: proxyUrl, headers: {}, reason: 'master-playlist' };

  if (keyUri) {
    const keyProbe = await probeFetchSmall(keyUri);
    if (!keyProbe.ok) return { url: proxyUrl, headers: {}, reason: `key-probe-failed:${keyProbe.message}` };
  }
  const segProbe = await probeFetchSmall(firstUri);
  if (!segProbe.ok) return { url: proxyUrl, headers: {}, reason: `seg-probe-failed:${segProbe.message}` };

  // Direct mode: use CatPawOpen index playlist (same-origin), but segments stay upstream.
  return { url: indexUrl, headers: {}, reason: 'direct-ok' };
};

const maybeUseGoProxyForPlayback = async (playUrl, playHeaders, preferredPan = '', enabled = false) => {
  if (!enabled) return { url: playUrl, headers: playHeaders, goProxyBase: '' };
  const hasHeader = hasNonEmptyHeaders(playHeaders);
  // Only proxy when server explicitly returns playback headers (typical anti-leech/CORS cases).
  if (!hasHeader) return { url: playUrl, headers: playHeaders, goProxyBase: '' };

  const base = await pickGoProxyBaseForPlayback(preferredPan);
  if (!base) return { url: playUrl, headers: playHeaders, goProxyBase: '' };
  const { proxyUrl } = await registerGoProxyToken({ base, url: playUrl, headers: playHeaders });

  // Preserve format for token URLs that don't carry a suffix.
  const decorated = (() => {
    try {
      const origin = new URL(String(playUrl || '').trim(), window.location.href);
      const isM3U8 = String(origin.pathname || '').toLowerCase().endsWith('.m3u8');
      if (!isM3U8) return proxyUrl;
      const p = new URL(String(proxyUrl || '').trim(), window.location.href);
      p.searchParams.set('__tv_fmt', 'm3u8');
      return p.toString();
    } catch (_e) {
      const u = String(proxyUrl || '').trim();
      if (!u) return proxyUrl;
      const sep = u.includes('?') ? '&' : '?';
      return `${u}${sep}__tv_fmt=m3u8`;
    }
  })();

  return { url: decorated, headers: {}, goProxyBase: base };
};

const goProxyUiEligible = computed(() => {
  const enabled = !!effectiveBootstrapSettings.value.goProxyEnabled;
  if (!enabled) return false;
  const candidate = lastGoProxyCandidate.value;
  if (!candidate || !candidate.enabled) return false;
  return hasNonEmptyHeaders(candidate.headers);
});

const goProxyUiOptions = computed(() => {
  const enabled = !!effectiveBootstrapSettings.value.goProxyEnabled;
  if (!enabled || !goProxyUiEligible.value) return [];
  const servers = normalizeGoProxyServers(effectiveBootstrapSettings.value.goProxyServers);
  return servers.map((s) => ({ base: s.base, label: s.label }));
});

const goProxyUiLabel = computed(() => {
  const enabled = !!effectiveBootstrapSettings.value.goProxyEnabled;
  if (!enabled || !goProxyUiEligible.value) return '';
  const servers = normalizeGoProxyServers(effectiveBootstrapSettings.value.goProxyServers);
  if (!servers.length) return '';

  const inUse = normalizeHttpBase(goProxyInUseBase.value);
  const manual = normalizeHttpBase(goProxyManualBase.value);
  const active = inUse || manual;
  if (active) {
    const found = servers.find((s) => s && s.base === active);
    if (found && found.label) return found.label;
  }

  return servers[0].label || 'GoProxy';
});

const onGoProxySelect = async (base) => {
  if (!goProxyUiEligible.value) return;
  const nextBase = normalizeHttpBase(base);
  goProxyManualBase.value = nextBase;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (nextBase) window.localStorage.setItem(GO_PROXY_SELECTED_BASE_STORAGE_KEY, nextBase);
      else window.localStorage.removeItem(GO_PROXY_SELECTED_BASE_STORAGE_KEY);
    }
  } catch (_e) {}

  goProxyPickState.selectedBase = '';
  goProxyPickState.selectedPan = '';
  goProxyPickState.inFlight = null;
  goProxyPickState.inFlightPan = '';

  const candidate = lastGoProxyCandidate.value;
  if (!candidate || !candidate.url) return;
  if (!candidate.enabled) return;
  try {
    goProxyInUseBase.value = '';
    const preferredPan = typeof candidate.preferredPan === 'string' ? candidate.preferredPan : '';
    const out = await maybeUseGoProxyForPlayback(candidate.url, candidate.headers || {}, preferredPan, true);
    if (out && typeof out === 'object') {
      const u = typeof out.url === 'string' ? out.url.trim() : '';
      if (u) {
        playerMetaReady.value = false;
        playerBuffering.value = false;
        playerPlaybackStarted.value = false;
        playerFirstFrameReady.value = false;
        if (playerFirstFrameTimer) {
          window.clearTimeout(playerFirstFrameTimer);
          playerFirstFrameTimer = 0;
        }
        goProxyInUseBase.value = out.goProxyBase ? String(out.goProxyBase) : '';
        playerUrl.value = u;
        playerHeaders.value = out.headers && typeof out.headers === 'object' ? out.headers : {};
        await nextTick();
        try {
          if (artPlayerRef.value && typeof artPlayerRef.value.tryAutoplay === 'function') await artPlayerRef.value.tryAutoplay();
        } catch (_e) {}
      }
    }
  } catch (e) {
    console.warn('[GoProxy] switch failed:', e && e.message ? e.message : e);
  }
};

const playRequestState = {
  seq: 0,
  inFlightKey: '',
  inFlight: null,
};

const initialAutoPlayInFlight = ref(false);

const lastTMDBPlayReportCtx = ref(null);

const reportTMDBPlay = async ({ ctx, stage = 'resolve', result = 'success', error = '' } = {}) => {
  const c = ctx && typeof ctx === 'object' ? ctx : null;
  if (!c) return;
  const tmdbId = Number(c.tmdbId || 0);
  const type = String(c.type || '').trim();
  const season = Number(c.season || 0);
  const episode = Number(c.episode || 0);
  if (!(tmdbId > 0) || !type) return;
  try {
    await apiPostJson(
      '/api/tmdb/play/report',
      {
        tmdbId,
        type,
        season,
        episode,
        siteId: String(c.siteId || ''),
        sitePanId: String(c.sitePanId || ''),
        candidateKey: String(c.candidateKey || ''),
        playFlag: String(c.playFlag || ''),
        playUrl: String(c.playUrl || ''),
        filename: String(c.filename || ''),
        stage: String(stage || 'resolve'),
        result: String(result || 'success'),
        error: String(error || ''),
      },
      { dedupe: false, timeoutMs: 3000 }
    );
  } catch (_e) {}
};

const pushDoubanSeasonMetaToServerIfNeeded = () => {
  try {
    if (!tmdbMode.value) return;
    const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
    const tmdbId = Number(props.tmdbId || 0);
    if (typRaw !== 'tv' || tmdbId <= 0) return;
    if (!doubanSeasonOverrideActive.value) return;
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
    if (seasons.length < 2) return;
    const payload = {
      tmdbId,
      type: 'tv',
      source: 'douban',
      seasons: seasons
        .map((s) => ({
          season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
          episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
        }))
        .filter((s) => s.season > 0 && s.episodeCount > 0),
    };
    if (!payload.seasons.length) return;
    void apiPostJson('/api/tmdb/meta/push', payload, { dedupe: false, timeoutMs: 3000 });
  } catch (_e) {}
};

const fetchTMDBCandidatesFromServer = async ({ tmdbId, type = 'tv', season = 0, episode = 0 } = {}) => {
  const id = Number(tmdbId || 0);
  const typ = String(type || '').trim().toLowerCase();
  const s = Number.isFinite(Number(season)) ? Math.floor(Number(season)) : 0;
  const e = Number.isFinite(Number(episode)) ? Math.floor(Number(episode)) : 0;
  if (!(id > 0) || (typ === 'tv' && (s <= 0 || e <= 0))) return null;
  try {
    const data = await apiGetJson(`/api/tmdb/candidates${buildQuery({ tmdbId: id, type: typ, season: s, episode: e })}`, { cacheMs: 1500, timeoutMs: 15000 });
    return data && typeof data === 'object' ? data : null;
  } catch (_e) {
    return null;
  }
};

const resolveSmartEpisodeNo = (ep) => {
  if (!ep) return 0;
  const direct = ep && Number.isFinite(Number(ep.__tmdbEpisode)) ? Math.floor(Number(ep.__tmdbEpisode)) : 0;
  if (direct > 0) return direct;
  const url = ep && ep.url != null ? String(ep.url) : '';
  const m = String(url || '').match(/tmdb_ep:(\d{1,5})/i);
  if (m && m[1]) {
    const n = Number.parseInt(String(m[1]), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  const name = ep && ep.name != null ? String(ep.name) : '';
  const mm = String(name || '').match(/第\s*(\d{1,5})\s*(?:集|话|回|期)/);
  if (mm && mm[1]) {
    const n = Number.parseInt(String(mm[1]), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
};

	const tmdbSmartPickCache = new Map();
	const tmdbSmartPickInFlight = new Map();
	const tmdbSmartPickCacheVersion = ref(0);
	const SMART_DETAIL_FAIL_COOLDOWN_BASE_MS = 30 * 1000;
	const SMART_DETAIL_FAIL_COOLDOWN_MAX_MS = 5 * 60 * 1000;
	const tmdbSmartDetailCache = new Map();
	const tmdbSmartDetailInFlight = new Map();
	const tmdbSmartDetailCacheVersion = ref(0);
	const tmdbSmartLastPickDebug = ref(null);

const resetTMDBSmartCaches = () => {
  try {
    tmdbSmartPickCache.clear();
    tmdbSmartPickInFlight.clear();
    tmdbSmartDetailCache.clear();
    tmdbSmartDetailInFlight.clear();
    tmdbSmartLastPickDebug.value = null;
    tmdbSmartPickCacheVersion.value += 1;
    tmdbSmartDetailCacheVersion.value += 1;
  } catch (_e) {}
};

const SMART_ENHANCE_TOKENS = ['60fps', '60帧', 'hdr', 'ddp', '臻彩'];
const SMART_PLAYED_SOURCES_STORAGE_KEY = 'tv:play:smart:played_sources:v1';

const smartBuildSourceKey = (src) => {
  const siteKey = src && src.siteKey ? String(src.siteKey).trim() : '';
  const spiderApi = src && src.spiderApi ? String(src.spiderApi).trim() : '';
  const videoId = src && src.videoId ? String(src.videoId).trim() : '';
  return `${siteKey}::${spiderApi}::${videoId}`;
};

const smartPickConcurrency = computed(() => {
  const raw = effectiveBootstrapSettings.value.searchThreadCount;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 5;
  return Math.max(1, Math.min(20, Math.floor(n)));
});

const smartGuessQuality = (hayRaw) => {
  const hay = String(hayRaw || '').toUpperCase();
  if (/(2160P|2160|4K)/.test(hay)) return '4K';
  if (/(1080P|1080)/.test(hay)) return '1080P';
  if (/(720P|720)/.test(hay)) return '720P';
  return '';
};

const smartGuessFps60 = (hayRaw) => {
  const hay = String(hayRaw || '').toLowerCase();
  return hay.includes('60fps') || hay.includes('60帧');
};

const smartQualityRankOf = (q) => {
  const s = typeof q === 'string' ? q.trim().toUpperCase() : '';
  if (s === '4K') return 3;
  if (s === '1080P') return 2;
  if (s === '720P') return 1;
  return 0;
};

const smartQualityTierRankOf = (q, fps60) => {
  const qr = smartQualityRankOf(q);
  const f = !!fps60;
  if (qr === 3 && f) return 50;
  if (qr === 3) return 40;
  if (qr === 2) return 30;
  if (qr === 1) return 20;
  return 10;
};

const smartBuildHayLower = (cand) => {
  const rawLower = cand && typeof cand.rawLower === 'string' ? cand.rawLower : '';
  const epName = cand && cand.ep && cand.ep.name != null ? String(cand.ep.name) : '';
  const srcTitleLower = cand && typeof cand.srcTitleLower === 'string' ? cand.srcTitleLower : '';
  const srcRemarkLower = cand && typeof cand.srcRemarkLower === 'string' ? cand.srcRemarkLower : '';
  return `${rawLower} ${String(epName || '').toLowerCase()} ${srcTitleLower} ${srcRemarkLower}`.trim();
};

const smartComputeCandidateFeatures = (cand) => {
  const hayLower = smartBuildHayLower(cand);
  const quality = smartGuessQuality(hayLower);
  const qualityRank = smartQualityRankOf(quality);
  const enhanceMatch = computePriorityMatch(hayLower, SMART_ENHANCE_TOKENS);
  const idx = enhanceMatch && Array.isArray(enhanceMatch.indices) ? enhanceMatch.indices : [];
  const hasHdr = idx.includes(2);
  const fps60 = smartGuessFps60(hayLower) || idx.includes(0) || idx.includes(1);
  const tierRank = (() => {
    const qr = smartQualityRankOf(quality);
    if (qr === 3 && hasHdr && fps60) return 65;
    if (qr === 3 && hasHdr) return 60;
    if (qr === 3 && fps60) return 55;
    if (qr === 3) return 50;
    if (qr === 2) return 40;
    if (qr === 1) return 30;
    return 10;
  })();
  return { hayLower, quality, qualityRank, fps60: !!fps60, hasHdr: !!hasHdr, tierRank, enhanceMatch };
};

const smartComparePanTokenIdx = (a, b) => {
  const av = Number.isFinite(Number(a)) ? Number(a) : -1;
  const bv = Number.isFinite(Number(b)) ? Number(b) : -1;
  if (av < 0 && bv < 0) return 0;
  if (av < 0) return 1;
  if (bv < 0) return -1;
  return av - bv;
};

const smartComputeHitCount = (cand, feat, { explicit } = {}) => {
  const conds = Array.isArray(explicit) ? explicit : [];
  let hit = 0;
  conds.forEach((k) => {
    if (k === '网盘') {
      if (cand && Number.isFinite(Number(cand.panTokenIdx)) && Number(cand.panTokenIdx) >= 0) hit += 1;
      return;
    }
    if (k === '关键字' && cand && cand.matchKeyword && cand.matchKeyword.count > 0) hit += 1;
  });
  return hit;
};

const smartCompareCandidates = (a, b, { explicit, orderKeys } = {}) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const af = smartComputeCandidateFeatures(a);
  const bf = smartComputeCandidateFeatures(b);
  if (af.tierRank !== bf.tierRank) return bf.tierRank - af.tierRank;

  const ah = smartComputeHitCount(a, af, { explicit });
  const bh = smartComputeHitCount(b, bf, { explicit });
  if (ah !== bh) return bh - ah;

  const ok = Array.isArray(orderKeys) && orderKeys.length ? orderKeys : ['网盘'];
  for (let i = 0; i < ok.length; i += 1) {
    const k = ok[i];
    if (k === '网盘') {
      const q = smartComparePanTokenIdx(a.panTokenIdx, b.panTokenIdx);
      if (q) return q;
      continue;
    }
    if (k !== '关键字') continue;
    const q = comparePriorityMatch(a.matchKeyword, b.matchKeyword);
    if (q) return q;
  }

  const ex = comparePriorityMatch(af.enhanceMatch, bf.enhanceMatch);
  if (ex) return ex;
  return 0;
};

const smartCandidateKey = (cand) => {
  if (!cand) return '';
  const siteKey = cand.siteKey ? String(cand.siteKey) : '';
  const spiderApi = cand.spiderApi ? String(cand.spiderApi) : '';
  const videoId = cand.videoId ? String(cand.videoId) : '';
  const panLabel = cand.panLabel ? String(cand.panLabel) : '';
  const epUrl = cand.ep && cand.ep.url != null ? String(cand.ep.url) : '';
  return `${siteKey}::${spiderApi}::${videoId}::${panLabel}::${epUrl}`;
};

const smartCleanPanToken = (label) => {
  const s = typeof label === 'string' ? label.trim() : '';
  if (!s) return '';
  const tokens = Array.isArray(smartPanMatchTokensSetting.value) ? smartPanMatchTokensSetting.value : [];
  const low = s.toLowerCase();
  for (let i = 0; i < tokens.length; i += 1) {
    const t = typeof tokens[i] === 'string' ? tokens[i].trim() : '';
    if (!t) continue;
    if (low.includes(t.toLowerCase())) return t;
  }
  return '';
};

const smartNormalizePlayedField = (v) => {
  const s = v != null ? String(v) : '';
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
};

const smartSourceIdentity = (cand) => {
  if (!cand) return '';
  const siteKey = cand.siteKey != null ? String(cand.siteKey) : '';
  const panToken = smartCleanPanToken(cand.panLabel != null ? String(cand.panLabel) : '');
  const displayName = cand.ep && cand.ep.name != null ? String(cand.ep.name) : '';
  const epUrl = cand.ep && cand.ep.url != null ? String(cand.ep.url) : '';
  const rawNames = extractRawNamesFromEpisodeUrl(epUrl);
  const rawFileName = rawNames && rawNames.length ? String(rawNames[0] || '') : '';
  return [
    smartNormalizePlayedField(siteKey),
    smartNormalizePlayedField(panToken),
    smartNormalizePlayedField(displayName),
    smartNormalizePlayedField(rawFileName),
  ].join('::');
};

const smartPlayedGroupKey = (episodeNo) => {
  const contentKey = getStableContentKey();
  const ep = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (!contentKey || ep <= 0) return '';
  return `${contentKey}::${ep}`;
};

const smartLoadPlayedSet = (episodeNo) => {
  const gk = smartPlayedGroupKey(episodeNo);
  if (!gk) return { groupKey: '', set: new Set() };
  try {
    const raw = sessionStorage.getItem(SMART_PLAYED_SOURCES_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const arr = Array.isArray(groups[gk]) ? groups[gk] : [];
    return { groupKey: gk, set: new Set(arr.map((x) => (x != null ? String(x) : '')).filter(Boolean)) };
  } catch (_e) {
    return { groupKey: gk, set: new Set() };
  }
};

const smartSavePlayedSet = (groupKey, set) => {
  const gk = typeof groupKey === 'string' ? groupKey.trim() : '';
  if (!gk) return;
  try {
    const raw = sessionStorage.getItem(SMART_PLAYED_SOURCES_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const next = { ...groups, [gk]: Array.from(set || []).slice(0, 400) };
    sessionStorage.setItem(SMART_PLAYED_SOURCES_STORAGE_KEY, JSON.stringify({ v: 1, groups: next }));
  } catch (_e) {}
};

const smartMatchPan = (cand, token) => {
  const t = typeof token === 'string' ? token.trim() : '';
  if (!t) return true;
  const label = cand && cand.panLabel != null ? String(cand.panLabel) : '';
  return label.toLowerCase().includes(t.toLowerCase());
};

const smartMatchQualityMode = (cand, modeKey) => {
  const key = typeof modeKey === 'string' ? modeKey.trim() : '';
  if (!key || key === 'auto') return true;
  const feat = smartComputeCandidateFeatures(cand);
  const q = feat.quality;
  const hasHdr = !!feat.hasHdr;
  if (key === '4k_hdr') return q === '4K' && hasHdr;
  if (key === '4k_fps') return q === '4K' && feat.fps60;
  if (key === '4k') return q === '4K';
  if (key === '1080p') return q === '1080P';
  if (key === '720p') return q === '720P';
  return true;
};

const ensureTMDBSmartDetailCacheEntry = async (src) => {
  const siteKey = src && src.siteKey ? String(src.siteKey) : '';
  const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
  const videoId = src && src.videoId ? String(src.videoId) : '';
  if (!siteKey || !spiderApi || !videoId) return null;
  const sourceKey = smartBuildSourceKey({ siteKey, spiderApi, videoId });
  const existing = tmdbSmartDetailCache.get(sourceKey) || null;
  if (existing) {
    if (existing.ok === false) {
      const now = Date.now();
      const nextRetryAt = Number.isFinite(Number(existing.nextRetryAt)) ? Number(existing.nextRetryAt) : 0;
      if (nextRetryAt > 0 && now < nextRetryAt) return existing;
    } else if (existing.episodeMap && existing.episodeMapLoose && existing.pans) {
      return existing;
    }
  }
  const inFlight = tmdbSmartDetailInFlight.get(sourceKey) || null;
  if (inFlight) {
    await inFlight;
    return tmdbSmartDetailCache.get(sourceKey) || null;
  }

  const apiBase = resolveCatApiBaseForPlay();
  const tvUser = props.bootstrap?.user?.username || '';
  if (!apiBase) return null;

  const task = (async () => {
    try {
	      const raw = await requestCatSpider({
	        apiBase,
	        username: tvUser,
	        action: 'detail',
	        spiderApi,
	        payload: { id: videoId },
	      });
	      const d = extractDetailFromResponse(raw);
	      const resolved = await resolvePanMockPlaySources({ raw, playFrom: d.playFrom, playUrl: d.playUrl });
	      const pans = parsePlaySources(resolved.playFrom, resolved.playUrl);
	      const entry = {
	        ok: true,
	        failCount: 0,
	        siteKey,
        spiderApi,
        siteName: src && src.siteName ? String(src.siteName) : siteKey,
        videoId,
        pans: Array.isArray(pans) ? pans : [],
        episodeMap: new Map(),
        episodeMapLoose: new Map(),
        pickedFallback: new Map(),
      };

      const panTokenOrder = compiledSmartPanMatchTokens.value;
      const labelTokenIdxOf = (label) => {
        const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
        if (!s) return -1;
        for (let i = 0; i < panTokenOrder.length; i += 1) {
          const t = panTokenOrder[i];
          if (t && s.includes(t)) return i;
        }
        return -1;
      };

      const srcTitleLower = (() => {
        try {
          const t = src && src.videoTitle != null ? String(src.videoTitle) : '';
          return t ? t.trim().toLowerCase() : '';
        } catch (_e) {
          return '';
        }
      })();
      const srcRemarkLower = (() => {
        try {
          const r = src && src.videoRemark != null ? String(src.videoRemark) : '';
          return r ? r.trim().toLowerCase() : '';
        } catch (_e) {
          return '';
        }
      })();

      const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
      const rules = compiledMagicEpisodeRules.value;
      const cleanRules = compiledMagicEpisodeCleanRegexRules.value;
      const tmdbHasMultiSeason = (() => {
        const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
        const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
        return real.length >= 2;
      })();

      (entry.pans || []).forEach((pan) => {
        const panLabel = pan && pan.label != null ? String(pan.label) : '';
        const panTokenIdx = labelTokenIdxOf(panLabel);
        const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
        episodes.forEach((ep) => {
          if (!ep || !ep.url) return;
          const texts = extractEpisodeCandidateTexts(ep);
          const primary = texts[0] || (ep && ep.name != null ? String(ep.name) : '') || '';
          const rawLower = buildCandidateLowerText(texts) || String(primary || '').toLowerCase();
          const match =
            Array.isArray(rules) && rules.length
              ? extractSeasonEpisodeFromCandidates(texts, rules, cleanRules)
              : parseLooseSeasonEpisodeFromText(primary);
          const normalizedMatch = normalizeMaybeGlobalSeasonEpisode(match);
          const seasonNo =
            normalizedMatch && Number.isFinite(Number(normalizedMatch.season)) ? Math.floor(Number(normalizedMatch.season)) : 0;
          const epNo =
            normalizedMatch && Number.isFinite(Number(normalizedMatch.episode)) ? Math.floor(Number(normalizedMatch.episode)) : 0;
          if (epNo <= 0) return;
          const cand = {
            siteKey: entry.siteKey,
            spiderApi: entry.spiderApi,
            siteName: entry.siteName,
            videoId: entry.videoId,
            srcTitleLower,
            srcRemarkLower,
            panLabel,
            panTokenIdx,
            ep,
            rawLower,
            matchSeason: seasonNo,
            hasSeasonMarker: seasonNo > 0,
            searchSeasonHint: 0,
            matchKeyword: computePriorityMatch(rawLower, Array.isArray(keywordTokens) ? keywordTokens : []),
          };
          if (tmdbHasMultiSeason && seasonNo <= 0) {
            const list = entry.episodeMapLoose.get(epNo) || [];
            list.push(cand);
            entry.episodeMapLoose.set(epNo, list);
            return;
          }
          const keyNo = seasonNo > 0 ? (tmdbGlobalEpisodeNoOf(seasonNo, epNo) || epNo) : epNo;
          const list = entry.episodeMap.get(keyNo) || [];
          list.push(cand);
          entry.episodeMap.set(keyNo, list);
        });
      });

      tmdbSmartDetailCache.set(sourceKey, entry);
      tmdbSmartDetailCacheVersion.value += 1;
    } catch (e) {
      try {
        const prev = tmdbSmartDetailCache.get(sourceKey) || null;
        const prevCount = prev && prev.ok === false && Number.isFinite(Number(prev.failCount)) ? Math.floor(Number(prev.failCount)) : 0;
        const failCount = prevCount + 1;
        const now = Date.now();
        const delay = Math.min(
          SMART_DETAIL_FAIL_COOLDOWN_MAX_MS,
          SMART_DETAIL_FAIL_COOLDOWN_BASE_MS * Math.pow(2, Math.max(0, failCount - 1))
        );
        const status = e && typeof e.status === 'number' ? e.status : 0;
        const msg = e && e.message ? String(e.message) : '请求失败';
        tmdbSmartDetailCache.set(sourceKey, {
          ok: false,
          failCount,
          failedAt: now,
          nextRetryAt: now + delay,
          lastError: status ? `HTTP ${status}：${msg}` : msg,
          siteKey,
          spiderApi,
          siteName: src && src.siteName ? String(src.siteName) : siteKey,
          videoId,
          pans: [],
          episodeMap: new Map(),
          episodeMapLoose: new Map(),
          pickedFallback: new Map(),
        });
        tmdbSmartDetailCacheVersion.value += 1;
      } catch (_e2) {}
    } finally {
      tmdbSmartDetailInFlight.delete(sourceKey);
    }
  })();

  tmdbSmartDetailInFlight.set(sourceKey, task);
  await task;
  return tmdbSmartDetailCache.get(sourceKey) || null;
};

const smartGetCandidatesFromEntry = (entry, { episodeNo, seasonNo, seasonEpisodeNo, requireSeasoned } = {}) => {
  const want = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (!entry || want <= 0) return [];
  const list = (entry.episodeMap && entry.episodeMap.get ? entry.episodeMap.get(want) : null) || [];
  let out = Array.isArray(list) ? list.slice() : [];
  if (!out.length && seasonEpisodeNo > 0 && entry.episodeMapLoose && entry.episodeMapLoose.get) {
    const loose = entry.episodeMapLoose.get(seasonEpisodeNo);
    out = Array.isArray(loose) ? loose.slice() : [];
    if (seasonNo > 0) {
      const exactSeason = out.filter((c) => c && Number(c.matchSeason) === seasonNo);
      if (exactSeason.length) out = exactSeason;
    }
  }
  if (requireSeasoned) out = out.filter((c) => c && Number(c.matchSeason) > 0);
  return out.filter(Boolean);
};

const smartBuildSiteOrderMap = () => {
  const homeSites = Array.isArray(effectiveBootstrapSettings.value.homeSites) ? effectiveBootstrapSettings.value.homeSites : [];
  const homeOrder = homeSites
    .map((s) => (s && typeof s.key === 'string' ? s.key.trim() : ''))
    .filter((k) => k);
  const fallbackOrder = Array.isArray(effectiveBootstrapSettings.value.searchSiteOrder) ? effectiveBootstrapSettings.value.searchSiteOrder : [];
  const order = homeOrder.length ? homeOrder : fallbackOrder;
  const orderMap = new Map();
  order.forEach((k, idx) => {
    const kk = typeof k === 'string' ? k.trim() : '';
    if (kk && !orderMap.has(kk)) orderMap.set(kk, idx);
  });
  return orderMap;
};

const smartPickBestFromList = (
  cands,
  { explicit, orderKeys, excludeKey, excludeIdentity, excludePlayedSet, panToken, panMode, preferredPanToken, qualityMode } = {}
) => {
  const list = Array.isArray(cands) ? cands.filter(Boolean) : [];
  if (!list.length) return null;
  let base = list.filter((c) => {
    if (!c || !c.ep || !c.ep.url) return false;
    if (excludeKey && smartCandidateKey(c) === excludeKey) return false;
    if (!smartMatchQualityMode(c, qualityMode)) return false;
    if (excludeIdentity && smartSourceIdentity(c) === excludeIdentity) return false;
    if (excludePlayedSet && excludePlayedSet.size && excludePlayedSet.has(smartSourceIdentity(c))) return false;
    return true;
  });
  if (!base.length) return null;

  // Prefer configured pan list strictly:
  // if ANY candidate matches `smartPanMatchTokens`, then only pick among them;
  // otherwise fall back to any pan.
  try {
    const panOrder = compiledSmartPanMatchTokens.value;
    const hasPanOrder = Array.isArray(panOrder) && panOrder.length > 0;
    if (hasPanOrder) {
      const hasPreferred = base.some((c) => c && Number.isFinite(Number(c.panTokenIdx)) && Number(c.panTokenIdx) >= 0);
      if (hasPreferred) base = base.filter((c) => c && Number.isFinite(Number(c.panTokenIdx)) && Number(c.panTokenIdx) >= 0);
      if (!base.length) return null;
    }
  } catch (_e) {}

  const pickBest = (xs) => {
    const arr = Array.isArray(xs) ? xs.filter(Boolean) : [];
    if (!arr.length) return null;
    let best = arr[0];
    for (let i = 1; i < arr.length; i += 1) {
      if (smartCompareCandidates(best, arr[i], { explicit, orderKeys }) > 0) best = arr[i];
    }
    return best;
  };

  const mode = typeof panMode === 'string' ? panMode.trim() : '';
  const reqToken = typeof panToken === 'string' ? panToken.trim() : '';
  const prefToken = typeof preferredPanToken === 'string' ? preferredPanToken.trim() : '';

  if (mode === 'require' && reqToken) {
    const strict = base.filter((c) => smartMatchPan(c, reqToken));
    return pickBest(strict);
  }
  if (mode === 'prefer' && prefToken) {
    const bestAny = pickBest(base);
    const prefer = base.filter((c) => smartMatchPan(c, prefToken));
	    const bestPref = pickBest(prefer);
	    if (!bestPref) return bestAny;
	    if (!bestAny) return bestPref;
	    return smartCompareCandidates(bestPref, bestAny, { explicit, orderKeys }) <= 0 ? bestPref : bestAny;
	  }
	  if (reqToken) {
	    const strict = base.filter((c) => smartMatchPan(c, reqToken));
	    const bestStrict = pickBest(strict);
	    return bestStrict || pickBest(base);
	  }
  return pickBest(base);
};

const smartBuildSourcePool = async () => {
  const historySiteKey = resumeHistory.value && typeof resumeHistory.value.siteKey === 'string' ? resumeHistory.value.siteKey.trim() : '';
  const historySpider = resumeHistory.value && typeof resumeHistory.value.spiderApi === 'string' ? resumeHistory.value.spiderApi.trim() : '';
  const historyVideoId = resumeHistory.value && typeof resumeHistory.value.videoId === 'string' ? resumeHistory.value.videoId.trim() : '';
  const currentSiteKey = ((props.siteKey || '').trim() || historySiteKey).trim();
  const currentSpider = ((resolvedSpiderApiFinal.value || '').trim() || historySpider).trim();
  const currentVideoId = (((props.siteKey || '').trim() ? (props.videoId || '').trim() : '') || historyVideoId).trim();

  if ((!aggregatedSources.value || !aggregatedSources.value.length) && !sourcesLoading.value) {
    try {
      await fetchAggregatedSourcesExactMatches();
    } catch (_e) {}
  }

  const sourcesRaw = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
  const list = [];
  const uniq = new Set();
  const pushOne = (s) => {
    if (!s || !s.siteKey || !s.spiderApi || !s.videoId) return;
    const k = `${s.siteKey}::${s.spiderApi}::${s.videoId}`;
    if (uniq.has(k)) return;
    uniq.add(k);
    list.push(s);
  };

  if (currentSiteKey && currentSpider && currentVideoId) {
    pushOne({
      siteKey: currentSiteKey,
      spiderApi: currentSpider,
      siteName: resolvedSiteName.value || currentSiteKey,
      videoId: currentVideoId,
      videoTitle: displayTitle.value || props.videoTitle || '',
      videoRemark: displayRemark.value || props.videoRemark || '',
    });
  }

  sourcesRaw.forEach((s) => pushOne(s));
  return list;
};

const fetchTMDBMovieSmartEpisodesIfNeeded = async () => {
  if (!tmdbMovieMode.value) {
    tmdbMovieSmartEpisodes.value = [];
    return;
  }
  const tmdbId = Number(props.tmdbId || 0);
  if (!(Number.isFinite(tmdbId) && tmdbId > 0)) {
    tmdbMovieSmartEpisodes.value = [];
    return;
  }

  const k = `movieSmart::${Math.floor(tmdbId)}::${getStableContentKey()}`;
  if (tmdbMovieSmartFetchState.inFlight && tmdbMovieSmartFetchState.key === k) {
    await tmdbMovieSmartFetchState.inFlight;
    return;
  }

  tmdbMovieSmartFetchState.seq += 1;
  const seqAtCall = tmdbMovieSmartFetchState.seq;
  tmdbMovieSmartFetchState.key = k;

  const explicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const orderKeys =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];
  const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
  const panTokenOrder = compiledSmartPanMatchTokens.value;

  const labelTokenIdxOf = (label) => {
    const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
    if (!s) return -1;
    for (let i = 0; i < panTokenOrder.length; i += 1) {
      const t = panTokenOrder[i];
      if (t && s.includes(t)) return i;
    }
    return -1;
  };

  const buildCandidate = (src0, panLabel, ep0) => {
    const url = ep0 && ep0.url != null ? String(ep0.url) : '';
    const rawNames = extractRawNamesFromEpisodeUrl(url);
    const rawText = (rawNames[0] || (ep0 && ep0.name != null ? String(ep0.name) : '') || '').trim();
    const rawLower = rawText.toLowerCase();
    const srcTitleLower = src0 && src0.videoTitle != null ? String(src0.videoTitle).trim().toLowerCase() : '';
    const srcRemarkLower = src0 && src0.videoRemark != null ? String(src0.videoRemark).trim().toLowerCase() : '';
    const matchKeyword = computePriorityMatch(rawLower || '', Array.isArray(keywordTokens) ? keywordTokens : []);
    return {
      siteKey: src0 && src0.siteKey ? String(src0.siteKey) : '',
      spiderApi: src0 && src0.spiderApi ? String(src0.spiderApi) : '',
      siteName: src0 && src0.siteName ? String(src0.siteName) : '',
      videoId: src0 && src0.videoId ? String(src0.videoId) : '',
      panLabel: panLabel || '',
      panTokenIdx: labelTokenIdxOf(panLabel || ''),
      matchKeyword,
      rawLower,
      srcTitleLower,
      srcRemarkLower,
      ep: ep0,
    };
  };

  const pickFromDetailEntry = (src0, entry) => {
    if (!entry || entry.ok !== true || !Array.isArray(entry.pans)) return null;
    const rules = compiledMagicMovieRules.value;
    const hasRules = Array.isArray(rules) && rules.length > 0;

    let bestRule4k = null;
    let best4k = null;
    let first = null;

    const better = (a, b) => (smartCompareCandidates(a, b, { explicit, orderKeys }) <= 0 ? a : b);
    const is4k = (cand) => Number((smartComputeCandidateFeatures(cand) || {}).qualityRank) === 3;
    const ruleMatchedOf = (ep0) => (hasRules ? extractEpisodeCandidateTexts(ep0).some((t) => matchesAnyMagicRule(t, rules)) : false);

    for (let p = 0; p < entry.pans.length; p += 1) {
      const pan = entry.pans[p];
      const panLabel = pan && pan.label != null ? String(pan.label) : '';
      const eps = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
      const maxScan = Math.min(120, eps.length);
      for (let i = 0; i < maxScan; i += 1) {
        const ep0 = eps[i];
        if (!ep0 || !ep0.url) continue;
        const cand = buildCandidate(src0, panLabel, ep0);
        if (!first) first = cand;
        const m = ruleMatchedOf(ep0);
        const q4k = is4k(cand);
        if (m && q4k) bestRule4k = bestRule4k ? better(bestRule4k, cand) : cand;
        if (q4k) best4k = best4k ? better(best4k, cand) : cand;
      }
    }
    return bestRule4k || best4k || first;
  };

  const task = (async () => {
    const pool = await smartBuildSourcePool();
    const sources = (Array.isArray(pool) ? pool : []).filter((s) => s && s.siteKey && s.spiderApi && s.videoId).slice(0, 18);

    const out = [];
    for (let i = 0; i < sources.length; i += 1) {
      if (seqAtCall !== tmdbMovieSmartFetchState.seq) return;
      const src0 = sources[i];
      const entry = await ensureTMDBSmartDetailCacheEntry(src0);
      const picked = pickFromDetailEntry(src0, entry);
      if (!picked || !picked.ep || !picked.ep.url) continue;

      const siteName = (picked.siteName || src0.siteName || picked.siteKey || src0.siteKey || '').trim();
      const url = String(picked.ep.url || '').trim();
      const rawNames = extractRawNamesFromEpisodeUrl(url);
      const rawFile = (rawNames[0] || (picked.ep && picked.ep.name != null ? String(picked.ep.name) : '') || url).trim();
      const display = `${siteName || '站点'} · ${rawFile || '未命名'}`;

      out.push({
        ...picked.ep,
        name: display,
        __tmdbMovieSiteKey: picked.siteKey || src0.siteKey || '',
        __tmdbMovieSiteName: siteName,
        __tmdbMovieSpiderApi: picked.spiderApi || src0.spiderApi || '',
        __tmdbMovieVideoId: picked.videoId || src0.videoId || '',
        __tmdbMovieCand: picked,
      });
    }

    out.sort((a, b) => smartCompareCandidates(a && a.__tmdbMovieCand, b && b.__tmdbMovieCand, { explicit, orderKeys }));
    out.forEach((ep0) => {
      try {
        delete ep0.__tmdbMovieCand;
      } catch (_e) {}
    });

    if (seqAtCall === tmdbMovieSmartFetchState.seq) tmdbMovieSmartEpisodes.value = out;
  })();

  tmdbMovieSmartFetchState.inFlight = task;
  try {
    await task;
  } finally {
    if (tmdbMovieSmartFetchState.inFlight === task) tmdbMovieSmartFetchState.inFlight = null;
  }
};

const smartSwitchPickState = { seq: 0, inFlight: null };

const smartSwitchTo = async ({
  panToken = '',
  panMode = '',
  preferredPanToken = '',
  qualityMode = 'auto',
  switchKind = '',
  targetSiteKey = '',
  cacheOnly = true,
  excludeCurrent = true,
  excludePlayed = false,
} = {}) => {
  if (!tmdbSmartListAvailable.value || selectedPanKey.value !== SMART_PAN_KEY) return false;
  if (playLoading.value) return false;

  const eps = selectedEpisodes.value;
  const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
  const idx = idxRaw >= 0 ? idxRaw : 0;
  const ep = Array.isArray(eps) && eps.length ? eps[idx] : null;
  const episodeNo = resolveSmartEpisodeNo(ep);
  if (!episodeNo) return false;
  const seasonNo = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
  const seasonEpisodeNo = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
  const requireSeasoned = contentKind.value === 'series';

  const explicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const orderKeys =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];

  const seq = (smartSwitchPickState.seq += 1);
  const currentPick = tmdbSmartPickCache.get(episodeNo) || null;
  const excludeKey = excludeCurrent && currentPick ? smartCandidateKey(currentPick) : '';
  const currentSiteKey = currentPick && currentPick.siteKey ? String(currentPick.siteKey) : '';
  const excludeIdentity = excludeCurrent && currentPick ? smartSourceIdentity(currentPick) : '';
  const played = excludePlayed ? smartLoadPlayedSet(episodeNo) : { groupKey: '', set: new Set() };

  const orderMap = smartBuildSiteOrderMap();
  const preferredSite = typeof targetSiteKey === 'string' ? targetSiteKey.trim() : '';

  const concurrency = smartPickConcurrency.value;
  const tmdbHasMultiSeason = (() => {
    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
    const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
    return real.length >= 2;
  })();
  const extractSeasonHintFromText = (text) => {
    const s = typeof text === 'string' ? text.trim() : '';
    if (!s) return 0;
    const mSe = s.match(/S(\d{1,2})\s*E\d{1,5}/i);
    if (mSe && mSe[1]) {
      const n = Number.parseInt(String(mSe[1]), 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    const mSeason = s.match(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/i);
    if (mSeason && mSeason[1]) {
      const raw = String(mSeason[1]);
      const digits = raw.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
      const n = /^\d+$/.test(digits) ? Number.parseInt(digits, 10) : parseChineseNumeralToInt(raw);
      if (Number.isFinite(n) && n > 0) return Math.floor(n);
    }
    return 0;
  };
  const extractSeasonHintFromSource = (src) => {
    const hinted = src && Number.isFinite(Number(src.seasonHint)) ? Math.floor(Number(src.seasonHint)) : 0;
    if (hinted > 0) return hinted;
    const title = src && src.videoTitle != null ? String(src.videoTitle) : '';
    const remark = src && src.videoRemark != null ? String(src.videoRemark) : '';
    return extractSeasonHintFromText(title) || extractSeasonHintFromText(remark) || 0;
  };
  const isGoodEnough = (cand) => {
    const feat = smartComputeCandidateFeatures(cand);
    const q = feat && feat.quality ? feat.quality : '';
    const qr = Number(feat && feat.qualityRank) || 0;
    const key = typeof qualityMode === 'string' ? qualityMode.trim() : '';
    if (key === '4k_hdr') return q === '4K' && feat.hasHdr;
    if (key === '4k_fps') return q === '4K' && feat.fps60;
    if (key === '4k') return q === '4K';
    if (key === '1080p') return q === '1080P';
    if (key === '720p') return q === '720P';
	    return qr === 3;
	  };

  const pickFromSource = async (src, { allowFetchDetail = false } = {}) => {
    if (!src) return null;
    if (preferredSite && String(src.siteKey || '') !== preferredSite) return null;
    const entry = (() => {
      const sourceKey = smartBuildSourceKey(src);
      const hit = tmdbSmartDetailCache.get(sourceKey) || null;
      if (hit && hit.ok !== false && hit.episodeMap && hit.episodeMapLoose && hit.pans) return hit;
      return null;
    })();
    const ensured = !entry && allowFetchDetail ? await ensureTMDBSmartDetailCacheEntry(src) : entry;
    const finalEntry = ensured || null;
    if (!finalEntry || finalEntry.ok === false) return null;
    if (seq !== smartSwitchPickState.seq) return null;
    const cands = smartGetCandidatesFromEntry(finalEntry, { episodeNo, seasonNo, seasonEpisodeNo, requireSeasoned });
    return smartPickBestFromList(cands, {
      explicit,
      orderKeys,
      excludeKey,
      excludeIdentity,
      excludePlayedSet: played && played.set ? played.set : null,
      panToken,
      panMode,
      preferredPanToken,
      qualityMode,
    });
  };

  const buildOrderedSources = async ({ preferSameSite = true } = {}) => {
    const sources = await smartBuildSourcePool();
    const list = Array.isArray(sources) ? sources.filter((s) => s && s.siteKey && s.spiderApi && s.videoId) : [];
    if (!list.length) return [];
    const sameSiteKey = (preferredSite || currentSiteKey || '').trim();
    const orderOf = (siteKey) => (orderMap && orderMap.has(siteKey) ? orderMap.get(siteKey) : 999999);
    const isSameSite = (s) => !!(preferSameSite && sameSiteKey && String(s.siteKey || '') === sameSiteKey);
    const seasonFitRankOf = (src) => {
      if (!tmdbHasMultiSeason || !(seasonNo > 0)) return 0;
	      const hinted = extractSeasonHintFromSource(src);
	      if (hinted === seasonNo) return 3;
	      if (hinted > 0) return 1;
	      return 2;
	    };
    return list
      .slice()
      .sort((a, b) => {
        if (tmdbHasMultiSeason && seasonNo > 0) {
          const ar = seasonFitRankOf(a);
          const br = seasonFitRankOf(b);
          if (ar !== br) return br - ar;
        }
        const an = a && a.__noNoiseMatch ? 1 : 0;
        const bn = b && b.__noNoiseMatch ? 1 : 0;
        if (an !== bn) return bn - an;
        const as = Number(a && a.__score) || 0;
        const bs = Number(b && b.__score) || 0;
        if (as !== bs) return bs - as;
        const asame = isSameSite(a) ? 1 : 0;
        const bsame = isSameSite(b) ? 1 : 0;
        if (asame !== bsame) return bsame - asame;
        const ao = orderOf(String(a.siteKey || ''));
        const bo = orderOf(String(b.siteKey || ''));
        if (ao !== bo) return ao - bo;
        const aq = Number(a && a.__seq) || 0;
        const bq = Number(b && b.__seq) || 0;
        if (aq !== bq) return aq - bq;
        return String(a.siteKey || '').localeCompare(String(b.siteKey || ''), 'zh');
      });
  };

  const pickFromOrderedSources = async ({ allowFetchDetail = false, preferSameSite = true } = {}) => {
	    const candidates = await buildOrderedSources({ preferSameSite });
	    if (!candidates.length) return null;
	    let best = null;
	    let cursor = 0;
	    const inFlight = new Map();

    const launch = (idx) => {
      const src = candidates[idx];
      const p = Promise.resolve()
        .then(() => pickFromSource(src, { allowFetchDetail }))
        .then((value) => ({ idx, value: value || null }))
        .catch(() => ({ idx, value: null }));
      inFlight.set(idx, p);
    };

    const poolSize = Math.max(1, Math.min(concurrency, candidates.length));
    while (cursor < candidates.length && inFlight.size < poolSize) {
      launch(cursor);
      cursor += 1;
    }

    while (inFlight.size) {
      const settled = await Promise.race(Array.from(inFlight.values()));
      const idx = settled && Number.isFinite(Number(settled.idx)) ? Number(settled.idx) : -1;
      if (idx >= 0) inFlight.delete(idx);
      if (seq !== smartSwitchPickState.seq) return null;

      const cand = settled && settled.value ? settled.value : null;
      if (cand) {
        if (!best || smartCompareCandidates(best, cand, { explicit, orderKeys }) > 0) best = cand;
        if (isGoodEnough(cand)) return cand;
      }

      if (cursor < candidates.length) {
        launch(cursor);
        cursor += 1;
      }
    }
    return best;
  };

  const tryAdvanceSearchOnce = async () => {
    if (seq !== smartSwitchPickState.seq) return false;
    const beforeQueue = sourcesSearchRuntime.queue.length;
    const beforeCount = aggregatedSources.value.length;
    if (!sourcesLoading.value) {
      try {
        await fetchAggregatedSourcesExactMatches();
      } catch (_e) {}
    }
    if (seq !== smartSwitchPickState.seq) return false;
    return sourcesSearchRuntime.queue.length !== beforeQueue || aggregatedSources.value.length !== beforeCount;
  };

  let chosen = null;

	  chosen = await pickFromOrderedSources({ allowFetchDetail: !cacheOnly, preferSameSite: true });

	  if (!chosen) {
	    for (let round = 0; round < 200; round += 1) {
      if (seq !== smartSwitchPickState.seq) return false;
      if (sourcesSearchDone.value) break;
      const progressed = await tryAdvanceSearchOnce();
      if (!progressed && sourcesSearchDone.value) break;
      chosen = await pickFromOrderedSources({ allowFetchDetail: true, preferSameSite: false });
      if (chosen && chosen.ep && chosen.ep.url) break;
      if (!progressed) break;
	    }
	  }

  if (!chosen || !chosen.ep || !chosen.ep.url) {
    showPlayerToast('未匹配到相关片源');
    return false;
  }

  tmdbSmartPickCache.set(episodeNo, chosen);
  tmdbSmartPickCacheVersion.value += 1;
  try {
    const started = await requestPlay();
    if (started && played && played.groupKey && played.set) {
      const id = smartSourceIdentity(chosen);
      if (id) {
        played.set.add(id);
        smartSavePlayedSet(played.groupKey, played.set);
      }
    }
  } catch (_e) {}
  return true;
};

const smartCurrentEpisodeNo = computed(() => {
  if (!tmdbSmartListAvailable.value || selectedPanKey.value !== SMART_PAN_KEY) return 0;
  const eps = selectedEpisodes.value;
  const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
  const idx = idxRaw >= 0 ? idxRaw : 0;
  const ep = Array.isArray(eps) && eps.length ? eps[idx] : null;
  return resolveSmartEpisodeNo(ep);
});

const smartCurrentPicked = computed(() => {
  const epNo = smartCurrentEpisodeNo.value;
  if (!epNo) return null;
  return tmdbSmartPickCache.get(epNo) || null;
});

const smartCurrentPanToken = computed(() => {
  const cand = smartCurrentPicked.value;
  const label = cand && cand.panLabel != null ? String(cand.panLabel) : '';
  const token = smartCleanPanToken(label);
  if (token) return token;
  return smartCleanPanToken(playerStatsPanName.value || '');
});

const smartCurrentQualityModeKey = computed(() => {
  const cand = smartCurrentPicked.value;
  if (!cand) {
    const q = smartGuessQuality(playerStatsRawFileName.value || '') || playerResolutionQuality.value;
    if (q === '4K') return '4k';
    if (q === '1080P') return '1080p';
    if (q === '720P') return '720p';
    return 'auto';
  }
  const feat = smartComputeCandidateFeatures(cand);
  const q =
    (feat && feat.quality ? feat.quality : '') ||
    smartGuessQuality(playerStatsRawFileName.value || '') ||
    playerResolutionQuality.value;
  if (q === '4K' && feat.hasHdr) return '4k_hdr';
  if (q === '4K' && feat.fps60) return '4k_fps';
  if (q === '4K') return '4k';
  if (q === '1080P') return '1080p';
  if (q === '720P') return '720p';
  return 'auto';
});

const smartCurrentQualityLabel = computed(() => {
  const cand = smartCurrentPicked.value;
  if (!cand) {
    const q = smartGuessQuality(playerStatsRawFileName.value || '') || playerResolutionQuality.value;
    return q || '未知';
  }
  const feat = smartComputeCandidateFeatures(cand);
  const q =
    (feat && feat.quality ? feat.quality : '') ||
    smartGuessQuality(playerStatsRawFileName.value || '') ||
    playerResolutionQuality.value;
  if (!q) return '未知';
  if (q === '4K' && feat.hasHdr) return '4K·HDR';
  if (q === '4K' && feat.fps60) return '4K·60帧';
  return q;
});

const smartUiPanOverride = ref('');
const smartUiQualityOverride = ref('');

watch(
  () => smartCurrentPicked.value && smartCurrentEpisodeNo.value ? `${smartCurrentEpisodeNo.value}` : '',
  () => {
    const epNo = smartCurrentEpisodeNo.value;
    const cand = smartCurrentPicked.value;
    if (!epNo || !cand) return;
    const played = smartLoadPlayedSet(epNo);
    if (!played || !played.groupKey || !played.set) return;
    const id = smartSourceIdentity(cand);
    if (!id) return;
    if (played.set.has(id)) return;
    played.set.add(id);
    smartSavePlayedSet(played.groupKey, played.set);
  },
  { immediate: true }
);

const playerExtraMenus = computed(() => {
  if (!isSmartPanActive.value) return [];
  const panTokens = Array.isArray(smartPanMatchTokensSetting.value) ? smartPanMatchTokensSetting.value : [];
  const panToken = smartCurrentPanToken.value;
  const qualityKey = smartCurrentQualityModeKey.value;
  const qualityLabel = smartCurrentQualityLabel.value;
  return [
	    {
	      key: 'pan',
	      label: panToken || '未知',
	      ariaLabel: '网盘',
	      value: panToken || '',
	      disabled: !panTokens.length,
	      options: panTokens.map((t) => ({ value: String(t || '').trim(), label: String(t || '').trim() })).filter((o) => o.value),
	    },
    {
      key: 'quality',
      label: qualityLabel || '未知',
      ariaLabel: '画质',
      value: qualityKey || 'auto',
      disabled: false,
      options: [
        { value: '4k_hdr', label: '4K·HDR' },
        { value: '4k_fps', label: '4K·60帧' },
        { value: '4k', label: '4K' },
        { value: '1080p', label: '1080P' },
        { value: '720p', label: '720P' },
        { value: 'auto', label: '自动' },
      ],
    },
  ];
});

const playerExtraActions = computed(() => {
  if (!isSmartPanActive.value) return [];
  return [{ key: 'switch', label: '换源', ariaLabel: '换源' }];
});

const onPlayerExtraMenuSelect = async (payload) => {
  const key = payload && payload.key != null ? String(payload.key) : '';
  const value = payload && payload.value != null ? String(payload.value) : '';
  if (!key) return;
  if (!isSmartPanActive.value) return;

  if (key === 'pan') {
    const cur = smartCurrentPanToken.value;
    if (cur && value && cur === value) {
      showPlayerToast('已是当前网盘');
      return;
    }
    smartUiPanOverride.value = value;
    const q = (smartUiQualityOverride.value || smartCurrentQualityModeKey.value || 'auto').trim() || 'auto';
    await smartSwitchTo({ panToken: value, panMode: 'require', qualityMode: q, switchKind: 'pan', excludeCurrent: true, excludePlayed: false });
    return;
  }
  if (key === 'quality') {
    const cur = smartCurrentQualityModeKey.value;
	    if (cur && value && cur === value) {
	      showPlayerToast('已是当前画质');
	      return;
	    }
	    smartUiQualityOverride.value = value;
	    await smartSwitchTo({
	      panMode: 'prefer',
	      preferredPanToken: smartCurrentPanToken.value || '',
      qualityMode: value || 'auto',
      switchKind: 'quality',
      excludeCurrent: true,
      excludePlayed: false,
    });
    return;
  }
};

const onPlayerExtraAction = async (keyRaw) => {
  const key = keyRaw != null ? String(keyRaw) : '';
  if (key !== 'switch') return;
  if (!isSmartPanActive.value) return;
  const q = (smartUiQualityOverride.value || smartCurrentQualityModeKey.value || 'auto').trim() || 'auto';
  await smartSwitchTo({
    panMode: 'prefer',
    preferredPanToken: smartCurrentPanToken.value || '',
    qualityMode: q,
    switchKind: 'switch',
    excludeCurrent: true,
    excludePlayed: true,
  });
};

const resolveTMDBSmartPlaybackCandidate = async ({ episodeNo, seasonNo } = {}) => {
  const want = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (want <= 0) return null;

  const preferSeasonNo = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;

  const cachedPick = tmdbSmartPickCache.get(want) || null;
  if (cachedPick && cachedPick.ep && cachedPick.ep.url) return cachedPick;
  const existingFlight = tmdbSmartPickInFlight.get(want) || null;
  if (existingFlight) return await existingFlight;

	  const run = (async () => {

	  const order =
    Array.isArray(effectiveBootstrapSettings.value.searchSiteOrder) ? effectiveBootstrapSettings.value.searchSiteOrder : [];
  const orderMap = new Map();
  order.forEach((k, idx) => {
    const kk = typeof k === 'string' ? k.trim() : '';
    if (kk && !orderMap.has(kk)) orderMap.set(kk, idx);
  });

  const historySiteKey = resumeHistory.value && typeof resumeHistory.value.siteKey === 'string' ? resumeHistory.value.siteKey.trim() : '';
  const historySpider = resumeHistory.value && typeof resumeHistory.value.spiderApi === 'string' ? resumeHistory.value.spiderApi.trim() : '';
  const historyVideoId = resumeHistory.value && typeof resumeHistory.value.videoId === 'string' ? resumeHistory.value.videoId.trim() : '';

  const currentSiteKey = ((props.siteKey || '').trim() || historySiteKey).trim();
  const currentSpider = ((resolvedSpiderApiFinal.value || '').trim() || historySpider).trim();
  const currentVideoId = (((props.siteKey || '').trim() ? (props.videoId || '').trim() : '') || historyVideoId).trim();

  const badgeEpOf = (src) => {
    const r = src && typeof src.videoRemark === 'string' ? src.videoRemark : '';
    return extractMaxEpisodeFromBadgeText(r);
  };

  const extractSeasonHintFromText = (text) => {
    const s = typeof text === 'string' ? text.trim() : '';
    if (!s) return 0;
    const mSe = s.match(/S(\d{1,2})\s*E\d{1,5}/i);
    if (mSe && mSe[1]) {
      const n = Number.parseInt(String(mSe[1]), 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    const mSeason = s.match(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/i);
    if (mSeason && mSeason[1]) {
      const raw = String(mSeason[1]);
      const digits = raw.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
      const n = /^\d+$/.test(digits) ? Number.parseInt(digits, 10) : parseChineseNumeralToInt(raw);
      if (Number.isFinite(n) && n > 0) return Math.floor(n);
    }
    return 0;
  };

  const extractSeasonHintFromSource = (src) => {
    const hinted = src && Number.isFinite(Number(src.seasonHint)) ? Math.floor(Number(src.seasonHint)) : 0;
    if (hinted > 0) return hinted;
    const title = src && src.videoTitle != null ? String(src.videoTitle) : '';
    const remark = src && src.videoRemark != null ? String(src.videoRemark) : '';
    return extractSeasonHintFromText(title) || extractSeasonHintFromText(remark) || 0;
  };

  const hasExplicitSeasonMarkerInSource = (src) => {
    const title = src && src.videoTitle != null ? String(src.videoTitle) : '';
    const remark = src && src.videoRemark != null ? String(src.videoRemark) : '';
    const re = /S\d{1,2}\s*E\d{1,5}/i;
    const reCn = /第\s*(?:[0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季/i;
    return re.test(title) || re.test(remark) || reCn.test(title) || reCn.test(remark);
  };

	  const tmdbHasMultiSeason = (() => {
	    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
	    const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
	    return real.length >= 2;
	  })();

	  const tmdbSeasonEpisodeOfGlobal = (globalNo) => {
	    const g = Number.isFinite(Number(globalNo)) ? Math.floor(Number(globalNo)) : 0;
	    if (g <= 0) return { season: 0, episode: 0 };
	    const list = Array.isArray(tmdbSmartEpisodes.value) ? tmdbSmartEpisodes.value : [];
	    const picked = list[g - 1] || null;
	    const season = picked && Number.isFinite(Number(picked.__tmdbSeason)) ? Math.floor(Number(picked.__tmdbSeason)) : 0;
	    const episode = picked && Number.isFinite(Number(picked.__tmdbSeasonEpisode)) ? Math.floor(Number(picked.__tmdbSeasonEpisode)) : 0;
	    if (season > 0 && episode > 0) return { season, episode };
	    return { season: 0, episode: g };
	  };

  const buildCandidates = () => {
    const candidatesRaw = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
    const candidates = candidatesRaw
      .slice()
      .sort((a, b) => {
        if (tmdbHasMultiSeason && preferSeasonNo > 0) {
          const as = extractSeasonHintFromSource(a);
          const bs = extractSeasonHintFromSource(b);
          const am = as === preferSeasonNo;
          const bm = bs === preferSeasonNo;
          if (am !== bm) return am ? -1 : 1;
          const aWrong = as > 0 && as !== preferSeasonNo;
          const bWrong = bs > 0 && bs !== preferSeasonNo;
          if (aWrong !== bWrong) return aWrong ? 1 : -1;
          const aHas = hasExplicitSeasonMarkerInSource(a) || as > 0;
          const bHas = hasExplicitSeasonMarkerInSource(b) || bs > 0;
          if (aHas !== bHas) return aHas ? -1 : 1;
        }

        const ap = badgeEpOf(a);
        const bp = badgeEpOf(b);
        const aPrefer = ap >= want;
        const bPrefer = bp >= want;
        if (aPrefer !== bPrefer) return aPrefer ? -1 : 1;

	        const an = a && a.__noNoiseMatch ? 1 : 0;
	        const bn = b && b.__noNoiseMatch ? 1 : 0;
        if (an !== bn) return bn - an;
        const ascore = Number(a && a.__score) || 0;
        const bscore = Number(b && b.__score) || 0;
        if (ascore !== bscore) return bscore - ascore;
        const aseq = Number(a && a.__seq) || 0;
        const bseq = Number(b && b.__seq) || 0;
        if (aseq !== bseq) return aseq - bseq;

        const ao = orderMap.has(a.siteKey) ? orderMap.get(a.siteKey) : 999999;
        const bo = orderMap.has(b.siteKey) ? orderMap.get(b.siteKey) : 999999;
        if (ao !== bo) return ao - bo;
        return (a.siteName || a.siteKey).localeCompare(b.siteName || b.siteKey, 'zh');
      });

    if (currentSiteKey && currentSpider && currentVideoId) {
      const idx = candidates.findIndex(
        (s) => s && s.siteKey === currentSiteKey && s.spiderApi === currentSpider && s.videoId === currentVideoId
      );
      if (idx > 0) {
        const picked = candidates.splice(idx, 1)[0];
        candidates.unshift(picked);
      }
    }

	    const now = Date.now();
	    const keyOf = (src) => smartBuildSourceKey(src);

    const seen = new Set();
    const uniqueCandidates = [];
    candidates.forEach((s) => {
      const k = keyOf(s);
      if (!k) return;
      if (seen.has(k)) return;
      seen.add(k);
      uniqueCandidates.push(s);
    });
    const rankOf = (src) => {
      const hit = tmdbSmartDetailCache.get(keyOf(src)) || null;
      if (hit && hit.ok === false) {
        const nextRetryAt = Number.isFinite(Number(hit.nextRetryAt)) ? Number(hit.nextRetryAt) : 0;
        if (nextRetryAt > 0 && now < nextRetryAt) return 2;
        return 1;
      }
      if (hit && hit.episodeMap && hit.episodeMapLoose && hit.pans) return 0;
      return 1;
    };

    const okCached = [];
    const retryable = [];
    const cooldownFailed = [];
    uniqueCandidates.forEach((s) => {
      const r = rankOf(s);
      if (r === 0) okCached.push(s);
      else if (r === 2) cooldownFailed.push(s);
      else retryable.push(s);
    });
    return okCached.concat(retryable, cooldownFailed);
  };

  const concurrencyRaw = effectiveBootstrapSettings.value.searchThreadCount;
  const concurrencyNum = Number(concurrencyRaw);
  const concurrency =
    Number.isFinite(concurrencyNum) && concurrencyNum > 0 ? Math.min(50, Math.floor(concurrencyNum)) : 5;

  const apiBase = resolveCatApiBaseForPlay();
  const tvUser = props.bootstrap?.user?.username || '';

  const panTokenOrder = compiledSmartPanMatchTokens.value;
  const explicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const orderKeys =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];

  const labelTokenIdxOf = (label) => {
    const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
    if (!s) return -1;
    for (let i = 0; i < panTokenOrder.length; i += 1) {
      const t = panTokenOrder[i];
      if (t && s.includes(t)) return i;
    }
    return -1;
  };

  const comparePanTokenIdx = (a, b) => {
    const av = Number.isFinite(Number(a)) ? Number(a) : -1;
    const bv = Number.isFinite(Number(b)) ? Number(b) : -1;
    if (av < 0 && bv < 0) return 0;
    if (av < 0) return 1;
    if (bv < 0) return -1;
    return av - bv;
  };

  const computeBigHitCount = (m) => {
    const conds = Array.isArray(explicit) ? explicit : [];
    let hit = 0;
    conds.forEach((k) => {
      if (k === '网盘') {
        if (m && Number.isFinite(Number(m.panTokenIdx)) && Number(m.panTokenIdx) >= 0) hit += 1;
        return;
      }
      if (k === '画质') {
        const feat = smartComputeCandidateFeatures(m);
        if (feat && Number(feat.qualityRank) > 0) hit += 1;
        return;
      }
      if (k === '帧率') {
        const feat = smartComputeCandidateFeatures(m);
        if (feat && feat.fps60) hit += 1;
        return;
      }
      else if (k === '关键字' && m && m.matchKeyword && m.matchKeyword.count > 0) hit += 1;
    });
    return hit;
  };

  const compareSmartMatch = (a, b) => {
    const af = smartComputeCandidateFeatures(a);
    const bf = smartComputeCandidateFeatures(b);
    if (af && bf && Number(af.tierRank) !== Number(bf.tierRank)) return Number(bf.tierRank) - Number(af.tierRank);

    if (tmdbHasMultiSeason && preferSeasonNo > 0) {
      const seasonRank = (m) => {
        const matchSeason = m && Number.isFinite(Number(m.matchSeason)) ? Math.floor(Number(m.matchSeason)) : 0;
        if (matchSeason === preferSeasonNo) return 4;
        const hint = m && Number.isFinite(Number(m.searchSeasonHint)) ? Math.floor(Number(m.searchSeasonHint)) : 0;
        if (hint === preferSeasonNo) return 3;
        const hasSeason = !!(m && (m.hasSeasonMarker || hint > 0));
        if (hasSeason) return 1;
        return 0;
      };
      const ar = seasonRank(a);
      const br = seasonRank(b);
      if (ar !== br) return br - ar;
    }

    const ah = computeBigHitCount(a);
    const bh = computeBigHitCount(b);
    if (ah !== bh) return bh - ah;
    for (let i = 0; i < orderKeys.length; i += 1) {
      const key = orderKeys[i];
      if (key === '网盘') {
        const q = comparePanTokenIdx(a && a.panTokenIdx, b && b.panTokenIdx);
        if (q) return q;
        continue;
      }
      const q =
        key === '画质'
          ? (Number(bf && bf.qualityRank) || 0) - (Number(af && af.qualityRank) || 0)
          : key === '帧率'
            ? (bf && bf.fps60 ? 1 : 0) - (af && af.fps60 ? 1 : 0)
            : comparePriorityMatch(a.matchKeyword, b.matchKeyword);
      if (q) return q;
    }

    const ex = comparePriorityMatch(af && af.enhanceMatch, bf && bf.enhanceMatch);
    if (ex) return ex;
    return 0;
  };

  const pickBestMatch = (list) => {
    const items = Array.isArray(list) ? list.filter(Boolean) : [];
    if (!items.length) return null;
    let best = items[0];
    for (let i = 1; i < items.length; i += 1) {
      if (compareSmartMatch(best, items[i]) > 0) best = items[i];
    }
    return best;
  };

  const rules = compiledMagicEpisodeRules.value;
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  const buildSourceKey = (src) => {
    const siteKey = src && src.siteKey ? String(src.siteKey) : '';
    const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
    const videoId = src && src.videoId ? String(src.videoId) : '';
    return `${siteKey}::${spiderApi}::${videoId}`;
  };

	  const loadOrBuildDetailCache = async (src) => {
	    const siteKey = src && src.siteKey ? String(src.siteKey) : '';
	    const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
	    const videoId = src && src.videoId ? String(src.videoId) : '';
	    const sourceKey = buildSourceKey(src);
	    if (!siteKey || !spiderApi || !videoId) return null;
	    const hit = tmdbSmartDetailCache.get(sourceKey) || null;
	    if (hit) {
	      if (hit.ok === false) {
	        const now = Date.now();
	        const nextRetryAt = Number.isFinite(Number(hit.nextRetryAt)) ? Number(hit.nextRetryAt) : 0;
	        if (nextRetryAt > 0 && now < nextRetryAt) return hit;
	      } else if (hit.episodeMap && hit.episodeMapLoose && hit.pans) {
	        return hit;
	      }
	    }
	    const inFlight = tmdbSmartDetailInFlight.get(sourceKey) || null;
	    if (inFlight) {
	      await inFlight;
	      return tmdbSmartDetailCache.get(sourceKey) || null;
    }

		    const task = (async () => {
		      try {
			        const raw = await requestCatSpider({
			          apiBase,
			          username: tvUser,
			          action: 'detail',
			          spiderApi,
			          payload: { id: videoId },
			        });
			        const d = extractDetailFromResponse(raw);
			        const resolved = await resolvePanMockPlaySources({ raw, playFrom: d.playFrom, playUrl: d.playUrl });
			        const pans = parsePlaySources(resolved.playFrom, resolved.playUrl);
			        const entry = {
			          ok: true,
		          failCount: 0,
	          siteKey,
	          spiderApi,
	          siteName: src && src.siteName ? String(src.siteName) : siteKey,
	          videoId,
	          pans: Array.isArray(pans) ? pans : [],
	          episodeMap: new Map(),
	          episodeMapLoose: new Map(),
	          pickedFallback: new Map(),
	        };

        const panTokenOrder = compiledSmartPanMatchTokens.value;
        const labelTokenIdxOf = (label) => {
          const s = typeof label === 'string' ? label.trim().toLowerCase() : '';
          if (!s) return -1;
          for (let i = 0; i < panTokenOrder.length; i += 1) {
            const t = panTokenOrder[i];
            if (t && s.includes(t)) return i;
          }
          return -1;
        };

        const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
        const srcTitleLower = (() => {
          try {
            const t = src && src.videoTitle != null ? String(src.videoTitle) : '';
            return t ? t.trim().toLowerCase() : '';
          } catch (_e) {
            return '';
          }
        })();
        const srcRemarkLower = (() => {
          try {
            const r = src && src.videoRemark != null ? String(src.videoRemark) : '';
            return r ? r.trim().toLowerCase() : '';
          } catch (_e) {
            return '';
          }
        })();

		        (entry.pans || []).forEach((pan) => {
		          const panLabel = pan && pan.label != null ? String(pan.label) : '';
	          const panTokenIdx = labelTokenIdxOf(panLabel);
	          const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
	          episodes.forEach((ep) => {
	            if (!ep || !ep.url) return;
	            const texts = extractEpisodeCandidateTexts(ep);
	            const primary = texts[0] || (ep && ep.name != null ? String(ep.name) : '') || '';
	            const rawLower = buildCandidateLowerText(texts) || String(primary || '').toLowerCase();
	            const match =
	              Array.isArray(rules) && rules.length
	                ? extractSeasonEpisodeFromCandidates(texts, rules, cleanRules)
	                : parseLooseSeasonEpisodeFromText(primary);
	            const seasonNo = match && Number.isFinite(Number(match.season)) ? Math.floor(Number(match.season)) : 0;
	            const epNo = match && Number.isFinite(Number(match.episode)) ? Math.floor(Number(match.episode)) : 0;
	            if (epNo <= 0) return;
	            const cand = {
	              siteKey: entry.siteKey,
	              spiderApi: entry.spiderApi,
	              siteName: entry.siteName,
	              videoId: entry.videoId,
	              srcTitleLower,
	              srcRemarkLower,
	              panLabel,
	              panTokenIdx,
	              ep,
	              rawLower,
	              matchSeason: seasonNo,
	              hasSeasonMarker: seasonNo > 0,
	              searchSeasonHint: 0,
	              matchKeyword: computePriorityMatch(rawLower, Array.isArray(keywordTokens) ? keywordTokens : []),
	            };
	            if (tmdbHasMultiSeason && seasonNo <= 0) {
	              const list = entry.episodeMapLoose.get(epNo) || [];
	              list.push(cand);
	              entry.episodeMapLoose.set(epNo, list);
	              return;
	            }
	            const keyNo = seasonNo > 0 ? (tmdbGlobalEpisodeNoOf(seasonNo, epNo) || epNo) : epNo;
	            const list = entry.episodeMap.get(keyNo) || [];
	            list.push(cand);
	            entry.episodeMap.set(keyNo, list);
	          });
	        });

	        tmdbSmartDetailCache.set(sourceKey, entry);
	        tmdbSmartDetailCacheVersion.value += 1;
		      } catch (e) {
		        try {
		          const prev = tmdbSmartDetailCache.get(sourceKey) || null;
		          const prevCount =
		            prev && prev.ok === false && Number.isFinite(Number(prev.failCount)) ? Math.floor(Number(prev.failCount)) : 0;
          const failCount = prevCount + 1;
          const now = Date.now();
          const delay = Math.min(
            SMART_DETAIL_FAIL_COOLDOWN_MAX_MS,
            SMART_DETAIL_FAIL_COOLDOWN_BASE_MS * Math.pow(2, Math.max(0, failCount - 1))
          );
          const status = e && typeof e.status === 'number' ? e.status : 0;
          const msg = e && e.message ? String(e.message) : '请求失败';
          tmdbSmartDetailCache.set(sourceKey, {
            ok: false,
            failCount,
            failedAt: now,
            nextRetryAt: now + delay,
            lastError: status ? `HTTP ${status}：${msg}` : msg,
            siteKey,
            spiderApi,
            siteName: src && src.siteName ? String(src.siteName) : siteKey,
            videoId,
            pans: [],
            episodeMap: new Map(),
            episodeMapLoose: new Map(),
            pickedFallback: new Map(),
          });
          tmdbSmartDetailCacheVersion.value += 1;
        } catch (_e2) {}
      } finally {
        tmdbSmartDetailInFlight.delete(sourceKey);
      }
    })();

    tmdbSmartDetailInFlight.set(sourceKey, task);
    await task;
	    return tmdbSmartDetailCache.get(sourceKey) || null;
	  };

	  const fetchDetailAndPickEpisode = async (src, { requireSeasoned = false } = {}) => {
	    const siteKey = src && src.siteKey ? String(src.siteKey) : '';
	    const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
	    const videoId = src && src.videoId ? String(src.videoId) : '';
	    if (!siteKey || !spiderApi || !videoId) return null;
	    const searchSeasonHint = extractSeasonHintFromSource(src);
	    try {
	      const cache = await loadOrBuildDetailCache(src);
	      if (!cache || !cache.episodeMap) return null;
	      if (cache.ok === false) return null;

	      const wantedInSeason = tmdbHasMultiSeason ? tmdbSeasonEpisodeOfGlobal(want) : { season: 0, episode: want };
	      const wantSeasonNo = wantedInSeason && Number.isFinite(Number(wantedInSeason.season)) ? Math.floor(Number(wantedInSeason.season)) : 0;
	      const wantSeasonEp = wantedInSeason && Number.isFinite(Number(wantedInSeason.episode)) ? Math.floor(Number(wantedInSeason.episode)) : 0;

	      const candidatesForNo = (cache.episodeMap.get(want) || []).slice().map((c) => ({ ...c, searchSeasonHint }));
	      if (requireSeasoned) {
	        const seasonedOnly = candidatesForNo.filter((c) => c && Number(c.matchSeason) > 0);
	        candidatesForNo.length = 0;
	        candidatesForNo.push(...seasonedOnly);
	      } else if (tmdbHasMultiSeason && wantSeasonEp > 0) {
	        const loose = (cache.episodeMapLoose && cache.episodeMapLoose.get(wantSeasonEp) ? cache.episodeMapLoose.get(wantSeasonEp) : [])
	          .slice()
	          .map((c) => ({ ...c, searchSeasonHint }))
	          .filter(Boolean);
	        if (loose.length) {
	          const looseFiltered =
	            wantSeasonNo > 0
	              ? loose.filter((c) => {
	                  const hinted = c && Number.isFinite(Number(c.searchSeasonHint)) ? Math.floor(Number(c.searchSeasonHint)) : 0;
	                  if (!hinted) return true;
	                  return hinted === wantSeasonNo;
	                })
	              : loose;
	          candidatesForNo.push(...(looseFiltered.length ? looseFiltered : loose));
	        }
	      }

	      if (!candidatesForNo.length) return null;

      const best = pickBestMatch(candidatesForNo);
      if (!best || !best.ep || !best.ep.url) return null;
      return best;
    } catch (_e) {
      return null;
    }
  };

  const tryPickOnce = async ({ requireSeasoned = false, poolSize: poolSizeOverride } = {}) => {
	    const candidates = buildCandidates();
	    if (!candidates.length) return null;
	    let bestOverall = null;
	    const poolNum = Number(poolSizeOverride);
	    const poolSize =
	      Number.isFinite(poolNum) && poolNum > 0 ? Math.max(1, Math.min(concurrency, Math.floor(poolNum))) : Math.max(1, concurrency);
	    let cursor = 0;
		    const inFlight = new Map();

	    const launch = (idx) => {
	      const src = candidates[idx];
	      const p = Promise.resolve()
	        .then(() => fetchDetailAndPickEpisode(src, { requireSeasoned }))
	        .then((value) => ({ idx, value: value || null }))
	        .catch(() => ({ idx, value: null }));
	      inFlight.set(idx, p);
	    };

		    while (cursor < candidates.length && inFlight.size < poolSize) {
		      launch(cursor);
		      cursor += 1;
		    }

	    while (inFlight.size) {
	      const settled = await Promise.race(Array.from(inFlight.values()));
	      const idx = settled && Number.isFinite(Number(settled.idx)) ? Number(settled.idx) : -1;
	      if (idx >= 0) inFlight.delete(idx);

	      const hit = settled && settled.value ? settled.value : null;
	      if (hit) {
	        if (!bestOverall || compareSmartMatch(bestOverall, hit) > 0) bestOverall = hit;
	        const feat = smartComputeCandidateFeatures(hit);
	        if (feat && Number(feat.qualityRank) === 3) {
	          tmdbSmartPickCache.set(want, hit);
	          tmdbSmartPickCacheVersion.value += 1;
	          return hit;
	        }
	      }

		      if (cursor < candidates.length) {
		        launch(cursor);
		        cursor += 1;
		      }
	    }

    if (bestOverall) {
      tmdbSmartPickCache.set(want, bestOverall);
      tmdbSmartPickCacheVersion.value += 1;
    }
    return bestOverall;
  };

  const tryPickFromCurrentSiteOnly = async ({ requireSeasoned = false } = {}) => {
    try {
      if (!currentSiteKey || !currentSpider || !currentVideoId) return null;
      const src = {
        siteKey: currentSiteKey,
        siteName: resolvedSiteName.value || currentSiteKey,
        spiderApi: currentSpider,
        videoId: currentVideoId,
      };
      const best = await fetchDetailAndPickEpisode(src, { requireSeasoned });
      if (best && best.ep && best.ep.url) {
        tmdbSmartPickCache.set(want, best);
        tmdbSmartPickCacheVersion.value += 1;
        return best;
      }
    } catch (_e) {}
    return null;
  };

	  if ((!aggregatedSources.value || !aggregatedSources.value.length) && !sourcesLoading.value && !sourcesSearchedOnce.value) {
	    await fetchAggregatedSourcesExactMatches();
	  }

		  for (let round = 0; round < 200; round += 1) {
			    const requireSeasoned = contentKind.value === 'series';
			    if (round === 0) {
			      const hasHistoryCandidate = !!(currentSiteKey && currentSpider && currentVideoId);
			      if (hasHistoryCandidate && concurrency > 1) {
		        const poolPromise = tryPickOnce({ requireSeasoned, poolSize: Math.max(1, concurrency - 1) });
		        const quick = await tryPickFromCurrentSiteOnly({ requireSeasoned });
		        if (quick && quick.ep && quick.ep.url) {
		          try {
		            tmdbSmartLastPickDebug.value = {
		              want,
		              requireSeasoned,
		              siteKey: quick.siteKey || '',
		              siteName: quick.siteName || '',
		              spiderApi: quick.spiderApi || '',
		              videoId: quick.videoId || '',
		              panLabel: quick.panLabel || '',
		              epName: quick.ep && quick.ep.name != null ? String(quick.ep.name) : '',
		              epUrl: quick.ep && quick.ep.url != null ? String(quick.ep.url) : '',
		              matchSeason: Number.isFinite(Number(quick.matchSeason)) ? Math.floor(Number(quick.matchSeason)) : 0,
		              hasSeasonMarker: quick.hasSeasonMarker ? 1 : 0,
		              searchSeasonHint: Number.isFinite(Number(quick.searchSeasonHint)) ? Math.floor(Number(quick.searchSeasonHint)) : 0,
		            };
		          } catch (_e) {}
		          return quick;
		        }
		        const pooled = await poolPromise;
		        if (pooled && pooled.ep && pooled.ep.url) {
		          try {
		            tmdbSmartLastPickDebug.value = {
		              want,
		              requireSeasoned,
		              siteKey: pooled.siteKey || '',
		              siteName: pooled.siteName || '',
		              spiderApi: pooled.spiderApi || '',
		              videoId: pooled.videoId || '',
		              panLabel: pooled.panLabel || '',
		              epName: pooled.ep && pooled.ep.name != null ? String(pooled.ep.name) : '',
		              epUrl: pooled.ep && pooled.ep.url != null ? String(pooled.ep.url) : '',
		              matchSeason: Number.isFinite(Number(pooled.matchSeason)) ? Math.floor(Number(pooled.matchSeason)) : 0,
		              hasSeasonMarker: pooled.hasSeasonMarker ? 1 : 0,
		              searchSeasonHint: Number.isFinite(Number(pooled.searchSeasonHint)) ? Math.floor(Number(pooled.searchSeasonHint)) : 0,
		            };
		          } catch (_e) {}
		          return pooled;
		        }
		      } else {
		        const quick = await tryPickFromCurrentSiteOnly({ requireSeasoned });
		        if (quick && quick.ep && quick.ep.url) {
		          try {
		            tmdbSmartLastPickDebug.value = {
		              want,
		              requireSeasoned,
		              siteKey: quick.siteKey || '',
		              siteName: quick.siteName || '',
		              spiderApi: quick.spiderApi || '',
		              videoId: quick.videoId || '',
		              panLabel: quick.panLabel || '',
		              epName: quick.ep && quick.ep.name != null ? String(quick.ep.name) : '',
		              epUrl: quick.ep && quick.ep.url != null ? String(quick.ep.url) : '',
		              matchSeason: Number.isFinite(Number(quick.matchSeason)) ? Math.floor(Number(quick.matchSeason)) : 0,
		              hasSeasonMarker: quick.hasSeasonMarker ? 1 : 0,
		              searchSeasonHint: Number.isFinite(Number(quick.searchSeasonHint)) ? Math.floor(Number(quick.searchSeasonHint)) : 0,
		            };
		          } catch (_e) {}
		          return quick;
		        }
		      }
		    }
		    const best = await tryPickOnce({ requireSeasoned });
		    if (best && best.ep && best.ep.url) {
		      try {
		        tmdbSmartLastPickDebug.value = {
	          want,
	          requireSeasoned,
	          siteKey: best.siteKey || '',
	          siteName: best.siteName || '',
	          spiderApi: best.spiderApi || '',
	          videoId: best.videoId || '',
	          panLabel: best.panLabel || '',
	          epName: best.ep && best.ep.name != null ? String(best.ep.name) : '',
	          epUrl: best.ep && best.ep.url != null ? String(best.ep.url) : '',
	          matchSeason: Number.isFinite(Number(best.matchSeason)) ? Math.floor(Number(best.matchSeason)) : 0,
	          hasSeasonMarker: best.hasSeasonMarker ? 1 : 0,
	          searchSeasonHint: Number.isFinite(Number(best.searchSeasonHint)) ? Math.floor(Number(best.searchSeasonHint)) : 0,
	        };
	      } catch (_e) {}
	      return best;
	    }
	    if (sourcesSearchDone.value) {
	      if (requireSeasoned) {
	        const relaxed = await tryPickOnce({ requireSeasoned: false });
	        if (relaxed && relaxed.ep && relaxed.ep.url) {
	          try {
	            tmdbSmartLastPickDebug.value = {
	              want,
	              requireSeasoned: false,
	              siteKey: relaxed.siteKey || '',
	              siteName: relaxed.siteName || '',
	              spiderApi: relaxed.spiderApi || '',
	              videoId: relaxed.videoId || '',
	              panLabel: relaxed.panLabel || '',
	              epName: relaxed.ep && relaxed.ep.name != null ? String(relaxed.ep.name) : '',
	              epUrl: relaxed.ep && relaxed.ep.url != null ? String(relaxed.ep.url) : '',
	              matchSeason: Number.isFinite(Number(relaxed.matchSeason)) ? Math.floor(Number(relaxed.matchSeason)) : 0,
	              hasSeasonMarker: relaxed.hasSeasonMarker ? 1 : 0,
	              searchSeasonHint: Number.isFinite(Number(relaxed.searchSeasonHint)) ? Math.floor(Number(relaxed.searchSeasonHint)) : 0,
	            };
	          } catch (_e) {}
	          return relaxed;
	        }
	      }
	      releaseLowPriorityHold();
	      return null;
	    }
    const beforeQueue = sourcesSearchRuntime.queue.length;
    const beforeCount = aggregatedSources.value.length;
    if (!sourcesLoading.value) await fetchAggregatedSourcesExactMatches();
    if (sourcesSearchRuntime.queue.length === beforeQueue && aggregatedSources.value.length === beforeCount) {
      releaseLowPriorityHold();
      return null;
    }
  }

  releaseLowPriorityHold();
  return null;
  })();

  tmdbSmartPickInFlight.set(want, run);
  try {
    return await run;
  } finally {
    tmdbSmartPickInFlight.delete(want);
  }
};

const requestPlay = async () => {
  let api = resolvedSpiderApiFinal.value;
  const src = selectedPanSource.value;
  const eps = selectedEpisodes.value;
  const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
  const idx = idxRaw >= 0 ? idxRaw : 0;
  const ep = eps[idx];

  consumeClickPauseIfAny({ takeover: tmdbMode.value });
  lastTMDBPlayReportCtx.value = null;

  let playShareUrl = '';
  let playFilename = '';

  let flag =
    ep && ep.flag
      ? String(ep.flag)
      : src && src.label
        ? String(src.label)
        : '';
  let id = ep && ep.url ? String(ep.url) : '';

  let historySiteKey = (props.siteKey || '').trim();
  let historySiteName = resolvedSiteName.value || '';
  let historySpiderApi = api ? String(api) : '';
  let historyVideoId = (props.videoId || '').trim();

  let statsEpName = ep && ep.name != null ? String(ep.name) : '';
  let statsEpUrl = ep && ep.url != null ? String(ep.url) : '';

  if (tmdbMovieMode.value && tmdbMovieSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY) {
    const smartApi = ep && typeof ep.__tmdbMovieSpiderApi === 'string' ? ep.__tmdbMovieSpiderApi.trim() : '';
    const smartSiteKey = ep && typeof ep.__tmdbMovieSiteKey === 'string' ? ep.__tmdbMovieSiteKey.trim() : '';
    const smartSiteName = ep && typeof ep.__tmdbMovieSiteName === 'string' ? ep.__tmdbMovieSiteName.trim() : '';
    const smartVideoId = ep && typeof ep.__tmdbMovieVideoId === 'string' ? ep.__tmdbMovieVideoId.trim() : '';
    if (smartApi && smartSiteKey) {
      api = smartApi;
      historySpiderApi = smartApi;
      historySiteKey = smartSiteKey;
      historySiteName = smartSiteName || historySiteName;
      historyVideoId = smartVideoId || historyVideoId;
      flag = ep && ep.flag ? String(ep.flag) : flag;
      id = ep && ep.url ? String(ep.url) : id;
      statsEpName = ep && ep.name != null ? String(ep.name) : statsEpName;
      statsEpUrl = ep && ep.url != null ? String(ep.url) : statsEpUrl;
    }
  }

  if (tmdbMode.value && selectedPanKey.value !== SMART_PAN_KEY && src && src.kind === 'tmdb_site_pan') {
    const sApi = src && src.spiderApi ? String(src.spiderApi).trim() : '';
    const sVid = src && src.videoId ? String(src.videoId).trim() : '';
    const sKey = src && src.siteKey ? String(src.siteKey).trim() : '';
    if (sApi && sVid && sKey) {
      api = sApi;
      historySpiderApi = sApi;
      historySiteKey = sKey;
      historySiteName = src && src.siteName ? String(src.siteName) : historySiteName;
      historyVideoId = sVid;
    }
  }

  if (tmdbSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY) {
    const wantEpisode = resolveSmartEpisodeNo(ep);
    const desiredSeason = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
    const desiredEpisodeInSeason = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
    const metaId = Number(props.tmdbId || 0);
    const metaType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : 'tv';

    // Keep server-side season_meta warm (best-effort).
    pushDoubanSeasonMetaToServerIfNeeded();

    const seasonEp = wantEpisode > 0 ? tmdbSeasonEpisodeOfGlobal(wantEpisode) : { season: 0, episode: 0 };
    const seasonNo = desiredSeason > 0 ? desiredSeason : (seasonEp && seasonEp.season ? Number(seasonEp.season) : 0);
    const episodeNo =
      desiredEpisodeInSeason > 0
        ? desiredEpisodeInSeason
        : (seasonEp && seasonEp.episode ? Number(seasonEp.episode) : 0);

    const picked = await resolveTMDBSmartPlaybackCandidate({ episodeNo: wantEpisode, seasonNo: desiredSeason });
    if (!picked) {
      playError.value = '获取视频失败，请通过手动搜索选择其他源';
      return false;
    }

    if (picked.filename) {
      api = picked.spiderApi;
      historySpiderApi = picked.spiderApi;
      historySiteKey = picked.siteId;
      historyVideoId = picked.sitePanId || historyVideoId;
      flag = picked.playFlag;
      id = '';
      playShareUrl = picked.url || '';
      playFilename = picked.filename || '';
      statsEpUrl = playFilename || '';
      lastTMDBPlayReportCtx.value = {
        tmdbId: metaId,
        type: metaType,
        season: seasonNo,
        episode: episodeNo,
        siteId: picked.siteId,
        sitePanId: picked.sitePanId,
        candidateKey: picked.candidateKey || '',
        playFlag: picked.playFlag,
        playUrl: picked.url || '',
        filename: picked.filename || '',
        playbackReported: false,
      };
    } else {
      api = picked.spiderApi;
      historySpiderApi = picked.spiderApi;
      historySiteKey = picked.siteKey;
      historySiteName = picked.siteName || historySiteName;
      historyVideoId = picked.videoId || historyVideoId;
      const pickedEp = picked.ep || null;
      flag = pickedEp && pickedEp.flag ? String(pickedEp.flag) : picked.panLabel ? String(picked.panLabel) : flag;
      id = pickedEp && pickedEp.url ? String(pickedEp.url) : '';
      statsEpName = pickedEp && pickedEp.name != null ? String(pickedEp.name) : statsEpName;
      statsEpUrl = pickedEp && pickedEp.url != null ? String(pickedEp.url) : statsEpUrl;
      lastTMDBPlayReportCtx.value = null;
    }
  }

  const pickRawFileNameForStats = (episodeName, episodeUrl) => {
    const url = typeof episodeUrl === 'string' ? episodeUrl.trim() : '';
    if (url) {
      const rawNames = extractRawNamesFromEpisodeUrl(url);
      if (Array.isArray(rawNames) && rawNames.length) return String(rawNames[0] || '').trim();
    }
    const name = typeof episodeName === 'string' ? episodeName.trim() : '';
    return name;
  };

  try {
    playerStatsSiteName.value = String(historySiteName || '').trim();
    playerStatsPanName.value = String(flag || '').trim();
    playerStatsRawFileName.value = pickRawFileNameForStats(statsEpName, statsEpUrl || id);
  } catch (_e) {
    playerStatsSiteName.value = '';
    playerStatsPanName.value = '';
    playerStatsRawFileName.value = '';
  }

  const hasId = !!(id && String(id).trim());
  const hasFilename = !!(playFilename && String(playFilename).trim());
  if (!api || !flag || (!hasId && !hasFilename)) return false;
  const playKey = `${api}::${selectedPanKey.value}::${idx}::${flag}::${hasFilename ? `file:${playFilename}` : `id:${id}`}`;
  if (playRequestState.inFlight && playRequestState.inFlightKey === playKey) {
    await playRequestState.inFlight;
    return true;
  }

  const releaseLowPriority = pauseCatLowPriority();
  const panKeyAtCall = selectedPanKey.value;
  const idxAtCall = idx;
  const tmdbSubPanKeyAtCall =
    tmdbSmartListAvailable.value && isTMDBSitePanKey(panKeyAtCall) ? String(tmdbSelectedSitePanKey.value || '') : '';
  const epNameAtCall = ep && ep.name ? String(ep.name) : '';

  playRequestState.seq += 1;
  const seqAtCall = playRequestState.seq;
  playRequestState.inFlightKey = playKey;

  const run = (async () => {
    playLoading.value = true;
    playError.value = '';
    playerRuntimeError.value = '';
    playerUrl.value = '';
    playerHeaders.value = {};
    playerMetaReady.value = false;
    playerBuffering.value = false;
    playerPlaybackStarted.value = false;
    playerFirstFrameReady.value = false;
    goProxyInUseBase.value = '';
    lastGoProxyCandidate.value = null;
    if (playerFirstFrameTimer) {
      window.clearTimeout(playerFirstFrameTimer);
      playerFirstFrameTimer = 0;
    }
    try {
		    const apiBase = resolveCatApiBaseForPlay();
		    const tvUser = props.bootstrap?.user?.username || '';

	        const fetchPlay = async () => {
	          const siteApi = String(api || '').trim();
	          const siteId = (() => {
	            const m = /^\/([a-f0-9]{10})\/spider\//.exec(siteApi);
	            return m && m[1] ? String(m[1]) : '';
	          })();

		          const provider = panMockProviderFromFlag(flag);
		          if (provider) {
		            const call = async (path, body) => {
		              const headers = { 'Content-Type': 'application/json' };
		              const u = typeof tvUser === 'string' ? tvUser.trim() : '';
		              if (u) headers['X-TV-User'] = u;
		              const resp = await fetch(path, {
		                method: 'POST',
		                headers,
		                body: JSON.stringify(body || {}),
		                credentials: 'include',
		              });
		              const data = await resp.json().catch(() => ({}));
		              if (!resp.ok || !data || data.ok === false) {
		                const msg = data && data.message ? String(data.message) : `HTTP ${resp.status}`;
		                throw new Error(msg);
		              }
		              return data;
		            };

		            if (provider === '189') {
		              const idRaw = String(id || '').trim();
		              const parts = idRaw.split('*');
		              const shareId = parts.length >= 2 ? String(parts[1] || '').trim() : '';
		              const accessMapA = detail.value && typeof detail.value.panMock189AccessByShareId === 'object' ? detail.value.panMock189AccessByShareId : {};
		              const accessMapB = panMock189AccessByShareIdHint.value && typeof panMock189AccessByShareIdHint.value === 'object' ? panMock189AccessByShareIdHint.value : {};
		              const accessCode =
		                shareId && typeof accessMapA[shareId] === 'string'
		                  ? String(accessMapA[shareId] || '').trim()
		                  : shareId && typeof accessMapB[shareId] === 'string'
		                    ? String(accessMapB[shareId] || '').trim()
		                    : '';
		              const out = await call('/api/pan/189/play', { id: idRaw, accessCode });
		              return { raw: out, payload: { ...out, header: out.headers || out.header || {} }, url: out.url || '', rawHeaders: out.headers || out.header || {} };
		            }
		            if (provider === 'quark') {
		              const out = await call('/api/pan/quark/play', { flag: String(flag || '').trim(), id: String(id || '').trim() });
		              return { raw: out, payload: { ...out, header: out.headers || out.header || {} }, url: out.url || '', rawHeaders: out.headers || out.header || {} };
		            }
		            if (provider === 'uc') {
		              const out = await call('/api/pan/uc/play', { flag: String(flag || '').trim(), id: String(id || '').trim() });
		              return { raw: out, payload: { ...out, header: out.headers || out.header || {} }, url: out.url || '', rawHeaders: out.headers || out.header || {} };
		            }
		            if (provider === '139') {
		              const idRaw = String(id || '').trim();
		              const out = await call('/api/pan/139/play', { flag: String(flag || '').trim(), id: idRaw });
		              return { raw: out, payload: { ...out, header: out.headers || out.header || {} }, url: out.url || '', rawHeaders: out.headers || out.header || {} };
		            }
		            if (provider === 'baidu') {
		              const out = await call('/api/pan/baidu/play', { flag: String(flag || '').trim(), id: String(id || '').trim() });
		              return { raw: out, payload: { ...out, header: out.headers || out.header || {} }, url: out.url || '', rawHeaders: out.headers || out.header || {} };
		            }
		          }

	          const raw = await requestCatPlay({
	            apiBase,
	            username: tvUser,
	            payload: {
	              flag,
	              ...(playFilename ? { filename: playFilename, ...(playShareUrl ? { url: playShareUrl } : {}) } : { id }),
	              siteApi,
	              ...(siteId ? { siteId } : {}),
	            },
	          });
	          const rewritten = rewritePlayPayloadUrls(raw, apiBase, tvUser);
	          const payload = normalizePlayPayload(rewritten);
	          const url = pickFirstPlayableUrl(payload);
	          const rawHeaders = payload && payload.header && typeof payload.header === 'object' ? payload.header : {};
	          return { raw, payload, url, rawHeaders };
	        };

        let playResult = null;
        let finalUrl = '';
        let finalHeaders = {};
        let disableGoProxy = false;

        if (!finalUrl) {
          try {
            playResult = await fetchPlay();
          } catch (e) {
            try {
              const msg = e && e.message ? String(e.message) : String(e || '');
              const ctx = lastTMDBPlayReportCtx.value;
              if (ctx) void reportTMDBPlay({ ctx, stage: 'resolve', result: 'failure', error: msg || 'resolve failed' });
            } catch (_e) {}
            throw e;
          }
          if (!playResult.url) {
            if (seqAtCall === playRequestState.seq) playError.value = '无可用播放地址';
            try {
              const ctx = lastTMDBPlayReportCtx.value;
              if (ctx) void reportTMDBPlay({ ctx, stage: 'resolve', result: 'failure', error: 'empty url' });
            } catch (_e) {}
            return;
          }
          finalUrl = playResult.url;
          finalHeaders = playResult.rawHeaders || {};
          try {
            const ctx = lastTMDBPlayReportCtx.value;
            if (ctx) void reportTMDBPlay({ ctx, stage: 'resolve', result: 'success', error: '' });
          } catch (_e) {}
        }

        const goProxyEnabled = !!effectiveBootstrapSettings.value.goProxyEnabled;

	      // HLS/m3u8: if possible, use CatPawOpen m3u8 proxy mode to avoid CORS/IP-bound issues.
	      // - index.m3u8: CatPawOpen fetches playlist with headers and returns absolute URIs (segments are upstream)
	      // - proxy.m3u8: playlist + segments/key are proxied through CatPawOpen
	      try {
	        const out = await maybeUseCatM3U8ProxyForPlayback({
	          apiBase,
	          tvUser,
	          playUrl: finalUrl,
	          playHeaders: finalHeaders,
	        });
	        if (out && typeof out.url === 'string' && out.url.trim()) {
	          finalUrl = out.url.trim();
	          finalHeaders = out.headers && typeof out.headers === 'object' ? out.headers : {};
	          disableGoProxy = true;
	        }
	      } catch (_e) {
	        // best-effort
	      }

	      try {
	        const preferredPan = guessPreferredPanFromFlag(flag);
          goProxyInUseBase.value = '';
          lastGoProxyCandidate.value = {
            url: finalUrl,
            headers: finalHeaders,
            preferredPan,
            enabled: goProxyEnabled && !disableGoProxy,
          };
	        const out = await maybeUseGoProxyForPlayback(finalUrl, finalHeaders, preferredPan, goProxyEnabled && !disableGoProxy);
	        if (out && typeof out === 'object') {
	          if (typeof out.url === 'string' && out.url.trim()) finalUrl = out.url.trim();
	          if (out.headers && typeof out.headers === 'object') finalHeaders = out.headers;
            goProxyInUseBase.value = out.goProxyBase ? String(out.goProxyBase) : '';
	        }
	      } catch (e) {
        // Keep direct URL as fallback (GoProxy is best-effort on the client).
        console.warn('[GoProxy] register failed:', e && e.message ? e.message : e);
      }
        if (seqAtCall !== playRequestState.seq) return;
		    playerMetaReady.value = false;
        playerBuffering.value = false;
        playerPlaybackStarted.value = false;
        playerFirstFrameReady.value = false;
        if (playerFirstFrameTimer) {
          window.clearTimeout(playerFirstFrameTimer);
          playerFirstFrameTimer = 0;
        }
		    playerUrl.value = finalUrl;
			    playerHeaders.value = finalHeaders;
			    playingPanKey.value = panKeyAtCall;
			    playingEpisodeIndex.value = idxAtCall;
			    playingTMDBSubPanKey.value = tmdbSubPanKeyAtCall;
	        try {
          await nextTick();
          if (seqAtCall === playRequestState.seq && artPlayerRef.value && typeof artPlayerRef.value.tryAutoplay === 'function') {
            await artPlayerRef.value.tryAutoplay();
          }
        } catch (_e) {}

				    try {
				      const siteKey = historySiteKey;
				      const spiderApi = (historySpiderApi || api || '').trim();
				      const videoId = historyVideoId;
			      const meta = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
			      const videoTitle = (meta && meta.title ? String(meta.title) : displayTitle.value) || '';
			      const isNetDisk = isWodePanVideoId(videoId);
			      if (!isNetDisk && siteKey && spiderApi && videoId && videoTitle) {
			        const payloadForHistory = {
			          siteKey,
			          siteName: historySiteName || resolvedSiteName.value || '',
			          spiderApi,
			          videoId,
			          videoTitle,
			          contentKey: computeHistoryContentKey(videoTitle) || '',
			          videoPoster: (meta && meta.pic ? String(meta.pic) : '') || historyCoverPoster.value || pickHistoryPoster() || '',
			          videoRemark: (tmdbMode.value ? tmdbHistoryRemark.value : displayRemark.value) || '',
			          tmdbId: meta && Number.isFinite(Number(meta.tmdbId)) ? Number(meta.tmdbId) : (tmdbMode.value ? Number(props.tmdbId || 0) : 0),
			          tmdbType: meta && typeof meta.mediaType === 'string' ? meta.mediaType : (tmdbMode.value ? String(props.tmdbType || '').trim().toLowerCase() : ''),
			          tmdbSeasons:
			            tmdbMode.value && doubanSeasonOverrideActive.value && doubanSeasonMeta.value
			              ? JSON.stringify(doubanSeasonMeta.value)
			              : '',
			          tmdbSeason: (() => {
			            const eps = selectedEpisodes.value;
			            const map = computeEpisodeMatchByIndexForEpisodes(eps);
			            const hit = idxAtCall >= 0 && idxAtCall < map.length ? map[idxAtCall] : null;
			            return hit && Number.isFinite(Number(hit.season)) ? Number(hit.season) : 0;
			          })(),
			          tmdbEpisode: (() => {
			            const eps = selectedEpisodes.value;
			            const map = computeEpisodeMatchByIndexForEpisodes(eps);
			            const hit = idxAtCall >= 0 && idxAtCall < map.length ? map[idxAtCall] : null;
			            return hit && Number.isFinite(Number(hit.episode)) ? Number(hit.episode) : 0;
			          })(),
			          panLabel: (src && src.label ? String(src.label) : '').trim(),
			          playFlag: flag,
			          episodeIndex: idxAtCall >= 0 ? idxAtCall : 0,
			          episodeName: tmdbMode.value ? '' : epNameAtCall,
			        };
			        // For multi-device resume syncing (Emby-compatible clients), store a stable item id when possible.
			        try {
			          const metaId = payloadForHistory.tmdbId ? Number(payloadForHistory.tmdbId) : 0;
			          const metaType = payloadForHistory.tmdbType ? String(payloadForHistory.tmdbType) : '';
			          const seasonNo = payloadForHistory.tmdbSeason ? Number(payloadForHistory.tmdbSeason) : 0;
			          const episodeNo = payloadForHistory.tmdbEpisode ? Number(payloadForHistory.tmdbEpisode) : 0;
			          payloadForHistory.playbackItemId = buildJellyfinPlaybackItemId({ tmdbType: metaType, tmdbId: metaId, seasonNo, episodeNo }) || '';
			        } catch (_e) {}
			        lastHistoryPayload.value = payloadForHistory;
		        await apiPostJson('/api/playhistory', { ...payloadForHistory }, { dedupe: false });
			        window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
			      }
			    } catch (_e) {
		      // ignore (history not critical)
		    }
	  } catch (e) {
	    const status = e && typeof e.status === 'number' ? e.status : 0;
	    const msg = (e && e.message) || '请求失败';
        if (seqAtCall === playRequestState.seq) playError.value = status ? `HTTP ${status}：${msg}` : msg;
	  } finally {
        if (seqAtCall === playRequestState.seq) playLoading.value = false;
	  }
  })();

  playRequestState.inFlight = run;
  try {
    await run;
  } finally {
    if (playRequestState.inFlight === run) playRequestState.inFlight = null;
    releaseLowPriority();
    if (tmdbSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY) releaseLowPriorityHold();
  }
  return true;
};

const tryAutoStartPlayback = () => {
  if (initialAutoPlayTriggered.value) return;
  if (initialAutoPlayInFlight.value) return;
  if (introLoading.value) return;
  if (!resumeHistoryLoaded.value) return;
  if (!selectedEpisodes.value.length) return;
	  if (!tmdbSmartListAvailable.value && !tmdbMovieMode.value) {
	    void ensureResolvedSpiderApiFallback();
	    if (!resolvedSpiderApiFinal.value) return;
	  }
  if (selectedEpisodeIndex.value < 0) selectedEpisodeIndex.value = 0;
  initialAutoPlayInFlight.value = true;
  void requestPlay()
    .then((started) => {
      if (!started) return;
      initialAutoPlayTriggered.value = true;
    })
    .finally(() => {
      initialAutoPlayInFlight.value = false;
    });
};

const onPlayerLoadedMetadata = () => {
  playerMetaReady.value = true;
};

const playerVideoInfo = ref({ width: 0, height: 0 });
const onPlayerVideoInfo = (info) => {
  try {
    const w = info && Number.isFinite(Number(info.width)) ? Math.floor(Number(info.width)) : 0;
    const h = info && Number.isFinite(Number(info.height)) ? Math.floor(Number(info.height)) : 0;
    if (w <= 0 || h <= 0) return;
    const cur = playerVideoInfo.value || { width: 0, height: 0 };
    if (Number(cur.width) === w && Number(cur.height) === h) return;
    playerVideoInfo.value = { width: w, height: h };
  } catch (_e) {}
};

const playerResolutionQuality = computed(() => {
  const w = playerVideoInfo.value && Number.isFinite(Number(playerVideoInfo.value.width)) ? Number(playerVideoInfo.value.width) : 0;
  const h = playerVideoInfo.value && Number.isFinite(Number(playerVideoInfo.value.height)) ? Number(playerVideoInfo.value.height) : 0;
  if (w <= 0 || h <= 0) return '';
  const maxDim = Math.max(w, h);
  const minDim = Math.min(w, h);
  if (maxDim >= 3800 || minDim >= 2000) return '4K';
  if (maxDim >= 1900 || minDim >= 1000) return '1080P';
  if (maxDim >= 1200 || minDim >= 700) return '720P';
  return '';
});

const onPlayerBuffering = (v) => {
  playerBuffering.value = !!v;
};

const onPlayerPlaying = () => {
  playerPlaybackStarted.value = true;
  playerBuffering.value = false;
};

const playerTimeState = { at: 0, currentTime: 0, duration: 0 };
const historyProgressState = { at: 0, inFlight: null };

const toTicks = (seconds) => {
  const s = Number(seconds);
  if (!Number.isFinite(s) || s <= 0) return 0;
  return Math.floor(s * 10_000_000);
};

const buildJellyfinPlaybackItemId = ({ tmdbType, tmdbId, seasonNo, episodeNo }) => {
  const t = typeof tmdbType === 'string' ? tmdbType.trim().toLowerCase() : '';
  const id = Number(tmdbId);
  if (!Number.isFinite(id) || id <= 0) return '';
  if (t === 'movie') return `tmdb_movie_${Math.floor(id)}`;
  if (t !== 'tv') return '';
  const s = Number(seasonNo);
  const e = Number(episodeNo);
  if (!Number.isFinite(s) || !Number.isFinite(e) || s <= 0 || e <= 0) return '';
  const ss = String(Math.floor(s)).padStart(2, '0');
  const ee = String(Math.floor(e)).padStart(3, '0');
  return `tmdb_tv_${Math.floor(id)}_s${ss}_e${ee}`;
};

const syncHistoryProgressIfPossible = async (opts = {}) => {
  const { force = false } = opts || {};
  const base = lastHistoryPayload.value && typeof lastHistoryPayload.value === 'object' ? lastHistoryPayload.value : null;
  if (!base) return;
  if (!playerPlaybackStarted.value) return;
  if (!playerUrl.value) return;

  const now = Date.now();
  if (!force && now - historyProgressState.at < 12_000) return;
  if (historyProgressState.inFlight) return;

  const posTicks = toTicks(playerTimeState.currentTime);
  const durTicks = toTicks(playerTimeState.duration);
  if (posTicks <= 0) return;

  historyProgressState.at = now;
  historyProgressState.inFlight = (async () => {
    try {
      await apiPostJson(
        '/api/playhistory',
        {
          ...base,
          playbackPositionTicks: posTicks,
          playbackRuntimeTicks: durTicks,
        },
        { dedupe: false }
      );
      window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
    } catch (_e) {
      // ignore
    }
  })();
  try {
    await historyProgressState.inFlight;
  } finally {
    historyProgressState.inFlight = null;
  }
};

const onPlayerTimeUpdate = (info) => {
  try {
    const cur = info && Number.isFinite(Number(info.currentTime)) ? Number(info.currentTime) : 0;
    const dur = info && Number.isFinite(Number(info.duration)) ? Number(info.duration) : 0;
    playerTimeState.currentTime = Math.max(0, cur);
    playerTimeState.duration = Math.max(0, dur);
    playerTimeState.at = Date.now();
    void syncHistoryProgressIfPossible();
  } catch (_e) {}
};

const autoNextInFlight = ref(false);

const resolvePlayingEpisodesForAutoNext = () => {
  const panKey = typeof playingPanKey.value === 'string' ? playingPanKey.value : '';
  const idx = Number.isFinite(Number(playingEpisodeIndex.value)) ? Math.floor(Number(playingEpisodeIndex.value)) : -1;
  if (!panKey || idx < 0) return null;

  if (panKey === SMART_PAN_KEY) {
    const eps = Array.isArray(smartListEpisodes.value) ? smartListEpisodes.value : [];
    return { panKey, episodes: eps, index: idx };
  }

  if (tmdbSmartListAvailable.value && isTMDBSitePanKey(panKey)) {
    const cached = readTMDBSitePanCacheEntry(panKey);
    const pans = cached && Array.isArray(cached.pans) ? cached.pans : [];
    const subKey = typeof playingTMDBSubPanKey.value === 'string' ? playingTMDBSubPanKey.value : '';
    const picked = (subKey && pans.find((p) => p && p.key === subKey)) || pans[0] || null;
    const eps = picked && Array.isArray(picked.episodes) ? picked.episodes : [];
    return { panKey, episodes: eps, index: idx };
  }

  const src = (sitePanOptions.value || []).find((o) => o && o.key === panKey) || null;
  const eps = src && Array.isArray(src.episodes) ? src.episodes : [];
  return { panKey, episodes: eps, index: idx };
};

const computeEpisodeMatchByIndexForEpisodes = (episodes) => {
  const eps = Array.isArray(episodes) ? episodes : [];
  if (!eps.length) return [];
  const rules = compiledMagicEpisodeRules.value;
  if (!rules.length) return eps.map((_ep, idx) => ({ season: 0, episode: idx + 1 }));
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  return eps.map((ep, idx) => {
    const tmdbSeason = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
    const tmdbEp = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
    if (tmdbSeason > 0 && tmdbEp > 0) return { season: tmdbSeason, episode: tmdbEp };
    const candidates = [];
    if (ep && ep.name != null) candidates.push(String(ep.name));
    if (ep && ep.url != null) {
      const rawNames = extractRawNamesFromEpisodeUrl(String(ep.url));
      if (rawNames[0]) candidates.push(rawNames[0]);
    }
    return normalizeMaybeGlobalSeasonEpisode(extractSeasonEpisodeFromCandidates(candidates, rules, cleanRules));
  });
};

const pickNextEpisodeIndexFromPlayingList = ({ delta = 1 } = {}) => {
  const stepRaw = Number(delta);
  const step = Number.isFinite(stepRaw) ? Math.sign(stepRaw) : 0;
  if (!step) return null;

  const ctx = resolvePlayingEpisodesForAutoNext();
  if (!ctx) return null;
  const { episodes, index: curIdx } = ctx;
  const total = Array.isArray(episodes) ? episodes.length : 0;
  if (!total || curIdx < 0 || curIdx >= total) return null;

  if (!hasMagicEpisodeRules.value || forceRawListMode.value) {
    const nextIdx = curIdx + step;
    if (nextIdx < 0 || nextIdx >= total) return null;
    return nextIdx;
  }

  const matches = computeEpisodeMatchByIndexForEpisodes(episodes);
  const cur = matches && matches[curIdx] && typeof matches[curIdx] === 'object' ? matches[curIdx] : { season: 0, episode: 0 };
  const curSeason = Number.isFinite(Number(cur.season)) ? Math.floor(Number(cur.season)) : 0;
  const curNo = Number.isFinite(Number(cur.episode)) ? Math.floor(Number(cur.episode)) : 0;
  if (!curNo) {
    const nextIdx = curIdx + step;
    if (nextIdx < 0 || nextIdx >= total) return null;
    return nextIdx;
  }

  const desiredNo = curNo + step;
  if (desiredNo <= 0) return null;

  const findBy = (season, episode) => {
    for (let i = 0; i < matches.length; i += 1) {
      const m = matches[i];
      const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
      if (s === season && e === episode) return i;
    }
    return -1;
  };

  const primary = findBy(curSeason, desiredNo);
  if (primary >= 0) return primary;

  if (step > 0 && curSeason > 0) {
    const crossSeason = findBy(curSeason + 1, 1);
    if (crossSeason >= 0) return crossSeason;
  }

  const nextIdx = curIdx + step;
  if (nextIdx < 0 || nextIdx >= total) return null;
  return nextIdx;
};

const playEpisodeFromPlayingList = async ({ delta = 1, reason = '' } = {}) => {
  if (autoNextInFlight.value) return false;
  if (playLoading.value) return false;
  if (playRequestState.inFlight) return false;

  const ctx = resolvePlayingEpisodesForAutoNext();
  if (!ctx) return false;
  const nextIdx = pickNextEpisodeIndexFromPlayingList({ delta });
  if (nextIdx == null) return false;

  autoNextInFlight.value = true;
  try {
    try {
      await syncHistoryProgressIfPossible({ force: true });
    } catch (_e) {}
    const panKey = ctx.panKey;
    if (selectedPanKey.value !== panKey) selectPan(panKey);

    if (tmdbSmartListAvailable.value && isTMDBSitePanKey(panKey)) {
      const subKey = typeof playingTMDBSubPanKey.value === 'string' ? playingTMDBSubPanKey.value : '';
      if (subKey) tmdbSelectedSitePanKey.value = subKey;
    }

    await nextTick();
    const eps = selectedEpisodes.value;
    if (!Array.isArray(eps) || !eps.length || nextIdx < 0 || nextIdx >= eps.length) return false;
    selectedEpisodeIndex.value = nextIdx;
    await requestPlay();
    return true;
  } catch (e) {
    console.warn('[autonext] failed:', reason, e && e.message ? e.message : e);
    return false;
  } finally {
    setTimeout(() => {
      autoNextInFlight.value = false;
    }, 800);
  }
};

const onPlayerEnded = () => {
  void playEpisodeFromPlayingList({ delta: 1, reason: 'ended' });
};

const onPlayerFirstFrame = () => {
  if (playerFirstFrameReady.value) return;
  if (playerFirstFrameTimer) return;
  // Delay unmasking slightly to avoid 1-frame compositor flashes on some browsers/devices.
  playerFirstFrameTimer = window.setTimeout(() => {
    playerFirstFrameTimer = 0;
    playerFirstFrameReady.value = true;
    try {
      const ctx = lastTMDBPlayReportCtx.value;
      if (ctx && !ctx.playbackReported) {
        ctx.playbackReported = true;
        void reportTMDBPlay({ ctx, stage: 'playback', result: 'success', error: '' });
      }
    } catch (_e) {}
  }, 120);
};

const onPlayerError = (e) => {
  try {
    const msg = e && e.message ? String(e.message) : '';
    playerRuntimeError.value = msg || '播放失败';
  } catch (_e) {
    playerRuntimeError.value = '播放失败';
  }
  try {
    const ctx = lastTMDBPlayReportCtx.value;
    if (ctx && !ctx.playbackReported) {
      ctx.playbackReported = true;
      const err = playerRuntimeError.value || '播放失败';
      void reportTMDBPlay({ ctx, stage: 'playback', result: 'failure', error: err });
    }
  } catch (_e) {}
};

const playerPhase = computed(() => {
  if (playError.value) return 'error';
  if (playerRuntimeError.value) return 'error';
  if (introLoading.value) return 'detail';
  if (introError.value && !playerUrl.value && !isSmartPanActive.value) return 'error';
	  if (!playerUrl.value) {
	    if (playLoading.value) return 'play_url';
	    if (isSmartPanActive.value && (!sourcesSearchDone.value || sourcesLoading.value)) return 'detail';
	    return 'idle';
	  }
  if (!playerMetaReady.value) return 'play_info';
  if (playerBuffering.value) return 'buffering';
  if (!playerPlaybackStarted.value || !playerFirstFrameReady.value) return 'buffering';
  return 'ready';
});

const playerPhaseLoading = computed(() => {
  return (
    playerPhase.value === 'detail' ||
    playerPhase.value === 'play_url' ||
    playerPhase.value === 'play_info'
  );
});

const playerPhaseText = computed(() => {
  switch (playerPhase.value) {
    case 'detail':
      return '正在获取视频...';
    case 'play_url':
      return '正在获取播放地址...';
    case 'play_info':
      return '正在获取视频信息...';
    case 'buffering':
      return '';
    case 'error':
      return playerRuntimeError.value || playError.value || introError.value || '请求失败';
    case 'idle':
      return '加载中...';
    default:
      return '加载中...';
  }
});

const playerStageItems = [
  { key: 'detail', label: '信息' },
  { key: 'play_url', label: '地址' },
  { key: 'play_info', label: '信息' },
];

// 0..3 (3 means all done)
const playerStageIndex = computed(() => {
  switch (playerPhase.value) {
    case 'detail':
      return 0;
    case 'play_url':
      return 1;
    case 'play_info':
      return 2;
    case 'buffering':
      return 3;
    case 'ready':
      return 3;
    case 'error': {
      if (playerUrl.value && playerPlaybackStarted.value) return 3;
      if (playerUrl.value && playerMetaReady.value) return 3;
      if (playerUrl.value && !playerMetaReady.value) return 2;
      if (!playerUrl.value && playLoading.value) return 1;
      if (introLoading.value) return 0;
      return 0;
    }
    case 'idle':
    default:
      return 0;
  }
});

const playerStageDoneCount = computed(() => Math.max(0, Math.min(playerStageIndex.value, playerStageItems.length)));
const playerStageActiveIndex = computed(() => Math.max(0, Math.min(playerStageIndex.value, playerStageItems.length - 1)));

const playerStageProgress = computed(() => {
  const total = playerStageItems.length || 3;
  if (playerPhase.value === 'idle') return 0;
  if (playerStageIndex.value >= total) return 1;
  if (playerPhase.value === 'error') return playerStageDoneCount.value / total;
  return (playerStageDoneCount.value + 0.5) / total;
});


const loadResumeFromHistory = async () => {
  resumeHistoryLoaded.value = false;
  resumeHistoryApplied.value = false;
  panPrefApplied.value = false;
  resumeHistory.value = null;
  const siteKey = (props.siteKey || '').trim();
  const videoId = (props.videoId || '').trim();
  const tmdbId = Number(props.tmdbId || 0);
  const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';

	  if (!siteKey || !videoId) {
	    if (!(tmdbMode.value && tmdbId > 0 && (tmdbType === 'tv' || tmdbType === 'movie'))) {
	      resumeHistoryLoaded.value = true;
      return;
    }
    const key = `tmdb::${tmdbType}::${tmdbId}`;
    if (resumeHistoryState.inFlight && resumeHistoryState.key === key) {
      await resumeHistoryState.inFlight;
      return;
    }
    resumeHistoryState.seq += 1;
    const seqAtCall = resumeHistoryState.seq;
    resumeHistoryState.key = key;
    try {
      resumeHistoryState.inFlight = (async () => {
        try {
          const list = await apiGetJson(`/api/playhistory${buildQuery({ limit: 50 })}`, { cacheMs: 2000 });
          if (seqAtCall !== resumeHistoryState.seq) return;
          const items = Array.isArray(list) ? list : [];
          const wantedKey = normalizeForAggKey(props.contentKey || '') || normalizeForAggKey(computeHistoryContentKey(props.videoTitle || ''));
          const match = items.find((r) => r && Number(r.tmdbId || 0) === tmdbId && String(r.tmdbType || '').trim().toLowerCase() === tmdbType) ||
            (wantedKey ? items.find((r) => r && normalizeForAggKey(r.contentKey || '') === wantedKey) : null) ||
            null;
          resumeHistory.value = match;
          try {
            const seasons = match && typeof match.tmdbSeasons === 'string' ? match.tmdbSeasons.trim() : '';
            if (tmdbType === 'tv' && tmdbId > 0 && seasons) {
              sessionStorage.setItem(`tv:douban:tmdbSeasons:${tmdbId}`, seasons);
              refreshDoubanSeasonMeta();
            }
          } catch (_e) {}
        } catch (_e) {
          if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
        }
      })();
      await resumeHistoryState.inFlight;
    } catch (_e) {
      if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
    } finally {
      if (seqAtCall === resumeHistoryState.seq) resumeHistoryLoaded.value = true;
      if (resumeHistoryState.key === key && resumeHistoryState.seq === seqAtCall) resumeHistoryState.inFlight = null;
    }
    tryAutoStartPlayback();
    return;
  }

  const key = `${siteKey}::${videoId}`;
  if (resumeHistoryState.inFlight && resumeHistoryState.key === key) {
    await resumeHistoryState.inFlight;
    return;
  }
  resumeHistoryState.seq += 1;
  const seqAtCall = resumeHistoryState.seq;
  resumeHistoryState.key = key;
  try {
    resumeHistoryState.inFlight = (async () => {
      try {
        try {
          const item = await apiGetJson(`/api/playhistory/one${buildQuery({ siteKey, videoId })}`, { cacheMs: 2000 });
          if (seqAtCall !== resumeHistoryState.seq) return;
          if (item && item.siteKey === siteKey && item.videoId === videoId) {
            resumeHistory.value = item;
            try {
              if (tmdbMode.value) {
                const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
                const tmdbId = Number(props.tmdbId || 0);
                const seasons = item && typeof item.tmdbSeasons === 'string' ? item.tmdbSeasons.trim() : '';
                if (typRaw === 'tv' && tmdbId > 0 && seasons) {
                  sessionStorage.setItem(`tv:douban:tmdbSeasons:${tmdbId}`, seasons);
                  refreshDoubanSeasonMeta();
                }
              }
            } catch (_e) {}
            return;
          }
          if (item == null) {
            resumeHistory.value = null;
            return;
          }
        } catch (_e) {
          // fallback
        }
        const list = await apiGetJson(`/api/playhistory${buildQuery({ limit: 50 })}`, { cacheMs: 2000 });
        if (seqAtCall !== resumeHistoryState.seq) return;
        const items = Array.isArray(list) ? list : [];
        const foundExact = items.find((r) => r && r.siteKey === siteKey && r.videoId === videoId) || null;
        if (foundExact) {
          resumeHistory.value = foundExact;
        } else {
          const tmdbId = Number(props.tmdbId || 0);
          const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
          const wantedKey =
            normalizeForAggKey(props.contentKey || '') ||
            normalizeForAggKey(computeHistoryContentKey(props.videoTitle || ''));
          const foundByTmdb =
            tmdbId > 0 && (tmdbType === 'tv' || tmdbType === 'movie')
              ? items.find(
                  (r) =>
                    r &&
                    Number(r.tmdbId || 0) === tmdbId &&
                    String(r.tmdbType || '').trim().toLowerCase() === tmdbType
                ) || null
              : null;
          const foundByKey =
            !foundByTmdb && wantedKey
              ? items.find((r) => r && normalizeForAggKey(r.contentKey || '') === wantedKey) || null
              : null;
          resumeHistory.value = foundByTmdb || foundByKey || null;
        }
        try {
          const found = resumeHistory.value;
          if (tmdbMode.value && found) {
            const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
            const tmdbId = Number(props.tmdbId || 0);
            const seasons = found && typeof found.tmdbSeasons === 'string' ? found.tmdbSeasons.trim() : '';
            if (typRaw === 'tv' && tmdbId > 0 && seasons) {
              sessionStorage.setItem(`tv:douban:tmdbSeasons:${tmdbId}`, seasons);
              refreshDoubanSeasonMeta();
            }
          }
        } catch (_e) {}
      } catch (_e) {
        if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
      }
    })();
    await resumeHistoryState.inFlight;
  } catch (_e) {
    if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
  } finally {
    if (seqAtCall === resumeHistoryState.seq) resumeHistoryLoaded.value = true;
    if (resumeHistoryState.key === key && resumeHistoryState.seq === seqAtCall) resumeHistoryState.inFlight = null;
  }
  tryAutoStartPlayback();
};

watch(
  () => aggregatedSources.value.length,
  async (len) => {
    if (!len) return;
    if (aggregatedFromStorage.value) {
      // If we came from search, sessionStorage already has exact matches. Lock immediately.
      await tryLockHistoryPoster({ force: true, allowFallback: true });
      return;
    }
    // If we are doing a swap-source search, lock only when preferred is found,
    // or after the search completes (handled by the watcher below).
    await tryLockHistoryPoster({ force: false, allowFallback: false });
  }
);

watch(
  () => sourcesSearchedOnce.value,
  async (done) => {
    if (!done) return;
    if (historyCoverLocked.value) return;
    if (!aggregatedSources.value || !aggregatedSources.value.length) return;
    await tryLockHistoryPoster({ force: true, allowFallback: true });
  }
);

watch(
  () =>
    [
      introLoading.value,
      resumeHistoryLoaded.value ? '1' : '0',
      panPrefStorageKey.value,
      selectedPanKey.value,
      resolvedSpiderApiFinal.value,
      selectedEpisodes.value.length,
      selectedEpisodeIndex.value,
    ].join('|'),
  () => {
    if (initialAutoPlayTriggered.value) return;
    if (introLoading.value) return;
    if (!resumeHistoryLoaded.value) return;
    if (!selectedEpisodes.value.length) return;

    // Folder-like sources (e.g. 网盘目录) often return an episode list for the whole directory.
    // Ensure the clicked file (props.videoId) becomes the initially selected episode.
    if (!autoPickedEpisodeFromVideoId.value && !resumeHistory.value) {
      autoPickedEpisodeFromVideoId.value = true;
      const picked = pickEpisodeByUrlAcrossPans(props.videoId || '');
      if (picked && picked.panKey) {
        selectedPan.value = picked.panKey;
        selectedEpisodeIndex.value = picked.index;
        return;
      }
    }

    // Apply remembered pan preference (same video dimension) when there's no play history for this site/videoId.
    if (!panPrefApplied.value && !resumeHistory.value) {
      const prevPan = selectedPan.value;
      const canReadPref = !!panPrefStorageKey.value;
      const pref = canReadPref ? readPanPref() : '';
      if (pref === SMART_PAN_KEY && smartListAvailable.value) {
        selectedPan.value = SMART_PAN_KEY;
        panDropdownOpen.value = false;
        selectedEpisodeGroup.value = '';
        selectedEpisodeIndex.value = -1;
        panPrefApplied.value = true;
        if (prevPan !== selectedPan.value) return;
      } else if (pref) {
        const foundKey = findPanKeyByPrefLabel(pref);
        if (foundKey) {
          selectedPan.value = foundKey;
          panDropdownOpen.value = false;
          selectedEpisodeGroup.value = '';
          selectedEpisodeIndex.value = -1;
          panPrefApplied.value = true;
          if (prevPan !== selectedPan.value) return;
        }
      } else if (smartListAvailable.value) {
        selectedPan.value = SMART_PAN_KEY;
        panDropdownOpen.value = false;
        selectedEpisodeGroup.value = '';
        selectedEpisodeIndex.value = -1;
        panPrefApplied.value = true;
        if (prevPan !== selectedPan.value) return;
      } else if (canReadPref) {
        // No preference, no smart pan: mark applied once we have a stable content key.
        panPrefApplied.value = true;
      }
    }

	    // Restore from history once (pan + episode), if available and already loaded.
	    if (!resumeHistoryApplied.value && resumeHistoryLoaded.value && resumeHistory.value) {
	      const prevPan = selectedPan.value;
	      const prevIdx = selectedEpisodeIndex.value;
	      const wantedPanLabel = typeof resumeHistory.value.panLabel === 'string' ? resumeHistory.value.panLabel.trim() : '';
	      const wantedIdxRaw = resumeHistory.value.episodeIndex != null ? Number(resumeHistory.value.episodeIndex) : 0;
	      const wantedIdx = Number.isFinite(wantedIdxRaw) && wantedIdxRaw >= 0 ? Math.floor(wantedIdxRaw) : 0;
	      const wantedEpName = typeof resumeHistory.value.episodeName === 'string' ? resumeHistory.value.episodeName.trim() : '';
	      const normalize = (label) => String(label || '').trim().replace(/#\d{1,3}\s*$/i, '').trim().toLowerCase();

	      let target = null;
	      if (wantedPanLabel) {
	        const want = normalize(wantedPanLabel);
          if (want === normalize(SMART_PAN_LABEL) && smartListAvailable.value) {
            selectedPan.value = SMART_PAN_KEY;
          } else {
            target = panDropdownOptions.value.find((o) => o && normalize(o.label) === want) || null;
            if (target && target.key) selectedPan.value = target.key;
          }
	      }

	      const rules = compiledMagicEpisodeRules.value;
	      const cleanRules = compiledMagicEpisodeCleanRegexRules.value;
	      const exactIdx = wantedEpName ? pickExactResumeEpisodeIndexFromName(wantedEpName, cleanRules) : null;
	      if (exactIdx != null) {
        selectedEpisodeIndex.value = exactIdx;
      } else {
		      let wanted = { season: 0, episode: 0 };
		      if (wantedEpName) {
		        wanted = extractSeasonEpisodeFromCandidates([wantedEpName], rules, cleanRules);
	          if (!wanted.episode) wanted = parseLooseSeasonEpisodeFromText(wantedEpName);
		      }
		      wanted = normalizeMaybeGlobalSeasonEpisode(wanted);
		      if (!wanted.episode) wanted = { season: 0, episode: wantedIdx + 1 };

        selectedEpisodeIndex.value = pickResumeEpisodeIndex({
          wantedSeason: wanted.season,
          wantedEpisode: wanted.episode,
          wantedIndex: wantedIdx,
        });
	      }

	      resumeHistoryApplied.value = true;
	      if (prevPan !== selectedPan.value || prevIdx !== selectedEpisodeIndex.value) return;
	    }

    tryAutoStartPlayback();
  }
);

watch(
  () =>
    [
      hasMagicEpisodeRules.value ? '1' : '0',
      introLoading.value ? '1' : '0',
      introError.value ? '1' : '0',
      selectedPanKey.value,
      selectedEpisodes.value.length,
      allDisplayedEpisodes.value.length,
    ].join('|'),
  () => {
    if (forceRawListMode.value) return;
    if (introLoading.value) return;
    if (introError.value) return;
    if (!hasMagicEpisodeRules.value) {
      if (autoRawListMode.value) {
        autoRawListMode.value = false;
        rawListMode.value = false;
      }
      return;
    }
    if (selectedEpisodes.value.length && allDisplayedEpisodes.value.length === 0) {
      rawListMode.value = true;
      autoRawListMode.value = true;
      selectedEpisodeIndex.value = -1;
      return;
    }
    if (autoRawListMode.value && allDisplayedEpisodes.value.length) {
      rawListMode.value = false;
      autoRawListMode.value = false;
    }
  },
  { immediate: true }
);

watch(
  () =>
    [
      props.siteKey,
      props.spiderApi,
      props.videoId,
      props.contentKey,
      typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '',
      String(props.tmdbId || 0),
    ].join('|'),
  () => {
    void loadFavoriteStatus();
  },
  { immediate: true }
);

watch(
  () => [selectedPanKey.value, selectedEpisodes.value.length, selectedEpisodeIndex.value].join('|'),
  () => {
    const total = selectedEpisodes.value.length;
    if (!total) {
      selectedEpisodeGroup.value = '';
      return;
    }
    const idx = selectedEpisodeIndex.value;
    const matches = episodeMatchByIndex.value;
    const hasMagic = hasMagicEpisodeRules.value;
    const m =
      Number.isFinite(idx) && idx >= 0 && matches && matches[idx] && typeof matches[idx] === 'object'
        ? matches[idx]
        : { season: 0, episode: 0 };
    const matchedNo = Number.isFinite(Number(m.episode)) ? Number(m.episode) : 0;
    const no = hasMagic && matchedNo > 0 ? matchedNo : (Number.isFinite(idx) && idx >= 0 ? idx : 0) + 1;
    const groups = episodeGroups.value;
    const found = groups.find((g) => no >= g.startNo && no <= g.endNo);
    const next = (found && found.key) || groups[0]?.key || '';
    if (next && next !== selectedEpisodeGroup.value) selectedEpisodeGroup.value = next;
    scheduleUpdateHiddenEpisodeGroups();
  }
);

const siteEpisodes = computed(() => {
  const list = sitePanOptions.value;
  if (!list.length) return 0;
  let max = 0;
  list.forEach((s) => {
    const n = s && Array.isArray(s.episodes) ? s.episodes.length : 0;
    if (n > max) max = n;
  });
  return max;
});

const siteQuality = computed(() => {
  const fromStr = detail.value.playFrom != null ? String(detail.value.playFrom) : '';
  const urlStr = detail.value.playUrl != null ? String(detail.value.playUrl) : '';
  const hay = `${fromStr} ${urlStr}`.toUpperCase();
  if (/(2160P|2160|4K)/.test(hay)) return '4K';
  if (/(1080P|1080)/.test(hay)) return '1080P';
  if (/(720P|720)/.test(hay)) return '720P';
  return '';
});

const rawListItems = computed(() => {
  if (!rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  if (!eps.length) return [];
  return eps.map((ep, idx) => {
    const useDisplayName =
      tmdbMovieMode.value && tmdbMovieSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY;
    const url = ep && ep.url != null ? String(ep.url) : '';
    const rawNames = extractRawNamesFromEpisodeUrl(url);
    const text = (
      (useDisplayName ? (ep && ep.name != null ? String(ep.name) : '') : '') ||
      rawNames[0] ||
      (ep && ep.name != null ? String(ep.name) : '') ||
      ''
    ).trim() || `第${idx + 1}集`;
    return { key: `${idx}-${url}`, index: idx, text };
  });
});

const rawListPageOptions = computed(() => {
  if (!rawListMode.value) return [];
  if (!thirdPartyIsMobile.value) return [];
  const total = rawListItems.value.length;
  if (total <= RAW_LIST_PAGE_SIZE) return [];
  const pages = Math.ceil(total / RAW_LIST_PAGE_SIZE);
  const out = [];
  for (let p = 0; p < pages; p += 1) {
    const start = p * RAW_LIST_PAGE_SIZE + 1;
    const end = Math.min(total, (p + 1) * RAW_LIST_PAGE_SIZE);
    out.push({ page: p, label: `${start}-${end}` });
  }
  return out;
});

const rawListPagedItems = computed(() => {
  const items = rawListItems.value;
  const total = items.length;
  if (!rawListMode.value) return [];
  if (!thirdPartyIsMobile.value) return items;
  if (total <= RAW_LIST_PAGE_SIZE) return items;
  const p = Number.isFinite(Number(rawListPage.value)) ? Math.max(0, Math.floor(Number(rawListPage.value))) : 0;
  const pages = Math.max(1, Math.ceil(total / RAW_LIST_PAGE_SIZE));
  const page = Math.min(p, pages - 1);
  const startIdx = page * RAW_LIST_PAGE_SIZE;
  return items.slice(startIdx, startIdx + RAW_LIST_PAGE_SIZE);
});

watch(
  () => `${rawListMode.value ? '1' : '0'}|${thirdPartyIsMobile.value ? '1' : '0'}|${rawListItems.value.length}`,
  () => {
    rawListPage.value = 0;
  }
);

watch(
  () => `${rawListMode.value ? '1' : '0'}|${thirdPartyIsMobile.value ? '1' : '0'}|${selectedEpisodeIndex.value}`,
  () => {
    if (!rawListMode.value) return;
    if (!thirdPartyIsMobile.value) return;
    const idx = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
    if (idx < 0) return;
    const nextPage = Math.floor(idx / RAW_LIST_PAGE_SIZE);
    if (nextPage !== rawListPage.value) rawListPage.value = nextPage;
  }
);

const selectEpisode = (idx) => {
  const n = Number(idx);
  if (!Number.isFinite(n) || n < 0) return;
  // If the user clicks the currently playing episode within the same pan, do nothing.
  // But if they switch pan (even same episode number), we must request a new play url.
  if (
    playingPanKey.value &&
    playingPanKey.value === selectedPanKey.value &&
    playingEpisodeIndex.value === n &&
    playerUrl.value
  ) {
    selectedEpisodeIndex.value = n;
    return;
  }
  selectedEpisodeIndex.value = n;
  requestPlay();
};

const onRawListSelectEpisode = (idx) => {
  selectEpisode(idx);
  if (!thirdPartyIsMobile.value) return;
  if (!rawListMode.value) return;
  try {
    const el = rawListViewEl.value;
    if (!el) return;
    const scrollTop = () => {
      try {
        if (typeof el.scrollTo === 'function') el.scrollTo({ top: 0, behavior: 'smooth' });
        else el.scrollTop = 0;
      } catch (_e) {
        try {
          el.scrollTop = 0;
        } catch (_e2) {}
      }
    };
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => window.requestAnimationFrame(scrollTop));
    } else {
      setTimeout(scrollTop, 0);
    }
  } catch (_e) {}
};

const extractIntroFromDetail = (data) => {
  const pick = (vod) => {
    if (!vod) return '';
    return (
      (vod.vod_content != null ? String(vod.vod_content) : '') ||
      (vod.content != null ? String(vod.content) : '') ||
      (vod.desc != null ? String(vod.desc) : '') ||
      ''
    ).trim();
  };

  if (!data) return '';
  if (Array.isArray(data.list) && data.list[0]) return pick(data.list[0]);
  if (data.data && Array.isArray(data.data.list) && data.data.list[0]) return pick(data.data.list[0]);
  if (data.vod) return pick(data.vod);
  return '';
};

const extractDetailFromResponse = (data) => {
  const first =
    (data && Array.isArray(data.list) && data.list[0]) ||
    (data && data.data && Array.isArray(data.data.list) && data.data.list[0]) ||
    (data && data.vod) ||
    null;

  const vod = first || {};
  const get = (k) => (vod && vod[k] != null ? String(vod[k]) : '').trim();
  const title = get('vod_name') || get('name') || get('title');
  const poster = get('vod_pic') || get('pic') || get('poster');
  const year = get('vod_year') || get('year');
  const type = get('vod_class') || get('vod_type') || get('type_name') || get('type');
  const remark = get('vod_remarks') || get('remark');
  const content =
    get('vod_content') || get('content') || get('desc');
  const playFrom = get('vod_play_from') || get('play_from') || get('vod_playfrom') || get('vod_play_froms');
  const playUrl = get('vod_play_url') || get('play_url') || get('vod_playurl') || get('vod_play_urls');

  return { title, poster, year, type, remark, content, playFrom, playUrl };
};

const detailFetchState = { key: '', seq: 0, inFlight: null };

const contentKeyFromProps = () => {
  const t = getStableContentKey();
  const y = String(props.videoYear || '').trim();
  const ty = String(props.searchType || '').trim();
  return [t, y, ty].join('|');
};

let lastContentKey = contentKeyFromProps();
const entryFlowState = { seq: 0, inFlight: null };

const runEntryFlow = async ({ isNewContent, restoreEpisodeIndex } = {}) => {
  entryFlowState.seq += 1;
  const seqAtCall = entryFlowState.seq;

  const prevIdx = Number.isFinite(Number(restoreEpisodeIndex)) ? Math.floor(Number(restoreEpisodeIndex)) : 0;

  const task = (async () => {
    const contentChanged = !!isNewContent;

    initialAutoPlayTriggered.value = false;
    resumeHistoryState.seq += 1;
    detailFetchState.seq += 1;

    if (contentChanged) {
      invalidateSourcesSearch();
      sourcesSearchedOnce.value = false;
      sourcesError.value = '';
      resetTMDBSmartCaches();
      tmdbMovieSmartEpisodes.value = [];
      tmdbMovieSmartFetchState.seq += 1;
      tmdbMovieSmartFetchState.key = '';
    }

    if (contentChanged) {
      resetForNewVideo();
    } else {
      resetForNewSource();
      selectedEpisodeIndex.value = prevIdx >= 0 ? prevIdx : 0;
    }

    loadAggregatedSourcesFromStorage();

	    if (tmdbMode.value) {
	      await loadResumeFromHistory();
	      await fetchTMDBMetaIfNeeded();
	      if (tmdbMovieMode.value) {
	        await fetchTMDBMovieSmartEpisodesIfNeeded();
	        if (contentChanged) selectedEpisodeIndex.value = 0;
	      }
      tryAutoStartPlayback();
      return;
    }

	    if (contentChanged) {
	      await fetchDetailForCurrentVideo({ updateIntro: true, updateMeta: true });
	    } else {
      await fetchDetailForCurrentVideo({ updateIntro: false, updateMeta: false });
    }

    if (seqAtCall !== entryFlowState.seq) return;
    void loadResumeFromHistory();
  })();

  entryFlowState.inFlight = task;
  try {
    await task;
  } finally {
    if (entryFlowState.inFlight === task) entryFlowState.inFlight = null;
  }
};

const fetchDetailForCurrentVideo = async (opts = {}) => {
  const { updateIntro = false, updateMeta = false } = opts && typeof opts === 'object' ? opts : {};
  const id = (props.videoId || '').trim();
  if (!id) return;
  const api = (resolvedSpiderApiFinal.value || '').trim();
  if (!api) return;
  if (tmdbMode.value && (updateIntro || updateMeta)) return;

  consumeClickPauseIfAny({ takeover: tmdbMode.value });

  const apiBase = resolveCatApiBaseForPlay();
  const tvUser = props.bootstrap?.user?.username || '';
  const key = `${apiBase}::${tvUser}::${api}::${id}`;
  if (detailFetchState.inFlight && detailFetchState.key === key) {
    await detailFetchState.inFlight;
    return;
  }

  const releaseLowPriority = pauseCatLowPriority();
  detailFetchState.seq += 1;
  const seqAtCall = detailFetchState.seq;
  detailFetchState.key = key;
  const shouldShowDetailLoading = !!(updateIntro || updateMeta || !detail.value.playFrom);
  if (shouldShowDetailLoading) {
    introLoading.value = true;
    introError.value = '';
  }

		  detailFetchState.inFlight = (async () => {
		    try {
		      const raw = await requestCatSpider({
		        apiBase,
		        username: tvUser,
		        action: 'detail',
		        spiderApi: api,
		        payload: { id },
		      });
		      if (seqAtCall !== detailFetchState.seq) return;
			      const d = extractDetailFromResponse(raw);
			      const panMockEnabled = !!(raw && typeof raw === 'object' && raw.pan_mock);
				      const next = (() => {
			        const prev = detail.value && typeof detail.value === 'object' ? detail.value : {};
			        const shouldUpdateMeta = !!updateMeta;
			        const shouldFillMeta = !prev.title || !prev.poster || !prev.year;
		        const base = {
		          ...prev,
		          playFrom: d.playFrom,
		          playUrl: d.playUrl,
		          ...(panMockEnabled ? { panMockEnabled: true } : {}),
		        };
		        if (shouldUpdateMeta || shouldFillMeta) {
		          if (d.title) base.title = d.title;
		          if (d.poster) base.poster = d.poster;
		          if (d.year) base.year = d.year;
		          if (d.type) base.type = d.type;
		          if (d.remark) base.remark = d.remark;
		          if (d.content) base.content = d.content;
		        }
			        return base;
				      })();

	      detail.value = next;
	      if (updateIntro || !introText.value) {
	        const nextIntro = (d.content || extractIntroFromDetail(raw) || introText.value || '').trim();
	        if (nextIntro) introText.value = nextIntro;
	      }

	      if (panMockEnabled && d.playFrom && d.playUrl) {
	        const seqForResolve = seqAtCall;
	        void resolvePanMockPlaySources({
	          raw,
	          playFrom: d.playFrom,
	          playUrl: d.playUrl,
	          onUpdate: (resolved) => {
	            if (!resolved || typeof resolved !== 'object') return;
	            if (seqForResolve !== detailFetchState.seq) return;
	            const cur = detail.value && typeof detail.value === 'object' ? detail.value : {};
	            const merged = { ...cur };
	            if (typeof resolved.playFrom === 'string' && resolved.playFrom.trim()) merged.playFrom = resolved.playFrom;
	            if (typeof resolved.playUrl === 'string' && resolved.playUrl.trim()) merged.playUrl = resolved.playUrl;
	            if (resolved.panMock189AccessByShareId && typeof resolved.panMock189AccessByShareId === 'object') {
	              const prevMap = cur && typeof cur.panMock189AccessByShareId === 'object' ? cur.panMock189AccessByShareId : {};
	              merged.panMock189AccessByShareId = { ...prevMap, ...resolved.panMock189AccessByShareId };
	            }
	            detail.value = merged;
	          },
	        });
	      }
			    } catch (e) {
			      const status = e && typeof e.status === 'number' ? e.status : 0;
			      const msg = (e && e.message) || '请求失败';
			      if (shouldShowDetailLoading && seqAtCall === detailFetchState.seq) {
		        introError.value = status ? `HTTP ${status}：${msg}` : msg;
		      }
		    } finally {
      if (shouldShowDetailLoading && seqAtCall === detailFetchState.seq) introLoading.value = false;
      if (detailFetchState.key === key && detailFetchState.seq === seqAtCall) detailFetchState.inFlight = null;
      releaseLowPriority();
    }
  })();
  await detailFetchState.inFlight;
  tryAutoStartPlayback();
};

const searchTypeLabel = computed(() => {
  switch ((props.searchType || '').trim()) {
    case 'movie':
      return '电影';
    case 'tv':
      return '电视剧';
    case 'anime':
      return '动漫';
    case 'show':
      return '综艺';
    default:
      return '';
  }
});

const onPanDocDown = (e) => {
  const el = panDropdownEl.value;
  const el2 = tmdbPanDropdownEl.value;
  if (panDropdownOpen.value) {
    if (el && e && e.target && el.contains(e.target)) return;
    panDropdownOpen.value = false;
  }
  if (tmdbPanDropdownOpen.value) {
    if (el2 && e && e.target && el2.contains(e.target)) return;
    tmdbPanDropdownOpen.value = false;
  }
};

const onPanKeyDown = (e) => {
  if (e && e.key === 'Escape') {
    panDropdownOpen.value = false;
    tmdbPanDropdownOpen.value = false;
  }
};

const onEpisodeGroupDocDown = (e) => {
  if (!episodeGroupMoreOpen.value) return;
  const el = episodeGroupMoreEl.value;
  if (el && e && e.target && el.contains(e.target)) return;
  episodeGroupMoreOpen.value = false;
};

const onEpisodeGroupMoreEnter = () => {
  // Avoid opening immediately on mount when the element appears under a stationary cursor.
  if (!episodeGroupHoverArmed.value) return;
  episodeGroupMoreOpen.value = true;
};

onMounted(() => {
  initPlayPage();
  try {
    consumeClickPauseIfAny({ takeover: tmdbMode.value });
  } catch (_e) {}

  // iPhone edge-swipe back (PWA-like behavior): swipe from left edge to go back.
  // Keep this conservative to avoid interfering with scroll/player gestures.
  try {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const isIphone = /iPhone|iPod/i.test(ua);
    const root = document.getElementById('playPage');
    if (isIphone && root) {
      let armed = false;
      let startX = 0;
      let startY = 0;
      let shouldGoBack = false;
      const EDGE_PX = 20;
      const TRIGGER_DX = 70;

      const getPoint = (e) => {
        const t = e && e.touches && e.touches[0] ? e.touches[0] : null;
        if (!t) return null;
        return { x: t.clientX || 0, y: t.clientY || 0 };
      };

      const onTouchStart = (e) => {
        const p = getPoint(e);
        if (!p) return;
        startX = p.x;
        startY = p.y;
        armed = startX <= EDGE_PX;
        shouldGoBack = false;
      };

      const onTouchMove = (e) => {
        if (!armed) return;
        const p = getPoint(e);
        if (!p) return;
        const dx = p.x - startX;
        const dy = p.y - startY;
        if (dx <= 0) return;

        // If vertical movement dominates early, cancel to preserve scrolling.
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
          armed = false;
          shouldGoBack = false;
          return;
        }

        if (dx >= TRIGGER_DX && dx > Math.abs(dy) * 1.4) {
          shouldGoBack = true;
          try {
            e.preventDefault();
          } catch (_e) {}
        }
      };

      const reset = () => {
        armed = false;
        shouldGoBack = false;
      };

      const onTouchEnd = () => {
        if (armed && shouldGoBack) exitPlay();
        reset();
      };

      root.addEventListener('touchstart', onTouchStart, { passive: true });
      root.addEventListener('touchmove', onTouchMove, { passive: false });
      root.addEventListener('touchend', onTouchEnd, { passive: true });
      root.addEventListener('touchcancel', reset, { passive: true });
      cleanupFns.push(() => root.removeEventListener('touchstart', onTouchStart));
      cleanupFns.push(() => root.removeEventListener('touchmove', onTouchMove));
      cleanupFns.push(() => root.removeEventListener('touchend', onTouchEnd));
      cleanupFns.push(() => root.removeEventListener('touchcancel', reset));
    }
  } catch (_e) {}

  // Episode panel resizer (desktop)
  try {
    const grid = document.getElementById('playGrid');
    const resizer = document.getElementById('episodePanelResizer');
    const panel = document.getElementById('episodePanel');
    if (grid && resizer && panel) {
      const STORAGE_KEY = 'meowfilm_episode_panel_width';
      let dragging = false;
      let startX = 0;
      let startW = 0;
      let pendingW = 0;
      let rafId = 0;
      let currentW = 0;

      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const setWidth = (w) => {
        const next = clamp(w, 220, 520);
        currentW = next;
        grid.style.setProperty('--episode-panel-width', `${next}px`);
      };

      // Restore saved width (per-browser)
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const n = raw != null ? Number(raw) : NaN;
        if (Number.isFinite(n) && n > 0) setWidth(n);
      } catch (_e) {}

      const onMove = (e) => {
        if (!dragging) return;
        const x = e && typeof e.clientX === 'number' ? e.clientX : 0;
        const dx = x - startX;
        pendingW = clamp(startW - dx, 220, 520);
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          setWidth(pendingW);
        });
      };

      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        try {
          if (currentW) {
            localStorage.setItem(STORAGE_KEY, String(currentW));
          }
        } catch (_e) {}
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        grid.classList.remove('is-resizing');
        panel.classList.remove('is-resizing');
        window.removeEventListener('mousemove', onMove, true);
        window.removeEventListener('mouseup', onUp, true);
      };

      const onDown = (e) => {
        if (grid.classList.contains('episode-panel-collapsed')) return;
        dragging = true;
        startX = e.clientX;
        startW = panel.getBoundingClientRect().width || 280;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        grid.classList.add('is-resizing');
        panel.classList.add('is-resizing');
        window.addEventListener('mousemove', onMove, true);
        window.addEventListener('mouseup', onUp, true);
      };

      resizer.addEventListener('mousedown', onDown);
      cleanupFns.push(() => {
        try {
          onUp();
        } catch (_e) {}
        resizer.removeEventListener('mousedown', onDown);
      });
    }
  } catch (_e) {}

  // Episode grid columns adapt to available width
  try {
    const episodeButtons = document.getElementById('episodeButtons');
    if (episodeButtons) {
      const minButtonWidth = 44; // matches --episode-btn-size
      const clampCols = (v) => Math.max(3, Math.min(10, v));
      const calcCols = () => {
        const w = episodeButtons.clientWidth || 0;
        if (!w) return;
        const cs = window.getComputedStyle ? window.getComputedStyle(episodeButtons) : null;
        const gap = cs ? parseFloat(cs.columnGap || cs.gap || '12') : 12;
        const cols = clampCols(Math.floor((w + gap) / (minButtonWidth + gap)));
        episodeButtons.style.setProperty('--episode-cols', String(cols));
      };

      calcCols();
      window.addEventListener('resize', calcCols);
      cleanupFns.push(() => window.removeEventListener('resize', calcCols));
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => calcCols());
        ro.observe(episodeButtons);
        cleanupFns.push(() => ro.disconnect());
      }
    }
  } catch (_e) {}

  document.addEventListener('mousedown', onPanDocDown, true);
  document.addEventListener('keydown', onPanKeyDown, true);
  document.addEventListener('mousedown', onEpisodeGroupDocDown, true);
  cleanupFns.push(() => document.removeEventListener('mousedown', onEpisodeGroupDocDown, true));

  // Keep episode panel height aligned to the 16:9 player height on desktop,
  // and prevent tall episode lists from expanding the whole page.
  try {
    const playerBox = document.querySelector('.tv-player-stack') || document.querySelector('.play-video-ratio');
    const panel = document.getElementById('episodePanel');
    if (playerBox && panel && typeof ResizeObserver !== 'undefined') {
      const apply = () => {
        try {
          if (window.innerWidth < 768) {
            panel.style.removeProperty('height');
            return;
          }
          const h = playerBox.getBoundingClientRect().height;
          if (!h) return;
          panel.style.height = `${Math.round(h)}px`;
        } catch (_e) {}
      };
      // Apply a few times to cover first render/layout & async font/layout shifts.
      apply();
      window.requestAnimationFrame(() => apply());
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => apply()));
      const ro = new ResizeObserver(() => apply());
      ro.observe(playerBox);
      window.addEventListener('resize', apply);
      cleanupFns.push(() => ro.disconnect());
      cleanupFns.push(() => window.removeEventListener('resize', apply));
    }
  } catch (_e) {}

  // Episode group overflow (hover dropdown for hidden group tabs)
	  try {
	    const el = episodeGroupTabsEl.value;
	    if (el) {
	      const onResize = () => scheduleUpdateHiddenEpisodeGroups();
	      const onScroll = () => scheduleUpdateHiddenEpisodeGroups();
	      window.addEventListener('resize', onResize);
	      el.addEventListener('scroll', onScroll, { passive: true });
	      cleanupFns.push(() => window.removeEventListener('resize', onResize));
	      cleanupFns.push(() => el.removeEventListener('scroll', onScroll));

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => onResize());
        ro.observe(el);
        cleanupFns.push(() => ro.disconnect());
      }

	      scheduleUpdateHiddenEpisodeGroups();
	    }
	  } catch (_e) {}

  // Arm hover-open behavior after the first real mouse move (prevents default-open on mount).
  try {
    const arm = () => {
      episodeGroupHoverArmed.value = true;
      document.removeEventListener('mousemove', arm, true);
    };
    document.addEventListener('mousemove', arm, true);
    cleanupFns.push(() => document.removeEventListener('mousemove', arm, true));
  } catch (_e) {}

  // Player prev/next episode buttons
  try {
	    const onEpisodeDelta = (e) => {
	      const delta = e && e.detail ? Number(e.detail.delta) : 0;
	      if (!Number.isFinite(delta) || delta === 0) return;
	      void playEpisodeFromPlayingList({ delta, reason: 'button' });
	    };
    window.addEventListener('tvplayer:episode', onEpisodeDelta);
    cleanupFns.push(() => window.removeEventListener('tvplayer:episode', onEpisodeDelta));
  } catch (_e) {}
});

watch(
  () => `${getStableContentKey()}|${isSmartPanActive.value ? '1' : '0'}`,
  () => {
    if (sourcesLoading.value) return;
    if (isSmartPanActive.value) return;
    loadAggregatedSourcesFromStorage();
  },
  { immediate: true }
);

watch(
  () => `${getStableContentKey()}|${tmdbSmartListAvailable.value ? '1' : '0'}`,
  async () => {
    if (!tmdbSmartListAvailable.value) return;
    if (sourcesLoading.value) return;
    loadAggregatedSourcesFromStorage();
    if (aggregatedSources.value && aggregatedSources.value.length) return;
    if (sourcesSearchedOnce.value) return;
    await fetchAggregatedSourcesExactMatches();
  },
  { immediate: true }
);

watch(
  () => activeTab.value,
  async (v) => {
    if (v !== 'sources') return;
    if (sourcesLoading.value) return;
    if (isSmartPanActive.value) {
      await scrollSourcesToActive({ behavior: 'auto' });
      return;
    }
    loadAggregatedSourcesFromStorage();
    // If we already have sources from search storage, do not auto-fetch.
    if (aggregatedSources.value && aggregatedSources.value.length) {
      await scrollSourcesToActive({ behavior: 'auto' });
      return;
    }
    // Avoid repeatedly spamming search when users just toggle tabs.
    if (sourcesSearchedOnce.value) {
      await scrollSourcesToActive({ behavior: 'auto' });
      return;
    }
    await fetchAggregatedSourcesExactMatches();
    await scrollSourcesToActive({ behavior: 'auto' });
  }
);

watch(
  () =>
    `${activeTab.value}|${isSmartPanActive.value ? '1' : '0'}|${tmdbSmartPickCacheVersion.value}|${tmdbSmartDetailCacheVersion.value}`,
  async () => {
    if (activeTab.value !== 'sources') return;
    if (!isSmartPanActive.value) return;
    await scrollSourcesToActive({ behavior: 'auto' });
  }
);

watch(
  () =>
    [
      props.siteKey,
      props.spiderApi,
      props.videoId,
      props.contentKey,
      typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '',
      String(props.tmdbId || 0),
    ].join('|'),
  () => {
    const nextContentKey = contentKeyFromProps();
    const isNewContent = !!nextContentKey && nextContentKey !== lastContentKey;
    lastContentKey = nextContentKey;

    const prevIdx = Number.isFinite(selectedEpisodeIndex.value) ? Math.floor(selectedEpisodeIndex.value) : 0;
    void runEntryFlow({ isNewContent, restoreEpisodeIndex: prevIdx });
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  releaseLowPriorityHold();
  invalidateSourcesSearch();
  resumeHistoryState.seq += 1;
  resetTMDBSmartCaches();
  try {
    if (hiddenEpisodeGroupsRaf) cancelAnimationFrame(hiddenEpisodeGroupsRaf);
    hiddenEpisodeGroupsRaf = 0;
  } catch (_e) {}
  cleanupFns.splice(0).forEach((fn) => {
    try {
      fn();
    } catch (_e) {}
  });
  document.removeEventListener('mousedown', onPanDocDown, true);
  document.removeEventListener('keydown', onPanKeyDown, true);
  document.removeEventListener('mousedown', onEpisodeGroupDocDown, true);
});

watch(
  () => `${panDropdownOptions.value.map((o) => o.key).join(',')}|${smartListAvailable.value ? '1' : '0'}`,
  () => {
    if (selectedPan.value === SMART_PAN_KEY) {
      if (smartListAvailable.value) return;
      selectedPan.value = '';
      return;
    }
    const list = panDropdownOptions.value;
    if (!list.length) {
      selectedPan.value = '';
      return;
    }
    if (!selectedPan.value) return;
    const exists = list.some((o) => o && o.key === selectedPan.value);
    if (!exists) selectedPan.value = '';
  }
);
</script>

<style>
@media (min-width: 768px) {
  #playGrid {
    grid-template-columns: minmax(0, 1fr) var(--episode-panel-width, 280px);
  }

  #playGrid.episode-panel-collapsed {
    grid-template-columns: minmax(0, 1fr);
  }

  #playerArea {
    grid-column: 1 / 2 !important;
  }

  #episodePanel {
    grid-column: 2 / 3 !important;
    min-height: 0;
  }

  #playGrid.episode-panel-collapsed #playerArea {
    grid-column: 1 / -1 !important;
  }

  #episodeButtons {
    display: grid;
    grid-template-columns: repeat(var(--episode-cols, 5), var(--episode-btn-size, 44px));
    justify-content: start;
  }
}

.episode-num-btn {
  width: var(--episode-btn-size, 44px);
  height: var(--episode-btn-size, 44px);
  padding: 0;
}

.play-video-ratio {
  position: relative;
  width: 100%;
  background: #000;
  min-height: 240px;
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

.tv-thirdparty-btn,
.tv-thirdparty-expand {
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

.tv-thirdparty-btn:hover,
.tv-thirdparty-expand:hover {
  background: rgba(255, 255, 255, 0.8);
}

.tv-thirdparty-btn:active,
.tv-thirdparty-expand:active {
  transform: translateY(1px);
}

.tv-thirdparty-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tv-thirdparty-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.tv-thirdparty-expand__ico {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.tv-thirdparty-expand__ico--open {
  transform: rotate(180deg);
}

.dark .tv-thirdparty-btn,
.dark .tv-thirdparty-expand {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .tv-thirdparty-btn:hover,
.dark .tv-thirdparty-expand:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 767px) {
  .tv-thirdparty-bar__inner {
    position: relative;
    justify-content: center;
    padding-left: 48px;
    padding-right: 48px;
  }

  .tv-thirdparty-expand {
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

.episode-season-bar {
  margin-bottom: 10px;
}

.episode-season-tabs,
.episode-group-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px 0;
  scrollbar-width: none;
}

.episode-season-tabs::-webkit-scrollbar,
.episode-group-tabs::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.episode-season-btn,
.episode-group-btn {
  flex: 0 0 auto;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.04);
  color: rgba(107, 114, 128, 1);
  font-size: 12px;
  font-weight: 700;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}

.episode-season-btn:hover,
.episode-group-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.episode-season-btn[data-active='true'],
.episode-group-btn[data-active='true'] {
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.4);
  color: rgba(22, 163, 74, 1);
}

.dark .episode-season-btn,
.dark .episode-group-btn {
  background: rgba(255, 255, 255, 0.06);
}

.dark .episode-season-btn {
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(209, 213, 219, 1);
}

.dark .episode-season-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.episode-group-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.episode-group-tabs {
  flex: 1 1 auto;
  min-width: 0;
}

.episode-group-more {
  position: static;
  flex: 0 0 auto;
}

.episode-group-more__btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  color: rgba(55, 65, 81, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.episode-group-more__btn:hover {
  background: rgba(255, 255, 255, 0.8);
}

.episode-group-more__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow: auto;
  padding: 8px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
  z-index: 60;
  display: none;
}

.episode-group-more__menu.episode-group-more__menu--open {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.episode-group-more__item {
  width: 100%;
  height: 34px;
  border-radius: 12px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(31, 41, 55, 1);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}

.episode-group-more__item:hover {
  background: rgba(0, 0, 0, 0.06);
}

.episode-group-more__item[data-active='true'] {
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.4);
  color: rgba(21, 128, 61, 1);
}

.dark .episode-group-btn {
  border-color: rgba(255, 255, 255, 0.14);
  color: rgba(156, 163, 175, 1);
}

.dark .episode-group-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .episode-season-btn[data-active='true'],
.dark .episode-group-btn[data-active='true'] {
  background: rgba(34, 197, 94, 0.18);
  color: rgba(74, 222, 128, 1);
}

.dark .episode-season-btn[data-active='true'] {
  border-color: rgba(34, 197, 94, 0.42);
}

.dark .episode-group-btn[data-active='true'] {
  border-color: rgba(34, 197, 94, 0.55);
}

.dark .episode-group-more__btn {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .episode-group-more__menu {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
}

.dark .episode-group-more__item {
  color: rgba(229, 231, 235, 1);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .episode-group-more__item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .episode-group-more__item[data-active='true'] {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.55);
  color: rgba(74, 222, 128, 1);
}

.episode-resizer {
  position: absolute;
  left: -14px;
  top: 10px;
  bottom: 10px;
  width: 28px;
  cursor: col-resize;
  z-index: 20;
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

#playGrid.is-resizing,
#episodePanel.is-resizing {
  transition: none !important;
}

#playGrid.episode-panel-collapsed .episode-resizer {
  display: none;
}

.episode-control {
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.65);
  color: rgba(55, 65, 81, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 13px;
  font-weight: 500;
}

.episode-control:hover {
  background: rgba(255, 255, 255, 0.78);
}

.episode-control:focus {
  outline: none;
  border-color: rgba(34, 197, 94, 0.55);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.episode-control--btn {
  padding: 0 12px;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.episode-control--btn[data-active='true'] {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(34, 197, 94, 0.12);
  color: rgba(17, 24, 39, 1);
}

.episode-control--btn:hover {
  background: rgba(255, 255, 255, 0.78);
}

.episode-control--btn:active {
  transform: translateY(1px);
}

.dark .episode-control {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .episode-control:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .episode-control--btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .episode-control--btn[data-active='true'] {
  border-color: rgba(34, 197, 94, 0.55);
  background: rgba(34, 197, 94, 0.18);
  color: rgba(243, 244, 246, 1);
}

.dark .episode-control:focus {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.22);
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

.play-pan-dropdown .custom-dropdown-btn {
  padding: 8px 12px;
  border-radius: 12px;
  height: 34px;
  line-height: 18px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .play-pan-dropdown .custom-dropdown-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .play-pan-dropdown .custom-dropdown-list {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.dark .play-pan-dropdown .custom-dropdown-item {
  color: rgba(229, 231, 235, 1);
}

.dark .play-pan-dropdown .custom-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dark .play-pan-dropdown .custom-dropdown-item.active {
  background: rgba(34, 197, 94, 0.16);
  color: rgba(74, 222, 128, 1);
}

.play-pan-dropdown .custom-dropdown-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.play-detail__inner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
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

.play-detail__posterSkeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 100%);
  background-size: 200% 100%;
  animation: play-skeleton 1.2s ease-in-out infinite;
}

.play-detail__posterImg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-detail__posterFallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(107, 114, 128, 1);
  font-size: 13px;
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

.play-detail__debug {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.9);
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
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

.dark .play-detail__posterWrap {
  background: rgba(255, 255, 255, 0.06);
}

.dark .play-detail__posterSkeleton {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.06) 100%);
  background-size: 200% 100%;
}

.dark .play-detail__posterFallback {
  color: rgba(156, 163, 175, 1);
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

.dark .play-detail__debug {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(229, 231, 235, 0.9);
}

@keyframes play-skeleton {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.raw-list__hint {
  padding: 10px 8px;
  font-size: 13px;
  color: rgba(107, 114, 128, 1);
  text-align: center;
}

.raw-list__hint--error {
  color: rgba(239, 68, 68, 1);
}

.raw-list__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.raw-list__row {
  cursor: pointer;
  appearance: none;
  outline: none;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.55);
  color: rgba(31, 41, 55, 1);
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.raw-list__row:hover {
  background: rgba(255, 255, 255, 0.72);
}

.raw-list__text {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.raw-list__row--active {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(34, 197, 94, 0.12);
}

.source-card--active {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.source-card--idle {
  cursor: pointer;
}

.source-card--idle:hover {
  background: rgba(0, 0, 0, 0.04);
}

.dark .source-card--active {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.28);
}

.dark .source-card--idle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.source-card--smart {
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.55);
}

.source-card--smart::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0);
  opacity: 0;
  transition: opacity 160ms ease, background-color 160ms ease;
}

.source-card--smart.source-card--active {
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.3);
}

.source-card--smart.source-card--active::before {
  background: rgba(34, 197, 94, 0.95);
  opacity: 1;
}

.source-card--smart.source-card--idle:hover {
  background: rgba(255, 255, 255, 0.72);
}

.source-card--smart.source-card--idle:hover::before {
  background: rgba(34, 197, 94, 0.45);
  opacity: 1;
}

.dark .source-card--smart {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
}

.dark .source-card--smart.source-card--active {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.28);
}

.dark .source-card--smart.source-card--idle:hover {
  background: rgba(255, 255, 255, 0.09);
}

.source-card__cover {
  background: rgba(0, 0, 0, 0.06);
}

.dark .source-card__cover {
  background: rgba(255, 255, 255, 0.08);
}

.source-more-btn {
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.45);
  color: rgba(107, 114, 128, 1);
  font-size: 13px;
  font-weight: 700;
}

.dark .source-more-btn {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(156, 163, 175, 1);
}

.dark .raw-list__hint {
  color: rgba(156, 163, 175, 1);
}

.dark .raw-list__row {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(229, 231, 235, 1);
  box-shadow: none;
}

.dark .raw-list__row:hover {
  background: rgba(255, 255, 255, 0.09);
}

.dark .raw-list__row--active {
  border-color: rgba(34, 197, 94, 0.55);
  background: rgba(34, 197, 94, 0.18);
}

.tv-spinner {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: rgba(255, 255, 255, 0.95);
  animation: tvspin 0.9s linear infinite;
}

@keyframes tvspin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tv-center-loading {
  flex: 1;
  min-height: 120px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 0;
  color: rgba(107, 114, 128, 1);
}

.dark .tv-center-loading {
  color: rgba(156, 163, 175, 1);
}

.tv-center-loading__text {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.tv-episode-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: rgba(107, 114, 128, 1);
}

.dark .tv-episode-overlay {
  color: rgba(156, 163, 175, 1);
}

.tv-episode-overlay__inner {
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
  z-index: 10010;
  padding: 18px;
	  background: radial-gradient(circle at 50% 45%, rgba(2, 6, 23, 0.78) 0%, rgba(2, 6, 23, 0.35) 55%, rgba(2, 6, 23, 0) 100%);
	  backdrop-filter: none;
	}

.play-player-overlay__panel {
  /* Constrain overall layout to a fixed "red box" area */
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
  background: linear-gradient(90deg, #0EA5E9, #22C55E, #6366F1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset;
}

.play-player-overlay--error .play-player-overlay__fill {
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.95), rgba(251, 146, 60, 0.95));
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

</style>
