import { useState, type ChangeEvent, type FormEvent } from "react"
import { ChevronDown, Map, MapPin, Siren } from "lucide-react"
import Champ from "../../composants/Champ"
import ChampAdresse, { type Adresse } from "../../composants/ChampAdresse"
import ChampCarte from "../../composants/ChampCarte"
import IncidentsProches from "../../composants/IncidentsProches"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"

const TYPES_INCIDENT = [
    "Attaque de super-vilain",
    "Catastrophe naturelle",
    "Incendie",
    "Accident de la route",
    "Personnes en danger",
    "Menace chimique ou biologique",
    "Infrastructure endommagée",
    "Autre",
]

const urgences = [
    "Un héros est alerté dans la minute",
    "Tu suis l'intervention en direct",
    "Le quartier est sécurisé plus vite",
]

const formulaireVide = {
    type: "",
    complement_adresse: "",
    description: "",
}

const styleLegend = "mb-4 font-display text-xl sm:text-2xl font-black italic uppercase text-white"

export default function ProfilSignalerIncident() {
    const [formulaire, setFormulaire] = useState(formulaireVide)
    const [adresse, setAdresse] = useState<Adresse | null>(null)
    const [modeLocalisation, setModeLocalisation] = useState<"adresse" | "carte">("adresse")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)
    const [envoye, setEnvoye] = useState(false)

    function modifier(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setFormulaire({ ...formulaire, [e.target.name]: e.target.value })
    }

    async function envoyer(e: FormEvent) {
        e.preventDefault()
        setErreur("")

        if (!adresse) {
            setErreur("Recherche une adresse puis choisis-la dans la liste")
            return
        }

        setEnvoi(true)
        try {
            await appelApi("/incidents", "POST", { ...formulaire, ...adresse })
            setEnvoye(true)
        } catch (err) {
            setErreur((err as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    if (envoye) {
        return (
            <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left">
                <div className="degrade-action halftone p-6 sm:p-8 md:p-10">
                    <span className="libelle text-fond-clair/80!">Signalement envoyé</span>
                    <h1 className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] text-white">
                        À l'<span className="ombre-bd">action !</span>
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-6 p-6 sm:p-8 md:p-10">
                    <p className="text-gris-trait/80">
                        Ton signalement a bien été transmis. Un super-héros sera dépêché dès que possible.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Bouton
                            type="button"
                            onClick={() => { setEnvoye(false); setFormulaire(formulaireVide); setAdresse(null) }}
                            variante="secondaire"
                        >
                            Nouveau signalement
                        </Bouton>
                        <Bouton to="/profil/incidents">Mes incidents</Bouton>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-[2fr_3fr]">

            {/* Panneau gauche — bannière compacte sur mobile, panneau plein sur desktop */}
            <div className="degrade-action halftone p-6 sm:p-8 md:p-10">
                <div className="flex flex-col gap-6 md:mt-20 md:gap-10">
                    <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] text-white">
                        Chaque seconde <span className="ombre-bd">compte</span>
                    </h1>
                    <ul className="hidden flex-col gap-3 text-white/90 sm:flex">
                        {urgences.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm">
                                <Siren size={14} className="mt-0.5 shrink-0 opacity-80" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Formulaire */}
            <div className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 md:p-10">
                <h2 className="text-3xl sm:text-4xl text-white">Signaler un incident</h2>

                <form onSubmit={envoyer} className="flex flex-col gap-8 sm:gap-10">

                    <fieldset>
                        <legend className={styleLegend}>Type d'incident</legend>
                        <label className="flex flex-col gap-2">
                            <span className="libelle">Catégorie</span>
                            <span className="relative">
                                <select
                                    name="type"
                                    required
                                    value={formulaire.type}
                                    onChange={modifier}
                                    className="w-full appearance-none rounded-xl border border-gris-texte/60 bg-noir py-3 pr-10 pl-4 text-fond-clair outline-none transition-colors focus:border-rouge-alerte focus:glow-rouge"
                                >
                                    <option value="" disabled>Choisir un type</option>
                                    {TYPES_INCIDENT.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gris-trait/60" />
                            </span>
                        </label>
                    </fieldset>

                    <fieldset>
                        <legend className={styleLegend}>Localisation</legend>
                        <div className="flex flex-col gap-4">

                            {/* Toggle adresse / carte */}
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { valeur: "adresse", Icone: MapPin, label: "Adresse" },
                                    { valeur: "carte",   Icone: Map,    label: "Carte" },
                                ] as const).map(({ valeur, Icone, label }) => (
                                    <label
                                        key={valeur}
                                        className="cursor-pointer rounded-xl border border-gris-texte/60 bg-noir p-3 sm:p-4 transition-colors hover:border-gris-trait/60 has-checked:border-rouge-alerte has-checked:bg-rouge-alerte/15"
                                    >
                                        <input
                                            type="radio"
                                            name="modeLocalisation"
                                            value={valeur}
                                            checked={modeLocalisation === valeur}
                                            onChange={() => { setModeLocalisation(valeur); setAdresse(null) }}
                                            className="sr-only"
                                        />
                                        <span className="flex items-center gap-2 font-display text-base sm:text-lg font-black italic uppercase text-white">
                                            <Icone size={15} />
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {modeLocalisation === "adresse" ? (
                                <ChampAdresse onChoisir={setAdresse} />
                            ) : (
                                <ChampCarte onChoisir={setAdresse} />
                            )}

                            {adresse && <IncidentsProches key={`${adresse.latitude},${adresse.longitude}`} latitude={adresse.latitude} longitude={adresse.longitude} />}

                            <Champ
                                label="Complément d'adresse (facultatif)"
                                name="complement_adresse"
                                placeholder="Bâtiment, étage, lieu précis…"
                                value={formulaire.complement_adresse}
                                onChange={modifier}
                            />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={styleLegend}>Description</legend>
                        <label className="flex flex-col gap-2">
                            <span className="libelle">Décris la situation</span>
                            <textarea
                                name="description"
                                required
                                value={formulaire.description}
                                onChange={modifier}
                                rows={4}
                                placeholder="Nature de la menace, nombre de personnes impliquées, niveau d'urgence…"
                                className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge resize-y"
                            />
                        </label>
                    </fieldset>

                    <div className="flex flex-col gap-4">
                        {erreur && (
                            <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                                {erreur}
                            </p>
                        )}
                        <Bouton type="submit" icone={Siren} disabled={envoi} className="w-full">
                            {envoi ? "Envoi en cours…" : "Envoyer le signalement"}
                        </Bouton>
                    </div>

                </form>
            </div>
        </section>
    )
}
