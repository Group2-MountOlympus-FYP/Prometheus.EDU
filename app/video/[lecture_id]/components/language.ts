import { getLanguage } from "@/app/language";

type Translations = {
  [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
  en: {
    cookieDesc: 'We use cookies to enhance your user experience. By continuing to browse, you agree to our',
    privacy: 'Privacy Policy',
    agree: 'Accept',
    decline: 'Decline',
    Lecture_Overview: 'Lecture Overview',
    Loading: 'Loading...',
    Lecture_List: 'Lecture List',
    Lecture_time: 'Lecture Time',
    No_lecture: 'No other lectures available for this course.',
    Lecture_name: 'Lecture Name',
    Lecture_date: 'Lecture Date',
    Lecture_404: ' 404 Not Found',
    Lecture_exist: 'The lecture does not exist or has been deleted',
    posts: 'Posts',
    materials: 'Materials',
    assignments: 'Assignments',
    write_post: 'Open to Write Post',
    Course_Materials: "Course Materials",
    No_materials: "No materials available for this lecture.",
    write_assignment: 'Open to Release Assignment',
    post_success: 'Post Sent Successfully',
    course_lecturers: ' Provided By',
  },
  zh: {
    course_lecturers: '课程提供者',
    Lecture_Overview: '课时概览',
    Loading: '加载中...',
    Lecture_List: '课时列表',
    Lecture_time: '课时时间',
    No_lecture: '该课程暂无其它课时',
    Lecture_name: '课时名称',
    Lecture_date: '课时日期',
    Lecture_404: ' 404 ',
    Lecture_exist: '课时不存在或已被删除',
    posts: '帖子',
    materials: '课时材料',
    assignments: '作业',
    write_post: '发布帖子',
    write_assignment: '发布作业',
    Course_Materials: "课程资料",
    No_materials: "该课程暂无资料",
    post_success: '发布成功',
  },
}

export const getText = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
