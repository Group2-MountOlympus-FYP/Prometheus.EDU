import { Profile } from "../Profile";

export default async function Page({ params }: { params: { user_id: string } }) {
    const profileParams = await params;
    return <Profile id={parseInt(profileParams.user_id)}></Profile>
}