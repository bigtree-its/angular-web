import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  JsonpClientBackend,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ResetPasswordRequest, User } from '../model/user';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

import { AlertService } from './alert.service';
import { BasketService } from './basket.service';
import { Address } from '../model/address';
import { LocalContextService } from './localcontext.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {


  public errorMessage: String;

  SERVER_URL = environment.ACCOUNT_SERVICE_URL;
  LOGIN_URL = this.SERVER_URL + environment.AUTH_LOGIN_PATH;
  REGISTER_URL = this.SERVER_URL + environment.AUTH_REGISTER_PATH;
  CHANGE_PASSWORD_URL = environment.CHANGE_PASSWORD;
  FORGOT_PASSWORD_URL = environment.FORGOT_PASSWORD;
  RESET_PASSWORD_URL = environment.RESET_PASSWORD;
  USERS_URL = this.SERVER_URL + environment.USERS;

  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private localContextService: LocalContextService,
  ) {
  }

  public isAuthenticated(): boolean {
    var token = this.localContextService.getCustomerToken();
    if (token === null || token === undefined || this.jwtHelper.isTokenExpired(token)) {
      console.log('User not authenticated.');
      this.localContextService.removeCustomer();
      return false;
    } else {
      console.log('User Authenticated');
      return true;
    }
  }

  getToken(): string {
    return this.localContextService.getCustomerToken();
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.LOGIN_URL, {
        email: username,
        password: password,
      })
      .pipe(
        map((response) => {
          var token = response.token;
          this.localContextService.setCustomerToken(token);
          response.token = "";
          this.localContextService.setCustomer(response);
          return response;
        })
      );
  }

  register(user: User): Observable<User> {
    console.log('Register User: ' + JSON.stringify(user));
    return this.http.post<User>(this.REGISTER_URL, user).pipe(
      map((response) => {
        var token = response.token;
        this.localContextService.setCustomerToken(token);
        response.token = "";
        this.localContextService.setCustomer(response);
        return response;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    this.localContextService.removeCustomer();
    this.localContextService.removeCustomerToken();
    this.router.navigate(['/']);
  }

  updateCurrentCustomer() {
    var customer:User = this.localContextService.getCustomer();
    if ( customer === null || customer === undefined){
      console.log("Cannot update customer. Customer not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      this.localContextService.getCustomerToken()
    );
    const apiURL = this.USERS_URL + "/" + customer._id;
    console.log('Updating User: ' + JSON.stringify(customer));
    return this.http.put<User>(apiURL, customer, httpOptions).pipe(
      map((response) => {
        response.token = "";
        this.localContextService.setCustomer(response);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<User> {

    var customer:User = this.localContextService.getCustomer();
    if ( customer === null || customer === undefined){
      console.log("Cannot update customer. Customer not found");
      return;
    }

    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      'Bearer ' + this.localContextService.getCustomerToken()
    );
    const apiURL = this.CHANGE_PASSWORD_URL;
    var req = {
      email: customer.email,
      password: currentPassword,
      newPassword: newPassword,
    };
    return this.http
      .put<User>(apiURL, req, httpOptions)
      .pipe(
        map((response) => {
          var token = response.token;
          this.localContextService.setCustomerToken(token);
          response.token = "";
          this.localContextService.setCustomer(response);
          return response;
        }),
        retry(1),
        catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<void> {
    const apiURL = this.FORGOT_PASSWORD_URL;
    var req = {
      email: email
    };
    console.log('Request forgot password one-time pass code')
    return this.http
      .post<void>(apiURL, req)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    const apiURL = this.RESET_PASSWORD_URL;
    return this.http
      .put<void>(apiURL, request)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === StatusCodes.UNAUTHORIZED) {
        this.alertService.info(
          'You request was not successful. Please login and try again.'
        );
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      } else if (error.status === StatusCodes.BAD_REQUEST) {
        this.alertService.info(
          'You request was not successful. Please login and try again.'
        );
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

}
