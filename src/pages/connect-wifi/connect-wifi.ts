import { Component } from '@angular/core';
import { Stations, ConnectionsProvider } from '../../providers';
import {IonicPage, PopoverController, ViewController, LoadingController, Loading} from 'ionic-angular';
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
  loading: Loading;

  constructor(
    public stations: Stations,
    public connections: ConnectionsProvider,
    public viewController: ViewController,
    public popoverController: PopoverController,
    public loadingController: LoadingController
  ) {
    this.loading = this.loadingController.create({
      content: 'FECTHING_NETWORKS'
    })
    this.loading.present();

    connections.watchForIncomingData({
      next: function(received) {
        if (received.stationId && received.route) {
          if (received.route === 'Wifi/getAll') {
            if (this.loading) this.loading.dismiss();
            this.networks = received.data[0].value;
          }
          if (received.route === 'Wifi/connect') {
            console.log(received);
            if (this.loading) this.loading.dismiss();
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

  async connect(ssid) {
    this.loading = await this.loadingController.create({
      content: 'CONNECTING'
    });
    this.loading.present();
    this.connections.send({
      route: 'Wifi/connect',
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
