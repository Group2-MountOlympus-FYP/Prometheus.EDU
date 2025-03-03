'use client'
import { useState, useEffect } from "react"
import { LoginPanel } from "./LoginPanel/Login"
import { RegisterPanel } from "./RegisterPanel/Register"
import './SignPanel.css'
import { getText } from "./SignLanguage"

export function SignPanel(props:any){
    type signTypes = 'login' | 'register'
    const [signType, setSignType] = useState<signTypes>('login')

    useEffect(() => {
        
    }, [])    

    const switchLogin = () => {
        setSignType('login')
        //console.log(signType)
    }
    const switchRegister = () => {
        setSignType('register')
        //console.log(signType)
    }
    return (
        <div className="panel-bg" {...props}>
            <span className="title">{getText('welcome')}</span>
            <span className="subtitle">{getText('subtitle')}</span>
            <table>
                <tbody>
                    <tr className="signType-selection">
                        <td className={`login ${signType == 'login' ? "selected" : "" }`} onClick={switchLogin}>
                            <span>{getText('signon')}</span>
                        </td>
                        <td className={`register ${signType == 'register' ? "selected" : ""}`} onClick={switchRegister}>
                            <span>{getText('signin')}</span>
                        </td>
                        <td className="placeholder"></td>
                    </tr>
                    <tr hidden = {signType != 'register'}>
                        <td colSpan={3}>
                            <LoginPanel></LoginPanel>
                        </td>
                    </tr>
                    <tr hidden = {signType != 'login'}>
                        <td colSpan={3}>
                            <RegisterPanel></RegisterPanel>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}