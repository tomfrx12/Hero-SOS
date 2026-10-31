import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router"
import { appelApi } from "../services/api"

export default function NewsletterDesinscrire() {
    const [searchParams] = useSearchParams()
    const [message, setMessage] = useState("")
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        const token = searchParams.get("token")
        if (!token) {
            setErreur("Lien invalide.")
            return
        }
        appelApi(`/newsletter?token=${encodeURIComponent(token)}`, "DELETE")
            .then((donnees) => setMessage(donnees.message))
            .catch((err: Error) => setErreur(err.message))
    }, [searchParams])

    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="font-display text-3xl font-black italic uppercase text-white">Newsletter</h1>
            {!message && !erreur && <p className="text-gris-trait/70">Traitement en cours…</p>}
            {message && <p className="text-fond-clair">{message}</p>}
            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            <Link to="/" className="text-sm text-gris-trait/70 underline hover:text-white">
                Retour à l'accueil
            </Link>
        </main>
    )
}
