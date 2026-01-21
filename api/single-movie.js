

module.exports = async (req, res) => {
  const { slug } = req.query;
  const rawBaseUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/data/';
  
  // OPTIMASI: Mengambil ID dari akhir slug
  const parts = slug ? slug.split('-') : [];
  const movieId = parts[parts.length - 1];

  // Pastikan ID-nya valid angka
  if (!movieId || isNaN(movieId)) {
    return res.status(404).send("Invalid Movie Format");
  }

  let movieData;
  try {
    const response = await fetch(`${rawBaseUrl}data-${movieId}.json`);
    if (!response.ok) {
      return res.status(404).send("Movie Not Found on Database");
    }
    const jsonData = await response.json();
    movieData = jsonData[0];
  } catch (error) {
    return res.status(500).send("Database Connection Error");
  }

  // --- LOGIKA STICKY UGC (Data Tetap Per File) ---
  const seed = parseInt(movieId);
  const seededRandom = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const rRating = (seededRandom(seed) * (4.9 - 4.2) + 4.2).toFixed(1);
  const scoreActing = Math.floor(seededRandom(seed + 1) * (95 - 80) + 80);
  
  const notes = [
    "This production is highly rated for its directorial style and atmospheric depth.",
    "Critical analysis suggests a strong influence of neo-noir elements.",
    "Audience engagement peaked during the second act.",
    "A technical masterpiece in terms of narrative efficiency.",
    "High engagement rate with this specific title from global viewers."
  ];
  const randomNote = notes[Math.floor(seededRandom(seed + 3) * notes.length)];

  const commentBank = [
    { n: "Leonard T.", t: "The narrative structure in this film is quite unique." },
    { n: "Cinephile88", t: "The cinematography is peak level for this genre." },
    { n: "Rebecca St.", t: "Glad I found this detailed overview here." },
    { n: "Mark J.", t: "The pacing is perfect. One of the best I've seen." },
    { n: "Xander", t: "The acting scores on this site are spot on." }
  ];
  const cIdx1 = Math.floor(seededRandom(seed + 4) * 5);
  const fixedComments = [commentBank[cIdx1], commentBank[(cIdx1 + 1) % 5]];

  // UPDATE: LOGIKA LOOP RECOMENDATION (JANJI 4) - Sekarang via Fetch GitHub
  const totalFiles = 95501;
  let recommendationHtml = '';
  
  // Kita ambil 4 rekomendasi secara asinkron
  const recIds = [];
  for (let i = 1; i <= 4; i++) {
    recIds.push(Math.floor(seededRandom(seed + i + 10) * totalFiles) + 1);
  }

  await Promise.all(recIds.map(async (rId) => {
    try {
      const rRes = await fetch(`${rawBaseUrl}data-${rId}.json`);
      if (rRes.ok) {
        const rJson = await rRes.json();
        const rData = rJson[0];
        const rCleanTitle = rData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const rSlug = `${rCleanTitle}-${rId}`;
        recommendationHtml += `
          <div style="background: #1a1e23; padding: 10px; border-radius: 8px; text-align: center;">
            <img src="${rData.poster}" alt="${rData.title}" style="border-radius: 4px; margin-bottom: 5px; cursor: pointer;" onclick="window.location.href='/${rSlug}'">
            <p style="font-size: 0.8rem; margin: 0;"><a href="/${rSlug}">${rData.title}</a></p>
          </div>`;
      }
    } catch (e) { /* skip error */ }
  }));

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
        footer a { color: inherit; text-decoration: none; }
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
        .insight-card { background: #1a1e23; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10ad77; }
        .bar-bg { background: #333; height: 10px; border-radius: 5px; margin: 5px 0 10px 0; }
        .bar-fill { background: #10ad77; height: 10px; border-radius: 5px; }
        .comment-item { border-bottom: 1px solid #333; padding: 10px 0; font-size: 0.9rem; }
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

          <div class="insight-card">
            <p><small>Acting Impact Score</small></p>
            <div class="bar-bg"><div class="bar-fill" style="width: ${scoreActing}%"></div></div>
            <p><strong>Critical Note:</strong> ${randomNote}</p>
          </div>

          <div style="margin-top: 20px;">
            <h4>User Reviews</h4>
            ${fixedComments.map(c => `<div class="comment-item"><strong>${c.n}:</strong> ${c.t}</div>`).join('')}
          </div>

          <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
            <button class="btn-main" onclick="window.open('https://otieu.com/4/8764643')">WATCH NOW</button>
            <button class="outline" onclick="window.open('https://www.effectivegatecpm.com/xjsgcgii37?key=606d2c74ae50bd149743d90c3719a164')">GET DATA</button>
          </div>

          <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
            <h4 style="margin-bottom: 20px;">Recommended for You</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
              ${recommendationHtml}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 <a href="/">gusku.site</a></p>
      </footer>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};