import { NgModule } from '@angular/core';
import { PopoverComponent } from './popover/popover';
import { ConnectWifiComponent } from './connect-wifi/connect-wifi';
import { IonicModule } from "ionic-angular";
import {TranslateModule} from "@ngx-translate/core";
import { ItemComponent } from './item/item';

@NgModule({
	declarations: [
	  PopoverComponent,
    ItemComponent,
    ConnectWifiComponent
  ],
	imports: [
	  IonicModule,
    TranslateModule.forChild(),
  ],
	exports: [
	  PopoverComponent,
    ItemComponent,
    ConnectWifiComponent
  ]
})
export class ComponentsModule {}
