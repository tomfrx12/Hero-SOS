import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import L from "leaflet"
import type { Adresse } from "./ChampAdresse"

const iconePosition = L.divIcon({
    html: `<div style="width:20px;height:20px;background:#E10600;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 0 10px rgba(225,6,0,0.7)"></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
})

const iconeIncident = L.divIcon({
    html: `<div style="width:14px;height:14px;background:#FFB020;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(255,176,32,0.8)"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
})

interface Position { lat: number; lng: number }

export interface MarqueurIncident {
    id: number
    latitude: number
    longitude: number
    type: string
    distance: number
}

interface ChampCarteProps {
    onChoisir: (adresse: Adresse | null) => void
    marqueurs?: MarqueurIncident[]
}

function ClicCarte({ onClic }: { onClic: (pos: Position) => void }) {
    useMapEvents({ click: (e) => onClic(e.latlng) })
    return null
}

function formatDistance(m: number) {
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`
}

export default function ChampCarte({ onChoisir, marqueurs = [] }: ChampCarteProps) {
    const [position, setPosition] = useState<Position | null>(null)
    const [libelle, setLibelle] = useState("")
    const [chargement, setChargement] = useState(false)

    async function choisirPosition(pos: Position) {
        setPosition(pos)
        setLibelle("Localisation en cours…")
        setChargement(true)
        onChoisir(null)

        try {
            const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${pos.lng}&lat=${pos.lat}`
            const reponse = await fetch(url)
            const donnees = await reponse.json()
            const feature = donnees.features?.[0]

            if (feature) {
                const infos = feature.properties
                setLibelle(infos.label)
                onChoisir({
                    adresse: infos.name,
                    code_postal: infos.postcode ?? "",
                    ville: infos.city ?? "",
                    pays: "France",
                    latitude: pos.lat,
                    longitude: pos.lng,
                })
            } else {
                const coordLabel = `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`
                setLibelle(coordLabel)
                onChoisir({
                    adresse: coordLabel,
                    code_postal: "",
                    ville: "",
                    pays: "",
                    latitude: pos.lat,
                    longitude: pos.lng,
                })
            }
        } catch {
            setLibelle(`${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`)
        } finally {
            setChargement(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <span className="libelle">Clique sur la carte pour pointer l'incident</span>

            <div className="h-48 sm:h-64 md:h-72 overflow-hidden rounded-xl border border-gris-texte/60 transition-colors focus-within:border-rouge-alerte">
                <MapContainer
                    center={[46.8, 2.35]}
                    zoom={6}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClicCarte onClic={choisirPosition} />

                    {/* Marqueur de la position choisie */}
                    {position && <Marker position={[position.lat, position.lng]} icon={iconePosition} />}

                    {/* Marqueurs des incidents proches */}
                    {marqueurs.map(inc => (
                        <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={iconeIncident}>
                            <Popup>
                                <div className="text-xs leading-tight">
                                    <strong>{inc.type}</strong>
                                    <br />
                                    à {formatDistance(inc.distance)}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {libelle ? (
                <p className={`text-sm ${chargement ? "text-gris-trait/40 italic" : "text-gris-trait/70"}`}>
                    {libelle}
                </p>
            ) : (
                <p className="text-sm text-gris-trait/40 italic">Aucune position sélectionnée</p>
            )}
        </div>
    )
}
