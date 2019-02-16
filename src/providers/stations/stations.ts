import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BehaviorSubject } from "rxjs";

import { Station } from '../../models/station';
import {Network} from "../../models/network";

@Injectable()
export class Stations {
  stations: Station[];
  stationsSubject: BehaviorSubject<Station[]> = new BehaviorSubject([]);
  connectedStations = [];
  connectedStationsSubject: BehaviorSubject<Station[]> = new BehaviorSubject([]);
  availableStationsSubject: BehaviorSubject<Station[]> = new BehaviorSubject([]);

  constructor(public storage: Storage, public bluetooth: BluetoothSerial) {
    this.getStored().then((storedStations => {
      storedStations.forEach((station, index, array) => array[index].bluetoothConnected = false);
      this.stations = storedStations;
      this.stationsSubject.next(storedStations);
      this.stationsSubject.subscribe({
        next: function (stations) {
          this.connectedStations = stations.filter(station => station.bluetoothConnected);
          this.connectedStationsSubject.next(this.connectedStations);
        }.bind(this)
      });
    }));

    this.scanBluetooth();
    setInterval(this.scanBluetooth.bind(this), 60000);
  }

  scanBluetooth() {
    this.bluetooth.enable()
      .then(() => {
        this.bluetooth.discoverUnpaired()
          .then(devices => {
            console.log(devices);
            console.log(this.stations);
            const availableDevices = devices.filter((device) => {
              return !this.connectedStations.find((station) => device.id === station.id);
            });
            this.availableStationsSubject.next(availableDevices);

          })
          .catch(error => console.error(error));
        }
      )
      .catch(error => console.error(error));
  }

  connectBluetooth(station: Station) {
    const deviceConnection = this.bluetooth.connect(station.address);
    return new Promise((resolve, reject) => {
      deviceConnection.subscribe({
        next: function() {
          station.bluetoothConnected = true;
          this.upsert(station);
          this.bluetooth.write(JSON.stringify({route: 'Test/do'}))
            .catch(e => console.error(e));
          resolve(true);
        }.bind(this),
        error: function(error) {
          station.bluetoothConnected = false;
          this.upsert(station);
          console.error(error);
          reject(error);
        }.bind(this)
      });
    });
  }

  disconnectBluetooth(station) {
    this.bluetooth.disconnect()
      .then(_ => {
        station.bluetoothConnected = false;
        this.upsert(station);
      });
  }

  requestAvailableNetworks(station) {
    this.bluetooth.write(JSON.stringify({
      route: 'Wifi/getAll'
    }));
  }

  setAvailableNetworks(stationId: string, networks: Array<Network>) {
    const station = this.find(stationId);
    station.networks = networks;
    this.upsert(station);
  }

  watchConnected(observer) {
    this.connectedStationsSubject.subscribe(observer);
    return { unsubscribe: this.connectedStationsSubject.unsubscribe };
  }

  watchAvailable(observer) {
    this.availableStationsSubject.subscribe(observer);
    return { unsubscribe: this.availableStationsSubject.unsubscribe };
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

  find(id: string) {
    return this.stations.find(station => station.id === id);
  }

  delete(station: Station) {
    this.stations.splice(this.stations.indexOf(station), 1);
    this.stationsSubject.next(this.stations);
    this.storage.set('stations', JSON.stringify(this.stations));
    return this.stations;
  }
}
