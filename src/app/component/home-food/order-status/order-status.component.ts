import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodOrder, Orders, OrderSearchQuery } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
  foodOrder: FoodOrder;
  orders: Orders;
  localChef: import("/Users/bigtree/projects/openecomm/web/src/app/model/localchef").Chef;

  constructor(private activatedRoute: ActivatedRoute,
    private localChefService: LocalChefService,
    private foodOrderService: FoodOrderservice,
    private _location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const reference = params['reference'];
      console.log(`OrderReference : ${params['reference']}`);
      var query: OrderSearchQuery = new OrderSearchQuery();
      query.reference = reference;

      this.foodOrderService.getOrders(query).subscribe((orders: Orders) => {
        this.orders = orders;
        if ( this.orders !== undefined && orders.orders !== undefined && orders.orders.length > 0){
          this.foodOrder = this.orders.orders[0];
          console.log('The retrieved order: '+ JSON.stringify(this.foodOrder));
          console.log('Order Reference-Status:['+ reference+' - '+ this.foodOrder.status);
          this.localChef = this.foodOrder.chef;
        }
      });
    });
  }

  getChefAddress(): string {
    if (this.foodOrder.chef === null || this.foodOrder.chef === undefined) {
      return;
    }
    var address: string = ""
    if (this.foodOrder.chef.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.chef.address.addressLine1;
    }
    if (this.foodOrder.chef.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.chef.address.addressLine2;
    }
    if (this.foodOrder.chef.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.chef.address.city;
    }
    if (this.foodOrder.chef.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.chef.address.postcode;
    }
    return address;
  }

  getCustomerAddress(): string {
    if (this.foodOrder.customer === null || this.foodOrder.customer === undefined) {
      return;
    }
    var address: string = ""
    if (this.foodOrder.customer.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.customer.address.addressLine1;
    }
    if (this.foodOrder.customer.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.customer.address.addressLine2;
    }
    if (this.foodOrder.customer.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.customer.address.city;
    }
    if (this.foodOrder.customer.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.foodOrder.customer.address.postcode;
    }
    return address;
  }

}
