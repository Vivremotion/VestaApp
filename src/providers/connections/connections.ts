import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";

import { Stations } from '../stations/stations';

function isJSON(text) {
  return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
}

@Injectable()
export class ConnectionsProvider {
  dataSubject = new BehaviorSubject({});
  data = {};

  constructor(public http: HttpClient, public bluetooth: BluetoothSerial) {
    const bus = bluetooth.subscribe('\n');
    bus.subscribe({
      next: function(data) {
        if (isJSON(data)) data = JSON.parse(data);
        this.dataSubject.next(data);
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });
  }

  async send(anObject) {
    return await Promise.all([
      new Promise((resolve, reject) => {
        this.bluetooth.write(JSON.stringify(anObject))
          .then(resolve)
          .catch(reject);

        // todo: add http requests
      })
    ]);
  }

  watchForIncomingData(observer) {
    this.dataSubject.subscribe(observer);
    return { unsubscribe: this.dataSubject.unsubscribe };
  }
}
