import { useState } from "react"
import CarteHeros from "./ui/CarteHeros"
import FenetreInfos from "./ui/FenetreInfos"

export interface Heros {
    id: number
    pseudo: string
    photo: string | null
    note_moyenne: number | null
    nombre_avis: number
    missions_reussies: number
    missions_echouees: number
    missions_en_cours: number
    email: string
    numero_tel: string
    ville: string
    pays: string
    membre_depuis: string
    avis: { note: number, commentaire: string | null, reponse_heros: string | null, createdAt: string }[]
}

const accents = ["var(--color-cyan-neon)", "var(--color-rouge-alerte)", "var(--color-violet-neon)", "var(--color-ambre)"]

function statsHeros(h: Heros) {
    return [
        { valeur: h.note_moyenne != null ? h.note_moyenne.toFixed(1).replace(".", ",") : "–", suffixe: "/5", libelle: `${h.nombre_avis} avis` },
        { valeur: String(h.missions_reussies), libelle: "Missions réussies" },
    ]
}

export default function GrilleHeros({ heros, deployee }: { heros: Heros[], deployee?: boolean }) {
    const [selection, setSelection] = useState<number | null>(null)
    const indexSelection = heros.findIndex((h) => h.id === selection)
    const selectionne = heros[indexSelection]

    return (
        <>
            <div className={`${deployee ? "lg:grid-cols-6" : "grille-heros lg:grid-cols-4"} mt-8 grid gap-5 md:mt-12 sm:grid-cols-2`}>
                {heros.map((h, i) => (
                    <CarteHeros
                        key={h.id}
                        deployee={deployee}
                        onClick={() => setSelection(h.id)}
                        nom={h.pseudo}
                        photo={h.photo ?? undefined}
                        accent={accents[i % accents.length]}
                        stats={statsHeros(h)}
                    />
                ))}
            </div>

            {selectionne && (
                <FenetreInfos
                    nom={selectionne.pseudo}
                    photo={selectionne.photo ?? undefined}
                    accent={accents[indexSelection % accents.length]}
                    stats={statsHeros(selectionne)}
                    infos={[
                        { libelle: "E-mail", valeur: selectionne.email },
                        { libelle: "Téléphone", valeur: selectionne.numero_tel },
                        { libelle: "Localisation", valeur: `${selectionne.ville}, ${selectionne.pays}` },
                        { libelle: "Membre depuis", valeur: new Date(selectionne.membre_depuis).toLocaleDateString("fr-FR") },
                        { libelle: "Missions en cours", valeur: String(selectionne.missions_en_cours) },
                        { libelle: "Missions échouées", valeur: String(selectionne.missions_echouees) },
                    ]}
                    onFermer={() => setSelection(null)}
                >
                    {selectionne.avis.length > 0 && (
                        <div className="relative mt-8 w-full text-left">
                            <h3 className="text-white">Avis</h3>
                            <ul className="mt-4 flex flex-col gap-4">
                                {selectionne.avis.map((avis, i) => (
                                    <li key={i} className="rounded-xl border border-gris-texte/60 bg-noir p-4">
                                        <div className="flex justify-between gap-4">
                                            <span className="font-display text-xl font-black text-white">{avis.note}<span className="text-sm text-gris-trait/60">/5</span></span>
                                            <span className="text-xs text-gris-trait/60">{new Date(avis.createdAt).toLocaleDateString("fr-FR")}</span>
                                        </div>
                                        {avis.commentaire && <p className="mt-2 text-gris-trait/80">{avis.commentaire}</p>}
                                        {avis.reponse_heros && <p className="mt-2 border-l-2 border-(--accent) pl-3 text-gris-trait/70">{avis.reponse_heros}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </FenetreInfos>
            )}
        </>
    )
}
