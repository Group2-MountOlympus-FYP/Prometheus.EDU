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
        dragOrClick: "Click to upload video",
        videoHint: "Only MP4/WebM, max size 300MB.",
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
        dragOrClickToUpload: "Click to upload course picture",
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
        notLoggedIn: 'You are not logged in',
        pleaseLoginToCreateLecture: 'please login',
        loginButton: 'jump to login page',
        notTeacher: "You are not a teacher",
        onlyTeachersCanCreate: "Only teachers can add lecture.",
        loading: 'loading',
        uploadResources: "Upload Resources",
        dragOrClickResources: "Click to upload files",
        resourceHint: "Supports multiple files like PDF, Markdown, and HTML",
        uploadedResources: "Uploaded Resource Files",
        invalidFile: "Invalid resource file format.",
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
        dragOrClick: "点击上传视频",
        videoHint: "仅支持 MP4/WebM，最大 300MB。",
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
        dragOrClickToUpload: "点击上传图片",
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
        notLoggedIn: '未登录',
        pleaseLoginToCreateLecture: '请登录',
        loginButton: '跳转到登录页面',
        notTeacher: "您不是教师用户",
        onlyTeachersCanCreate: "只有教师用户可以添加课时。",
        loading: '加载中...',
        uploadResources: "上传资源文件",
        dragOrClickResources: "拖放或点击上传资源",
        resourceHint: "支持多文件上传，格式包括 PDF、Markdown 和 HTML",
        uploadedResources: "已上传资源文件",
        invalidFile: "无效的资源文件格式。",

    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
