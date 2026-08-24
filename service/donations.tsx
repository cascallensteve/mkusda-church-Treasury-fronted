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
  return request('/donation/public/donation-types/')
}

export async function submitDonation(payload: Record<string, any>): Promise<any> {
  return request('/donation/public/submit/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
