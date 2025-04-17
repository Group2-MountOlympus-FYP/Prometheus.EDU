import { Button, Group } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { Text, Image, Loader } from '@mantine/core';
import './UpdateUserInfo.css'
import { notifications } from '@mantine/notifications';
import { uploadAvatar } from '@/app/api/User/router';
import { useState, useContext } from 'react';
import { reloadWindow } from '@/app/api/General';
import { getText } from '../Language';
import { LoadingContext } from "@/components/Contexts/LoadingContext";

export function UpdateAvatar(){
    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const [file, setFile] = useState<FileWithPath | null>(null)
    const [url, setURL] = useState<string | null>()
    const [loading, setLoading] = useState<boolean>(false)

    const onUploadAvatar = async () => {
        if(!file){
            return
        }
        try{
            setLoading(true)
            await uploadAvatar(file)
            notifications.show({
                message: 'Avatar uploaded successfully!',
                color: 'green',
            });
            setLoading(false)

            setIsLoading(true)
            setTimeout(() => {
                reloadWindow()
            }, 800);
        }catch(e){
            console.log(e)
        }
    }
    const handleDropImage = (files: FileWithPath[]) => {
        if(files.length === 0){
            notifications.show({
            message: 'No file selected!',
            color: 'red',
            });
            return;
        }
        const file = files[0]
        setFile(file)
        const url = URL.createObjectURL(file)
        setURL(url)
    }
    return (
        <div >
        <Dropzone
            className='dropzone'
            onDrop={handleDropImage}
            onReject={(files) => {notifications.show({
                message: getText("uploadFileFail")
            })}}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                </Dropzone.Reject>
                {
                    !url ? 
                    <Dropzone.Idle>
                        <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                    </Dropzone.Idle> :
                    <Image src={url}></Image>
                }
            </Group>
        </Dropzone>
        <Text style={{width:'100%',textAlign:'center', margin:'10px 0 10px 0'}}>{getText("DropFileToUpload")}</Text>
        <Button 
            color='#777CB9'
            style={{width:'100%'}}
            onClick={onUploadAvatar}>{loading ? <Loader color={'white'} size={12} ></Loader> : getText("ConfirmAvatarChange")}</Button>
        </div>
      );
}