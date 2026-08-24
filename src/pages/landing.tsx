import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

import { Button } from '@/components/ui/button'

import { CHURCH } from '@/lib/data'


export default function LandingPage() {
  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-800">{CHURCH.name}</h1>
              <p className="text-xs text-gray-500">{CHURCH.system}</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section with Background Image */}
      <section className="relative flex-1 overflow-hidden">
        {/* Background Image with reduced opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('https://res.cloudinary.com/djksfayfu/image/upload/v1787213840/b8f81a5a-89d2-4dd8-8854-993a0959ff94_atncb3.webp')" }}
        />
        
        {/* Lighter overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-white/80 to-purple-50/90" />
        
        {/* Decorative gradient elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Faithful Stewardship Through Transparency
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-800"
            >
              Managing <span className="text-indigo-600">{CHURCH.name}</span> finances with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">clarity</span> and{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">trust</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              A modern treasury management system built for transparent financial stewardship — track tithes, offerings, budgets, and reports in one secure place.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Access Treasury System <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                  <Heart className="w-4 h-4" />
                  Make a Donation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
              <div>
                <p className="font-bold text-sm text-gray-800">{CHURCH.name}</p>
                <p className="text-xs text-gray-500">{CHURCH.system}</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">{CHURCH.location}</p>
              <p className="text-xs text-gray-400 mt-1">© 2026 {CHURCH.name}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}