// src/language.ts
type Language = 'en' | 'zh';

// 从 localStorage 获取当前语言，如果没有则默认为 'en'
let currentLanguage: Language = (localStorage.getItem('language') as Language) || 'en';

// 切换语言并保存到 localStorage
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem('language', lang); // 将选择的语言存储到 localStorage
};

// 获取当前语言
export const getLanguage = (): Language => currentLanguage;
