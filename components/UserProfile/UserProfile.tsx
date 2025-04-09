'use client'

import { useState } from "react"
import { Anchor, Avatar, Button, Card, Group, Text, Grid, GridCol, Container, Tabs, Modal, FloatingIndicator } from "@mantine/core"
import { UpdateUserInfoPanel } from "./UpdateUserInfo/UpdateUserInfo";
import style from './UserProfile.module.css'
import { useDisclosure } from "@mantine/hooks";

interface userDataProps{
    username: string,
    birthDate: string,
    gender: string,
    avatar: string,
}

export function UserProfile(props:userDataProps){
    const [opened, {open, close}] = useDisclosure()

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };
    const [value, setValue] = useState<string | null>('1');
    
    return (
        <Card withBorder radius={"md"} padding={"lg"} className={style.card}>
            <Grid>
                <Grid.Col span={6} className={style.centered}>
                    <div className={style.textDiv}>
                        <Text className={style.text}><strong>Username: </strong>{props.username}</Text>
                        <Text className={style.text}><strong>Gender: </strong>{props.gender}</Text>
                        <Text className={style.text}><strong>birthDate: </strong>{props.birthDate}</Text>
                        <Text className={style.text}><strong>identity: </strong><span style={{color:'#777CB9'}}>Student</span></Text>
                    </div>
                    <Group className={style.centered} style={{"marginBottom": '8vh'}}>
                        <Button style={{backgroundColor:'#777CB9'}} onClick={open}>Edit</Button>
                        <Anchor component="button" type="button" style={{color:'#309AA8'}}>Change password</Anchor>
                    </Group>
                </Grid.Col>
                <Grid.Col span={6} style={{margin:'auto', display:'flex', justifyContent: 'flex-end'}}>
                    <div className={style.avatarRing}>
                        <Avatar src={props.avatar} size={180} className={style.avatar}></Avatar>
                    </div> 
                </Grid.Col>
            </Grid>
            <Container className={style.tabBar}>
                <div style={{display:'flex'}}>
                    <Tabs value={value} onChange={setValue}
                    style={{
                        '--tabs-list-line-bottom': '0',
                        '--tabs-list-line-top': 'unset',
                        '--tabs-list-line-start': 'unset',
                        '--tabs-list-line-size': '0px',
                      } as React.CSSProperties}
                      >
                        <Tabs.List ref={setRootRef} className={style.tabList}>
                            <Tabs.Tab value="1" ref={setControlRef('1')} className={style.tab}>
                                My Course
                            </Tabs.Tab>
                            <Tabs.Tab value="2" ref={setControlRef('2')} className={style.tab}>
                                Posts
                            </Tabs.Tab>
                            <Tabs.Tab value="3" ref={setControlRef('3')} className={style.tab}>
                                Comments
                            </Tabs.Tab>

                            <FloatingIndicator
                            target={value ? controlsRefs[value] : null}
                            parent={rootRef}
                            className={style.indicator}
                            />
                        </Tabs.List>
                    </Tabs>
                </div>
            </Container>
            <Modal opened={opened} onClose={close} centered title={"update profile"}>
                <UpdateUserInfoPanel></UpdateUserInfoPanel>
            </Modal>
        </Card>
    )
}