<p align="center">
  <img alt="OS.js Logo" src="https://raw.githubusercontent.com/os-js/gfx/master/logo-big.png" />
</p>

[OS.js](https://www.os-js.org/) is an [open-source](https://raw.githubusercontent.com/os-js/OS.js/master/LICENSE) web desktop platform with a window manager, application APIs, GUI toolkit, filesystem abstractions and much more.

[![Support](https://img.shields.io/badge/patreon-support-orange.svg)](https://www.patreon.com/user?u=2978551&ty=h&u=2978551)
[![Support](https://img.shields.io/badge/opencollective-donate-red.svg)](https://opencollective.com/osjs)
[![Donate](https://img.shields.io/badge/liberapay-donate-yellowgreen.svg)](https://liberapay.com/os-js/)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/andersevenrud)
[![Community](https://img.shields.io/badge/join-community-green.svg)](https://community.os-js.org/)

# OS.js Auth0 Auth Provider Adapter

This is the Auth0 Auth Provider Adapter for OS.js.

**THIS IS A WORK IN PROGRESS**

Please see the [OS.js Authentication Guide](https://manual.os-js.org/v3/guide/auth/) for general information.

## Introduction

This adapter makes it possible to authenticate/authorize logins via Auth0.

The client will use the Auth0 "Lock" (login) and send the user profile to the server.

The server will inject middleware to protect the APIs.

This is the setup procedure:

1. Create your application on Auth0
2. Create your API on Auth0
3. Install this library
4. Set up the server
5. Set up the client

## Installation

```
npm install --save --production @osjs/auth0-auth
```

## Usage

### Configure Server

In your server configuration file (`src/server/config.js`):

```javascript
module.exports = {
  // Add the following section
  auth0: {
    jwksUri: 'https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json',
    audience: 'https://YOUR_AUDIENCE/',
    issuer: 'https://YOUR_AUTH0_DOMAIN/',
  }
};
```

In your server bootstrap script (`src/server/index.js`):

```javascript
// In the top of the file load the library
const auth0auth = require('@osjs/auth0-auth/server.js');

// Locate this line in the file and add the following:
osjs.register(AuthServiceProvider, {
  args: {
    adapter: auth0auth
  }
});
```

*A restart of the server is required*

### Configure Client

Add the following script to your `src/client/index.ejs` file:

```
<script src="https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js"></script>
```

In your client configuration file (`src/client/config.js`) file remove the automatic login:

```javascript
module.exports = {
  // Either comment out this section, or remove it entirely
  /*
  auth: {
    login: {
      username: 'demo',
      password: 'demo'
    }
  }
  */

  // Add the following section
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    audience: 'https://YOUR_AUDIENCE/'
  }
};
```

In your client bootstrap script (`src/client/index.js`):

```javascript
// In the top of the file load the library
import {Login} from '@osjs/auth0-auth';

// Locate this line in the file and add the following:
osjs.register(AuthServiceProvider, {
  before: true,
  args: {
    login: (core, options) => new Login(core, options)
  }
});
```

*Rebuilding the client is required*

## Contribution

* **Sponsor on [Github](https://github.com/sponsors/andersevenrud)**
* **Become a [Patreon](https://www.patreon.com/user?u=2978551&ty=h&u=2978551)**
* **Support on [Open Collective](https://opencollective.com/osjs)**
* [Contribution Guide](https://github.com/os-js/OS.js/blob/master/CONTRIBUTING.md)

## Documentation

See the [Official Manuals](https://manual.os-js.org/v3/) for articles, tutorials and guides.

## Links

* [Official Chat](https://gitter.im/os-js/OS.js)
* [Community Forums and Announcements](https://community.os-js.org/)
* [Homepage](https://os-js.org/)
* [Twitter](https://twitter.com/osjsorg) ([author](https://twitter.com/andersevenrud))
* [Google+](https://plus.google.com/b/113399210633478618934/113399210633478618934)
* [Facebook](https://www.facebook.com/os.js.org)
* [Docker Hub](https://hub.docker.com/u/osjs/)
