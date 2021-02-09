import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/model/address';
import { PaymentCard } from 'src/app/model/payment-card';
import { Basket } from 'src/app/model/basket.model';
import { Location } from '@angular/common';
import { AccountService } from 'src/app/service/account.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { Order, OrderItem } from 'src/app/model/order';
import { BasketService } from 'src/app/service/basket.service';
import { GetAddressIOService } from 'src/app/service/get-address-io.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  address: Address = new Address();
  paymentCard: PaymentCard = new PaymentCard();
  basket: Basket = new Basket();
  user: User = new User();
  order: Order = new Order();

  constructor(
    private _location: Location,
    private accountService: AccountService,
    private orderService: OrderService,
    private basketService: BasketService,
    private getAddressIOService: GetAddressIOService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.basketService.subject$.subscribe(basket => {
      this.basket = basket;
      this.address = basket.address;
      this.paymentCard = basket.paymentCard;
      if (this.basket !== undefined) {
        this.calculateDeliveryCost();
      }
    })

    this.user = this.accountService.userValue;
    if (this.user === null || this.user === undefined) {
      this.router.navigate(['/login']);
    }
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
  getMaskedCardNumber() {
    if (this.paymentCard !== undefined) {
      var masked = "**** " + this.paymentCard.cardNumber.substr(11, 4);
      return masked;
    }
    return 'XXXX XXXX XXXX XXXX';
  }

  editDeliveryAddress() {
    this._location.back();
  }

  editPaymentMethod() {
    this._location.back();
  }

  getBasketTotal() {
    return this.basket.subTotal;
  }

  createOrder(deliveryCost: number) {
    var saleTax = this.percentage(this.basket.subTotal, 1);
    console.log('Sale Tax: ' + saleTax);
    this.order = new Order();
    this.order.date = new Date();
    this.order.address = this.address;
    this.order.paymentCard = this.paymentCard;
    this.order.email = this.user.email;
    this.order.currency = "GBP";
    this.order.subTotal = this.basket.subTotal;
    this.order.saleTax = saleTax;
    this.order.shippingCost = deliveryCost;
    this.order.packagingCost = 0.50;
    this.order.totalCost = + (+this.basket.subTotal + saleTax + deliveryCost + 0.50).toFixed(2);
    this.order.expectedDeliveryDate = new Date();
    var items: OrderItem[] = [];
    this.basket.items.map(bi => {
      var item: OrderItem = new OrderItem();
      item.price = bi.price;
      item.productId = bi._id;
      item.productName = bi.name;
      item.quantity = bi.qty;
      item.total = bi.price * bi.qty;
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
}
