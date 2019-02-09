import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BehaviorSubject } from "rxjs";

import { Station } from '../../models/station';

@Injectable()
export class Stations {
  stations: Station[];
  stationsSubject: BehaviorSubject<Station[]> = new BehaviorSubject([]);
  connectedStationsSubject: BehaviorSubject<Station[]> = new BehaviorSubject([]);

  constructor(public storage: Storage, public bluetooth: BluetoothSerial) {
    this.getStored().then((storedStations => {
      storedStations.forEach((station, index, array) => array[index].connected = false);
      this.stations = storedStations;
      this.stationsSubject.next(storedStations);
      this.stationsSubject.subscribe({
        next: function (stations) {
          const connectedStations = stations.filter(station => station.connected);
          this.connectedStationsSubject.next(connectedStations);
        }.bind(this)
      });
    }));
  }

  connect(station: Station) {
    const deviceConnection = this.bluetooth.connect(station.address);
    return new Promise((resolve, reject) => {
      deviceConnection.subscribe({
        next: function() {
          station.connected = true;
          this.upsert(station);
          this.bluetooth.write(JSON.stringify({route: 'Test/do'}))
            .catch(e => console.error(e));
          resolve(true);
        }.bind(this),
        error: function(error) {
          station.connected = false;
          this.upsert(station);
          console.error(error);
          reject(error);
        }.bind(this)
      });
    });
  }

  watchConnected(observer) {
    this.connectedStationsSubject.subscribe(observer);
    return { unsubscribe: this.connectedStationsSubject.unsubscribe };
  }

  upsert(station: Station) {
    let index = this.stations.indexOf(station);
    if (index === -1) {
      this.stations.push(station);
    } else {
      this.stations[index] = station;
    }

    this.stationsSubject.next(this.stations);
    this.storage.set('stations', JSON.stringify(this.stations));
  }

  getStored() {
    return this.storage.get('stations')
      .then(stations => {
        return JSON.parse(stations) || [];
      });
  }

  delete(station: Station) {
    this.stations.splice(this.stations.indexOf(station), 1);
    this.stationsSubject.next(this.stations);
    this.storage.set('stations', JSON.stringify(this.stations));
    return this.stations;
  }
}
