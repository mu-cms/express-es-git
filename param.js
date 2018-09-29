const { NEXT, SPECS } = require('./const');

module.exports = (repo, options = {}) => ({
  ref: async (req, res, next, ref) => {
    const { specs = SPECS } = options;

    for (const spec of specs) {
      const git = spec(ref);
      const hash = await repo.getRef(git.ref);
      if (hash) {
        ({ body: { tree: req.params.ref } } = await repo.loadObject(hash));
        req.git = { ...git, commit: hash };
        break;
      }
    }

    return NEXT;
  }
})