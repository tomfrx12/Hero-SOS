const URL_API = import.meta.env.VITE_API_URL

export async function appelApi(chemin: string, methode = "GET", corps?: unknown) {
    const headers: Record<string, string> = { "Content-Type": "application/json" }

    const token = localStorage.getItem("token")
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const reponse = await fetch(URL_API + chemin, {
        method: methode,
        headers,
        body: JSON.stringify(corps),
    })
    const donnees = await reponse.json()

    if (!reponse.ok) {
        throw new Error(donnees.message)
    }

    return donnees
}
