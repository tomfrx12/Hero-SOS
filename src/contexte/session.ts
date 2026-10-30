import { createContext, useContext } from "react"

export type Role = "Citoyens" | "SuperHeros" | "SuperVillains" | "Administrateurs"

export interface Utilisateur {
    id: number
    email: string
    email_en_attente: string | null
    nom: string
    prenom: string
    pseudo: string | null
    civilite: string
    date_de_naissance: string
    numero_tel: string
    photo_profil: string | null
    adresse: string
    complement_adresse: string | null
    ville: string
    code_postal: string
    pays: string
    newsletter: boolean
    role: Role
    statut_compte: "EnAttente" | "Actif" | "Desactive"
    createdAt: string
    verifiedAt: string | null
}

export interface Session {
    utilisateur: Utilisateur | null
    chargement: boolean
    connexion: (identifiant: string, motDePasse: string) => Promise<void>
    deconnexion: () => void
    // Après une modification du profil, pour mettre à jour l'utilisateur affiché partout
    modifierUtilisateur: (utilisateur: Utilisateur) => void
}

export const SessionContext = createContext<Session | null>(null)

export function useSession() {
    const session = useContext(SessionContext)
    if (!session) throw new Error("useSession doit être utilisé dans <SessionProvider>")
    return session
}

// Rôles qui peuvent signaler un incident (les mêmes que pour POST /incidents dans l'API)
export const rolesSignalement: Role[] = ["Citoyens", "Administrateurs"]

export function accueilDuRole(role: Role) {
    return role === "Administrateurs" ? "/dashboard-admin" : "/profil"
}
