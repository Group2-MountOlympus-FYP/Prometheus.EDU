import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome: "Welcome to Prometheus.EDU",
        intro: "A Comprehensive Online Education Platform"
      },
      zh: {
        welcome: "欢迎来到Prometheus.EDU",
        intro: "综合在线教育平台"        
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
