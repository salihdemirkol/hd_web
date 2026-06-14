const https = require('https');
https.get('https://www.hasandamar.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('>Konuşma<');
    if (idx !== -1) {
      console.log(data.substring(Math.max(0, idx - 800), idx + 800));
    } else {
      console.log("Not found");
    }
  });
});
