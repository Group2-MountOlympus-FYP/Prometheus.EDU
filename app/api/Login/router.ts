export async function Login(username:string, password:string, csrf:any, isRemember:any){
    const url = '/login/'
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
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Connection": "keep-alive"
        },
        redirect: "follow",
        referrerPolicy: 'no-referrer',
        body: formData
    })
    return response
}