import { useEffect, useState, useCallback } from 'react'

const PerformanceOptimizer = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer for lazy loading
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

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontPreloads = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ]

      fontPreloads.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = href
        link.onload = function() { this.rel = 'stylesheet' }
        document.head.appendChild(link)
      })

      // Preload critical images
      const criticalImages = [
        '/src/assets/logo.png',
        '/src/assets/main-slider/image-1.jpg'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      })
    }

    preloadCriticalResources()
  }, [])

  // Image lazy loading with blur-up effect
  const LazyImage = ({ src, alt, className, placeholder }) => {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(false)

    const imgRef = useIntersectionObserver(
      useCallback(([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      }, [])
    )

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
        {inView && (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
        )}
        
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
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
      `

      const style = document.createElement('style')
      style.textContent = criticalCSS
      document.head.appendChild(style)
    }

    inlineCriticalCSS()
  }, [])

  // Resource hints for better performance
  useEffect(() => {
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
        { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
      ]

      hints.forEach(hint => {
        const link = document.createElement('link')
        Object.keys(hint).forEach(key => {
          if (key === 'crossorigin') {
            link.setAttribute('crossorigin', '')
          } else {
            link.setAttribute(key, hint[key])
          }
        })
        document.head.appendChild(link)
      })
    }

    addResourceHints()
  }, [])

  // Service Worker registration for caching
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registered successfully:', registration)
        } catch (error) {
          console.log('Service Worker registration failed:', error)
        }
      }
    }

    registerServiceWorker()
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

  // Responsive image component
  const ResponsiveImage = ({ 
    src, 
    alt, 
    className, 
    sizes = "100vw",
    priority = false 
  }) => {
    const [loaded, setLoaded] = useState(false)
    
    const srcSet = [
      `${optimizeImage(src, 640)} 640w`,
      `${optimizeImage(src, 768)} 768w`,
      `${optimizeImage(src, 1024)} 1024w`,
      `${optimizeImage(src, 1280)} 1280w`,
      `${optimizeImage(src, 1920)} 1920w`
    ].join(', ')

    return (
      <img
        src={optimizeImage(src, 1024)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  // Bundle splitting and code splitting utilities
  const loadComponentAsync = (importFunc) => {
    return React.lazy(() => 
      importFunc().then(module => ({
        default: module.default || module
      }))
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
    if (process.env.NODE_ENV !== 'development') return null

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

// Utility functions for performance optimization
export const preloadRoute = (routePath) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = routePath
  document.head.appendChild(link)
}

export const preloadImage = (src) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

export const deferNonCriticalCSS = (href) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = href
  link.onload = function() { this.rel = 'stylesheet' }
  document.head.appendChild(link)
}

// Critical resource loading strategy
export const loadCriticalResources = () => {
  // Load critical CSS inline
  const criticalCSS = document.createElement('style')
  criticalCSS.textContent = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    .header { position: fixed; top: 0; width: 100%; z-index: 1000; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  `
  document.head.appendChild(criticalCSS)

  // Defer non-critical CSS
  setTimeout(() => {
    deferNonCriticalCSS('/css/non-critical.css')
  }, 100)
}

