import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        
      },
      zh: {
        
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
