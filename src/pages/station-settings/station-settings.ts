import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Station} from "../../models/station";
import {ConnectionsProvider} from "../../providers/connections/connections";
import {Stations} from "../../providers/stations/stations";

/**
 * Generated class for the StationSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-station-settings',
  templateUrl: 'station-settings.html',
})
export class StationSettingsPage {
  station: Station;
  form: FormGroup;
  settings:any = {
    name: ''
  };

  constructor(
    public viewController: ViewController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public connections: ConnectionsProvider,
    public stations: Stations
  ) {
    this.station = this.navParams.get('station');
    this.settings = this.station.settings;
    this._buildForm();
  }

  _buildForm() {
    const formProperties = {
      name: [this.settings.name, Validators.required]
    };

    this.form = this.formBuilder.group(formProperties);
    this.form.valueChanges.subscribe((v) => {
      this.settings = this.form.value;
    });
  }

  save() {
    this.station.name = this.settings.name;
    this.station.settings = { ...this.settings, ...{ new: false }};
    this.connections.send({
      route: 'Station/set',
      address: this.station.address,
      settings: this.station.settings
    });
    this.stations.upsert(this.station);
    this.viewController.dismiss();
  }

  cancel() {
    this.viewController.dismiss();
  }
}
