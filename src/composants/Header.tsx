import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { useLenis } from "lenis/react"
import { Menu, Siren, X } from "lucide-react"
import Bouton from "./ui/Bouton"

const classeLien = ({ isActive }: { isActive: boolean }) =>
    `font-display text-xl font-black italic uppercase tracking-wide transition-colors ${isActive ? "text-white [text-shadow:0_0_14px_var(--color-fond-clair)]" : "text-gris-trait/60 hover:text-white"}`

export default function Header() {
    
    const estConnecte: boolean = true
    const role: string = "admin"

    const [menuOuvert, setMenuOuvert] = useState(false)

    const fermerMenu = () => setMenuOuvert(false)

    // Sur l'accueil, le header reste caché tant que le hero occupe l'écran
    const estAccueil = useLocation().pathname === "/"
    const [surHero, setSurHero] = useState(true)
    useLenis(({ scroll }) => setSurHero(scroll < window.innerHeight * 0.8))
    const cache = estAccueil && surHero

    return (
        <header className={`${estAccueil ? "fixed inset-x-0" : "sticky"} ${cache ? "-translate-y-full opacity-0" : "translate-y-0"} top-0 z-50 transition-[translate,opacity] duration-500 border-b border-rouge-alerte bg-noir/85 text-white shadow-[0_4px_24px_-6px_var(--color-rouge-alerte)] backdrop-blur-md`}>
            <div className="mx-auto flex max-w-[80%] flex-wrap items-center justify-between px-4 py-3 md:px-8">
                <Link to="/" onClick={fermerMenu}>
                    <img src="/logo.webp" alt="Héros SOS" className="h-14 w-14 md:h-16 md:w-16" />
                </Link>

                <button type="button" onClick={() => setMenuOuvert(!menuOuvert)} className="md:hidden">
                    {menuOuvert ? <X size={28} /> : <Menu size={28} />}
                </button>

                <nav
                    onClick={fermerMenu}
                    className={`${menuOuvert ? "flex" : "hidden"} w-full flex-col items-start gap-4 pt-4 md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:pt-0`}
                >
                    <NavLink to="/super-heros" className={classeLien}>Super Héros</NavLink>
                    <NavLink to="/super-vilains" className={classeLien}>Super Vilains</NavLink>
                    
                    {role === "admin" && (
                        <NavLink to="/dashboard-admin" className={classeLien}>Dashboard Admin</NavLink>
                    )}
                    
                    {estConnecte ? (
                        <>
                            <NavLink to="/profil" className={classeLien}>Profil</NavLink>
                            <Bouton to="/profil/signaler-incidents" icone={Siren}>
                                Signaler un incident
                            </Bouton>
                        </>
                    ) : (
                        <Bouton to="/connexion" variante="secondaire">
                            Connexion
                        </Bouton>
                    )}
                
                </nav>
            </div>
        </header>
    )
}