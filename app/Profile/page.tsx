'use client'

import { useState, useEffect } from "react"
import { UserProfile } from "@/components/UserProfile/UserProfile"
import { getUserProfile, genders, userProfile, getMyPosts, getMyComments } from "../api/User/router"
import { Skeleton, Tabs, Text } from "@mantine/core"
import { MyCourse } from "./Components/myCourse"
import { getMyCourses } from "../api/MyCourses/router"
import { getText } from "@/components/UserProfile/Language"
import "./profile.css"
import { MyPosts } from "./Components/myPosts"


export default function UserInfoPage() {

    const [avatar, setAvatar] = useState('')
    const [BirthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    const [tabsValue, setTabsValue] = useState<string | null>('1')
    const [courses, setCourses] = useState([])
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsProfileLoading(true)
            try{
                const userData = await getUserProfile()
                setAvatar(userData.avatar)
                setBirthDate(userData.birthdate)
                setUsername(userData.username)
                setGender(userData.gender)
                setIsProfileLoading(false)
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
            setIsLoading(true)
            if(value === "1"){
                //获取course
                try{
                    //console.log("Getting course...")
                    const response = await getMyCourses()
                    const data = await response.json()
                    //console.log(data)
                    setCourses(data)
                }catch(e){
                    console.log(e)
                }
            }else if(value === "2"){
                //获取post
                try{
                    const response = await getMyPosts()
                    const data = await response.json()
                    setPosts(data)
                    //console.log(data)
                }catch(e){
                    console.log(e)
                }
            }else if(value === "3"){
                //获取comments
                try{
                    const response = await getMyComments()
                    const data = await response.json()
                    console.log(data)
                }catch(e){
                    console.log(e)
                }
            }
            setIsLoading(false)
        }
    }
    return (
        <div style={{width: '100%', display: 'block'}}>
            <div style={{display:'flex', alignItems:'center', width:"100%"}}>
                <UserProfile username={username} birthDate={BirthDate} gender={gender} avatar={avatar} tabsValue={tabsValue} onTabsChange={onTabValueChange} isLoading={isProfileLoading}/>
            </div>
        
            <div className="tabsPanels">
                {
                    !isLoading ? 
                    <Tabs value={tabsValue} onChange={setTabsValue}>
                        <Tabs.Panel value="1">
                            {
                                courses.length !== 0 ?
                                <MyCourse data={courses}></MyCourse> :
                                <Text>{getText("noCourseYet")}</Text>
                            }
                        </Tabs.Panel>
                        <Tabs.Panel value="2">
                            {
                                posts.length !== 0 ? 
                                <MyPosts posts={posts}></MyPosts> :
                                <Text>{getText("noPostYet")}</Text>
                            }
                        </Tabs.Panel>
                    </Tabs>
                    :
                    <div>
                        <Skeleton height={50} mt={12} width="70%" radius="xl" style={{margin:'auto'}}/>
                        <Skeleton height={20} mt={12} width="70%" radius="xl" style={{margin:'auto'}}/>
                        <Skeleton height={20} mt={12} width="70%" radius="xl" style={{margin:'auto'}}/>
                        <Skeleton height={20} mt={12} width="70%" radius="xl" style={{margin:'auto'}}/>
                    </div>
                }
                
            </div>
        </div>
    )
}