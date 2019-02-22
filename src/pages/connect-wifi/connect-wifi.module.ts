import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectWifiPage } from './connect-wifi';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ConnectWifiPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectWifiPage),
    IonicPageModule.forChild(ConnectWifiPage),
    TranslateModule.forChild()
  ],
})
export class ConnectWifiPageModule {}
