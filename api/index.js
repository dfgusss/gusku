const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  let allMovies = [];

  // 1. AMBIL SEMUA DATA DARI 5 FILE
  for (let i = 1; i <= 5; i++) {
    try {
      const dataPath = path.join(process.cwd(), `data-${i}.json`);
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        allMovies = allMovies.concat(data);
      }
    } catch (err) {
      console.error(`Error reading data-${i}.json`, err);
    }
  }

  // 2. ACAK & AMBIL 10 FILM UNTUK GRID
  const tenMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 10);

  // Bank Data Critical Note (Tetap Sesuai Kode Asli)
  const notes = [
    "This production is highly rated for its directorial style and atmospheric depth.",
    "Critical analysis suggests a strong influence of neo-noir elements in the lighting and framing.",
    "Audience engagement peaked during the second act, showing high emotional resonance.",
    "A technical masterpiece in terms of runtime efficiency and narrative pacing.",
    "Most viewers from USA and Europe reported a high engagement rate with this specific title."
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Movie Explorer</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      <style>
        ins { color: #10ad77; text-decoration: none; font-weight: bold; }
        .hidden-content { display: none; }
        .comment-item { border-bottom: 1px solid #333; padding: 15px 0; }
        .insight-card { background: #1a1e23; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10ad77; }
        .bar-bg { background: #333; height: 10px; border-radius: 5px; margin: 5px 0 15px 0; }
        .bar-fill { background: #10ad77; height: 10px; border-radius: 5px; transition: width 1s ease-in-out; }
        .clickable-title { cursor: pointer; color: #10ad77; text-decoration: underline; }
        .clickable-title:hover { filter: brightness(1.2); }
        
        /* Layout Pinterest Grid */
        .pinterest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 30px;
          margin-top: 20px;
        }
        .movie-card {
          background: #14171a;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          height: fit-content;
        }
        .poster-img { 
          width: 100%; 
          max-width: 280px; 
          border-radius: 8px; 
          display: block; 
          margin: 0 auto 15px auto; 
        }
      </style>
    </head>
    <body class="container">
      <header style="text-align: center; margin-bottom: 40px;">
        <h1>MOVIE EXPLORER</h1>
      </header>

      <div class="pinterest-grid">
        ${tenMovies.map((movie, index) => {
          // Logika per film (Tetap Sesuai Kode Asli)
          const rRating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);
          const scoreActing = Math.floor(Math.random() * (95 - 80) + 80);
          const scoreStory = Math.floor(Math.random() * (90 - 75) + 75);
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          
          const commentBank = [
            { n: "Leonard T.", t: "The narrative structure in this film is quite unique. Definitely worth the deep dive." },
            { n: "Cinephile88", t: "I've been tracking this production for a while. The cinematography is peak level." },
            { n: "Rebecca St.", t: "A bit underrated for its time. Glad I found this detailed overview here." },
            { n: "Mark J.", t: "The pacing is perfect. One of the best in this genre I've seen lately." },
            { n: "Xander", t: "Was skeptical at first, but the acting scores on this site are spot on." }
          ];
          const shuffledComments = commentBank.sort(() => 0.5 - Math.random()).slice(0, 3);

          return `
          <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="poster-img">
            
            <h2 class="clickable-title" onclick="triggerAdAndShow(${index})">${movie.title}</h2>
            <p style="text-align:center; font-size: 0.9rem;">Director: ${movie.director} | ID: ${movie.movie_id} | ★ ${rRating}</p>

            <div id="content-${index}" class="hidden-content">
              <p><strong>Release Date:</strong> <ins>${movie.release_date}</ins></p>
              <p><strong>Runtime:</strong> ${movie.runtime} min</p>
              <hr>
              <p><strong>Full Overview:</strong><br>${movie.overview}</p>
              
              <div class="insight-card">
                <h4>Global Audience Insight</h4>
                <p><small>Acting Score</small></p>
                <div class="bar-bg"><div class="bar-fill" style="width: ${scoreActing}%"></div></div>
                <p><small>Storyline Impact</small></p>
                <div class="bar-bg"><div class="bar-fill" style="width: ${scoreStory}%"></div></div>
                <p><strong>Critical Note:</strong> ${randomNote}</p>
              </div>

              <section>
                <h3>Expert Reviews</h3>
                ${shuffledComments.map(c => `<div class="comment-item"><strong>${c.n}:</strong> ${c.t}</div>`).join('')}
              </section>
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <script>
        function triggerAdAndShow(index) {
          window.open("https://www.google.com", "_blank");
          window.open("https://www.example.com", "_blank");
          
          const content = document.getElementById('content-' + index);
          content.style.display = 'block';
          window.focus();
        }
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
