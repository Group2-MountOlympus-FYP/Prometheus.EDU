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
}
export async function getUserProfile(): Promise<userProfile> {
    const url = '/backend/my_profile';

    const response = await fetch(url, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("response error");
    }
    if( response.status === 200 ) {
        return await response.json() as Promise<userProfile>
    }else{
        throw new Error(`internal server error. code: ${response.status}`)
    }
}

export async function updateProfile(username:string, birthDate: string, gender: string){
    const url = "/backend/change_profile"
    const data = new URLSearchParams({
        username: username,
        birthdate: birthDate,
        gender: gender,
    })

    const response = await fetch(url, {
        method: 'POST',
        body: data,
    })
    if( response.ok ){
        if(response.status == 200){
            return true
        }else{
            throw new Error(`Error! code: ${response.status}`)
        }
    }else{
        throw new Error('Update user profile error')
    }
}

export async function uploadAvatar(file:File){
    const url = '/backend/change_avatar'
    
    const data = new FormData()
    data.append("file", file)

    const response = await fetch(url, {
        method: 'POST',
        body: data
    })
    if(response.ok){
        return true
    }else{
        throw new Error("Upload error!")
    }
}

//获取所有评论
export async function getMyComments(){
    const url = '/backend/post/comment/all'

    const response = await fetch(url, {
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

    const response = await fetch(url, {
        method: 'GET'
    })
    if(response.ok){
        return response
    }else{
        throw new Error("Get Posts Error")
    }
}
