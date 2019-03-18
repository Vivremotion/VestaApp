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
    'wifi',
    'disconnectBluetooth',
    'settings'
  ];

  constructor(public popoverController: PopoverController, public stations: Stations, public modalController: ModalController) { }

  disconnectBluetooth() {
    this.stations.disconnectBluetooth(this.station);
  }

  wifi() {
    const addModal = this.modalController.create('ConnectWifiPage', {
      station: this.station
    });
    addModal.present();
  }

  settings() {
    const addModal = this.modalController.create('StationSettingsPage', {
      station: this.station
    });
    addModal.present();
  }

  presentPopover(event: any) {
    const popover = this.popoverController.create(PopoverComponent, {
      actions: this.popoverActions,
      station: this.station
    });
    popover.onDidDismiss(action => {
      if (action) this[action]();
    });
    return popover.present({
      ev: event
    });
  }
}
