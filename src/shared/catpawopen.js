export function normalizeCatPawOpenApiBase(inputUrl) {
  const raw = typeof inputUrl === 'string' ? inputUrl.trim() : '';
  if (!raw) return '';
  try {
    const url = new URL(raw);
    url.hash = '';
    url.search = '';
    let path = url.pathname || '/';
    const spiderIdx = path.indexOf('/spider/');
    if (spiderIdx >= 0) path = path.slice(0, spiderIdx) || '/';
    // If user pasted an id-prefixed spider API like "/<id>/spider/...", drop the id segment.
    if (/^\/[a-f0-9]{10}\/?$/.test(path)) path = '/';
    path = path.replace(/\/spider\/?$/, '/');
    path = path.replace(/\/(full-config|config|website)\/?$/, '/');
    // Keep pathname but ensure it ends with "/" so URL(resolve) works as expected.
    if (!path.endsWith('/')) path += '/';
    url.pathname = path;
    return url.toString();
  } catch (_e) {
    return '';
  }
}

let lowPriorityPauseCount = 0;
let lowPriorityWaiters = [];
let lowPrioritySearchTickets = 0;

const flushLowPriorityWaiters = () => {
  if (!lowPriorityWaiters.length) return;
  const waiters = lowPriorityWaiters;
  lowPriorityWaiters = [];
  waiters.forEach((fn) => {
    try {
      fn();
    } catch (_e) {}
  });
};

const waitIfLowPriorityPaused = async () => {
  if (lowPriorityPauseCount <= 0) return;
  if (lowPrioritySearchTickets > 0) {
    lowPrioritySearchTickets = Math.max(0, lowPrioritySearchTickets - 1);
    return;
  }
  await new Promise((resolve) => {
    lowPriorityWaiters.push(resolve);
  });
};

export function pauseCatLowPriority() {
  lowPriorityPauseCount += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lowPriorityPauseCount = Math.max(0, lowPriorityPauseCount - 1);
    if (lowPriorityPauseCount === 0) flushLowPriorityWaiters();
  };
}

export function grantCatLowPrioritySearchTickets(count) {
  const n = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : 0;
  if (n <= 0) return;
  lowPrioritySearchTickets = Math.min(5000, Math.max(0, lowPrioritySearchTickets + n));
}

export async function requestCatSpider({
  apiBase,
  username,
  action,
  spiderApi,
  payload,
  query,
  headers: extraHeaders,
}) {
  const safeAction = typeof action === 'string' ? action.trim() : '';
  const safeSpider = typeof spiderApi === 'string' ? spiderApi.trim() : '';
  const body = payload && typeof payload === 'object' ? payload : {};
  const q = query && typeof query === 'object' ? query : null;
  const extra = extraHeaders && typeof extraHeaders === 'object' ? extraHeaders : null;

  if (!safeAction) throw new Error('action 不能为空');
  if (!safeSpider || !(/^\/spider\/|^\/[a-f0-9]{10}\/spider\//.test(safeSpider))) throw new Error('站点 API 无效');

  if (safeAction === 'search') await waitIfLowPriorityPaused();

  const normalizedBase = normalizeCatPawOpenApiBase(apiBase);
  if (!normalizedBase) throw new Error('CatPawOpen 接口地址未设置');

  const spiderPath = safeSpider.endsWith('/') ? safeSpider.slice(0, -1) : safeSpider;
  const target = new URL(`${spiderPath}/${encodeURIComponent(safeAction)}`, normalizedBase);
  if (q) {
    Object.entries(q).forEach(([k, v]) => {
      const key = typeof k === 'string' ? k.trim() : '';
      if (!key) return;
      if (v == null) return;
      target.searchParams.set(key, String(v));
    });
  }
  const headers = { 'Content-Type': 'application/json', ...(extra ? extra : {}) };

  const resp = await fetch(target.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'omit',
  });
  const status = resp && typeof resp.status === 'number' ? resp.status : 0;
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data && data.message ? String(data.message) : '请求失败';
    const err = new Error(msg);
    err.status = status;
    throw err;
  }
  return data;
}

export async function requestCatPlay({ apiBase, username, payload, query, headers: extraHeaders }) {
  const body = payload && typeof payload === 'object' ? payload : {};
  const q = query && typeof query === 'object' ? query : null;
  const extra = extraHeaders && typeof extraHeaders === 'object' ? extraHeaders : null;

  const normalizedBase = normalizeCatPawOpenApiBase(apiBase);
  if (!normalizedBase) throw new Error('CatPawOpen 接口地址未设置');

  const target = new URL('play', normalizedBase);
  if (q) {
    Object.entries(q).forEach(([k, v]) => {
      const key = typeof k === 'string' ? k.trim() : '';
      if (!key) return;
      if (v == null) return;
      target.searchParams.set(key, String(v));
    });
  }

  const headers = { 'Content-Type': 'application/json', ...(extra ? extra : {}) };
  const u = typeof username === 'string' ? username.trim() : '';
  if (u) headers['X-TV-User'] = u;

  const resp = await fetch(target.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'omit',
  });
  const status = resp && typeof resp.status === 'number' ? resp.status : 0;
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data && data.message ? String(data.message) : '请求失败';
    const err = new Error(msg);
    err.status = status;
    throw err;
  }
  return data;
}
