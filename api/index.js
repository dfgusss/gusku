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

  // UPDATE: LOGIKA UGC DAN ADS
  const rRating = (Math.random() * (4.9 - 4.4) + 4.4).toFixed(1);
  const dummyComments = [
    { n: "Robert Miller", t: "Excellent quality and very detailed information. Exactly what I was looking for." },
    { n: "Jessica", t: "I love how the data is presented. Very clean and professional!" },
    { n: "David", t: "Finally a site that gives full director and runtime details clearly." },
    { n: "Sarah Connor", t: "The overview is very helpful, thanks for sharing the director info." },
    { n: "Mike Ross", t: "Is there any sequel for this movie? The ending was mindblowing." }
  ];

  // Template HTML
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
        #full-overview, #ugc-area { display: none; }
        .comment-item { border-bottom: 1px solid #333; padding: 15px 0; }
        .tech-info { background: #1a1e23; padding: 15px; border-radius: 5px; margin-top: 10px; font-size: 0.9rem; }
      </style>
    </head>
    <body class="container">
      <main>
        <hgroup>
          <h1>${movie.title}</h1>
          <h2>Director: ${movie.director} | ID: ${movie.movie_id} | ★ ${rRating}</h2>
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
              
              <div id="short-overview">
                <p><strong>Overview:</strong><br>${movie.overview.substring(0, 50)}...</p>
                <button onclick="triggerReadMore()" class="contrast" style="width:100%">READ MORE & SHOW REVIEWS</button>
              </div>

              <div id="full-overview">
                <p><strong>Overview:</strong><br>${movie.overview}</p>
                
                <div class="tech-info">
                  <strong>Technical Specifications:</strong>
                  <ul>
                    <li>Official Title: ${movie.title}</li>
                    <li>Production ID: ${movie.movie_id}</li>
                    <li>Format: Digital HD / 4K</li>
                    <li>Language: English</li>
                    <li>Link Reference: <a href="${movie.detail_url}" target="_blank">View on Provider</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section id="ugc-area">
          <h3>User Reviews (${dummyComments.length})</h3>
          ${dummyComments.map(c => `<div class="comment-item"><strong>${c.n}:</strong> ${c.t}</div>`).join('')}
        </section>

      </main>

      <script>
        function triggerReadMore() {
          // Menggunakan link asal untuk keamanan testing
          window.open("https://www.google.com", "_blank");
          window.open("https://www.example.com", "_blank");
          
          document.getElementById('short-overview').style.display = 'none';
          document.getElementById('full-overview').style.display = 'block';
          document.getElementById('ugc-area').style.display = 'block';
          window.focus();
        }
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
