import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        welcome: "Sign Up",
        username: "Username",
        user_exit: 'Username Already Exist!',
        password: 'Password',
        password_hint: 'The password can contain only letters, digits, and special characters.',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        birthday: 'Birthday',
        already_have_account: 'Already have account?',
        submit: 'Submit',
        protocol: 'I have read and agree to the Privacy Policy and',
        protocol_name: 'User Agreement',
        signAsTeacher: 'Register as a teacher',
        teacherPasswordTitle: 'Please input password given by institute to register as teacher',
        teacherPasswordWrong: 'Wrong password!',
        inputInstitute: 'Institution',
      },
      zh: {
        welcome: "注册",
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
        protocol: '我已阅读并同意',
        protocol_name: '《隐私政策与用户协议》',
        signAsTeacher: '注册为老师',
        teacherPasswordTitle: '请输入机构给出的密码来注册为老师',
        teacherPasswordWrong: '密码错误！',
        inputInstitute: '机构',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
