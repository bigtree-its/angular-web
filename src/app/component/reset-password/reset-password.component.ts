import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { BooleanResponse, ResetPasswordRequest } from 'src/app/model/common-models';
import { Utils } from 'src/app/helpers/utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  otp: string;
  error: string;
  email: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private utils: Utils
  ) { }

  ngOnInit(): void {

    this.loading = false;
    this.submitted = false;
    this.successful = false;

    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params);
        this.otp = params.otp;
        this.email = params.email;
        console.log("Resetpassword Param otp: "+ params.otp);
        console.log("Resetpassword Param email: "+ params.email);
        console.log("OTP Link is not valid");
        if (this.utils.isEmpty(this.otp) || this.utils.isEmpty(this.email)) {
          this.error = "Cannot find the page you are looking for."
        } else {
          this.accountService
            .resetPasswordValidate(this.email, this.otp)
            .pipe(first())
            .subscribe(
              (data) => {
                console.log(JSON.stringify(data));
                this.loading = false;
                var booleanResponse: BooleanResponse = data;
                if (booleanResponse.value) {
                  console.log("OTP Link is valid");
                  this.error = undefined;
                } else {
                  console.log("OTP Link is not valid");
                  this.error = "The link is no longer valid. Please initiate the password reset again"
                }
              },
              (error) => {
                this.loading = false;
                this.successful = false;
              }
            );
        }
      }
      );
  }


  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.utils.isEmpty(this.password) || this.utils.isEmpty(this.confirmPassword)) {
      return;
    }
    if (this.password.length < 8 || this.confirmPassword.length < 8) {
      this.error = "The password must have atleast 8 characters"
      return;
    }
    if (this.utils.isEquals(this.password, this.confirmPassword)) {
      this.error = undefined;
      this.loading = true;
      var request: ResetPasswordRequest = {
        password: this.password,
        otp: this.otp,
        email: this.email
      }
      this.accountService
        .resetPasswordSubmit(request)
        .pipe(first())
        .subscribe(
          (data) => {
            console.log(JSON.stringify(data));
            this.loading = false;
            this.successful = true;
          },
          (error) => {
            this.loading = false;
            this.successful = false;
          }
        );
    } else {
      this.error = 'Passwords do not match';
    }

  }

}
