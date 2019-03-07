import {Component, Input} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
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

  constructor(public viewController: ViewController, public navParams: NavParams, public connections: ConnectionsProvider) {
    this.ssid = this.navParams.get('ssid');

    connections.watchForIncomingData({
      next: function(received) {
        if (received.stationId && received.route) {
          if (received.route === 'Wifi/connect') {
            const connected = received.data.value;
            if (connected) {
              this.close();
            } else {
              console.log("Not connected");
            }
          }
        }
      }.bind(this),
      error: function (error) {
        console.error(error);
      }.bind(this)
    });
  }

  connect() {
    this.connections.send({
      route: 'Wifi/connect',
      ssid: this.ssid,
      passkey: this.passkey
    });
  }

  close() {
    this.viewController.dismiss();
  }
}
