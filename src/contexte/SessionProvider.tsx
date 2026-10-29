import { useEffect, useState, type ReactNode } from "react"
import { appelApi } from "../services/api"
import { SessionContext, type Utilisateur } from "./session"

export default function SessionProvider({ children }: { children: ReactNode }) {
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
    const [chargement, setChargement] = useState(true)

    useEffect(() => {
        appelApi("/auth/me")
            .then((donnees) => setUtilisateur(donnees.utilisateur))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setChargement(false))
    }, [])

    async function connexion(identifiant: string, motDePasse: string) {
        const donnees = await appelApi("/auth/connexion", "POST", { identifiant, mot_de_passe: motDePasse })
        localStorage.setItem("token", donnees.token)
        setUtilisateur(donnees.utilisateur)
    }

    function deconnexion() {
        localStorage.removeItem("token")
        setUtilisateur(null)
    }

    return (
        <SessionContext.Provider value={{ utilisateur, chargement, connexion, deconnexion }}>
            {children}
        </SessionContext.Provider>
    )
}
