import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Station } from '../../models/station';

@Injectable()
export class Stations {
  constructor(public storage: Storage) { }

  add(station: Station) {
    this.get()
      .then((stations) => {
        if (stations.indexOf(station) === -1) {
          stations.push(station);
          this.storage.set('stations', JSON.stringify(stations));
          return stations;
        }
      });
  }

  get() {
    return this.storage.get('stations')
      .then(stations => {
        console.log(stations)
        return JSON.parse(stations) || [];
      });
  }

  delete(station: Station) {
    this.get()
      .then(stations => {
        const index = stations.indexOf(station);
        if ( index !== -1) {
          stations.splice(index, 1);
          this.storage.set('stations', JSON.stringify(stations));
          return stations;
        }
      });
  }
}
