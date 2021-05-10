import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Address, RapidApiAddress, RapidApiResult } from 'src/app/model/address';
import { Basket } from 'src/app/model/basket.model';
import { Checkout } from 'src/app/model/checkout';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/service/account.service';
import { BasketService } from 'src/app/service/basket.service';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { RapidApiService } from 'src/app/service/rapid-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-collect-delivery-address',
  templateUrl: './collect-delivery-address.component.html',
  styleUrls: ['./collect-delivery-address.component.css']
})
export class CollectDeliveryAddressComponent implements OnInit {

  checkout: Checkout;
  basket: Basket;
  address: Address = new Address();
  addressList: Address[] = [];

  shipAddressSameAsBilling: boolean;
  saveAddress: boolean;
  hideAddressEditForm: boolean;
  showCardSection: boolean;
  hidePostcodeLoookupForm: boolean;

  rapidApiResult: RapidApiResult;

  isError: boolean = false;
  message: String;
  postcodeAddressList: RapidApiAddress[];
  selectedDeliveryAddress: RapidApiAddress;
  postcode: string;
  errorMessage: string;
  customer: User;

  constructor(
    private rapidApiService: RapidApiService,
    private localContextService: LocalContextService,
    private router: Router,
    private basketService: BasketService,
    private accountService: AccountService,
    private _location: Location
  ) { }

  ngOnInit(): void {

    this.basket = this.localContextService.getBasket();
    this.customer = this.localContextService.getCustomer();
    if ( this.customer !== null && this.customer !== undefined){
      this.addressList = this.customer.addresses;
      if (this.addressList !== undefined && this.addressList.length > 0) {
        this.hidePostcodeLoookupForm = true;
        if (this.addressList.length == 1) {
          var add: Address = this.addressList[0];
          add.selected = true;
          this.localContextService.setDeliveryAddress(add);
        }
      } else {
        this.addNewAddress();
      }
    }
    this.errorMessage = null;
  }


  cancelAddressForm() {
    this.hideAddressEditForm = true;
  }

  addNewAddress() {
    this.hidePostcodeLoookupForm = false;
    this.address = new Address();
  }

  selectAddressCheckBox(a: Address, e: any) {
    for (let i = 0; i < this.addressList.length; i++) {
      let add: Address = this.addressList[i];
      if (this.addressList[i].postcode === a.postcode) {
        add.selected = e.target.checked;
      } else if (e.target.checked) {
        add.selected = false;
      }
    }
    this.addressList.forEach(a => {
      if (a.selected) {
        this.localContextService.setDeliveryAddress(a);
      }
    });

  }

  selectAddress(a: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      let add: Address = this.addressList[i];
      if (add.postcode === a.postcode) {
        add.selected = true;
        this.localContextService.setDeliveryAddress(add);
      } else {
        add.selected = false;
      }
    }
  }
  editAddress(a: Address) {
    this.address = a;
    this.hideAddressEditForm = false;
  }

  removeAddress(a: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i].postcode === a.postcode) {
        this.addressList.splice(i, 1);
        this.customer.addresses = this.addressList;
        this.localContextService.setCustomer(this.customer)
        this.accountService.updateCurrentCustomer();
      }
    }
    if (this.addressList.length === 0) {
      this.addNewAddress();
    }
  }
  onSubmitPostcodeLookup(postcodeLoookupForm: NgForm) {
    if (postcodeLoookupForm.valid) {
      if (this.address.postcode === undefined) {
        this.hidePostcodeLoookupForm = false;
      } else {
        // this.hidePostcodeLoookupForm = true;
        this.doPostcodeLookup(this.address.postcode);
      }
    }
  }

  doPostcodeLookup(postcode: string) {
    if (postcode === null && postcode === undefined) {
      return;
    }
    this.rapidApiService
      .lookupAddresses(postcode.trim())
      // .pipe(first())
      .subscribe(
        (data: RapidApiResult) => {
          // this.postcodeAddressList =  _.sortBy(data.addresses, 'building_number');
          this.rapidApiResult = data;
          this.postcodeAddressList = data.Summaries.sort(function (a, b) {
            return a.Id - b.Id
          });
          console.log('Address Lookup Response. ' + JSON.stringify(data));
          this.selectedDeliveryAddress = this.postcodeAddressList[0];
          this.postcode = postcode;
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  cancelAddressLookupForm() {
    this.hidePostcodeLoookupForm = true;
  }

  continueToPayment() {

    this.basketService.updateBasket(this.basket);
    this.localContextService.setBasket(this.basket);
    var deliveryAddress = this.localContextService.getDeliveryAddress();
    if ( deliveryAddress === null || deliveryAddress === undefined){
      this.errorMessage = "Please select Delivery Address";
      return;
    }
    this.errorMessage = null;
    this.updateAddressWithcustomerContactInfo();
    this.updateAddressList();
    if (this.address !== null) {
      this.router.navigate(['/collect-payment']).then();
    }

  }

  onSelectDeliveryAddress(selectAddress) {
    this.selectedDeliveryAddress = selectAddress;
    var city = this.selectedDeliveryAddress.Place.split(/[\s ]+/).pop()
    this.address.city = city;
    this.address.lineNumber1 = this.selectedDeliveryAddress.StreetAddress
    this.address.lineNumber2 = this.selectedDeliveryAddress.Place
    this.address.country = "UK"
    this.address.postcode = this.postcode;
    this.updateAddressWithcustomerContactInfo();
    this.localContextService.setDeliveryAddress(this.address);
  }

  private updateAddressList() {
    let existing: Address = this.addressList.find(
      (a) => (a.postcode === this.address.postcode)
    );
    if (!existing) {
      this.addressList.push(this.address);
    } else {
      existing.lineNumber1 = this.address.lineNumber1;
      existing.lineNumber2 = this.address.lineNumber2;
      existing.city = this.address.city;
      existing.country = this.address.country;
      existing.postcode = this.address.postcode;
      this.customer.addresses = this.addressList;
      this.localContextService.setCustomer(this.customer);
      this.accountService.updateCurrentCustomer();
    }
  }

  private updateAddressWithcustomerContactInfo() {
    var customer: User = this.localContextService.getCustomer();
    if ( customer !== null && customer !== undefined){
      this.address.firstName = customer.firstName;
      this.address.lastName = customer.lastName;
      this.address.email = customer.email;
      this.address.mobile = customer.mobile;
    }
  }

  getBasketTotal() {
    return this.basket.total;
  }

  backToBasket() {
    this._location.back();
  }
}
