
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CHURCH } from '@/lib/data'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <FileQuestion className="w-16 h-16 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full p-2">
            <Search className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Quick Links</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/app/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/app/tithes" className="text-sm text-blue-600 hover:text-blue-800">
              Tithes
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/app/offerings" className="text-sm text-blue-600 hover:text-blue-800">
              Offerings
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/app/members" className="text-sm text-blue-600 hover:text-blue-800">
              Members
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
        </p>
      </div>
    </div>
  )
}