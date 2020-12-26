import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../service/account.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  constructor(private accountService: AccountService) {}

  public hashPassword(
    password: string,
    rounds: number,
    callback: (error: Error, hash: string) => void
  ): void {
    bcrypt.hash(password, rounds, (error, hash) => {
      callback(error, hash);
    });
  }

  public compare(
    password: string,
    dbHash: string,
    callback: (error: string | null, match: boolean | null) => void
  ) {
    bcrypt.compare(password, dbHash, (err: Error, match: boolean) => {
      if (match) {
        // passwords match
        console.log("Password  matched");
        callback(null, true);
      } else {
        // passwords do not match
        console.log("Password do not match");
        callback('Invalid password match', null);
      }
    });
  }

  getHashedPassword(): string {
    let user: User = this.accountService.userValue;
    if (user !== undefined && user.token !== undefined) {
      var decodedToken = this.jwtHelper.decodeToken(user.token);
      return decodedToken['pwd'];
    }
    return '';
  }
}
