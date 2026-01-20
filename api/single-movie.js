const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { slug } = req.query;
  const totalFiles = 95501;

  // Logika Pencarian: Karena kita pakai ID 1-95501, 
  // Untuk sementara kita ambil data acak jika slug tidak ditemukan 
  // (Nanti kita diskusikan cara mapping slug ke ID yang tepat)
  const randomId = Math.floor(Math.random() * totalFiles) + 1;
  const dataPath = path.join(process.cwd(), 'data', `data-${randomId}.json`);

  if (!fs.existsSync(dataPath)) {
    return res.status(404).send("Movie Not Found");
  }

  const movieData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))[0];
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
        .hero-poster { width: 100%; max-width: 400px; border-radius: 15px; margin: 20px auto; display: block; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .movie-info { background: #1a1e23; padding: 30px; border-radius: 12px; border: 1px solid #333; }
        .ad-space { background: #14171a; padding: 15px; text-align: center; border: 1px dashed #10ad77; margin: 20px 0; }
      </style>
    </head>
    <body class="container">
      <nav>
        <ul><li><strong><a href="/" style="text-decoration:none; color:inherit;">gusku.site</a></strong></li></ul>
        <ul><li><a href="/">← Back to Explore</a></li></ul>
      </nav>

      <main>
        <div class="ad-space">
          <small>Sponsored Link</small><br>
          <a href="https://otieu.com/4/8764643" target="_blank"><strong>[DOWNLOAD / WATCH NOW]</strong></a>
        </div>

        <div class="grid">
          <div>
            <img src="${movieData.poster}" class="hero-poster" alt="${movieData.title}">
          </div>
          <div class="movie-info">
            <h1>${movieData.title}</h1>
            <p><strong>Director:</strong> ${movieData.director}</p>
            <p><strong>Release Date:</strong> ${movieData.release_date}</p>
            <p><strong>Rating:</strong> ★ ${rRating}</p>
            <hr>
            <h3>Overview</h3>
            <p>${movieData.overview}</p>
            
            <div style="margin-top:30px;">
               <button onclick="window.open('https://www.effectivegatecpm.com/xjsgcgii37?key=606d2c74ae50bd149743d90c3719a164')">Get Movie Data ID: ${movieData.movie_id}</button>
            </div>
          </div>
        </div>
      </main>

      <footer style="margin-top:50px; text-align:center;">
        <p>&copy; 2026 gusku.site - High Quality Movie Database</p>
      </footer>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};