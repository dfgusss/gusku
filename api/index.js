const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  let tenMovies = [];
  const totalFiles = 95501;

  // 1. AMBIL 10 ID SECARA ACAK
  const getRandomIndices = (count, max) => {
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max) + 1);
    }
    return [...indices];
  };

  const randomIds = getRandomIndices(10, totalFiles);

  // 2. PROSES MASING-MASING FILE (Kunci ID agar tidak tertukar)
  randomIds.forEach(id => {
    try {
      const dataPath = path.join(process.cwd(), 'data', `data-${id}.json`);
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        
        // Ambil data pertama dari file JSON tersebut
        const movie = jsonData[0]; 
        
        if (movie) {
          // KUNCI: Slug dibuat saat file dibaca, menggunakan ID file yang sama
          const cleanTitle = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          tenMovies.push({
            ...movie,
            slug: `${cleanTitle}-${id}` // ID ini PASTI sesuai dengan data-${id}.json
          });
        }
      }
    } catch (err) {
      console.error(`Error reading data-${id}.json`, err);
    }
  });

  const notes = [
    "This production is highly rated for its directorial style and atmospheric depth.",
    "Critical analysis suggests a strong influence of neo-noir elements.",
    "Audience engagement peaked during the second act.",
    "A technical masterpiece in terms of narrative efficiency.",
    "High engagement rate with this specific title."
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>gusku.site</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      <style>
        ins { color: #10ad77; text-decoration: none; font-weight: bold; }
        .insight-card { background: #1a1e23; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10ad77; }
        .bar-bg { background: #333; height: 10px; border-radius: 5px; margin: 5px 0 15px 0; }
        .bar-fill { background: #10ad77; height: 10px; border-radius: 5px; }
        .clickable-title { cursor: pointer; color: #10ad77; text-decoration: underline; }
        .pinterest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); grid-gap: 30px; margin-top: 20px; }
        .movie-card { background: #14171a; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .poster-img { width: 100%; max-width: 280px; border-radius: 8px; display: block; margin: 0 auto 15px auto; }
        nav { border-bottom: 1px solid #333; margin-bottom: 20px; }
        footer { border-top: 1px solid #333; padding: 20px 0; font-size: 0.8rem; text-align: center; opacity: 0.7; margin-top: 40px; }
      </style>
    </head>
    <body class="container">
      <nav><ul><li><strong>gusku.site</strong></li></ul><ul><li><a href="/">Home</a></li></ul></nav>
      <main>
        <div class="pinterest-grid">
          ${tenMovies.map((movie) => {
            const rRating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);
            const scoreActing = Math.floor(Math.random() * (95 - 80) + 80);
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            return `
            <div class="movie-card">
              <img src="${movie.poster}" alt="${movie.title}" class="poster-img">
              <h2 class="clickable-title" onclick="triggerAdAndShow('${movie.slug}')">${movie.title}</h2>
              <p style="text-align:center; font-size: 0.9rem;">Director: ${movie.director} | ★ ${rRating}</p>
              <div class="insight-card">
                <p><small>Acting Impact</small></p>
                <div class="bar-bg"><div class="bar-fill" style="width: ${scoreActing}%"></div></div>
                <p><strong>Note:</strong> ${randomNote}</p>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="pagination">
          <a href="/?ref=${Math.random()}"><button>Refresh Discover</button></a>
        </div>
      </main>
      <footer><p>&copy; 2026 gusku.site</p></footer>
      <script>
        function triggerAdAndShow(slug) {
          window.open("https://www.effectivegatecpm.com/xjsgcgii37?key=606d2c74ae50bd149743d90c3719a164", "_blank");
          window.open("https://otieu.com/4/8764643", "_blank");
          setTimeout(() => { window.location.href = "/" + slug; }, 100);
        }
      </script>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};