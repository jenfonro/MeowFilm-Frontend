export const normalizeRawNameForCompare = (value) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

export const buildEpisodeMatchKey = (displayName, rawName) => {
  const name = normalizeRawNameForCompare(displayName);
  const raw = normalizeRawNameForCompare(rawName);
  if (!name && !raw) return '';
  return `${name}||${raw}`.trim();
};

export const panMockProviderFromFlag = (flag) => {
  const s = typeof flag === 'string' ? flag.trim() : '';
  if (!s) return '';
  // pan_mock routing must use fixed flag recognition and must NOT depend on user-config aliases.
  if (!s.includes('-')) return '';
  const head = String((s.split('-')[0] || '')).trim();
  if (!head) return '';
  if (head.includes('百度')) return 'baidu';
  if (head.includes('夸父')) return 'quark';
  if (head.includes('优夕')) return 'uc';
  if (head.includes('天意')) return '189';
  if (head.includes('逸动')) return '139';
  return '';
};

export const guessPreferredPanFromFlag = (flag) => {
  const raw = typeof flag === 'string' ? flag.trim() : '';
  if (!raw) return '';
  if (raw.includes('百度')) return 'baidu';
  if (raw.includes('夸父')) return 'quark';
  return '';
};

export const parseMockPasscodeFromRawName = (rawName) => {
  let t = typeof rawName === 'string' ? rawName.trim() : '';
  if (!t) return '';
  if (t.toLowerCase().endsWith('.mp4')) t = t.slice(0, -4);
  t = String(t || '').trim();
  if (!t || t.toLowerCase() === 'nopass') return '';
  return t;
};

export const extractTianyiShareCodeAndAccessCode = (flag, rawName) => {
  const label = typeof flag === 'string' ? flag.trim() : '';
  const normalizeTianyiPass = (raw) => {
    let t = typeof raw === 'string' ? raw.trim() : '';
    if (!t) return '';
    const lower = t.toLowerCase();
    if (lower.endsWith('-nopass')) t = t.slice(0, -7);
    else if (lower.endsWith('_nopass')) t = t.slice(0, -7);
    return t.trim();
  };
  const pass = normalizeTianyiPass(parseMockPasscodeFromRawName(rawName));
  let shareCode = '';
  let accessCode = '';
  if (label) {
    const m = /(?:天意|天翼)-([A-Za-z0-9]{6,64})/.exec(label);
    if (m && m[1]) shareCode = String(m[1]).trim();
  }
  if (!pass) return { shareCode, accessCode };
  if (pass.includes('_')) {
    const seg = pass.split('_', 2);
    if (!shareCode && seg[0] && String(seg[0]).trim()) shareCode = String(seg[0]).trim();
    if (seg.length === 2) accessCode = String(seg[1] || '').trim();
  } else if (pass.includes('-')) {
    const seg = pass.split('-', 2);
    if (!shareCode && seg[0] && String(seg[0]).trim()) shareCode = String(seg[0]).trim();
    if (seg.length === 2) accessCode = String(seg[1] || '').trim();
  } else {
    if (!shareCode && /^(?:[A-Za-z0-9]{6,64})$/.test(pass)) {
      shareCode = pass;
    } else {
      accessCode = pass;
    }
  }
  if (accessCode.toLowerCase() === 'nopass') accessCode = '';
  return { shareCode, accessCode };
};

export const scoreEpisodeDisplayName = (textRaw, titleLower) => {
  const text = typeof textRaw === 'string' ? textRaw.trim() : '';
  if (!text) return -999;
  const lower = text.toLowerCase();
  let score = 0;
  if (/(?:ep|episode|e)\s*\d{1,5}/i.test(text) || /第\s*\d+\s*集/.test(text)) score += 5;
  if (/S\s*\d{1,2}/i.test(text) || /第\s*\d+\s*季/.test(text)) score += 4;
  if (/(2160p|4k|1080p|720p)/i.test(text)) score += 2;
  if (titleLower && lower.includes(titleLower)) score += 2;
  if (text.length < 6) score -= 3;
  if (/^[0-9]+$/.test(text) && text.length >= 10) score -= 5;
  if (/^[a-z0-9]+$/i.test(text) && text.length >= 24) score -= 5;
  if (/\.(mkv|mp4|avi|flv|mov|wmv|m4v)$/i.test(text)) score += 1;
  return score;
};
