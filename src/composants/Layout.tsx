import type { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

export interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
        <Header/>
        <main className="mx-auto w-full max-w-[80%] py-10">
            {children}
        </main>
        <Footer/>
        </>
    )
}