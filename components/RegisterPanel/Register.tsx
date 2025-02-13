'use client'
import React, { useState } from 'react';
import './Register.css'

export function RegisterPanel(){
    const today = new Date().toISOString().split('T')[0]
    const [isUsernameExist, setIsUsernameExist] = useState(false) //用户名是否已存在
    const [birthDate, setDate] = useState(today)
    const [password, setPassword] = useState()
    const [username, setUsername] = useState()
    const [gender, setGender] = useState(2)

    const handelDateChane = (e:any) => {
        setDate(e.targer.value)
    }

    const handelPassword = (e:any) => {
        setPassword(e.target.value)
    }

    const handelUsername = (e:any) => {
        setUsername(e.target.value)
    }
    
    const handelUsernameCheck = () => {
        //检查用户名
        console.log(1)
    }

    const handelGenderChange = (e:any) => {
        setGender(Number(e.target.value))
    }

    const handleRegisterForm = (e:any) => {
        e.preventDefault()
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
                        <td><input type="password" value={password} onChange={handelPassword} maxLength={20} className='input'></input></td>
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
                            <button type='submit'>Submit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}