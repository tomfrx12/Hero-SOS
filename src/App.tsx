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
import AdminLayout from './composants/AdminLayout'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import AdminIncidents from './pages/admin/AdminIncidents'
import AdminIncident from './pages/admin/AdminIncident'
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs'
import AdminUtilisateur from './pages/admin/AdminUtilisateur'
import AdminFilms from './pages/admin/AdminFilms'

export default function App() {
  return (
    <>
        <ReactLenis root />
        <SessionProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/super-heros" element={<SuperHeros />} />
              <Route path="/super-vilains" element={<SuperVilains />} />
              <Route path="/incidents" element={<Incidents />} />

              <Route element={<RouteNonConnecte />}>
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/reinitialiser-le-mot-de-passe" element={<MotDePasseOublie />} />
              </Route>

              <Route element={<RouteProtegee />}>
                <Route path="/profil" element={<ProfilLayout />}>
                  <Route index element={<Profil />} />
                  <Route path="informations" element={<ProfilInformations />} />
                  <Route element={<RouteProtegee roles={rolesSignalement} />}>
                    <Route path="incidents" element={<ProfilIncidents />} />
                    <Route path="signaler-incidents" element={<ProfilSignalerIncident />} />
                  </Route>
                  <Route element={<RouteProtegee roles={["SuperHeros"]} />}>
                    <Route path="interventions" element={<ProfilInterventions />} />
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
                  <Route path="films" element={<AdminFilms />} />
                </Route>
              </Route>
            </Routes>
          </Layout>
        </SessionProvider>
    </>
  )
}
