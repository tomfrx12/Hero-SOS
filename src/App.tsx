import { ReactLenis } from 'lenis/react'
import { Route, Routes } from 'react-router'
import Layout from './composants/Layout'
import SessionProvider from './contexte/SessionProvider'
import { rolesSignalement } from './contexte/session'
import RouteProtegee from './composants/RouteProtegee'
import RouteNonConnecte from './composants/RouteNonConnecte'
import Index from './pages/Index'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import MotDePasseOublie from './pages/MotDePasseOublie'
import SuperHeros from './pages/SuperHeros'
import SuperVilains from './pages/SuperVilains'
import Incidents from './pages/Incidents'
import ProfilLayout from './composants/ProfilLayout'
import Profil from './pages/profil/Profil'
import ProfilIncidents from './pages/profil/ProfilIncidents'
import ProfilSignalerIncident from './pages/profil/ProfilSignalerIncident'
import ProfilInformations from './pages/profil/ProfilInformations'
import ProfilStatistiques from './pages/profil/ProfilStatistiques'
import ProfilReputation from './pages/profil/ProfilReputation'
import ProfilInterventions from './pages/profil/ProfilInterventions'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import AdminLayout from './composants/AdminLayout'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import AdminIncidents from './pages/admin/AdminIncidents'
import AdminIncident from './pages/admin/AdminIncident'
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs'
import AdminUtilisateur from './pages/admin/AdminUtilisateur'
import AdminNewsletter from './pages/admin/AdminNewsletter'
import AdminFilms from './pages/admin/AdminFilms'
import AdminAvis from './pages/admin/AdminAvis'
import AdminArticles from './pages/admin/AdminArticles'
import AdminArticle from './pages/admin/AdminArticle'
import Articles from './pages/Articles'
import Article from './pages/Article'
import Videotheque from './pages/Videotheque'
import ProfilFilms from './pages/profil/ProfilFilms'
import PageIntrouvable from './pages/PageIntrouvable'
import InscriptionRapide from './pages/InscriptionRapide'
import CompletionProfil from './pages/profil/CompletionProfil'
import RouteProfilComplet from './composants/RouteProfilComplet'

export default function App() {
  return (
    <>
        <ReactLenis root />
        <SessionProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/super-heros" element={<SuperHeros />} />
              <Route path="/super-vilains" element={<SuperVilains />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route element={<RouteProfilComplet />}>
                <Route path="/blog" element={<Articles />} />
                <Route path="/blog/:id" element={<Article />} />
                <Route path="/videotheque" element={<Videotheque />} />
              </Route>

              <Route element={<RouteNonConnecte />}>
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/inscription-rapide" element={<InscriptionRapide />} />
                <Route path="/reinitialiser-le-mot-de-passe" element={<MotDePasseOublie />} />
              </Route>

              <Route element={<RouteProtegee />}>
                <Route path="/profil/completer" element={<CompletionProfil />} />
                <Route path="/profil" element={<ProfilLayout />}>
                  <Route index element={<Profil />} />
                  <Route path="informations" element={<ProfilInformations />} />
                  <Route element={<RouteProtegee roles={rolesSignalement} />}>
                    <Route path="incidents" element={<ProfilIncidents />} />
                    <Route path="signaler-incidents" element={<ProfilSignalerIncident />} />
                  </Route>
                  <Route element={<RouteProtegee roles={["SuperHeros"]} />}>
                    <Route path="interventions" element={<ProfilInterventions />} />
                    <Route path="films" element={<ProfilFilms />} />
                    <Route path="statistiques" element={<ProfilStatistiques />} />
                    <Route path="reputation" element={<ProfilReputation />} />
                  </Route>
                </Route>
              </Route>

              <Route element={<RouteProtegee roles={["Administrateurs"]} />}>
                <Route path="/dashboard-admin" element={<AdminLayout />}>
                  <Route index element={<DashboardAdmin />} />
                  <Route path="incidents" element={<AdminIncidents />} />
                  <Route path="incidents/:id" element={<AdminIncident />} />
                  <Route path="utilisateurs" element={<AdminUtilisateurs />} />
                  <Route path="utilisateurs/:id" element={<AdminUtilisateur />} />
                  <Route path="avis" element={<AdminAvis />} />
                  <Route path="films" element={<AdminFilms />} />
                  <Route path="newsletter" element={<AdminNewsletter />} />
                  <Route path="articles" element={<AdminArticles />} />
                  <Route path="articles/nouveau" element={<AdminArticle />} />
                  <Route path="articles/:id/modifier" element={<AdminArticle />} />
                </Route>
              </Route>
              <Route path="*" element={<PageIntrouvable />} />
            </Routes>
          </Layout>
        </SessionProvider>
    </>
  )
}