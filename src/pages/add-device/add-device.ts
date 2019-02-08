import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { IonicPage, NavController, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Stations } from '../../providers/';
import { Station } from '../../models/station';

const errorLog = (error) => console.error(error);

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

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastController: ToastController,
    public alertController: AlertController,
    public bluetooth: BluetoothSerial,
    public stations: Stations,
  ) {
    stations.watchConnected({
      next: function(connectedStations) {
        this.connectedStations = connectedStations;
      }.bind(this),
      error: error => console.error(error)
    });
    this.refreshDevices();
    setInterval(this.refreshDevices.bind(this), 30000);
  }

  refreshDevices(event?: any) {
    this.bluetooth.enable()
      .then(() => {
        this.bluetooth.discoverUnpaired()
          .then(devices => {
            this.firstRefresh = false;
            event && event.complete();
            console.log(devices);
            console.log(this.connectedStations);
            this.availableDevices = devices.filter((device) => {
              return !this.connectedStations.find((station) => device.id === station.id);
            });
          })
          .catch(errorLog);
        }
      )
      .catch(errorLog);
  }

  connect(device) {
    console.log(device);
    this.stations.connect(device)
      .then(_ => this.presentSuccessToast())
      .catch(error => this.presentErrorAlert(device, error));
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
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
