'use client'

import { useState } from "react"
import './Login.css'
import { GetCSRF, GetCookie } from "@/app/api/General"
import { Login } from "@/app/api/Login/router"

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
            document.cookie = `user_id=${data.id}`
        })

    }
    return(
        <div className="bgLogin">
            <form onSubmit={handleLogin}>
                <table>
                    <tbody>
                        <tr>
                            <td id='title' colSpan={2}>Welcome to Doner</td>
                        </tr>
                        <tr>
                            <td className='text'>Username: </td>
                            <td><input type="text" className="input" maxLength={20} value={username} onChange={handleUsername}></input></td>
                        </tr>
                        <tr>
                            <td className="text">Password: </td>
                            <td><input type="password" className="input" maxLength={20} value={password} onChange={handlePassword}></input></td>
                        </tr>
                        <tr>
                            <td colSpan={2} id='footer'>
                                <p>Don't have account? <a href="">Sign Up</a></p>
                                <p>Remember Me<input type="checkbox" checked={isRemember} onChange={handleIsRemember}></input></p>
                                <button type="submit">Login</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}