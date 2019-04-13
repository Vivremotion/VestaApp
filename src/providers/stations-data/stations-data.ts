import { Injectable } from '@angular/core';
import { StationsData } from '../../models';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { BehaviorSubject } from "rxjs";
import { Stations } from "../stations/stations";
import { types } from "../../models/stations-data";
import {ConnectionsProvider} from "../connections/connections";
import { AngularFirestore } from 'angularfire2/firestore';
import {User} from "../user/user";

/*
  Generated class for the StationsDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StationsDataProvider {
  user = {};
  dataSubject = new BehaviorSubject({});
  firestoreQueries = {};
  data = {};
  stations = [];

  constructor(public bluetooth: BluetoothSerial, public connections: ConnectionsProvider, stations:Stations, public userProvider: User, public db: AngularFirestore) {
    const appState = { isActive: true };
    document.addEventListener('pause', () => appState.isActive = false);
    document.addEventListener('resume', () => appState.isActive = true);

    setInterval(() => {
      if (appState.isActive && this.stations.length) {
        this.askDataToAllStations();
      }
    }, 10000);

    stations.watchConnected({
      next: function (stations) {
        this.stations = stations;
        this.askDataToAllStations();
        if (this.user && this.user.id) {
          this.stations.forEach(station => {
            if (!this.firestoreQueries[station.id]) {
              this.firestoreQueries[station.id] = db.collection('readings',
                  ref => ref.where('stationId', '==', station.id).orderBy('date', 'desc').limit(2)
              );
              this.firestoreQueries[station.id].valueChanges().subscribe(values => {
                values.forEach((data:any) => {
                  if (data.stationId) {
                    this.mergeAndGetChanges(data);
                    this.dataSubject.next(this.data);
                  }
                });
              });
            }
          });
        }
      }.bind(this)
    });

    connections.watchForIncomingData({
      next: function(data) {
        if (data.route) {
          const type = data.route.split('/')[0];
          if (data.stationId && types.indexOf(type) !== -1) {
            data.data.forEach(reading => {
              const readingObject = {
                stationId: data.stationId,
                value: reading.value,
                date: reading.date,
                type: reading.type
              };
              this.mergeAndGetChanges(readingObject);
              this.dataSubject.next(this.data);
            })
          }
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });

    userProvider.userSubject.subscribe({
      next: user => {
        this.user = user;
      }
    });
  }

  watch(observer) {
    this.dataSubject.subscribe(observer);
    return { unsubscribe: this.dataSubject.unsubscribe };
  }

  askData(station, type) {
    this.connections.send({
      route: `${type}/get`,
      address: station.address
    })
      .catch(error => console.error(error));
  }

  askDataForDateAndStation(station, start, end) {
    return this.db.collection('readings',
      ref => ref.where('stationId', '==', station.id)
        .where('date', '>=', start.toString())
        .where('date', '<=', end.toString())
        .orderBy('date', 'desc')
    );
  }

  askDataToAllStations() {
    types.forEach(type => {
      this.stations.filter(station => station.bluetoothConnected).forEach((station) => {
        this.askData(station, type);
      })
    })
  }

  mergeAndGetChanges(data: StationsData): StationsData {
    if (!this.data[data.stationId]) {
      this.data[data.stationId] = [];
    }
    this.data[data.stationId].push(data);
    return data;
  }
}
