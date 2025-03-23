'use client'
import { Button, Modal } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useDisclosure } from "@mantine/hooks"

interface WritingPostPanelProps {
    opened: boolean;
    onClose: () => void;
}

export function WritingPostPanel({ opened, onClose }: WritingPostPanelProps){
    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <RichTextEditor></RichTextEditor>
            <Button fullWidth radius={"xl"}>Post</Button>
        </Modal>
    )
}