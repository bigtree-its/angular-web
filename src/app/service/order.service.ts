import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../model/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { BasketService } from './basket.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderSubject: BehaviorSubject<Order>;
  private order: Observable<Order>;
  private orders$: Observable<Order[]>
  private SERVER_URL = environment.ORDER_SERVICE_URL;
  private ORDERS = environment.ORDERS;

  constructor(
    private http: HttpClient,
    private router: Router,
    private basketService: BasketService
  ) { }

  getOrders() {
    var url = this.SERVER_URL + this.ORDERS;
    this.http.get<Order[]>(url)
      .subscribe({ next: data => { console.log('Orders Response: ' + data.length); }, error: e => { console.error('Error when getting errors: ' + e) } });
  }

  placeOrder(order: Order) {
    var url = this.SERVER_URL + this.ORDERS;
    console.log('Confirming order: ' + url + ", " + JSON.stringify(order));
    this.http.post<Order>(url, order)
      .subscribe({
        next: data => {
          console.log('Order Response: ' + data);
          localStorage.setItem("currentOrder", JSON.stringify(data));
          this.basketService.removeBasket();
          this.router.navigate(['/order-confirmation']);
        },
        error: e => { console.error('Error when creating order: ' + e) }
      });
  }

}
