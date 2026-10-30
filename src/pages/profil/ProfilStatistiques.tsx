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
    citoyens_secourus: number
    vilains_arretes: number
}

interface StatistiquesGlobales {
    interventions: number
    citoyens_secourus: number
    citoyens_en_danger_secourus: number
    vilains_identifies: number
    vilains_en_prison: number
}

// Une grille de cartes chiffrées
function GrilleStats({ cartes }: { cartes: { libelle: string, valeur: string | number }[] }) {
    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {cartes.map((carte) => (
                <div key={carte.libelle} className="carte-stat p-4 text-center">
                    <span className="stat-valeur">{carte.valeur}</span>
                    <span className="stat-libelle">{carte.libelle}</span>
                </div>
            ))}
        </div>
    )
}

export default function ProfilStatistiques() {
    const [stats, setStats] = useState<Statistiques | null>(null)
    const [globales, setGlobales] = useState<StatistiquesGlobales | null>(null)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/moi/statistiques")
            .then((donnees) => setStats(donnees))
            .catch((err) => setErreur(err.message))
        appelApi("/stats/globales")
            .then((donnees) => setGlobales(donnees))
            .catch((err) => setErreur(err.message))
    }, [])

    if (erreur) return <p role="alert" className="text-rouge-alerte">{erreur}</p>
    if (!stats || !globales) return <p className="text-gris-trait/70">Chargement…</p>

    return (
        <div className="flex flex-col gap-10 text-left">
            <section className="flex flex-col gap-6">
                <h1 className="text-4xl text-white">Mes statistiques</h1>
                <GrilleStats
                    cartes={[
                        { libelle: "Interventions", valeur: stats.interventions },
                        { libelle: "Réussies", valeur: stats.reussies },
                        { libelle: "Échouées", valeur: stats.echouees },
                        { libelle: "Taux de réussite", valeur: stats.taux_reussite === null ? "—" : stats.taux_reussite + " %" },
                        { libelle: "Citoyens secourus", valeur: stats.citoyens_secourus },
                        { libelle: "Vilains en prison", valeur: stats.vilains_arretes },
                        { libelle: "Note moyenne", valeur: stats.note_moyenne === null ? "—" : stats.note_moyenne.toFixed(1) + " / 5" },
                        { libelle: "Temps moyen", valeur: stats.temps_moyen_minutes === null ? "—" : stats.temps_moyen_minutes + " min" },
                    ]}
                />
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-4xl text-white">Statistiques globales</h2>
                <GrilleStats
                    cartes={[
                        { libelle: "Interventions", valeur: globales.interventions },
                        { libelle: "Citoyens secourus", valeur: globales.citoyens_secourus },
                        { libelle: "Citoyens en danger secourus", valeur: globales.citoyens_en_danger_secourus },
                        { libelle: "Vilains identifiés", valeur: globales.vilains_identifies },
                        { libelle: "Vilains en prison", valeur: globales.vilains_en_prison },
                    ]}
                />
            </section>
        </div>
    )
}
