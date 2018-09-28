const PromiseRouter = require('express-promise-router');
const param = require('./param');

module.exports = (repo, options) => {
  const router = new PromiseRouter();
  const controller = require('./controller')(repo, options);

  router.param('hash', param.sha1);
  router.get('/:hash\.:ext?', controller.loadText);
  router.get('/:tree/:path([^$]+)', controller.refToTree, controller.loadPath);

  return router;
}