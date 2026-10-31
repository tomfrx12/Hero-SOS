import { Link } from "react-router"
import SectionLegale from "../composants/SectionLegale"

const styleTexte = "text-gris-trait/80"
const styleListe = "flex list-disc flex-col gap-2 pl-5 text-gris-trait/80 marker:text-rouge-alerte"
const styleLien = "text-white underline underline-offset-4 transition-colors hover:text-rouge-alerte"

export default function PolitiqueConfidentialite() {
    return (
        <article className="mx-auto flex max-w-4xl flex-col gap-8 text-left">
            <header>
                <h1 className="text-5xl text-white">Politique de confidentialité</h1>
                <p className="mt-2 text-gris-trait/70">
                    Dernière mise à jour : <time dateTime="2026-10-31">31 octobre 2026</time>
                </p>
            </header>

            <p className={styleTexte}>
                Cette page explique quelles données Héros SOS collecte, pourquoi, combien de temps elles sont gardées et comment
                exercer tes droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi
                Informatique et Libertés.
            </p>

            <SectionLegale numero={1} titre="Responsables du traitement">
                <p className={styleTexte}>
                    Les responsables du traitement sont les éditeurs du site, Tom Fourneaux et Nino Rameau (voir les{" "}
                    <Link to="/mentions-legales" className={styleLien}>mentions légales</Link>). 
                </p>
            </SectionLegale>

            <SectionLegale numero={2} titre="Données collectées">
                <ul className={styleListe}>
                    <li><strong className="text-white">Compte :</strong> civilité, nom, prénom, pseudo (super-héros), date de naissance, adresse email, numéro de téléphone, adresse postale et photo de profil.</li>
                    <li><strong className="text-white">Connexion :</strong> mot de passe, enregistré uniquement sous forme chiffrée (hachée).</li>
                    <li><strong className="text-white">Signalements :</strong> type d'incident, description, adresse et position sur la carte.</li>
                    <li><strong className="text-white">Interventions et avis :</strong> interventions des super-héros, notes et commentaires laissés par les citoyens.</li>
                    <li><strong className="text-white">Newsletter :</strong> ton choix d'y être inscrit ou non.</li>
                </ul>
            </SectionLegale>

            <SectionLegale numero={3} titre="Pourquoi et sur quelle base">
                <ul className={styleListe}>
                    <li>créer et gérer ton compte, sécuriser la connexion : nécessaire au service que tu demandes en t'inscrivant ;</li>
                    <li>transmettre les incidents aux super-héros et aux administrateurs : nécessaire au fonctionnement du service ;</li>
                    <li>t'envoyer les emails liés au service (validation du compte, suivi d'un incident, mot de passe oublié) : nécessaire au service ;</li>
                    <li>modérer les signalements et les avis : intérêt légitime à garder un site fiable ;</li>
                    <li>t'envoyer la newsletter : seulement avec ton accord, que tu peux retirer à tout moment depuis ton profil.</li>
                </ul>
            </SectionLegale>

            <SectionLegale numero={4} titre="Qui voit tes données">
                <ul className={styleListe}>
                    <li>les <strong className="text-white">administrateurs</strong> du site, pour valider les comptes et modérer le contenu ;</li>
                    <li>les <strong className="text-white">super-héros</strong>, qui voient les informations d'un incident (type, description, adresse) pour pouvoir intervenir ;</li>
                    <li>les <strong className="text-white">visiteurs</strong>, qui voient les incidents en cours sur la carte, sans l'identité de la personne qui les a signalés, ainsi que les avis en ligne sur les super-héros.</li>
                </ul>
                <p className={styleTexte}>Les données ne sont jamais vendues ni cédées à des tiers.</p>
            </SectionLegale>

            <SectionLegale numero={5} titre="Durée de conservation">
                <p className={styleTexte}>
                    Les données sont conservées tant que ton compte existe. Si tu demandes la suppression de ton compte, les
                    données qui t'identifient sont effacées. Les liens de réinitialisation du mot de passe expirent au bout d'une heure.
                </p>
            </SectionLegale>

            <SectionLegale numero={6} titre="Hébergement et sécurité">
                <p className={styleTexte}>
                    Le site, l'API et la base de données sont hébergés en France. Les échanges avec le site sont chiffrés (HTTPS)
                    et l'accès aux données est limité selon le rôle de chaque compte.
                </p>
                <p className={styleTexte}>
                    L'affichage des polices et des cartes fait appel aux serveurs de Google Fonts et d'OpenStreetMap, qui reçoivent
                    ton adresse IP pour pouvoir t'envoyer ces fichiers. La recherche d'adresse envoie le texte saisi à l'API Adresse de l'État.
                </p>
            </SectionLegale>

            <SectionLegale numero={7} titre="Cookies et stockage local">
                <p className={styleTexte}>
                    Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience, il n'y a donc pas de bandeau de cookies.
                    Pour garder ta session ouverte, un jeton de connexion est enregistré dans le stockage local de ton navigateur
                    et envoyé uniquement à notre API. Il est supprimé quand tu te déconnectes.
                </p>
            </SectionLegale>

            <SectionLegale numero={8} titre="Tes droits">
                <p className={styleTexte}>
                    Tu peux accéder à tes données, les corriger, les supprimer, limiter ou t'opposer à leur traitement, demander
                    leur portabilité et retirer ton accord pour la newsletter. Une partie de ces informations est modifiable
                    directement depuis ton <Link to="/profil" className={styleLien}>profil</Link>.
                </p>
                <p className={styleTexte}>
                    Pour le reste, écris à <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>,
                    nous répondons sous un mois. Si la réponse ne te convient pas, tu peux saisir la{" "}
                    <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer" className={styleLien}>CNIL</a>.
                </p>
            </SectionLegale>
        </article>
    )
}
