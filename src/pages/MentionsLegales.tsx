import { Link } from "react-router"
import SectionLegale from "../composants/SectionLegale"

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

            <SectionLegale numero={1} titre="Éditeurs du site">
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
            </SectionLegale>

            <SectionLegale numero={2} titre="Hébergement">
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
            </SectionLegale>

            <SectionLegale numero={3} titre="Propriété intellectuelle">
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
            </SectionLegale>

            <SectionLegale numero={4} titre="Données personnelles et cookies">
                <p className={styleTexte}>
                    Les données collectées, leur utilisation, les cookies et tes droits sont détaillés dans la{" "}
                    <Link to="/politique-de-confidentialite" className={styleLien}>politique de confidentialité</Link>.
                </p>
            </SectionLegale>

            <SectionLegale numero={5} titre="Responsabilité et liens externes">
                <p className={styleTexte}>
                    Les éditeurs font leur possible pour fournir des informations exactes, sans pouvoir garantir l'absence d'erreur.
                    Ils ne peuvent être tenus responsables d'un dommage lié à l'utilisation du site.
                </p>
                <p className={styleTexte}>
                    Les liens vers d'autres sites sont fournis pour information : les éditeurs n'ont aucun contrôle sur leur contenu.
                </p>
            </SectionLegale>

            <SectionLegale numero={6} titre="Contact">
                <p className={styleTexte}>
                    Pour toute question sur le site ou son contenu :{" "}
                    <a href="mailto:tfourneaux@normandiewebschool.fr" className={styleLien}>tfourneaux@normandiewebschool.fr</a>
                </p>
            </SectionLegale>
        </article>
    )
}
