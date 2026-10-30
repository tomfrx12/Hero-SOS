import { useEffect, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { LoaderCircle } from "lucide-react"
import { appelApi } from "../services/api"

interface Incident {
    id: number
    type: string
    status: "Signale" | "En_Cours"
    urgence: "Haute" | "Normale" | "Basse"
    description: string | null
    adresse: string
    ville: string
    latitude: number
    longitude: number
    createdAt: string
    vilains: { vilain: { pseudo: string } }[]
    interventions: { super_heros: { pseudo: string | null } }[]
}

const libellesStatut = { Signale: "Signalé", En_Cours: "En cours" }
const libellesUrgence = { Haute: "Élevée", Normale: "Normale", Basse: "Basse" }
const couleursUrgence = { Haute: "#E10600", Normale: "#FFB020", Basse: "#00E5FF" }

// Un point de la couleur de l'urgence, plus gros pour l'incident choisi
function icone(incident: Incident, choisi: boolean) {
    const taille = choisi ? 22 : 14
    return L.divIcon({
        html: `<div style="width:${taille}px;height:${taille}px;background:${couleursUrgence[incident.urgence]};border-radius:50%;border:2px solid white;box-shadow:0 0 10px ${couleursUrgence[incident.urgence]}"></div>`,
        className: "",
        iconSize: [taille, taille],
        iconAnchor: [taille / 2, taille / 2],
    })
}

// Prévient la page à chaque fois que la carte a fini de bouger (zoom ou déplacement)
function SuiviZone({ onChanger }: { onChanger: (zone: L.LatLngBounds) => void }) {
    const carte = useMapEvents({
        moveend: () => onChanger(carte.getBounds()),
    })
    return null
}

function depuis(date: string) {
    const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000)
    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}min`
    if (minutes < 60 * 24) return `Il y a ${Math.floor(minutes / 60)}h`
    return `Il y a ${Math.floor(minutes / (60 * 24))}j`
}

export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")
    const [filtre, setFiltre] = useState("Tous")
    const [choisiId, setChoisiId] = useState<number | null>(null)
    const [carte, setCarte] = useState<L.Map | null>(null)
    // Partie de la carte visible à l'écran, null au départ pour tout charger
    const [zone, setZone] = useState<L.LatLngBounds | null>(null)

    useEffect(() => {
        let url = "/incidents/en-cours"
        if (zone) {
            url += `?nord=${zone.getNorth()}&sud=${zone.getSouth()}&est=${zone.getEast()}&ouest=${zone.getWest()}`
        }

        // Si la carte rebouge avant la réponse, on ignore l'ancienne réponse
        let ignorer = false
        appelApi(url)
            .then((donnees) => {
                if (!ignorer) setIncidents(donnees.incidents)
            })
            .catch((err) => setErreur(err.message))
            .finally(() => {
                if (!ignorer) setChargement(false)
            })
        return () => {
            ignorer = true
        }
    }, [zone])

    function changerZone(nouvelleZone: L.LatLngBounds) {
        setChargement(true)
        setZone(nouvelleZone)
    }

    // Sélectionne l'incident et déplace la carte dessus
    function choisir(incident: Incident) {
        setChoisiId(incident.id)
        carte?.flyTo([incident.latitude, incident.longitude], 14)
    }

    const incidentsAffiches = incidents.filter((incident) => filtre === "Tous" || incident.status === filtre)

    return (
        <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl text-white">Incidents en cours</h1>
                    <p className="mt-2 text-gris-trait/70">
                        {incidentsAffiches.length} incident{incidentsAffiches.length > 1 ? "s" : ""} dans cette zone
                    </p>
                </div>

                <div className="flex gap-2">
                    {[{ valeur: "Tous", libelle: "Tous" }, { valeur: "Signale", libelle: "Signalés" }, { valeur: "En_Cours", libelle: "En cours" }].map((bouton) => (
                        <button
                            key={bouton.valeur}
                            type="button"
                            onClick={() => setFiltre(bouton.valeur)}
                            className={`cursor-pointer rounded-full px-5 py-2 font-display font-black italic uppercase transition-colors ${filtre === bouton.valeur ? "bg-rouge-alerte text-white glow-rouge" : "border border-gris-texte/60 text-gris-trait/70 hover:text-white"}`}
                        >
                            {bouton.libelle}
                        </button>
                    ))}
                </div>
            </div>

            {erreur && <p role="alert" className="text-rouge-alerte">{erreur}</p>}

            <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                <div className="relative h-80 overflow-hidden rounded-2xl border border-gris-texte/40 lg:sticky lg:top-28 lg:h-[70vh]">
                    {chargement && (
                        <span className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-noir/85 px-4 py-2 text-sm text-fond-clair">
                            <LoaderCircle size={16} className="animate-spin" />
                            Actualisation…
                        </span>
                    )}
                    <MapContainer ref={setCarte} center={[46.8, 2.35]} zoom={6} style={{ height: "100%", width: "100%" }} className="z-0">
                        <TileLayer
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <SuiviZone onChanger={changerZone} />
                        {incidentsAffiches.map((incident) => (
                            <Marker
                                key={incident.id}
                                position={[incident.latitude, incident.longitude]}
                                icon={icone(incident, incident.id === choisiId)}
                                eventHandlers={{ click: () => choisir(incident) }}
                            >
                                <Popup>
                                    <strong>{incident.type}</strong>
                                    <br />
                                    {incident.adresse}, {incident.ville}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* La liste reste affichée mais pâlit pendant l'actualisation */}
                <ul className={`flex flex-col gap-4 transition-opacity ${chargement ? "pointer-events-none opacity-40" : ""}`}>
                    {!chargement && incidentsAffiches.length === 0 && (
                        <li className="text-gris-trait/70">Aucun incident dans cette zone, tout est calme.</li>
                    )}

                    {incidentsAffiches.map((incident) => (
                        <li key={incident.id}>
                            <button
                                type="button"
                                onClick={() => choisir(incident)}
                                className={`flex w-full cursor-pointer flex-col gap-3 rounded-2xl border bg-graphite p-5 text-left transition-colors ${incident.id === choisiId ? "border-rouge-alerte glow-rouge" : "border-gris-texte/40 hover:border-gris-trait/60"}`}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="rounded-full bg-fond-clair px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.2em] text-noir">
                                        {libellesStatut[incident.status]}
                                    </span>
                                    <span className="text-xs text-gris-trait/60">{depuis(incident.createdAt)}</span>
                                </div>

                                <h2 className="font-display text-2xl font-black italic uppercase text-white">{incident.type}</h2>
                                <p className="text-sm! text-gris-trait/70">{incident.adresse}, {incident.ville}</p>
                                {incident.description && <p className="text-sm! text-fond-clair">{incident.description}</p>}

                                <dl className="grid grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <dt className="libelle">Menace</dt>
                                        <dd className="mt-1 font-semibold" style={{ color: couleursUrgence[incident.urgence] }}>{libellesUrgence[incident.urgence]}</dd>
                                    </div>
                                    <div>
                                        <dt className="libelle">Vilain</dt>
                                        <dd className="mt-1 font-semibold text-rouge-alerte">{incident.vilains[0]?.vilain.pseudo ?? "Inconnu"}</dd>
                                    </div>
                                    <div>
                                        <dt className="libelle">Héros</dt>
                                        <dd className="mt-1 font-semibold text-white">{incident.interventions[0]?.super_heros.pseudo ?? "En attente"}</dd>
                                    </div>
                                </dl>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
