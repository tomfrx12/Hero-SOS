import { useEffect, useState, type FormEvent } from "react"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"

interface Avis {
    id: number
    note: number
    commentaire: string | null
    reponse_heros: string | null
    createdAt: string
    citoyen: { prenom: string }
    intervention: { incident: { type: string, ville: string } }
}

// Formulaire pour répondre à un avis qui n'a pas encore de réponse
function FormulaireReponse({ avisId, onReponse }: { avisId: number, onReponse: () => void }) {
    const [reponse, setReponse] = useState("")
    const [erreur, setErreur] = useState("")

    async function envoyer(e: FormEvent) {
        e.preventDefault()
        try {
            await appelApi(`/moi/notes/${avisId}/reponse`, "PATCH", { reponse })
            onReponse()
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <form onSubmit={envoyer} className="mt-3 flex flex-col gap-3">
            <textarea
                required
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                rows={2}
                placeholder="Répondre à ce citoyen"
                className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte resize-y"
            />
            {erreur && <p role="alert" className="text-sm! text-rouge-alerte">{erreur}</p>}
            <Bouton type="submit" variante="secondaire" className="self-start">Répondre</Bouton>
        </form>
    )
}

export default function ProfilReputation() {
    const [avis, setAvis] = useState<Avis[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    function charger() {
        appelApi("/moi/reputation")
            .then((donnees) => setAvis(donnees.notes))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }

    useEffect(charger, [])

    if (chargement) return <p className="text-gris-trait/70">Chargement…</p>
    if (erreur) return <p role="alert" className="text-rouge-alerte">{erreur}</p>

    let total = 0
    for (const unAvis of avis) {
        total += unAvis.note
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <div>
                <h1 className="text-4xl text-white">Ma réputation</h1>
                <p className="mt-2 text-gris-trait/70">
                    {avis.length > 0
                        ? `${(total / avis.length).toFixed(1)} / 5 sur ${avis.length} avis`
                        : "Aucun avis pour le moment."}
                </p>
            </div>

            {avis.map((unAvis) => (
                <article key={unAvis.id} className="rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-2xl text-ambre">{"★".repeat(unAvis.note) + "☆".repeat(5 - unAvis.note)}</span>
                        <span className="text-sm text-gris-trait/60">
                            {unAvis.citoyen.prenom} — {unAvis.intervention.incident.type}, {unAvis.intervention.incident.ville} — le {new Date(unAvis.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                    </div>
                    {unAvis.commentaire && <p className="mt-3 text-fond-clair">{unAvis.commentaire}</p>}

                    {unAvis.reponse_heros ? (
                        <p className="mt-3 border-l-2 border-rouge-alerte pl-3 text-sm italic text-gris-trait/80">
                            Ta réponse : {unAvis.reponse_heros}
                        </p>
                    ) : (
                        <FormulaireReponse avisId={unAvis.id} onReponse={charger} />
                    )}
                </article>
            ))}
        </div>
    )
}
