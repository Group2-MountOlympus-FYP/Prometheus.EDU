import { Fetch } from "@/app/api/General";

export async function CheckUsernameExist(username:string){
    const url = '/backend/login/verify-username'
    const formData = new URLSearchParams()
    const data = {
        username: username
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }
    // console.log(JSON.stringify(data))
    const response = await Fetch(url, {
        method: 'POST',
        body: formData
    })
    return response
}

export async function RegisterUser(username:string, password:string, gender:string, birthDate: string, csrf_token:any, type: string){
    const url = '/backend/login/register'
    const formData = new URLSearchParams()
    const data = {
        'username': username,
        'birthdate': birthDate,
        'gender': gender,
        'password': password,
        'csrf_token': csrf_token,
        'status': type,
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }
    
    //console.log(formData.toString())

    const response = await Fetch(url, {
        method: 'POST',
        body: formData
    })
    return response
}