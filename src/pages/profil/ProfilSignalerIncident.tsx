import { useState, type ChangeEvent, type FormEvent } from "react"
import { Siren } from "lucide-react"
import ChampAdresse, { type Adresse } from "../../composants/ChampAdresse"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"

// À aligner sur les types acceptés par le back
const typesIncident = [
    { valeur: "Incendie", detail: "Feu, fumée, explosion" },
    { valeur: "Agression", detail: "Vol, violence, menace" },
    { valeur: "Accident", detail: "Route, chute, effondrement" },
    { valeur: "Catastrophe naturelle", detail: "Inondation, séisme, tempête" },
    { valeur: "Super-vilain", detail: "Attaque d'un super-vilain" },
    { valeur: "Autre", detail: "Tout autre danger" },
]

const conseils = [
    "Mets-toi d'abord en sécurité",
    "Vérifie que l'incident n'est pas déjà signalé",
    "Indique l'adresse la plus précise possible",
    "Décris ce que tu vois : nombre de personnes, dangers…",
    "En cas d'urgence vitale, appelle le 112",
]

const formulaireVide = {
    type: "",
    description: "",
}

const styleTitreBloc = "mb-2 font-display text-2xl font-black italic uppercase text-white"

export default function ProfilSignalerIncident() {
    const [formulaire, setFormulaire] = useState(formulaireVide)
    const [adresse, setAdresse] = useState<Adresse | null>(null)
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)
    const [envoye, setEnvoye] = useState(false)

    function modifier(evenement: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormulaire({ ...formulaire, [evenement.target.name]: evenement.target.value })
    }

    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")

        if (!formulaire.type) {
            setErreur("Choisis le type d'incident")
            return
        }

        if (!adresse) {
            setErreur("Recherche l'adresse de l'incident puis choisis-la dans la liste")
            return
        }

        setEnvoi(true)
        try {
            await appelApi("/incidents", "POST", { ...formulaire, ...adresse })
            setEnvoye(true)
        } catch (e) {
            setErreur((e as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    if (envoye) {
        return (
            <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left">
                <div className="degrade-action halftone p-8 md:p-10">
                    <span className="libelle text-fond-clair/80!">Incident signalé</span>
                    <h1 className="mt-3 text-[clamp(3rem,5vw,4.5rem)] text-white">
                        Alerte <span className="ombre-bd">envoyée</span>
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-6 p-8 md:p-10">
                    <p className="text-gris-trait/80">
                        Merci ! Les super-héros disponibles ont été prévenus.
                        <br/>
                        Tu peux suivre l'intervention depuis ton profil.
                    </p>
                    <Bouton to="/profil/incidents">Suivre mes incidents</Bouton>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-[2fr_3fr]">
            <div className="degrade-action halftone p-8 md:p-10">
                <div className="flex flex-col gap-10 md:mt-20">
                    <h1 className="text-[clamp(3rem,5vw,4.5rem)] text-white">
                        Donne l'<span className="ombre-bd">alerte</span>
                    </h1>

                    <ul className="liste-puces text-white/90 [--puce:var(--color-fond-clair)]">
                        {conseils.map((conseil) => (
                            <li key={conseil}>{conseil}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-8 p-8 md:p-10">
                <h2 className="text-4xl text-white">Signaler un incident</h2>

                <form onSubmit={envoyer} className="flex flex-col gap-10">
                    <fieldset>
                        <legend className={styleTitreBloc}>Type d'incident</legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {typesIncident.map((type) => (
                                <label
                                    key={type.valeur}
                                    className="cursor-pointer rounded-xl border border-gris-texte/60 bg-noir p-4 transition-colors hover:border-gris-trait/60 has-checked:border-rouge-alerte has-checked:bg-rouge-alerte/15"
                                >
                                    <input type="radio" name="type" value={type.valeur} checked={formulaire.type === type.valeur} onChange={modifier} className="sr-only" />
                                    <span className="block font-display text-xl font-black italic uppercase text-white">{type.valeur}</span>
                                    <span className="text-sm text-gris-trait/70">{type.detail}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Lieu</legend>
                        <ChampAdresse onChoisir={setAdresse} />
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Description</legend>
                        <label className="flex flex-col gap-2">
                            <span className="libelle">Que se passe-t-il ? (20 min.)</span>
                            <textarea
                                name="description"
                                rows={5}
                                minLength={20}
                                required
                                placeholder="Un immeuble est en feu, deux personnes sont bloquées au 3e étage…"
                                value={formulaire.description}
                                onChange={modifier}
                                className="w-full resize-y rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge"
                            />
                        </label>
                    </fieldset>

                    <div className="flex flex-col gap-5">
                        {erreur && (
                            <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                                {erreur}
                            </p>
                        )}

                        <Bouton type="submit" icone={Siren} disabled={envoi} className="w-full">
                            {envoi ? "Envoi…" : "Envoyer l'alerte"}
                        </Bouton>
                    </div>
                </form>
            </div>
        </section>
    )
}
