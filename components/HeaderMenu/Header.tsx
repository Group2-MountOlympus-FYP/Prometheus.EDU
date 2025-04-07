'use client'

import { SearchBar } from "../SearchBar/SearchBar"
import { Group, Burger, ActionIcon, Avatar, Modal, Menu } from "@mantine/core"
import classes from './Header.module.css'
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher"
import { SignPanel } from "../SignPanel/SignPanel"
import { useState, useEffect } from "react"
import {getLocalStorage, lockOverflow, reloadWindow, setLocalStorage, unlockOverflow} from "@/app/api/General"
import Link from 'next/link';
import {getUserProfile} from "@/app/api/User/router";
import error from "eslint-plugin-react/lib/util/error";
import { IconChevronDown } from "@tabler/icons-react"
import { Logout } from "@/app/api/Login/router"


type headerProps = {
    onLoginClick?: () => void
}

const links = [
    { link: '/', label: 'AthenaTutor' },
    { link: '/MyCourses', label: 'My Courses' },
    { link: '/', label: 'Message' }
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

    const [isLoginPanelOpen, setIsPanelOpen] = useState(false)

    const handleLogout = async () =>{
        setIsLogin(false)
        try{
            Logout()
        }catch(error){
            console.log(error)
        }
        reloadWindow()
    }

    const items = links.map((link) => (
      <Link
        key={link.label}
        href={link.link}
        className={classes.links}
      >
          {link.label}
      </Link>
    ));

    return (
        <div>
        <header className={classes.naviBar} style={{width:"100%"}}>
            <div className={classes.inner}>
                <div className={classes.logoBox}>
                    <img src="/website-logo.png" className={classes.logo}/>
                </div>
                <div className={classes.nameBox}>
                    <p className={classes.webName}> Prometheus.EDU</p>
                </div>
                <div style={{ flexGrow: 2, display: "flex", justifyContent: "center" }}>
                    <SearchBar></SearchBar>
                </div>
                <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                    <LanguageSwitcher></LanguageSwitcher>
                </div>
                <Group ml={50} gap={10} visibleFrom="sm" className={classes.links}>
                    {items}
                </Group>
                {isLogin ? 
                    <Group >
                        <Avatar src={avatar}></Avatar>
                        <Menu zIndex={1001} shadow={"md"}>
                            <Menu.Target>
                                <ActionIcon variant="transparent" size={10}>
                                    <IconChevronDown size={10}/>
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item className={classes.select} onClick={handleLogout}>Logout</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    :
                    <Group className={classes.links}>
                        <span onClick={() => {setIsPanelOpen(true);lockOverflow()}}>Login</span>
                    </Group>
                }
            </div>
            <div style={{height: '0', border: 'none' , borderBottom: '1px solid grey'}}></div>
            <div hidden={!isLoginPanelOpen} className={`${classes.overlay} ${isLoginPanelOpen ? 'show' : ''}`}></div>
        </header>
            <div hidden={!isLoginPanelOpen} className={`${classes.signPanel} ${isLoginPanelOpen ? classes.show : ''}`}>
                <SignPanel onExitClick={() => {setIsPanelOpen(false);unlockOverflow()}}></SignPanel>
            </div>
        </div>
        
    )

}