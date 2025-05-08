'use client'

import { useState, useEffect } from "react"
import { UserProfile } from "@/components/UserProfile/UserProfile"
import { getUserProfile, getMyPosts, getMyComments } from "../api/User/router"
import { Skeleton, Tabs, Text } from "@mantine/core"
import { MyCourse } from "./Components/myCourse"
import { getMyCourses } from "../api/MyCourses/router"
import { getText } from "@/components/UserProfile/Language"
import "./profile.css"
import { MyPosts } from "./Components/myPosts"
import { setUserInfo } from "../api/General"

interface ProfileProps{
    id?: number
}


export function Profile(props: ProfileProps) {

    const [avatar, setAvatar] = useState('')
    const [BirthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    const [tabsValue, setTabsValue] = useState<string | null>('1')
    const [courses, setCourses] = useState<any[]>([])
    const [posts, setPosts] = useState<any[]>([])
    const [userType, setUserType] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true)
    useEffect(() => {

        setIsProfileLoading(true)
        const fetchUserProfile = async () => {
            try{
                const userData = await getUserProfile()
                //console.log(userData)
                setAvatar(userData.avatar)
                setBirthDate(userData.birthdate)
                setUsername(userData.username)
                setGender(userData.gender)
                setUserType(userData.status)

                setUserInfo({
                    username: userData.username,
                    avatar: userData.avatar,
                    birthDate: userData.birthdate,
                    gender: userData.gender,
                    userType: userData.status,
                })

                setIsProfileLoading(false)
            }catch(error){
                console.error(error)
            }
        }

        //获取别人的信息
        const fetchUserProfileById = async() => {
            try{
                const userData = await getUserProfile(props.id)
                //console.log(`Get data from id ${props.id}`,userData)
                setAvatar(userData.avatar)
                setBirthDate(userData.birthdate)
                setUsername(userData.username)
                setGender(userData.gender)
                setUserType(userData.status)

                setCourses(userData.enrollments)
                setPosts(userData.posts)

                setIsProfileLoading(false)
            }catch(e){
                console.error(e)
            }
        }


        onTabValueChange(tabsValue) //初始先执行一次调用显示默认tab的值
        if(props.id){
            fetchUserProfileById()
        }else{
            fetchUserProfile()
        }
    }, []) 

    const onTabValueChange = async(value:string | null) => {
        setTabsValue(value)

        //获取自己的信息
        if(value && !props.id){
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
        //根据id获取别人的信息
        else{
            setIsLoading(false)
        }
    }
    return (
        <div style={{width: '100%', display: 'block'}}>
            <div style={{display:'flex', alignItems:'center', width:"100%"}}>
                <UserProfile 
                    username={username} 
                    birthDate={BirthDate} 
                    gender={gender} 
                    avatar={avatar} 
                    tabsValue={tabsValue} 
                    onTabsChange={onTabValueChange} 
                    isLoading={isProfileLoading}
                    isSelf={props.id ? false : true}
                    userType={userType}
                    />
            </div>
        
            <div className="tabsPanels">
                {
                    !isLoading ? 
                    <Tabs value={tabsValue} onChange={setTabsValue}>
                        <Tabs.Panel value="1">
                            {
                                courses.length !== 0 ?
                                <MyCourse data={courses}></MyCourse> :
                                <Text style={{textAlign:"center"}} size="xl">{getText("noCourseYet")}</Text>
                            }
                        </Tabs.Panel>
                        <Tabs.Panel value="2">
                            {
                                posts.length !== 0 ? 
                                <MyPosts posts={posts}></MyPosts> :
                                <Text style={{textAlign:"center"}} size="xl">{getText("noPostYet")}</Text>
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