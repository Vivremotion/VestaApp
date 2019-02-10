import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListPage } from './list';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ListPage
  ],
  imports: [
    IonicPageModule.forChild(ListPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ListPage
  ]
})
export class ListPageModule { }
