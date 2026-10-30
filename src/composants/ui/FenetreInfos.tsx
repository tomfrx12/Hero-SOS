import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { X } from "lucide-react"
import type { StatHeros } from "./CarteHeros"

interface FenetreInfosProps {
    nom: string
    photo?: string
    accent: string
    stats: StatHeros[]
    infos?: { libelle: string, valeur: string }[]
    children?: ReactNode
    onFermer: () => void
}

export default function FenetreInfos({ nom, photo, accent, stats, infos, children, onFermer }: FenetreInfosProps) {
    const fenetreRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (!fenetreRef.current!.open) fenetreRef.current!.showModal()
    }, [])

    return (
        <dialog
            ref={fenetreRef}
            aria-label={nom}
            onClose={onFermer}
            onClick={(e) => e.target === fenetreRef.current && onFermer()}
            data-lenis-prevent
            className="m-auto max-h-[90vh] w-[min(28rem,90vw)] overflow-y-auto rounded-2xl border border-(--accent) bg-nuit text-fond-clair backdrop:bg-noir/80"
            style={{ "--accent": accent } as CSSProperties}
        >
            <div className="relative flex flex-col items-center p-8 text-center">
                <div className="absolute inset-x-0 top-0 h-50 bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_70%)] opacity-60" />
                <div className="trame-points absolute inset-x-0 top-0 h-50" />

                <button type="button" aria-label="Fermer" onClick={onFermer} className="absolute top-4 right-4 text-white">
                    <X size={24} />
                </button>

                <div className="relative size-40 overflow-hidden rounded-2xl bg-(--accent)">
                    {photo && <img src={photo} alt={nom} className="size-full object-cover" />}
                </div>

                <h2 className="relative mt-6 w-full wrap-break-word text-white">{nom}</h2>

                <div className="relative mt-8 grid w-full auto-cols-fr grid-flow-col gap-4">
                    {stats.map((stat) => (
                        <div key={stat.libelle}>
                            <span className="block font-display text-4xl font-black leading-none text-white">
                                {stat.valeur}
                                {stat.suffixe && <span className="text-lg text-gris-trait/60">{stat.suffixe}</span>}
                            </span>
                            <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.2em] text-gris-trait/60">
                                {stat.libelle}
                            </span>
                        </div>
                    ))}
                </div>

                {infos && (
                    <dl className="relative mt-8 flex w-full flex-col gap-4 text-left">
                        {infos.map((info) => (
                            <div key={info.libelle}>
                                <dt className="libelle">{info.libelle}</dt>
                                <dd className="mt-1 text-white">{info.valeur}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {children}
            </div>
        </dialog>
    )
}
