import { Navigate, Outlet, useLocation } from "react-router"
import { accueilDuRole, useSession } from "../contexte/session"

export default function RouteNonConnecte() {
    const { utilisateur, chargement } = useSession()
    const location = useLocation()

    if (chargement) return null

    if (utilisateur) {
        return <Navigate to={location.state?.depuis ?? accueilDuRole(utilisateur.role)} replace />
    }

    return <Outlet />
}
