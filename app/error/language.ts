import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        youAreNotLogin: 'You are not logged in',
        loginFirst: 'Please login first',
        goToLogin: 'Go To Homepage',
      },
    zh: {
        youAreNotLogin: '您尚未登录',
        loginFirst: '请先登录后再访问此页面。',
        goToLogin: '去主页登录',
    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
