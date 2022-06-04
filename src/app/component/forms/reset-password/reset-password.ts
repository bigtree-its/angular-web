

import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { FoodOrderservice } from 'src/app/service/food-order.service';

@Component({
    selector: 'app-customer-profile',
    templateUrl: './customer-profile.component.html',
    styleUrls: ['./customer-profile.component.css'],
})
export class ResetPassword implements OnInit {

    /** Change Password Controls */
    currentPassword = new FormControl('');
    newPassword = new FormControl('');
    confirmPassword = new FormControl('');
    passwordChangeSubmitted = false;
    changePasswordFormGroup: FormGroup;
    loading: boolean;
    isError: boolean;
    message: string;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private orderService: FoodOrderservice,
    ) {

    }

    ngOnInit(): void {
        this.changePasswordFormGroup = this.formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }

    // convenience getter for easy access to form fields
    get changePasswordForm() {
        return this.changePasswordFormGroup.controls;
    }

    onSubmitChangePassword() {
        // stop here if form is invalid
        this.passwordChangeSubmitted = true;
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.accountService
            .changePassword(
                this.changePasswordForm.currentPassword.value,
                this.changePasswordForm.newPassword.value
            )
            .pipe(first())
            .subscribe(
                (data) => {
                    console.log(
                        'Your password changed successfully.' + JSON.stringify(data)
                    );

                },
                (error) => {
                    this.loading = false;
                    console.log(
                        'Your password change not successful' + JSON.stringify(error)
                    );
                    this.isError = true;
                    this.message = "Your password change not successful. " + error;
                }
            );
    }
}
