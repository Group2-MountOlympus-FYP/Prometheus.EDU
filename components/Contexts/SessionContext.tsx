'use client'
import React, { createContext, useState } from "react";

interface SessionContext{
    isLogin: boolean,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SessionContext = createContext<SessionContext>({
    isLogin: false,
    setIsLogin: () => {}
})

export function SessionContextProvider({children}: {children:React.ReactNode}){
    const [isLogin, setIsLogin] = useState<boolean>(false)

    return (
        <SessionContext.Provider value={{isLogin, setIsLogin}}>
            {children}
        </SessionContext.Provider>
    )
}