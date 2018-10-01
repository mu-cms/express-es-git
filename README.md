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

- `GET` `/:ref\.:ext?`
  Load by object sha1 or ref
- `GET` `/:ref/:path([^$]+)`
  Load by tree sha1 or ref and path
- `POST` `/fetch`
  Fetches refspecs from url

### Examples

- `/testing/package.json`
  Load by tag ref
- `/master/package.json`
  Load by head ref
- `/0e3b9890a6af246cff7db2bd8b68ccfaba5b1c78/package.json`
  Load by tree hash
- `/166db7d969ef2db26bbc62127a276475828384a2.json`
  Load by blob hash (with `.ext` mime type)
- `/166db7d969ef2db26bbc62127a276475828384a2`
  Load by blob hash (with `application/octet-stream` mime type)

```shell
curl -X POST \
  http://127.0.0.1:8080/fetch \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'url=https://github.com/mu-cms/mu-express.git' \
  -d 'refs[]=refs/heads/*/refs/heads/*'
  ```
