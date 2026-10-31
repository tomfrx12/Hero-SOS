import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import Filtres from "../../composants/Filtres"
import TagCompte from "../../composants/TagCompte"
import { estVerifie, type Compte } from "../../services/comptes"
import { appelApi } from "../../services/api"

interface Utilisateur extends Compte {
    id: number
    nom: string
    prenom: string
    pseudo: string | null
    email: string
    ville: string
    createdAt: string
}

const styleChamp = "rounded-xl border border-gris-texte/60 bg-noir px-4 py-2.5 text-fond-clair scheme-dark outline-none transition-colors placeholder:text-gris-trait/40 focus:border-rouge-alerte"

// "À traiter" : héros pas encore validé ou email à valider
function correspondStatut(utilisateur: Utilisateur, statut: string) {
    if (statut === "EnAttente") return utilisateur.statut_compte === "EnAttente" || utilisateur.email_en_attente !== null
    if (statut === "Verifie") return estVerifie(utilisateur)
    if (statut === "NonVerifie") return utilisateur.statut_compte === "Actif" && !estVerifie(utilisateur)
    if (statut === "Desactive") return utilisateur.statut_compte === "Desactive"
    return true
}

export default function AdminUtilisateurs() {
    // Les filtres peuvent venir d'un lien du tableau de bord (ex : ?statut=EnAttente)
    const [parametres] = useSearchParams()
    const [role, setRole] = useState(parametres.get("role") ?? "")
    const [statut, setStatut] = useState(parametres.get("statut") ?? "")
    const [recherche, setRecherche] = useState("")
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/admin/utilisateurs")
            .then((donnees) => setUtilisateurs(donnees.utilisateurs))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    const texte = recherche.trim().toLowerCase()
    // Recherche et rôle s'appliquent avant les onglets, pour que les compteurs suivent
    const utilisateursFiltres = utilisateurs.filter((u) =>
        (role === "" || u.role === role) &&
        `${u.prenom} ${u.nom} ${u.pseudo ?? ""} ${u.email} ${u.ville}`.toLowerCase().includes(texte),
    )

    const onglets = [
        { valeur: "", libelle: "Tous" },
        { valeur: "EnAttente", libelle: "À traiter" },
        { valeur: "Verifie", libelle: "Vérifiés" },
        { valeur: "NonVerifie", libelle: "Non vérifiés" },
        { valeur: "Desactive", libelle: "Désactivés" },
    ].map((option) => ({ ...option, nombre: utilisateursFiltres.filter((u) => correspondStatut(u, option.valeur)).length }))

    const utilisateursAffiches = utilisateursFiltres.filter((u) => correspondStatut(u, statut))

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Utilisateurs</h1>

            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="search"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un nom, un pseudo, un email, une ville…"
                    className={`${styleChamp} flex-1`}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} className={styleChamp}>
                    <option value="">Tous les rôles</option>
                    <option value="Citoyens">Citoyens</option>
                    <option value="SuperHeros">Super-héros</option>
                    <option value="SuperVillains">Super-vilains</option>
                    <option value="Administrateurs">Administrateurs</option>
                </select>
            </div>

            <Filtres options={onglets} valeur={statut} onChanger={setStatut} />

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && utilisateursAffiches.length === 0 && <p className="text-gris-trait/70">Aucun utilisateur ici.</p>}

            {utilisateursAffiches.length > 0 && (
                <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                    {utilisateursAffiches.map((u) => (
                        <li key={u.id}>
                            <Link to={`/dashboard-admin/utilisateurs/${u.id}`} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-noir">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-white">
                                        {u.prenom} {u.nom}{u.pseudo && <span className="text-gris-trait/60"> — {u.pseudo}</span>}
                                    </p>
                                    <p className="truncate text-sm! text-gris-trait/70">{u.email} — {u.ville}</p>
                                </div>
                                <TagCompte compte={u} />
                                <span className="text-gris-trait/40">›</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
