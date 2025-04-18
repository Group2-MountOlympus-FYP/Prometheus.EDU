'use client'

import { useState, useContext } from "react"
import './Login.css'
import { GetCSRF, getLocalStorage, reloadWindow, setLocalStorage } from "@/app/api/General"
import { Login } from "@/app/api/Login/router"
import { getText } from "./Language"
import { Button, Grid, Input, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { LoadingContext } from "@/components/Contexts/LoadingContext"
import { SessionContext } from "@/components/Contexts/SessionContext"

export function LoginPanel(){
    const { isLogin, setIsLogin } = useContext(SessionContext)
    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState<string>('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [isRemember, setIsRemember] = useState(false)

    const handleUsername = (e:any) => {
        setUsername(e.target.value)
    } 

    const handlePassword = (e:any) => {
        setPassword(e.target.value)
    }
    const handleIsRemember = (e:any) => {
        setIsRemember(e.target.checked)
    }
    const handleLogin = async (e:any) => {
        e.preventDefault()
        let csrf
        const response = await GetCSRF()
        if(!response){
            alert("Error!")
            return
        }
        csrf = getLocalStorage("csrf_token")
        console.log(csrf)

        try{
            const data = await Login(username, password, csrf, isRemember)
            if(data.message){
                setPasswordError(getText('password_error'))
                return
            }
            
            setLocalStorage('isLogin', 'true')
            setIsLogin(true)

            notifications.show({
                message: getText('login_success')
            })
            setIsLoading(true)
            setTimeout(() => {
                reloadWindow()
            }, 1000);
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div className="bgLogin">
            <form onSubmit={handleLogin}>
                <Text id='login-title'>{getText('welcome')}</Text>
                <Grid style={{width: "100%"}}>

                    <Grid.Col span={4}><Text className='login-text'>{getText('username')}</Text></Grid.Col>
                    <Grid.Col span={8} style={{marginBottom: '10px'}}>
                        <Input.Wrapper error={usernameError}>
                            <Input className="login-input" value={username} onChange={handleUsername} maxLength={20}></Input>
                        </Input.Wrapper>
                    </Grid.Col>

                    <Grid.Col span={4}><Text className='login-text'>{getText('password')}</Text></Grid.Col>
                    <Grid.Col span={8}>
                    <Input.Wrapper error={passwordError}>
                            <Input type="password" className="login-input" value={password} onChange={handlePassword} maxLength={20}></Input>
                        </Input.Wrapper>
                    </Grid.Col>

                </Grid>

                <div id='login-footer'>
                    <p>{getText('remember')}<input type="checkbox" checked={isRemember} onChange={handleIsRemember}></input></p>
                    <Button type="submit" id="submit-button">{getText('login')}</Button>
                </div>
            </form>
        </div>
    )
}