import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Landmark,
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
import { submitDonation } from '@/lib/api'

const DONATION_TYPES = [
  { value: 'tithe', label: 'Tithe' },
  { value: 'offering', label: 'Offering' },
  { value: 'building_fund', label: 'Building Fund' },
  { value: 'mission', label: 'Mission / Outreach' },
  { value: 'other', label: 'Other' },
]

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

const PAYMENT_METHODS = [
  { value: 'mpesa', label: 'M-Pesa', icon: Smartphone },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'bank', label: 'Bank Transfer', icon: Landmark },
]

export default function PublicDonationPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    donation_type: 'tithe',
    amount: '',
    payment_method: 'mpesa',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const [error, setError] = useState('')

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setReference(null)

    const amount = Number(form.amount)
    if (!form.full_name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.')
      return
    }

    setSubmitting(true)
    try {
      const data = await submitDonation({
        full_name: form.full_name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        donation_type: form.donation_type,
        amount,
        payment_method: form.payment_method,
        message: form.message.trim() || undefined,
      })
      const ref =
        data.reference ||
        data.receipt ||
        data.checkout_request_id ||
        data.transaction_id ||
        'N/A'
      setReference(String(ref))
      toast.success('Donation submitted successfully')
    } catch (err: any) {
      const msg = err?.body?.detail || err?.message || 'Donation failed. Please try again.'
      setError(typeof msg === 'string' ? msg : 'Donation failed. Please try again.')
      toast.error(typeof msg === 'string' ? msg : 'Donation failed. Please try again.')
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
                {reference ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Thank you!</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your donation has been received.
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      Reference:{' '}
                      <span className="font-mono font-medium text-gray-800">{reference}</span>
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setReference(null)
                        setForm((prev) => ({ ...prev, amount: '', message: '' }))
                      }}
                    >
                      Make another donation
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="full_name"
                          value={form.full_name}
                          onChange={(e) => setField('full_name', e.target.value)}
                          placeholder="Your name"
                          className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                          disabled={submitting}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setField('email', e.target.value)}
                            placeholder="you@example.com"
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => setField('phone', e.target.value)}
                            placeholder="07xxxxxxxx"
                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Donation Type</Label>
                      <div className="flex flex-wrap gap-2">
                        {DONATION_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setField('donation_type', type.value)}
                            className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                              form.donation_type === type.value
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-700 font-medium">
                        Amount (KES)
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

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Payment Method</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon
                          return (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => setField('payment_method', method.value)}
                              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 transition-all ${
                                form.payment_method === method.value
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-xs font-medium">{method.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Message (optional)
                      </Label>
                      <textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setField('message', e.target.value)}
                        placeholder="Add a note..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Donate KES {form.amount ? Number(form.amount).toLocaleString() : '0'}
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>

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
