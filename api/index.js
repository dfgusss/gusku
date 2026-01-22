module.exports = async (req, res) => {
  const listUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/list_games.json';
  try {
    const response = await fetch(listUrl);
    if (!response.ok) throw new Error('File list_games.json tidak ditemukan');
    
    const allGames = await response.json();
    const shuffled = allGames.sort(() => 0.5 - Math.random());
    const selectedGames = shuffled.slice(0, 10);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=59'); // caching
    res.status(200).json(selectedGames);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat data game dari GitHub" });
  }
};
