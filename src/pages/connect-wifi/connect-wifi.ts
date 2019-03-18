import { Component } from '@angular/core';
import { Stations, ConnectionsProvider } from '../../providers';
import {IonicPage, PopoverController, ViewController, LoadingController, Loading, NavParams} from 'ionic-angular';
import {Network} from "../../models/network";
import { ConnectWifiComponent } from "../../components/connect-wifi/connect-wifi";
import {Station} from "../../models/station";

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
  station: Station;
  networks: Network[];
  currentSSID: String = '';
  popoverDisplayed: boolean = false;
  loading: Loading;
  refreshTimeout;
  dataWatcher;

  constructor(
    public stations: Stations,
    public connections: ConnectionsProvider,
    public viewController: ViewController,
    public navParams: NavParams,
    public popoverController: PopoverController,
    public loadingController: LoadingController
  ) {
    this.station = this.navParams.get('station');
    this.loading = this.loadingController.create({
      content: 'FECTHING_NETWORKS',
      dismissOnPageChange: true
    });
    this.loading.present();

    this.dataWatcher = connections.watchForIncomingData({
      next: function(received) {
        if (this.dataWatcher && !this.dataWatcher.closed) {
          if (received.stationId && received.route) {
            if (received.route === 'Wifi/getAll') {
              if (this.loading) this.loading.dismiss();
              this.networks = (received.data[0].value || []).sort((a, b) => a.quality - b.quality);
              this.refreshTimeout = setTimeout(this.refresh.bind(this), 5000);
            }

            if (received.route === 'Wifi/getCurrentSSID') {
              this.currentSSID = received.data.ssid;
              console.log('Currently connected to: ', this.currentSSID);
            }

            if (received.route === 'Wifi/connect') {
              if (this.loading) this.loading.dismiss();
              if (!received.data.connected) {
                if (!this.popoverDisplayed) {
                  this.presentPopover(received.data.ssid);
                  this.popoverDisplayed = true;
                }
              } else {
                this.popoverDisplayed = false;
                viewController.dismiss();
              }
            }
          }
        }
      }.bind(this),
      error: function (error) {
        if (this.loading) this.loading.dismiss();
        console.error(error);
      }.bind(this)
    });

    this.connections.send({
      route: 'Wifi/getCurrentSSID',
      address: this.station.address
    });
    this.refresh();
    // todo: handle remote management?
  }

  ionViewWillLeave() {
    if (this.loading) this.loading.dismiss();
    this.dataWatcher.unsubscribe();
    clearTimeout(this.refreshTimeout);
  }

  refresh() {
    this.connections.send({
      route: 'Wifi/getAll',
      address: this.station.address
    });
  }

  async connect(ssid) {
    this.loading = await this.loadingController.create({
      content: 'CONNECTING',
      dismissOnPageChange: true
    });
    this.loading.present();
    this.connections.send({
      route: 'Wifi/connect',
      address: this.station.address,
      ssid
    });
  }

  async disconnect(ssid) {
    this.loading = await this.loadingController.create({
      content: 'DISCONNECTING',
      dismissOnPageChange: true
    });
    this.loading.present();
    this.connections.send({
      route: 'Wifi/disconnect',
      address: this.station.address,
      ssid
    });
  }

  presentPopover(ssid) {
    const popover = this.popoverController.create(ConnectWifiComponent, {
      station: this.station,
      ssid: ssid
    });
    popover.onDidDismiss(() => this.popoverDisplayed = false);
    return popover.present();
  }

  cancel() {
    if (this.loading) this.loading.dismiss();
    this.viewController.dismiss();
  }
}
