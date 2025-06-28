import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight, Heart, Users, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const slides = [
    {
      id: 1,
      title: "Making a Difference Together",
      subtitle: "Join Our Mission to Change Lives",
      description: "Every donation, every volunteer hour, and every act of kindness creates ripples of positive change in communities around the world.",
      image: "/src/assets/resource/hero/image-1.jpg",
      cta: "Start Donating",
      stats: { number: "50K+", label: "Lives Changed" },
      animation: "fadeZoom"
    },
    {
      id: 2,
      title: "Education for Every Child",
      subtitle: "Building Brighter Futures",
      description: "Help us provide quality education and learning opportunities to children in underserved communities worldwide.",
      image: "/src/assets/resource/hero/image-2.jpg",
      cta: "Support Education",
      stats: { number: "1000+", label: "Schools Built" },
      animation: "slideLeft"
    },
    {
      id: 3,
      title: "Clean Water for All",
      subtitle: "Essential Resources for Life",
      description: "Access to clean water is a basic human right. Join us in bringing safe, clean water to communities in need.",
      image: "/src/assets/resource/hero/image-3.jpg",
      cta: "Provide Water",
      stats: { number: "200+", label: "Wells Drilled" },
      animation: "slideUp"
    }
  ]

  // Auto-advance slides with varied timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000) // Slightly longer for better viewing
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Animation variants for different slide effects
  const getAnimationVariants = (animationType) => {
    switch (animationType) {
      case 'fadeZoom':
        return {
          initial: { opacity: 0, scale: 1.2 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: 100, scale: 1.1 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -100, scale: 0.9 }
        }
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 100, scale: 1.1 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -100, scale: 0.9 }
        }
      default:
        return {
          initial: { opacity: 0, scale: 1.1 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 }
        }
    }
  }

  const currentAnimation = getAnimationVariants(slides[currentSlide].animation)

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides with Enhanced Animations */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={currentAnimation.initial}
            animate={currentAnimation.animate}
            exit={currentAnimation.exit}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother transitions
            }}
            className="absolute inset-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat transform-gpu"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${slides[currentSlide].image}')`,
                filter: 'brightness(1.1) contrast(1.1)' // Enhanced image quality
              }}
            />
            
            {/* Animated overlay patterns */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"
            />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${currentSlide}-${i}`}
                  initial={{ 
                    opacity: 0, 
                    y: 100, 
                    x: Math.random() * window.innerWidth,
                    scale: 0
                  }}
                  animate={{ 
                    opacity: [0, 0.6, 0], 
                    y: -100, 
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white"
              >
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center space-x-2 mb-4"
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                  <span className="text-blue-300 font-medium tracking-wide uppercase text-sm">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed text-gray-200"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {slides[currentSlide].cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm bg-white/10 transition-all duration-300"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Story
                  </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="flex items-center space-x-8"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-300">
                      {slides[currentSlide].stats.number}
                    </div>
                    <div className="text-gray-300 text-sm uppercase tracking-wide">
                      {slides[currentSlide].stats.label}
                    </div>
                  </div>
                  
                  <div className="w-px h-12 bg-white/30"></div>
                  
                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span>Trusted by thousands</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <span>Global community</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2 rotate-90 origin-center">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-white"
          />
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl">Video Player Placeholder</p>
                    <p className="text-gray-400 mt-2">Embed your charity story video here</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HeroSection

