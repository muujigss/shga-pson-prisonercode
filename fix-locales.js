const fs = require('fs');

let code = fs.readFileSync('update-locales.js', 'utf-8');
code = code.replace(/\\'/g, "'");
fs.writeFileSync('update-locales.js', code, 'utf-8');
