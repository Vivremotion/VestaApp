import {Component, Input} from '@angular/core';
import {Loading, LoadingController, NavParams, ViewController} from "ionic-angular";
import {ConnectionsProvider} from "../../providers/connections/connections";

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'connect-wifi-popover',
  templateUrl: 'connect-wifi.html'
})
export class ConnectWifiComponent {
  ssid: string;
  passkey: string;
  loading: Loading;
  wrongPassword: boolean = false;
  dataWatcher;

  constructor(
    public viewController: ViewController,
    public navParams: NavParams,
    public connections: ConnectionsProvider,
    public loadingController: LoadingController
  ) {
    this.ssid = this.navParams.get('ssid');

    this.dataWatcher = connections.watchForIncomingData({
      next: function(received) {
        if (this.dataWatcher && !this.dataWatcher.closed) {
          if (received.stationId && received.route) {
            if (received.route === 'Wifi/connect') {
              if (this.loading) this.loading.dismiss();
              const connected = received.data.value;
              if (connected) {
                this.close();
              } else {
                this.wrongPassword = true;
                console.log("Not connected");
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
  }

  ionViewWillLeave() {
    if (this.loading) this.loading.dismiss();
    this.dataWatcher.unsubscribe()
  }

  async connect() {
    this.loading = await this.loadingController.create({
      content: 'CONNECTING',
      dismissOnPageChange: true
    });
    this.loading.present();

    this.connections.send({
      route: 'Wifi/connect',
      ssid: this.ssid,
      passkey: this.passkey
    });
  }

  close() {
    if (this.loading) this.loading.dismiss();
    this.viewController.dismiss();
  }
}
