import {Component, Input} from '@angular/core';
import {ModalController, NavController, PopoverController} from "ionic-angular";

import {PopoverComponent} from "../popover/popover";
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
  lastData=[]

  popoverActions = [];

  constructor(public popoverController: PopoverController, public stations: Stations, public modalController: ModalController, public navCtrl: NavController) {}

  ngOnChanges() {
    this.popoverActions = [
      'settings'
    ];

    if (this.data) {
      this.lastData = [];
      for (let i=this.data.length-1; i>=0; i--) {
        const reading = this.data[i];
        if (!this.lastData.find((data) => data.type === reading.type)) {
          this.lastData.push(reading);
        }
      }
    }

    if (this.station.settings && this.station.settings.new) {
      this.station.settings.new = false;
      this.settings();
    }

    if (this.station.bluetoothConnected) {
      this.popoverActions.push('wifi', 'disconnectBluetooth');
    }
  }

  showDetails() {
    this.navCtrl.push('ItemDetailPage', {
      station: this.station,
      lastData: this.lastData
    })
  }

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
    event.stopPropagation();

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
