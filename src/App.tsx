import { ReactLenis } from 'lenis/react'
import { Route, Routes } from 'react-router'
import Layout from './composants/Layout'
import Index from './pages/Index'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import MotDePasseOublie from './pages/MotDePasseOublie'
import SuperHeros from './pages/SuperHeros'
import SuperVilains from './pages/SuperVilains'
import ProfilLayout from './composants/ProfilLayout'
import Profil from './pages/profil/Profil'
import ProfilIncidents from './pages/profil/ProfilIncidents'
import ProfilSignalerIncident from './pages/profil/ProfilSignalerIncident'
import ProfilInformations from './pages/profil/ProfilInformations'
import ProfilStatistiques from './pages/profil/ProfilStatistiques'
import ProfilReputation from './pages/profil/ProfilReputation'
import MentionsLegales from './pages/MentionsLegales'
import DashboardAdmin from './pages/DashboardAdmin'

export default function App() {
  return (
    <>
        <ReactLenis root />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/reinitialiser-le-mot-de-passe" element={<MotDePasseOublie />} />
            <Route path="/super-heros" element={<SuperHeros />} />
            <Route path="/super-vilains" element={<SuperVilains />} />
            <Route path="/profil" element={<ProfilLayout />}>
              <Route index element={<Profil />} />
              <Route path="incidents" element={<ProfilIncidents />} />
              <Route path="signaler-incidents" element={<ProfilSignalerIncident />} />
              <Route path="informations" element={<ProfilInformations />} />
              <Route path="statistiques" element={<ProfilStatistiques />} />
              <Route path="reputation" element={<ProfilReputation />} />
            </Route>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          </Routes>
        </Layout>
    </>
  )
}