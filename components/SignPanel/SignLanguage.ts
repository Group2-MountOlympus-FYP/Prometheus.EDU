import { getLanguage } from "@/app/language";
import { register } from "module";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome: "Welcome to",
        sitename: "Prometheus.EDU",
        subtitle: 'A Comprehensive Online Education Platform',
        signup: 'Sign Up',
        signin: 'Sign In',
        registerask: 'Don\'t have an account? Click here ',
        loginask: 'Already have an account? Click here ',
      },
      zh: {
        welcome: "欢迎来到",
        sitename: "Prometheus.EDU",
        subtitle: '一个线上教育综合平台',
        signup: '注册',
        signin: '登录',
        registerask: '没有账号？点击这里',
        loginask: '已经有账号了？点击这里',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};