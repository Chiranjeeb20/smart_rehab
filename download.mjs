import fs from 'fs/promises';
import https from 'https';

const downloads = [
  { url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA3YmY5ZTJmMDRjZjQ5MjNiZDExMzVmN2MwNGEzYzViEgsSBxCpkdTvzQ4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjY2MTE0MDg2OTk5OTczNTE0OA&filename=&opi=89354086", file: "dashboard_overview.html" },
  { url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2IxMmRjNmRjNDNjNjQ1ZTk5Y2Y5MjNhMjY0Y2IxZGMwEgsSBxCpkdTvzQ4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjY2MTE0MDg2OTk5OTczNTE0OA&filename=&opi=89354086", file: "patient_home.html" },
  { url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2RjNjc0ZDg5ZDZjMzQ1Yzk4MDk4NjQ4ZWM4MDlmMjMyEgsSBxCpkdTvzQ4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjY2MTE0MDg2OTk5OTczNTE0OA&filename=&opi=89354086", file: "dashboard_analytics.html" },
  { url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VjNjFkMjU2NGRmMTRiMzZiNTFkMWZlZTEwY2Y2OGU2EgsSBxCpkdTvzQ4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjY2MTE0MDg2OTk5OTczNTE0OA&filename=&opi=89354086", file: "prd.html" },
  { url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzUyNjc3ZDM3OWQ5YTQ3Y2I4YjJhMjMwYjA1MTkzYjIxEgsSBxCpkdTvzQ4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjY2MTE0MDg2OTk5OTczNTE0OA&filename=&opi=89354086", file: "patient_camera.html" }
];

async function download(url, file) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(fs.writeFile(file, data)));
        }).on('error', reject);
      } else {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(fs.writeFile(file, data)));
      }
    }).on('error', reject);
  });
}

Promise.all(downloads.map(d => download(d.url, d.file))).then(() => console.log('All downloaded!'));
