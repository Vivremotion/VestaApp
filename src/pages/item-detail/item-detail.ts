import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Highcharts from 'highcharts';

import {Station} from "../../models/station";
import {StationsDataProvider} from "../../providers/stations-data/stations-data";

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  objectKeys = Object.keys;
  Highcharts = Highcharts;
  station: Station;
  dataQuery: any;
  lastData = [];
  start: Date;
  end: Date;
  charts = {};

  constructor(public navCtrl: NavController, navParams: NavParams, public stationsData: StationsDataProvider) {
    this.station = navParams.get('station');
    this.lastData = navParams.get('lastData');
  }

  askDataForDates() {
    if (this.dataQuery && this.dataQuery.unsubscribe) {
      this.dataQuery.unsubscribe();
    }

    if (!this.start || !this.end) {
      return;
    }

    if (this.start >= this.end) {
      // Todo: show error
      return;
    }

    this.charts = {};

    this.dataQuery = this.stationsData.askDataForDateAndStation(this.station, this.start, this.end)
      .valueChanges();
    this.dataQuery.subscribe((data) => {
      data.forEach((reading) => {
        if (!this.charts[reading.type]) {
          this.charts[reading.type] = { series: [{ type: 'line', data: []}] };
          this.charts[reading.type].title = { text: reading.type };
          this.charts[reading.type].yAxis = { title: { text: reading.type }};
          this.charts[reading.type].xAxis = { title: { text: 'date' }};
          this.charts[reading.type].legend = { enabled: false };
        }

        this.charts[reading.type].series[0].data.push({
          x: new Date(reading.date),
          y: reading.value
        });
      });

      console.log(this.charts)
    });
  }
}
