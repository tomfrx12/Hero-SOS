import type { ReactNode } from "react"

// Un bloc numéroté des pages mentions légales et politique de confidentialité
export default function SectionLegale({ numero, titre, children }: { numero: number, titre: string, children: ReactNode }) {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6 sm:p-8">
            <h2 id={`section-${numero}`} className="text-2xl text-white">
                <span className="text-rouge-alerte">{numero}.</span> {titre}
            </h2>
            {children}
        </section>
    )
}
