import type { InputHTMLAttributes } from "react"

interface ChampProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export default function Champ({ label, ...props }: ChampProps) {
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span>{label}</span>
            <input {...props} className="rounded border border-gris-trait px-3 py-2 text-base" />
        </label>
    )
}
