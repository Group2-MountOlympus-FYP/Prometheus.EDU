'use client'

import { useState, useEffect } from "react"
import { UserProfile } from "@/components/UserProfile/UserProfile"
import { getUserProfile, genders, userProfile } from "../api/User/router"
import { Tabs } from "@mantine/core"
import { MyCourse } from "./Components/myCourse"
import { getMyCourses } from "../api/MyCourses/router"
import "./profile.css"


export default function UserInfoPage() {

    const [avatar, setAvatar] = useState('')
    const [BirthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    const [tabsValue, setTabsValue] = useState<string | null>('1')
    const [courses, setCourses] = useState([])
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
        onTabValueChange(tabsValue) //初始先执行一次调用显示默认tab的值
        fetchUserProfile()
    }, []) 

    const onTabValueChange = async(value:string | null) => {
        setTabsValue(value)
        if(value){
            if(value === "1"){
                try{
                    console.log("Getting course...")
                    const response = await getMyCourses()
                    const data = await response.json()
                    //console.log(data)
                    setCourses(data)
                }catch(e){
                    console.log(e)
                }
            }
        }
    }
    return (
        <div style={{width: '100%', display: 'block'}}>
            <div style={{display:'flex', alignItems:'center', width:"100%"}}>
                <UserProfile username={username} birthDate={BirthDate} gender={gender} avatar={avatar} tabsValue={tabsValue} onTabsChange={onTabValueChange}/>
            </div>
        
            <div className="tabsPanels">
                <Tabs value={tabsValue} onChange={setTabsValue}>
                    <Tabs.Panel value="1">
                        <MyCourse data={courses}></MyCourse>
                    </Tabs.Panel>
                    <Tabs.Panel value="2">222</Tabs.Panel>
                    <Tabs.Panel value="3">333</Tabs.Panel>
                </Tabs>
            </div>
        </div>
    )
}