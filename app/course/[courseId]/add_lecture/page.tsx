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
} from "@mantine/core";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";
import {IconUpload} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {useRouter, useParams} from "next/navigation";
import {useState} from "react";
import {showNotification} from "@mantine/notifications";
import {createLecture} from "@/app/api/Lecture/router";
import {getText} from "@/components/CookieConsent/language";

const LectureCreatePage = () => {
    const router = useRouter();
    const params = useParams();
    const course_id = parseInt(params.courseId);

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
                title: getText("error"),
                message: getText("pleaseUploadVideo"),
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
                title: getText("lectureCreated"),
                message: `${getText("lectureID")}: ${data.id}`,
                color: "green",
            });

            router.push(`/video/${data.id}`);
        } catch (error: any) {
            showNotification({
                title: getText("error"),
                message: error.message || getText("createFailed"),
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm" mt={200}>
            <Title order={2} ta="center" mb="xl" size="2.5rem">
                {getText("addNewLecture")}
            </Title>
            <Text size="lg" mb="lg" ta="center">
                {getText("pleaseFillInfo")}
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack spacing={40}>
                    <TextInput
                        label={getText("lectureName")}
                        size="lg"
                        withAsterisk
                        {...form.getInputProps("name")}
                        mt="xl"
                    />

                    <Textarea
                        label={getText("lectureDesc")}
                        size="lg"
                        autosize
                        minRows={4}
                        withAsterisk
                        {...form.getInputProps("description")}
                        mt="xl"
                    />

                    <div>
                        <Text fw={500} mt={30} mb={20}>
                            {getText("uploadVideo")}
                        </Text>
                        <Dropzone
                            onDrop={(files) => {
                                const file = files[0];
                                form.setFieldValue("video", file);
                                setVideoPreview(URL.createObjectURL(file));
                            }}
                            onReject={() =>
                                showNotification({
                                    title: getText("uploadFailed"),
                                    message: getText("invalidVideoFile"),
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
                                        {getText("dragOrClick")}
                                    </Text>
                                    <Text size="sm" c="dimmed" mt={7}>
                                        {getText("videoHint")}
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
                            {getText("createLecture")}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Container>
    );
};

export default LectureCreatePage;
