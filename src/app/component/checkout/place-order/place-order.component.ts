import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/model/address';
import { PaymentCard } from 'src/app/model/payment-card';
import { MessengerService } from 'src/app/service/messenger.service';
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


  address: Address;
  paymentCard: PaymentCard;
  basket: Basket;
  user: User;

  constructor(
    private _location: Location,
    private messengerService: MessengerService,
    private accountService: AccountService,
    private orderService: OrderService,
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.messengerService.deliveryAddressSubject$.subscribe(address => {
      this.address = address;
    })

    this.messengerService.paymentCardSubject$.subscribe(paymentCard => {
      this.paymentCard = paymentCard;
    })

    this.basketService.subject$.subscribe(basket => {
      this.basket = basket;
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
    return this.basket.total;
  }

  confirmPurchase() {
    console.log('Confirming order..')
    var order: Order = new Order();
    order.date = new Date();
    order.address = this.address;
    order.paymentCard = this.paymentCard;
    order.email = this.user.email;
    order.currency = "GCP";
    order.subTotal = this.basket.total;
    order.saleTax = this.basket.total;
    order.shippingCost = this.basket.total;
    order.totalCost = this.basket.total;
    order.expectedDeliveryDate = new Date();
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
    order.items = items;
    this.orderService.placeOrder(order);
  }
}
