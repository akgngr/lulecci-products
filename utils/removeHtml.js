function removeHtml(str) {
  // 1. Tüm <table>...</table> yapılarını kaldırmak
  str = str.replace(/<table[\s\S]*?<\/table>/gi, "") // <table> ve </table> arasındaki her şeyi siler

  // 2. Genel olarak tüm HTML etiketlerini kaldırmak
  str = str.replace(/<\/?[^>]+(>|$)/g, "") // Genel HTML taglarını kaldırır

  return str
}

export default removeHtml
