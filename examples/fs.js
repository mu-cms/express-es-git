const { PORT = 8080, GIT_PATH = '../.git' } = process.env;
const express = require('express');
const git = require('../router');
const { FsRepo } = require('./repo');

console.log(`Using FsRepo ${GIT_PATH}`);

express()
  .use(express.urlencoded({ extended: true }))
  .use(git(new FsRepo(GIT_PATH)))
  .listen(PORT, async () => console.log(`App started on port ${PORT}`));
  