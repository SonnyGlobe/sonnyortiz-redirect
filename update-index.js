const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'index.html.template');
const outputPath = path.join(__dirname, 'index.html');

// Get latest ngrok URL from terminal command:
const execSync = require('child_process').execSync;
let ngrokURL = '';

try {
  const result = execSync('curl http://127.0.0.1:4040/api/tunnels').toString();
  const json = JSON.parse(result);
  const tunnel = json.tunnels.find(t => t.proto === 'https');
  ngrokURL = tunnel.public_url;

  if (!ngrokURL) throw new Error('No HTTPS ngrok tunnel found.');
} catch (err) {
  console.error('❌ Could not retrieve ngrok URL:', err.message);
  process.exit(1);
}

// Read the template and inject the URL
fs.readFile(templatePath, 'utf8', (err, data) => {
  if (err) throw err;

  const updatedHTML = data.replace(/{{NGROK_URL}}/g, ngrokURL);

  fs.writeFile(outputPath, updatedHTML, 'utf8', err => {
    if (err) throw err;
    console.log(`✅ index.html updated to redirect to ${ngrokURL}`);
  });
});
