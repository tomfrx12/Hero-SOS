import { useEffect, useState } from "react"
import { appelApi, URL_API } from "../services/api"
import type { FilmPublic } from "../services/videotheque"

export default function Videotheque() {
    const [films, setFilms] = useState<FilmPublic[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        appelApi("/videotheque")
            .then((data) => setFilms(data.films))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    return (
        <div className="mx-auto max-w-6xl py-16 text-left md:py-24">
            <h1 className="text-white">
                Vidéothèque <span className="text-rouge-alerte texte-glow-rouge">Marvel</span>
            </h1>
            <p className="mt-4 text-gris-trait/70">
                Les films recommandés par nos super-héros.
            </p>

            {erreur && <p className="mt-6 text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="mt-6 text-gris-trait/70">Chargement…</p>}

            {!chargement && films.length === 0 && !erreur && (
                <p className="mt-6 text-gris-trait/70">Aucun film dans la vidéothèque pour l'instant.</p>
            )}

            {films.length > 0 && (
                <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {films.map((film) => (
                        <li
                            key={film.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite transition-transform hover:scale-[1.02]"
                        >
                            {film.affiche_url ? (
                                <img
                                    src={film.affiche_url}
                                    alt={film.titre}
                                    className="aspect-[2/3] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[2/3] w-full items-center justify-center bg-noir/60 text-gris-trait/40">
                                    Pas d'affiche
                                </div>
                            )}

                            <div className="flex flex-1 flex-col gap-3 p-4">
                                <div>
                                    <p className="font-display font-black italic uppercase text-white leading-tight">
                                        {film.titre}
                                    </p>
                                    {film.annee && (
                                        <p className="mt-1 text-sm text-gris-trait/60">{film.annee}</p>
                                    )}
                                </div>

                                {film.heros.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {film.heros.map((entree, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                {entree.heros.photo_profil ? (
                                                    <img
                                                        src={URL_API + entree.heros.photo_profil}
                                                        alt=""
                                                        className="size-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-6 rounded-full bg-rouge-alerte/30" />
                                                )}
                                                <span className="text-xs text-gris-trait/70">
                                                    {entree.heros.pseudo ?? "Héros"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
