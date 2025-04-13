import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        UsernameExist: 'Username is already exist!',
        uploadFileFail: 'Upload File Fail!',
        DropFileToUpload: 'Drop file to upload avatar',
        ConfirmAvatarChange: 'Confirm avatar change',
        male: 'male',
        female: 'female',
        other: 'other',
        gender: 'Gender',
        PleaseSelectGender: 'Please select your gender',    
        username: 'Username',   
        birthdate: 'Birthdate', 
        submit: 'Submit',
        identity: 'Identity',
        edit: 'Edit',
        ChangePassword: 'Change password',
        myCourse: 'My Course',
        posts: 'Posts',
        comments: 'Comments',
        updateProfile: 'Update Profile',
        changeAvatar: 'Change Avatar',
      },
      zh: {
        UsernameExist: '用户名已存在！',
        uploadFileFail: '上传文件失败！',
        DropFileToUpload: '拖拽或点击上传头像',
        ConfirmAvatarChange: '确认修改头像',
        male: '男',
        female: '女',
        other: '其他',
        gender: '性别',
        PleaseSelectGender: '请选择您的性别',
        username: '用户名',   
        birthdate: '生日', 
        submit: '提交',
        identity: '身份',
        edit: '编辑',
        ChangePassword: '修改密码',
        myCourse: '我的课程',
        posts: '我的帖子',
        comments: '我的评论',
        updateProfile: '修改信息',
        changeAvatar: '修改头像',
      },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};