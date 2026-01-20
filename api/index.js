const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  let allMovies = [];

  // 1. AMBIL 10 DATA SECARA ACAK DARI 95.501 FILE (Optimasi Kecepatan 1 Detik)
  const totalFiles = 95501;
  const getRandomIndices = (count, max) => {
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max) + 1);
    }
    return [...indices];
  };

  const randomIds = getRandomIndices(10, totalFiles);

  randomIds.forEach(id => {
    try {
      const dataPath = path.join(process.cwd(), 'data', `data-${id}.json`);
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        allMovies = allMovies.concat(data);
      }
    } catch (err) {
      console.error(`Error reading data-${id}.json`, err);
    }
  });

  // 2. ACAK & AMBIL 10 FILM UNTUK GRID
  const tenMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 10);

  // Bank Data Critical Note
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
      <title>gusku.site</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": ${JSON.stringify(tenMovies.map((movie, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Movie",
            "name": movie.title,
            "director": { "@type": "Person", "name": movie.director },
            "datePublished": movie.release_date,
            "image": movie.poster,
            "description": movie.overview ? movie.overview.substring(0, 150) : ""
          }
        })))}
      }
      </script>

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

        /* Nav & Pagination */
        nav { border-bottom: 1px solid #333; margin-bottom: 20px; }
        .pagination { display: flex; justify-content: center; gap: 10px; margin: 40px 0; }
        footer { border-top: 1px solid #333; padding: 20px 0; font-size: 0.8rem; text-align: center; opacity: 0.7; margin-top: 40px; }
        footer a { margin: 0 10px; color: #fff; cursor: pointer; }

        /* Modal Style */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; }
        .modal-box { background: #1a1e23; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; position: relative; border: 1px solid #333; }
        .close-btn { position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer; color: #fff; }
      </style>
    </head>
    <body class="container">
      
      <nav>
        <ul>
          <li><strong>gusku.site</strong></li>
        </ul>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nav>

      <main>
        <div class="pinterest-grid">
          ${tenMovies.map((movie, index) => {
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

        <div class="pagination">
          <button class="outline" onclick="location.reload()">1</button>
          <button class="outline" onclick="location.reload()">2</button>
          <button class="outline" onclick="location.reload()">3</button>
          <button onclick="location.reload()">Next →</button>
        </div>
      </main>

      <footer>
        <p><a href="/" style="text-decoration:none; color:inherit; margin:0;">&copy; 2026 gusku.site</a></p>
        <a onclick="showModal('About', 'gusku.site is a high-speed discovery portal providing in-depth data and technical insights for global cinema titles.')">About</a> | 
        <a onclick="showModal('Disclaimer', 'All data provided here is for informational purposes only. We do not host any video files on our servers.')">Disclaimer</a> | 
        <a onclick="showModal('Privacy Policy', 'We value your privacy. No personal data is collected or stored during your browsing session on this portal.')">Privacy Policy</a> | 
        <a onclick="showModal('Contact', 'For inquiries regarding technical data or production IDs, please contact our support at santrisetia@yahoo.com')">Contact</a>
      </footer>

      <div id="modalOverlay" class="modal-overlay" onclick="closeModal()">
        <div class="modal-box" onclick="event.stopPropagation()">
          <span class="close-btn" onclick="closeModal()">&times;</span>
          <h3 id="modalTitle"></h3>
          <p id="modalBody"></p>
        </div>
      </div>

      <script>
        function triggerAdAndShow(index) {
          window.open("https://www.effectivegatecpm.com/xjsgcgii37?key=606d2c74ae50bd149743d90c3719a164", "_blank");
          window.open("https://otieu.com/4/8764643", "_blank");
          
          const content = document.getElementById('content-' + index);
          content.style.display = 'block';
          window.focus();
        }

        function showModal(title, text) {
          document.getElementById('modalTitle').innerText = title;
          document.getElementById('modalBody').innerText = text;
          document.getElementById('modalOverlay').style.display = 'flex';
        }

        function closeModal() {
          document.getElementById('modalOverlay').style.display = 'none';
        }
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};