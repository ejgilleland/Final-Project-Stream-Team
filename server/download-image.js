const fs = require('fs');
const fetch = require('node-fetch');

async function download(url, id) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(`./server/public/images/${id}.png`, buffer, () => {});
}

module.exports = download;
