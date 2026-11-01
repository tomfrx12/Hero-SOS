import { useEffect, useState } from "react"
import { Link } from "react-router"
import AvisAdmin, { type Avis } from "../../composants/AvisAdmin"
import Filtres from "../../composants/Filtres"
import { appelApi } from "../../services/api"
import { nomComplet } from "../../services/comptes"

interface AvisComplet extends Avis {
    citoyen: { id: number, prenom: string | null, nom: string | null }
    intervention: { super_heros: { id: number, pseudo: string | null }, incident: { id: number, type: string, ville: string } }
}

const styleLien = "text-white underline underline-offset-4 hover:text-rouge-alerte"

export default function AdminAvis() {
    const [avis, setAvis] = useState<AvisComplet[]>([])
    const [filtre, setFiltre] = useState("")
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/admin/avis")
            .then((donnees) => setAvis(donnees.avis))
            .catch((err) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    const filtres = [
        { valeur: "", libelle: "Tous", nombre: avis.length },
        { valeur: "enLigne", libelle: "En ligne", nombre: avis.filter((a) => a.enLigne).length },
        { valeur: "masques", libelle: "Masqués", nombre: avis.filter((a) => !a.enLigne).length },
    ]
    const avisAffiches = avis.filter((a) => filtre === "" || (filtre === "enLigne" ? a.enLigne : !a.enLigne))

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Avis des citoyens</h1>

            <Filtres options={filtres} valeur={filtre} onChanger={setFiltre} />

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && avisAffiches.length === 0 && <p className="text-gris-trait/70">Aucun avis.</p>}

            <ul className="flex flex-col gap-4">
                {avisAffiches.map((a) => (
                    <li key={a.id}>
                        <AvisAdmin
                            avis={a}
                            onChanger={(enLigne) => setAvis(avis.map((autre) => (autre.id === a.id ? { ...autre, enLigne } : autre)))}
                            contexte={
                                <>
                                    <Link to={`/dashboard-admin/utilisateurs/${a.citoyen.id}`} className={styleLien}>{nomComplet(a.citoyen)}</Link>
                                    {" pour "}
                                    <Link to={`/dashboard-admin/utilisateurs/${a.intervention.super_heros.id}`} className={styleLien}>{a.intervention.super_heros.pseudo}</Link>
                                    {" sur "}
                                    <Link to={`/dashboard-admin/incidents/${a.intervention.incident.id}`} className={styleLien}>
                                        l'incident n°{a.intervention.incident.id} ({a.intervention.incident.type}, {a.intervention.incident.ville})
                                    </Link>
                                </>
                            }
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
