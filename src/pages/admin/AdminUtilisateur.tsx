import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import TagCompte from "../../composants/TagCompte"
import Bouton from "../../composants/ui/Bouton"
import { useSession } from "../../contexte/session"
import { appelApi } from "../../services/api"
import type { Compte } from "../../services/comptes"
import { libellesStatut, type StatutIncident } from "../../services/incidents"

interface Utilisateur extends Compte {
    id: number
    civilite: string
    nom: string
    prenom: string
    pseudo: string | null
    email: string
    numero_tel: string
    adresse: string
    code_postal: string
    ville: string
    createdAt: string
    incidentsSignales: { id: number, type: string, status: StatutIncident, ville: string, createdAt: string }[]
    interventions: {
        id: number
        statut: "En_Cours" | "Reussie" | "Echouee"
        debut: string
        incident: { id: number, type: string, ville: string }
        notes: { id: number, note: number, commentaire: string | null, enLigne: boolean }[]
    }[]
    notesDonnees: {
        id: number
        note: number
        commentaire: string | null
        enLigne: boolean
        intervention: { super_heros: { id: number, pseudo: string | null }, incident: { id: number, type: string } }
    }[]
}

const libellesIntervention = { En_Cours: "en cours", Reussie: "réussie", Echouee: "échouée" }
const styleLien = "text-white underline underline-offset-4 hover:text-rouge-alerte"

function Etoiles({ note }: { note: number }) {
    return <span className="text-ambre">{"★".repeat(note) + "☆".repeat(5 - note)}</span>
}

export default function AdminUtilisateur() {
    const { id } = useParams()
    const { utilisateur: moi } = useSession()
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi(`/admin/utilisateurs/${id}`)
            .then((donnees) => setUtilisateur(donnees.utilisateur))
            .catch((err) => setErreur(err.message))
    }, [id])

    if (erreur && !utilisateur) return <p className="text-rouge-alerte">{erreur}</p>
    if (!utilisateur) return <p className="text-gris-trait/70">Chargement…</p>

    // Toutes les actions passent par la même route, l'API renvoie le compte à jour
    async function action(nom: string) {
        if (!utilisateur) return
        setErreur("")
        try {
            const donnees = await appelApi(`/admin/utilisateurs/${utilisateur.id}`, "PATCH", { action: nom })
            setUtilisateur({ ...utilisateur, ...donnees.utilisateur })
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <Link to="/dashboard-admin/utilisateurs" className="self-start text-sm text-gris-trait/70 hover:text-white">← Tous les utilisateurs</Link>

            <div className="flex flex-col gap-3">
                <h1 className="text-4xl text-white">
                    {utilisateur.prenom} {utilisateur.nom}{utilisateur.pseudo && <span className="text-gris-trait/60"> — {utilisateur.pseudo}</span>}
                </h1>
                <TagCompte compte={utilisateur} />
            </div>

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}

            {utilisateur.role === "SuperHeros" && utilisateur.statut_compte === "EnAttente" && (
                <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ambre p-5">
                    <p className="text-fond-clair">Ce compte demande à devenir super-héros.</p>
                    <div className="flex gap-2">
                        <Bouton onClick={() => action("accepter_heros")}>Accepter le héros</Bouton>
                        <Bouton variante="secondaire" onClick={() => action("refuser_heros")}>Refuser</Bouton>
                    </div>
                </section>
            )}

            {utilisateur.email_en_attente && (
                <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ambre p-5">
                    <p className="break-all text-fond-clair">
                        Nouvel email demandé : <strong className="text-white">{utilisateur.email_en_attente}</strong>
                    </p>
                    <div className="flex gap-2">
                        <Bouton onClick={() => action("valider_email")}>Valider</Bouton>
                        <Bouton variante="secondaire" onClick={() => action("refuser_email")}>Refuser</Bouton>
                    </div>
                </section>
            )}

            <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                <h2 className="text-2xl text-white">Compte</h2>
                <div className="grid gap-x-6 gap-y-2 text-fond-clair sm:grid-cols-[auto_1fr]">
                    <p className="text-gris-trait/60">Email</p>
                    <p className="break-all">{utilisateur.email}</p>
                    <p className="text-gris-trait/60">Téléphone</p>
                    <p>{utilisateur.numero_tel}</p>
                    <p className="text-gris-trait/60">Adresse</p>
                    <p>{utilisateur.adresse}, {utilisateur.code_postal} {utilisateur.ville}</p>
                    <p className="text-gris-trait/60">Inscrit le</p>
                    <p>{new Date(utilisateur.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {utilisateur.role === "Citoyens" && utilisateur.statut_compte === "Actif" && !utilisateur.verifiedAt && (
                        <Bouton variante="secondaire" onClick={() => action("verifier")}>Marquer citoyen vérifié</Bouton>
                    )}
                    {utilisateur.statut_compte === "Actif" && utilisateur.id !== moi?.id && (
                        <Bouton variante="secondaire" onClick={() => action("desactiver")}>Désactiver le compte</Bouton>
                    )}
                    {utilisateur.statut_compte === "Desactive" && (
                        <Bouton variante="secondaire" onClick={() => action("reactiver")}>Réactiver le compte</Bouton>
                    )}
                </div>
            </section>

            {utilisateur.incidentsSignales.length > 0 && (
                <section className="flex flex-col gap-3 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <h2 className="text-2xl text-white">Incidents signalés ({utilisateur.incidentsSignales.length})</h2>
                    <ul className="flex flex-col gap-2 text-fond-clair">
                        {utilisateur.incidentsSignales.map((incident) => (
                            <li key={incident.id}>
                                <Link to={`/dashboard-admin/incidents/${incident.id}`} className={styleLien}>n°{incident.id} {incident.type}</Link>
                                <span className="text-gris-trait/70"> — {incident.ville}, {libellesStatut[incident.status].toLowerCase()}, le {new Date(incident.createdAt).toLocaleDateString("fr-FR")}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {utilisateur.interventions.length > 0 && (
                <section className="flex flex-col gap-3 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <h2 className="text-2xl text-white">Interventions ({utilisateur.interventions.length})</h2>
                    <ul className="flex flex-col gap-3 text-fond-clair">
                        {utilisateur.interventions.map((intervention) => (
                            <li key={intervention.id}>
                                <Link to={`/dashboard-admin/incidents/${intervention.incident.id}`} className={styleLien}>
                                    n°{intervention.incident.id} {intervention.incident.type}
                                </Link>
                                <span className="text-gris-trait/70"> — {intervention.incident.ville}, {libellesIntervention[intervention.statut]}, le {new Date(intervention.debut).toLocaleDateString("fr-FR")}</span>
                                {intervention.notes.map((note) => (
                                    <p key={note.id} className={`ml-4 text-sm! ${note.enLigne ? "text-gris-trait/80" : "text-gris-trait/40 line-through"}`}>
                                        <Etoiles note={note.note} /> {note.commentaire}
                                    </p>
                                ))}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {utilisateur.notesDonnees.length > 0 && (
                <section className="flex flex-col gap-3 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <h2 className="text-2xl text-white">Avis donnés ({utilisateur.notesDonnees.length})</h2>
                    <ul className="flex flex-col gap-3 text-fond-clair">
                        {utilisateur.notesDonnees.map((note) => (
                            <li key={note.id} className={note.enLigne ? "" : "opacity-50"}>
                                <Etoiles note={note.note} /> pour{" "}
                                <Link to={`/dashboard-admin/utilisateurs/${note.intervention.super_heros.id}`} className={styleLien}>{note.intervention.super_heros.pseudo}</Link>
                                {" sur "}
                                <Link to={`/dashboard-admin/incidents/${note.intervention.incident.id}`} className={styleLien}>
                                    l'incident n°{note.intervention.incident.id}
                                </Link>
                                {!note.enLigne && <span className="text-rouge-alerte"> (masqué)</span>}
                                {note.commentaire && <p className="text-sm! text-gris-trait/70">« {note.commentaire} »</p>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}
