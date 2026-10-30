import { Check } from "lucide-react"

export interface InfoCarte {
    libelle: string
    valeur: string
    ton?: "rouge" | "clair"
}

interface CarteProps {
    titre: string
    meta?: string
    statut?: string
    temps?: string
    infos: InfoCarte[]
}

const couleurValeur = {
    rouge: "text-rouge-alerte",
    clair: "text-fond-clair [text-shadow:0_0_12px_var(--color-fond-clair)]",
}

export default function Carte({ titre, meta, statut, temps, infos }: CarteProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left shadow-xl shadow-noir/60">
            <div className="degrade-action halftone flex aspect-4/3 flex-col p-6">
                {(statut || temps) && (
                    <div className="flex items-center justify-between">
                        {statut ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-fond-clair px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.2em] text-noir">
                                <Check size={14} strokeWidth={3} />
                                {statut}
                            </span>
                        ) : <span />}
                        {temps && <span className="text-xs text-gris-trait/70">{temps}</span>}
                    </div>
                )}

                <div className="mt-auto">
                    {meta && <span className="libelle text-fond-clair/80!">{meta}</span>}
                    <h3 className="mt-2 text-5xl leading-[0.85] text-white">{titre}</h3>
                </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 p-6">
                {infos.map((info) => (
                    <div key={info.libelle}>
                        <dt className="libelle">{info.libelle}</dt>
                        <dd className={`mt-1 text-lg font-semibold ${info.ton ? couleurValeur[info.ton] : "text-white"}`}>
                            {info.valeur}
                        </dd>
                    </div>
                ))}
            </dl>
        </article>
    )
}
