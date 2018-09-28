const mime = require('mime-types');
const { NEXT, ROUTE } = require('./const');

module.exports = repo => ({
  refToTree: async(req) => {
    const { tree } = req.params;

    if (req.ref = await repo.getRef(`refs/heads/${tree}`)) {
      ({ body: { tree: req.params.tree } } = await repo.loadObject(req.ref));
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path, tree } = req.params;

    const result = await repo.loadTextByPath(tree, path);
    if (result) {
      res.set({
        'Cache-Control':  req.ref ? 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000' : 'only-if-cached',
        'ETag': tree
      });
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  },

  loadBlob: async (req, res) => {
    const { blob } = req.params;

    const result = await repo.loadText(blob);
    if (result) {
      res.set({
        'Cache-Control': 'only-if-cached',
        'ETag': blob
      });
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  },

  mimeType: async (req, res) => {
    res.type(mime.lookup(req.path) || 'text/plain');

    return NEXT;
  }
});
