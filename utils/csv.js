const convertToCSV = (data) => {
  const escapeValue = (value) => {
    if (typeof value === "string" && value.includes("$")) {
      return `"${value.replace(/"/g, '""')}"` // Eğer veride $ varsa yine escape ederiz
    }
    return value
  }

  const header = Object.keys(data[0]).map(escapeValue).join("$") // Başlıkları al
  const rows = data.map((row) => Object.values(row).map(escapeValue).join("$")) // Satırları al
  return [header, ...rows].join("\n") // Başlık ve satırları birleştir
}
export default convertToCSV
