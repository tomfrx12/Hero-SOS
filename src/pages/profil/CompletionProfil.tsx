import { useState, type ChangeEvent, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router"
import { ChevronDown, UserCheck } from "lucide-react"
import Champ from "../../composants/Champ"
import ChampAdresse, { type Adresse } from "../../composants/ChampAdresse"
import Bouton from "../../composants/ui/Bouton"
import { useSession } from "../../contexte/session"
import { appelApi } from "../../services/api"

const formulaireVide = {
    civilite: "",
    nom: "",
    prenom: "",
    date_de_naissance: "",
    numero_tel: "",
    complement_adresse: "",
}

const styleTitreBloc = "mb-4 font-display text-xl font-black italic uppercase text-white"

export default function CompletionProfil() {
    const { modifierUtilisateur } = useSession()
    const navigate = useNavigate()
    const location = useLocation()
    const depuis = (location.state as { depuis?: string } | null)?.depuis ?? "/profil"

    const [formulaire, setFormulaire] = useState(formulaireVide)
    const [adresse, setAdresse] = useState<Adresse | null>(null)
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    function modifier(evenement: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormulaire({ ...formulaire, [evenement.target.name]: evenement.target.value })
    }

    async function envoyer(evenement: FormEvent) {
        evenement.preventDefault()
        setErreur("")

        if (!adresse) {
            setErreur("Recherche ton adresse puis choisis-la dans la liste")
            return
        }

        setEnvoi(true)
        try {
            const donnees = await appelApi("/moi/profil-complet", "PATCH", { ...formulaire, ...adresse })
            modifierUtilisateur(donnees.utilisateur)
            navigate(depuis, { replace: true })
        } catch (e) {
            setErreur((e as Error).message)
        } finally {
            setEnvoi(false)
        }
    }

    return (
        <section className="mx-auto grid w-full overflow-hidden rounded-2xl border border-gris-texte/40 bg-graphite text-left md:grid-cols-[2fr_3fr]">
            <div className="degrade-action halftone p-8 md:p-10">
                <div className="flex flex-col gap-6 md:mt-20">
                    <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-white">
                        Complète ton <span className="ombre-bd">profil</span>
                    </h1>
                    <p className="text-white/80">
                        Ces informations te donnent accès au blog, à la vidéothèque et à toutes les fonctionnalités du site.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-8 p-8 md:p-10">
                <h2 className="text-4xl text-white">Tes informations</h2>

                <form onSubmit={envoyer} className="flex flex-col gap-10">
                    <fieldset>
                        <legend className={styleTitreBloc}>Identité</legend>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex flex-col gap-2">
                                <span className="libelle">Civilité</span>
                                <span className="relative">
                                    <select
                                        name="civilite"
                                        required
                                        value={formulaire.civilite}
                                        onChange={modifier}
                                        className="w-full appearance-none rounded-xl border border-gris-texte/60 bg-noir py-3 pr-10 pl-4 text-fond-clair outline-none transition-colors focus:border-rouge-alerte focus:glow-rouge"
                                    >
                                        <option value="" disabled>Choisir</option>
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gris-trait/60" />
                                </span>
                            </label>
                            <Champ label="Date de naissance" name="date_de_naissance" type="date" autoComplete="bday" required value={formulaire.date_de_naissance} onChange={modifier} />
                            <Champ label="Nom" name="nom" placeholder="Dupont" autoComplete="family-name" required value={formulaire.nom} onChange={modifier} />
                            <Champ label="Prénom" name="prenom" placeholder="Camille" autoComplete="given-name" required value={formulaire.prenom} onChange={modifier} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className={styleTitreBloc}>Coordonnées</legend>
                        <div className="grid gap-5">
                            <Champ label="Numéro de portable" name="numero_tel" placeholder="06 12 34 56 78" type="tel" autoComplete="tel" required value={formulaire.numero_tel} onChange={modifier} />
                            <ChampAdresse onChoisir={setAdresse} />
                            <Champ label="Complément d'adresse (facultatif)" name="complement_adresse" placeholder="Bâtiment, étage, appartement…" value={formulaire.complement_adresse} onChange={modifier} />
                        </div>
                    </fieldset>

                    <div className="flex flex-col gap-5">
                        {erreur && (
                            <p role="alert" className="rounded-xl border border-rouge-alerte/50 bg-rouge-alerte/15 px-4 py-3 text-sm! text-fond-clair">
                                {erreur}
                            </p>
                        )}

                        <Bouton type="submit" icone={UserCheck} disabled={envoi} className="w-full">
                            {envoi ? "Enregistrement…" : "Compléter mon profil"}
                        </Bouton>
                    </div>
                </form>
            </div>
        </section>
    )
}
