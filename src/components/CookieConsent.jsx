import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, X, Check, Shield, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  // Cookie categories with detailed information
  const cookieCategories = {
    necessary: {
      name: 'Strictly Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: ['Session management', 'Security tokens', 'Load balancing'],
      required: true,
      enabled: true
    },
    functional: {
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
      examples: ['Language preferences', 'Theme settings', 'Form data'],
      required: false,
      enabled: preferences.functional
    },
    analytics: {
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Google Analytics', 'Page views', 'User behavior'],
      required: false,
      enabled: preferences.analytics
    },
    marketing: {
      name: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
      examples: ['Ad targeting', 'Social media tracking', 'Conversion tracking'],
      required: false,
      enabled: preferences.marketing
    }
  }

  // Check if consent has been given
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    const consentDate = localStorage.getItem('cookie-consent-date')
    
    if (!consent || !consentDate) {
      setShowBanner(true)
    } else {
      // Check if consent is older than 12 months (GDPR requirement)
      const consentTimestamp = parseInt(consentDate)
      const twelveMonthsAgo = Date.now() - (365 * 24 * 60 * 60 * 1000)
      
      if (consentTimestamp < twelveMonthsAgo) {
        setShowBanner(true)
      } else {
        // Load saved preferences
        try {
          const savedPreferences = JSON.parse(consent)
          setPreferences(prev => ({ ...prev, ...savedPreferences }))
        } catch (error) {
          console.error('Error parsing cookie preferences:', error)
          setShowBanner(true)
        }
      }
    }
  }, [])

  // Save consent preferences
  const saveConsent = (prefs) => {
    const consentData = {
      necessary: true,
      functional: prefs.functional,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      timestamp: Date.now(),
      version: '1.0'
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData))
    localStorage.setItem('cookie-consent-date', Date.now().toString())
    
    // Trigger consent event for analytics
    if (window.gtag && prefs.analytics) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
    
    if (window.gtag && prefs.marketing) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted'
      })
    }
    
    setPreferences(consentData)
    setShowBanner(false)
    setShowSettings(false)
  }

  // Accept all cookies
  const acceptAll = () => {
    saveConsent({
      functional: true,
      analytics: true,
      marketing: true
    })
  }

  // Accept only necessary cookies
  const acceptNecessary = () => {
    saveConsent({
      functional: false,
      analytics: false,
      marketing: false
    })
  }

  // Save custom preferences
  const saveCustomPreferences = () => {
    saveConsent(preferences)
  }

  // Update preference
  const updatePreference = (category, value) => {
    if (category === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  // Withdraw consent (GDPR right)
  const withdrawConsent = () => {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    
    // Clear all non-necessary cookies
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      // Don't clear necessary cookies (session, security, etc.)
      if (!['session', 'csrf', 'auth'].some(necessary => name.includes(necessary))) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    
    setShowBanner(true)
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    })
  }

  if (!showBanner) {
    return (
      // Floating settings button for users to manage preferences
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-40"
      >
        <Button
          onClick={() => setShowSettings(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
          title="Cookie Settings"
        >
          <Cookie className="w-5 h-5" />
        </Button>
      </motion.div>
    )
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Cookie className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      We Value Your Privacy
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                    You can manage your preferences or learn more about our cookie policy.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>GDPR & CCPA Compliant</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={acceptAll}
                    className="text-sm px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept All
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <a href="/privacy-policy" className="hover:text-blue-600 underline">
                    Privacy Policy
                  </a>
                  <a href="/cookie-policy" className="hover:text-blue-600 underline">
                    Cookie Policy
                  </a>
                  <a href="/terms" className="hover:text-blue-600 underline">
                    Terms of Service
                  </a>
                  <button 
                    onClick={withdrawConsent}
                    className="hover:text-blue-600 underline"
                  >
                    Withdraw Consent
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(cookieCategories).map(([key, category]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          {category.required && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={category.enabled}
                            disabled={category.required}
                            onChange={(e) => updatePreference(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        <strong>Examples:</strong> {category.examples.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="flex-1"
                  >
                    Accept Necessary Only
                  </Button>
                  <Button
                    onClick={saveCustomPreferences}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={acceptAll}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept All
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Your Rights:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>You can change your preferences at any time</li>
                        <li>You can withdraw consent and delete cookies</li>
                        <li>Necessary cookies cannot be disabled for security reasons</li>
                        <li>Your consent is valid for 12 months</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CookieConsent

