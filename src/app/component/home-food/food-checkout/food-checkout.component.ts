import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RapidApiByPostcodeResponse, RapidApiByPostcodeResponseSummary } from 'src/app/model/address';
import { PaymentIntentRequest, PaymentIntentResponse } from 'src/app/model/order';
import { AccountService } from 'src/app/service/account.service';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { RapidApiService } from 'src/app/service/rapid-api.service';
import { Chef, FoodOrder, LocalChef } from 'src/app/model/localchef';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Address, Customer, CustomerSession, SignupRequest } from 'src/app/model/common-models';

@Component({
  selector: 'app-food-checkout',
  templateUrl: './food-checkout.component.html',
  styleUrls: ['./food-checkout.component.css']
})
export class FoodCheckoutComponent implements OnInit {

  form: FormGroup;
  foodOrder: FoodOrder = new FoodOrder();
  confirmedOrder: FoodOrder;
  address: Address = new Address();
  addressLookup: Address = new Address();
  hidePostcodeLoookupForm: boolean;
  postcodeAddressList: RapidApiByPostcodeResponseSummary[];
  rapidApiByPostcodeResponseSummary: RapidApiByPostcodeResponseSummary;
  postcode: string;
  customerSession: CustomerSession;
  customer: Customer;
  hideAddressSection: boolean;
  paymentIntentResponse: PaymentIntentResponse;
  stripeConfirmationError: string;
  localChef: LocalChef;
  serviceMode: string = "Collection";
  customerLoggedIn: boolean;
  addressSelected: boolean;
  action: string;
  loginEmail: string = '';
  loginPassword: string = '';
  signupPassword: string = '';
  signupMobile: string = '';
  signupFullname: string = '';
  signupEmail: string = '';
  signupErrorResponse: string;
  loginErrorResponse: string;
  orderConfirmationMessage: string;
  hidePaymentSection: boolean;
  showOrderConfirmation: boolean;

  constructor(
    private router: Router,
    private foodOrderService: FoodOrderservice,
    private rapidApiService: RapidApiService,
    private accountService: AccountService,
    private orderService: FoodOrderservice,
  ) { }

  ngOnInit(): void {

    this.isLoggedIn();
    this.customerSession = this.accountService.getCustomerSession();
    if (this.customerSession !== undefined && this.customerSession !== null && this.customerSession.customer !== null && this.customerSession.customer !== undefined) {
      this.customer = this.customerSession.customer;
      this.address = this.customer.address;
      console.log('The customer : '+ JSON.stringify(this.customer));
    }else{
      this.customerLoggedIn = false;
    }
    this.localChef = this.foodOrderService.getChef();
    this.foodOrder = this.foodOrderService.getOrder();
    console.log('ChefOrder on Storage: '+ JSON.stringify(this.foodOrder));
    console.log('Chef on Storage: '+ JSON.stringify(this.localChef));
    console.log('Customer on Storage: '+ JSON.stringify(this.customerSession));
  }

  ngAfterViewInit(): void {
    const stripe = (<any>window).Stripe;
    (<any>window).loadStripeElements();
  }

  isLoggedIn() {
    this.customerLoggedIn = this.accountService.isAuthenticated();
  }

  actionLogin() {
    this.action = "login";
  }
  actionSignup() {
    this.action = "signup";
  }
  actionForgotPassword(){
    this.action = "forgotPassword";
    this.router.navigate(['/forgot-password']).then();
  }

  get loginForm() { return this.form.controls; }

  doLoginSubmit() {
    console.log('Submitting log in Email ' + this.loginEmail);
    console.log('Submitting log in Password ' + this.loginPassword);
    this.loginCustomer(this.loginEmail, this.loginPassword);
  }

  loginCustomer(email: string, password: string) {
    this.accountService.login(email, password)
      .pipe(first())
      .subscribe(
        data => {
          if ( data === null || data === undefined){
            this.customerLoggedIn = false;
            this.loginErrorResponse  = "Username or Password not correct.";
          }else{
            var customerSession: CustomerSession = data;
            if( customerSession.success){
              this.customerLoggedIn = true;
              this.loginErrorResponse = undefined;
            }else{
              this.loginErrorResponse = customerSession.message;
            }
          }
          // this.router.navigate([this.returnUrl]);
         
        },
        error => {
          this.customerLoggedIn = false;
          this.loginErrorResponse  = "Username or Password not correct.";
        });
  }

  selectChef() {
    this.router.navigate(['/chef', this.localChef._id]).then();
  }

  doSignupSubmit() {
    var signupRequest: SignupRequest = new SignupRequest();
    signupRequest.email = this.signupEmail;
    signupRequest.password = this.signupPassword;
    signupRequest.mobile = this.signupMobile;
    signupRequest.fullName = this.signupFullname;
    console.log('Submitting Signup ' + JSON.stringify(signupRequest));
    this.accountService.register(signupRequest)
      .pipe(first())
      .subscribe(
        data => {
          console.error('Signup Successful');
          this.loginCustomer(signupRequest.email, signupRequest.password);
          this.signupErrorResponse = undefined;
        },
        error => {
          console.error('Signup Unsuccessful. '+ JSON.stringify(error));
          this.signupErrorResponse = error.error.detail + ". Please login.";
          console.error('Signup Error: '+ this.signupErrorResponse);
        });
  }
  private createOrder(): FoodOrder {
    return {
      items: [],
      chefId: "",
      currency: "",
      customerEmail: "",
      customerMobile: "",
      subTotal: 0.00,
      total: 0.00,
      deliveryFee: 0.00,
      packagingFee: 0.00,
      saleTax: 0.00,
      orderTime: new Date(),
      pickupTime: new Date(),
      deliveryTime: new Date(),
      delivery: false,
      pickup: false,
      status: "CREATED",
      reference: "PaymentReference",
      paymentReference: "PaymentReference",
      customer: null,
      chef: null,
      serviceMode: "Collection",
    };
  }

  onSubmitPostcodeLookup(postcodeLoookupForm: NgForm) {
    console.log('Search address form submitted..')
    if (postcodeLoookupForm.valid) {
      this.doPostcodeLookup(this.addressLookup.postcode);
    }
  }

  doPostcodeLookup(postcode: string) {
    if (postcode === null && postcode === undefined) {
      return;
    }
    this.rapidApiService
      .lookupAddresses(this.addressLookup.postcode.trim())
      // .pipe(first())
      .subscribe(
        (data: RapidApiByPostcodeResponse) => {
          this.postcodeAddressList = data.Summaries;
          this.addressSelected = false;
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  onSelectDeliveryAddress(selectAddress: RapidApiByPostcodeResponseSummary) {
    var city = selectAddress.Place.split(/[\s ]+/).pop();
    if (this.address == null || this.address === undefined) {
      this.address = new Address();
    }
    this.address.city = city;
    this.address.addressLine1 = selectAddress.StreetAddress
    this.address.addressLine2 = selectAddress.Place
    this.address.country = "UK"
    this.address.postcode = this.addressLookup.postcode;
    this.addressSelected = true;
  }

  makePayment() {
    console.log('Creating payment intent');
    var paymentIntentRequest = new PaymentIntentRequest();
    // paymentIntentRequest.customerEmail = this.customer.email;
    if ( this.customer !== undefined && this.customer.contact !== undefined){
      this.foodOrder.customerEmail = this.customer.contact.email;
    }
    paymentIntentRequest.currency = "GBP";
    paymentIntentRequest.subTotal = this.foodOrder.subTotal * 100;
    paymentIntentRequest.deliveryCost = this.foodOrder.deliveryFee * 100;
    paymentIntentRequest.packagingCost = this.foodOrder.packagingFee * 100;
    paymentIntentRequest.saleTax = this.foodOrder.saleTax * 100;
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
      } else {
        console.log('Unable to collect payment from your card.');
        (<any>window).changeLoadingState(false);
      }
    });
  }

  handleStripConfirmation(response) {
    if (response !== null && response !== undefined) {
      var paymentIntent = response.paymentIntent;
      var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
      console.log('Payment successfull: ' + paymentIntentJson);
      if (response.error) {
        this.stripeConfirmationError = response.error.message;
        this.hidePaymentSection = false;
      } else {
        this.hidePaymentSection = true;
        this.foodOrder.paymentReference = paymentIntent.id;
        this.confirmPurchase();
      }
    }else{
      this.hidePaymentSection = false;
    }
  }

  selectPickup() {
    this.serviceMode = "Pickup";
  }

  selectDelivery() {
    this.serviceMode = "Delivery";
  }
  confirmPurchase() {
    console.log('Confirming order..');
    console.log('The customer object: '+ JSON.stringify(this.customer))
    console.log('The customer adress object: '+ JSON.stringify(this.address))
    this.foodOrder.status ="CREATED";
    this.foodOrder.chefId = this.localChef._id;
    this.foodOrder.customerEmail = this.customer.contact.email;
    this.foodOrder.customerMobile = this.customer.contact.mobile;
    this.foodOrder.serviceMode = this.serviceMode;
    this.foodOrder.chef = new Chef();
    this.foodOrder.chef.address = this.localChef.address;
    this.foodOrder.chef.contact = this.localChef.contact;
    this.foodOrder.chef.chefId = this.localChef._id;
    this.foodOrder.chef.name = this.localChef.name;
    this.foodOrder.chef.image = this.localChef.coverPhoto;
    this.foodOrder.chef.specials = this.localChef.specials;
    this.foodOrder.customer = this.customer;
    this.foodOrder.customer.address = this.address;
    this.foodOrderService.placeOrder(this.foodOrder).subscribe((result: FoodOrder) => {
      this.confirmedOrder = result;
      this.showOrderConfirmation = true;
      if (
        this.confirmedOrder !== null &&
        this.confirmedOrder !== undefined &&
        this.confirmedOrder.status !== null &&
        this.confirmedOrder.status !== undefined
      ) {
        console.log('Your order has been placed.');
        this.router.navigate(['/order-status', this.confirmedOrder.reference]).then();
      } else {
        this.orderConfirmationMessage = 'Your order cannot be completed for now.';
        console.log('Your order cannot be completed for now.');
      }
    });
  }

  getChefAddress(): string {
    if (this.localChef === null || this.localChef === undefined) {
      return;
    }
    var address: string = ""
    if (this.localChef.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.addressLine1;
    }
    if (this.localChef.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.addressLine2;
    }
    if (this.localChef.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.city;
    }
    if (this.localChef.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.postcode;
    }
    return address;
  }

}
