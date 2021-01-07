import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AccountService } from '../service/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.accountService.isAuthenticated()) {
      // authorized so return true
      return true;
    }
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
