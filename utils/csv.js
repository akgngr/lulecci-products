export const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(','); // Başlıkları al
  const rows = data.map(row => Object.values(row).join(',')); // Satırları al
  return [header, ...rows].join('\n'); // Başlık ve satırları birleştir
};