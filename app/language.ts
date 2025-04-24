// src/language.ts
import { getLocalStorage, setLocalStorage } from "./api/General";

type Language = 'en' | 'zh';

let currentLanguage: Language = 'en'; // 默认语言设置为 'en'

export function setLanguage(lang: Language){
  currentLanguage = lang;
  setLocalStorage('language' , lang)
}

export function getLanguage():Language{
  const language = getLocalStorage('language')
  if(language !== null){
    //console.log(language)
    return language as Language
  }
  //console.error('language wrong!')
  return 'en' 
}


type Translations = {
  [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
  en: {
      categories: "Categories",
      recommended: "Recommended",
      computerScience: 'Computer Science',
      math: 'Math',
      sports: 'Sports',
      life: 'Life',
      art: 'Art',
      language: 'Language',
      others: 'Others'
    },
  zh: {
      categories: "课程分类",
      recommended: "推荐",
      computerScience: '计算机科学',
      math: '数学',
      sports: '运动',
      life: '生活',
      art: '艺术',
      language: '语言',
      others: '其他'
  },
}

export const getText = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};