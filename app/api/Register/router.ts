export async function CheckUsernameExist(username:string){
    const url = '/login/verify-username'
    const formData = new URLSearchParams()
    const data = {
        username: username
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }
    // console.log(JSON.stringify(data))
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*"
        },
        redirect: "follow",
        referrerPolicy: 'no-referrer',
        body: formData
    })
    return response
}

export async function RegisterUser(username:string, password:string, gender:string, birthDate: string, csrf_token:any){
    const url = '/login/register'
    const formData = new URLSearchParams()
    const data = {
        'username': username,
        'birthdate': birthDate,
        'gender': gender,
        'password': password,
        'csrf_token': csrf_token
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }
    
    //console.log(formData.toString())

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include', //发送和接收cookie
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*"
        },
        body: formData
    })
    return response
}