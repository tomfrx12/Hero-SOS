export const URL_API = import.meta.env.VITE_API_URL

export async function appelApi(chemin: string, methode = "GET", corps?: unknown) {
    // Un fichier (photo de profil) part en FormData, le reste en JSON
    const estFormulaire = corps instanceof FormData

    const headers: Record<string, string> = {}
    if (!estFormulaire) {
        headers["Content-Type"] = "application/json"
    }

    const token = localStorage.getItem("token")
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const reponse = await fetch(URL_API + chemin, {
        method: methode,
        headers,
        body: estFormulaire ? corps : JSON.stringify(corps),
    })
    const donnees = await reponse.json()

    if (!reponse.ok) {
        throw new Error(donnees.message)
    }

    return donnees
}
