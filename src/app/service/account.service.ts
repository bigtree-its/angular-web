import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
  JsonpClientBackend,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

import { AlertService } from './alert.service';
import { LocalContextService } from './localcontext.service';
import { BasketService } from './basket.service';
import { BooleanResponse, Customer, CustomerSession, ResetPasswordRequest, SignupRequest } from '../model/common-models';

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

  SERVER_URL = "http://localhost:8081/urchef/v1/customers";
  LOGIN_URL = this.SERVER_URL + environment.AUTH_LOGIN_PATH;
  REGISTER_URL = this.SERVER_URL + environment.AUTH_REGISTER_PATH;
  RESET_PASSWORD_INITIATE = environment.RESET_PASSWORD_INITIATE;
  RESET_PASSWORD_SUBMIT = environment.RESET_PASSWORD_SUBMIT;
  CHANGE_PASSWORD = environment.CHANGE_PASSWORD;
  private OBJECT_CUSTOMER_SESSION: string = "CustomerSession";
  customerSessionSubject$: BehaviorSubject<CustomerSession>;

  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private cookieService: CookieService
  ) {
    var customerSession: CustomerSession = this.getCustomerSession();
    this.customerSessionSubject$ = new BehaviorSubject<CustomerSession>(customerSession);
    this.customerSessionSubject$.next({ ...customerSession });
  }

  public isAuthenticated(): boolean {
    var customerSession = this.getCustomerSession();
    if (customerSession === null || customerSession === undefined) {
      console.log('User not authenticated.');
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
          if ( response.success === false){
            this.removeCustomerSession();
            throwError;
          }else{
            var customerSession: CustomerSession = response;
            console.log('The login response ' + JSON.stringify(customerSession))
            this.storeCustomerSession(customerSession);
            return customerSession;
          }
        })
      );
  }

  storeCustomerSession(session: CustomerSession) {
    this.customerSessionSubject$.next({ ...session });
    return this.cookieService.putObject(this.OBJECT_CUSTOMER_SESSION, session);
  }

  removeCustomerSession() {
    this.cookieService.remove(this.OBJECT_CUSTOMER_SESSION);
    var customerSession = null;
    this.customerSessionSubject$.next({ ...customerSession });
  }

  getCustomerSession(): any {
    return this.cookieService.getObject(this.OBJECT_CUSTOMER_SESSION);
  }

  getCustomerEmail(): string {
    var session: CustomerSession = this.getCustomerSession();
    if ( session !== null && session !== undefined){
      return session.customer.contact.email;
    }
    return null;
  }

  register(signupRequest: SignupRequest) {
    console.log('Register User: ' + JSON.stringify(signupRequest));
    return this.http.post<Customer>(this.REGISTER_URL, signupRequest).pipe(
      map((response) => {
        return this.login(signupRequest.email, signupRequest.password);
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    this.removeCustomerSession();
    this.router.navigate(['/']);
  }

  updateCurrentCustomer() {
    var customerSession: CustomerSession = this.getCustomerSession();
    if (customerSession === null || customerSession === undefined) {
      console.log("Cannot update customer. Customer not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      customerSession.session.accessToken
    );
    var customer: Customer = customerSession.customer;
    const apiURL = this.SERVER_URL + "/" + customer._id;
    console.log('Updating User: ' + JSON.stringify(customer));
    return this.http.put<Customer>(apiURL, customer, httpOptions).pipe(
      map((response) => {
        customerSession.customer = response;
        this.storeCustomerSession(customerSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<Customer> {

    var customerSession: CustomerSession = this.getCustomerSession();
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
      email: customer.contact.email,
      password: currentPassword,
      newPassword: newPassword,
    };
    return this.http.put<Customer>(apiURL, req, httpOptions).pipe(
      map((response) => {
        customerSession.customer = response;
        this.storeCustomerSession(customerSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  resetPasswordInitiate(email: string): Observable<BooleanResponse> {
    const url = "http://localhost:8081/urchef/v1/customers/password-reset/initiate";
    var params = new HttpParams();
    params = params.set('email', email);
    console.log('Request one-time pass code')
    return this.http.get<BooleanResponse>(url, {params: params});
  }

  resetPasswordSubmit(request: ResetPasswordRequest): Observable<BooleanResponse> {
    const apiURL = "http://localhost:8081/urchef/v1/customers/password-reset/submit";
    console.log('Connecting to '+ apiURL);
    return this.http
      .post<BooleanResponse>(apiURL, request)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPasswordValidate(email: string, otp: string): Observable<BooleanResponse> {

    const url = "http://localhost:8081/urchef/v1/customers/password-reset/validate";
    var params = new HttpParams();
    if (email !== undefined && otp !== null) {
      params = params.set('email', email);
      params = params.set('otp', otp);
    }
    return this.http.get<BooleanResponse>(url, {params: params});
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
