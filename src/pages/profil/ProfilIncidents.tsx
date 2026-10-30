import { useEffect, useState, type FormEvent } from "react"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"

interface Intervention {
    id: number
    statut: "En_Cours" | "Reussie" | "Echouee"
    super_heros: { pseudo: string | null }
    notes: { note: number, commentaire: string | null, reponse_heros: string | null }[]
}

interface Incident {
    id: number
    type: string
    status: "Signale" | "En_Cours" | "Reussi" | "Echoue" | "Supprime"
    description: string | null
    adresse: string
    ville: string
    createdAt: string
    interventions: Intervention[]
}

const nomsStatuts = {
    Signale: "Signalé",
    En_Cours: "En cours",
    Reussi: "Résolu",
    Echoue: "Échoué",
    Supprime: "Supprimé",
}

const nomsStatutsIntervention = {
    En_Cours: "En cours",
    Reussie: "Réussie",
    Echouee: "Échouée",
}

function etoiles(note: number) {
    return "★".repeat(note) + "☆".repeat(5 - note)
}

// Formulaire pour noter le héros d'une intervention terminée
function FormulaireNote({ interventionId, onNote }: { interventionId: number, onNote: () => void }) {
    const [note, setNote] = useState(0)
    const [commentaire, setCommentaire] = useState("")
    const [erreur, setErreur] = useState("")

    async function envoyer(e: FormEvent) {
        e.preventDefault()
        if (note === 0) {
            setErreur("Choisis une note entre 1 et 5")
            return
        }
        try {
            await appelApi("/moi/notes", "POST", { interventionId, note, commentaire })
            onNote()
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <form onSubmit={envoyer} className="mt-3 flex flex-col gap-3">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((valeur) => (
                    <button
                        key={valeur}
                        type="button"
                        onClick={() => setNote(valeur)}
                        aria-label={`${valeur} sur 5`}
                        className={`cursor-pointer text-3xl transition-colors ${valeur <= note ? "text-ambre" : "text-gris-texte hover:text-ambre/60"}`}
                    >
                        ★
                    </button>
                ))}
            </div>
            <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={2}
                placeholder="Un commentaire sur l'intervention (facultatif)"
                className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte resize-y"
            />
            {erreur && <p role="alert" className="text-sm! text-rouge-alerte">{erreur}</p>}
            <Bouton type="submit" variante="secondaire" className="self-start">Noter</Bouton>
        </form>
    )
}

export default function ProfilIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    function charger() {
        appelApi("/moi/incidents")
            .then((donnees) => setIncidents(donnees.incidents))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }

    useEffect(charger, [])

    if (chargement) return <p className="text-gris-trait/70">Chargement…</p>
    if (erreur) return <p role="alert" className="text-rouge-alerte">{erreur}</p>

    if (incidents.length === 0) {
        return (
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-gris-texte/40 bg-graphite p-8 text-left">
                <p className="text-gris-trait/80">Tu n'as encore signalé aucun incident.</p>
                <Bouton to="/profil/signaler-incidents">Signaler un incident</Bouton>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Mes incidents</h1>

            {incidents.map((incident) => (
                <article key={incident.id} className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="font-display text-2xl font-black italic uppercase text-white">{incident.type}</h2>
                            <p className="text-sm! text-gris-trait/60">
                                {incident.adresse}, {incident.ville} — le {new Date(incident.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                        <span className="rounded-full bg-fond-clair px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.2em] text-noir">
                            {nomsStatuts[incident.status]}
                        </span>
                    </div>

                    {incident.description && <p className="text-gris-trait/80">{incident.description}</p>}

                    {incident.interventions.length === 0 ? (
                        <p className="text-sm! text-gris-trait/60">Aucun héros n'est encore intervenu.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {incident.interventions.map((intervention) => (
                                <li key={intervention.id} className="rounded-xl border border-gris-texte/40 bg-noir p-4">
                                    <p className="text-fond-clair">
                                        <span className="font-semibold text-white">{intervention.super_heros.pseudo}</span>
                                        {" "}— intervention {nomsStatutsIntervention[intervention.statut].toLowerCase()}
                                    </p>

                                    {intervention.notes.length > 0 ? (
                                        <div className="mt-2 text-sm text-gris-trait/80">
                                            <p><span className="text-ambre">{etoiles(intervention.notes[0].note)}</span> {intervention.notes[0].commentaire}</p>
                                            {intervention.notes[0].reponse_heros && (
                                                <p className="mt-1 italic">Réponse du héros : {intervention.notes[0].reponse_heros}</p>
                                            )}
                                        </div>
                                    ) : (
                                        intervention.statut !== "En_Cours" && <FormulaireNote interventionId={intervention.id} onNote={charger} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </article>
            ))}
        </div>
    )
}
