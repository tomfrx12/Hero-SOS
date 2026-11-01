export interface Film {
    id: number
    tmdb_id: number
    titre: string
    annee: string | null
    affiche_url: string | null
    description: string | null
    createdAt: string
}

export interface FilmHeros {
    id: number
    statut: "EnAttente" | "Valide" | "Refuse"
    createdAt: string
    film: Film
    heros: {
        id: number
        pseudo: string | null
        photo_profil: string | null
    }
}

export interface FilmPublic extends Film {
    heros: {
        heros: {
            pseudo: string | null
            photo_profil: string | null
        }
    }[]
}

export interface ResultatTmdb {
    tmdb_id: number
    titre: string
    annee: string | null
    affiche_url: string | null
    description: string | null
}
