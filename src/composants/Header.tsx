import { startTransition, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router"
import { useLenis } from "lenis/react"
import { LogOut, Menu, Siren, X } from "lucide-react"
import Bouton from "./ui/Bouton"
import { rolesSignalement, useSession } from "../contexte/session"

const classeLien = ({ isActive }: { isActive: boolean }) =>
    `font-display text-xl font-black italic uppercase tracking-wide transition-colors ${isActive ? "text-white [text-shadow:0_0_14px_var(--color-fond-clair)]" : "text-gris-trait/60 hover:text-white"}`

export default function Header() {
    const { utilisateur, chargement, deconnexion } = useSession()
    const navigate = useNavigate()

    const [menuOuvert, setMenuOuvert] = useState(false)

    function seDeconnecter() {
        startTransition(() => {
            navigate("/")
            deconnexion()
        })
    }

    const fermerMenu = () => setMenuOuvert(false)

    // Sur l'accueil, le header reste caché tant que le hero occupe l'écran
    const estAccueil = useLocation().pathname === "/"
    const [surHero, setSurHero] = useState(true)
    useLenis(({ scroll }) => setSurHero(scroll < window.innerHeight * 0.8))
    const cache = estAccueil && surHero

    return (
        <header className={`${estAccueil ? "fixed inset-x-0" : "sticky"} ${cache ? "-translate-y-full opacity-0" : "translate-y-0"} top-0 z-50 transition-[translate,opacity] duration-500 border-b border-rouge-alerte bg-noir/85 text-white shadow-[0_4px_24px_-6px_var(--color-rouge-alerte)] backdrop-blur-md`}>
            <div className="mx-auto flex max-w-[80%] flex-wrap items-center justify-between px-4 py-3 md:px-0">
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
                    <NavLink to="/incidents" className={classeLien}>Incidents</NavLink>
                    <NavLink to="/videotheque" className={classeLien}>Vidéothèque</NavLink>
                    
                    {utilisateur?.role === "Administrateurs" && (
                        <NavLink to="/dashboard-admin" className={`${classeLien} font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white`}>Dashboard Admin</NavLink>
                    )}

                    {!chargement && utilisateur && (
                        <>
                            <NavLink to="/profil" className={`${classeLien} font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white`}>Profil</NavLink>
                            <button type="button" onClick={seDeconnecter} className="inline-flex items-center gap-2 font-display text-xl font-black italic uppercase tracking-wide text-gris-trait/60 transition-colors hover:text-rouge-alerte">
                                <LogOut size={18} strokeWidth={2.5} />
                                Déconnexion
                            </button>
                            {rolesSignalement.includes(utilisateur.role) && (
                                <Bouton to="/profil/signaler-incidents" className="rounded-md border border-rouge-alerte px-5 py-2 font-display text-lg font-bold uppercase hover:bg-rouge-profond" icone={Siren}>
                                    Signaler un incident
                                </Bouton>
                            )}
                        </>
                    )}

                    {!chargement && !utilisateur && (
                        <Bouton to="/connexion" variante="secondaire" className="rounded-md bg-rouge-alerte px-5 py-2 font-display text-lg font-bold uppercase hover:bg-rouge-profond">
                            Connexion
                        </Bouton>
                    )}
                
                </nav>
            </div>
        </header>
    )
}