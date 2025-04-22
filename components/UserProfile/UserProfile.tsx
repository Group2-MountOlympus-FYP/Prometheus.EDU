'use client'

import { useState } from "react"
import { Anchor, Avatar, Button, Card, Group, Text, Grid, Container, Tabs, Modal, FloatingIndicator, Skeleton } from "@mantine/core"
import { UpdateUserInfoPanel } from "./UpdateUserInfo/UpdateUserInfo";
import style from './UserProfile.module.css'
import { useDisclosure } from "@mantine/hooks";
import { UpdateAvatar } from "./UpdateUserInfo/UpdateAvatar";
import { getText } from "./Language";
import { ChangePasswordPanel } from "@/app/Profile/Components/ChangePassword";

interface userDataProps{
    username: string,
    birthDate: string,
    gender: string,
    avatar: string,
    tabsValue: string | null,
    onTabsChange: (value: string | null) => void,
    isLoading: boolean,
}

export function UserProfile(props:userDataProps){
    const [opened, {open, close}] = useDisclosure()
    const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false)
    const [avatarChangeOpen, {open: openAvatarChange, close: closeAvatarChange}] = useDisclosure()

    const [passwordChangeOpened, {open:passwordChangeOpen, close:passwordChangeClose}] = useDisclosure()

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };
    
    
    return (
        <Card withBorder radius={"md"} padding={"lg"} className={style.card}>
            {
                !props.isLoading ? 
            <Grid>
                <Grid.Col span={6} className={style.centered}>
                    <div className={style.textDiv}>
                        <Text className={style.text}><strong>{getText('username')}: </strong>{props.username}</Text>
                        <Text className={style.text}><strong>{getText('gender')}: </strong>{props.gender}</Text>
                        <Text className={style.text}><strong>{getText('birthdate')}: </strong>{props.birthDate}</Text>
                        <Text className={style.text}><strong>{getText("identity")}: </strong><span style={{color:'#777CB9'}}>Student</span></Text>
                    </div>
                    <Group className={style.centered} style={{"marginBottom": '5.5vh'}}>
                        <Button style={{backgroundColor:'#777CB9'}} onClick={open}>{getText('edit')}</Button>
                        <Anchor component="button" type="button" style={{color:'#309AA8',cursor:'pointer'}} onClick={passwordChangeOpen}>{getText("ChangePassword")}</Anchor>
                    </Group>
                </Grid.Col>
                <Grid.Col span={6} style={{margin:'auto', display:'flex', justifyContent: 'flex-end'}}>
                    <div className={style.avatarRing}>
                        <div className={`${style.overlay} ${isMouseOnAvatar ? style.overlayVisible : ''}`}>Change Avatar</div>
                        <Avatar src={props.avatar} size={180} className={style.avatar}
                            onMouseEnter={() => setIsMouseOnAvatar(true)}
                            onMouseLeave={() => setIsMouseOnAvatar(false)}
                            onClick={openAvatarChange}
                        ></Avatar>
                    </div> 
                </Grid.Col>
            </Grid> 
            :
            <div>
                <Grid>
                    <Grid.Col span={6} style={{marginBottom:'20px'}}>
                        <Skeleton height={30} width="100%" mt={10} radius="xl"></Skeleton>
                        <Skeleton height={30} width="100%" mt={10} radius="xl"></Skeleton>
                        <Skeleton height={30} width="100%" mt={10} radius="xl"></Skeleton>
                        <Skeleton height={30} width="100%" mt={10} radius="xl"></Skeleton>
                        <Skeleton height={30} width="100%" mt={10} radius="xl"></Skeleton>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Skeleton height={100} width="100%" style={{margin:'auto'}} circle></Skeleton>
                    </Grid.Col>
                </Grid>
            </div>
            }
            <Container className={style.tabBar}>
                <div style={{display:'flex'}}>
                    <Tabs value={props.tabsValue} onChange={props.onTabsChange}
                    style={{
                        '--tabs-list-line-bottom': '0',
                        '--tabs-list-line-top': 'unset',
                        '--tabs-list-line-start': 'unset',
                        '--tabs-list-line-size': '0px',
                      } as React.CSSProperties}
                      >
                        <Tabs.List ref={setRootRef} className={style.tabList}>
                            <Tabs.Tab value="1" ref={setControlRef('1')} className={style.tab}>
                                {getText("myCourse")}
                            </Tabs.Tab>
                            <Tabs.Tab value="2" ref={setControlRef('2')} className={style.tab}>
                                {getText("posts")}
                            </Tabs.Tab>
                            

                            <FloatingIndicator
                            target={props.tabsValue ? controlsRefs[props.tabsValue] : null}
                            parent={rootRef}
                            className={style.indicator}
                            />
                        </Tabs.List>
                    </Tabs>
                </div>
            </Container>
            <Modal opened={opened} onClose={close} centered title={getText('updateProfile')}>
                <UpdateUserInfoPanel currentUsername={props.username}></UpdateUserInfoPanel>
            </Modal>
            <Modal opened={avatarChangeOpen} onClose={closeAvatarChange} centered title={getText('changeAvatar')}>
                <UpdateAvatar></UpdateAvatar>
            </Modal>
            <Modal opened={passwordChangeOpened} onClose={passwordChangeClose} title={getText('changePassword')} centered>
                <ChangePasswordPanel></ChangePasswordPanel>
            </Modal>
        </Card>
    )
}