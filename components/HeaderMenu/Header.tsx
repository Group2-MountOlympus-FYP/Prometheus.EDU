'use client'

import { SearchBar } from "../SearchBar/SearchBar"
import { Group, Burger, ActionIcon, Avatar, Modal } from "@mantine/core"
import classes from './Header.module.css'
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher"
import { SignPanel } from "../SignPanel/SignPanel"
import { useState } from "react"
import { lockOverflow, unlockOverflow } from "@/app/api/General"

type headerProps = {
    onLoginClick?: () => void
}

const links = [
    { link: '/', label: 'AthenaTutor' },
    { link: '/', label: 'My Courses' },
    { link: '/', label: 'Message' }
]
export default function Header() {
    const [isLoginPanelOpen, setIsPanelOpen] = useState(false)

    const items = links.map((link) => (
        <a
        key={link.label}
        href={link.link}
        onClick={(event) => event.preventDefault()}
        className={classes.links}
        >
            {link.label}
        </a>
    ))

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
                <Group className={classes.links}>
                    <span onClick={() => {setIsPanelOpen(true);lockOverflow()}}>Login</span>
                </Group>
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