'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { CHURCH } from '@/lib/data'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (email && email.includes('@')) {
        setSubmittedEmail(email)
        setSuccess(true)
        setIsLoading(false)
      } else {
        setError('Please enter a valid email address')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleResend = () => {
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1000)
  }

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

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {success ? (
            // Success State
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">Check Your Email</p>
                  <p className="text-sm text-gray-500 mt-1">
                    We've sent a password reset link to
                  </p>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    {submittedEmail}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 text-center">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-1 flex items-center justify-center gap-2 w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resend Link
                    </>
                  )}
                </button>
              </div>

              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl transition-all ${
                      error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Reset Link
                    <Send className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
