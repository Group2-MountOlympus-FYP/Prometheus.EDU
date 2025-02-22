'use client'

import { useState } from "react"
import './UpdateUserInfo.css'

export function UpdateUserInfoPanel(){
    const [username, setUsername] = useState()
    const [nickName, setNickName] = useState()
    const [birthDate, setBirthDate] = useState()

    const checkUsernameExist = async () => {

    }

    const handleUsername = (e:any) => {
        setUsername(e.target.value)
    }

    const handleNickName = (e:any) => {
        setNickName(e.target.value)
    }

    const handleBirthDate = (e:any) => {
        setBirthDate(e.target.value)
    }
    
    const handleSubmit = async (e:any) => {
        e.preventDefault()
    }
    return (
        <div className="bg">
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                    <tr>
                        <td id="title" colSpan={2}>
                            <p>Title</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="text">
                            <p>Username</p>
                        </td>
                        <td>
                            <input type="text" maxLength={20} value={username} onBlur={checkUsernameExist} onChange={handleUsername}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="text">nickname</td>
                        <td><input type="text" maxLength={20} className="input" value={nickName} onChange={handleNickName}></input></td>
                    </tr>
                    <tr>
                        <td className="text">birthDate</td>
                        <td className="input"><input type="date" value={birthDate} className="input" onChange={handleBirthDate}></input></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button type="submit">Submit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}