import LayoutOnglets, { type Onglet } from "./LayoutOnglets"

const onglets: Onglet[] = [
    { to: "/dashboard-admin", label: "Tableau de bord", end: true },
    { to: "/dashboard-admin/incidents", label: "Incidents" },
    { to: "/dashboard-admin/utilisateurs", label: "Utilisateurs" },
    { to: "/dashboard-admin/films", label: "Films" },
]

export default function AdminLayout() {
    return <LayoutOnglets onglets={onglets} />
}
