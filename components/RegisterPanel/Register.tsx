'use client'
import React, { useState } from 'react';
import './Register.css'
import { CheckUsernameExist, RegisterUser } from '@/app/api/Register/router';
import { GetCSRF, GetCookie } from '@/app/api/General';

export function RegisterPanel(){
    const today = new Date().toISOString().split('T')[0]
    const [isUsernameExist, setIsUsernameExist] = useState(false) //用户名是否已存在
    const [birthDate, setDate] = useState(today)
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [gender, setGender] = useState(2)
    const [isAbleToSubmit, setIsAbleToSubmit] = useState(false)

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
        let csrf
        
        const response = await GetCSRF()
        if(response == true){
            
        }else{
            alert("error!")
            return
        }

        csrf = GetCookie("csrf_token")
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
        })
    }
    return(
        <div className='bg'>
            <form onSubmit={handleRegisterForm}>
                <table>
                    <tbody>
                    <tr>
                        <td id='title' colSpan={2}>
                            <p>Welcom To Doner</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='text'>Username: </td>
                        <td>
                            <input type="text" maxLength={20} value={username} onChange={handelUsername} className='input' onBlur={handelUsernameCheck}></input>
                            <div className={`username-warnning ${isUsernameExist ? "show" : "hide"}`}>Username Exist!</div>
                        </td>
                    </tr>
                    <tr>
                        <td className='text'>Password: </td>
                        <td><input type="password" value={password} onChange={handelPassword} maxLength={20} className='input' minLength={6}
                        pattern='^[a-zA-Z0-9]+$'
                        title="密码只能包含字母、数字和特殊字符。"></input></td>
                    </tr>
                    <tr>
                        <td className='text'>Gender: </td>
                        <td>
                            <input type="radio" value={0} name="gender" checked={gender===0} onChange={handelGenderChange}/>  <label>Male</label>   
                            <input type="radio" value={1} name="gender" checked={gender===1} onChange={handelGenderChange}/> <label>Female</label>
                            <input type="radio" value={2} name="gender" checked={gender===2} onChange={handelGenderChange}/> <label>Other</label>
                        </td>
                    </tr>
                    <tr>
                        <td className='text'>Birthday: </td>
                        <td><input type="date" value={birthDate} onChange={handelDateChane} className='input'></input></td>
                    </tr>
                    <tr>
                        <td id='footer' colSpan={2}>
                            <p>Already have account? <a href=''>Login</a></p>
                            <button type='submit' disabled={!isAbleToSubmit}>Submit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}