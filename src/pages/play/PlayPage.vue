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
                      <div
                        v-if="!tmdbMode"
                        class="episode-controls-row flex items-center gap-2.5 mb-3 -mx-6 px-6 flex-shrink-0"
                      >
                        <div class="flex-1 min-w-0">
                          <div ref="siteSourceDropdownEl" class="custom-dropdown play-pan-dropdown">
                            <button
                              type="button"
                              class="custom-dropdown-btn play-pan-btn"
                              :disabled="orderedSiteSources.length === 0"
                              @click="siteSourceDropdownOpen = !siteSourceDropdownOpen"
                            >
                              {{ selectedSiteSourceLabel }}
                            </button>
                            <div class="custom-dropdown-list" :class="{ hidden: !siteSourceDropdownOpen }">
                              <div
                                v-for="src in orderedSiteSources"
                                :key="src.key"
                                class="custom-dropdown-item"
                                :class="{ active: src.active }"
                                role="option"
                                :title="formatSiteSourceLabel(src)"
                                @click="selectSiteSourceFromEpisodes(src)"
                              >
                                {{ formatSiteSourceLabel(src) }}
                              </div>
                              <div v-if="orderedSiteSources.length === 0" class="custom-dropdown-item">
                                <span>暂无数据</span>
                              </div>
                              <div
                                v-if="sourcesLoading || canLoadMoreSources"
                                class="custom-dropdown-item"
                                :class="{ 'opacity-60 cursor-not-allowed': sourcesLoading }"
                                role="option"
                                @click="canLoadMoreSources ? loadMoreSources() : null"
                              >
                                <span v-if="sourcesLoading">加载中...</span>
                                <span v-else>加载更多...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="episode-controls-row flex items-center gap-2.5 mb-3 -mx-6 px-6 flex-shrink-0">
                        <div class="flex-1 min-w-0">
	                          <div ref="panDropdownEl" class="custom-dropdown play-pan-dropdown">
	                            <button
	                              type="button"
	                              class="custom-dropdown-btn play-pan-btn"
	                              :disabled="(panDropdownOptions.length === 0 && !smartListAvailable) && !siteDetailBooting"
	                              @click="panDropdownOpen = !panDropdownOpen"
	                            >
	                              {{ selectedPanLabel }}
	                            </button>
		                            <div class="custom-dropdown-list" :class="{ hidden: !panDropdownOpen }">
		                        <template v-if="siteDetailBooting">
		                                <div
		                                  class="custom-dropdown-item"
		                                  :class="{ active: selectedPanKey === SMART_PAN_KEY }"
		                                  role="option"
		                                  @click="selectPan(SMART_PAN_KEY, { fromUser: true })"
		                                >
		                                  {{ SITE_SMART_LIST_LABEL }}
		                                </div>
		                                <div class="custom-dropdown-item" role="option" @click="panDropdownOpen = false">
		                                  加载中...
		                                </div>
		                              </template>
		                              <template v-else>
		                              <div
		                                v-for="s in smartPanEntries"
		                                :key="s.key"
		                                class="custom-dropdown-item"
	                                :class="{ active: s.key === selectedPanKey }"
	                                role="option"
	                                @click="selectPan(s.key, { fromUser: true })"
	                              >
	                                {{ s.label }}
	                              </div>
                              <div
                                v-for="o in panDropdownOptions"
                                :key="o.key"
                                class="custom-dropdown-item"
                                :class="{ active: o.key === selectedPanKey }"
                                role="option"
                                @click="selectPan(o.key, { fromUser: true })"
                              >
                                {{ o.label }}
                              </div>
                              <div v-if="panDropdownOptions.length === 0 && !smartListAvailable" class="custom-dropdown-item">
                                <span>
                                  {{ panDropdownStatusText || '暂无数据' }}
                                </span>
                              </div>
                              <div
                                v-if="tmdbMode && (sourcesLoading || canLoadMoreSources)"
                                class="custom-dropdown-item"
                                :class="{ 'opacity-60 cursor-not-allowed': sourcesLoading }"
                                role="option"
                                @click="canLoadMoreSources ? loadMoreSources() : null"
                              >
                                <span v-if="sourcesLoading">加载中...</span>
                                <span v-else>加载更多...</span>
                              </div>
		                              </template>
		                            </div>
		                          </div>
				                        </div>
	                        <div v-if="panDropdownLoading || siteDetailBooting" class="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-label="加载中">
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
		                        v-if="tmdbSmartListAvailable && isTMDBSitePanKey(selectedPanKey)"
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
                                <span :class="selectedPanAuxError ? 'text-red-600 dark:text-red-400' : ''">
                                  {{ selectedPanAuxError || '暂无数据' }}
                                </span>
                              </div>
                            </div>
                          </div>
		                        </div>
                        <div v-if="selectedPanAuxLoading" class="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-label="加载中">
                          <div class="tv-spinner" aria-hidden="true"></div>
                        </div>
                        <button
                          v-if="tmdbMode && !tmdbMovieMode && isTMDBSitePanKey(selectedPanKey)"
                          type="button"
                          class="episode-control episode-control--btn flex-shrink-0"
                          v-show="!rawListMode"
                          @click="toggleEpisodeMetaMode"
                        >
                          {{ episodeMetaModeLabel }}
                        </button>
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

		                      <div
		                        v-if="panMockRawDirBarVisible && rawListMode"
		                        class="episode-controls-row flex items-center gap-2.5 mb-3 -mx-6 px-6 flex-shrink-0"
		                      >
		                        <div class="flex-1 min-w-0 text-xs text-gray-600 dark:text-gray-300 truncate" :title="panMockRawDirDisplayPath">
		                          {{ panMockRawDirDisplayPath }}
		                        </div>
		                        <button
		                          v-if="panMockRawDirCanGoBack"
		                          type="button"
		                          class="episode-control episode-control--btn flex-shrink-0"
		                          style="padding:6px 10px;font-size:12px;line-height:1.1"
		                          @click="panMockRawDirGoBack"
		                        >
		                          返回
		                        </button>
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
	                                @click="selectSeason(s.season, { fromUser: true })"
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
	                        <div
	                          v-if="(introLoading || selectedPanAuxLoading || panDropdownLoading || smartPanMockLoading || tmdbEpisodesLoading || (tmdbMovieMode && isSmartPanActive && tmdbMovieSmartResolving)) && rawListItems.length === 0"
	                          class="tv-center-loading"
	                        >
	                          <div class="tv-spinner" aria-hidden="true"></div>
	                          <div class="tv-center-loading__text">加载中...</div>
	                        </div>
	                        <div v-else-if="(selectedPanAuxError || introError) && rawListItems.length === 0" class="tv-episode-overlay">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-center-loading__text text-red-600 dark:text-red-400">{{ selectedPanAuxError || introError }}</div>
	                          </div>
	                        </div>
	                        <div v-else-if="rawListItems.length === 0" class="tv-episode-overlay">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-center-loading__text">{{ panDropdownLoading || smartPanMockLoading || (tmdbMovieMode && isSmartPanActive && tmdbMovieSmartResolving) ? '加载中...' : '暂无数据' }}</div>
	                          </div>
                        </div>
	                        <div v-else class="raw-list__items">
			                            <button
			                              v-for="it in rawListPagedItems"
			                              :key="it.key"
			                              type="button"
			                              class="raw-list__row"
			                              :class="{
			                              'raw-list__row--active':
			                                it.kind !== 'dir' &&
			                                isEpisodeActive(it.index, it),
			                            }"
			                            :title="it.text"
			                            @click="onRawListItemClick(it)"
			                          >
		                            <span class="raw-list__text">{{ it.text }}</span>
		                          </button>
	                        </div>
                      </div>

                      <div
                        id="episodeButtons"
                        ref="episodeButtonsEl"
                        class="relative flex flex-wrap gap-3 overflow-y-auto flex-1 content-start pb-4"
                        v-show="!rawListMode"
                      >
	                      <div
	                        v-if="(introLoading || panDropdownLoading) && !smartListAvailable && groupedDisplayedEpisodes.length === 0"
	                        class="tv-episode-overlay"
	                        aria-hidden="true"
	                      >
	                        <div class="tv-episode-overlay__inner">
	                          <div class="tv-spinner" aria-hidden="true"></div>
	                          <div class="tv-center-loading__text">加载中...</div>
	                        </div>
	                      </div>
	                      <div v-else-if="tmdbEpisodesLoading && groupedDisplayedEpisodes.length === 0" class="tv-episode-overlay" aria-hidden="true">
	                        <div class="tv-episode-overlay__inner">
	                          <div class="tv-spinner" aria-hidden="true"></div>
	                          <div class="tv-center-loading__text">加载中...</div>
	                        </div>
	                      </div>
	                      <div v-else-if="doubanEpisodesLoading && groupedDisplayedEpisodes.length === 0" class="tv-episode-overlay" aria-hidden="true">
	                        <div class="tv-episode-overlay__inner">
	                          <div class="tv-spinner" aria-hidden="true"></div>
	                            <div class="tv-center-loading__text">加载中...</div>
	                          </div>
	                        </div>
	                        <div v-else-if="selectedPanAuxLoading && groupedDisplayedEpisodes.length === 0" class="tv-episode-overlay" aria-hidden="true">
	                          <div class="tv-episode-overlay__inner">
	                            <div class="tv-spinner" aria-hidden="true"></div>
	                            <div class="tv-center-loading__text">加载中...</div>
	                          </div>
	                        </div>
					                        <div v-else-if="(selectedPanAuxError || introError) && groupedDisplayedEpisodes.length === 0" class="tv-episode-overlay">
                          <div class="tv-episode-overlay__inner">
                            <div class="tv-center-loading__text text-red-600 dark:text-red-400">{{ selectedPanAuxError || introError }}</div>
                          </div>
                        </div>
                        <template v-else>
	                          <template v-if="groupedDisplayedEpisodes.length">
			                            <button
			                              v-for="ep in groupedDisplayedEpisodes"
			                              :key="ep.key"
			                              type="button"
			                              class="episode-num-btn relative flex items-center justify-center text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap font-mono"
                              :class="isEpisodeActive(ep.index, ep)
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 dark:bg-green-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'"
                              :data-episode-active="isEpisodeActive(ep.index, ep) ? 'true' : 'false'"
                              :title="ep.name"
                              @click="selectEpisode(ep.index)"
                            >
                              <span
                                v-if="ep.is4k"
                                class="absolute -top-1 -right-1 text-[10px] leading-none px-1 py-0.5 rounded bg-green-500 text-white shadow-sm"
                              >
                                4K
                              </span>
	                              {{ ep.displayNo != null ? ep.displayNo : ep.no }}
	                            </button>
	                          </template>
	                          <div v-else class="tv-episode-overlay">
	                            <div class="tv-episode-overlay__inner">
	                              <div v-if="smartPanMockLoading || (tmdbMovieMode && isSmartPanActive && tmdbMovieSmartResolving)" class="tv-spinner" aria-hidden="true"></div>
	                              <div class="tv-center-loading__text">{{ smartPanMockLoading || (tmdbMovieMode && isSmartPanActive && tmdbMovieSmartResolving) ? '加载中...' : '暂无数据' }}</div>
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
                              <div v-if="src.error" class="text-xs text-red-600 dark:text-red-400 truncate" :title="src.error">
                                {{ src.error }}
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
                              <div v-if="src.error" class="text-xs text-red-600 dark:text-red-400 truncate" :title="src.error">
                                {{ src.error }}
                              </div>

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
                          v-if="sourcesLoading || sourcesError || !sourcesSearchedOnce || canLoadMoreSources || sourcesTabItems.length <= 1"
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
                            <span v-if="sourcesSearchRemainingCount > 0" class="text-xs text-gray-500 dark:text-gray-400">剩余 {{ sourcesSearchRemainingCount }} 个站点</span>
                            <span v-else class="text-xs text-gray-500 dark:text-gray-400">继续搜索站点</span>
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
import { grantCatLowPrioritySearchTickets, normalizecatpawrunnerApiBase, pauseCatLowPriority, requestCatPlay, requestCatSpider } from '../../shared/catpawrunner';
import { apiGetJson, apiPostJson, buildQuery } from '../../shared/apiClient';
import { fetchBootstrap } from '../../shared/bootstrap';
import { processPosterUrl } from '../../shared/posterCard';
import {
  buildEpisodeMatchKey,
  extractTianyiShareCodeAndAccessCode,
  guessPreferredPanFromFlag,
  normalizeRawNameForCompare,
  panMockProviderFromFlag,
  parseMockPasscodeFromRawName,
  scoreEpisodeDisplayName,
} from '../../utils/matchCore';

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
  switchOnlyToken: { type: Number, default: 0 },
  autoPlayResetToken: { type: Number, default: 0 },
  openFromSearch: { type: Number, default: 0 },
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
    !Array.isArray(base.smartPanMatchTokens) ||
    !Array.isArray(base.smartPanAliasMappings);
  if (!needs) return;
  try {
    const b = await fetchBootstrap('play');
    if (b && b.authenticated && b.settings && typeof b.settings === 'object') {
      playBootstrapSettings.value = b.settings;
    }
  } catch (_e) {}
};

const panLoginSettingsCache = ref(null);
let panLoginSettingsInFlight = null;

const hasMeaningfulPanLoginValue = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  const values = Object.values(obj || {});
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (typeof v === 'string' && v.trim()) return true;
    if (v && typeof v === 'object' && hasMeaningfulPanLoginValue(v)) return true;
  }
  return false;
};

const loadPanLoginSettingsForPlay = async () => {
  if (panLoginSettingsCache.value && typeof panLoginSettingsCache.value === 'object') {
    return panLoginSettingsCache.value;
  }
  if (panLoginSettingsInFlight) return await panLoginSettingsInFlight;
  panLoginSettingsInFlight = (async () => {
    try {
      const data = await apiGetJson(
        `/api/home${buildQuery({
          includePlayHistory: 0,
          includeFavorites: 0,
          includePanLoginSettings: 1,
        })}`,
        { cacheMs: 5000 }
      );
      const store = data && data.panLoginSettings && typeof data.panLoginSettings === 'object' ? data.panLoginSettings : {};
      panLoginSettingsCache.value = store;
      return store;
    } catch (_e) {
      return null;
    } finally {
      panLoginSettingsInFlight = null;
    }
  })();
  return await panLoginSettingsInFlight;
};

const isBuiltinPanProviderConfiguredForPlay = async (provider) => {
  const p = typeof provider === 'string' ? provider.trim() : '';
  if (!p) return false;
  const keyMap = {
    baidu: 'baidu',
    quark: 'quark',
    uc: 'uc',
    '139': '139',
    '189': '189',
  };
  const key = keyMap[p] || '';
  if (!key) return false;
  const store = await loadPanLoginSettingsForPlay();
  if (!store || typeof store !== 'object') {
    // Do not block playback on state API errors; keep legacy behavior.
    return true;
  }
  const slot = store[key] && typeof store[key] === 'object' ? store[key] : {};
  // For quark/uc, only check cookie slot of the same provider (do not rely on *_tv).
  return hasMeaningfulPanLoginValue(slot);
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

watch(
  () => debugEnabled.value,
  (on) => {
    if (!on) return;
    try {
      if (typeof window === 'undefined') return;
      window.__tvDebug = {
        selectedPanAuxLoading,
        selectedEpisodes,
        rawListItems,
        groupedDisplayedEpisodes,
        tmdbSmartEpisodeCount,
        tmdbSmartEpisodes,
        doubanSmartListAvailable,
        doubanSeasonMeta,
        episodeMatchByIndex,
      };
    } catch (_e) {}
  },
  { immediate: true }
);

const smartDebugEvents = ref([]);
const formatSmartLogTs = (ms) => {
  try {
    const d = new Date(Number.isFinite(Number(ms)) ? Number(ms) : Date.now());
    const pad = (n) => String(Number.isFinite(Number(n)) ? Math.floor(Number(n)) : 0).padStart(2, '0');
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${hh}:${mm}:${ss}`;
  } catch (_e) {
    return '';
  }
};
const smartConsoleLog = (evt) => {
  try {
    if (!debugEnabled.value) return;
    if (!evt || typeof evt !== 'object') return;
    const t = evt.type != null ? String(evt.type) : '';
    if (!t) return;
    const ts = formatSmartLogTs(evt.at);
    const mod = evt.module != null ? String(evt.module) : '';
    const tag = mod ? mod : 'smart';

    const pick = (k) => (evt[k] != null ? String(evt[k]) : '');
    const siteKey = pick('siteKey') || pick('siteId') || '';
    const siteName = pick('siteName') || '';
    const panFlag = pick('panFlag') || pick('flag') || pick('label') || '';
    const query = pick('query') || '';
    const queryKey = pick('queryKey') || '';
    const queryLoose = pick('queryLoose') || '';
    const queryKeyLoose = pick('queryKeyLoose') || '';
    const runtimeKey = pick('runtimeKey') || '';
    const searchSeq = pick('searchSeq') || '';
    const fromHistory = pick('fromHistory') || '';
    const fromProps = pick('fromProps') || '';
    const provider = pick('provider') || '';
    const showName = pick('showName') || '';
    const rawName = pick('rawName') || '';
    const spiderApi = pick('spiderApi') || pick('spider') || '';
    const videoId = pick('videoId') || '';
    const want = pick('want') || '';
    const reason = pick('reason') || '';
    const ok = pick('ok') || '';
    const vodLen = pick('vodLen') || '';
    const keys = pick('keys') || '';
    const count = pick('count') || '';
    const total = pick('total') || '';
    const matched = pick('matched') || '';
    const len = pick('len') || '';
    const sample = pick('sample') || '';
    const mode = pick('mode') || '';
    const panKey = pick('panKey') || '';
    const tmdbCount = pick('tmdbCount') || '';
    const tmdbLen = pick('tmdbLen') || '';
    const doubanAvail = pick('doubanAvail') || '';
    const doubanSeasons = pick('doubanSeasons') || '';
    const doubanCounts = pick('doubanCounts') || '';
    const queue = pick('queue') || '';
    const done = pick('done') || '';
    const loading = pick('loading') || '';
    const quality = pick('quality') || '';
    const ms = pick('ms') || '';
    const episodes = pick('episodes') || '';
    const url = pick('url') || '';
    const err = pick('err') || pick('error') || '';

    const parts = [];
    if (want) parts.push(`want=${want}`);
    if (reason) parts.push(`reason=${reason}`);
    if (ok) parts.push(`ok=${ok}`);
    if (vodLen) parts.push(`vodLen=${vodLen}`);
    if (keys) parts.push(`keys=${keys}`);
    if (count) parts.push(`count=${count}`);
    if (total) parts.push(`total=${total}`);
    if (matched) parts.push(`matched=${matched}`);
    const has = (k) => Object.prototype.hasOwnProperty.call(evt, k);
    if (has('head')) parts.push(`head=${head}`);
    if (has('tail')) parts.push(`tail=${tail}`);
    if (len) parts.push(`len=${len}`);
    if (sample) parts.push(`sample=${sample}`);
    if (mode) parts.push(`mode=${mode}`);
    if (panKey) parts.push(`panKey=${panKey}`);
    if (tmdbCount) parts.push(`tmdbCount=${tmdbCount}`);
    if (tmdbLen) parts.push(`tmdbLen=${tmdbLen}`);
    if (doubanAvail !== '') parts.push(`doubanAvail=${doubanAvail}`);
    if (doubanSeasons) parts.push(`doubanSeasons=${doubanSeasons}`);
    if (doubanCounts) parts.push(`doubanCounts=${doubanCounts}`);
    if (has('maxSeason')) parts.push(`maxSeason=${maxSeason}`);
    if (has('maxEpisode')) parts.push(`maxEpisode=${maxEpisode}`);
    if (has('seasonCounts')) parts.push(`seasonCounts=${seasonCounts}`);
    if (queue) parts.push(`queue=${queue}`);
    if (done) parts.push(`done=${done}`);
    if (loading) parts.push(`loading=${loading}`);
    if (query) parts.push(`query=${query}`);
    if (queryKey) parts.push(`queryKey=${queryKey}`);
    if (queryLoose) parts.push(`queryLoose=${queryLoose}`);
    if (queryKeyLoose) parts.push(`queryKeyLoose=${queryKeyLoose}`);
    if (runtimeKey) parts.push(`runtimeKey=${runtimeKey}`);
    if (searchSeq) parts.push(`searchSeq=${searchSeq}`);
    if (fromHistory) parts.push(`fromHistory=${fromHistory}`);
    if (fromProps) parts.push(`fromProps=${fromProps}`);
    if (siteKey) parts.push(`site=${siteKey}${siteName ? `(${siteName})` : ''}`);
    if (panFlag) parts.push(`panFlag=${panFlag}`);
    if (provider) parts.push(`provider=${provider}`);
    if (quality) parts.push(`quality=${quality}`);
    if (ms) parts.push(`ms=${ms}`);
    if (episodes) parts.push(`episodes=${episodes}`);
    if (showName) parts.push(`showName=${showName}`);
    if (rawName) parts.push(`rawName=${rawName}`);
    if (spiderApi) parts.push(`spider=${spiderApi}`);
    if (videoId) parts.push(`videoId=${videoId}`);
    if (url) parts.push(`url=${url}`);
    if (err) parts.push(`err=${err}`);

    const line = `${ts ? `${ts} ` : ''}[${tag}][${t}]${parts.length ? ` ${parts.join(' ')}` : ''}`;
    // eslint-disable-next-line no-console
    console.log(line);
  } catch (_e) {}
};
const smartDebugLog = (type, payload) => {
  try {
    if (!debugEnabled.value) return;
    const t = typeof type === 'string' ? type.trim() : '';
    if (!t) return;
    const data = payload && typeof payload === 'object' ? payload : payload != null ? { value: payload } : {};
    const list = Array.isArray(smartDebugEvents.value) ? smartDebugEvents.value.slice() : [];
    const evt = { at: Date.now(), type: t, ...data };
    list.push(evt);
    while (list.length > 60) list.shift();
    smartDebugEvents.value = list;
    smartConsoleLog(evt);
  } catch (_e) {}
};

const playDebugLog = (type, payload) => {
  try {
    if (!debugEnabled.value) return;
    const t = typeof type === 'string' ? type.trim() : '';
    if (!t) return;
    const data = payload && typeof payload === 'object' ? payload : payload != null ? { value: payload } : {};
    const ts = formatSmartLogTs(Date.now());
    const reason = data && data.reason != null ? String(data.reason) : '';
    const tag = /^(resume_|autoplay|auto_)/i.test(reason) ? 'auto_select' : 'play';
    const picks = [
      'reason',
      'prev',
      'next',
      'idx',
      'total',
      'len',
      'wantedSeason',
      'wantedEpisode',
      'wantedIndex',
      'tmdbSmart',
      'doubanSmart',
      'panKey',
      'mode',
      'head',
      'tail',
      'maxSeason',
      'maxEpisode',
      'seasonCounts',
      'sample',
    ];
    const parts = [];
    picks.forEach((k) => {
      if (data[k] != null && data[k] !== '') parts.push(`${k}=${String(data[k])}`);
    });
    const line = `${ts ? `${ts} ` : ''}[${tag}][${t}]${parts.length ? ` ${parts.join(' ')}` : ''}`;
    // eslint-disable-next-line no-console
    console.log(line);
  } catch (_e) {}
};

const playerStatsSiteName = ref('');
const playerStatsPanName = ref('');
const currentPlayingPanFlag = ref('');
const playerStatsPathName = ref('');
const playerStatsRawFileName = ref('');
const playerStatsExtra = computed(() => {
  return {
    displayName: displayTitle.value || '',
    siteName: playerStatsSiteName.value || '',
    panName: playerStatsPanName.value || '',
    pathName: playerStatsPathName.value || '',
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

const aggregatedSources = ref([]);

const toCircledIndex = (nRaw) => {
  const n = Number.isFinite(Number(nRaw)) ? Math.floor(Number(nRaw)) : 0;
  if (n <= 0) return '';
  const circled = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
  if (n <= circled.length) return circled[n - 1];
  return `(${n})`;
};

const buildAggregatedSourceDisplayMetaMap = (sourcesRaw) => {
  const sources = Array.isArray(sourcesRaw) ? sourcesRaw : [];
  const groupSeen = new Map();
  const groupTotal = new Map();
  sources.forEach((s) => {
    if (!s) return;
    const sk = s.siteKey ? String(s.siteKey).trim() : '';
    const title = s.videoTitle ? String(s.videoTitle).trim() : '';
    if (!sk || !title) return;
    const gk = `${sk}::${title}`;
    groupTotal.set(gk, (groupTotal.get(gk) || 0) + 1);
  });

  const out = new Map();
  sources.forEach((s) => {
    if (!s) return;
    const sk = s.siteKey ? String(s.siteKey).trim() : '';
    const api = s.spiderApi ? String(s.spiderApi).trim() : '';
    const vid = s.videoId ? String(s.videoId).trim() : '';
    if (!sk || !vid) return;
    const key = `${sk}::${api}::${vid}`;
    const siteName = s.siteName ? String(s.siteName).trim() : sk;
    const sourceTitle = s.videoTitle ? String(s.videoTitle).trim() : '';
    let sourceTitleMarked = sourceTitle;
    if (sourceTitle) {
      const gk = `${sk}::${sourceTitle}`;
      const total = groupTotal.get(gk) || 0;
      const idx = (groupSeen.get(gk) || 0) + 1;
      groupSeen.set(gk, idx);
      if (total > 1) {
        const suffix = toCircledIndex(idx);
        if (suffix) sourceTitleMarked = `${sourceTitle}${suffix}`;
      }
    }
    const siteTitleLabel = sourceTitleMarked ? `${siteName}-${sourceTitleMarked}` : siteName;
    out.set(key, { siteName, sourceTitle, sourceTitleMarked, siteTitleLabel });
  });
  return out;
};

const aggregatedSourceDisplayMetaMap = computed(() => buildAggregatedSourceDisplayMetaMap(aggregatedSources.value));

const getAggregatedSourceDisplayMeta = ({ siteKey = '', spiderApi = '', videoId = '', fallbackSiteName = '' } = {}) => {
  const sk = typeof siteKey === 'string' ? siteKey.trim() : '';
  const api = typeof spiderApi === 'string' ? spiderApi.trim() : '';
  const vid = typeof videoId === 'string' ? videoId.trim() : '';
  const fallback = typeof fallbackSiteName === 'string' ? fallbackSiteName.trim() : '';
  if (sk && vid) {
    const key = `${sk}::${api}::${vid}`;
    const hit = aggregatedSourceDisplayMetaMap.value && aggregatedSourceDisplayMetaMap.value.get ? aggregatedSourceDisplayMetaMap.value.get(key) : null;
    if (hit) return hit;
  }
  const siteName = fallback || sk || '站点';
  return { siteName, sourceTitle: '', sourceTitleMarked: '', siteTitleLabel: siteName };
};

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

const lockedContentKey = ref('');
const buildContentKeyBase = () => {
  const propKey = typeof props.contentKey === 'string' ? props.contentKey.trim() : '';
  if (propKey) return propKey;
  const tmdbId = Number(props.tmdbId || 0);
  const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
  if (tmdbId > 0 && (tmdbType === 'tv' || tmdbType === 'movie')) {
    return `tmdb:${tmdbType}:${Math.floor(tmdbId)}`;
  }
  const cleaned = applyAggregateCleanRules(props.videoTitle || '');
  const base = (cleaned || props.videoTitle || '').trim();
  return base;
};
const getStableContentKey = () => {
  const locked = String(lockedContentKey.value || '').trim();
  if (locked) return locked;
  return buildContentKeyBase();
};

const getSourcesSearchQuery = () => {
  if (tmdbMode.value && tmdbMovieMode.value) {
    const tmdbTitle = tmdbMeta.value && typeof tmdbMeta.value.title === 'string' ? tmdbMeta.value.title.trim() : '';
    const cleanedTMDBTitle = applyAggregateCleanRules(tmdbTitle || '');
    if (cleanedTMDBTitle) return cleanedTMDBTitle;
    if (tmdbTitle) return tmdbTitle;
  }
  try {
    const display = typeof displayTitle !== 'undefined' && displayTitle.value ? String(displayTitle.value).trim() : '';
    const cleanedDisplay = applyAggregateCleanRules(display || '');
    if (cleanedDisplay) return cleanedDisplay;
    if (display) return display;
  } catch (_e) {}
  const cleaned = applyAggregateCleanRules(props.videoTitle || '');
  if (cleaned) return cleaned;
  const fromHistory = resumeHistory.value && typeof resumeHistory.value.contentKey === 'string' ? resumeHistory.value.contentKey.trim() : '';
  if (fromHistory && !/^tmdb:/i.test(fromHistory)) return fromHistory;
  const fromProps = typeof props.contentKey === 'string' ? props.contentKey.trim() : '';
  if (fromProps && !/^tmdb:/i.test(fromProps)) return fromProps;
  return (props.videoTitle || '').trim();
};

const loadAggregatedSourcesFromStorage = () => {
  // Aggregate sources are runtime-only (no browser storage cache).
};

const SEARCH_AGG_RUNTIME_KEY = '__tvSearchAggregateState';
const SEARCH_AGG_EVENT = 'tv:search-aggregate-state';
const fromSearchEntry = computed(
  () => Number.isFinite(Number(props.openFromSearch)) && Number(props.openFromSearch) > 0
);

const readSearchAggregateState = () => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window[SEARCH_AGG_RUNTIME_KEY];
    return raw && typeof raw === 'object' ? raw : null;
  } catch (_e) {
    return null;
  }
};

const pickSearchAggregateGroup = (state) => {
  const groups = state && state.groups && typeof state.groups === 'object' ? state.groups : null;
  if (!groups) return null;
  const tryKeys = [];
  const stable = getStableContentKey();
  if (stable) tryKeys.push(stable);
  const propKey = normalizeForAggKey(props.contentKey || '');
  if (propKey && !tryKeys.includes(propKey)) tryKeys.push(propKey);
  const titleKey = normalizeForAggKey(applyAggregateCleanRules(props.videoTitle || '') || props.videoTitle || '');
  if (titleKey && !tryKeys.includes(titleKey)) tryKeys.push(titleKey);
  for (let i = 0; i < tryKeys.length; i += 1) {
    const k = tryKeys[i];
    const hit = groups[k];
    if (hit && typeof hit === 'object') return hit;
  }
  return null;
};

const applyAggregatedSourcesFromSearchState = (stateInput = null) => {
  if (!fromSearchEntry.value) return false;
  const state = stateInput && typeof stateInput === 'object' ? stateInput : readSearchAggregateState();
  if (!state || typeof state !== 'object') return false;

  const group = pickSearchAggregateGroup(state);
  const sourcesRaw = group && Array.isArray(group.sources) ? group.sources : [];
  const skipSet = smartSkipSiteKeySet.value;
  const needSkipByTMDB = !!tmdbMode.value;
  const nextSources = sourcesRaw
    .map((s) => ({
      siteKey: s && s.siteKey ? String(s.siteKey).trim() : '',
      spiderApi: s && s.spiderApi ? String(s.spiderApi).trim() : '',
      siteName: s && s.siteName ? String(s.siteName).trim() : '',
      videoId: s && s.videoId ? String(s.videoId).trim() : '',
      videoTitle: s && s.videoTitle ? String(s.videoTitle) : '',
      videoPoster: s && s.videoPoster ? String(s.videoPoster) : '',
      videoRemark: s && s.videoRemark ? String(s.videoRemark) : '',
    }))
    .filter((s) => {
      if (!needSkipByTMDB) return true;
      return !(s.siteKey && skipSet.has(s.siteKey));
    })
    .filter((s) => s.siteKey && s.spiderApi && s.videoId);

  aggregatedSources.value = nextSources;
  sourcesSearchRuntime.outUniq = new Set(nextSources.map((s) => `${s.siteKey}::${s.videoId}`));
  sourcesSearchRuntime.insertSeq = nextSources.length;
  sourcesSearchRuntime.queue = [];
  sourcesSearchRuntime.key = '';

  const totalRaw = Number(state.total);
  const doneRaw = Number(state.done);
  const total = Number.isFinite(totalRaw) && totalRaw > 0 ? Math.floor(totalRaw) : 0;
  const done = Number.isFinite(doneRaw) && doneRaw >= 0 ? Math.floor(doneRaw) : 0;
  const running = state.running === true && (total <= 0 ? true : done < total);
  sourcesSearchedOnce.value = true;
  sourcesSearchDone.value = !running;
  sourcesLoading.value = running;
  sourcesSearchRemainingCount.value = running ? Math.max(0, total - done) : 0;
  if (!running) sourcesError.value = '';
  return true;
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
  looseCandidates: [],
  looseUniq: new Set(),
};

const smartDetailWarmupState = {
  running: false,
  inFlight: 0,
  queue: [],
  seen: new Set(),
  done: new Set(),
  paused: false,
};

const smartDetailWarmupLimit = () => {
  const raw = effectiveBootstrapSettings.value && effectiveBootstrapSettings.value.searchThreadCount;
  const n = Number(raw);
  const base = Number.isFinite(n) && n > 0 ? Math.floor(n) : 5;
  return Math.max(3, Math.min(12, base * 2));
};

const isSmartDetailWarmupComplete = () => {
  try {
    const total = smartDetailWarmupState.seen.size;
    if (!total) return false;
    if (smartDetailWarmupState.queue.length) return false;
    if (smartDetailWarmupState.inFlight > 0) return false;
    return smartDetailWarmupState.done.size >= total;
  } catch (_e) {
    return false;
  }
};

const enqueueDetailWarmup = (src, reason = 'smart_search_match') => {
  if (!tmdbMode.value || tmdbMovieMode.value) return;
  if (!src || !src.siteKey || !src.spiderApi || !src.videoId) return;
  const key = smartBuildSourceKey(src);
  if (!key) return;
  const existing = tmdbSmartDetailCache.get(key) || null;
  if (existing && (existing.ok === false || (existing.episodeMap && existing.episodeMapLoose && existing.pans))) {
    smartDetailWarmupState.seen.add(key);
    smartDetailWarmupState.done.add(key);
    return;
  }
  if (smartDetailWarmupState.seen.has(key)) return;
  smartDetailWarmupState.seen.add(key);
  smartDetailWarmupState.queue.push({ src, reason });
  if (!smartDetailWarmupState.running) {
    smartDetailWarmupState.running = true;
    void (async () => {
      try {
        while (true) {
          if (smartDetailWarmupState.paused) {
            await new Promise((r) => setTimeout(r, 120));
            continue;
          }
          const limit = smartDetailWarmupLimit();
          while (smartDetailWarmupState.inFlight < limit && smartDetailWarmupState.queue.length) {
            const task = smartDetailWarmupState.queue.shift();
            if (!task || !task.src) continue;
            smartDetailWarmupState.inFlight += 1;
            Promise.resolve()
              .then(() => ensureTMDBSmartDetailCacheEntry(task.src, { reason: task.reason, module: 'smart' }))
              .catch(() => null)
              .finally(() => {
                try {
                  const k = smartBuildSourceKey(task.src);
                  if (k) smartDetailWarmupState.done.add(k);
                } catch (_e) {}
                smartDetailWarmupState.inFlight = Math.max(0, smartDetailWarmupState.inFlight - 1);
              });
          }
          if (!smartDetailWarmupState.queue.length && smartDetailWarmupState.inFlight <= 0) break;
          await new Promise((r) => setTimeout(r, 50));
        }
      } finally {
        smartDetailWarmupState.running = false;
      }
    })();
  }
};

const pauseSmartDetailWarmup = () => {
  smartDetailWarmupState.paused = true;
};

const resumeSmartDetailWarmup = () => {
  smartDetailWarmupState.paused = false;
  if (smartDetailWarmupState.queue.length && !smartDetailWarmupState.running) {
    smartDetailWarmupState.running = true;
    void (async () => {
      try {
        while (true) {
          if (smartDetailWarmupState.paused) {
            await new Promise((r) => setTimeout(r, 120));
            continue;
          }
          const limit = smartDetailWarmupLimit();
          while (smartDetailWarmupState.inFlight < limit && smartDetailWarmupState.queue.length) {
            const task = smartDetailWarmupState.queue.shift();
            if (!task || !task.src) continue;
            smartDetailWarmupState.inFlight += 1;
            Promise.resolve()
              .then(() => ensureTMDBSmartDetailCacheEntry(task.src, { reason: task.reason, module: 'smart' }))
              .catch(() => null)
              .finally(() => {
                try {
                  const k = smartBuildSourceKey(task.src);
                  if (k) smartDetailWarmupState.done.add(k);
                } catch (_e) {}
                smartDetailWarmupState.inFlight = Math.max(0, smartDetailWarmupState.inFlight - 1);
              });
          }
          if (!smartDetailWarmupState.queue.length && smartDetailWarmupState.inFlight <= 0) break;
          await new Promise((r) => setTimeout(r, 50));
        }
      } finally {
        smartDetailWarmupState.running = false;
      }
    })();
  }
};

const ensureFullSearchProgress = async ({
  untilDone = false,
  stepOnly = false,
  budgetMs = 0,
  pauseMs = 80,
} = {}) => {
  if (fromSearchEntry.value) return false;
  const startAt = Date.now();
  let progressed = false;
  while (true) {
    if (sourcesError.value) break;
    const searching = sourcesLoading.value || (!sourcesSearchDone.value && !sourcesSearchedOnce.value);
    if (!sourcesLoading.value && (!sourcesSearchDone.value || !sourcesSearchedOnce.value)) {
      const beforeQueue = sourcesSearchRuntime.queue.length;
      const beforeCount = aggregatedSources.value.length;
      try {
        await fetchAggregatedSourcesExactMatches({ append: true });
      } catch (_e) {
        break;
      }
      const afterQueue = sourcesSearchRuntime.queue.length;
      const afterCount = aggregatedSources.value.length;
      progressed = progressed || afterQueue !== beforeQueue || afterCount !== beforeCount;
      if (stepOnly) break;
      if (untilDone && !sourcesSearchDone.value) continue;
      break;
    }
    if (!searching) break;
    if (stepOnly) break;
    if (budgetMs > 0 && Date.now() - startAt >= budgetMs) break;
    await new Promise((r) => setTimeout(r, Math.max(30, Math.min(240, pauseMs))));
  }
  return progressed;
};

const kickoffFullSearchIfNeeded = ({ detailWarmup = true } = {}) => {
  if (fromSearchEntry.value) return false;
  if (sourcesLoading.value) return false;
  if (sourcesSearchDone.value && sourcesSearchedOnce.value) return false;
  void fetchAggregatedSourcesExactMatches({ append: true, detailWarmup });
  return true;
};

const runSmartCandidateLoop = async ({
  deadlineAt = 0,
  allowHistoryOnce = null,
  pickPrimary = null,
  pickAfterSearchDone = null,
  considerFallback = null,
  allowDowngradeNow = null,
  onTimeoutFallback = null,
} = {}) => {
  const hasPendingPanMock = () => {
    try {
      const entries = Array.from(tmdbSmartDetailCache.values());
      return entries.some(
        (e) => e && e.ok !== false && e.panMockEnabled === true && e.panMockResolved !== true && !!e.panMockInFlight
      );
    } catch (_e) {
      return false;
    }
  };
  const pickPrimaryFn = typeof pickPrimary === 'function' ? pickPrimary : null;
  const pickAfterFn = typeof pickAfterSearchDone === 'function' ? pickAfterSearchDone : null;
  const considerFn = typeof considerFallback === 'function' ? considerFallback : null;
  const allowDowngradeFn = typeof allowDowngradeNow === 'function' ? allowDowngradeNow : null;
  const onTimeoutFn = typeof onTimeoutFallback === 'function' ? onTimeoutFallback : null;
  const computeDetailProgress = () => {
    try {
      const sources = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
      const total = sources.length;
      let done = 0;
      const pendingList = [];
      sources.forEach((src) => {
        const key = smartBuildSourceKey(src);
        if (!key) return;
        const entry = tmdbSmartDetailCache.get(key) || null;
        const inFlight = tmdbSmartDetailInFlight.has(key);
        const completed = !!(
          entry &&
          (entry.ok === false ||
            (entry.__detailFetched === true &&
              (!entry.panMockEnabled || entry.panMockResolved === true)))
        );
        if (completed) {
          done += 1;
          return;
        }
        if (!completed && !inFlight) {
          // not requested yet
        }
        const name =
          (src && src.siteName ? String(src.siteName) : '') ||
          (src && src.siteKey ? String(src.siteKey) : '') ||
          '';
        const vid = src && src.videoId != null ? String(src.videoId) : '';
        pendingList.push(`${name || src.siteKey || 'site'}${vid ? `:${vid}` : ''}`);
      });
      const pending = Math.max(0, total - done);
      return { total, done, pending, pendingList };
    } catch (_e) {
      return { total: 0, done: 0, pending: 0, pendingList: [] };
    }
  };
  for (let round = 0; round < 200; round += 1) {
    if (round === 0) {
      runSmartCandidateLoop.__lastDetailProgressSig = '';
      runSmartCandidateLoop.__lastDetailDoneCount = -1;
    }
    if (deadlineAt && Date.now() >= deadlineAt) {
      return onTimeoutFn ? onTimeoutFn() : null;
    }
    if (round === 0 && allowHistoryOnce) {
      const early = await allowHistoryOnce();
      if (early && early.ep && early.ep.url) return early;
    }
    if (
      (!aggregatedSources.value || !aggregatedSources.value.length) &&
      !sourcesSearchDone.value &&
      !fromSearchEntry.value
    ) {
      kickoffFullSearchIfNeeded({ detailWarmup: true });
      await new Promise((r) => setTimeout(r, 120));
      continue;
    }
  const detailDone = isSmartDetailWarmupComplete();
  if (debugEnabled.value) {
    const prog = computeDetailProgress();
    const sig = `${prog.done}/${prog.total}`;
    const lastDone = Number.isFinite(Number(runSmartCandidateLoop.__lastDetailDoneCount))
      ? Number(runSmartCandidateLoop.__lastDetailDoneCount)
      : -1;
    if (prog.done > lastDone || (prog.done === prog.total && lastDone !== prog.total)) {
      runSmartCandidateLoop.__lastDetailProgressSig = sig;
      runSmartCandidateLoop.__lastDetailDoneCount = prog.done;
      try {
        const payload = {
          module: 'smart',
          total: prog.total,
          done: prog.done,
          pending: prog.pending,
        };
        if (prog.pending <= 5) payload.pendingSites = prog.pendingList.join(',') || '';
        else if (prog.pending > 5) payload.pendingSites = prog.pendingList.slice(0, 5).join(',') || '';
        smartDebugLog('smart_detail_done', payload);
      } catch (_e) {}
    }
  }
    if (pickPrimaryFn) {
      const res = await pickPrimaryFn({ detailDone });
      if (res && res.cand && res.cand.ep && res.cand.ep.url) {
        if (res.stop) {
          if (debugEnabled.value) {
            try {
              smartDebugLog('smart_match_done', { module: 'smart', reason: 'primary_stop' });
            } catch (_e) {}
          }
          return res.cand;
        }
        if (considerFn) considerFn(res.cand);
      }
    }
    if (sourcesSearchDone.value) {
      if (!detailDone && !isSmartDetailWarmupComplete()) {
        await new Promise((r) => setTimeout(r, 120));
        continue;
      }
      if (hasPendingPanMock()) {
        await waitForAnyPanMockUpdate(320);
        continue;
      }
      if (pickAfterFn) {
        const res = await pickAfterFn({ detailDone });
        if (res && res.cand && res.cand.ep && res.cand.ep.url) {
          if (res.stop) {
            if (debugEnabled.value) {
              try {
                smartDebugLog('smart_match_done', { module: 'smart', reason: 'after_done_stop' });
              } catch (_e) {}
            }
            return res.cand;
          }
          if (considerFn) considerFn(res.cand);
        }
      }
      releaseLowPriorityHold();
      if (allowDowngradeFn && allowDowngradeFn()) {
        if (debugEnabled.value) {
          try {
            smartDebugLog('smart_match_done', { module: 'smart', reason: 'downgrade' });
          } catch (_e) {}
        }
        return onTimeoutFn ? onTimeoutFn() : null;
      }
      return null;
    }
    const progressed = await ensureFullSearchProgress({ stepOnly: true, pauseMs: 120 });
    if (!progressed) {
      const waited = await waitForAnyPanMockUpdate(320);
      if (!waited) await new Promise((r) => setTimeout(r, 120));
    }
  }
  releaseLowPriorityHold();
  return onTimeoutFn ? onTimeoutFn() : null;
};

const runSmartPickPipeline = async ({
  candidates,
  fetchPick,
  poolSize = 5,
  perSiteSerial = true,
  returnOnFirstHit = false,
  stopWhen = null,
  compareBest = null,
} = {}) => {
  const list = Array.isArray(candidates) ? candidates : [];
  if (!list.length) return null;
  const sizeRaw = Number(poolSize);
  const pool = Number.isFinite(sizeRaw) && sizeRaw > 0 ? Math.max(1, Math.floor(sizeRaw)) : 1;
  const inFlight = new Map();
  const busySites = new Set();
  const pending = list.map((_c, idx) => idx);
  let bestOverall = null;

  const launch = (idx) => {
    const src = list[idx];
    const sKey = src && src.siteKey != null ? String(src.siteKey) : '';
    if (perSiteSerial && sKey) busySites.add(sKey);
    const p = Promise.resolve()
      .then(() => fetchPick(src))
      .then((value) => ({ idx, value: value || null }))
      .catch(() => ({ idx, value: null }));
    inFlight.set(idx, p);
  };

  const tryLaunchMore = () => {
    while (inFlight.size < pool) {
      let launched = false;
      for (let i = 0; i < pending.length; i += 1) {
        const idx = pending[i];
        const src = list[idx];
        const sKey = src && src.siteKey != null ? String(src.siteKey) : '';
        if (perSiteSerial && sKey && busySites.has(sKey)) continue;
        pending.splice(i, 1);
        launch(idx);
        launched = true;
        break;
      }
      if (!launched) break;
    }
  };

  while (inFlight.size || pending.length) {
    tryLaunchMore();
    if (!inFlight.size) break;
    const settled = await Promise.race(Array.from(inFlight.values()));
    const idx = settled && Number.isFinite(Number(settled.idx)) ? Number(settled.idx) : -1;
    if (idx >= 0) {
      const src = list[idx];
      const sKey = src && src.siteKey != null ? String(src.siteKey) : '';
      if (perSiteSerial && sKey) busySites.delete(sKey);
      inFlight.delete(idx);
    }

    const hit = settled && settled.value ? settled.value : null;
    if (hit) {
      if (!bestOverall) bestOverall = hit;
      else if (typeof compareBest === 'function' && compareBest(bestOverall, hit) > 0) bestOverall = hit;
      if (typeof stopWhen === 'function' && stopWhen(hit)) return hit;
      if (returnOnFirstHit) return hit;
    }
  }
  return bestOverall;
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

const invalidateSourcesSearch = (reason = '') => {
  sourcesSearchState.seq += 1;
  sourcesLoading.value = false;
  sourcesSearchDone.value = false;
  sourcesSearchRemainingCount.value = 0;
  aggregatedSources.value = [];
  sourcesSearchRuntime.key = '';
  sourcesSearchRuntime.queue = [];
  sourcesSearchRuntime.outUniq = new Set();
  sourcesSearchRuntime.insertSeq = 0;
  sourcesSearchRuntime.looseCandidates = [];
  sourcesSearchRuntime.looseUniq = new Set();
  smartDetailWarmupState.running = false;
  smartDetailWarmupState.inFlight = 0;
  smartDetailWarmupState.queue = [];
  smartDetailWarmupState.seen = new Set();
  smartDetailWarmupState.done = new Set();
  if (debugEnabled.value) {
    try {
      smartDebugLog('smart_search_reset', {
        module: 'smart',
        reason: String(reason || ''),
        searchSeq: sourcesSearchState.seq,
      });
    } catch (_e) {}
  }
};

const fetchUserSitesCached = async (ttlMs = 15 * 1000) => {
  const data = await apiGetJson('/api/user/sites', { cacheMs: ttlMs });
  return data && typeof data === 'object' ? data : {};
};

const resolveCatApiBaseForPlay = () => {
  const s = effectiveBootstrapSettings.value || {};
  const serverBase = s.catpawrunnerApiBase || '';
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

const smartSkipSiteKeySet = computed(() => {
  const raw = effectiveBootstrapSettings.value ? effectiveBootstrapSettings.value.smartSkipSiteKeys : null;
  const list = Array.isArray(raw) ? raw : [];
  return new Set(
    list
      .map((k) => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean)
  );
});

const fetchAggregatedSourcesExactMatches = async (opts = {}) => {
  if (fromSearchEntry.value) return;
  if (sourcesLoading.value) return;
  const appendMode = !!(opts && typeof opts === 'object' && opts.append === true);
  const detailWarmupEnabled = !(opts && typeof opts === 'object' && opts.detailWarmup === false);
  const qRaw = getSourcesSearchQuery();
  const isTMDBMovieSourceMatchMode = !!(tmdbMode.value && tmdbMovieMode.value);
  const qBase = applyAggregateCleanRules(qRaw || '') || qRaw;
  const qKey = normalizeForAggKey(qBase);
  if (debugEnabled.value) {
    try {
      const queryLoose = stripSeasonMarkers(qRaw || '');
      const queryKeyLoose = normalizeForAggKey(queryLoose || '');
      smartDebugLog('smart_search_query', {
        module: 'smart',
        query: qRaw || '',
        queryKey: qKey || '',
        queryLoose: queryLoose || '',
        queryKeyLoose: queryKeyLoose || '',
        runtimeKey: `${qKey || ''}::${qRaw || ''}`,
        searchSeq: sourcesSearchState.seq,
        fromHistory: resumeHistory.value && typeof resumeHistory.value.contentKey === 'string' ? resumeHistory.value.contentKey.trim() : '',
        fromProps: typeof props.contentKey === 'string' ? props.contentKey.trim() : '',
      });
    } catch (_e) {}
  }
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
  const movieQueryKey = normalizeForAggKey(qBase || '');
  const movieTitleMatchedBySearchResult = (title) => {
    const rawTitle = typeof title === 'string' ? title : String(title || '');
    if (!rawTitle || !movieQueryKey) return false;
    const cleanedTitle = applyAggregateCleanRules(rawTitle) || rawTitle;
    const titleKey = normalizeForAggKey(cleanedTitle);
    if (!titleKey) return false;
    return titleKey === movieQueryKey || titleKey.startsWith(movieQueryKey) || movieQueryKey.startsWith(titleKey);
  };
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

  const insertAgg = (entry) => {
    insertAggSorted(entry);
    if (debugEnabled.value) {
      try {
        smartDebugLog('smart_search_add', {
          module: 'smart',
          siteKey: entry && entry.siteKey ? String(entry.siteKey) : '',
          spiderApi: entry && entry.spiderApi ? String(entry.spiderApi) : '',
          videoId: entry && entry.videoId ? String(entry.videoId) : '',
          total: Array.isArray(aggregatedSources.value) ? aggregatedSources.value.length : 0,
          runtimeKey: sourcesSearchRuntime && sourcesSearchRuntime.key ? String(sourcesSearchRuntime.key) : '',
          searchSeq: sourcesSearchState.seq,
        });
      } catch (_e) {}
    }
  };

  sourcesSearchState.seq += 1;
  const seqAtCall = sourcesSearchState.seq;

  sourcesLoading.value = true;
  sourcesError.value = '';
  const runtimeKey = `${qKey}::${qRaw}`;
  const isNew = sourcesSearchRuntime.key !== runtimeKey;
  if (isNew) {
    const preserveVisibleInTMDBMovie =
      isTMDBMovieSourceMatchMode && Array.isArray(aggregatedSources.value) && aggregatedSources.value.length > 0;
    sourcesSearchRuntime.key = runtimeKey;
    sourcesSearchRuntime.queue = [];
    if (preserveVisibleInTMDBMovie) {
      const uniq = new Set();
      let maxSeq = 0;
      (Array.isArray(aggregatedSources.value) ? aggregatedSources.value : []).forEach((s) => {
        const sk = s && s.siteKey ? String(s.siteKey) : '';
        const vid = s && s.videoId ? String(s.videoId) : '';
        if (sk && vid) uniq.add(`${sk}::${vid}`);
        const seq = Number(s && s.__seq);
        if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq;
      });
      sourcesSearchRuntime.outUniq = uniq;
      sourcesSearchRuntime.insertSeq = maxSeq;
      sourcesSearchRuntime.looseCandidates = [];
      sourcesSearchRuntime.looseUniq = new Set();
    } else {
      sourcesSearchRuntime.outUniq = new Set();
      sourcesSearchRuntime.insertSeq = 0;
      sourcesSearchRuntime.looseCandidates = [];
      sourcesSearchRuntime.looseUniq = new Set();
      aggregatedSources.value = [];
    }
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
    const skipSet = smartSkipSiteKeySet.value;
    const enableSmartSkipForThisSearch = !!tmdbMode.value;
    const enabledSites = sites.filter((s) => {
      if (!s || s.enabled === false || s.search === false || !s.api || isConfigCenterSite(s)) return false;
      const k = s && typeof s.key === 'string' ? s.key.trim() : '';
      if (enableSmartSkipForThisSearch && k && skipSet.has(k)) return false;
      return true;
    });

    const apiBase = resolveCatApiBaseForPlay();
    const tvUser = props.bootstrap?.user?.username || '';
    if (!apiBase) throw new Error('catpawrunner 接口地址未设置');

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
          timeoutMs: 10_000,
        });
        if (seqAtCall !== sourcesSearchState.seq) return;
        const items = normalizeSearchList(raw);
        let pushed = false;
        let matchedCount = 0;
        items.forEach((it) => {
          if (seqAtCall !== sourcesSearchState.seq) return;
          const rawTitle = it && it.name ? String(it.name) : '';
          const cleanedTitle = applyAggregateCleanRules(rawTitle || '') || rawTitle;
          const key = normalizeForAggKey(cleanedTitle);
          const looseKey = normalizeForAggKey(stripSeasonMarkers(cleanedTitle));
          const okKey = isTMDBMovieSourceMatchMode
            ? movieTitleMatchedBySearchResult(rawTitle)
            : ((key && key === qKey) || (qKeyLoose && looseKey && looseKey === qKeyLoose));
          const score = computeMatchScore(rawTitle);
          if (!okKey) {
            // Keep a small loose-match pool for fallback when no exact match is found.
            if (score >= 650) {
              const siteKey = site && site.key ? String(site.key) : '';
              const spiderApi = site && site.api ? String(site.api) : '';
              const videoId = it && it.id ? String(it.id) : '';
              if (siteKey && spiderApi && videoId) {
                const uniq = `${siteKey}::${videoId}`;
                if (!sourcesSearchRuntime.looseUniq.has(uniq)) {
                  sourcesSearchRuntime.looseUniq.add(uniq);
                  const seasonHint =
                    extractSeasonHintFromText(rawTitle) ||
                    extractSeasonHintFromText(it && it.remark ? String(it.remark) : '') ||
                    0;
                  const seasonTitleMatch = wantedSeason > 0 && seasonHint === wantedSeason ? 1 : 0;
                  sourcesSearchRuntime.looseCandidates.push({
                    siteKey,
                    spiderApi,
                    siteName: site && site.name ? String(site.name) : siteKey,
                    videoId,
                    videoTitle: rawTitle,
                    videoPoster: it && it.pic ? String(it.pic) : '',
                    videoRemark: it && it.remark ? String(it.remark) : '',
                    __noNoiseMatch: false,
                    __score: Number.isFinite(Number(score)) ? Number(score) : 0,
                    __seq: (sourcesSearchRuntime.insertSeq += 1),
                    seasonHint,
                    __seasonTitleMatch: seasonTitleMatch,
                    __looseMatch: 1,
                  });
                }
              }
            }
            return;
          }
          matchedCount += 1;
          const noNoiseExact = normalizeForAggKey(rawTitle) === qKey;
          const noNoiseLoose = qKeyLoose && normalizeForAggKey(stripSeasonMarkers(rawTitle)) === qKeyLoose;
          const noNoiseMatch = !!(noNoiseExact || noNoiseLoose);
          // score already computed above
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
          if (detailWarmupEnabled) enqueueDetailWarmup(entry, 'smart_search_match');
          pushed = true;
        });
        if (debugEnabled.value && !isTMDBMovieSourceMatchMode) {
          smartDebugLog('smart_search_site', {
            module: 'smart',
            siteKey: site && site.key ? String(site.key) : '',
            siteName: site && site.name ? String(site.name) : '',
            total: items.length,
            matched: matchedCount,
          });
        }
        if (isTMDBMovieSourceMatchMode) {
          smartDebugLog('movie_search_filter', {
            siteKey: site && site.key ? String(site.key) : '',
            siteName: site && site.name ? String(site.name) : '',
            total: items.length,
            matched: matchedCount,
            query: qRaw,
            queryKey: movieQueryKey,
          });
        }
        if (pushed && seqAtCall === sourcesSearchState.seq) await yieldToUi();
	      } catch (_e) {
	      }
	    };

    await Promise.allSettled(batch.map(runOne));
    if (seqAtCall !== sourcesSearchState.seq) return;
    sourcesSearchedOnce.value = true;
    sourcesSearchDone.value = sourcesSearchRuntime.queue.length === 0;
    sourcesSearchRemainingCount.value = sourcesSearchRuntime.queue.length;
    if (debugEnabled.value && sourcesSearchDone.value) {
      try {
        smartDebugLog('smart_search_done', {
          module: 'smart',
          total: Array.isArray(aggregatedSources.value) ? aggregatedSources.value.length : 0,
          queue: sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0,
          searchSeq: sourcesSearchState.seq,
        });
      } catch (_e) {}
    }
    if (
      sourcesSearchDone.value &&
      (!aggregatedSources.value || !aggregatedSources.value.length) &&
      Array.isArray(sourcesSearchRuntime.looseCandidates) &&
      sourcesSearchRuntime.looseCandidates.length
    ) {
      const loose = sourcesSearchRuntime.looseCandidates.slice();
      loose.sort((a, b) => {
        const as = Number(a && a.__score) || 0;
        const bs = Number(b && b.__score) || 0;
        if (as !== bs) return bs - as;
        return (a.siteName || a.siteKey || '').localeCompare(b.siteName || b.siteKey || '', 'zh');
      });
      const top = loose.slice(0, 12);
      top.forEach((entry) => {
        insertAgg(entry);
        if (detailWarmupEnabled) enqueueDetailWarmup(entry, 'smart_search_fallback');
      });
      sourcesSearchRuntime.looseCandidates = [];
      sourcesSearchRuntime.looseUniq = new Set();
      if (debugEnabled.value) {
        smartDebugLog('smart_search_fallback', {
          module: 'smart',
          count: top.length,
        });
      }
    }

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
    currentPlayingEpisodeUrl.value = '';
    currentPlayingEpisodeRawName.value = '';
    currentPlayingEpisodeMatchKey.value = '';
    currentPlaybackResumeIdentity.value = '';
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
  currentPlayingEpisodeUrl.value = '';
  currentPlayingEpisodeRawName.value = '';
  currentPlayingEpisodeMatchKey.value = '';
  currentPlaybackResumeIdentity.value = '';
  selectedPan.value = '';
  panDropdownOpen.value = false;
  setEpisodeIndex(-1, 'resetForNewVideo');
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
    panMockEnabled: false,
    panMockResolving: false,
    panMockResolved: false,
    panMockResolvedByKey: {},
    panMockListErrors: {},
    panMock189AccessByShareId: {},
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
  currentPlayingEpisodeUrl.value = '';
  currentPlayingEpisodeRawName.value = '';
  currentPlayingEpisodeMatchKey.value = '';
  currentPlaybackResumeIdentity.value = '';
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
    panMockEnabled: false,
    panMockResolving: false,
    panMockResolved: false,
    panMockResolvedByKey: {},
    panMockListErrors: {},
    panMock189AccessByShareId: {},
  };
};

const resetEpisodeListForSourceSwitch = () => {
  selectedPan.value = '';
  panDropdownOpen.value = false;
  selectedEpisodeGroup.value = '';
  selectedSeason.value = 0;
  setEpisodeIndex(-1, 'resetEpisodeListForSourceSwitch');
  episodeGroupMoreOpen.value = false;
  introLoading.value = false;
  introError.value = '';
  autoPickedEpisodeFromVideoId.value = false;
  detail.value = {
    ...detail.value,
    playFrom: '',
    playUrl: '',
    panMockEnabled: false,
    panMockResolving: false,
    panMockResolved: false,
    panMockResolvedByKey: {},
    panMockListErrors: {},
    panMock189AccessByShareId: {},
  };
};

const cleanupFns = [];

onMounted(() => {
  try {
    if (typeof window === 'undefined') return;
    const onSearchAggregateState = (e) => {
      if (!fromSearchEntry.value) return;
      const state = e && e.detail && e.detail.state && typeof e.detail.state === 'object' ? e.detail.state : null;
      applyAggregatedSourcesFromSearchState(state);
    };
    window.addEventListener(SEARCH_AGG_EVENT, onSearchAggregateState);
    cleanupFns.push(() => window.removeEventListener(SEARCH_AGG_EVENT, onSearchAggregateState));
    applyAggregatedSourcesFromSearchState();
  } catch (_e) {}
});

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
const episodeButtonsEl = ref(null);
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
const selectedEpisodeIndexRef = ref(-1);
const setEpisodeIndex = (next, reason = '') => {
  const prev = selectedEpisodeIndexRef.value;
  selectedEpisodeIndexRef.value = next;
  if (debugEnabled.value) {
    try {
      playDebugLog('setEpisodeIndex', {
        prev,
        next,
        reason: String(reason || ''),
        panKey: String(selectedPanKey.value || ''),
      });
    } catch (_e) {}
  }
};
const selectedEpisodeIndex = computed({
  get() {
    return selectedEpisodeIndexRef.value;
  },
  set(next) {
    setEpisodeIndex(next, 'setter');
  },
});
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
const playingSmartEpisodeNo = ref(0);
const playingTMDBSubPanKey = ref('');
const currentPlayingEpisodeUrl = ref('');
const currentPlayingEpisodeRawName = ref('');
const currentPlayingEpisodeMatchKey = ref('');
const currentPlaybackResumeIdentity = ref('');
const initialAutoPlayTriggered = ref(false);
const initialAutoPlayInFlight = ref(false);
let autoSourceFallbackSeq = 0;
const autoSourceFallbackTried = new Set();
const autoFallbackActive = ref(false);
const selectedPan = ref('');
const panDropdownOpen = ref(false);
const panDropdownEl = ref(null);
const siteSourceDropdownOpen = ref(false);
const siteSourceDropdownEl = ref(null);
	const tmdbPanDropdownOpen = ref(false);
	const tmdbPanDropdownEl = ref(null);
	const tmdbSelectedSitePanKey = ref('');
	const resumeHistory = ref(null);
	const resumeHistoryLoaded = ref(false);
  const resumeHistoryApplied = ref(false);
  // null = unknown (history loading), true = found, false = not found
  const resumeHistoryFound = ref(null);
  const resumeWanted = ref(null); // { season, episode, indexFallback, playbackItemId, updatedAt }
  const resumeAppliedEpisodeCount = ref(0);
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
  panMockEnabled: false,
  panMockResolving: false,
  panMockResolved: false,
  panMockResolvedByKey: {},
  panMockListErrors: {},
  panMock189AccessByShareId: {},
});

// pan_mock is returned by catpawrunner detail; in TMDB smart flows we might not populate `detail`,
// so keep a lightweight hint/cache for pan_mock state and Tianyi access codes.
const panMockEnabledHint = ref(false);
const panMock189AccessByShareIdHint = ref({});

const readPanMockEnabledFromRaw = (raw) => {
  try {
    if (!raw || typeof raw !== 'object') return false;
    if (raw.pan_mock != null) return !!raw.pan_mock;
    if (raw.panMock != null) return !!raw.panMock;
    const d = raw.data && typeof raw.data === 'object' ? raw.data : null;
    if (d) {
      if (d.pan_mock != null) return !!d.pan_mock;
      if (d.panMock != null) return !!d.panMock;
    }
    return false;
  } catch (_e) {
    return false;
  }
};

		const tmdbMeta = ref(null);
		const doubanSeasonMeta = ref(null);
			const tmdbMovieSmartEpisodes = ref([]);
			const tmdbMovieSmartFetchState = { key: '', seq: 0, inFlight: null };
			const tmdbMovieSmartResolving = ref(false);

			const computeTMDBSeasonsSignatureForCache = () => {
			  try {
			    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
			    return seasons
			      .filter((it) => it && Number.isFinite(Number(it.season)) && Number(it.season) > 0)
			      .map((it) => `${Math.floor(Number(it.season))}:${Math.floor(Number(it.episodeCount || 0))}`)
			      .join('|');
			  } catch (_e) {
			    return '';
			  }
			};

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
			      tmdbSig: typeof parsed.tmdbSig === 'string' ? parsed.tmdbSig : '',
			      seasonCount: Number.isFinite(Number(parsed.seasonCount)) ? Math.floor(Number(parsed.seasonCount)) : 0,
			      seasons: seasons
			        .map((s) => ({
			          season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
		          episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
		          doubanId: s && s.doubanId != null ? String(s.doubanId) : '',
		          title: s && s.title != null ? String(s.title) : '',
		          aliases: Array.isArray(s && s.aliases) ? s.aliases.map((x) => (x != null ? String(x) : '')).filter(Boolean) : [],
		          hints: s && typeof s.hints === 'object' && s.hints ? s.hints : null,
		          airDate: s && typeof s.airDate === 'string' ? String(s.airDate).trim() : '',
		          displayLabel: s && typeof s.displayLabel === 'string' ? String(s.displayLabel).trim() : '',
		        }))
			        .filter((s) => s.season > 0 && s.episodeCount > 0),
			      updatedAt: Number.isFinite(Number(parsed.updatedAt)) ? Number(parsed.updatedAt) : 0,
			    };
			    if (!out.seasonCount) out.seasonCount = out.seasons.length;
			    if (out.seasonCount < 1 || out.seasons.length < 1) return null;
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

	const DOUBAN_SEASON_META_TTL_MS = 7 * 24 * 60 * 60 * 1000;
	const doubanSeasonFetchState = { key: '', seq: 0, inFlight: null };

	const parseChineseNumberLoosely = (s) => {
	  const raw = typeof s === 'string' ? s.trim() : '';
	  if (!raw) return 0;
	  const norm = raw.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
	  if (/^\d{1,3}$/.test(norm)) {
	    const n = Number.parseInt(norm, 10);
	    return Number.isFinite(n) && n > 0 && n <= 999 ? n : 0;
	  }
	  const map = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
	  if (norm === '十') return 10;
	  if (norm.includes('十')) {
	    const parts = norm.split('十');
	    const tens = parts[0] ? (map[parts[0]] > 0 ? map[parts[0]] : 1) : 1;
	    const ones = parts[1] ? (map[parts[1]] >= 0 ? map[parts[1]] : 0) : 0;
	    const n = tens * 10 + ones;
	    return n > 0 && n <= 999 ? n : 0;
	  }
	  if (Array.from(norm).length === 1) {
	    const v = map[norm];
	    return Number.isFinite(v) && v > 0 && v <= 999 ? v : 0;
	  }
	  return 0;
	};

		const extractEpisodeRangeHint = (text) => {
		  const s = typeof text === 'string' ? text.trim() : '';
		  if (!s) return null;
	  const m = s.match(/第\s*(\d{1,5})\s*[-—~～]\s*(\d{1,5})\s*集/);
	  if (!m || !m[1] || !m[2]) return null;
	  const a = Number.parseInt(String(m[1]), 10);
	  const b = Number.parseInt(String(m[2]), 10);
	  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return null;
	  const start = Math.min(a, b);
	  const end = Math.max(a, b);
	  if (end - start > 50000) return null;
	  return { start, end };
	};

	const parseEarliestDateLike = (v) => {
	  const pick = (s) => {
	    const t = typeof s === 'string' ? s.trim() : '';
	    if (!t) return '';
	    const m = t.match(/(\d{4})-(\d{2})-(\d{2})/);
	    if (!m) return '';
	    return `${m[1]}-${m[2]}-${m[3]}`;
	  };
	  if (typeof v === 'string') return pick(v);
	  if (Array.isArray(v)) {
	    const dates = v.map((x) => pick(x)).filter(Boolean).sort();
	    return dates[0] || '';
	  }
	  if (v && typeof v === 'object') {
	    const dates = Object.values(v).map((x) => pick(x)).filter(Boolean).sort();
	    return dates[0] || '';
	  }
	  return '';
	};

	const extractDoubanAliasesFromDetail = (detail) => {
	  const d = detail && typeof detail === 'object' ? detail : null;
	  if (!d) return [];
	  const out = [];
	  const push = (v) => {
	    const s = typeof v === 'string' ? v.trim() : '';
	    if (s) out.push(s);
	  };
	  const pushList = (v) => {
	    if (!Array.isArray(v)) return;
	    v.forEach((x) => push(x));
	  };
	  pushList(d.aka);
	  pushList(d.aliases);
	  pushList(d.also_known_as);
	  pushList(d.alsoKnownAs);
	  pushList(d.alternate_titles);
	  pushList(d.alternateTitles);
	  pushList(d.original_title ? [d.original_title] : []);
	  pushList(d.originalTitle ? [d.originalTitle] : []);
	  if (typeof d.card_subtitle === 'string') push(d.card_subtitle);
	  if (typeof d.cardSubtitle === 'string') push(d.cardSubtitle);
	  if (typeof d.title === 'string') push(d.title);
	  if (typeof d.name === 'string') push(d.name);
	  if (typeof d.original_name === 'string') push(d.original_name);
	  if (typeof d.originalName === 'string') push(d.originalName);
	  const uniq = [];
	  const seen = new Set();
	  out.forEach((s) => {
	    const k = s.toLowerCase();
	    if (!k || seen.has(k)) return;
	    seen.add(k);
	    uniq.push(s);
	  });
	  return uniq;
	};

	const extractDoubanAirDateFromDetail = (detail) => {
	  const d = detail && typeof detail === 'object' ? detail : null;
	  if (!d) return '';
	  const candidates = [
	    d.pubdate,
	    d.pub_date,
	    d.release_date,
	    d.releaseDate,
	    d.premiere_date,
	    d.premiereDate,
	    d.first_air_date,
	    d.firstAirDate,
	    d.air_date,
	    d.airDate,
	    d.date,
	    d.year,
	  ];
	  for (let i = 0; i < candidates.length; i += 1) {
	    const hit = parseEarliestDateLike(candidates[i]);
	    if (hit) return hit;
	  }
	  return '';
	};

	const parseDoubanMarkerFromTexts = (texts) => {
	  const list = Array.isArray(texts) ? texts : [];
	  const scan = (mode) => {
	    for (let i = 0; i < list.length; i += 1) {
	      const s = typeof list[i] === 'string' ? list[i].trim() : '';
	      if (!s) continue;
	      if (mode === 'season') {
	        const mSeason = s.match(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})\s*季/);
	        if (mSeason && mSeason[1]) {
	          const n = parseChineseNumberLoosely(mSeason[1]);
	          if (n > 0) return { kind: 'season', index: n };
	        }
	      } else if (mode === 'yearbang') {
	        const mYear = s.match(/年番\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})/);
	        if (mYear && mYear[1]) {
	          const n = parseChineseNumberLoosely(mYear[1]);
	          if (n > 0) return { kind: 'yearbang', index: n };
	        }
	      }
	    }
	    return null;
	  };
	  // Prefer explicit "第X季" when present anywhere; otherwise fall back to "年番X".
	  return scan('season') || scan('yearbang') || { kind: '', index: 0 };
	};

	const computeDoubanDisplayAndMarker = (displayTitle, aliases) => {
	  const displayLabel = typeof displayTitle === 'string' ? displayTitle.trim() : '';
	  const a = Array.isArray(aliases) ? aliases : [];
	  const fromTitle = parseDoubanMarkerFromTexts(displayLabel ? [displayLabel] : []);
	  if (fromTitle && fromTitle.kind && fromTitle.index > 0) return { displayLabel, markerKind: fromTitle.kind, markerIndex: fromTitle.index };
	  const fromAliases = parseDoubanMarkerFromTexts(a);
	  return { displayLabel, markerKind: fromAliases.kind || '', markerIndex: fromAliases.index || 0 };
	};

	const fetchDoubanSeasonMetaFromDouban = async ({ keyword = '', maxSeasons = 10 } = {}) => {
	  const q = typeof keyword === 'string' ? keyword.trim() : '';
	  if (!q) return null;
	  const data = await apiGetJson(
	    `/api/douban/rexxar/api/v2/search${buildQuery({ q, type: 'tv', start: 0, count: 20 })}`,
	    { timeoutMs: 12000 }
	  );

		  const subjects = Array.isArray(data?.subjects?.items) ? data.subjects.items : [];
			  const smartBox = Array.isArray(data?.smart_box) ? data.smart_box : [];
			  const items = [];
			  const push = (it) => {
			    const typ = it && it.target_type != null ? String(it.target_type).trim() : '';
			    if (typ !== 'tv') return;
			    const title = it && it.target && it.target.title != null ? String(it.target.title).trim() : '';
			    if (!title) return;
			    const yearRaw = it && it.target && it.target.year != null ? it.target.year : '';
			    const year = yearRaw != null ? String(yearRaw).trim() : '';
			    const subtitle =
			      it && it.target
			        ? (it.target.card_subtitle != null
			            ? String(it.target.card_subtitle)
			            : it.target.cardSubtitle != null
			              ? String(it.target.cardSubtitle)
			              : it.target.subtitle != null
			                ? String(it.target.subtitle)
			                : it.target.sub_title != null
			                  ? String(it.target.sub_title)
			                  : '')
			        : '';
			    const nullRatingReason =
			      it && it.target
			        ? (it.target.null_rating_reason != null
			            ? String(it.target.null_rating_reason)
			            : it.target.nullRatingReason != null
			              ? String(it.target.nullRatingReason)
			              : '')
			        : '';
			    const isReleasedRaw =
			      it && it.target
			        ? (it.target.is_released != null
			            ? it.target.is_released
			            : it.target.isReleased != null
			              ? it.target.isReleased
			              : null)
			        : null;
			    const isReleased = typeof isReleasedRaw === 'boolean' ? isReleasedRaw : null;
			    const canRateRaw =
			      it && it.target
			        ? (it.target.can_rate != null
			            ? it.target.can_rate
			            : it.target.canRate != null
			              ? it.target.canRate
			              : null)
			        : null;
			    const canRate = typeof canRateRaw === 'boolean' ? canRateRaw : null;
			    const vendorCountRaw =
			      it && it.target
			        ? (it.target.vendor_count != null
			            ? it.target.vendor_count
			            : it.target.vendorCount != null
			              ? it.target.vendorCount
			              : null)
			        : null;
			    const vendorCountNum = Number.parseInt(String(vendorCountRaw ?? ''), 10);
			    const vendorCount = Number.isFinite(vendorCountNum) ? vendorCountNum : 0;
			    const pubdateRaw =
			      it && it.target
			        ? (it.target.pubdate != null
			            ? it.target.pubdate
			            : it.target.pubDate != null
			              ? it.target.pubDate
			              : null)
			        : null;
			    const pubdate = Array.isArray(pubdateRaw) ? pubdateRaw.map((x) => String(x || '').trim()).filter(Boolean) : [];
			    const id =
			      it && it.target && it.target.id != null
			        ? String(it.target.id).trim()
			        : it && it.target_id != null
			          ? String(it.target_id).trim()
			          : '';
			    if (!id) return;
			    items.push({
			      doubanId: id,
			      title,
			      year,
			      subtitle: subtitle ? subtitle.trim() : '',
			      nullRatingReason: nullRatingReason ? nullRatingReason.trim() : '',
			      isReleased,
			      canRate,
			      vendorCount,
			      pubdate,
			    });
			  };
		  subjects.forEach(push);
		  smartBox.forEach(push);
		  if (items.length < 1) return null;

	  const uniqItems = (() => {
	    const out = [];
	    const seen = new Set();
	    items.forEach((it) => {
		      const id = it && it.doubanId != null ? String(it.doubanId).trim() : '';
		      if (!id || seen.has(id)) return;
		      seen.add(id);
			      out.push({
			        doubanId: id,
			        title: it && it.title != null ? String(it.title) : '',
			        year: it && it.year != null ? String(it.year).trim() : '',
			        subtitle: it && it.subtitle != null ? String(it.subtitle) : '',
			        nullRatingReason: it && it.nullRatingReason != null ? String(it.nullRatingReason) : '',
			        isReleased: typeof it?.isReleased === 'boolean' ? it.isReleased : null,
			        canRate: typeof it?.canRate === 'boolean' ? it.canRate : null,
			        vendorCount: Number.isFinite(Number(it?.vendorCount)) ? Number(it.vendorCount) : 0,
			        pubdate: Array.isArray(it?.pubdate) ? it.pubdate.map((x) => String(x || '').trim()).filter(Boolean) : [],
			      });
			    });
			    return out;
			  })();
		  if (uniqItems.length < 1) return null;

		  const extractYearFromText = (text) => {
		    const s = typeof text === 'string' ? text : String(text || '');
		    if (!s) return 0;
		    const m = s.match(/\b(19|20)\d{2}\b/);
		    if (!m) return 0;
		    const y = Number.parseInt(String(m[0]), 10);
		    return Number.isFinite(y) ? y : 0;
		  };
		  const extractYearFromValue = (value) => {
		    const s = typeof value === 'string' ? value.trim() : String(value || '').trim();
		    if (!s) return 0;
		    const m = s.match(/\b(19|20)\d{2}\b/);
		    if (!m) return 0;
		    const y = Number.parseInt(String(m[0]), 10);
		    return Number.isFinite(y) ? y : 0;
		  };
	  const normalizeForPrefixCompare = (text) => {
	    const s = typeof text === 'string' ? text : String(text || '');
	    if (!s) return '';
	    // Keep CJK + alnum; remove spaces and common separators.
	    return s
	      .toLowerCase()
	      .replace(/[\s\-_—–·|:：/\\()[\]{}<>【】（）「」『』《》、，,。.！!？?~～]+/g, '')
	      .trim();
	  };
	  const keywordBase = (() => {
	    const baseRaw = q
	      .replace(/[(（]\s*(19|20)\d{2}\s*[)）]/g, '')
	      .trim();
	    const seg0 = baseRaw.split(/\s+/g)[0] || '';
	    return seg0.trim() || q;
	  })();
	  const baseKey = (() => {
	    const k = normalizeForPrefixCompare(keywordBase);
	    return k.replace(/(19|20)\d{2}$/g, '');
	  })();
		  const isLikelyUnreleased = (it) => {
		    const subtitle = it && typeof it.subtitle === 'string' ? it.subtitle : String((it && it.subtitle) || '');
		    const s = subtitle.trim();
		    if (s && /(尚未上映|尚未播出|即将上映|即将播出)/.test(s)) return true;
		    const nrr = it && typeof it.nullRatingReason === 'string' ? it.nullRatingReason : String((it && it.nullRatingReason) || '');
		    if (nrr && /(尚未上映|尚未播出)/.test(nrr)) return true;
		    if (it && it.isReleased === false) return true;
		    if (it && it.canRate === false && Number(it.vendorCount || 0) <= 0) return true;
		    const pub = it && Array.isArray(it.pubdate) ? it.pubdate : [];
		    if (pub.some((x) => /(尚未上映|尚未播出|即将上映|即将播出|未定)/.test(String(x || '')))) return true;
		    return false;
		  };
	  const isStrictTitleMatch = (title) => {
	    const t = typeof title === 'string' ? title.trim() : '';
	    if (!t) return false;
	    if (!baseKey || baseKey.length < 2) return true;
	    let titleKey = normalizeForPrefixCompare(t);
	    titleKey = titleKey.replace(/(19|20)\d{2}$/g, '');
	    if (!titleKey.startsWith(baseKey)) return false;
	    const tail = titleKey.slice(baseKey.length);
	    if (!tail) return true;
	    // Allow only explicit season markers after the base title.
	    if (/^第(?:[0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})季$/.test(tail)) return true;
	    if (/^年番(?:[0-9]{1,3}|[一二三四五六七八九十百千两零〇]{1,10})$/.test(tail)) return true;
	    return false;
	  };
	  const stripLeadingByNormalizedPrefix = (text, prefix) => {
	    const raw = typeof text === 'string' ? text : String(text || '');
	    const want = normalizeForPrefixCompare(prefix);
	    if (!raw || !want || want.length < 2) return raw.trim();
	    let acc = '';
	    let endIdx = 0;
	    for (let i = 0; i < raw.length && acc.length < want.length; i += 1) {
	      const ch = raw[i];
	      const norm = normalizeForPrefixCompare(ch);
	      if (!norm) {
	        // allow leading separators before we start matching
	        if (!acc) {
	          endIdx = i + 1;
	          continue;
	        }
	        // allow separators inside prefix matching without advancing acc
	        endIdx = i + 1;
	        continue;
	      }
	      acc += norm;
	      endIdx = i + 1;
	    }
	    if (acc !== want) return raw.trim();
	    return raw
	      .slice(endIdx)
	      .replace(/^[\s\-_—–·|:：/\\]+/g, '')
	      .trim();
	  };
	  const sanitizeDoubanDisplayTitle = (title, keywordBase) => {
	    const t = typeof title === 'string' ? title.trim() : '';
	    if (!t) return '';
	    const baseRaw = typeof keywordBase === 'string' ? keywordBase.trim() : '';
	    if (!baseRaw) return t;
	    // Remove year suffix like "(2026)" / "（2026）" from keyword for matching.
	    const base = baseRaw
	      .replace(/[(（]\s*(19|20)\d{2}\s*[)）]/g, '')
	      .split(/\s+/g)[0]
	      .trim();
	    if (!base) return t;
	    const stripped = stripLeadingByNormalizedPrefix(t, base);
	    return stripped || t;
	  };
			  const shouldSkipLikelyFuture = (it) => {
			    const nowY = new Date().getFullYear();
			    const pub = it && Array.isArray(it.pubdate) ? it.pubdate : [];
			    const firstDate = (() => {
			      for (let i = 0; i < pub.length; i += 1) {
			        const s = String(pub[i] || '');
			        const m = s.match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
			        if (!m) continue;
			        const d = new Date(`${m[0]}T00:00:00Z`);
			        if (!Number.isNaN(d.getTime())) return d;
			      }
			      return null;
			    })();
			    if (firstDate) {
			      const now = new Date();
			      if (firstDate.getTime() > now.getTime()) return true;
			    }
			    const y = Math.max(
			      extractYearFromValue(it && it.year),
			      extractYearFromText(it && it.title),
			      extractYearFromText(it && it.subtitle),
			      extractYearFromText(pub.join(' '))
			    );
			    // If the search card indicates a future year (> current year), skip detail request (likely unreleased/empty).
			    return y > nowY;
			  };

			  const results = await Promise.all(uniqItems.slice(0, Math.max(1, Math.min(50, Number(maxSeasons) || 10))).map(async (it) => {
			    // Fast reject order: keyword/title mismatch -> unreleased -> future-year.
			    if (!isStrictTitleMatch(it && it.title)) return null;
			    if (isLikelyUnreleased(it)) return null;
			    if (shouldSkipLikelyFuture(it)) return null;
			    const detail = await apiGetJson(`/api/douban/rexxar/api/v2/tv/${encodeURIComponent(it.doubanId)}`, { timeoutMs: 12000 });

	    const epCountRaw = detail?.episodes_count;
	    let episodeCount = 0;
		    if (typeof epCountRaw === 'number' && epCountRaw > 0) episodeCount = Math.floor(epCountRaw);
		    else if (typeof epCountRaw === 'string') {
		      const n = Number.parseInt(epCountRaw.trim(), 10);
		      if (Number.isFinite(n) && n > 0) episodeCount = n;
		    }
		    if (!episodeCount) return null;

		    const detailAliases = extractDoubanAliasesFromDetail(detail);
	    const cleanedTitle = sanitizeDoubanDisplayTitle(it.title, q);
	    const aliases = [it.title, cleanedTitle].concat(detailAliases).filter(Boolean);
	    const range = (() => {
	      for (let i = 0; i < aliases.length; i += 1) {
	        const hit = extractEpisodeRangeHint(aliases[i]);
	        if (hit) return hit;
	      }
	      return null;
	    })();
	    const info = computeDoubanDisplayAndMarker(cleanedTitle || it.title, aliases);
	    const airDate = extractDoubanAirDateFromDetail(detail);

	    return {
	      season: 0, // set after ordering (1..N)
	      episodeCount,
	      doubanId: it.doubanId,
	      title: it.title,
	      aliases,
	      hints: range ? { episodeRange: range } : null,
	      airDate,
	      displayLabel: (info.displayLabel || cleanedTitle || it.title || '').trim(),
	      markerKind: info.markerKind || '',
	      markerIndex: Number.isFinite(Number(info.markerIndex)) ? Math.floor(Number(info.markerIndex)) : 0,
	    };
	  }));

		  const seasonsRaw = results.filter(Boolean);
		  if (seasonsRaw.length < 1) return null;

	  const hasAnyDate = seasonsRaw.some((s) => s && typeof s.airDate === 'string' && s.airDate);
	  const hasAnyMarker =
	    !hasAnyDate &&
	    seasonsRaw.some((s) => s && typeof s.markerKind === 'string' && s.markerKind && Number(s.markerIndex) > 0);
	  const hasAnyRange =
	    !hasAnyDate &&
	    !hasAnyMarker &&
	    seasonsRaw.some((s) => s && s.hints && s.hints.episodeRange && s.hints.episodeRange.start);

	  const seasonsSorted = seasonsRaw.slice().sort((a, b) => {
	    if (hasAnyDate) {
	      const ad = a && typeof a.airDate === 'string' ? a.airDate : '';
	      const bd = b && typeof b.airDate === 'string' ? b.airDate : '';
	      if (ad && bd && ad !== bd) return ad.localeCompare(bd);
	      if (ad && !bd) return -1;
	      if (!ad && bd) return 1;
	    }
	    if (hasAnyMarker) {
	      const aKind = a && typeof a.markerKind === 'string' ? a.markerKind : '';
	      const bKind = b && typeof b.markerKind === 'string' ? b.markerKind : '';
	      const aGroup = aKind === 'season' ? 0 : aKind === 'yearbang' ? 1 : 9;
	      const bGroup = bKind === 'season' ? 0 : bKind === 'yearbang' ? 1 : 9;
	      if (aGroup !== bGroup) return aGroup - bGroup;
	      const ai = a && Number.isFinite(Number(a.markerIndex)) ? Number(a.markerIndex) : 0;
	      const bi = b && Number.isFinite(Number(b.markerIndex)) ? Number(b.markerIndex) : 0;
	      if (ai && bi && ai !== bi) return ai - bi;
	      if (ai && !bi) return -1;
	      if (!ai && bi) return 1;
	    }
	    if (hasAnyRange) {
	      const ar = a && a.hints && a.hints.episodeRange ? Number(a.hints.episodeRange.start || 0) : 0;
	      const br = b && b.hints && b.hints.episodeRange ? Number(b.hints.episodeRange.start || 0) : 0;
	      if (ar && br && ar !== br) return ar - br;
	      if (ar && !br) return -1;
	      if (!ar && br) return 1;
	    }
	    // Final fallback: keep stable original order.
	    return 0;
	  });

		  // Re-number seasons sequentially by the best ordering we have.
		  const seasons = seasonsSorted.map((s, idx) => ({
		    season: idx + 1,
		    episodeCount: Number.isFinite(Number(s && s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
		    doubanId: s && s.doubanId != null ? String(s.doubanId) : '',
		    title: s && s.title != null ? String(s.title) : '',
		    aliases: Array.isArray(s && s.aliases) ? s.aliases : [],
		    hints: s && typeof s.hints === 'object' && s.hints ? s.hints : null,
		    airDate: s && typeof s.airDate === 'string' ? String(s.airDate).trim() : '',
		    displayLabel: s && typeof s.displayLabel === 'string' ? String(s.displayLabel).trim() : '',
		  }));
		  if (seasons.length < 1) return null;
		  return { seasons };
		};

		const ensureDoubanSeasonMetaFetchedIfNeeded = async () => {
		  if (!tmdbMode.value) return;
		  if (tmdbMovieMode.value) return;
		  const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
		  if (typRaw !== 'tv') return;
		  const tmdbId = Number(props.tmdbId || 0);
		  if (!(Number.isFinite(tmdbId) && tmdbId > 0)) return;

		  // If we already have a fresh cache, skip.
		  try {
		    const existing = readDoubanSeasonMetaFromSession(tmdbId);
		    const sigNow = computeTMDBSeasonsSignatureForCache();
		    if (
		      existing &&
		      existing.updatedAt &&
		      Date.now() - Number(existing.updatedAt) <= DOUBAN_SEASON_META_TTL_MS &&
		      (!sigNow || String(existing.tmdbSig) === String(sigNow))
		    ) {
		      return;
		    }
		  } catch (_e) {}

	  const meta = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
	  const keyword = (meta && meta.title ? String(meta.title) : (props.videoTitle || '')).trim();
	  if (!keyword) return;

	  const k = `${tmdbId}::${keyword.toLowerCase()}`;
	  if (doubanSeasonFetchState.inFlight && doubanSeasonFetchState.key === k) {
	    await doubanSeasonFetchState.inFlight;
	    return;
	  }
		  doubanSeasonFetchState.seq += 1;
		  const seqAtCall = doubanSeasonFetchState.seq;
		  doubanSeasonFetchState.key = k;
			  const task = (async () => {
			    try {
			      const buildSeasonsFromTMDB = () => {
			        const base = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
			        const normalized = base
			          .map((s) => ({
			            season: Number.isFinite(Number(s && s.season)) ? Math.floor(Number(s.season)) : 0,
			            episodeCount: Number.isFinite(Number(s && s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
			            airDate: s && typeof s.airDate === 'string' ? String(s.airDate).trim() : '',
			          }))
			          .filter((s) => s.season > 0 && s.episodeCount > 0)
			          .sort((a, b) => a.season - b.season);
			        return normalized.map((s) => ({
			          season: s.season,
			          episodeCount: s.episodeCount,
			          doubanId: '',
			          title: '',
			          aliases: [],
			          hints: { source: 'tmdb_synth' },
			          airDate: s.airDate,
			          displayLabel: '',
			        }));
			      };

				      const res = await fetchDoubanSeasonMetaFromDouban({ keyword });
				      if (seqAtCall !== doubanSeasonFetchState.seq) return;
					      let seasons = Array.isArray(res && res.seasons) ? res.seasons : [];
					      if (seasons.length < 1) seasons = buildSeasonsFromTMDB();
					      if (seasons.length < 1) return;
				      const tmdbSig = computeTMDBSeasonsSignatureForCache();
				      const payload = {
				        tmdbId: Math.floor(tmdbId),
				        tmdbSig,
				        seasonCount: seasons.length,
				        seasons: seasons.map((s) => ({
				          season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
			          episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
			          doubanId: s && s.doubanId != null ? String(s.doubanId) : '',
		          title: s && s.title != null ? String(s.title) : '',
		          aliases: Array.isArray(s && s.aliases) ? s.aliases : [],
		          hints: s && typeof s.hints === 'object' && s.hints ? s.hints : null,
		          airDate: s && typeof s.airDate === 'string' ? String(s.airDate).trim() : '',
		          displayLabel: s && typeof s.displayLabel === 'string' ? String(s.displayLabel).trim() : '',
		        })),
		        updatedAt: Date.now(),
		      };
	      sessionStorage.setItem(`tv:douban:tmdbSeasons:${Math.floor(tmdbId)}`, JSON.stringify(payload));
		    } catch (_e) {
		      // ignore
		    }
		  })();
		  doubanSeasonFetchState.inFlight = task;
		  // Ensure `inFlight` is cleared even if callers don't await this function (navigation/unmount etc).
		  task.finally(() => {
		    if (doubanSeasonFetchState.key === k && doubanSeasonFetchState.seq === seqAtCall && doubanSeasonFetchState.inFlight === task) {
		      doubanSeasonFetchState.inFlight = null;
		    }
		    refreshDoubanSeasonMeta();
		  });
		  await task;
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
  const isTMDB = !!tmdbMode.value;
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

  if (!isTMDB) {
    const currentMeta = getAggregatedSourceDisplayMeta({
      siteKey: currentSiteKey,
      spiderApi: resolvedSpiderApiFinal.value,
      videoId: currentVideoId,
      fallbackSiteName: resolvedSiteName.value || currentSiteKey,
    });
    pushOne({
      kind: 'site',
      key: `${currentSiteKey}::${currentVideoId}`,
      active: true,
      siteKey: currentSiteKey,
      spiderApi: resolvedSpiderApiFinal.value,
      siteName: currentMeta.siteName || resolvedSiteName.value || currentSiteKey || '站点',
      videoId: currentVideoId,
      sourceTitle: currentMeta.sourceTitleMarked || currentSourceTitle,
    });
  }

  (aggregatedSources.value || []).forEach((s) => {
    const siteKey = s.siteKey;
    const spiderApi = s.spiderApi;
    const videoId = s.videoId;
    const meta = getAggregatedSourceDisplayMeta({
      siteKey,
      spiderApi,
      videoId,
      fallbackSiteName: s.siteName || s.siteKey,
    });
    pushOne({
      kind: 'site',
      key: `${s.siteKey}::${s.videoId}`,
      active: false,
      siteKey,
      spiderApi,
      siteName: meta.siteName || s.siteName || s.siteKey,
      videoId,
      sourceTitle: meta.sourceTitleMarked || s.videoTitle || '',
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

const formatSiteSourceLabel = (src) => {
  const site = src && src.siteName ? String(src.siteName).trim() : '';
  const title = src && src.sourceTitle ? String(src.sourceTitle).trim() : '';
  if (site && title) return `${site}-${title}`;
  return site || title || '站点';
};

const selectedSiteSourceLabel = computed(() => {
  const list = Array.isArray(orderedSiteSources.value) ? orderedSiteSources.value : [];
  const active = list.find((s) => s && s.active) || list[0] || null;
  return active ? formatSiteSourceLabel(active) : '暂无数据';
});

const selectSiteSourceFromEpisodes = async (src) => {
  siteSourceDropdownOpen.value = false;
  if (!src || src.active) return;
  await switchAggregatedSource(src);
};

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
          error: '',
        };
      });

      const errorSites = (() => {
        const out = [];
        const seen = new Set();
        try {
          Array.from(tmdbSmartDetailCache.values()).forEach((entry) => {
            if (!entry || entry.ok !== false) return;
            const sk = entry && entry.siteKey ? String(entry.siteKey) : '';
            if (!sk || seen.has(sk)) return;
            seen.add(sk);
            const msg = entry && entry.lastError ? String(entry.lastError) : '请求失败';
            out.push({
              kind: 'smart',
              key: `site_err::${sk}`,
              active: false,
              siteKey: sk,
              spiderApi: entry && entry.spiderApi ? String(entry.spiderApi) : '',
              siteName: entry && entry.siteName ? String(entry.siteName) : sk,
              videoId: entry && entry.videoId ? String(entry.videoId) : '',
              qualityTitle: '加载失败',
              __smartCand: null,
              __smartQualityTierRank: 0,
              error: msg,
            });
          });
        } catch (_e) {}
        return out;
      })();

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
        })
        .concat(errorSites);
    } catch (_e) {
      return [];
    }
  };

  if (isSmartPanActive.value && !tmdbMode.value) return buildSmartSwitchItems();

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

  if (!tmdbMode.value) {
    const currentMeta = getAggregatedSourceDisplayMeta({
      siteKey: currentSiteKey,
      spiderApi: resolvedSpiderApiFinal.value,
      videoId: currentVideoId,
      fallbackSiteName: resolvedSiteName.value || currentSiteKey,
    });
    pushOne({
      kind: 'site',
      key: `${currentSiteKey}::${currentVideoId}`,
      active: true,
      siteKey: currentSiteKey,
      spiderApi: resolvedSpiderApiFinal.value,
      siteName: currentMeta.siteName || resolvedSiteName.value || '站点',
      videoId: currentVideoId,
      title: currentMeta.sourceTitleMarked || displayTitle.value || '未命名',
      poster: displayPoster.value,
      remark: (detail.value.remark || props.videoRemark || '').trim(),
      error: !isSmartPanActive.value && introError.value ? String(introError.value) : '',
    });
  }

  (aggregatedSources.value || []).forEach((s) => {
    const siteKey = s.siteKey;
    const spiderApi = s.spiderApi;
    const videoId = s.videoId;
    const meta = getAggregatedSourceDisplayMeta({
      siteKey,
      spiderApi,
      videoId,
      fallbackSiteName: s.siteName || s.siteKey,
    });
    pushOne({
      kind: 'site',
      key: `${s.siteKey}::${s.videoId}`,
      active: false,
      siteKey,
      spiderApi,
      siteName: meta.siteName || s.siteName || s.siteKey,
      videoId,
      title: meta.sourceTitleMarked || s.videoTitle || '未命名',
      poster: processPosterUrl(s.videoPoster || ''),
      remark: (s.videoRemark || '').trim(),
    });
  });

  return list.filter((x) => x && x.siteKey && x.spiderApi && x.videoId);
});

const switchAggregatedSource = async (src) => {
  if (!src || src.active) return;
  if (src.kind === 'smart') {
    if (src.error && !src.__smartCand) return;
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
          switchOnly: true,
          switchOnlyToken: Date.now(),
        },
      })
    );
  } catch (_e) {}
};

const canLoadMoreSources = computed(() => {
  if (fromSearchEntry.value) return false;
  if (sourcesLoading.value) return false;
  if (sourcesError.value) return false;
  if (!sourcesSearchedOnce.value) return true;
  if (tmdbMode.value) return sourcesSearchRemainingCount.value > 0 && sourcesSearchDone.value === false;
  return sourcesSearchRemainingCount.value > 0 && sourcesSearchDone.value === false;
});

const loadMoreSources = async () => {
  if (fromSearchEntry.value) return;
  if (!canLoadMoreSources.value) return;
  // Run through all remaining site-search batches in one click.
  while (canLoadMoreSources.value && !sourcesError.value) {
    await fetchAggregatedSourcesExactMatches({ append: true, detailWarmup: false });
    if (sourcesSearchDone.value) break;
  }
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

const PAN_MOCK_EMPTY_VOD_MARK = '__PAN_MOCK_EMPTY_VOD__';

	const parsePlaySources = (fromRaw, urlRaw, options = {}) => {
	  const opt = options && typeof options === 'object' ? options : {};
	  const panMockEnabled = !!opt.panMockEnabled;
	  const panMockResolving = !!opt.panMockResolving;
  const panMockListErrors = opt.panMockListErrors && typeof opt.panMockListErrors === 'object' ? opt.panMockListErrors : {};
  const panMockResolvedByKey =
    opt.panMockResolvedByKey && typeof opt.panMockResolvedByKey === 'object' ? opt.panMockResolvedByKey : {};
  const fromStr = typeof fromRaw === 'string' ? fromRaw.trim() : '';
  const urlStr = typeof urlRaw === 'string' ? urlRaw.trim() : '';
  if (!fromStr && !urlStr) return [];

  const isResolvedPanMockVod = (vodPlayUrl) => {
    const t = typeof vodPlayUrl === 'string' ? vodPlayUrl.trim() : '';
    if (!t) return false;
    if (/https?:\/\//i.test(t)) return false;
    const segs = t
      .split('#')
      .map((x) => String(x || '').trim())
      .filter(Boolean);
    if (!segs.length) return false;
    for (let i = 0; i < segs.length; i += 1) {
      const seg = segs[i];
      const idx = seg.indexOf('$');
      if (idx <= 0) return false;
      const namePart = seg.slice(0, idx).trim();
      const idPart = seg.slice(idx + 1).trim();
      if (!idPart) return false;
      if (/https?:\/\//i.test(idPart)) return false;
      if (namePart && namePart.toLowerCase().includes('nopass')) return false;
      if (/^nopass(\.mp4)?$/i.test(namePart)) return false;
      if (idPart.toLowerCase().includes('nopass')) return false;
      if (idPart.length < 8 && !idPart.includes('*')) return false;
    }
    return true;
  };

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
      const provider = panMockEnabled ? panMockProviderFromFlag(label) : '';
      const resolveKey = provider ? `${provider}::${String(label || '').trim()}` : '';
      const isResolvedByResolver = !!(resolveKey && panMockResolvedByKey && panMockResolvedByKey[resolveKey] === true);
      // For pan_mock providers, never treat placeholder as real episodes unless the resolver explicitly marked it resolved.
      // This avoids showing placeholder files and guarantees list responses update the UI incrementally.
      const unresolvedPanMock = !!(panMockEnabled && provider && !isResolvedByResolver);

      // Even if the URL side is empty (some detail payloads might only provide `vod_play_from` first),
      // we should still surface the pan option for pan_mock providers so users can see the source list.
      if (!u) {
        if (unresolvedPanMock) {
          rawItems.push({ label: String(label || '').trim(), provider, unresolved: true, episodes: [] });
        }
        continue;
      }

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
      if (unresolvedPanMock) {
        rawItems.push({ label: flagForThisItem, provider, unresolved: true, episodes: [] });
      } else {
        const episodes = segs.map((seg) => parseEpisodeSeg(seg, flagForThisItem)).filter(Boolean);
        rawItems.push({ label: flagForThisItem, provider, unresolved: false, episodes });
      }
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
    const provider = it && it.provider ? String(it.provider) : '';
    const unresolved = !!(it && it.unresolved);
    if (!existing) {
      groups.set(key, { label, provider, unresolved, rawLabels: new Set([rawLabel]), episodes: nextEps.slice() });
      return;
    }
    if (!existing.provider && provider) existing.provider = provider;
    if (unresolved) existing.unresolved = true;
    if (existing.rawLabels) existing.rawLabels.add(rawLabel);
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
	    const provider = g && g.provider ? String(g.provider) : '';
	    const unresolved = !!(g && g.unresolved);
	    const { error, noData } = (() => {
	      let noData = false;
	      if (!panMockEnabled || !provider) return { error: '', noData: false };
	      const labels = g && g.rawLabels && typeof g.rawLabels.forEach === 'function' ? Array.from(g.rawLabels.values()) : [];
	      let errText = '';
	      for (let i = 0; i < labels.length; i += 1) {
	        const rawLabel = String(labels[i] || '').trim();
	        const k = `${provider}::${rawLabel}`;
	        const msg = panMockListErrors && panMockListErrors[k] != null ? String(panMockListErrors[k] || '').trim() : '';
	        if (!msg) continue;
	        if (msg === PAN_MOCK_EMPTY_VOD_MARK) {
	          noData = true;
	          continue;
	        }
	        errText = msg;
	        break;
	      }
	      return { error: errText, noData };
	    })();
	    const loading = !!(panMockEnabled && provider && unresolved && panMockResolving && !error && !noData);

	    if (!episodes.length && !unresolved) return;
	    out.push({ key: `p${idx}`, label: g.label, episodes, loading, error, provider });
	  });
  return out;
};

		const SMART_PAN_KEY = 'smart';
		const SITE_SMART_LIST_LABEL = '智能列表';
		const TMDB_SMART_PAN_LABEL = 'TMDB';
		const DOUBAN_SMART_PAN_KEY = 'smart_douban';
		const DOUBAN_SMART_PAN_LABEL = '豆瓣';
		const isSmartPanKey = (key) => key === SMART_PAN_KEY || key === DOUBAN_SMART_PAN_KEY;

const sitePanOptions = computed(() => {
  const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
  const panMockEnabled = !!(d && d.panMockEnabled);
  const panMockResolving = !!(d && d.panMockResolving);
  const panMockListErrors = d && d.panMockListErrors && typeof d.panMockListErrors === 'object' ? d.panMockListErrors : {};
  const panMockResolvedByKey =
    d && d.panMockResolvedByKey && typeof d.panMockResolvedByKey === 'object' ? d.panMockResolvedByKey : {};
  return parsePlaySources(d.playFrom, d.playUrl, { panMockEnabled, panMockResolving, panMockListErrors, panMockResolvedByKey });
});

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
  const historySiteKey = resumeHistory.value && typeof resumeHistory.value.siteKey === 'string' ? resumeHistory.value.siteKey.trim() : '';
  const historySpiderApi = resumeHistory.value && typeof resumeHistory.value.spiderApi === 'string' ? resumeHistory.value.spiderApi.trim() : '';
  const historyVideoId = resumeHistory.value && typeof resumeHistory.value.videoId === 'string' ? resumeHistory.value.videoId.trim() : '';
  const currentSiteKey = ((props.siteKey || '').trim() || historySiteKey).trim();
  const currentSpiderApi = ((resolvedSpiderApiFinal.value || '').trim() || historySpiderApi).trim();
  const currentVideoId = (((props.siteKey || '').trim() ? (props.videoId || '').trim() : '') || historyVideoId).trim();

  const list = [];
  if (currentSiteKey && currentSpiderApi && currentVideoId) {
    list.push({
      kind: 'site',
      siteKey: currentSiteKey,
      spiderApi: currentSpiderApi,
      siteName: resolvedSiteName.value || currentSiteKey,
      videoId: currentVideoId,
      sourceTitle: displayTitle.value || props.videoTitle || '',
    });
  }

  (Array.isArray(aggregatedSources.value) ? aggregatedSources.value : []).forEach((s) => {
    list.push({
      kind: 'site',
      siteKey: s && s.siteKey ? String(s.siteKey) : '',
      spiderApi: s && s.spiderApi ? String(s.spiderApi) : '',
      siteName: s && s.siteName ? String(s.siteName) : '',
      videoId: s && s.videoId ? String(s.videoId) : '',
      sourceTitle: s && s.videoTitle ? String(s.videoTitle) : '',
    });
  });

  const normalized = list.map((s) => ({
    kind: 'site',
    siteKey: s && s.siteKey ? String(s.siteKey) : '',
    spiderApi: s && s.spiderApi ? String(s.spiderApi) : '',
    siteName: s && s.siteName ? String(s.siteName) : '',
    videoId: s && s.videoId ? String(s.videoId) : '',
    sourceTitle: s && s.sourceTitle ? String(s.sourceTitle) : '',
  }));
  const out = [];
  const seen = new Set();
  normalized.forEach((src) => {
    if (!src || src.kind !== 'site') return;
    const siteKey = typeof src.siteKey === 'string' ? src.siteKey.trim() : '';
    const spiderApi = typeof src.spiderApi === 'string' ? src.spiderApi.trim() : '';
    const videoId = typeof src.videoId === 'string' ? src.videoId.trim() : '';
    if (!siteKey || !spiderApi || !videoId) return;
    const key = buildTMDBSitePanKey(siteKey, spiderApi, videoId);
    if (seen.has(key)) return;
    seen.add(key);
    const meta = getAggregatedSourceDisplayMeta({
      siteKey,
      spiderApi,
      videoId,
      fallbackSiteName: typeof src.siteName === 'string' ? src.siteName.trim() : '',
    });
    const siteName = meta.siteName || siteKey;
    const sourceTitle = meta.sourceTitleMarked || (typeof src.sourceTitle === 'string' ? src.sourceTitle.trim() : '');
    out.push({
      kind: 'tmdb_site_pan',
      key,
      label: sourceTitle ? `${siteName}-${sourceTitle}` : siteName,
      siteKey,
      siteName,
      spiderApi,
      videoId,
    });
  });
  return out;
});

const panDropdownOptions = computed(() => (tmdbMode.value ? tmdbSitePanOptions.value : sitePanOptions.value));

const siteDetailBooting = computed(() => {
  if (tmdbMode.value) return false;
  if (!introLoading.value) return false;
  if (introError.value) return false;
  const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
  return !(d && typeof d.playFrom === 'string' && d.playFrom.trim());
});

const panDropdownLoading = computed(() => {
  if (tmdbMode.value) return false;
  if (siteDetailBooting.value) return true;
  const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
  const panMockEnabled = !!(d && d.panMockEnabled);
  if (!panMockEnabled) return false;
  // Only show the dropdown spinner when *no* pan options are available yet.
  // Pan-level resolving should be shown in the episode area after the user selects a source.
  if (!(d && d.panMockResolving)) return false;
  const opts = sitePanOptions.value;
  return !opts || opts.length === 0;
});

const panDropdownStatusText = computed(() => {
  if (panDropdownLoading.value) return '加载中...';
  return '';
});

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
	      panMockEnabled: false,
	      siteKey: opt.siteKey || '',
	      siteName: opt.siteName || '',
	      spiderApi: opt.spiderApi || '',
	      videoId: opt.videoId || '',
	      sourceKey: `${String(opt.siteKey || '')}::${String(opt.spiderApi || '')}::${String(opt.videoId || '')}`,
	    });
	    tmdbSitePanCacheVersion.value += 1;

    try {
      const entry = await ensureTMDBSmartDetailCacheEntry(
        {
        siteKey: opt.siteKey,
        siteName: opt.siteName,
        spiderApi: opt.spiderApi,
        videoId: opt.videoId,
        videoTitle: opt.siteName,
        videoRemark: '',
      },
        { reason: 'tmdb_site_pan_load', module: 'smart' }
      );
      const pansRaw = entry && Array.isArray(entry.pans) ? entry.pans : [];
	      const pans = pansRaw
	        .map((pan, idx) => {
	          const label = pan && pan.label != null ? String(pan.label) : '';
	          const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
	          const loading = !!(pan && pan.loading);
	          const error = pan && pan.error ? String(pan.error) : '';
	          const provider = pan && pan.provider ? String(pan.provider) : '';
	          return { key: `tpan${idx}`, label, episodes, loading, error, provider };
	        })
	        .filter((p) => p && p.label);

	      tmdbSitePanCache.set(key, {
	        ok: true,
	        loading: false,
	        error: '',
	        pans,
	        panMockEnabled: !!(entry && entry.panMockEnabled),
	        siteKey: opt.siteKey || '',
	        siteName: opt.siteName || '',
	        spiderApi: opt.spiderApi || '',
	        videoId: opt.videoId || '',
	        sourceKey: `${String(opt.siteKey || '')}::${String(opt.spiderApi || '')}::${String(opt.videoId || '')}`,
	      });
	      tmdbSitePanCacheVersion.value += 1;
	    } catch (e) {
	      tmdbSitePanCache.set(key, {
	        ok: false,
	        loading: false,
	        error: e && e.message ? String(e.message) : '加载网盘列表失败',
	        pans: [],
	        panMockEnabled: false,
	        siteKey: opt.siteKey || '',
	        siteName: opt.siteName || '',
	        spiderApi: opt.spiderApi || '',
	        videoId: opt.videoId || '',
	        sourceKey: `${String(opt.siteKey || '')}::${String(opt.spiderApi || '')}::${String(opt.videoId || '')}`,
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
const tmdbPrimarySmartEpisodes = computed(() => {
  if (tmdbSmartListAvailable.value) return tmdbSmartEpisodes.value;
  if (tmdbMovieSmartListAvailable.value) return tmdbMovieSmartEpisodes.value;
  return [];
});

const doubanSmartListAvailable = computed(() => {
  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
  if (!(tmdbMode.value && !tmdbMovieMode.value)) return false;
  return seasons.some((s) => {
    const sn = Number.isFinite(Number(s && s.season)) ? Math.floor(Number(s.season)) : 0;
    const cnt = Number.isFinite(Number(s && s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0;
    return sn > 0 && cnt > 0;
  });
});

const doubanSmartEpisodes = computed(() => {
  if (!doubanSmartListAvailable.value) return [];
  const tm = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const tmdbLatestGlobal = (() => {
    if (!tm || String(tm.mediaType || '').trim().toLowerCase() !== 'tv') return 0;
    const n = Number.isFinite(Number(tm.latestGlobal)) ? Math.floor(Number(tm.latestGlobal)) : 0;
    return n > 0 ? n : 0;
  })();
  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
  const sorted = seasons
    .map((s) => ({
      season: Number.isFinite(Number(s.season)) ? Math.floor(Number(s.season)) : 0,
      episodeCount: Number.isFinite(Number(s.episodeCount)) ? Math.floor(Number(s.episodeCount)) : 0,
    }))
    .filter((s) => s.season > 0 && s.episodeCount > 0)
    .sort((a, b) => a.season - b.season);
  if (sorted.length < 1) return [];
  const out = [];
  let globalIdx = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    const it = sorted[i];
    for (let ep = 1; ep <= it.episodeCount; ep += 1) {
      globalIdx += 1;
      if (tmdbLatestGlobal > 0 && globalIdx > tmdbLatestGlobal) return out;
      out.push({
        name: `第${ep}集`,
        url: `tmdb_ep:${globalIdx}`,
        __tmdbEpisode: globalIdx,
        __tmdbSeason: it.season,
        __tmdbSeasonEpisode: ep,
        __smartSource: 'douban',
      });
    }
  }
  return out;
});

const legacySmartListEpisodes = computed(() => {
  if (tmdbMode.value) return [];
  if (contentKind.value === 'movie') return smartMovieEpisodes.value;
  return smartPanEpisodes.value;
});

	const legacySmartListAvailable = computed(() => {
	  if (tmdbMode.value) return false;
	  if (contentKind.value === 'movie') return Array.isArray(smartMovieEpisodes.value) && smartMovieEpisodes.value.length > 0;
	  return smartSeriesListAvailable.value;
	});

	const siteSmartListVisible = computed(() => {
	  if (tmdbMode.value) return true;
	  if (legacySmartListAvailable.value) return true;
	  if (introLoading.value || siteDetailBooting.value) return true;
	  const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
	  if (d && d.panMockEnabled === true && d.panMockResolving === true) return true;
	  return false;
	});

const smartPanActivated = ref(new Set());

const markSmartPanActivated = (key) => {
  const k = typeof key === 'string' ? key : '';
  if (!k) return;
  const cur = smartPanActivated.value;
  if (cur && cur.has(k)) return;
  const next = new Set(cur || []);
  next.add(k);
  smartPanActivated.value = next;
};

const smartPanEntries = computed(() => {
  if (tmdbMode.value) {
    const out = [];
    const activated = smartPanActivated.value;
    const tmdbEps = activated && activated.has(SMART_PAN_KEY) ? (tmdbPrimarySmartEpisodes.value || []) : [];
    const doubanEps =
      activated && activated.has(DOUBAN_SMART_PAN_KEY) && doubanSmartListAvailable.value ? (doubanSmartEpisodes.value || []) : [];
		  // TMDB mode only exposes TMDB/Douban lists. Keep TMDB entry visible even while episodes are still resolving,
		  // so the UI won't auto-fallthrough to the first site pan option.
		  out.push({ key: SMART_PAN_KEY, label: TMDB_SMART_PAN_LABEL, episodes: tmdbEps });
    // Always keep the "豆瓣" entry visible for TV so users can switch at any time.
    // The episode list may be empty until douban meta is fetched / becomes applicable.
    if (!tmdbMovieMode.value) {
      out.push({
        key: DOUBAN_SMART_PAN_KEY,
        label: DOUBAN_SMART_PAN_LABEL,
        episodes: doubanEps,
      });
    }
		    return out;
  }
	  if (!siteSmartListVisible.value) return [];
	  // Site mode: keep the "智能列表" entry visible while detail/pan_mock is still resolving.
	  // If rules cannot extract any episodes after parsing completes, hide it and fall through to the first pan source.
	  const eps = legacySmartListAvailable.value ? (legacySmartListEpisodes.value || []) : [];
	  return [{ key: SMART_PAN_KEY, label: SITE_SMART_LIST_LABEL, episodes: eps }];
	});

const smartListAvailable = computed(() => smartPanEntries.value.length > 0);
const defaultSmartPanKey = computed(() => (smartPanEntries.value[0] && smartPanEntries.value[0].key ? String(smartPanEntries.value[0].key) : ''));

const selectedPanKey = computed(() => {
  if (selectedPan.value) return selectedPan.value;
  if (smartListAvailable.value) return defaultSmartPanKey.value || SMART_PAN_KEY;
  return panDropdownOptions.value[0]?.key || '';
});

const isSmartPanActive = computed(() => smartListAvailable.value && isSmartPanKey(selectedPanKey.value));

const tmdbEpisodesLoading = computed(() => {
  if (!tmdbMode.value) return false;
  if (tmdbMovieMode.value) return false;
  if (!isSmartPanActive.value) return false;
  if (tmdbSmartListAvailable.value) return false;
  return !!(tmdbFetchState && tmdbFetchState.inFlight);
});

const doubanEpisodesLoading = computed(() => {
  if (!tmdbMode.value) return false;
  if (tmdbMovieMode.value) return false;
  if (selectedPanKey.value !== DOUBAN_SMART_PAN_KEY) return false;
  return !!(doubanSeasonFetchState && doubanSeasonFetchState.inFlight);
});

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
    const entries = Array.isArray(smartPanEntries.value) ? smartPanEntries.value : [];
    for (const entry of entries) {
      if (!entry || !entry.key) continue;
      const episodes = Array.isArray(entry.episodes) ? entry.episodes : [];
      for (let i = 0; i < episodes.length; i += 1) {
        const ep = episodes[i];
        const url = ep && ep.url != null ? String(ep.url) : '';
        if (!url) continue;
        if (url === wanted || url.includes(wanted) || wanted.includes(url)) {
          return { panKey: String(entry.key), index: i };
        }
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
  if (smartListAvailable.value && isSmartPanKey(selectedPanKey.value)) {
    const hit = (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).find((e) => e && e.key === selectedPanKey.value) || null;
    if (hit && hit.label) return String(hit.label);
    return tmdbMode.value ? TMDB_SMART_PAN_LABEL : SITE_SMART_LIST_LABEL;
  }
  if (siteDetailBooting.value) return SITE_SMART_LIST_LABEL;
  if (introLoading.value) return '加载中...';
  const list = panDropdownOptions.value;
  if (!list.length) return smartListAvailable.value ? (smartPanEntries.value[0]?.label || (tmdbMode.value ? TMDB_SMART_PAN_LABEL : SITE_SMART_LIST_LABEL)) : '暂无数据';
  const found = list.find((o) => o && o.key === selectedPanKey.value);
  const picked = found || list[0] || null;
  const base = (picked && picked.label ? String(picked.label) : '') || (list[0] && list[0].label ? String(list[0].label) : '') || '暂无数据';
  return base;
});

const preferBaiduPanKey = computed(() => {
  const list = sitePanOptions.value;
  if (!list.length) return '';
  const idx = list.findIndex((o) => o && typeof o.label === 'string' && o.label.includes('百度'));
  return idx >= 0 ? list[idx].key : '';
});

const normalizeContentKeyForPanPref = (s) => {
  const raw = typeof s === 'string' ? s : String(s || '');
  return raw.trim().toLowerCase().replace(/\s+/g, '');
};

const EP_VIEW_MODE_STORAGE_PREFIX = 'meowfilm_episode_view_mode::';
const EP_META_MODE_STORAGE_PREFIX = 'meowfilm_episode_meta_mode::';
const episodeViewModeStorageKey = computed(() => {
  const k = getStableContentKey() || computeHistoryContentKey(displayTitle.value) || normalizeContentKeyForPanPref(displayTitle.value);
  return k ? `${EP_VIEW_MODE_STORAGE_PREFIX}${k}` : '';
});
const episodeMetaModeStorageKey = computed(() => {
  const k = getStableContentKey() || computeHistoryContentKey(displayTitle.value) || normalizeContentKeyForPanPref(displayTitle.value);
  return k ? `${EP_META_MODE_STORAGE_PREFIX}${k}` : '';
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

const readEpisodeMetaMode = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    const key = episodeMetaModeStorageKey.value;
    if (!key) return '';
    const v = String(window.localStorage.getItem(key) || '').trim().toLowerCase();
    if (v === 'tmdb' || v === 'douban') return v;
    return '';
  } catch (_e) {
    return '';
  }
};

const writeEpisodeMetaMode = (mode) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const key = episodeMetaModeStorageKey.value;
    if (!key) return;
    const v = String(mode || '').trim().toLowerCase();
    if (v !== 'tmdb' && v !== 'douban') {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, v);
  } catch (_e) {}
};

const episodeMetaMode = ref('tmdb');
watch(
  () => episodeMetaModeStorageKey.value,
  () => {
    const saved = readEpisodeMetaMode();
    episodeMetaMode.value = saved === 'douban' || saved === 'tmdb' ? saved : 'tmdb';
  },
  { immediate: true }
);

const episodeMetaModeEffective = computed(() => {
  const mode = String(episodeMetaMode.value || '').toLowerCase();
  if (!tmdbMode.value || tmdbMovieMode.value) return 'tmdb';
  if (!isTMDBSitePanKey(selectedPanKey.value)) return 'tmdb';
  return mode === 'douban' ? 'douban' : 'tmdb';
});

watch(
  () => episodeMetaModeEffective.value,
  (mode) => {
    if (mode !== 'douban') return;
    try {
      void ensureDoubanSeasonMetaFetchedIfNeeded();
    } catch (_e) {}
  }
);

const episodeMetaModeLabel = computed(() => (episodeMetaModeEffective.value === 'douban' ? '豆瓣' : 'TMDB'));

const toggleEpisodeMetaMode = () => {
  if (!tmdbMode.value || tmdbMovieMode.value) return;
  if (!isTMDBSitePanKey(selectedPanKey.value)) return;
  const next = episodeMetaModeEffective.value === 'douban' ? 'tmdb' : 'douban';
  episodeMetaMode.value = next;
  writeEpisodeMetaMode(next);
};

watch(
  () => `${isIos.value ? '1' : '0'}|${sitePanOptions.value.length}|${selectedPan.value}`,
  () => {
    if (!isIos.value) return;
    // Avoid referencing TMDB computeds here (they are declared later in this file and can trigger TDZ errors).
    // In TMDB mode we don't auto-pick a default pan source.
    try {
      const id = Number(props.tmdbId || 0);
      const typRaw = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
      const isTmdb = Number.isFinite(id) && id > 0 && (typRaw === 'tv' || typRaw === 'movie');
      if (isTmdb) return;
    } catch (_e) {}
    if (smartListAvailable.value) return;
    if (selectedPan.value) return;
    const list = sitePanOptions.value;
    const k = list && list[0] && list[0].key ? String(list[0].key) : '';
	    if (k) {
	      selectedPan.value = k;
	    }
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

const selectPan = (key, opts = {}) => {
  const k = typeof key === 'string' ? key : '';
  if (!k) return;
  const fromUser = !!(opts && typeof opts === 'object' && opts.fromUser);
  if (fromUser) {
    autoPlaySuppressedByUser.value = true;
    autoFallbackActive.value = false;
  }
	  if (isSmartPanKey(k) && !smartListAvailable.value) return;
	  if (isSmartPanKey(k)) {
	    const ok = (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).some((s) => s && s.key === k);
	    if (!ok) return;
	  }
	  if (
	    fromUser &&
	    !initialAutoPlayTriggered.value &&
	    !playerPlaybackStarted.value &&
	    (playLoading.value || initialAutoPlayInFlight.value || !playerUrl.value)
	  ) {
	    autoPlaySuppressedByUser.value = true;
	  }
		  // Keep the current episode list view mode when switching pan source.
		  // If the user is currently in raw list mode, treat the switch as an explicit choice and stop auto-toggling.
		  if (rawListMode.value) autoRawListMode.value = false;
		  selectedPan.value = k;
		  panDropdownOpen.value = false;
		  selectedEpisodeGroup.value = '';
		  tmdbPanDropdownOpen.value = false;

  if (tmdbMode.value) {
    if (isSmartPanKey(k)) {
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
      if (fromUser && opt) void ensureTMDBSitePanLoaded(opt);
    }
  }

  if (playingPanKey.value && playingPanKey.value === k && playingEpisodeIndex.value >= 0) {
    const src = (() => {
      if (isSmartPanKey(k)) {
        const hit = (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).find((s) => s && s.key === k) || null;
        return hit ? { label: String(hit.label || ''), episodes: Array.isArray(hit.episodes) ? hit.episodes : [] } : null;
      }
      return sitePanOptions.value.find((o) => o && o.key === k) || null;
    })();
    const total = src && Array.isArray(src.episodes) ? src.episodes.length : 0;
    if (total && playingEpisodeIndex.value < total) {
      setEpisodeIndex(playingEpisodeIndex.value, 'selectPan_keepPlaying');
      return;
    }
  }
  setEpisodeIndex(-1, 'selectPan_reset');
};

const selectedPanSource = computed(() => {
  if (smartListAvailable.value && isSmartPanKey(selectedPanKey.value)) {
    const hit = (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).find((s) => s && s.key === selectedPanKey.value) || null;
    if (!hit) return null;
    return { key: String(hit.key), label: String(hit.label || ''), episodes: hit.episodes || [], smart: true };
  }
  const k = selectedPanKey.value;
  if (tmdbMode.value && isTMDBSitePanKey(k)) {
    const opt = (Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : []).find((o) => o && o.key === k) || null;
    const cached = readTMDBSitePanCacheEntry(k);
    const pans = cached && Array.isArray(cached.pans) ? cached.pans : [];
    const picked =
      (tmdbSelectedSitePanKey.value && pans.find((p) => p && p.key === tmdbSelectedSitePanKey.value)) || pans[0] || null;
    const episodes = picked && Array.isArray(picked.episodes) ? picked.episodes : [];
    const pickedLoading = !!(picked && picked.loading);
    const pickedError = picked && picked.error ? String(picked.error) : '';
    const pickedProvider = picked && picked.provider ? String(picked.provider) : '';
    return {
      key: k,
      label: (picked && picked.label ? String(picked.label) : '') || (opt && opt.label) || (cached && cached.siteName ? String(cached.siteName) : '') || '暂无数据',
      episodes,
      kind: 'tmdb_site_pan',
      provider: pickedProvider,
      siteKey: (opt && opt.siteKey) || (cached && cached.siteKey) || '',
      siteName: (opt && opt.siteName) || (cached && cached.siteName) || '',
      spiderApi: (opt && opt.spiderApi) || (cached && cached.spiderApi) || '',
      videoId: (opt && opt.videoId) || (cached && cached.videoId) || '',
      loading: (cached ? !!cached.loading : false) || pickedLoading,
      error: (cached && cached.error ? String(cached.error) : '') || pickedError,
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
  if (!src) return false;
  if (src.kind === 'tmdb_site_pan') {
    const cached = readTMDBSitePanCacheEntry(src.key);
    if (!cached) return true;
    return !!src.loading;
  }
  return !!src.loading;
});

const selectedPanAuxError = computed(() => {
  const src = selectedPanSource.value;
  if (!src) return '';
  if (src.kind === 'tmdb_site_pan') return src && src.error ? String(src.error) : '';
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
    loading: !!(p && p.loading),
    error: p && p.error ? String(p.error) : '',
  }));
});

const tmdbSelectedSitePanLabel = computed(() => {
  const opts = tmdbSelectedSitePanOptions.value;
  if (!opts.length) return selectedPanAuxLoading.value ? '加载中...' : '暂无数据';
  const cur = tmdbSelectedSitePanKey.value;
  const hit = cur ? opts.find((o) => o && o.key === cur) : null;
  return (hit && hit.label ? String(hit.label) : '') || (opts[0] && opts[0].label ? String(opts[0].label) : '') || '暂无数据';
});

const selectTMDBSitePan = (key) => {
  const k = typeof key === 'string' ? key : '';
  if (!k) return;
  tmdbSelectedSitePanKey.value = k;
  tmdbPanDropdownOpen.value = false;
};

onMounted(() => {
  // Register TMDB-site-pan watchers after mount to avoid TDZ issues (they depend on TMDB computeds declared later).
  try {
    const stopFillSubPan = watch(
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
    cleanupFns.push(stopFillSubPan);
  } catch (_e) {}

  try {
    const stopAutoLoadSitePan = watch(
      () => `${tmdbMode.value ? '1' : '0'}|${selectedPanKey.value}|${tmdbSitePanCacheVersion.value}`,
      () => {
        if (!tmdbMode.value) return;
        const k = selectedPanKey.value;
        if (!isTMDBSitePanKey(k)) return;
        const opt =
          (Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : []).find((o) => o && o.key === k) || null;
        if (!opt) return;
        const cached = readTMDBSitePanCacheEntry(k);
        if (cached && cached.ok === true && Array.isArray(cached.pans)) return;
        void ensureTMDBSitePanLoaded(opt);
      },
      { immediate: true }
    );
    cleanupFns.push(stopAutoLoadSitePan);
  } catch (_e) {}

  try {
    const stopSmartPanActivated = watch(
      () => `${getStableContentKey()}|${selectedPanKey.value}`,
      () => {
        smartPanActivated.value = new Set();
        const k = selectedPanKey.value;
        if (isSmartPanKey(k)) markSmartPanActivated(k);
      },
      { immediate: true }
    );
    cleanupFns.push(stopSmartPanActivated);

    const stopSmartPanActivatedBySelect = watch(
      () => selectedPanKey.value,
      () => {
        const k = selectedPanKey.value;
        if (isSmartPanKey(k)) markSmartPanActivated(k);
      },
      { immediate: true }
    );
    cleanupFns.push(stopSmartPanActivatedBySelect);
  } catch (_e) {}

  try {
    const stopMetaState = watch(
      () =>
        [
          debugEnabled.value ? '1' : '0',
          episodeMetaModeEffective.value,
          tmdbSmartEpisodeCount.value,
          tmdbSmartEpisodes.value.length,
          doubanSmartListAvailable.value ? '1' : '0',
          doubanSeasonMeta.value && Array.isArray(doubanSeasonMeta.value.seasons) ? doubanSeasonMeta.value.seasons.length : 0,
          selectedPanKey.value,
        ].join('|'),
      () => {
        if (!debugEnabled.value) return;
        try {
          const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
          const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
          smartDebugLog('meta_state', {
            module: 'play',
            mode: String(episodeMetaModeEffective.value || ''),
            panKey: String(selectedPanKey.value || ''),
            tmdbCount: Number(tmdbSmartEpisodeCount.value) || 0,
            tmdbLen: Array.isArray(tmdbSmartEpisodes.value) ? tmdbSmartEpisodes.value.length : 0,
            doubanAvail: doubanSmartListAvailable.value ? 1 : 0,
            doubanSeasons: seasons.length,
            doubanCounts: seasons.slice(0, 6).map((s) => `${Number(s && s.season) || 0}:${Number(s && s.episodeCount) || 0}`).join(','),
          });
          if (typeof window !== 'undefined') {
            window.__tvDebug = {
              ...(window.__tvDebug || {}),
              tmdbSmartEpisodeCount,
              tmdbSmartEpisodes,
              doubanSmartListAvailable,
              doubanSeasonMeta,
            };
          }
        } catch (_e) {}
      },
      { immediate: true }
    );
    cleanupFns.push(stopMetaState);
  } catch (_e) {}

  try {
    const stopMatchSample = watch(
      () =>
        [
          debugEnabled.value ? '1' : '0',
          episodeMetaModeEffective.value,
          selectedPanKey.value,
          Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value.length : 0,
        ].join('|'),
      () => {
        if (!debugEnabled.value) return;
        try {
          const sample = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value.slice(0, 10) : [];
          smartDebugLog('match_sample', {
            module: 'play',
            mode: String(episodeMetaModeEffective.value || ''),
            panKey: String(selectedPanKey.value || ''),
            len: Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value.length : 0,
            sample: sample.map((m) => `${Number(m && m.season) || 0}-${Number(m && m.episode) || 0}`).join(','),
          });
          if (selectedPanSource.value && selectedPanSource.value.kind === 'tmdb_site_pan') {
            const all = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value : [];
            const seasonCounts = {};
            let maxSeason = 0;
            let maxEpisode = 0;
            all.forEach((m) => {
              const s = Number.isFinite(Number(m && m.season)) ? Math.floor(Number(m.season)) : 0;
              const e = Number.isFinite(Number(m && m.episode)) ? Math.floor(Number(m.episode)) : 0;
              if (s > maxSeason) maxSeason = s;
              if (e > maxEpisode) maxEpisode = e;
              const k = String(s);
              seasonCounts[k] = (seasonCounts[k] || 0) + 1;
            });
            const tailSample = all.slice(-10).map((m) => `${Number(m && m.season) || 0}-${Number(m && m.episode) || 0}`).join(',');
            const entry = readTMDBSitePanSmartEntry();
            const keys = [];
            if (entry && entry.episodeMap && typeof entry.episodeMap.forEach === 'function') {
              entry.episodeMap.forEach((_v, k) => {
                if (Number.isFinite(Number(k))) keys.push(Math.floor(Number(k)));
              });
            }
            keys.sort((a, b) => a - b);
            const head = keys.slice(0, 30);
            const tail = keys.length > 30 ? keys.slice(-5) : [];
            playDebugLog('match_keys', {
              module: 'play',
              mode: String(episodeMetaModeEffective.value || ''),
              panKey: String(selectedPanKey.value || ''),
              total: keys.length,
              head: head.join(','),
              tail: tail.join(','),
            });
            playDebugLog('match_stats', {
              module: 'play',
              mode: String(episodeMetaModeEffective.value || ''),
              panKey: String(selectedPanKey.value || ''),
              maxSeason,
              maxEpisode,
              seasonCounts: Object.keys(seasonCounts)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => `${k}:${seasonCounts[k]}`)
                .join(','),
              tail: tailSample,
            });
            const list = Array.isArray(allDisplayedEpisodes.value) ? allDisplayedEpisodes.value : [];
            const listSeasonCounts = {};
            let listMaxSeason = 0;
            list.forEach((it) => {
              const s = Number.isFinite(Number(it && it.season)) ? Math.floor(Number(it.season)) : 0;
              if (s > listMaxSeason) listMaxSeason = s;
              const k = String(s);
              listSeasonCounts[k] = (listSeasonCounts[k] || 0) + 1;
            });
            const tabs = Array.isArray(seasonTabs.value) ? seasonTabs.value : [];
            playDebugLog('match_list', {
              module: 'play',
              mode: String(episodeMetaModeEffective.value || ''),
              panKey: String(selectedPanKey.value || ''),
              total: list.length,
              maxSeason: listMaxSeason,
              seasonCounts: Object.keys(listSeasonCounts)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => `${k}:${listSeasonCounts[k]}`)
                .join(','),
              head: tabs.map((t) => `${t && t.season != null ? t.season : ''}`).join(','),
            });
            const grouped = Array.isArray(groupedDisplayedEpisodes.value) ? groupedDisplayedEpisodes.value : [];
            const groupedSeasonCounts = {};
            grouped.forEach((it) => {
              const s = Number.isFinite(Number(it && it.season)) ? Math.floor(Number(it.season)) : 0;
              const k = String(s);
              groupedSeasonCounts[k] = (groupedSeasonCounts[k] || 0) + 1;
            });
            playDebugLog('match_group', {
              module: 'play',
              mode: String(episodeMetaModeEffective.value || ''),
              panKey: String(selectedPanKey.value || ''),
              total: grouped.length,
              seasonCounts: Object.keys(groupedSeasonCounts)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => `${k}:${groupedSeasonCounts[k]}`)
                .join(','),
            });
          }
          if (typeof window !== 'undefined') {
            window.__tvDebug = { ...(window.__tvDebug || {}), episodeMatchByIndex };
          }
        } catch (_e) {}
      },
      { immediate: true }
    );
    cleanupFns.push(stopMatchSample);
  } catch (_e) {}
});

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

	  const looksInformative = (s) => {
	    const t = typeof s === 'string' ? s.trim() : '';
	    if (!t) return false;
	    const lower = t.toLowerCase();
	    if (/\bS\s*0*\d{1,2}\s*E\s*0*\d{1,5}\b/i.test(t)) return true;
	    if (/\bE\s*0*\d{1,5}\b/i.test(t)) return true;
	    if (/(2160p|2160|4k|1080p|1080|720p|720)/i.test(lower)) return true;
	    if (/(web-?dl|bluray|bdrip|hdr|dv|dolby|ddp|x265|h\.?265|hevc)/i.test(lower)) return true;
	    return false;
	  };

	  const collectFromTriplePipes = () => {
	    if (!raw.includes('|||')) return [];
	    const parts = raw.split('|||');
	    if (parts.length < 2) return [];
	    const suffixJoined = stripMeta(parts.slice(1).join('|||'));
	    const suffixSegs = parts
	      .slice(1)
	      .map((s) => stripMeta(String(s || '')))
	      .filter(Boolean);
	    const merged = [];
	    if (suffixJoined) merged.push(suffixJoined);
	    suffixSegs.forEach((s) => {
	      if (!merged.includes(s)) merged.push(s);
	    });
	    const informative = merged.filter((s) => looksInformative(s));
	    if (informative.length) return informative.slice(0, 6);
	    return merged.length ? [merged[merged.length - 1]] : [];
	  };

	  const collectFromStarStarStar = () => {
	    if (!raw.includes('***')) return [];
	    const parts = raw.split('***');
	    if (parts.length < 2) return [];
	    // For providers like quark/uc/189/139, the raw filename is appended after the first "***".
	    // Some backends may append multiple suffix fragments; treat the full suffix as the raw filename source.
	    const suffixJoined = stripMeta(parts.slice(1).join('***'));
	    const suffixSegs = parts
	      .slice(1)
	      .map((s) => stripMeta(String(s || '')))
	      .filter(Boolean);
	    const merged = [];
	    if (suffixJoined) merged.push(suffixJoined);
	    suffixSegs.forEach((s) => {
	      if (!merged.includes(s)) merged.push(s);
	    });
	    const informative = merged.filter((s) => looksInformative(s));
	    if (informative.length) return informative.slice(0, 6);
	    return merged.length ? [merged[merged.length - 1]] : [];
	  };

	  const collectFromPipes = () => {
	    const pipeParts = raw.split('|').map((s) => stripMeta(String(s || ''))).filter(Boolean);
	    if (pipeParts.length >= 4) {
	      const tail = pipeParts[pipeParts.length - 1] || '';
	      return tail ? [tail] : [];
	    }
	    return [];
	  };

	  const picked =
	    collectFromStarStarStar().length
	      ? collectFromStarStarStar()
	      : collectFromTriplePipes().length
	        ? collectFromTriplePipes()
	        : collectFromPipes();

	  if (!picked.length) {
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

	  const out = [];
	  picked.forEach((seg) => {
	    String(seg || '')
	      .split('#')
	      .map((s) => stripMeta(String(s || '')))
	      .filter(Boolean)
	      .forEach((s) => {
	        if (!out.includes(s)) out.push(s);
	      });
	  });

  return out;
};

const resolvePanMockPlaySources = async ({ raw, playFrom, playUrl, onUpdate } = {}) => {
  const panMockEnabled = readPanMockEnabledFromRaw(raw);
  if (panMockEnabled) panMockEnabledHint.value = true;
  const fromStr = typeof playFrom === 'string' ? playFrom.trim() : '';
  const urlStr = typeof playUrl === 'string' ? playUrl.trim() : '';
  if (!panMockEnabled || !fromStr || !urlStr) {
    return {
      panMockEnabled,
      playFrom: fromStr,
      playUrl: urlStr,
	      panMock189AccessByShareId: {},
	      panMockListErrors: {},
	      panMockResolvedByKey: {},
	    };
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
          const firstSeg = (u.split('#')[0] || '').trim();
          const idx = firstSeg.indexOf('$');
          const epUrl = idx >= 0 ? firstSeg.slice(idx + 1).trim() : firstSeg;
          const rawNames = extractRawNamesFromEpisodeUrl(epUrl);
          const rawName = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '').trim() : '';
          const { shareCode, accessCode } = extractTianyiShareCodeAndAccessCode(label, rawName);
          if (!shareCode) continue;
          listReqsRaw.push({ provider: '189', label, flag: `天意-${shareCode}`, accessCode: accessCode || '' });
          continue;
        }
        const firstSeg = (u.split('#')[0] || '').trim();
        const idx = firstSeg.indexOf('$');
        const epUrl = idx >= 0 ? firstSeg.slice(idx + 1).trim() : firstSeg;
        const rawNames = extractRawNamesFromEpisodeUrl(epUrl);
        const rawName = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '').trim() : '';
        const pass = parseMockPasscodeFromRawName(rawName);
        listReqsRaw.push({ provider, label, flag: label, passcode: pass || '' });
      }
    }

	    if (!listReqsRaw.length)
      return {
        panMockEnabled,
        playFrom: fromStr,
        playUrl: urlStr,
        panMock189AccessByShareId: {},
        panMockListErrors: {},
        panMockResolvedByKey: {},
      };

    const listReqs = new Map();
    listReqsRaw.forEach((it) => {
      const p = it && it.provider ? String(it.provider).trim() : '';
      const l = it && it.label ? String(it.label).trim() : '';
      if (!p || !l) return;
      const key = `${p}::${l}`;
      if (!listReqs.has(key)) listReqs.set(key, it);
    });

	    const resolvedVodByKey = new Map(); // `${provider}::${label}` -> vod_play_url
	    const resolvedKeys = new Set(); // `${provider}::${label}`
	    const tianyiAccessByShareId = new Map();
	    const errorByKey = new Map(); // `${provider}::${label}` -> error message
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
	        panMockListErrors: Object.fromEntries(Array.from(errorByKey.entries())),
	        panMockResolvedByKey: Object.fromEntries(Array.from(resolvedKeys.values()).map((k) => [k, true])),
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
		      const startedAt = Date.now();

      const call = async (path, body) => {
        const resp = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body || {}),
          credentials: 'include',
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data || data.ok === false) {
          const msg = data && data.message ? String(data.message) : `HTTP ${resp.status}`;
          throw new Error(msg);
        }
        return data && typeof data === 'object' ? data : null;
      };

      const flag = req && req.flag ? String(req.flag).trim() : '';
      const passcode = req && req.passcode ? String(req.passcode).trim() : '';
      const accessCode = req && req.accessCode ? String(req.accessCode).trim() : '';

      let data = null;
      try {
        if (provider === 'quark') data = await call('/api/pan/quark/list', { flag: flag || label, passcode });
        else if (provider === 'uc') data = await call('/api/pan/uc/list', { flag: flag || label, passcode });
        else if (provider === 'baidu') data = await call('/api/pan/baidu/list', { flag: flag || label, pwd: passcode });
        else if (provider === '139') data = await call('/api/pan/139/list', { flag: flag || label, passcode: passcode || '' });
        else if (provider === '189') data = await call('/api/pan/189/list', { flag: flag || label, accessCode });
      } catch (e) {
	        const msg = e && e.message ? String(e.message) : '请求失败';
	        smartDebugLog('pan_list_err', { provider, label, flag, ms: Math.max(0, Date.now() - startedAt), err: msg });
	        errorByKey.set(`${provider}::${label}`, msg);
	        emitPartial();
	        return;
	      }
	      if (!data) return;

			      const vod = extractPanListVodPlayUrl(data);
			      if (!vod) {
	            smartDebugLog('pan_list_empty', { provider, label, flag, ms: Math.max(0, Date.now() - startedAt) });
			        errorByKey.set(`${provider}::${label}`, PAN_MOCK_EMPTY_VOD_MARK);
			        emitPartial();
			        return;
			      }
	      resolvedVodByKey.set(`${provider}::${label}`, vod);
	      resolvedKeys.add(`${provider}::${label}`);
        try {
          const segs = vod
            .split('#')
            .map((s) => String(s || '').trim())
            .filter(Boolean);
          const sample = [];
          for (let i = 0; i < Math.min(3, segs.length); i += 1) {
            const seg = segs[i];
            const dollarIdx = seg.indexOf('$');
            const name = dollarIdx > 0 ? seg.slice(0, dollarIdx).trim() : seg;
            const id = dollarIdx >= 0 ? seg.slice(dollarIdx + 1).trim() : '';
            const rawNames = id ? extractRawNamesFromEpisodeUrl(id) : [];
            sample.push({
              name: name || '',
              rawNames: rawNames.slice(0, 3),
            });
          }
	          smartDebugLog('pan_list_ok', { provider, label, flag, ms: Math.max(0, Date.now() - startedAt), episodes: segs.length, sample });
	        } catch (_e) {}

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
	    return {
	      panMockEnabled,
	      playFrom: fromStr,
	      playUrl: urlStr,
	      panMock189AccessByShareId: {},
	      panMockListErrors: {},
	      panMockResolvedByKey: {},
	    };
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

const hasMagicEpisodeRules = computed(() => {
  if (compiledMagicEpisodeRules.value.length > 0) return true;
  // TMDB/Douban smart lists already have authoritative season/episode metadata; don't depend on user rules.
  if (tmdbMode.value && !tmdbMovieMode.value && tmdbSmartListAvailable.value && isSmartPanKey(selectedPanKey.value)) return true;
  if (tmdbMode.value && !tmdbMovieMode.value && selectedPanKey.value === DOUBAN_SMART_PAN_KEY && doubanSmartListAvailable.value) return true;
  return false;
});

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

const smartPanAliasMappingsSetting = computed(() => {
  const list = effectiveBootstrapSettings.value.smartPanAliasMappings;
  if (!Array.isArray(list)) return [];
  const out = [];
  const seen = new Set();
  list.forEach((it) => {
    const pan = it && it.pan != null ? String(it.pan).trim() : '';
    if (!pan) return;
    const aliases = it && it.aliases != null ? String(it.aliases).trim() : '';
    const key = pan.toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({ pan, aliases });
  });
  return out;
});

watch(
  () => `${props.tmdbType || ''}::${String(props.tmdbId || '')}`,
  () => refreshDoubanSeasonMeta(),
  { immediate: true }
);

watch(
  () => {
    const m = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    return m && Number.isFinite(Number(m.updatedAt)) ? Number(m.updatedAt) : 0;
  },
  () => {
    try {
      if (!tmdbMode.value || tmdbMovieMode.value) return;
      resetTMDBSmartCaches();
    } catch (_e) {}
  }
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
		    try {
		      await ensureDoubanSeasonMetaFetchedIfNeeded();
		    } catch (_e) {}
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
  const smartEntries = Array.isArray(smartPanEntries.value) ? smartPanEntries.value : [];
  const tmdbPanOpts = Array.isArray(tmdbSitePanOptions.value) ? tmdbSitePanOptions.value : [];
  const lines = [
	    `debug=1`,
	    `tmdbId=${Number(p.tmdbId || 0)}`,
	    `tmdbType=${String(p.tmdbType || '')}`,
	    `searchType=${String(p.searchType || '')}`,
	    `tmdbMode=${tmdbMode.value ? '1' : '0'}`,
	    `smartListAvailable=${smartListAvailable.value ? '1' : '0'}`,
	    `smartPanEntries=${smartEntries.length}`,
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
    `selectedEpisodes=${selectedEpisodes.value.length}`,
    `selectedSeason=${Number(selectedSeason.value || 0)}`,
    `seasonTabs=${tabs.map((t) => t && t.label ? t.label : '').filter(Boolean).join(',')}`,
    `panOptions=${pans.length}`,
    `panLabels=${panLabels}`,
    `tmdbSitePanOptions=${tmdbPanOpts.length}`,
    `aggregatedSources=${sources.length}`,
    `smartDetailCacheOk=${smartDetailCacheOk}`,
    `smartDetailCacheFail=${smartDetailCacheFail}`,
    `smartDetailCacheCooldown=${smartDetailCacheCooldown}`,
    `sourcesLoading=${sourcesLoading.value ? '1' : '0'}`,
    `sourcesSearchDone=${sourcesSearchDone.value ? '1' : '0'}`,
    `sourcesQueue=${sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0}`,
    `smartPick=${pickDbg ? JSON.stringify(pickDbg) : ''}`,
  ];
  try {
    const events = Array.isArray(smartDebugEvents.value) ? smartDebugEvents.value : [];
    if (events.length) {
      lines.push('');
      lines.push('smartEvents=');
      events.slice(-40).forEach((e) => {
        try {
          lines.push(JSON.stringify(e));
        } catch (_e) {}
      });
    }
  } catch (_e) {}
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
  const aliasMapRows = Array.isArray(smartPanAliasMappingsSetting.value) ? smartPanAliasMappingsSetting.value : [];
  const aliasMap = new Map();
  aliasMapRows.forEach((it) => {
    const panKey = it && it.pan ? String(it.pan).trim().toLowerCase() : '';
    if (!panKey) return;
    const aliases = String((it && it.aliases) || '')
      .replaceAll('，', ',')
      .split(',')
      .map((s) => String(s || '').trim().toLowerCase())
      .filter(Boolean);
    if (!aliasMap.has(panKey)) aliasMap.set(panKey, aliases);
  });

  const out = [];
  const seen = new Set();
  list.forEach((t) => {
    const s = typeof t === 'string' ? t.trim() : '';
    if (!s) return;
    const key = s.toLowerCase();
    if (!key) return;
    const aliases = aliasMap.get(key) || [];
    const tokens = [key].concat(aliases);
    tokens.forEach((tk) => {
      const x = String(tk || '').trim().toLowerCase();
      if (!x || seen.has(x)) return;
      seen.add(x);
      out.push(x);
    });
  });
  return out;
});

const smartPanMatchLabelText = (label) => {
  const raw = typeof label === 'string' ? label.trim() : '';
  if (!raw) return '';
  const cut = raw.includes('-') ? (raw.split('-')[0] || '').trim() : raw;
  return String(cut || '').toLowerCase();
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

const smartSplitDisplayPathSegments = (nameRaw) => {
  const name = typeof nameRaw === 'string' ? nameRaw : '';
  if (!name) return [];
  const cut = (() => {
    const idx = name.indexOf('$');
    return idx >= 0 ? name.slice(0, idx) : name;
  })();
  return String(cut || '')
    .split(/[\\/]+/g)
    .map((s) => String(s || '').trim())
    .filter((s) => s);
};

const smartEpisodePathLayers = (ep) => {
  const rawNames =
    ep && ep.url != null ? extractRawNamesFromEpisodeUrl(String(ep.url || '')) : [];
  let fileName = '';
  for (let i = 0; i < rawNames.length; i += 1) {
    const t = String(rawNames[i] || '').trim();
    if (!t) continue;
    fileName = t;
    break;
  }
  const segs = smartSplitDisplayPathSegments(ep && ep.name != null ? String(ep.name || '') : '');
  const currentDir = segs.length ? String(segs[segs.length - 1] || '').trim() : '';
  const parentDir = segs.length > 1 ? String(segs[segs.length - 2] || '').trim() : '';
  return { fileName: String(fileName || '').trim(), currentDir, parentDir, rawNames };
};

const smartExtractSeasonMarkerText = (textRaw) => {
  const text = typeof textRaw === 'string' ? textRaw.trim() : '';
  if (!text) return '';
  const found = new Set();
  const pushSeason = (nRaw) => {
    const n = Number.isFinite(Number(nRaw)) ? Math.floor(Number(nRaw)) : 0;
    if (n > 0 && n <= 99) found.add(n);
  };
  const parseNum = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return 0;
    const digits = s.replace(/[０-９]/g, (ch) => String('０１２３４５６７８９'.indexOf(ch)));
    if (/^\d+$/.test(digits)) return Number.parseInt(digits, 10) || 0;
    return parseChineseNumeralToInt(s);
  };

  text.replace(/(?:^|[\s._-])S\s*(\d{1,2})(?:$|[\s._-])/gi, (_m, s1) => {
    pushSeason(s1);
    return _m;
  });
  text.replace(/\bSeason\s*(\d{1,2})\b/gi, (_m, s1) => {
    pushSeason(s1);
    return _m;
  });
  text.replace(/第\s*([0-9０-９一二三四五六七八九十百千两零〇]{1,16})\s*季/gi, (_m, s1) => {
    pushSeason(parseNum(s1));
    return _m;
  });

  if (found.size !== 1) return '';
  const only = Array.from(found)[0];
  return Number.isFinite(Number(only)) && Number(only) > 0 ? `第${Number(only)}季` : '';
};

const smartGuessQualityByLayers = ({ fileName = '', currentDir = '', parentDir = '' } = {}) => {
  const qFile = smartGuessQuality(fileName);
  if (qFile) return qFile;
  const qCurr = smartGuessQuality(currentDir);
  if (qCurr) return qCurr;
  if (smartExtractSeasonMarkerText(currentDir)) {
    const qParent = smartGuessQuality(parentDir);
    if (qParent) return qParent;
  }
  return '';
};

const extractEpisodeCandidateTexts = (ep) => {
  const layers = smartEpisodePathLayers(ep);
  const rawNames = Array.isArray(layers.rawNames) ? layers.rawNames : [];

  const displayName = ep && ep.name != null ? String(ep.name || '').trim() : '';
  const rawLooksUseful = rawNames.some((n) => isInformativeEpisodeText(n));

  const out = [];
  const push = (s) => {
    const v = typeof s === 'string' ? s.trim() : '';
    if (!v) return;
    if (!out.includes(v)) out.push(v);
  };
  if (layers.fileName) push(layers.fileName);
  if (!rawLooksUseful && !layers.fileName && displayName) push(displayName);
  rawNames.forEach((n) => push(n));
  const fileHasSeason = !!smartExtractSeasonMarkerText(layers.fileName);
  if (!fileHasSeason && layers.currentDir) {
    const currentMarker = smartExtractSeasonMarkerText(layers.currentDir);
    if (currentMarker) push(currentMarker);
    push(layers.currentDir);
    if (!currentMarker) {
      const qCurr = smartGuessQuality(layers.currentDir);
      if (qCurr && layers.parentDir) {
        const parentMarker = smartExtractSeasonMarkerText(layers.parentDir);
        if (parentMarker) {
          push(parentMarker);
          push(layers.parentDir);
        }
      }
    }
  }
  if (ep && ep.name != null && rawLooksUseful) {
    if (!layers.fileName || displayName !== layers.fileName) push(displayName);
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
  // Strip season markers and any trailing subtitles after them so "xxx 第1季 雪域" collapses to "xxx".
  try {
    out = String(out || '')
      .replace(/第\s*([0-9０-９]{1,3}|[一二三四五六七八九十百千两零〇]{1,16})\s*季.*$/gi, '')
      .replace(/\bseason\s*\d{1,3}\b.*$/gi, '')
      .replace(/\bS\d{1,2}\b.*$/gi, '')
      .trim();
  } catch (_e) {}
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

onMounted(() => {
  // Register this watcher after mount to avoid TDZ issues (it reads `selectedPanKey`).
  try {
    const stop = watch(
      () => `${tmdbMode.value ? '1' : '0'}|${tmdbMovieMode.value ? '1' : '0'}|${selectedPanKey.value}`,
      () => {
        if (!tmdbMode.value || tmdbMovieMode.value) return;
        if (!isSmartPanKey(selectedPanKey.value)) return;
        rawListMode.value = false;
        autoRawListMode.value = false;
      },
      { immediate: true }
    );
    cleanupFns.push(stop);
  } catch (_e) {}
});

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

	const extractSeasonEpisodeFromText = (text, rules, cleanRules) => {
	  const raw0 = typeof text === 'string' ? text.trim() : String(text || '').trim();
	  const s = cleanMagicEpisodeText(raw0, cleanRules);
	  if (!raw0 && !s) return { season: 0, episode: 0 };

	  // Backend may already normalize episode markers into filenames (e.g. "S01E001" / "E001").
	  // Accept these directly without relying on `magicEpisodeRules`.
	  // IMPORTANT: try the raw text first (clean rules may remove markers).
	  const parseNormalized = (input) => {
	    const t = typeof input === 'string' ? input : '';
	    if (!t) return null;
	    const mm = t.match(/S\s*0*(\d{1,2})\s*E\s*0*(\d{1,5})/i);
	    if (mm && mm[1] && mm[2]) {
	      const seasonRaw = Number.parseInt(String(mm[1]), 10);
	      const episodeRaw = Number.parseInt(String(mm[2]), 10);
	      const season = Number.isFinite(seasonRaw) && seasonRaw >= 0 && seasonRaw <= 99 ? seasonRaw : 0;
	      const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
	      if (episode) return { season, episode };
	    }
	    const me = t.match(/\bE\s*0*(\d{1,5})\b/i);
	    if (me && me[1]) {
	      const episodeRaw = Number.parseInt(String(me[1]), 10);
	      const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
	      if (episode) return { season: 0, episode };
	    }
	    return null;
	  };
	  try {
	    const direct = parseNormalized(raw0) || parseNormalized(s);
	    if (direct) return direct;
	  } catch (_e) {}

	  if (!Array.isArray(rules) || !rules.length) return { season: 0, episode: 0 };
	  for (let i = 0; i < rules.length; i += 1) {
	    const rule = rules[i];
	    const re = rule && rule.re ? rule.re : null;
	    if (!re) continue;
	    const m = s.match(re);
	    if (!m) continue;

	    const picked =
	      (m.length > 2 && m[2] != null ? String(m[2]) : '') ||
	      (m.length > 1 && m[1] != null ? String(m[1]) : '') ||
	      String(m[0] || '');

	    // Strict: only accept backend-normalized markers like "S01E02" or "E02" (no extra front-end fallbacks).
	    const normalized = (() => {
	      if (rule && rule.replace) {
	        try {
	          const v = s.replace(re, rule.replace);
	          return typeof v === 'string' ? v : '';
	        } catch (_e) {
	          return '';
	        }
	      }
	      return picked;
	    })();

	    const mm = String(normalized || '').match(/S\s*0*(\d{1,2})\s*E\s*0*(\d{1,5})/i);
	    if (mm && mm[1] && mm[2]) {
	      const seasonRaw = Number.parseInt(String(mm[1]), 10);
	      const episodeRaw = Number.parseInt(String(mm[2]), 10);
	      const season = Number.isFinite(seasonRaw) && seasonRaw >= 0 && seasonRaw <= 99 ? seasonRaw : 0;
	      const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
	      if (episode) return { season, episode };
	      continue;
	    }

	    const me = String(normalized || '').match(/\bE\s*0*(\d{1,5})\b/i);
	    if (me && me[1]) {
	      const episodeRaw = Number.parseInt(String(me[1]), 10);
	      const episode = Number.isFinite(episodeRaw) && episodeRaw >= 1 && episodeRaw <= 99999 ? episodeRaw : 0;
	      if (episode) return { season: 0, episode };
	      continue;
	    }
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
  const allowAnyPan = !Array.isArray(panTokenOrder) || panTokenOrder.length === 0;

  const rawPans = sitePanOptions.value;
  if (!Array.isArray(rawPans) || rawPans.length < 1) return [];

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
    return smartPanTokenIdxOfLabel(label, panTokenOrder, { allowAny: allowAnyPan });
  };

  const candidatePans = [];
  const tokenSet = new Set();
  rawPans.forEach((pan) => {
    if (!pan || !pan.label || !Array.isArray(pan.episodes) || !pan.episodes.length) return;
    const idx = labelTokenIdxOf(pan.label);
    if (!allowAnyPan && idx < 0) return;
    tokenSet.add(idx);
    candidatePans.push({ pan, tokenIdx: idx });
  });
  if (!candidatePans.length) return [];

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
    return smartPanTokenIdxOfLabel(label, panTokenOrder);
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
	  const toInt = (v) => {
	    const n = Number.isFinite(Number(v)) ? Math.floor(Number(v)) : 0;
	    return Number.isFinite(n) ? n : 0;
	  };
	  const pick = (obj, keys) => {
	    if (!obj || typeof obj !== 'object') return undefined;
	    for (let i = 0; i < keys.length; i += 1) {
	      const k = keys[i];
	      if (k in obj) return obj[k];
	    }
	    return undefined;
	  };
	  list.forEach((it) => {
	    if (!it || typeof it !== 'object') return;
	    // Backend normalized TMDB payload uses:
	    //   { season, episodes, airDate, poster }
	    // but be tolerant of other shapes (e.g. raw TMDB fields).
	    const s = toInt(pick(it, ['season', 'seasonNumber', 'season_number', 'SeasonNumber']));
	    const n = toInt(pick(it, ['episodeCount', 'episodes', 'episode_count', 'EpisodeCount']));
	    if (s < 0 || n < 0) return;
	    const airDateRaw = pick(it, ['airDate', 'air_date', 'AirDate']);
	    out.push({ season: s, episodeCount: n, airDate: typeof airDateRaw === 'string' ? airDateRaw.trim() : '' });
	  });
	  out.sort((a, b) => a.season - b.season);
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

const doubanGlobalEpisodeNoOf = (seasonNo, episodeNo, metaOverride) => {
  const s = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;
  const e = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (s <= 0 || e <= 0) return 0;
  const dm =
    metaOverride && typeof metaOverride === 'object'
      ? metaOverride
      : doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object'
        ? doubanSeasonMeta.value
        : null;
  const seasonsRaw = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
  const seasons = seasonsRaw
    .map((it) => ({
      season: Number.isFinite(Number(it && it.season)) ? Math.floor(Number(it.season)) : 0,
      episodeCount: Number.isFinite(Number(it && it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0,
    }))
    .filter((it) => it.season > 0 && it.episodeCount > 0)
    .sort((a, b) => a.season - b.season);
  if (!seasons.length) return 0;
  let sum = 0;
  for (let i = 0; i < seasons.length; i += 1) {
    const it = seasons[i];
    if (!it) continue;
    if (it.season < s) sum += it.episodeCount;
    else if (it.season === s) return sum + e;
  }
  return 0;
};

const doubanSeasonEpisodeOfGlobal = (globalNo, metaOverride) => {
  const g = Number.isFinite(Number(globalNo)) ? Math.floor(Number(globalNo)) : 0;
  if (g <= 0) return { season: 0, episode: 0 };
  const dm =
    metaOverride && typeof metaOverride === 'object'
      ? metaOverride
      : doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object'
        ? doubanSeasonMeta.value
        : null;
  const seasonsRaw = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
  const seasons = seasonsRaw
    .map((it) => ({
      season: Number.isFinite(Number(it && it.season)) ? Math.floor(Number(it.season)) : 0,
      episodeCount: Number.isFinite(Number(it && it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0,
    }))
    .filter((it) => it.season > 0 && it.episodeCount > 0)
    .sort((a, b) => a.season - b.season);
  if (!seasons.length) return { season: 0, episode: g };
  let left = g;
  for (let i = 0; i < seasons.length; i += 1) {
    const it = seasons[i];
    if (!it || it.episodeCount <= 0) continue;
    if (left > it.episodeCount) {
      left -= it.episodeCount;
      continue;
    }
    return { season: it.season, episode: left };
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
  if (tmdbMovieMode.value) return 0;
  const base = tmdbLatestEpisode.value;
  const extra = maxEpisodeFromSourceBadges.value;
  if (base > 0 && extra === base + 1) return extra;
  if (base <= 0) {
    const picked = Math.max(0, extra);
    if (picked > 0) return picked;
    // No placeholder episodes; wait for TMDB/Douban meta to be ready.
    return 0;
  }
  return Math.max(0, base);
});


	const tmdbSmartEpisodes = computed(() => {
	  const total = tmdbSmartEpisodeCount.value;
	  if (!total) return [];
	  const out = [];
	  const m = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
	  const status = m && typeof m.status === 'string' ? m.status.trim() : '';
	  const ended = status === 'Ended';
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

  const ep = s.match(/(?:ep|episode|e)\s*(\d{1,5})/i);
  if (ep && ep[1]) {
    const episode = Number.parseInt(String(ep[1]), 10);
    if (Number.isFinite(episode) && episode >= 1 && episode <= 99999) return { season: 0, episode };
  }
  return { season: 0, episode: 0 };
};

const extractStrictSeasonHintFromPathLikeText = (text) => {
  const s = typeof text === 'string' ? text.trim() : '';
  if (!s) return 0;
  const segs = smartSplitDisplayPathSegments(s);
  const current = segs.length ? String(segs[segs.length - 1] || '') : s;
  const parent = segs.length > 1 ? String(segs[segs.length - 2] || '') : '';
  const marker = smartExtractSeasonMarkerText(current);
  const toInt = (mk) => {
    const m = String(mk || '').match(/第\s*(\d{1,2})\s*季/);
    if (!m || !m[1]) return 0;
    const n = Number.parseInt(String(m[1]), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  if (marker) return toInt(marker);
  if (smartGuessQuality(current)) {
    const parentMarker = smartExtractSeasonMarkerText(parent);
    if (parentMarker) return toInt(parentMarker);
  }
  return 0;
};

const computeGlobalNoFromMatch = (match, idx) => {
  const s = match && Number.isFinite(Number(match.season)) ? Math.floor(Number(match.season)) : 0;
  const e = match && Number.isFinite(Number(match.episode)) ? Math.floor(Number(match.episode)) : 0;
  if (s > 0 && e > 0) {
    const g = tmdbGlobalEpisodeNoOf(s, e);
    if (g > 0) return g;
  }
  if (e > 0) return e;
  return idx + 1;
};

const buildGlobalNoMapFromMatches = (matches) => {
  if (!Array.isArray(matches) || !matches.length) return [];
  const map = new Map();
  const unique = [];
  for (let i = 0; i < matches.length; i += 1) {
    const m = matches[i];
    const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
    const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
    if (s <= 0 || e <= 0) continue;
    const key = `${s}:${e}`;
    if (!map.has(key)) {
      map.set(key, 0);
      unique.push({ season: s, episode: e, key });
    }
  }
  unique.sort((a, b) => (a.season === b.season ? a.episode - b.episode : a.season - b.season));
  let g = 0;
  unique.forEach((it) => {
    g += 1;
    map.set(it.key, g);
  });
  const out = new Array(matches.length);
  for (let i = 0; i < matches.length; i += 1) {
    const m = matches[i];
    const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
    const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
    if (s > 0 && e > 0) {
      const key = `${s}:${e}`;
      out[i] = map.get(key) || 0;
    } else {
      out[i] = i + 1;
    }
  }
  return out;
};

const readTMDBSitePanSmartEntry = () => {
  if (!selectedPanSource.value || selectedPanSource.value.kind !== 'tmdb_site_pan') return null;
  const key = selectedPanSource.value && selectedPanSource.value.key ? String(selectedPanSource.value.key) : '';
  if (!key) return null;
  const cache = readTMDBSitePanCacheEntry(key);
  const sourceKey = cache && cache.sourceKey ? String(cache.sourceKey) : '';
  if (!sourceKey) return null;
  return tmdbSmartDetailCache.get(sourceKey) || null;
};

const buildTMDBSitePanBestGlobalByUrl = (entry) => {
  if (!entry) return null;
  const explicit =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.explicit)
      ? smartSourceExtractPrioritySetting.value.explicit
      : [];
  const orderKeys =
    smartSourceExtractPrioritySetting.value && Array.isArray(smartSourceExtractPrioritySetting.value.order)
      ? smartSourceExtractPrioritySetting.value.order
      : ['网盘'];
  const bestByUrl = new Map();
  const bestGlobalByUrl = new Map();
  const pushList = (globalNo, list) => {
    if (!Array.isArray(list) || !list.length) return;
    list.forEach((cand) => {
      const url = cand && cand.ep && cand.ep.url ? String(cand.ep.url) : '';
      if (!url) return;
      const prev = bestByUrl.get(url) || null;
      const better = !prev || smartCompareCandidates(prev, cand, { explicit, orderKeys }) > 0;
      if (!better) return;
      bestByUrl.set(url, cand);
      const gNext = Number.isFinite(Number(globalNo)) && Number(globalNo) > 0 ? Math.floor(Number(globalNo)) : 0;
      if (gNext > 0) bestGlobalByUrl.set(url, gNext);
    });
  };
  try {
    if (entry.episodeMap && typeof entry.episodeMap.forEach === 'function') {
      entry.episodeMap.forEach((list, keyNo) => pushList(keyNo, list));
    }
  } catch (_e) {}
  return bestGlobalByUrl;
};

// For magic matching:
// - raw list ALWAYS shows all episodes (no filtering)
// - episode buttons ONLY show episodes that match a rule (extracting season/episode)
const episodeMatchByIndex = computed(() => {
  if (tmdbSmartListAvailable.value && isTMDBSitePanKey(selectedPanKey.value) && rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  if (!eps.length) return [];

  const rules = compiledMagicEpisodeRules.value;
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  const buildMatchesByRules = () => {
    if (!rules.length) {
      return eps.map((ep, idx) => {
        const tmdbSeason = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
        const tmdbEp = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
        if (tmdbSeason > 0 && tmdbEp > 0) return { season: tmdbSeason, episode: tmdbEp };
        return { season: 0, episode: idx + 1 };
      });
    }
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

  const metaMode = episodeMetaModeEffective.value;
  if (selectedPanSource.value && selectedPanSource.value.kind === 'tmdb_site_pan' && (metaMode === 'tmdb' || metaMode === 'douban')) {
    const entry = readTMDBSitePanSmartEntry();
    const globalByUrl = buildTMDBSitePanBestGlobalByUrl(entry);
    const tmdbHasMultiSeason = (() => {
      const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
      const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
      return real.length >= 2;
    })();
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;

    return eps.map((ep, idx) => {
      const url = ep && ep.url ? String(ep.url) : '';
      const gFromUrl = globalByUrl && url ? globalByUrl.get(url) || 0 : 0;
      const g = Number.isFinite(Number(gFromUrl)) && Number(gFromUrl) > 0 ? Math.floor(Number(gFromUrl)) : idx + 1;

      if (metaMode === 'tmdb') {
        if (tmdbHasMultiSeason) {
          const mapped = tmdbSeasonEpisodeOfGlobal(g);
          const ms = mapped && Number.isFinite(Number(mapped.season)) ? Math.floor(Number(mapped.season)) : 0;
          const me = mapped && Number.isFinite(Number(mapped.episode)) ? Math.floor(Number(mapped.episode)) : 0;
          if (ms > 0 && me > 0) return { season: ms, episode: me };
        }
        return { season: 0, episode: g };
      }

      const mapped = doubanSeasonEpisodeOfGlobal(g, dm);
      const ds = mapped && Number.isFinite(Number(mapped.season)) ? Math.floor(Number(mapped.season)) : 0;
      const de = mapped && Number.isFinite(Number(mapped.episode)) ? Math.floor(Number(mapped.episode)) : 0;
      if (ds > 0 && de > 0) return { season: ds, episode: de };
      return { season: 0, episode: g };
    });
  }

  return buildMatchesByRules();
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
  if (tmdbSmartListAvailable.value && isTMDBSitePanKey(selectedPanKey.value) && rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  const total = eps.length;
  if (!total) return [];
  const isTmdbSitePan = tmdbMode.value && isTMDBSitePanKey(selectedPanKey.value);
  const useMetaMapping = isTmdbSitePan && (episodeMetaModeEffective.value === 'tmdb' || episodeMetaModeEffective.value === 'douban');
  const entry = useMetaMapping ? readTMDBSitePanSmartEntry() : null;
  const globalByUrl = useMetaMapping ? buildTMDBSitePanBestGlobalByUrl(entry) : null;
  const matches = episodeMatchByIndex.value;
  const hasMagic = hasMagicEpisodeRules.value;
  const suppressUnrecognized = tmdbMode.value;
  const tmdbMaxGlobal =
    tmdbMode.value && isTmdbSitePan
      ? (() => {
          if (episodeMetaModeEffective.value === 'douban') {
            const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
            const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
            const sum = seasons.reduce((acc, it) => {
              const n = Number.isFinite(Number(it && it.episodeCount)) ? Math.floor(Number(it.episodeCount)) : 0;
              return acc + (n > 0 ? n : 0);
            }, 0);
            if (sum > 0) return sum;
          }
          return Math.max(0, Number(tmdbSmartEpisodeCount.value) || 0);
        })()
      : 0;
  const canUseMatchGlobal =
    tmdbMode.value && !isTmdbSitePan && Array.isArray(matches) && matches.length === total;
  const globalMap = canUseMatchGlobal ? buildGlobalNoMapFromMatches(matches) : null;

  if (useMetaMapping && entry && tmdbMaxGlobal > 0) {
    const cache = readTMDBSitePanCacheEntry(selectedPanKey.value);
    const pans = cache && Array.isArray(cache.pans) ? cache.pans : [];
    const subKey = typeof playingTMDBSubPanKey.value === 'string' ? playingTMDBSubPanKey.value : '';
    const picked = (subKey && pans.find((p) => p && p.key === subKey)) || pans[0] || null;
    const panLabel = picked && picked.label != null ? String(picked.label) : '';
    const tmdbHasMultiSeason = (() => {
      const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
      const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
      return real.length >= 2;
    })();
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    const items = [];
    for (let g = 1; g <= tmdbMaxGlobal; g += 1) {
      const list = entry.episodeMap && entry.episodeMap.get ? entry.episodeMap.get(g) : null;
      const cands = Array.isArray(list) ? list.filter(Boolean) : [];
      if (!cands.length) continue;
      const filtered = panLabel ? cands.filter((c) => smartMatchPan(c, panLabel)) : cands;
      if (!filtered.length) continue;
      const mapped =
        episodeMetaModeEffective.value === 'douban'
          ? doubanSeasonEpisodeOfGlobal(g, dm)
          : tmdbHasMultiSeason
            ? tmdbSeasonEpisodeOfGlobal(g)
            : { season: 0, episode: g };
      const season = mapped && Number.isFinite(Number(mapped.season)) ? Number(mapped.season) : 0;
      const no = mapped && Number.isFinite(Number(mapped.episode)) ? Number(mapped.episode) : g;
      filtered.forEach((cand, idx) => {
        const ep = cand && cand.ep ? cand.ep : null;
        const url = ep && ep.url ? String(ep.url) : '';
        const name = ep && ep.name ? String(ep.name) : `第${no}集`;
        const feat = smartComputeCandidateFeatures(cand);
        const is4k = feat && Number(feat.qualityRank) === 3;
        items.push({
          key: `${g}-${idx}-${url}`,
          index: items.length,
          no,
          season,
          name,
          url,
          unmatched: false,
          displayNo: no,
          is4k,
        });
      });
    }
    if (items.length) return items;
  }

  const items = [];
  let unmatchedCount = 0;
  for (let idx = 0; idx < eps.length; idx += 1) {
    const ep = eps[idx];
    const url = (ep && ep.url ? String(ep.url) : '').trim();
    const name = (ep && ep.name ? String(ep.name) : '').trim() || `第${idx + 1}集`;
    const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
    const hay = `${name} ${rawNames.join(' ')}`.trim();
    const is4k = smartQualityRankOf(smartGuessQuality(hay)) === 3;
    const m = matches && matches[idx] && typeof matches[idx] === 'object' ? matches[idx] : { season: 0, episode: 0 };
    let season = Number.isFinite(Number(m.season)) ? Number(m.season) : 0;
    let no = Number.isFinite(Number(m.episode)) ? Number(m.episode) : 0;
    let gFromUrl = 0;
    if (useMetaMapping && globalByUrl) {
      const urlKey = url || (ep && ep.url ? String(ep.url) : '');
      if (urlKey && globalByUrl.has(urlKey)) gFromUrl = Number(globalByUrl.get(urlKey)) || 0;
    }
    if (useMetaMapping && (!Number.isFinite(gFromUrl) || gFromUrl <= 0)) {
      // In tmdb/douban display mode, only show episodes that are matched into the global mapping.
      // Unmatched files should stay in raw list, not in tmdb/douban episode buttons.
      continue;
    }
    if (tmdbMaxGlobal > 0) {
      const g = (globalMap && Number.isFinite(Number(globalMap[idx])) && Number(globalMap[idx]) > 0)
        ? Number(globalMap[idx])
        : (useMetaMapping
          ? (Number.isFinite(gFromUrl) && gFromUrl > 0
            ? gFromUrl
            : (episodeMetaModeEffective.value === 'douban'
              ? (doubanGlobalEpisodeNoOf(season, no, doubanSeasonMeta.value) || (Number.isFinite(no) && no > 0 ? no : idx + 1))
              : (tmdbGlobalEpisodeNoOf(season, no) || (Number.isFinite(no) && no > 0 ? no : idx + 1))))
          : (canUseMatchGlobal ? computeGlobalNoFromMatch(m, idx) : (
            season > 0 && no > 0
              ? tmdbGlobalEpisodeNoOf(season, no)
              : Number.isFinite(no) && no > 0
              ? no
              : idx + 1
          )));
      if (g > tmdbMaxGlobal) continue;
      if (useMetaMapping && (episodeMetaModeEffective.value === 'tmdb' || episodeMetaModeEffective.value === 'douban')) {
        if (episodeMetaModeEffective.value === 'douban') {
          const mapped = doubanSeasonEpisodeOfGlobal(g, doubanSeasonMeta.value);
          season = mapped && Number.isFinite(Number(mapped.season)) ? Number(mapped.season) : 0;
          no = mapped && Number.isFinite(Number(mapped.episode)) ? Number(mapped.episode) : g;
        } else {
          const tmdbHasMultiSeason = (() => {
            const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
            const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
            return real.length >= 2;
          })();
          if (tmdbHasMultiSeason) {
            const mapped = tmdbSeasonEpisodeOfGlobal(g);
            season = mapped && Number.isFinite(Number(mapped.season)) ? Number(mapped.season) : 0;
            no = mapped && Number.isFinite(Number(mapped.episode)) ? Number(mapped.episode) : g;
          } else {
            season = 0;
            no = g;
          }
        }
      }
    }

    if (hasMagic) {
      if (!Number.isFinite(no) || no <= 0) {
        if (suppressUnrecognized) {
          const fallbackNo = idx + 1;
          items.push({ key: `${idx}-${url}`, index: idx, no: fallbackNo, season, name, url, unmatched: false, displayNo: fallbackNo, is4k });
        } else {
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
            is4k,
          });
        }
        continue;
      }
      items.push({ key: `${idx}-${url}`, index: idx, no, season, name, url, unmatched: false, displayNo: no, is4k });
    } else {
      items.push({ key: `${idx}-${url}`, index: idx, no: idx + 1, season: 0, name, url, unmatched: false, displayNo: idx + 1, is4k });
    }
  }

  if (!items.length) return [];

  if (hasMagic) {
    const recognized = items.filter((it) => it && !it.unmatched && Number.isFinite(Number(it.no)) && Number(it.no) > 0);
    const unrecognized = suppressUnrecognized ? [] : items.filter((it) => it && it.unmatched);

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
    if (tmdbSmartListAvailable.value && isSmartPanKey(selectedPanKey.value)) {
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
	    if (tmdbMode.value && isTMDBSitePanKey(selectedPanKey.value)) {
	      if (episodeMetaModeEffective.value === 'douban') {
	        const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
	        const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
	        const real = seasons
	          .map((s) => ({
	            season: Number.isFinite(Number(s && s.season)) ? Math.floor(Number(s.season)) : 0,
	            label:
	              s && typeof s.displayLabel === 'string' && String(s.displayLabel).trim()
	                ? String(s.displayLabel).trim()
	                : '',
	          }))
	          .filter((s) => s.season > 0)
	          .sort((a, b) => a.season - b.season);
	        if (real.length >= 2) {
	          const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
	          return real.map((s) => ({
	            key: `S${s.season}`,
	            season: s.season,
	            label: s.label || (s.season <= 10 ? `第${cn[s.season]}季` : `第${s.season}季`),
	          }));
	        }
	      } else {
	        const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
	        const real = seasons
	          .map((s) => ({
	            season: Number.isFinite(Number(s && s.season)) ? Math.floor(Number(s.season)) : 0,
	          }))
	          .filter((s) => s.season > 0)
	          .sort((a, b) => a.season - b.season);
	        if (real.length >= 2) {
	          const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
	          return real.map((s) => ({
	            key: `S${s.season}`,
	            season: s.season,
	            label: s.season <= 10 ? `第${cn[s.season]}季` : `第${s.season}季`,
	          }));
	        }
	      }
	    }

	    const list = allDisplayedEpisodes.value;
	    if (!list.length) return [];
		  const doubanLabelBySeason = (() => {
		    if (selectedPanKey.value !== DOUBAN_SMART_PAN_KEY) return null;
		    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
		    const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
		    if (!seasons.length) return null;
		    const map = new Map();
		    seasons.forEach((s) => {
		      const sn = Number.isFinite(Number(s && s.season)) ? Math.floor(Number(s.season)) : 0;
		      const label =
		        s && typeof s.displayLabel === 'string' && String(s.displayLabel).trim()
		          ? String(s.displayLabel).trim()
		          : '';
		      if (sn > 0 && label) map.set(sn, label);
		    });
		    return map.size ? map : null;
		  })();
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
  if (tmdbMode.value) {
    // TMDB mode should not expose season-0/未分季 tabs.
    hasZeroSeason = false;
    hasSpecialSeason0 = false;
  }
  if (seasons.length < 2 && !(seasons.length >= 1 && hasSpecialSeason0)) return [];

  const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
	  const labelOf = (s) => {
	    const n = Number(s);
	    if (!Number.isFinite(n) || n <= 0) return '未分季';
	    if (doubanLabelBySeason && doubanLabelBySeason.has(n)) return String(doubanLabelBySeason.get(n) || '').trim() || '未分季';
	    if (n <= 10) return `第${cn[n]}季`;
	    return `第${n}季`;
	  };

  const tabs = seasons.map((s) => ({ key: `S${s}`, season: s, label: labelOf(s) }));
  if (hasZeroSeason) tabs.push({ key: 'S0', season: 0, label: hasSpecialSeason0 ? '特别篇' : '未分季' });
  return tabs;
});

const selectedSeason = ref(0);
const manualSeasonOverride = ref(false);
watch(
  () => seasonTabs.value.map((t) => t.key).join(','),
  () => {
    const tabs = seasonTabs.value;
    if (!tabs.length) {
      selectedSeason.value = 0;
      return;
    }
    const exists = tabs.some((t) => Number(t.season) === Number(selectedSeason.value));
    if (!exists) {
      const w = resumeWanted.value && typeof resumeWanted.value === 'object' ? resumeWanted.value : null;
      const wantSeason = w && Number.isFinite(Number(w.season)) ? Math.floor(Number(w.season)) : 0;
      if (wantSeason > 0) {
        const hit = tabs.find((t) => t && Number(t.season) === wantSeason) || null;
        if (hit) {
          selectedSeason.value = wantSeason;
          manualSeasonOverride.value = false;
          return;
        }
      }
      selectedSeason.value = Number(tabs[0].season) || 0;
      manualSeasonOverride.value = false;
    }
  },
  { immediate: true }
);

const selectSeason = (season, opts = {}) => {
  const n = Number(season);
  if (!Number.isFinite(n)) return;
  selectedSeason.value = n;
  selectedEpisodeGroup.value = '';
  if (opts && opts.fromUser) manualSeasonOverride.value = true;
};

const autoSelectSeasonForPlayingEpisode = () => {
  if (manualSeasonOverride.value) return;
  const panKey = String(selectedPanKey.value || '');
  const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
  if (!g) return;
  if (!isSmartPanKey(panKey)) return;
  if (!seasonTabs.value.length) return;
  let wantSeason = 0;
  if (panKey === DOUBAN_SMART_PAN_KEY) {
    const mapped = doubanSeasonEpisodeOfGlobal(g, doubanSeasonMeta.value);
    wantSeason = mapped && Number.isFinite(Number(mapped.season)) ? Math.floor(Number(mapped.season)) : 0;
  } else if (panKey === SMART_PAN_KEY) {
    const mapped = tmdbSeasonEpisodeOfGlobal(g);
    wantSeason = mapped && Number.isFinite(Number(mapped.season)) ? Math.floor(Number(mapped.season)) : 0;
  }
  if (wantSeason <= 0) return;
  const exists = seasonTabs.value.some((t) => t && Number(t.season) === wantSeason);
  if (!exists) return;
  if (Number(selectedSeason.value) === wantSeason) return;
  selectSeason(wantSeason);
};

const lastAutoSeasonCtx = ref({ panKey: '', episodeNo: 0, stamp: '' });
watch(
  () => {
    const panKey = String(selectedPanKey.value || '');
    const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    const stamp =
      panKey === DOUBAN_SMART_PAN_KEY
        ? `d:${dm && dm.updatedAt ? String(dm.updatedAt) : String((dm && Array.isArray(dm.seasons) ? dm.seasons.length : 0) || 0)}`
        : `t:${seasonTabs.value.length}`;
    return `${panKey}::${g}::${stamp}`;
  },
  () => {
    const panKey = String(selectedPanKey.value || '');
    const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
    if (!g) return;
    if (!(panKey === SMART_PAN_KEY || panKey === DOUBAN_SMART_PAN_KEY)) return;
    const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
    const stamp =
      panKey === DOUBAN_SMART_PAN_KEY
        ? `d:${dm && dm.updatedAt ? String(dm.updatedAt) : String((dm && Array.isArray(dm.seasons) ? dm.seasons.length : 0) || 0)}`
        : `t:${seasonTabs.value.length}`;
    const last = lastAutoSeasonCtx.value || {};
    if (last.panKey === panKey && Number(last.episodeNo) === g && String(last.stamp || '') === stamp) return;
    lastAutoSeasonCtx.value = { panKey, episodeNo: g, stamp };
    autoSelectSeasonForPlayingEpisode();
  },
  { immediate: true }
);

watch(
  () =>
    [
      selectedPanKey.value,
      rawListMode.value ? '1' : '0',
      episodeMetaModeEffective.value,
      tmdbSelectedSitePanKey.value,
      playingSmartEpisodeNo.value,
      currentPlayingEpisodeUrl.value,
    ].join('|'),
  () => {
    manualSeasonOverride.value = false;
  }
);

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

const syncPlayingEpisodeLocator = () => {
  if (!playerUrl.value) return;
  const selectedPan = String(selectedPanKey.value || '');
  if (isSmartPanKey(selectedPan)) {
    autoSelectSeasonForPlayingEpisode();
    try {
      smartDebugLog('sync_locator_apply', {
        module: 'play',
        mode: 'smart',
        rawList: rawListMode.value ? 1 : 0,
        panKey: selectedPan,
        query: `eps=${selectedEpisodes.value.length} seasonTabs=${seasonTabs.value.length}`,
      });
    } catch (_e) {}
    scheduleScrollToPlayingEpisode();
    return;
  }
  const idx = resolvePlayingIndexInCurrentList();
  if (idx >= 0) {
    if (Number(selectedEpisodeIndex.value) !== idx) setEpisodeIndex(idx, 'sync_playing_context');
    syncSeasonForIndex(idx);
    try {
      smartDebugLog('sync_locator_apply', {
        module: 'play',
        mode: 'site',
        rawList: rawListMode.value ? 1 : 0,
        panKey: selectedPan,
        idx,
        query: `idx=${idx} eps=${selectedEpisodes.value.length} seasonTabs=${seasonTabs.value.length}`,
      });
    } catch (_e) {}
    scheduleScrollToPlayingEpisode();
  }
};

const syncPlayingState = { token: 0, timer: 0 };

const isEpisodeUIReady = () => {
  if (rawListMode.value) {
    if (!rawListViewEl.value || rawListItems.value.length === 0) return false;
    const node = rawListViewEl.value.querySelector('.raw-list__row');
    return !!node;
  }
  if (!episodeButtonsEl.value || groupedDisplayedEpisodes.value.length === 0) return false;
  const node = episodeButtonsEl.value.querySelector('.episode-num-btn');
  return !!node;
};

const scheduleSyncPlayingLocator = () => {
  if (typeof window === 'undefined') return;
  syncPlayingState.token += 1;
  const token = syncPlayingState.token;
  let tries = 0;
  const maxTries = 40;
  try {
    smartDebugLog('sync_locator_try', {
      module: 'play',
      token,
      rawList: rawListMode.value ? 1 : 0,
      panKey: String(selectedPanKey.value || ''),
      query: `loading=${selectedPanAuxLoading.value ? 1 : 0} eps=${selectedEpisodes.value.length} rawItems=${rawListItems.value.length} groupItems=${groupedDisplayedEpisodes.value.length}`,
    });
  } catch (_e) {}
  if (syncPlayingState.timer) {
    window.clearTimeout(syncPlayingState.timer);
    syncPlayingState.timer = 0;
  }
  const run = () => {
    if (token !== syncPlayingState.token) return;
    if (!playerUrl.value) return;
    if (!isEpisodeUIReady()) {
      tries += 1;
      try {
        smartDebugLog('sync_locator_wait', {
          module: 'play',
          token,
          try: tries,
          rawList: rawListMode.value ? 1 : 0,
          panKey: String(selectedPanKey.value || ''),
          query: `loading=${selectedPanAuxLoading.value ? 1 : 0} eps=${selectedEpisodes.value.length} rawItems=${rawListItems.value.length} groupItems=${groupedDisplayedEpisodes.value.length} seasonTabs=${seasonTabs.value.length}`,
        });
      } catch (_e) {}
      if (tries <= maxTries) {
        syncPlayingState.timer = window.setTimeout(run, 60);
      }
      return;
    }
    nextTick(() => {
      if (token !== syncPlayingState.token) return;
      syncPlayingEpisodeLocator();
    });
  };
  run();
};

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

const isHttpPlayableUrl = (value) => {
  const s = typeof value === 'string' ? value.trim() : '';
  return !!s && /^https?:\/\//i.test(s);
};

const parseLabeledPlayUrlEntries = (payload) => {
  const arr = payload && Array.isArray(payload.url) ? payload.url : [];
  const entries = [];
  for (let i = 0; i + 1 < arr.length; i += 2) {
    const labelRaw = typeof arr[i] === 'string' ? arr[i].trim() : '';
    const urlRaw = typeof arr[i + 1] === 'string' ? arr[i + 1].trim() : '';
    if (!labelRaw || !urlRaw) continue;
    if (isHttpPlayableUrl(labelRaw)) continue;
    if (!isHttpPlayableUrl(urlRaw)) continue;
    entries.push({ label: labelRaw, url: urlRaw });
  }
  return entries;
};

const buildLocalProxyPlaybackUrl = ({ apiBase, sourceUrl, headers }) => {
  const base = normalizecatpawrunnerApiBase(apiBase);
  const target = typeof sourceUrl === 'string' ? sourceUrl.trim() : '';
  if (!base || !isHttpPlayableUrl(target)) return '';
  try {
    const u = new URL('proxy', base);
    u.searchParams.set('url', target);
    if (headers && typeof headers === 'object' && Object.keys(headers).length) {
      u.searchParams.set('header', JSON.stringify(headers));
    }
    return u.toString();
  } catch (_e) {
    return '';
  }
};

const resolvePlayTargetForPlayback = ({ payload, rawHeaders }) => {
  const headers = rawHeaders && typeof rawHeaders === 'object' ? rawHeaders : {};
  const fallbackUrl = pickFirstPlayableUrl(payload);
  if (!fallbackUrl) return { url: '', headers, needsProxy: false, proxySourceUrl: '' };
  if (!hasNonEmptyHeaders(headers)) return { url: fallbackUrl, headers, needsProxy: false, proxySourceUrl: '' };

  let sourceUrl = '';
  const direct = payload && typeof payload.url === 'string' ? payload.url.trim() : '';
  if (isHttpPlayableUrl(direct)) sourceUrl = direct;

  const labeledEntries = parseLabeledPlayUrlEntries(payload);
  if (labeledEntries.length) {
    const byLabel = (name) => {
      const n = String(name || '').trim().toLowerCase();
      return labeledEntries.find((it) => String(it && it.label ? it.label : '').trim().toLowerCase() === n) || null;
    };
    const proxyRawEntry = byLabel('代理raw');
    const rawEntry = byLabel('raw');
    if (proxyRawEntry && rawEntry && isHttpPlayableUrl(rawEntry.url)) {
      sourceUrl = rawEntry.url;
    } else if (labeledEntries.length === 1 && isHttpPlayableUrl(labeledEntries[0].url)) {
      sourceUrl = labeledEntries[0].url;
    }
  } else {
    const arr = payload && Array.isArray(payload.url) ? payload.url : [];
    const urls = arr
      .map((it) => (typeof it === 'string' ? it.trim() : ''))
      .filter((it) => isHttpPlayableUrl(it));
    if (urls.length === 1) sourceUrl = urls[0];
  }

  if (!sourceUrl) sourceUrl = fallbackUrl;
  const candidate = isHttpPlayableUrl(sourceUrl) ? sourceUrl : fallbackUrl;
  return { url: candidate, headers, needsProxy: true, proxySourceUrl: candidate };
};

const rewriteProxyUrlToBase = (urlString, apiBase, tvUser) => {
  const raw = typeof urlString === 'string' ? urlString.trim() : '';
  if (!raw) return '';
  const normalized = normalizecatpawrunnerApiBase(apiBase);
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

    // Drop origin/port from catpawrunner raw URL, then resolve against configured base
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

const buildProbeRequestHeaders = (rawHeaders) => {
  const out = { Range: 'bytes=0-0' };
  const h = rawHeaders && typeof rawHeaders === 'object' ? rawHeaders : {};
  const blocked = new Set([
    'origin',
    'referer',
    'host',
    'cookie',
    'user-agent',
    'content-length',
    'content-encoding',
    'accept-encoding',
    'connection',
    'range',
  ]);
  Object.keys(h).forEach((k) => {
    const key = typeof k === 'string' ? k.trim() : '';
    if (!key) return;
    const lower = key.toLowerCase();
    if (blocked.has(lower)) return;
    if (lower.startsWith('sec-')) return;
    const v = h[k];
    if (v == null) return;
    const s = Array.isArray(v) ? String(v[0] == null ? '' : v[0]).trim() : String(v).trim();
    if (!s) return;
    out[key] = s;
  });
  return out;
};

const probeFetchSmall = async (urlString, timeoutMs = 6000, requestHeaders = {}) => {
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
      referrerPolicy: 'no-referrer',
      headers: buildProbeRequestHeaders(requestHeaders),
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
  const base = normalizecatpawrunnerApiBase(apiBase);
  if (!base) throw new Error('catpawrunner 接口地址未设置');
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
  if (!token || !indexPath || !proxyPath) throw new Error('catpawrunner m3u8 register 返回无效');
  const indexUrl = new URL(indexPath.replace(/^\//, ''), base).toString();
  const proxyUrl = new URL(proxyPath.replace(/^\//, ''), base).toString();
  return { token, indexUrl, proxyUrl };
};

const registerCatProxyToken = async ({ apiBase, tvUser, url, headers }) => {
  const base = normalizecatpawrunnerApiBase(apiBase);
  if (!base) throw new Error('catpawrunner 接口地址未设置');
  const target = new URL('api/proxy/register', base);
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
  const proxyPath = data && data.proxy ? String(data.proxy).trim() : '';
  if (!token || !proxyPath) throw new Error('catpawrunner proxy register 返回无效');
  const proxyUrl = new URL(proxyPath.replace(/^\//, ''), base).toString();
  return { token, proxyUrl };
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
  // then fall back to catpawrunner m3u8 registration + proxy rewrite.
  if (!hasHeader) {
    try {
      await fetchM3U8Text({ url: playUrl, tvUser });
      return { url: playUrl, headers: playHeaders, reason: 'direct-m3u8-fetch-ok' };
    } catch (_e) {
      // continue to register flow
    }
  }

  // 1) Ask catpawrunner to fetch the m3u8 with required headers and give us both playlists.
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

  // Direct mode: use catpawrunner index playlist (same-origin), but segments stay upstream.
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
  inFlight: null,
  controller: null,
};
const pendingProxyRetry = ref(null);
const proxyRetryInFlight = ref(false);
const isPendingRetryForCurrentAttempt = (p) => {
  try {
    if (!p || typeof p !== 'object') return false;
    const panNow = (typeof playingPanKey.value === 'string' && playingPanKey.value)
      ? String(playingPanKey.value)
      : String(selectedPanKey.value || '');
    const idxNowRaw = Number.isFinite(Number(playingEpisodeIndex.value)) && Number(playingEpisodeIndex.value) >= 0
      ? Number(playingEpisodeIndex.value)
      : Number(selectedEpisodeIndex.value);
    const idxNow = Number.isFinite(idxNowRaw) ? Math.floor(Number(idxNowRaw)) : -1;
    return String(p.panKey || '') === panNow && Number(p.idx) === idxNow;
  } catch (_e) {
    return false;
  }
};
const triggerPendingProxyRetryNow = () => {
  try {
    const p = pendingProxyRetry.value && typeof pendingProxyRetry.value === 'object' ? pendingProxyRetry.value : null;
    if (!p) return;
    if (!isPendingRetryForCurrentAttempt(p)) return;
    if (proxyRetryInFlight.value || playRequestState.inFlight) return;
    if (playerPlaybackStarted.value || playerFirstFrameReady.value) return;
    pendingProxyRetry.value = null;
    proxyRetryInFlight.value = true;
    void requestPlay({ trigger: String(p.trigger || 'auto'), __forceProxy: true }).finally(() => {
      proxyRetryInFlight.value = false;
    });
  } catch (_e) {}
};
const clearPendingProxyRetryTimer = () => {};

const autoPlaySuppressedByUser = ref(false);

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
  // Temporarily disabled: server-side TMDB/Douban meta caching may be unavailable.
  return;
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
  const s = ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
  const e = ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
  if (s > 0 && e > 0) {
    const gt = tmdbGlobalEpisodeNoOf(s, e);
    if (gt > 0) return gt;
    if (String(selectedPanKey.value || '') === DOUBAN_SMART_PAN_KEY) {
      const gd = doubanGlobalEpisodeNoOf(s, e, doubanSeasonMeta.value);
      if (gd > 0) return gd;
    }
    return e;
  }
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

	const episodeGlobalNoOf = (ep) => {
	  if (!ep) return 0;
	  const direct = ep && Number.isFinite(Number(ep.__tmdbEpisode)) ? Math.floor(Number(ep.__tmdbEpisode)) : 0;
	  if (direct > 0) return direct;
	  const url = ep && ep.url != null ? String(ep.url) : '';
	  const m = String(url || '').match(/tmdb_ep:(\d{1,5})/i);
	  if (m && m[1]) {
	    const n = Number.parseInt(String(m[1]), 10);
	    if (Number.isFinite(n) && n > 0) return n;
	  }
	  return 0;
	};

const getTMDBEpisodeTotal = () => {
  if (!tmdbMode.value || tmdbMovieMode.value) return 0;
  const meta = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
  const metaTotal = meta && Number.isFinite(Number(meta.episodeCount)) ? Math.floor(Number(meta.episodeCount)) : 0;
  if (metaTotal > 0) return metaTotal;
  const smartTotal = Number.isFinite(Number(tmdbSmartEpisodeCount.value)) ? Math.floor(Number(tmdbSmartEpisodeCount.value)) : 0;
  return smartTotal > 0 ? smartTotal : 0;
};

const isSmartEpisodeNoValid = (no) => {
  const n = Number.isFinite(Number(no)) ? Math.floor(Number(no)) : 0;
  if (n <= 0) return false;
  const total = getTMDBEpisodeTotal();
  if (total > 0 && n > total) return false;
  return true;
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
if (typeof window !== 'undefined') {
  try {
    window.__mf_debug = window.__mf_debug || {};
    window.__mf_debug.tmdbSmartLastPickDebug = null;
  } catch (_e) {}
}
watch(
  () => tmdbSmartLastPickDebug.value,
  (v) => {
    if (typeof window === 'undefined') return;
    try {
      window.__mf_debug = window.__mf_debug || {};
      window.__mf_debug.tmdbSmartLastPickDebug = v || null;
    } catch (_e) {}
  }
);

watch(
  () => tmdbSmartDetailCacheVersion.value,
  () => {
	    try {
	      tmdbSitePanCache.forEach((cached, k) => {
	        if (!cached || cached.ok !== true || !cached.sourceKey) return;
	        const sourceKey = String(cached.sourceKey || '').trim();
	        if (!sourceKey) return;
        const entry = tmdbSmartDetailCache.get(sourceKey) || null;
        if (!entry || entry.ok === false || !Array.isArray(entry.pans)) return;
        if (entry.__listOnly === true || entry.__detailFetched === false) return;

	        const nextPans = entry.pans
	          .map((pan, idx) => {
	            const label = pan && pan.label != null ? String(pan.label) : '';
	            const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
	            const loading = !!(pan && pan.loading);
	            const error = pan && pan.error ? String(pan.error) : '';
	            const provider = pan && pan.provider ? String(pan.provider) : '';
	            return { key: `tpan${idx}`, label, episodes, loading, error, provider };
	          })
	          .filter((p) => p && p.label);

	        const prevSig = JSON.stringify(
	          (cached.pans || []).map((p) => [
	            p && p.label ? String(p.label) : '',
	            p && p.provider ? String(p.provider) : '',
	            p && p.loading ? 1 : 0,
	            p && Array.isArray(p.episodes) ? p.episodes.length : 0,
	            p && p.error ? 1 : 0,
	          ])
	        );
	        const nextSig = JSON.stringify(
	          nextPans.map((p) => [p.label, p.provider ? String(p.provider) : '', p.loading ? 1 : 0, Array.isArray(p.episodes) ? p.episodes.length : 0, p.error ? 1 : 0])
	        );
	        if (prevSig === nextSig) return;

	        tmdbSitePanCache.set(String(k), { ...cached, pans: nextPans, panMockEnabled: !!entry.panMockEnabled });
	        tmdbSitePanCacheVersion.value += 1;
	      });
	    } catch (_e) {}
	  }
	);

const smartPanMockLoading = computed(() => {
  if (!smartListAvailable.value) return false;
  // Site-mode: keep smart list in "loading" while detail/pan_mock is still resolving.
  if (!tmdbMode.value && isSmartPanActive.value) {
    if (introLoading.value || siteDetailBooting.value) return true;
    const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
    if (d && d.panMockEnabled === true && d.panMockResolving === true) return true;
  }
  void tmdbSmartDetailCacheVersion.value;
  try {
    const entries = Array.from(tmdbSmartDetailCache.values());
    return entries.some((e) => e && e.panMockEnabled === true && e.panMockResolved !== true && !!e.panMockInFlight);
  } catch (_e) {
    return false;
  }
});

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
const SMART_MANUAL_SWITCH_STORAGE_KEY = 'tv:play:smart:manual_switch:v1';
const SMART_MANUAL_SWITCH_CONTENT_STORAGE_KEY = 'tv:play:smart:manual_switch:content:v1';

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

const ensureSmartMetaReadyForMapping = (() => {
  let seq = 0;
  let key = '';
  let inFlight = null;
  return async ({ tmdbId = 0, type = '' } = {}) => {
    const id = Number.isFinite(Number(tmdbId)) ? Math.floor(Number(tmdbId)) : 0;
    const typ = typeof type === 'string' ? type.trim().toLowerCase() : '';
    if (!(id > 0) || typ !== 'tv') return;
    const k = `${id}::${typ}`;
    if (inFlight && key === k) return await inFlight;
    key = k;
    seq += 1;
    const at = seq;
    inFlight = (async () => {
      await Promise.allSettled([fetchTMDBMetaIfNeeded(), ensureDoubanSeasonMetaFetchedIfNeeded()]);
      if (at !== seq) return;
      try {
        refreshDoubanSeasonMeta();
      } catch (_e) {}
    })();
    try {
      return await inFlight;
    } finally {
      if (at === seq) inFlight = null;
    }
  };
})();

const isSmartMetaReadyNow = () => {
  try {
    if (!tmdbMode.value) return true;
    if (tmdbMovieMode.value) return true;
    const typ = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
    if (typ !== 'tv') return true;
    if (tmdbFetchState && tmdbFetchState.inFlight) return false;
    if (doubanSeasonFetchState && doubanSeasonFetchState.inFlight) return false;
    const tm = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
    if (!tm || !tm.title) return false;
    return true;
  } catch (_e) {
    return false;
  }
};
const isSmartTMDBMetaReadyNow = () => {
  try {
    if (!tmdbMode.value) return true;
    if (tmdbMovieMode.value) return true;
    const typ = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
    if (typ !== 'tv') return true;
    if (tmdbFetchState && tmdbFetchState.inFlight) return false;
    const tm = tmdbMeta.value && typeof tmdbMeta.value === 'object' ? tmdbMeta.value : null;
    if (!tm || !tm.title) return false;
    return true;
  } catch (_e) {
    return false;
  }
};

const smartTMDBSeasonsSignature = () => {
  const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
  return seasons
    .filter((it) => it && Number.isFinite(Number(it.season)) && Number(it.season) > 0)
    .map((it) => `${Math.floor(Number(it.season))}:${Math.floor(Number(it.episodeCount || 0))}`)
    .join('|');
};

const smartDoubanMetaSignature = () => {
  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const u = dm && Number.isFinite(Number(dm.updatedAt)) ? Number(dm.updatedAt) : 0;
  return u > 0 ? u : 0;
};

const smartRebuildTMDBSmartEntryFromPlaySources = (entry, playFrom, playUrl, { fromPanMock = false, forceIndex = false } = {}) => {
  if (!entry || entry.ok === false) return;
  const pf = typeof playFrom === 'string' ? playFrom : '';
  const pu = typeof playUrl === 'string' ? playUrl : '';
  entry.lastPlayFrom = pf;
  entry.lastPlayUrl = pu;

  const pans = parsePlaySources(pf, pu, {
    panMockEnabled: !!(entry && entry.panMockEnabled),
    panMockResolving: !!(entry && entry.panMockEnabled && entry.panMockResolved !== true),
    panMockListErrors: entry && entry.panMockListErrors && typeof entry.panMockListErrors === 'object' ? entry.panMockListErrors : {},
    panMockResolvedByKey: entry && entry.panMockResolvedByKey && typeof entry.panMockResolvedByKey === 'object' ? entry.panMockResolvedByKey : {},
  });
  entry.pans = Array.isArray(pans) ? pans : [];
  entry.episodeMap = new Map();
  entry.episodeMapLoose = new Map();

  const finalizeUpdate = () => {
    try {
      entry.__updateSeq = (Number.isFinite(Number(entry.__updateSeq)) ? Number(entry.__updateSeq) : 0) + 1;
      const waiters = entry.__waiters && entry.__waiters.size ? Array.from(entry.__waiters) : [];
      waiters.forEach((fn) => {
        try {
          if (typeof fn === 'function') fn();
        } catch (_e) {}
      });
    } catch (_e) {}
  };

  // TMDB-first mapping: build candidates as soon as TMDB meta is ready.
  // Douban mapping can arrive later and will trigger reindex via smartMaybeReindexTMDBSmartEntry.
  // Do NOT block detail/list API requests; they can keep filling `pans` and `lastPlay*`.
  if (!forceIndex && tmdbMode.value && contentKind.value === 'series' && !isSmartTMDBMetaReadyNow()) {
    entry.__indexedTmdbSig = '';
    entry.__indexedDoubanSig = 0;
    finalizeUpdate();
    return;
  }

  const panTokenOrder = compiledSmartPanMatchTokens.value;
  const labelTokenIdxOf = (label) => {
    return smartPanTokenIdxOfLabel(label, panTokenOrder);
  };

  const srcTitleLower = entry && typeof entry.srcTitleLower === 'string' ? entry.srcTitleLower : '';
  const srcRemarkLower = entry && typeof entry.srcRemarkLower === 'string' ? entry.srcRemarkLower : '';

  const { keywordTokens } = compiledSmartSourcePriorityTokenGroups.value || {};
  const rules = compiledMagicEpisodeRules.value;
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  const tmdbHasMultiSeason = (() => {
    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
    const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
    return real.length >= 2;
  })();
  const tmdbSeasonExists = (seasonNo) => {
    const s = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;
    if (s <= 0) return false;
    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
    return seasons.some((it) => it && Number.isFinite(Number(it.season)) && Math.floor(Number(it.season)) === s);
  };

  const dm = doubanSeasonMeta.value && typeof doubanSeasonMeta.value === 'object' ? doubanSeasonMeta.value : null;
  const doubanHasMultiSeason = (() => {
    const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
    const real = seasons.filter((it) => it && Number.isFinite(Number(it.season)) && Number(it.season) > 0 && Number(it.episodeCount) > 0);
    return real.length >= 2;
  })();
  const doubanSeason1Count = (() => {
    if (!dm || !Array.isArray(dm.seasons)) return 0;
    const hit = dm.seasons.find((it) => it && Number.isFinite(Number(it.season)) && Math.floor(Number(it.season)) === 1) || null;
    const n = hit && Number.isFinite(Number(hit.episodeCount)) ? Math.floor(Number(hit.episodeCount)) : 0;
    return n > 0 ? n : 0;
  })();
  const allowSeasonlessAsS01 = !tmdbHasMultiSeason && !doubanHasMultiSeason;
  const doubanSeasonExists = (seasonNo) => {
    const s = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;
    if (s <= 0) return false;
    const seasons = dm && Array.isArray(dm.seasons) ? dm.seasons : [];
    return seasons.some((it) => it && Number.isFinite(Number(it.season)) && Math.floor(Number(it.season)) === s);
  };

  (entry.pans || []).forEach((pan) => {
    const panLabel = pan && pan.label != null ? String(pan.label) : '';
    const panTokenIdx = labelTokenIdxOf(panLabel);
    const episodes = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
    const seasonlessSeemsGlobal = (() => {
      if (tmdbHasMultiSeason) return false;
      if (!doubanHasMultiSeason) return false;
      if (!(doubanSeason1Count > 0)) return false;
      try {
        for (let i = 0; i < episodes.length; i += 1) {
          const ep = episodes[i];
          if (!ep || !ep.url) continue;
          const texts = extractEpisodeCandidateTexts(ep);
          const match =
            Array.isArray(rules) && rules.length
              ? extractSeasonEpisodeFromCandidates(texts, rules, cleanRules)
              : { season: 0, episode: 0 };
          const normalizedMatch = normalizeMaybeGlobalSeasonEpisode(match);
          const seasonFromText = normalizedMatch && Number.isFinite(Number(normalizedMatch.season)) ? Math.floor(Number(normalizedMatch.season)) : 0;
          const epNo = normalizedMatch && Number.isFinite(Number(normalizedMatch.episode)) ? Math.floor(Number(normalizedMatch.episode)) : 0;
          if (seasonFromText <= 0 && epNo > doubanSeason1Count) return true; // e.g. E13 exists
        }
      } catch (_e) {}
      return false;
    })();
    episodes.forEach((ep) => {
      if (!ep || !ep.url) return;
      const texts = extractEpisodeCandidateTexts(ep);
      const primary = texts[0] || (ep && ep.name != null ? String(ep.name) : '') || '';
      const rawLower = buildCandidateLowerText(texts) || String(primary || '').toLowerCase();
      const match =
        Array.isArray(rules) && rules.length
          ? extractSeasonEpisodeFromCandidates(texts, rules, cleanRules)
          : { season: 0, episode: 0 };
      const normalizedMatch = normalizeMaybeGlobalSeasonEpisode(match);
      const seasonFromText = normalizedMatch && Number.isFinite(Number(normalizedMatch.season)) ? Math.floor(Number(normalizedMatch.season)) : 0;
      let seasonNo =
        seasonFromText > 0 ? seasonFromText : 0;
      const epNo =
        normalizedMatch && Number.isFinite(Number(normalizedMatch.episode)) ? Math.floor(Number(normalizedMatch.episode)) : 0;
      if (epNo <= 0) return;

      const hasExplicitSE =
        seasonFromText > 0 &&
        texts.some((t) => {
          const s = typeof t === 'string' ? t : '';
          return /S\d{1,2}\s*E\d{1,5}/i.test(s);
        });

      let seasonFromPath = false;
      if (seasonNo <= 0) {
        const hinted = texts.map((t) => extractStrictSeasonHintFromPathLikeText(t)).find((n) => n > 0) || 0;
        if (hinted > 0) {
          seasonNo = hinted;
          seasonFromPath = true;
        } else if (seasonlessSeemsGlobal) {
          // TMDB single-season but Douban multi-season:
          // if we can observe seasonless global numbering beyond Douban S1 (e.g. E13),
          // treat seasonless E01/E02/... as S01 episodes too.
          seasonNo = 1;
        } else if (allowSeasonlessAsS01) {
          seasonNo = 1;
        } else if (!tmdbHasMultiSeason && doubanHasMultiSeason && doubanSeason1Count > 0 && epNo > doubanSeason1Count) {
          // TMDB single-season but Douban multi-season:
          // allow seasonless "E13/E14..." global-style numbering (beyond Douban season 1),
          // so "E13" can map to global 13 even when we can't extract season markers.
          seasonNo = 1;
        } else {
          // In multi-season context, ignore seasonless numeric episodes to avoid mismatching across seasons.
          return;
        }
      }

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
        matchEpisode: epNo,
        hasSeasonMarker: !!(hasExplicitSE || seasonFromText > 0 || seasonFromPath),
        searchSeasonHint: 0,
        matchKeyword: computePriorityMatch(rawLower, Array.isArray(keywordTokens) ? keywordTokens : []),
        __fromPanMock: !!fromPanMock,
        __seMarkRank: hasExplicitSE || seasonFromText > 0 ? 3 : seasonFromPath ? 2 : seasonNo > 0 ? 1 : 0,
      };

      if (tmdbHasMultiSeason && seasonNo <= 0) {
        const list = entry.episodeMapLoose.get(epNo) || [];
        list.push(cand);
        entry.episodeMapLoose.set(epNo, list);
        return;
      }

      const keys = [];
      if (seasonNo > 0) {
        if (tmdbHasMultiSeason && tmdbSeasonExists(seasonNo)) {
          const k = tmdbGlobalEpisodeNoOf(seasonNo, epNo);
          if (k > 0) keys.push(k);
        }
        if (!tmdbHasMultiSeason || !tmdbSeasonExists(seasonNo)) {
          if (dm && doubanSeasonExists(seasonNo)) {
            const k = doubanGlobalEpisodeNoOf(seasonNo, epNo, dm);
            if (k > 0) keys.push(k);
          }
        }
        if (!keys.length && seasonNo === 1) keys.push(epNo);
      } else {
        keys.push(epNo);
      }

      if (!keys.length) return;
      keys.forEach((keyNo) => {
        const list = entry.episodeMap.get(keyNo) || [];
        list.push(cand);
        entry.episodeMap.set(keyNo, list);
      });
    });
  });

  entry.__indexedTmdbSig = smartTMDBSeasonsSignature();
  entry.__indexedDoubanSig = smartDoubanMetaSignature();
  finalizeUpdate();
};

const smartWaitTMDBSmartEntryUpdate = (entry, { sinceSeq = 0, timeoutMs = 12000 } = {}) => {
  const e = entry && typeof entry === 'object' ? entry : null;
  const since = Number.isFinite(Number(sinceSeq)) ? Number(sinceSeq) : 0;
  const to = Number.isFinite(Number(timeoutMs)) ? Math.max(0, Math.floor(Number(timeoutMs))) : 0;
  if (!e) return Promise.resolve(false);
  const cur = Number.isFinite(Number(e.__updateSeq)) ? Number(e.__updateSeq) : 0;
  if (cur > since) return Promise.resolve(true);
  if (!to) return Promise.resolve(false);
  return new Promise((resolve) => {
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      try {
        if (timer) window.clearTimeout(timer);
      } catch (_e) {}
      try {
        if (e.__waiters && e.__waiters.delete) e.__waiters.delete(onFire);
      } catch (_e) {}
    };
    const onFire = () => {
      try {
        const nowSeq = Number.isFinite(Number(e.__updateSeq)) ? Number(e.__updateSeq) : 0;
        if (nowSeq > since) {
          cleanup();
          resolve(true);
        }
      } catch (_e) {}
    };
    try {
      if (!e.__waiters) e.__waiters = new Set();
      e.__waiters.add(onFire);
    } catch (_e) {}
    const timer = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, to);
  });
};

const smartMaybeReindexTMDBSmartEntry = (entry) => {
  if (!entry || entry.ok === false) return;
  const wantTmdbSig = smartTMDBSeasonsSignature();
  const wantDoubanSig = smartDoubanMetaSignature();
  const haveTmdbSig = entry && typeof entry.__indexedTmdbSig === 'string' ? entry.__indexedTmdbSig : '';
  const haveDoubanSig = entry && Number.isFinite(Number(entry.__indexedDoubanSig)) ? Number(entry.__indexedDoubanSig) : 0;
  if (haveTmdbSig === wantTmdbSig && haveDoubanSig === wantDoubanSig) return;
  const pf = entry && typeof entry.lastPlayFrom === 'string' ? entry.lastPlayFrom : '';
  const pu = entry && typeof entry.lastPlayUrl === 'string' ? entry.lastPlayUrl : '';
  if (!pf || !pu) return;
  smartRebuildTMDBSmartEntryFromPlaySources(entry, pf, pu, { fromPanMock: true });
};

const smartGuessQuality = (hayRaw) => {
  const hay = String(hayRaw || '').toUpperCase();
  const has4k = /(2160P|2160|4K)/.test(hay);
  const has1080 = /(1080P|1080)/.test(hay);
  const has720 = /(720P|720)/.test(hay);
  const hitCount = (has4k ? 1 : 0) + (has1080 ? 1 : 0) + (has720 ? 1 : 0);
  if (hitCount >= 2) return '';
  if (has4k) return '4K';
  if (has1080) return '1080P';
  if (has720) return '720P';
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
  const layers = smartEpisodePathLayers(cand && cand.ep ? cand.ep : null);
  const srcTitleLower = cand && typeof cand.srcTitleLower === 'string' ? cand.srcTitleLower : '';
  const srcRemarkLower = cand && typeof cand.srcRemarkLower === 'string' ? cand.srcRemarkLower : '';
  const parts = [];
  if (layers.fileName) parts.push(String(layers.fileName).toLowerCase());
  if (layers.currentDir) parts.push(String(layers.currentDir).toLowerCase());
  if (!parts.length) {
    const rawLower = cand && typeof cand.rawLower === 'string' ? cand.rawLower : '';
    const epName = cand && cand.ep && cand.ep.name != null ? String(cand.ep.name) : '';
    return `${rawLower} ${String(epName || '').toLowerCase()} ${srcTitleLower} ${srcRemarkLower}`.trim();
  }
  return `${parts.join(' ')} ${srcTitleLower} ${srcRemarkLower}`.trim();
};

const smartComputeCandidateFeatures = (cand) => {
  const hayLower = smartBuildHayLower(cand);
  const layers = smartEpisodePathLayers(cand && cand.ep ? cand.ep : null);
  const quality = smartGuessQualityByLayers(layers);
  const qualityRank = smartQualityRankOf(quality);
  const enhanceMatch = computePriorityMatch(hayLower, SMART_ENHANCE_TOKENS);
  const idx = enhanceMatch && Array.isArray(enhanceMatch.indices) ? enhanceMatch.indices : [];
  const hasHdr = idx.includes(2);
  const fps60 = smartGuessFps60(hayLower) || idx.includes(0) || idx.includes(1);
  const tierRank = (() => {
    const qr = smartQualityRankOf(quality);
    // Speed-first strategy: only treat 4K/2160p as the primary goal.
    // HDR/DDP/60FPS are treated as bonus signals (UI/display/manual switch), not a stricter ranking requirement.
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

  const ase = Number.isFinite(Number(a.__seMarkRank)) ? Number(a.__seMarkRank) : 0;
  const bse = Number.isFinite(Number(b.__seMarkRank)) ? Number(b.__seMarkRank) : 0;
  if (ase !== bse) return bse - ase;

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
  const text = smartPanMatchLabelText(s);
  if (!text) return '';
  const tokens = Array.isArray(smartPanMatchTokensSetting.value) ? smartPanMatchTokensSetting.value : [];
  const aliasRows = Array.isArray(smartPanAliasMappingsSetting.value) ? smartPanAliasMappingsSetting.value : [];
  const aliasMap = new Map();
  aliasRows.forEach((it) => {
    const pan = it && it.pan != null ? String(it.pan).trim() : '';
    if (!pan) return;
    const key = pan.toLowerCase();
    const aliases = String((it && it.aliases) || '')
      .replaceAll('，', ',')
      .split(',')
      .map((x) => String(x || '').trim().toLowerCase())
      .filter(Boolean);
    aliasMap.set(key, aliases);
  });

  for (let i = 0; i < tokens.length; i += 1) {
    const t = typeof tokens[i] === 'string' ? tokens[i].trim() : '';
    if (!t) continue;
    const canonical = t.toLowerCase();
    const probes = [canonical].concat(aliasMap.get(canonical) || []);
    for (let j = 0; j < probes.length; j += 1) {
      const p = String(probes[j] || '').trim().toLowerCase();
      if (!p) continue;
      if (text.includes(p)) return t;
    }
  }
  return '';
};

const smartPanTokenIdxOfLabel = (label, tokenOrder, { allowAny = false } = {}) => {
  if (allowAny) return 0;
  const order = Array.isArray(tokenOrder) ? tokenOrder : [];
  if (!order.length) return -1;
  const s = smartPanMatchLabelText(label);
  if (!s) return -1;

  for (let i = 0; i < order.length; i += 1) {
    const t = String(order[i] || '').trim().toLowerCase();
    if (t && s.includes(t)) return i;
  }

  try {
    const cleaned = smartCleanPanToken(label);
    const c = String(cleaned || '').trim().toLowerCase();
    if (c) {
      for (let i = 0; i < order.length; i += 1) {
        const t = String(order[i] || '').trim().toLowerCase();
        if (!t) continue;
        if (t === c || t.includes(c) || c.includes(t)) return i;
      }
    }
  } catch (_e) {}

  return -1;
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

const smartLoadManualSwitchHint = (episodeNo) => {
  const gk = smartPlayedGroupKey(episodeNo);
  if (!gk) return null;
  try {
    const raw = sessionStorage.getItem(SMART_MANUAL_SWITCH_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const hit = groups[gk] && typeof groups[gk] === 'object' ? groups[gk] : null;
    if (!hit) return null;
    const updatedAt = Number.isFinite(Number(hit.updatedAt)) ? Number(hit.updatedAt) : 0;
    if (updatedAt > 0 && Date.now() - updatedAt > 30 * 24 * 60 * 60 * 1000) return null;
    return {
      candidateKey: hit.candidateKey != null ? String(hit.candidateKey) : '',
      siteKey: hit.siteKey != null ? String(hit.siteKey) : '',
      videoId: hit.videoId != null ? String(hit.videoId) : '',
      panLabel: hit.panLabel != null ? String(hit.panLabel) : '',
      switchKind: hit.switchKind != null ? String(hit.switchKind) : '',
      updatedAt,
    };
  } catch (_e) {
    return null;
  }
};

const smartSaveManualSwitchHint = (episodeNo, cand, switchKind = '') => {
  const gk = smartPlayedGroupKey(episodeNo);
  if (!gk || !cand) return;
  const kind = typeof switchKind === 'string' ? switchKind.trim() : '';
  if (!kind) return;
  try {
    const raw = sessionStorage.getItem(SMART_MANUAL_SWITCH_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const next = {
      ...groups,
      [gk]: {
        candidateKey: smartCandidateKey(cand) || '',
        siteKey: cand && cand.siteKey != null ? String(cand.siteKey) : '',
        videoId: cand && cand.videoId != null ? String(cand.videoId) : '',
        panLabel: cand && cand.panLabel != null ? String(cand.panLabel) : '',
        switchKind: kind,
        updatedAt: Date.now(),
      },
    };
    sessionStorage.setItem(SMART_MANUAL_SWITCH_STORAGE_KEY, JSON.stringify({ v: 1, groups: next }));
  } catch (_e) {}
};

const smartManualSwitchContentKey = () => {
  const k = getStableContentKey();
  return typeof k === 'string' ? k.trim() : '';
};

const smartLoadManualSwitchContentHint = () => {
  const ck = smartManualSwitchContentKey();
  if (!ck) return null;
  try {
    const raw = sessionStorage.getItem(SMART_MANUAL_SWITCH_CONTENT_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const hit = groups[ck] && typeof groups[ck] === 'object' ? groups[ck] : null;
    if (!hit) return null;
    const updatedAt = Number.isFinite(Number(hit.updatedAt)) ? Number(hit.updatedAt) : 0;
    if (updatedAt > 0 && Date.now() - updatedAt > 30 * 24 * 60 * 60 * 1000) return null;
    return {
      siteKey: hit.siteKey != null ? String(hit.siteKey) : '',
      siteName: hit.siteName != null ? String(hit.siteName) : '',
      spiderApi: hit.spiderApi != null ? String(hit.spiderApi) : '',
      videoId: hit.videoId != null ? String(hit.videoId) : '',
      panLabel: hit.panLabel != null ? String(hit.panLabel) : '',
      switchKind: hit.switchKind != null ? String(hit.switchKind) : '',
      updatedAt,
    };
  } catch (_e) {
    return null;
  }
};

const smartSaveManualSwitchContentHint = (cand, switchKind = '') => {
  const ck = smartManualSwitchContentKey();
  if (!ck || !cand) return;
  const kind = typeof switchKind === 'string' ? switchKind.trim() : '';
  if (!kind) return;
  try {
    const raw = sessionStorage.getItem(SMART_MANUAL_SWITCH_CONTENT_STORAGE_KEY) || '';
    const parsed = raw && raw.trim() ? JSON.parse(raw) : null;
    const groups = parsed && parsed.v === 1 && parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {};
    const next = {
      ...groups,
      [ck]: {
        siteKey: cand && cand.siteKey != null ? String(cand.siteKey) : '',
        siteName: cand && cand.siteName != null ? String(cand.siteName) : '',
        spiderApi: cand && cand.spiderApi != null ? String(cand.spiderApi) : '',
        videoId: cand && cand.videoId != null ? String(cand.videoId) : '',
        panLabel: cand && cand.panLabel != null ? String(cand.panLabel) : '',
        switchKind: kind,
        updatedAt: Date.now(),
      },
    };
    sessionStorage.setItem(SMART_MANUAL_SWITCH_CONTENT_STORAGE_KEY, JSON.stringify({ v: 1, groups: next }));
  } catch (_e) {}
};

const smartMatchPan = (cand, token) => {
  const t = typeof token === 'string' ? token.trim() : '';
  if (!t) return true;
  const label = cand && cand.panLabel != null ? String(cand.panLabel) : '';
  const want = t.toLowerCase();
  const normalized = smartPanMatchLabelText(label);
  if (normalized.includes(want)) return true;
  // Respect pan alias mappings: canonical token and aliases should be interchangeable.
  try {
    const cleaned = smartCleanPanToken(label);
    if (cleaned && cleaned.trim().toLowerCase() === want) return true;
  } catch (_e) {}
  return false;
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

const ensureTMDBSmartDetailCacheEntry = async (src, opts = {}) => {
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
      if (existing.__listOnly !== true && existing.__detailFetched !== false) return existing;
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
        if (debugEnabled.value) {
          const reason = opts && opts.reason != null ? String(opts.reason) : 'site_detail';
          const module = opts && opts.module ? String(opts.module) : (/^history_/i.test(reason) ? 'history' : 'smart');
          smartDebugLog('detail_req', {
            module,
            reason,
            siteKey,
            spiderApi,
            videoId,
          });
        }
      } catch (_e) {}
      try {
        const raw = await requestCatSpider({
        apiBase,
        username: tvUser,
        action: 'detail',
        spiderApi,
        payload: { id: videoId },
        timeoutMs: 15_000,
      });
      const d = extractDetailFromResponse(raw);

      const entry = {
        ok: true,
        failCount: 0,
        siteKey,
        spiderApi,
        siteName: src && src.siteName ? String(src.siteName) : siteKey,
        videoId,
        pans: [],
        episodeMap: new Map(),
        episodeMapLoose: new Map(),
        pickedFallback: new Map(),
        panMockEnabled: readPanMockEnabledFromRaw(raw),
        panMockResolved: false,
        panMockInFlight: null,
        panMockResolvedByKey: {},
        panMockListErrors: {},
        panMock189AccessByShareId: {},
        lastPlayFrom: '',
        lastPlayUrl: '',
        srcTitleLower: '',
        srcRemarkLower: '',
        __indexedTmdbSig: '',
        __indexedDoubanSig: 0,
        __updateSeq: 0,
        __waiters: new Set(),
        __listOnly: false,
        __detailFetched: false,
        __sourceKey: sourceKey,
      };

      tmdbSmartDetailCache.set(sourceKey, entry);
      tmdbSmartDetailCacheVersion.value += 1;

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
      entry.srcTitleLower = srcTitleLower;
      entry.srcRemarkLower = srcRemarkLower;

      const applyPlaySourcesToEntry = (playFrom, playUrl, { fromPanMock = false } = {}) => {
        smartRebuildTMDBSmartEntryFromPlaySources(entry, playFrom, playUrl, { fromPanMock });
        entry.__detailFetched = true;
        entry.__listOnly = false;
      };

      applyPlaySourcesToEntry(d.playFrom, d.playUrl, { fromPanMock: false });
      tmdbSmartDetailCache.set(sourceKey, entry);
      tmdbSmartDetailCacheVersion.value += 1;
      try {
        const episodeCount = (() => {
          try {
            return (entry.pans || []).reduce((acc, p) => acc + (Array.isArray(p && p.episodes) ? p.episodes.length : 0), 0);
          } catch (_e) {
            return 0;
          }
        })();
        smartDebugLog('detail_ok', {
          siteKey,
          spiderApi,
          videoId,
          panMockEnabled: entry.panMockEnabled ? 1 : 0,
          playFromLen: (d.playFrom || '').length,
          playUrlLen: (d.playUrl || '').length,
          pans: Array.isArray(entry.pans) ? entry.pans.length : 0,
          episodes: episodeCount,
          mapKeys: entry.episodeMap && entry.episodeMap.size != null ? entry.episodeMap.size : 0,
          looseKeys: entry.episodeMapLoose && entry.episodeMapLoose.size != null ? entry.episodeMapLoose.size : 0,
        });
      } catch (_e) {}

      // Do NOT block on pan_mock list resolving: update cache incrementally via `onUpdate`.
      // Matching logic can use detail results immediately and retry when list responses arrive.
      try {
        entry.panMockInFlight = resolvePanMockPlaySources({
          raw,
          playFrom: d.playFrom,
          playUrl: d.playUrl,
          onUpdate: (partial) => {
            try {
              if (!partial) return;
              if (partial.panMockResolvedByKey && typeof partial.panMockResolvedByKey === 'object') {
                entry.panMockResolvedByKey = { ...(entry.panMockResolvedByKey || {}), ...partial.panMockResolvedByKey };
              }
              if (partial.panMockListErrors && typeof partial.panMockListErrors === 'object') {
                entry.panMockListErrors = { ...(entry.panMockListErrors || {}), ...partial.panMockListErrors };
              }
              if (partial.panMock189AccessByShareId && typeof partial.panMock189AccessByShareId === 'object') {
                entry.panMock189AccessByShareId = { ...(entry.panMock189AccessByShareId || {}), ...partial.panMock189AccessByShareId };
              }
              applyPlaySourcesToEntry(partial.playFrom, partial.playUrl, { fromPanMock: true });
	              try {
	                const episodeCount = (() => {
	                  try {
	                    return (entry.pans || []).reduce((acc, p) => acc + (Array.isArray(p && p.episodes) ? p.episodes.length : 0), 0);
	                  } catch (_e) {
	                    return 0;
	                  }
	                })();
	                const want = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
	                const pickHitForWant = () => {
	                  try {
	                    if (!want || !entry.episodeMap || !entry.episodeMap.get) return { hit: 0, hit4k: 0, rawName: '' };
	                    const list = entry.episodeMap.get(want) || [];
	                    const cands = Array.isArray(list) ? list.filter(Boolean) : [];
	                    if (!cands.length) return { hit: 0, hit4k: 0, rawName: '' };
	                    let best = null;
	                    for (let i = 0; i < cands.length; i += 1) {
	                      const c = cands[i];
	                      if (!c) continue;
	                      if (!best || smartCompareCandidates(best, c) > 0) best = c;
	                    }
	                    if (!best) return { hit: cands.length, hit4k: 0, rawName: '' };
	                    const feat = smartComputeCandidateFeatures(best);
	                    const url = best && best.ep && best.ep.url != null ? String(best.ep.url) : '';
	                    const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
	                    const rawName = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '').trim() : '';
	                    const hit4k = feat && Number(feat.qualityRank) === 3 ? 1 : 0;
	                    return { hit: cands.length, hit4k, rawName };
	                  } catch (_e) {
	                    return { hit: 0, hit4k: 0, rawName: '' };
	                  }
	                };
	                const wantHit = pickHitForWant();
	                smartDebugLog('pan_mock_update', {
	                  siteKey,
	                  videoId,
	                  want,
	                  hit: wantHit.hit,
	                  hit4k: wantHit.hit4k,
	                  rawName: wantHit.rawName,
	                  pans: Array.isArray(entry.pans) ? entry.pans.length : 0,
	                  episodes: episodeCount,
	                  mapKeys: entry.episodeMap && entry.episodeMap.size != null ? entry.episodeMap.size : 0,
	                  looseKeys: entry.episodeMapLoose && entry.episodeMapLoose.size != null ? entry.episodeMapLoose.size : 0,
	                });
	              } catch (_e) {}
              tmdbSmartDetailCache.set(sourceKey, entry);
              tmdbSmartDetailCacheVersion.value += 1;
            } catch (_e) {}
          },
        })
          .then((resolved) => {
	            try {
	              if (resolved && (resolved.playFrom || resolved.playUrl)) {
                if (resolved.panMockResolvedByKey && typeof resolved.panMockResolvedByKey === 'object') {
                  entry.panMockResolvedByKey = { ...(entry.panMockResolvedByKey || {}), ...resolved.panMockResolvedByKey };
                }
                if (resolved.panMockListErrors && typeof resolved.panMockListErrors === 'object') {
                  entry.panMockListErrors = { ...(entry.panMockListErrors || {}), ...resolved.panMockListErrors };
                }
                if (resolved.panMock189AccessByShareId && typeof resolved.panMock189AccessByShareId === 'object') {
                  entry.panMock189AccessByShareId = { ...(entry.panMock189AccessByShareId || {}), ...resolved.panMock189AccessByShareId };
                }
                applyPlaySourcesToEntry(resolved.playFrom, resolved.playUrl, { fromPanMock: true });
              }
	              entry.panMockResolved = true;
	              try {
	                const want = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
	                let hit = 0;
	                let hit4k = 0;
	                let rawName = '';
	                try {
	                  if (want && entry.episodeMap && entry.episodeMap.get) {
	                    const list = entry.episodeMap.get(want) || [];
	                    const cands = Array.isArray(list) ? list.filter(Boolean) : [];
	                    hit = cands.length;
	                    for (let i = 0; i < cands.length; i += 1) {
	                      const c = cands[i];
	                      if (!c) continue;
	                      const feat = smartComputeCandidateFeatures(c);
	                      if (feat && Number(feat.qualityRank) === 3) {
	                        hit4k = 1;
	                        const url = c && c.ep && c.ep.url != null ? String(c.ep.url) : '';
	                        const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
	                        rawName = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '').trim() : '';
	                        break;
	                      }
	                    }
	                  }
	                } catch (_e2) {}
	                smartDebugLog('pan_mock_done', { siteKey, videoId, want, hit, hit4k, rawName });
	              } catch (_e) {}
	              tmdbSmartDetailCache.set(sourceKey, entry);
	              tmdbSmartDetailCacheVersion.value += 1;
	            } catch (_e) {}
            return resolved;
          })
          .catch(() => {
            try {
              entry.panMockResolved = true;
              entry.panMockInFlight = null;
              tmdbSmartDetailCache.set(sourceKey, entry);
              tmdbSmartDetailCacheVersion.value += 1;
            } catch (_e2) {}
            return null;
          });
      } catch (_e) {
        entry.panMockInFlight = null;
      }

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

const smartBuildSourcePool = async (opts = {}) => {
  const allowBootstrapSearch = !(
    opts &&
    typeof opts === 'object' &&
    opts.allowBootstrapSearch === false
  );
  const historySiteKey = resumeHistory.value && typeof resumeHistory.value.siteKey === 'string' ? resumeHistory.value.siteKey.trim() : '';
  const historySpider = resumeHistory.value && typeof resumeHistory.value.spiderApi === 'string' ? resumeHistory.value.spiderApi.trim() : '';
  const historyVideoId = resumeHistory.value && typeof resumeHistory.value.videoId === 'string' ? resumeHistory.value.videoId.trim() : '';
  const currentSiteKey = ((props.siteKey || '').trim() || historySiteKey).trim();
  const currentSpider = ((resolvedSpiderApiFinal.value || '').trim() || historySpider).trim();
  const currentVideoId = (((props.siteKey || '').trim() ? (props.videoId || '').trim() : '') || historyVideoId).trim();

  if (
    allowBootstrapSearch &&
    (!aggregatedSources.value || !aggregatedSources.value.length) &&
    !sourcesLoading.value &&
    !fromSearchEntry.value
  ) {
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
  tmdbMovieSmartResolving.value = true;

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
    return smartPanTokenIdxOfLabel(label, panTokenOrder);
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
    if (!hasRules) {
      smartDebugLog('movie_rules_empty', {
        siteKey: src0 && src0.siteKey ? String(src0.siteKey) : '',
        siteName: src0 && src0.siteName ? String(src0.siteName) : '',
      });
      return null;
    }

    let bestRule4k = null;
    let bestRule1080 = null;
    let bestRuleAny = null;
    let scanned = 0;
    let ruleHit = 0;
    let ruleHit4k = 0;
    let ruleHit1080 = 0;

    const better = (a, b) => (smartCompareCandidates(a, b, { explicit, orderKeys }) <= 0 ? a : b);
    const is4k = (cand) => Number((smartComputeCandidateFeatures(cand) || {}).qualityRank) === 3;
    const is1080 = (cand) => Number((smartComputeCandidateFeatures(cand) || {}).qualityRank) === 2;
    const ruleMatchedOf = (ep0) => (hasRules ? extractEpisodeCandidateTexts(ep0).some((t) => matchesAnyMagicRule(t, rules)) : false);

    for (let p = 0; p < entry.pans.length; p += 1) {
      const pan = entry.pans[p];
      const panLabel = pan && pan.label != null ? String(pan.label) : '';
      const eps = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
      const maxScan = Math.min(120, eps.length);
      for (let i = 0; i < maxScan; i += 1) {
        const ep0 = eps[i];
        if (!ep0 || !ep0.url) continue;
        scanned += 1;
        const cand = buildCandidate(src0, panLabel, ep0);
        const m = ruleMatchedOf(ep0);
        const q4k = is4k(cand);
        const q1080 = is1080(cand);
        if (m) {
          ruleHit += 1;
          if (q4k) ruleHit4k += 1;
          if (q1080) ruleHit1080 += 1;
          if (q4k) bestRule4k = bestRule4k ? better(bestRule4k, cand) : cand;
          if (q1080) bestRule1080 = bestRule1080 ? better(bestRule1080, cand) : cand;
          bestRuleAny = bestRuleAny ? better(bestRuleAny, cand) : cand;
        }
      }
    }
    const chosen = bestRule4k || bestRule1080 || bestRuleAny || null;
    smartDebugLog('movie_rules_eval', {
      siteKey: src0 && src0.siteKey ? String(src0.siteKey) : '',
      siteName: src0 && src0.siteName ? String(src0.siteName) : '',
      scanned,
      ruleHit,
      ruleHit4k,
      ruleHit1080,
      picked: chosen ? 1 : 0,
    });
    return chosen;
  };

  const task = (async () => {
    const pool = await smartBuildSourcePool();
    const sources = (Array.isArray(pool) ? pool : []).filter((s) => s && s.siteKey && s.spiderApi && s.videoId).slice(0, 18);
    smartDebugLog('movie_pool', { sources: sources.length, tmdbId, contentKey: getStableContentKey() });

    const out = [];
    const pushOutAndPublish = (item) => {
      if (!item) return;
      out.push(item);
      try {
        const snapshot = out
          .slice()
          .sort((a, b) => smartCompareCandidates(a && a.__tmdbMovieCand, b && b.__tmdbMovieCand, { explicit, orderKeys }))
          .map((ep0) => {
            const next = { ...ep0 };
            try {
              delete next.__tmdbMovieCand;
            } catch (_e) {}
            return next;
          });
        if (seqAtCall === tmdbMovieSmartFetchState.seq) tmdbMovieSmartEpisodes.value = snapshot;
      } catch (_e) {}
    };

    let settledBy4k = false;
    for (let i = 0; i < sources.length; i += 1) {
      if (seqAtCall !== tmdbMovieSmartFetchState.seq) return;
      const src0 = sources[i];
      const entry = await ensureTMDBSmartDetailCacheEntry(src0, { reason: 'tmdb_movie_smart', module: 'smart' });
      let picked = pickFromDetailEntry(src0, entry);
      if ((!picked || !picked.ep || !picked.ep.url) && entry && entry.panMockEnabled && entry.panMockResolved !== true) {
        smartDebugLog('movie_wait_panmock', {
          siteKey: src0 && src0.siteKey ? String(src0.siteKey) : '',
          siteName: src0 && src0.siteName ? String(src0.siteName) : '',
        });
        const startedAt = Date.now();
        let lastSeq = Number.isFinite(Number(entry.__updateSeq)) ? Number(entry.__updateSeq) : 0;
        while (Date.now() - startedAt < 12000) {
          const left = 12000 - (Date.now() - startedAt);
          if (left <= 0) break;
          try {
            await smartWaitTMDBSmartEntryUpdate(entry, { sinceSeq: lastSeq, timeoutMs: Math.min(1200, left) });
          } catch (_e) {}
          if (seqAtCall !== tmdbMovieSmartFetchState.seq) return;
          lastSeq = Number.isFinite(Number(entry.__updateSeq)) ? Number(entry.__updateSeq) : lastSeq;
          picked = pickFromDetailEntry(src0, entry);
          if (picked && picked.ep && picked.ep.url) break;
          if (entry && entry.panMockResolved === true) break;
        }
      }
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
      pushOutAndPublish(out[out.length - 1]);

      const feat = smartComputeCandidateFeatures(picked) || {};
      const qr = Number(feat.qualityRank) || 0;
      if (qr === 3) {
        settledBy4k = true;
        smartDebugLog('movie_pick_early_4k', {
          siteKey: picked.siteKey || src0.siteKey || '',
          siteName,
          videoId: picked.videoId || src0.videoId || '',
        });
        break;
      }
    }
    if (!settledBy4k) {
      out.sort((a, b) => smartCompareCandidates(a && a.__tmdbMovieCand, b && b.__tmdbMovieCand, { explicit, orderKeys }));
      out.forEach((ep0) => {
        try {
          delete ep0.__tmdbMovieCand;
        } catch (_e) {}
      });
      if (seqAtCall === tmdbMovieSmartFetchState.seq) tmdbMovieSmartEpisodes.value = out;
    }
    smartDebugLog('movie_pick_result', { candidates: out.length, settledBy4k: settledBy4k ? 1 : 0 });
  })();

  tmdbMovieSmartFetchState.inFlight = task;
  try {
    await task;
  } finally {
    if (tmdbMovieSmartFetchState.inFlight === task) tmdbMovieSmartFetchState.inFlight = null;
    if (seqAtCall === tmdbMovieSmartFetchState.seq) tmdbMovieSmartResolving.value = false;
  }
};

const smartSwitchPickState = { seq: 0, inFlight: null };
const smartSwitchSearchPumpState = { running: false };

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
  if (!tmdbSmartListAvailable.value) return false;
  if (playLoading.value || playRequestState.inFlight) {
    showPlayerToast('正则匹配中，请稍候');
    return false;
  }
  resumeSmartDetailWarmup();
  kickoffFullSearchIfNeeded({ detailWarmup: true });

  const eps = selectedEpisodes.value;
  const idxRaw = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : 0;
  const idx = idxRaw >= 0 ? idxRaw : 0;
  const ep = Array.isArray(eps) && eps.length ? eps[idx] : null;
  const episodeNo = resolveSmartEpisodeNo(ep);
  if (!episodeNo) return false;
  const useDesiredSeasonHint = selectedPanKey.value !== DOUBAN_SMART_PAN_KEY;
  const seasonNo = useDesiredSeasonHint && ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
  const seasonEpisodeNo =
    useDesiredSeasonHint && ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
  const tmdbHasMultiSeason = (() => {
    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
    const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
    return real.length >= 2;
  })();
  const requireSeasonedBase = contentKind.value === 'series';
  const mappingReadyPromise = ensureSmartMetaReadyForMapping({ tmdbId: props.tmdbId || 0, type: props.tmdbType || '' });

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

  const pickFromSource = async (
    src,
    {
      allowFetchDetail = false,
      roundPanToken = panToken,
      roundPanMode = panMode,
      roundPreferredPanToken = preferredPanToken,
      roundQualityMode = qualityMode,
    } = {}
  ) => {
    if (!src) return null;
    if (preferredSite && String(src.siteKey || '') !== preferredSite) return null;
    const entry = (() => {
      const sourceKey = smartBuildSourceKey(src);
      const hit = tmdbSmartDetailCache.get(sourceKey) || null;
      if (hit && hit.ok !== false && hit.episodeMap && hit.episodeMapLoose && hit.pans) return hit;
      return null;
    })();
    const ensured = !entry && allowFetchDetail ? await ensureTMDBSmartDetailCacheEntry(src, { reason: 'smart_pick_once', module: 'smart' }) : entry;
    const finalEntry = ensured || null;
    if (!finalEntry || finalEntry.ok === false) return null;
    if (seq !== smartSwitchPickState.seq) return null;
    await mappingReadyPromise;
    if (seq !== smartSwitchPickState.seq) return null;
    smartMaybeReindexTMDBSmartEntry(finalEntry);
    const requireSeasonedFinal =
      requireSeasonedBase &&
      (() => {
        const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
        const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
        return real.length >= 2;
      })();
    let cands = smartGetCandidatesFromEntry(finalEntry, { episodeNo, seasonNo, seasonEpisodeNo, requireSeasoned: requireSeasonedFinal });
    if ((!cands || !cands.length) && finalEntry.panMockEnabled && !finalEntry.panMockResolved) {
      const start = Date.now();
      let lastSeq = Number.isFinite(Number(finalEntry.__updateSeq)) ? Number(finalEntry.__updateSeq) : 0;
      while (Date.now() - start < 12000) {
        const left = 12000 - (Date.now() - start);
        if (left <= 0) break;
        await smartWaitTMDBSmartEntryUpdate(finalEntry, { sinceSeq: lastSeq, timeoutMs: Math.min(1500, left) });
        if (seq !== smartSwitchPickState.seq) return null;
        smartMaybeReindexTMDBSmartEntry(finalEntry);
        cands = smartGetCandidatesFromEntry(finalEntry, { episodeNo, seasonNo, seasonEpisodeNo, requireSeasoned: requireSeasonedFinal });
        if (cands && cands.length) break;
        const curSeq = Number.isFinite(Number(finalEntry.__updateSeq)) ? Number(finalEntry.__updateSeq) : lastSeq;
        lastSeq = Math.max(lastSeq, curSeq);
        if (finalEntry.panMockResolved) break;
      }
    }
    return smartPickBestFromList(cands, {
      explicit,
      orderKeys,
      excludeKey,
      excludeIdentity,
      excludePlayedSet: played && played.set ? played.set : null,
      panToken: roundPanToken,
      panMode: roundPanMode,
      preferredPanToken: roundPreferredPanToken,
      qualityMode: roundQualityMode,
    });
  };

  const buildOrderedSources = async ({ preferSameSite = true } = {}) => {
    const sources = await smartBuildSourcePool({ allowBootstrapSearch: false });
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

  const pickFromOrderedSources = async ({
    allowFetchDetail = false,
    preferSameSite = true,
    roundPanToken = panToken,
    roundPanMode = panMode,
    roundPreferredPanToken = preferredPanToken,
    roundQualityMode = qualityMode,
  } = {}) => {
    const maybeKickHistoryDetail = () => {
      try {
        if (!resumeHistory.value || typeof resumeHistory.value !== 'object') return;
        const siteKey = resumeHistory.value.siteKey || '';
        const spiderApi = resumeHistory.value.spiderApi || '';
        const videoId = resumeHistory.value.videoId || '';
        if (!siteKey || !spiderApi || !videoId) return;
        const src = {
          siteKey: String(siteKey),
          spiderApi: String(spiderApi),
          siteName:
            (resumeHistory.value.siteName ? String(resumeHistory.value.siteName) : '') || String(siteKey),
          videoId: String(videoId),
          videoTitle: resumeHistory.value.videoTitle ? String(resumeHistory.value.videoTitle) : '',
          videoRemark: resumeHistory.value.videoRemark ? String(resumeHistory.value.videoRemark) : '',
        };
        const key = smartBuildSourceKey(src);
        if (!key) return;
        const existing = tmdbSmartDetailCache.get(key) || null;
        if (existing && existing.__detailFetched === true) return;
        if (tmdbSmartDetailInFlight.get(key)) return;
        void ensureTMDBSmartDetailCacheEntry(src, { reason: 'history_background_detail', module: 'history' });
      } catch (_e) {}
    };
    maybeKickHistoryDetail();
	    const candidates = await buildOrderedSources({ preferSameSite });
	    if (!candidates.length) return null;

    // For manual switch/pan/quality actions, open detail requests as wide as current candidates
    // (bounded for safety) so we don't wait in small fixed batches like 5-by-5.
    const poolSize = Math.max(1, Math.min(50, candidates.length));
    const best = await runSmartPickPipeline({
      candidates,
      poolSize,
      perSiteSerial: false,
      compareBest: (a, b) => smartCompareCandidates(a, b, { explicit, orderKeys }),
      stopWhen: (cand) => isGoodEnough(cand),
      fetchPick: (src) =>
        pickFromSource(src, {
          allowFetchDetail,
          roundPanToken,
          roundPanMode,
          roundPreferredPanToken,
          roundQualityMode,
        }),
    });
    if (seq !== smartSwitchPickState.seq) return null;
    return best;
  };

  const startSearchPumpForSwitch = () => {
    const kind = typeof switchKind === 'string' ? switchKind.trim() : '';
    const needFullSearch = kind === 'switch' || kind === 'pan' || kind === 'quality';
    if (!needFullSearch || fromSearchEntry.value) return;
    if (smartSwitchSearchPumpState.running) return;
    smartSwitchSearchPumpState.running = true;
    void (async () => {
      try {
        for (let i = 0; i < 800; i += 1) {
          if (fromSearchEntry.value) break;
          if (sourcesSearchDone.value) break;
          if (sourcesError.value) break;
          await ensureFullSearchProgress({ stepOnly: true, pauseMs: 60 });
        }
      } finally {
        smartSwitchSearchPumpState.running = false;
      }
    })();
  };

  const currentPanToken = smartCurrentPanToken.value || '';
  const currentQualityMode = smartCurrentQualityModeKey.value || 'auto';
  const normalizeModeKey = (v) => {
    const k = typeof v === 'string' ? v.trim() : '';
    return k || 'auto';
  };
  const selectRoundsByKind = () => {
    const kind = typeof switchKind === 'string' ? switchKind.trim() : '';
    if (kind === 'switch') {
      // 1) any pan + 4K
      // 2) any pan + any quality
      return [
        { panMode: '', panToken: '', preferredPanToken: currentPanToken, qualityMode: '4k', label: 'switch_r1' },
        { panMode: '', panToken: '', preferredPanToken: '', qualityMode: 'auto', label: 'switch_r2' },
      ];
    }
    if (kind === 'pan') {
      // 1) selected pan + current quality
      // 2) selected pan + any quality
      const selectedPanToken = typeof panToken === 'string' ? panToken.trim() : '';
      return [
        { panMode: 'require', panToken: selectedPanToken, preferredPanToken: '', qualityMode: normalizeModeKey(currentQualityMode), label: 'pan_r1' },
        { panMode: 'require', panToken: selectedPanToken, preferredPanToken: '', qualityMode: 'auto', label: 'pan_r2' },
      ];
    }
    if (kind === 'quality') {
      // 1) selected quality + current pan
      // 2) selected quality + any pan
      const selectedQuality = normalizeModeKey(qualityMode);
      return [
        { panMode: 'require', panToken: currentPanToken, preferredPanToken: '', qualityMode: selectedQuality, label: 'quality_r1' },
        { panMode: '', panToken: '', preferredPanToken: '', qualityMode: selectedQuality, label: 'quality_r2' },
      ];
    }
    return [
      { panMode, panToken, preferredPanToken, qualityMode: normalizeModeKey(qualityMode), label: 'default' },
    ];
  };
  const roundSpecs = selectRoundsByKind();

  let chosen = null;
  for (let r = 0; r < roundSpecs.length; r += 1) {
    if (seq !== smartSwitchPickState.seq) return false;
    const spec = roundSpecs[r];
    let bestFallback = null;
    const considerFallback = (cand) => {
      try {
        if (!cand || !cand.ep || !cand.ep.url) return;
        if (!bestFallback || smartCompareCandidates(bestFallback, cand, { explicit, orderKeys }) > 0) bestFallback = cand;
      } catch (_e) {}
    };
    const allowDowngradeNow = () => {
      try {
        const queueLen =
          sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0;
        return !!(sourcesSearchDone.value && queueLen <= 0 && !hasPendingPanMock());
      } catch (_e) {
        return false;
      }
    };
    const deadlineAt = Date.now() + 18_000;

    chosen = await runSmartCandidateLoop({
      deadlineAt,
      allowHistoryOnce: null,
      considerFallback,
      allowDowngradeNow,
      onTimeoutFallback: () => (bestFallback && bestFallback.ep && bestFallback.ep.url ? bestFallback : null),
      pickPrimary: async ({ detailDone }) => {
        if (seq !== smartSwitchPickState.seq) return null;
        let cand = await pickFromOrderedSources({
          allowFetchDetail: !cacheOnly || detailDone,
          preferSameSite: true,
          roundPanToken: spec.panToken,
          roundPanMode: spec.panMode,
          roundPreferredPanToken: spec.preferredPanToken,
          roundQualityMode: spec.qualityMode,
        });
        if (!cand && cacheOnly) {
          cand = await pickFromOrderedSources({
            allowFetchDetail: true,
            preferSameSite: true,
            roundPanToken: spec.panToken,
            roundPanMode: spec.panMode,
            roundPreferredPanToken: spec.preferredPanToken,
            roundQualityMode: spec.qualityMode,
          });
        }
        if (!cand && sourcesSearchDone.value) {
          cand = await pickFromOrderedSources({
            allowFetchDetail: true,
            preferSameSite: false,
            roundPanToken: spec.panToken,
            roundPanMode: spec.panMode,
            roundPreferredPanToken: spec.preferredPanToken,
            roundQualityMode: spec.qualityMode,
          });
        }
        if (!cand || !cand.ep || !cand.ep.url) return null;
        return { cand, stop: isGoodEnough(cand) };
      },
      pickAfterSearchDone: async () => null,
    });

    if (chosen && chosen.ep && chosen.ep.url) break;
  }

  if (!chosen || !chosen.ep || !chosen.ep.url) {
    const kind = typeof switchKind === 'string' ? switchKind.trim() : '';
    if (kind === 'pan') showPlayerToast('暂无匹配网盘片源');
    else if (kind === 'quality') showPlayerToast('暂无匹配画质片源');
    else showPlayerToast('未匹配到相关片源');
    return false;
  }

  tmdbSmartPickCache.set(episodeNo, chosen);
  tmdbSmartPickCacheVersion.value += 1;
  pauseSmartDetailWarmup();
  let started = false;
  try {
	    started = await requestPlay({ trigger: 'user' });
    if (started && played && played.groupKey && played.set) {
      const id = smartSourceIdentity(chosen);
      if (id) {
        played.set.add(id);
        smartSavePlayedSet(played.groupKey, played.set);
      }
    }
    if (started) smartSaveManualSwitchHint(episodeNo, chosen, switchKind);
    if (started) smartSaveManualSwitchContentHint(chosen, switchKind);
  } catch (_e) {}
  if (!started) {
    resumeSmartDetailWarmup();
    showPlayerToast('匹配成功但播放启动失败');
    return false;
  }
  return true;
};

const smartCurrentEpisodeNo = computed(() => {
  if (!tmdbSmartListAvailable.value) return 0;
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
  const currentToken = smartCleanPanToken(currentPlayingPanFlag.value || '');
  if (currentToken) return currentToken;
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
const smartPlayerControlsVisible = computed(() => !!tmdbSmartListAvailable.value);

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
  if (!smartPlayerControlsVisible.value) return [];
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
  if (!smartPlayerControlsVisible.value) return [];
  return [{ key: 'switch', label: '换源', ariaLabel: '换源' }];
});

const onPlayerExtraMenuSelect = async (payload) => {
  const key = payload && payload.key != null ? String(payload.key) : '';
  const value = payload && payload.value != null ? String(payload.value) : '';
  if (!key) return;
  if (!smartPlayerControlsVisible.value) return;

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
  if (!smartPlayerControlsVisible.value) return;
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

const resolveTMDBSmartPlaybackCandidate = async ({ episodeNo, seasonNo, excludeKeys } = {}) => {
  const want = Number.isFinite(Number(episodeNo)) ? Math.floor(Number(episodeNo)) : 0;
  if (want <= 0) return null;
  const manualSwitchHint = smartLoadManualSwitchHint(want);
  const manualSwitchContentHint = smartLoadManualSwitchContentHint();

  const preferSeasonNo = Number.isFinite(Number(seasonNo)) ? Math.floor(Number(seasonNo)) : 0;

  const excludeList = Array.isArray(excludeKeys) ? excludeKeys.map((k) => (k != null ? String(k) : '')).filter(Boolean) : [];
  excludeList.sort();
  const excludeSig = excludeList.length ? excludeList.join('|') : '';
  const excludeSet = excludeList.length ? new Set(excludeList) : new Set();
  const shouldCachePick = !excludeSig;
  const flightKey = excludeSig ? `${want}::ex:${excludeSig}` : want;

  const isExcluded = (cand) => {
    if (!cand || !excludeSet.size) return false;
    const ck = cand && typeof cand.candidateKey === 'string' ? String(cand.candidateKey).trim() : '';
    if (ck && excludeSet.has(ck)) return true;
    const k = smartCandidateKey(cand);
    return !!(k && excludeSet.has(k));
  };
  const is4kCandidate = (cand) => {
    try {
      if (!cand) return false;
      const feat = smartComputeCandidateFeatures(cand);
      return !!(feat && Number(feat.qualityRank) === 3);
    } catch (_e) {
      return false;
    }
  };
  const maybeCache4kPick = (cand) => {
    try {
      if (!shouldCachePick) return;
      if (!cand || !cand.ep || !cand.ep.url) return;
      if (!is4kCandidate(cand)) return;
      tmdbSmartPickCache.set(want, cand);
      tmdbSmartPickCacheVersion.value += 1;
    } catch (_e) {}
  };

  const cachedPick = shouldCachePick ? (tmdbSmartPickCache.get(want) || null) : null;
  if (cachedPick && cachedPick.ep && cachedPick.ep.url && !isExcluded(cachedPick) && is4kCandidate(cachedPick)) return cachedPick;
  const existingFlight = tmdbSmartPickInFlight.get(flightKey) || null;
  if (existingFlight) return await existingFlight;

	  const run = (async () => {
	  const startedAt = Date.now();
	  const deadlineAt = startedAt + 18_000;
	  const metaId = Number(props.tmdbId || 0);
	  const metaType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : 'tv';
	  const mappingReadyPromise = ensureSmartMetaReadyForMapping({ tmdbId: metaId, type: metaType });

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
  const manualSiteKey = manualSwitchContentHint && typeof manualSwitchContentHint.siteKey === 'string' ? manualSwitchContentHint.siteKey.trim() : '';
  const manualSpider = manualSwitchContentHint && typeof manualSwitchContentHint.spiderApi === 'string' ? manualSwitchContentHint.spiderApi.trim() : '';
  const manualVideoId = manualSwitchContentHint && typeof manualSwitchContentHint.videoId === 'string' ? manualSwitchContentHint.videoId.trim() : '';
  const manualPanLabel = manualSwitchContentHint && typeof manualSwitchContentHint.panLabel === 'string' ? manualSwitchContentHint.panLabel.trim() : '';

  const currentSiteKey = (manualSiteKey || (props.siteKey || '').trim() || historySiteKey).trim();
  const currentSpider = (manualSpider || (resolvedSpiderApiFinal.value || '').trim() || historySpider).trim();
  const currentVideoId = (manualVideoId || (((props.siteKey || '').trim() ? (props.videoId || '').trim() : '') || historyVideoId)).trim();

  const badgeEpOf = (src) => {
    const r = src && typeof src.videoRemark === 'string' ? src.videoRemark : '';
    return extractMaxEpisodeFromBadgeText(r);
  };


  const normalizeReplayPanLabel = (label) =>
    String(label || '')
      .trim()
      .replace(/#\d{1,3}\s*$/i, '')
      .replace(/\s+/g, '')
      .toLowerCase();


	  const isTMDBMultiSeason = () => {
	    const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
	    const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
	    return real.length >= 2;
	  };

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
        if (isTMDBMultiSeason() && preferSeasonNo > 0) {
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
    return smartPanTokenIdxOfLabel(label, panTokenOrder);
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

    const ase = a && Number.isFinite(Number(a.__seMarkRank)) ? Number(a.__seMarkRank) : 0;
    const bse = b && Number.isFinite(Number(b.__seMarkRank)) ? Number(b.__seMarkRank) : 0;
    if (ase !== bse) return bse - ase;

    if (isTMDBMultiSeason() && preferSeasonNo > 0) {
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
    const items = Array.isArray(list) ? list.filter((x) => x && !isExcluded(x)) : [];
    if (!items.length) return null;
    let best = items[0];
    for (let i = 1; i < items.length; i += 1) {
      if (compareSmartMatch(best, items[i]) > 0) best = items[i];
    }
    return best;
  };
  const classifyCandidateTier = (cand) => {
    const feat = smartComputeCandidateFeatures(cand) || {};
    const qualityRank = Number(feat.qualityRank) || 0;
    const panRuleEnabled = Array.isArray(compiledSmartPanMatchTokens.value) && compiledSmartPanMatchTokens.value.length > 0;
    const panTokenIdx = cand && Number.isFinite(Number(cand.panTokenIdx)) ? Number(cand.panTokenIdx) : -1;
    if (qualityRank === 3) {
      if (!panRuleEnabled || panTokenIdx >= 0) return 1;
      return 2;
    }
    const tmdbHasMultiSeasonNow = (() => {
      const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
      const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
      return real.length >= 2;
    })();
    if (tmdbHasMultiSeasonNow && preferSeasonNo > 0) {
      const matchSeason = cand && Number.isFinite(Number(cand.matchSeason)) ? Math.floor(Number(cand.matchSeason)) : 0;
      const hintSeason = cand && Number.isFinite(Number(cand.searchSeasonHint)) ? Math.floor(Number(cand.searchSeasonHint)) : 0;
      if (matchSeason === preferSeasonNo || hintSeason === preferSeasonNo) return 3;
      return 0;
    }
    return 3;
  };
  const pickBestMatchByTier = (list, tier = 0) => {
    const tierNo = Number.isFinite(Number(tier)) ? Math.floor(Number(tier)) : 0;
    if (tierNo <= 0) return pickBestMatch(list);
    const items = Array.isArray(list) ? list.filter((x) => x && !isExcluded(x) && classifyCandidateTier(x) === tierNo) : [];
    return pickBestMatch(items);
  };

  const rules = compiledMagicEpisodeRules.value;
  const cleanRules = compiledMagicEpisodeCleanRegexRules.value;

  const loadOrBuildDetailCache = async (src, opts = {}) => {
    const siteKey = src && src.siteKey ? String(src.siteKey) : '';
    const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
    const videoId = src && src.videoId ? String(src.videoId) : '';
    if (!siteKey || !spiderApi || !videoId) return null;
    const reason = opts && typeof opts.reason === 'string' ? opts.reason : 'smart_pick_current_site';
    const module = opts && typeof opts.module === 'string' ? opts.module : 'smart';
    return await ensureTMDBSmartDetailCacheEntry(src, { reason, module });
  };

  const fetchDetailAndPickEpisode = async (
    src,
    {
      requireSeasoned = false,
      panHints = null,
      panTokenHints = null,
      waitPanMockMs = 1200,
      tier = 0,
      waitPanMockAll = false,
      detailReason = '',
      detailModule = '',
      cacheOnly = false,
    } = {}
  ) => {
	    const siteKey = src && src.siteKey ? String(src.siteKey) : '';
	    const spiderApi = src && src.spiderApi ? String(src.spiderApi) : '';
	    const videoId = src && src.videoId ? String(src.videoId) : '';
	    if (!siteKey || !spiderApi || !videoId) return null;
	    const searchSeasonHint = extractSeasonHintFromSource(src);
	    try {
        const sourceKey = smartBuildSourceKey(src);
	      const cache = cacheOnly
          ? (tmdbSmartDetailCache.get(sourceKey) || null)
          : await loadOrBuildDetailCache(src, {
              reason: detailReason || 'smart_pick_current_site',
              module: detailModule || 'smart',
            });
	      if (!cache || !cache.episodeMap) return null;
	      if (cache.ok === false) return null;
        const sinceSeq = Number.isFinite(Number(cache.__updateSeq)) ? Number(cache.__updateSeq) : 0;

	      // Prevent mis-matches: only match after TMDB + Douban meta are ready.
	      await mappingReadyPromise;
	      smartMaybeReindexTMDBSmartEntry(cache);
	      const tmdbHasMultiSeasonNow = (() => {
	        const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
	        const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
	        return real.length >= 2;
	      })();
	      const requireSeasonedEffective = !!(requireSeasoned && tmdbHasMultiSeasonNow);

	      const wantedInSeason = tmdbHasMultiSeasonNow ? tmdbSeasonEpisodeOfGlobal(want) : { season: 0, episode: want };
	      const wantSeasonNo = wantedInSeason && Number.isFinite(Number(wantedInSeason.season)) ? Math.floor(Number(wantedInSeason.season)) : 0;
	      const wantSeasonEp = wantedInSeason && Number.isFinite(Number(wantedInSeason.episode)) ? Math.floor(Number(wantedInSeason.episode)) : 0;

	        const pickFromCache = () => {
	          let candidatesForNo = (cache.episodeMap.get(want) || []).slice().map((c) => ({ ...c, searchSeasonHint }));
          if (requireSeasonedEffective) {
            const seasonedOnly = candidatesForNo.filter((c) => c && Number(c.matchSeason) > 0);
            candidatesForNo.length = 0;
            candidatesForNo.push(...seasonedOnly);
          } else if (tmdbHasMultiSeasonNow && wantSeasonEp > 0) {
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
          const wantedPanHints = Array.isArray(panHints) ? panHints.filter(Boolean) : [];
          if (wantedPanHints.length) {
            const matchedByPan = candidatesForNo.filter((c) => {
              const panNorm = normalizeReplayPanLabel(c && c.panLabel != null ? c.panLabel : '');
              return !!(panNorm && wantedPanHints.includes(panNorm));
            });
            if (!matchedByPan.length) return null;
            candidatesForNo = matchedByPan;
          }
          const wantedPanTokenHints = Array.isArray(panTokenHints) ? panTokenHints.filter(Boolean) : [];
          if (wantedPanTokenHints.length) {
            const matchedByPanToken = candidatesForNo.filter((c) => {
              for (let i = 0; i < wantedPanTokenHints.length; i += 1) {
                const t = String(wantedPanTokenHints[i] || '').trim();
                if (!t) continue;
                if (smartMatchPan(c, t)) return true;
              }
              return false;
            });
            if (!matchedByPanToken.length) return null;
            candidatesForNo = matchedByPanToken;
          }
          const best = pickBestMatchByTier(candidatesForNo, tier);
          return best && best.ep && best.ep.url ? best : null;
	  };

	      // Default path: do not fully block on pan_mock list resolving.
	      // History first-round can opt into `waitPanMockAll` to require all derived lists to finish before failover.
        const bestNow = pickFromCache();
        if (bestNow) return bestNow;

        // In pan_mock mode, detail often contains placeholders and real episodes arrive via list.
        // Treat "no candidates yet" as pending until list resolves (or a short timeout expires).
        if (cache.panMockEnabled === true && cache.panMockResolved !== true) {
          const waitMsRaw = Number.isFinite(Number(waitPanMockMs)) ? Number(waitPanMockMs) : 1200;
          const waitMs = Math.max(200, Math.min(8000, Math.floor(waitMsRaw)));
          if (waitPanMockAll) {
            const deadline = Date.now() + waitMs;
            while (Date.now() < deadline) {
              const bestMid = pickFromCache();
              if (bestMid) return bestMid;
              if (cache.panMockResolved === true) break;
              const left = Math.max(80, Math.min(380, deadline - Date.now()));
              if (left <= 0) break;
              try {
                const nowSeq = Number.isFinite(Number(cache.__updateSeq)) ? Number(cache.__updateSeq) : sinceSeq;
                const updated = await smartWaitTMDBSmartEntryUpdate(cache, { sinceSeq: nowSeq, timeoutMs: left });
                if (updated) smartMaybeReindexTMDBSmartEntry(cache);
              } catch (_e) {}
            }
            const bestAfterAll = pickFromCache();
            if (bestAfterAll) return bestAfterAll;
          } else {
            try {
              const updated = await smartWaitTMDBSmartEntryUpdate(cache, { sinceSeq, timeoutMs: waitMs });
              if (updated) smartMaybeReindexTMDBSmartEntry(cache);
            } catch (_e) {}
            const bestAfter = pickFromCache();
            if (bestAfter) return bestAfter;
          }
        }

        return null;
    } catch (_e) {
      return null;
    }
  };

  const tryPickFromHistoryPlayFlagList = async ({ requireSeasoned = false, allowMappingWait = false } = {}) => {
    try {
      const history = resumeHistory.value && typeof resumeHistory.value === 'object' ? resumeHistory.value : null;
      const playFlagRaw = history && typeof history.playFlag === 'string' ? history.playFlag.trim() : '';
      if (!playFlagRaw) {
        if (debugEnabled.value) {
          smartDebugLog('history_list_skip', { module: 'history', reason: 'no_playflag' });
        }
        return null;
      }
      if (!playFlagRaw.includes('-')) {
        if (debugEnabled.value) {
          smartDebugLog('history_list_skip', { module: 'history', reason: 'playflag_no_sep', playFlag: playFlagRaw });
        }
        return null;
      }
      const provider = panMockProviderFromFlag(playFlagRaw);
      if (!provider) {
        if (debugEnabled.value) {
          smartDebugLog('history_list_skip', { module: 'history', reason: 'provider_missing', playFlag: playFlagRaw });
        }
        return null;
      }

      const callPanList = async () => {
        const call = async (path, body) => {
          const resp = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body || {}),
            credentials: 'include',
          });
          const data = await resp.json().catch(() => ({}));
          if (!resp.ok || !data || data.ok === false) {
            const msg = data && data.message ? String(data.message) : `HTTP ${resp.status}`;
            throw new Error(msg);
          }
          return data && typeof data === 'object' ? data : null;
        };
        if (provider === 'quark') return await call('/api/pan/quark/list', { flag: playFlagRaw, passcode: '' });
        if (provider === 'uc') return await call('/api/pan/uc/list', { flag: playFlagRaw, passcode: '' });
        if (provider === 'baidu') return await call('/api/pan/baidu/list', { flag: playFlagRaw, pwd: '' });
        if (provider === '139') return await call('/api/pan/139/list', { flag: playFlagRaw, passcode: '' });
        if (provider === '189') return await call('/api/pan/189/list', { flag: playFlagRaw, accessCode: '' });
        return null;
      };

      if (debugEnabled.value) {
        smartDebugLog('history_list_req', { module: 'history', playFlag: playFlagRaw, panFlag: playFlagRaw, provider });
      }
      let listData = null;
      try {
        listData = await callPanList();
      } catch (e) {
        if (debugEnabled.value) {
          smartDebugLog('history_list_err', {
            module: 'history',
            reason: 'request_failed',
            playFlag: playFlagRaw,
            provider,
            err: e && e.message ? String(e.message) : 'request_failed',
          });
        }
        return null;
      }
      try {
        if (debugEnabled.value) {
          const keys =
            listData && typeof listData === 'object'
              ? Object.keys(listData).slice(0, 12)
              : [];
          smartDebugLog('history_list_resp', {
            module: 'history',
            provider,
            playFlag: playFlagRaw,
            ok: listData && typeof listData === 'object' && listData.ok === true ? 1 : 0,
            vodLen:
              listData && typeof listData === 'object' && typeof listData.vod_play_url === 'string'
                ? String(listData.vod_play_url || '').trim().length
                : 0,
            keys: keys.join(','),
          });
        }
      } catch (_e) {}
      const vod = extractPanListVodPlayUrl(listData);
      if (!vod) {
        if (debugEnabled.value) {
          smartDebugLog('history_list_skip', {
            module: 'history',
            reason: 'vod_missing_field',
            playFlag: playFlagRaw,
            provider,
          });
        }
        return null;
      }
      const siteKey = historySiteKey || '';
      const spiderApi = historySpider || '';
      const siteName = (history && history.siteName ? String(history.siteName) : '') || siteKey || '';
      const videoId = historyVideoId || '';
      const videoTitle = history && history.videoTitle ? String(history.videoTitle) : '';
      const videoRemark = history && history.videoRemark ? String(history.videoRemark) : '';
      const src = { siteKey, spiderApi, siteName, videoId, videoTitle, videoRemark };

      try {
        if (debugEnabled.value) {
          smartDebugLog('history_list', {
            module: 'history',
            siteKey,
            spiderApi,
            videoId,
            playFlag: playFlagRaw,
            panFlag: playFlagRaw,
            provider,
            episodes: (() => {
              try {
                const tmp = { pans: [], episodeMap: new Map(), episodeMapLoose: new Map() };
                smartRebuildTMDBSmartEntryFromPlaySources(tmp, playFlagRaw, vod, { fromPanMock: true, forceIndex: true });
                let max = 0;
                (Array.isArray(tmp.pans) ? tmp.pans : []).forEach((p) => {
                  const n = p && Array.isArray(p.episodes) ? p.episodes.length : 0;
                  if (n > max) max = n;
                });
                return max;
              } catch (_e) {
                return 0;
              }
            })(),
          });
        }
      } catch (_e) {}

      const resolveKey = provider ? `${provider}::${String(playFlagRaw || '').trim()}` : '';
      const entry = {
        ok: true,
        siteKey: src.siteKey,
        spiderApi: src.spiderApi,
        siteName: src.siteName,
        videoId: src.videoId,
        srcTitleLower: src.videoTitle ? String(src.videoTitle).trim().toLowerCase() : '',
        srcRemarkLower: src.videoRemark ? String(src.videoRemark).trim().toLowerCase() : '',
        pans: [],
        panMockEnabled: true,
        panMockResolved: true,
        panMockResolvedByKey: resolveKey ? { [resolveKey]: true } : {},
        panMockListErrors: {},
        episodeMap: new Map(),
        episodeMapLoose: new Map(),
        __waiters: new Set(),
        __updateSeq: 0,
        __listOnly: true,
        __detailFetched: false,
        __sourceKey: '',
      };
      smartRebuildTMDBSmartEntryFromPlaySources(entry, playFlagRaw, vod, { fromPanMock: true, forceIndex: true });
      try {
        const sourceKey = smartBuildSourceKey(src);
        if (sourceKey) {
          entry.__sourceKey = sourceKey;
          tmdbSmartDetailCache.set(sourceKey, entry);
          tmdbSmartDetailCacheVersion.value += 1;
        }
      } catch (_e) {}
      const pickFromEntry = (tag = '') => {
        try {
          smartMaybeReindexTMDBSmartEntry(entry);
        } catch (_e) {}
        const wantEpisodeNo = Number.isFinite(Number(want)) ? Math.floor(Number(want)) : 0;
        const tmdbHasMultiSeasonNow = (() => {
          const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
          const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
          return real.length >= 2;
        })();
        const wantedInSeason = tmdbHasMultiSeasonNow ? tmdbSeasonEpisodeOfGlobal(wantEpisodeNo) : { season: 0, episode: wantEpisodeNo };
        const seasonNoWanted =
          wantedInSeason && Number.isFinite(Number(wantedInSeason.season)) ? Math.floor(Number(wantedInSeason.season)) : 0;
        const seasonEpWanted =
          wantedInSeason && Number.isFinite(Number(wantedInSeason.episode)) ? Math.floor(Number(wantedInSeason.episode)) : 0;
        // History first-list path should not enforce extra season-marker filtering.
        const requireSeasonedEffective = false;
        let candidates = smartGetCandidatesFromEntry(entry, {
          episodeNo: wantEpisodeNo,
          seasonNo: seasonNoWanted > 0 ? seasonNoWanted : preferSeasonNo,
          seasonEpisodeNo: seasonEpWanted > 0 ? seasonEpWanted : wantEpisodeNo,
          requireSeasoned: requireSeasonedEffective,
        });
        if ((!candidates || !candidates.length) && requireSeasonedEffective) {
          candidates = smartGetCandidatesFromEntry(entry, {
            episodeNo: wantEpisodeNo,
            seasonNo: seasonNoWanted > 0 ? seasonNoWanted : preferSeasonNo,
            seasonEpisodeNo: seasonEpWanted > 0 ? seasonEpWanted : wantEpisodeNo,
            requireSeasoned: false,
          });
        }
        // History first-list path must not depend on pan-rule tiering.
        // It only matches by extracted episodes/filename/quality logic.
        const picked = pickBestMatch(candidates);
        if (debugEnabled.value) {
          try {
            const pansCount = Array.isArray(entry.pans) ? entry.pans.length : 0;
            const epCount = (() => {
              try {
                let max = 0;
                (Array.isArray(entry.pans) ? entry.pans : []).forEach((p) => {
                  const n = p && Array.isArray(p.episodes) ? p.episodes.length : 0;
                  if (n > max) max = n;
                });
                return max;
              } catch (_e) {
                return 0;
              }
            })();
            smartDebugLog('history_list_pick', {
              module: 'history',
              tag: tag || 'pick',
              want: wantEpisodeNo,
              season: seasonNoWanted,
              seasonEp: seasonEpWanted,
              pans: pansCount,
              episodes: epCount,
              candidates: Array.isArray(candidates) ? candidates.length : 0,
              picked: picked && picked.ep && picked.ep.url ? 1 : 0,
            });
          } catch (_e) {}
        }
        return picked && picked.ep && picked.ep.url ? picked : null;
      };

      // Round 1: try with current TMDB mapping state (no extra request here).
      let pickedNow = pickFromEntry('round1');
      if (pickedNow) return pickedNow;

      // Round 2: wait existing mapping pipeline (TMDB + Douban) and re-match once.
      // IMPORTANT: do not initiate extra requests here; reuse outer mappingReadyPromise chain.
      if (allowMappingWait) {
        try {
          await mappingReadyPromise;
        } catch (_e) {}
        pickedNow = pickFromEntry('round2');
        if (pickedNow) return pickedNow;
      }

      // Fallback: directly pick by history index / wanted episode from the resolved list
      // to avoid unnecessary detail requests when list already matches.
      try {
        const pans = Array.isArray(entry.pans) ? entry.pans : [];
        if (pans.length) {
          const wantIdxRaw = history && Number.isFinite(Number(history.episodeIndex)) ? Number(history.episodeIndex) : NaN;
          const wantIdx = Number.isFinite(wantIdxRaw) && wantIdxRaw >= 0 ? Math.floor(wantIdxRaw) : -1;
          const wantNo = Number.isFinite(Number(want)) ? Math.floor(Number(want)) : 0;
          const preferLabel = normalizeReplayPanLabel(playFlagRaw || '');
          const preferPan =
            (preferLabel ? pans.find((p) => normalizeReplayPanLabel(p && p.label) === preferLabel) : null) || pans[0];
          const episodes = preferPan && Array.isArray(preferPan.episodes) ? preferPan.episodes : [];
          const idx =
            wantIdx >= 0 && wantIdx < episodes.length
              ? wantIdx
              : wantNo > 0 && wantNo - 1 < episodes.length
                ? wantNo - 1
                : -1;
          if (idx >= 0) {
            const ep = episodes[idx];
            if (ep && ep.url) {
              const panLabel = preferPan && preferPan.label ? String(preferPan.label) : '';
              const panTokenIdx = smartPanTokenIdxOfLabel(panLabel, compiledSmartPanMatchTokens.value);
              return {
                siteKey: src.siteKey || '',
                spiderApi: src.spiderApi || '',
                siteName: src.siteName || '',
                videoId: src.videoId || '',
                panLabel,
                panTokenIdx,
                ep,
                matchSeason: 0,
                hasSeasonMarker: 0,
                searchSeasonHint: preferSeasonNo || 0,
              };
            }
          }
        }
      } catch (_e) {}
      return null;
    } catch (_e) {
      return null;
    }
  };

  const tryPickOnce = async ({
    requireSeasoned = false,
    poolSize: poolSizeOverride,
    panHints = null,
    returnOnFirstHit = false,
    tier = 0,
    cacheOnly = false,
  } = {}) => {
	    const candidates = buildCandidates();
      if (debugEnabled.value) {
        try {
          const first = candidates[0] || {};
          smartDebugLog('smart_search_candidates', {
            module: 'smart',
            count: candidates.length,
            total: Array.isArray(aggregatedSources.value) ? aggregatedSources.value.length : 0,
            queue: sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0,
            done: sourcesSearchDone.value ? 1 : 0,
            loading: sourcesLoading.value ? 1 : 0,
            runtimeKey: sourcesSearchRuntime && sourcesSearchRuntime.key ? String(sourcesSearchRuntime.key) : '',
            searchSeq: sourcesSearchState.seq,
            siteKey: first.siteKey || '',
            spiderApi: first.spiderApi || '',
            videoId: first.videoId || '',
          });
        } catch (_e) {}
      }
	    if (!candidates.length) return null;
	    const siteCount = (() => {
	      const uniqSites = new Set();
	      candidates.forEach((c) => {
	        const k = c && c.siteKey != null ? String(c.siteKey) : '';
	        if (k) uniqSites.add(k);
	      });
	      return uniqSites.size;
	    })();
	    const desiredPoolSizeBase = Math.max(1, Math.min(50, siteCount || 1));
	    const poolNum = Number(poolSizeOverride);
	    const poolSize =
	      Number.isFinite(poolNum) && poolNum > 0 ? Math.max(1, Math.min(desiredPoolSizeBase, Math.floor(poolNum))) : desiredPoolSizeBase;
    const bestOverall = await runSmartPickPipeline({
      candidates,
      poolSize,
      perSiteSerial: true,
      returnOnFirstHit,
      stopWhen: (hit) => {
        if (returnOnFirstHit) return true;
        const feat = smartComputeCandidateFeatures(hit);
        return !!(feat && Number(feat.qualityRank) === 3);
      },
      compareBest: compareSmartMatch,
      fetchPick: (src) =>
        fetchDetailAndPickEpisode(src, {
          requireSeasoned,
          panHints,
          tier,
          cacheOnly,
        }),
    });
    if (bestOverall && is4kCandidate(bestOverall)) maybeCache4kPick(bestOverall);
    return bestOverall;
  };

  const tryPickFromCurrentSiteOnly = async (
    {
      requireSeasoned = false,
      panHints = null,
      panTokenHints = null,
      waitPanMockMs = 1200,
      tier = 0,
      waitPanMockAll = false,
      detailReason = '',
      detailModule = '',
    } = {}
  ) => {
    try {
      if (!currentSiteKey || !currentSpider || !currentVideoId) return null;
      const src = {
        siteKey: currentSiteKey,
        siteName: resolvedSiteName.value || currentSiteKey,
        spiderApi: currentSpider,
        videoId: currentVideoId,
      };
      const best = await fetchDetailAndPickEpisode(src, {
        requireSeasoned,
        panHints,
        panTokenHints,
        waitPanMockMs,
        tier,
        waitPanMockAll,
        detailReason,
        detailModule,
      });
      if (best && best.ep && best.ep.url) {
        maybeCache4kPick(best);
        return best;
      }
    } catch (_e) {}
    return null;
  };

  const hasPendingPanMock = () => {
    try {
      const entries = Array.from(tmdbSmartDetailCache.values());
      return entries.some((e) => e && e.ok !== false && e.panMockEnabled === true && e.panMockResolved !== true && !!e.panMockInFlight);
    } catch (_e) {
      return false;
    }
  };

  const waitForAnyPanMockUpdate = async (timeoutMs = 320) => {
    const to = Number.isFinite(Number(timeoutMs)) ? Math.max(0, Math.floor(Number(timeoutMs))) : 0;
    if (!to) return false;
    let entries = [];
    try {
      entries = Array.from(tmdbSmartDetailCache.values()).filter(
        (e) => e && e.ok !== false && e.panMockEnabled === true && e.panMockResolved !== true && !!e.panMockInFlight
      );
    } catch (_e) {
      entries = [];
    }
    if (!entries.length) {
      await new Promise((r) => setTimeout(r, Math.min(260, to)));
      return false;
    }
    const picked = entries.slice(0, 8).map((e) => {
      const sinceSeq = Number.isFinite(Number(e.__updateSeq)) ? Number(e.__updateSeq) : 0;
      return smartWaitTMDBSmartEntryUpdate(e, { sinceSeq, timeoutMs: to }).catch(() => false);
    });
    try {
      const ok = await Promise.race(picked.concat([new Promise((r) => setTimeout(() => r(false), to))]));
      return !!ok;
    } catch (_e) {
      return false;
    }
  };

  const buildPickCandidateSnapshot = () => {
    try {
      if (!debugEnabled.value) return null;
      const all = [];
      const entries = Array.from(tmdbSmartDetailCache.values());
      entries.forEach((e) => {
        if (!e || e.ok === false) return;
        const list = (e.episodeMap && e.episodeMap.get ? e.episodeMap.get(want) : null) || [];
        (Array.isArray(list) ? list : []).forEach((c) => {
          if (c && c.ep && c.ep.url) all.push(c);
        });
      });
      if (!all.length) return { total: 0, top: [] };
      const sorted = all.slice().sort((a, b) => compareSmartMatch(a, b));
      const top = sorted.slice(0, 25).map((c) => {
        const url = c && c.ep && c.ep.url != null ? String(c.ep.url) : '';
        const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
        const feat = smartComputeCandidateFeatures(c) || {};
        const texts = (() => {
          try {
            return extractEpisodeCandidateTexts(c && c.ep ? c.ep : null).slice(0, 4);
          } catch (_e) {
            return [];
          }
        })();
        return {
          siteKey: c.siteKey || '',
          siteName: c.siteName || '',
          videoId: c.videoId || '',
          panLabel: c.panLabel || '',
          matchSeason: Number(c.matchSeason) || 0,
          hasSeasonMarker: c.hasSeasonMarker ? 1 : 0,
          seMarkRank: Number(c.__seMarkRank) || 0,
          fromPanMock: c.__fromPanMock ? 1 : 0,
          quality: feat.quality || '',
          qualityRank: Number(feat.qualityRank) || 0,
          fps60: feat.fps60 ? 1 : 0,
          hasHdr: feat.hasHdr ? 1 : 0,
          tierRank: Number(feat.tierRank) || 0,
          texts,
          rawNames: rawNames.slice(0, 4),
        };
      });
      const counts = { '4k': 0, '1080p': 0, '720p': 0, other: 0 };
      sorted.forEach((c) => {
        const feat = smartComputeCandidateFeatures(c) || {};
        const qr = Number(feat.qualityRank) || 0;
        if (qr === 3) counts['4k'] += 1;
        else if (qr === 2) counts['1080p'] += 1;
        else if (qr === 1) counts['720p'] += 1;
        else counts.other += 1;
      });
      return { total: sorted.length, counts, top };
    } catch (_e) {
      return null;
    }
  };

  const resolveSmartCandidate = async ({ allowHistory = true } = {}) => {
    // Strict first round:
    // - Only return 4K/2160p candidates.
    // - Keep the best non-4K candidate as fallback.
    // - Only allow downgrade when search is done AND all pending pan_mock lists have resolved (or deadline reached).
    let bestFallback = null;
    const considerFallback = (cand) => {
      try {
        if (!cand || !cand.ep || !cand.ep.url) return;
        if (isExcluded(cand)) return;
        if (is4kCandidate(cand)) return;
        if (!bestFallback || compareSmartMatch(bestFallback, cand) > 0) bestFallback = cand;
      } catch (_e) {}
    };
    const allowDowngradeNow = () => {
      try {
        const queueLen =
          sourcesSearchRuntime && Array.isArray(sourcesSearchRuntime.queue) ? sourcesSearchRuntime.queue.length : 0;
        return !!(sourcesSearchDone.value && queueLen <= 0 && !hasPendingPanMock());
      } catch (_e) {
        return false;
      }
    };

    const allowHistoryOnce = !allowHistory
      ? null
      : async () => {
          const requireSeasoned =
            contentKind.value === 'series' &&
            (() => {
              const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
              const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
              return real.length >= 2;
            })();
          const historyRequireSeasoned = manualSwitchHint ? false : requireSeasoned;
          const historyListPicked = await tryPickFromHistoryPlayFlagList({
            requireSeasoned: historyRequireSeasoned,
            allowMappingWait: true,
          });
          if (historyListPicked && historyListPicked.ep && historyListPicked.ep.url) {
            const f = smartComputeCandidateFeatures(historyListPicked);
            try {
              tmdbSmartLastPickDebug.value = {
                want,
                requireSeasoned,
                cands: buildPickCandidateSnapshot(),
                pickKind: 'history_playflag_list',
                siteKey: historyListPicked.siteKey || '',
                siteName: historyListPicked.siteName || '',
                spiderApi: historyListPicked.spiderApi || '',
                videoId: historyListPicked.videoId || '',
                panLabel: historyListPicked.panLabel || '',
                epName: historyListPicked.ep && historyListPicked.ep.name != null ? String(historyListPicked.ep.name) : '',
                epUrl: historyListPicked.ep && historyListPicked.ep.url != null ? String(historyListPicked.ep.url) : '',
                matchSeason: Number.isFinite(Number(historyListPicked.matchSeason)) ? Math.floor(Number(historyListPicked.matchSeason)) : 0,
                hasSeasonMarker: historyListPicked.hasSeasonMarker ? 1 : 0,
                searchSeasonHint: Number.isFinite(Number(historyListPicked.searchSeasonHint))
                  ? Math.floor(Number(historyListPicked.searchSeasonHint))
                  : 0,
                quality: f && f.quality ? String(f.quality) : '',
                tierRank: f && Number.isFinite(Number(f.tierRank)) ? Number(f.tierRank) : 0,
              };
            } catch (_e) {}
            return historyListPicked;
          }

          if (currentSiteKey && currentSpider && currentVideoId) {
            const history = resumeHistory.value && typeof resumeHistory.value === 'object' ? resumeHistory.value : null;
            const historyPlayFlag = history && typeof history.playFlag === 'string' ? history.playFlag.trim() : '';
            const historyPanHintNorm = normalizeReplayPanLabel(historyPlayFlag || '');
            const historyPanTokenHint = smartCleanPanToken(historyPlayFlag || '');

            let historyDetailPicked =
              historyPlayFlag
                ? await tryPickFromCurrentSiteOnly({
                    requireSeasoned: historyRequireSeasoned,
                    panHints: historyPanHintNorm ? [historyPanHintNorm] : null,
                    panTokenHints: historyPanTokenHint ? [historyPanTokenHint] : null,
                    waitPanMockMs: 3600,
                    tier: 0,
                    waitPanMockAll: true,
                    detailReason: 'history_current_site',
                    detailModule: 'history',
                  })
                : null;

            if (!historyDetailPicked || !historyDetailPicked.ep || !historyDetailPicked.ep.url) {
              historyDetailPicked = await tryPickFromCurrentSiteOnly({
                requireSeasoned: historyRequireSeasoned,
                panHints: null,
                panTokenHints: null,
                waitPanMockMs: 1200,
                tier: 1,
                waitPanMockAll: true,
                detailReason: 'history_current_site_fallback',
                detailModule: 'history',
              });
            }
            if (!historyDetailPicked || !historyDetailPicked.ep || !historyDetailPicked.ep.url) {
              try {
                await mappingReadyPromise;
              } catch (_e) {}
              historyDetailPicked = await tryPickFromCurrentSiteOnly({
                requireSeasoned: historyRequireSeasoned,
                panHints: null,
                panTokenHints: null,
                waitPanMockMs: 1200,
                tier: 1,
                waitPanMockAll: true,
                detailReason: 'history_current_site_fallback',
                detailModule: 'history',
              });
            }
            if (historyDetailPicked && historyDetailPicked.ep && historyDetailPicked.ep.url) {
              const f = smartComputeCandidateFeatures(historyDetailPicked);
              try {
                tmdbSmartLastPickDebug.value = {
                  want,
                  requireSeasoned,
                  cands: buildPickCandidateSnapshot(),
                  pickKind: 'history_site_detail',
                  siteKey: historyDetailPicked.siteKey || '',
                  siteName: historyDetailPicked.siteName || '',
                  spiderApi: historyDetailPicked.spiderApi || '',
                  videoId: historyDetailPicked.videoId || '',
                  panLabel: historyDetailPicked.panLabel || '',
                  epName: historyDetailPicked.ep && historyDetailPicked.ep.name != null ? String(historyDetailPicked.ep.name) : '',
                  epUrl: historyDetailPicked.ep && historyDetailPicked.ep.url != null ? String(historyDetailPicked.ep.url) : '',
                  matchSeason: Number.isFinite(Number(historyDetailPicked.matchSeason)) ? Math.floor(Number(historyDetailPicked.matchSeason)) : 0,
                  hasSeasonMarker: historyDetailPicked.hasSeasonMarker ? 1 : 0,
                  searchSeasonHint: Number.isFinite(Number(historyDetailPicked.searchSeasonHint))
                    ? Math.floor(Number(historyDetailPicked.searchSeasonHint))
                    : 0,
                  quality: f && f.quality ? String(f.quality) : '',
                  tierRank: f && Number.isFinite(Number(f.tierRank)) ? Number(f.tierRank) : 0,
                };
              } catch (_e) {}
              return historyDetailPicked;
            }
          }
          return null;
        };

    return await runSmartCandidateLoop({
      deadlineAt,
      allowHistoryOnce,
      considerFallback,
      allowDowngradeNow,
      onTimeoutFallback: () =>
        bestFallback && bestFallback.ep && bestFallback.ep.url && (allowDowngradeNow() || Date.now() >= deadlineAt)
          ? bestFallback
          : null,
      pickPrimary: async ({ detailDone }) => {
        const requireSeasoned =
          contentKind.value === 'series' &&
          (() => {
            const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
            const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
            return real.length >= 2;
          })();
        const tierNow = detailDone ? 1 : 0;
        const best = await tryPickOnce({ requireSeasoned, tier: tierNow, cacheOnly: !detailDone });
        if (!best || !best.ep || !best.ep.url) return null;
        try {
          tmdbSmartLastPickDebug.value = {
            want,
            requireSeasoned,
            cands: buildPickCandidateSnapshot(),
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
        return { cand: best, stop: is4kCandidate(best) };
      },
      pickAfterSearchDone: async ({ detailDone }) => {
        if (!detailDone) return null;
        const requireSeasoned =
          contentKind.value === 'series' &&
          (() => {
            const seasons = Array.isArray(tmdbSeasons.value) ? tmdbSeasons.value : [];
            const real = seasons.filter((x) => x && Number.isFinite(Number(x.season)) && Number(x.season) > 0);
            return real.length >= 2;
          })();
        if (requireSeasoned) {
          const relaxed = await tryPickOnce({ requireSeasoned: false, tier: 2, cacheOnly: false });
          if (relaxed && relaxed.ep && relaxed.ep.url) {
            try {
              tmdbSmartLastPickDebug.value = {
                want,
                requireSeasoned: false,
                cands: buildPickCandidateSnapshot(),
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
            return { cand: relaxed, stop: is4kCandidate(relaxed) };
          }
        }
        const tier3 = await tryPickOnce({ requireSeasoned: false, tier: 3, cacheOnly: false });
        if (tier3 && tier3.ep && tier3.ep.url) {
          try {
            tmdbSmartLastPickDebug.value = {
              want,
              requireSeasoned: false,
              cands: buildPickCandidateSnapshot(),
              siteKey: tier3.siteKey || '',
              siteName: tier3.siteName || '',
              spiderApi: tier3.spiderApi || '',
              videoId: tier3.videoId || '',
              panLabel: tier3.panLabel || '',
              epName: tier3.ep && tier3.ep.name != null ? String(tier3.ep.name) : '',
              epUrl: tier3.ep && tier3.ep.url != null ? String(tier3.ep.url) : '',
              matchSeason: Number.isFinite(Number(tier3.matchSeason)) ? Math.floor(Number(tier3.matchSeason)) : 0,
              hasSeasonMarker: tier3.hasSeasonMarker ? 1 : 0,
              searchSeasonHint: Number.isFinite(Number(tier3.searchSeasonHint)) ? Math.floor(Number(tier3.searchSeasonHint)) : 0,
            };
          } catch (_e) {}
          return { cand: tier3, stop: is4kCandidate(tier3) };
        }
        return null;
      },
    });
  };

    return await resolveSmartCandidate({ allowHistory: true });
  })();

  tmdbSmartPickInFlight.set(flightKey, run);
  try {
    return await run;
  } finally {
    tmdbSmartPickInFlight.delete(flightKey);
  }
};

const requestPlay = async (opts = {}) => {
  const trigger = opts && typeof opts === 'object' && typeof opts.trigger === 'string' ? opts.trigger : 'auto';
  const tmdbAttempt = opts && Number.isFinite(Number(opts.__tmdbAttempt)) ? Math.max(0, Math.floor(Number(opts.__tmdbAttempt))) : 0;
  const tmdbExcludeKeys = opts && Array.isArray(opts.__tmdbExcludeKeys) ? opts.__tmdbExcludeKeys : [];
  const forceProxyFromOpts = !!(opts && typeof opts === 'object' && opts.__forceProxy);
  if (trigger !== 'user' && autoPlaySuppressedByUser.value) return false;
  // Clear stale error before starting a new attempt (prevents "获取视频失败" flashing on entry auto attempts).
  playError.value = '';
  playerRuntimeError.value = '';
  if (trigger === 'user') {
    initialAutoPlayTriggered.value = true;
    autoPlaySuppressedByUser.value = false;
  }
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
  const resumeHistorySiteName =
    resumeHistory.value && typeof resumeHistory.value.siteName === 'string' ? String(resumeHistory.value.siteName).trim() : '';
  let historySiteName = resolvedSiteName.value || resumeHistorySiteName || historySiteKey;
  let historySpiderApi = api ? String(api) : '';
  let historyVideoId = (props.videoId || '').trim();

  let statsEpName = ep && ep.name != null ? String(ep.name) : '';
  let statsEpUrl = ep && ep.url != null ? String(ep.url) : '';
  let tmdbSmartPickedExcludeKey = '';
  let tmdbSmartPickedEpisodeNo = 0;
  let tmdbSmartPickedDebug = null;

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

  if (tmdbMode.value && isTMDBSitePanKey(selectedPanKey.value) && src && src.kind === 'tmdb_site_pan') {
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

  if (tmdbSmartListAvailable.value && isSmartPanKey(selectedPanKey.value)) {
    const wantEpisode = resolveSmartEpisodeNo(ep);
    tmdbSmartPickedEpisodeNo = wantEpisode > 0 ? wantEpisode : 0;
    const useDesiredSeasonHint = selectedPanKey.value !== DOUBAN_SMART_PAN_KEY;
    const desiredSeason = useDesiredSeasonHint && ep && Number.isFinite(Number(ep.__tmdbSeason)) ? Math.floor(Number(ep.__tmdbSeason)) : 0;
    const desiredEpisodeInSeason =
      useDesiredSeasonHint && ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode)) ? Math.floor(Number(ep.__tmdbSeasonEpisode)) : 0;
    const metaId = Number(props.tmdbId || 0);
    const metaType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : 'tv';

    // server-side season_meta push disabled

    const seasonEp = wantEpisode > 0 ? tmdbSeasonEpisodeOfGlobal(wantEpisode) : { season: 0, episode: 0 };
    const seasonNo = desiredSeason > 0 ? desiredSeason : (seasonEp && seasonEp.season ? Number(seasonEp.season) : 0);
    const episodeNo =
      desiredEpisodeInSeason > 0
        ? desiredEpisodeInSeason
        : (seasonEp && seasonEp.episode ? Number(seasonEp.episode) : 0);

    const picked = await resolveTMDBSmartPlaybackCandidate({ episodeNo: wantEpisode, seasonNo: desiredSeason, excludeKeys: tmdbExcludeKeys });
    if (!picked) {
      // Only show a hard error for explicit user actions; auto-init will retry as sources/pans become available.
      if (trigger === 'user' || trigger === 'auto_next') {
        playError.value = '获取视频失败，请通过手动搜索选择其他源';
      }
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
	      tmdbSmartPickedExcludeKey = picked.candidateKey ? String(picked.candidateKey) : '';
	      try {
	        const provider = panMockProviderFromFlag(flag) || guessPreferredPanFromFlag(flag) || '';
	        const quality = smartGuessQuality(String(playFilename || '')) || '';
	        tmdbSmartPickedDebug = {
	          trigger,
	          want: tmdbSmartPickedEpisodeNo,
	          siteKey: historySiteKey,
	          siteName: historySiteName || '',
	          spiderApi: picked.spiderApi || '',
	          videoId: historyVideoId || '',
	          panFlag: String(flag || '').trim(),
	          provider,
	          quality,
	          showName: String(playShareUrl || '').trim(),
	          rawName: String(playFilename || '').trim(),
	        };
	      } catch (_e) {}
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
	      tmdbSmartPickedExcludeKey = smartCandidateKey(picked);
	      try {
	        const feat = smartComputeCandidateFeatures(picked);
	        const rawNames = extractRawNamesFromEpisodeUrl(String(statsEpUrl || id || ''));
	        const rawName = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '').trim() : '';
	        const showName =
	          picked && Array.isArray(picked.texts) && picked.texts.length >= 2 && picked.texts[1] != null ? String(picked.texts[1] || '').trim() : '';
	        tmdbSmartPickedDebug = {
	          trigger,
	          want: tmdbSmartPickedEpisodeNo,
	          siteKey: historySiteKey,
	          siteName: historySiteName || picked.siteName || '',
	          spiderApi: picked.spiderApi || '',
	          videoId: historyVideoId || picked.videoId || '',
	          panFlag: String(flag || '').trim(),
	          provider: panMockProviderFromFlag(flag) || guessPreferredPanFromFlag(flag) || '',
	          quality: feat && feat.quality ? String(feat.quality) : '',
	          showName,
	          rawName,
	        };
	      } catch (_e) {}
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
  const pickPathNameForStats = (episodeName) => {
    const raw = typeof episodeName === 'string' ? episodeName.trim() : '';
    if (!raw) return '';
    const head = raw.includes('$') ? String(raw.split('$')[0] || '').trim() : raw;
    if (!head) return '';
    // Only show directory-like text as "路径" to avoid duplicating plain filenames.
    if (head.includes('/')) return head;
    return '';
  };

  try {
    const statsMeta = getAggregatedSourceDisplayMeta({
      siteKey: historySiteKey,
      spiderApi: historySpiderApi,
      videoId: historyVideoId,
      fallbackSiteName: historySiteName,
    });
    playerStatsSiteName.value = statsMeta && statsMeta.siteTitleLabel ? String(statsMeta.siteTitleLabel) : '';
    playerStatsPathName.value = pickPathNameForStats(statsEpName);
    playerStatsRawFileName.value = pickRawFileNameForStats(statsEpName, statsEpUrl || id);
  } catch (_e) {
    playerStatsSiteName.value = '';
    playerStatsPathName.value = '';
    playerStatsRawFileName.value = '';
  }

  const hasId = !!(id && String(id).trim());
  const hasFilename = !!(playFilename && String(playFilename).trim());
  if (!api || !flag || (!hasId && !hasFilename)) return false;
  const playKey = `${api}::${selectedPanKey.value}::${idx}::${flag}::${hasFilename ? `file:${playFilename}` : `id:${id}`}`;
  // Only guard concurrent in-flight requests; do not dedupe by `playKey`.
  const smartPlayCtx =
    tmdbSmartListAvailable.value && isSmartPanKey(selectedPanKey.value) && tmdbSmartPickedEpisodeNo > 0
      ? {
          ...(tmdbSmartPickedDebug && typeof tmdbSmartPickedDebug === 'object' ? tmdbSmartPickedDebug : {}),
          want: tmdbSmartPickedEpisodeNo,
          siteKey: (tmdbSmartPickedDebug && tmdbSmartPickedDebug.siteKey) || historySiteKey || '',
          siteName: (tmdbSmartPickedDebug && tmdbSmartPickedDebug.siteName) || historySiteName || '',
          spiderApi: (tmdbSmartPickedDebug && tmdbSmartPickedDebug.spiderApi) || historySpiderApi || '',
          videoId: (tmdbSmartPickedDebug && tmdbSmartPickedDebug.videoId) || historyVideoId || '',
          panFlag: String(flag || '').trim(),
        }
      : null;

  const releaseLowPriority = pauseCatLowPriority();
  const panKeyAtCall = selectedPanKey.value;
  const idxAtCall = idx;
  const tmdbSubPanKeyAtCall =
    tmdbSmartListAvailable.value && isTMDBSitePanKey(panKeyAtCall) ? String(tmdbSelectedSitePanKey.value || '') : '';
  const epNameAtCall = ep && ep.name ? String(ep.name) : '';
  const targetResumeIdentity = computeResumeIdentityByEpisode({ idx: idxAtCall, ep });
  const currentResumeIdentity = currentPlaybackResumeIdentity.value ? String(currentPlaybackResumeIdentity.value) : '';

  // Each play attempt has its own resume-seek window.
  resumeSeekState.key = '';
  resumeSeekState.applied = false;
  resumeSeekState.tryKey = '';
  resumeSeekState.tryAt = 0;
  resumeSeekState.frozen = false;
  resumeSeekState.logKey = '';

  // Prefer latest in-session progress when switching source/quality/pan for the same episode.
  try {
    resumeSeekOverrideState.identity = '';
    resumeSeekOverrideState.sec = 0;
    resumeSeekOverrideState.at = 0;
    const curSec = Number(playerTimeState.currentTime);
    if (
      playerUrl.value &&
      (playerPlaybackStarted.value || playerFirstFrameReady.value) &&
      Number.isFinite(curSec) &&
      curSec > 3 &&
      targetResumeIdentity &&
      currentResumeIdentity &&
      targetResumeIdentity === currentResumeIdentity
    ) {
      resumeSeekOverrideState.identity = targetResumeIdentity;
      resumeSeekOverrideState.sec = Math.floor(curSec);
      resumeSeekOverrideState.at = Date.now();
    }
  } catch (_e) {}

  playRequestState.seq += 1;
  const seqAtCall = playRequestState.seq;
  try {
    if (playRequestState.controller) playRequestState.controller.abort();
  } catch (_e) {}
  const controller = new AbortController();
  playRequestState.controller = controller;

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
    pendingProxyRetry.value = null;
    clearPendingProxyRetryTimer();
    if (playerFirstFrameTimer) {
      window.clearTimeout(playerFirstFrameTimer);
      playerFirstFrameTimer = 0;
    }
    try {
			    const apiBase = resolveCatApiBaseForPlay();
			    const tvUser = props.bootstrap?.user?.username || '';
			    try {
			      if (smartPlayCtx) smartDebugLog('play_try', { ...smartPlayCtx });
			    } catch (_e) {}

		        const fetchPlay = async () => {
	          const siteApi = String(api || '').trim();
	          const siteId = (() => {
	            const m = /^\/([a-f0-9]{10})\/spider\//.exec(siteApi);
	            return m && m[1] ? String(m[1]) : '';
	          })();

		          const provider = panMockProviderFromFlag(flag);
		          if (provider) {
                const providerConfigured = await isBuiltinPanProviderConfiguredForPlay(provider);
                if (!providerConfigured) {
                  // Fallback to spider-native play flow when builtin pan account is not configured.
                } else {
		            const call = async (path, body) => {
		              const headers = { 'Content-Type': 'application/json' };
		              const u = typeof tvUser === 'string' ? tvUser.trim() : '';
		              if (u) headers['X-TV-User'] = u;
		              const resp = await fetch(path, {
		                method: 'POST',
		                headers,
		                body: JSON.stringify(body || {}),
		                signal: controller.signal,
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
		          }

	          const raw = await requestCatPlay({
	            apiBase,
	            username: tvUser,
	            signal: controller.signal,
	            payload: {
	              flag,
	              ...(playFilename ? { filename: playFilename, ...(playShareUrl ? { url: playShareUrl } : {}) } : { id }),
	              siteApi,
	              ...(siteId ? { siteId } : {}),
	            },
	          });
	          const rewritten = rewritePlayPayloadUrls(raw, apiBase, tvUser);
	          const payload = normalizePlayPayload(rewritten);
	          const rawHeaders = payload && payload.header && typeof payload.header === 'object' ? payload.header : {};
            const resolvedPlay = resolvePlayTargetForPlayback({ payload, rawHeaders });
	          return { raw, payload, url: resolvedPlay.url, rawHeaders: resolvedPlay.headers, playSelection: resolvedPlay };
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
        const preferredPan = guessPreferredPanFromFlag(flag);
        const applyProxyFallbackChain = async () => {
	        // HLS/m3u8: if possible, use catpawrunner m3u8 proxy mode to avoid CORS/IP-bound issues.
	        // - index.m3u8: catpawrunner fetches playlist with headers and returns absolute URIs (segments are upstream)
	        // - proxy.m3u8: playlist + segments/key are proxied through catpawrunner
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

          // Prefer GoProxy when available; if still carrying playback headers,
          // register catpawrunner proxy token as the next fallback.
          if (hasNonEmptyHeaders(finalHeaders)) {
            const sourceUrl =
              playResult &&
              playResult.playSelection &&
              typeof playResult.playSelection.proxySourceUrl === 'string' &&
              playResult.playSelection.proxySourceUrl.trim()
                ? playResult.playSelection.proxySourceUrl.trim()
                : finalUrl;
            try {
              const out = await registerCatProxyToken({ apiBase, tvUser, url: sourceUrl, headers: finalHeaders });
              if (out && typeof out.proxyUrl === 'string' && out.proxyUrl.trim()) {
                finalUrl = out.proxyUrl.trim();
                finalHeaders = {};
                disableGoProxy = true;
              }
            } catch (e) {
              // Last fallback for older backends: legacy local /proxy passthrough URL.
              const localProxyUrl = buildLocalProxyPlaybackUrl({ apiBase, sourceUrl, headers: finalHeaders });
              if (localProxyUrl) {
                finalUrl = localProxyUrl;
                finalHeaders = {};
                disableGoProxy = true;
              } else {
                console.warn('[CatProxy] register failed:', e && e.message ? e.message : e);
              }
            }
          }
        };

        if (forceProxyFromOpts) {
          await applyProxyFallbackChain();
        } else {
          // Keep legacy behavior: do not pre-probe.
          // Start direct playback first, then fallback chain only after player runtime error.
          goProxyInUseBase.value = '';
          lastGoProxyCandidate.value = {
            url: finalUrl,
            headers: finalHeaders,
            preferredPan,
            enabled: false,
          };
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
				    try {
				      if (smartPlayCtx) smartDebugLog('play_ok', { ...smartPlayCtx, url: finalUrl, goProxyBase: String(goProxyInUseBase.value || '') });
				    } catch (_e) {}
            const canRetryWithProxy = !forceProxyFromOpts && hasNonEmptyHeaders(finalHeaders);
            pendingProxyRetry.value = canRetryWithProxy
              ? { playKey, panKey: panKeyAtCall, idx: idxAtCall, trigger }
              : null;
            currentPlayingPanFlag.value = String(flag || '').trim();
            playerStatsPanName.value = currentPlayingPanFlag.value;
					    playerUrl.value = finalUrl;
				    playerHeaders.value = finalHeaders;
				    playingPanKey.value = panKeyAtCall;
				    playingEpisodeIndex.value = idxAtCall;
            const prevSmartEpisodeNo = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
            const smartEpisodeCandidate = (() => {
              if (!tmdbMode.value || tmdbMovieMode.value) return 0;
              const direct = resolveSmartEpisodeNo(ep);
              if (direct > 0) return direct;
              const m = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[idxAtCall] : null;
              const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
              const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
              if (s > 0 && e > 0) {
                const gt = tmdbGlobalEpisodeNoOf(s, e);
                if (gt > 0) return gt;
                if (String(panKeyAtCall || '') === DOUBAN_SMART_PAN_KEY) {
                  const gd = doubanGlobalEpisodeNoOf(s, e, doubanSeasonMeta.value);
                  if (gd > 0) return gd;
                }
                return e;
              }
              if (e > 0) return e;
              return idxAtCall >= 0 ? idxAtCall + 1 : 0;
            })();
            const smartEpisodeValid = isSmartEpisodeNoValid(smartEpisodeCandidate);
            const smartEpisodeFinal = smartEpisodeValid ? smartEpisodeCandidate : prevSmartEpisodeNo;
            playingSmartEpisodeNo.value = smartEpisodeFinal;
				    playingTMDBSubPanKey.value = tmdbSubPanKeyAtCall;
            currentPlayingEpisodeUrl.value = String(ep && ep.url != null ? ep.url : (statsEpUrl || id || '')).trim();
            currentPlayingEpisodeRawName.value = pickRawFileNameForStats(epNameAtCall, statsEpUrl || id || '').trim();
            currentPlayingEpisodeMatchKey.value = buildEpisodeMatchKey(epNameAtCall, currentPlayingEpisodeRawName.value);
            currentPlaybackResumeIdentity.value = targetResumeIdentity || '';
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
				      if (siteKey && spiderApi && videoId && videoTitle) {
				        const tmdbSeasonAtCall = (() => {
				          if (!tmdbMode.value) return 0;
                  if (!smartEpisodeValid) {
                    const prev = lastHistoryPayload.value && typeof lastHistoryPayload.value === 'object' ? lastHistoryPayload.value : null;
                    const prevSeason = prev && Number.isFinite(Number(prev.tmdbSeason)) ? Math.floor(Number(prev.tmdbSeason)) : 0;
                    if (prevSeason > 0) return prevSeason;
                  }
				          // Smart lists carry explicit season/episode metadata.
				          if (ep && Number.isFinite(Number(ep.__tmdbSeason))) {
				            const s = Math.floor(Number(ep.__tmdbSeason));
				            if (s > 0) return s;
				          }
				          const m = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[idxAtCall] : null;
				          const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
				          return s > 0 ? s : 0;
				        })();
				        const tmdbEpisodeAtCall = (() => {
				          if (!tmdbMode.value) return 0;
                  if (!smartEpisodeValid) {
                    const prev = lastHistoryPayload.value && typeof lastHistoryPayload.value === 'object' ? lastHistoryPayload.value : null;
                    const prevEpisode = prev && Number.isFinite(Number(prev.tmdbEpisode)) ? Math.floor(Number(prev.tmdbEpisode)) : 0;
                    if (prevEpisode > 0) return prevEpisode;
                  }
				          if (ep && Number.isFinite(Number(ep.__tmdbSeasonEpisode))) {
				            const n = Math.floor(Number(ep.__tmdbSeasonEpisode));
				            if (n > 0) return n;
				          }
				          const m = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[idxAtCall] : null;
				          const n = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
				          return n > 0 ? n : 0;
				        })();
                const normalizedFlagAtCall = String(flag || '').trim();
				        const payloadForHistory = {
				          siteKey,
				          siteName: historySiteName || resolvedSiteName.value || '',
				          spiderApi,
				          videoId,
				          videoTitle,
				          contentKey: getStableContentKey() || computeHistoryContentKey(videoTitle) || '',
				          videoPoster: (meta && meta.pic ? String(meta.pic) : '') || historyCoverPoster.value || pickHistoryPoster() || '',
				          videoRemark: (tmdbMode.value ? tmdbHistoryRemark.value : displayRemark.value) || '',
				          tmdbId: meta && Number.isFinite(Number(meta.tmdbId)) ? Number(meta.tmdbId) : (tmdbMode.value ? Number(props.tmdbId || 0) : 0),
				          tmdbType: meta && typeof meta.mediaType === 'string' ? meta.mediaType : (tmdbMode.value ? String(props.tmdbType || '').trim().toLowerCase() : ''),
				          tmdbSeason: tmdbSeasonAtCall ? Number(tmdbSeasonAtCall) : 0,
				          tmdbEpisode: tmdbEpisodeAtCall ? Number(tmdbEpisodeAtCall) : 0,
				          panLabel: (src && src.label ? String(src.label) : '').trim(),
				          playFlag: normalizedFlagAtCall,
				          episodeIndex: idxAtCall >= 0 ? idxAtCall : 0,
				          episodeName: tmdbMode.value ? '' : epNameAtCall,
				        };
                try {
                  smartDebugLog('history_flag_resolve', {
                    module: 'play',
                    trigger: String(trigger || ''),
                    currentFlag: normalizedFlagAtCall,
                    finalFlag: normalizedFlagAtCall,
                  });
                } catch (_e) {}
				        // For multi-device resume syncing (Emby-compatible clients), store a stable item id when possible.
				        try {
				          const metaId = payloadForHistory.tmdbId ? Number(payloadForHistory.tmdbId) : 0;
				          const metaType = payloadForHistory.tmdbType ? String(payloadForHistory.tmdbType) : '';
				          const seasonNo = tmdbSeasonAtCall ? Number(tmdbSeasonAtCall) : 0;
				          const episodeNo = tmdbEpisodeAtCall ? Number(tmdbEpisodeAtCall) : 0;
				          payloadForHistory.playbackItemId = buildJellyfinPlaybackItemId({ tmdbType: metaType, tmdbId: metaId, seasonNo, episodeNo }) || '';
				        } catch (_e) {}
				        lastHistoryPayload.value = payloadForHistory;
                try {
                  const eager = trigger === 'user' || trigger === 'auto_next';
                  commitHistoryBaseIfNeeded(`play_url:${String(trigger || '')}`, { force: eager });
                } catch (_e) {}
				        // Defer committing history until playback actually starts (playing/firstframe/timeupdate),
				        // otherwise a failed/aborted attempt may overwrite cross-device resume info.
				      }
				    } catch (_e) {
			      // ignore (history not critical)
			    }
		  } catch (e) {
		    const status = e && typeof e.status === 'number' ? e.status : 0;
		    const msg = (e && e.message) || '请求失败';
        pendingProxyRetry.value = null;
        clearPendingProxyRetryTimer();
		    try {
		      if (smartPlayCtx) smartDebugLog('play_err', { ...smartPlayCtx, err: status ? `HTTP ${status}：${msg}` : String(msg || '') });
		    } catch (_e) {}
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
    try {
      if (playRequestState.controller === controller) playRequestState.controller = null;
    } catch (_e) {}
    releaseLowPriority();
    if (tmdbSmartListAvailable.value && isSmartPanKey(selectedPanKey.value)) releaseLowPriorityHold();
  }
  const success = !!(playerUrl.value && String(playerUrl.value || '').trim());
  if (
    !success &&
    tmdbSmartListAvailable.value &&
    isSmartPanKey(selectedPanKey.value) &&
    tmdbSmartPickedEpisodeNo > 0 &&
    tmdbSmartPickedExcludeKey &&
    tmdbAttempt < 2
  ) {
    try {
      tmdbSmartPickCache.delete(tmdbSmartPickedEpisodeNo);
      tmdbSmartPickCacheVersion.value += 1;
    } catch (_e) {}
    const nextExclude = tmdbExcludeKeys.concat([tmdbSmartPickedExcludeKey]).map((k) => (k != null ? String(k) : '')).filter(Boolean);
    return await requestPlay({ ...opts, __tmdbAttempt: tmdbAttempt + 1, __tmdbExcludeKeys: nextExclude });
  }
  return success;
};

const pickFirstPlayablePanKey = () => {
  const list = Array.isArray(sitePanOptions.value) ? sitePanOptions.value : [];
  for (let i = 0; i < list.length; i += 1) {
    const pan = list[i];
    const eps = pan && Array.isArray(pan.episodes) ? pan.episodes : [];
    if (eps.length) return pan && pan.key ? String(pan.key) : '';
  }
  return '';
};

const hasAnyPlayablePan = () => !!pickFirstPlayablePanKey();

const pickNextAggregatedSource = () => {
  const list = Array.isArray(aggregatedSources.value) ? aggregatedSources.value : [];
  if (!list.length) return null;
  const curKey = `${(props.siteKey || '').trim()}::${(props.spiderApi || '').trim()}::${(props.videoId || '').trim()}`;
  let startIdx = list.findIndex((s) => {
    const k = `${(s && s.siteKey ? String(s.siteKey) : '').trim()}::${(s && s.spiderApi ? String(s.spiderApi) : '').trim()}::${(s && s.videoId ? String(s.videoId) : '').trim()}`;
    return !!(curKey && k === curKey);
  });
  if (startIdx < 0) startIdx = 0;
  for (let offset = 1; offset <= list.length; offset += 1) {
    const idx = (startIdx + offset) % list.length;
    const s = list[idx];
    const siteKey = s && s.siteKey ? String(s.siteKey).trim() : '';
    const spiderApi = s && s.spiderApi ? String(s.spiderApi).trim() : '';
    const videoId = s && s.videoId ? String(s.videoId).trim() : '';
    if (!siteKey || !spiderApi || !videoId) continue;
    const key = `${siteKey}::${spiderApi}::${videoId}`;
    if (autoSourceFallbackTried.has(key)) continue;
    return { ...s, __key: key };
  }
  return null;
};

const tryAutoFallbackToNextSource = () => {
  if (tmdbMode.value) return false;
  const next = pickNextAggregatedSource();
  if (!next || !next.__key) {
    autoFallbackActive.value = false;
    return false;
  }
  autoSourceFallbackTried.add(next.__key);
  autoFallbackActive.value = true;
  try {
    window.dispatchEvent(
      new CustomEvent('tv:open-play', {
        detail: {
          siteKey: next.siteKey || '',
          spiderApi: next.spiderApi || '',
          videoId: next.videoId || '',
          videoTitle: next.videoTitle || '',
          videoPoster: next.videoPoster || '',
          videoRemark: next.videoRemark || '',
          contentKey: getStableContentKey(),
          switchOnly: true,
          switchOnlyToken: Date.now(),
        },
      })
    );
  } catch (_e) {
    return false;
  }
  return true;
};

const tryAutoStartPlayback = () => {
  if (initialAutoPlayTriggered.value) return;
  if (initialAutoPlayInFlight.value) return;
  if (autoPlaySuppressedByUser.value && !autoFallbackActive.value) return;
  if (introLoading.value) return;
  if (!resumeHistoryLoaded.value) return;
  if (resumeHistoryFound.value == null) return;
  // History restore must settle (episode/pan) before first auto play.
  if (resumeHistoryFound.value && !resumeHistoryApplied.value) return;
  // PanMock list must finish resolving before autoplay; otherwise episode list can still be placeholder.
  if (!tmdbMode.value) {
    const resolving =
      detail.value &&
      typeof detail.value === 'object' &&
      detail.value.panMockEnabled === true &&
      detail.value.panMockResolving === true;
    if (resolving) return;
  }
  // TMDB entries: wait for TMDB/Douban episode list to finish building.
  if (tmdbMode.value) {
    if (tmdbMovieMode.value) {
      if (!tmdbMovieSmartListAvailable.value) return;
    } else {
      if (!tmdbSmartListAvailable.value && !doubanSmartListAvailable.value) return;
    }
  }
  // If we have a resume target, ensure the episode list is ready and the selected index matches it
  // before starting autoplay (prevents "auto_init" from using episode 1).
  if (resumeWanted.value && typeof resumeWanted.value === 'object') {
    const w = resumeWanted.value;
    const wantedSeason = Number.isFinite(Number(w.season)) ? Math.floor(Number(w.season)) : 0;
    const wantedEpisode = Number.isFinite(Number(w.episode)) ? Math.floor(Number(w.episode)) : 0;
    const wantedIndex = Number.isFinite(Number(w.indexFallback)) ? Math.floor(Number(w.indexFallback)) : 0;
    if (wantedEpisode > 0 && selectedEpisodes.value.length < wantedEpisode) return;
    const idx = pickResumeEpisodeIndex({ wantedSeason, wantedEpisode, wantedIndex });
    if (Number.isFinite(idx) && idx >= 0 && Number(selectedEpisodeIndex.value) !== idx) return;
  }
  // Site entries: if history points to a pan playFlag, wait until pan-mock list is resolved.
  if (!tmdbMode.value) {
    const h = resumeHistory.value && typeof resumeHistory.value === 'object' ? resumeHistory.value : null;
    const playFlag = h && typeof h.playFlag === 'string' ? h.playFlag.trim() : '';
    if (playFlag) {
      const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
      if (d.panMockEnabled === true && d.panMockResolved !== true) return;
    }
  }
  // Site entries without history: prefer smart list if available, otherwise pick the first pan with data.
  if (!tmdbMode.value && resumeHistoryLoaded.value && !resumeHistory.value) {
    if (legacySmartListAvailable.value) {
      if (selectedPanKey.value !== SMART_PAN_KEY) selectPan(SMART_PAN_KEY);
    } else {
      const panKey = pickFirstPlayablePanKey();
      if (panKey) {
        if (selectedPanKey.value !== panKey) selectPan(panKey);
      } else if (tryAutoFallbackToNextSource()) {
        return;
      }
    }
  }
  if (!selectedEpisodes.value.length) return;
				  if (!tmdbSmartListAvailable.value && !tmdbMovieMode.value) {
				    void ensureResolvedSpiderApiFallback();
				    if (!resolvedSpiderApiFinal.value) return;
				  }
  if (selectedEpisodeIndex.value < 0) {
    const w = resumeWanted.value && typeof resumeWanted.value === 'object' ? resumeWanted.value : null;
    if (w) {
      const wantedSeason = Number.isFinite(Number(w.season)) ? Math.floor(Number(w.season)) : 0;
      const wantedEpisode = Number.isFinite(Number(w.episode)) ? Math.floor(Number(w.episode)) : 0;
      const wantedIndex = Number.isFinite(Number(w.indexFallback)) ? Math.floor(Number(w.indexFallback)) : 0;
      setEpisodeIndex(pickResumeEpisodeIndex({ wantedSeason, wantedEpisode, wantedIndex }), 'autoplay_pickResume');
    } else {
      // Only default to episode 0 when we are sure there is no history.
      if (resumeHistoryFound.value === false) setEpisodeIndex(0, 'autoplay_default0');
      else return;
    }
  }
  initialAutoPlayInFlight.value = true;
  void requestPlay({ trigger: 'auto_init' })
    .then((started) => {
      if (!started) return;
      autoFallbackActive.value = false;
      initialAutoPlayTriggered.value = true;
    })
    .catch(() => {})
    .finally(() => {
      initialAutoPlayInFlight.value = false;
    });
};

const resumeSeekState = { key: '', applied: false, tryKey: '', tryAt: 0, frozen: false, logKey: '' };
const resumeSeekOverrideState = { identity: '', sec: 0, at: 0 };
watch(
  () => playerUrl.value,
  () => {
    // Keep per-attempt anti-spam throttling; full resume window is reset in requestPlay().
    resumeSeekState.tryKey = '';
    resumeSeekState.tryAt = 0;
    resumeSeekState.logKey = '';
  },
  { immediate: true }
);

const fromTicks = (ticks) => {
  const t = Number(ticks);
  if (!Number.isFinite(t) || t <= 0) return 0;
  return t / 10_000_000;
};

const computeResumeIdentityByEpisode = ({ idx, ep } = {}) => {
  try {
    const nIdx = Number.isFinite(Number(idx)) ? Math.max(0, Math.floor(Number(idx))) : 0;
    if (tmdbMode.value) {
      const typ = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
      const tmdbId = Number(props.tmdbId || 0);
      if (!(tmdbId > 0)) return `tmdb::${typ || 'tv'}::idx:${nIdx}`;
      if (typ === 'movie') return `tmdb_movie_${Math.floor(tmdbId)}`;
      const m =
        ep && typeof ep === 'object' && Number.isFinite(Number(ep.__tmdbSeason)) && Number.isFinite(Number(ep.__tmdbSeasonEpisode))
          ? { season: Math.floor(Number(ep.__tmdbSeason)), episode: Math.floor(Number(ep.__tmdbSeasonEpisode)) }
          : (Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[nIdx] : null) || null;
      const sn = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      const en = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
      if (sn > 0 && en > 0) return `tmdb_tv_${Math.floor(tmdbId)}_s${String(sn).padStart(2, '0')}_e${String(en).padStart(3, '0')}`;
      return `tmdb_tv_${Math.floor(tmdbId)}::idx:${nIdx}`;
    }
    const stable = getStableContentKey();
    return `${stable || 'site'}::idx:${nIdx}`;
  } catch (_e) {
    return '';
  }
};

const computeCurrentResumeIdentity = () => {
  const idxRaw = Number(selectedEpisodeIndex.value);
  const idx = Number.isFinite(idxRaw) ? Math.max(0, Math.floor(idxRaw)) : 0;
  const eps = selectedEpisodes.value;
  const ep = Array.isArray(eps) && idx < eps.length ? eps[idx] : null;
  return computeResumeIdentityByEpisode({ idx, ep });
};

const getResumeSeekDecisionKey = () => `${String(playerUrl.value || '')}::${selectedEpisodeIndex.value}`;
const logResumeSeekDecisionOnce = (type, payload) => {
  try {
    if (!debugEnabled.value) return;
    const key = getResumeSeekDecisionKey();
    if (!key) return;
    if (resumeSeekState.logKey === key) return;
    resumeSeekState.logKey = key;
    smartDebugLog(type, payload);
  } catch (_e) {}
};

const computeResumeSeekSeconds = () => {
  const overrideIdentity = String(resumeSeekOverrideState.identity || '').trim();
  const currentIdentity = computeCurrentResumeIdentity();
  if (overrideIdentity && currentIdentity && overrideIdentity === currentIdentity) {
    const secRaw = Number(resumeSeekOverrideState.sec);
    const sec = Number.isFinite(secRaw) ? Math.floor(secRaw) : 0;
    if (sec >= 3) return sec;
  }
  const h = resumeHistory.value && typeof resumeHistory.value === 'object' ? resumeHistory.value : null;
  if (!h) return 0;
  const posSec = fromTicks(h.playbackPositionTicks || 0);
  if (!Number.isFinite(posSec) || posSec <= 0) return 0;
  const sec = Math.floor(posSec);
  if (sec < 3) return 0;

  const runtimeSec = fromTicks(h.playbackRuntimeTicks || 0);
  if (Number.isFinite(runtimeSec) && runtimeSec > 0) {
    if (runtimeSec - sec < 25) return 0;
  }

	// Guard: only resume-seek when the current selected episode matches the history entry.
		// - If `playbackItemId` looks like a TMDB item id, prefer it (episodeIndex is not reliable cross-device).
		// - Otherwise, if panLabel is "TMDB/豆瓣", also prefer `playbackItemId`.
		// - Otherwise (site/netdisk), use `episodeIndex`.
		try {
			const panLabelRaw =
				(h.panLabel != null ? String(h.panLabel) : '') ||
				(h.pan_label != null ? String(h.pan_label) : '');
			const panLabel = String(panLabelRaw || '').trim().toLowerCase();
			const isSmartLabel = panLabel === 'tmdb' || panLabel === 'douban' || panLabel === '豆瓣';

			const pbRaw =
				(h.playbackItemId != null ? String(h.playbackItemId) : '') ||
				(h.playback_item_id != null ? String(h.playback_item_id) : '');
			const wantedPb = String(pbRaw || '').trim();
		const isTmdbPb = /^tmdb_(tv|movie)_/i.test(wantedPb);
		if ((isTmdbPb || isSmartLabel) && wantedPb && tmdbMode.value) {
			const typ = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
			const tmdbId = Number(props.tmdbId || 0);
			const curIdxRaw = Number(selectedEpisodeIndex.value);
			const curIdx = Number.isFinite(curIdxRaw) ? Math.floor(curIdxRaw) : -1;
			if (tmdbId > 0 && curIdx >= 0) {
				let curPb = '';
				if (typ === 'movie') {
					curPb = `tmdb_movie_${Math.floor(tmdbId)}`;
				} else if (typ === 'tv') {
					const m = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[curIdx] : null;
					const sn = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
					const ep = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
					if (sn > 0 && ep > 0) {
						const ss = String(sn).padStart(2, '0');
						const ee = String(ep).padStart(3, '0');
						curPb = `tmdb_tv_${Math.floor(tmdbId)}_s${ss}_e${ee}`;
					}
				}
				if (curPb && curPb.toLowerCase() !== wantedPb.toLowerCase()) {
					logResumeSeekDecisionOnce('resume_seek_skip', {
						reason: 'pb_mismatch',
						panLabel,
						wantedPb,
						curPb,
						selectedEpisodeIndex: curIdx,
					});
					return 0;
				}
				if (!curPb) {
					logResumeSeekDecisionOnce('resume_seek_skip', {
						reason: 'pb_unavailable',
						panLabel,
						wantedPb,
						selectedEpisodeIndex: curIdx,
					});
					return 0;
				}
			}
		} else {
			const curIdxRaw = Number(selectedEpisodeIndex.value);
			const curIdx = Number.isFinite(curIdxRaw) ? Math.floor(curIdxRaw) : -1;
			const wantedNameRaw =
				(h.episodeName != null ? String(h.episodeName) : '') ||
				(h.episode_name != null ? String(h.episode_name) : '');
			const wantedName = String(wantedNameRaw || '').trim();
			if (wantedName && curIdx >= 0) {
				const eps = selectedEpisodes.value;
				const curEp = Array.isArray(eps) && curIdx < eps.length ? eps[curIdx] : null;
				const curName = curEp && curEp.name != null ? String(curEp.name).trim() : '';
				if (curName) {
					const a = normalizeEpisodeNameForExactMatch(wantedName);
					const b = normalizeEpisodeNameForExactMatch(curName);
					if (a && b && a !== b) {
						logResumeSeekDecisionOnce('resume_seek_skip', {
							reason: 'episode_name_mismatch',
							panLabel,
							wantedName,
							curName,
							curIdx,
						});
						return 0;
					}
				}
			}
			const wantedIdxRaw = h.episodeIndex != null ? Number(h.episodeIndex) : NaN;
			if (Number.isFinite(wantedIdxRaw) && wantedIdxRaw >= 0) {
				const wantedIdx = Math.floor(wantedIdxRaw);
				if (curIdx >= 0 && curIdx !== wantedIdx) {
					logResumeSeekDecisionOnce('resume_seek_skip', {
						reason: 'episode_index_mismatch',
						panLabel,
						wantedIdx,
						curIdx,
					});
					return 0;
				}
			}
		}
	} catch (_e) {}

  return sec;
};

const maybeApplyResumeSeek = (trigger = '') => {
  if (!resumeHistoryLoaded.value) return;
  if (!playerUrl.value) return;
  if (resumeSeekState.frozen) return;
  const sec = computeResumeSeekSeconds();
  if (!sec) return;
  const key = `${playerUrl.value}::${selectedEpisodeIndex.value}`;
  if (resumeSeekState.applied && resumeSeekState.key === key) return;
  const now = Date.now();
  if (resumeSeekState.tryKey === key && now-resumeSeekState.tryAt < 800) return;
  resumeSeekState.tryKey = key;
  resumeSeekState.tryAt = now;

  try {
    const player = artPlayerRef.value;
    if (!player || typeof player.seekTo !== 'function') return;
    const curSec = Number.isFinite(Number(playerTimeState.currentTime)) ? Number(playerTimeState.currentTime) : 0;
    if (playerPlaybackStarted.value && curSec > sec + 3) {
      // Playback has already advanced beyond resume point; never rewind on later state/list changes.
      resumeSeekState.key = key;
      resumeSeekState.applied = true;
      resumeSeekState.frozen = true;
      return;
    }
    const ok = player.seekTo(sec);
    if (!ok) return;
    resumeSeekState.key = key;
    resumeSeekState.applied = true;
    resumeSeekState.frozen = true;
    try {
      resumeSeekState.logKey = key;
      smartDebugLog('resume_seek', {
        module: 'play',
        sec,
        trigger: String(trigger || ''),
        siteKey: typeof props.siteKey === 'string' ? props.siteKey : '',
        siteName: '',
        spiderApi: typeof props.spiderApi === 'string' ? props.spiderApi : '',
        videoId: typeof props.videoId === 'string' ? props.videoId : '',
        tmdbId: Number.isFinite(Number(props.tmdbId || 0)) ? Number(props.tmdbId || 0) : 0,
        tmdbType: typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '',
      });
    } catch (_e) {}
  } catch (_e) {}
};

// Re-attempt resume-seek once when TMDB episode match metadata becomes available
// (after the player is already ready to play).
watch(
  () => (Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value.length : 0),
  (len, prev) => {
    if (prev > 0 || len <= 0) return;
    if (!playerUrl.value) return;
    if (!playerFirstFrameReady.value && !playerPlaybackStarted.value) return;
    if (!resumeHistoryLoaded.value || !resumeHistory.value) return;
    maybeApplyResumeSeek('match_ready');
  }
);

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
  clearPendingProxyRetryTimer();
  playerPlaybackStarted.value = true;
  playerBuffering.value = false;
  maybeApplyResumeSeek('playing');
  commitHistoryBaseIfNeeded('playing');
};

const playerTimeState = { at: 0, currentTime: 0, duration: 0 };
const historyProgressState = { at: 0, inFlight: null };
const historyCommitState = { key: '', inFlight: null };

const computeHistoryCommitKey = (payload) => {
  try {
    const p = payload && typeof payload === 'object' ? payload : null;
    if (!p) return '';
    const sk = p.siteKey != null ? String(p.siteKey).trim() : '';
    const vid = p.videoId != null ? String(p.videoId).trim() : '';
    const flag = p.playFlag != null ? String(p.playFlag).trim() : '';
    const idxRaw = p.episodeIndex != null ? Number(p.episodeIndex) : NaN;
    const idx = Number.isFinite(idxRaw) && idxRaw >= 0 ? Math.floor(idxRaw) : 0;
    const itemId = p.playbackItemId != null ? String(p.playbackItemId).trim() : '';
    const tmdbId = Number.isFinite(Number(p.tmdbId)) ? Math.floor(Number(p.tmdbId)) : 0;
    const tmdbType = p.tmdbType != null ? String(p.tmdbType).trim().toLowerCase() : '';
    return [sk, vid, flag, String(idx), itemId, tmdbType, String(tmdbId)].join('::');
  } catch (_e) {
    return '';
  }
};

const commitHistoryBaseIfNeeded = (reason = '', opts = {}) => {
  try {
    const force = !!(opts && typeof opts === 'object' && opts.force);
    const base = lastHistoryPayload.value && typeof lastHistoryPayload.value === 'object' ? lastHistoryPayload.value : null;
    if (!base) return;
    if (!force && !playerPlaybackStarted.value && !playerFirstFrameReady.value) return;
    const key = computeHistoryCommitKey(base);
    if (!key) return;
    if (historyCommitState.key === key) return;
    if (historyCommitState.inFlight) return;

    historyCommitState.key = key;
    historyCommitState.inFlight = (async () => {
      try {
        await apiPostJson('/api/playhistory', { ...base }, { dedupe: false });
        window.dispatchEvent(new CustomEvent('tv:play-history-updated'));
        try {
          smartDebugLog('history_commit', { module: 'play', reason: String(reason || ''), key });
        } catch (_e) {}
      } catch (_e) {
        // ignore
      }
    })();
    historyCommitState.inFlight.finally(() => {
      if (historyCommitState.key === key) historyCommitState.inFlight = null;
    });
  } catch (_e) {}
};

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
      commitHistoryBaseIfNeeded('timeupdate');
      try {
        if (resumeHistory.value && typeof resumeHistory.value === 'object') {
          resumeHistory.value = {
            ...resumeHistory.value,
            playbackPositionTicks: posTicks,
            playbackRuntimeTicks: durTicks,
            updatedAt: Math.floor(Date.now() / 1000),
          };
        }
      } catch (_e) {}
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

const flushHistoryProgressBestEffort = () => {
  try {
    void syncHistoryProgressIfPossible({ force: true });
  } catch (_e) {}
};

onMounted(() => {
  try {
    if (typeof document === 'undefined') return;
    const onVis = () => {
      try {
        if (document.visibilityState !== 'hidden') return;
        flushHistoryProgressBestEffort();
      } catch (_e) {}
    };
    const onHide = () => flushHistoryProgressBestEffort();
    document.addEventListener('visibilitychange', onVis, { passive: true });
    window.addEventListener('pagehide', onHide, { passive: true });
    window.addEventListener('beforeunload', onHide);
    cleanupFns.push(() => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('beforeunload', onHide);
    });
  } catch (_e) {}
});

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

  if (isSmartPanKey(panKey)) {
    const hit = (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).find((s) => s && s.key === panKey) || null;
    const eps = hit && Array.isArray(hit.episodes) ? hit.episodes : [];
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
    setEpisodeIndex(nextIdx, 'playEpisodeFromPlayingList');
	    await requestPlay({ trigger: 'auto_next' });
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
  clearPendingProxyRetryTimer();
  if (playerFirstFrameReady.value) return;
  if (playerFirstFrameTimer) return;
  // Delay unmasking slightly to avoid 1-frame compositor flashes on some browsers/devices.
		  playerFirstFrameTimer = window.setTimeout(() => {
		    playerFirstFrameTimer = 0;
		    playerFirstFrameReady.value = true;
      maybeApplyResumeSeek('firstframe');
      commitHistoryBaseIfNeeded('firstframe');
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
  clearPendingProxyRetryTimer();
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
  try {
    const pending = pendingProxyRetry.value && typeof pendingProxyRetry.value === 'object' ? pendingProxyRetry.value : null;
    if (pending && isPendingRetryForCurrentAttempt(pending)) triggerPendingProxyRetryNow();
  } catch (_e) {}
};

const playerPhase = computed(() => {
  if (playError.value) return 'error';
  if (playerRuntimeError.value) return 'error';
  if (introLoading.value) return 'detail';
  if (
    introError.value &&
    !playerUrl.value &&
    !(isSmartPanActive.value || initialAutoPlayInFlight.value || initialAutoPlayTriggered.value || !!playRequestState.inFlight)
  ) {
    return 'error';
  }
		  if (!playerUrl.value) {
		    if (playLoading.value) return 'play_url';
		    const smartSearching =
		      (!sourcesSearchDone.value || sourcesLoading.value) &&
		      (tmdbMode.value ? tmdbSmartListAvailable.value : smartListAvailable.value) &&
		      (initialAutoPlayInFlight.value || initialAutoPlayTriggered.value || !!playRequestState.inFlight);
		    if (smartSearching || (isSmartPanActive.value && (!sourcesSearchDone.value || sourcesLoading.value))) return 'detail';
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


const parseResumeWantedFromRow = (row) => {
  try {
    if (!row || typeof row !== 'object') return null;
    const idxRaw = row.episodeIndex != null ? Number(row.episodeIndex) : NaN;
    const indexFallback = Number.isFinite(idxRaw) && idxRaw >= 0 ? Math.floor(idxRaw) : 0;
    const pb =
      (row.playbackItemId != null ? String(row.playbackItemId) : '') ||
      (row.playback_item_id != null ? String(row.playback_item_id) : '');
    const playbackItemId = String(pb || '').trim();
    const seasonFromField = row.tmdbSeason != null ? Number(row.tmdbSeason) : NaN;
    const episodeFromField = row.tmdbEpisode != null ? Number(row.tmdbEpisode) : NaN;
    const seasonField = Number.isFinite(seasonFromField) ? Math.max(0, Math.floor(seasonFromField)) : 0;
    const episodeField = Number.isFinite(episodeFromField) ? Math.max(0, Math.floor(episodeFromField)) : 0;
    const m = playbackItemId.match(/^tmdb_tv_\d+_s(\d{2})_e(\d{3})$/i);
    const seasonPB = m ? Math.max(0, Number(m[1]) || 0) : 0;
    const episodePB = m ? Math.max(0, Number(m[2]) || 0) : 0;
    const season = seasonField || seasonPB || 0;
    const episode = episodeField || episodePB || 0;
    const updatedAtRaw = row.updatedAt != null ? Number(row.updatedAt) : NaN;
    const updatedAt = Number.isFinite(updatedAtRaw) ? Math.floor(updatedAtRaw) : 0;
    return { season, episode, indexFallback, playbackItemId, updatedAt };
  } catch (_e) {
    return null;
  }
};

const isResumeListReady = () => {
  if (tmdbMode.value) {
    if (tmdbMovieMode.value) return tmdbMovieSmartListAvailable.value;
    return tmdbSmartListAvailable.value;
  }
  const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
  if (d.panMockEnabled === true && d.panMockResolving === true) return false;
  return selectedEpisodes.value.length > 0;
};

const applyResumeFromHistory = (reason = '') => {
  try {
    const row = resumeHistory.value && typeof resumeHistory.value === 'object' ? resumeHistory.value : null;
    if (!row) return false;
    if (resumeHistoryApplied.value) return true;
    if (initialAutoPlayTriggered.value) return false;
    if (playerPlaybackStarted.value || playerFirstFrameReady.value) return false;

    // Ensure target pan is selected before applying resume (site mode only).
    if (!tmdbMode.value) {
      const wantedPanLabel = typeof row.panLabel === 'string' ? row.panLabel.trim() : '';
      const normalize = (label) => String(label || '').trim().replace(/#\d{1,3}\s*$/i, '').trim().toLowerCase();
      if (wantedPanLabel) {
        const want = normalize(wantedPanLabel);
        const smartHit =
          smartListAvailable.value
            ? (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).find((s) => s && normalize(s.label) === want) || null
            : null;
        const target =
          smartHit && smartHit.key
            ? { key: smartHit.key }
            : panDropdownOptions.value.find((o) => o && normalize(o.label) === want) || null;
        if (target && target.key && target.key !== selectedPanKey.value) {
          selectPan(target.key);
          return false;
        }
      }
    }

    if (!isResumeListReady()) return false;

    let w = resumeWanted.value && typeof resumeWanted.value === 'object' ? resumeWanted.value : null;
    if (!w) {
      w = parseResumeWantedFromRow(row);
      if (w) resumeWanted.value = w;
    }
    if (!w) return false;

    const wantedSeason = Number.isFinite(Number(w.season)) ? Math.floor(Number(w.season)) : 0;
    const wantedEpisode = Number.isFinite(Number(w.episode)) ? Math.floor(Number(w.episode)) : 0;
    const wantedIndex = Number.isFinite(Number(w.indexFallback)) ? Math.floor(Number(w.indexFallback)) : 0;

    const total = selectedEpisodes.value.length;
    if (!total) return false;
    const desiredEpisode = Number.isFinite(Number(wantedEpisode)) ? Math.floor(Number(wantedEpisode)) : 0;
    if (desiredEpisode > 0 && total < desiredEpisode) return false;

    if (debugEnabled.value) {
      try {
        playDebugLog('resume_apply_start', {
          reason: String(reason || ''),
          total,
          wantedSeason,
          wantedEpisode,
          wantedIndex,
          panKey: String(selectedPanKey.value || ''),
          tmdbSmart: tmdbSmartListAvailable.value ? 1 : 0,
          doubanSmart: doubanSmartListAvailable.value ? 1 : 0,
        });
      } catch (_e) {}
    }

    const wantedEpName = typeof row.episodeName === 'string' ? row.episodeName.trim() : '';
    const exactIdx = wantedEpName ? pickExactResumeEpisodeIndexFromName(wantedEpName, compiledMagicEpisodeCleanRegexRules.value) : null;
    let pickedIdx = null;
    if (exactIdx != null) {
      pickedIdx = exactIdx;
    } else {
      const playbackItemIdRaw =
        (row.playbackItemId != null ? String(row.playbackItemId) : '') ||
        (row.playback_item_id != null ? String(row.playback_item_id) : '');
      const pb = String(playbackItemIdRaw || '').trim();
      const pbMatch = pb.match(/^tmdb_tv_\d+_s(\d{2})_e(\d{3})$/i);
      const pbSeason = pbMatch ? Number(pbMatch[1]) : 0;
      const pbEpisode = pbMatch ? Number(pbMatch[2]) : 0;
      const wantedSeasonFieldRaw = row.tmdbSeason != null ? Number(row.tmdbSeason) : NaN;
      const wantedEpisodeFieldRaw = row.tmdbEpisode != null ? Number(row.tmdbEpisode) : NaN;
      const wantedSeasonField = Number.isFinite(wantedSeasonFieldRaw) ? Math.max(0, Math.floor(wantedSeasonFieldRaw)) : 0;
      const wantedEpisodeField = Number.isFinite(wantedEpisodeFieldRaw) ? Math.max(0, Math.floor(wantedEpisodeFieldRaw)) : 0;
      let wanted = { season: 0, episode: 0 };
      if (wantedSeasonField > 0 && wantedEpisodeField > 0) {
        wanted = { season: wantedSeasonField, episode: wantedEpisodeField };
      } else if (pbSeason > 0 && pbEpisode > 0) {
        wanted = { season: pbSeason, episode: pbEpisode };
      } else if (wantedEpName) {
        const rules = compiledMagicEpisodeRules.value;
        const cleanRules = compiledMagicEpisodeCleanRegexRules.value;
        wanted = extractSeasonEpisodeFromCandidates([wantedEpName], rules, cleanRules);
        if (!wanted.episode) wanted = parseLooseSeasonEpisodeFromText(wantedEpName);
      }
      wanted = normalizeMaybeGlobalSeasonEpisode(wanted);
      if (!wanted.episode) wanted = { season: 0, episode: wantedIndex + 1 };
      pickedIdx = pickResumeEpisodeIndex({
        wantedSeason: wanted.season,
        wantedEpisode: wanted.episode,
        wantedIndex,
      });
    }

    if (debugEnabled.value) {
      try {
        playDebugLog('resume_apply_pick', {
          reason: String(reason || ''),
          idx: pickedIdx,
          total,
          wantedSeason,
          wantedEpisode,
          wantedIndex,
        });
      } catch (_e) {}
    }

    setEpisodeIndex(pickedIdx, `resume_apply:${String(reason || '')}`);
    if (seasonTabs.value.length) {
      const chosenIdx = selectedEpisodeIndex.value;
      const matches = episodeMatchByIndex.value;
      const m =
        Number.isFinite(chosenIdx) && chosenIdx >= 0 && matches && matches[chosenIdx] && typeof matches[chosenIdx] === 'object'
          ? matches[chosenIdx]
          : { season: 0, episode: 0 };
      const s = Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      if (s > 0) {
        const exists = seasonTabs.value.some((t) => t && Number(t.season) === s);
        if (exists && Number(selectedSeason.value) !== s) selectSeason(s);
      }
    }
    resumeHistoryApplied.value = true;
    resumeAppliedEpisodeCount.value = selectedEpisodes.value.length;
    try {
      smartDebugLog('resume_apply', { reason: String(reason || ''), idx: pickedIdx, wantedSeason, wantedEpisode, wantedIndex });
    } catch (_e) {}
    return true;
  } catch (_e) {
    return false;
  }
};

const loadResumeFromHistory = async () => {
  const listReady = () => {
    if (tmdbMode.value) {
      if (tmdbMovieMode.value) return tmdbMovieSmartListAvailable.value;
      return tmdbSmartListAvailable.value;
    }
    const d = detail.value && typeof detail.value === 'object' ? detail.value : {};
    if (d.panMockEnabled === true && d.panMockResolving === true) return false;
    return selectedEpisodes.value.length > 0;
  };
  const isResumeIdentityReady = () => {
    try {
      const tmdbId = Number(props.tmdbId || 0);
      const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
      if (tmdbMode.value) return tmdbId > 0 && (tmdbType === 'tv' || tmdbType === 'movie');
      const siteKey = (props.siteKey || '').trim();
      const videoId = (props.videoId || '').trim();
      return !!(siteKey && videoId);
    } catch (_e) {
      return false;
    }
  };
  if (!isResumeIdentityReady()) return;
  resumeSeekState.key = '';
  resumeSeekState.applied = false;
  resumeSeekState.tryKey = '';
  resumeSeekState.tryAt = 0;
  resumeSeekState.frozen = false;
  resumeSeekOverrideState.identity = '';
  resumeSeekOverrideState.sec = 0;
  resumeSeekOverrideState.at = 0;
  resumeHistoryLoaded.value = false;
  resumeHistoryApplied.value = false;
  resumeHistoryFound.value = null;
  resumeAppliedEpisodeCount.value = 0;
  resumeHistory.value = null;
  resumeWanted.value = null;
  const siteKey = (props.siteKey || '').trim();
  const videoId = (props.videoId || '').trim();
  const tmdbId = Number(props.tmdbId || 0);
  const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';


  if (tmdbMode.value && tmdbId > 0 && (tmdbType === 'tv' || tmdbType === 'movie')) {
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
          const list = await apiGetJson(`/api/playhistory${buildQuery({ limit: 50 })}`, { cacheMs: 0 });
          if (seqAtCall !== resumeHistoryState.seq) return;
          const items = Array.isArray(list) ? list : [];
          const wantedKey =
            normalizeForAggKey(getStableContentKey() || '') ||
            normalizeForAggKey(computeHistoryContentKey(props.videoTitle || ''));
	          const match = items.find((r) => r && Number(r.tmdbId || 0) === tmdbId && String(r.tmdbType || '').trim().toLowerCase() === tmdbType) ||
	            (wantedKey ? items.find((r) => r && normalizeForAggKey(r.contentKey || '') === wantedKey) : null) ||
	            null;
	          resumeHistory.value = match;
            resumeHistoryFound.value = !!match;
            resumeWanted.value = parseResumeWantedFromRow(match);
            if (listReady()) {
              void applyResumeFromHistory('tmdb_list');
            }
		          try {
		            const seasons = match && typeof match.tmdbSeasons === 'string' ? match.tmdbSeasons.trim() : '';
		            if (tmdbType === 'tv' && tmdbId > 0 && seasons) {
		              sessionStorage.setItem(`tv:douban:tmdbSeasons:${tmdbId}`, seasons);
	              refreshDoubanSeasonMeta();
	            }
	          } catch (_e) {}
        } catch (_e) {
          if (seqAtCall === resumeHistoryState.seq) {
            resumeHistory.value = null;
            resumeHistoryFound.value = false;
          }
        }
      })();
      await resumeHistoryState.inFlight;
    } catch (_e) {
      if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
    } finally {
      if (seqAtCall === resumeHistoryState.seq) {
        resumeHistoryLoaded.value = true;
        if (resumeHistoryFound.value == null) resumeHistoryFound.value = false;
      }
      if (resumeHistoryState.key === key && resumeHistoryState.seq === seqAtCall) resumeHistoryState.inFlight = null;
    }
	    return;
	  }
		  if (!siteKey || !videoId) {
		    resumeHistoryLoaded.value = true;
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
          const item = await apiGetJson(`/api/playhistory/one${buildQuery({ siteKey, videoId })}`, { cacheMs: 0 });
          if (seqAtCall !== resumeHistoryState.seq) return;
	          if (item && item.siteKey === siteKey && item.videoId === videoId) {
	            resumeHistory.value = item;
              resumeHistoryFound.value = true;
              resumeWanted.value = parseResumeWantedFromRow(item);
              if (listReady()) void applyResumeFromHistory('site_one');
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
            resumeHistoryFound.value = false;
            return;
          }
        } catch (_e) {
          // fallback
        }
        const list = await apiGetJson(`/api/playhistory${buildQuery({ limit: 50 })}`, { cacheMs: 0 });
        if (seqAtCall !== resumeHistoryState.seq) return;
        const items = Array.isArray(list) ? list : [];
	        const foundExact = items.find((r) => r && r.siteKey === siteKey && r.videoId === videoId) || null;
	        if (foundExact) {
	          resumeHistory.value = foundExact;
            resumeHistoryFound.value = true;
	        } else {
          const tmdbId = Number(props.tmdbId || 0);
          const tmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
          const wantedKey =
            normalizeForAggKey(getStableContentKey() || '') ||
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
            resumeHistoryFound.value = !!resumeHistory.value;
	        }
          resumeWanted.value = parseResumeWantedFromRow(resumeHistory.value);
          if (listReady()) void applyResumeFromHistory('site_list');
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
        if (seqAtCall === resumeHistoryState.seq) {
          resumeHistory.value = null;
          resumeHistoryFound.value = false;
        }
      }
    })();
    await resumeHistoryState.inFlight;
  } catch (_e) {
    if (seqAtCall === resumeHistoryState.seq) resumeHistory.value = null;
  } finally {
    if (seqAtCall === resumeHistoryState.seq) {
      resumeHistoryLoaded.value = true;
      if (resumeHistoryFound.value == null) resumeHistoryFound.value = false;
    }
    if (resumeHistoryState.key === key && resumeHistoryState.seq === seqAtCall) resumeHistoryState.inFlight = null;
  }
};

watch(
  () => aggregatedSources.value.length,
  async (len) => {
    if (!len) return;
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
      resumeWanted.value && typeof resumeWanted.value === 'object' ? `${resumeWanted.value.playbackItemId || ''}:${resumeWanted.value.indexFallback || 0}` : '',
      selectedPanKey.value,
      String(selectedSeason.value),
      resolvedSpiderApiFinal.value,
      selectedEpisodes.value.length,
      selectedEpisodeIndex.value,
      detail.value && typeof detail.value === 'object' && detail.value.panMockResolving ? '1' : '0',
    ].join('|'),
  () => {
    if (initialAutoPlayTriggered.value) return;
    if (playerPlaybackStarted.value || playerFirstFrameReady.value) return;
    if (introLoading.value) return;
    if (!resumeHistoryLoaded.value) return;
    if (!selectedEpisodes.value.length) return;
    if (resumeHistory.value && !resumeHistoryApplied.value) {
      const w = resumeWanted.value && typeof resumeWanted.value === 'object' ? resumeWanted.value : null;
      const desiredEpisode = w && Number.isFinite(Number(w.episode)) ? Math.floor(Number(w.episode)) : 0;
      if (desiredEpisode > 0 && selectedEpisodes.value.length < desiredEpisode) return;
    }
    // Folder-like sources (e.g. 网盘目录) often return an episode list for the whole directory.
    // Ensure the clicked file (props.videoId) becomes the initially selected episode.
    if (!autoPickedEpisodeFromVideoId.value && !resumeHistory.value) {
      autoPickedEpisodeFromVideoId.value = true;
      const picked = pickEpisodeByUrlAcrossPans(props.videoId || '');
      if (picked && picked.panKey) {
        selectPan(picked.panKey);
        setEpisodeIndex(picked.index, 'auto_pick_by_videoid');
        return;
      }
    }

    // Restore from history once (pan + episode), if available and already loaded.
    if (resumeHistoryLoaded.value && resumeHistory.value && !resumeHistoryApplied.value) {
      const applied = applyResumeFromHistory('watch');
      if (!applied) return;
      // Pan/episode changed due to resume apply; wait for reactive updates to settle before auto-start.
      void nextTick().then(() => {
        tryAutoStartPlayback();
      });
      return;
    }

    if (resumeHistory.value && !resumeHistoryApplied.value) return;
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
      setEpisodeIndex(-1, 'auto_raw_list_no_display');
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

const PAN_MOCK_DIR_PROVIDERS = new Set(['quark', 'uc', 'baidu', '139', '189']);
const panMockRawDirPath = ref([]);
const panMockRawDirLockedDepth = ref(0);
let lastPanMockRawDirIdentity = '';

const panMockRawDirPanMockEnabled = computed(() => {
  if (tmdbMode.value && isTMDBSitePanKey(selectedPanKey.value)) {
    const cached = readTMDBSitePanCacheEntry(selectedPanKey.value);
    return !!(cached && cached.panMockEnabled);
  }
  return !!(detail.value && detail.value.panMockEnabled);
});

const panMockRawDirModeEnabled = computed(() => {
  if (!rawListMode.value) return false;
  if (!panMockRawDirPanMockEnabled.value) return false;
  const src = selectedPanSource.value;
  const provider = src && src.provider ? String(src.provider).trim() : '';
  if (!provider || !PAN_MOCK_DIR_PROVIDERS.has(provider)) return false;
  const eps = selectedEpisodes.value;
  return Array.isArray(eps) && eps.length > 0;
});

const panMockRawDirIdentity = computed(() => {
  if (!panMockRawDirModeEnabled.value) return '';
  const src = selectedPanSource.value;
  const provider = src && src.provider ? String(src.provider).trim() : '';
  const label = src && src.label != null ? String(src.label) : '';
  if (provider && label) return `${provider}::${label}`;
  const key = src && src.key != null ? String(src.key) : '';
  return key || String(selectedPanKey.value || '');
});

const panMockRawDirTree = computed(() => {
  if (!panMockRawDirModeEnabled.value) return null;
  const eps = selectedEpisodes.value;
  if (!Array.isArray(eps) || !eps.length) return null;

  const root = { dirs: new Map(), files: [] };
  const ensureDir = (node, name) => {
    const key = String(name || '').trim();
    if (!key) return node;
    if (!node.dirs.has(key)) node.dirs.set(key, { name: key, dirs: new Map(), files: [] });
    return node.dirs.get(key);
  };

  eps.forEach((ep, idx) => {
    const url = ep && ep.url != null ? String(ep.url) : '';
    const epName = ep && ep.name != null ? String(ep.name) : '';
    const fallbackFileName = `第${idx + 1}集`;

    const fileName = (() => {
      const rawNames = extractRawNamesFromEpisodeUrl(url);
      const raw = rawNames && rawNames[0] != null ? String(rawNames[0]) : '';
      return (raw || '').trim() || fallbackFileName;
    })();

    const dirs = (() => {
      const base = (epName || '').trim();
      if (!base) return [];
      return String(base)
        .replace(/\\/g, '/')
        .split('/')
        .map((s) => String(s || '').trim())
        .filter(Boolean);
    })();

    let node = root;
    dirs.forEach((d) => {
      node = ensureDir(node, d);
    });
    node.files.push({ name: fileName, index: idx, url, displayName: epName, rawName: fileName });
  });

  return root;
});

const panMockRawDirNode = computed(() => {
  const tree = panMockRawDirTree.value;
  if (!tree) return null;
  const path = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value : [];
  let node = tree;
  for (let i = 0; i < path.length; i += 1) {
    const seg = String(path[i] || '').trim();
    if (!seg) continue;
    if (!node.dirs || !node.dirs.has(seg)) return null;
    node = node.dirs.get(seg);
  }
  return node;
});

const panMockRawDirEntries = computed(() => {
  if (!panMockRawDirModeEnabled.value) return [];
  const node = panMockRawDirNode.value;
  if (!node) return [];
  const dirs = node.dirs ? Array.from(node.dirs.keys()) : [];
  const files = Array.isArray(node.files) ? node.files : [];

  dirs.sort((a, b) => String(a).localeCompare(String(b), 'zh'));
  const sortedFiles = files
    .slice()
    .sort((a, b) => String(a && a.name).localeCompare(String(b && b.name), 'zh'));

  const out = [];
  dirs.forEach((name) => {
    const text = `${String(name)}/`;
    out.push({ key: `d:${panMockRawDirPath.value.join('/')}:${name}`, kind: 'dir', name: String(name), index: -1, text });
  });
  sortedFiles.forEach((f) => {
    const text = String(f && f.name ? f.name : '').trim() || `第${Number(f && f.index) + 1}集`;
    out.push({
      key: `f:${f.index}:${f.url}`,
      kind: 'file',
      name: text,
      index: f.index,
      text,
      displayName: f && f.displayName != null ? String(f.displayName) : '',
      rawName: f && f.rawName != null ? String(f.rawName) : String(f && f.name != null ? f.name : ''),
      url: f && f.url != null ? String(f.url) : '',
    });
  });
  return out;
});

const panMockRawDirDisplayPath = computed(() => {
  if (!panMockRawDirModeEnabled.value) return '';
  const path = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value : [];
  const segs = path.map((s) => String(s || '').trim()).filter(Boolean);
  return `/${segs.join('/')}`;
});

const panMockRawDirCanGoBack = computed(() => {
  if (!panMockRawDirModeEnabled.value) return false;
  const pathLen = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value.length : 0;
  const minDepth = Number.isFinite(Number(panMockRawDirLockedDepth.value)) ? Math.max(0, Math.floor(Number(panMockRawDirLockedDepth.value))) : 0;
  return pathLen > minDepth;
});

const panMockRawDirBarVisible = computed(() => {
  if (!panMockRawDirModeEnabled.value) return false;
  const list = panMockRawDirEntries.value;
  return Array.isArray(list) && list.length > 0;
});

const panMockRawDirEnter = (name) => {
  const n = typeof name === 'string' ? name.trim() : '';
  if (!n) return;
  const cur = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value : [];
  panMockRawDirPath.value = cur.concat([n]);
  rawListPage.value = 0;
};

const panMockRawDirGoBack = () => {
  if (!panMockRawDirCanGoBack.value) return;
  const cur = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value : [];
  panMockRawDirPath.value = cur.slice(0, -1);
  rawListPage.value = 0;
};

const onRawListItemClick = (it) => {
  if (!it) return;
  if (panMockRawDirModeEnabled.value && it.kind === 'dir' && it.name) {
    panMockRawDirEnter(it.name);
    return;
  }
  onRawListSelectEpisode(it.index);
};

watch(
  () => `${panMockRawDirModeEnabled.value ? '1' : '0'}|${panMockRawDirIdentity.value}|${selectedEpisodes.value.length}`,
  () => {
    const enabled = panMockRawDirModeEnabled.value;
    const identity = String(panMockRawDirIdentity.value || '');
    if (!enabled) {
      panMockRawDirPath.value = [];
      panMockRawDirLockedDepth.value = 0;
      lastPanMockRawDirIdentity = identity;
      return;
    }

    const tree = panMockRawDirTree.value;
    if (!tree) return;

    const panChanged = identity !== lastPanMockRawDirIdentity;
    lastPanMockRawDirIdentity = identity;
    if (panChanged) {
      panMockRawDirPath.value = [];
      panMockRawDirLockedDepth.value = 0;
    }

    const tryGetNode = (path) => {
      let node = tree;
      for (let i = 0; i < path.length; i += 1) {
        const seg = String(path[i] || '').trim();
        if (!seg) continue;
        if (!node.dirs || !node.dirs.has(seg)) return null;
        node = node.dirs.get(seg);
      }
      return node;
    };

    const curPath = Array.isArray(panMockRawDirPath.value) ? panMockRawDirPath.value : [];
    if (curPath.length && !tryGetNode(curPath)) {
      panMockRawDirPath.value = [];
      panMockRawDirLockedDepth.value = 0;
    }

    if (!panMockRawDirPath.value.length) {
      // Auto-drill down when the upper levels contain only a single directory and no files.
      // These levels are not useful to browse, so we lock the back button above them.
      const nextPath = [];
      let node = tree;
      while (node) {
        const dirs = node.dirs ? Array.from(node.dirs.keys()) : [];
        const hasFiles = Array.isArray(node.files) && node.files.length > 0;
        if (hasFiles) break;
        if (dirs.length !== 1) break;
        const only = String(dirs[0] || '').trim();
        if (!only) break;
        nextPath.push(only);
        node = node.dirs.get(only);
      }
      if (nextPath.length) {
        panMockRawDirPath.value = nextPath;
        panMockRawDirLockedDepth.value = nextPath.length;
      }
    }
  },
  { immediate: true }
);

const rawListItems = computed(() => {
  if (!rawListMode.value) return [];
  const eps = selectedEpisodes.value;
  if (!eps.length) return [];
  if (panMockRawDirModeEnabled.value) {
    const entries = panMockRawDirEntries.value;
    return entries.map((it) => it);
  }
  let allFileNamesSame = true;
  let firstFileName = null;
  for (const ep of eps) {
    const url = ep && ep.url != null ? String(ep.url) : '';
    const rawNames = extractRawNamesFromEpisodeUrl(url);
    const fileName = rawNames[0] || '';
    if (firstFileName == null) {
      firstFileName = fileName;
    } else if (fileName !== firstFileName) {
      allFileNamesSame = false;
      break;
    }
  }
  return eps.map((ep, idx) => {
	    const useDisplayName =
	      tmdbMovieMode.value && tmdbMovieSmartListAvailable.value && selectedPanKey.value === SMART_PAN_KEY;
	    const url = ep && ep.url != null ? String(ep.url) : '';
	    const rawNames = extractRawNamesFromEpisodeUrl(url);
	    const flag = ep && ep.flag != null ? String(ep.flag) : '';
	    const isPanMockList =
	      tmdbMode.value &&
	      !!(detail.value && typeof detail.value === 'object' && detail.value.panMockEnabled === true) &&
	      !!panMockProviderFromFlag(flag);
	    const displayName = ep && ep.name != null ? String(ep.name) : '';
	    const fileName = rawNames[0] || '';
	    const titleLower = (displayTitle.value || '').trim().toLowerCase();
	    const displayScore = scoreEpisodeDisplayName(displayName, titleLower);
	    const fileScore = scoreEpisodeDisplayName(fileName, titleLower);
	    const preferDisplay =
	      allFileNamesSame || useDisplayName || (!isPanMockList && displayScore >= fileScore);
	    const text = (
	      (preferDisplay ? (ep && ep.name != null ? String(ep.name) : '') : '') ||
	      rawNames[0] ||
	      (ep && ep.name != null ? String(ep.name) : '') ||
	      ''
	    ).trim() || `第${idx + 1}集`;
	    return {
	      key: `${idx}-${url}`,
	      index: idx,
	      text,
	      kind: 'file',
	      name: text,
	      displayName,
	      rawName: fileName,
	      url,
	    };
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
  () =>
    [
      rawListMode.value ? '1' : '0',
      selectedPanKey.value,
      selectedEpisodeGroupKey.value,
      selectedEpisodes.value.length,
      groupedDisplayedEpisodes.value.length,
      rawListItems.value.length,
      seasonTabs.value.length,
      selectedPanAuxLoading.value ? '1' : '0',
      episodeMetaModeEffective.value,
      tmdbSelectedSitePanKey.value,
      playingPanKey.value,
      playingTMDBSubPanKey.value,
      playingSmartEpisodeNo.value,
      playingEpisodeIndex.value,
      currentPlayingEpisodeUrl.value,
    ].join('|'),
  () => {
    scheduleSyncPlayingLocator();
  },
  { immediate: true }
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
  autoPlaySuppressedByUser.value = false;
  autoFallbackActive.value = false;
  // Keep season tab consistent with the clicked episode (important for TMDB multi-season lists).
  if (seasonTabs.value.length) {
    try {
      const matches = episodeMatchByIndex.value;
      const m =
        Number.isFinite(n) && n >= 0 && matches && matches[n] && typeof matches[n] === 'object'
          ? matches[n]
          : { season: 0, episode: 0 };
      const s = Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      if (s > 0) {
        const exists = seasonTabs.value.some((t) => t && Number(t.season) === s);
        if (exists && Number(selectedSeason.value) !== s) selectSeason(s);
      }
    } catch (_e) {}
  }
  // Smart pans (TMDB/豆瓣): if the user clicks the currently playing *logical* episode (same global no),
  // don't re-run smart matching / request a new play url.
  if (playerUrl.value && playingSmartEpisodeNo.value > 0 && isSmartPanKey(selectedPanKey.value)) {
    const eps = selectedEpisodes.value;
    const ep = Array.isArray(eps) && n < eps.length ? eps[n] : null;
    const g = episodeGlobalNoOf(ep);
    if (g > 0 && g === playingSmartEpisodeNo.value) {
      setEpisodeIndex(n, 'selectEpisode');
      return;
    }
  }
  // If the user clicks the currently playing episode within the same pan, do nothing.
  // But if they switch pan (even same episode number), we must request a new play url.
  if (
    playingPanKey.value &&
    playingPanKey.value === selectedPanKey.value &&
    playingEpisodeIndex.value === n &&
    playerUrl.value
  ) {
    setEpisodeIndex(n, 'selectEpisode_samePlaying');
    return;
  }
  setEpisodeIndex(n, 'selectEpisode_default');
	  requestPlay({ trigger: 'user' });
};

const resolveCurrentTMDBSubPanKey = (panKey) => {
  if (!isTMDBSitePanKey(panKey)) return '';
  const cache = readTMDBSitePanCacheEntry(panKey);
  const pans = cache && Array.isArray(cache.pans) ? cache.pans : [];
  const picked =
    (tmdbSelectedSitePanKey.value && pans.find((p) => p && p.key === tmdbSelectedSitePanKey.value)) || pans[0] || null;
  return picked && picked.key ? String(picked.key) : '';
};

const mapGlobalToSeasonEpisode = (globalNo) => {
  const g = Number.isFinite(Number(globalNo)) ? Math.floor(Number(globalNo)) : 0;
  if (g <= 0) return { season: 0, episode: 0 };
  if (episodeMetaModeEffective.value === 'douban') {
    const fallback = tmdbSeasonEpisodeOfGlobal(g);
    return fallback && fallback.season ? fallback : { season: 0, episode: g };
  }
  const mapped = tmdbSeasonEpisodeOfGlobal(g);
  return mapped && mapped.season ? mapped : { season: 0, episode: g };
};

const isEpisodeActive = (idxRaw, ep) => {
  const idx = Number.isFinite(Number(idxRaw)) ? Math.floor(Number(idxRaw)) : -1;
  if (idx < 0) return false;
  if (rawListMode.value) {
    const playingKey = currentPlayingEpisodeMatchKey.value || '';
    if (playingKey && isPlayingInCurrentPanContext()) {
      const epName = ep && ep.displayName != null ? String(ep.displayName) : String(ep && ep.text != null ? ep.text : '');
      const epRaw = ep && ep.rawName != null ? String(ep.rawName) : String(ep && ep.name != null ? ep.name : '');
      const epKey = buildEpisodeMatchKey(epName, epRaw);
      if (epKey && epKey === playingKey) return true;
    }
    const sel = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : -1;
    if (sel >= 0) return idx === sel;
  }
  const selectedPan = String(selectedPanKey.value || '');
  const selectedIdx = Number.isFinite(Number(selectedEpisodeIndex.value)) ? Math.floor(Number(selectedEpisodeIndex.value)) : -1;

  // Smart lists (TMDB / 豆瓣): active marker follows logical mapped episode number.
  if (isSmartPanKey(selectedPan)) {
    const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
    if (g > 0) {
      const cur = resolveSmartEpisodeNo(ep);
      if (cur > 0) return cur === g;
    }
    return idx === selectedIdx;
  }

  // Non-smart lists: active marker should follow the currently playing file in the same source/pan context.
  if (tmdbMode.value && isTMDBSitePanKey(selectedPan)) {
    const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
    if (g > 0) {
      const m = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value[idx] : null;
      const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
      const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
      if (s > 0 && e > 0) {
        const gg = tmdbGlobalEpisodeNoOf(s, e);
        if (gg > 0 && gg === g) return true;
      }
    }
  }

  const samePan = isPlayingInCurrentPanContext();
  const sameTMDBSubPan = (() => {
    if (!samePan || !isTMDBSitePanKey(selectedPan)) return samePan;
    const curSub = resolveCurrentTMDBSubPanKey(selectedPan);
    const playingSub = String(playingTMDBSubPanKey.value || '');
    if (!curSub || !playingSub) return samePan;
    return curSub === playingSub;
  })();

  if (playerUrl.value && playingPanKey.value) {
    // For non-current source/pan contexts, keep selected-index highlight as a locator.
    // Only apply strict "currently playing file" matching when context matches.
    if (!samePan || (isTMDBSitePanKey(selectedPan) && !sameTMDBSubPan)) {
      return idx === selectedIdx;
    }

    const epUrl = ep && ep.url != null ? String(ep.url).trim() : '';
    const playingUrl = String(currentPlayingEpisodeUrl.value || '').trim();
    if (epUrl && playingUrl && epUrl === playingUrl) return true;
    const playingKey = currentPlayingEpisodeMatchKey.value || '';
    if (playingKey) {
      const rawNames = epUrl ? extractRawNamesFromEpisodeUrl(epUrl) : [];
      const epRaw = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '') : '';
      const epName = ep && ep.name != null ? String(ep.name) : '';
      const epKey = buildEpisodeMatchKey(epName, epRaw);
      if (epKey && epKey === playingKey) return true;
    }
    const pIdx = Number.isFinite(Number(playingEpisodeIndex.value)) ? Math.floor(Number(playingEpisodeIndex.value)) : -1;
    if (pIdx >= 0) return idx === pIdx;
    return false;
  }

  return idx === selectedIdx;
};

const isPlayingInCurrentPanContext = () => {
  if (!playerUrl.value || !playingPanKey.value) return false;
  const selectedPan = String(selectedPanKey.value || '');
  if (!selectedPan) return false;
  if (playingPanKey.value !== selectedPan) return false;
  if (!isTMDBSitePanKey(selectedPan)) return true;
  const curSub = resolveCurrentTMDBSubPanKey(selectedPan);
  const playingSub = String(playingTMDBSubPanKey.value || '');
  if (!curSub || !playingSub) return true;
  return curSub === playingSub;
};

const resolvePlayingIndexInRawList = () => {
  if (!rawListMode.value) return -1;
  const items = rawListItems.value;
  if (!Array.isArray(items) || items.length < 1) return -1;
  const playingKey = currentPlayingEpisodeMatchKey.value || '';
  if (playingKey) {
    for (let i = 0; i < items.length; i += 1) {
      const it = items[i];
      if (!it || it.kind === 'dir') continue;
      const name = it && it.displayName != null ? String(it.displayName) : String(it && it.text != null ? it.text : '');
      const raw = it && it.rawName != null ? String(it.rawName) : String(it && it.name != null ? it.name : '');
      const key = buildEpisodeMatchKey(name, raw);
      if (key && key === playingKey) return it.index;
    }
    return -1;
  }
  const playingRaw = normalizeRawNameForCompare(currentPlayingEpisodeRawName.value);
  if (!playingRaw) return -1;
  for (let i = 0; i < items.length; i += 1) {
    const it = items[i];
    if (!it || it.kind === 'dir') continue;
    const text = normalizeRawNameForCompare(it.text || it.name || '');
    if (!text) continue;
    if (text === playingRaw || text.includes(playingRaw) || playingRaw.includes(text)) return it.index;
  }
  return -1;
};

const resolvePlayingIndexInCurrentList = () => {
  const eps = selectedEpisodes.value;
  if (!Array.isArray(eps) || eps.length < 1) return -1;
  if (rawListMode.value) {
    const rawIdx = resolvePlayingIndexInRawList();
    if (rawIdx >= 0) return rawIdx;
  }
  const selectedPan = String(selectedPanKey.value || '');
  const canMapByGlobal =
    tmdbMode.value && isTMDBSitePanKey(selectedPan) && Number.isFinite(Number(playingSmartEpisodeNo.value)) && Number(playingSmartEpisodeNo.value) > 0;
  if (!isPlayingInCurrentPanContext() && !canMapByGlobal) return -1;
  const playingUrl = String(currentPlayingEpisodeUrl.value || '').trim();
  if (playingUrl && isPlayingInCurrentPanContext()) {
    const hit = eps.findIndex((it) => it && it.url != null && String(it.url).trim() === playingUrl);
    if (hit >= 0) return hit;
  }
  const playingKey = currentPlayingEpisodeMatchKey.value || '';
  if (playingKey && isPlayingInCurrentPanContext()) {
    const hit = eps.findIndex((it) => {
      const url = it && it.url != null ? String(it.url) : '';
      const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
      const epRaw = Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '') : '';
      const epName = it && it.name != null ? String(it.name) : '';
      const key = buildEpisodeMatchKey(epName, epRaw);
      return key && key === playingKey;
    });
    if (hit >= 0) return hit;
  }
  const playingRaw = String(currentPlayingEpisodeRawName.value || '').trim().toLowerCase();
  if (playingRaw && isPlayingInCurrentPanContext()) {
    const hit = eps.findIndex((it) => {
      const url = it && it.url != null ? String(it.url) : '';
      const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
      const epRaw = (Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '') : String(it && it.name != null ? it.name : '')).trim().toLowerCase();
      return epRaw && epRaw === playingRaw;
    });
    if (hit >= 0) return hit;
  }
  const g = Number.isFinite(Number(playingSmartEpisodeNo.value)) ? Math.floor(Number(playingSmartEpisodeNo.value)) : 0;
  if (g > 0) {
    const mapped = mapGlobalToSeasonEpisode(g);
    const seasonNo = Number.isFinite(Number(mapped.season)) ? Math.floor(Number(mapped.season)) : 0;
    const episodeNo = Number.isFinite(Number(mapped.episode)) ? Math.floor(Number(mapped.episode)) : 0;
    if (episodeNo > 0) {
      const matches = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value : [];
      const candidates = [];
      for (let i = 0; i < matches.length; i += 1) {
        const m = matches[i];
        const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
        const e = m && Number.isFinite(Number(m.episode)) ? Math.floor(Number(m.episode)) : 0;
        if (e === episodeNo && (seasonNo <= 0 || s === seasonNo)) candidates.push(i);
      }
      if (candidates.length === 1) return candidates[0];
      if (candidates.length > 1 && playingRaw && isPlayingInCurrentPanContext()) {
        for (let i = 0; i < candidates.length; i += 1) {
          const idx = candidates[i];
          const url = eps[idx] && eps[idx].url != null ? String(eps[idx].url) : '';
          const rawNames = url ? extractRawNamesFromEpisodeUrl(url) : [];
          const epRaw = (Array.isArray(rawNames) && rawNames.length ? String(rawNames[0] || '') : String(eps[idx] && eps[idx].name != null ? eps[idx].name : '')).trim().toLowerCase();
          if (epRaw && epRaw === playingRaw) return idx;
        }
      }
      if (candidates.length) return candidates[0];
    }
  }
  if (!isPlayingInCurrentPanContext()) return -1;
  const pIdx = Number.isFinite(Number(playingEpisodeIndex.value)) ? Math.floor(Number(playingEpisodeIndex.value)) : -1;
  if (pIdx >= 0 && pIdx < eps.length) return pIdx;
  return -1;
};

const syncSeasonForIndex = (idx) => {
  if (manualSeasonOverride.value) return;
  if (!seasonTabs.value.length) return;
  const matches = Array.isArray(episodeMatchByIndex.value) ? episodeMatchByIndex.value : [];
  const m = Number.isFinite(Number(idx)) && idx >= 0 && matches[idx] ? matches[idx] : null;
  const s = m && Number.isFinite(Number(m.season)) ? Math.floor(Number(m.season)) : 0;
  if (s <= 0) return;
  const exists = seasonTabs.value.some((t) => t && Number(t.season) === s);
  if (!exists) return;
  if (Number(selectedSeason.value) !== s) selectSeason(s);
};

const scrollContainerToCenter = (container, active) => {
  if (!container || !active) return;
  const cRect = container.getBoundingClientRect();
  const aRect = active.getBoundingClientRect();
  if (!cRect.height || !cRect.width) return;
  const offsetTop = aRect.top - cRect.top + container.scrollTop;
  const offsetLeft = aRect.left - cRect.left + container.scrollLeft;
  const nextTop = offsetTop - (cRect.height / 2) + (aRect.height / 2);
  const nextLeft = offsetLeft - (cRect.width / 2) + (aRect.width / 2);
  container.scrollTo({
    top: Math.max(0, nextTop),
    left: Math.max(0, nextLeft),
    behavior: 'smooth',
  });
};

const scrollEpisodeButtonsToActive = () => {
  try {
    const container = episodeButtonsEl.value;
    if (!container) return;
    const active = container.querySelector('[data-episode-active=\"true\"]');
    if (!active) return;
    scrollContainerToCenter(container, active);
  } catch (_e) {}
};

const scrollRawListToActive = () => {
  try {
    const container = rawListViewEl.value;
    if (!container) return;
    const active = container.querySelector('.raw-list__row--active');
    if (!active) return;
    scrollContainerToCenter(container, active);
  } catch (_e) {}
};

const scheduleScrollToPlayingEpisode = () => {
  try {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (rawListMode.value) scrollRawListToActive();
        else scrollEpisodeButtonsToActive();
      });
    });
  } catch (_e) {}
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

const extractDetailVodObject = (data) => {
  const root = data && typeof data === 'object' ? data : {};
  const nested = root.data && typeof root.data === 'object' ? root.data : {};
  const isPanMock = root.pan_mock === true || root.panMock === true;
  const first = isPanMock
    ? ((Array.isArray(root.list) && root.list[0]) || {})
    : (
        (Array.isArray(root.list) && root.list[0]) ||
        (Array.isArray(nested.list) && nested.list[0]) ||
        root.vod ||
        nested.vod ||
        {}
      );
  return first && typeof first === 'object' ? first : {};
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
  return pick(extractDetailVodObject(data));
};

const extractDetailFromResponse = (data) => {
  const vod = extractDetailVodObject(data);
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

const extractPanListVodPlayUrl = (data) => {
  const root = data && typeof data === 'object' ? data : null;
  if (!root || root.ok !== true) return '';
  return typeof root.vod_play_url === 'string' ? String(root.vod_play_url || '').trim() : '';
};

const detailFetchState = { key: '', seq: 0, inFlight: null };

const contentKeyFromProps = () => {
  return buildContentKeyBase();
};

let lastContentKey = contentKeyFromProps();
let lastSiteKey = (props.siteKey || '').trim();
let lastSpiderApi = (props.spiderApi || '').trim();
let lastVideoId = (props.videoId || '').trim();
let lastTmdbId = Number(props.tmdbId || 0);
let lastTmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';
const entryFlowState = { seq: 0, inFlight: null };

const runEntryFlow = async ({ isNewContent, restoreEpisodeIndex } = {}) => {
  entryFlowState.seq += 1;
  const seqAtCall = entryFlowState.seq;

  const prevIdx = Number.isFinite(Number(restoreEpisodeIndex)) ? Math.floor(Number(restoreEpisodeIndex)) : 0;

  const task = (async () => {
    const contentChanged = !!isNewContent;
    const sourceSwitchOnly = Number.isFinite(Number(props.switchOnlyToken)) && Number(props.switchOnlyToken) > 0;

    if (!sourceSwitchOnly) initialAutoPlayTriggered.value = false;
    if (!sourceSwitchOnly) resumeHistoryState.seq += 1;
    detailFetchState.seq += 1;

    if (contentChanged) {
      invalidateSourcesSearch();
      sourcesSearchedOnce.value = false;
      sourcesError.value = '';
      resetTMDBSmartCaches();
      tmdbMovieSmartEpisodes.value = [];
      tmdbMovieSmartFetchState.seq += 1;
      tmdbMovieSmartFetchState.key = '';
      resumeHistoryLoaded.value = false;
      resumeHistoryApplied.value = false;
      resumeHistoryFound.value = null;
      resumeWanted.value = null;
      resumeHistory.value = null;
      resumeAppliedEpisodeCount.value = 0;
    }

    if (contentChanged) {
      resetForNewVideo();
    } else if (sourceSwitchOnly) {
      autoPlaySuppressedByUser.value = true;
      resetEpisodeListForSourceSwitch();
    } else {
      resetForNewSource();
      const nextIdx = prevIdx >= 0 ? prevIdx : -1;
      if (Number(selectedEpisodeIndex.value) !== nextIdx) setEpisodeIndex(nextIdx, 'resetForNewSource');
    }

    loadAggregatedSourcesFromStorage();
    if (!sourceSwitchOnly) applyAggregatedSourcesFromSearchState();

    if (tmdbMode.value) {
      if (
        !sourceSwitchOnly &&
        !isNewContent &&
        resumeHistoryLoaded.value &&
        resumeHistoryApplied.value &&
        resumeHistory.value
      ) {
        // Keep existing resume state when only play metadata is being enriched.
      } else if (!sourceSwitchOnly) {
        await loadResumeFromHistory();
      }
      await fetchTMDBMetaIfNeeded();
      if (tmdbMovieMode.value) {
        await fetchTMDBMovieSmartEpisodesIfNeeded();
        if (contentChanged) setEpisodeIndex(0, 'tmdbMovie_contentChanged');
      }
      return;
    }

	    if (contentChanged) {
	      await fetchDetailForCurrentVideo({ updateIntro: true, updateMeta: true });
	    } else {
      await fetchDetailForCurrentVideo({ updateIntro: false, updateMeta: false });
    }

    if (seqAtCall !== entryFlowState.seq) return;
    if (
      !sourceSwitchOnly &&
      !isNewContent &&
      resumeHistoryLoaded.value &&
      resumeHistoryApplied.value &&
      resumeHistory.value
    ) {
      // Keep existing resume state when only play metadata is being enriched.
    } else if (!sourceSwitchOnly) {
      void loadResumeFromHistory();
    }
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
				        timeoutMs: 15_000,
				      });
				      if (seqAtCall !== detailFetchState.seq) return;
					      const d = extractDetailFromResponse(raw);
					      const panMockEnabled = readPanMockEnabledFromRaw(raw);
						      const next = (() => {
				        const prev = detail.value && typeof detail.value === 'object' ? detail.value : {};
				        const shouldUpdateMeta = !!updateMeta;
				        const shouldFillMeta = !prev.title || !prev.poster || !prev.year;
			        const base = {
			          ...prev,
			          playFrom: d.playFrom,
			          playUrl: d.playUrl,
			          panMockEnabled: !!panMockEnabled,
			          panMockResolving: !!(panMockEnabled && d.playFrom && d.playUrl),
			          panMockResolved: false,
			          panMockResolvedByKey: {},
			          panMockListErrors: {},
			          panMock189AccessByShareId: {},
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
		        const task = resolvePanMockPlaySources({
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
		            if (resolved.panMockResolvedByKey && typeof resolved.panMockResolvedByKey === 'object') {
		              const prevResolved = cur && typeof cur.panMockResolvedByKey === 'object' ? cur.panMockResolvedByKey : {};
		              merged.panMockResolvedByKey = { ...prevResolved, ...resolved.panMockResolvedByKey };
		            }
		            if (resolved.panMockListErrors && typeof resolved.panMockListErrors === 'object') {
		              const prevErr = cur && typeof cur.panMockListErrors === 'object' ? cur.panMockListErrors : {};
		              merged.panMockListErrors = { ...prevErr, ...resolved.panMockListErrors };
		            }
		            detail.value = merged;
		          },
		        });
		        void task
		          .then((finalResolved) => {
		            if (seqForResolve !== detailFetchState.seq) return;
		            const cur = detail.value && typeof detail.value === 'object' ? detail.value : {};
		            const merged = { ...cur, panMockEnabled: true, panMockResolving: false, panMockResolved: true };
		            if (finalResolved && typeof finalResolved === 'object') {
		              if (typeof finalResolved.playFrom === 'string' && finalResolved.playFrom.trim()) merged.playFrom = finalResolved.playFrom;
		              if (typeof finalResolved.playUrl === 'string' && finalResolved.playUrl.trim()) merged.playUrl = finalResolved.playUrl;
		              if (finalResolved.panMock189AccessByShareId && typeof finalResolved.panMock189AccessByShareId === 'object') {
		                const prevMap = cur && typeof cur.panMock189AccessByShareId === 'object' ? cur.panMock189AccessByShareId : {};
		                merged.panMock189AccessByShareId = { ...prevMap, ...finalResolved.panMock189AccessByShareId };
		              }
		              if (finalResolved.panMockResolvedByKey && typeof finalResolved.panMockResolvedByKey === 'object') {
		                const prevResolved = cur && typeof cur.panMockResolvedByKey === 'object' ? cur.panMockResolvedByKey : {};
		                merged.panMockResolvedByKey = { ...prevResolved, ...finalResolved.panMockResolvedByKey };
		              }
		              if (finalResolved.panMockListErrors && typeof finalResolved.panMockListErrors === 'object') {
		                const prevErr = cur && typeof cur.panMockListErrors === 'object' ? cur.panMockListErrors : {};
		                merged.panMockListErrors = { ...prevErr, ...finalResolved.panMockListErrors };
		              }
		            }
		            detail.value = merged;
		          })
		          .catch(() => {
		            if (seqForResolve !== detailFetchState.seq) return;
		            const cur = detail.value && typeof detail.value === 'object' ? detail.value : {};
		            detail.value = { ...cur, panMockEnabled: true, panMockResolving: false, panMockResolved: false };
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
  const elSite = siteSourceDropdownEl.value;
  const el2 = tmdbPanDropdownEl.value;
  if (panDropdownOpen.value) {
    if (el && e && e.target && el.contains(e.target)) return;
    panDropdownOpen.value = false;
  }
  if (siteSourceDropdownOpen.value) {
    if (elSite && e && e.target && elSite.contains(e.target)) return;
    siteSourceDropdownOpen.value = false;
  }
  if (tmdbPanDropdownOpen.value) {
    if (el2 && e && e.target && el2.contains(e.target)) return;
    tmdbPanDropdownOpen.value = false;
  }
};

const onPanKeyDown = (e) => {
  if (e && e.key === 'Escape') {
    panDropdownOpen.value = false;
    siteSourceDropdownOpen.value = false;
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
  () => `${Number(props.openFromSearch || 0)}|${getStableContentKey()}`,
  () => {
    applyAggregatedSourcesFromSearchState();
  },
  { immediate: true }
);

watch(
  () => `${getStableContentKey()}|${isSmartPanActive.value ? '1' : '0'}`,
  () => {
    if (isSmartPanActive.value) return;
    if (applyAggregatedSourcesFromSearchState()) return;
    if (sourcesLoading.value) return;
    loadAggregatedSourcesFromStorage();
  },
  { immediate: true }
);

watch(
  () => `${getStableContentKey()}|${tmdbSmartListAvailable.value ? '1' : '0'}|${tmdbMovieSmartListAvailable.value ? '1' : '0'}`,
  async () => {
    if (!tmdbMode.value) return;
    if (!tmdbSmartListAvailable.value && !tmdbMovieSmartListAvailable.value) return;
    if (applyAggregatedSourcesFromSearchState()) return;
    if (sourcesLoading.value) return;
    loadAggregatedSourcesFromStorage();
  },
  { immediate: true }
);

watch(
  () => activeTab.value,
  async (v) => {
    if (v !== 'sources') return;
    if (applyAggregatedSourcesFromSearchState()) {
      await scrollSourcesToActive({ behavior: 'auto' });
      return;
    }
    if (sourcesLoading.value) return;
    if (isSmartPanActive.value && !tmdbMode.value) {
      await scrollSourcesToActive({ behavior: 'auto' });
      return;
    }
    loadAggregatedSourcesFromStorage();
    // If storage already has sources but this session hasn't searched yet,
    // continue searching incrementally so "加载更多" can work with fresh runtime queue.
    if (aggregatedSources.value && aggregatedSources.value.length && sourcesSearchedOnce.value) {
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
      String(Number(props.switchOnlyToken || 0)),
      typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '',
      String(props.tmdbId || 0),
    ].join('|'),
  () => {
    const nextContentKey = contentKeyFromProps();
    const nextBaseKey = buildContentKeyBase();
    const nextSiteKey = (props.siteKey || '').trim();
    const nextSpiderApi = (props.spiderApi || '').trim();
    const nextVideoId = (props.videoId || '').trim();
    const nextTmdbId = Number(props.tmdbId || 0);
    const nextTmdbType = typeof props.tmdbType === 'string' ? props.tmdbType.trim().toLowerCase() : '';

    const sameSite =
      !!lastSiteKey &&
      !!nextSiteKey &&
      lastSiteKey === nextSiteKey &&
      lastSpiderApi === nextSpiderApi &&
      lastVideoId === nextVideoId;
    const sameTMDB =
      lastTmdbId > 0 &&
      nextTmdbId > 0 &&
      lastTmdbId === nextTmdbId &&
      !!lastTmdbType &&
      lastTmdbType === nextTmdbType;
    const switchOnly = Number.isFinite(Number(props.switchOnlyToken)) && Number(props.switchOnlyToken) > 0;

    // Treat late-arriving contentKey/title refinements as the same content when source identity is unchanged.
    const isNewContent = !!nextContentKey && nextContentKey !== lastContentKey && !sameSite && !sameTMDB && !switchOnly;

    if (!lockedContentKey.value || isNewContent) {
      lockedContentKey.value = nextBaseKey;
    }

    lastContentKey = nextContentKey;
    lastSiteKey = nextSiteKey;
    lastSpiderApi = nextSpiderApi;
    lastVideoId = nextVideoId;
    lastTmdbId = nextTmdbId;
    lastTmdbType = nextTmdbType;

    const prevIdx = Number.isFinite(selectedEpisodeIndex.value) ? Math.floor(selectedEpisodeIndex.value) : 0;
    void runEntryFlow({ isNewContent, restoreEpisodeIndex: prevIdx }).catch(() => {});
  },
  { immediate: true }
);

watch(
  () => Number(props.autoPlayResetToken || 0),
  (v, prev) => {
    const next = Number.isFinite(Number(v)) ? Number(v) : 0;
    if (!next || next === prev) return;
    initialAutoPlayTriggered.value = false;
    initialAutoPlayInFlight.value = false;
    autoPlaySuppressedByUser.value = false;
    autoSourceFallbackSeq += 1;
    autoSourceFallbackTried.clear();
    autoFallbackActive.value = false;
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearPendingProxyRetryTimer();
  flushHistoryProgressBestEffort();
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
	    if (isSmartPanKey(selectedPan.value)) {
	      const ok = smartListAvailable.value && (Array.isArray(smartPanEntries.value) ? smartPanEntries.value : []).some((s) => s && s.key === selectedPan.value);
	      if (ok) return;
	      const list = panDropdownOptions.value;
	      const k = list && list[0] && list[0].key ? String(list[0].key) : '';
	      selectedPan.value = k;
        if (!k) setEpisodeIndex(-1, 'pan_dropdown_clear');
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

.play-pan-dropdown .custom-dropdown-list {
  max-height: min(360px, 58vh);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.7) rgba(148, 163, 184, 0.18);
}

.play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar {
  width: 8px;
}

.play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999px;
}

.play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.72);
  border-radius: 999px;
}

.play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.82);
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
  scrollbar-color: rgba(148, 163, 184, 0.65) rgba(30, 41, 59, 0.7);
}

.dark .play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.72);
}

.dark .play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.65);
}

.dark .play-pan-dropdown .custom-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: rgba(203, 213, 225, 0.72);
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
