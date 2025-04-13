export async function GetCSRF() {
    const url = '/backend/login/get_csrf';
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const data = await response.json();

        setLocalStorage("csrf_token", data.csrf_token)
        console.log(data.csrf_token)
        return true; // 成功时返回 true
    } catch (error) {
        console.log(error);
        return false; // 失败时返回 false
    }
}

export function GetCookie(name:string) {
    if(typeof window !== undefined){
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue); // 解码值
            }
        }
    }
    return null; // 如果未找到，返回 null
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

export function getLocalStorage(key:any){
    if(typeof window !== "undefined"){
        //console.log(`getting from local storage: ${key}`)
        return localStorage.getItem(key)
    }
    return null
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

export function windowRedirect(target:any){
    if(typeof window !== "undefined"){
        window.location.href = target
    }
}

export function reloadWindow(){
    if(typeof window !== "undefined"){
        window.location.reload()
    }
}

export function lockOverflow(){
    if(typeof document !== 'undefined'){
        document.body.style.overflow = 'hidden'
    }
}

export function unlockOverflow(){
    if(typeof document !== 'undefined'){
        document.body.style.overflow = 'auto'
    }
}