import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { User } from '../../providers/user/user'

import { MainPage } from '../';
import {UserPage} from "../user/user";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  constructor(public navCtrl: NavController, user: User) {
    user.userSubject.subscribe({
      next(user) {
        if (user) {
          navCtrl.push('TabsPage');
        }
      }
    })
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  later() {
    if (this.navCtrl.parent && this.navCtrl.parent.select) {
      this.navCtrl.push(UserPage);
      this.navCtrl.parent.select(0);
    } else {
      this.navCtrl.push(MainPage);
    }
  }
}
