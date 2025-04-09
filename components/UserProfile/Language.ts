import { getLanguage } from "@/app/language";
import { register } from "module";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        UsernameExist: 'Username is already exist!'
      },
      zh: {
        UsernameExist: '用户名已存在！'
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};