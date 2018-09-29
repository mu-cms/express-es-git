const { NEXT, ROUTE, HEAD, REFS } = require('./const');

const hasLength = x => x.length > 0;

module.exports = (repo, options = {}) => ({
  refToTree: async (req) => {
    const { tree } = req.params;
    const { refs = REFS } = options;

    for (const ref of refs) {
      const git = ref(tree);
      const hash = await repo.getRef(git.ref);
      if (hash) {
        ({ body: { tree: req.params.tree } } = await repo.loadObject(hash));
        req.git = { ...git, commit: hash };
        break;
      }
    }

    return NEXT;
  },

  loadPath: async (req) => {
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

    req.git = { ...req.git, object: hash, body: await repo.loadText(hash), tree };

    return NEXT;
  },

  loadText: async (req) => {
    const { hash } = req.params;

    req.git = { ...req.git, object: hash, body: await repo.loadText(hash) };

    return NEXT;
  },

  write: async (req, res) => {
    const { head = HEAD } = options;
    const { git, path } = req;
    const { body } = git;

    if (body) {
      if (head) {
        res.set(head({ ...git, path }));
      }
      res.send(body);
    }

    return NEXT;
  }
});
