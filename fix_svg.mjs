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
  content = content
    .replace(/preserveaspectratio=/gi, 'preserveAspectRatio=')
    .replace(/viewbox=/gi, 'viewBox=')
    .replace(/stroke-width=/gi, 'strokeWidth=')
    .replace(/stroke-linecap=/gi, 'strokeLinecap=')
    .replace(/stroke-linejoin=/gi, 'strokeLinejoin=')
    .replace(/stroke-dasharray=/gi, 'strokeDasharray=')
    .replace(/stroke-dashoffset=/gi, 'strokeDashoffset=');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
