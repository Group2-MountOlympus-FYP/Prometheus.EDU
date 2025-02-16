import { baseURL } from "../general";
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

async function POST(url:string, data:any){
    
}