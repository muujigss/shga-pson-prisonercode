const fs = require('fs');
const path = require('path');

const localesDir = 'd:\\projects\\New folder\\shga-pson-prisonercode\\i18n\\locales';

const badges = {
  'mn.json': 'Мөрдөгдөж буй хууль, журам',
  'en.json': 'Active law and regulation',
  'ru.json': 'Действующий закон и правила',
  'zh.json': '现行法律法规'
};

for (const [file, badge] of Object.entries(badges)) {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (!data.legal) data.legal = {};
  data.legal.badge = badge;
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
console.log('Badges added');
