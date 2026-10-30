import type { ReactNode } from "react"
import { Link } from "react-router"

function Section({ numero, titre, children }: { numero: number, titre: string, children: ReactNode }) {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-gris-texte/40 bg-graphite p-6 sm:p-8">
            <h2 id={`section-${numero}`} className="text-2xl text-white">
                <span className="text-rouge-alerte">{numero}.</span> {titre}
            </h2>
            {children}
        </section>
    )
}

const styleTexte = "text-gris-trait/80"
const styleListe = "flex list-disc flex-col gap-2 pl-5 text-gris-trait/80 marker:text-rouge-alerte"
const styleLien = "text-white underline underline-offset-4 transition-colors hover:text-rouge-alerte"

export default function MentionsLegales() {
    return (
        <article className="mx-auto flex max-w-4xl flex-col gap-8 text-left">
            <header>
                <h1 className="text-5xl text-white">Mentions légales</h1>
                <p className="mt-2 text-gris-trait/70">
                    Dernière mise à jour : <time dateTime="2026-10-30">30 octobre 2026</time>
                </p>
            </header>

            <aside role="note" className="rounded-2xl border border-rouge-alerte bg-rouge-alerte/10 p-6">
                <p className="text-fond-clair">
                    <strong className="text-white">Héros SOS est un projet étudiant fictif.</strong> Les incidents, super-héros et super-vilains
                    présentés sur ce site sont inventés. Ce site n'est pas un service d'urgence : en cas de danger réel, appelez
                    le <span>112</span> (numéro d'urgence européen) ou le <span>17</span> (police).
                </p>
            </aside>

            <Section numero={1} titre="Éditeurs du site">
                <p className={styleTexte}>
                    Ce site est réalisé dans le cadre du Bachelor Chef de Projets Digitaux de la Normandie Web School, à Rouen, par :
                </p>
                <ul className={styleListe}>
                    <li>
                        Tom Fourneaux — <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>
                    </li>
                    <li>
                        Nino Rameau — <a href="mailto:nrameau@normandiewebschool.fr" className={styleLien}>nrameau@normandiewebschool.fr</a>
                    </li>
                </ul>
                <p className={styleTexte}>Directeurs de la publication : Tom Fourneaux et Nino Rameau.</p>
                <p className={styleTexte}>
                    Adresse du site : <a href="https://heros-sos.tom-fourneaux.fr" className={styleLien}>https://heros-sos.tom-fourneaux.fr</a>
                </p>
            </Section>

            <Section numero={2} titre="Hébergement">
                <p className={styleTexte}>Le site et son API sont hébergés sur un serveur personnel de Tom Fourneaux, situé en France :</p>
                <ul className={styleListe}>
                    <li>
                        site : <a href="https://heros-sos.tom-fourneaux.fr" className={styleLien}>heros-sos.tom-fourneaux.fr</a>
                    </li>
                    <li>
                        API : <a href="https://api.heros-sos.tom-fourneaux.fr" className={styleLien}>api.heros-sos.tom-fourneaux.fr</a>
                    </li>
                </ul>
                <p className={styleTexte}>
                    Contact de l'hébergeur : <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>.
                    La connexion internet du serveur est fournie par Orange SA, 111 quai du Président Roosevelt, 92130 Issy-les-Moulineaux.
                </p>
            </Section>

            <Section numero={3} titre="Propriété intellectuelle">
                <p className={styleTexte}>
                    Le code, les textes et le design de ce site appartiennent à Tom Fourneaux et Nino Rameau, sauf mention contraire.
                    Toute reproduction ou réutilisation, totale ou partielle, sans leur accord écrit est interdite.
                </p>
                <p className={styleTexte}>Certains éléments appartiennent à des tiers :</p>
                <ul className={styleListe}>
                    <li>les fonds de carte sont fournis par les contributeurs d'<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className={styleLien}>OpenStreetMap</a> ;</li>
                    <li>la recherche d'adresses utilise l'<a href="https://adresse.data.gouv.fr" target="_blank" rel="noreferrer" className={styleLien}>API Adresse</a> de l'État (Base Adresse Nationale) ;</li>
                    <li>les polices Big Shoulders et Instrument Sans proviennent de <a href="https://fonts.google.com" target="_blank" rel="noreferrer" className={styleLien}>Google Fonts</a> ;</li>
                    <li>l'univers des super-héros s'inspire d'œuvres dont les droits restent à leurs propriétaires respectifs.</li>
                </ul>
            </Section>

            <Section numero={4} titre="Données personnelles">
                <p className={styleTexte}>
                    Les données sont traitées conformément au Règlement général sur la protection des données (RGPD) et à la loi
                    Informatique et Libertés. Les responsables du traitement sont les éditeurs du site.
                </p>

                <h3 className="text-white">Données collectées</h3>
                <ul className={styleListe}>
                    <li><strong className="text-white">Compte :</strong> civilité, nom, prénom, pseudo, date de naissance, adresse email, numéro de téléphone, adresse postale et photo de profil.</li>
                    <li><strong className="text-white">Signalements :</strong> type d'incident, description, adresse et position sur la carte.</li>
                    <li><strong className="text-white">Avis :</strong> notes et commentaires laissés aux super-héros.</li>
                </ul>

                <h3 className="text-white">Pourquoi</h3>
                <ul className={styleListe}>
                    <li>gérer ton compte et sécuriser la connexion ;</li>
                    <li>transmettre les incidents aux super-héros et aux administrateurs ;</li>
                    <li>t'envoyer les emails liés au service (validation du compte, suivi d'un incident, mot de passe oublié) ;</li>
                    <li>t'envoyer la newsletter, seulement si tu y es inscrit.</li>
                </ul>

                <h3 className="text-white">Durée de conservation</h3>
                <p className={styleTexte}>
                    Les données sont conservées tant que le compte est actif, puis supprimées. Les données ne sont jamais vendues ni
                    cédées à des tiers.
                </p>

                <h3 className="text-white">Tes droits</h3>
                <p className={styleTexte}>
                    Tu peux accéder à tes données, les corriger, les supprimer, t'opposer à leur traitement ou demander leur
                    portabilité. Une partie de ces informations est modifiable directement depuis ton <Link to="/profil" className={styleLien}>profil</Link>.
                    Pour le reste, écrire à <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>.
                    Si la réponse ne te convient pas, tu peux saisir la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer" className={styleLien}>CNIL</a>.
                </p>
            </Section>

            <Section numero={5} titre="Cookies et stockage local">
                <p className={styleTexte}>
                    Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience. Pour garder ta session ouverte, un jeton de
                    connexion est enregistré dans le stockage local de ton navigateur et envoyé uniquement à notre API. Il est supprimé
                    quand tu te déconnectes.
                </p>
                <p className={styleTexte}>
                    L'affichage des polices et des cartes fait appel aux serveurs de Google Fonts et d'OpenStreetMap, qui reçoivent
                    ton adresse IP pour pouvoir t'envoyer ces fichiers.
                </p>
            </Section>

            <Section numero={6} titre="Responsabilité et liens externes">
                <p className={styleTexte}>
                    Les éditeurs font leur possible pour fournir des informations exactes, sans pouvoir garantir l'absence d'erreur.
                    Ils ne peuvent être tenus responsables d'un dommage lié à l'utilisation du site.
                </p>
                <p className={styleTexte}>
                    Les liens vers d'autres sites sont fournis pour information : les éditeurs n'ont aucun contrôle sur leur contenu.
                </p>
            </Section>

            <Section numero={7} titre="Contact">
                <p className={styleTexte}>
                    Pour toute question sur le site ou son contenu :{" "}
                    <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>
                </p>
            </Section>
        </article>
    )
}
