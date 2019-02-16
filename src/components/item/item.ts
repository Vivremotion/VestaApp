import {Component, Input} from '@angular/core';
import {PopoverComponent} from "../popover/popover";
import {ModalController, PopoverController} from "ionic-angular";
import {Stations} from "../../providers";

/**
 * Generated class for the ItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item',
  templateUrl: 'item.html'
})
export class ItemComponent {
  @Input() station;
  @Input() data;

  popoverActions = [
    'connectWifi',
    'DISCONNECT_WIFI',
    'disconnectBluetooth'
  ];

  constructor(public popoverController: PopoverController, public stations: Stations, public modalController: ModalController) { }

  disconnectBluetooth() {
    this.stations.disconnectBluetooth(this.station);
  }

  connectWifi() {
    const addModal = this.modalController.create('ConnectWifiPage');
    addModal.present();
  }

  presentPopover(event: any) {
    const popover = this.popoverController.create(PopoverComponent, {
      actions: this.popoverActions
    });
    popover.onDidDismiss(action => {
      this[action]();
    })
    return popover.present({
      ev: event
    });
  }
}
