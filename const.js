const mime = require('mime-types');
const cache_control = {
  'refs/tags': 'max-age=1000, s-maxage=3000, stale-while-revalidate=5000, stale-if-error=1000',
  'refs/heads': 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000'
};

exports.NEXT = 'next';
exports.ROUTE = 'route';
exports.REFS = [ 'refs/tags', 'refs/heads' ];
exports.MIME = (path, type = 'text/plain') => mime.lookup(path) || type;
exports.HEAD = (etag, ref) => ({
  'Cache-Control': cache_control[ref] || 'only-if-cache',
  'ETag': etag
});