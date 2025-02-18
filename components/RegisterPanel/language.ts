import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome: "Welcom To Doner",
        username: "Username",
        user_exit: 'Username Already Exist!',
        password: 'Password',
        password_hint: 'The password can contain only letters, digits, and special characters.',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        other: 'other',
        birthday: 'Birthday',
        already_have_account: 'Already have account?',
        submit: 'Submit',
      },
      zh: {
        welcome: "欢迎来到Doner",
        username: "用户名",
        user_exit: '用户名已存在！',
        password: '密码',
        password_hint: '密码只能包含字母、数字和特殊字符。',
        gender: '性别',
        male: '男',
        female: '女',
        other: '其他',
        birthday: '生日',
        already_have_account: '已有账户？',
        submit: '提交',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
