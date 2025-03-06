export async function GetCSRF() {
    const url = '/login/get_csrf';
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                "Accept": "*/*",
                "Connection": "keep-alive"
            },
            redirect: "follow",
            referrerPolicy: 'no-referrer',
        });
        const data = await response.json();

        if(typeof window !== undefined){
            document.cookie = `csrf_token=${data.csrf_token}; path=/; Secure; SameSite=Strict`;
        }
        
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