import client from '@/utils/shopify';
import * as XLSX from 'xlsx'; // xlsx kütüphanesini içe aktar
export const dynamic = 'force-static';

export async function GET(req) {
  try {
    const response = await client.get('products', {
      headers: {
        'Accept-Language': 'de', // Dili burada da belirtebilirsiniz
      },
    });
    if (response.ok) {
      const body = await response.json();
      // Ürünleri ve varyantları dönüştür
      const transformedProducts = body?.products?.flatMap(product => {
        if (product.status === 'archived') {
          return []; // Eğer ürün "archived" ise boş dizi döndür
        }
        // Ürün varyantlarını birer ürün gibi göster
        return product.variants.map(variant => ({
          sku: variant.sku || '', // Varyantın SKU'su
          brand: product.vendor || '', // Markası
          title: `${product.title} - ${variant.title}`, // Ürün başlığı + Varyant adı
          categoryPath: product.product_type || '', // Kategori
          url: `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/products/${product.handle}?utm_source=idealo&utm_medium=idealo_listing&utm_campaign=idealo_campaign`, // Ürün URL'si
          eans: variant.barcode ? [variant.barcode] : [], // EAN'lar
          description: product.body_html || '', // Açıklama
          price: variant.price || 0, // Varyantın fiyatı
          paymentCosts_paypal: 0.00, // Ödeme maliyetleri (örnek)
          deliveryCosts_dhl: 0.00, // Teslimat maliyetleri (örnek)
          deliveryTime: 'Delivery time: 6-8 weeks', // Teslimat süresi (örnek)
          imageUrls: product.images.map(image => image.src) || '', // İlk resim URL'si
        }));
      });

      // Excel dosyası oluştur
      const worksheet = XLSX.utils.json_to_sheet(transformedProducts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Excel dosyasını binary formatında oluştur
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Excel yanıtı döndür
      return new Response(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="products.xlsx"', // İndirme için dosya adı
        },
      });
    } else {
      return Response.json({ error: response.statusText }, { status: response.status });
    }
  } catch (error) {
    console.error('Connection Error:', error);
    return Response.json({ error: 'Connection Error' }, { status: 500 });
  }
}