'use client'

import { Button } from "@mantine/core";
import { getText } from "./language";
import { useRouter } from 'next/navigation'

export default function error(){
    const router = useRouter()

    const handleLogin = () => {
        router.push('/') 
    }
    return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>{getText("youAreNotLogin")}</h1>
        <p>{getText("loginFirst")}</p>
        <Button mt="md" radius="xl" onClick={handleLogin}>
            {getText("goToLogin")}
        </Button>
    </div>
    )
}