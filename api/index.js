const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { slug } = req.query;
  let movie = null;

  for (let i = 1; i <= 5; i++) {
    try {
      const dataPath = path.join(process.cwd(), `data-${i}.json`);
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        movie = data.find(m => m.slug === slug);
        if (movie) break;
      }
    } catch (err) {
      console.error(`Error reading data-${i}.json`, err);
    }
  }

  if (!movie) {
    return res.status(404).send(`Movie "${slug}" not found.`);
  }

  // LOGIKA BARU: DATA ACAK UNTUK "ISI TERSEMBUNYI"
  const rRating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);
  const scoreActing = Math.floor(Math.random() * (95 - 80) + 80);
  const scoreStory = Math.floor(Math.random() * (90 - 75) + 75);
  
  const dummyComments = [
    { n: "Leonard T.", t: "The narrative structure in this ${movie.director} film is quite unique. Definitely worth the deep dive." },
    { n: "Cinephile88", t: "I've been tracking this production ID ${movie.movie_id} for a while. The cinematography is peak level." },
    { n: "Rebecca St.", t: "A bit underrated for its time. Glad I found this detailed overview here." }
  ];

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
        .insight-card { background: #1a1e23; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10ad77; }
        .bar-bg { background: #333; height: 10px; border-radius: 5px; margin: 5px 0 15px 0; }
        .bar-fill { background: #10ad77; height: 10px; border-radius: 5px; }
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
              <hr>
              
              <div id="short-overview">
                <p><strong>Overview Preview:</strong><br>${movie.overview.substring(0, 80)}...</p>
                <button onclick="triggerReadMore()" class="contrast" style="width:100%">UNLOCK FULL ANALYSIS & REVIEWS</button>
              </div>

              <div id="full-overview">
                <p><strong>Full Overview:</strong><br>${movie.overview}</p>
                
                <div class="insight-card">
                  <h4>Global Audience Insight</h4>
                  <p><small>Acting Score</small></p>
                  <div class="bar-bg"><div class="bar-fill" style="width: ${scoreActing}%"></div></div>
                  
                  <p><small>Storyline Impact</small></p>
                  <div class="bar-bg"><div class="bar-fill" style="width: ${scoreStory}%"></div></div>
                  
                  <p><strong>Critical Note:</strong> This production is highly rated for its directorial style and atmospheric depth. Most viewers from USA and Europe reported a high engagement rate with this specific title.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section id="ugc-area">
          <h3>Expert Reviews</h3>
          ${dummyComments.map(c => `<div class="comment-item"><strong>${c.n}:</strong> ${c.t}</div>`).join('')}
        </section>
      </main>

      <script>
        function triggerReadMore() {
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
