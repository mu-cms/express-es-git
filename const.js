const mime = require('mime-types');

exports.NEXT = 'next';
exports.ROUTE = 'route';
exports.MIME = (path, type = 'text/plain') => mime.lookup(path) || type;
exports.CACHE_SHORT = 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000';
exports.CACHE_LONG = 'only-if-cached';