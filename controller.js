const { NEXT, ROUTE, MIME, CACHE, REFS } = require('./const');

const process = (req, res, body, etag, options) => {
  const { cache = CACHE, mime = MIME } = options;

  if (body) {
    if (cache) {
      res.set(cache(etag, req.ref));
    }
    if (mime) {
      res.type(mime(req.path));
    }
    res.send(body);
  }

  return !!body;
}

const hasLength = x => x.length > 0;

module.exports = (repo, options = {}) => ({
  refToTree: async (req) => {
    const { tree } = req.params;
    const { refs = REFS } = options;

    for (const ref of refs) {
      const hash = await repo.getRef(`${ref}/${tree}`);
      if (hash) {
        ({ body: { tree: req.params.tree } } = await repo.loadObject(hash));
        Object.assign(req, { ref, hash });
        break;
      }
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path } = req.params;
    let { tree: hash } = req.params;

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

    return process(req, res, await repo.loadText(hash), hash, options) ? NEXT : ROUTE;
  },

  loadText: async (req, res) => {
    const { hash } = req.params;
    const { mime = MIME } = options;

    return process(req, res, await repo.loadText(hash), hash, { ...options, mime: mime ? (path, type = 'application/octet-stream') => mime(path, type) : mime }) ? NEXT : ROUTE;
  }
});
