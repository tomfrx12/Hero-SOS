import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { LogIn } from "lucide-react"
import Champ from "../composants/Champ"
import Bouton from "../composants/ui/Bouton"
import { useSession } from "../contexte/session"

const avantages = [
    "Signale un incident en quelques secondes",
    "Suis l'intervention du héros en direct",
    "Retrouve l'historique de tes signalements",
    "Note les héros après chaque mission",
    "Tes données restent protégées",
]

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
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-2">
            <div className="degrade-action halftone flex flex-col justify-between p-8 md:p-10">
                <h1 className="text-[clamp(3rem,5vw,4.5rem)] text-white">
                    La ville <span className="ombre-bd">compte</span> sur toi
                </h1>

                <ul className="liste-puces text-white/90 [--puce:var(--color-fond-clair)]">
                    {avantages.map((avantage) => (
                        <li key={avantage}>{avantage}</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-8 p-8 md:p-10">
                <div>
                    <h2 className="mt-2 text-4xl text-white">Identifie-toi</h2>
                </div>

                <form onSubmit={envoyer} className="flex flex-col gap-5">
                    <Champ label="Email ou pseudo" placeholder="camille@email.fr ou ton pseudo" autoComplete="username" required value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
                    <Champ label="Mot de passe" placeholder="••••••••" type="password" autoComplete="current-password" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />

                    <Link to="/reinitialiser-le-mot-de-passe" className="text-sm text-gris-trait/70 transition-colors hover:text-white">
                        Mot de passe oublié ?
                    </Link>

                    {erreur && (
                        <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                            {erreur}
                        </p>
                    )}

                    <Bouton type="submit" icone={LogIn} disabled={envoi} className="w-full">
                        {envoi ? "Connexion…" : "Se connecter"}
                    </Bouton>
                </form>

                <p className="text-sm! text-gris-trait/70">
                    Pas encore de compte ?{" "}
                    <Link to="/inscription" className="font-semibold text-white hover:underline">Créer un compte</Link>
                </p>
            </div>
        </section>
    )
}
