//用户相关接口调用
export type genders = "male" | "female" | "other";
export interface userProfile{
    activities: number[],
    avatar: string,
    birthdate: string,
    content: number[],
    enrollments: number[],
    gender: genders,
    id: number,
    username: string,
}
export async function getUserProfile(): Promise<userProfile> {
    const url = '/backend/my_profile';

    const response = await fetch(url, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error("response error");
    }
    if( response.status === 200 ) {
        return await response.json() as Promise<userProfile>
    }else{
        throw new Error(`internal server error. code: ${response.status}`)
    }
}
