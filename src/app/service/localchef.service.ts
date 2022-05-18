import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LocalContextService } from './localcontext.service';
import { LocalChef, Cuisine, LocalChefSearchQuery, LocalAreaSearchResponse, LocalArea, Food, Calendar } from '../model/localchef';

@Injectable({
  providedIn: 'root'
})
export class LocalChefService {


  private URL = environment.AD_SERVICE_URL;
  private BASEPATH = environment.ADS_BASEPATH;
  private LOCALCHEFS_URI = environment.LOCALCHEFS_URI;
  private LOCALAREA_URI = environment.LOCALAREA_URI;
  private CUISINES_URI = environment.CUISINES_URI;
  private FOODS_URI = environment.FOODS_URI;
  private CALENDARS_URI = environment.CALENDARS_URI;

  localChef: LocalChef;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  getAllLocalChefs(query: LocalChefSearchQuery): Observable<LocalChef[]> {

    var url = this.URL + this.BASEPATH + this.LOCALCHEFS_URI;
    var params = new HttpParams();
    if (query.cuisines !== undefined && query.cuisines !== null) {
      params = params.set('cuisines', query.cuisines);
    }
    if (query.slots !== undefined && query.slots !== null) {
      params = params.set('slots', query.slots);
    }
    if (query.delivery !== undefined && query.delivery !== null) {
      params = params.set('delivery', "");
    }
    if (query.serviceAreas !== undefined && query.serviceAreas !== null) {
      params = params.set('serviceAreas', query.serviceAreas);
    }
    if (query.status !== undefined && query.status !== null) {
      params = params.set('status', query.status);
    }
    if (query.noMinimumOrder !== undefined && query.noMinimumOrder !== null) {
      params = params.set('noMinimumOrder', "");
    }
    console.log('Get LocalChefs for : ' + params)
    return this.http.get<LocalChef[]>(url, { params });
  }

  fetchLocalAreas(searchText: string): Observable<LocalArea[]> {
    var url = this.URL + this.BASEPATH + this.LOCALAREA_URI;
    var params = new HttpParams();
    if (searchText !== undefined && searchText !== null) {
      params = params.set('text', searchText);
    }
    console.log('Lookup LocalAreas for : ' + params)
    return this.http.get<LocalArea[]>(url, { params });
  }

  fetchAllServiceAreas(city: string): Observable<LocalArea[]> {
    var url = this.URL + this.BASEPATH + this.LOCALAREA_URI;
    var params = new HttpParams();
    if (city !== undefined && city !== null) {
      params = params.set('city', city);
    }
    console.log('Lookup LocalAreas for : ' + params)
    return this.http.get<LocalArea[]>(url, { params });
  }

  getLocalChef(id: string): Observable<LocalChef> {

    var url = this.URL + this.BASEPATH + this.LOCALCHEFS_URI + "/" + id;
    return this.http.get<LocalChef>(url);
  }

  getServiceAreabySlug(slug: string): Observable<LocalArea> {
    var params = new HttpParams();
    params = params.set('slug', slug);
    var url = this.URL + this.BASEPATH + this.LOCALAREA_URI + "/lookup";
    console.log('Lookup LocalAreas for : ' + params)
    return this.http.get<LocalArea>(url, { params });
  }

  getServiceAreaById(id: string): Observable<LocalArea> {

    var url = this.URL + this.BASEPATH + this.LOCALAREA_URI + "/" + id;
    return this.http.get<LocalArea>(url);
  }

  getCuisine(id: string): Observable<Cuisine> {

    var url = this.URL + this.BASEPATH + this.CUISINES_URI + "/" + id;
    return this.http.get<Cuisine>(url);
  }

  getFoods(ids: string[]): Observable<Food[]> {

    var url = this.URL + this.BASEPATH + this.FOODS_URI;
    var params = new HttpParams();
    if (ids !== undefined && ids !== null && ids.length > 0) {
      var idList = "";
      ids.forEach(id => {
        if ( idList.length> 0){
          idList = idList + "," + id;
        }else{
          idList = idList + id;
        }
        
      });
      params = params.set('ids', idList);
    }
    return this.http.get<Food[]>(url, { params });
  }

  getAllCuisines(): Observable<Cuisine[]> {

    var url = this.URL + this.BASEPATH + this.CUISINES_URI;
    return this.http.get<Cuisine[]>(url);
  }

  getAllFoods(chefId: string): Observable<Food[]> {

    var url = this.URL + this.BASEPATH + this.FOODS_URI;
    var params = new HttpParams();
    if (chefId !== undefined && chefId !== null) {
      params = params.set('chef', chefId);
    }
    console.log('Fetch foods for : ' + params)
    return this.http.get<Food[]>(url, { params });
  }

  getCalendars(chefId: string): Observable<Calendar[]> {

    var url = this.URL + this.BASEPATH + this.CALENDARS_URI;
    var params = new HttpParams();
    if (chefId !== undefined && chefId !== null) {
      params = params.set('chef', chefId);
      params = params.set('thisweek', 'true');
    }
    console.log('Fetch calendars for : ' + params)
    return this.http.get<Calendar[]>(url, { params });
  }



  placeOrder(localChef: LocalChef) {
    var url = this.URL + this.URL + this.LOCALCHEFS_URI;
    console.log('Placing an order for LocalChef : ' + url + ", " + JSON.stringify(localChef));
    this.http.post<LocalChef>(url, localChef)
      .subscribe({
        next: data => {
          var adResponse = JSON.stringify(data);
          this.localChef = data;
          console.log('Ad posted: ' + adResponse);
        },
        error: e => { console.error('Error when posting an Ad ' + e) }
      });
  }

}
