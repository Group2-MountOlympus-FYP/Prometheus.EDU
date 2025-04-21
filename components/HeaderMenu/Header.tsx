'use client'

import { SearchBar } from "../SearchBar/SearchBar"
import { Group, Avatar, Modal, Menu, ScrollArea } from "@mantine/core"
import classes from './Header.module.css'
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher"
import { getText } from './HeaderLanguage'
import { SignPanel } from "../SignPanel/SignPanel"
import { MessagePanel } from "../MessagePanel/MessagePanel"
import { useState, useEffect, useContext } from "react"
import { getUserInfo, reloadWindow } from "@/app/api/General"
import { LoadingContext } from "../Contexts/LoadingContext"
import { SessionContext } from "../Contexts/SessionContext"
import { useRouter } from 'next/navigation'
import { Logout } from "@/app/api/Login/router"
import { useDisclosure } from "@mantine/hooks"

type headerProps = {
    onLoginClick?: () => void
}

const links = [
    // { link: '/', label: 'Homepage' },
    { link: '/athena_chat', label: getText('athena') },
    { link: '/MyCourses', label: getText('myCourses') },
    // { link: '/', label: 'Message' }
]

export default function Header() {
    const { isLoading, setIsLoading } = useContext(LoadingContext)
    const { isLogin, setIsLogin } = useContext(SessionContext)

    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')
    //const [isLogin, setIsLogin] = useState<boolean>()


    useEffect(() => {
        //加载
        setIsLoading(true)
        //console.log(isLogin)
        const fetchUserInfo = async () => {
            try {
                const userData = getUserInfo()
                if(userData === null){
                    //当userData为null时说明用户没有登陆
                    setIsLogin(false)
                    //停止加载
                    setIsLoading(false)
                    return
                }

                setAvatar(userData.avatar)
                setUsername(userData.username)
                setIsLogin(true)

                setIsLoading(false)
            }catch(error){
                console.log(error)
                setIsLogin(false)
            }
            
            setIsLoading(false)
        }
        fetchUserInfo()
    }, []);

    // 弹出消息弹窗
    const [MsgPanelOpened, {open: msgOpen, close: msgClose}] = useDisclosure();
    const [loginPanelOpened, {open: loginOpen, close: loginClose}] = useDisclosure();

    const router = useRouter();

    // 返回主页
    const goToHomepage = () => {
        router.push('/');
    }

    {/* 进入个人主页 */}
    const goToProfile = () => {
        router.push('/Profile');
    };

    {/* 登出 */}
    const handleLogout = async () =>{
        setIsLogin(false)
        setIsLoading(true)
        try{
            await Logout()
        }catch(error){
            console.log(error)
        }
        setTimeout(() => {
            reloadWindow()
        }, 1000);
    }

    {/* 导航链接 */}
    const items = links.map((link) => (
      <span
        key={link.label}
        className={classes.links}
        onClick={() => router.push(link.link, { scroll: false })}
        style={{ cursor: 'pointer' }}
      >
          {link.label}
      </span>
    ));

    return (
        <div>
        <header className={classes.naviBar} style={{width:"100%"}}>
            <div className={classes.inner}>
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={goToHomepage}>
                    <div className={classes.logoBox}>
                        <img src="/website-logo.png" className={classes.logo}/>
                    </div>
                    <div className={classes.nameBox}>
                        <p className={classes.webName}> Prometheus.EDU</p>
                    </div>
                </div>

                <div style={{ flexGrow: 2, display: "flex", justifyContent: "center" }}>
                    <SearchBar></SearchBar>
                </div>
                <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                    <LanguageSwitcher></LanguageSwitcher>
                </div>
                
                {isLogin ? (
                    <>
                    {/* 登录状态下显示导航链接 */}
                    <Group ml={50} gap={10} visibleFrom="sm" className={classes.links}>
                        {items}
                    </Group>
                    <Group className={classes.links}>
                        <span onClick={msgOpen} style={{ paddingRight: "1.4vw" }}>
                            {getText('message')}
                        </span>
                    </Group>
                    {/* 消息弹窗 */}
                    <div className='message-box'>
                        {MsgPanelOpened && <div className={classes.messageImg}/>}
                        <Modal opened={MsgPanelOpened} onClose={msgClose}
                            title={getText('message')}
                            scrollAreaComponent={ScrollArea.Autosize}
                            centered={false}
                            yOffset={"20vh"}
                            size={"lg"}
                            styles={{
                                header: {
                                    backgroundColor: '#DEE0EF',
                                },
                                title: {
                                    fontSize: '1.5vw',
                                    fontWeight: 'bold',
                                    color: '#3C4077',
                                    textAlign: 'left',
                                    paddingLeft: '3.5vw',
                                },
                                }}
                        >
                            <MessagePanel></MessagePanel>
                        </Modal>
                    </div>

                    {/* 登录状态下显示头像 */}
                    <Group >
                        <Menu zIndex={1001} shadow={"md"}>
                            <Menu.Target>
                                <Avatar src={avatar} style={{ cursor: "pointer" }}></Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item className={classes.select} onClick={goToProfile}>
                                    {getText('profile')}
                                </Menu.Item>
                                <Menu.Item className={classes.select} onClick={handleLogout}>
                                    {getText('logout')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    </>
                    ) : (
                    <Group className={classes.links}>
                        <span onClick={loginOpen}>Login</span>
                    </Group>
                )}
            </div>
            <div style={{height: '0', border: 'none' , borderBottom: '1px solid grey'}}></div>
        </header>

            <Modal opened={loginPanelOpened} onClose={loginClose} centered size={"lg"}>
                <SignPanel></SignPanel>
            </Modal>
            
        </div>
        
    )

}
