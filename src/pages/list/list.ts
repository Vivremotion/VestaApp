import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Station } from '../../models/station';
import { Stations } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  currentStations: Station[];

  constructor(public navCtrl: NavController, public stations: Stations, public modalCtrl: ModalController) {
    stations.watchConnected({
      next: function (connectedStations) {
        console.log('list', connectedStations);
        this.currentStations = connectedStations;
      }.bind(this)
    })
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('AddDevicePage');
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.stations.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(station: Station) {
    this.navCtrl.push('ItemDetailPage', {
      item: station
    });
  }
}
