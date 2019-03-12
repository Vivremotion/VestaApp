import { Injectable } from '@angular/core';
import { StationsData } from '../../models';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { BehaviorSubject } from "rxjs";
import { Stations } from "../stations/stations";
import { types } from "../../models/stations-data";
import {ConnectionsProvider} from "../connections/connections";

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

  constructor(public bluetooth: BluetoothSerial, public connections: ConnectionsProvider, stations:Stations) {
    const appState = { isActive: true };
    document.addEventListener('pause', () => appState.isActive = false);
    document.addEventListener('resume', () => appState.isActive = true);

    setInterval(() => {
      if (appState.isActive && this.stations.length) {
        types.forEach(type => this.askData(type))
      }
    }, 10000);

    stations.watchConnected({
      next: function (stations) {
        this.stations = stations;
        types.forEach(type => {
          this.askData(type);
        })
      }.bind(this)
    });

    connections.watchForIncomingData({
      next: function(data) {
        if (data.route) {
          const type = data.route.split('/')[0];
          if (data.stationId && types.indexOf(type) !== -1) {
            const update = this.mergeAndGetChanges(data);
            this.dataSubject.next(update);
          }
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });
  }

  watch(observer) {
    this.dataSubject.subscribe(observer);
    return { unsubscribe: this.dataSubject.unsubscribe };
  }

  askData(type) {
    this.connections.send({
      route: `${type}/get`
    })
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

    return data;
  }
}
