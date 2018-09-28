const validator = require('validator');
const { NEXT } = require('./const');

exports.sha1 = async (req, res, next, hash) => {
  if (!validator.isHash(hash, 'sha1')) {
    res.status(400);
    throw new Error(`${hash} has to be sha1`);
  }
  else {
    return NEXT;
  }
}