import { Component, OnInit } from '@angular/core';
import { Basket, BasketItem } from 'src/app/model/basket.model';
import { MessengerService } from 'src/app/service/messenger.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { BasketService } from 'src/app/service/basket.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  basket: Basket;

  constructor(
    private messengerService: MessengerService,
    private accountService: AccountService,
    private basketService: BasketService,
    private _location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.basketService.subject$.subscribe(basket => { 
      this.basket = basket
      this.basket.total = 0; 
      this.calculateBasketTotal();
    })
  }
  proceedToCheckout(){
    console.log(JSON.stringify(this.accountService.userValue));

    if ( this.accountService.userValue === undefined || this.accountService.userValue === null){
      this.router.navigate(['/login']).then();
    }else{
      this.router.navigate(['/checkout']).then();
    }
  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  getFraction(n) {
    var s = String(n);
    return s.slice(s.indexOf('.') + 1);
  }

  calculateBasketTotal() {
    this.basket.items.forEach(item => {
      this.basket.total = + (+this.basket.total + ( +item.qty * +item.price )).toFixed(2);
    })
  }

  remoteFromBasket(id: string) {
    let basketItem: BasketItem = this.basket.items.find(element => element._id === id);
    if (basketItem) {
      this.basket.items.reduce
    }
  }
  getPrettyPrintPrice(n: number) {
    var s = String(n);
    if (s.indexOf('.') === -1) {
      s = s + '.00';
    } else if (s.split('.')[1].length === 1) {
      s = s + '0';
    }
    return s;
  }

  getBasketTotal(){
    return this.getPrettyPrintPrice(this.basket.total);
  }

  backToResults() {
    this._location.back();
  }

}
