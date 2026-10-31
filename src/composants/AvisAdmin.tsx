import { useState, type ReactNode } from "react"
import Bouton from "./ui/Bouton"
import { appelApi } from "../services/api"

export interface Avis {
    id: number
    note: number
    commentaire: string | null
    reponse_heros: string | null
    enLigne: boolean
    createdAt: string
}

export default function AvisAdmin({ avis, contexte, onChanger }: { avis: Avis, contexte: ReactNode, onChanger: (enLigne: boolean) => void }) {
    const [erreur, setErreur] = useState("")

    async function changerVisibilite() {
        setErreur("")
        try {
            await appelApi(`/admin/avis/${avis.id}`, "PATCH", { enLigne: !avis.enLigne })
            onChanger(!avis.enLigne)
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-2xl border bg-noir p-5 border-gris-texte/40">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className={avis.enLigne ? "" : "opacity-60"}>
                    <p className="text-ambre">{"★".repeat(avis.note) + "☆".repeat(5 - avis.note)}</p>
                    <p className="text-sm! text-gris-trait/70">{contexte} — le {new Date(avis.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <Bouton variante="secondaire" onClick={changerVisibilite}>{avis.enLigne ? "Masquer" : "Remettre en ligne"}</Bouton>
            </div>
            <div className={avis.enLigne ? "" : "opacity-60"}>
                {!avis.enLigne && <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rouge-alerte">Masqué</p>}
                {avis.commentaire ? <p className="text-fond-clair">« {avis.commentaire} »</p> : <p className="text-gris-trait/50">Pas de commentaire.</p>}
                {avis.reponse_heros && <p className="mt-2 text-sm! italic text-gris-trait/70">Réponse du héros : {avis.reponse_heros}</p>}
            </div>
            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
        </div>
    )
}
