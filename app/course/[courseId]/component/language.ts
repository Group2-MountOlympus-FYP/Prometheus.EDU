import { getLanguage } from "@/app/language";

type Translations = {
  [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
  en: {
    no_title: 'No Title',
    no_time: 'Unknown Time',
    course_lecturers: 'Course Instructors',
    unknown_user: 'No lecturers for this course',
    Lecture_Overview: 'Lecture Overview',
    Loading: 'Loading...',
    Lecture_List: 'Lecture List',
    Lecture_time: 'Lecture Time',
    No_lecture: 'No lectures available for this course.',
    Lecture_name: 'Lecture Name',
    Lecture_date: 'Update Time',
    Lecture_404: ' 404 Not Found',
    Lecture_exist: 'The lecture does not exist or has been deleted',
    post: 'Post',
    material: 'Material',
    assignment: 'Assignment',
    write_post: 'Open to write post',
    no_videos: "Course videos will be available soon, stay tuned",
    enrolled: "Enrolled",
    enroll: "Enroll to this Course",
    people_have_enrolled: "people have enrolled",
    enroll_success: "Enrolled successfully!",
    enroll_failed: "Enrollment failed, please try again later.",
    unknown_institution: "No institution available",
    no_rating: 'No rating',
    no_intro: 'No introduction',
    Instructor_List: 'Instructor List',
  },
  zh: {
    no_title: '暂无标题',
    no_time: '暂无时间',
    course_lecturers: '课程讲师',
    unknown_user: '该课程暂无老师',
    Lecture_Overview: '课时概览',
    Loading: '加载中...',
    Lecture_List: '课时列表',
    Lecture_time: '课时时间',
    No_lecture: '该课程暂无其它课时',
    Lecture_name: '课时名称',
    Lecture_date: '课时日期',
    Lecture_404: ' 404 ',
    Lecture_exist: '课时不存在或已被删除',
    no_videos: "课程视频即将上线，敬请期待",
    enrolled: "已报名",
    enroll: "报名课程",
    people_have_enrolled: "人已报名",
    enroll_success: "报名成功！",
    enroll_failed: "报名失败，请稍后再试",
    unknown_institution: "暂无机构",
    no_rating: '没有评分',
    no_intro: '没有介绍',
    Instructor_List: '教师列表',
  },
}

export const getText = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
