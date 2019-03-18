import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationSettingsPage } from './station-settings';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    StationSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StationSettingsPage),
    TranslateModule.forChild()
  ],
})
export class StationSettingsPageModule {}
