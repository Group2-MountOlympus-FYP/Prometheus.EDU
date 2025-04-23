import { getLanguage } from "@/app/language";

type Translations = {
  [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
      my_courses: "My Courses",
      create_course: "Create Course",
      enrolled_on: "Enrolled on",
      load_failed: "Failed to load courses",
    },
    zh: {
      my_courses: "我的课程",
      create_course: "创建课程",
      enrolled_on: "报名时间",
      load_failed: "加载课程失败",
    }

}

export const getText = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
