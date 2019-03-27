import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Api } from '../api/api';
import { Observable } from 'rxjs-compat';

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
  userObserver: Observable<any>;

  constructor(public api: Api, public firebaseAuthentication: AngularFireAuth, public db: AngularFirestore) { }

  /**
   * Login
   */
  login(account: any) {
    return this.firebaseAuthentication.auth.signInWithEmailAndPassword(account.email, account.password)
      .then(() => {
        const user = this.firebaseAuthentication.auth.currentUser;
        if (!user) return Promise.reject('INVALID_CREDENTIALS');
        return Promise.resolve(user);
      })
      .then((user:any) => {
        this.userObserver = this.db.collection('users', ref => ref.where('email', '==', user.email))
          .valueChanges();
        this.userObserver.subscribe(data => {
          console.log(data)
          if (!data.length) {
            delete account.password;
            this.db.collection('users').add(account);
          }
          this._loggedIn(data[0]);
        })
        return Promise.resolve(true);
      });
  }

  /**
   * Create an account with an email and a password
   */
  signUpWithEmailAndPassword(account: any) {
    return this.firebaseAuthentication.auth.createUserWithEmailAndPassword(account.email, account.password)
      .then(() => {
        const user = this.firebaseAuthentication.auth.currentUser;
        if (!user) return Promise.reject('PROBLEM_OCCURED');
        return Promise.resolve(user);
      })
      .then(() => {
        account.password = undefined;
        this.db.collection('users').add(account);
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
