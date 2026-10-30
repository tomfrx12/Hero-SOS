import { useEffect, useState } from "react"
import { appelApi } from "../../services/api"

interface Statistiques {
    interventions: number
    reussies: number
    echouees: number
    en_cours: number
    taux_reussite: number | null
    temps_moyen_minutes: number | null
    note_moyenne: number | null
    nombre_avis: number
}

export default function ProfilStatistiques() {
    const [stats, setStats] = useState<Statistiques | null>(null)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/moi/statistiques")
            .then((donnees) => setStats(donnees))
            .catch((err) => setErreur(err.message))
    }, [])

    if (erreur) return <p role="alert" className="text-rouge-alerte">{erreur}</p>
    if (!stats) return <p className="text-gris-trait/70">Chargement…</p>

    const cartes = [
        { libelle: "Interventions", valeur: stats.interventions },
        { libelle: "Réussies", valeur: stats.reussies },
        { libelle: "Échouées", valeur: stats.echouees },
        { libelle: "En cours", valeur: stats.en_cours },
        { libelle: "Taux de réussite", valeur: stats.taux_reussite === null ? "—" : stats.taux_reussite + " %" },
        { libelle: "Temps moyen", valeur: stats.temps_moyen_minutes === null ? "—" : stats.temps_moyen_minutes + " min" },
        { libelle: "Note moyenne", valeur: stats.note_moyenne === null ? "—" : stats.note_moyenne.toFixed(1) + " / 5" },
        { libelle: "Avis reçus", valeur: stats.nombre_avis },
    ]

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Mes statistiques</h1>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {cartes.map((carte) => (
                    <div key={carte.libelle} className="carte-stat p-4 text-center">
                        <span className="stat-valeur">{carte.valeur}</span>
                        <span className="stat-libelle">{carte.libelle}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
