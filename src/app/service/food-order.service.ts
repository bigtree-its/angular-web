import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CustomerOrderList, FoodOrder, FoodOrderItem, LocalChef, Orders, OrderSearchQuery, OrderUpdateRequest } from '../model/localchef';
import { AccountService } from './account.service';
import { PaymentIntentRequest, PaymentIntentResponse } from '../model/order';
import { UserSession } from '../model/common-models';

@Injectable({
  providedIn: 'root'
})
export class FoodOrderservice {

  private HOST = environment.OPENCHEF_ORDERS_HOST;
  private OPENCHEF_ORDERS_URI = environment.OPENCHEF_ORDERS_URI;
  private CREATE_PAYMENT_INTENT = environment.CREATE_PAYMENT_INTENT;

  foodOrderRx$: BehaviorSubject<FoodOrder>;
  foodOrder: FoodOrder;
  userSession: UserSession;
  ipAddress: any;
  localChef: LocalChef;
  foodOrderKey: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService
  ) {
    this.loadFoodOrder();
  }

  private loadFoodOrder() {
    this.getIPAddress();
    this.foodOrderRx$ = new BehaviorSubject<FoodOrder>(this.foodOrder);
    this.accountService.userSessionSubject$.subscribe((userSession) => {
      this.userSession = userSession;
      if (userSession !== null && userSession !== undefined && userSession.user !== null && userSession.user !== undefined) {
        var email: string = this.userSession.user.email;
        console.log('Customer logged in: Getting ORDER ' + email);
        this.foodOrderKey = "FOOD-ORDER" + "-" + email;
        this.fetchFoodOrderFromStorage();
      } else {
        if (this.ipAddress !== undefined) {
          this.foodOrderKey = "FOOD-ORDER" + "-" + this.ipAddress;
          this.fetchFoodOrderFromStorage();
        }
      }
    });
    var localChefOnStorage = localStorage.getItem("LOCAL-CHEF");
    if ( localChefOnStorage !== null && localChefOnStorage !== undefined){
      this.localChef = JSON.parse(localChefOnStorage);
    }
  }

  retrieveOrder(orderId: string): Observable<FoodOrder> {
    var url = this.HOST + this.OPENCHEF_ORDERS_URI + "/" + orderId;
    return this.http.get<FoodOrder>(url);
  }

  getOrders(orderSearchQuery: OrderSearchQuery): Observable<Orders> {
    var params = new HttpParams();
    if ( orderSearchQuery.reference !== null && orderSearchQuery.reference !== undefined){
      params = params.set('reference', orderSearchQuery.reference);
    }
    if ( orderSearchQuery.customerEmail !== null && orderSearchQuery.customerEmail !== undefined){
      params = params.set('customerEmail', orderSearchQuery.customerEmail);
    }
    if ( orderSearchQuery.chefId !== null && orderSearchQuery.chefId !== undefined){
      params = params.set('chefId', orderSearchQuery.chefId);
    }
    if ( orderSearchQuery.thisMonth){
      params = params.set('thisMonth', "true");
    }
    if ( orderSearchQuery.thisYear){
      params = params.set('thisYear', "true");
    }
    if ( orderSearchQuery.all){
      params = params.set('all', "true");
    }
    var url = this.HOST + this.OPENCHEF_ORDERS_URI + "/search";
    return this.http.get<Orders>(url, { params });
  }

  getCustomerOrders(orderSearchQuery: OrderSearchQuery): Observable<CustomerOrderList> {
    var params = new HttpParams();
    if ( orderSearchQuery.reference !== null && orderSearchQuery.reference !== undefined){
      params = params.set('reference', orderSearchQuery.reference);
    }
    if ( orderSearchQuery.customerEmail !== null && orderSearchQuery.customerEmail !== undefined){
      params = params.set('customerEmail', orderSearchQuery.customerEmail);
    }
    if ( orderSearchQuery.chefId !== null && orderSearchQuery.chefId !== undefined){
      params = params.set('chefId', orderSearchQuery.chefId);
    }
    if ( orderSearchQuery.thisMonth){
      params = params.set('thisMonth', "true");
    }
    if ( orderSearchQuery.thisYear){
      params = params.set('thisYear', "true");
    }
    if ( orderSearchQuery.all){
      params = params.set('all', "true");
    }
    var url = this.HOST + this.OPENCHEF_ORDERS_URI + "/search";
    return this.http.get<CustomerOrderList>(url, { params });
  }

  private fetchFoodOrderFromStorage() {
    console.log('Fetching FoodOrder from LocalStorage for Key: '+ this.foodOrderKey)
    var orderObject = localStorage.getItem(this.foodOrderKey);
    console.log('FoodOrder from LocalStorage for Key: '+ orderObject)
    if (orderObject !== undefined) {
      this.foodOrder = JSON.parse(orderObject);
    }else{
      console.log('FoodOrder not found in storage. Creating new...')
      this.foodOrder = this.createOrder();
    }
    this.publishOrder();
  }

  getChef(): LocalChef {
    return this.localChef;
  }

  private publishOrder() {
    if (this.foodOrder !== undefined && this.foodOrder !== null) {
      this.foodOrderRx$.next({ ...this.foodOrder });
    }
    localStorage.setItem(this.foodOrderKey, JSON.stringify(this.foodOrder));
  }

  private getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  
  public addToOrder(foodOrderItem: FoodOrderItem) {
    if ( this.foodOrder === undefined || this.foodOrder === null){
      this.foodOrder = this.createOrder();
    }
    this.foodOrder.items.push(foodOrderItem);
    this.calculateTotal();
  }

  removeItem(itemToDelete: FoodOrderItem) {
    for (var i = 0; i < this.foodOrder.items.length; i++) {
      var item = this.foodOrder.items[i];
      if (item._tempId === itemToDelete._tempId) {
        this.foodOrder.items.splice(i, 1);
      }
    }
    this.calculateTotal();
  }
 

  public calculateTotal() {
    console.log('Calculating food order total');
    let subTotal: number = 0;
    let totalToPay: number = 0;
    if (this.foodOrder.items !== null && this.foodOrder.items !== undefined && this.foodOrder.items.length > 0) {
      this.foodOrder.items.forEach((item) => {
        subTotal = subTotal + item.subTotal;
      });
    }
    this.foodOrder.subTotal = subTotal;
    if (this.foodOrder.serviceMode === 'DELIVERY'){
      this.foodOrder.deliveryFee = 0.50;
    }
    totalToPay = this.foodOrder.subTotal + this.foodOrder.deliveryFee + this.foodOrder.packagingFee + this.foodOrder.saleTax;
    this.foodOrder.total = totalToPay;
    this.foodOrder.total = +(+this.foodOrder.total).toFixed(2);
    this.publishOrder();
  }

  createPaymentIntent(paymentIntentRequest: PaymentIntentRequest): Observable<PaymentIntentResponse> {
    var url = this.HOST + this.CREATE_PAYMENT_INTENT;
    console.log('Creating payment intent for the checkout: ' + url + ", " + JSON.stringify(paymentIntentRequest));
    return this.http.post<PaymentIntentResponse>(url, paymentIntentRequest);
  }

  private createOrder(): FoodOrder {
    return {
      items: [],
      chefId: "",
      customerEmail: "",
      customerMobile: "",
      currency: "",
      reference: "",
      subTotal: 0.00,
      total: 0.00,
      deliveryFee: this.getDeliveryFee(),
      packagingFee: this.getPackagingFee(),
      saleTax: 0.50,
      orderTime: new Date(),
      pickupTime: new Date(),
      deliveryTime: new Date(),
      delivery: false,
      pickup: false,
      status: "CREATED",
      paymentReference: "PaymentReference",
      customer: null,
      chef: null,
      review: null,
      serviceMode: "Collection",
    };
  }

  getDeliveryFee(): number{
    var deliveryFee = 0.00;
    if ( this.localChef.delivery){

    }
    return deliveryFee;
  }

  getPackagingFee(): number{
    var deliveryFee = 0.00;
    if ( this.localChef.delivery){

    }
    return deliveryFee;
  }

  getOrder(): FoodOrder {
    if ( this.foodOrder === null || this.foodOrder === undefined){
      this.loadFoodOrder();
    }
    return this.foodOrder;
  }

  updateOrder(orderUpdateRequest: OrderUpdateRequest) {
    var url = this.HOST + this.OPENCHEF_ORDERS_URI;
    console.log('Updateing Order: ' + url + ", " + JSON.stringify(orderUpdateRequest));
    this.http.put<OrderUpdateRequest>(url, orderUpdateRequest)
      .subscribe({
        next: data => {
          var response = JSON.stringify(data);
          console.log('Order Updated: ' + response);
        },
        error: e => { console.error('Error when updating order ' + e) }
      });
  }

  placeOrder(foodOrder: FoodOrder): Observable<FoodOrder> {
    var url = this.HOST + this.OPENCHEF_ORDERS_URI;
    console.log('Placing an order for LocalChef : ' + url + ", " + JSON.stringify(foodOrder));
    return this.http.post<FoodOrder>(url, foodOrder);
      // .subscribe({
      //   next: data => {
      //     var response = JSON.stringify(data);
      //     this.foodOrder = data;
      //     console.log('FoodOrder created: ' + response);
      //   },
      //   error: e => { console.error('Error when creating order ' + e) }
      // });
  }


}
