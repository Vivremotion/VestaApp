import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { IonicPage, NavController, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Stations } from '../../providers/';
import { connect } from 'http2';

const errorLog = (error) => console.error(error);

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html'
})
export class AddDevicePage {
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  pairedStations: any[];
  availableDevices: any[];
  firstRefresh: Boolean = true;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastController: ToastController,
    public alertController: AlertController,
    formBuilder: FormBuilder,
    public bluetooth: BluetoothSerial,
    public stations: Stations,
  ) {
    this.refreshDevices();
    console.log(stations)
    stations.get()
      .then(stations => this.pairedStations = stations);
    this.form = formBuilder.group({
      name: ['', Validators.required],
      profilePic: [''],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  refreshDevices(event?: any) {
    this.bluetooth.enable()
      .then(() => {
          this.bluetooth.discoverUnpaired()
            .then(devices => {
              this.firstRefresh = false;
              event && event.complete();
              this.availableDevices = devices;
            })
            .catch(errorLog);
        }
      )
      .catch(errorLog);
  }

  connect(device) {
    console.log(device);
    const deviceConnection = this.bluetooth.connect(device.address);
    deviceConnection.subscribe({
      next: function() {
        this.stations.add(device);
        this.presentSuccessToast();
      }.bind(this),
      error: function(error) {
        errorLog(error);
        this.presentErrorAlert(device, error)
      }.bind(this)
    });
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
