const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { slug } = req.query;
  
  // OPTIMASI: Mengambil ID dari akhir slug (Contoh: judul-film-123 -> ID-nya 123)
  const parts = slug ? slug.split('-') : [];
  const movieId = parts[parts.length - 1];

  // Pastikan ID-nya valid angka
  if (!movieId || isNaN(movieId)) {
    return res.status(404).send("Invalid Movie Format");
  }

  const dataPath = path.join(process.cwd(), 'data', `data-${movieId}.json`);

  if (!fs.existsSync(dataPath)) {
    return res.status(404).send("Movie Not Found");
  }

  // Membaca data film yang spesifik
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  const movieData = JSON.parse(fileContent)[0];
  const rRating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${movieData.title} - gusku.site</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      <style>
        ins { color: #10ad77; text-decoration: none; font-weight: bold; }
        nav { border-bottom: 1px solid #333; margin-bottom: 20px; }
        footer { border-top: 1px solid #333; padding: 20px 0; font-size: 0.8rem; text-align: center; opacity: 0.7; margin-top: 40px; }
        .movie-detail-container {
          background: #14171a;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          margin-top: 20px;
        }
        .poster-large { 
          width: 100%; 
          max-width: 350px; 
          border-radius: 8px; 
          display: block; 
          margin: 0 auto 20px auto; 
        }
        .btn-main { background: #10ad77; border: none; color: white; padding: 10px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body class="container">
      <nav>
        <ul><li><strong>gusku.site</strong></li></ul>
        <ul><li><a href="/">Home</a></li></ul>
      </nav>
      <main>
        <div class="movie-detail-container">
          <img src="${movieData.poster}" alt="${movieData.title}" class="poster-large">
          <h1 style="text-align:center;">${movieData.title}</h1>
          <p style="text-align:center;">Director: ${movieData.director} | ★ ${rRating}</p>
          <hr>
          <p><strong>Release Date:</strong> <ins>${movieData.release_date}</ins></p>
          <p><strong>Overview:</strong><br>${movieData.overview}</p>
          <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
            <button class="btn-main" onclick="window.open('https://otieu.com/4/8764643')">WATCH NOW</button>
            <button class="outline" onclick="window.open('https://www.effectivegatecpm.com/xjsgcgii37?key=606d2c74ae50bd149743d90c3719a164')">GET DATA</button>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 gusku.site</p>
      </footer>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};