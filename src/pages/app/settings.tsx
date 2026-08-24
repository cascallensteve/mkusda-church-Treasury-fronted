'use client'

import { useState } from 'react'
import { Settings, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH } from '@/lib/data'

export default function SettingsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    churchName: CHURCH.name,
    location: CHURCH.location,
    system: CHURCH.system,
    currency: 'KES',
    fiscalYear: '2026',
    email: 'info@mkusda.org',
    phone: '+254 700 000 000',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsFormOpen(false)
    }, 800)
  }

  const handleReset = () => {
    setFormData({
      churchName: CHURCH.name,
      location: CHURCH.location,
      system: CHURCH.system,
      currency: 'KES',
      fiscalYear: '2026',
      email: 'info@mkusda.org',
      phone: '+254 700 000 000',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Settings"
          description={`System configuration and preferences for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Settings className="w-4 h-4" />
              Edit Settings
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Currency" value={formData.currency} icon={Settings} accent="primary" />
          <StatCard label="Fiscal Year" value={formData.fiscalYear} icon={Settings} accent="emerald" />
          <StatCard label="System" value={formData.system.split(' ')[0]} icon={Settings} accent="teal" />
          <StatCard label="Status" value="Active" icon={Settings} accent="amber" />
        </div>

        {isFormOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsFormOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Edit Settings</h2>
                  <p className="text-sm text-muted-foreground">Update the system configuration below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="churchName">Church Name *</Label>
                    <Input id="churchName" name="churchName" value={formData.churchName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system">System Name *</Label>
                    <Input id="system" name="system" value={formData.system} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year *</Label>
                    <Input id="fiscalYear" name="fiscalYear" value={formData.fiscalYear} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Settings</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif">System Settings</CardTitle>
                  <CardDescription>
                    Current configuration for {CHURCH.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border divide-y">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Church Name</p>
                    <p className="text-sm text-gray-500">{formData.churchName}</p>
                  </div>
                  <Badge variant="secondary">General</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-500">{formData.location}</p>
                  </div>
                  <Badge variant="secondary">General</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-gray-500">{formData.currency} - Kenyan Shilling</p>
                  </div>
                  <Badge variant="secondary">Finance</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Fiscal Year</p>
                    <p className="text-sm text-gray-500">{formData.fiscalYear}</p>
                  </div>
                  <Badge variant="secondary">Finance</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                  </div>
                  <Badge variant="secondary">Contact</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Contact Phone</p>
                    <p className="text-sm text-gray-500">{formData.phone}</p>
                  </div>
                  <Badge variant="secondary">Contact</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="border-t bg-white mt-8">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-gray-500">{CHURCH.system} • {CHURCH.location}</p>
            <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} {CHURCH.name}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
