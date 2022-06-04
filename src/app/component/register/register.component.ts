import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../service/account.service'
import { AlertService } from '../../service/alert.service'
import { Utils } from 'src/app/helpers/utils';
import { SignupRequest } from 'src/app/model/common-models';
import * as _ from 'underscore';

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
  success: string;
  fullName: string;
  mobile: string;
  email: string;
  password: string = '';
  confirmPassword: string = '';
  returnUrl: string;
  role: string;

  constructor(
    private utils: Utils,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    // this.route.queryParamMap
    //   .subscribe((params) => {
    //     // var paramsObject = { ...params.keys, ...params };
    //     // console.log(paramsObject);
    //     this.role = params.get("r");
    //     if (this.role === undefined || this.role === null) {
    //       this.role = "Customer";
    //     }
    //     console.log('The role: ' + this.role)
    //   }
    //   );

    this.route.queryParams.subscribe(params => {
      this.role = params.r;
      if (this.role === undefined || this.role === null) {
        this.role = "Customer";
      }
      console.log('The role: ' + this.role);
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  submit() {
   
    // stop here if form is invalid
    if (this.utils.isEmpty(this.fullName)) {
      this.error = "Firstname is mandatory";
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
    this.success = undefined;
    this.submitted = true;
    var signupRequest: SignupRequest = new SignupRequest();
    signupRequest.fullName = this.fullName;
    signupRequest.email = this.email;
    signupRequest.role = this.role;
    signupRequest.mobile = this.mobile;
    signupRequest.password = this.password;
    this.loading = true;
    this.accountService.register(signupRequest)
      .subscribe(
        res => {
          console.log(res);
          this.success= "Your registration successful. Redirecting you to login."
          setTimeout( () => {
             this.router.navigate(['/login'], { queryParams: { returnUrl: "become-a-supplier" }});
            }, 3000 );
          
          // const keys = data.headers.keys();
          // var headers = keys.map(key =>
          //   `${key}: ${data.headers.get(key)}`);

          // var response = JSON.stringify(data);
          // console.log('Signup Response: ' + response);
        },
        err => {
          console.error('Error during Signup: ' + JSON.stringify(err));
          this.error = err.error.detail;
        }
      );
    // .pipe(first())
    // .subscribe(
    //   data => {
    //     this.alertService.success('Registration successful', { keepAfterRouteChange: true });
    //     this.router.navigate(['/']);
    //     // this.router.navigate(['/'], { relativeTo: this.route });
    //   },
    //   error => {
    //     console.log(error.data);
    //     this.error = error.data.detail;
    //     this.alertService.error(error);
    //     this.loading = false;
    //   });
  }

}
