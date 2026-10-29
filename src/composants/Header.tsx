import { startTransition, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Menu, X } from "lucide-react"
import { useSession } from "../contexte/session"

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

    return (
        <header className="sticky top-0 z-50 border-b-2 border-rouge-alerte bg-noir text-white">
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
                    <Link to="/super-heros" className="font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white">Super Héros</Link>
                    <Link to="/super-vilains" className="font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white">Super Vilains</Link>
                    
                    {utilisateur?.role === "Administrateurs" && (
                        <Link to="/dashboard-admin" className="font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white">Dashboard Admin</Link>
                    )}

                    {!chargement && utilisateur && (
                        <>
                            <Link to="/profil" className="font-display text-lg font-bold uppercase text-gris-trait/70 transition-colors hover:text-white">Profil</Link>
                            <button type="button" onClick={seDeconnecter}>Déconnexion</button>
                            <Link to="/profil/signaler-incidents" className="rounded-md border border-rouge-alerte px-5 py-2 font-display text-lg font-bold uppercase hover:bg-rouge-profond">
                                Signaler un incident
                            </Link>
                        </>
                    )}

                    {!chargement && !utilisateur && (
                        <Link to="/connexion" className="rounded-md bg-rouge-alerte px-5 py-2 font-display text-lg font-bold uppercase hover:bg-rouge-profond">
                            Connexion
                        </Link>
                    )}
                
                </nav>
            </div>
        </header>
    )
}