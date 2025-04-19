'use client'
import { getText } from "@/components/UserProfile/Language"
import { Button, Input, Text } from "@mantine/core"
import { useState } from "react"

export function ChangePasswordPanel(){

    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')

    const [currentPasswordError, setCurrentPasswordError] = useState<string>('')
    const [newPasswordError, setNewPasswordError] = useState<string>('')

    const handlePasswordChange = (e:any) => {
        e.preventDefault()

        //检查原密码是否正确

        //检查现密码与原密码是否重合

    }
    return (
        <div>
            <form onSubmit={handlePasswordChange}>
                <Input.Wrapper>
                    <Text>{getText('currentPassword')}</Text><Input type={"password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} maxLength={20}></Input>
                </Input.Wrapper>
                <Input.Wrapper>
                    <Text>{getText('newPassword')}</Text><Input type={'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} maxLength={20}></Input>
                </Input.Wrapper>
                <Button type={'submit'}></Button>
            </form>
        </div>
    )
}