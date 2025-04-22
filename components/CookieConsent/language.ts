import {getLanguage} from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: { [key in 'en' | 'zh']: Translations } = {
    en: {
        cookieDesc: 'We use cookies to enhance your user experience. By continuing to browse, you agree to our',
        privacy: 'Privacy Policy',
        agree: 'Accept',
        decline: 'Decline',
        privacyContent: 'We attach great importance to your privacy. This Privacy Policy aims to explain how we collect, use, store and protect the personal information you provide when using this website (or application). By accessing or using this website, you indicate your agreement to the terms described in this Privacy Policy. The information we may collect includes but is not limited to: your name, email address, IP address, browsing behavior and usage preferences. This information is mainly used to improve services, personalize user experience, and ensure the security of the website. We promise not to sell, exchange or rent your personal information to any third party. Unless it is for legal obligation or necessary to provide services (such as third-party analysis tools), we will not share your data without your consent. For detailed information, please continue to read the following terms. If you have any questions about this policy, please feel free to contact us for assistance.',
        
    },
    zh: {
        cookieDesc: '我们使用 Cookie 来提升用户体验，继续浏览表示您同意我们的',
        privacy: '隐私政策',
        agree: '同意',
        decline: '拒绝',
        privacyContent: '我们非常重视您的隐私。本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本网站（或应用）时提供的个人信息。通过访问或使用本网站，您即表示同意本隐私政策中所述的条款。我们可能收集的信息包括但不限于：您的姓名、电子邮件地址、IP 地址、浏览行为和使用偏好。这些信息主要用于改进服务、个性化用户体验，以及保障网站的安全性。我们承诺不会将您的个人信息出售、交换或出租给第三方。除非出于法律义务，或为提供服务所必需（例如第三方分析工具），我们不会在未征得您同意的情况下共享您的数据。如需了解详细信息，请继续阅读以下各项条款。若您对本政策有任何疑问，欢迎通过 联系我们 获取帮助。',
        
    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
