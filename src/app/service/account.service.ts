import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public userAuthenticated: User;
  public errorMessage: String;
  SERVER_URL = environment.ACCOUNT_SERVICE_URL;
  LOGIN_PATH = environment.AUTH_LOGIN_PATH;
  REGISTER_PATH = environment.AUTH_REGISTER_PATH;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>('http://localhost:8080/auth/login', {
        email: username,
        password: password,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
          return response;
        })
      );
    // .subscribe({
    //   next: (user) => {
    //     this.userAuthenticated = user;
    //   },
    //   error: (error) => {
    //     this.errorMessage = error.message;
    //     console.error('There was an error while authenticating user!', error);
    //   },
    // });

    // return this.http.post<User>(this.SERVER_URL + this.LOGIN_PATH, { email: username, password: password })
    //   .pipe(
    //     map(user => {
    //       localStorage.setItem('user', JSON.stringify(user));
    //       this.userSubject.next(user);
    //       this.orderService.getOrders();
    //       return user;
    //     }
    //     ));
  }

  register(user: User): Observable<User> {
    console.log('Register User: ' + JSON.stringify(user));
    return this.http
      .post<User>('http://localhost:8080/auth/register', user)
      .pipe(
        map((response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
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
}
