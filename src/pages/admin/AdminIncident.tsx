import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router"
import AvisAdmin, { type Avis } from "../../composants/AvisAdmin"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"
import { nomComplet } from "../../services/comptes"
import { couleursUrgence, libellesStatut, libellesUrgence, typesIncident, urgences, type StatutIncident, type Urgence } from "../../services/incidents"

interface Incident {
    id: number
    type: string
    status: StatutIncident
    urgence: Urgence
    description: string | null
    adresse: string
    ville: string
    code_postal: string
    createdAt: string
    cree_par: { id: number, prenom: string | null, nom: string | null, email: string, numero_tel: string | null, verifiedAt: string | null }
    interventions: {
        id: number
        statut: "En_Cours" | "Reussie" | "Echouee"
        debut: string
        super_heros: { id: number, pseudo: string | null }
        notes: (Avis & { citoyen: { id: number, prenom: string | null, nom: string | null } })[]
    }[]
    vilains: { vilain: { pseudo: string } }[]
}

interface Doublon {
    id: number
    type: string
    adresse: string
    distance: number
}

const libellesIntervention = { En_Cours: "en cours", Reussie: "réussie", Echouee: "échouée" }
const styleLien = "text-white underline underline-offset-4 hover:text-rouge-alerte"
const styleChamp = "w-full rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors focus:border-rouge-alerte"

export default function AdminIncident() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [incident, setIncident] = useState<Incident | null>(null)
    const [doublons, setDoublons] = useState<Doublon[]>([])
    const [type, setType] = useState("")
    const [description, setDescription] = useState("")
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        appelApi(`/admin/incidents/${id}`)
            .then((donnees) => {
                setIncident(donnees.incident)
                setType(donnees.incident.type)
                setDescription(donnees.incident.description ?? "")
            })
            .catch((err) => setErreur(err.message))
        appelApi(`/incidents/${id}/doublons`)
            .then((donnees) => setDoublons(donnees.doublons))
            .catch((err) => setErreur(err.message))
    }, [id])

    if (erreur && !incident) return <p className="text-rouge-alerte">{erreur}</p>
    if (!incident) return <p className="text-gris-trait/70">Chargement…</p>

    const ouvert = incident.status === "Signale" || incident.status === "En_Cours"

    async function changerUrgence(urgence: Urgence) {
        if (!incident) return
        setErreur("")
        try {
            await appelApi(`/incidents/${incident.id}/urgence`, "PATCH", { urgence })
            setIncident({ ...incident, urgence })
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    async function enregistrer(e: FormEvent) {
        e.preventDefault()
        if (!incident) return
        setErreur("")
        setMessage("")
        try {
            await appelApi(`/incidents/${incident.id}`, "PATCH", { type, description })
            setIncident({ ...incident, type, description })
            setMessage("Incident modifié, le citoyen a été prévenu par mail.")
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    // Met à jour un avis masqué ou remis en ligne dans la bonne intervention
    function changerAvis(idAvis: number, enLigne: boolean) {
        if (!incident) return
        setIncident({
            ...incident,
            interventions: incident.interventions.map((intervention) => ({
                ...intervention,
                notes: intervention.notes.map((note) => (note.id === idAvis ? { ...note, enLigne } : note)),
            })),
        })
    }

    async function supprimer() {
        if (!incident) return
        if (!window.confirm("Supprimer cet incident ? Le citoyen sera prévenu par mail.")) return
        try {
            await appelApi(`/incidents/${incident.id}`, "DELETE")
            navigate("/dashboard-admin/incidents")
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <Link to="/dashboard-admin/incidents" className="self-start text-sm text-gris-trait/70 hover:text-white">← Tous les incidents</Link>

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-4xl text-white">Incident n°{incident.id}</h1>
                    <p className="mt-1 text-gris-trait/70">
                        {incident.adresse}, {incident.code_postal} {incident.ville} — signalé le {new Date(incident.createdAt).toLocaleString("fr-FR")}
                    </p>
                </div>
                <span className="rounded-full bg-fond-clair px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.2em] text-noir">
                    {libellesStatut[incident.status]}
                </span>
            </div>

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {message && <p className="text-cyan-neon">{message}</p>}

            {doublons.length > 0 && (
                <section className="flex flex-col gap-3 rounded-2xl border border-ambre bg-ambre/10 p-6">
                    <h2 className="text-2xl text-white">Doublons possibles</h2>
                    <p className="text-gris-trait/80">D'autres incidents ouverts ont été signalés à moins de 200 m :</p>
                    <ul className="flex flex-col gap-2">
                        {doublons.map((doublon) => (
                            <li key={doublon.id}>
                                <Link to={`/dashboard-admin/incidents/${doublon.id}`} className="text-white underline underline-offset-4 hover:text-rouge-alerte">
                                    n°{doublon.id} {doublon.type}
                                </Link>
                                <span className="text-gris-trait/70"> — {doublon.adresse}, à {doublon.distance} m</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <h2 className="text-2xl text-white">Signalé par</h2>
                    <p className="text-fond-clair">
                        <Link to={`/dashboard-admin/utilisateurs/${incident.cree_par.id}`} className={styleLien}>{nomComplet(incident.cree_par)}</Link>
                        {incident.cree_par.verifiedAt && <span className="ml-2 text-sm text-cyan-neon">Citoyen vérifié</span>}
                    </p>
                    <p className="text-sm! text-gris-trait/70">{incident.cree_par.email}{incident.cree_par.numero_tel && ` — ${incident.cree_par.numero_tel}`}</p>

                    <h2 className="mt-2 text-2xl text-white">Vilains</h2>
                    <p className="text-fond-clair">
                        {incident.vilains.length === 0 ? "Aucun vilain identifié" : incident.vilains.map((v) => v.vilain.pseudo).join(", ")}
                    </p>

                </section>

                <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <h2 className="text-2xl text-white">Priorité</h2>
                    <div className="flex flex-wrap gap-2">
                        {urgences.map((urgence) => (
                            <button
                                key={urgence}
                                type="button"
                                disabled={!ouvert}
                                onClick={() => changerUrgence(urgence)}
                                className={`cursor-pointer rounded-full border px-4 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${incident.urgence === urgence ? "text-noir" : "border-gris-texte/60 text-gris-trait/70 hover:text-white"}`}
                                style={incident.urgence === urgence ? { background: couleursUrgence[urgence], borderColor: couleursUrgence[urgence] } : undefined}
                            >
                                {libellesUrgence[urgence]}
                            </button>
                        ))}
                    </div>

                    {incident.status !== "Supprime" && (
                        <form onSubmit={enregistrer} className="flex flex-col gap-4">
                            <h2 className="mt-2 text-2xl text-white">Modifier</h2>
                            <label className="flex flex-col gap-2">
                                <span className="libelle">Type</span>
                                <select value={type} onChange={(e) => setType(e.target.value)} className={styleChamp}>
                                    {typesIncident.map((typeIncident) => (
                                        <option key={typeIncident} value={typeIncident}>{typeIncident}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="libelle">Description</span>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${styleChamp} resize-y`} />
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <Bouton type="submit">Enregistrer</Bouton>
                                <Bouton variante="secondaire" onClick={supprimer}>Supprimer</Bouton>
                            </div>
                        </form>
                    )}
                </section>
            </div>

            <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                <h2 className="text-2xl text-white">Interventions et avis</h2>
                {incident.interventions.length === 0 && <p className="text-gris-trait/70">Aucun héros n'est encore intervenu.</p>}
                {incident.interventions.map((intervention) => (
                    <div key={intervention.id} className="flex flex-col gap-3">
                        <p className="text-fond-clair">
                            <Link to={`/dashboard-admin/utilisateurs/${intervention.super_heros.id}`} className={styleLien}>{intervention.super_heros.pseudo}</Link>
                            {" "}— {libellesIntervention[intervention.statut]}, le {new Date(intervention.debut).toLocaleDateString("fr-FR")}
                        </p>
                        {intervention.notes.map((note) => (
                            <AvisAdmin
                                key={note.id}
                                avis={note}
                                onChanger={(enLigne) => changerAvis(note.id, enLigne)}
                                contexte={
                                    <>
                                        Avis de{" "}
                                        <Link to={`/dashboard-admin/utilisateurs/${note.citoyen.id}`} className={styleLien}>{nomComplet(note.citoyen)}</Link>
                                    </>
                                }
                            />
                        ))}
                    </div>
                ))}
            </section>
        </div>
    )
}
