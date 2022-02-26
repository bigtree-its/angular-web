import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from './model/customer';
import { AccountService } from './service/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BEKU';

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    var customer: Customer = JSON.parse(localStorage.getItem("Customer"));
    if (customer !== null&& customer !== undefined) {
      this.router.navigate(['/']);
    }
  }

}
