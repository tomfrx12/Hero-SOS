import type { Role } from "../contexte/session"

export interface Compte {
    role: Role
    statut_compte: "EnAttente" | "Actif" | "Desactive"
    verifiedAt: string | null
    email_en_attente: string | null
}

export function nomComplet(compte: { prenom: string | null, nom: string | null }) {
    return `${compte.prenom ?? ""} ${compte.nom ?? ""}`.trim() || "Sans nom"
}

// Un héros accepté est vérifié d'office, un citoyen doit être marqué vérifié par un admin
export function estVerifie(compte: Compte) {
    return compte.statut_compte === "Actif" && (compte.role !== "Citoyens" || compte.verifiedAt !== null)
}
