import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Basket } from 'src/app/model/basket.model';
import { Order, OrderItem, PaymentIntentResponse, PaymentIntentRequest } from 'src/app/model/order';
import { GetAddressIOService } from 'src/app/service/get-address-io.service';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { OrderService } from 'src/app/service/order.service';
import { AccountService } from 'src/app/service/account.service';
import { BasketService } from 'src/app/service/basket.service';
import { Address, User, UserSession } from 'src/app/model/common-models';

@Component({
  selector: 'app-collect-payment',
  templateUrl: './collect-payment.component.html',
  styleUrls: ['./collect-payment.component.css']
})
export class CollectPaymentComponent implements OnInit,AfterViewInit {

  orderTotal:number;
  basket: Basket;
  address: Address;
  order: Order;
  paymentIntentResponse: PaymentIntentResponse;
  stripeConfirmationError:string;
  customerSession: UserSession;
  customer: User;

  constructor( private _location: Location,
    private orderService: OrderService,
    private accountService: AccountService,
    private basketService: BasketService,
    private localContextService: LocalContextService,
    private getAddressIOService: GetAddressIOService,
    private router: Router) { }

  ngOnInit(): void {
    this.address = this.localContextService.getDeliveryAddress();
    this.basket = this.basketService.getBasket();
    this.customerSession = this.accountService.getUserSession();
    if ( this.customerSession !== null && this.customerSession !== undefined){
      this.customer = this.customerSession.user;
    }
    this.createOrder(1.50);
    console.log('Postage Address: '+ JSON.stringify(this.address))
  }

  ngAfterViewInit(): void {
    const stripe = (<any>window).Stripe;
    (<any>window).loadStripeElements();
  }

  calculateDeliveryCost() {
    this.getAddressIOService.
    getDistance(this.address.postcode)
    .subscribe((data) =>{
      if ( data !== null){
        var deliveryCost = 0.00;
        var distance: number = Math.round(Number(data.metres));
        var distanceInKm: number = (distance/1000);
        if ( distance > 1000 ){
          var deliveryCost: number = distanceInKm * 0.10;
          if ( deliveryCost > 4){
            deliveryCost = 4.00;
          }
        }
        this.createOrder(deliveryCost);
        console.log(`Distance to delivery address: ${distanceInKm} km'. Cost: ${deliveryCost}`);
      }
    }, (error: HttpErrorResponse)=>{
      console.log(`Distance to delivery address resulted with an error.{ status: ${error.status}, Message: ${error.error.Message} }`);
      var deliveryCost = 0.50;
      this.createOrder(deliveryCost);
    })
  }

  createOrder(deliveryCost: number) {
    console.log('Creating order..')
    var saleTax = this.percentage(this.basket.total, 1);
    this.order = new Order();
    this.order.date = new Date();
    this.order.address = this.address;
    // this.order.paymentCard = this.paymentCard;
    this.order.email = this.customer.email;
    this.order.currency = "GBP";
    this.order.subTotal = this.basket.total;
    this.order.saleTax = saleTax;
    this.order.shippingCost = deliveryCost;
    this.order.packagingCost = 0.50;
    this.order.totalCost = + (+this.basket.total + saleTax + deliveryCost + this.order.packagingCost).toFixed(2);
    this.order.expectedDeliveryDate = new Date();
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
      if ( response.error){
        this.stripeConfirmationError = response.error.message;
      }else{
         this.confirmPurchase()
      }
    }
  }

  makePayment(){
    console.log('Creating payment intent');
    var paymentIntentRequest = new PaymentIntentRequest();
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

  backToDeliveryAddress() {
    this._location.back();
  }
}
