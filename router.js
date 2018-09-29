const PromiseRouter = require('express-promise-router');

module.exports = (...args) => {
  const router = new PromiseRouter();
  const param = require('./param')(...args);
  const controller = require('./controller')(...args);

  router.param('ref', param.ref);
  router.get('/:ref\.:ext?', controller.loadText, controller.write);
  router.get('/:ref/:path([^$]+)', controller.loadPath, controller.write);

  return router;
}