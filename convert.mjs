import fs from 'fs';
import path from 'path';

const filesToProcess = [
  { source: 'dashboard_overview.html', dest: 'app/dashboard/page.tsx' },
  { source: 'dashboard_analytics.html', dest: 'app/dashboard/analytics/page.tsx' },
  { source: 'patient_home.html', dest: 'app/patient/page.tsx' },
  { source: 'patient_camera.html', dest: 'app/patient/camera/page.tsx' }
];

function transformHtmlToJsx(html) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  let content = bodyMatch[1];

  // Remove trailing scripts
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  content = content
    .replace(/ class="/g, ' className="')
    .replace(/ for="/g, ' htmlFor="')
    .replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}')
    .replace(/<img([^>]+)>/g, '<img$1 />')
    .replace(/<input([^>]+)>/g, '<input$1 />')
    .replace(/<br([^>]*?)>/g, '<br$1 />')
    .replace(/<hr([^>]*?)>/g, '<hr$1 />')
    .replace(/style="([^"]+)"/g, (match, p1) => {
      // Very basic style object conversion, works for the few instances here
      if (p1.includes('font-variation-settings')) {
        return 'style={{ fontVariationSettings: "\\\'FILL\\\' 1" }}';
      }
      return match;
    });

  // some images might already have self closing tags if they came out of certain tools, ensure no double slashes
  content = content.replace(/\/\s*\/\s*>/g, '/>');

  return `
export default function Page() {
  return (
    <>
      ${content}
    </>
  );
}
`;
}

function run() {
  for (const { source, dest } of filesToProcess) {
    if (!fs.existsSync(source)) continue;
    const html = fs.readFileSync(source, 'utf-8');
    const jsx = transformHtmlToJsx(html);
    
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, jsx);
    console.log("Converted " + source + " to " + dest);
  }
}

run();
