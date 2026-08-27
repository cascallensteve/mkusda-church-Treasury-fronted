const API_BASE = 'https://churchppmkusdabackend.vercel.app/api'

function getToken() {
  return localStorage.getItem('access_token')
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}${path}`
}

async function request(url: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(joinUrl(API_BASE, url), {
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type')
  const body = contentType && contentType.includes('application/json')
    ? await res.json()
    : {}

  if (!res.ok) {
    const error = new Error(body.detail || body.message || 'Request failed')
    ;(error as any).status = res.status
    ;(error as any).body = body
    throw error
  }

  return body
}

export type Adjustment = {
  id: number
  donation_type: number
  amount: string
  reason: string
  created_by: number
  created_by_name: string
  created_by_email: string
  created_by_profile_picture: string
  initial_balance: string
  new_balance: string
  created_at: string
}

export type Expense = {
  id: number
  donation_type: number
  amount: string
  description: string
  created_by: number
  created_by_name: string
  created_by_email: string
  created_by_profile_picture: string
  initial_balance: string
  remaining_balance: string
  created_at: string
}

export type Allocation = {
  id: number
  donation_type: number
  amount: string
  allocated_by: number
  allocated_by_name: string
  allocated_by_email: string
  allocated_by_profile_picture: string
  recipient_name: string
  recipient_email: string
  purpose: string
  remaining_balance: string
  created_at: string
}

export const fundsManagementApi = {
  addFunds: (data: { donation_type: number; amount: number; reason: string }) =>
    request('/payments/adjust/', { method: 'POST', body: JSON.stringify(data) }),

  getAdjustments: () => request('/payments/adjustments/'),

  updateAdjustment: (id: number, data: { donation_type: number; amount: number; reason: string }) =>
    request(`/payments/adjustments/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteAdjustment: (id: number) =>
    request(`/payments/adjustments/${id}/`, { method: 'DELETE' }),

  recordExpense: (data: { donation_type: number; amount: number; description: string }) =>
    request('/payments/spend/', { method: 'POST', body: JSON.stringify(data) }),

  getExpenses: () => request('/payments/expenses/'),

  updateExpense: (id: number, data: { donation_type: number; amount: number; description: string }) =>
    request(`/payments/expenses/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteExpense: (id: number) =>
    request(`/payments/expenses/${id}/`, { method: 'DELETE' }),

  allocateFunds: (data: { donation_type: number; amount: number; recipient_name: string; recipient_email?: string; purpose: string }) =>
    request('/payments/allocate/', { method: 'POST', body: JSON.stringify(data) }),

  getAllocations: () => request('/payments/allocations/'),

  updateAllocation: (id: number, data: { donation_type: number; amount: number; recipient_name: string; recipient_email?: string; purpose: string }) =>
    request(`/payments/allocations/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteAllocation: (id: number) =>
    request(`/payments/allocations/${id}/`, { method: 'DELETE' }),
}
