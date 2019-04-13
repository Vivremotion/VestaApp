import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HighchartsChartModule } from 'highcharts-angular';

import { ItemDetailPage } from './item-detail';

@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HighchartsChartModule
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule { }
