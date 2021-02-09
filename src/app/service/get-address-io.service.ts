import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Distance, PostcodeLookupResult } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class GetAddressIOService {

  private ADDRESS_FINDER_URL = environment.POSTCODELOOKUP_SERVICE_URL;
  private DISTANCE_SERVICE_URL = environment.DISTANCE_SERVICE_URL;
  private API_KEY = environment.API_KEY_GETADDRESS_IO;
  private ORIGIN_POSTCODE = environment.ORIGIN_POSTCODE;


  constructor(
    private http: HttpClient
  ) { }

  lookupAddresses(postcode: String): Observable<PostcodeLookupResult> {
    console.log('Fetching addresses for postcode ', postcode);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    var params = new HttpParams();
    params = params.set('expand', "true");
    params = params.set('api-key', this.API_KEY);

    return this.http.get<PostcodeLookupResult>(this.ADDRESS_FINDER_URL + "/" + postcode, { headers: headers, params: params }) as Observable<PostcodeLookupResult>;
  }


  getDistance(postcode: String): Observable<Distance> {
    console.log('Getting distance to postcode ', postcode);
    if (this.ORIGIN_POSTCODE === undefined || postcode === undefined) {
      console.log('Cannot calculate distance to delivery address (Origin and Destination) postcodes are mandatory: ');
      return null;
    }
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    var params = new HttpParams();
    params = params.set('api-key', this.API_KEY);

    var originPostcode = this.ORIGIN_POSTCODE.replace(/\s/g, "")
    var destinationPostcode = postcode.replace(/\s/g, "")
    return this.http.get<Distance>(this.DISTANCE_SERVICE_URL + "/" + originPostcode + "/" + destinationPostcode, { headers: headers, params: params }) as Observable<Distance>;
  }

}
