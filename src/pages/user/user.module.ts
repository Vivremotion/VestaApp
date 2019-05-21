import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPage),
    TranslateModule.forChild()
  ],
})
export class UserPageModule {}
