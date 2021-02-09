import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Review } from '../model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  SERVER_URL = environment.REVIEW_SERVICE_URL + "/reviews";

  constructor(private http: HttpClient) { }

  getReviews(productId: string) : Observable<Review[]> {
    var params = new HttpParams().set("product", productId);
    return this.http.get<Review[]>(this.SERVER_URL, {params});
  }

  createReview(review: Review): Observable<Review> {
    console.log('Creating review: ' + JSON.stringify(review));
    return this.http.post<Review>(this.SERVER_URL, review)  
    .pipe(
      map((response) => {
        console.log('Response: '+ JSON.stringify(response));
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      console.log('Client Side ErrorEvent: '+ JSON.stringify(error));
      errorMessage = error.error.message;
    } else {
      // Server-side errors
      console.log('Server Side Error: '+ JSON.stringify(error));
      errorMessage = error.error.message;
    }
    console.log('HttpErrorResponse: '+ JSON.stringify(error));
    return throwError(errorMessage);
  }
}
