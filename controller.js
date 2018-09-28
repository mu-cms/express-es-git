const { NEXT, ROUTE, MIME, CACHE_SHORT, CACHE_LONG } = require('./const');

const process = async (req, res, result, cache_control, etag, options) => {
  const { cache = true, mime = MIME } = options;

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

const hasLength = x => x.length > 0;

module.exports = (repo, options = {}) => ({
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

    let hash = tree;

    const parts = path.split('/').filter(hasLength);
    for (const part of parts) {
      const object = await repo.loadObject(hash);
      const { type } = object;
      if (!object) {
        throw new Error(`Missing object: ${hash}`);
      }
      else if (type === 'blob') {
        return undefined;
      }
      else if (type !== 'tree') {
        throw new Error(`Wrong object: ${hash}. Expected tree, got ${type}`);
      }
      const entry = object.body[part];
      if (!entry) {
        return undefined;
      }
      hash = entry.hash;
    }

    await process(req, res, await repo.loadText(hash), req.ref ? cache_short : cache_long, hash, options) ? NEXT : ROUTE;
  },

  loadText: async (req, res) => {
    const { hash } = req.params;
    const { cache_long = CACHE_LONG } = options;

    await process(req, res, await repo.loadText(hash), cache_long, hash, options) ? NEXT : ROUTE;
  }
});
