'use client'

import { Link } from 'react-router-dom'
import { Home, ArrowLeft, FileQuestion, Compass, BookOpen, HandCoins, Gift, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { CHURCH } from '@/lib/data'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-10">
            {/* 404 Visual */}
            <div className="relative mb-8">
              <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                <FileQuestion className="w-16 h-16 text-indigo-600" />
                <div className="absolute -top-1 -right-1 bg-amber-100 rounded-full p-2 shadow-sm">
                  <Compass className="w-5 h-5 text-amber-600" />
                </div>
                <div className="absolute -bottom-1 -left-1 bg-emerald-100 rounded-full p-2 shadow-sm">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                404
              </h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                Sorry, the page you're looking for doesn't exist or has been moved to another location.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link to="/app/dashboard">
                <Button className="w-full sm:w-auto gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-4 text-center">Quick Links</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/app/dashboard">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Home className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Dashboard</span>
                  </div>
                </Link>
                <Link to="/app/tithes">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <HandCoins className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Tithes</span>
                  </div>
                </Link>
                <Link to="/app/offerings">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Gift className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Offerings</span>
                  </div>
                </Link>
                <Link to="/app/members">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Members</span>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
        </p>
      </div>
    </div>
  )
}