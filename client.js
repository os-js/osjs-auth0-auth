import {EventEmitter} from '@osjs/event-emitter';

export class Login extends EventEmitter {

  /**
   * @param {Core} core Core reference
   * @param {Object} [options] Options
   */
  constructor(core, options) {
    super('Auth0Login');

    this.core = core;
    this.options = options;
  }

  /**
   * Initializes the UI
   */
  init(startHidden) {
    if (!window.auth0) {
      alert('Auth0 was not loaded. Unable to log in');
    }

    this.core.on('osjs/core:logged-out', () => this._logout());

    this.render(startHidden);
  }

  /**
   * Destroys the UI
   */
  destroy() {
  }

  /**
   * Renders the UI
   */
  render() {
    const auth0options = Object.assign({
      domain: 'YOUR_AUTH0_DOMAIN',
      clientID: 'YOUR_CLIENT_ID',
      responseType: 'token id_token',
      scope: 'email profile openid',
      audience: 'https://YOUR_AUDIENCE/',
      redirectUri: window.location.href
    }, this.core.config('auth0', {}));

    const webAuth = new window.auth0.WebAuth(Object.assign({}, auth0options));

    const login = authResult => {
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginExpiration', expiresAt);

      this.core.setRequestOptions({
        headers: {
          authorization: `Bearer ${authResult.accessToken}`
        }
      });

      this.emit('login:post', {
        id: authResult.idTokenPayload.sub,
        username: authResult.idTokenPayload.email
      });
    };

    if (this._isAuthenticated()) {
      webAuth.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          login(authResult);
        } else if (err) {
          console.error(err);

          this._logout();
        }

        webAuth.authorize();
      });
    } else {
      webAuth.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';

          login(authResult);
        } else if (err) {
          console.error(err);

          alert('Error: ' + err.error + '. Check the console for further details.');
        } else {
          webAuth.authorize();
        }
      });
    }
  }

  _logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginExpiration');
  }

  _isAuthenticated() {
    const expiresAt = localStorage.getItem('loginExpiration');
    const expiration = parseInt(expiresAt, 10) || 0;

    return localStorage.getItem('isLoggedIn') === 'true' &&
      new Date().getTime() < expiration;
  }
}
