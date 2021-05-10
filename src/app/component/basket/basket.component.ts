import { Component, OnInit } from '@angular/core';
import { Basket, BasketItem } from 'src/app/model/basket.model';
import { LocalContextService } from 'src/app/service/localcontext.service';
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
    private LocalContextService: LocalContextService,
    private accountService: AccountService,
    private basketService: BasketService,
    private _location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.LocalContextService.basket$.subscribe(b => {
      if (b !== null && b !== undefined) {
        this.basket = b;
        this.basket.total = 0;
        this.calculateBasketTotal();
      } else {
        this.basket = this.LocalContextService.getBasket();
        if (this.basket !== null && this.basket !== undefined) {
          this.basket.total = 0;
          this.calculateBasketTotal();
        }
      }
    })

  }
  proceedToCheckout() {
    this.router.navigate(['/delivery-address']).then();
  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  getFraction(n) {
    var s = String(n);
    return s.slice(s.indexOf('.') + 1);
  }

  calculateBasketTotal() {
    if (this.basket.items !== null && this.basket.items !== undefined && this.basket.items.length > 0) {
      this.basket.items.forEach(item => {
        this.basket.total = + (+this.basket.total + (+item.quantity * +item.price)).toFixed(2);
      })
    }

  }

  remoteFromBasket(id: string) {
    let basketItem: BasketItem = this.basket.items.find(element => element.productId === id);
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

  getBasketTotal() {
    return this.getPrettyPrintPrice(this.basket.total);
  }

  backToResults() {
    this._location.back();
  }

}
