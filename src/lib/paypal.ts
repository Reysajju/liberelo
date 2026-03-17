/**
 * PayPal REST API v2 — Server-Side Helper
 *
 * Handles authentication, order creation, and payment capture
 * using PayPal's Orders REST API directly (no SDK needed server-side).
 */

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com"
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

/**
 * Generate an OAuth 2.0 access token from PayPal.
 */
export async function generateAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`PayPal Auth Error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Create a PayPal order for a campaign.
 */
export async function createOrder(
  amount: number,
  description: string,
  campaignId: string
): Promise<{ id: string; status: string }> {
  const accessToken = await generateAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: campaignId,
          description,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Liberelo",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`PayPal Create Order Error: ${response.status} - ${errorData}`)
  }

  return response.json()
}

/**
 * Capture payment for an approved PayPal order.
 */
export async function captureOrder(
  orderId: string
): Promise<{
  id: string
  status: string
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: { value: string; currency_code: string }
      }>
    }
  }>
}> {
  const accessToken = await generateAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`PayPal Capture Error: ${response.status} - ${errorData}`)
  }

  return response.json()
}

/**
 * Retrieve details about a PayPal order.
 */
export async function getOrderDetails(orderId: string) {
  const accessToken = await generateAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`PayPal Order Details Error: ${response.status} - ${errorData}`)
  }

  return response.json()
}
