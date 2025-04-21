export async function GetCSRF(): Promise<string> {
    const url = '/backend/login/get_csrf';
    const response = await Fetch(url, {
        method: 'GET',
    });
    const data = await response.json();

    //setLocalStorage("csrf_token", data.csrf_token)
    //console.log(data.csrf_token)
    return data.csrf_token; // 成功时返回 true

}

//封装好的访问浏览器专用API方法
export function setLocalStorage(key:any, value:any){
    if( typeof window !== "undefined" ){
        //console.log(`Saving ${value} in ${key}`)
        // if(getLocalStorage('cookieConsent') !== 'true'){
        //     return
        // }
        localStorage.setItem(key, value);
    }
}

export function getLocalStorage(key:string){
    if(typeof window !== "undefined"){
        //console.log(`getting from local storage: ${key}`)
        return localStorage.getItem(key)
    }
    return null
}

export function removeLocalStorage(key: string){
    if(typeof window !== "undefined"){
        localStorage.removeItem(key);
    }
    return
}

function setCookie(name:string, value:string, days:number = 5) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name:string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

function deleteCookie(name: string) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export interface UserInfo{
    username: string,
    avatar: string,
    birthDate: string,
    gender: string,
}
export function setUserInfo(userInfo: UserInfo){
    if(getLocalStorage("cookieConsent") === "true"){
        //用户同意使用cookie
        setCookie("username", userInfo.username)
        setCookie("avatar", userInfo.avatar)
        setCookie("birthDate", userInfo.birthDate)
        setCookie("gender", userInfo.gender)
    }else{
        //用户不同意使用cookie
        //使用localstorage
        setLocalStorage("username", userInfo.username)
        setLocalStorage("avatar", userInfo.avatar)
        setLocalStorage("birthDate", userInfo.birthDate)
        setLocalStorage("gender", userInfo.gender)
    }
}

export function getUserInfo(): UserInfo | null{
    if(getLocalStorage("cookieConsent") === "true"){
        //用户同意使用cookie
        const username = getCookie("username");
        const avatar = getCookie("avatar");
        const birthDate = getCookie("birthDate");
        const gender = getCookie("gender");

        //验证数据是否存在
        if(username !== null && birthDate !== null && gender !== null && avatar !== null){
            return {
                username: username,
                avatar: avatar,
                birthDate: birthDate,
                gender: gender,
            }
        }else{
            return null
        }
    }else{
        //用户不同意使用cookie
        //使用localstorage
        const username = getLocalStorage("username");
        const avatar = getLocalStorage("avatar");
        const birthDate = getLocalStorage("birthDate");
        const gender = getLocalStorage("gender");

        //验证数据是否存在
        if(username !== null && birthDate !== null && gender !== null && avatar !== null){
            return {
                username: username,
                avatar: avatar,
                birthDate: birthDate,
                gender: gender,
            }
        }else{
            return null
        }
    }
}

export function deleteUserInfo(){
    if(getLocalStorage("cookieConsent") === "true"){
        //用户同意使用cookie
        deleteCookie("username");
        deleteCookie("avatar");
        deleteCookie("birthDate");
        deleteCookie("gender");
    }else{
        //用户不同意使用cookie
        //使用localstorage
        removeLocalStorage("username");
        removeLocalStorage("avatar");
        removeLocalStorage("birthDate");
        removeLocalStorage("gender");
    }
}

export function clearCookie(){
    if(typeof window !== "undefined"){
        document.cookie
            .split(';')
            .forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
    }
}

export function reloadWindow(){
    if(typeof window !== "undefined"){
        window.location.reload()
    }
}

//重写一个客制化的Fetch方法
export async function Fetch<T = any>(url: string, options: RequestInit = {}): Promise<any>{
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers:{
            ...(options.headers || {})
        },
    })

    if(res.status == 401){
        //未登录
        //console.log("not logged in!")
        if(typeof window !== "undefined"){
            window.location.href = '/error';
        }
    }
    
    if(!res.ok){
        throw new Error(`Error! Code: ${res.status} from url: ${url}`)
    }

    return res
}