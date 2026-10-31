import { useEffect, useState } from "react"
import { Link } from "react-router"
import GrilleStats from "../../composants/GrilleStats"
import { appelApi } from "../../services/api"

interface Compte {
    id: number
    prenom: string
    nom: string
    pseudo: string | null
    email: string
    email_en_attente: string | null
    createdAt: string
}

interface TableauDeBord {
    utilisateurs: number
    incidents_ouverts: number
    incidents_urgents: number
    interventions_en_cours: number
    citoyens_a_verifier: number
    heros_en_attente: Compte[]
    emails_en_attente: Compte[]
}

// Une liste de comptes qui attendent une action, avec un lien vers la page utilisateurs
function ListeEnAttente({ titre, vide, comptes, detail }: { titre: string, vide: string, comptes: Compte[], detail: (compte: Compte) => string }) {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl text-white">{titre}</h2>
                <span className="rounded-full bg-rouge-alerte px-3 py-1 text-sm font-semibold text-white">{comptes.length}</span>
            </div>
            {comptes.length === 0 ? (
                <p className="text-gris-trait/60">{vide}</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {comptes.map((compte) => (
                        <li key={compte.id}>
                            <Link to={`/dashboard-admin/utilisateurs/${compte.id}`} className="block rounded-xl border border-gris-texte/40 bg-noir px-4 py-3 transition-colors hover:border-gris-trait/60">
                                <p className="font-semibold text-white">{compte.prenom} {compte.nom}</p>
                                <p className="text-sm! text-gris-trait/70">{detail(compte)}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/dashboard-admin/utilisateurs?statut=EnAttente" className="self-start text-sm text-white underline underline-offset-4 hover:text-rouge-alerte">
                Traiter les demandes
            </Link>
        </section>
    )
}

export default function DashboardAdmin() {
    const [donnees, setDonnees] = useState<TableauDeBord | null>(null)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/admin/tableau-de-bord")
            .then((reponse) => setDonnees(reponse))
            .catch((err) => setErreur(err.message))
    }, [])

    if (erreur) return <p className="text-rouge-alerte">{erreur}</p>
    if (!donnees) return <p className="text-gris-trait/70">Chargement…</p>

    return (
        <div className="flex flex-col gap-10 text-left">
            <h1 className="text-4xl text-white">Tableau de bord</h1>

            <GrilleStats
                cartes={[
                    { libelle: "Incidents ouverts", valeur: donnees.incidents_ouverts },
                    { libelle: "Priorité élevée", valeur: donnees.incidents_urgents },
                    { libelle: "Interventions en cours", valeur: donnees.interventions_en_cours },
                    { libelle: "Utilisateurs", valeur: donnees.utilisateurs },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <ListeEnAttente
                    titre="Héros à valider"
                    vide="Aucune demande de super-héros."
                    comptes={donnees.heros_en_attente}
                    detail={(compte) => `${compte.pseudo} — inscrit le ${new Date(compte.createdAt).toLocaleDateString("fr-FR")}`}
                />
                <ListeEnAttente
                    titre="Emails à valider"
                    vide="Aucun changement d'email."
                    comptes={donnees.emails_en_attente}
                    detail={(compte) => `${compte.email} → ${compte.email_en_attente}`}
                />
            </div>

            <p className="text-gris-trait/70">
                {donnees.citoyens_a_verifier} citoyen{donnees.citoyens_a_verifier > 1 ? "s" : ""} pas encore vérifié{donnees.citoyens_a_verifier > 1 ? "s" : ""}.{" "}
                <Link to="/dashboard-admin/utilisateurs?statut=NonVerifie" className="text-white underline underline-offset-4 hover:text-rouge-alerte">Voir les citoyens</Link>
            </p>
        </div>
    )
}
