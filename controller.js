const compact = require('omit-empty');
const { NEXT, ROUTE, HEAD } = require('./const');
const HEADERS = {
  'Content-Type': 'text/plain',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Transfer-Encoding': 'chunked'
};
module.exports = (repo, options = {}) => ({
  loadPath: async (req) => {
    const { ref: tree, path } = req.params;
    let { ref: hash } = req.params;

    const parts = path.split('/').filter(x => x.length > 0);
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
  },

  fetch: async (req, res) => {
    const { url, refs } = req.body;

    res.set(HEADERS).write(`Fetching ${refs || 'refs'} from ${url}\n`);

    try {
      await repo.fetch(url, refs, { progress: message => res.write(message) });
    }
    catch (error) {
      res.write(`${error}\n`);
      res.write(`Params: ${JSON.stringify({ url, refs }, undefined, 2)}\n`);
    }
    finally {
      res.end('Done\n');
    }
  },

  refs: async (req, res) => {
    const { refs } = req.body;

    res.set(HEADERS).write(`Updating ${refs}\n`);

    for (const ref of Array.isArray(refs) ? refs : [refs]) {
      try {
        const [local = '', remote = ''] = ref.split(':');
        if (local.endsWith("*") || remote.endsWith("*")) {
          res.write(`Not supported: * refs are not supported\n`);
        }
        else if (local && !remote) {
          res.write(`Removed ref ${local}\n`);
          repo.setRef(local);
        }
        else {
          const hash = await repo.getRef(remote);
          if (!hash) {
            res.write(`Missing ref: ${remote}\n`)
          }
          else {
            res.write(`Updated ref ${ref} to ${hash}\n`);
            await repo.setRef(local, hash);
          }
        }
      }
      catch (error) {
        res.write(`${error}\n`);
      }
    }

    res.end('Done\n');
  }
});
