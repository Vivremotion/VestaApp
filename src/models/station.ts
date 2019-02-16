import {Network} from "./network";
export class Station {

  constructor(fields: any) {}

}

export interface Station {
  id: string;
  name: string;
  class: number;
  address: string;
  bluetoothConnected?: boolean;
  networks?: Array<Network>;
}
