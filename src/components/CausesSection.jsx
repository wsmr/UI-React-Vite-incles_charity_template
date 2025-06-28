import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Users, Target, Calendar, ArrowRight, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

const CausesSection = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(false)

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const filters = [
    { id: 'all', label: 'All Causes' },
    { id: 'education', label: 'Education' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'environment', label: 'Environment' },
    { id: 'poverty', label: 'Poverty' }
  ]

  const causes = [
    {
      id: 1,
      category: 'education',
      title: 'Education for Rural Children',
      description: 'Providing quality education and learning resources to children in remote rural areas who lack access to proper schooling facilities.',
      image: '/src/assets/resource/couses/image-2.jpg',
      raised: 45000,
      goal: 75000,
      donors: 234,
      daysLeft: 45,
      featured: true
    },
    {
      id: 2,
      category: 'healthcare',
      title: 'Mobile Medical Clinics',
      description: 'Bringing essential healthcare services to remote communities that lack access to medical facilities and trained professionals.',
      image: '/src/assets/resource/couses/image-3.jpg',
      raised: 32000,
      goal: 50000,
      donors: 156,
      daysLeft: 30,
      featured: false
    },
    {
      id: 3,
      category: 'environment',
      title: 'Forest Conservation Project',
      description: 'Protecting endangered forests and wildlife habitats while supporting local communities through sustainable practices.',
      image: '/src/assets/resource/couses/image-4.jpg',
      raised: 28000,
      goal: 60000,
      donors: 189,
      daysLeft: 60,
      featured: false
    },
    {
      id: 4,
      category: 'poverty',
      title: 'Food Security Program',
      description: 'Addressing hunger and malnutrition by providing nutritious meals and teaching sustainable farming techniques.',
      image: '/src/assets/resource/couses/image-5.jpg',
      raised: 18000,
      goal: 40000,
      donors: 98,
      daysLeft: 25,
      featured: false
    },
    {
      id: 5,
      category: 'healthcare',
      title: 'Mobile Medical Clinics',
      description: 'Bringing essential healthcare services to remote communities through mobile medical units and trained professionals.',
      image: '/src/assets/resource/couses/image-6.jpg',
      raised: 55000,
      goal: 80000,
      donors: 312,
      daysLeft: 40,
      featured: true
    },
    {
      id: 6,
      category: 'education',
      title: 'Digital Learning Centers',
      description: 'Establishing computer labs and digital learning centers to bridge the technology gap in underserved communities.',
      image: '/src/assets/resource/couses/image-8.jpg',
      raised: 22000,
      goal: 45000,
      donors: 127,
      daysLeft: 35,
      featured: false
    }
  ]

  const filteredCauses = activeFilter === 'all' 
    ? causes 
    : causes.filter(cause => cause.category === activeFilter)

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section id="causes" className={`py-20 transition-all duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <span className="text-blue-600 font-medium tracking-wide uppercase text-sm">
              Our Causes
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Make a Difference Today
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Every donation, no matter the size, creates ripples of positive change. 
            Choose a cause that resonates with you and help us build a better world together.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Causes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCauses.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                cause.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Featured Badge */}
              {cause.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={cause.image} 
                  alt={cause.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                  {cause.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {cause.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {cause.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {Math.round(getProgressPercentage(cause.raised, cause.goal))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(cause.raised, cause.goal)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(cause.raised)}
                    </div>
                    <div className="text-xs text-gray-600">Raised</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {cause.donors}
                    </div>
                    <div className="text-xs text-gray-600">Donors</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {cause.daysLeft}
                    </div>
                    <div className="text-xs text-gray-600">Days Left</div>
                  </div>
                </div>

                {/* Goal */}
                <div className="text-center mb-6">
                  <span className="text-gray-600 text-sm">Goal: </span>
                  <span className="text-gray-800 font-semibold">
                    {formatCurrency(cause.goal)}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Now
                      </span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      variant="outline" 
                      className="px-4 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full"
          >
            View All Causes
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Can't Find the Right Cause?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              We're always working on new initiatives. Contact us to learn about upcoming projects 
              or suggest a cause that's close to your heart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full"
              >
                Suggest a Cause
                <Target className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-white px-8 py-4 rounded-full"
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CausesSection

