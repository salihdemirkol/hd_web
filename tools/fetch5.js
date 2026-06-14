const fs = require('fs');
const d = fs.readFileSync('hasandamar_html.txt', 'utf8');
const srcs = d.match(/src="([^"]+)"/g) || [];
console.log(srcs.filter(s => !s.includes('.js') && !s.includes('.css') && !s.includes('.png') && !s.includes('.jpg') && !s.includes('.svg') && !s.includes('.ico')));
