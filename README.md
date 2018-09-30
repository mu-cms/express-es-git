# Express middleware for `es-git`

[`express-es-git`](https://github.com/mu-cms/express-es-git/) is a v4 [Express](https://expressjs.com/) [router middleware](http://expressjs.com/en/4x/api.html#router) that allows you to expose an [`es-git`](https://github.com/mariusGundersen/es-git/) repository for read over http(s).

## Installation

Install `express-es-git` with npm

```shell
npm install --save @mu-cms/express-es-git
```

## Usage

```javascript
const git = require('@mu-cms/express-es-git');
const { SPECS, HEAD } = require('@mu-cms/express-es-git/const');

// options is/are optional
const options = {
  specs: [ ref => ({}) ], // SPECS
  head: data => ({})      // HEAD
};
// es-git repository instance
const repo;
// app is an express/router instance
app.use(git(repo, options));
```

A full example can be found in [`mu-express`](https://github.com/mu-cms/mu-express).

## Routes

- `/:ref\.:ext?`
  Load by object sha1 or ref
- `/:ref/:path([^$]+)`
  Load by tree sha1 or ref and path