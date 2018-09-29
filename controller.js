const { NEXT, ROUTE, MIME, CACHE, CACHE_SHORT, CACHE_LONG } = require('./const');

const process = (req, res, result, cache_control, etag, options) => {
  const { cache = CACHE, mime = MIME } = options;

  if (result) {
    if (cache) {
      res.set(cache(cache_control, etag));
    }
    if (mime) {
      res.type(mime(req.path));
    }
    res.send(result);
  }

  return !!result;
}

const hasLength = x => x.length > 0;

module.exports = (repo, options = {
  refs: [{
    ref: 'refs/tags',
    cache: 'max-age=1000, s-maxage=3000'
  }, {
    ref: 'refs/heads',
    cache: 'max-age=100, s-maxage=300, stale-while-revalidate=500, stale-if-error=1000'
  }]
}) => ({
  refToTree: async (req) => {
    const { tree } = req.params;
    const { refs } = options;

    for (const ref of refs) {
      const hash = await repo.getRef(`${ref.ref}/${tree}`);
      if (hash) {
        ({ body: { tree: req.params.tree } } = await repo.loadObject(ref.hash = hash));
        break;
      }
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path } = req.params;
    let { tree: hash } = req.params;
    const { cache_long = CACHE_LONG, cache_short = CACHE_SHORT } = options;

    const parts = path.split('/').filter(hasLength);
    for (const part of parts) {
      const object = await repo.loadObject(hash);
      if (!object) {
        throw new Error(`Missing object: ${hash}`);
      }
      else if (object.type !== 'tree') {
        throw new Error(`Wrong object: ${hash}. Expected tree, got ${object.type}`);
      }
      const entry = object.body[part];
      if (!entry) {
        return ROUTE;
      }
      hash = entry.hash;
    }

    return process(req, res, await repo.loadText(hash), req.ref ? cache_short : cache_long, hash, options) ? NEXT : ROUTE;
  },

  loadText: async (req, res) => {
    const { hash } = req.params;
    const { cache_long = CACHE_LONG, mime = MIME } = options;

    return process(req, res, await repo.loadText(hash), cache_long, hash, { ...options, mime: mime ? (path, type = 'application/octet-stream') => mime(path, type) : mime }) ? NEXT : ROUTE;
  }
});
