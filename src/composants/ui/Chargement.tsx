import { LoaderCircle } from "lucide-react"

export default function Chargement() {
    return (
        <div role="status" aria-label="Chargement" className="mt-8 flex justify-center py-16 md:mt-12">
            <LoaderCircle size={48} className="animate-spin text-rouge-alerte" />
        </div>
    )
}
