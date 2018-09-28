const { NEXT } = require('./const');

module.exports = repo => ({
  loadPath: async (req, res) => {
    const { path } = req.params;
    let { tree } = req.params;

    let ref = await repo.getRef(`refs/remotes/origin/${tree}`);
    if (ref) {
      ({ body: { tree } } = await repo.loadObject(ref));
    }

    const result = await repo.loadTextByPath(tree, path);
    if (result) {
      res.send(result);
    }
    else {
      return NEXT;
    }
  },

  loadBlob: async (req, res) => {
    const { blob } = req.params;

    const result = await repo.loadText(blob);
    if (result) {
      res.send(result);
    }
    else {
      return NEXT;
    }
  }
});
