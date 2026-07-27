const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const services = [
  'buxgalteriya-autsorsingi',
  'soliq-maslahatlari',
  'soliq-tekshiruvlarida-himoya',
  'buxgalteriya-hisobini-tiklash',
  'kadrlar-hisobi',
  'ichki-audit',
  'moliyaviy-hisobotlar',
  '1c-xizmatlari'
];
const required = [
  'server.js','package.json','index.html','xizmatlar.html','team.html','narxlar.html',
  'yangiliklar.html','maqola.html','foydali.html','assets/css/style.css','assets/js/site.js',
  'assets/js/news-client.js','assets/js/admin-news.js','assets/js/admin-team.js','assets/js/admin-useful.js','assets/js/team-client.js','assets/js/useful-client.js','assets/js/useful-pages.js','assets/js/useful-live.js','assets/js/useful-custom.js','assets/css/admin.css','admin/yangiliklar.html','admin/jamoa.html','admin/foydali.html','data/team.json','data/useful-admin-data.json','assets/img/logo-horizontal.png','assets/img/office-section-bg.jpg',
  'assets/img/header-finance.jpg','data/news.json',
  'assets/img/process-4-step-uz.png','assets/img/process-4-step-ru.png','assets/img/process-4-step-en.png','assets/img/process-4-step-zh.png',
  'assets/img/solution-documents-uz.png','assets/img/solution-documents-ru.png','assets/img/solution-documents-en.png','assets/img/solution-documents-zh.png','robots.txt','sitemap.xml','SEO-MEDIA-BACKUP-SOZLASH.txt','assets/img/og/og-uz.jpg','assets/img/og/og-ru.jpg','assets/img/og/og-en.jpg','assets/img/og/og-zh.jpg',
  ...services.map(slug => `services/${slug}.html`)
];
let failed = false;
for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: ${rel}`);
    failed = true;
  } else {
    console.log(`OK: ${rel}`);
  }
}
try {
  JSON.parse(fs.readFileSync(path.join(root, 'data/news.json'), 'utf8'));
  console.log('OK: data/news.json JSON');
} catch (error) {
  console.error('INVALID JSON: data/news.json', error.message);
  failed = true;
}
for (const page of ['index.html','xizmatlar.html']) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  const cards = (html.match(/class="service-card"/g) || []).length;
  if (cards !== 8) {
    console.error(`INVALID: ${page} must contain 8 service cards, found ${cards}`);
    failed = true;
  } else console.log(`OK: ${page} contains 8 service cards`);
  if (html.includes('services-toggle')) {
    console.error(`INVALID: old services toggle remains in ${page}`);
    failed = true;
  }
}
for (const slug of services) {
  const html = fs.readFileSync(path.join(root,`services/${slug}.html`),'utf8');
  for (const marker of ['service-scope-list','service-process-grid','deliver-grid','legal-grid']) {
    if (!html.includes(marker)) {
      console.error(`INVALID: services/${slug}.html missing ${marker}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log('Build verification completed successfully.');

const serverSource=fs.readFileSync(path.join(root,'server.js'),'utf8');
for(const marker of ['/api/admin/login','/api/admin/news','ADMIN_PASSWORD','ADMIN_SESSION_SECRET']){if(!serverSource.includes(marker)){console.error('INVALID: server.js missing '+marker);process.exit(1);}}
console.log('OK: password-protected news admin API');

['ru/index.html','en/index.html','zh/index.html','ru/xizmatlar.html','en/xizmatlar.html','zh/xizmatlar.html','ru/yangiliklar.html','en/yangiliklar.html','zh/yangiliklar.html','ru/foydali.html','en/foydali.html','zh/foydali.html','admin/yangiliklar.html',...services.map(s=>`zh/services/${s}.html`)].forEach(f=>{if(!fs.existsSync(path.join(root,f))){console.error('MISSING:',f);process.exitCode=1}else console.log('OK:',f)});


const languagePages=['index.html','ru/index.html','en/index.html','zh/index.html','xizmatlar.html','ru/xizmatlar.html','en/xizmatlar.html','zh/xizmatlar.html'];
for(const page of languagePages){
  const full=path.join(root,page);
  const html=fs.readFileSync(full,'utf8');
  const switchers=(html.match(/class="global-language-switcher"/g)||[]).length;
  const flags=(html.match(/assets\/img\/flags\/(uz|ru|en|zh)\.svg/g)||[]).length;
  if(switchers!==1||flags!==4){console.error(`INVALID LANGUAGE SWITCHER: ${page}; switchers=${switchers}; flags=${flags}`);process.exitCode=1}else console.log(`OK: ${page} has 4 visible language flags`);
}
for(const flag of ['uz','ru','en','zh']){const rel=`assets/img/flags/${flag}.svg`;if(!fs.existsSync(path.join(root,rel))){console.error('MISSING:',rel);process.exitCode=1}else console.log('OK:',rel)}


// Syntax and SEO checks added in v15.
for (const rel of ['server.js','assets/js/site.js','assets/js/news-client.js','assets/js/admin-news.js','assets/js/admin-team.js','assets/js/admin-useful.js','assets/js/team-client.js','assets/js/useful-client.js','assets/js/useful-pages.js','assets/js/useful-live.js','assets/js/useful-custom.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, rel)], { stdio: 'pipe' }); console.log(`OK JS syntax: ${rel}`); }
  catch (error) { console.error(`INVALID JS: ${rel}`); failed = true; }
}
for (const page of ['index.html','ru/index.html','en/index.html','zh/index.html','xizmatlar.html','ru/xizmatlar.html','en/xizmatlar.html','zh/xizmatlar.html']) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  for (const marker of ['name="description"','property="og:title"','property="og:description"','property="og:image"','name="twitter:card"','rel="canonical"']) {
    if (!html.includes(marker)) { console.error(`INVALID SEO: ${page} missing ${marker}`); failed = true; }
  }
}
for (const marker of ['createFullBackup','scheduleBackups','/api/admin/backups/run','BACKUP_RETENTION_WEEKS']) {
  if (!serverSource.includes(marker)) { console.error(`INVALID BACKUP: server.js missing ${marker}`); failed = true; }
}
for (const marker of ['/api/useful','USEFUL_SOURCES','getUsefulData','/api/useful-custom','/api/admin/useful-custom']) {
  if (!serverSource.includes(marker)) { console.error(`INVALID USEFUL API: server.js missing ${marker}`); failed = true; }
}
if (failed) process.exit(1);

const localizedPages={
  'index.html':['process-4-step-uz.png','solution-documents-uz.png'],
  'ru/index.html':['process-4-step-ru.png','solution-documents-ru.png'],
  'en/index.html':['process-4-step-en.png','solution-documents-en.png'],
  'zh/index.html':['process-4-step-zh.png','solution-documents-zh.png']
};
for(const [page,images] of Object.entries(localizedPages)){
  const source=fs.readFileSync(path.join(root,page),'utf8');
  for(const image of images){
    if(!source.includes(image)){console.error(`INVALID: ${page} missing ${image}`);process.exitCode=1}else console.log(`OK: ${page} uses ${image}`);
  }
  if(/(?:process-4-step|solution-documents)-(?:uz|ru|en|zh)\.svg/.test(source)){console.error(`INVALID: obsolete SVG reference remains in ${page}`);process.exitCode=1;}
}


for (const page of ['team.html','ru/team.html','en/team.html','zh/team.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  if (!html.includes('data-team-grid') || !/team-client\.js\?v=(23|24|25)/.test(html)) {
    console.error('INVALID TEAM PAGE:', page);
    process.exitCode = 1;
  } else console.log('OK:', page, 'uses dynamic team data');
}
try {
  const teamData = JSON.parse(fs.readFileSync(path.join(root, 'data/team.json'), 'utf8'));
  if (!Array.isArray(teamData) || !teamData.length) { console.error('INVALID data/team.json'); process.exitCode = 1; }
  else console.log('OK: data/team.json contains default team');
} catch (error) { console.error('INVALID JSON: data/team.json', error.message); process.exitCode = 1; }


const usefulRequired = ['foydali-calendar.html','foydali-workdays.html','foydali-rent.html','foydali-laws.html','foydali-links.html'];
for (const langDir of ['', 'ru/', 'en/', 'zh/']) {
  for (const rel of usefulRequired) {
    const f = langDir + rel;
    if (!fs.existsSync(path.join(root, f))) { console.error('MISSING useful subpage:', f); process.exitCode = 1; }
    else {
      const html = fs.readFileSync(path.join(root, f), 'utf8');
      if (!html.includes('data-useful-custom-page') || !html.includes('useful-custom.js?v=28')) { console.error('INVALID useful subpage:', f); process.exitCode = 1; }
      else console.log('OK:', f, 'admin-managed useful page');
    }
  }
  const hub = langDir + 'foydali.html';
  const hubHtml = fs.readFileSync(path.join(root, hub), 'utf8');
  if (!hubHtml.includes('data-useful-hub') || !hubHtml.includes('useful-custom.js?v=28')) { console.error('INVALID useful hub:', hub); process.exitCode = 1; }
  else console.log('OK:', hub, 'uses admin-managed useful data');
}
try {
  const usefulData = JSON.parse(fs.readFileSync(path.join(root, 'data/useful-admin-data.json'), 'utf8'));
  if (!usefulData.sections || !usefulData.sections.calendar || !usefulData.sections.workdays || !usefulData.sections.rent) { console.error('INVALID useful admin seed'); process.exitCode = 1; }
  else console.log('OK: data/useful-admin-data.json contains useful admin seed');
} catch (error) { console.error('INVALID JSON: data/useful-admin-data.json', error.message); process.exitCode = 1; }
