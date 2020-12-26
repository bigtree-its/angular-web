import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Address } from 'src/app/model/address';
import { PaymentCard } from 'src/app/model/payment-card';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/helpers/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('addressForm') public addressForm: NgForm;

  saveChangesEnabled: boolean = true;
  isChangeMade: boolean = false;
  passwordChangeSuccessful: boolean = false;
  moduleName: string;
  personalDetailsFormSubmitted = false;
  loading = false;

  isSuccess: boolean = false;
  isError: boolean = false;
  message: string;

  /** Change Password Controls */
  currentPassword = new FormControl('');
  newPassword = new FormControl('');
  confirmPassword = new FormControl('');
  passwordChangeSubmitted = false;
  changePasswordFormGroup: FormGroup;

  /** User */
  user: User;

  /** Address */
  hideAddressSection: boolean;
  hideAddressForm: boolean;
  address: Address;
  addressList: Address[] = [];

  /** Payments */
  hidePaymentSection: boolean;
  hidePaymentForm: boolean;
  paymentCard: PaymentCard;
  paymentCardList: PaymentCard[] = [];

  /** Display Controls */
  displayAboutYouModule: boolean = true;
  displayAddressModule: boolean;
  displayPaymentsModule: boolean;
  displayOrdersModule: boolean;
  displaySecurityModule: boolean;

  /** Change Flag */
  changeMadeOnAddress: boolean = false;
  changeMadeOnPaymentCards: boolean = false;
  changeMadeOnPersonalDetails: boolean = false;
  changeMadeOnSecurityDetails: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private Auth: AuthService
  ) {
    if (this.accountService.userValue !== undefined) {
      this.user = this.accountService.userValue;
      console.log('User ' + JSON.stringify(this.user));
      this.addressList = this.accountService.userValue.addresses;
      this.paymentCardList = this.accountService.userValue.paymentCards;
      console.log('Address list for user ' + JSON.stringify(this.addressList));
      if (this.addressList === undefined || this.addressList.length == 0) {
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      } else {
        this.hideAddressSection = false;
        this.hideAddressForm = true;
        this.address = this.addressList[0];
      }
    }
  }

  ngOnInit(): void {
    this.changePasswordFormGroup = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.showAboutYouModule();
    this.saveChangesEnabled = true;
    this.changeMadeOnAddress = false;
    this.changeMadeOnPaymentCards = false;
    this.changeMadeOnPersonalDetails = false;
    this.saveChangesEnabled = false;
    this.isError = false;
    this.message = "";
    this.isSuccess =false;
  }

  showAboutYouModule() {
    this.moduleName = 'Your Personal Details';
    this.displayAboutYouModule = true;
    this.displayAddressModule = false;
    this.displayPaymentsModule = false;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }
  showSecurityModule() {
    this.moduleName = 'Change Password';
    this.displayAboutYouModule = false;
    this.displaySecurityModule = true;
    this.displayAddressModule = false;
    this.displayPaymentsModule = false;
    this.displayOrdersModule = false;
    this.saveChangesEnabled = false;
  }
  showAddressModule() {
    this.moduleName = 'Your Addresses';
    this.displayAboutYouModule = false;
    this.displayAddressModule = true;
    this.displayPaymentsModule = false;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }
  showPaymentsModule() {
    this.moduleName = 'Your Payment Details';
    this.displayAboutYouModule = false;
    this.displayAddressModule = false;
    this.displayPaymentsModule = true;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }
  showOrdersModule() {
    this.moduleName = 'Your Orders';
    this.displayAboutYouModule = false;
    this.displayAddressModule = false;
    this.displayPaymentsModule = false;
    this.displayOrdersModule = true;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = false;
  }

  // convenience getter for easy access to form fields
  get changePasswordForm() {
    return this.changePasswordFormGroup.controls;
  }

  onSubmitPersonalDetails(personalDetailsForm: NgForm) {
    // stop here if form is invalid
    if (personalDetailsForm.invalid) {
      return;
    }
    this.changeMadeOnPersonalDetails = true;
    this.isChangeMade = true;
    console.log('Updated user details are : ' + JSON.stringify(this.user));
  }

  onSubmitChangePassword() {
    // stop here if form is invalid
    this.passwordChangeSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (!this.isPasswordValid) {
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
          this.loading = false;
          this.passwordChangeSuccessful = true;
          this.isError = false;
          this.isSuccess = true;
          this.message = "Your password change successful. ";
        },
        (error) => {
          this.loading = false;
          console.log(
            'Your password change not successful' + JSON.stringify(error)
          );
          this.isError = true;
          this.message = "Your password change not successful. "+ error;
        }
      );
  }

  isPasswordValid() {
    let password: string = this.changePasswordForm.currentPassword.value;
    let hash = this.Auth.getHashedPassword();
    this.Auth.compare(
      password,
      hash,
      (error: string | null, match: boolean | null) => {
        if (error) {
          return false;
        } else {
          return true;
        }
      }
    );
  }

  onAddAddress() {
    this.openAddress();
    this.address = new Address();
    this.addressList.push(this.address);
  }
  openAddress() {
    this.hideAddressSection = true;
    this.hideAddressForm = false;
  }
  closeAddressForm() {
    this.hideAddressSection = false;
    this.hideAddressForm = true;
  }
  hideAddress() {
    this.hideAddressSection = true;
    this.hideAddressForm = true;
  }
  editAddress(address: Address) {
    this.address = address;
    this.hideAddressSection = true;
    this.hideAddressForm = false;
    this.displayAboutYouModule = false;
  }
  removeAddress(address: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i]._id === address._id) {
        this.addressList.splice(i, 1);
        this.changeMadeOnAddress = true;
        break;
      }
    }
  }

  onSubmitAddress(f: NgForm) {
    if (f.valid) {
      if (this.address.lineNumber1 === undefined) {
        this.hideAddressForm = false;
      } else {
        this.hideAddressForm = true;
        this.hideAddressSection = false;
        this.updateAddressList();
        this.changeMadeOnAddress = true;
        this.isChangeMade = true;
      }
    }
  }
  private updateAddressList() {
    let existing: Address = this.addressList.find(
      (a) => a._id === this.address._id
    );
    if (!existing) {
      this.addressList.push(this.address);
    } else {
      existing.firstName = this.address.firstName;
      existing.lastName = this.address.lastName;
      existing.email = this.address.email;
      existing.mobile = this.address.mobile;
      existing.lineNumber1 = this.address.lineNumber1;
      existing.lineNumber2 = this.address.lineNumber2;
      existing.city = this.address.city;
      existing.country = this.address.country;
      existing.postcode = this.address.postcode;
      console.log('Updated address: ' + JSON.stringify(existing));
    }
  }

  openPaymentCards() {}
  editPaymentCard(card: PaymentCard) {}
  removePaymentCard(card: PaymentCard) {}

  openOrders() {}

  submitProfile() {
    this.loading = true;
    let user: User = this.accountService.userValue;
    if (user !== undefined) {
      if (this.changeMadeOnAddress) {
        user.addresses = this.addressList;
      }
      if (this.changeMadeOnPaymentCards) {
        user.paymentCards = this.paymentCardList;
      }
      this.accountService
        .updateU(user)
        .pipe(first())
        .subscribe(
          (data) => {
            console.log('Update user response. ' + JSON.stringify(data));
            // this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            // this.router.navigate(['/']);
            // this.router.navigate(['/'], { relativeTo: this.route });
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.log('Update user error response. ' + JSON.stringify(error));
          }
        );
    }
  }

  isPasswordChanged() {
    if (
      this.passwordChangeSubmitted == true &&
      !this.changePasswordForm.invalid &&
      this.isPasswordValid
    ) {
      return true;
    } else {
      return false;
    }
  }
}
