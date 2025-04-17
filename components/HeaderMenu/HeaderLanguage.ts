import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        athena: "AthenaTutor",
        message: "Message",
        myCourses: "My Courses",
        login: "Log in",
        profile: "My Profile",
        logout: "Log out",
      },
    zh: {
        athena: "AthenaTutor",
        message: "消息",
        myCourses: "我的课程",
        login: "登录",
        profile: "我的账户",
        logout: "登出",
    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};