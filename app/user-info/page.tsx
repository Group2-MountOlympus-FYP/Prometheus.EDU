'use client'

import { useState, useEffect } from "react"
import { UserProfile } from "@/components/UserProfile/UserProfile"
import { TabBar } from "@/components/TABBar/TabBar"
import { getUserProfile } from "../api/User/router"

export default function UserInfoPage() {
    const [avatar, setAvatar] = useState(null)
    const [BirthDate, setBirthDate] = useState(null)
    const [gender, setGender] = useState(null)
    const [nickName, setNickName] = useState(null)
    const [username, setUsername] = useState(null)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data, status } = await getUserProfile();
                if (status === 401) {
                    //未登录 重定向到登录界面
                    alert('You are not login, please login')
                    if(typeof window !== undefined){
                        window.location.href = '/login'
                    }
                } 
                else if(status == 200){
                    //已登录，数据获取成功
                    console.log(data)
                    setAvatar(data.avatar)
                    setBirthDate(data.birthdate)
                    setGender(data.gender)
                    setNickName(data.nickname)
                    setUsername(data.username)
                }
                else {
                    //其他情况
                    console.log(status)
                    console.log(data)
                }
            } catch (error) {
                // 错误处理
                console.error(error);
            }
        }
        
        fetchUserProfile()
    }) 
    return (
        <div className="bg">
            <UserProfile username={username} birthdate={BirthDate} nickname={nickName}/>
            <TabBar/>
        </div>
    )
}