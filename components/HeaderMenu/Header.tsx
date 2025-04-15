'use client'

import { SearchBar } from "../SearchBar/SearchBar"
import { Group, Burger, ActionIcon, Avatar, Modal, Menu } from "@mantine/core"
import classes from './Header.module.css'
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher"
import { SignPanel } from "../SignPanel/SignPanel"
import { MessagePanel } from "../MessagePanel/MessagePanel"
import { useState, useEffect } from "react"
import {getLocalStorage, lockOverflow, reloadWindow, setLocalStorage, unlockOverflow} from "@/app/api/General"
import { useRouter } from 'next/navigation'
import {getUserProfile} from "@/app/api/User/router";
import error from "eslint-plugin-react/lib/util/error";
import { IconChevronDown } from "@tabler/icons-react"
import { Logout } from "@/app/api/Login/router"


type headerProps = {
    onLoginClick?: () => void
}

const links = [
    { link: '/', label: 'Homepage' },
    { link: '/athena_chat', label: 'AthenaTutor' },
    { link: '/MyCourses', label: 'My Courses' },
    // { link: '/', label: 'Message' }
]

export default function Header() {
    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')
    const [isLogin, setIsLogin] = useState<boolean>()

    useEffect(() => {
        const fetchUserInfo = async () => {
            if(getLocalStorage("isLogin") === "true"){
                try {
                    const userData = await getUserProfile()
                    setAvatar(userData.avatar)
                    setUsername(userData.username)
                    setIsLogin(true)
                }catch(error){
                    console.log(error)
                    setIsLogin(false)
                }
            }else{
                setIsLogin(false)
            }
        }
        fetchUserInfo()
    }, []);

    const [isMsgPanelOpen, setIsMsgOpen] = useState(false)
    const [isLoginPanelOpen, setIsPanelOpen] = useState(false)

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
                <div style={{display: "flex", alignItems: "center"}} onClick={goToHomepage}>
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
                        <span onClick={() => {setIsMsgOpen(true);lockOverflow()}} style={{ paddingRight: "1.4vw" }}>
                            Message
                        </span>
                    </Group>

                    {/* 登录状态下显示头像 */}
                    <Group >
                        
                        <Menu zIndex={1001} shadow={"md"}>
                            <Menu.Target>
                                <Avatar src={avatar} style={{ cursor: "pointer" }}></Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item className={classes.select} onClick={goToProfile}>
                                    My Profile
                                </Menu.Item>
                                <Menu.Item className={classes.select} onClick={handleLogout}>
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    </>
                    ) : (
                    <Group className={classes.links}>
                        <span onClick={() => {setIsPanelOpen(true);lockOverflow()}}>Login</span>
                    </Group>
                )}
            </div>
            <div style={{height: '0', border: 'none' , borderBottom: '1px solid grey'}}></div>

            <div hidden={!isMsgPanelOpen} className={`${classes.overlay} ${isMsgPanelOpen ? 'show' : ''}`}></div>
            <div hidden={!isLoginPanelOpen} className={`${classes.overlay} ${isLoginPanelOpen ? 'show' : ''}`}></div>
        </header>

            <div hidden={!isMsgPanelOpen} className={`${classes.msgPanel} ${isMsgPanelOpen ? classes.show : ''}`}>
                <MessagePanel onExitClick={() => {setIsMsgOpen(false);unlockOverflow()}}></MessagePanel>
            </div>

            <div hidden={!isLoginPanelOpen} className={`${classes.signPanel} ${isLoginPanelOpen ? classes.show : ''}`}>
                <SignPanel onExitClick={() => {setIsPanelOpen(false);unlockOverflow()}}></SignPanel>
            </div>
        </div>
        
    )

}
