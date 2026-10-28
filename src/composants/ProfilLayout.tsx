import LayoutOnglets, { type Onglet } from "./LayoutOnglets"

const onglets: Onglet[] = [
    { to: "/profil", label: "Profil", end: true },
    { to: "/profil/incidents", label: "Mes incidents" },
    { to: "/profil/signaler-incidents", label: "Signaler un incident" },
    { to: "/profil/informations", label: "Informations" },
    { to: "/profil/statistiques", label: "Statistiques" },
    { to: "/profil/reputation", label: "Réputation" },
]

export default function ProfilLayout() {
    return <LayoutOnglets onglets={onglets} />
}
