export async function GetVideo(videoPath:any){
    // 假设后端API为 '/video/<filename>'
    const url = '/video/'
    console.log(`${url}${videoPath}`)
    const response = await fetch(`${url}${videoPath}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            "Accept": "*/*",
            "Connection": "keep-alive"
        },
    })
    return response
}