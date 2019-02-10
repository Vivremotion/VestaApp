import {Component, Input} from '@angular/core';
import {PopoverComponent} from "../popover/popover";
import {PopoverController} from "ionic-angular";
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
    'CONNECT_WIFI',
    'DISCONNECT_WIFI',
    'disconnectBluetooth'
  ];

  constructor(public popoverController: PopoverController, public stations: Stations) { }

  disconnectBluetooth() {
    this.stations.disconnect(this.station);
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
