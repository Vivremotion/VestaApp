import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Api } from '../api/api';
import { BehaviorSubject } from 'rxjs';
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
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);

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
        this.userObserver = this.db.collection('users').doc(user.uid)
          .valueChanges();
        this.userObserver.subscribe(data => {
          if (!data) {
            delete account.password;
            return this.db.collection('users').doc(user.uid).set(account);
          }
          data.id = user.uid;
          this._loggedIn(data);
        });
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
      .then((user) => {
        delete account.password;
        this.db.collection('users').doc(user.uid).set(account);
        account.id = user.uid;
        this._loggedIn(account);
        return Promise.resolve(true);
      });
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.userSubject.next(null);
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(user) {
    this._user = user;
    this.userSubject.next(this._user);
  }

  /**
   * Returns the current user
   */
  get() {
    return this._user;
  }
}
