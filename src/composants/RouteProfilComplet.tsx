import { Navigate, Outlet, useLocation } from "react-router"
import { useSession } from "../contexte/session"

export default function RouteProfilComplet() {
    const { utilisateur, chargement } = useSession()
    const location = useLocation()

    if (chargement) return null

    if (!utilisateur) {
        return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />
    }

    if (!utilisateur.profil_complet) {
        return <Navigate to="/profil/completer" replace state={{ depuis: location.pathname }} />
    }

    return <Outlet />
}
