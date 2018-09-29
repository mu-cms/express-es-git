const mime = require('mime-types');

exports.NEXT = 'next';
exports.ROUTE = 'route';
exports.REFS = [
  tag => ({
    ref: `refs/tags/${tag}`,
    cache_control: 'max-age=1000, s-maxage=3000, stale-while-revalidate=5000, stale-if-error=1000'
  }),
  head => ({
    ref: `refs/heads/${head}`,
    cache_control: 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000'
  })
];
exports.HEAD = git => ({
  'Content-Type': mime.lookup(git.path) || (git.tree ? 'text/plain' : 'application/octet-stream'),
  'Cache-Control': git.cache_control || 'only-if-cache',
  'ETag': git.object,
  'X-Git-Tree': git.tree
});