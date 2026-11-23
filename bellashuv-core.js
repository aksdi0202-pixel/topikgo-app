// Bellashuv: umumiy sozlamalar va yordamchi funksiyalar.
// Firebase loyihangizdan olingan qiymatlarni shu yerga qo'ying.
const BELL_CONFIG = {
  apiKey: "KODINGIZ",
  databaseURL: "https://KODINGIZ-default-rtdb.firebaseio.com",
  projectId: "KODINGIZ"
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
