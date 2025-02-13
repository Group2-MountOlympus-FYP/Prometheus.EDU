'use client'

import { useState } from "react"
import './Login.css'

export function LoginPanel(){
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const handleUsername = (e:any) => {
        setUsername(e.target.value)
    } 

    const handlePassword = (e:any) => {
        setPassword(e.target.value)
    }
    return(
        <div className="bgLogin">
            <form>
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
                                <button type="submit">Login</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}