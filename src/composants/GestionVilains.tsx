import { useEffect, useState, type ChangeEvent } from "react"
import { Pencil, Trash2, Plus, X, Check } from "lucide-react"
import { appelApi, URL_API } from "../services/api"
import Champ from "./Champ"

interface Vilain {
    id: number
    pseudo: string
    nom: string | null
    prenom: string | null
    specialite: string
    secteur: string
    description: string | null
    photo: string | null
    nombre_incidents: number
    nombre_arrestations: number
}

interface FormulaireVilain {
    pseudo: string
    nom: string
    prenom: string
    specialite: string
    secteur: string
    description: string
}

const formulaireVide: FormulaireVilain = {
    pseudo: "",
    nom: "",
    prenom: "",
    specialite: "",
    secteur: "",
    description: "",
}

function vilainVersFormulaire(v: Vilain): FormulaireVilain {
    return {
        pseudo: v.pseudo,
        nom: v.nom ?? "",
        prenom: v.prenom ?? "",
        specialite: v.specialite,
        secteur: v.secteur,
        description: v.description ?? "",
    }
}

export default function GestionVilains() {
    const [vilains, setVilains] = useState<Vilain[]>([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState("")
    const [formulaire, setFormulaire] = useState<FormulaireVilain | null>(null)
    const [enEdition, setEnEdition] = useState<number | null>(null)
    const [enSoumission, setEnSoumission] = useState(false)
    const [erreurFormulaire, setErreurFormulaire] = useState("")
    const [confirmationSuppression, setConfirmationSuppression] = useState<number | null>(null)

    useEffect(() => {
        appelApi("/vilains")
            .then((data) => setVilains(data.vilains))
            .catch((err: Error) => setErreur(err.message))
            .finally(() => setChargement(false))
    }, [])

    function ouvrirCreation() {
        setEnEdition(null)
        setFormulaire(formulaireVide)
        setErreurFormulaire("")
    }

    function ouvrirEdition(vilain: Vilain) {
        setEnEdition(vilain.id)
        setFormulaire(vilainVersFormulaire(vilain))
        setErreurFormulaire("")
    }

    function fermerFormulaire() {
        setFormulaire(null)
        setEnEdition(null)
        setErreurFormulaire("")
    }

    async function soumettre(e: React.FormEvent) {
        e.preventDefault()
        if (!formulaire) return
        setEnSoumission(true)
        setErreurFormulaire("")
        try {
            if (enEdition !== null) {
                const data = await appelApi(`/vilains/${enEdition}`, "PUT", formulaire)
                setVilains((prev) => prev.map((v) => (v.id === enEdition ? { ...v, ...data.vilain } : v)))
            } else {
                const data = await appelApi("/vilains", "POST", formulaire)
                setVilains((prev) => [...prev, { ...data.vilain, nombre_incidents: 0, nombre_arrestations: 0 }])
            }
            fermerFormulaire()
        } catch (err) {
            setErreurFormulaire((err as Error).message)
        } finally {
            setEnSoumission(false)
        }
    }

    async function uploaderPhoto(id: number, e: ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0]
        if (!fichier) return
        const formData = new FormData()
        formData.append("photo", fichier)
        try {
            const data = await appelApi(`/vilains/${id}/photo`, "POST", formData)
            setVilains((prev) => prev.map((v) => (v.id === id ? { ...v, photo: data.vilain.photo } : v)))
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    async function supprimer(id: number) {
        try {
            await appelApi(`/vilains/${id}`, "DELETE")
            setVilains((prev) => prev.filter((v) => v.id !== id))
            setConfirmationSuppression(null)
        } catch (err) {
            setErreur((err as Error).message)
        }
    }

    return (
        <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-4xl text-white">Vilains</h1>
                <button
                    onClick={ouvrirCreation}
                    className="flex items-center gap-2 rounded-xl bg-rouge-alerte px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rouge-alerte/80"
                >
                    <Plus size={16} />
                    Ajouter un vilain
                </button>
            </div>

            {erreur && <p className="text-rouge-alerte">{erreur}</p>}

            {/* Formulaire création / édition */}
            {formulaire !== null && (
                <form onSubmit={soumettre} className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl text-white">{enEdition !== null ? "Modifier le vilain" : "Nouveau vilain"}</h2>
                        <button type="button" onClick={fermerFormulaire} className="text-gris-trait/60 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Champ
                            label="Pseudo *"
                            value={formulaire.pseudo}
                            onChange={(e) => setFormulaire((f) => f && { ...f, pseudo: e.target.value })}
                            required
                        />
                        <Champ
                            label="Spécialité *"
                            value={formulaire.specialite}
                            onChange={(e) => setFormulaire((f) => f && { ...f, specialite: e.target.value })}
                            required
                        />
                        <Champ
                            label="Prénom"
                            value={formulaire.prenom}
                            onChange={(e) => setFormulaire((f) => f && { ...f, prenom: e.target.value })}
                        />
                        <Champ
                            label="Nom"
                            value={formulaire.nom}
                            onChange={(e) => setFormulaire((f) => f && { ...f, nom: e.target.value })}
                        />
                        <Champ
                            label="Secteur *"
                            value={formulaire.secteur}
                            onChange={(e) => setFormulaire((f) => f && { ...f, secteur: e.target.value })}
                            required
                        />
                        <Champ
                            label="Description"
                            value={formulaire.description}
                            onChange={(e) => setFormulaire((f) => f && { ...f, description: e.target.value })}
                        />
                    </div>

                    {erreurFormulaire && <p className="text-rouge-alerte text-sm">{erreurFormulaire}</p>}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={fermerFormulaire}
                            className="rounded-xl border border-gris-texte/40 px-4 py-2 text-sm text-gris-trait/60 transition-colors hover:border-gris-trait/60 hover:text-white"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={enSoumission}
                            className="flex items-center gap-2 rounded-xl bg-rouge-alerte px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rouge-alerte/80 disabled:opacity-50"
                        >
                            <Check size={16} />
                            {enEdition !== null ? "Enregistrer" : "Créer"}
                        </button>
                    </div>
                </form>
            )}

            {chargement && <p className="text-gris-trait/70">Chargement…</p>}
            {!chargement && vilains.length === 0 && !erreur && (
                <p className="text-gris-trait/70">Aucun vilain enregistré.</p>
            )}

            {vilains.length > 0 && (
                <ul className="flex flex-col divide-y divide-gris-texte/30 overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite">
                    {vilains.map((vilain) => (
                        <li key={vilain.id} className="flex items-center gap-4 px-5 py-4">
                            <label className="relative shrink-0 cursor-pointer" title="Changer la photo">
                                {vilain.photo ? (
                                    <img src={URL_API + vilain.photo} alt="" className="size-12 rounded-full object-cover" />
                                ) : (
                                    <div className="size-12 rounded-full bg-rouge-alerte/20 flex items-center justify-center text-rouge-alerte/60 text-lg font-black">
                                        {vilain.pseudo[0].toUpperCase()}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => uploaderPhoto(vilain.id, e)}
                                />
                            </label>

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-white">{vilain.pseudo}</p>
                                <p className="text-sm text-gris-trait/60">
                                    {[vilain.prenom, vilain.nom].filter(Boolean).join(" ") || "Identité inconnue"}
                                    {" · "}
                                    {vilain.specialite}
                                    {" · "}
                                    {vilain.secteur}
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3 text-sm text-gris-trait/60">
                                <span>{vilain.nombre_incidents} incident{vilain.nombre_incidents > 1 ? "s" : ""}</span>
                                <span>{vilain.nombre_arrestations} arrestation{vilain.nombre_arrestations > 1 ? "s" : ""}</span>
                            </div>

                            {confirmationSuppression === vilain.id ? (
                                <div className="flex shrink-0 items-center gap-2">
                                    <span className="text-sm text-gris-trait/70">Confirmer ?</span>
                                    <button
                                        onClick={() => supprimer(vilain.id)}
                                        className="rounded-lg border border-rouge-alerte px-3 py-1.5 text-xs font-semibold text-rouge-alerte transition-colors hover:bg-rouge-alerte hover:text-white"
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        onClick={() => setConfirmationSuppression(null)}
                                        className="rounded-lg border border-gris-texte/40 px-3 py-1.5 text-xs text-gris-trait/60 transition-colors hover:border-gris-trait/60 hover:text-white"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            ) : (
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        onClick={() => ouvrirEdition(vilain)}
                                        title="Modifier"
                                        className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-violet-neon hover:text-violet-neon"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmationSuppression(vilain.id)}
                                        title="Supprimer"
                                        className="rounded-lg border border-gris-texte/40 p-2 text-gris-trait/60 transition-colors hover:border-rouge-alerte hover:text-rouge-alerte"
                                    >
                                        <Trash2 size={16} />
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
