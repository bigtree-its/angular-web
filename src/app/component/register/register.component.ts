import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '../../service/account.service'
import { AlertService } from '../../service/alert.service'
import { Utils } from 'src/app/helpers/utils';
import { SignupRequest } from 'src/app/model/common-models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;
  error: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string = '';
  confirmPassword: string = '';
  returnUrl: string;

  constructor(
    private utils: Utils,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

  }

  login() {
    this.router.navigate(['/login']);
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.utils.isEmpty(this.firstName)) {
      this.error = "Firstname is mandatory";
      return;
    }
    if (this.utils.isEmpty(this.lastName)) {
      this.error = "Lastname is mandatory";
      return;
    }
    if (this.utils.isEmpty(this.email)) {
      this.error = "Email is mandatory";
      return;
    }
    if (this.utils.isEmpty(this.mobile)) {
      this.error = "Mobile is mandatory";
      return;
    }
    if (this.utils.isEmpty(this.password)) {
      this.error = "Password is mandatory";
      return;
    }
    if (this.password.length < 8 || this.confirmPassword.length < 8) {
      this.error = "Password must be minimum 8 characters long";
      return;
    }
    if (!this.utils.isEquals(this.confirmPassword, this.password)) {
      this.error = "Passwords do not match";
      return;
    }
    this.error = undefined;
    var signupRequest: SignupRequest = new SignupRequest();
    signupRequest.firstName = this.firstName;
    signupRequest.lastName = this.lastName;
    signupRequest.email = this.email;
    signupRequest.mobile = this.mobile;
    signupRequest.password = this.password;
    this.loading = true;
    this.accountService.register(signupRequest)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
          this.router.navigate(['/']);
          // this.router.navigate(['/'], { relativeTo: this.route });
        },
        error => {
          console.log(error.data);
          this.error = error.data.detail;
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
