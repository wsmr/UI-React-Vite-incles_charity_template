import { useEffect, useRef, useState } from 'react'

export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false, // Set to false to allow re-triggering
    animationClass = 'animate-in',
    resetOnExit = true // Reset animation when element exits viewport
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting

        if (isIntersecting) {
          setIsVisible(true)
          if (!triggerOnce) {
            setHasAnimated(true)
          }
        } else {
          if (resetOnExit && !triggerOnce) {
            setIsVisible(false)
            setHasAnimated(false)
          }
        }

        // For triggerOnce behavior
        if (triggerOnce && isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, resetOnExit, hasAnimated])

  return {
    elementRef,
    isVisible,
    hasAnimated
  }
}

export const useStaggeredAnimation = (itemCount, options = {}) => {
  const {
    staggerDelay = 100,
    threshold = 0.1,
    rootMargin = '0px'
  } = options

  const [visibleItems, setVisibleItems] = useState(new Set())
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation of child items
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]))
            }, i * staggerDelay)
          }
        } else {
          // Reset when container exits viewport
          setVisibleItems(new Set())
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(container)

    return () => {
      observer.unobserve(container)
    }
  }, [itemCount, staggerDelay, threshold, rootMargin])

  return {
    containerRef,
    visibleItems
  }
}

export const useParallaxScroll = (speed = 0.5) => {
  const [offset, setOffset] = useState(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * speed
      
      setOffset(rate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return {
    elementRef,
    offset
  }
}

// Animation variants for Framer Motion
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 60,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

