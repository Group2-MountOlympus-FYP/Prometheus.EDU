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
    Box,
    Paper,
} from "@mantine/core";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";
import {IconUpload} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {useRouter, useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {showNotification} from "@mantine/notifications";
import {createLecture} from "@/app/api/Lecture/router";
import {getText} from "@/app/course/[courseId]/add_lecture/component/language";

const LectureCreatePage = () => {
    const router = useRouter();
    const params = useParams();
    const course_id = parseInt(params.courseId);

    const [loading, setLoading] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 用户登录检查
    useEffect(() => {
        fetch("/backend/login/get_session")
            .then(async (res) => {
                if (res.status === 401) {
                    setIsLoggedIn(false);
                    setIsTeacher(false);
                    setIsLoading(false);
                    return;
                }

                const sessionData = await res.json();
                if (sessionData.id === -1) {
                    setIsLoggedIn(false);
                    setIsTeacher(false);
                    setIsLoading(false);
                } else {
                    setIsLoggedIn(true);
                    try {
                        const profileRes = await fetch("/backend/my_profile");
                        const userData = await profileRes.json();
                        setIsTeacher(userData.status === "TEACHER");
                    } catch {
                        setIsTeacher(false);
                    } finally {
                        setIsLoading(false);
                    }
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setIsTeacher(false);
                setIsLoading(false);
            });
    }, []);


    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            video: null,
            resources: [] as File[],
        },
    });

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

    if (isLoading) {
        return (
            <Box
                style={{
                    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text size="lg">{getText("loading") || "Loading..."}</Text>
            </Box>
        );
    }

    if (!isLoggedIn || !isTeacher) {
        return (
            <Box
                style={{
                    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                    minHeight: "100vh",
                    paddingTop: "20px",
                    textAlign: "center",
                }}
            >
                <Container size="md" style={{marginTop: "100px"}}>
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
                            {getText(!isLoggedIn ? "notLoggedIn" : "notTeacher")}
                        </Title>
                        <Text size="lg" mb="lg" ta="center">
                            {getText(!isLoggedIn ? "pleaseLoginToCreateLecture" : "onlyTeachersCanCreate")}
                        </Text>

                        <Button
                            onClick={() => router.push("http://localhost:3000")}
                            size="lg"
                            variant="light"
                            style={{width: "100%"}}
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
            <Container size={false} style={{maxWidth: "1000px", margin: "0 auto"}}>
                <Paper
                    shadow="xl"
                    radius="lg"
                    p="xl"
                    withBorder
                    style={{
                        backgroundColor: "#e7f5ff",
                        width: "200%",
                        maxWidth: "1000px", // 或者 1000px，根据需要调整
                        margin: "0 auto", // 居中显示
                    }}
                >

                    <Title order={2} ta="center" mb="xl" size="2.0rem">
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
                                        if (file.size > 300 * 1024 * 1024) {
                                            showNotification({
                                                title: getText("error"),
                                                message: "视频文件不能超过 300MB",
                                                color: "red",
                                            });
                                            return;
                                        }

                                        form.setFieldValue("video", file);
                                        setVideoPreview(URL.createObjectURL(file));
                                    }}
                                    onReject={(fileRejections) => {
                                        const reason = fileRejections[0]?.errors[0]?.code;
                                        if (reason === "file-too-large") {
                                            showNotification({
                                                title: getText("error"),
                                                message: "The video file cannot exceed 300MB",
                                                color: "red",
                                            });
                                        } else {
                                            showNotification({
                                                title: getText("uploadFailed"),
                                                message: getText("invalidVideoFile"),
                                                color: "red",
                                            });
                                        }
                                    }}
                                    maxSize={300 * 1024 ** 2}
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

                            <Group justify="center" mt={80} style={{width: "100%"}}>
                                <Button type="submit" loading={loading} size="lg">
                                    {getText("createLecture")}
                                </Button>
                            </Group>

                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default LectureCreatePage;
