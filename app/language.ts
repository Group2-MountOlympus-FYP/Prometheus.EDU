type Language = 'en' | 'zh';

let currentLanguage: Language = 'en'; // 默认语言为英文

// 切换语言
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

// 获取当前语言
export const getLanguage = (): Language => currentLanguage;
