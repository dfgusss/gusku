const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    // 1. Ambil kunci dari Environment Variables Vercel
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    await jwtClient.authorize();

    // 2. Siapkan URL yang mau dipaksa index (Kita ambil 5 URL acak)
    const baseUrl = 'https://gusku.site';
    const totalFiles = 95501;
    const urlsToPing = [];
    
    for (let i = 0; i < 5; i++) {
      const rId = Math.floor(Math.random() * totalFiles) + 1;
      urlsToPing.push(`${baseUrl}/movie-${rId}`); 
    }

    // 3. Lapor ke Google Indexing API
    for (const url of urlsToPing) {
      await google.indexing('v3').urlNotifications.publish({
        auth: jwtClient,
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
    }

    // 4. Ping Sitemap ke Google & Bing (Janji ke-2)
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    await fetch(`https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`);
    await fetch(`https://www.bing.com/ping?sitemap=${baseUrl}/sitemap.xml`);

    res.status(200).send(`Sip! 5 URL dikirim ke Google API & Sitemap sudah di-Ping.`);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};