<template>

	  <div class="app-shell flex min-h-screen">
	    <aside class="sidebar dashboard-sidebar flex-shrink-0 bg-white/40 dark:bg-[#0d1624] backdrop-blur-xl transition-all duration-300 border-r border-gray-200/50 dark:border-white/10 shadow-lg w-64 p-4 pt-6" style="backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)">
      <div class="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
        管理后台
      </div>
      <nav class="space-y-1">
        <a href="/" class="nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 dark:text-gray-100 dark:hover:bg-white/10 gap-3 justify-start transition-colors duration-200 min-h-[40px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span class="nav-label">回到首页</span>
        </a>
        <div v-if="bootstrap.user.role === 'admin'" class="space-y-1">
        <a data-admin="site" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span class="nav-label">全局设置</span>
        </a>
        <a data-admin="user" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span class="nav-label">用户管理</span>
        </a>
        <a data-admin="pan" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 9Z"></path></svg>
          <span class="nav-label">网盘设置</span>
        </a>
        <a data-admin="interface" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-2 h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M15 7h3a5 5 0 0 1 0 10h-3"></path><path d="M9 17H6a5 5 0 0 1 0-10h3"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
          <span class="nav-label">接口设置</span>
        </a>
        <a data-admin="video" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg>
          <span class="nav-label">视频源管理</span>
        </a>
        <a data-admin="magic" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.99V22h3.01L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
          <span class="nav-label">魔法匹配设置</span>
        </a>
        <a data-admin="smart" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
          <span class="nav-label">智能播放设置</span>
        </a>
        <a data-admin="metadata" class="admin-nav nav-item group flex items-center rounded-lg px-3 py-2 pl-4 text-gray-700 hover:bg-gray-100/30 hover:text-green-600 data-[active=true]:bg-green-500/20 data-[active=true]:text-green-700 dark:text-gray-100 dark:hover:bg-white/10 dark:data-[active=true]:text-green-300 gap-3 justify-start transition-colors duration-200 min-h-[40px]" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database h-5 w-5 text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path></svg>
          <span class="nav-label">媒体数据设置</span>
        </a>
        </div>
      </nav>
    </aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="flex-1 min-w-0 overflow-y-auto p-6 space-y-6">
        <div v-if="bootstrap.user.role !== 'admin'" class="min-h-[300px] flex flex-col items-center justify-center text-gray-600 gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-off text-gray-400"><path d="m19.69 14-4.8 4.8c-.55.55-1.29.86-2.06.87h-.66a3 3 0 0 1-2.21-.98l-5.32-5.69A2 2 0 0 1 4 11.38V5.53a2 2 0 0 1 1.23-1.84l5.52-2.21c.79-.32 1.68-.32 2.47 0l5.52 2.21A2 2 0 0 1 20 5.53V12"></path><path d="m2 2 20 20"></path></svg>
          <div class="text-lg font-semibold text-gray-700">非管理员用户</div>
          <div class="text-sm text-gray-500">当前账号没有访问管理后台的权限。</div>
        </div>
        <section v-if="bootstrap.user.role === 'admin'" id="adminSite" class="admin-panel space-y-6">
          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-5 w-5 text-gray-600 dark:text-gray-300"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            全局设置
          </div>

          <form id="siteSettingsForm" method="post" action="/dashboard/site/save">
            <div class="admin-card space-y-4">
              <div class="flex items-center gap-3">
                <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">站点设置</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">站点名称</label>
                <input name="siteName" class="tv-field" :value="bootstrap.siteName" placeholder="站点名称" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">搜索展示设置</label>
                <select name="searchDisplayMode" id="searchDisplayModeSelect" class="custom-select tv-field">
                  <option value="tmdb">TMDB</option>
                  <option value="sites" selected>视频源</option>
                  <option value="both">展示两者</option>
                </select>
                <div id="searchDisplayModeError" class="text-xs hidden mt-1"></div>
              </div>
            </div>
          </form>

	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-3">
	              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">备份/恢复</div>
	            </div>
	            <div class="text-xs text-gray-500 dark:text-gray-400">
	              导出/导入后台配置（用于删库后快速恢复；导入会忽略未知字段）。
	            </div>
	            <div class="flex items-center gap-2">
	              <button id="backupExportBtn" type="button" class="btn-green">备份</button>
	              <button id="backupImportBtn" type="button" class="btn-ghost-blue">恢复</button>
	              <input id="backupImportFile" type="file" accept="application/json,.json" class="hidden" />
	            </div>
	            <div id="backupRestoreStatus" class="text-sm hidden"></div>
	          </div>

	          <div class="pt-1 flex justify-start">
	            <div class="flex flex-col gap-2">
	              <button id="globalSettingsSave" type="button" class="btn-green">保存</button>
	              <div id="globalSettingsSaveStatus" class="text-sm hidden"></div>
	            </div>
	          </div>
        </section>
        <section v-if="bootstrap.user.role === 'admin'" id="adminUser" class="admin-panel hidden space-y-4">
          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5 text-gray-600 dark:text-gray-300"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
	            用户管理
	          </div>
          <div class="stat-card">
            <div id="userCount" class="stat-main" v-text="bootstrap.userCount"></div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="admin-card">
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                用户列表
                <button id="openAddUser" class="btn-green">添加用户</button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <div class="inline-block w-max align-top">
                <form id="addUserForm" class="space-y-3 mb-4 w-full" method="post" action="/dashboard/user/add" hidden>
                  <div
                    class="grid items-center"
                    style="grid-template-columns:max-content 1fr;gap:14px 18px"
                  >
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">用户名：</span>
                    <input id="addUserName" name="username" class="tv-field" placeholder="用户名" autocomplete="off">

                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">密码：</span>
                    <input id="addUserPassword" name="password" type="password" class="tv-field tv-field-success" placeholder="密码" autocomplete="new-password">
                  </div>
                  <div class="flex justify-start">
                    <button id="confirmAddUser" class="btn-add" type="submit">添加</button>
                  </div>
                  <div id="addUserStatus" class="text-sm" hidden></div>
                </form>

                <table class="table-auto w-max text-sm text-left text-gray-700 dark:text-gray-100">
                  <thead class="table-head">
                    <tr>
                      <th class="px-3 py-2 whitespace-nowrap">用户名</th>
                      <th class="px-3 py-2 whitespace-nowrap">角色</th>
                      <th class="px-3 py-2 whitespace-nowrap">状态</th>
                      <th class="px-3 py-2 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800" id="userTableBody">
                    <tr v-for="u in (bootstrap.users || [])" :key="u.username"
                        :data-username="u.username"
                        :data-role="u.role"
                        :data-status="u.status">
                      <td class="px-3 py-2 font-semibold whitespace-nowrap">{{ u.username }}</td>
                      <td class="px-3 py-2 whitespace-nowrap" data-col="role">
                        <span v-if="u.role === 'admin'" class="tag-yellow">管理员</span>
                        <span v-else class="tag-gray">用户</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap" data-col="status">
                        <span v-if="u.status === 'active'" class="tag-green">正常</span>
                        <span v-else-if="u.status === 'banned'" class="tag-red">封禁</span>
                        <span v-else class="tag-gray">{{ u.status }}</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="action-group">
                          <button class="action-btn blue" type="button" data-action="edit">修改</button>
                          <button v-if="u.role !== 'admin'" class="action-btn rose" type="button" data-action="ban">{{ u.status === 'active' ? '封禁' : '解封' }}</button>
                          <button v-if="u.role !== 'admin'" class="action-btn red" type="button" data-action="delete">删除</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
	        <section v-if="bootstrap.user.role === 'admin'" id="adminVideo" class="admin-panel hidden space-y-6">
	          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film h-5 w-5 text-gray-600 dark:text-gray-300"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg>
	            视频源管理
	          </div>
		          <div class="admin-card space-y-4">
		            <div class="flex justify-start">
		              <div class="flex flex-col gap-2">
		                <div class="flex items-center gap-2">
		                  <button
		                    id="videoSourceImportFromCatPawOpen"
		                    type="button"
		                    class="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
		                  >从 CatPawOpen 导入站源</button>
		                </div>
		                <div id="videoSourceSaveStatus" class="text-sm hidden"></div>
		              </div>
		            </div>
			          </div>

	          <div class="tv-us-acc-item">
	            <button id="videoSourceSitesToggle" class="tv-us-acc-head" type="button">
	              <span>站点列表</span>
	              <span id="videoSourceSitesToggleIcon" class="tv-us-acc-icon" data-open="false">
	                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
	                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
	                </svg>
	              </span>
	            </button>
	            <div id="videoSourceSitesPanel" class="tv-us-acc-body hidden">
	              <div class="flex items-center gap-2 mb-2">
	                <button
	                  id="videoSourceJsonImport"
	                  type="button"
	                  class="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
	                >
	                  导入站点
	                </button>
	                <button
	                  id="videoSourceJsonExport"
	                  type="button"
	                  class="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
	                >
	                  导出站点
	                </button>
	                <input
	                  id="videoSourceJsonImportFile"
	                  type="file"
	                  accept="application/json,.json"
	                  class="hidden"
	                />
	              </div>
	              <div class="flex items-center justify-between gap-3 mb-2">
	                <div class="flex items-center gap-2">
	                  <button
	                    id="videoSourceResetOrder"
	                    type="button"
	                    class="px-2 py-1 rounded-full border border-gray-400 text-xs font-medium text-gray-700 hover:bg-gray-500/10 dark:border-white/20 dark:text-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
	                  >
	                    重置排序
	                  </button>
	                  <div id="videoSourceBulkActions" class="hidden flex items-center gap-2">
	                    <button
	                      id="videoSourceBulkCheckDisable"
	                      type="button"
	                      class="px-2 py-1 rounded-full border border-gray-400 text-xs font-medium text-gray-700 hover:bg-gray-500/10 dark:border-white/20 dark:text-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
	                    >
	                      检测并禁用失效源
	                    </button>
	                    <button
	                      id="videoSourceBulkEnable"
	                      type="button"
	                      class="px-2 py-1 rounded-full border border-green-500 text-xs font-medium text-green-600 hover:bg-green-500/10 transition-colors duration-150"
	                    >
	                      批量启用
	                    </button>
	                    <button
	                      id="videoSourceBulkDisable"
	                      type="button"
	                      class="px-2 py-1 rounded-full border border-red-500 text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors duration-150"
	                    >
	                      批量禁用
	                    </button>
	                  </div>
	                </div>
	                <div class="flex items-center gap-2 min-w-0">
	                  <div
	                    id="videoSourceImportSummary"
	                    class="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400 hidden"
	                  ></div>
	                  <div
	                    id="videoSourceListSaveStatus"
	                    class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"
	                  ></div>
	                </div>
	              </div>
	              <div class="max-h-[60vh] overflow-y-auto tv-panel">
	                <div
	                  class="video-source-header tv-row sticky top-0 z-[2] mb-2"
	                >
	                  <input
	                    id="videoSourceHeaderCheckbox"
	                    type="checkbox"
	                    class="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-green-600 focus:ring-green-500"
	                  />
	                  <span
	                    id="videoSourceHeaderName"
	                    class="text-sm font-medium text-gray-600 dark:text-gray-300 truncate"
	                  >站源名称</span>
	                  <span
	                    id="videoSourceHeaderApi"
	                    class="text-sm font-medium text-gray-600 dark:text-gray-300 truncate"
	                  >路由/API</span>
	                  <span
	                    id="videoSourceHeaderAvailability"
	                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
	                  >站点可用性</span>
	                  <span
	                    id="videoSourceHeaderStatus"
	                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
	                  >是否启用</span>
		                  <span
		                    id="videoSourceHeaderHome"
		                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
		                  >首页显示</span>
		                  <span
		                    id="videoSourceHeaderSearch"
		                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
		                  >搜索启用</span>
		                  <span
		                    id="videoSourceHeaderCover"
		                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
		                  >聚合图片显示</span>
		                  <span
		                    id="videoSourceHeaderSort"
		                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
		                  >排序</span>
		                  <span
		                    id="videoSourceHeaderError"
		                    class="text-sm font-medium text-gray-600 dark:text-gray-300"
		                  >错误信息</span>
	                </div>
	                <ul id="videoSourceList" class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
	                  <li class="text-gray-500 dark:text-gray-400">暂无站源，解析完成后会在这里展示。</li>
	                </ul>
	              </div>
	            </div>
	          </div>
	        </section>
	        <section v-if="bootstrap.user.role === 'admin'" id="adminPan" class="admin-panel hidden space-y-6">
	          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
	            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud h-5 w-5 text-gray-600 dark:text-gray-300"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 9Z"></path></svg>
	            网盘设置
	          </div>
	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-2">
	              <button
	                id="panSettingsScrollLeft"
	                type="button"
                class="hidden px-2 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
                title="向左滚动"
              >&lt;</button>
              <div id="panSettingsTabs" class="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 flex-1"></div>
              <button
                id="panSettingsScrollRight"
                type="button"
                class="hidden px-2 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
                title="向右滚动"
              >&gt;</button>
              <div class="relative">
                <button
                  id="panSettingsMoreBtn"
                  type="button"
                  class="hidden px-2 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors duration-150"
                  title="更多"
                >…</button>
                <div
                  id="panSettingsMoreMenu"
                  class="hidden absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-lg overflow-hidden z-10"
                ></div>
              </div>
            </div>
	            <div id="panSettingsContent" class="min-h-[320px]"></div>
	            <div id="panSettingsStatus" class="text-sm hidden"></div>
	          </div>
	        </section>
		        <section v-if="bootstrap.user.role === 'admin'" id="adminInterface" class="admin-panel hidden space-y-6">
		          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
	            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-2 h-5 w-5 text-gray-600 dark:text-gray-300"><path d="M15 7h3a5 5 0 0 1 0 10h-3"></path><path d="M9 17H6a5 5 0 0 1 0-10h3"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
	            接口设置
	          </div>
		          <div class="admin-card space-y-4">
		            <form id="catPawOpenSettingsForm" method="post" action="/dashboard/catpawopen/save" class="space-y-4">
		              <div class="flex items-center gap-3">
		                <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">CatPawOpen 设置</div>
		              </div>
					              <div class="space-y-2">
						                <div class="flex items-center gap-3 flex-wrap justify-start">
						                  <button
						                    id="catPawOpenServerAdd"
						                    type="button"
						                    class="btn-green"
					                  >添加服务器</button>
					                </div>
					                <div class="flex items-center gap-3 flex-wrap">
					                  <div class="text-sm font-medium text-gray-700 dark:text-gray-200">服务器选择</div>
					                  <div class="tv-cpo-server-select">
						                    <select
						                      id="catPawOpenServerSelect"
						                      name="catPawOpenServerKey"
						                      data-custom-dropdown-autosize="max"
						                      class="custom-select tv-field"
						                    >
					                      <option value="" selected disabled>暂无数据</option>
					                    </select>
					                  </div>
					                  <button
					                    id="catPawOpenServerDelete"
					                    type="button"
					                    class="btn-ghost-red hidden"
					                  >删除</button>
					                  <button
					                    id="catPawOpenServerDeleteCancel"
					                    type="button"
					                    class="btn-ghost-blue hidden"
					                  >取消</button>
					                </div>
					              </div>
						              <div id="catPawOpenNameRow" class="hidden">
						                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">服务器名称</label>
						                <input
						                  name="catPawOpenName"
						                  class="tv-field"
						                  required
						                  autocomplete="off"
						                >
							              </div>
					              <div id="catPawOpenApiRow" class="hidden">
					                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CatPawOpen 接口地址</label>
					                <input
					                  name="catPawOpenApiBase"
					                  class="tv-field"
					                  placeholder="http://127.0.0.1:9988"
					                >
						              </div>
					              <div id="catPawOpenSyncFromServerRow" class="hidden">
					                <div class="flex items-center gap-2 flex-wrap text-sm text-gray-700 dark:text-gray-200">
					                  <span class="whitespace-nowrap">从</span>
					                  <div class="tv-cpo-server-select">
					                    <select id="catPawOpenSyncFromServerSelect" class="custom-select tv-field" data-custom-dropdown-autosize="max">
					                      <option value="" selected>请选择</option>
					                    </select>
					                  </div>
					                  <span class="whitespace-nowrap">获取配置并同步</span>
					                </div>
					              </div>
					              <div id="catPawOpenVersionRow" class="hidden">
					                <div id="catPawOpenVersionText" class="text-xs text-gray-500 dark:text-gray-400"></div>
					              </div>
						              <div id="catPawOpenSettingsExtras" class="hidden space-y-4">
						              <div id="catPawOpenRemoteError" class="hidden rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"></div>
						              <div id="catPawOpenRemoteSettings" class="hidden space-y-4">
						                <div>
						                  <div class="flex items-center gap-2 mb-1">
						                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">配置列表</label>
						                    <button
						                      id="catPawOpenConfigListAdd"
						                      type="button"
						                      class="btn-green"
						                    >添加</button>
						                  </div>
						                  <input id="catPawOpenConfigListJson" type="hidden" value="[]" />
						                  <div class="tv-cpo-config-shell">
						                    <div id="catPawOpenConfigEditor" class="tv-panel tv-cpo-config-editor mb-3 hidden">
						                      <div
						                        class="grid items-center"
						                        style="grid-template-columns:max-content 1fr;gap:14px 18px"
						                      >
						                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">名称：</span>
						                        <input id="catPawOpenConfigEditorName" class="tv-field" placeholder="名称" autocomplete="off" />

						                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">配置地址：</span>
						                        <input id="catPawOpenConfigEditorUrl" class="tv-field" placeholder="https://example.com/xx.js" autocomplete="off" />
						                      </div>
							                      <div class="flex justify-start items-center gap-3 mt-3">
							                        <button id="catPawOpenConfigEditorConfirm" class="btn-add" type="button">确定</button>
							                        <button
							                          id="catPawOpenConfigEditorCancel"
							                          type="button"
							                          class="btn-ghost-blue"
							                        >取消</button>
							                      </div>
						                      <div id="catPawOpenConfigEditorStatus" class="text-sm mt-2" hidden></div>
						                    </div>
						                    <div class="tv-panel tv-cpo-config-table overflow-x-auto">
						                      <table class="table-auto w-max max-w-full text-sm text-left text-gray-700 dark:text-gray-100">
						                        <thead class="table-head">
						                          <tr>
						                            <th class="px-3 py-2 whitespace-nowrap">名称</th>
						                            <th class="px-3 py-2 whitespace-nowrap">配置地址</th>
						                            <th class="px-3 py-2 whitespace-nowrap">配置检测</th>
						                            <th class="px-3 py-2 whitespace-nowrap">操作</th>
						                          </tr>
						                        </thead>
						                        <tbody id="catPawOpenConfigList" class="divide-y divide-gray-100 dark:divide-gray-800">
						                          <tr>
						                            <td class="px-3 py-2 text-gray-500 dark:text-gray-400">-</td>
						                            <td class="px-3 py-2 text-gray-500 dark:text-gray-400">-</td>
						                            <td class="px-3 py-2 text-gray-500 dark:text-gray-400">-</td>
						                            <td class="px-3 py-2 text-gray-500 dark:text-gray-400">-</td>
						                          </tr>
						                        </tbody>
						                      </table>
						                    </div>
						                  </div>
						                </div>
						              <div>
						                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CatPawOpen 全局代理</label>
				                <input
				                  name="catPawOpenProxy"
			                  class="tv-field"
			                  placeholder="http://127.0.0.1:7890"
			                >
				                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">用于 CatPawOpen 请求时的全局代理（留空关闭）。</p>
					              </div>
					              <div class="space-y-1 pt-1">
					                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">使用内置网盘解析</div>
					                <div>
					                  <label class="enable-switch" title="使用内置网盘解析">
					                    <input id="catPawOpenPanBuiltinResolverEnabled" name="catPawOpenPanBuiltinResolverEnabled" type="checkbox" />
					                    <span class="enable-slider"></span>
					                  </label>
					                </div>
					              </div>
					              <div class="space-y-1 pt-1">
					                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">加速详情获取</div>
					                <div>
					                  <label class="enable-switch" title="加速详情获取（pan_mock）">
					                    <input id="catPawOpenPanMockEnabled" name="catPawOpenPanMockEnabled" type="checkbox" />
					                    <span class="enable-slider"></span>
					                  </label>
					                </div>
					                <p class="text-xs text-gray-500 dark:text-gray-400">开启后会在 detail 返回中注入 pan_mock，并由 MeowFilm 直接并发请求网盘接口解析（仅影响智能播放链路）。</p>
					              </div>
					              <div class="space-y-2">
					                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">GoProxy API（挂载在 CatPawOpen 同机）</div>
					                <input
					                  name="catPawOpenGoProxyApi"
					                  class="tv-field"
					                  placeholder="/api 或 https://example.com/"
					                  autocomplete="off"
					                >
					                <p class="text-xs text-gray-500 dark:text-gray-400">用于 m3u8 分片改写指向同机 GoProxy。</p>
					              </div>
				              <div class="pt-1 flex items-center gap-3">
				                <button id="catPawOpenSyncPanLoginSettingsBtn" type="button" class="btn-green">同步网盘账号至catpawopen</button>
					                <div
					                  id="catPawOpenSyncPanLoginSettingsStatus"
					                  class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"
					                ></div>
					              </div>
				              <div class="pt-1 flex flex-col items-start gap-2">
				                <button id="catPawOpenSyncConfigToOtherBtn" type="button" class="btn-green">同步配置至其他服务器</button>
				                <div
				                  id="catPawOpenSyncConfigToOtherPicker"
				                  class="hidden flex items-center gap-2 flex-wrap"
				                >
				                  <div class="tv-cpo-server-select">
				                    <select id="catPawOpenSyncConfigToOtherSelect" class="custom-select tv-field">
				                      <option value="" selected>请选择</option>
				                    </select>
				                  </div>
				                  <button
				                    id="catPawOpenSyncConfigToOtherConfirm"
				                    type="button"
				                    class="btn-green"
				                    disabled
				                  >确定</button>
				                  <button
				                    id="catPawOpenSyncConfigToOtherCancel"
				                    type="button"
				                    class="btn-ghost-blue"
				                  >取消</button>
				                  <div
				                    id="catPawOpenSyncConfigToOtherStatus"
				                    class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"
				                  ></div>
				                </div>
				              </div>
					              </div>
				              </div>
				              <div class="pt-1 flex flex-col items-start gap-1">
				                <div
				                  id="catPawOpenSyncSaveWrap"
				                  class="hidden flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
				                >
				                  <input id="catPawOpenSyncSave" type="checkbox" class="h-4 w-4" checked>
				                  <label for="catPawOpenSyncSave" class="select-none">同步保存</label>
				                </div>
				                <div class="flex items-center gap-2">
				                  <button type="submit" class="btn-green">保存</button>
				                  <button
				                    id="catPawOpenServerAddCancelBottom"
				                    type="button"
				                    class="btn-ghost-blue hidden"
				                  >取消</button>
				                </div>
				                <div id="catPawOpenSaveStatus" class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"></div>
				              </div>
				            </form>
			          </div>

	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-3">
	              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">GoProxy 设置</div>
	              <div id="goProxySaveStatus" class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"></div>
	            </div>
		            <form id="goProxySettingsForm" method="post" action="/dashboard/goproxy/save" class="space-y-4">
		              <div class="space-y-1">
		                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">GoProxy 启用</div>
		                <div>
		                  <label class="enable-switch" title="GoProxy 启用">
		                    <input id="goProxyEnabled" name="goProxyEnabled" type="checkbox" :checked="bootstrap.settings.goProxyEnabled" />
		                    <span class="enable-slider"></span>
		                  </label>
		                </div>
		                <div class="text-xs text-gray-500 dark:text-gray-400">开启后由客户端将直链注册到 GoProxy。</div>
		              </div>

		              <div class="space-y-1">
		                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">GoProxy 自动优选</div>
		                <div>
		                  <label class="enable-switch" title="GoProxy 自动优选">
		                    <input
		                      id="goProxyAutoSelect"
		                      name="goProxyAutoSelect"
		                      type="checkbox"
		                      :checked="bootstrap.settings.goProxyAutoSelect"
		                    />
		                    <span class="enable-slider"></span>
		                  </label>
		                </div>
		                <div class="text-xs text-gray-500 dark:text-gray-400">开启后会测速并自动选择最快服务器。</div>
		              </div>

		              <input type="hidden" id="goProxyServersJson" name="goProxyServersJson" value="">

		              <div class="space-y-2">
		                <div class="flex items-center gap-2 mb-1">
		                  <div class="text-sm font-medium text-gray-700 dark:text-gray-200">GoProxy 服务器</div>
		                  <button id="goProxyServerAdd" type="button" class="btn-green">添加</button>
		                </div>

		                <div class="tv-cpo-config-shell">
		                  <div id="goProxyServerEditor" class="tv-panel tv-cpo-config-editor mb-3 hidden">
		                    <div class="grid items-center" style="grid-template-columns:max-content 1fr;gap:14px 18px">
		                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">名称：</span>
		                      <input id="goProxyServerEditorName" class="tv-field" placeholder="名称" autocomplete="off">

		                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">显示名称：</span>
		                      <input id="goProxyServerEditorDisplayName" class="tv-field" placeholder="显示名称" autocomplete="off">

		                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">接口地址：</span>
		                      <input id="goProxyServerEditorBase" class="tv-field" placeholder="http://example.com" autocomplete="off">
		                    </div>
		                    <div class="flex justify-start items-center gap-3 mt-3">
		                      <button id="goProxyServerEditorConfirm" class="btn-add" type="button" disabled>添加</button>
		                      <button id="goProxyServerEditorCancel" type="button" class="btn-ghost-blue">取消</button>
		                    </div>
		                    <div id="goProxyServerEditorStatus" class="text-sm mt-2" hidden></div>
		                  </div>

		                  <div class="tv-panel tv-cpo-config-table overflow-x-auto">
		                    <table class="table-auto w-max max-w-full text-sm text-left text-gray-700 dark:text-gray-100">
		                      <thead class="table-head">
		                        <tr>
		                          <th class="px-3 py-2 whitespace-nowrap">名称</th>
		                          <th class="px-3 py-2 whitespace-nowrap">显示名称</th>
		                          <th class="px-3 py-2 whitespace-nowrap">接口地址</th>
		                          <th class="px-3 py-2 whitespace-nowrap">版本</th>
		                          <th class="px-3 py-2 whitespace-nowrap">状态</th>
		                          <th class="px-3 py-2 whitespace-nowrap">网盘启用</th>
		                          <th class="px-3 py-2 whitespace-nowrap">操作</th>
		                        </tr>
		                      </thead>
		                      <tbody class="divide-y divide-gray-100 dark:divide-gray-800" id="goProxyServerTableBody">
		                        <tr>
		                          <td class="px-3 py-2 text-gray-500 dark:text-gray-400" colspan="7">无数据</td>
		                        </tr>
		                      </tbody>
		                    </table>
		                  </div>
		                </div>
		              </div>

		              <div class="pt-1 flex justify-start">
		                <button type="submit" class="btn-green">保存</button>
	              </div>
	            </form>
	          </div>
	        </section>
	        <section v-if="bootstrap.user.role === 'admin'" id="adminSmart" class="admin-panel hidden space-y-6">
	          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
	            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles h-5 w-5 text-gray-600 dark:text-gray-300"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
	            智能播放设置
	          </div>

	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-3">
	              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">偏好设置</div>
	              <button id="smartPanDefaultsRestore" type="button" class="btn-ghost-red">恢复默认规则</button>
	              <button id="smartPanDefaultsRestoreConfirm" type="button" class="btn-ghost-red hidden">确定</button>
	              <button id="smartPanDefaultsRestoreCancel" type="button" class="btn-ghost-blue hidden">取消</button>
	            </div>

	            <div class="space-y-3">
	              <div class="space-y-1">
	                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">优先片源规则</div>
	                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
	                  仅影响同等画质/特征下的优先提取，不再依赖画质/帧率偏好设置
	                </div>
	                <select id="smartSourceExtractPriority" class="custom-select tv-field">
	                  <option value="无">无</option>
	                  <option value="网盘">网盘</option>
	                  <option value="关键字">关键字</option>
	                </select>
	              </div>
	            </div>

	            <div class="pt-2 border-t border-gray-200 dark:border-white/10">
	              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">关键字匹配规则</div>
	            </div>
	            <div>
	              <input id="smartSourcePriorityTokensInput" class="tv-field" placeholder="DDP,H.265" />
	            </div>

	            <div class="pt-2 border-t border-gray-200 dark:border-white/10">
	              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">网盘匹配规则</div>
	            </div>
	            <div>
	              <input id="smartPanMatchTokensInput" class="tv-field" placeholder="百度,夸克,天翼,UC,115" />
	            </div>
	          </div>

	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-3">
	              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">站点净化设置</div>
	              <button id="smartSiteCleanDefaultsRestore" type="button" class="btn-ghost-red">恢复默认规则</button>
	              <button id="smartSiteCleanDefaultsRestoreConfirm" type="button" class="btn-ghost-red hidden">确定</button>
	              <button id="smartSiteCleanDefaultsRestoreCancel" type="button" class="btn-ghost-blue hidden">取消</button>
	            </div>
	            <div class="text-xs text-gray-500 dark:text-gray-400">
	            智能播放不会在匹配到的站点进行匹配片源
	            </div>
				<div class="pt-2 border-t border-gray-200 dark:border-white/10">
	              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">关键字匹配规则</div>
	            </div>
	            <div>
	              <input id="smartSiteCleanKeywordsInput" class="tv-field" placeholder="直播,体育,短剧,听书,舞曲,哔哩" />
	            </div>
	          </div>

	          <div class="admin-card space-y-4">
	            <div class="flex items-center gap-3">
	              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">匹配禁用管理</div>
	            </div>
	            <div class="text-xs text-gray-500 dark:text-gray-400">
	              在搜索页原始列表中右击站点卡片可添加禁用项（仅影响智能播放匹配）
	            </div>
	            <div class="tv-panel overflow-hidden">
	              <div class="flex items-center border-b border-gray-100 dark:border-gray-800 divide-x divide-gray-100 dark:divide-gray-800">
	                <div class="w-64 shrink-0 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">禁用数据</div>
	                <div class="flex-1 min-w-0">
	                  <div class="grid" style="grid-template-columns:72px 180px 1fr 1fr 88px;">
	                    <div class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">预览</div>
	                    <div class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">站源</div>
	                    <div class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">路由/API</div>
	                    <div class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">详情ID</div>
	                    <div class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">操作</div>
	                  </div>
	                </div>
	              </div>

	              <div class="flex divide-x divide-gray-100 dark:divide-gray-800">
	                <div class="w-64 shrink-0 max-h-80 overflow-auto">
	                  <ul id="smartMatchBlockKeywordList" class="p-3 space-y-2">
	                    <li class="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">无数据</li>
	                  </ul>
	                </div>
	                <div class="flex-1 min-w-0 max-h-80 overflow-auto tv-cpo-config-table">
	                  <table class="table-fixed w-full text-sm text-left text-gray-700 dark:text-gray-100">
	                    <colgroup>
	                      <col style="width:72px;" />
	                      <col style="width:180px;" />
	                      <col />
	                      <col />
	                      <col style="width:88px;" />
	                    </colgroup>
	                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800" id="smartMatchBlockItemTableBody">
	                      <tr>
	                        <td class="px-3 py-2 text-gray-500 dark:text-gray-400" colspan="5">请选择关键字</td>
	                      </tr>
	                    </tbody>
	                  </table>
	                </div>
	              </div>
	            </div>
	          </div>

	          <div class="pt-1 flex justify-start">
	            <div class="flex flex-col gap-2">
	              <button id="smartPanSettingsSave" type="button" class="btn-green">保存</button>
	            </div>
	          </div>
	        </section>
		        <section v-if="bootstrap.user.role === 'admin'" id="adminMetadata" class="admin-panel hidden space-y-6">
		          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
		            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database h-5 w-5 text-gray-600 dark:text-gray-300"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path></svg>
		            媒体数据设置
		          </div>

              <form id="metadataSettingsForm" class="space-y-6">
                <div class="admin-card space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">豆瓣配置</div>
                    <div id="metadataSaveStatus" class="text-xs hidden whitespace-nowrap text-gray-500 dark:text-gray-400"></div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">豆瓣数据代理</label>
                      <select id="doubanDataSelect" class="custom-select tv-field">
                        <option value="server-proxy">服务器代理</option>
                        <option value="cors">Cors Proxy By Zwei</option>
                        <option value="cdn-tx">豆瓣 CDN By CMLiussss（腾讯云）</option>
                        <option value="cdn-ali">豆瓣 CDN By CMLiussss（阿里云）</option>
                        <option value="custom">自定义代理</option>
                      </select>
                      <div id="doubanDataCustom" class="mt-2 hidden">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">豆瓣代理地址</label>
                        <input id="doubanDataCustomInput" class="tv-field" autocomplete="off" />
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">自定义代理地址</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">豆瓣图片代理</label>
                      <select id="doubanImgSelect" class="custom-select tv-field">
                        <option value="server-proxy">服务器代理</option>
                        <option value="douban-cdn-ali">豆瓣官方精品 CDN（阿里云）</option>
                        <option value="cdn-tx">豆瓣 CDN By CMLiussss（腾讯云）</option>
                        <option value="cdn-ali">豆瓣 CDN By CMLiussss（阿里云）</option>
                        <option value="custom">自定义代理</option>
                      </select>
                      <div id="doubanImgCustom" class="mt-2 hidden">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">豆瓣图片代理地址</label>
                        <input id="doubanImgCustomInput" class="tv-field" autocomplete="off" />
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">自定义图片代理服务器地址</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="admin-card space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">TMDB 设置</div>
                  </div>

                  <div class="space-y-4">
                    <div class="space-y-1">
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-200">TMDB API TOKEN</div>
                      <input id="tmdbApiToken" class="tv-field" type="text" autocomplete="off" />
                      <div class="text-xs text-gray-500 dark:text-gray-400">填入 v3 或 v4 任意一种。</div>
                    </div>

                    <div class="space-y-1">
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-200">TMDB 数据代理地址</div>
                      <input id="tmdbDataProxyBase" class="tv-field" type="text" autocomplete="off" />
                      <div class="text-xs text-gray-500 dark:text-gray-400">GoProxy:https://你的域名/tmdb/3</div>
                    </div>

                    <div class="space-y-1">
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-200">TMDB 图片代理地址</div>
                      <input id="tmdbImageProxyBase" class="tv-field" type="text" autocomplete="off" />
                      <div class="text-xs text-gray-500 dark:text-gray-400">GoProxy:https://你的域名/tmdb-img</div>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-3">
                      <div class="space-y-1">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">语言</div>
                        <input id="tmdbLanguage" class="tv-field" placeholder="zh-CN" autocomplete="off" />
                      </div>
                      <div class="space-y-1">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">地区</div>
                        <input id="tmdbRegion" class="tv-field" placeholder="CN" autocomplete="off" />
                      </div>
                      <div class="space-y-1">
                        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">包含成人内容</div>
                        <div>
                          <label class="enable-switch" title="包含成人内容">
                            <input id="tmdbIncludeAdult" type="checkbox" />
                            <span class="enable-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-1 flex justify-start">
                  <button type="submit" class="btn-green">保存</button>
                </div>
              </form>
		        </section>
	        <section v-if="bootstrap.user.role === 'admin'" id="adminMagic" class="admin-panel hidden space-y-6">
	          <div class="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-base font-semibold">
	            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-5 w-5 text-gray-600 dark:text-gray-300"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.99V22h3.01L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
	            魔法匹配设置
	          </div>

			          <div class="admin-card space-y-3">
			            <div class="flex items-center gap-3">
			              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">列表净化设置</div>
			              <button id="magicEpisodeDefaultsRestore" type="button" class="btn-ghost-red">恢复默认规则</button>
			              <button id="magicEpisodeDefaultsRestoreConfirm" type="button" class="btn-ghost-red hidden">确定</button>
			              <button id="magicEpisodeDefaultsRestoreCancel" type="button" class="btn-ghost-blue hidden">取消</button>
			            </div>

			            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">剧集列表净化规则</div>
			            <div class="flex items-center gap-2">
			              <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
			                <input
			                  id="magicEpisodeCleanRegexRuleInput"
			                  class="tv-field min-w-0"
			                  placeholder="\\[.*?\\]|\\(.*?\\)|更新至\\d+集"
			                />
			              </div>
			              <button id="magicEpisodeCleanRegexRuleAdd" type="button" class="btn-green">添加</button>
			            </div>
			            <div id="magicEpisodeCleanRegexRuleStatus" class="text-xs hidden"></div>
			            <ul id="magicEpisodeCleanRegexRuleList" class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
			              <li class="text-gray-500 dark:text-gray-400">无数据</li>
			            </ul>

			            <div class="pt-3 border-t border-gray-200 dark:border-white/10">
			              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">集数匹配规则</div>
			            </div>
			            <div class="flex flex-col gap-2">
			              <div class="flex items-center gap-2">
			                <div class="flex items-center gap-2 min-w-0" style="flex: 0 0 50%; max-width: 50%;">
			                  <input
	                    id="magicEpisodeRulePatternInput"
	                    class="tv-field min-w-0"
	                    style="flex: 5 1 0;"
	                    placeholder=".*?([Ss]\\d{1,2})?(?:[第EePpXx\\.\\-_\\( ]{1,2}|^)(\\d{1,3})(?!\\d).*?\\.(mp4|mkv)"
	                  />
	                  <input
	                    id="magicEpisodeRuleReplaceInput"
	                    class="tv-field min-w-0"
	                    style="flex: 1 1 0;"
	                    placeholder="$1E$2.$3"
	                  />
	                </div>
	                <button id="magicEpisodeRuleAdd" type="button" class="btn-green">添加</button>
	              </div>
	            </div>
	            <div id="magicEpisodeRuleStatus" class="text-xs hidden"></div>
	            <ul id="magicEpisodeRuleList" class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
	              <li class="text-gray-500 dark:text-gray-400">无数据</li>
	            </ul>

	            <div class="pt-2 border-t border-gray-200 dark:border-white/10 space-y-2">
	              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">规则测试</div>
	              <div class="flex items-center gap-2">
	                <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
	                  <input
	                    id="magicEpisodeRuleTestInput"
	                    class="tv-field min-w-0"
	                    placeholder="仙逆.S01E006.mkv"
	                  />
	                </div>
	                <button id="magicEpisodeRuleTestBtn" type="button" class="btn-green">测试</button>
	              </div>
	              <div class="min-w-0" style="width: 50%; max-width: 50%;">
	                <div id="magicEpisodeRuleTestOutput" class="text-xs hidden text-gray-600 dark:text-gray-300 truncate" style="width: 100%;"></div>
	              </div>
	            </div>
          </div>

          <div class="admin-card space-y-3">
            <div class="flex items-center gap-3">
              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">电影匹配设置</div>
              <button id="magicMovieDefaultsRestore" type="button" class="btn-ghost-red">恢复默认规则</button>
              <button id="magicMovieDefaultsRestoreConfirm" type="button" class="btn-ghost-red hidden">确定</button>
              <button id="magicMovieDefaultsRestoreCancel" type="button" class="btn-ghost-blue hidden">取消</button>
            </div>

            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">电影匹配规则</div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 min-w-0" style="flex: 0 0 50%; max-width: 50%;">
                  <input id="magicMovieRulePatternInput" class="tv-field min-w-0" placeholder="^(?!.*S\\d{1,2}\\s*E\\d{1,3}).*?\\.(mkv|mp4)$" />
                  <input id="magicMovieRuleReplaceInput" class="tv-field min-w-0" placeholder="replace（可空）" />
                </div>
                <button id="magicMovieRuleAdd" type="button" class="btn-green">添加</button>
              </div>
            </div>
            <div id="magicMovieRuleStatus" class="text-xs hidden"></div>
            <ul id="magicMovieRuleList" class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li class="text-gray-500 dark:text-gray-400">无数据</li>
            </ul>

            <div class="pt-2 border-t border-gray-200 dark:border-white/10 space-y-2">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">规则测试</div>
              <div class="flex items-center gap-2">
                <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
                  <input id="magicMovieRuleTestInput" class="tv-field min-w-0" placeholder="Hamnet (2025) (1080p WEB-DL).mkv" />
                </div>
                <button id="magicMovieRuleTestBtn" type="button" class="btn-green">测试</button>
              </div>
              <div class="min-w-0" style="width: 50%; max-width: 50%;">
                <div id="magicMovieRuleTestOutput" class="text-xs hidden text-gray-600 dark:text-gray-300 truncate" style="width: 100%;"></div>
              </div>
            </div>
          </div>

          <div class="admin-card space-y-3">
            <div class="flex items-center gap-3">
              <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">搜索列表净化设置</div>
              <button id="magicAggregateDefaultsRestore" type="button" class="btn-ghost-red">恢复默认规则</button>
              <button id="magicAggregateDefaultsRestoreConfirm" type="button" class="btn-ghost-red hidden">确定</button>
              <button id="magicAggregateDefaultsRestoreCancel" type="button" class="btn-ghost-blue hidden">取消</button>
            </div>

            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">搜索列表净化规则</div>
            <div class="flex items-center gap-2">
              <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
                <input
                  id="magicAggregateRegexRuleInput"
                  class="tv-field min-w-0"
                  placeholder="\\(\\d{4}\\)|\\[.*?\\]|更新至\\d+集"
                />
              </div>
              <button id="magicAggregateRegexRuleAdd" type="button" class="btn-green">添加</button>
            </div>
            <div id="magicAggregateRegexRuleStatus" class="text-xs hidden"></div>
            <ul id="magicAggregateRegexRuleList" class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li class="text-gray-500 dark:text-gray-400">无数据</li>
            </ul>

            <div class="pt-2 border-t border-gray-200 dark:border-white/10 space-y-2">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">规则测试</div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
                    <input
                      id="magicAggregateRuleTestQueryInput"
                      class="tv-field min-w-0"
                      placeholder="搜索关键字（可选）"
                    />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="min-w-0" style="flex: 0 0 50%; max-width: 50%;">
                    <input
                      id="magicAggregateRuleTestInput"
                      class="tv-field min-w-0"
                      placeholder="搜索结果标题（如：仙逆 年番 更新至123集 (2023)）"
                    />
                  </div>
                  <button id="magicAggregateRuleTestBtn" type="button" class="btn-green">测试</button>
                </div>
              </div>
              <div class="min-w-0" style="width: 50%; max-width: 50%;">
                <div id="magicAggregateRuleTestOutput" class="text-xs hidden text-gray-600 dark:text-gray-300 truncate" style="width: 100%;"></div>
              </div>
            </div>
          </div>
	        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { initMainInteractions } from '../../shared/mainInteractions';
import { initDashboardPage } from './dashboardClient.js';

const props = defineProps({ bootstrap: { type: Object, required: true } });

onMounted(() => {
  initMainInteractions();
  initDashboardPage(props.bootstrap);
});
</script>

<style>
.tv-us-acc-item {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

.dark .tv-us-acc-item {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.tv-us-acc-head {
  width: 100%;
  height: 46px;
  padding: 0 14px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 1);
  background: transparent;
  border: none;
  cursor: pointer;
}

.dark .tv-us-acc-head {
  color: rgba(243, 244, 246, 1);
}

.tv-us-acc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.55);
  color: rgba(55, 65, 81, 1);
  transition: transform 0.18s ease;
}

.tv-us-acc-icon[data-open='true'] {
  transform: rotate(180deg);
}

.dark .tv-us-acc-icon {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(229, 231, 235, 1);
}

.tv-us-acc-body {
  padding: 12px 14px 14px;
}
</style>
