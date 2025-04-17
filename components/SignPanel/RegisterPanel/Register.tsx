'use client'
import React, { useState, useContext } from 'react';
import { LoadingContext } from '@/components/Contexts/LoadingContext';
import './Register.css'
import { CheckUsernameExist, RegisterUser } from '@/app/api/Register/router';
import { GetCSRF, getLocalStorage, reloadWindow } from '@/app/api/General';
import { getText } from './language';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { UserAgreement } from '../UserAgreement/UserAgreement';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { notifications } from '@mantine/notifications';

export function RegisterPanel(){
    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const today = new Date().toISOString().split('T')[0]
    const [isUsernameExist, setIsUsernameExist] = useState(false) //用户名是否已存在
    const [birthDate, setDate] = useState(today)
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [gender, setGender] = useState(2)
    const [isAbleToSubmit, setIsAbleToSubmit] = useState(false)
    const [isProtocolAgree, setIsProtocolAgree] = useState(false)
    const [opened , { open, close }] = useDisclosure(false)

    const handelDateChane = (e:any) => {
        setDate(e.targer.value)
    }

    const handelPassword = (e:any) => {
        setPassword(e.target.value)
    }

    const handelUsername = (e:any) => {
        setUsername(e.target.value)
    }
    
    const handelUsernameCheck = async() => {
        //检查用户名
        CheckUsernameExist(username)
        .then((response) => response.json())
        .then((data) => {
            //console.log(data)
            if(data.Occupied == false){
                setIsUsernameExist(false)
                setIsAbleToSubmit(true)
            }else{
                setIsUsernameExist(true)
                setIsAbleToSubmit(false)
            }
        })
        .catch((error) => {
            console.error("Error: " , error)
        })

    }

    const handelGenderChange = (e:any) => {
        setGender(Number(e.target.value))
    }

    const handleRegisterForm = async (e:any) => {
        e.preventDefault()

        if(!isProtocolAgree){
            notifications.show({
                color: "yellow",
                title: 'Warning',
                message: 'You must confirm the Agreement to continue'
            })
            return
        }
        
        setIsLoading(true)
        const response = await GetCSRF()
        if(response == true){
            
        }else{
            alert("error!")
            return
        }

        let csrf = getLocalStorage("csrf_token")
        //处理gender
        let genderStr
        if(gender == 0){
            genderStr = 'male'
        }
        else if(gender == 1){
            genderStr = 'female'
        }
        else{
            genderStr = 'other'
        }
        //console.log(birthDate)
        RegisterUser(username, password, genderStr, birthDate, csrf)
        .then((response) => {
            if(response.status == 401){
                //unauthorized
                throw new Error('Unauthorized access')
            }else if(response.status == 200){
                return response.json()
            }
        })
        .then((data) => {
            //console.log(document.cookie)
            notifications.show({
                message: 'register success'
            })
            setTimeout(() => {
                reloadWindow()
            }, 1000);
        })
    }

    const onProtocolAgree = () => {
        //console.log('agree')
        setIsProtocolAgree(true)
        close()
    }
    const onProtocolCancel = () => {
        setIsProtocolAgree(false)
        close()
    }

    return(
        <div className='bg'>
            <form onSubmit={handleRegisterForm}>
                <table>
                    <tbody>
                    <tr>
                        <td id='register-title' colSpan={2}>
                            {getText('welcome')}
                        </td>
                    </tr>
                    <tr>
                        <td className='register-text'>{getText('username')}</td>
                        <td className="register-inputbox">
                            <input type="text" maxLength={20} value={username} onChange={handelUsername} className='register-input' onBlur={handelUsernameCheck}></input>
                            <div className={`username-warnning ${isUsernameExist ? "show" : "hide"}`}>{getText('user_exit')}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className='register-text'>{getText('password')}</td>
                        <td className="register-inputbox">
                            <input type="password" value={password} onChange={handelPassword} maxLength={20} className='register-input' minLength={6}
                        pattern='^[a-zA-Z0-9]+$'
                        title={getText('password_hint')}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className='register-text'>{getText('gender')}</td>
                        <td className="register-inputbox">
                            <input type="radio" value={0} name="gender" checked={gender===0} onChange={handelGenderChange}/>  <label>{getText('male')}</label>   
                            <input type="radio" value={1} name="gender" checked={gender===1} onChange={handelGenderChange}/> <label>{getText('female')}</label>
                            <input type="radio" value={2} name="gender" checked={gender===2} onChange={handelGenderChange}/> <label>{getText('other')}</label>
                        </td>
                    </tr>
                    <tr>
                        <td className='register-text'>{getText('birthday')}</td>
                        <td className="register-inputbox">
                            <input type="date" value={birthDate} onChange={handelDateChane} className='register-input'></input>
                        </td>
                    </tr>
                    <tr>
                        <td id='register-footer' colSpan={2}>
                            <span style={{display:'block'}}>
                                {getText('protocol')} <a href='#' onClick={open}>{getText('protocol_name')}</a><input type='checkbox' checked={isProtocolAgree} onChange={(e:any) => setIsProtocolAgree(e.target.checked)}></input>
                            </span>
                            <Modal opened={opened} onClose={close} title={getText('protocol_name')} size={'xl'}>
                                <LanguageSwitcher/>
                                <UserAgreement onAgreeClick={onProtocolAgree} onCancelClick={onProtocolCancel}/>
                            </Modal>
                            <button type='submit' disabled={!isAbleToSubmit}>{getText('submit')}</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}