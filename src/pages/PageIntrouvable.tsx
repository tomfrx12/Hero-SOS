import { Link } from "react-router"
import Bouton from "../composants/ui/Bouton"

export default function PageIntrouvable() {
    return (
        <section className="mx-auto flex flex-col items-center gap-8 py-24 text-center">
            <p className="font-display text-[clamp(6rem,20vw,12rem)] font-black italic leading-none text-rouge-alerte texte-glow-rouge">
                404
            </p>
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl text-white md:text-5xl">Page introuvable</h1>
                <p className="text-gris-trait/70">
                    Cette page n'existe pas ou a été déplacée.
                </p>
            </div>
            <Bouton to="/">Retour à l'accueil</Bouton>
            <p className="text-sm text-gris-trait/50">
                En cas d'urgence réelle, appelez le <span>112</span>.
            </p>
        </section>
    )
}
