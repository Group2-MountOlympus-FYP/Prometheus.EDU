import { Fetch } from "../General";

//用户相关接口调用
export type genders = "male" | "female" | "other";
export interface userProfile{
    activities: number[],
    avatar: string,
    birthdate: string,
    content: number[],
    enrollments: number[],
    gender: genders,
    id: number,
    username: string,
    posts: any[],
}
export async function getUserProfile(user_id?:number): Promise<userProfile> {
    let url = ''
    if(user_id){
        url = `/backend/my_profile?user_id=${user_id}`
    }else{
        url = '/backend/my_profile';
    }

    const response = await Fetch(url, {
        method: 'GET',
    });
    return await response.json();
}

export async function updateProfile(username:string, birthDate: string, gender: string){
    const url = "/backend/change_profile"
    const data = new URLSearchParams({
        username: username,
        birthdate: birthDate,
        gender: gender,
    })

    return await Fetch(url, {
        method: 'POST',
        body: data,
    })
}

export async function uploadAvatar(file:File){
    const url = '/backend/change_avatar'
    
    const data = new FormData()
    data.append("file", file)

    await Fetch(url, {
        method: 'POST',
        body: data
    })
    return true
}

//获取所有评论
export async function getMyComments(){
    const url = '/backend/post/comment/all'

    const response = await Fetch(url, {
        method: 'GET'
    })
    if(response.ok){
        return response
    }else{
        throw new Error("Get Comments Error")
    }
}

//获取所有post
export async function getMyPosts(){
    const url = '/backend/post/my/all'

    return await Fetch(url, {
        method: 'GET'
    })

}

export async function changePassword(old: string, newPassword: string){
    const url = '/backend/login/password_reset'

    const data = new FormData()
    data.append("old_password", old)
    data.append("new_password", newPassword)

    return await Fetch(url, {
        method: 'POST',
        body: data
    })
}
