import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import {
  IonicPage, NavController, ViewController, AlertController, ToastController,
  LoadingController
} from 'ionic-angular';
import { Stations } from '../../providers/';
import { Station } from '../../models/station';

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html'
})
export class AddDevicePage {
  item: any;
  availableDevices: any[];
  connectedStations: Station[];
  firstRefresh: Boolean = true;
  loading;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastController: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public bluetooth: BluetoothSerial,
    public stations: Stations,
  ) {
    stations.watchConnected({
      next: function(connectedStations) {
        this.connectedStations = connectedStations;
      }.bind(this),
      error: error => console.error(error)
    });
    stations.watchAvailable({
      next: function(availableDevices) {
        this.availableDevices = availableDevices;
      }.bind(this),
      error: error => console.error(error)
    });
  }

  async connect(device) {
    this.loading = await this.loadingController.create({
      content: 'CONNECTING',
      dismissOnPageChange: true
    });
    this.loading.present();

    this.stations.connectBluetooth(device)
      .then(_ => {
        this.loading.dismiss();
        this.presentSuccessToast();
        this.viewCtrl.dismiss();
      })
      .catch(error => {
        this.loading.dismiss();
        this.presentErrorAlert(device, error);
      });
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLeave() {
    if (this.loading) this.loading.dismiss();
  }

  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Connection successful',
      showCloseButton: true,
      cssClass: 'success',
      position: 'bottom',
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  async presentErrorAlert(device, error) {
    const alert = await this.alertController.create({
      title: 'Connection failed',
      message: error,
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Retry',
          handler: () => {
            this.connect(device);
          }
      }]
    });

    await alert.present();
  }
}
