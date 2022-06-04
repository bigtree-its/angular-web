import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder  } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { AlertService } from 'src/app/service/alert.service';
import { Utils } from 'src/app/helpers/utils';
import { LocalChefService } from 'src/app/service/localchef.service';
import { LocalChef } from 'src/app/model/localchef';


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
    private utils: Utils,
    private accountService: AccountService,
    private alertService: AlertService,
    private supplierService: LocalChefService,
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.submitted = false;
    this.successful = false;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  submit() {
    // stop here if form is invalid
    if (this.utils.isEmpty(this.email)) {
      this.error = "Email is mandatory";
      return;
    }
    if (this.utils.isEmpty(this.password)) {
      this.error = "Password is mandatory";
      return;
    }
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    this.loading = true;
    this.accountService.login(this.email, this.password)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate([this.returnUrl]);
        },
        err => {
          console.error('Error during login: ' + JSON.stringify(err));
          this.error = err.error.detail;
        }
      );

    // this.accountService.login(this.email, this.password)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       console.log("Login response : "+ JSON.stringify(data))
    //       this.router.navigate([this.returnUrl]);
    //     },
    //     error => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //       this.successful = false;
    //     });
  }

  joinUs(){
    this.router.navigate(['/register']);
  }

  

}
