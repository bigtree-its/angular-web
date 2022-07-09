import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UserSession } from '../model/common-models';

import { AccountService } from '../service/account.service';
import { CookieService } from '../service/cookie.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {


  private OBJECT_USER_SESSION: string = "UserSession";
  SERVER_URL = "http://localhost:8081/r2c/v1";
  SESSIONS_URL = this.SERVER_URL + environment.AUTH_SESSIONS_PATH;

  constructor(private router: Router,
    private accountService: AccountService,
    private cookieService: CookieService,
    private http: HttpClient,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Checking if this user authenticated..');
    console.log('Looking for session ' + JSON.stringify(this.accountService.userSessionSubject$.value));
    if (this.accountService.userSessionSubject$ !== null
      && this.accountService.userSessionSubject$ !== undefined
      && this.accountService.userSessionSubject$.value !== null
      && this.accountService.userSessionSubject$.value !== undefined
      && this.accountService.userSessionSubject$.value.success) {
      return true;
    }
    console.log('Looking for session in Cookie: ');
    var session: string = this.cookieService.getCookie(this.OBJECT_USER_SESSION);
    console.log('Seesion found in Cookie: ' + session);
    if (session !== null && session !== undefined) {
      try {
        var userSession: UserSession = JSON.parse(session);
        if (userSession.success) {
          this.accountService.storeUserSession(userSession);
          return true;
        }
      } catch (error) {
        console.log('Session not found.');
      }
    }
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;

  }
}
