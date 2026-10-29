import type { CSSProperties } from "react"

export interface StatHeros {
    valeur: string
    suffixe?: string
    libelle: string
}

interface CarteHerosProps {
    nom: string
    initiales: string
    photo?: string
    pouvoir: string
    ville: string
    accent: string
    stats: StatHeros[]
}

// Transition commune à tous les éléments qui se transforment au survol
const anime = "absolute transition-all duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"

export default function CarteHeros({ nom, photo, pouvoir, accent, stats }: CarteHerosProps) {
    return (
        <div className="relative h-52">
            <article className="carte-heros group text-left" style={{ "--accent": accent } as CSSProperties}>
                {/* Projecteur et trame comics */}
                <div className={`${anime} inset-x-0 top-0 h-50 bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_70%)] opacity-0 group-hover:opacity-60`} />
                <div className={`${anime} trame-points inset-x-0 top-0 h-50 [clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0)]`} />

                {/* Avatar qui se dissout dans le projecteur */}
                <div className={`${anime} top-5 left-5 size-12 overflow-hidden rounded-lg bg-(--accent) shadow-[0_0_14px_color-mix(in_oklab,var(--accent)_45%,transparent)] group-hover:scale-[3] group-hover:opacity-0`}>
                    {photo && <img src={photo} alt={nom} className="size-full object-cover" />}
                </div>

                {/* Initiales → filigrane géant
                <span className={`${anime} top-11 left-11 -translate-1/2 font-display text-xl font-black italic uppercase leading-none text-white ${photo ? "opacity-0 group-hover:opacity-100" : ""} group-hover:top-25 group-hover:left-1/2 group-hover:text-[8rem] group-hover:text-white/10`}>
                    {initiales}
                </span> */}

                {/* Nom */}
                <h3 className={`${anime} top-5 left-20 w-[calc(100%-6rem)] truncate text-xl text-white group-hover:top-55 group-hover:left-1/2 group-hover:w-[calc(100%-2rem)] group-hover:-translate-x-1/2 group-hover:text-center group-hover:text-3xl`}>
                    {nom}
                </h3>

                {/* Pouvoir : sous le nom, recentré */}
                <p className={`${anime} top-12 left-20 whitespace-nowrap text-sm! text-gris-trait/60 group-hover:top-63 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:text-gris-trait/80`}>{pouvoir}</p>

                {/* Statistiques */}
                <div className={`${anime} top-22 inset-x-5 grid grid-cols-2 gap-4 group-hover:top-77 group-hover:text-center`}>
                    {stats.map((stat) => (
                        <div key={stat.libelle}>
                            <span className="block font-display text-3xl font-black leading-none text-white">
                                {stat.valeur}
                                {stat.suffixe && <span className="text-base text-gris-trait/60">{stat.suffixe}</span>}
                            </span>
                            <span className="mt-1 block text-xs text-gris-trait/60 transition-all duration-450ms group-hover:text-[0.6rem] group-hover:uppercase group-hover:tracking-[0.2em]">
                                {stat.libelle}
                            </span>
                        </div>
                    ))}
                </div>
            </article>
        </div>
    )
}
