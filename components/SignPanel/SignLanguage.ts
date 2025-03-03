import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome: "Welcome To Prometheus.EDU",
        subtitle: 'add subtitle there',
        signon: 'Sign On',
        signin: 'Sign In',
      },
      zh: {
        welcome: "欢迎来到Prometheus.EDU",
        subittile: '在此添加副标题',
        signon: '登录',
        signin: '注册',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};