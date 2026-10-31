import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import { appelApi, URL_API } from "../services/api"
import type { ArticleDetail } from "../services/articles"

export default function Article() {
    const { id } = useParams()
    const [article, setArticle] = useState<ArticleDetail | null>(null)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi(`/articles/${id}`)
            .then((data) => setArticle(data.article))
            .catch((err: Error) => setErreur(err.message))
    }, [id])

    if (erreur) return (
        <div className="mx-auto max-w-3xl py-16">
            <p className="text-rouge-alerte">{erreur}</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-sm text-gris-trait/70 hover:text-white">
                <ArrowLeft size={14} /> Retour au blog
            </Link>
        </div>
    )

    if (!article) return <p className="py-24 text-center text-gris-trait/70">Chargement…</p>

    return (
        <article className="mx-auto max-w-3xl py-16 md:py-24">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gris-trait/70 hover:text-white transition-colors">
                <ArrowLeft size={14} /> Blog
            </Link>

            <h1 className="mt-6 text-white">{article.titre}</h1>

            <p className="mt-3 text-sm text-gris-trait/60">
                {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {" — "}
                {article.auteur.prenom} {article.auteur.nom}
            </p>

            {article.image && (
                <img
                    src={URL_API + article.image}
                    alt=""
                    className="mt-8 w-full rounded-2xl object-cover"
                />
            )}

            <div
                className="prose-article mt-10"
                dangerouslySetInnerHTML={{ __html: article.contenu_html }}
            />
        </article>
    )
}
