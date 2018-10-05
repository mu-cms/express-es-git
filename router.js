const join  = require('url-join');
const PromiseRouter = require('express-promise-router');
const param = require('./param');
const controller = require('./controller');

module.exports = (repo, options = { text: '/', path: '/', admin: '/'}) => {
  const router = new PromiseRouter();
  const { ref } = param(repo, options);
  const { loadText, loadPath, write, fetch, refs } = controller(repo, options);
  const { text, path, admin } = options;

  router.param('ref', ref);
  if (text) {
    router.get(join(text, '/:ref\.:ext?'), loadText, write);
  }
  if (path) {
    router.get(join(path, '/:ref/:path([^$]+)'), loadPath, write);
  }
  if (admin) {
    router.post(join(admin, '/fetch'), fetch);
    router.post(join(admin, '/refs'), refs);
  }

  return router;
}