'use client'

import { useState } from "react"
import { Avatar, Group, Text } from "@mantine/core"

export function UserProfile(props:any){
    const avatar_path = ''
    return (
        <div>
            <Group wrap="nowrap">
                <Avatar
                src={avatar_path}
                size={94}
                radius='md'/>
            <div>
                <Text>{props.username}</Text>
                <Text>{props.birthdate}</Text>
                <Text>{props.nickname}</Text>
            </div>
            </Group>
        </div>
    )
}