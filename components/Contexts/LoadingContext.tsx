'use client'
import React, { createContext, useState } from "react";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }

export const LoadingContext = createContext<LoadingContextType>({
    isLoading: true,
    setIsLoading: () => {}
})

export function LoadingContextProvider({children}: {children:React.ReactNode}){
    const [isLoading, setIsLoading] = useState<boolean>(true)

    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading}}>
            {children}
        </LoadingContext.Provider>
    )
}