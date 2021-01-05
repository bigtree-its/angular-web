import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Address } from 'src/app/model/address';
import { CardType, PaymentCard } from 'src/app/model/payment-card';
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
  hidePaymentForm: boolean;
  paymentCard: PaymentCard = new PaymentCard();;
  paymentCardList: PaymentCard[] = [];
  type: String = 'Credit';

  /** Display Controls */
  displayAboutYouModule: boolean = true;
  displayAddressModule: boolean;
  displayPaymentsModule: boolean;
  displayOrdersModule: boolean;
  displaySecurityModule: boolean;

  /** Change Flag */
  changeMadeOnAddress: boolean = false;
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
      console.log('Payment Card list for user ' + JSON.stringify(this.paymentCardList));
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
    if (this.paymentCardList === undefined || this.paymentCardList.length == 0) {
      this.hidePaymentForm = false;
    } else {
      this.hidePaymentForm = true;
    }
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
    this.accountService.userValue.email = this.user.email;
    this.accountService.userValue.firstName = this.user.firstName;
    this.accountService.userValue.lastName = this.user.lastName;
    this.accountService.userValue.mobile = this.user.mobile;
    this.updateCurrentUser();
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
        this.accountService.userValue.addresses = this.addressList;
        this.updateCurrentUser();
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
      this.accountService.userValue.addresses = this.addressList;
      this.updateCurrentUser();
    }
  }

  addNewPaymentMethod() {
    this.hidePaymentForm = false;
    this.paymentCard = new PaymentCard();
  }

  cancelPaymentForm() {
    this.hidePaymentForm = true;
    this.paymentCard = new PaymentCard();
  }


  editPaymentMethod(p: PaymentCard) {
    this.hidePaymentForm = false;
    this.paymentCard = p;
  }

  removePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentCardList.length; i++) {
      if (this.paymentCardList[i].cardNumber === p.cardNumber) {
        this.paymentCardList.splice(i, 1);
      }
    }
    this.accountService.userValue.paymentCards = this.paymentCardList;
    console.log(`Payment cards `+ JSON.stringify(this.paymentCardList));
    this.updateCurrentUser();
  }

  usePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentCardList.length; i++) {
      let pay: PaymentCard = this.paymentCardList[i];
      if (this.paymentCardList[i].cardNumber === p.cardNumber) {
        pay.selected = true;
      } else {
        pay.selected = false;
      }
    }
  }

  onSubmitPaymentMethod(f: NgForm) {
    console.log('Submitting card: '+ JSON.stringify(this.paymentCard));
    if (f.valid){
      this.updatePaymentList();
      this.hidePaymentForm = true;
    }
  }


  selectType(e: String) {
    this.type = e;
    // this.card.cardType = this.type;
    
  }

  private updatePaymentList() {
    console.log('Card List: '+ JSON.stringify(this.paymentCardList));
    console.log('Form card: '+ JSON.stringify(this.paymentCard));
    var card: PaymentCard = new PaymentCard();
      if ( this.paymentCard._id !== undefined && this.paymentCard._id !== null){
        let existing: PaymentCard = this.paymentCardList.find( (card) => card._id === this.paymentCard._id);
        if (existing) {
          /** Update card */
          console.log('Card found already: '+ JSON.stringify(existing));
          existing.cardNumber= this.paymentCard.cardNumber;
          existing.nameOnCard= this.paymentCard.nameOnCard;
          existing.expiryMonth= this.paymentCard.expiryMonth;
          existing.expiryYear= this.paymentCard.expiryYear;
          existing.cvv= this.paymentCard.cvv;
          existing.cardType = CardType.Debit;
        }
      } else{
      /** New Card */
      card.cardNumber= this.paymentCard.cardNumber;
      card.nameOnCard= this.paymentCard.nameOnCard;
      card.expiryMonth= this.paymentCard.expiryMonth;
      card.expiryYear= this.paymentCard.expiryYear;
      card.cvv= this.paymentCard.cvv;
      card.cardType = CardType.Debit;
      this.paymentCardList.push(card);
    }
    
    /** Debug Only */
    console.log('Form card: '+ JSON.stringify(this.paymentCard));
    console.log('Added card: '+ JSON.stringify(card));
    
    this.accountService.userValue.paymentCards = this.paymentCardList;
    console.log('Card List: '+ JSON.stringify(this.accountService.userValue.paymentCards));
    this.updateCurrentUser();

    /** Reset the form Model */
    // this.card = new PaymentCard();
  }

  getMaskedCardNumber(card: PaymentCard): string {
    if (card !== undefined && card.cardNumber !== undefined && card.cardNumber.length === 16) {
      var masked = "**** " + card.cardNumber.substr(11, 4);
      return masked;
    }
    return 'XXXX';
  }

  openOrders() {}

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

  private updateCurrentUser() {
    this.accountService
      .updateCurrentUser()
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('Updated user response. ' + JSON.stringify(data));
        },
        (error) => {
          console.log('Update user resulted in error.' + JSON.stringify(error));
        }
      );
  }
}
