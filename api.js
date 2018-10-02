const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const pipe = (source, target) => {
  return new Promise((resolve, reject) => {
    source.on('finish', resolve);
    source.on('error', reject);
    if (target) {
      source.pipe(target);
    }
  })
}

module.exports = (base, out = process.stdout) => ({
  fetch: async (url, ...refs) => {
    const res = await fetch(`${base}/fetch`, {
      method: 'POST',
      body: new URLSearchParams({ url, refs })
    });
    return pipe(res.body, out);
  },

  refs: async (...refs) => {
    const res = await fetch(`${base}/refs`, {
      method: 'POST',
      body: new URLSearchParams({ refs })
    });
    return pipe(res.body, out);
  }
});