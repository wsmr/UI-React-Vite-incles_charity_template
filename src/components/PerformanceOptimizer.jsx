import { useEffect, useState, useCallback } from 'react'

const PerformanceOptimizer = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Enhanced Intersection Observer for lazy loading
  const useIntersectionObserver = (callback, options = {}) => {
    const [ref, setRef] = useState(null)

    useEffect(() => {
      if (!ref) return

      const observer = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      })

      observer.observe(ref)

      return () => {
        if (ref) observer.unobserve(ref)
      }
    }, [ref, callback, options])

    return setRef
  }

  // Enhanced image caching and loading strategy
  useEffect(() => {
    const setupImageCaching = () => {
      // Create a cache-busting mechanism for images
      const imageCache = new Map()
      
      // Override the default image loading behavior
      const originalCreateElement = document.createElement
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName)
        
        if (tagName.toLowerCase() === 'img') {
          // Add cache-busting and retry logic for images
          const originalSrc = element.src
          let retryCount = 0
          const maxRetries = 3
          
          const loadWithRetry = (src) => {
            return new Promise((resolve, reject) => {
              const img = new Image()
              
              img.onload = () => {
                imageCache.set(src, true)
                resolve(img)
              }
              
              img.onerror = () => {
                retryCount++
                if (retryCount < maxRetries) {
                  // Add timestamp to bust cache
                  const separator = src.includes('?') ? '&' : '?'
                  const cacheBustedSrc = `${src}${separator}t=${Date.now()}`
                  setTimeout(() => loadWithRetry(cacheBustedSrc), 1000 * retryCount)
                } else {
                  reject(new Error(`Failed to load image after ${maxRetries} attempts`))
                }
              }
              
              img.src = src
            })
          }
          
          // Override src setter to implement retry logic
          try {
          Object.defineProperty(element, 'src', {
            get() { return originalSrc },
            set(value) {
              if (value && !imageCache.has(value)) {
                loadWithRetry(value)
                  .then(() => {
                    element.setAttribute('src', value)
                  })
                  .catch(error => {
                    console.warn('Image loading failed:', error)
                    // Fallback to a placeholder or default image
                    element.setAttribute('src', '/src/assets/placeholder.jpg')
                  })
              } else {
                element.setAttribute('src', value)
              }
            }
          })
          } catch (error) {
            console.error("Failed to redefine 'src' property:", error);
            // Fallback: Just use the original element's src property
            element.src = originalSrc; // Or handle the image loading differently
          }
        }
        
        return element
      }
    }

    setupImageCaching()
  }, [])

  // Preload critical resources with better error handling
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Preload critical fonts with fallbacks
      const fontPreloads = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ]

      fontPreloads.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = href
        link.onload = function() { 
          this.rel = 'stylesheet'
          this.onload = null // Prevent memory leaks
        }
        link.onerror = function() {
          console.warn('Failed to load font:', href)
          // Fallback to system fonts
          document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
        document.head.appendChild(link)
      })

      // Enhanced critical image preloading with error handling
      const criticalImages = [
        '/src/assets/logo.png',
        '/src/assets/resource/hero/image-1.jpg',
        '/src/assets/resource/hero/image-2.jpg',
        '/src/assets/resource/hero/image-3.jpg'
      ]

      criticalImages.forEach(src => {
        const img = new Image()
        img.onload = () => {
          // Image loaded successfully, add to cache
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          document.head.appendChild(link)
        }
        img.onerror = () => {
          console.warn('Failed to preload critical image:', src)
        }
        img.src = src
      })
    }

    preloadCriticalResources()
  }, [])

  // Enhanced Image lazy loading with blur-up effect and better caching
  const LazyImage = ({ src, alt, className, placeholder }) => {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(false)
    const [error, setError] = useState(false)
    const [currentSrc, setCurrentSrc] = useState('')

    const imgRef = useIntersectionObserver(
      useCallback(([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      }, [])
    )

    useEffect(() => {
      if (inView && src && !currentSrc) {
        // Add cache-busting if needed
        const cacheBustedSrc = error ? `${src}?t=${Date.now()}` : src
        setCurrentSrc(cacheBustedSrc)
      }
    }, [inView, src, error, currentSrc])

    const handleImageLoad = () => {
      setLoaded(true)
      setError(false)
    }

    const handleImageError = () => {
      setError(true)
      setLoaded(false)
      // Retry with cache-busting
      setTimeout(() => {
        setCurrentSrc(`${src}?t=${Date.now()}`)
      }, 1000)
    }

    return (
      <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
        {/* Placeholder/blur image */}
        {placeholder && !loaded && (
          <img
            src={placeholder}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          />
        )}
        
        {/* Main image */}
        {inView && currentSrc && (
          <img
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        )}
        
        {/* Loading skeleton */}
        {!loaded && inView && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Critical CSS inlining
  useEffect(() => {
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        /* Critical above-the-fold styles */
        .hero-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        /* Image loading states */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        .img-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `

      const style = document.createElement('style')
      style.textContent = criticalCSS
      document.head.appendChild(style)
    }

    inlineCriticalCSS()
  }, [])

  // Enhanced Service Worker registration for better caching
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })
          
          // Update service worker when new version is available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available, prompt user to refresh
                if (confirm('A new version is available. Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          })
          
          console.log('Service Worker registered successfully:', registration)
        } catch (error) {
          console.log('Service Worker registration failed:', error)
        }
      }
    }

    registerServiceWorker()
  }, [])

  // Resource hints for better performance
  useEffect(() => {
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
        { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
      ]

      hints.forEach(hint => {
        const link = document.createElement('link')
        Object.keys(hint).forEach(key => {
          if (key === 'crossOrigin') {
            link.setAttribute('crossorigin', hint[key])
          } else {
            link.setAttribute(key, hint[key])
          }
        })
        document.head.appendChild(link)
      })
    }

    addResourceHints()
  }, [])

  // Web Vitals monitoring
  useEffect(() => {
    const measureWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime)
          })
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime)
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(entry.processingStart - entry.startTime)
            })
          }
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
        
        console.log('CLS:', clsValue)
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000)
          })
        }
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }

    measureWebVitals()
  }, [])

  // Image optimization utilities
  const optimizeImage = (src, width, quality = 80) => {
    // In a real implementation, this would integrate with an image optimization service
    // like Cloudinary, ImageKit, or Next.js Image Optimization
    const params = new URLSearchParams({
      w: width,
      q: quality,
      f: 'auto' // Auto format selection (WebP, AVIF, etc.)
    })
    
    return `${src}?${params.toString()}`
  }

  // Enhanced Responsive image component with better caching
  const ResponsiveImage = ({ 
    src, 
    alt, 
    className, 
    sizes = "100vw",
    priority = false 
  }) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    
    const srcSet = [
      `${optimizeImage(src, 640)} 640w`,
      `${optimizeImage(src, 768)} 768w`,
      `${optimizeImage(src, 1024)} 1024w`,
      `${optimizeImage(src, 1280)} 1280w`,
      `${optimizeImage(src, 1920)} 1920w`
    ].join(', ')

    const handleLoad = () => {
      setLoaded(true)
      setError(false)
    }

    const handleError = () => {
      setError(true)
      setLoaded(false)
    }

    return (
      <img
        src={optimizeImage(src, 1024)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  // Performance monitoring dashboard (development only)
  const PerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({})

    useEffect(() => {
      const updateMetrics = () => {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        
        setMetrics({
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        })
      }

      // Update metrics after page load
      if (document.readyState === 'complete') {
        updateMetrics()
      } else {
        window.addEventListener('load', updateMetrics)
      }

      return () => window.removeEventListener('load', updateMetrics)
    }, [])

    // Only show in development
    if (import.meta.env.MODE !== 'development') return null

    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs z-50">
        <h4 className="font-bold mb-2">Performance Metrics</h4>
        <div>DOM: {metrics.domContentLoaded}ms</div>
        <div>Load: {metrics.loadComplete}ms</div>
        <div>FP: {Math.round(metrics.firstPaint)}ms</div>
        <div>FCP: {Math.round(metrics.firstContentfulPaint)}ms</div>
      </div>
    )
  }

  return (
    <>
      <PerformanceMonitor />
      {/* This component handles performance optimizations in the background */}
    </>
  )
}

// Export utilities for use in other components
export { PerformanceOptimizer as default }

// Enhanced utility functions for performance optimization
export const preloadRoute = (routePath) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = routePath
  document.head.appendChild(link)
}

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      resolve(img)
    }
    img.onerror = reject
    img.src = src
  })
}

export const deferNonCriticalCSS = (href) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = href
  link.onload = function() { 
    this.rel = 'stylesheet'
    this.onload = null
  }
  document.head.appendChild(link)
}

// Enhanced critical resource loading strategy
export const loadCriticalResources = () => {
  // Load critical CSS inline
  const criticalCSS = document.createElement('style')
  criticalCSS.textContent = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    .header { position: fixed; top: 0; width: 100%; z-index: 1000; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    
    /* Image loading optimization */
    img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  `
  document.head.appendChild(criticalCSS)

  // Defer non-critical CSS
  setTimeout(() => {
    deferNonCriticalCSS('/css/non-critical.css')
  }, 100)
}

