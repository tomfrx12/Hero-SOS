import { useEffect, useState } from "react"
import { Link } from "react-router"
import { appelApi, URL_API } from "../services/api"
import type { ArticleResume } from "../services/articles"

export default function Articles() {
    const [articles, setArticles] = useState<ArticleResume[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/articles")
            .then((data) => setArticles(data.articles))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    return (
        <div className="mx-auto max-w-4xl py-16 md:py-24">
            <h1 className="text-white">
                Le <span className="text-rouge-alerte texte-glow-rouge">Blog</span>
            </h1>
            <p className="mt-4 text-gris-trait/70">Actualités, analyses et récits du QG des Héros.</p>

            {erreur && <p className="mt-8 text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="mt-8 text-gris-trait/70">Chargement…</p>}

            {!chargement && articles.length === 0 && !erreur && (
                <p className="mt-8 text-gris-trait/70">Aucun article publié pour l'instant.</p>
            )}

            <ul className="mt-10 flex flex-col gap-6">
                {articles.map((article) => (
                    <li key={article.id}>
                        <Link
                            to={`/blog/${article.id}`}
                            className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite transition-colors hover:border-gris-trait/60 sm:flex-row"
                        >
                            {article.image ? (
                                <img
                                    src={URL_API + article.image}
                                    alt=""
                                    className="h-48 w-full object-cover sm:h-auto sm:w-56 sm:shrink-0"
                                />
                            ) : (
                                <div className="h-48 w-full bg-noir/50 sm:h-auto sm:w-56 sm:shrink-0" />
                            )}
                            <div className="flex flex-col justify-center gap-2 p-6">
                                <p className="text-sm text-gris-trait/60">
                                    {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                    {" — "}
                                    {article.auteur.prenom} {article.auteur.nom}
                                </p>
                                <h2 className="text-xl font-semibold text-white group-hover:text-rouge-alerte transition-colors">
                                    {article.titre}
                                </h2>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
