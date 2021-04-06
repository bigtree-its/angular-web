import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, PaymentIntentRequest, PaymentIntentResponse } from '../model/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BasketService } from './basket.service';
import { unescapeIdentifier } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private SERVER_URL = environment.ORDER_SERVICE_URL;
  private ORDERS = environment.ORDERS;
  private CREATE_PAYMENT_INTENT = environment.CREATE_PAYMENT_INTENT;

  order: Order;

  constructor(
    private http: HttpClient,
    private router: Router,
    private basketService: BasketService
  ) { 
  }

  getOrders(email: string): Observable<Order[]> {

    var url = this.SERVER_URL + this.ORDERS;
    var params = new HttpParams();
    params = params.set('email', email);
    return this.http.get<Order[]>(url, {params: params});
  }

  placeOrder(order: Order) {
    var url = this.SERVER_URL + this.ORDERS;
    console.log('Confirming order: ' + url + ", " + JSON.stringify(order));
    this.http.post<Order>(url, order)
      .subscribe({
        next: data => {
          var orderJson = JSON.stringify(data);
          this.order = data;
          console.log('Order Response: ' + orderJson);
          if ( this.order !== null && this.order !== undefined){
            localStorage.setItem("Order", orderJson);
            this.basketService.initializeBasket();
            this.router.navigate(['/order-confirmation']);
          }
        },
        error: e => { console.error('Error when creating order: ' + e) }
      });
  }

  createPaymentIntent(paymentIntentRequest: PaymentIntentRequest): Observable<PaymentIntentResponse> {
    var url = this.SERVER_URL + this.CREATE_PAYMENT_INTENT;
    console.log('Creating payment intent for the checkout: ' + url + ", " + JSON.stringify(paymentIntentRequest));
    return this.http.post<PaymentIntentResponse>(url, paymentIntentRequest);
  }


}
