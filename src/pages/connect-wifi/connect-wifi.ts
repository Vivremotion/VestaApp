import { Component } from '@angular/core';
import { Stations, ConnectionsProvider } from '../../providers';
import {IonicPage, PopoverController, ViewController} from 'ionic-angular';
import {Network} from "../../models/network";
import { ConnectWifiComponent } from "../../components/connect-wifi/connect-wifi";

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

  constructor(public stations: Stations, public connections: ConnectionsProvider, public viewController: ViewController, public popoverController: PopoverController) {
    connections.watchForIncomingData({
      next: function(received) {
        if (received.stationId && received.route) {
          if (received.route === 'Wifi/getAll') {
            this.networks = received.data[0].value;
          }
          if (received.route === 'Wifi/connectIfExists') {
            console.log(received);
            if (!received.data.connected) {
              this.presentPopover(received.data.ssid);
            } else {
              viewController.dismiss();
            }
          }
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });

    this.refresh();
    // todo: handle remote management?
  }

  refresh() {
    this.connections.send({
      route: 'Wifi/getAll'
    });
  }

  connect(ssid) {
    this.connections.send({
      route: 'Wifi/connectIfExists',
      ssid
    });
  }

  presentPopover(ssid) {
    const popover = this.popoverController.create(ConnectWifiComponent, {
      translucent: true,
      ssid: ssid
    });
    return popover.present();
  }

  cancel() {
    this.viewController.dismiss();
  }
}
