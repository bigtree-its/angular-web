import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/service/account.service';
import { AlertService } from 'src/app/service/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  submitted: boolean = false;
  loading: boolean = false;
  successful: boolean = false;
  password: string = '';
  error: string;
  email: string;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.submitted = false;
    this.successful = false;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  submit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    this.loading = true;
    this.accountService.login(this.email, this.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
          this.successful = false;
        });
  }

  joinUs(){
    this.router.navigate(['/register']);
  }

}
