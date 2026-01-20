const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { slug } = req.query;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'));
  const movie = data.find(m => m.slug === slug);

  if (!movie) {
    return res.status(404).send('Movie Not Found');
  }

  // Template HTML - Anti Hancur & Ringan
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${movie.title_seo}</title>
      <meta name="description" content="${movie.overview_seo}">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    </head>
    <body class="container">
      <main>
        <h1>${movie.title}</h1>
        <article>
          <div class="grid">
            <div><img src="${movie.poster}" alt="${movie.title}" style="border-radius:8px"></div>
            <div>
              <p><strong>Release:</strong> ${movie.release_date}</p>
              <p><strong>Runtime:</strong> ${movie.runtime} min</p>
              <p>${movie.overview_seo}</p>
              <a href="URL_SMARTLINK_ANDA" role="button" class="contrast" style="width:100%">WATCH / DOWNLOAD FULL MOVIE</a>
            </div>
          </div>
        </article>
      </main>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
