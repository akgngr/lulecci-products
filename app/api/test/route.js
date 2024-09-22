import client from '@/utils/shopify';
export const dynamic = 'force-static';

export async function GET(req) {
  try {
    const response = await client.get('products',  {
      headers: {
        'Accept-Language': 'de', // Dili burada da belirtebilirsiniz
      },
    });
    if (response.ok) {
        const body = await response.json();
        return Response.json(body);
    }
    else {
      return Response.json({ error: response.statusText }, { status: response.status });
    }
  } catch (error) {
    console.error('Connection Error:', error);
    return Response.json({ error: 'Connection Error' }, { status: 500 });
  }
}