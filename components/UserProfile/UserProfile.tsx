'use client'

import { useState } from "react"
import { Avatar, Group, Text } from "@mantine/core"
import { FaRegEdit } from "react-icons/fa";
import { UpdateUserInfoPanel } from "../UpdateUserInfo/UpdateUserInfo";
import { IoMdClose } from "react-icons/io";
import './UserProfile.css'

export function UserProfile(props:any){
    const avatar_path = ''
    const [isEdit , setIsEdit] = useState(false)
    const [isFirstRender, setIsFirstRender] = useState(true)

    const openEditPanel = () => {
        setIsEdit(true)
        setIsFirstRender(false)
    }
    const closeEditPanel = () => {
        setIsEdit(false)
    }
    return (
        <div>
            <div className={`overlay ${isEdit ? 'show' : 'hide'}`}></div>
            <div className={`edit-panel ${isEdit ? "show" : "hide"}`} hidden={isFirstRender}>
                <div className="edit-panel-header">
                    <IoMdClose style={{cursor: 'pointer'}} onClick={closeEditPanel}/>
                </div>
                <div className="edit-panel-body">
                    <UpdateUserInfoPanel/>
                </div>
            </div>
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
            <div>
                <FaRegEdit style={{cursor: 'pointer'}} onClick={openEditPanel}/>
            </div>
            </Group>
        </div>
    )
}