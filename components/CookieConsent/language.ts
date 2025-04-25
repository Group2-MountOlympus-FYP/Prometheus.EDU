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
        addNewLecture: "Add New Lecture",
        pleaseFillInfo: "Please fill in the information below to create a new lecture.",
        lectureName: "Lecture Name",
        lectureDesc: "Lecture Description",
        uploadVideo: "Upload Lecture Video",
        uploadFailed: "Upload failed",
        invalidVideoFile: "Please upload a valid video file.",
        dragOrClick: "Drag video here or click to upload",
        videoHint: "Only MP4/WebM, max size 500MB.",
        createLecture: "Create Lecture",
        error: "Error",
        pleaseUploadVideo: "Please upload a video for the lecture.",
        lectureCreated: "Lecture Created",
        lectureID: "Lecture ID",
        createFailed: "Failed to create lecture",
        addNewCourse: "Add New Course",
        fillCourseInfo: "Please fill in the information below to create a new course.",
        courseName: "Course Name",
        enterCourseName: "Enter the course name",
        uploadCoursePicture: "Upload Course Picture",
        invalidImageFile: "Please upload a valid image file.",
        dragOrClickToUpload: "Drag image here or click to upload course picture",
        imageFileNote: "Only image files, max size 5MB.",
        description: "Description",
        enterCourseDescription: "Enter course description",
        courseLevel: "Course Level",
        selectCourseLevel: "Select course level",
        courseStatus: "Course Status",
        selectCourseStatus: "Select course status",
        courseCategory: "Course Category",
        selectCourseCategory: "Select course category",
        createCourse: "Create Course",
        success: "Successful",
        courseCreated: "Course creation success!",
        courseCreateFailed: "Course creation failed.",
        cs: "Computer Science",
        math: "Math",
        sport: "Sport",
        life: "Life",
        art: "Art",
        language: "Language",
        others: "Others",
        
        created: 'Created',
        comment:'Comment',
        cancel: 'Cancel',
        submitComment: 'Submit Comment',
        privacyContent: 'Before using our services or clicking the "Enroll" button, please read and agree to the following User Agreement.\n' +
            'We collect and use the necessary information you provide (including but not limited to your name, email address, and course progress) to deliver our services.\n' +
            'We are committed to not disclosing your personal information to any unauthorized third party.\n' +
            'If you have any questions during your use of the platform, feel free to contact our support team or review the full User Agreement and Privacy Policy.\n' +
            'By continuing to use the platform, you are deemed to have read and agreed to the above terms.'
    },
    zh: {
        cookieDesc: '我们使用 Cookie 来提升用户体验，继续浏览表示您同意我们的',
        privacy: '隐私政策',
        agree: '同意',
        decline: '拒绝',
        addNewLecture: "添加新课时",
        pleaseFillInfo: "请填写以下信息以创建新的课时视频。",
        lectureName: "课时名称",
        lectureDesc: "课时描述",
        uploadVideo: "上传课时视频",
        uploadFailed: "上传失败",
        invalidVideoFile: "请上传有效的视频文件。",
        dragOrClick: "拖动视频到此或点击上传",
        videoHint: "仅支持 MP4/WebM，最大 500MB。",
        createLecture: "创建课时",
        error: "错误",
        pleaseUploadVideo: "请上传课时视频。",
        lectureCreated: "课时已创建",
        lectureID: "课时编号",

        addNewCourse: "添加新课程",
        fillCourseInfo: "请填写以下信息以创建新课程",
        courseName: "课程名称",
        enterCourseName: "请输入课程名称",
        uploadCoursePicture: "上传课程封面",
        invalidImageFile: "请上传有效的图片文件",
        dragOrClickToUpload: "拖动图片到此处或点击上传",
        imageFileNote: "仅支持图片文件，最大 5MB",
        description: "课程简介",
        enterCourseDescription: "请输入课程简介",
        courseLevel: "课程等级",
        selectCourseLevel: "请选择课程等级",
        courseStatus: "课程状态",
        selectCourseStatus: "请选择课程状态",
        courseCategory: "课程类别",
        selectCourseCategory: "请选择课程类别",
        createCourse: "创建课程",
        success: "成功",
        courseCreated: "课程创建成功",
        courseCreateFailed: "课程创建失败",
        cs: "计算机",
        math: "数学",
        sport: "体育",
        life: "生活",
        art: "艺术",
        language: "语言",
        others: "其他",

        created:'创建',
        comment:'评论',
        cancel: '取消',
        submitComment: '提交评论',
        privacyContent: '在您使用本平台服务或点击“报名”按钮之前，' +
            '请您仔细阅读并同意以下用户协议。' +
            '本平台将收集与使用您提供的必要信息' +
            '（包括但不限于姓名、邮箱、课程进度等）' +
            '以提供相关服务。我们承诺不会将您的个人信息泄露给未经授权的第三方。' +
            '使用过程中如您有任何疑问，可随时联系我们的客服或查看完整的《用户协议》和《隐私政策》。' +
            '继续使用即视为您已阅读并同意上述条款。'
    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
