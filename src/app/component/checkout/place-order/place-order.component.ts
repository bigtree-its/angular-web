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
    private router: Router
  ) { }

  ngOnInit(): void {

    this.basketService.subject$.subscribe(basket => {
      this.basket = basket;
      this.address = basket.address;
      this.paymentCard = basket.paymentCard;
      if ( this.basket !== undefined ){
        this.createOrder();
      }
    })

    this.user = this.accountService.userValue;
    if (this.user === null || this.user === undefined) {
      this.router.navigate(['/login']);
    }
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

  createOrder(){
    var deliveryCost  = this.deliveryCost(this.basket.subTotal);
    var saleTax = this.percentage(this.basket.subTotal, 20);
    console.log('Delivery Cost: '+ deliveryCost);
    console.log('Sale Tax: '+ saleTax);
    this.order = new Order();
    this.order.date = new Date();
    this.order.address = this.address;
    this.order.paymentCard = this.paymentCard;
    this.order.email = this.user.email;
    this.order.currency = "GBP";
    this.order.subTotal = this.basket.subTotal;
    this.order.saleTax = saleTax;
    this.order.shippingCost = deliveryCost;
    this.order.totalCost = + (+this.basket.subTotal + saleTax + deliveryCost ).toFixed(2);
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

   percentage(num, per)
  {
    return (num/100)*per;
  }

  deliveryCost(total: number)
  {
    if ( total < 40){
      return this.percentage(total, 2);
    }
    return 0;
  }
  confirmPurchase() {
    console.log('Confirming order..')
    this.orderService.placeOrder(this.order);
  }
}
