import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Volunteer Coordinator",
      location: "New York, USA",
      image: "/src/assets/resource/testimonial-1.jpg",
      rating: 5,
      text: "Working with Incles has been one of the most rewarding experiences of my life. The organization's commitment to transparency and real impact is truly inspiring. I've seen firsthand how donations are used effectively to change lives in communities around the world.",
      project: "Education Initiative"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Medical Director",
      location: "San Francisco, USA",
      image: "/src/assets/resource/testimonial-2.jpg",
      rating: 5,
      text: "As a healthcare professional, I appreciate Incles' evidence-based approach to addressing health challenges in underserved communities. Their mobile clinic program has brought essential medical care to thousands of people who previously had no access to healthcare.",
      project: "Mobile Medical Clinics"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Community Leader",
      location: "Guatemala City, Guatemala",
      image: "/src/assets/resource/testimonial-3.jpg",
      rating: 5,
      text: "Incles didn't just bring resources to our community - they listened to our needs and worked with us to create sustainable solutions. The clean water project has transformed our village, and the training they provided ensures we can maintain the systems ourselves.",
      project: "Clean Water Initiative"
    },
    {
      id: 4,
      name: "James Thompson",
      role: "Corporate Partner",
      location: "London, UK",
      image: "/src/assets/resource/testimonial-4.jpg",
      rating: 5,
      text: "Our company has partnered with Incles for three years, and we're consistently impressed by their professionalism and impact measurement. They provide detailed reports on how our contributions are making a difference, which helps us engage our employees in meaningful giving.",
      project: "Corporate Partnership"
    },
    {
      id: 5,
      name: "Aisha Patel",
      role: "Education Advocate",
      location: "Mumbai, India",
      image: "/src/assets/resource/testimonial-5.jpg",
      rating: 5,
      text: "The digital learning centers that Incles established in our region have opened up a world of opportunities for our children. Students who never had access to computers are now learning coding and digital skills that will help them build better futures.",
      project: "Digital Learning Centers"
    }
  ]

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
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
              Testimonials
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Stories of Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from the people whose lives have been touched by our work - volunteers, 
            beneficiaries, partners, and supporters who are part of our global community.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                {/* Image Side */}
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20"></div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Project Badge */}
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2 rounded-full">
                    {testimonials[currentTestimonial].project}
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-6">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {[
            { number: "98%", label: "Satisfaction Rate", description: "Of our partners and volunteers" },
            { number: "4.9/5", label: "Average Rating", description: "From community feedback" },
            { number: "500+", label: "Success Stories", description: "Documented impact cases" },
            { number: "50+", label: "Countries", description: "Where we've made a difference" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {stat.label}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Share Your Story</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Have you been impacted by our work? We'd love to hear from you and share your story 
            to inspire others to join our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors">
              Submit Your Story
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-colors">
              View All Stories
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection

