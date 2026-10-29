import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import Champ from "../composants/Champ"
import { useSession } from "../contexte/session"

export default function Connexion() {
    const { connexion } = useSession()

    const [identifiant, setIdentifiant] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")
        setEnvoi(true)

        try {
            await connexion(identifiant, motDePasse)
        } catch (e) {
            setErreur((e as Error).message)
            setEnvoi(false)
        }
    }

    return (
        <section className="flex flex-col gap-6 text-left">
            <h1>Connexion</h1>

            <form onSubmit={envoyer} className="flex flex-col gap-4">
                <Champ label="Email ou pseudo" autoComplete="username" required value={identifiant} onChange={(e) => setIdentifiant(e.target.value)}/>
                <Champ label="Mot de passe" type="password" autoComplete="current-password" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}/>

                {erreur && <p role="alert" className="text-rouge-alerte">{erreur}</p>}

                <button type="submit" disabled={envoi} className="rounded bg-rouge-alerte hover:bg-rouge-profond px-4 py-2 text-white disabled:opacity-50">
                    {envoi ? "Connexion…" : "Se connecter"}
                </button>
            </form>

            <Link to="/reinitialiser-le-mot-de-passe" className="underline">Mot de passe oublié ?</Link>
            <p>
                Pas encore de compte ? <Link to="/inscription" className="underline">Créer un compte</Link>
            </p>
        </section>
    )
}