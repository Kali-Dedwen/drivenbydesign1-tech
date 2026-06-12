import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/index'
import PivotOSLanding from './pages/PivotOSLanding'
import PivotIntake from './pages/PivotIntake'
import BridgeOSLanding from './pages/BridgeOSLanding'
import BridgeIntake from './pages/BridgeIntake'
import HumanOSLanding from './pages/HumanOSLanding'
import About from './pages/About'
import Manifesto from './pages/Manifesto'
import Accessibility from './pages/Accessibility'
import Speaking from './pages/speaking'
import Contact from './pages/Contact'
import ProjectCheck from './pages/project-check'
import CribNetwork from './pages/crib-network'
import FuseNetwork from './pages/fuse-network'
import PivotDashboard from './pages/PivotDashboard'
import FacilitatorDashboard from './pages/FacilitatorDashboard'
import ThankYou from './pages/ThankYou'
import Triage from './pages/Triage'
import Portal from './pages/portal'
import AuthGate from './components/AuthGate'
import SiteChat from './components/SiteChat'
import SovereignApprovalDashboard from './components/SovereignApprovalDashboard'

const AUTH_RETURN_PATHS = ['/portal', '/dashboard']

function rewriteAccessTokenHash() {
  if (typeof window === 'undefined') return
  if (!window.location.hash.includes('#access_token=')) return
  const path = window.location.pathname
  if (AUTH_RETURN_PATHS.some((p) => path === p || path.startsWith(p + '/'))) return
  // Lands at "/" or some other path — fall back to /portal for legacy magic links.
  window.location.replace('/portal' + window.location.hash)
}

export default function App() {
  rewriteAccessTokenHash()

  useEffect(() => {
    rewriteAccessTokenHash()
  }, [])

  return (
    <BrowserRouter>
      <div className="noise-overlay" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/pivot-os" element={<PivotOSLanding />} />
        <Route path="/pivot-os-landing" element={<PivotOSLanding />} />
        <Route path="/pivot-intake" element={<PivotIntake />} />
        <Route path="/bridge-os" element={<BridgeOSLanding />} />
        <Route path="/bridge-intake" element={<BridgeIntake />} />
        <Route path="/human-os" element={<HumanOSLanding />} />
        <Route path="/human-intake" element={<div style={{ color: '#fff', background: '#0A1628', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}><h1>Human OS™ Enterprise Intake — Coming Soon</h1></div>} />
        <Route path="/archive" element={<div style={{ color: '#fff', background: '#0A1628', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}><h1>Archive — Coming Soon</h1></div>} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/practitioner" element={<div style={{ color: '#fff', background: '#0A1628', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}><h1>Practitioner Access — Coming Soon</h1></div>} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/dashboard" element={<AuthGate><FacilitatorDashboard /></AuthGate>} />
        <Route path="/pivot-dashboard" element={<PivotDashboard />} />
        <Route path="/portal/approvals" element={<SovereignApprovalDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project-check" element={<ProjectCheck />} />
        <Route path="/crib-network" element={<CribNetwork />} />
        <Route path="/fuse-network" element={<FuseNetwork />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/portal" element={<AuthGate><Portal /></AuthGate>} />
      </Routes>
      <SiteChat />
    </BrowserRouter>
  )
}
