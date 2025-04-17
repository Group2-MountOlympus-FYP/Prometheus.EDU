'use client'

import { FooterSimple } from "@/components/FooterSimple/FooterSimple"
import Header from "@/components/HeaderMenu/Header"
import { LoadingContext } from "@/components/Contexts/LoadingContext"
import { useContext } from "react"
import { LoadingOverlay } from "@mantine/core"

export function AppShell({ children }: { children: React.ReactNode }){
    const { isLoading } = useContext(LoadingContext)

    return(
        <div>
                <LoadingOverlay visible={isLoading} zIndex={9999} loaderProps={{ color: '#777CB9', type: 'bars' }}
                overlayProps={{ radius: 'sm', blur: 10 }}></LoadingOverlay> :
                <div>
                    <Header/>
                    <div style={{marginTop: '7vh', marginBottom:'10vh'}}>
                        {children}
                    </div>
                    <FooterSimple/>
                </div>            
        </div>
    )
}