import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Utils } from 'src/app/helpers/utils';
import { BooleanResponse } from 'src/app/model/common-models';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  submitted = false;
  successful: boolean = false;
  email: string = '';
  error: string;
  successMessage: string;
  constructor(
    private utils: Utils,
    private accountService: AccountService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.submitted = false;
    this.successful = false;
    this.successMessage = undefined;
    this.error = undefined;
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.utils.isEmpty(this.email)) {
      return;
    }
    this.loading = true;
    this.accountService
      .resetPasswordInitiate(this.email)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(JSON.stringify(data));
          var booleanResponse: BooleanResponse = data;
          if (booleanResponse.value) {
            console.log("Email has been sent with details to reset the password");
            this.error = undefined;
            this.successMessage = "Email has been sent with details to reset the password";
          } else {
            console.log("Email not valid");
            this.error = "Email not valid";
            this.successMessage = undefined;
          }
          this.loading = false;
          this.successful = true;
          // this.route.navigate(["/reset-password"]);
        },
        (error) => {
          this.loading = false;
          this.successful = false;
        }
      );
  }
}
