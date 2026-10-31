// Une grille de cartes chiffrées
export default function GrilleStats({ cartes }: { cartes: { libelle: string, valeur: string | number }[] }) {
    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {cartes.map((carte) => (
                <div key={carte.libelle} className="carte-stat p-4 text-center">
                    <span className="stat-valeur">{carte.valeur}</span>
                    <span className="stat-libelle">{carte.libelle}</span>
                </div>
            ))}
        </div>
    )
}
