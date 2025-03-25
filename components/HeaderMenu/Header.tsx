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
    { link: '/', label: 'Collections' },
    { link: '/', label: 'history' },
    { link: '/', label: 'message' }
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
        <header style={{minHeight:"8vh", paddingTop: '1vh', marginBottom: '1vh', maxHeight: '10vh'}}>
            <div style={{marginLeft: '10vw', marginRight: '10vw'}} className={classes.inner}>
                <Group gap="xl" justify="space-between" style={{ width: "100%" }}>
                    <Group>
                        <Avatar src='/carbon-ella-logo.png'></Avatar>
                    </Group>
                    <Group style={{ flexGrow: 1, justifyContent: "center" }}>
                        <SearchBar></SearchBar>
                    </Group>
                    <Group>
                        <LanguageSwitcher></LanguageSwitcher>
                    </Group>
                    <Group ml={50} gap={10} visibleFrom="sm" className={classes.links}>
                        {items}
                    </Group>
                    <Group className={classes.links}>
                        <span onClick={() => {setIsPanelOpen(true);lockOverflow()}}>Login</span>
                    </Group>
                </Group>
                
            </div>
            <div style={{height: '0', border: 'none' , borderBottom: '1px solid grey'}}></div>
            <div hidden={!isLoginPanelOpen} className={`${classes.overlay} ${isLoginPanelOpen ? 'show' : ''}`}></div>
            <div hidden={!isLoginPanelOpen} className={`${classes.signPanel} ${isLoginPanelOpen ? classes.show : ''}`}>
                <SignPanel onExitClick={() => {setIsPanelOpen(false);unlockOverflow()}}></SignPanel>
            </div>

        </header>
    )

}