import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from '../model/address';
import { PaymentCard } from '../model/payment-card';
import { AppToastService } from './AppToastService';
import { Category, Department } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {


  private deliveryAddress: Address;
  private paymentCard: PaymentCard;
  private catsByDepMap = new Map<string, Category[]>();
  private subCatTree = new Map<string, Category[]>();
  deliveryAddressSubject$: BehaviorSubject<Address>;
  paymentCardSubject$: BehaviorSubject<PaymentCard>;
  departments$: BehaviorSubject<Department[]>;
  categories$: BehaviorSubject<Category[]>;
  deps: Department[] = [];
  cats: Category[] = [];

  constructor(
    private toastService: AppToastService
  ) {
    let address: Address = JSON.parse(localStorage.getItem('deliveryAddress'));
    let card: PaymentCard = JSON.parse(localStorage.getItem('paymentCard'));
    this.deliveryAddressSubject$ = new BehaviorSubject<Address>(this.deliveryAddress);
    this.paymentCardSubject$ = new BehaviorSubject<PaymentCard>(this.paymentCard);
    this.departments$ = new BehaviorSubject<Department[]>(this.deps);
    this.categories$ = new BehaviorSubject<Category[]>(this.cats);

    if (address !== null && address !== undefined) {
      this.deliveryAddress = address;
      this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
    }
    if (card !== null && card !== undefined) {
      this.paymentCard = card;
      this.paymentCardSubject$.next({ ...this.paymentCard });
    }
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
    localStorage.setItem('deliveryAddress', JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitBillingAddress(address: Address) {
    this.deliveryAddress = address;
    localStorage.setItem('deliveryAddress', JSON.stringify(this.deliveryAddress));
    this.deliveryAddressSubject$.next({ ...this.deliveryAddress });
  }

  submitPaymentCard(paymentCard: PaymentCard) {
    this.paymentCard = paymentCard;
    localStorage.setItem('paymentCard', JSON.stringify(this.paymentCard));
    this.paymentCardSubject$.next({ ...this.paymentCard });
  }
  
}
