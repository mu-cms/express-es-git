const { NEXT, ROUTE, MIME, CACHE_SHORT, CACHE_LONG } = require('./const');

const process = async (req, res, result, cache_control, etag, options) => {
  const { cache, mime = MIME } = options;

  if (result) {
    if (cache) {
      res.set({
        'Cache-Control': cache_control,
        'ETag': etag
      });
    }
    if (mime) {
      res.type(mime(req.path));
    }
    res.send(result);
  }

  return !!result;
}

module.exports = (repo, options) => ({
  refToTree: async (req) => {
    const { tree } = req.params;

    if (req.ref = await repo.getRef(`refs/heads/${tree}`)) {
      ({ body: { tree: req.params.tree } } = await repo.loadObject(req.ref));
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path, tree } = req.params;
    const { cache_long = CACHE_LONG, cache_short = CACHE_SHORT } = options;

    await process(req, res, await repo.loadTextByPath(tree, path), req.ref ? cache_short : cache_long, tree, options) ? NEXT : ROUTE;
  },

  loadBlob: async (req, res) => {
    const { blob } = req.params;
    const { cache_long = CACHE_LONG } = options;

    await process(req, res, await repo.loadText(blob), cache_long, blob, options) ? NEXT : ROUTE;
  }
});
