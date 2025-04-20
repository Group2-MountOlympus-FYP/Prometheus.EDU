'use client'
import { getText } from "@/components/UserProfile/Language"
import { Button, Input, Text } from "@mantine/core"
import { useState } from "react"
import { changePassword } from "@/app/api/User/router"
import { notifications } from "@mantine/notifications"

export function ChangePasswordPanel(){

    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')

    const [currentPasswordError, setCurrentPasswordError] = useState<string>('')
    const [newPasswordError, setNewPasswordError] = useState<string>('')

    const handlePasswordChange = async(e:any) => {
        e.preventDefault()

        try{
            const response = await changePassword(currentPassword, newPassword)
            if(response.status == 200){
                //成功
                notifications.show({
                    message: getText("passwordChangeSuccess")
                })
            }else{
                const data = await response.text()
                //console.log(data)
                if(data === "wrong old password"){
                    setCurrentPasswordError(getText("currentPasswordError"))
                }else{
                    setNewPasswordError(getText("newPasswordError"))
                }
            }
            
        }catch(e){
            console.log(e)
        }
        //检查原密码是否正确

        //检查现密码与原密码是否重合

    }
    return (
        <div>
            <form onSubmit={handlePasswordChange}>
                <Input.Wrapper error={currentPasswordError}>
                    <Text>{getText('currentPassword')}</Text><Input type={"password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} maxLength={20}></Input>
                </Input.Wrapper>
                <Input.Wrapper error={newPasswordError} style={{marginBottom:'5vh'}}>
                    <Text>{getText('newPassword')}</Text><Input type={'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} maxLength={20}></Input>
                </Input.Wrapper>
                <Button type={'submit'} style={{margin:'auto'}}>{getText("submit")}</Button>
            </form>
        </div>
    )
}