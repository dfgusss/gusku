module.exports = async (req, res) => {
  // 1. Pilih angka random antara 1 sampai 70
  const randomShard = Math.floor(Math.random() * 70) + 1;
  
  // 2. Tentukan URL file list random tersebut
  const listUrl = `https://raw.githubusercontent.com/dfgusss/gusku/main/lists/list_${randomShard}.json`;

  try {
    const response = await fetch(listUrl);
    if (!response.ok) throw new Error('Gagal ambil data');
    
    const games = await response.json();

    // 3. Acak isi di dalam file tersebut (shuffle)
    const shuffled = games.sort(() => 0.5 - Math.random());

    // 4. Ambil 10 game teratas hasil acak
    const selected = shuffled.slice(0, 10);

    // Kirim hasil ke browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(selected);
  } catch (err) {
    res.status(500).json({ error: "Gagal memproses data game" });
  }
};