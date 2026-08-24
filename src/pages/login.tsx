'use client'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ArrowLeft
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

import { CHURCH } from '@/lib/data'
import { api } from '@/lib/api'

type Step = 'credentials' | 'pin'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [, setLoginMethod] = useState('email')
  const [error, setError] = useState('')
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)
  const [step, setStep] = useState<Step>('credentials')
  const [pinMode, setPinMode] = useState<'verify' | 'setup'>('verify')

  useEffect(() => {
    if (lockoutSeconds <= 0) return
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          setError('')
          setAttemptsRemaining(null)
          return 0
        }
        setError(`Account locked. Try again in ${next} seconds.`)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [lockoutSeconds])

  const getErrorMessage = (err: any) => {
    const body = err?.body || {}
    if (typeof body === 'string') return body
    if (body.detail) return body.detail
    if (body.email && Array.isArray(body.email) && body.email[0]) return body.email[0]
    if (body.non_field_errors && Array.isArray(body.non_field_errors) && body.non_field_errors[0]) return body.non_field_errors[0]
    return err?.message || 'Login failed'
  }

  const extractAttemptsRemaining = (body: any, msg: string) => {
    if (typeof body.attempts_remaining === 'number') {
      setAttemptsRemaining(body.attempts_remaining)
      return
    }
    const match = msg.match(/(\d+)\s+attempts?\s+remaining/i)
    if (match) {
      const num = parseInt(match[1], 10)
      setAttemptsRemaining(num)
    } else {
      setAttemptsRemaining(null)
    }
  }

  const isLocked = lockoutSeconds > 0

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLocked) return
    setLoginSuccess(false)
    setError('')
    setAttemptsRemaining(null)
    setIsLoading(true)

    try {
      const payload: any = { email }
      if (password) payload.password = password

      const data = await api.login(payload)

      if (data.pin_setup_required) {
        setPinMode('setup')
      } else {
        setPinMode('verify')
      }

      setStep('pin')
      setIsLoading(false)
      toast.success('Password verified. Enter your PIN to continue.')
    } catch (err: any) {
      const body = err?.body || {}
      if (body.lockout_remaining) {
        setLockoutSeconds(body.lockout_remaining)
        setError(`Account locked. Try again in ${body.lockout_remaining} seconds.`)
        setAttemptsRemaining(0)
      } else {
        const msg = getErrorMessage(err)
        setError(msg)
        extractAttemptsRemaining(body, msg)
        toast.error(msg)
      }
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLocked) return
    setError('')
    setAttemptsRemaining(null)
    setIsLoading(true)

    try {
      if (pinMode === 'setup') {
        await api.setPin(pin)
        toast.success('PIN set successfully!')
      } else {
        const payload: any = { email, pin }
        await api.login(payload)
        toast.success('PIN verified!')
      }

      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify({
        name: email,
        role: 'User',
      }))
      setLoginSuccess(true)
      setTimeout(() => {
        navigate('/app/dashboard')
      }, 1200)
    } catch (err: any) {
      const body = err?.body || {}
      if (body.lockout_remaining) {
        setLockoutSeconds(body.lockout_remaining)
        setError(`Account locked. Try again in ${body.lockout_remaining} seconds.`)
        setAttemptsRemaining(0)
      } else {
        const msg = getErrorMessage(err)
        setError(msg)
        extractAttemptsRemaining(body, msg)
        toast.error(msg)
      }
      setIsLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setStep('credentials')
    setError('')
    setPin('')
    setAttemptsRemaining(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
        
        {/* Left Side - Image */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1787215259/Jan-Business_team_3-removebg-preview_marhol.png" 
            alt="Team illustration" 
            className="w-full max-w-lg h-auto object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png" 
              alt="Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to continue to your dashboard</p>
            </div>

            {loginSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Login Successful!</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            ) : step === 'credentials' ? (
              <>
                <Tabs 
                  defaultValue="email" 
                  className="w-full"
                  onValueChange={(value) => setLoginMethod(value)}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger 
                      value="email" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pin" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      PIN
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
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
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl transition-all"
                            disabled={isLoading || isLocked}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password
                          </Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl transition-all"
                            disabled={isLoading || isLocked}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isLoading || isLocked}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
                        <p className="text-xs text-amber-600 text-center">
                          {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before temporary lockout
                        </p>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        disabled={isLoading || isLocked}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Continue
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="pin">
                    <form onSubmit={handlePinSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="pin-direct" className="text-gray-700 font-medium">
                          Enter 4-Digit PIN
                        </Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="pin-direct"
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              setPin(value.slice(0, 4))
                            }}
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl transition-all text-center text-2xl tracking-widest"
                            disabled={isLoading || isLocked}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Enter your 4-digit security PIN</p>
                      </div>

                      {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
                        <p className="text-xs text-amber-600 text-center">
                          {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before temporary lockout
                        </p>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        disabled={isLoading || isLocked}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Verify PIN
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Contact Admin
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pinMode === 'setup' ? 'Set Your PIN' : 'Enter Your PIN'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {pinMode === 'setup' 
                      ? 'Create a 4-digit PIN to secure your account' 
                      : 'Enter your 4-digit PIN to complete login'}
                  </p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="pin-step" className="text-gray-700 font-medium">
                      {pinMode === 'setup' ? 'Create PIN' : 'Enter PIN'}
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="pin-step"
                        type="password"
                        placeholder="••••"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          setPin(value.slice(0, 4))
                        }}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl transition-all text-center text-2xl tracking-widest"
                        disabled={isLoading || isLocked}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {pinMode === 'setup' 
                        ? 'Choose a 4-digit PIN you will use for future logins' 
                        : 'Enter the PIN associated with your account'}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
                    <p className="text-xs text-amber-600 text-center">
                      {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before temporary lockout
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    disabled={isLoading || isLocked}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {pinMode === 'setup' ? 'Setting PIN...' : 'Verifying...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {pinMode === 'setup' ? 'Set PIN' : 'Verify PIN'}
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full gap-2 text-gray-600 hover:text-gray-800"
                    onClick={handleBackToCredentials}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to credentials
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
