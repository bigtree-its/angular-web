import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor() {}

  public isEmpty(data: string): Boolean {
    if ( data === null || data === undefined || data.length === 0){
        return true;
    }
    return false;
  }

  public isValid(data: any): Boolean {
    if ( data === null || data === undefined ){
        return true;
    }
    return false;
  }

  public isEquals(data: string, data2: string): Boolean {
    if ( data === data2 ){
        return true;
    }
    return false;
  }
}