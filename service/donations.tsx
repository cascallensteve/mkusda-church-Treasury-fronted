const PUBLIC_API = import.meta.env.VITE_PUBLIC_API_BASE || '/api'

async function request(url: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  const res = await fetch(`${PUBLIC_API}${url}`, {
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

export async function getPublicDonationTypes(): Promise<any> {
  return request('/donation/public/')
}

export async function submitDonation(payload: {
  donation_type_id: number
  donor_name: string
  donor_email: string
  phone_number: string
  amount: number
}): Promise<any> {
  return request('/donation/public/donate/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function initiatePayment(payload: {
  donation_type_id: number
  phone_number: string
  amount: number
  donor_name?: string
  donor_email?: string
}): Promise<any> {
  return request('/payments/initiate/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getPaymentStatus(checkout_request_id: string): Promise<any> {
  return request(`/payments/status/?checkout_request_id=${encodeURIComponent(checkout_request_id)}`)
}
