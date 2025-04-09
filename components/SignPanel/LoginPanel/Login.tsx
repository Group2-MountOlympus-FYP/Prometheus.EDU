'use client'

import { useState } from "react"
import './Login.css'
import { GetCSRF, getLocalStorage, reloadWindow, setLocalStorage } from "@/app/api/General"
import { Login } from "@/app/api/Login/router"
import { getText } from "./Language"
import { windowRedirect } from "@/app/api/General"

export function LoginPanel(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
            setLocalStorage('isLogin', 'true')
            //alert("true")
        }catch(error){
            console.log(error)
        }
        reloadWindow()
    }
    return(
        <div className="bgLogin">
            <form onSubmit={handleLogin}>
                <table>
                    <tbody>
                        <tr>
                            <td id='login-title' colSpan={2}>
                                {getText('welcome')}
                            </td>
                        </tr>
                        <tr>
                            <td className='login-text'>{getText('username')}</td>
                            <td className="login-inputbox">
                                <input type="text" className="login-input" maxLength={20} value={username} onChange={handleUsername}></input>
                            </td>
                        </tr>
                        <tr>
                            <td className="login-text">{getText('password')}</td>
                            <td className="login-inputbox">
                                <input type="password" className="login-input" maxLength={20} value={password} onChange={handlePassword}></input>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} id='login-footer'>
                                <p>{getText('remember')}<input type="checkbox" checked={isRemember} onChange={handleIsRemember}></input></p>
                                <button type="submit">{getText('login')}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}