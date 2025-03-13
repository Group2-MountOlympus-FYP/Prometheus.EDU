import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        cookieDesc: 'We use cookies to enhance your user experience. By continuing to browse, you agree to our',
        privacy: 'Privacy Policy',
        agree: 'Accept',
        decline: 'Decline',
      },
      zh: {
        cookieDesc: '我们使用 Cookie 来提升用户体验，继续浏览表示您同意我们的',
        privacy: '隐私政策',
        agree: '同意',
        decline: '拒绝',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
