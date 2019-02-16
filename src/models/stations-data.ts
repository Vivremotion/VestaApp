export class StationsData {

  constructor(fields: any) {}

}

export interface StationsData {
  stationId: string;
  route: string,
  data: [{
    type: string,
    value: any,
    date?: Date
  }];
}

// todo: change place
export const types = ['TemperatureHumidity'];
