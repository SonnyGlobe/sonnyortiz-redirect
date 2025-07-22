const fs = require('fs');
const http = require('http');

const TEMPLATE_PATH = 'index.html.template';
const OUTPUT_PATH = 'index.html';
const NGROK_API = 'http://127.0.0.1:4040/api/tunnels';

// Wait for ngrok to start and get the public URL
function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    http.get(NGROK_API, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data).tunnels;
          const httpTunnel = tunnels.find(t => t.proto === 'https');
          if (httpTunnel) {
            resolve(httpTunnel.public_url);
          } else {
            reject('No HTTPS tunnel found.');
          }
        } catch (err) {
          reject('Failed to parse ngrok tunnel data.');
        }
      });
    }).on('error', reject);
  });
}

// Update index.html with new URL
async function updateHtml() {
  try {
    const ngrokUrl = await getNgrokUrl();
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    const updated = template.replace(/{{NGROK_URL}}/g, ngrokUrl);
    fs.writeFileSync(OUTPUT_PATH, updated, 'utf8');
    console.log(`✅ index.html updated to redirect to ${ngrokUrl}`);
  } catch (err) {
    console.error(`❌ Error: ${err}`);
  }
}

updateHtml();
