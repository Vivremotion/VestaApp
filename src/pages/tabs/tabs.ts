import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ListPage, SettingsPage, UserPage } from '../';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  ListPage = ListPage;
  SettingsPage = SettingsPage;
  UserPage = UserPage;

  listTitle = " ";
  settingsTitle = " ";
  userTitle = " ";

  constructor(public navCtrl: NavController, public translateService: TranslateService, public user: User) {
    translateService.get(['LIST_TITLE', 'SETTINGS_TITLE', 'USER_TITLE']).subscribe(values => {
      this.listTitle = values['LIST_TITLE'];
      this.settingsTitle = values['SETTINGS_TITLE'];
      this.userTitle = values['USER_TITLE'];
    });
  }
}
