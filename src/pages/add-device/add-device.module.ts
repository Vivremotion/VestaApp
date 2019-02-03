import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { AddDevicePage } from './add-device';

@NgModule({
  declarations: [
    AddDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(AddDevicePage),
    TranslateModule.forChild(),
  ],
  exports: [
    AddDevicePage
  ],
  providers: []
})
export class AddDevicePageModule { }
