import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import Champ from "../../composants/Champ"
import ChampAdresse, { type Adresse } from "../../composants/ChampAdresse"
import Bouton from "../../composants/ui/Bouton"
import { useSession } from "../../contexte/session"
import { appelApi } from "../../services/api"

// Un encadré par formulaire, avec son message de réussite ou d'erreur
function Bloc({ titre, message, erreur, children }: { titre: string, message: string, erreur: string, children: ReactNode }) {
    return (
        <section className="flex flex-col gap-5 rounded-2xl border border-gris-texte/40 bg-graphite p-6 text-left sm:p-8">
            <h2 className="font-display text-2xl font-black italic uppercase text-white">{titre}</h2>
            {children}
            {message && (
                <p role="status" className="rounded-xl border border-gris-texte/60 bg-noir px-4 py-3 text-sm! text-fond-clair">
                    {message}
                </p>
            )}
            {erreur && (
                <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                    {erreur}
                </p>
            )}
        </section>
    )
}

export default function ProfilInformations() {
    const { utilisateur, modifierUtilisateur } = useSession()

    const [retourPhoto, setRetourPhoto] = useState({ message: "", erreur: "" })

    const [coordonnees, setCoordonnees] = useState({
        numero_tel: utilisateur?.numero_tel ?? "",
        complement_adresse: utilisateur?.complement_adresse ?? "",
    })
    // Rempli seulement si l'utilisateur choisit une nouvelle adresse
    const [adresse, setAdresse] = useState<Adresse | null>(null)
    const [retourCoordonnees, setRetourCoordonnees] = useState({ message: "", erreur: "" })

    const [email, setEmail] = useState("")
    const [retourEmail, setRetourEmail] = useState({ message: "", erreur: "" })

    const [retourNewsletter, setRetourNewsletter] = useState({ message: "", erreur: "" })

    const [motsDePasse, setMotsDePasse] = useState({ ancien: "", nouveau: "", confirmation: "" })
    const [retourMotDePasse, setRetourMotDePasse] = useState({ message: "", erreur: "" })

    if (!utilisateur) return null

    async function envoyerPhoto(e: ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0]
        if (!fichier) return

        const formulaire = new FormData()
        formulaire.append("photo", fichier)
        try {
            const donnees = await appelApi("/moi/photo", "POST", formulaire)
            modifierUtilisateur(donnees.utilisateur)
            setRetourPhoto({ message: "Ta photo a été mise à jour", erreur: "" })
        } catch (err) {
            setRetourPhoto({ message: "", erreur: (err as Error).message })
        }
    }

    async function basculerNewsletter() {
        try {
            const donnees = await appelApi("/moi", "PATCH", { newsletter: !utilisateur!.newsletter })
            modifierUtilisateur(donnees.utilisateur)
            setRetourNewsletter({ message: donnees.utilisateur.newsletter ? "Vous êtes abonné à la newsletter." : "Vous vous êtes désinscrit de la newsletter.", erreur: "" })
        } catch (err) {
            setRetourNewsletter({ message: "", erreur: (err as Error).message })
        }
    }

    async function envoyerCoordonnees(e: FormEvent) {
        e.preventDefault()
        try {
            const donnees = await appelApi("/moi", "PATCH", { ...coordonnees, ...adresse })
            modifierUtilisateur(donnees.utilisateur)
            setRetourCoordonnees({ message: "Tes coordonnées ont été enregistrées", erreur: "" })
        } catch (err) {
            setRetourCoordonnees({ message: "", erreur: (err as Error).message })
        }
    }

    async function envoyerEmail(e: FormEvent) {
        e.preventDefault()
        try {
            const donnees = await appelApi("/moi/email", "PATCH", { email })
            modifierUtilisateur(donnees.utilisateur)
            setEmail("")
            setRetourEmail({ message: "Ta demande a été envoyée, un administrateur doit la valider", erreur: "" })
        } catch (err) {
            setRetourEmail({ message: "", erreur: (err as Error).message })
        }
    }

    async function envoyerMotDePasse(e: FormEvent) {
        e.preventDefault()
        if (motsDePasse.nouveau !== motsDePasse.confirmation) {
            setRetourMotDePasse({ message: "", erreur: "Les deux mots de passe ne sont pas identiques" })
            return
        }
        try {
            const donnees = await appelApi("/moi/mot-de-passe", "PATCH", {
                ancien_mot_de_passe: motsDePasse.ancien,
                nouveau_mot_de_passe: motsDePasse.nouveau,
            })
            setMotsDePasse({ ancien: "", nouveau: "", confirmation: "" })
            setRetourMotDePasse({ message: donnees.message, erreur: "" })
        } catch (err) {
            setRetourMotDePasse({ message: "", erreur: (err as Error).message })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Bloc titre="Photo de profil" message={retourPhoto.message} erreur={retourPhoto.erreur}>
                <label className="flex flex-col gap-2">
                    <span className="libelle">Choisir une image (2 Mo maximum)</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={envoyerPhoto}
                        className="text-sm text-gris-trait/70 file:mr-4 file:cursor-pointer file:rounded-full file:border file:border-gris-trait/70 file:bg-transparent file:px-5 file:py-2 file:font-display file:font-black file:italic file:uppercase file:text-white hover:file:bg-white/5"
                    />
                </label>
            </Bloc>

            <Bloc titre="Coordonnées" message={retourCoordonnees.message} erreur={retourCoordonnees.erreur}>
                <form onSubmit={envoyerCoordonnees} className="flex flex-col gap-5">
                    <Champ label="Téléphone" type="tel" required value={coordonnees.numero_tel} onChange={(e) => setCoordonnees({ ...coordonnees, numero_tel: e.target.value })} />
                    <div className="flex flex-col gap-2">
                        <ChampAdresse onChoisir={setAdresse} />
                        <p className="text-sm! text-gris-trait/60">
                            Adresse actuelle : {utilisateur.adresse}, {utilisateur.code_postal} {utilisateur.ville}
                        </p>
                    </div>
                    <Champ label="Complément d'adresse" value={coordonnees.complement_adresse} onChange={(e) => setCoordonnees({ ...coordonnees, complement_adresse: e.target.value })} />
                    <Bouton type="submit" className="self-start">Enregistrer</Bouton>
                </form>
            </Bloc>

            <Bloc titre="Email" message={retourEmail.message} erreur={retourEmail.erreur}>
                <p className="text-sm! text-gris-trait/70">
                    Email actuel : {utilisateur.email}
                    {utilisateur.email_en_attente && <> — en attente de validation : {utilisateur.email_en_attente}</>}
                </p>
                <form onSubmit={envoyerEmail} className="flex flex-col gap-5">
                    <Champ label="Nouvel email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Bouton type="submit" className="self-start">Demander le changement</Bouton>
                </form>
            </Bloc>

            <Bloc titre="Newsletter" message={retourNewsletter.message} erreur={retourNewsletter.erreur}>
                <p className="text-sm! text-gris-trait/70">
                    {utilisateur.newsletter ? "Vous êtes actuellement abonné à la newsletter." : "Vous n'êtes pas abonné à la newsletter."}
                </p>
                <Bouton onClick={basculerNewsletter} className="self-start">
                    {utilisateur.newsletter ? "Se désinscrire" : "S'inscrire"}
                </Bouton>
            </Bloc>

            <Bloc titre="Mot de passe" message={retourMotDePasse.message} erreur={retourMotDePasse.erreur}>
                <form onSubmit={envoyerMotDePasse} className="flex flex-col gap-5">
                    <Champ label="Mot de passe actuel" type="password" autoComplete="current-password" required value={motsDePasse.ancien} onChange={(e) => setMotsDePasse({ ...motsDePasse, ancien: e.target.value })} />
                    <Champ label="Nouveau mot de passe" type="password" autoComplete="new-password" required minLength={8} value={motsDePasse.nouveau} onChange={(e) => setMotsDePasse({ ...motsDePasse, nouveau: e.target.value })} />
                    <Champ label="Confirmation" type="password" autoComplete="new-password" required value={motsDePasse.confirmation} onChange={(e) => setMotsDePasse({ ...motsDePasse, confirmation: e.target.value })} />
                    <Bouton type="submit" className="self-start">Changer le mot de passe</Bouton>
                </form>
            </Bloc>
        </div>
    )
}
