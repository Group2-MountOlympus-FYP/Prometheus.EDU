'use client'

import { SearchBar } from "../SearchBar/SearchBar"
import { useDisclosure } from "@mantine/hooks"
import { Group, Burger, ActionIcon, Avatar, Modal } from "@mantine/core"
import classes from './Header.module.css'
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher"
import { SignPanel } from "../SignPanel/SignPanel"

type headerProps = {
    onLoginClick?: () => void
}

const links = [
    { link: '/', label: 'Collections' },
    { link: '/', label: 'history' },
    { link: '/', label: 'message' }
]
export default function Header() {
    const [ opened, { open, close } ] = useDisclosure(false)

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
        <header style={{height:"8vh", paddingTop: '1vh'}}>
            <div style={{marginLeft: '10vw', marginBottom: '1vh', marginRight: '10vw'}} className={classes.inner}>
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
                        <span onClick={open}>Login</span>
                    </Group>
                </Group>
                
            </div>
            <div style={{height: '0', border: 'none' , borderBottom: '1px solid grey'}}></div>
            <Modal opened={opened} onClose={close} style={{width:'35vw'}}>
                <SignPanel opened={opened}></SignPanel>
            </Modal>

        </header>
    )

}