const { NEXT, ROUTE } = require('./const');

module.exports = repo => ({
  refToTree: async(req) => {
    const { tree } = req.params;

    const ref = await repo.getRef(`refs/heads/${tree}`);
    if (ref) {
      ({ body: { tree: req.params.tree } } = await repo.loadObject(ref));
    }

    return NEXT;
  },

  loadPath: async (req, res) => {
    const { path, tree } = req.params;

    const result = await repo.loadTextByPath(tree, path);
    if (result) {
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  },

  loadBlob: async (req, res) => {
    const { blob } = req.params;

    const result = await repo.loadText(blob);
    if (result) {
      res.send(result);
    }

    return result ? NEXT : ROUTE;
  }
});
