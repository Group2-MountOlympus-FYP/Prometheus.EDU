import { clearCookie } from "../General"

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
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData
    })
    if(!response.ok){
        // const data = await response.json()
        // console.log(data.error)
        throw new Error("internal server error")
    }
    if(response.status == 200){
        return await response.json()
    }else{
        throw new Error(`response error! code: ${response.status}`)
    }
}

export async function Logout(){
    const url = '/backend/login/delete_cookie'
    const response =  await fetch(url, {
        method: 'GET'
    })
    if(!response.ok){
        throw new Error('internal server error')
    }
    if(response.status == 200){
        clearCookie()
        return true
    }else{
        throw new Error(`code: ${response.status}`)
    }
}