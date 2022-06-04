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
import { LocalContextService } from './localcontext.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { basename } from '@angular/compiler-cli/src/ngtsc/file_system';
import { UserSession } from '../model/common-models';

@Injectable({
  providedIn: 'root',
})
export class BasketService {

  private SERVER_URL = environment.BASKET_SERVICE_URL;
  basketSubject$: BehaviorSubject<Basket>;
  basketName: string = "anonymous";
  private OBJECT_BASKET: string = "Basket";

  ipAddress: string;

  basket: Basket;
  customerSession: UserSession;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService) {
    this.basketSubject$ = new BehaviorSubject<Basket>(this.basket);
    this.getIPAddress();
    this.accountService.userSessionSubject$.subscribe((customerSession) => {
      this.customerSession = customerSession;
      if (customerSession === null || customerSession === undefined || customerSession.user === null || customerSession.user === undefined) {
        this.removeCustomerBasket();
      } else {
        var email: string = this.customerSession.user.email;
        console.log('Customer logged in: Getting Basket ' + email);
        var basketJson = localStorage.getItem(this.OBJECT_BASKET + "-" + email);
        if (basketJson !== undefined && basketJson !== null) {
          this.basket = JSON.parse(basketJson);
          this.publishBasket();
        } else {
          this.createNewBasket(email);
        }
      }
    });
  }


  public createNewBasket(email: string) {
    var basket: Basket = {
      items: [],
      id: 0,
      basketId: nanoid(),
      date: new Date(),
      email: email,
      orderReference: "",
      total: 0,
    };
    if (email !== undefined && email !== null) {
      localStorage.setItem(this.OBJECT_BASKET + "-" + email, JSON.stringify(basket));
    } else {
      localStorage.setItem(this.OBJECT_BASKET + "-Anonymous", JSON.stringify(basket));
    }

    this.basket = basket;
    this.publishBasket();
  }

  getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getBasketFromServer(email: string) {

    console.log('Retrieving Basket for customer ' + email);
    var url = this.SERVER_URL;
    var params = new HttpParams();
    params = params.set('email', email);

    // Get the basket for this customer from backend
    this.http.get<Basket[]>(url, { params: params })
      .subscribe(
        {
          next: data => {
            console.log('Basket retrieved for customer  ' + JSON.stringify(data));
            console.log('Basket retrieved for customer  ' + data.length);
            if (data !== null && data !== undefined && data.length > 0) {
              console.log('Basket retrieved for customer  ' + JSON.stringify(data));
              if (data[0] !== null) {
                this.basket = data[0];
                console.log('Basket retrieved for customer  ' + JSON.stringify(this.basket));
                this.publishBasket();
              }
            } else {
              // No basket currently saved in datastore, so load from local storage
              // this.createNewBasket();
              // this.localContextService.setBasket(this.basket);
            }
          },
          error: e => {
            console.error('Error when getting basket: ' + e);
            this.publishBasket();
          }
        }
      );
  }

  updateBasket(basket: Basket) {
    this.basket = basket;
    var url = this.SERVER_URL;
    var params = new HttpParams();
    params = params.set('basketId', this.basket.basketId);
    params = params.set('createIfNew', "true");

    this.basket.email = this.accountService.getUserEmail();
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
      this.createNewBasket(null);
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
    if (this.basket.items !== null && this.basket.items !== undefined && this.basket.items.length > 0) {
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

  removeCustomerBasket() {
    this.basket = null;
    localStorage.removeItem(this.OBJECT_BASKET);
    this.basketSubject$.next({ ...this.basket });
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
    this.updateBasket(this.basket);
    this.publishBasket();
  }

  private publishBasket() {
    console.log('Publishing basket..')
    this.calculateBasketTotal();
    if (this.basket.basketId !== null && this.basket.basketId !== undefined) {
      this.basket.basketId = nanoid();
    }
    this.setBasket(this.basket);

  }

  getBasket(): Basket {
    return this.basket;
  }

  public setBasket(basket: Basket) {
    localStorage.setItem(this.OBJECT_BASKET, JSON.stringify(basket));
    this.basketSubject$.next({ ...basket });
  }
}
