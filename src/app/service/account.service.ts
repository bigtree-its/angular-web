import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
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
  
  public userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public userAuthenticated: User;
  public errorMessage: String;

  SERVER_URL = environment.ACCOUNT_SERVICE_URL;
  LOGIN_URL = this.SERVER_URL + environment.AUTH_LOGIN_PATH;
  REGISTER_URL = this.SERVER_URL + environment.AUTH_REGISTER_PATH;
  CHANGE_PASSWORD_URL = environment.CHANGE_PASSWORD;
  FORGOT_PASSWORD_URL = environment.FORGOT_PASSWORD;
  RESET_PASSWORD_URL = environment.RESET_PASSWORD;
  USERS_URL = this.SERVER_URL + environment.USERS;

  jwtHelper = new JwtHelperService();
  userObject: User;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    let userOnStorage = localStorage.getItem('user');
    if (userOnStorage !== undefined) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(userOnStorage));
      this.user = this.userSubject.asObservable();
      this.user.subscribe((u) => {
        this.userObject = u;
      });
    }
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    if (
      this.userObject === undefined ||
      this.userObject === null || 
      this.userObject.token === undefined ||
      this.jwtHelper.isTokenExpired(this.userObject.token)
    ) {
      // token expired
      console.log('User is not authenticated.');
      localStorage.removeItem('user');
      this.userSubject.next(null);
      return false;
    } else {
      console.log('Authenticated user found');
      return true;
    }
  }

  getToken(): string {
    return this.userObject.token;
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.LOGIN_URL, {
        email: username,
        password: password,
      })
      .pipe(
        map((response) => {
          this.updateUserOnStorage(response);
          return response;
        })
      );
  }

  

  register(user: User): Observable<User> {
    console.log('Register User: ' + JSON.stringify(user));
    return this.http.post<User>(this.REGISTER_URL, user).pipe(
      map((response) => {
        this.updateUserOnStorage(response);
        return response;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  updateCurrentUser(): Observable<User> {
    return this.updateUser(this.userValue);
  }

  updateUser(user: User): Observable<User> {
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      this.getToken()
    );
    const apiURL = this.USERS_URL + "/" + user._id;
    console.log('Updating User @:  ' + apiURL);
    console.log('Updating User Data: ' + JSON.stringify(user) );
    return this.http.put<User>(apiURL, user, httpOptions).pipe(
      map((response) => {
        this.updateUserOnStorage(response);
        return response;
      }),
      retry(1), 
      catchError(this.handleError));
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<User> {
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      'Bearer ' + this.getToken()
    );
    const apiURL = this.CHANGE_PASSWORD_URL;
    var req = {
      email: this.userValue.email,
      password: currentPassword,
      newPassword: newPassword,
    };
    return this.http
      .put<User>(apiURL, req, httpOptions)
      .pipe(
        map((response) => {
          this.updateUserOnStorage(response);
          return response;
        }),
        retry(1),
        catchError(this.handleError));
  }

  forgotPassword(email: string) : Observable<void>{
    const apiURL = this.FORGOT_PASSWORD_URL;
    var req = {
      email: email
    };
    console.log('Request forgot password one-time pass code')
    return this.http
      .post<void>(apiURL, req)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest) : Observable<void>{
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

  private updateUserOnStorage(response: User) {
    localStorage.setItem('user', JSON.stringify(response));
    this.userSubject.next(response);
  }
}
