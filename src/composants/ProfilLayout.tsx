import LayoutOnglets from "./LayoutOnglets"
import { rolesSignalement, useSession, type Role } from "../contexte/session"

// Chaque onglet n'est affiché qu'aux rôles qui y ont accès
const onglets: { to: string, label: string, end?: boolean, roles: Role[] }[] = [
    { to: "/profil", label: "Profil", end: true, roles: ["Citoyens", "SuperHeros", "Administrateurs"] },
    { to: "/profil/incidents", label: "Mes incidents", roles: rolesSignalement },
    { to: "/profil/signaler-incidents", label: "Signaler un incident", roles: rolesSignalement },
    { to: "/profil/statistiques", label: "Statistiques", roles: ["SuperHeros"] },
    { to: "/profil/reputation", label: "Réputation", roles: ["SuperHeros"] },
    { to: "/profil/informations", label: "Informations", roles: ["Citoyens", "SuperHeros", "Administrateurs"] },
]

export default function ProfilLayout() {
    const { utilisateur } = useSession()

    return <LayoutOnglets onglets={onglets.filter((onglet) => utilisateur && onglet.roles.includes(utilisateur.role))} />
}
