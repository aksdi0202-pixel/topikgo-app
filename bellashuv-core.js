// Bellashuv: umumiy sozlamalar va yordamchi funksiyalar.
// Firebase loyihangizdan olingan qiymatlarni shu yerga qo'ying.
const BELL_CONFIG = {
  apiKey: "AIzaSyBuaSb9rso27Ul3uEIzZR0rp8VUswI8CtI",
  databaseURL: "https://bellashuv-a7b16-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bellashuv-a7b16"
};

const BELL = {
  AVATARS: ["🐯", "🐻", "🐰", "🦊", "🐼", "🐸", "🐵", "🐧", "🦁", "🐨", "🐶", "🐱", "🦄", "🐙", "🦉", "🐢"],

  LEVELS: {
    1: { name: "Boshlang'ich", opts: 4, tiles: 8,  typed: false },
    2: { name: "O'rta",        opts: 6, tiles: 12, typed: false },
    3: { name: "Yuqori",       opts: 8, tiles: 0,  typed: true  }
  },

  configured() { return BELL_CONFIG.apiKey !== "KODINGIZ"; },

  init() {
    if (!this.configured()) throw new Error("Firebase sozlamasi (bellashuv-core.js) hali kiritilmagan");
    if (!firebase.apps.length) firebase.initializeApp(BELL_CONFIG);
    return firebase.database();
  },

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Tanlangan bo'limlardan so'zlar ro'yxati
  pool(lessons) {
    const out = [];
    (lessons || []).forEach(l => {
      const d = (window.HANJA || {})[l];
      if (d) d.items.forEach(it => out.push({ kor: it[0], uz: it[1], lesson: l }));
    });
    return out;
  },

  // Hamma so'zlar (chalg'ituvchi variantlar uchun zaxira)
  allWords() {
    return this.pool(Object.keys(window.HANJA || {}));
  },

  // Koreyscha so'zni bo'g'inlarga ajratish (har bir belgi bitta bo'g'in)
  syllables(kor) {
    return Array.from(kor.replace(/\s/g, ""));
  },

  randomCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }
};

// Final animatsiya: 1–3-o'rin podiumda (xursand → xafa → yanada xafa), qolganlar pastda yig'laydi
function bellPodium(list) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const style = '<style>' +
    '.bp-row{display:flex;align-items:flex-end;justify-content:center;gap:8px;height:200px;}' +
    '.bp-col{display:flex;flex-direction:column;align-items:center;width:30%;}' +
    '.bp-av{font-size:38px;position:relative;animation:bpIn .6s ease-out both;}' +
    '.bp-face{position:absolute;right:-14px;bottom:-6px;font-size:20px;}' +
    '.bp-name{font-size:13px;font-weight:700;margin:4px 0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
    '.bp-block{width:100%;border-radius:10px 10px 0 0;display:flex;align-items:flex-start;justify-content:center;color:#fff;font-weight:800;font-size:22px;padding-top:6px;transform-origin:bottom;animation:bpRise .8s ease-out both;}' +
    '.bp-1 .bp-block{height:150px;background:#EF9F27;}' +
    '.bp-2 .bp-block{height:110px;background:#7F77DD;animation-delay:.25s;}' +
    '.bp-3 .bp-block{height:80px;background:#9aa3b5;animation-delay:.5s;}' +
    '.bp-1 .bp-av{animation:bpIn .6s ease-out both, bpBounce 1s ease-in-out .8s infinite;}' +
    '.bp-rest{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:14px;}' +
    '.bp-sad{position:relative;font-size:30px;animation:bpIn .6s ease-out both;}' +
    '.bp-sad .bp-face{font-size:16px;}' +
    '.bp-tear{position:absolute;left:50%;top:55%;font-size:12px;animation:bpTear 1.4s ease-in infinite;}' +
    '@keyframes bpRise{from{transform:scaleY(0)}to{transform:scaleY(1)}}' +
    '@keyframes bpIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}' +
    '@keyframes bpBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
    '@keyframes bpTear{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(16px)}}' +
    '</style>';
  const top = list.slice(0, 3);
  const faces = ['😄', '😕', '😞'];
  const col = (p, i) => p ? `<div class="bp-col bp-${i + 1}"><div class="bp-av">${p.avatar}<span class="bp-face">${faces[i]}</span></div><div class="bp-name">${esc(p.name)}</div><div class="bp-block">${i + 1}</div></div>` : '';
  const row = [1, 0, 2].map(i => col(top[i], i)).join('');
  const rest = list.slice(3).map((p, i) =>
    `<div class="bp-sad" style="animation-delay:${(i * 0.1).toFixed(1)}s">${p.avatar}<span class="bp-face">😭</span><span class="bp-tear">💧</span></div>`).join('');
  return style + `<div class="bp-row">${row}</div>` + (rest ? `<div class="bp-rest">${rest}</div>` : '');
}
