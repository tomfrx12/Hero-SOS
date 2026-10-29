import { Navigate, Outlet, useLocation } from "react-router"
import { useSession, type Role } from "../contexte/session"

export default function RouteProtegee({ roles }: { roles?: Role[] }) {
    const { utilisateur, chargement } = useSession()
    const location = useLocation()

    if (chargement) return null

    if (!utilisateur) {
        return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />
    }

    if (roles && !roles.includes(utilisateur.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}