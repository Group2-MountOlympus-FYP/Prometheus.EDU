"use client";

import {
    Title,
    Container,
    Text,
    TextInput,
    Textarea,
    Button,
    Group,
    Stack,
    FileInput,
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE, MIME_TYPES} from "@mantine/dropzone";
import {IconUpload} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {showNotification} from "@mantine/notifications";
import {createLecture} from "@/app/api/Lecture/router";
import {useParams} from 'next/navigation';

const LectureCreatePage = () => {
    const router = useRouter();
    const params = useParams();
    const course_id = parseInt(params.courseId);
    console.log("params:", params);

    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            video: null,
            resources: [] as File[],
        },
    });

    const [loading, setLoading] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.values.video) {
            showNotification({
                title: "Error",
                message: "Please upload a video for the lecture.",
                color: "red",
            });
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", form.values.name);
            formData.append("description", form.values.description);
            if (form.values.video) {
                formData.append("video", form.values.video);
            }
            form.values.resources.forEach((file) => {
                formData.append("resources", file);
            });

            const data = await createLecture(course_id, formData);

            showNotification({
                title: "Lecture Created",
                message: `Lecture ID: ${data.id}`,
                color: "green",
            });

            router.push(`/video/${data.id}`);
        } catch (error: any) {
            showNotification({
                title: "Error",
                message: error.message || "Failed to create lecture",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm" mt={200}>
            <Title order={2} ta="center" mb="xl" size="2.5rem">
                Add New Lecture
            </Title>
            <Text size="lg" mb="lg" ta="center">
                Please fill in the information below to create a new lecture.
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack spacing={40}>
                    <TextInput
                        label="Lecture Name"
                        size="lg"
                        withAsterisk
                        {...form.getInputProps("name")}
                        mt="xl"
                    />

                    <Textarea
                        label="Lecture Description"
                        size="lg"
                        autosize
                        minRows={4}
                        withAsterisk
                        {...form.getInputProps("description")}
                        mt="xl"
                    />

                    <div>
                        <Text fw={500} mt={30} mb={20}>
                            Upload Lecture Video
                        </Text>
                        <Dropzone
                            onDrop={(files) => {
                                const file = files[0];
                                form.setFieldValue("video", file);
                                setVideoPreview(URL.createObjectURL(file));
                            }}
                            onReject={() =>
                                showNotification({
                                    title: "Upload failed",
                                    message: "Please upload a valid video file.",
                                    color: "red",
                                })
                            }
                            maxSize={500 * 1024 ** 2}
                            accept={[MIME_TYPES.mp4, MIME_TYPES.webm]}
                            style={{backgroundColor: "#f1f3f5", borderRadius: 8}}
                        >
                            <Group justify="center" mih={120} style={{pointerEvents: "none"}}>
                                <IconUpload size={40} stroke={1.5}/>
                                <div>
                                    <Text size="lg" inline>
                                        Drag video here or click to upload
                                    </Text>
                                    <Text size="sm" c="dimmed" mt={7}>
                                        Only MP4/WebM, max size 500MB.
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>

                        {videoPreview && (
                            <video
                                controls
                                src={videoPreview}
                                style={{maxWidth: "100%", marginTop: 16, borderRadius: 8}}
                            />
                        )}
                    </div>

                    <Group position="center" mt={80}>
                        <Button type="submit" loading={loading} size="lg">
                            Create Lecture
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Container>
    );
};

export default LectureCreatePage;
