const { NEXT, ROUTE, MIME, HEAD, REFS } = require('./const');

const process = (req, res, data, options) => {
  const { head = HEAD, mime = MIME } = options;
  const { body } = data;

  if (body) {
    if (head) {
      res.set(head(data));
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
      const hash = await repo.getRef(`${ref.prefix}/${tree}`);
      if (hash) {
        ({ body: { tree: req.params.tree } } = await repo.loadObject(hash));
        req.ref = { commit: hash, ...ref };
        break;
      }
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path } = req.params;
    let { tree, tree: hash } = req.params;

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

    return process(req, res, { ...req.ref, object: hash, body: await repo.loadText(hash), tree }, options) ? NEXT : ROUTE;
  },

  loadText: async (req, res) => {
    const { hash } = req.params;
    const { mime = MIME } = options;

    return process(req, res, { ...req.ref, object: hash, body: await repo.loadText(hash) }, { ...options, mime: mime ? (path, type = 'application/octet-stream') => mime(path, type) : mime }) ? NEXT : ROUTE;
  }
});
