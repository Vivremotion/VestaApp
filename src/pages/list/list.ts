import { Component, NgZone } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Station } from '../../models';
import { Stations } from '../../providers';
import {StationsDataProvider} from "../../providers/stations-data/stations-data";;

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  currentStations: Station[];
  stationsData = {};
  watchers = [];

  constructor(public navCtrl: NavController, public stations: Stations, public modalCtrl: ModalController, stationsData: StationsDataProvider, zone: NgZone) {
    const stationsWatcher = stations.watchConnected({
      next: function (connectedStations) {
        this.currentStations = connectedStations;
      }.bind(this)
    });

    const stationsDataWatcher = stationsData.watch({
      next: function (data) {
        zone.run(() => {
          if (data.stationId) this.stationsData[data.stationId] = data;
          console.log('list', this.stationsData)
        });
      }.bind(this)
    });

    this.watchers = [stationsWatcher, stationsDataWatcher];
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
