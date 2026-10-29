import { Link } from "react-router"
import { Mail } from "lucide-react"
import { useSession } from "../contexte/session"

export default function Footer() {
    const { utilisateur, chargement } = useSession()

    return (
        <footer className="mt-auto border-t-2 border-rouge-alerte bg-noir text-white">
            <div className="mx-auto grid max-w-[80%] gap-10 px-4 py-12 text-left md:grid-cols-[1fr_2fr_1fr] md:px-8">
                <div className="flex flex-col">
                    <Link to="/">
                        <img src="/logo.webp" alt="Héros SOS" className="h-40 w-40" />
                    </Link>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="mb-1 font-display font-bold uppercase text-rouge-alerte">Newsletter</span>
                    <form className="flex flex-col gap-2 sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-graphite bg-graphite px-3 focus-within:border-rouge-alerte">
                            <Mail size={18} className="text-gris-trait/70" />
                            <input type="email" required placeholder="votre@email.fr" className="w-full bg-transparent py-2 outline-none placeholder:text-gris-trait/40"/>
                        </div>
                        <button type="submit" className="rounded-md bg-rouge-alerte px-5 py-2 font-display font-bold uppercase hover:bg-rouge-profond">
                            S'inscrire
                        </button>
                    </form>
                </div>
                
                <nav className="flex flex-col items-center gap-3">
                    <span className="mb-1 font-display font-bold uppercase text-rouge-alerte">Navigation</span>
                    <Link to="/super-heros" className="text-gris-trait/70 transition-colors hover:text-white">Super Héros</Link>
                    <Link to="/super-vilains" className="text-gris-trait/70 transition-colors hover:text-white">Super Vilains</Link>
                    {!chargement && utilisateur && (
                        <Link to="/profil/signaler-incidents" className="text-gris-trait/70 transition-colors hover:text-white">Signaler un incident</Link>
                    )}
                    {!chargement && !utilisateur && (
                        <Link to="/connexion" className="text-gris-trait/70 transition-colors hover:text-white">Connexion</Link>
                    )}
                    <Link to="/mentions-legales" className="text-gris-trait/70 transition-colors hover:text-white">Mentions légales</Link>
                </nav>
            </div>
            
            <div className="flex justify-between mx-auto max-w-[80%] text-gris-trait/50 py-4">
                <div>
                    Copyright © {new Date().getFullYear()} Héros SOS - Web 4 Heroes
                </div>
                <div>
                    Réalisé par {" "}
                    <a href="https://tom-fourneaux.fr" target="_blank" className="underline hover:text-rouge-profond">
                        Tom Fourneaux
                    </a> 
                    {" "}et{" "}
                    <a href="https://nino-rameau.fr" target="_blank" className="underline hover:text-rouge-profond">
                        Nino Rameau
                    </a>
                </div>
            </div>
        </footer>
    )
}
