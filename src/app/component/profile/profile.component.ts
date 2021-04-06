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
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/model/order';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { User } from 'src/app/model/user';

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

  /** customer */
  customer: User;

  /** Address */
  hideAddressSection: boolean;
  hideAddressForm: boolean;
  address: Address;
  addressList: Address[] = [];

  /** Payments */
  hidePaymentForm: boolean;
  paymentCard: PaymentCard = new PaymentCard();
  orders: Order[];
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
    private localContextService: LocalContextService,
    private orderService: OrderService,
  ) {
    this.customer = this.localContextService.getCustomer();
    if (this.customer !== undefined && this.customer !== null) {
      console.log('customer ' + JSON.stringify(this.customer));
      this.addressList = this.customer.addresses;
      this.paymentCardList = this.customer.paymentCards;
      console.log('Address list for customer ' + JSON.stringify(this.addressList));
      console.log('Payment Card list for customer ' + JSON.stringify(this.paymentCardList));
      if (this.addressList === undefined || this.addressList.length == 0) {
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      } else {
        this.hideAddressSection = false;
        this.hideAddressForm = true;
        this.address = this.addressList[0];
      }

      this.orderService.getOrders(this.customer.email).subscribe(data => {
        this.orders = data;
        console.log('Retrieved ' + this.orders.length + " orders for this customer");
      });
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
    this.isSuccess = false;

    this.customer = this.localContextService.getCustomer();
    if (this.customer !== undefined && this.customer !== null) {
      this.addressList = this.customer.addresses;
      this.paymentCardList = this.customer.paymentCards;
      if (this.addressList === undefined || this.addressList.length == 0) {
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      } else {
        this.hideAddressSection = false;
        this.hideAddressForm = true;
        this.address = this.addressList[0];
      }

      this.orderService.getOrders(this.customer.email).subscribe(data => {
        this.orders = data;
        console.log('Retrieved ' + this.orders.length + " orders for this customer");
      });
    }
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

    this.customer.email = this.customer.email;
    this.customer.firstName = this.customer.firstName;
    this.customer.lastName = this.customer.lastName;
    this.customer.mobile = this.customer.mobile;
    this.localContextService.setCustomer(this.customer);
    this.updateCurrentcustomer();
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
          this.message = "Your password change not successful. " + error;
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

        this.customer.addresses = this.addressList;
        this.localContextService.setCustomer(this.customer);
        this.updateCurrentcustomer();
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

      this.customer.addresses = this.addressList;
      this.localContextService.setCustomer(this.customer);
      this.updateCurrentcustomer();
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
    this.customer.paymentCards = this.paymentCardList;
    this.localContextService.setCustomer(this.customer);
    this.updateCurrentcustomer();
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
    this.customer.paymentCards = this.paymentCardList;
    this.localContextService.setCustomer(this.customer);
    this.updateCurrentcustomer();
  }

  onSubmitPaymentMethod(f: NgForm) {
    console.log('Submitting card: ' + JSON.stringify(this.paymentCard));
    if (f.valid) {
      this.updatePaymentList();
      this.hidePaymentForm = true;
    }
  }


  selectType(e: String) {
    this.type = e;
    // this.card.cardType = this.type;

  }

  private updatePaymentList() {
    console.log('Card List: ' + JSON.stringify(this.paymentCardList));
    console.log('Form card: ' + JSON.stringify(this.paymentCard));
    var card: PaymentCard = new PaymentCard();
    if (this.paymentCard._id !== undefined && this.paymentCard._id !== null) {
      let existing: PaymentCard = this.paymentCardList.find((card) => card._id === this.paymentCard._id);
      if (existing) {
        /** Update card */
        console.log('Card found already: ' + JSON.stringify(existing));
        existing.cardNumber = this.paymentCard.cardNumber;
        existing.nameOnCard = this.paymentCard.nameOnCard;
        existing.expiryMonth = this.paymentCard.expiryMonth;
        existing.expiryYear = this.paymentCard.expiryYear;
        existing.cvv = this.paymentCard.cvv;
        existing.cardType = CardType.Debit;
        this.usePaymentMethod(existing);
      }
    } else {
      /** New Card */
      card.cardNumber = this.paymentCard.cardNumber;
      card.nameOnCard = this.paymentCard.nameOnCard;
      card.expiryMonth = this.paymentCard.expiryMonth;
      card.expiryYear = this.paymentCard.expiryYear;
      card.cvv = this.paymentCard.cvv;
      card.cardType = CardType.Debit;
      this.paymentCardList.push(card);
      this.usePaymentMethod(card);
    }
  }

  getMaskedCardNumber(card: PaymentCard): string {
    if (card !== undefined && card.cardNumber !== undefined && card.cardNumber.length === 16) {
      var masked = "**** " + card.cardNumber.substr(11, 4);
      return masked;
    }
    return 'XXXX';
  }

  openOrders() { }

  private updateCurrentcustomer() {
    this.accountService
      .updateCurrentCustomer()
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('Updated customer response. ' + JSON.stringify(data));
        },
        (error) => {
          console.log('Update customer resulted in error.' + JSON.stringify(error));
        }
      );
  }
}
