import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'formatedOutputValue'
})
export class MyCurrencyPipe implements PipeTransform {

 transform(value: number, args?: any): number {
  return Number.parseInt(value.toFixed(2).replace(/[.,]00£/, ""));
 }
}