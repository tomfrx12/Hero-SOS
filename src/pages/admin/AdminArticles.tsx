import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { appelApi, URL_API } from "../../services/api"
import type { ArticleResume } from "../../services/articles"
import Bouton from "../../composants/ui/Bouton"

export default function AdminArticles() {
    const [articles, setArticles] = useState<ArticleResume[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/admin/articles")
            .then((data) => setArticles(data.articles))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    async function supprimer(id: number) {
        if (!confirm("Supprimer cet article définitivement ?")) return
        try {
            await appelApi(`/admin/articles/${id}`, "DELETE")
            setArticles((prev) => prev.filter((a) => a.id !== id))
        } catch (err) {
            alert((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-4xl text-white">Articles</h1>
                <Bouton to="/dashboard-admin/articles/nouveau" icone={Plus}>
                    Nouvel article
                </Bouton>
            </div>

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && articles.length === 0 && !erreur && (
                <p className="text-gris-trait/70">Aucun article pour l'instant.</p>
            )}

            {articles.length > 0 && (
                <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                    {articles.map((article) => (
                        <li key={article.id} className="flex items-center gap-4 px-5 py-4">
                            {article.image ? (
                                <img
                                    src={URL_API + article.image}
                                    alt=""
                                    className="size-14 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="size-14 shrink-0 rounded-lg bg-noir/60" />
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-white">{article.titre}</p>
                                <p className="text-sm text-gris-trait/60">
                                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                    {" — "}
                                    {article.auteur.prenom} {article.auteur.nom}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                                    article.publie
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-gris-texte/30 text-gris-trait/60"
                                }`}
                            >
                                {article.publie ? "Publié" : "Brouillon"}
                            </span>

                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    to={`/dashboard-admin/articles/${article.id}/modifier`}
                                    className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-gris-trait/60 hover:text-white"
                                    title="Modifier"
                                >
                                    <Pencil size={16} />
                                </Link>
                                <button
                                    onClick={() => supprimer(article.id)}
                                    className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-rouge-alerte hover:text-rouge-alerte"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
