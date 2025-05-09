'use client'
import { useState } from "react"
import { LoginPanel } from "./LoginPanel/Login"
import { RegisterPanel } from "./RegisterPanel/Register"
import './SignPanel.css'
import { getText } from "./SignLanguage"
import { IoCloseSharp } from "react-icons/io5";



export function SignPanel(){
    type signTypes = 'login' | 'register'
    const [signType, setSignType] = useState<signTypes>('register')

    const switchLogin = () => {
        setSignType('login')
        //console.log(signType)
    }
    const switchRegister = () => {
        setSignType('register')
        //console.log(signType)
    }
    return (
        <div style={{width: '100%'}}>
        <div className="panel-bg">
        <div className="panel-content">
            <div className="title">
                <span className="welcome">{getText('welcome')}</span>
                <span className="site-name">{getText('sitename')}</span>
            </div>

            <div className="subtitle">
                <span>{getText('subtitle')}</span>
            </div>
            
            <table>
                <tbody>
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

                    <tr className={`register-state ${signType == 'register' ? "hidden" : "" }`}>
                        <td>
                        <div className="login-opt">
                            <span className="login-ask">{getText('loginask')}</span>
                            <span className="login" onClick={switchRegister}>{getText('signin')}</span>
                        </div>
                        </td>
                    </tr>
                    <tr className={`login-state ${signType == 'login' ? "hidden" : "" }`}>
                        <td>
                        <div className="register-opt">
                            <span className="register-ask">{getText('registerask')}</span>
                            <span className="register" onClick={switchLogin}>{getText('signup')}</span>
                        </div>
                        </td>
                    </tr>

                </tbody>
            </table>
            <div className="placeholder"></div>
            </div>

        </div>
        </div>
    )
}