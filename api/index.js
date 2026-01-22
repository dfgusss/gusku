module.exports = async (req, res) => {
  const listUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/list_games.json';

  try {
    const response = await fetch(listUrl);
    if (!response.ok) throw new Error('File list_games.json tidak ditemukan');
    
    const allGames = await response.json();

    // Mengacak data dan mengambil tepat 10 game sesuai grid 5x2 di index.html
    const shuffled = allGames.sort(() => 0.5 - Math.random());
    const selectedGames = shuffled.slice(0, 10);

    // Mengirimkan data dalam format JSON, bukan HTML
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Izin agar bisa dibaca oleh index.html
    res.status(200).json(selectedGames);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat data game dari GitHub" });
  }
};