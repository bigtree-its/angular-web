import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { UserSession } from '../model/common-models';

import { AccountService } from '../service/account.service';
import { CookieService } from '../service/cookie.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupplierAuthGuard implements CanActivate {

    private OBJECT_USER_SESSION: string = "UserSession";
    SERVER_URL = "http://localhost:8081/r2c/v1";
    SESSIONS_URL = this.SERVER_URL + environment.AUTH_SESSIONS_PATH;

    constructor(private router: Router,
        private accountService: AccountService,
        private cookieService: CookieService,
        private http: HttpClient,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        console.log('Checking if supplier authenticated');
        if (this.accountService.userSessionSubject$ !== null
            && this.accountService.userSessionSubject$ !== undefined
            && this.accountService.userSessionSubject$.value !== null
            && this.accountService.userSessionSubject$.value !== undefined
            && this.accountService.userSessionSubject$.value.user !== null
            && this.accountService.userSessionSubject$.value.user !== undefined
            && this.accountService.userSessionSubject$.value.user.role === "Supplier"
            && this.accountService.userSessionSubject$.value.success) {
            return true;
        }
        var session: string = this.cookieService.getCookie(this.OBJECT_USER_SESSION);
        if (session !== null && session !== undefined) {
            try {
                var userSession: UserSession = JSON.parse(session);
                if (userSession !== null
                    && userSession !== undefined
                    && userSession.user !== null
                    && userSession.user !== undefined
                    && userSession.user.role === "Supplier"
                    && userSession.success) {
                        this.accountService.storeUserSession(userSession);
                        return true;
                }
            } catch (error) {
                console.error('Supplier session not found.');
            }
        }
        // supplier session not found. Redirect to login page with the return url and return false
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}