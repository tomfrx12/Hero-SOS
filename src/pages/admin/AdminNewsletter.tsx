import { useState, type FormEvent } from "react"
import Champ from "../../composants/Champ"
import Bouton from "../../composants/ui/Bouton"
import { appelApi } from "../../services/api"
import { Send } from "lucide-react"

export default function AdminNewsletter() {
    const [sujet, setSujet] = useState("")
    const [corps, setCorps] = useState("")
    const [destinataireId, setDestinataireId] = useState("")
    const [message, setMessage] = useState("")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    async function envoyer(e: FormEvent) {
        e.preventDefault()
        setEnvoi(true)
        setMessage("")
        setErreur("")
        try {
            const donnees = await appelApi("/admin/newsletter/envoyer", "POST", {
                sujet,
                corps,
                ...(destinataireId ? { destinataireId: Number(destinataireId) } : {}),
            })
            setMessage(donnees.message)
            setSujet("")
            setCorps("")
            setDestinataireId("")
        } catch (err) {
            setErreur((err as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-display text-3xl font-black italic uppercase text-white">Newsletter</h1>

            <form onSubmit={envoyer} className="flex flex-col gap-5 rounded-2xl border border-gris-texte/40 bg-graphite p-6 sm:p-8">
                <Champ
                    label="Sujet"
                    required
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                    <label className="libelle">Contenu</label>
                    <textarea
                        required
                        rows={8}
                        value={corps}
                        onChange={(e) => setCorps(e.target.value)}
                        className="rounded-xl border border-gris-texte/40 bg-noir px-4 py-3 text-white outline-none focus:border-fond-clair"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Champ
                        label="ID d'un utilisateur précis (laisser vide pour envoyer à tous les abonnés)"
                        type="number"
                        value={destinataireId}
                        onChange={(e) => setDestinataireId(e.target.value)}
                    />
                </div>

                {message && (
                    <p role="status" className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-sm! text-fond-clair">
                        {message}
                    </p>
                )}
                {erreur && (
                    <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                        {erreur}
                    </p>
                )}

                <Bouton type="submit" icone={Send} disabled={envoi} className="self-start">
                    {envoi ? "Envoi…" : destinataireId ? "Envoyer à cet utilisateur" : "Envoyer à tous les abonnés"}
                </Bouton>
            </form>
        </div>
    )
}
