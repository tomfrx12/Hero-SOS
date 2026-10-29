import { useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { Link } from "react-router"
import { ArrowRight, Siren, Zap } from "lucide-react"
import Bouton from "../composants/ui/Bouton"
import BoutonRond from "../composants/ui/BoutonRond"
import Carte, { type InfoCarte } from "../composants/ui/Carte"
import CarteHeros, { type StatHeros } from "../composants/ui/CarteHeros"
import Pagination from "../composants/ui/Pagination"

// Données d'exemple en attendant l'API
const incidents: { titre: string, statut: string, temps: string, infos: InfoCarte[] }[] = [
    { titre: "Vilain neutralisé", statut: "Résolu", temps: "Il y a 8 min", infos: [
        { libelle: "Vilain", valeur: "Docteur Rouille", ton: "rouge" },
        { libelle: "Héros", valeur: "Nova", ton: "clair" },
        { libelle: "Localisation", valeur: "La Gare" },
        { libelle: "Durée", valeur: "14 min" },
    ] },
    { titre: "Braquage au port", statut: "En cours", temps: "Il y a 12 min", infos: [
        { libelle: "Vilain", valeur: "Le Crabe", ton: "rouge" },
        { libelle: "Héros", valeur: "Flamme Bleue", ton: "clair" },
        { libelle: "Localisation", valeur: "Les Docks" },
        { libelle: "Menace", valeur: "Élevée", ton: "rouge" },
    ] },
    { titre: "Incendie tour nord", statut: "Assigné", temps: "Il y a 40 min", infos: [
        { libelle: "Vilain", valeur: "Pyros", ton: "rouge" },
        { libelle: "Héros", valeur: "Hydra", ton: "clair" },
        { libelle: "Localisation", valeur: "Centre" },
        { libelle: "Victimes", valeur: "Aucune", ton: "clair" },
    ] },
    { titre: "Otages libérés", statut: "Résolu", temps: "Hier", infos: [
        { libelle: "Vilain", valeur: "Masque Noir", ton: "rouge" },
        { libelle: "Héros", valeur: "Titan", ton: "clair" },
        { libelle: "Localisation", valeur: "Le Marché" },
        { libelle: "Durée", valeur: "1 h 05" },
    ] },
]

// Données d'exemple en attendant l'API
const stats = [
    { valeur: "1 248", libelle: "Héros actifs" },
    { valeur: "3 902", libelle: "Incidents signalés" },
    { valeur: "97 %", libelle: "Missions réussies" },
    { valeur: "4 min", libelle: "Temps moyen" },
]

// Données d'exemple en attendant l'API
const categories = ["Tous", "Force", "Vitesse", "Tech", "Mystique"]

const heros: { nom: string, initiales: string, photo?: string, pouvoir: string, ville: string, categorie: string, accent: string, stats: StatHeros[] }[] = [
    { nom: "Nova", initiales: "NV", pouvoir: "Énergie stellaire", ville: "La Gare", categorie: "Mystique", accent: "var(--color-cyan-neon)", stats: [{ valeur: "4,9", suffixe: "/5", libelle: "128 avis" }, { valeur: "312", libelle: "Missions réussies" }] },
    { nom: "Flamme Bleue", initiales: "FB", pouvoir: "Pyrokinésie", ville: "Les Docks", categorie: "Force", accent: "var(--color-rouge-alerte)", stats: [{ valeur: "4,7", suffixe: "/5", libelle: "96 avis" }, { valeur: "245", libelle: "Missions réussies" }] },
    { nom: "Hydra", initiales: "HY", pouvoir: "Contrôle de l'eau", ville: "Centre", categorie: "Mystique", accent: "var(--color-violet-neon)", stats: [{ valeur: "4,8", suffixe: "/5", libelle: "74 avis" }, { valeur: "198", libelle: "Missions réussies" }] },
    { nom: "Titan", initiales: "TI", pouvoir: "Force colossale", ville: "Le Marché", categorie: "Force", accent: "var(--color-ambre)", stats: [{ valeur: "4,6", suffixe: "/5", libelle: "152 avis" }, { valeur: "407", libelle: "Missions réussies" }] },
    { nom: "Éclair", initiales: "EC", pouvoir: "Super vitesse", ville: "Le Port", categorie: "Vitesse", accent: "var(--color-ambre)", stats: [{ valeur: "4,9", suffixe: "/5", libelle: "211 avis" }, { valeur: "530", libelle: "Missions réussies" }] },
    { nom: "Circuit", initiales: "CI", pouvoir: "Technopathie", ville: "Quartier Nord", categorie: "Tech", accent: "var(--color-cyan-neon)", stats: [{ valeur: "4,5", suffixe: "/5", libelle: "63 avis" }, { valeur: "141", libelle: "Missions réussies" }] },
    { nom: "Ombre", initiales: "OM", pouvoir: "Téléportation", ville: "Vieille Ville", categorie: "Vitesse", accent: "var(--color-violet-neon)", stats: [{ valeur: "4,8", suffixe: "/5", libelle: "88 avis" }, { valeur: "276", libelle: "Missions réussies" }] },
    { nom: "Armure", initiales: "AR", pouvoir: "Exosquelette", ville: "Zone Sud", categorie: "Tech", accent: "var(--color-rouge-alerte)", stats: [{ valeur: "4,7", suffixe: "/5", libelle: "119 avis" }, { valeur: "333", libelle: "Missions réussies" }] },
]

export default function Index() {
    const fondRef = useRef<HTMLImageElement>(null)
    const titreRef = useRef<HTMLDivElement>(null)

    useLenis(({ scroll }) => {
        fondRef.current!.style.transform = `translate3d(0, ${scroll * 0.6}px, 0)`
        titreRef.current!.style.transform = `translate3d(0, ${scroll * 0.4}px, 0)`
    })

    const [index, setIndex] = useState(0)
    const [categorie, setCategorie] = useState("Tous")
    const total = incidents.length

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
                        <Bouton to="/profil/signaler-incidents" icone={Siren}>Signaler un incident</Bouton>
                        <Bouton to="/super-heros" variante="secondaire" icone={Zap}>Voir les héros</Bouton>
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

                    <div key={index} className="relative z-10 mt-6 animate-[apparition_.4s_ease-out]">
                        <Carte {...incidents[index]} />
                    </div>

                    <div className="relative z-10 mt-6 flex justify-center">
                        <Pagination total={total} actif={index} onChange={setIndex} />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
                <h2 className="texte-chrome text-[clamp(2.5rem,5vw,4rem)]">QG des Héros</h2>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.libelle} className="carte-stat">
                            <span className="stat-valeur">{stat.valeur}</span>
                            <span className="stat-libelle">{stat.libelle}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 text-left md:py-24">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="mt-3 text-white">
                            Annuaire des <span className="text-rouge-alerte texte-glow-rouge">Héros</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((nom) => (
                            <button
                                key={nom}
                                onClick={() => setCategorie(nom)}
                                className={`rounded-full border px-4 py-1.5 text-xs font-bold italic uppercase tracking-wider transition-colors ${categorie === nom
                                    ? "border-cyan-neon bg-cyan-neon text-noir shadow-[0_0_14px_color-mix(in_oklab,var(--color-cyan-neon)_45%,transparent)]"
                                    : "border-gris-texte text-gris-trait/70 hover:border-cyan-neon"}`}
                            >
                                {nom}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grille-heros mt-8 grid gap-5 md:mt-12 sm:grid-cols-2 lg:grid-cols-4">
                    {heros.filter((h) => categorie === "Tous" || h.categorie === categorie).map((h) => (
                        <CarteHeros key={h.nom} {...h} />
                    ))}
                </div>

                <Link to="/super-heros" className="group mt-10 inline-flex items-center gap-2 font-display text-lg font-black italic uppercase tracking-wide text-cyan-neon">
                    Voir tous les héros
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </section>

            <section className="degrade-bandeau trame-bandeau left-1/2 w-screen -translate-x-1/2 border-y-2 border-noir">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-10">
                    <div className="text-left">
                        <h2 className="ombre-bd text-[clamp(2rem,4vw,3rem)] text-white">Un vilain en vue ?</h2>
                        <p className="mt-1 text-sm! text-white/80">Signale-le maintenant, un héros arrive en quelques minutes.</p>
                    </div>
                    <Link to="/profil/signaler-incidents" className="bouton-bd w-full shrink-0 rounded-full px-7 py-3 text-lg sm:w-auto">
                        Signaler un incident
                    </Link>
                </div>
            </section>
        </>
    )
}