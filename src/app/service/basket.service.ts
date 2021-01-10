import { Injectable } from '@angular/core';
import { BasketItem, Basket } from '../model/basket.model';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  basket: Basket = {
    items: [],
    subTotal: 0,
    address: null,
    paymentCard: null,
  };
  subject$ = new BehaviorSubject<Basket>(this.basket);

  constructor() {
    let basket: Basket = JSON.parse(localStorage.getItem('basket'));
    if (basket !== null && basket !== undefined && basket.items.length !== 0) {
      this.basket = basket;
    }
    this.subject$.next({ ...this.basket });
  }

  removeBasket() {
    localStorage.removeItem('basket');
    let basket: Basket = {
      items: [],
      subTotal: 0,
      address: null,
      paymentCard: null,
    };
    this.basket = basket;
    this.subject$.next({ ...this.basket });
  }

  updateBasket(basket: Basket){
    this.basket = basket;
    this.subject$.next({ ...this.basket });
  }

  getBasketQty(id: string): number {
    if (
      this.basket !== null &&
      this.basket !== undefined &&
      this.basket.items.length !== 0
    ) {
      var i: BasketItem = this.basket.items.find((i) => i._id === id);
      if (i) {
        return i.qty;
      }
    }
    return 0;
  }

  addItemToBasket(product: ProductModel, qty: number) {
    if (this.basket === null || this.basket === undefined) {
      this.basket = {
        items: [],
        subTotal: 0,
        address: null,
        paymentCard: null
      };
    }
    if ( qty === 0){
      qty = 1;
    }
    //Find if the product already exist in the basket
    let exist: BasketItem = this.basket.items.find(
      (element) => element._id === product._id
    );
    if (exist) {
      exist.qty = exist.qty + qty;
      exist.subtotal = exist.qty * product.salePrice;
      exist.subtotal = +(+exist.subtotal).toFixed(2);
    } else {
      this.addNewItem(product, qty);
    }
    this.publishBasket();
    // this.toastService.show(basketItem.name + ' added to Basket', { classname: 'bg-success text-light', delay: 5000 });
  }

  private addNewItem(product: ProductModel, qty: number) {
    let basketItem: BasketItem = {
      _id: product._id,
      name: product.name,
      image: product.picture.thumbnail,
      price: product.salePrice,
      brand: product.brand,
      qty: qty,
      subtotal: +(qty * product.salePrice).toFixed(2),
    };
    this.basket.items.push(basketItem);
  }

  calculateBasketTotal() {
    let total: number = 0;
    this.basket.items.forEach((item) => {
      total = total + item.qty * item.price;
    });
    this.basket.subTotal = total;
    this.basket.subTotal = +(+this.basket.subTotal).toFixed(2);
  }

  updateItem(id: string, qty: number) {
    let exist: BasketItem = this.basket.items.find(
      (element) => element._id === id
    );
    if (exist) {
      exist.qty = qty;
      this.publishBasket();
    }
  }
  removeItem(id: String) {
    console.log('Removing product ${id}');
    var items = this.basket.items;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item._id === id) {
        console.log('Removing product ${item.name}');
        this.basket.items.splice(i, 1);
      }
    }
    this.publishBasket();
  }

  private publishBasket() {
    this.calculateBasketTotal();
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.subject$.next({ ...this.basket });
  }
}
