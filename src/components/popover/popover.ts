import {Component, Input} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  actions: string[];

  constructor(public viewController: ViewController, public navParams: NavParams) {
    this.actions = this.navParams.get('actions');
    console.log(this.actions)
  }

  close(action) {
    console.log(event)
    this.viewController.dismiss(action);
  }
}
