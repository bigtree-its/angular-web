import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { first } from 'rxjs/operators';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/model/order';
import { Address, Customer, CustomerSession } from 'src/app/model/common-models';

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
  customerSession: CustomerSession;
  customer: Customer;

  /** Address */
  hideAddressSection: boolean;
  hideAddressForm: boolean;
  address: Address;

  /** Orders */
  orders: Order[];

  /** Display Controls */
  displayAboutYouModule: boolean = true;
  displayAddressModule: boolean;
  displayOrdersModule: boolean;
  displaySecurityModule: boolean;

  /** Change Flag */
  changeMadeOnAddress: boolean = false;
  changeMadeOnPersonalDetails: boolean = false;
  changeMadeOnSecurityDetails: boolean = false;
  status: string;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private orderService: OrderService,
  ) {
    this.customerSession = this.accountService.getCustomerSession();
    if (this.customerSession !== undefined && this.customerSession !== null) {
      this.customer = this.customerSession.customer;
      console.log('customer ' + JSON.stringify(this.customer));
      this.address = this.customer.address;
      console.log('Address of customer ' + JSON.stringify(this.address));
      if (this.address === undefined ) {
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      } else {
        this.hideAddressSection = false;
        this.hideAddressForm = true;
      }

      this.orderService.getOrders(this.customer.contact.email).subscribe(data => {
        this.orders = data;
        console.log('Orders: '+ JSON.stringify(this.orders));
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

    this.customerSession = this.accountService.getCustomerSession();
    if (this.customerSession !== undefined && this.customerSession !== null) {
      this.customer = this.customerSession.customer;
      this.address = this.customer.address;
      if (this.address === undefined) {
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      } else {
        this.hideAddressSection = false;
        this.hideAddressForm = true;
      }

      this.orderService.getOrders(this.customer.contact.email).subscribe(data => {
        this.orders = data;
        console.log('Retrieved ' + this.orders.length + " orders for this customer");
      });
    }
  }

  showAboutYouModule() {
    this.moduleName = 'Your Personal Details';
    this.displayAboutYouModule = true;
    this.displayAddressModule = false;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }
  showSecurityModule() {
    this.moduleName = 'Change Password';
    this.displayAboutYouModule = false;
    this.displaySecurityModule = true;
    this.displayAddressModule = false;
    this.displayOrdersModule = false;
    this.saveChangesEnabled = false;
  }
  showAddressModule() {
    this.moduleName = 'Your Addresses';
    this.displayAboutYouModule = false;
    this.displayAddressModule = true;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }
 
  showOrdersModule(title: string) {
    this.moduleName = title;
    this.displayAboutYouModule = false;
    this.displayAddressModule = false;
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

    this.customer.contact.email = this.customer.contact.email;
    this.customer.firstName = this.customer.firstName;
    this.customer.lastName = this.customer.lastName;
    this.customer.contact.mobile = this.customer.contact.mobile;
    this.accountService.storeCustomerSession(this.customerSession);
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
  editAddress() {
    this.hideAddressSection = true;
    this.hideAddressForm = false;
    this.displayAboutYouModule = false;
  }

  onSubmitAddress(f: NgForm) {
    if (f.valid) {
      if (this.address.addressLine1 === undefined) {
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

  onAddAddress(){
    
  }
  removeAddress(){
    
  }


  private updateAddressList() {
    this.address.addressLine1 = this.address.addressLine1;
    this.address.addressLine2 = this.address.addressLine2;
    this.address.city = this.address.city;
    this.address.country = this.address.country;
    this.address.postcode = this.address.postcode;

    this.customer.address = this.address;
    this.accountService.storeCustomerSession(this.customerSession);
    this.updateCurrentcustomer();
  }

  showOrders(status: string) {
    this.status = status;
    let title = "Your open orders";
    if (status === "SHIPPED"){
      title = "Your shipped orders";
    } else if (status === "CANCELLED"){
      title = "Your cancelled orders";
    } else if (status === "COMPLETED"){
      title = "Your completed orders";
    } 
    this.showOrdersModule(title);
  }

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
