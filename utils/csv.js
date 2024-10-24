const convertToCSV = (data) => {
  const escapeValue = (value) => {
    
    if (typeof value === 'string') {
    value = value.trim();
    }
    
    if (value === null || value === undefined || value === "" || value === " ") {
      return null;
    }

    if (typeof value === "string" && value.includes(",")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Önce tüm olası resim sütunlarını belirle
  const allPictureKeys = new Set();
  data.forEach(row => {
    Object.keys(row)
      .filter(key => key.startsWith("picture_"))
      .forEach(key => allPictureKeys.add(key));
  });

  const processRow = (row) => {
    const newRow = { ...row };
    
    // Her resim sütunu için değeri kopyala
    Array.from(allPictureKeys).forEach(pictureKey => {
      newRow[pictureKey] = row[pictureKey] || null;
    });

    return newRow;
  };

  // Tüm satırları işle
  const processedData = data.map(processRow);
  
  // Başlıkları oluştur
  const header = Object.keys(processedData[0]).map(escapeValue).join(",");
  
  // Satırları oluştur
  const rows = processedData.map(row => {
    return Object.values(row).map(escapeValue).join(",");
  });

  return [header, ...rows].join("\n");
};

export default convertToCSV;