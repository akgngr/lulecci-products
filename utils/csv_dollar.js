const convertToCSVDollar = (data) => {
  const escapeValue = (value) => {
    // Değer boşsa null döndür, aksi takdirde değeri işleme al
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === " "
    ) {
      return null
    }

    if (typeof value === "string" && value.includes("$")) {
      return `"${value.replace(/"/g, '""')}"` // Eğer veride $ varsa yine escape ederiz
    }
    return value
  }

  // Başlıkları dolar işareti ("$") ile ayır
  const header = Object.keys(data[0]).map(escapeValue).join("$")

  const rows = data.map((row) => {
    // Resim linklerini dolar işareti ile ayırıyoruz
    if (row.imageUrls && Array.isArray(row.imageUrls)) {
      row.imageUrls = row.imageUrls.join(",") // Resim linklerini virgül ile ayırıyoruz
    }

    return Object.values(row).map(escapeValue).join("$") // Satırları dolar işareti ile ayırıyoruz
  })

  // Başlıkları ve satırları "\n" ile ayırarak birleştir
  return [header, ...rows].join("\n")
}

export default convertToCSVDollar
