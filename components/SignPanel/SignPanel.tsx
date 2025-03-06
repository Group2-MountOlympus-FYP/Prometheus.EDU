'use client'
import { useState, useEffect } from "react"
import { LoginPanel } from "./LoginPanel/Login"
import { RegisterPanel } from "./RegisterPanel/Register"
import './SignPanel.css'
import { getText } from "./SignLanguage"
import { IoCloseSharp } from "react-icons/io5";

type signPanelProps = {
    onExitClick?:() => void
}

export function SignPanel({onExitClick = () => {}} : signPanelProps){
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
        <div style={{width: '100%'}}>
            <div className='exit-button'>
                <IoCloseSharp id="exitbutton" size={28} onClick={onExitClick}></IoCloseSharp>
            </div>
        <div className="panel-bg">
        <div className="panel-content">
            <div className="title">
                <span className="welcome">{getText('welcome')}</span>
                <span className="site-name">{getText('sitename')}</span>
            </div>

            <div className="subtitle">
                <span>{getText('subtitle')}</span>
            <div/>
            
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
                    
                    {/* <td className={`login ${signType == 'login' ? "selected" : "" }`} onClick={switchLogin}>
                            <span>{getText('signup')}</span>
                    </td>
                    <td className={`register ${signType == 'register' ? "selected" : ""}`} onClick={switchRegister}>
                        <span>{getText('signin')}</span>
                    </td> */}

                    <tr className={`register-state ${signType == 'register' ? "hidden" : "" }`}>
                        <td className="register-ask">
                            <span>{getText('registerask')}</span>
                        </td>
                        <td className="register" onClick={switchRegister}>
                            <span>{getText('signup')}</span>
                        </td>
                    </tr>
                    <tr className={`login-state ${signType == 'login' ? "hidden" : "" }`}>
                        <td className="login-ask">
                            <span>{getText('loginask')}</span>
                        </td>
                        <td className="login" onClick={switchLogin}>
                            <span>{getText('signin')}</span>
                        </td>
                    </tr>

                </tbody>
            </table>
            <div className="placeholder"></div>
            </div>

        </div>
        </div>
        </div>
    )
}