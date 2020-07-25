import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasketItem, Basket } from '../model/basket.model';
import { Address } from '../model/address';
import { PaymentCard } from '../model/payment-card';
import { AppToastService } from './AppToastService';
import { Category, Department } from '../model/product.model';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {


  basket: Basket = {
    items: [],
    total: 0
  };

  private deliveryAddress: Address;
  private paymentCard: PaymentCard;
  private catsByDepMap = new Map<string, Category[]>();
  private subCatTree = new Map<string, Category[]>();
  subject$ = new BehaviorSubject<Basket>(this.basket);
  deliveryAddressSubject$: BehaviorSubject<Address>;
  paymentCardSubject$: BehaviorSubject<PaymentCard>;
  departments$: BehaviorSubject<Department[]>;
  categories$: BehaviorSubject<Category[]>;
  deps: Department[] = [];
  cats: Category[] = [];

  constructor(
    private toastService: AppToastService
  ) {
    let basket: Basket = JSON.parse(localStorage.getItem('basket'));
    let address: Address = JSON.parse(localStorage.getItem('deliveryAddress'));
    let card: PaymentCard = JSON.parse(localStorage.getItem('paymentCard'));
    this.deliveryAddressSubject$ = new BehaviorSubject<Address>(this.deliveryAddress);
    this.paymentCardSubject$ = new BehaviorSubject<PaymentCard>(this.paymentCard);
    this.departments$ = new BehaviorSubject<Department[]>(this.deps);
    this.categories$ = new BehaviorSubject<Category[]>(this.cats);

    if (basket !== null && basket !== undefined && basket.items.length !== 0) {
      this.basket = basket;
    }
    if (address !== null && address !== undefined) {
      this.deliveryAddress = address;
      this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
    }
    if (card !== null && card !== undefined) {
      this.paymentCard = card;
      this.paymentCardSubject$.next({ ...this.paymentCard });
    }
    this.subject$.next({ ...this.basket });
  }

  getBasketQty(id: string): number {
    if (this.basket !== null && this.basket !== undefined && this.basket.items.length !== 0) {
      var i: BasketItem = this.basket.items.find(i => i._id === id);
      if (i) {
        return i.qty;
      }
    }
    return 0;
  }

  cacheDeps(deps: Department[]) {
    this.deps = deps;
    this.departments$.next({ ...this.deps });
  }

  cacheCats(cats: Category[]) {
    this.cats = cats;
    if (this.deps !== undefined && this.deps.length > 0) {
      this.deps.forEach(d => {
        let catsByDep: Category[] = this.cats.filter(c => c.department === d._id);
        if (catsByDep !== undefined && catsByDep.length > 0) {
          this.catsByDepMap[d._id] = catsByDep;
        }
      })
    }

    // Prepare sub categories map
    this.cats.forEach(c => {
      let subCats:Category[] = this.getChildCats(c._id);
      // console.log(`Cat ${c.name}=${ JSON.stringify(subCats)}`);
      if ( subCats !== undefined && subCats.length>0){
        this.subCatTree[c._id] = subCats;
      }
    });
    this.categories$.next({ ...this.cats });
  }

  getChildCats(id:string): Category[]{
    return this.cats.filter(c=> c.parent === id);
  }

  getCatsByDepartment(id: string): Category[] {
    if (this.catsByDepMap !== undefined && this.catsByDepMap.size > 0) {
      return this.catsByDepMap[id];
    }
    return [];
  }

  public getCatsByParent(id: string): Category[] {
    if (this.subCatTree !== undefined && this.subCatTree.size > 0) {
      let cats:Category[] =  this.subCatTree[id];
    }
    return [];
  }

  sendMessage(basketItem: BasketItem) {
    console.log(`Messenger service received notification: ` + JSON.stringify(basketItem));
    let exist: BasketItem = this.basket.items.find(element => element._id === basketItem._id);
    if (exist) {
      exist.qty = basketItem.qty;
    } else {
      this.basket.items.push(basketItem);
    }
    this.publishBasket();
    this.toastService.show(basketItem.name + ' added to Basket', { classname: 'bg-success text-light', delay: 5000 });
  }

  editDeliveryAddressAddress(address: Address) {
    this.deliveryAddress = address;
    localStorage.setItem('deliveryAddress', JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitBillingAddress(address: Address) {
    alert('Submitting address: '+ JSON.stringify(address));
    this.deliveryAddress = address;
    localStorage.setItem('deliveryAddress', JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitPaymentCard(paymentCard: PaymentCard) {
    this.paymentCard = paymentCard;
    localStorage.setItem('paymentCard', JSON.stringify(this.paymentCard));
    this.paymentCardSubject$.next({ ...this.paymentCard });
  }

  private publishBasket() {
    this.calculateBasketTotal();
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.subject$.next({ ...this.basket });
  }


  calculateBasketTotal() {
    let total: number = 0;
    this.basket.items.forEach(item => {
      total = total + (item.qty * item.price);
    })
    this.basket.total = total;
    this.basket.total = + (+this.basket.total).toFixed(2);
  }

  updateItem(id: string, qty: number) {
    let exist: BasketItem = this.basket.items.find(element => element._id === id);
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
}
