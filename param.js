const { NEXT, SPECS } = require('./const');

module.exports = (repo, options = {}) => ({
  ref: async (req, res, next, ref) => {
    const { specs = SPECS } = options;

    for (const spec of specs) {
      const git = spec(ref);
      const hash = await repo.getRef(git.ref);
      if (hash) {
        const object = await repo.loadObject(hash);
        if (!object) {
          throw new Error(`Missing object: ${hash}`);
        }
        else switch (object.type) {
          case 'commit':
            req.params.ref = object.body.tree;
            req.git = { ...git, commit: hash };
            break;

          default:
            throw new Error(`Wrong object: ${hash}. Expected commit, got ${object.type}`);
        }
        break;
      }
    }

    return NEXT;
  }
})