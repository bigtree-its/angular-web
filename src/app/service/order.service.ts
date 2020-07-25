import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../model/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderSubject: BehaviorSubject<Order>;
  private order: Observable<Order>;

  private SERVER_URL = environment.ORDER_SERVICE_HOST;
  private ORDERS = environment.ORDERS;

  constructor(
    private http: HttpClient
  ) { }

  placeOrder(order: Order): Observable<Order> {
    console.log('Confirming order: '+ JSON.stringify(order));
    return this.http.post<Order>(this.SERVER_URL + this.ORDERS, order)
      .pipe(
        map(resp => {
          localStorage.setItem('order', JSON.stringify(resp._id));
          return resp;
        })
      );
  }

}
