const https = require('https');
https.get('https://www.hasandamar.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const audioFiles = data.match(/"\/?[^"]+?\.(mp3|m4a|wav|ogg)"/gi);
    console.log("Audio Files:", audioFiles ? [...new Set(audioFiles)] : null);
  });
});
