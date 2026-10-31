import { estVerifie, type Compte } from "../services/comptes"

const libellesRole = {
    Citoyens: "Citoyen",
    SuperHeros: "Super-héros",
    SuperVillains: "Super-vilain",
    Administrateurs: "Administrateur",
}

function Tag({ children, couleur }: { children: string, couleur: string }) {
    return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold italic uppercase tracking-[0.15em] ${couleur}`}>{children}</span>
}

export default function TagCompte({ compte }: { compte: Compte }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Tag couleur="bg-fond-clair text-noir">{libellesRole[compte.role]}</Tag>
            {compte.statut_compte === "EnAttente" && <Tag couleur="bg-ambre text-noir">En attente</Tag>}
            {compte.statut_compte === "Desactive" && <Tag couleur="bg-rouge-alerte text-white">Désactivé</Tag>}
            {estVerifie(compte) && <Tag couleur="bg-cyan-neon text-noir">Vérifié</Tag>}
            {compte.email_en_attente && <Tag couleur="bg-ambre text-noir">Email à valider</Tag>}
        </div>
    )
}
