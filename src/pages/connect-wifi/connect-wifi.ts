import { Component } from '@angular/core';
import { Stations, ConnectionsProvider } from '../../providers';
import { IonicPage, ViewController } from 'ionic-angular';
import {Network} from "../../models/network";

/**
 * Generated class for the ConnectWifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect-wifi',
  templateUrl: 'connect-wifi.html',
})
export class ConnectWifiPage {
  networks: Network[];

  constructor(public stations: Stations, connections: ConnectionsProvider, public viewController: ViewController) {
    connections.watchForIncomingData({
      next: function(received) {
        if (received.stationId && received.route && received.route === 'Wifi/getAll') {
          this.networks = received.data[0].value;
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });

    connections.send({
      route: 'Wifi/getAll'
    });

    // todo: handle remote management?
  }

  cancel() {
    this.viewController.dismiss();
  }
}
