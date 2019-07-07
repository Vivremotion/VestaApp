import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'unit'})
export class UnitPipe implements PipeTransform {
  private units = {
    temperature: '°C',
    humidity: '%'
  }

  transform(type: string): string {
    return this.units[type] || '';
  }
}
