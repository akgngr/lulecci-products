const convertToCSV = (data) => {
  const escapeValue = (value) => {
    // Değer boşsa null döndür, aksi takdirde değeri işleme al
    if (
      value === null &&
      value === undefined &&
      value === "" &&
      value === " "
    ) {
      return null
    }

    if (typeof value === "string" && value.includes(",")) {
      return `"${value.replace(/"/g, '""')}"` // Eğer veride , varsa yine escape ederiz
    }
    return value
  }

  // Başlıkları virgül (",") ile ayır
  const header = Object.keys(data[0]).map(escapeValue).join(",")

  const rows = data.map((row) => {
    // Resim linklerini virgül ile ayırıyoruz
    if (row.imageUrls && Array.isArray(row.imageUrls)) {
      row.imageUrls = row.imageUrls.join("$") // Resim linklerini virgülle ayırıyoruz
    }

    return Object.values(row).map(escapeValue).join(",") // Satırları noktalı virgülle ayırıyoruz
  })

  // Başlıkları ve satırları ";" ile ayırarak birleştir
  return [header, ...rows].join("\n")
}

export default convertToCSV
