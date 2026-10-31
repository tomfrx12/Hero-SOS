export const typesIncident = [
    "Attaque de super-vilain",
    "Catastrophe naturelle",
    "Incendie",
    "Accident de la route",
    "Personnes en danger",
    "Menace chimique ou biologique",
    "Infrastructure endommagée",
    "Autre",
]

export type StatutIncident = "Signale" | "En_Cours" | "Reussi" | "Echoue" | "Supprime"
export type Urgence = "Haute" | "Normale" | "Basse"

export const libellesStatut = {
    Signale: "Signalé",
    En_Cours: "En cours",
    Reussi: "Résolu",
    Echoue: "Échoué",
    Supprime: "Supprimé",
}

export const libellesUrgence = { Haute: "Élevée", Normale: "Normale", Basse: "Basse" }
export const couleursUrgence = { Haute: "#E10600", Normale: "#FFB020", Basse: "#00E5FF" }
export const urgences: Urgence[] = ["Haute", "Normale", "Basse"]
