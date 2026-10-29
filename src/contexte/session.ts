import { createContext, useContext } from "react"

export type Role = "Citoyens" | "SuperHeros" | "SuperVillains" | "Administrateurs"

export interface Utilisateur {
    id: number
    email: string
    nom: string
    prenom: string
    pseudo: string | null
    role: Role
    statut_compte: "EnAttente" | "Actif" | "Desactive"
}

export interface Session {
    utilisateur: Utilisateur | null
    chargement: boolean
    connexion: (identifiant: string, motDePasse: string) => Promise<void>
    deconnexion: () => void
}

export const SessionContext = createContext<Session | null>(null)

export function useSession() {
    const session = useContext(SessionContext)
    if (!session) throw new Error("useSession doit être utilisé dans <SessionProvider>")
    return session
}

export function accueilDuRole(role: Role) {
    return role === "Administrateurs" ? "/dashboard-admin" : "/profil"
}
