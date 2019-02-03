export class Station {

  constructor(fields: any) {}

}

export interface Station {
  id: string;
  name: string;
  class: number;
  address: string;
  connected?: boolean;
}
