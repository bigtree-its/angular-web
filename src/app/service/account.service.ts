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
import { CustomerSession, ResetPasswordRequest, Customer } from '../model/customer';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

import { AlertService } from './alert.service';
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

  SERVER_URL = "http://localhost:8081/customers/v1";
  LOGIN_URL = this.SERVER_URL + environment.AUTH_LOGIN_PATH;
  REGISTER_URL = this.SERVER_URL + environment.AUTH_REGISTER_PATH;
  RESET_PASSWORD_INITIATE = environment.RESET_PASSWORD_INITIATE;
  RESET_PASSWORD_SUBMIT = environment.RESET_PASSWORD_SUBMIT;
  CHANGE_PASSWORD = environment.CHANGE_PASSWORD;
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
    var customerSession = this.localContextService.getCustomerSession();
    if (customerSession === null || customerSession === undefined) {
      console.log('User not authenticated.');
      this.localContextService.removeCustomerSession();
      return false;
    } else {
      console.log('User Authenticated');
      return true;
    }
  }


  login(username: string, password: string): Observable<CustomerSession> {
    return this.http
      .post<CustomerSession>(this.LOGIN_URL, {
        email: username,
        password: password,
      })
      .pipe(
        map((response) => {
          console.log('The login response ' + JSON.stringify(response))
          this.localContextService.setCustomerSession(response);
          return response;
        })
      );
  }

  register(customer: Customer) {
    console.log('Register User: ' + JSON.stringify(customer));
    return this.http.post<Customer>(this.REGISTER_URL, customer).pipe(
      map((response) => {
        return this.login(customer.email, customer.password);
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    this.localContextService.removeCustomerSession();
    this.localContextService.removeCustomerBasket();
    this.router.navigate(['/']);
  }

  updateCurrentCustomer() {
    var customerSession: CustomerSession = this.localContextService.getCustomerSession();
    if (customerSession === null || customerSession === undefined) {
      console.log("Cannot update customer. Customer not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      customerSession.session.accessToken
    );
    var customer: Customer = customerSession.customer;
    const apiURL = this.USERS_URL + "/" + customer._id;
    console.log('Updating User: ' + JSON.stringify(customer));
    return this.http.put<Customer>(apiURL, customer, httpOptions).pipe(
      map((response) => {
        customerSession.customer = response;
        this.localContextService.setCustomerSession(customerSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<Customer> {

    var customerSession: CustomerSession = this.localContextService.getCustomerSession();
    if (customerSession === null || customerSession === undefined) {
      console.log("Cannot update customer. Customer not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      customerSession.session.accessToken
    );
    var customer: Customer = customerSession.customer;
    const apiURL = this.CHANGE_PASSWORD;
    var req = {
      email: customer.email,
      password: currentPassword,
      newPassword: newPassword,
    };
    return this.http.put<Customer>(apiURL, req, httpOptions).pipe(
      map((response) => {
        customerSession.customer = response;
        this.localContextService.setCustomerSession(customerSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<void> {
    const apiURL = this.RESET_PASSWORD_INITIATE;
    var req = {
      email: email
    };
    console.log('Request forgot password one-time pass code')
    return this.http
      .post<void>(apiURL, req)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    const apiURL = this.RESET_PASSWORD_SUBMIT;
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
