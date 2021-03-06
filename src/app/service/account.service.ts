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
import { environment } from '../../environments/environment';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

import { AlertService } from './alert.service';
import { BooleanResponse, LogoutRequest, ResetPasswordRequest, SignupRequest, User, UserSession } from '../model/common-models';
import { CookieService } from './cookie.service';


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

  SERVER_URL = "http://localhost:8081/r2c/v1";
  LOGIN_URL = this.SERVER_URL + environment.AUTH_LOGIN_PATH;
  USERS_URL = this.SERVER_URL + environment.USERS;
  LOGOUT_URL = this.SERVER_URL + environment.AUTH_LOGOUT_PATH;
  REGISTER_URL = this.SERVER_URL + environment.AUTH_REGISTER_PATH;
  SESSIONS_URL = this.SERVER_URL + environment.AUTH_SESSIONS_PATH;
  RESET_PASSWORD_INITIATE = environment.RESET_PASSWORD_INITIATE;
  RESET_PASSWORD_SUBMIT = environment.RESET_PASSWORD_SUBMIT;
  CHANGE_PASSWORD = environment.CHANGE_PASSWORD;
  private OBJECT_USER_SESSION: string = "UserSession";
  userSessionSubject$: BehaviorSubject<UserSession>;

  jwtHelper = new JwtHelperService();

  constructor(
    private alertService: AlertService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    var userSession: UserSession = this.getUserSession();
    this.userSessionSubject$ = new BehaviorSubject<UserSession>(userSession);
    this.userSessionSubject$.next({ ...userSession });
  }

  public isAuthenticated(): boolean {
    console.log('Looking for session ' + JSON.stringify(this.userSessionSubject$.value));
    if (this.userSessionSubject$ !== null && this.userSessionSubject$ !== undefined && this.userSessionSubject$.value !== null && this.userSessionSubject$.value !== undefined && this.userSessionSubject$.value.success) {
      return true;
    }
    console.log('Looking for session in Cookie: ');
    var sessionId: string = this.cookieService.getCookie(this.OBJECT_USER_SESSION);
    console.log('Seesion Id found in Cookie: ' + sessionId);
    if (sessionId !== null && sessionId !== undefined) {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Access-Control-Allow-Origin', '*');

      this.http.get<UserSession>(this.SESSIONS_URL + "/" + sessionId, { headers: headers }).subscribe((data: UserSession) => {
        if (data === null || data === undefined || data.success === false) {
          this.removeUserSession();
          console.log('User session not authenticated.');
          return false;
        } else {
          console.log('The login response ' + JSON.stringify(data))
          this.storeUserSession(data);
          return true;
        }
      }, err => { });
    } else {
      return false;
    }
  }


  login(username: string, password: string): Observable<UserSession> {
    return this.http
      .post<UserSession>(this.LOGIN_URL, {
        email: username,
        password: password,
      })
      .pipe(
        map((response) => {
          if (response === null || response === undefined || response.success === false) {
            this.removeUserSession();
            throwError;
          } else {
            var userSession: UserSession = response;
            console.log('The login response ' + JSON.stringify(userSession))
            this.storeUserSession(userSession);
            return userSession;
          }
        })
      );
  }

  storeUserSession(session: UserSession) {
    console.log('Storing User session')
    this.userSessionSubject$.next({ ...session });
    this.cookieService.setCookie({
      name: this.OBJECT_USER_SESSION,
      value: JSON.stringify(session),
      session: true,
    });

  }

  removeUserSession() {
    console.log('Removing User session')
    this.cookieService.deleteCookie(this.OBJECT_USER_SESSION);
    var userSession = null;
    this.userSessionSubject$.next({ ...userSession });
  }

  getUserSession(): UserSession {
    if (this.userSessionSubject$ !== null && this.userSessionSubject$ !== undefined) {
      return this.userSessionSubject$.value;
    }
    return null;
  }

  retrieveSession(): UserSession {
    var session: string = this.cookieService.getCookie(this.OBJECT_USER_SESSION);
    console.log('Session found in Cookie: ' + session);
    if (session !== null && session !== undefined) {
      var sessionObj: UserSession = JSON.parse(session);
      this.storeUserSession(sessionObj);
      // this.verifySession(sessionObj);
    } else {
      return null;
    }
  }

  private verifySession(sessionObj: UserSession) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    this.http.get<UserSession>(this.SESSIONS_URL + "/" + sessionObj.session.id, { headers: headers }).subscribe((data: UserSession) => {
      if (data === null || data === undefined || data.success === false) {
        this.removeUserSession();
        throwError;
      } else {
        console.log('The login response ' + JSON.stringify(data));
        this.storeUserSession(data);
        return data;
      }
    }, err => { });
  }

  getUserEmail(): string {
    var session: UserSession = this.getUserSession();
    if (session !== null && session !== undefined) {
      return session.user.email;
    }
    return null;
  }

  register(signupRequest: SignupRequest): Observable<any> {
    console.log('Signup User: URL: ' + this.REGISTER_URL + ", Req: " + JSON.stringify(signupRequest));

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(this.REGISTER_URL, signupRequest, { headers: headers });
    // .pipe(
    //   map(res => {
    //     console.log('response: '+ res)
    //     if (res !== null) {
    //       return JSON.parse(res);
    //     } else {
    //       return {}
    //     }
    //   }));
    // .subscribe({
    //   next: data => {
    //     var response = JSON.stringify(data);
    //     console.log('Signup Response: ' + response);
    //   },
    //   error: e => { 
    //     console.error('Error during Signup: ' + JSON.stringify(e)) ;
    //     // return e.error;
    //   }
    // });

    // return this.http.post<any>(this.REGISTER_URL, signupRequest).pipe(
    //   map((response) => {
    //    console.log('Signup response: '+ response.status);
    //    return response;
    //   }),
    //   retry(0),
    //   catchError(this.handleError));
  }

  logout() {
    var logoutReq: LogoutRequest = new LogoutRequest();
    logoutReq.session = this.userSessionSubject$.value.session.id;
    logoutReq.email = this.getUserEmail();
    // remove user from local storage and set current user to null
    this.http.post<any>(this.LOGOUT_URL, logoutReq).pipe(
      map((response) => {
        console.log("Logout Response:" + response.status);
      })
    );
    this.removeUserSession();
    this.router.navigate(['/']);
  }

  updateUser(user: User) {
    var userSession: UserSession = this.getUserSession();
    if (userSession === null || userSession === undefined) {
      console.log("Cannot update user. Session not found");
      return;
    }

    var params = new HttpParams();
    params = params.set('session', userSession.session.id);
    const apiURL = this.USERS_URL + "/" + user.id;
    return this.http.put<User>(apiURL, user, { params }).pipe(
      map((response) => {
        var user: User = response;
        this.userSessionSubject$.value.user = user;
        this.storeUserSession(this.userSessionSubject$.value);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  updateCurrentUser() {
    var userSession: UserSession = this.getUserSession();
    if (userSession === null || userSession === undefined) {
      console.log("Cannot update user. Session not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      userSession.session.accessToken
    );
    var user: User = userSession.user;
    const apiURL = this.USERS_URL + "/" + user.id;
    console.log('Updating User: ' + JSON.stringify(user));
    return this.http.put<User>(apiURL, user, httpOptions).pipe(
      map((response) => {
        userSession.user = response;
        this.storeUserSession(userSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<User> {

    var userSession: UserSession = this.getUserSession();
    if (userSession === null || userSession === undefined) {
      console.log("Cannot update user. User not found");
      return;
    }
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      userSession.session.accessToken
    );
    var user: User = userSession.user;
    const apiURL = this.CHANGE_PASSWORD;
    var req = {
      email: user.email,
      password: currentPassword,
      newPassword: newPassword,
    };
    return this.http.put<User>(apiURL, req, httpOptions).pipe(
      map((response) => {
        userSession.user = response;
        this.storeUserSession(userSession);
        return response;
      }),
      retry(1),
      catchError(this.handleError));
  }

  resetPasswordInitiate(email: string): Observable<BooleanResponse> {
    const url = this.SERVER_URL + "/password-reset/initiate";
    var params = new HttpParams();
    params = params.set('email', email);
    console.log('Request one-time pass code')
    return this.http.get<BooleanResponse>(url, { params: params });
  }

  resetPasswordSubmit(request: ResetPasswordRequest): Observable<BooleanResponse> {
    const apiURL = this.SERVER_URL + "/password-reset/submit";
    console.log('Connecting to ' + apiURL);
    return this.http
      .post<BooleanResponse>(apiURL, request)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPasswordValidate(email: string, otp: string): Observable<BooleanResponse> {

    const url = this.SERVER_URL + "/password-reset/validate";
    var params = new HttpParams();
    if (email !== undefined && otp !== null) {
      params = params.set('email', email);
      params = params.set('otp', otp);
    }
    return this.http.get<BooleanResponse>(url, { params: params });
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
