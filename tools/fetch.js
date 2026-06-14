const https = require('https');
https.get('https://www.hasandamar.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const mp3 = data.match(/https?:\/\/[^\s"'><]+?\.mp3/gi);
    console.log("MP3s:", mp3 ? [...new Set(mp3)] : null);
    const m4a = data.match(/https?:\/\/[^\s"'><]+?\.m4a/gi);
    console.log("M4As:", m4a ? [...new Set(m4a)] : null);
    const wav = data.match(/https?:\/\/[^\s"'><]+?\.wav/gi);
    console.log("WAVs:", wav ? [...new Set(wav)] : null);
    const opus = data.match(/https?:\/\/[^\s"'><]+?\.opus/gi);
    console.log("OPUSs:", opus ? [...new Set(opus)] : null);
    const konusma = data.match(/.{0,50}konu.ma.{0,50}/gi);
    console.log("Konusma:", konusma);
  });
});
