const { PORT = 8080, GIT_REMOTE = 'https://github.com/mu-cms/express-es-git.git' } = process.env;
const express = require('express');
const git = require('../router');
const api = require('../api')(`http://localhost:${PORT}`);
const { MemRepo } = require('./repo');

console.log(`Using MemRepo`);

express()
  .use(express.urlencoded({ extended: true }))
  .use(git(new MemRepo()))
  .listen(PORT, async () => {
    await api.fetch(GIT_REMOTE, 'refs/heads/*:refs/remotes/example/*');
    await api.refs('refs/heads/master:refs/remotes/example/master');
    console.log(`App started on port ${PORT}`);
  });
  