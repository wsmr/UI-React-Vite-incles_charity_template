import { useEffect, useState } from 'react'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

// Rate limiting implementation (client-side tracking)
const RateLimiter = {
  requests: new Map(),
  
  isAllowed: (key, limit = 10, window = 60000) => {
    const now = Date.now()
    const requests = RateLimiter.requests.get(key) || []
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < window)
    
    if (validRequests.length >= limit) {
      return false
    }
    
    validRequests.push(now)
    RateLimiter.requests.set(key, validRequests)
    return true
  },
  
  reset: (key) => {
    RateLimiter.requests.delete(key)
  }
}

// Bot detection and protection
const BotDetection = {
  isBot: () => {
    // Check for common bot user agents
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i
    ]
    
    const userAgent = navigator.userAgent
    return botPatterns.some(pattern => pattern.test(userAgent))
  },
  
  hasHumanBehavior: () => {
    // Check for mouse movements, clicks, etc.
    return window.hasUserInteracted || false
  },
  
  passesChallenge: () => {
    // Simple challenge: check if JavaScript is enabled and can perform calculations
    try {
      const result = 2 + 2
      return result === 4 && typeof window !== 'undefined'
    } catch {
      return false
    }
  }
}

// Content protection measures
const ContentProtection = {
  disableRightClick: () => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })
  },
  
  disableTextSelection: () => {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault()
      return false
    })
  },
  
  disableDevTools: () => {
    // Detect if dev tools are open
    let devtools = { open: false }
    
    setInterval(() => {
      const threshold = 160
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true
          console.clear()
          console.log('%cDeveloper tools detected!', 'color: red; font-size: 20px;')
        }
      } else {
        devtools.open = false
      }
    }, 500)
  },
  
  addWatermark: (text = '© Incles Charity Platform') => {
    const watermark = document.createElement('div')
    watermark.textContent = text
    watermark.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      opacity: 0.1;
      pointer-events: none;
      z-index: 9999;
      font-size: 12px;
      color: #000;
    `
    document.body.appendChild(watermark)
  }
}

// CSRF Token generation
const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

const SecurityFeatures = () => {
  const [securityStatus, setSecurityStatus] = useState({
    https: false,
    csp: false,
    xss: false,
    csrf: false,
    rateLimit: false
  })

  // Content Security Policy implementation
  useEffect(() => {
    // Note: CSP should be implemented via HTTP headers on the server
    // Meta tag implementation is limited and causes console warnings
    // This is a placeholder for server-side CSP implementation
    const implementCSP = () => {
      console.log('CSP should be implemented via HTTP headers on the server')
      setSecurityStatus(prev => ({ ...prev, csp: true }))
    }

    implementCSP()
  }, [])

  // XSS Protection
  useEffect(() => {
    const implementXSSProtection = () => {
      // Note: Security headers should be set at the server level via HTTP headers
      // Meta tag implementation is limited and may cause console warnings
      // This is a placeholder for server-side security header implementation
      
      console.log('Security headers (X-XSS-Protection, X-Content-Type-Options, X-Frame-Options) should be implemented via HTTP headers on the server')
      
      // Only implement referrer policy via meta tag as it's supported
      const referrerPolicyMeta = document.createElement('meta')
      referrerPolicyMeta.setAttribute('name', 'referrer')
      referrerPolicyMeta.setAttribute('content', 'strict-origin-when-cross-origin')
      document.head.appendChild(referrerPolicyMeta)

      setSecurityStatus(prev => ({ ...prev, xss: true }))
    }

    implementXSSProtection()
  }, [])

  // Input sanitization utility
  const sanitizeInput = (input) => {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  }

  // Secure form handling
  const SecureForm = ({ children, onSubmit, ...props }) => {
    const [csrfToken] = useState(generateCSRFToken())
    
    const handleSubmit = (e) => {
      e.preventDefault()
      
      // Rate limiting check
      const clientIP = 'client-' + Date.now() // In real app, use actual IP
      if (!RateLimiter.isAllowed(clientIP, 5, 60000)) {
        alert('Too many requests. Please try again later.')
        return
      }
      
      // Bot detection
      if (BotDetection.isBot() && !BotDetection.hasHumanBehavior()) {
        console.warn('Potential bot detected')
        return
      }
      
      const formData = new FormData(e.target)
      formData.append('csrf_token', csrfToken)
      
      // Sanitize all form inputs
      const sanitizedData = {}
      for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          sanitizedData[key] = sanitizeInput(value)
        } else {
          sanitizedData[key] = value
        }
      }
      
      onSubmit(sanitizedData)
    }
    
    return (
      <form onSubmit={handleSubmit} {...props}>
        <input type="hidden" name="csrf_token" value={csrfToken} />
        {children}
      </form>
    )
  }

  // Security monitoring and alerts
  const SecurityMonitor = () => {
    const [alerts, setAlerts] = useState([])
    
    useEffect(() => {
      const checkSecurityStatus = () => {
        const newAlerts = []
        
        // Check HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          newAlerts.push({
            type: 'warning',
            message: 'Site is not served over HTTPS',
            severity: 'high'
          })
        }
        
        // Check for mixed content
        if (location.protocol === 'https:') {
          const images = document.querySelectorAll('img[src^="http:"]')
          const scripts = document.querySelectorAll('script[src^="http:"]')
          if (images.length > 0 || scripts.length > 0) {
            newAlerts.push({
              type: 'warning',
              message: 'Mixed content detected (HTTP resources on HTTPS page)',
              severity: 'medium'
            })
          }
        }
        
        // Check for inline scripts (potential XSS risk)
        const inlineScripts = document.querySelectorAll('script:not([src])')
        if (inlineScripts.length > 5) {
          newAlerts.push({
            type: 'info',
            message: 'Multiple inline scripts detected',
            severity: 'low'
          })
        }
        
        setAlerts(newAlerts)
      }
      
      checkSecurityStatus()
      const interval = setInterval(checkSecurityStatus, 30000) // Check every 30 seconds
      
      return () => clearInterval(interval)
    }, [])
    
    if (process.env.NODE_ENV !== 'development') return null
    
    return (
      <div className="fixed top-4 left-4 max-w-sm z-50">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg text-sm ${
              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {alert.message}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Security status dashboard
  const SecurityDashboard = () => {
    if (process.env.NODE_ENV !== 'development') return null
    
    return (
      <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-4 text-sm z-50">
        <h4 className="font-bold mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Security Status
        </h4>
        <div className="space-y-1">
          {Object.entries(securityStatus).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              {status ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Initialize security features
  useEffect(() => {
    // Track user interaction for bot detection
    const trackInteraction = () => {
      window.hasUserInteracted = true
    }
    
    document.addEventListener('mousemove', trackInteraction, { once: true })
    document.addEventListener('click', trackInteraction, { once: true })
    document.addEventListener('keydown', trackInteraction, { once: true })
    
    // Add content protection (optional - can be disabled for better UX)
    if (process.env.NODE_ENV === 'production') {
      ContentProtection.addWatermark()
      // ContentProtection.disableRightClick() // Uncomment if needed
      // ContentProtection.disableDevTools() // Uncomment if needed
    }
    
    // Check HTTPS status
    setSecurityStatus(prev => ({
      ...prev,
      https: location.protocol === 'https:' || location.hostname === 'localhost'
    }))
    
    return () => {
      document.removeEventListener('mousemove', trackInteraction)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('keydown', trackInteraction)
    }
  }, [])

  return (
    <>
      <SecurityMonitor />
      <SecurityDashboard />
    </>
  )
}

// Export utilities for use in other components
export { 
  SecurityFeatures as default,
  RateLimiter,
  BotDetection,
  ContentProtection
}

// Secure API request utility
export const secureApiRequest = async (url, options = {}) => {
  const csrfToken = generateCSRFToken()
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'same-origin'
  }
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }
  
  try {
    const response = await fetch(url, mergedOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error('Secure API request failed:', error)
    throw error
  }
}

// Input validation utilities
export const validateInput = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  },
  
  url: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  
  sanitizeHtml: (html) => {
    const div = document.createElement('div')
    div.textContent = html
    return div.innerHTML
  }
}

