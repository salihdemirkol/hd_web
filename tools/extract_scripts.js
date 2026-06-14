const https = require('https');
https.get('https://www.hasandamar.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scriptTags = data.match(/src="([^"]+\.js)"/g) || [];
    console.log("Scripts found:", scriptTags.length);
    scriptTags.forEach(tag => {
      let url = tag.match(/src="([^"]+)"/)[1];
      if (url.startsWith('/')) url = 'https://www.hasandamar.com' + url;
      https.get(url, jsRes => {
        let js = '';
        jsRes.on('data', chunk => js += chunk);
        jsRes.on('end', () => {
          const audio = js.match(/(https?:\/\/[^\s"'><\\]+?\.(mp3|m4a|wav|ogg|aac))/gi) || js.match(/(\/[^\s"'><\\]+?\.(mp3|m4a|wav|ogg|aac))/gi);
          if (audio) {
             console.log("FOUND AUDIO IN", url, ":", [...new Set(audio)]);
          }
        });
      });
    });
  });
});
