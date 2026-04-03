import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('app');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/style="([^"]+)"/g, (match, p1) => {
    const rules = p1.split(';').filter(i => i.trim());
    const reactStyle = rules.map(rule => {
      let [key, val] = rule.split(':').map(i => i.trim());
      if (!key || !val) return '';
      // convert kebab-case to camelCase
      key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return key + ": '" + val + "'";
    }).filter(i => i).join(', ');
    return "style={{ " + reactStyle + " }}";
  });
  fs.writeFileSync(file, content);
  console.log('Fixed styles', file);
}
