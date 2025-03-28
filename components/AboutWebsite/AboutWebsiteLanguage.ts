import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome1: "A Comprehensive Online",
        welcome2: "Platform",
        education: "Education",
        item1: "√ NousTube",
        item2: "√ MetisHub",
        item3: "√ AthenaTutor",
        itemIntro1: "provides online video course service for structured learning;",
        itemIntro2: "offers a community forum for peer interaction and support;",
        itemIntro3: "equips an AI-powered chatbot that provides real-time assistance;",
        intro: "We aim to ensure that learners from diverse backgrounds can access high-quality education and support.",
      },
      zh: {
        welcome1: "综合在线",
        welcome2: "平台",
        education: "教育",
        item1: "√ NousTube",
        item2: "√ MetisHub",
        item3: "√ AthenaTutor",
        itemIntro1: "为结构化学习提供在线视频课程服务;",
        itemIntro2: "为同伴互动和支持提供社区论坛;",
        itemIntro3: "配备由人工智能驱动的聊天机器人，提供实时帮助；",
        intro: "我们致力于确保来自不同背景的学习者能够获得高质量的教育和支持。",        
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
