'use client'

import { useState } from "react"
import './Login.css'
import { GetCSRF, GetCookie } from "@/app/api/General"
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
        if(response == true){
            
        }else{
            alert("error!")
            return
        }
        csrf = GetCookie("csrf_token")

        Login(username,password,csrf,isRemember)
        .then(response => {
            if(response.status == 200){
                return response.json()
            }
        })
        .then(data => {
            //防止服务端报错
            windowRedirect('/user-info')
        })


    }
    return(
        <div className="bgLogin">
            <form onSubmit={handleLogin}>
                <table>
                    <tbody>
                        <tr>
                            <td id='title' colSpan={2}>{getText('welcome')}</td>
                        </tr>
                        <tr>
                            <td className='text'>{getText('username')}: </td>
                            <td><input type="text" className="input" maxLength={20} value={username} onChange={handleUsername}></input></td>
                        </tr>
                        <tr>
                            <td className="text">{getText('password')}: </td>
                            <td><input type="password" className="input" maxLength={20} value={password} onChange={handlePassword}></input></td>
                        </tr>
                        <tr>
                            <td colSpan={2} id='footer'>
                                <p>{getText('already_have_account')} <a href="/register">Sign Up</a></p>
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