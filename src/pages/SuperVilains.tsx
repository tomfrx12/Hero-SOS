import { useEffect, useState } from "react"
import CarteHeros from "../composants/ui/CarteHeros"
import FenetreInfos from "../composants/ui/FenetreInfos"
import Chargement from "../composants/ui/Chargement"
import { appelApi } from "../services/api"

interface Vilain {
    id: number
    pseudo: string
    photo?: string | null
    specialite: string
    secteur: string
    description: string | null
    nombre_incidents?: number
    nombre_arrestations: number
}

const accents = ["var(--color-rouge-alerte)", "var(--color-violet-neon)", "var(--color-ambre)"]

function statsVilain(v: Vilain) {
    return [{ valeur: v.nombre_incidents != null ? String(v.nombre_incidents) : "–", libelle: "Incidents" }]
}

export default function SuperVilains() {
    const [vilains, setVilains] = useState<Vilain[] | null>(null)
    const [erreur, setErreur] = useState(false)
    const [selection, setSelection] = useState<number | null>(null)
    const [recherche, setRecherche] = useState("")

    useEffect(() => {
        appelApi("/vilains")
            .then((donnees) => setVilains(donnees.vilains))
            .catch(() => setErreur(true))
    }, [])

    const vilainsFiltres = vilains?.filter((v) => v.pseudo.toLowerCase().includes(recherche.trim().toLowerCase()))
    const indexSelection = vilainsFiltres?.findIndex((v) => v.id === selection) ?? -1
    const selectionne = vilainsFiltres?.[indexSelection]

    return (
        <section className="mx-auto py-16 text-left md:py-24">
            <h1 className="text-white">
                Annuaire des <span className="text-rouge-alerte texte-glow-rouge">Vilains</span>
            </h1>

            <p className="mt-6 text-gris-trait/70">
                Retrouve tous les vilains de la ville et le nombre d'incidents qui leur sont attribués.
            </p>

            <input
                type="search"
                aria-label="Rechercher un vilain"
                placeholder="Rechercher un vilain"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="mt-8 w-full max-w-md rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair scheme-dark outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge"
            />

            {vilains === null && !erreur && <Chargement />}
            {erreur && <p className="mt-8 text-gris-trait/70 md:mt-12">Impossible de charger les vilains pour le moment.</p>}
            {vilains?.length === 0 && <p className="mt-8 text-gris-trait/70 md:mt-12">Aucun vilain pour le moment.</p>}
            {vilains && vilains.length > 0 && vilainsFiltres?.length === 0 && <p className="mt-8 text-gris-trait/70 md:mt-12">Aucun vilain ne correspond à ta recherche.</p>}
            {vilainsFiltres && vilainsFiltres.length > 0 && (
                <div className="mt-8 grid gap-5 md:mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {vilainsFiltres.map((v, i) => (
                        <CarteHeros
                            key={v.id}
                            deployee
                            onClick={() => setSelection(v.id)}
                            nom={v.pseudo}
                            photo={v.photo ?? undefined}
                            accent={accents[i % accents.length]}
                            stats={statsVilain(v)}
                        />
                    ))}
                </div>
            )}

            {selectionne && (
                <FenetreInfos
                    nom={selectionne.pseudo}
                    photo={selectionne.photo ?? undefined}
                    accent={accents[indexSelection % accents.length]}
                    stats={statsVilain(selectionne)}
                    infos={[
                        { libelle: "Spécialité", valeur: selectionne.specialite },
                        { libelle: "Secteur", valeur: selectionne.secteur },
                        { libelle: "Arrestations", valeur: String(selectionne.nombre_arrestations) },
                        ...(selectionne.description ? [{ libelle: "Description", valeur: selectionne.description }] : []),
                    ]}
                    onFermer={() => setSelection(null)}
                />
            )}
        </section>
    )
}
