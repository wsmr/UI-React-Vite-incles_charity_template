import { useEffect, useState } from 'react'
import { Download, Bell, Share2, Heart, Moon, Sun, Globe, Accessibility } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ModernFeatures = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState('default')
  const [language, setLanguage] = useState('en')

  // PWA Installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  // Online/Offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Dark mode implementation
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Push notifications
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    const permission = await Notification.requestPermission()
    setNotifications(permission)
    
    if (permission === 'granted') {
      new Notification('Incles Notifications Enabled', {
        body: 'You will now receive updates about our causes and impact.',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    }
  }

  // Web Share API
  const shareContent = async (title, text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  // Geolocation for local events
  const [location, setLocation] = useState(null)
  
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }

  // Voice search functionality
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
      // Process voice search here
      console.log('Voice search:', transcript)
    }

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  // Accessibility features
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState('normal')

  const toggleHighContrast = () => {
    const newHighContrast = !highContrast
    setHighContrast(newHighContrast)
    
    if (newHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const changeFontSize = (size) => {
    setFontSize(size)
    document.documentElement.classList.remove('font-small', 'font-normal', 'font-large')
    document.documentElement.classList.add(`font-${size}`)
  }

  // Offline support
  const OfflineIndicator = () => {
    if (isOnline) return null

    return (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
        You are currently offline. Some features may not be available.
      </div>
    )
  }

  // Install prompt
  const InstallPrompt = () => {
    if (!isInstallable) return null

    return (
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-start space-x-3">
          <Download className="w-6 h-6 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Install Incles App</h4>
            <p className="text-sm mb-3">Get quick access to donate and stay updated on our causes.</p>
            <div className="flex space-x-2">
              <Button 
                onClick={installPWA}
                className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-3 py-1"
              >
                Install
              </Button>
              <Button 
                onClick={() => setIsInstallable(false)}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-sm px-3 py-1"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Accessibility toolbar
  const AccessibilityToolbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="fixed left-4 top-3/4 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } p-3 rounded-full shadow-lg transition-all duration-300`}
          aria-label="Accessibility options"
        >
          <Accessibility className="w-5 h-5" />
        </Button>
        
        {isOpen && (
          <div className={`mt-2 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          } border rounded-lg shadow-lg p-4 w-64 transition-all duration-300`}>
            <h4 className="font-semibold mb-3">Accessibility Options</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <div className="flex space-x-1">
                  {['small', 'normal', 'large'].map((size) => (
                    <Button
                      key={size}
                      onClick={() => changeFontSize(size)}
                      variant={fontSize === size ? 'default' : 'outline'}
                      className={`text-xs px-2 py-1 ${
                        darkMode 
                          ? fontSize === size 
                            ? 'bg-blue-600 text-white' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : ''
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Button
                  onClick={toggleHighContrast}
                  variant={highContrast ? 'default' : 'outline'}
                  className={`text-xs px-2 py-1 ${
                    darkMode 
                      ? highContrast 
                        ? 'bg-blue-600 text-white' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : ''
                  }`}
                >
                  {highContrast ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  className={`text-xs px-2 py-1 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : ''
                  }`}
                >
                  {darkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Quick actions floating button
  const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false)

    const actions = [
      {
        icon: Heart,
        label: 'Quick Donate',
        action: () => console.log('Quick donate'),
        color: 'bg-red-500 hover:bg-red-600'
      },
      {
        icon: Share2,
        label: 'Share',
        action: () => shareContent('Incles Charity', 'Join us in making a difference', window.location.href),
        color: 'bg-green-500 hover:bg-green-600'
      },
      {
        icon: Bell,
        label: 'Notifications',
        action: requestNotificationPermission,
        color: 'bg-yellow-500 hover:bg-yellow-600'
      },
      {
        icon: Globe,
        label: 'Find Local Events',
        action: getLocation,
        color: 'bg-purple-500 hover:bg-purple-600'
      }
    ]

    return (
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <div className="mb-4 space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-3 rounded-full shadow-lg block w-12 h-12`}
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        )}
        
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          {isOpen ? '×' : '+'}
        </Button>
      </div>
    )
  }

  // Language selector
  const LanguageSelector = () => {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'zh', name: '中文' },
      { code: 'ar', name: 'العربية' }
    ]

    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent border-none text-white text-sm focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-black">
            {lang.name}
          </option>
        ))}
      </select>
    )
  }

  // Service Worker registration for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return (
    <>
      <OfflineIndicator />
      <InstallPrompt />
      <AccessibilityToolbar />
      <QuickActions />
      
      {/* Add CSS for accessibility features */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .high-contrast {
            filter: contrast(150%) brightness(150%);
          }
          
          .font-small {
            font-size: 14px;
          }
          
          .font-normal {
            font-size: 16px;
          }
          
          .font-large {
            font-size: 18px;
          }
          
          .dark {
            color-scheme: dark;
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      }} />
    </>
  )
}

// Web Vitals monitoring
export const WebVitalsMonitor = () => {
  useEffect(() => {
    const reportWebVitals = (metric) => {
      console.log(metric)
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true
        })
      }
    }

    // Manual Web Vitals implementation
    const measureWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          reportWebVitals({
            name: 'LCP',
            value: lastEntry.startTime,
            id: 'lcp'
          })
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            reportWebVitals({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: 'fid'
            })
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift (CLS)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          reportWebVitals({
            name: 'CLS',
            value: clsValue,
            id: 'cls'
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      }
    }

    measureWebVitals()
  }, [])

  return null
}

export default ModernFeatures

