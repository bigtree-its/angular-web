import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  successful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
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
    this.accountService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(JSON.stringify(data));
          this.loading = false;
          this.successful = true;
          this.route.navigate(["/reset-password"]);
        },
        (error) => {
          this.loading = false;
          this.successful = false;
        }
      );
  }
}
