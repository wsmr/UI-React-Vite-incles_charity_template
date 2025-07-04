import Header from './components/Header'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import CausesSection from './components/CausesSection'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from './components/Footer'
import SEOHead, { getOrganizationStructuredData } from './components/SEOHead'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import SecurityFeatures from './components/SecurityFeatures'
import ModernFeatures from './components/ModernFeatures'
import CookieConsent from './components/CookieConsent'
import ScrollToTop from './components/ScrollToTop'
import ContentProtection from './components/ContentProtection'
import Preloader from './components/Preloader'
import './App.css'

function App() {
  return (
    <div className="min-h-screen">
      <Preloader />
      <PerformanceOptimizer />
      <SecurityFeatures />
      <ModernFeatures />
      <SEOHead 
        title="Incles - Modern Charity Platform | Making a Difference Since 1999"
        description="Join Incles in creating positive change worldwide. Support education, healthcare, and environmental initiatives. 98% of donations go directly to programs. Donate now and make a difference."
        keywords="charity, donation, nonprofit, education, healthcare, environment, volunteer, fundraising, community development, social impact, NGO"
        structuredData={getOrganizationStructuredData()}
      />
      <CookieConsent />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CausesSection />
        <TestimonialsSection />
      </main>
      <Footer />
      
      {/* Fixed Components */}
      <ScrollToTop />
      <ContentProtection />
    </div>
  )
}

export default App
