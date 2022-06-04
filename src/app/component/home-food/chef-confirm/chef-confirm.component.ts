import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/common-models';
import { Chef, FoodOrder, Orders, OrderSearchQuery } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-chef-confirm',
  templateUrl: './chef-confirm.component.html',
  styleUrls: ['./chef-confirm.component.css']
})
export class ChefConfirmComponent implements OnInit {
  foodOrder: FoodOrder;
  orders: Orders;
  chef: Chef;
  customer: User;
  supplier: String = "supplier";

  constructor(private activatedRoute: ActivatedRoute,
    private chefService: LocalChefService,
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
          this.chef = this.foodOrder.chef;
          this.customer = this.foodOrder.customer;
          console.log('The customer in the order: '+ JSON.stringify(this.customer))
        }
      });
    });
  }

  getChefAddress(): string {
    if (this.chef === null || this.chef === undefined) {
      return;
    }
    var address: string = ""
    if (this.chef.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.chef.address.addressLine1;
    }
    if (this.chef.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.chef.address.addressLine2;
    }
    if (this.chef.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.chef.address.city;
    }
    if (this.chef.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.chef.address.postcode;
    }
    return address;
  }

  getCustomerAddress(): string {
    if (this.customer.address === null || this.customer.address === undefined) {
      return;
    }
    var address: string = ""
    if (this.customer.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.customer.address.addressLine1;
    }
    if (this.customer.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.customer.address.addressLine2;
    }
    if (this.customer.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.customer.address.city;
    }
    if (this.customer.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.customer.address.postcode;
    }
    return address;
  }

}
