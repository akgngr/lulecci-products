import { createAdminRestApiClient } from "@shopify/admin-api-client"
import { createAdminApiClient } from "@shopify/admin-api-client"

export const client = createAdminRestApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  accessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
})

export const apiClient = createAdminApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  accessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
})
