'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

import { CHURCH } from '@/lib/data'
import { getPublicDonationTypes, initiatePayment, getPaymentStatus } from '../../../service/donations'

type DonationTypeOption = {
  id: number
  name: string
  description: string
}

type TransactionResponse = {
  id: number
  checkout_request_id: string | null
  status: string
  amount: string
  donor_name: string
  donor_email: string
  phone_number: string
  donation_type_name: string
  created_at: string
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

export default function PublicDonationPage() {
  const [donationTypes, setDonationTypes] = useState<DonationTypeOption[]>([])
  const [form, setForm] = useState({
    donation_type_id: '',
    donor_name: '',
    donor_email: '',
    phone_number: '',
    amount: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null)
  const [error, setError] = useState('')
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [countdown, setCountdown] = useState(40)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const pollingRef = useRef<number | null>(null)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await getPublicDonationTypes()
        const types = data as DonationTypeOption[]
        setDonationTypes(types)
        if (types.length > 0 && !form.donation_type_id) {
          setForm(prev => ({ ...prev, donation_type_id: String(types[0].id) }))
        }
      } catch (err: any) {
        toast.error(err?.body?.detail || err?.message || 'Failed to load donation types')
      } finally {
        setLoadingTypes(false)
      }
    }
    fetchTypes()
  }, [])

  useEffect(() => {
    if (!transaction?.checkout_request_id) return

    const pollPaymentStatus = async () => {
      if (!transaction?.checkout_request_id) return
      setCheckingPayment(true)
      try {
        const status = await getPaymentStatus(transaction.checkout_request_id)
        setTransaction(status)
        if (status.status === 'SUCCESS') {
          toast.success('Payment completed successfully!')
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }
        } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
          toast.error(`Payment ${status.status.toLowerCase()}. Please try again.`)
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }
        }
      } catch (err: any) {
        console.error('Payment status check failed:', err)
      } finally {
        setCheckingPayment(false)
      }
    }

    pollingRef.current = setInterval(pollPaymentStatus, 3000)
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [transaction?.checkout_request_id])

  useEffect(() => {
    if (!transaction?.checkout_request_id || isTimedOut) return
    if (transaction.status !== 'PENDING') return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsTimedOut(true)
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }
          toast.error('Confirmation timeout. Please check your phone or try again.')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [transaction?.checkout_request_id, transaction?.status, isTimedOut])

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCountdown(40)
    setIsTimedOut(false)
    setError('')
    setReference(null)
    setTransaction(null)

    const amount = Number(form.amount)
    if (!form.donor_name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!form.donor_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donor_email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!form.donation_type_id) {
      setError('Please select a donation type.')
      return
    }
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (!/^254\d{9}$/.test(form.phone_number.trim())) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678).')
      return
    }

    setSubmitting(true)
    try {
      const data = await initiatePayment({
        donation_type_id: Number(form.donation_type_id),
        phone_number: form.phone_number.trim(),
        amount,
        donor_name: form.donor_name.trim(),
        donor_email: form.donor_email.trim(),
      })
      setTransaction(data.transaction)
      setReference(data.checkout_request_id)
      toast.success('Payment initiated. Please check your phone to complete.')
    } catch (err: any) {
      const msg = err?.body?.detail || err?.message || 'Payment initiation failed.'
      setError(typeof msg === 'string' ? msg : 'Payment initiation failed.')
      toast.error(typeof msg === 'string' ? msg : 'Payment initiation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Top bar */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
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
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Info panel */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium w-fit mb-6">
              <Heart className="w-4 h-4" />
              Give with purpose
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
              Support {CHURCH.name}
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Your generous giving helps us advance our mission, support our community,
              and build a stronger church. Every contribution makes a difference.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Secure and transparent
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Multiple payment options
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Instant confirmation
              </li>
            </ul>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl rounded-2xl border-0">
              <CardContent className="p-6 md:p-8">
                 {transaction && transaction.status === 'SUCCESS' ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Payment Successful!</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your donation has been received.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setTransaction(null)
                        setReference(null)
                        setForm(prev => ({ ...prev, amount: '' }))
                      }}
                    >
                      Make another donation
                    </Button>
                  </div>
                ) : transaction ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      {checkingPayment ? (
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-10 h-10 text-yellow-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Awaiting Payment</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Please complete the payment on your phone.
                    </p>
                    {isTimedOut ? (
                      <p className="mt-4 text-sm text-red-600">
                        Confirmation timeout. Please check your phone or try again.
                      </p>
                    ) : (
                      <p className="mt-4 text-sm text-gray-600">
                        Waiting for confirmation... {countdown}s
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Status: {transaction.status}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="donor_name" className="text-gray-700 font-medium">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="donor_name"
                          value={form.donor_name}
                          onChange={(e) => setField('donor_name', e.target.value)}
                          placeholder="Your name"
                          className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                          disabled={submitting}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donor_email" className="text-gray-700 font-medium">
                          Email *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="donor_email"
                            type="email"
                            value={form.donor_email}
                            onChange={(e) => setField('donor_email', e.target.value)}
                            placeholder="you@example.com"
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                            disabled={submitting}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number" className="text-gray-700 font-medium">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone_number"
                            value={form.phone_number}
                            onChange={(e) => setField('phone_number', e.target.value)}
                            placeholder="254712345678"
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                            disabled={submitting}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Donation Type</Label>
                      {loadingTypes ? (
                        <div className="text-sm text-gray-500">Loading donation types...</div>
                      ) : donationTypes.length === 0 ? (
                        <div className="text-sm text-gray-500">No donation types available.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {donationTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setField('donation_type_id', String(type.id))}
                              className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                                form.donation_type_id === String(type.id)
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              {type.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-700 font-medium">
                        Amount (KES) *
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        min={1}
                        value={form.amount}
                        onChange={(e) => setField('amount', e.target.value)}
                        placeholder="0"
                        className="h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl text-lg"
                        disabled={submitting}
                        required
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        {QUICK_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setField('amount', String(amt))}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${
                              form.amount === String(amt)
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            KES {amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Initiating Payment...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Donate via M-Pesa
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </div>

                    <p className="text-center text-xs text-gray-400">
                      Your payment is secure and encrypted.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">{CHURCH.location}</p>
          <p className="text-xs text-gray-400 mt-1">
            © {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
