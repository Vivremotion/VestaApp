import { Injectable } from '@angular/core';
import { StationsData } from '../../models';
import { types } from '../../models/stations-data'; // todo: change place
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { BehaviorSubject } from "rxjs";
import { Stations } from "../stations/stations";

/*
  Generated class for the StationsDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StationsDataProvider {
  dataSubject = new BehaviorSubject({});
  data = {};
  stations = [];

  constructor(public bluetooth: BluetoothSerial, stations: Stations) {
    stations.watchConnected({
      next: function (stations) {
        this.stations = stations;
        types.forEach(type => {
          this.askData(type);
        })
      }.bind(this)
    });

    // Watch for incoming data on bluetooth
    const bus = bluetooth.subscribe('\n');
    bus.subscribe({
      next: function(data) {
        console.log('data provider', data)
        try {
          if (typeof data === 'string') data = JSON.parse(data);
        } catch (error) {
          console.error(error);
        }
        if (data.stationId) {
          const update = this.mergeAndGetChanges(data);
          this.dataSubject.next(update);
          console.log('update', update)
          console.log('data', this.data)
        } else {
          console.log(data);
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });

    setInterval(() => {
      console.log(this.stations.length)
      if (this.stations.length) {
        types.forEach(type => this.askData(type))
      }
    }, 10000);
  }

  watch(observer) {
    this.dataSubject.subscribe(observer);
    return { unsubscribe: this.dataSubject.unsubscribe };
  }

  askData(type) {
    console.log(type)
    this.bluetooth.write(JSON.stringify({
      route: `${type}/get`
    }))
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  mergeAndGetChanges(data: StationsData): StationsData {
    const stationData = this.data[data.stationId];

    if (stationData && stationData.data) {
      data.data.forEach((dataElement, index) => {
        for (let i=0; i<stationData.data.length; i++) {
          if (stationData.data[i].type === dataElement.type) {
            stationData[i] = dataElement;
            data.data.splice(1, index);
          }
        }
      });
      stationData.push(...data.data);
    } else this.data[data.stationId] = data.data;

    return {
      stationId: data.stationId,
      data: data.data
    };
  }
}
