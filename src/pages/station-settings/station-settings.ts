import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  form: FormGroup;
  settings = {
    name: ''
  };

  constructor(
    public viewController: ViewController,
    public formBuilder: FormBuilder,
    public navParams: NavParams
  ) {
    this.settings.name = this.navParams.get('name');
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad StationSettingsPage');
  }

  ionViewWillEnter() {
  }

  save() {
    // todo: requete pour sauvegarder
    console.log(this.settings)
  }

  cancel() {
    this.viewController.dismiss();
  }
}
