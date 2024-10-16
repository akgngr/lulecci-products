import { client, apiClient } from "@/utils/shopify"

export async function GET(req, res) {
  try {
    const response = await client.get("products", {
      searchParams: { locale: "de" },
    })

    if (response.ok) {
      const products = await response.json()

      const productsWithTranslations = await Promise.all(
        products.products
          .filter((product) => product.status === "active")
          .filter((product) =>
            product.variants.every((variant) => variant.barcode !== null)
          )
          .map(async (product) => {
            //return product
            const productQuery = `
              query ProductQuery($id: ID!) {
                product(id: $id) {
                  translations(locale: "de") {
                    key
                    value
                  }
                }
              }
            `

            const { data, errors, extensions } = await apiClient.request(
              productQuery,
              {
                variables: {
                  id: `gid://shopify/Product/${product.id}`,
                },
                headers: {
                  "X-GraphQL-Cost-Include-Fields": true,
                },
              }
            )

            /* const translationResponse = await client.get(
              `products/${product.id}/translations`,
              {
                searchParams: { locale: "de" },
              }
            )
            console.log("Translation >>> ", await translationResponse.json()) */

            if (data) {
              const translations = data

              return { ...product, translations: translations }
            } else {
              return { ...product, translations: [], errors: errors }
            }
          })
      )

      return new Response(JSON.stringify(productsWithTranslations), {
        headers: {
          "Content-Type": "application/json",
          // Uncomment the line below if you want the response to be a downloadable file
          // 'Content-Disposition': 'attachment; filename="lulecci_home_products.json"',
        },
      })
    } else {
      return Response.json(
        { error: response.statusText },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Connection Error:", error)
    return Response.json({ error: "Connection Error" }, { status: 500 })
  }
}
