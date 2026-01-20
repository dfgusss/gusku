const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { slug } = req.query;
  let movie = null;

  // Mencari di 5 file (data-1.json sampai data-5.json)
  for (let i = 1; i <= 5; i++) {
    try {
      const dataPath = path.join(process.cwd(), `data-${i}.json`);
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        movie = data.find(m => m.slug === slug);
        if (movie) break; // Jika ketemu, berhenti mencari
      }
    } catch (err) {
      console.error(`Error reading data-${i}.json`, err);
    }
  }

  if (!movie) {
    return res.status(404).send(`Movie dengan slug "${slug}" tidak ditemukan di 5 file database.`);
  }

  // Template HTML - Spill SEMUA KOLOM untuk Testing
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${movie.title_seo}</title>
      <meta name="description" content="${movie.overview_seo}">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      <style>
        ins { color: #10ad77; text-decoration: none; font-weight: bold; }
        .debug-box { background: #1a1e23; padding: 20px; border-radius: 8px; font-size: 0.8rem; }
      </style>
    </head>
    <body class="container">
      <main>
        <hgroup>
          <h1>${movie.title}</h1>
          <h2>Director: ${movie.director} | ID: ${movie.movie_id}</h2>
        </hgroup>
        
        <article>
          <div class="grid">
            <div>
              <img src="${movie.poster}" alt="${movie.title}" style="border-radius:8px; width: 100%;">
            </div>
            <div>
              <p><strong>Release Date:</strong> <ins>${movie.release_date}</ins></p>
              <p><strong>Runtime:</strong> ${movie.runtime} min</p>
              <p><strong>Page Reference:</strong> ${movie.page}</p>
              <p><strong>SEO Title:</strong> <br><small>${movie.title_seo}</small></p>
              <hr>
              <p><strong>Overview:</strong><br>${movie.overview}</p>
              <a href="#" role="button" class="contrast" style="width:100%">WATCH / DOWNLOAD FULL MOVIE</a>
            </div>
          </div>
        </article>

        <section class="debug-box">
          <h3>Full Data Spill (Debug Mode)</h3>
          <pre><code>${JSON.stringify(movie, null, 2)}</code></pre>
        </section>
      </main>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
