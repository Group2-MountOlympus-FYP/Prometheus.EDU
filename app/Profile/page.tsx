'use client'

import { useState, useEffect } from "react"
import { UserProfile } from "@/components/UserProfile/UserProfile"
import { TabBar } from "@/components/UserProfile/TABBar/TabBar"
import { getUserProfile, genders, userProfile } from "../api/User/router"


export default function UserInfoPage() {

    const [avatar, setAvatar] = useState('')
    const [BirthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    useEffect(() => {
        const fetchUserProfile = async () => {
            try{
                const userData = await getUserProfile()
                setAvatar(userData.avatar)
                setBirthDate(userData.birthdate)
                setUsername(userData.username)
                setGender(userData.gender)
            }catch(error){
                console.log(error)
            }
        }
        
        fetchUserProfile()
    }) 
    return (
        <div className="bg" style={{width: '100%'}}>
            <div style={{display:'flex', alignItems:'center', width:"100%"}}>
                <UserProfile username={username} birthDate={BirthDate} gender={gender} avatar={avatar}/>
            </div>
        </div>
    )
}