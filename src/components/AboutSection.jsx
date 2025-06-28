import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Users, Target, Award, ArrowRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('mission')
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

  const stats = [
    {
      icon: Heart,
      number: "50,000+",
      label: "Lives Impacted",
      description: "People whose lives have been transformed through our programs"
    },
    {
      icon: Users,
      number: "2,500+",
      label: "Active Volunteers",
      description: "Dedicated individuals working to make a difference"
    },
    {
      icon: Target,
      number: "150+",
      label: "Projects Completed",
      description: "Successful initiatives across multiple communities"
    },
    {
      icon: Award,
      number: "25+",
      label: "Years of Service",
      description: "Decades of commitment to positive change"
    }
  ]

  const tabs = [
    {
      id: 'mission',
      label: 'Our Mission',
      title: 'Empowering Communities Through Compassionate Action',
      content: 'Our mission is to create lasting positive change in communities worldwide by addressing fundamental needs in education, healthcare, and sustainable development. We believe that every person deserves access to basic necessities and opportunities for growth.',
      highlights: [
        'Sustainable community development',
        'Education and skill building programs',
        'Healthcare access and awareness',
        'Environmental conservation initiatives'
      ]
    },
    {
      id: 'vision',
      label: 'Our Vision',
      title: 'A World Where Everyone Has Equal Opportunities',
      content: 'We envision a world where geographical location, economic status, or social circumstances do not determine one\'s access to education, healthcare, and opportunities for personal development. Our vision drives us to work tirelessly toward global equity.',
      highlights: [
        'Universal access to quality education',
        'Comprehensive healthcare for all',
        'Economic empowerment programs',
        'Sustainable environmental practices'
      ]
    },
    {
      id: 'values',
      label: 'Our Values',
      title: 'Principles That Guide Our Every Action',
      content: 'Our core values shape how we approach every project, interact with communities, and measure our success. These principles ensure that our work creates meaningful, lasting impact while respecting the dignity and autonomy of those we serve.',
      highlights: [
        'Transparency and accountability',
        'Cultural sensitivity and respect',
        'Collaborative community engagement',
        'Evidence-based program development'
      ]
    }
  ]

  const currentTab = tabs.find(tab => tab.id === activeTab)

  return (
    <section id="about" className={`py-20 transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-white'
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
              About Incles
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Making a Difference Since 1999
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            For over two decades, we've been committed to creating positive change in communities 
            around the world through sustainable programs and meaningful partnerships.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {stat.number}
              </div>
              <div className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {stat.label}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image and Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/src/assets/resource/about/image-1.jpg"
                alt="Our Impact" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.button>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className={`absolute -bottom-6 -right-6 rounded-xl shadow-xl p-6 max-w-xs transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>98%</div>
                  <div className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Donation Efficiency</div>
                </div>
              </div>
              <div className={`mt-3 text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                98% of donations go directly to programs
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Tabs and Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {currentTab.title}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {currentTab.content}
              </p>

              {/* Highlights */}
              <div className="space-y-4 mb-8">
                {currentTab.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full">
                  Our Programs
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of supporters who are creating positive change in communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold"
            >
              Start Donating
              <Heart className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold"
            >
              Become a Volunteer
              <Users className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection

