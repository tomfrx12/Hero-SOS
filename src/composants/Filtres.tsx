interface Option {
    valeur: string
    libelle: string
    nombre: number
}

// Des onglets pour filtrer une liste, avec le nombre d'éléments de chaque onglet
export default function Filtres({ options, valeur, onChanger }: { options: Option[], valeur: string, onChanger: (valeur: string) => void }) {
    return (
        <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-gris-texte/40">
            {options.map((option) => (
                <button
                    key={option.valeur}
                    type="button"
                    onClick={() => onChanger(option.valeur)}
                    className={`-mb-px flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-display font-black italic uppercase transition-colors ${valeur === option.valeur ? "border-rouge-alerte text-white" : "border-transparent text-gris-trait/60 hover:text-white"}`}
                >
                    {option.libelle}
                    <span className={`rounded-full px-2 py-0.5 text-xs not-italic ${valeur === option.valeur ? "bg-rouge-alerte text-white" : "bg-graphite text-gris-trait/70"}`}>
                        {option.nombre}
                    </span>
                </button>
            ))}
        </div>
    )
}
