import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from '../model/address';
import { PaymentCard } from '../model/payment-card';
import { AppToastService } from './AppToastService';
import { Category, Department } from '../model/product.model';
import { User } from '../model/user';
import { Basket } from '../model/basket.model';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class LocalContextService {
 
  private deliveryAddress: Address;
  private paymentCard: PaymentCard;
  private catsByDepMap = new Map<string, Category[]>();
  private subCatTree = new Map<string, Category[]>();
  deliveryAddressSubject$: BehaviorSubject<Address>;
  paymentCardSubject$: BehaviorSubject<PaymentCard>;
  departments$: BehaviorSubject<Department[]>;
  categories$: BehaviorSubject<Category[]>;
  customer$: BehaviorSubject<User>;
  basket$: BehaviorSubject<Basket>;
  deps: Department[] = [];
  cats: Category[] = [];

  private OBJECT_DELIVERY_ADDRESS:string = "DeliveryAddress";
  private OBJECT_CUSTOMER:string = "Customer";
  private OBJECT_CUSTOMER_TOKEN:string = "CustomerToken";
  private OBJECT_BASKET:string = "Basket";
  private OBJECT_PAYMENT_CARD:string = "PaymentCard";

  constructor(
    private toastService: AppToastService
  ) {

    var basket: Basket = this.getBasket();
    var customer: User = this.getCustomer();
    let address: Address = JSON.parse(localStorage.getItem(this.OBJECT_DELIVERY_ADDRESS));
    let card: PaymentCard = JSON.parse(localStorage.getItem(this.OBJECT_PAYMENT_CARD));


    this.deliveryAddressSubject$ = new BehaviorSubject<Address>(this.deliveryAddress);
    this.paymentCardSubject$ = new BehaviorSubject<PaymentCard>(this.paymentCard);
    this.departments$ = new BehaviorSubject<Department[]>(this.deps);
    this.categories$ = new BehaviorSubject<Category[]>(this.cats);
    this.basket$ = new BehaviorSubject<Basket>(basket);
    this.customer$ = new BehaviorSubject<User>(customer);

    if (address !== null && address !== undefined) {
      this.deliveryAddress = address;
      this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
    }
    if (card !== null && card !== undefined) {
      this.paymentCard = card;
      this.paymentCardSubject$.next({ ...this.paymentCard });
    }
    this.basket$.next({...basket});
    this.customer$.next({...customer});
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

  getDepartment(id: string): Department{
    console.log('Finding department with id '+ id+ ' from list '+ JSON.stringify(this.deps));
    let deps: Department[] = this.deps.filter(d=> d._id === id);
    if ( deps !== undefined && deps.length > 0){
      return deps[0];
    }
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

  editDeliveryAddressAddress(address: Address) {
    this.deliveryAddress = address;
    localStorage.setItem(this.OBJECT_DELIVERY_ADDRESS, JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitBillingAddress(address: Address) {
    this.deliveryAddress = address;
    localStorage.setItem(this.OBJECT_DELIVERY_ADDRESS, JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitPaymentCard(paymentCard: PaymentCard) {
    this.paymentCard = paymentCard;
    localStorage.setItem(this.OBJECT_PAYMENT_CARD, JSON.stringify(this.paymentCard));
    this.paymentCardSubject$.next({ ...this.paymentCard });
  }

  removeCustomer() {
    localStorage.removeItem(this.OBJECT_CUSTOMER);
    var customer = null;
    this.customer$.next({...customer});
  }

  removeCustomerToken() {
    localStorage.removeItem(this.OBJECT_CUSTOMER_TOKEN);
  }

  removeCustomerBasket() {
    localStorage.removeItem(this.getCustomer().email);
  }

  public setBasket(basket: Basket){
    var customer: User = this.getCustomer();
    if( customer !== null && customer !== undefined){
      localStorage.setItem(customer.email, JSON.stringify(basket));
    }else{
      localStorage.setItem(this.OBJECT_BASKET, JSON.stringify(basket));
    }
    this.basket$.next({...basket});
  }

  setDeliveryAddress(add: Address) {
    localStorage.setItem(this.OBJECT_DELIVERY_ADDRESS, JSON.stringify(add));
  }

  setCustomer(customer: User) {
    localStorage.setItem(this.OBJECT_CUSTOMER, JSON.stringify(customer));
    this.customer$.next({...customer});
  }
  
  setCustomerToken(token: string) {
    localStorage.setItem(this.OBJECT_CUSTOMER_TOKEN, token);
  }
  

  getBasket(): Basket {
    var basketJson = null;
    var customer: User = this.getCustomer();
    if( customer !== null && customer !== undefined){
      basketJson = localStorage.getItem(customer.email)
    }else{
      basketJson = localStorage.getItem(this.OBJECT_BASKET);
    }
    if ( basketJson !== undefined && basketJson !== null){
      return JSON.parse(basketJson);
    }
    var basket: Basket = {
      items: [],
      id: 0,
      basketId: nanoid(),
      date: new Date(),
      email: "",
      orderReference: "",
      total: 0,
    };

    if( customer !== null && customer !== undefined){
      basket.email = customer.email;
    }
    return basket;
  }

  getCustomer(): User {
    var customerJson = localStorage.getItem(this.OBJECT_CUSTOMER);
    if ( customerJson !== undefined && customerJson !== null){
      return JSON.parse(customerJson);
    }
    return null;
  }

  getCustomerToken() {
    return localStorage.getItem(this.OBJECT_CUSTOMER_TOKEN);
  }

  getDeliveryAddress(): Address {
    var addressJson = localStorage.getItem(this.OBJECT_DELIVERY_ADDRESS);
    if ( addressJson !== undefined && addressJson !== null){
      return JSON.parse(addressJson);
    }
    return null;
  }
  
}
