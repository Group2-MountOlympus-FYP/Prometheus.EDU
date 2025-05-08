'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  FileInput,
  NumberInput,
  Select,
  Button,
  Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { updateCourseById, getCourseDetailsById } from '@/app/api/Course/router';

interface Props {
  opened: boolean;
  onClose: () => void;
  courseId: number;
}

export default function CourseUpdateModal({ opened, onClose, courseId }: Props) {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<string>(''); // not number!

  const [status, setStatus] = useState('');
  const [institution, setInstitution] = useState('');
  const [mainPicture, setMainPicture] = useState<File | null>(null);

  // ✅ 自动加载课程详情
  useEffect(() => {
    if (!opened) return;

    (async () => {
      try {
        const data = await getCourseDetailsById(courseId);
        setCourseName(data.course_name || '');
        setDescription(data.description || '');
        setInstitution(data.institution || '');
        setLevel(data.level || '');
        console.log("Fetched level from backend:", data.level);
        setStatus(data.status || '');
      } catch (err) {
        console.error('Failed to load course details:', err);
        notifications.show({
          title: 'Error',
          message: 'Failed to load course info.',
          color: 'red',
        });
      }
    })();
  }, [opened, courseId]);

  // ✅ 提交课程更新
  const handleUpdateCourse = async () => {
    const formData = new FormData();
    formData.append('course_name', courseName);
    formData.append('description', description);
    formData.append('level', level);
    formData.append('status', status);
    formData.append('institution', institution);
    if (mainPicture) {
      formData.append('main_picture', mainPicture);
    }

    try {
      await updateCourseById(courseId, formData);  // ✅ 使用 FormData 提交
      notifications.show({
        title: 'Success',
        message: 'Course updated successfully!',
        color: 'green',
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update course.',
        color: 'red',
      });
    }
  };


  return (
    <Modal opened={opened} onClose={onClose} title="Update Course Info" yOffset="20vh" size="lg" >
      <TextInput
        label="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.currentTarget.value)}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <Select
        label="Level"
        data={[
          { value: 'LEVEL_1', label: 'LEVEL_1' },
          { value: 'LEVEL_2', label: 'LEVEL_2' },
          { value: 'LEVEL_3', label: 'LEVEL_3' },
          { value: 'LEVEL_4', label: 'LEVEL_4' },
          { value: 'LEVEL_5', label: 'LEVEL_5' },
        ]}
        value={level}
        onChange={(val) => setLevel(val ?? '')}
      />
      <Select
        label="Status"
        data={['NORMAL', 'ARCHIVED']}
        value={status}
        onChange={(value) => setStatus(value || '')}
      />



      <Group mt="md">
        <Button variant="default" onClick={onClose}>
          Return
        </Button>
        <Button ml="auto" onClick={handleUpdateCourse}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
}
