import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api, public firebaseAuthentication: AngularFireAuth) { }

  /**
   * Login
   */
  login(account: any) {
    return this.firebaseAuthentication.auth.signInWithEmailAndPassword(account.email, account.password)
      .then(() => {
        this._loggedIn(this.firebaseAuthentication.auth.currentUser);
        if (!this._user) return Promise.reject('INVALID_CREDENTIALS');
        return Promise.resolve(this._user);
      });
  }

  /**
   * Create an account with an email and a password
   */
  signUpWithEmailAndPassword(account: any) {
    return this.firebaseAuthentication.auth.createUserWithEmailAndPassword(account.email, account.password)
      .then(() => {
        this._loggedIn(this.firebaseAuthentication.auth.currentUser);
        if (!this._user) return Promise.reject('PROBLEM_OCCURED');
        return Promise.resolve(this._user);
      });
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(user) {
    this._user = user;
  }

  /**
   * Returns the current user
   */
  get() {
    return this._user;
  }
}
