import { useEffect, useRef, useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router"
import { Save } from "lucide-react"
import Champ from "../../composants/Champ"
import Bouton from "../../composants/ui/Bouton"
import EditeurRiche from "../../composants/EditeurRiche"
import { appelApi, URL_API } from "../../services/api"
import type { ArticleDetail } from "../../services/articles"

export default function AdminArticle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const estModification = id !== undefined

    const [titre, setTitre] = useState("")
    const [contenu, setContenu] = useState("")
    const [publie, setPublie] = useState(false)
    const [imageActuelle, setImageActuelle] = useState<string | null>(null)
    const [fichierImage, setFichierImage] = useState<File | null>(null)
    const [apercu, setApercu] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const [chargement, setChargement] = useState(estModification)
    const [envoi, setEnvoi] = useState(false)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        if (!estModification) return
        appelApi(`/admin/articles/${id}`)
            .then((data: { article: ArticleDetail }) => {
                setTitre(data.article.titre)
                setContenu(data.article.contenu_html)
                setPublie(data.article.publie)
                setImageActuelle(data.article.image)
            })
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [id, estModification])

    function choisirFichier(e: React.ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0]
        if (!fichier) return
        setFichierImage(fichier)
        setApercu(URL.createObjectURL(fichier))
    }

    async function soumettre(e: FormEvent) {
        e.preventDefault()
        setEnvoi(true)
        setErreur("")

        try {
            const formData = new FormData()
            formData.append("titre", titre)
            formData.append("contenu_html", contenu)
            formData.append("publie", String(publie))
            if (fichierImage) formData.append("image", fichierImage)

            if (estModification) {
                await appelApi(`/admin/articles/${id}`, "PATCH", formData)
            } else {
                await appelApi("/admin/articles", "POST", formData)
            }

            navigate("/dashboard-admin/articles")
        } catch (err) {
            setErreur((err as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    if (chargement) return <p className="text-gris-trait/70">Chargement…</p>

    const imageAffichee = apercu ?? (imageActuelle ? URL_API + imageActuelle : null)

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">
                {estModification ? "Modifier l'article" : "Nouvel article"}
            </h1>

            <form onSubmit={soumettre} className="flex flex-col gap-6">
                <Champ
                    label="Titre"
                    required
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <span className="libelle">Image de couverture</span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        {imageAffichee && (
                            <img
                                src={imageAffichee}
                                alt="Aperçu"
                                className="h-32 w-56 rounded-xl object-cover"
                            />
                        )}
                        <div className="flex flex-col gap-2">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={choisirFichier}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="cursor-pointer rounded-xl border border-gris-texte/60 bg-noir px-4 py-2.5 text-sm text-fond-clair transition-colors hover:border-gris-trait/60"
                            >
                                {imageAffichee ? "Changer l'image" : "Choisir une image"}
                            </button>
                            {(imageAffichee) && (
                                <button
                                    type="button"
                                    onClick={() => { setFichierImage(null); setApercu(null) }}
                                    className="cursor-pointer text-sm text-rouge-alerte hover:underline self-start"
                                >
                                    Retirer l'image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="libelle">Contenu</span>
                    <EditeurRiche value={contenu} onChange={setContenu} />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        checked={publie}
                        onChange={(e) => setPublie(e.target.checked)}
                        className="size-4 accent-rouge-alerte"
                    />
                    <span className="text-fond-clair">Publier l'article (visible par tous)</span>
                </label>

                {erreur && (
                    <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm text-fond-clair">
                        {erreur}
                    </p>
                )}

                <div className="flex gap-3">
                    <Bouton type="submit" icone={Save} disabled={envoi}>
                        {envoi ? "Enregistrement…" : "Enregistrer"}
                    </Bouton>
                    <Bouton variante="secondaire" to="/dashboard-admin/articles">
                        Annuler
                    </Bouton>
                </div>
            </form>
        </div>
    )
}
