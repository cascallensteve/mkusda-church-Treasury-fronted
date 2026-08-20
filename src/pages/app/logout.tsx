'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, CheckCircle2 } from 'lucide-react'

import { CHURCH } from '@/lib/data'

export default function LogoutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      navigate('/login', { replace: true })
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-10 text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-20" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <LogOut className="w-10 h-10 text-indigo-600 animate-bounce" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Signing Out</h2>
          <p className="text-gray-500 mb-6">
            Thank you for using {CHURCH.name} Treasury System.<br />
            You will be redirected to the login page shortly.
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-[load_2s_ease-in-out_forwards]"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Session ending...</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
