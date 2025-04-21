"use client";
import React, {useState} from "react";
import {
    Container,
    Title,
    Text,
    Button,
    TextInput,
    Textarea,
    FileInput,
    Select,
    Stack,
    Group,
    rem,
    Center,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {createCourse} from "@/app/api/Course/router";
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {IconUpload, IconPhoto, IconX} from '@tabler/icons-react';

const CourseCreate: React.FC = () => {
    const router = useRouter();
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

    const [loading, setLoading] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const courseLevelOptions = [
        {value: "LEVEL_1", label: "LEVEL_1"},
        {value: "LEVEL_2", label: "LEVEL_2"},
        {value: "LEVEL_3", label: "LEVEL_3"},
        {value: "LEVEL_4", label: "LEVEL_4"},
        {value: "LEVEL_5", label: "LEVEL_5"},
    ];

    const courseStatusOptions = [
        {value: "NORMAL", label: "NORMAL"},
        {value: "DELETED", label: "DELETED"},
        {value: "VIP", label: "VIP"},
    ];

    const categoryOptions = [
        {value: "CS", label: "Computer Science"},
        {value: "Math", label: "Math"},
        {value: "Sport", label: "Sport"},
        {value: "Life", label: "Life"},
        {value: "Art", label: "Art"},
        {value: "Language", label: "Language"},
        {value: "Others", label: "Others"},
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
                title: "Successful",
                message: `Course creation success！ID: ${data.id}`,
                color: "green",
            });
            router.push(`/course/${data.id}`);
        } catch (error: any) {
            showNotification({
                title: "Error",
                message: error.message || "An error occurred",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm" mt={200}>
            <Title order={2} ta="center" mb="xl" size="2.5rem">
                Add New Course
            </Title>

            <Text size="xl" mt="md" mb="xl" ta="center">
                Please fill in the information below to create a new course.
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack spacing={40}>

                    <TextInput
                        label="Course Name"
                        placeholder="Enter the course name"
                        size="lg"
                        {...form.getInputProps("course_name")}
                        required
                        mt="xl"
                    />

                    <div>
                        <Text fw={500} mt={30} mb={20}>
                            Upload Course Picture
                        </Text>

                        <Dropzone
                            onDrop={(files) => {
                                const file = files[0];
                                form.setFieldValue("main_picture", file);
                                setImagePreview(URL.createObjectURL(file));
                            }}
                            onReject={() =>
                                showNotification({
                                    title: "Upload failed",
                                    message: "Please upload a valid image file.",
                                    color: "red",
                                })
                            }
                            maxSize={5 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                            style={{backgroundColor: "#f1f3f5", borderRadius: 8}}
                        >
                            <Group justify="center" style={{pointerEvents: "none"}}>
                                <IconUpload size={80} stroke={1.5}/>
                                <div>
                                    <Text size="lg" inline>
                                        Drag image here or click to upload course picture
                                    </Text>
                                    <Text size="sm" c="dimmed" mt={7}>
                                        Only image files, max size 5MB.
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Uploaded preview"
                                style={{maxWidth: "100%", marginTop: 20, borderRadius: 16}}
                            />
                        )}
                    </div>

                    <Textarea
                        label="Description"
                        placeholder="Enter course description"
                        autosize
                        minRows={3}
                        size="lg"
                        {...form.getInputProps("description")}
                        required
                        mt="xl"
                    />

                    <Select
                        label="Course Level"
                        placeholder="Select course level"
                        data={courseLevelOptions}
                        size="lg"
                        {...form.getInputProps("level")}
                        required
                        mt="xl"
                    />

                    <Select
                        label="Course Status"
                        placeholder="Select course status"
                        data={courseStatusOptions}
                        size="lg"
                        {...form.getInputProps("status")}
                        required
                        mt="xl"
                    />

                    <Select
                        label="Course Category"
                        placeholder="Select course category"
                        data={categoryOptions}
                        size="lg"
                        {...form.getInputProps("category")}
                        required
                        mt="xl"
                    />


                    <Group justify="center" mt={80}>
                        <Button type="submit" size="lg" loading={loading}>
                            Create Course
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Container>
    );
};

export default CourseCreate;
