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
    return language as Language
  }
  //console.error('language wrong!')
  return 'en' 
}
