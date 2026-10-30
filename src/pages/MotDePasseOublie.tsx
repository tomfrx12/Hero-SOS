import { useState, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router"
import Champ from "../composants/Champ"
import Bouton from "../composants/ui/Bouton"
import { appelApi } from "../services/api"

export default function MotDePasseOublie() {
    // Le lien reçu par mail contient ?token=… : on affiche alors le choix du nouveau mot de passe
    const [parametres] = useSearchParams()
    const token = parametres.get("token")

    const [email, setEmail] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const [confirmation, setConfirmation] = useState("")
    const [message, setMessage] = useState("")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")
        setMessage("")

        if (token && motDePasse !== confirmation) {
            setErreur("Les deux mots de passe ne sont pas identiques")
            return
        }

        setEnvoi(true)
        try {
            const donnees = token
                ? await appelApi("/auth/reinitialiser-mot-de-passe", "POST", { token, mot_de_passe: motDePasse })
                : await appelApi("/auth/mot-de-passe-oublie", "POST", { email })
            setMessage(donnees.message)
        } catch (e) {
            setErreur((e as Error).message)
        }
        setEnvoi(false)
    }

    return (
        <section className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-gris-texte/40 bg-graphite p-8 text-left md:p-10">
            <div>
                <h1 className="text-4xl text-white">{token ? "Nouveau mot de passe" : "Mot de passe oublié"}</h1>
                <p className="mt-3 text-sm! text-gris-trait/70">
                    {token
                        ? "Choisis ton nouveau mot de passe."
                        : "Entre l'email de ton compte, on t'envoie un lien pour choisir un nouveau mot de passe."}
                </p>
            </div>

            {message ? (
                <p role="status" className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-sm! text-fond-clair">
                    {message}
                </p>
            ) : (
                <form onSubmit={envoyer} className="flex flex-col gap-5">
                    {token ? (
                        <>
                            <Champ label="Nouveau mot de passe" type="password" placeholder="••••••••" autoComplete="new-password" required minLength={8} value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
                            <Champ label="Confirmation" type="password" placeholder="••••••••" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
                        </>
                    ) : (
                        <Champ label="Email" type="email" placeholder="camille@email.fr" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    )}

                    {erreur && (
                        <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                            {erreur}
                        </p>
                    )}

                    <Bouton type="submit" disabled={envoi} className="w-full">
                        {envoi ? "Envoi…" : token ? "Changer le mot de passe" : "Recevoir le lien"}
                    </Bouton>
                </form>
            )}

            <Link to="/connexion" className="text-sm text-gris-trait/70 transition-colors hover:text-white">
                Retour à la connexion
            </Link>
        </section>
    )
}
