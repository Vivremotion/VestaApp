export class Network {
  constructor(fields: any) {}
}

export interface Network {
  ssid: string;
  signal: string;
  quality: number;
  address: string;
  connected?: boolean;
}
