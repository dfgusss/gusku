module.exports = async (req, res) => {
  // URL Master List kamu di GitHub
  const listUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/list_games.json';
  const baseUrl = 'https://gusku.site';

  try {
    // 1. Ambil seluruh daftar slug (71k+) dalam 1 kali request
    const response = await fetch(listUrl);
    if (!response.ok) throw new Error('Gagal mengambil master list dari GitHub');
    
    const allGames = await response.json();

    // 2. LOGIKA RANDOM (Strategi Crawl Budget)
    // Mengacak seluruh daftar dan mengambil 1000 item pertama
    const targetCount = 1000;
    const shuffled = allGames.sort(() => 0.5 - Math.random());
    const selectedGames = shuffled.slice(0, targetCount);

    // 3. Bangun struktur XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Selalu masukkan halaman utama sebagai prioritas tertinggi
    xml += `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>\n`;

    // Masukkan 1000 link acak ke dalam sitemap
    selectedGames.forEach(game => {
      // Pastikan slug ada agar tidak membuat link rusak
      if (game.slug) {
        xml += `  <url>
    <loc>${baseUrl}/${game.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      }
    });

    xml += `</urlset>`;

    // 4. Kirim sebagai XML
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=0, stale-while-revalidate=0'); // Agar benar-benar random tiap hit
    res.status(200).send(xml);

  } catch (err) {
    console.error("Sitemap Error:", err);
    res.status(500).send("Error generating dynamic sitemap");
  }
};