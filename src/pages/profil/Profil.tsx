import Bouton from "../../composants/ui/Bouton"
import { useSession } from "../../contexte/session"
import { URL_API } from "../../services/api"

const nomsRoles = {
    Citoyens: "Citoyen",
    SuperHeros: "Super-héros",
    SuperVillains: "Super-vilain",
    Administrateurs: "Administrateur",
}

function formaterDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR")
}

export default function Profil() {
    const { utilisateur } = useSession()
    if (!utilisateur) return null

    const infos = [
        { libelle: "Email", valeur: utilisateur.email },
        { libelle: "Téléphone", valeur: utilisateur.numero_tel },
        { libelle: "Date de naissance", valeur: formaterDate(utilisateur.date_de_naissance) },
        { libelle: "Adresse", valeur: `${utilisateur.adresse}${utilisateur.complement_adresse ? ", " + utilisateur.complement_adresse : ""}, ${utilisateur.code_postal} ${utilisateur.ville}` },
        { libelle: "Newsletter", valeur: utilisateur.newsletter ? "Inscrit" : "Non inscrit" },
        { libelle: "Membre depuis le", valeur: formaterDate(utilisateur.createdAt) },
        { libelle: "Compte vérifié", valeur: utilisateur.verifiedAt ? "Le " + formaterDate(utilisateur.verifiedAt) : "Pas encore" },
    ]

    return (
        <article className="overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left">
            <div className="degrade-action halftone flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:p-8 md:p-10">
                <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-noir font-display text-4xl font-black italic text-white">
                    {utilisateur.photo_profil ? (
                        <img src={URL_API + utilisateur.photo_profil} alt="Photo de profil" className="size-full object-cover" />
                    ) : (
                        utilisateur.prenom[0] + utilisateur.nom[0]
                    )}
                </div>
                <div>
                    <span className="libelle text-fond-clair/80!">{nomsRoles[utilisateur.role]}</span>
                    <h1 className="mt-2 text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] text-white">
                        {utilisateur.pseudo ?? `${utilisateur.prenom} ${utilisateur.nom}`}
                    </h1>
                    {utilisateur.pseudo && (
                        <p className="mt-2 text-fond-clair/80">{utilisateur.civilite} {utilisateur.prenom} {utilisateur.nom}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-8 p-6 sm:p-8 md:p-10">
                <dl className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    {infos.map((info) => (
                        <div key={info.libelle}>
                            <dt className="libelle">{info.libelle}</dt>
                            <dd className="mt-1 text-lg font-semibold text-white">{info.valeur}</dd>
                        </div>
                    ))}
                </dl>

                {utilisateur.email_en_attente && (
                    <p className="rounded-xl border border-ambre/50 bg-ambre/10 px-4 py-3 text-sm! text-fond-clair">
                        Changement d'email vers {utilisateur.email_en_attente} en attente de validation par un administrateur.
                    </p>
                )}

                <Bouton to="/profil/informations" variante="secondaire" className="self-start">
                    Modifier mes informations
                </Bouton>
            </div>
        </article>
    )
}
