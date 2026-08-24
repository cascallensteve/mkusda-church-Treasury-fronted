const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const DONATION_API = import.meta.env.VITE_DONATION_API_BASE || '/api'

function getToken() {
  return localStorage.getItem('access_token')
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
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

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      const retryHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      }
      retryHeaders['Authorization'] = `Bearer ${getToken()}`
      const retryRes = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: retryHeaders,
      })
      return parseResponse(retryRes)
    }
    clearTokens()
    window.location.href = '/login'
    return Promise.reject(new Error('Session expired'))
  }

  return parseResponse(res)
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    })
    if (!res.ok) return false
    const data = await res.json()
    setTokens(data.access, data.refresh)
    return true
  } catch {
    return false
  }
}

async function parseResponse(res: Response): Promise<any> {
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

async function donationRequest(url: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${DONATION_API}${url}`, {
    ...options,
    headers,
  })

  return parseResponse(res)
}

export const api = {
  login: (payload: { email: string; password?: string; pin?: string }) =>
    request('/login/', { method: 'POST', body: JSON.stringify(payload) }),

  verifyPin: (email: string, pin: string) =>
    request('/verify-pin/', { method: 'POST', body: JSON.stringify({ email, pin }) }),

  logout: (refresh: string) =>
    request('/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }),

  getProfile: () => request('/account/me/'),

  setPin: (pin: string) =>
    request('/account/set-pin/', { method: 'POST', body: JSON.stringify({ pin }) }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request('/account/change-password/', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),

  forgotPassword: (email: string) =>
    request('/forgot-password/', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    request('/reset-password/', { method: 'POST', body: JSON.stringify({ token, new_password: newPassword }) }),

  getFullProfile: () => request('/account/profile/'),

  updateProfile: (data: any) =>
    request('/account/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getDonationTypes: () => donationRequest('/donation/donation-types/'),

  createDonationType: (data: { name: string; description?: string }) =>
    donationRequest('/donation/donation-types/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDonationType: (id: number) => donationRequest(`/donation/donation-types/${id}/`),

  updateDonationType: (id: number, data: { name?: string; description?: string }) =>
    donationRequest(`/donation/donation-types/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteDonationType: (id: number) =>
    donationRequest(`/donation/donation-types/${id}/`, { method: 'DELETE' }),
}

export { clearTokens, getToken, setTokens }
