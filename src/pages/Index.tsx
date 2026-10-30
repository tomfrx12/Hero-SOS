import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { Link } from "react-router"
import { ArrowRight, Siren, Zap } from "lucide-react"
import Bouton from "../composants/ui/Bouton"
import BoutonRond from "../composants/ui/BoutonRond"
import Carte, { type InfoCarte } from "../composants/ui/Carte"
import GrilleHeros, { type Heros } from "../composants/GrilleHeros"
import Pagination from "../composants/ui/Pagination"
import { rolesSignalement, useSession } from "../contexte/session"
import { appelApi } from "../services/api"

interface Incident {
    id: number
    type: string
    status: "Signale" | "En_Cours" | "Reussi" | "Echoue" | "Supprime"
    urgence: "Haute" | "Normale" | "Basse"
    adresse: string
    createdAt: string
    vilains: { vilain: { pseudo: string } }[]
    interventions: { debut: string, fin: string | null, super_heros: { pseudo: string | null } }[]
}

interface Stats {
    heros_actifs: number
    incidents_signales: number
    taux_reussite: number | null
    temps_moyen_minutes: number | null
}

const libellesStatut = { Signale: "Signalé", En_Cours: "En cours", Reussi: "Résolu", Echoue: "Échoué", Supprime: "Supprimé" }
const libellesUrgence = { Haute: "Élevée", Normale: "Normale", Basse: "Basse" }

function depuis(date: string) {
    const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000)
    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}min`
    if (minutes < 60 * 24) return `Il y a ${Math.floor(minutes / 60)}h`
    return `Il y a ${Math.floor(minutes / (60 * 24))}j`
}

function duree(debut: string, fin: string) {
    const minutes = Math.round((new Date(fin).getTime() - new Date(debut).getTime()) / 60000)
    if (minutes < 60) return `${minutes} min`
    return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`
}

// Transforme un incident de l'API en données pour le composant Carte
function versCarte(incident: Incident) {
    const intervention = incident.interventions[0]

    const infos: InfoCarte[] = [
        { libelle: "Vilain", valeur: incident.vilains[0]?.vilain.pseudo ?? "Inconnu", ton: "rouge" },
        { libelle: "Héros", valeur: intervention?.super_heros.pseudo ?? "En attente", ton: "clair" },
        { libelle: "Localisation", valeur: incident.adresse },
    ]

    if (intervention?.fin) {
        infos.push({ libelle: "Durée", valeur: duree(intervention.debut, intervention.fin) })
    } else {
        infos.push({ libelle: "Menace", valeur: libellesUrgence[incident.urgence], ton: incident.urgence === "Haute" ? "rouge" : undefined })
    }

    return {
        titre: incident.type,
        statut: libellesStatut[incident.status],
        temps: depuis(incident.createdAt),
        infos,
    }
}

export default function Index() {
    const { utilisateur } = useSession()
    // Un visiteur voit aussi le bouton, il sera envoyé vers la connexion
    const peutSignaler = !utilisateur || rolesSignalement.includes(utilisateur.role)
    const fondRef = useRef<HTMLImageElement>(null)
    const titreRef = useRef<HTMLDivElement>(null)

    useLenis(({ scroll }) => {
        fondRef.current!.style.transform = `translate3d(0, ${scroll * 0.6}px, 0)`
        titreRef.current!.style.transform = `translate3d(0, ${scroll * 0.4}px, 0)`
    })

    const [incidents, setIncidents] = useState<Incident[]>([])
    const [heros, setHeros] = useState<Heros[]>([])
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        appelApi("/incidents/recents").then((donnees) => setIncidents(donnees.incidents))
        appelApi("/heros").then((donnees) => setHeros(donnees.heros))
        appelApi("/stats").then((donnees) => setStats(donnees))
    }, [])

    const [index, setIndex] = useState(0)
    const total = incidents.length

    const chiffres = [
        { valeur: stats ? String(stats.heros_actifs) : "–", libelle: "Héros actifs" },
        { valeur: stats ? String(stats.incidents_signales) : "–", libelle: "Incidents signalés" },
        { valeur: stats?.taux_reussite != null ? `${stats.taux_reussite} %` : "–", libelle: "Missions réussies" },
        { valeur: stats?.temps_moyen_minutes != null ? `${stats.temps_moyen_minutes} min` : "–", libelle: "Temps moyen" },
    ]

    return (
        <>
            <section className="relative left-1/2 -mt-10 h-screen w-screen -translate-x-1/2 overflow-hidden bg-noir">
                <img
                    ref={fondRef}
                    src="/fondo.webp"
                    alt=""
                    className="absolute top-0 left-1/2 h-full w-[max(100%,1440px)] max-w-none -translate-x-1/2 object-cover will-change-transform"
                />

                <div
                    ref={titreRef}
                    className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center will-change-transform"
                >
                    <div className="halo -top-10 h-72 w-[min(40rem,90vw)]" />
                    <h1 className="relative mt-5 text-noir">
                        Héros <span className="text-rouge-alerte texte-glow-rouge">SOS</span>
                    </h1>
                    <p className="text-lg font-semibold libelle relative mt-4 text-noir!">Un héros, un appel</p>
                    <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                        {peutSignaler && <Bouton to="/profil/signaler-incidents" icone={Siren}>Signaler un incident</Bouton>}
                        <Bouton to="/incidents" variante="secondaire" icone={Zap}>Voir les incidents</Bouton>
                    </div>
                </div>

                <img
                    src="/montanya.webp"
                    alt=""
                    className="pointer-events-none absolute bottom-0 left-1/2 w-[max(100%,1440px)] max-w-none -translate-x-1/2"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-noir via-noir/70 to-transparent" />
            </section>

            <section className="grid items-center gap-12 py-16 text-left md:grid-cols-[55fr_45fr] md:gap-16 md:py-24 lg:gap-24">
                <div>
                    <h2 className="mt-6 text-[clamp(3.5rem,8vw,8rem)] leading-[0.82]">
                        <span className="text-rouge-alerte texte-glow-rouge">Un vilain dans ta rue ?</span>{" "}
                        <span className="text-white">Appelle un héros.</span>
                    </h2>

                    <p className="mt-6 max-w-md text-gris-trait/70">
                        Signale un incident en quelques secondes : le héros le plus proche est alerté
                        et tu suis son intervention en direct, jusqu'à la résolution.
                    </p>
                </div>

                <div className="relative w-full max-w-md justify-self-center md:justify-self-end">
                    <div className="relative z-10 flex items-center justify-between">
                        <h3 className="text-3xl">
                            <span className="text-rouge-alerte">Alertes</span> <span className="text-white">en direct</span>
                        </h3>
                        <div className="flex gap-2">
                            <BoutonRond direction="gauche" label="Incident précédent" onClick={() => setIndex((index + total - 1) % total)} />
                            <BoutonRond label="Incident suivant" onClick={() => setIndex((index + 1) % total)} />
                        </div>
                    </div>

                    {total > 0 && (
                        <>
                            <div key={index} className="relative z-10 mt-6 animate-[apparition_.4s_ease-out]">
                                <Carte {...versCarte(incidents[index])} />
                            </div>

                            <div className="relative z-10 mt-6 flex justify-center">
                                <Pagination total={total} actif={index} onChange={setIndex} />
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="mx-auto max-w-6xl py-16 text-center md:py-24">
                <h2 className="texte-chrome text-[clamp(2.5rem,5vw,4rem)]">QG des Héros</h2>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 md:grid-cols-4">
                    {chiffres.map((stat) => (
                        <div key={stat.libelle} className="carte-stat">
                            <span className="stat-valeur">{stat.valeur}</span>
                            <span className="stat-libelle">{stat.libelle}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl py-16 text-left md:py-24">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="mt-3 text-white">
                            Annuaire des <span className="text-rouge-alerte texte-glow-rouge">Héros</span>
                        </h2>
                    </div>
                </div>

                <GrilleHeros heros={heros} />

                <Link to="/super-heros" className="group mt-10 inline-flex items-center gap-2 font-display text-lg font-black italic uppercase tracking-wide text-cyan-neon">
                    Voir tous les héros
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </section>

            <section className="degrade-bandeau trame-bandeau left-1/2 w-screen -translate-x-1/2 border-y-2 border-noir -mb-11">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-10">
                    <div className="text-left">
                        <h2 className="ombre-bd text-[clamp(2rem,4vw,3rem)] text-white">Un vilain en vue ?</h2>
                        <p className="mt-1 text-sm! text-white/80">Signale-le maintenant, un héros arrive en quelques minutes.</p>
                    </div>
                    {peutSignaler && (
                        <Link to="/profil/signaler-incidents" className="bouton-bd w-full shrink-0 rounded-full px-7 py-3 text-lg sm:w-auto">
                            Signaler un incident
                        </Link>
                    )}
                </div>
            </section>
        </>
    )
}