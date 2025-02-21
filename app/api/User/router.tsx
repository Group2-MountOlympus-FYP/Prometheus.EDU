//用户相关接口调用

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

export async function getUserProfile() {
    const url = '/my_profile';
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                "Accept": "*/*",
                "Connection": "keep-alive"
            },
        });

        // 检查响应状态码
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析并返回数据
        const data = await response.json();
        return { data, status: response.status };

    } catch (error) {
        console.error('Network error:', error);
        throw new Error('Network Error!');
    }
}
