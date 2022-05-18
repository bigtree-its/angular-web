import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LocalContextService } from './localcontext.service';
import { Property, PropertyQuery, PropertyType } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private URL = environment.AD_SERVICE_URL;
  private BASEPATH = environment.ADS_BASEPATH;
  private PROPERTIES_URI = environment.PROPERTIES_URI;
  private PROPERTY_TYPES_URI = environment.PROPERTY_TYPES_URI;


  property: Property;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  getProperties(query: PropertyQuery): Observable<Property[]> {

    var url = this.URL + this.BASEPATH + this.PROPERTIES_URI;
    var params = new HttpParams();
    if (query.marketType !== undefined && query.marketType !== null) {
      params = params.set('consumption_type', query.marketType);
    }
    if (query.types !== undefined && query.types !== null) {
      params = params.set('types', query.types);
    }
    if (query.min_bedrooms !== undefined && query.min_bedrooms !== null) {
      params = params.set('min_bedrooms', query.min_bedrooms);
    }
    if (query.max_bedrooms !== undefined && query.max_bedrooms !== null) {
      params = params.set('max_bedrooms', query.max_bedrooms);
    }
    if (query.status !== undefined && query.status !== null) {
      params = params.set('status', query.status);
    }
    if (query.postcode !== undefined && query.postcode !== null) {
      params = params.set('postcode', query.postcode);
    }
    if (query.last7days !== undefined && query.last7days !== null) {
      params = params.set('last7days', "true");
    }
    if (query.last1month !== undefined && query.last1month !== null) {
      params = params.set('last1month', "true");
    }
    console.log('Query proerpties for : ' + params)
    return this.http.get<Property[]>(url, { params });
  }

  getProperty(id: string): Observable<Property> {

    var url = this.URL + this.BASEPATH + this.PROPERTIES_URI + "/" + id;
    return this.http.get<Property>(url);
  }

  getPropertyType(id: string): Observable<PropertyType> {

    var url = this.URL + this.BASEPATH + this.PROPERTY_TYPES_URI + "/" + id;
    return this.http.get<PropertyType>(url);
  }

  getPropertyTypes(): Observable<PropertyType[]> {

    var url = this.URL + this.BASEPATH + this.PROPERTY_TYPES_URI;
    return this.http.get<PropertyType[]>(url);
  }

  placeOrder(property: Property) {
    var url = this.URL + this.URL + this.PROPERTIES_URI;
    console.log('Posting ad for property : ' + url + ", " + JSON.stringify(property));
    this.http.post<Property>(url, property)
      .subscribe({
        next: data => {
          var adResponse = JSON.stringify(data);
          this.property = data;
          console.log('Ad posted: ' + adResponse);
        },
        error: e => { console.error('Error when posting an Ad ' + e) }
      });
  }

}
