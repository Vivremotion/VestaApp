export class StationsData {

  constructor(fields: any) {}

}

export interface StationsData {
  stationId: string;
  data: [{
    type: string,
    value: any,
    date?: Date
  }];
}

export const types = ['TemperatureHumidity'];
