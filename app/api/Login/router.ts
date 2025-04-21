import {deleteUserInfo, Fetch} from "@/app/api/General";

export async function Login(username:string, password:string, csrf:any, isRemember:any){
    const url = '/backend/login'
    const formData = new URLSearchParams()
    const data = {
        'username': username,
        'password': password,
        'csrf_token': csrf,
        'remember': isRemember
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }

    //console.log(formData.toString())
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    })
    return response
}

export async function Logout(){
    const url = '/backend/login/delete_cookie'
    const response =  await Fetch(url, {
        method: 'GET'
    })
    deleteUserInfo()
    return true
}