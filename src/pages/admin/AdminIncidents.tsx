import { useEffect, useState } from "react"
import { Link } from "react-router"
import Filtres from "../../composants/Filtres"
import { appelApi } from "../../services/api"
import { couleursUrgence, libellesStatut, libellesUrgence, urgences, type StatutIncident, type Urgence } from "../../services/incidents"

interface Incident {
    id: number
    type: string
    status: StatutIncident
    urgence: Urgence
    adresse: string
    ville: string
    createdAt: string
}

const styleChamp = "rounded-xl border border-gris-texte/60 bg-noir px-4 py-2.5 text-fond-clair scheme-dark outline-none transition-colors placeholder:text-gris-trait/40 focus:border-rouge-alerte"

// Les onglets regroupent les statuts : "Ouverts" = signalés + en cours
function correspondOnglet(incident: Incident, onglet: string) {
    if (onglet === "ouverts") return incident.status === "Signale" || incident.status === "En_Cours"
    if (onglet === "tous") return incident.status !== "Supprime"
    return incident.status === onglet
}

export default function AdminIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [onglet, setOnglet] = useState("ouverts")
    const [urgence, setUrgence] = useState("")
    const [recherche, setRecherche] = useState("")
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    // L'API ne renvoie les incidents supprimés que si on les demande, donc on fait les deux appels
    useEffect(() => {
        Promise.all([appelApi("/incidents"), appelApi("/incidents?status=Supprime")])
            .then(([actifs, supprimes]) => setIncidents([...actifs.incidents, ...supprimes.incidents]))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    const texte = recherche.trim().toLowerCase()
    // Recherche et priorité s'appliquent avant les onglets, pour que les compteurs suivent
    const incidentsFiltres = incidents.filter((incident) =>
        (urgence === "" || incident.urgence === urgence) &&
        `${incident.id} ${incident.type} ${incident.adresse} ${incident.ville}`.toLowerCase().includes(texte),
    )

    const onglets = [
        { valeur: "ouverts", libelle: "Ouverts" },
        { valeur: "Reussi", libelle: "Résolus" },
        { valeur: "Echoue", libelle: "Échoués" },
        { valeur: "Supprime", libelle: "Supprimés" },
        { valeur: "tous", libelle: "Tous" },
    ].map((option) => ({ ...option, nombre: incidentsFiltres.filter((incident) => correspondOnglet(incident, option.valeur)).length }))

    const incidentsAffiches = incidentsFiltres.filter((incident) => correspondOnglet(incident, onglet))

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Incidents</h1>

            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="search"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un n°, un type, une adresse, une ville…"
                    className={`${styleChamp} flex-1`}
                />
                <select value={urgence} onChange={(e) => setUrgence(e.target.value)} className={styleChamp}>
                    <option value="">Toutes les priorités</option>
                    {urgences.map((u) => (
                        <option key={u} value={u}>Priorité {libellesUrgence[u].toLowerCase()}</option>
                    ))}
                </select>
            </div>

            <Filtres options={onglets} valeur={onglet} onChanger={setOnglet} />

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && incidentsAffiches.length === 0 && <p className="text-gris-trait/70">Aucun incident ici.</p>}

            {incidentsAffiches.length > 0 && <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                {incidentsAffiches.map((incident) => (
                    <li key={incident.id}>
                        <Link
                            to={`/dashboard-admin/incidents/${incident.id}`}
                            className="flex items-center gap-4 border-l-4 px-5 py-4 transition-colors hover:bg-noir"
                            style={{ borderLeftColor: couleursUrgence[incident.urgence] }}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-white">
                                    <span className="text-gris-trait/50">n°{incident.id}</span> {incident.type}
                                </p>
                                <p className="truncate text-sm! text-gris-trait/70">
                                    {incident.adresse}, {incident.ville} — le {new Date(incident.createdAt).toLocaleDateString("fr-FR")}
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1 text-sm sm:flex-row sm:items-center sm:gap-3">
                                <span className="font-semibold" style={{ color: couleursUrgence[incident.urgence] }}>{libellesUrgence[incident.urgence]}</span>
                                <span className="rounded-full bg-fond-clair px-3 py-1 text-xs font-semibold uppercase text-noir">{libellesStatut[incident.status]}</span>
                            </div>
                            <span className="text-gris-trait/40">›</span>
                        </Link>
                    </li>
                ))}
            </ul>}
        </div>
    )
}
