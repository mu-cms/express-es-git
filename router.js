const PromiseRouter = require('express-promise-router');
const param = require('./param');
const controller = require('./controller');

module.exports = (...args) => {
  const router = new PromiseRouter();
  const { ref } = param(...args);
  const { loadText, loadPath, write, fetch } = controller(...args);

  router.param('ref', ref);
  router.get('/:ref\.:ext?', loadText, write);
  router.get('/:ref/:path([^$]+)', loadPath, write);
  router.post('/fetch', fetch);

  return router;
}