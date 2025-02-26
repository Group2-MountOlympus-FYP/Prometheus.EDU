// src/language.ts
import { getLocalStorage, setLocalStorage } from "./api/General";

type Language = 'en' | 'zh';

let currentLanguage: Language = 'en'; // 默认语言设置为 'en'

// 通过函数获取当前语言
export const initializeLanguage = () => {
  // 确保只在浏览器环境中访问 localStorage
  if (typeof window !== 'undefined') {
    const savedLanguage = getLocalStorage('language')
    if (savedLanguage !== null) {
      currentLanguage = savedLanguage as Language;
    }
  }
};

// 切换语言并保存到 localStorage
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  setLocalStorage('language' , lang)
};

// 获取当前语言
export const getLanguage = (): Language => currentLanguage;
