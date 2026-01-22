module.exports = async (req, res) => {
  const { p } = req.query; 
  const listUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/list_games.json';
  const baseUrl = 'https://gusku.site';

  try {
    const response = await fetch(listUrl);
    const allGames = await response.json();

    let start, end;
    if (p === '1') { start = 0; end = 25000; }
    else if (p === '2') { start = 25000; end = 50000; }
    else { start = 50000; end = allGames.length; }

    const selected = allGames.slice(start, end);

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Tambah homepage hanya di part 1
    if (p === '1') xml += `<url><loc>${baseUrl}/</loc><priority>1.0</priority></url>`;

    selected.forEach(g => {
      if (g.slug) xml += `<url><loc>${baseUrl}/${g.slug}</loc></url>`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.send(xml);
  } catch (e) {
    res.status(500).send("Error");
  }
};