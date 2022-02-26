import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PropertyEnquiry, PropertyQuries } from '../model/property';


@Injectable({
  providedIn: 'root'
})
export class PropertyEnquiryService {

  QUESTIONS_URL = environment.AD_SERVICE_URL + "/properties/questions";
  ANSWERS_URL = environment.AD_SERVICE_URL + "/properties/answers";
  QA_URL = environment.AD_SERVICE_URL + "/properties/qa";

  constructor(private http: HttpClient) { }

  getQA(propertyId: string, email: string): Observable<PropertyQuries> {
    console.log('Retrieving queries for the property ' + propertyId);
    var params = new HttpParams();
    params = params.set("property", propertyId);
    params = params.set("email", email);
    return this.http.get<PropertyQuries>(this.QA_URL, { params });
  }

  postQuestion(question: PropertyEnquiry): Observable<PropertyEnquiry> {
    console.log('Posting question for property: ' + JSON.stringify(question));
    return this.http.post<PropertyEnquiry>(this.QUESTIONS_URL, question)
      .pipe(
        map((response) => {
          console.log('Response: ' + JSON.stringify(response));
          return response;
        }),
        retry(1),
        catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      console.log('Client Side ErrorEvent: ' + JSON.stringify(error));
      errorMessage = error.error.message;
    } else {
      // Server-side errors
      console.log('Server Side Error: ' + JSON.stringify(error));
      errorMessage = error.error.message;
    }
    console.log('HttpErrorResponse: ' + JSON.stringify(error));
    return throwError(errorMessage);
  }
}
