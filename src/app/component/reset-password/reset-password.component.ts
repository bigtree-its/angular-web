import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { ResetPasswordRequest } from 'src/app/model/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  form:FormGroup;
  submitted:boolean  = false;
  loading: boolean = false;
  successful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      passCode: ['', Validators.required]
    });
    this.loading = false;
    this.submitted = false;
    this.successful = false;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    var request: ResetPasswordRequest = {
      email: this.f.email.value,
      password: this.f.password.value,
      passCode: this.f.passCode.value
    }
    this.accountService
      .resetPassword(request)
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
  }

}
