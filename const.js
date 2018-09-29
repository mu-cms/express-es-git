const mime = require('mime-types');
exports.NEXT = 'next';
exports.ROUTE = 'route';
exports.REFS = [ {
  prefix: 'refs/tags',
  cache_control: 'max-age=1000, s-maxage=3000, stale-while-revalidate=5000, stale-if-error=1000'
}, {
  prefix: 'refs/heads',
  cache_control: 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000'
}];
exports.MIME = (path, type = 'text/plain') => mime.lookup(path) || type;
exports.HEAD = (data) => ({
  'Cache-Control': data.cache_control || 'only-if-cache',
  'ETag': data.object,
  'X-Git-Tree': data.tree
});