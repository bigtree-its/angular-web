import { Injectable } from '@angular/core';
import { BasketItem, Basket } from '../model/basket.model';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '../model/product.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { nanoid } from 'nanoid'
import { ActionResponse } from '../model/action-response';
import { User } from '../model/user';
import { LocalContextService } from './localcontext.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {

  private SERVER_URL = environment.BASKET_SERVICE_URL;
  private BASKETS = environment.BASKETS;

  basketName: string = "anonymous";

  basket: Basket = {
    items: [],
    id: 0,
    basketId: nanoid(),
    date: new Date(),
    email: "",
    orderReference: "",
    total: 0,
  };
  customer: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localContextService: LocalContextService,
    private acccountService: AccountService) {

    this.localContextService.customer$.subscribe((customer)=>{
      this.customer = customer;
      if (this.customer !== null && this.customer !== undefined){
        console.log('Customer logged in: Getting Basket '+ this.customer.email );
        this.getBasket(this.customer.email);
      }
    })
    this.customer = localContextService.getCustomer();
    var basket: Basket = localContextService.getBasket();
    if (basket === null || basket === undefined) {
      localContextService.setBasket(this.basket);
    } else {
      this.basket = basket;
    }
  }

  getBasket(email: string) {

    console.log('Retrieving Basket for customer '+ email);
    var url = this.SERVER_URL;
    var params = new HttpParams();
    params = params.set('email', email);

    // Get the basket for this customer from backend
    this.http.get<Basket>(url, { params: params })
      .subscribe(
        {
          next: data => {
            if (data !== null && data !== undefined) {
              console.log('Basket retrieved for customer  '+ JSON.stringify(data));
              this.basket = data[0];
              console.log('Basket retrieved for customer  '+ JSON.stringify(this.basket));
              this.publishBasket();
            } else {
              // No basket currently saved in datastore, so load from local storage
              this.createNewBasket();
              this.localContextService.setBasket(this.basket);
            }
          },
          error: e => {
            console.error('Error when getting basket: ' + e);
            this.publishBasket();
          }
        }
      );
  }

  createNewBasket(){
    this.basket = {
      items: [],
      id: 0,
      basketId: nanoid(),
      date: new Date(),
      email: "",
      orderReference: "",
      total: 0,
    };
  }


  updateBasket(basket: Basket) {
    this.basket = basket;
    var url = this.SERVER_URL;
    var params = new HttpParams();
    params = params.set('basketId', this.basket.basketId);
    params = params.set('createIfNew', "true");

    if (this.acccountService.isAuthenticated()) {
      this.basket.email = this.localContextService.getCustomer().email;
    }
    console.log('Updating basket: ' + JSON.stringify(basket))

    this.http.put<ActionResponse>(url, this.basket, { params: params })
      .subscribe(
        {
          next: data => {
            var actionResponse: ActionResponse = data;
            if (actionResponse.status === true) {
              console.log('Basket is sucessfully updated');
            } else {
              console.log('Basket update failed');
            }
          },
          error: e => {
            console.error('Error when getting basket: ' + e);
          }
        }
      );
  }

  initializeBasket() {
    if (this.basket === null || this.basket === undefined) {
      console.log('Basket is null. Initializing..')
      this.basket = {
        items: [],
        id: 0,
        basketId: nanoid(),
        date: new Date(),
        email: this.localContextService.getCustomer().email,
        orderReference: "",
        total: 0,
      };
    } else {
      console.log('Basket Initializing..')
      this.basket.basketId = nanoid(),
      this.basket.items = [];
      this.basket.total = 0;
      this.basket.orderReference = "";
      this.basket.email = "";
    }
    this.localContextService.setBasket(this.basket);
    console.log('Basket: ' + JSON.stringify(this.basket));
  }
  getBasketQty(id: string): number {
    if (
      this.basket !== null &&
      this.basket !== undefined &&
      this.basket.items.length !== 0
    ) {
      var i: BasketItem = this.basket.items.find((i) => i.productId === id);
      if (i) {
        return i.quantity;
      }
    }
    return 0;
  }

  addItemToBasket(product: ProductModel, qty: number) {
    console.log('Add item to basket')
    if (this.basket === null || this.basket === undefined) {
      console.log('Basket is null')
      this.initializeBasket();
    }
    if (qty === 0) {
      qty = 1;
    }
    //Find if the product already exist in the basket
    let exist: BasketItem = this.basket.items.find(
      (element) => element.productId === product._id
    );
    if (exist) {
      exist.quantity = exist.quantity + qty;
      exist.total = exist.quantity * product.salePrice;
      exist.total = +(+exist.total).toFixed(2);
    } else {
      this.addNewItem(product, qty);
    }
    this.publishBasket();
    // this.toastService.show(basketItem.name + ' added to Basket', { classname: 'bg-success text-light', delay: 5000 });
  }

  private addNewItem(product: ProductModel, qty: number) {
    let basketItem: BasketItem = {
      id: 0,
      productId: product._id,
      productName: product.name,
      image: product.picture.thumbnail,
      price: product.salePrice,
      brand: product.brand,
      quantity: qty,
      total: +(qty * product.salePrice).toFixed(2),
    };
    this.basket.items.push(basketItem);
  }

  calculateBasketTotal() {
    console.log('Calculating basket total');

    let total: number = 0;
    if ( this.basket.items !== null && this.basket.items !== undefined && this.basket.items.length > 0){
      this.basket.items.forEach((item) => {
        total = total + item.quantity * item.price;
      });
    }
    this.basket.total = total;
    this.basket.total = +(+this.basket.total).toFixed(2);
  }

  updateItem(id: string, qty: number) {
    let exist: BasketItem = this.basket.items.find(
      (element) => element.productId === id
    );
    if (exist) {
      exist.quantity = qty;
      this.publishBasket();
    }
  }

  removeItem(id: String) {
    console.log('Removing product ${id}');
    var items = this.basket.items;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.productId === id) {
        console.log('Removing product ${item.name}');
        this.basket.items.splice(i, 1);
      }
    }
    this.publishBasket();
  }

  private publishBasket() {
    console.log('Publishing basket..')
    this.calculateBasketTotal();
    if ( this.basket.basketId !== null && this.basket.basketId !== undefined ){
      this.basket.basketId = nanoid();
    }
    console.log('Basket Id : ' + this.basket.basketId);
    console.log('Basket name : ' + this.basketName);
    this.localContextService.setBasket(this.basket);
  }
}
