import type { InputHTMLAttributes } from "react"

interface ChampProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export default function Champ({ label, ...props }: ChampProps) {
    return (
        <label className="flex flex-col gap-2">
            <span className="libelle">{label}</span>
            <input
                {...props}
                className="w-full rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair scheme-dark outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge"
            />
        </label>
    )
}
