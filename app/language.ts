// src/language.ts
type Language = 'en' | 'zh';

let currentLanguage: Language = 'en'; // 默认语言设置为 'en'

// 通过函数获取当前语言
export const initializeLanguage = () => {
  // 确保只在浏览器环境中访问 localStorage
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      currentLanguage = savedLanguage;
    }
  }
};

// 切换语言并保存到 localStorage
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') { // 确保运行在客户端上
    localStorage.setItem('language', lang); // 将选择的语言存储到 localStorage
  }
};

// 获取当前语言
export const getLanguage = (): Language => currentLanguage;
