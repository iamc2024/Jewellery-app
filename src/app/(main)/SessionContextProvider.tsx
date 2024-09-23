'use client'


import type { Session, User } from "lucia"
import type { User as UserData } from '@prisma/client';


import { createContext, useContext } from "react"

interface SessionContextType {
    user: User
    session: Session
    userData: UserData
}

const SessionContext = createContext<SessionContextType | null>(null)


const SessionContextProvider = ({ children, value }: React.PropsWithChildren<{value:SessionContextType}>) => {
    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionContextProvider

export const useSessionContext = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionContextProvider")
    }
    return context
}