import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { User } from '../../providers/user/user';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  // todo: user model
  userObject: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public user: User) {}

  ionViewWillEnter() {
    this.userObject = this.user.get();
    if (!this.userObject) {
      this.navCtrl.push('WelcomePage', {}, { animate: false });
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.user.logout();
    this.navCtrl.push('WelcomePage');
  }
}
