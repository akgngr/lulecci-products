import {createAdminRestApiClient} from '@shopify/admin-api-client';

const client = createAdminRestApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  accessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
  headers: {
    'Accept-Language': 'de', 
  },
});

export default client;