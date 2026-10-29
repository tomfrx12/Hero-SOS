import { useEffect, useState } from "react"
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet"
import { TriangleAlert } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { appelApi } from "../services/api"

// Rayon de recherche des incidents déjà signalés, en mètres
const RAYON = 500

// Forme supposée, à confirmer avec « BACK · Incidents »
interface Incident {
    id: number
    type: string
    adresse: string
    ville: string
    statut: string
    date_creation: string
    latitude: number
    longitude: number
}

interface IncidentsProchesProps {
    latitude: number
    longitude: number
}

export default function IncidentsProches({ latitude, longitude }: IncidentsProchesProps) {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState(false)

    useEffect(() => {
        let annule = false

        appelApi(`/incidents?latitude=${latitude}&longitude=${longitude}&rayon=${RAYON}`)
            .then((donnees: Incident[]) => {
                if (!annule) setIncidents(donnees)
            })
            .catch(() => {
                if (!annule) setErreur(true)
            })
            .finally(() => {
                if (!annule) setChargement(false)
            })

        return () => {
            annule = true
        }
    }, [latitude, longitude])

    const couleurRouge = getComputedStyle(document.documentElement).getPropertyValue("--color-rouge-alerte")
    const couleurClaire = getComputedStyle(document.documentElement).getPropertyValue("--color-fond-clair")

    return (
        <div className="mt-5 flex flex-col gap-4">
            <MapContainer
                center={[latitude, longitude]}
                zoom={16}
                scrollWheelZoom={false}
                className="relative z-0 h-64 w-full rounded-xl border border-gris-texte/60"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker center={[latitude, longitude]} radius={8} pathOptions={{ color: couleurClaire, fillOpacity: 1 }}>
                    <Popup>Adresse choisie</Popup>
                </CircleMarker>
                {incidents.map((incident) => (
                    <CircleMarker key={incident.id} center={[incident.latitude, incident.longitude]} radius={10} pathOptions={{ color: couleurRouge, fillOpacity: 0.6 }}>
                        <Popup>{incident.type} · {incident.adresse}</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {chargement && <p className="text-sm! text-gris-trait/70">Recherche des incidents déjà signalés…</p>}

            {erreur && (
                <p className="text-sm! text-gris-trait/70">
                    Impossible de vérifier les incidents à proximité pour le moment. Tu peux quand même envoyer ton signalement.
                </p>
            )}

            {!chargement && !erreur && incidents.length === 0 && (
                <p className="text-sm! text-gris-trait/70">Aucun incident signalé dans un rayon de {RAYON} m.</p>
            )}

            {incidents.length > 0 && (
                <div className="rounded-xl border border-ambre/50 bg-ambre/10 p-4">
                    <p className="flex items-center gap-2 font-semibold text-ambre">
                        <TriangleAlert size={18} />
                        Un incident est peut-être déjà signalé ici
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                        {incidents.map((incident) => (
                            <li key={incident.id} className="rounded-lg bg-noir px-3 py-2 text-sm text-fond-clair">
                                <span className="font-display text-base font-black italic uppercase">{incident.type}</span>
                                {" · "}{incident.adresse}, {incident.ville}
                                <span className="block text-gris-trait/60">
                                    {incident.statut} · signalé le {new Date(incident.date_creation).toLocaleString("fr-FR")}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-sm! text-gris-trait/70">S'il s'agit d'un autre incident, tu peux continuer ton signalement.</p>
                </div>
            )}
        </div>
    )
}
