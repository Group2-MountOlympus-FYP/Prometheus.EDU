import { getLanguage } from "@/app/language";

type Translations = {
  [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
  en: {
    Replied_to_you: "replied to you",
    Mentioned_you: "@ you",
    At: "at",
    Untitled_post: "[Untitled Post]",
    Fetch_error: "Failed to fetch notifications",
    Mark_read_error: "Failed to mark notification as read:",
  },
  zh: {
    Replied_to_you: "回复了你",
    Mentioned_you: "@了你",
    At: "于",
    Untitled_post: "[未命名帖子]",
    Fetch_error: "获取通知失败",
    Mark_read_error: "标记通知为已读失败：",
  },
}

export const getText = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
