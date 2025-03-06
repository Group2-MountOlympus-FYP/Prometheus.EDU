'use client'

import {Avatar, Burger, Center, Container, Group, Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconChevronDown} from '@tabler/icons-react';
import classes from './HeaderMenu.module.css';
import {HeaderMenuProps} from '@/types/interfaces'
import {ColorSchemeToggle} from "@/components/ColorSchemeToggle/ColorSchemeToggle";


export function HeaderMenu({links}: HeaderMenuProps) {

    const [opened, {toggle}] = useDisclosure(false);

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                <a href={item.link} className={classes.link}>
                    {item.label}
                </a>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{exitDuration: 0}} withinPortal>
                    <Menu.Target>
                        <a
                            className={classes.link}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5}/>
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
            >
                {link.label}
            </a>
        );
    });

    return (
        <header className={classes.header}>
            <Container size="md">
                <div className={classes.inner}>
                    <Avatar src="/carbon-ella-logo.png"/>
                    {/* <ColorSchemeToggle/> */}
                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm"/>
                </div>
            </Container>
        </header>
    );
}
