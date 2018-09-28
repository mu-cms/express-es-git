const mime = require('mime-types');

exports.NEXT = 'next';
exports.ROUTE = 'route';
exports.MIME = (path) => mime.lookup(path) || 'text/plain';
exports.CACHE_SHORT = 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000';
exports.CACHE_LONG = 'only-if-cached';