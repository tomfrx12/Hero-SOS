import { NavLink, Outlet } from "react-router"

export interface Onglet {
    to: string
    label: string
    end?: boolean
}

export default function LayoutOnglets({ onglets }: { onglets: Onglet[] }) {
    return (
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-gris-texte/40 bg-graphite/60 p-2 md:sticky md:top-28 md:w-64 md:shrink-0 md:flex-col md:p-3">
                {onglets.map((onglet) => (
                    <NavLink
                        key={onglet.to}
                        to={onglet.to}
                        end={onglet.end}
                        className={({ isActive }) =>
                            `whitespace-nowrap rounded-full px-5 py-2.5 text-left font-display text-lg font-black italic uppercase tracking-wide transition-colors ${isActive ? "bg-rouge-alerte text-white glow-rouge" : "text-gris-trait/60 hover:bg-graphite hover:text-white"}`
                        }
                    >
                        {onglet.label}
                    </NavLink>
                ))}
            </nav>

            <section className="min-w-0 flex-1">
                <Outlet />
            </section>
        </div>
    )
}
