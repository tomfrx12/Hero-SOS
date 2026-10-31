import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router"
import { ChevronDown, UserPlus } from "lucide-react"
import Champ from "../composants/Champ"
import ChampAdresse, { type Adresse } from "../composants/ChampAdresse"
import Bouton from "../composants/ui/Bouton"
import { useSession } from "../contexte/session"
import { appelApi } from "../services/api"

const formulaireVide = {
    role: "Citoyens",
    pseudo: "",
    civilite: "",
    nom: "",
    prenom: "",
    date_de_naissance: "",
    email: "",
    numero_tel: "",
    complement_adresse: "",
    mot_de_passe: "",
    confirmation: "",
}

const avantages = [
    "Citoyen : ton compte est actif tout de suite",
    "Super-héros : ta candidature est validée par un administrateur",
    "Signale les incidents près de chez toi",
    "Suis chaque intervention en direct",
    "Inscription gratuite, en deux minutes",
]

const roles = [
    { valeur: "Citoyens", titre: "Citoyen", detail: "Je signale des incidents" },
    { valeur: "SuperHeros", titre: "Super-héros", detail: "J'interviens sur le terrain" },
]

const styleTitreBloc = "mb-2 font-display text-2xl font-black italic uppercase text-white"

export default function Inscription() {
    const { connexion } = useSession()

    const [formulaire, setFormulaire] = useState(formulaireVide)
    // Rue, code postal, ville, pays et coordonnées GPS, remplis par ChampAdresse
    const [adresse, setAdresse] = useState<Adresse | null>(null)
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)
    const [enAttente, setEnAttente] = useState(false)

    const estHeros = formulaire.role === "SuperHeros"

    function modifier(evenement: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormulaire({ ...formulaire, [evenement.target.name]: evenement.target.value })
    }


    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")

        if (!adresse) {
            setErreur("Recherche ton adresse puis choisis-la dans la liste")
            return
        }

        if (formulaire.mot_de_passe !== formulaire.confirmation) {
            setErreur("Les deux mots de passe ne sont pas identiques")
            return
        }

        setEnvoi(true)
        try {
            await appelApi("/auth/inscription", "POST", {...formulaire, ...adresse, confirmation: undefined, pseudo: estHeros ? formulaire.pseudo : undefined})

            if (estHeros) {
                setEnAttente(true)
            } else {
                await connexion(formulaire.email, formulaire.mot_de_passe)
            }
        } catch (e) {
            setErreur((e as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    if (enAttente) {
        return (
            <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left">
                <div className="degrade-action halftone p-8 md:p-10">
                    <span className="libelle text-fond-clair/80!">Candidature super-héros</span>
                    <h1 className="mt-3 text-[clamp(3rem,5vw,4.5rem)] text-white">
                        Demande <span className="ombre-bd">envoyée</span>
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-6 p-8 md:p-10">
                    <p className="text-gris-trait/80">
                        Ton compte super-héros doit être validé par un administrateur.
                        <br/>
                        Tu pourras te connecter dès qu'il sera accepté.
                    </p>
                    <Bouton to="/">Retour à l'accueil</Bouton>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-[2fr_3fr]">
            <div className="degrade-action halftone p-8 md:p-10">
                <div className="flex flex-col gap-10 md:mt-20">
                    <h1 className="text-[clamp(3rem,5vw,4.5rem)] text-white">
                        Entre dans l'<span className="ombre-bd">action</span>
                    </h1>

                    <ul className="liste-puces text-white/90 [--puce:var(--color-fond-clair)]">
                        {avantages.map((avantage) => (
                            <li key={avantage}>{avantage}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-8 p-8 md:p-10">
                <h2 className="text-4xl text-white">Crée ton compte</h2>

                <form onSubmit={envoyer} className="flex flex-col gap-10">
                    <fieldset>
                        <legend className={styleTitreBloc}>Je suis</legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {roles.map((role) => (
                                <label
                                    key={role.valeur}
                                    className="cursor-pointer rounded-xl border border-gris-texte/60 bg-noir p-4 transition-colors hover:border-gris-trait/60 has-checked:border-rouge-alerte has-checked:bg-rouge-alerte/15"
                                >
                                    <input type="radio" name="role" value={role.valeur} checked={formulaire.role === role.valeur} onChange={modifier} className="sr-only" />
                                    <span className="block font-display text-xl font-black italic uppercase text-white">{role.titre}</span>
                                    <span className="text-sm text-gris-trait/70">{role.detail}</span>
                                </label>
                            ))}
                        </div>
                        {estHeros && (
                            <div className="mt-4">
                                <Champ label="Pseudo de super-héros" name="pseudo" placeholder="Flamme Bleue" required value={formulaire.pseudo} onChange={modifier} />
                            </div>
                        )}
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Identité</legend>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex flex-col gap-2">
                                <span className="libelle">Civilité</span>
                                <span className="relative">
                                    <select className="w-full appearance-none rounded-xl border border-gris-texte/60 bg-noir py-3 pr-10 pl-4 text-fond-clair outline-none transition-colors focus:border-rouge-alerte focus:glow-rouge" name="civilite" required value={formulaire.civilite} onChange={modifier}>
                                        <option value="" disabled>Choisir</option>
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gris-trait/60" />
                                </span>
                            </label>
                            <Champ label="Date de naissance" name="date_de_naissance" type="date" autoComplete="bday" required value={formulaire.date_de_naissance} onChange={modifier} />
                            <Champ label="Nom" name="nom" placeholder="Dupont" autoComplete="family-name" required value={formulaire.nom} onChange={modifier} />
                            <Champ label="Prénom" name="prenom" placeholder="Camille" autoComplete="given-name" required value={formulaire.prenom} onChange={modifier} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Coordonnées</legend>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Champ label="Email" name="email" placeholder="camille@email.fr" type="email" autoComplete="email" required value={formulaire.email} onChange={modifier} />
                            <Champ label="Numéro de portable" name="numero_tel" placeholder="06 12 34 56 78" type="tel" autoComplete="tel" required value={formulaire.numero_tel} onChange={modifier} />
                            <div className="sm:col-span-2">
                                <ChampAdresse onChoisir={setAdresse} />
                            </div>
                            <div className="sm:col-span-2">
                                <Champ label="Complément d'adresse (facultatif)" name="complement_adresse" placeholder="Bâtiment, étage, appartement…" value={formulaire.complement_adresse} onChange={modifier} />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Sécurité</legend>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Champ label="Mot de passe (8 min.)" name="mot_de_passe" type="password" placeholder="••••••••" autoComplete="new-password" minLength={8} required value={formulaire.mot_de_passe} onChange={modifier} />
                            <Champ label="Confirmation" name="confirmation" type="password" placeholder="••••••••" autoComplete="new-password" required value={formulaire.confirmation} onChange={modifier} />
                        </div>
                    </fieldset>

                    <div className="flex flex-col gap-5">
                        {/* Ouvert dans un nouvel onglet pour ne pas perdre le formulaire déjà rempli */}
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-gris-trait/80">
                            <input type="checkbox" required className="mt-1 size-4 shrink-0 accent-rouge-alerte" />
                            <span>
                                J'ai lu et j'accepte la{" "}
                                <Link to="/politique-de-confidentialite" target="_blank" className="text-white underline underline-offset-4 hover:text-rouge-alerte">politique de confidentialité</Link>
                                {" "}et le traitement de mes données pour la gestion de mon compte.
                            </span>
                        </label>

                        {erreur && (
                            <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                                {erreur}
                            </p>
                        )}

                        <Bouton type="submit" icone={UserPlus} disabled={envoi} className="w-full">
                            {envoi ? "Création…" : "Créer mon compte"}
                        </Bouton>
                    </div>
                </form>

                <p className="text-sm! text-gris-trait/70">
                    Déjà inscrit ?{" "}
                    <Link to="/connexion" className="font-semibold text-white hover:underline">Se connecter</Link>
                </p>
            </div>
        </section>
    )
}