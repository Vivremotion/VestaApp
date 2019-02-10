import { NgModule } from '@angular/core';
import { PopoverComponent } from './popover/popover';
import { IonicModule } from "ionic-angular";
import {TranslateModule} from "@ngx-translate/core";
import { ItemComponent } from './item/item';

@NgModule({
	declarations: [
	  PopoverComponent,
    ItemComponent
  ],
	imports: [
	  IonicModule,
    TranslateModule.forChild(),
  ],
	exports: [
	  PopoverComponent,
    ItemComponent
  ]
})
export class ComponentsModule {}
