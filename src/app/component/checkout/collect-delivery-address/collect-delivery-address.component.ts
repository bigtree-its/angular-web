import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Address, RapidApiAddress, RapidApiByPostcodeResponse, RapidApiByPostcodeResponseSummary, RapidApiResult } from 'src/app/model/address';
import { Basket } from 'src/app/model/basket.model';
import { Checkout } from 'src/app/model/checkout';
import { CustomerSession, Customer } from 'src/app/model/customer';
import { AccountService } from 'src/app/service/account.service';
import { BasketService } from 'src/app/service/basket.service';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { RapidApiService } from 'src/app/service/rapid-api.service';
import { Location } from '@angular/common';
import { Order, OrderItem, PaymentIntentRequest, PaymentIntentResponse } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';

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

  isError: boolean = false;
  message: String;
  postcodeAddressList: RapidApiByPostcodeResponseSummary[];
  selectedDeliveryAddress: RapidApiByPostcodeResponseSummary;
  postcode: string;
  errorMessage: string;
  customerSession: CustomerSession;
  customer: Customer;
  order: Order;
  paymentIntentResponse : PaymentIntentResponse;
  stripeConfirmationError:string;
  
  constructor(
    private rapidApiService: RapidApiService,
    private localContextService: LocalContextService,
    private router: Router,
    private basketService: BasketService,
    private accountService: AccountService,
    private orderService: OrderService,
    private _location: Location
  ) { }

  ngOnInit(): void {

    this.basket = this.localContextService.getBasket();
    this.customerSession = this.localContextService.getCustomerSession();
    if ( this.customerSession !== null && this.customerSession !== undefined){
      this.customer = this.customerSession.customer;
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
    this.createOrder(1.50);
  }

  ngAfterViewInit(): void {
    const stripe = (<any>window).Stripe;
    (<any>window).loadStripeElements();
  }

  createOrder(deliveryCost: number) {
    var saleTax = this.percentage(this.basket.total, 1);
    this.order = new Order();
    this.order.address = this.address;
    this.order.email = this.customer.email;
    this.order.currency = "GBP";
    this.order.subTotal = this.basket.total;
    this.order.saleTax = saleTax;
    this.order.shippingCost = deliveryCost;
    this.order.packagingCost = 0.50;
    this.order.totalCost = + (+this.basket.total + saleTax + deliveryCost + this.order.packagingCost).toFixed(2);
    var items: OrderItem[] = [];
    this.basket.items.map(bi => {
      var item: OrderItem = new OrderItem();
      item.price = bi.price;
      item.productId = bi.productId;
      item.productName = bi.productName;
      item.quantity = bi.quantity;
      item.image = bi.image;
      item.total = + (bi.quantity * bi.price ).toFixed(2);
      items.push(item);
    });
    this.order.items = items;
    console.log('Creating order: '+ JSON.stringify(this.order))
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
        this.customerSession.customer = this.customer;
        this.localContextService.setCustomerSession(this.customerSession)
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
        (data: RapidApiByPostcodeResponse) => {
          // this.postcodeAddressList = data.summaries.sort(function (a, b) {
          //   return a.Id - b.Id
          // }); 
          this.postcodeAddressList = data.Summaries;
          console.log('Address Lookup Response. ' + data);
          console.log('Address Lookup Response. ' + JSON.stringify(data));
          console.log('Address List. ' + data.Summaries);
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
      this.customerSession.customer = this.customer;
      this.localContextService.setCustomerSession(this.customerSession);
      this.accountService.updateCurrentCustomer();
    }
  }

  private updateAddressWithcustomerContactInfo() {
    var customer: Customer = this.localContextService.getCustomerSession().customer;
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

  percentage(num, per) {
    return (num / 100) * per;
  }
  
  confirmPurchase() {
    console.log('Confirming order..')
    this.orderService.placeOrder(this.order);
  }

  handleStripConfirmation(response){
    if ( response !== null && response !== undefined){
      var paymentIntent = response.paymentIntent;
      var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
      console.log('Payment successfull: '+ paymentIntentJson);
      if ( response.error){
        this.stripeConfirmationError = response.error.message;
      }else{
        this.order.paymentReference = paymentIntent.id;
        this.confirmPurchase()
      }
    }
  }

  makePayment(){
    console.log('Creating payment intent');
    var paymentIntentRequest = new PaymentIntentRequest();
    paymentIntentRequest.customerEmail = this.customer.email;
    paymentIntentRequest.currency = "GBP";
    paymentIntentRequest.subTotal = this.order.subTotal * 100;
    paymentIntentRequest.deliveryCost = this.order.shippingCost * 100;
    paymentIntentRequest.packagingCost = this.order.packagingCost * 100;
    paymentIntentRequest.saleTax = this.order.saleTax * 100;
    (<any>window).changeLoadingState(true);
    this.orderService.createPaymentIntent(paymentIntentRequest).subscribe((result: PaymentIntentResponse) => {
      this.paymentIntentResponse = result;
      if (
        this.paymentIntentResponse !== null &&
        this.paymentIntentResponse !== undefined &&
        this.paymentIntentResponse.clientSecret !== null &&
        this.paymentIntentResponse.clientSecret !== undefined
      ) {
        var stripeElements = (<any>window).getStripeElements();
        (<any>window).pay(stripeElements.stripe, stripeElements.card, this.paymentIntentResponse.clientSecret, this);
      }else{
        console.log('Unable to collect payment from your card.')
      }
    });
  }
}
