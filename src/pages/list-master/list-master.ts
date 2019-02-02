import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Station } from '../../models/station';
import { Stations } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentStations: Station[];

  constructor(public navCtrl: NavController, public stations: Stations, public modalCtrl: ModalController) {
    stations.get()
      .then(stations => this.currentStations = stations);
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  updateStationsList() {
    this.stations.get()
      .then(stations => this.currentStations = stations);
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('AddDevicePage');
    addModal.onDidDismiss(this.updateStationsList.bind(this));
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
