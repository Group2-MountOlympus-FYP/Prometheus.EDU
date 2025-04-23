"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  Textarea,
  Select,
  Stack,
  Group,
  Paper,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { createCourse } from "@/app/api/Course/router";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { getText } from "@/app/course/create/component/language";

const CourseCreate: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 登录状态

  const form = useForm({
    initialValues: {
      course_name: "",
      description: "",
      level: "LEVEL_1",
      status: "NORMAL",
      institution: "No institution",
      main_picture: null,
      category: "Others",
    },
  });

  useEffect(() => {
    fetch("/backend/login/get_session")
      .then(async (res) => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();
        if (data.id === -1) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const courseLevelOptions = [
    { value: "LEVEL_1", label: "LEVEL_1" },
    { value: "LEVEL_2", label: "LEVEL_2" },
    { value: "LEVEL_3", label: "LEVEL_3" },
    { value: "LEVEL_4", label: "LEVEL_4" },
    { value: "LEVEL_5", label: "LEVEL_5" },
  ];

  const courseStatusOptions = [
    { value: "NORMAL", label: "NORMAL" },
    { value: "DELETED", label: "DELETED" },
    { value: "VIP", label: "VIP" },
  ];

  const categoryOptions = [
    { value: "CS", label: getText("cs") },
    { value: "Math", label: getText("math") },
    { value: "Sport", label: getText("sport") },
    { value: "Life", label: getText("life") },
    { value: "Art", label: getText("art") },
    { value: "Language", label: getText("language") },
    { value: "Others", label: getText("others") },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("course_name", form.values.course_name);
      formData.append("description", form.values.description);
      formData.append("level", form.values.level);
      formData.append("status", form.values.status);
      formData.append("institution", form.values.institution);
      formData.append("category", form.values.category);
      if (form.values.main_picture) {
        formData.append("main_picture", form.values.main_picture);
      }

      const data = await createCourse(formData);

      showNotification({
        title: getText("success"),
        message: `${getText("courseCreated")} ID: ${data.id}`,
        color: "green",
      });
      router.push(`/course/${data.id}`);
    } catch (error: any) {
      showNotification({
        title: getText("error"),
        message: error.message || getText("courseCreateFailed"),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Box
        style={{
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          minHeight: "100vh",
          paddingTop: "20px",
          textAlign: "center",
        }}
      >
        <Container size="md" style={{ marginTop: "100px" }}>
          <Paper
            shadow="xl"
            radius="lg"
            p="xl"
            withBorder
            style={{
              backgroundColor: "#f8f9fa",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Title order={2} ta="center" mb="xl" size="2.0rem">
              {getText("notLoggedIn")}
            </Title>
            <Text size="lg" mb="lg" ta="center">
              {getText("pleaseLoginToCreateCourse")}
            </Text>

            <Button
              onClick={() => router.push("http://localhost:3000")}
              size="lg"
              variant="light"
              style={{ width: "100%" }}
            >
              {getText("loginButton")}
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <Container size={false} style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          withBorder
          style={{
            backgroundColor: "#e7f5ff",
            width: "200%",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <Title order={2} ta="center" mb="lg" style={{ fontSize: "2.0rem" }}>
            {getText("addNewCourse")}
          </Title>

          <Text size="lg" mt="xs" mb="xl" ta="center" c="dimmed">
            {getText("fillCourseInfo")}
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack spacing="xl">
              <TextInput
                label={getText("courseName")}
                placeholder={getText("enterCourseName")}
                size="md"
                radius="md"
                {...form.getInputProps("course_name")}
                required
              />

              <div>
                <Text fw={600} mb="sm">
                  {getText("uploadCoursePicture")}
                </Text>
                <Dropzone
                  onDrop={(files) => {
                    const file = files[0];
                    form.setFieldValue("main_picture", file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                  onReject={() =>
                    showNotification({
                      title: getText("uploadFailed"),
                      message: getText("invalidImageFile"),
                      color: "red",
                    })
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  style={{
                    backgroundColor: "#f1f3f5",
                    borderRadius: "12px",
                    padding: "2rem",
                    border: "2px dashed #ced4da",
                  }}
                >
                  <Group justify="center" style={{ pointerEvents: "none" }}>
                    <IconUpload size={60} stroke={1.5} />
                    <div>
                      <Text size="md" ta="center">
                        {getText("dragOrClickToUpload")}
                      </Text>
                      <Text size="xs" c="dimmed" ta="center" mt={4}>
                        {getText("imageFileNote")}
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    style={{
                      maxWidth: "100%",
                      marginTop: 16,
                      borderRadius: "12px",
                    }}
                  />
                )}
              </div>

              <Textarea
                label={getText("description")}
                placeholder={getText("enterCourseDescription")}
                autosize
                minRows={3}
                size="md"
                radius="md"
                {...form.getInputProps("description")}
                required
              />

              <Select
                label={getText("courseLevel")}
                placeholder={getText("selectCourseLevel")}
                data={courseLevelOptions}
                size="md"
                radius="md"
                {...form.getInputProps("level")}
                required
              />

              <Select
                label={getText("courseStatus")}
                placeholder={getText("selectCourseStatus")}
                data={courseStatusOptions}
                size="md"
                radius="md"
                {...form.getInputProps("status")}
                required
              />

              <Select
                label={getText("courseCategory")}
                placeholder={getText("selectCourseCategory")}
                data={categoryOptions}
                size="md"
                radius="md"
                {...form.getInputProps("category")}
                required
              />

              <Group justify="center" mt="xl">
                <Button
                  type="submit"
                  size="md"
                  radius="xl"
                  loading={loading}
                  style={{
                    background: "linear-gradient(90deg, #4dabf7, #228be6)",
                  }}
                >
                  {getText("createCourse")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CourseCreate;
