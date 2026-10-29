interface PaginationProps {
    total: number
    actif: number
    onChange: (index: number) => void
}

export default function Pagination({ total, actif, onChange }: PaginationProps) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, index) => (
                <button
                    key={index}
                    type="button"
                    aria-label={`Page ${index + 1}`}
                    aria-current={index === actif}
                    onClick={() => onChange(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === actif ? "w-8 bg-fond-clair glow-clair" : "w-2 bg-gris-texte hover:bg-gris-trait/60"}`}
                />
            ))}
        </div>
    )
}
