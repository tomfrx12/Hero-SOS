import { useEffect, useState } from "react"

interface ResultatAdresse {
    geometry: {
        coordinates: [number, number]
    }
    properties: {
        id: string
        label: string
        name: string
        postcode: string
        city: string
        type: string
    }
}

export interface Adresse {
    adresse: string
    code_postal: string
    ville: string
    pays: string
    latitude: number
    longitude: number
}

interface ChampAdresseProps {
    onChoisir: (adresse: Adresse | null) => void
}

export default function ChampAdresse({ onChoisir }: ChampAdresseProps) {
    const [recherche, setRecherche] = useState("")
    const [resultats, setResultats] = useState<ResultatAdresse[]>([])
    const [adresseChoisie, setAdresseChoisie] = useState("")

    useEffect(() => {
        if (recherche.trim().length < 3 || recherche === adresseChoisie) return

        let annule = false

        const minuteur = setTimeout(async () => {
            const url = "https://api-adresse.data.gouv.fr/search/?limit=5&autocomplete=1&q=" + encodeURIComponent(recherche)
            try {
                const reponse = await fetch(url)
                const donnees = await reponse.json()
                const adresses = donnees.features.filter((resultat: ResultatAdresse) =>
                    resultat.properties.type === "housenumber" || resultat.properties.type === "street"
                )
                if (!annule) setResultats(adresses)
            } catch {
                if (!annule) setResultats([])
            }
        }, 300)

        return () => {
            annule = true
            clearTimeout(minuteur)
        }
    }, [recherche, adresseChoisie])

    function modifierRecherche(texte: string) {
        setRecherche(texte)
        setResultats([])
        onChoisir(null)
    }

    function choisir(resultat: ResultatAdresse) {
        const infos = resultat.properties
        const [longitude, latitude] = resultat.geometry.coordinates
        onChoisir({
            adresse: infos.name,
            code_postal: infos.postcode,
            ville: infos.city,
            pays: "France",
            latitude,
            longitude,
        })
        setAdresseChoisie(infos.label)
        setRecherche(infos.label)
        setResultats([])
    }

    return (
        <div className="relative flex flex-col gap-2">
            <label htmlFor="adresse" className="libelle">Adresse</label>

            <input
                id="adresse"
                autoComplete="off"
                placeholder="10 rue de Rivoli, Paris"
                value={recherche}
                onChange={(e) => modifierRecherche(e.target.value)}
                className="w-full rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-fond-clair outline-none transition-colors placeholder:text-gris-trait/30 focus:border-rouge-alerte focus:glow-rouge"
            />

            {resultats.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-10 mt-2 flex flex-col overflow-hidden rounded-xl border border-gris-texte/60 bg-noir shadow-xl shadow-noir/60">
                    {resultats.map((resultat) => (
                        <li key={resultat.properties.id} className="border-b border-gris-texte/30 last:border-b-0">
                            <button
                                type="button"
                                onClick={() => choisir(resultat)}
                                className="w-full px-4 py-3 text-left text-sm text-fond-clair transition-colors hover:bg-rouge-alerte/15"
                            >
                                {resultat.properties.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
