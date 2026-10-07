// scripts/print-qr.cjs
// Prints a QR code in the terminal for easy mobile access.
// Runs automatically before vite starts via npm run dev.

const os = require('os');
const qrcode = require('qrcode-terminal');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
const url = `http://${ip}:5173`;

console.log('\n');
console.log('  ╔═══════════════════════════════════════╗');
console.log('  ║   🍽️  CalorieLens — Mobile Access     ║');
console.log('  ╠═══════════════════════════════════════╣');
console.log(`  ║  📱  ${url.padEnd(34)}║`);
console.log('  ║  Open this URL on your phone           ║');
console.log('  ║  (Must be on same Wi-Fi!)              ║');
console.log('  ╚═══════════════════════════════════════╝');
console.log('\n  Scan QR Code:');

qrcode.generate(url, { small: true });
