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
import { Address, BooleanResponse, Customer, ResetPasswordRequest, User, UserSession } from 'src/app/model/common-models';
import { CustomerOrder, CustomerOrderList, OrderSearchQuery } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { Utils } from 'src/app/helpers/utils';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  
  // @ViewChild('addressForm') public addressForm: NgForm;

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
  otp: string;
  newPassword: string;
  confirmPassword: string;
  

  /** customer */
  userSession: UserSession;
  customer: User;

  /** Address */
  addressFormGroup: FormGroup;
  hideAddressSection: boolean;
  editAddress: boolean;
  viewAddress: boolean;
  address: Address;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;

  /** Orders */
  ordersArray: CustomerOrder[];
  orders: CustomerOrderList;

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
  passwordChangeSubmitted: boolean;
  otpGenerated: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private orderService: FoodOrderservice,
    private utils: Utils
  ) {
    this.userSession = this.accountService.retrieveSession();
    if (this.userSession !== undefined && this.userSession !== null) {
      this.customer = this.userSession.user;
      if (this.customer !== null && this.customer !== undefined && this.customer.address !== null && this.customer.address !== undefined) {
        this.address = this.customer.address;
        this.editAddress = false;
        this.viewAddress = true;
      }else{
        this.editAddress = true;
        this.viewAddress = false;
      }
    }
  }

  ngOnInit(): void {
    this.showAboutYouModule();
    this.saveChangesEnabled = true;
    this.changeMadeOnAddress = false;
    this.changeMadeOnPersonalDetails = false;
    this.saveChangesEnabled = false;
    this.isError = false;
    this.message = "";
    this.isSuccess = false;

    this.userSession = this.accountService.getUserSession();
    if (this.userSession !== undefined && this.userSession !== null) {
      this.customer = this.userSession.user;
      if (this.customer.address !== null && this.customer.address !== undefined) {
        this.address = this.customer.address;
        this.editAddress = false;
        this.viewAddress = true;
      }else{
        this.editAddress = true;
        this.viewAddress = false;
      }
      var query: OrderSearchQuery = new OrderSearchQuery();
      query.customerEmail = this.customer.email;
      this.orderService.getCustomerOrders(query).subscribe((orders: CustomerOrderList) => {
        this.orders = orders;
        if (orders !== null && orders !== undefined) {
          this.ordersArray = orders.orders;
        }
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
    this.moduleName = 'Your Address';
    this.displayAboutYouModule = false;
    this.displayAddressModule = true;
    this.displayOrdersModule = false;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = true;
  }

  showOrdersModule() {
    this.moduleName = "Your Orders";
    this.displayAboutYouModule = false;
    this.displayAddressModule = false;
    this.displayOrdersModule = true;
    this.displaySecurityModule = false;
    this.saveChangesEnabled = false;
  }


  onSubmitPersonalDetails() {
    this.customer.email = this.customer.email;
    this.customer.fullName = this.customer.fullName;
    this.customer.contact.mobile = this.customer.contact.mobile;
    this.customer.contact.telephone = this.customer.contact.telephone;
    this.accountService.storeUserSession(this.userSession);
    this.updateCurrentcustomer();
  }

  generateOtp(){
    this.accountService.resetPasswordInitiate(this.customer.email).subscribe(res=>{
      var booleanResp: BooleanResponse = res;
      if ( booleanResp.value){
        this.otpGenerated = true;
      }
    },err=>{
      this.otpGenerated = false;
    });
  }
  removeAddress(){
    
  }

  onSubmitChangePassword() {
    // stop here if form is invalid
    this.passwordChangeSubmitted = true;
    if (this.utils.isEmpty(this.otp)|| this.utils.isEmpty(this.newPassword) || this.utils.isEmpty(this.confirmPassword)) {
      return;
    }
    if (!this.utils.isEquals(this.newPassword, this.confirmPassword)) {
      this.isError = true;
      this.message = "Passwords do not match";
      return;
    }
    var req: ResetPasswordRequest = new ResetPasswordRequest();
    req.email = this.customer.email;
    req.otp = this.otp;
    req.password = this.newPassword;
    this.accountService
      .resetPasswordSubmit(req)
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

  onSubmitAddress() {
    if (this.address === null || this.address === undefined) {
      this.address = new Address();
    }
    this.address.addressLine1 = this.addressLine1;
    this.address.addressLine2 = this.addressLine2;
    this.address.city = this.city;
    this.address.postcode = this.postcode;
    this.address.country = "UK";
    this.customer.address = this.address;
    this.updateCurrentcustomer();
  }

  editThisAddress() {
    this.editAddress = true;
    this.viewAddress = false;
    this.addressLine1 = this.address.addressLine1;
    this.addressLine2 = this.address.addressLine2;
    this.city = this.address.city;
    this.postcode = this.address.postcode;
  }


  private updateAddressList() {
    this.address.addressLine1 = this.address.addressLine1;
    this.address.addressLine2 = this.address.addressLine2;
    this.address.city = this.address.city;
    this.address.country = this.address.country;
    this.address.postcode = this.address.postcode;

    this.customer.address = this.address;
    this.accountService.storeUserSession(this.userSession);
    this.updateCurrentcustomer();
  }

  showOrders() {
    this.showOrdersModule();
  }

  private updateCurrentcustomer() {
    console.log('Updating customer: ' + JSON.stringify(this.customer))
    this.accountService
      .updateUser(this.customer)
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
