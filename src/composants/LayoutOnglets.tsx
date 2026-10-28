import { NavLink, Outlet } from "react-router"

export interface Onglet {
    to: string
    label: string
    end?: boolean
}

export default function LayoutOnglets({ onglets }: { onglets: Onglet[] }) {
    return (
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <nav className="flex gap-1 overflow-x-auto rounded-xl bg-noir p-2 md:sticky md:top-28 md:w-64 md:shrink-0 md:flex-col md:p-3">
                {onglets.map((onglet) => (
                    <NavLink
                        key={onglet.to}
                        to={onglet.to}
                        end={onglet.end}
                        className={({ isActive }) =>
                            `whitespace-nowrap rounded-md text-left border-l-4 px-4 py-3 font-semibold transition-colors ${isActive ? "border-rouge-alerte bg-graphite text-white" : "border-transparent text-gris-trait/70 hover:bg-graphite hover:text-white"}`
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
