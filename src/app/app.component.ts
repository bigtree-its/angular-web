import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/user';
import { AccountService } from './service/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenEcomm';

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    var user: User = JSON.parse(localStorage.getItem("User"));
    if (user !== null&& user !== undefined) {
      this.router.navigate(['/']);
    }
  }

}
