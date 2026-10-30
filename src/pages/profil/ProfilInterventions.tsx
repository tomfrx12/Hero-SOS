import { useEffect, useState } from "react"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"

interface Intervention {
    id: number
    statut: "En_Cours" | "Reussie" | "Echouee"
    debut: string
    fin: string | null
    incident: {
        id: number
        type: string
        urgence: "Haute" | "Normale" | "Basse"
        description: string | null
        adresse: string
        ville: string
        vilains: { vilain: { pseudo: string } }[]
    }
}

const nomsStatuts = { En_Cours: "En cours", Reussie: "Réussie", Echouee: "Échouée" }
const nomsUrgences = { Haute: "Élevée", Normale: "Normale", Basse: "Basse" }

export default function ProfilInterventions() {
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    function charger() {
        appelApi("/moi/interventions")
            .then((donnees) => setInterventions(donnees.interventions))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }

    useEffect(charger, [])

    // Le héros indique comment s'est terminée son intervention
    async function terminer(incidentId: number, resultat: "Reussie" | "Echouee") {
        try {
            await appelApi(`/incidents/${incidentId}/intervention`, "PATCH", { resultat })
            charger()
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    if (chargement) return <p className="text-gris-trait/70">Chargement…</p>

    const enCours = interventions.find((intervention) => intervention.statut === "En_Cours")
    const terminees = interventions.filter((intervention) => intervention.statut !== "En_Cours")

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Mes interventions</h1>
            {erreur && <p role="alert" className="text-rouge-alerte">{erreur}</p>}

            {enCours ? (
                <article className="flex flex-col gap-4 rounded-2xl border border-rouge-alerte bg-graphite p-6 glow-rouge sm:p-8">
                    <span className="self-start rounded-full bg-rouge-alerte px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.2em] text-white">
                        Intervention en cours
                    </span>
                    <div>
                        <h2 className="font-display text-2xl font-black italic uppercase text-white">{enCours.incident.type}</h2>
                        <p className="text-sm! text-gris-trait/60">
                            {enCours.incident.adresse}, {enCours.incident.ville} — depuis le {new Date(enCours.debut).toLocaleString("fr-FR")}
                        </p>
                    </div>
                    {enCours.incident.description && <p className="text-gris-trait/80">{enCours.incident.description}</p>}
                    <p className="text-sm! text-gris-trait/80">
                        Priorité : {nomsUrgences[enCours.incident.urgence]} — Vilain : {enCours.incident.vilains[0]?.vilain.pseudo ?? "Inconnu"}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Bouton onClick={() => terminer(enCours.incident.id, "Reussie")}>Mission réussie</Bouton>
                        <Bouton variante="secondaire" onClick={() => terminer(enCours.incident.id, "Echouee")}>Mission échouée</Bouton>
                    </div>
                </article>
            ) : (
                <div className="flex flex-col items-start gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6 sm:p-8">
                    <p className="text-gris-trait/80">Tu n'as aucune intervention en cours.</p>
                    <Bouton to="/incidents">Voir les incidents</Bouton>
                </div>
            )}

            {terminees.length > 0 && (
                <>
                    <h2 className="text-2xl text-white">Historique</h2>
                    <ul className="flex flex-col gap-3">
                        {terminees.map((intervention) => (
                            <li key={intervention.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gris-texte/40 bg-noir p-4">
                                <div>
                                    <p className="font-semibold text-white">{intervention.incident.type}</p>
                                    <p className="text-sm! text-gris-trait/60">
                                        {intervention.incident.ville} — le {new Date(intervention.debut).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <span className={intervention.statut === "Reussie" ? "text-cyan-neon" : "text-rouge-alerte"}>
                                    {nomsStatuts[intervention.statut]}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}
