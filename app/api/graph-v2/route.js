import apiClient from "@/utils/shopify"
import convertToCSV from "@/utils/csv"
import removeHtml from "@/utils/removeHtml"

export async function GET(req, res) {
  let allProducts = []
  let hasNextPage = true
  let cursor = null
  const limit = 200 // Her seferinde kaç ürün çekilecek, bunu 50 olarak ayarlıyoruz

  // GraphQL Sorgusu
  const productQuery = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "status:active") {
        edges {
          node {
            id
            title
            descriptionHtml
            vendor
            productType
            handle
            status
            images(first: 5) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price
                  barcode
                  sku
                  metafields(first: 20) {
                    edges {
                      node {
                        key
                        namespace
                        value
                        type
                      }
                    }
                  }
                }
              }
            }
            translations(locale: "de") {
              key
              value
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `

  try {
    while (hasNextPage) {
      const variables = {
        first: limit,
        after: cursor || null,
      }

      // GraphQL isteğini yapıyoruz
      const { data, errors } = await apiClient.request(productQuery, {
        variables: variables,
      })

      if (errors) {
        console.error("GraphQL errors:", errors)
        return new Response(JSON.stringify({ errors }), {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        })
      }

      if (data && data.products) {
        const filteredProducts = data.products.edges.flatMap((edge) => {
          const product = edge.node

          // Almanca çevirilere sahip ürünler
          const translations = product.translations

          // Almanca başlık ve açıklamayı almak
          const titleTranslation = translations.find(
            (trans) => trans.key === "title"
          )
          const bodyHtmlTranslation = translations.find(
            (trans) => trans.key === "body_html"
          )

          // Varyantları işleme
          return product.variants.edges.map((variantEdge) => {
            const variant = variantEdge.node

            const delivery_time = variant.metafields.edges
              .map((metafieldEdge) => {
                const metafield = metafieldEdge.node

                const onethreeDays =
                  metafield.key === "delivery_time" ? metafield.value : null

                const translateonethreeDays =
                  onethreeDays === "(Delivery Time: 1-3 Days)"
                    ? "(Lieferzeit: 1-3 Tage)"
                    : onethreeDays === "(Delivery Time: 6-8 Weeks)"
                    ? "(Lieferzeit: 6-8 Wochen)"
                    : null

                return translateonethreeDays
              })
              .toString()

            return {
              sku: variant.sku,
              brand: product.vendor,
              title: titleTranslation
                ? titleTranslation.value + " " + variant.title
                : null,
              categoryPath: product.productType,
              url: `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/products/${
                product.handle
              }?variant=${variant.id
                .split("/")
                .pop()}&utm_source=idealo&utm_medium=idealo_listing&utm_campaign=idealo_campaign`,
              eans: variant.barcode,
              description: bodyHtmlTranslation
                ? removeHtml(bodyHtmlTranslation.value)
                : null,
              price: variant.price,
              paymentCosts_paypal: 0.0,
              deliveryCosts_dhl: 0.0,
              delivery_time,
              imageUrls: product.images.edges.map(
                (imageEdge) => imageEdge.node.originalSrc
              ),
            }
          })
        })

        allProducts = [...allProducts, ...filteredProducts]

        // Sonraki sayfa var mı kontrol et
        hasNextPage = data.products.pageInfo.hasNextPage

        // Sonraki sayfanın cursor'ını ayarla
        if (hasNextPage) {
          cursor = data.products.edges[data.products.edges.length - 1].cursor
        }
      } else {
        console.error("No data received from GraphQL")
        return new Response(
          JSON.stringify({ error: "No data received from GraphQL" }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 500,
          }
        )
      }
    }

    const csvData = convertToCSV(allProducts)

    // Tüm ürünler alındıktan sonra yanıt döndür
    return new Response(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="lulecci_home_products.csv"',
        // İndirme için dosya adı
      },
    })
  } catch (error) {
    console.error("GraphQL Request Error:", error)
    return new Response(JSON.stringify({ error: "GraphQL request failed" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    })
  }
}
