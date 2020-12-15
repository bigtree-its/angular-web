import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/model/address';
import { PaymentCard } from 'src/app/model/payment-card';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  

  @ViewChild('addressForm') public addressForm: NgForm;

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

  /** About You */
  hideAboutYouSection: boolean;
  hideAboutYouForm: boolean;

  /** Your Orders */
  hideOrders: boolean;

  constructor(private accountService: AccountService) {
    if (this.accountService.userValue !== undefined) {
      this.user = this.accountService.userValue;
      console.log("User "+ JSON.stringify(this.user));
      this.addressList = this.accountService.userValue.addresses;
      this.paymentCardList = this.accountService.userValue.paymentCards;
      console.log("Address list for user "+ JSON.stringify(this.addressList));
      if ( this.addressList === undefined || this.addressList.length ==0){
        this.hideAddressSection = true;
        this.hideAddressForm = false;
      }else{
        this.hideAddressSection = false;
        this.hideAddressForm = true;
        this.address = this.addressList[0];
      }
    }
  }

  ngOnInit(): void {}

  openAccounts() {}

  onAddAddress(){
    this.openAddressForm();
    var newA: Address;
    this.addressList.push(newA);
    this.addressForm.resetForm();
  }
  openAddressForm() {
    this.hideAddressSection = true;
    this.hideAddressForm = false;
  }
  closeAddressForm() {
    this.hideAddressSection = false;
    this.hideAddressForm = true;
  }
  editAddress(address: Address) {
    this.address = address;
    this.hideAddressSection = true;
    this.hideAddressForm = false;
  }
  removeAddress(address: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i]._id === address._id) {
        this.addressList.splice(i, 1);
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
    }
  }
  
  openPaymentCards() {}
  editPaymentCard(card: PaymentCard) {}
  removePaymentCard(card: PaymentCard) {}

  openOrders() {}

  

  
}
