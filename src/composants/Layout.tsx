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
        <main>{children}</main>
        <Footer/>
        </>
    )
}