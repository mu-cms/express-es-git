const PromiseRouter = require('express-promise-router');
const param = require('./param');

module.exports = repo => {
  const router = new PromiseRouter();
  const controller = require('./controller')(repo);

  router.param('blob', param.sha1);
  router.get('/:blob', controller.mimeType, controller.loadBlob);
  router.get('/:tree/:path([^$]+)', controller.mimeType, controller.refToTree, controller.loadPath);

  return router;
}