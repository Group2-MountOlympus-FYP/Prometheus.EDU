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
        document.cookie = `csrf_token=${data.csrf_token}; path=/; Secure; SameSite=Strict`;
        return true; // 成功时返回 true
    } catch (error) {
        console.log(error);
        return false; // 失败时返回 false
    }
}

export function GetCookie(name:string) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue); // 解码值
        }
    }
    return null; // 如果未找到，返回 null
}

export async function GetUsername(id:number) {
    const url = '/login/get_user_name_by_id'
    const data = id
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            "Accept": "*/*",
            "Connection": "keep-alive"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(!response.ok){
            throw new Error('Network error')
        }
        return response.json()
    }).then(data => {
        console.log(data.username)
        return data.username
    })
}