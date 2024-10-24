import { createAdminApiClient } from "@shopify/admin-api-client"

const apiClient = createAdminApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  accessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
})
export default apiClient
