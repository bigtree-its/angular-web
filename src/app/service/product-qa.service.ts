import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProductAnswer, ProductQA, ProductQuestion } from '../model/common-models';

@Injectable({
  providedIn: 'root'
})
export class ProductQAService {

  QUESTIONS_URL = environment.PRODUCT_SERVICE_URL + "/questions";
  ANSWERS_URL = environment.PRODUCT_SERVICE_URL + "/answers";
  QA_URL = environment.PRODUCT_SERVICE_URL + "/qa";

  constructor(private http: HttpClient) { }

  getQA(productId: string) : Observable<ProductQA> {
    console.log('Retrieving QA for the product '+ productId);
    var params = new HttpParams().set("product", productId);
    return this.http.get<ProductQA>(this.QA_URL, {params});
  }

  postQuestion(question: ProductQuestion): Observable<ProductQuestion> {
    console.log('Posting question for product: ' + JSON.stringify(question));
    return this.http.post<ProductQuestion>(this.QUESTIONS_URL, question)  
    .pipe(
      map((response) => {
        console.log('Response: '+ JSON.stringify(response));
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  postAnswer(answer: ProductAnswer): Observable<ProductAnswer> {
    console.log('Posting answer for a question: ' + JSON.stringify(answer));
    return this.http.post<ProductAnswer>(this.ANSWERS_URL, answer)  
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
