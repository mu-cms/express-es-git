const mime = require('mime-types');
const { NEXT, ROUTE, TYPE, CACHE_SHORT, CACHE_LONG } = require('./const');

module.exports = (repo, options) => ({
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
      if (options.cache) {
        res.set({
          'Cache-Control':  req.ref ? options.cache_short || CACHE_SHORT : options.cache_long || CACHE_LONG,
          'ETag': tree
        });
      }
      if (options.mime) {
        res.type(mime.lookup(req.path) || TYPE);
      }
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  },

  loadBlob: async (req, res) => {
    const { blob } = req.params;

    const result = await repo.loadText(blob);
    if (result) {
      if (options.cache) {
        res.set({
          'Cache-Control': options.cache_long || CACHE_LONG,
          'ETag': blob
        });
      }
      if (options.mime) {
        res.type(mime.lookup(req.path) || TYPE);
      }
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  }
});
