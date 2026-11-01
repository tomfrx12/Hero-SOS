import { useEffect, useRef, useState } from "react"
import { Plus, Trash2, Search } from "lucide-react"
import { appelApi } from "../../services/api"
import type { FilmHeros, ResultatTmdb } from "../../services/videotheque"
import Bouton from "../../composants/ui/Bouton"

const etiquetteStatut: Record<FilmHeros["statut"], string> = {
    EnAttente: "En attente",
    Valide: "Validé",
    Refuse: "Refusé",
}

const stylesStatut: Record<FilmHeros["statut"], string> = {
    EnAttente: "bg-yellow-500/20 text-yellow-400",
    Valide: "bg-green-500/20 text-green-400",
    Refuse: "bg-rouge-alerte/20 text-rouge-alerte",
}

export default function ProfilFilms() {
    const [mesFilms, setMesFilms] = useState<FilmHeros[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")

    const [recherche, setRecherche] = useState("")
    const [resultats, setResultats] = useState<ResultatTmdb[]>([])
    const [chargementRecherche, setChargementRecherche] = useState(false)
    const [erreurRecherche, setErreurRecherche] = useState("")

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function chargerMesFilms() {
        appelApi("/videotheque/mes-films")
            .then((data) => setMesFilms(data.films))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }

    useEffect(chargerMesFilms, [])

    function onRecherche(valeur: string) {
        setRecherche(valeur)
        setErreurRecherche("")
        if (timerRef.current) clearTimeout(timerRef.current)
        if (!valeur.trim()) {
            setResultats([])
            return
        }
        timerRef.current = setTimeout(() => {
            setChargementRecherche(true)
            appelApi(`/videotheque/recherche?q=${encodeURIComponent(valeur)}`)
                .then((data) => setResultats(data.resultats))
                .catch((err: Error) => setErreurRecherche(err.message))
                .finally(() => setChargementRecherche(false))
        }, 400)
    }

    async function ajouter(film: ResultatTmdb) {
        try {
            await appelApi("/videotheque", "POST", film)
            setResultats([])
            setRecherche("")
            chargerMesFilms()
        } catch (err) {
            setErreurRecherche((err as Error).message)
        }
    }

    async function retirer(filmId: number) {
        if (!confirm("Retirer ce film de ta vidéothèque ?")) return
        try {
            await appelApi(`/videotheque/${filmId}`, "DELETE")
            setMesFilms((prev) => prev.filter((e) => e.film.id !== filmId))
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    const filmIds = new Set(mesFilms.map((e) => e.film.tmdb_id))

    return (
        <div className="flex flex-col gap-8 text-left">
            <h1 className="text-4xl text-white">Ma vidéothèque</h1>

            {/* Recherche */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gris-trait/50" />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => onRecherche(e.target.value)}
                        placeholder="Rechercher un film…"
                        className="w-full rounded-xl border border-gris-texte/40 bg-graphite py-3 pr-4 pl-10 text-white placeholder:text-gris-trait/40 focus:border-rouge-alerte focus:outline-none"
                    />
                </div>

                {erreurRecherche && <p className="text-sm text-rouge-alerte">{erreurRecherche}</p>}
                {chargementRecherche && <p className="text-sm text-gris-trait/60">Recherche…</p>}

                {resultats.length > 0 && (
                    <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                        {resultats.map((film) => {
                            const dejaAjoute = filmIds.has(film.tmdb_id)
                            return (
                                <li key={film.tmdb_id} className="flex items-center gap-4 px-4 py-3">
                                    {film.affiche_url ? (
                                        <img
                                            src={film.affiche_url}
                                            alt=""
                                            className="size-14 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="size-14 shrink-0 rounded-lg bg-noir/60" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white">{film.titre}</p>
                                        {film.annee && (
                                            <p className="text-sm text-gris-trait/60">{film.annee}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => !dejaAjoute && ajouter(film)}
                                        disabled={dejaAjoute}
                                        title={dejaAjoute ? "Déjà ajouté" : "Ajouter"}
                                        className="shrink-0 rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-cyan-neon hover:text-cyan-neon disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* Mes films */}
            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}

            {!chargement && mesFilms.length === 0 && !erreur && (
                <div className="flex flex-col gap-3 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <p className="text-gris-trait/70">Tu n'as pas encore de film dans ta vidéothèque.</p>
                    <p className="text-sm text-gris-trait/50">Utilise la recherche ci-dessus pour en ajouter.</p>
                </div>
            )}

            {mesFilms.length > 0 && (
                <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                    {mesFilms.map((entree) => (
                        <li key={entree.id} className="flex items-center gap-4 px-4 py-3">
                            {entree.film.affiche_url ? (
                                <img
                                    src={entree.film.affiche_url}
                                    alt=""
                                    className="size-14 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="size-14 shrink-0 rounded-lg bg-noir/60" />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-white">{entree.film.titre}</p>
                                {entree.film.annee && (
                                    <p className="text-sm text-gris-trait/60">{entree.film.annee}</p>
                                )}
                            </div>
                            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${stylesStatut[entree.statut]}`}>
                                {etiquetteStatut[entree.statut]}
                            </span>
                            <button
                                onClick={() => retirer(entree.film.id)}
                                title="Retirer"
                                className="shrink-0 rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-rouge-alerte hover:text-rouge-alerte"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <Bouton to="/videotheque" variante="secondaire">
                    Voir la vidéothèque publique
                </Bouton>
            </div>
        </div>
    )
}
