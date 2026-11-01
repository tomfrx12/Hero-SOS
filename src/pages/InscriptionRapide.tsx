import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { Siren } from "lucide-react"
import Champ from "../composants/Champ"
import Bouton from "../composants/ui/Bouton"
import { useSession } from "../contexte/session"
import { appelApi } from "../services/api"

const avantages = [
    "Compte créé en 30 secondes",
    "Un héros alerté en quelques minutes",
    "Suis l'intervention en direct",
    "Complète ton profil plus tard pour accéder à toutes les fonctionnalités",
]

export default function InscriptionRapide() {
    const { connecter } = useSession()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")
        setEnvoi(true)

        try {
            const donnees = await appelApi("/auth/inscription-rapide", "POST", { email, mot_de_passe: motDePasse })
            connecter(donnees.token, donnees.utilisateur)
            navigate("/profil/signaler-incidents")
        } catch (e) {
            setErreur((e as Error).message)
            setEnvoi(false)
        }
    }

    return (
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-2">
            <div className="degrade-action halftone flex flex-col justify-between p-8 md:p-10">
                <h1 className="text-[clamp(3rem,5vw,4.5rem)] text-white">
                    Signale en <span className="ombre-bd">30 secondes</span>
                </h1>

                <ul className="liste-puces text-white/90 [--puce:var(--color-fond-clair)]">
                    {avantages.map((avantage) => (
                        <li key={avantage}>{avantage}</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-8 p-8 md:p-10">
                <div>
                    <span className="libelle text-gris-trait/70">Urgence</span>
                    <h2 className="mt-2 text-4xl text-white">Crée ton compte</h2>
                </div>

                <form onSubmit={envoyer} className="flex flex-col gap-5">
                    <Champ
                        label="Email"
                        type="email"
                        placeholder="camille@email.fr"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Champ
                        label="Mot de passe (8 caractères minimum)"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                    />

                    {erreur && (
                        <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                            {erreur}
                        </p>
                    )}

                    <Bouton type="submit" icone={Siren} disabled={envoi} className="w-full">
                        {envoi ? "Création…" : "Créer et signaler"}
                    </Bouton>
                </form>

                <p className="text-sm! text-gris-trait/70">
                    Déjà un compte ?{" "}
                    <Link to="/connexion" className="font-semibold text-white hover:underline">Se connecter</Link>
                    {" "}·{" "}
                    <Link to="/inscription" className="font-semibold text-white hover:underline">Inscription complète</Link>
                </p>
            </div>
        </section>
    )
}
