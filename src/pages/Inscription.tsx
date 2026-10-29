import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router"
import Champ from "../composants/Champ"
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
    adresse: "",
    complement_adresse: "",
    ville: "",
    code_postal: "",
    pays: "France",
    mot_de_passe: "",
    confirmation: "",
}

export default function Inscription() {
    const { connexion } = useSession()

    const [formulaire, setFormulaire] = useState(formulaireVide)
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

        if (formulaire.mot_de_passe !== formulaire.confirmation) {
            setErreur("Les deux mots de passe ne sont pas identiques")
            return
        }

        setEnvoi(true)
        try {
            // On n'envoie pas la confirmation, et le pseudo seulement pour un héros
            // (le pseudo est unique en base, un pseudo vide bloquerait le 2e citoyen)
            await appelApi("/auth/inscription", "POST", {
                ...formulaire,
                confirmation: undefined,
                pseudo: estHeros ? formulaire.pseudo : undefined,
            })

            if (estHeros) {
                // Un super-héros doit être validé par un administrateur avant de se connecter
                setEnAttente(true)
            } else {
                // Une fois connecté, RouteNonConnecte redirige tout seul
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
            <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 text-left">
                <h1 className="text-5xl">Demande envoyée</h1>
                <p>Votre compte super-héros doit être validé par un administrateur. Vous pourrez vous connecter dès qu'il sera accepté.</p>
                <Link to="/" className="underline">Retour à l'accueil</Link>
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-6 text-left">
            <h1>Créer un compte</h1>

            <form onSubmit={envoyer} className="flex flex-col gap-4">
                <fieldset className="flex flex-col gap-3 rounded border border-gris-trait p-4">
                    <legend className="px-1 font-semibold">Je suis</legend>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="Citoyens" checked={formulaire.role === "Citoyens"} onChange={modifier} />
                        Citoyen
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="SuperHeros" checked={estHeros} onChange={modifier} />
                        Super-héros
                    </label>
                    {estHeros && (
                        <Champ label="Pseudo" name="pseudo" required value={formulaire.pseudo} onChange={modifier} />
                    )}
                </fieldset>

                <fieldset className="flex flex-col gap-3 rounded border border-gris-trait p-4">
                    <legend className="px-1 font-semibold">Informations personnelles</legend>
                    <label className="flex flex-col gap-1 text-sm">
                        <span>Civilité</span>
                        <select className="rounded border border-gris-trait px-3 py-2 text-base" name="civilite" required value={formulaire.civilite} onChange={modifier}>
                            <option value="" disabled>Choisir</option>
                            <option value="M.">M.</option>
                            <option value="Mme">Mme</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </label>
                    <Champ label="Nom" name="nom" autoComplete="family-name" required value={formulaire.nom} onChange={modifier} />
                    <Champ label="Prénom" name="prenom" autoComplete="given-name" required value={formulaire.prenom} onChange={modifier} />
                    <Champ label="Date de naissance" name="date_de_naissance" type="date" autoComplete="bday" required value={formulaire.date_de_naissance} onChange={modifier} />
                </fieldset>

                <fieldset className="flex flex-col gap-3 rounded border border-gris-trait p-4">
                    <legend className="px-1 font-semibold">Coordonnées</legend>
                    <Champ label="Email" name="email" type="email" autoComplete="email" required value={formulaire.email} onChange={modifier} />
                    <Champ label="Numéro de portable" name="numero_tel" type="tel" autoComplete="tel" required value={formulaire.numero_tel} onChange={modifier} />
                    <Champ label="Rue" name="adresse" autoComplete="street-address" required value={formulaire.adresse} onChange={modifier} />
                    <Champ label="Complément d'adresse (facultatif)" name="complement_adresse" value={formulaire.complement_adresse} onChange={modifier} />
                    <Champ label="Ville" name="ville" autoComplete="address-level2" required value={formulaire.ville} onChange={modifier} />
                    <Champ label="Code postal" name="code_postal" autoComplete="postal-code" required value={formulaire.code_postal} onChange={modifier} />
                    <Champ label="Pays" name="pays" autoComplete="country-name" required value={formulaire.pays} onChange={modifier} />
                </fieldset>

                <fieldset className="flex flex-col gap-3 rounded border border-gris-trait p-4">
                    <legend className="px-1 font-semibold">Sécurité</legend>
                    <Champ label="Mot de passe (8 caractères min.)" name="mot_de_passe" type="password" autoComplete="new-password" minLength={8} required value={formulaire.mot_de_passe} onChange={modifier} />
                    <Champ label="Confirmation du mot de passe" name="confirmation" type="password" autoComplete="new-password" required value={formulaire.confirmation} onChange={modifier} />
                </fieldset>

                {erreur && <p role="alert" className="text-rouge-alerte">{erreur}</p>}

                <button type="submit" disabled={envoi} className="rounded bg-rouge-alerte hover:bg-rouge-profond px-4 py-2 text-white disabled:opacity-50">
                    {envoi ? "Création…" : "Créer mon compte"}
                </button>
            </form>

            <p>
                Déjà inscrit ? <Link to="/connexion" className="underline">Se connecter</Link>
            </p>
        </section>
    )
}
