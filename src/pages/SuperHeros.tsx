import { useEffect, useState } from "react"
import GrilleHeros, { type Heros } from "../composants/GrilleHeros"
import Chargement from "../composants/ui/Chargement"
import { appelApi } from "../services/api"

export default function SuperHeros() {
    const [heros, setHeros] = useState<Heros[] | null>(null)
    const [erreur, setErreur] = useState(false)
    const [recherche, setRecherche] = useState("")

    useEffect(() => {
        appelApi("/heros")
            .then((donnees) => setHeros(donnees.heros))
            .catch(() => setErreur(true))
    }, [])

    const herosFiltres = heros?.filter((h) => h.pseudo.toLowerCase().includes(recherche.trim().toLowerCase()))

    return (
        <section className="mx-auto py-16 text-left md:py-24">
            <h1 className="text-white">
                Annuaire des <span className="text-rouge-alerte texte-glow-rouge">Héros</span>
            </h1>

            <p className="mt-6 text-gris-trait/70">
                Retrouve tous les héros de la ville, leur note et leurs missions réussies.
            </p>

            <input
                type="search"
                aria-label="Rechercher un héros"
                placeholder="Rechercher un héros"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="mt-8 w-full max-w-md rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair scheme-dark outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge"
            />

            {heros === null && !erreur && <Chargement />}
            {erreur && <p className="mt-8 text-gris-trait/70 md:mt-12">Impossible de charger les héros pour le moment.</p>}
            {heros?.length === 0 && <p className="mt-8 text-gris-trait/70 md:mt-12">Aucun héros pour le moment.</p>}
            {heros && heros.length > 0 && herosFiltres?.length === 0 && <p className="mt-8 text-gris-trait/70 md:mt-12">Aucun héros ne correspond à ta recherche.</p>}
            {herosFiltres && herosFiltres.length > 0 && <GrilleHeros heros={herosFiltres} deployee />}
        </section>
    )
}
