const compact = require('omit-empty');
const { NEXT, ROUTE, HEAD } = require('./const');

const hasLength = x => x.length > 0;

module.exports = (repo, options = {}) => ({
  loadPath: async (req) => {
    const { ref: tree, path } = req.params;
    let { ref: hash } = req.params;

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

    req.git = { ...req.git, body: await repo.loadText(hash), object: hash, tree };

    return NEXT;
  },

  loadText: async (req) => {
    const { ref: object } = req.params;

    req.git = { ...req.git, body: await repo.loadText(object), object };

    return NEXT;
  },

  write: async (req, res) => {
    const { head = HEAD } = options;
    const { git, path } = req;
    const { body } = git;

    if (body) {
      if (head) {
        res.set(compact(head({ ...git, path })));
      }
      res.send(body);
    }

    return NEXT;
  }
});
