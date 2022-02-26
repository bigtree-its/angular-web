import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RapidApiByPostcodeResponse, RapidApiResult } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class RapidApiService {

  private ADDRESS_FINDER_URL = environment.POSTCODELOOKUP_SERVICE_URL;
  private DISTANCE_SERVICE_URL = environment.DISTANCE_SERVICE_URL;
  private X_RapidAPI_Url = environment.X_RapidAPI_Url;
  private X_RapidAPI_Key = environment.X_RapidAPI_Key;
  private X_RapidAPI_Host = environment.X_RapidAPI_Host;
  private ORIGIN_POSTCODE = environment.ORIGIN_POSTCODE;


  constructor(
    private http: HttpClient
  ) { }

  lookupAddresses(postcode: string): Observable<RapidApiByPostcodeResponse> {
    console.log('Fetching addresses for postcode ', postcode);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('x-rapidapi-key', this.X_RapidAPI_Key);
    headers = headers.append('x-rapidapi-host', this.X_RapidAPI_Host);
    headers = headers.append('useQueryString', 'true');

    var params = new HttpParams();
    params = params.set('postcode', postcode);

    return this.http.get<RapidApiByPostcodeResponse>(this.X_RapidAPI_Url, { headers: headers, params: params }) as Observable<RapidApiByPostcodeResponse>;
  }
}
