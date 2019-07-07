import { NgModule } from '@angular/core';
import { PopoverComponent } from './popover/popover';
import { ConnectWifiComponent } from './connect-wifi/connect-wifi';
import { IonicModule } from "ionic-angular";
import {TranslateModule} from "@ngx-translate/core";
import { ItemComponent } from './item/item';
import {UnitPipeModule} from "../pipes/unit/unit.module";

@NgModule({
	declarations: [
	  PopoverComponent,
    ItemComponent,
    ConnectWifiComponent
  ],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    UnitPipeModule
  ],
	exports: [
	  PopoverComponent,
    ItemComponent,
    ConnectWifiComponent
  ]
})
export class ComponentsModule {}
