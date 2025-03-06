'use client'
import { useState, useEffect } from "react"
import { setLanguage, getLanguage } from "@/app/language"
import { ActionIcon } from "@mantine/core"
import Flag from 'react-world-flags'
import { reloadWindow } from "@/app/api/General"

export function LanguageSwitcher(){
    const [showEN, setShowEN] = useState(true)
    
    const handleLanguageSwitch = () => {
        if(getLanguage() == 'zh'){
            setLanguage('en')
        }else{
            setLanguage('zh')
        }
        //console.log(getLanguage())
        reloadWindow()
    }

    useEffect(() => {
        //页面加载的钩子设定语言切换按钮
        if(getLanguage() == 'zh'){
            setShowEN(false)
        }
        else{
            setShowEN(true)
        }
    }, [])

    return (
        <div>
            <ActionIcon 
            onClick={handleLanguageSwitch}
            variant="default"
            aria-label="Toggle Switch Language"
            style={{width: 50, height: 50, padding: 3}}>
                <Flag code={showEN ? "GB" : "CN"} className="flag" />
            </ActionIcon>
        </div>
    )
}