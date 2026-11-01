import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { appelApi, URL_API } from "../../services/api"
import type { FilmHeros } from "../../services/videotheque"

const filtres = [
    { valeur: "", libelle: "Tous" },
    { valeur: "EnAttente", libelle: "En attente" },
    { valeur: "Valide", libelle: "Validés" },
    { valeur: "Refuse", libelle: "Refusés" },
]

const stylesStatut: Record<FilmHeros["statut"], string> = {
    EnAttente: "bg-yellow-500/20 text-yellow-400",
    Valide: "bg-green-500/20 text-green-400",
    Refuse: "bg-rouge-alerte/20 text-rouge-alerte",
}

const etiquetteStatut: Record<FilmHeros["statut"], string> = {
    EnAttente: "En attente",
    Valide: "Validé",
    Refuse: "Refusé",
}

export default function AdminFilms() {
    const [entrees, setEntrees] = useState<FilmHeros[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")
    const [filtre, setFiltre] = useState("EnAttente")

    function charger(statut: string) {
        setChargement(true)
        const qs = statut ? `?statut=${statut}` : ""
        appelApi(`/admin/videotheque${qs}`)
            .then((data) => setEntrees(data.entrees))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }

    useEffect(() => { charger(filtre) }, [filtre])

    async function valider(id: number) {
        try {
            const data = await appelApi(`/admin/videotheque/${id}/valider`, "PATCH")
            setEntrees((prev) => prev.map((e) => (e.id === id ? data.entree : e)))
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    async function refuser(id: number) {
        try {
            const data = await appelApi(`/admin/videotheque/${id}/refuser`, "PATCH")
            setEntrees((prev) => prev.map((e) => (e.id === id ? data.entree : e)))
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl text-white">Films</h1>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
                {filtres.map((f) => (
                    <button
                        key={f.valeur}
                        onClick={() => setFiltre(f.valeur)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                            filtre === f.valeur
                                ? "bg-rouge-alerte text-white"
                                : "border border-gris-texte/40 text-gris-trait/60 hover:border-gris-trait/60 hover:text-white"
                        }`}
                    >
                        {f.libelle}
                    </button>
                ))}
            </div>

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}
            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && entrees.length === 0 && !erreur && (
                <p className="text-gris-trait/70">Aucune entrée.</p>
            )}

            {entrees.length > 0 && (
                <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                    {entrees.map((entree) => (
                        <li key={entree.id} className="flex items-center gap-4 px-5 py-4">
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
                                <div className="flex items-center gap-2 mt-0.5">
                                    {entree.film.annee && (
                                        <span className="text-sm text-gris-trait/60">{entree.film.annee}</span>
                                    )}
                                    <span className="text-gris-texte/40">·</span>
                                    <div className="flex items-center gap-1.5">
                                        {entree.heros.photo_profil ? (
                                            <img
                                                src={URL_API + entree.heros.photo_profil}
                                                alt=""
                                                className="size-5 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="size-5 rounded-full bg-rouge-alerte/30" />
                                        )}
                                        <span className="text-sm text-gris-trait/60">
                                            {entree.heros.pseudo ?? "Héros #" + entree.heros.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${stylesStatut[entree.statut]}`}>
                                {etiquetteStatut[entree.statut]}
                            </span>

                            {entree.statut === "EnAttente" && (
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        onClick={() => valider(entree.id)}
                                        title="Valider"
                                        className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-green-500 hover:text-green-400"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => refuser(entree.id)}
                                        title="Refuser"
                                        className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-rouge-alerte hover:text-rouge-alerte"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
