import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor() {}

  isEmpty(data: string): Boolean {
    if ( data === null || data === undefined || data.length === 0){
        return true;
    }
    return false;
  }

  isValid(data: any): Boolean {
    if ( data === null || data === undefined ){
        return true;
    }
    return false;
  }
}