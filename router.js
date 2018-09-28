const PromiseRouter = require('express-promise-router');
const param = require('./param');

module.exports = (repo, options = { cache: true, mime: true }) => {
  const router = new PromiseRouter();
  const controller = require('./controller')(repo, options);

  router.param('blob', param.sha1);
  router.get('/:blob', controller.loadBlob);
  router.get('/:tree/:path([^$]+)', controller.refToTree, controller.loadPath);

  return router;
}