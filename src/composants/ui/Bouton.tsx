import type { ReactNode } from "react"
import { Link } from "react-router"
import type { LucideIcon } from "lucide-react"

interface BoutonProps {
    children: ReactNode
    variante?: "principal" | "secondaire"
    icone?: LucideIcon
    to?: string
    type?: "button" | "submit"
    onClick?: () => void
    disabled?: boolean
    className?: string
}

const styles = {
    principal: "bg-rouge-alerte text-white glow-rouge hover:bg-rouge-profond",
    secondaire: "border border-gris-trait/70 text-white hover:border-white hover:bg-white/5",
}

export default function Bouton({ children, variante = "principal", icone: Icone, to, type = "button", onClick, disabled, className = "" }: BoutonProps) {
    const classes = `cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-display text-lg font-black italic uppercase tracking-wide transition-colors disabled:opacity-50 ${styles[variante]} ${className}`
    const contenu = (
        <>
            {Icone && <Icone size={18} strokeWidth={2.5} />}
            {children}
        </>
    )

    return to ? (
        <Link to={to} onClick={onClick} className={classes}>{contenu}</Link>
    ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>{contenu}</button>
    )
}
