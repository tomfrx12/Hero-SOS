export interface ArticleResume {
    id: number
    titre: string
    image: string | null
    publie: boolean
    createdAt: string
    auteur: { prenom: string; nom: string }
}

export interface ArticleDetail extends ArticleResume {
    contenu_html: string
}
