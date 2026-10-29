import { ArrowLeft, ArrowRight } from "lucide-react"

interface BoutonRondProps {
    direction?: "gauche" | "droite"
    label: string
    onClick?: () => void
}

export default function BoutonRond({ direction = "droite", label, onClick }: BoutonRondProps) {
    const Fleche = direction === "gauche" ? ArrowLeft : ArrowRight

    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-fond-clair/80 text-fond-clair glow-clair transition-colors hover:bg-fond-clair hover:text-noir"
        >
            <Fleche size={20} />
        </button>
    )
}
