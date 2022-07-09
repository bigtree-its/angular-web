import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  Chef, FoodOrder, FoodOrderItem, LocalChef, OrderSearchQuery, Review, SupplierOrder, SupplierOrders } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css']
})
export class SupplierOrderComponent implements OnInit {

  order: SupplierOrder;
  requestedCancellation: boolean = false;
  items: FoodOrderItem[];

  reviewComment: string;
  rating: number;
  starSelected: string = "/assets/icons/star-selected.png";
  star: string = "/assets/icons/star.png";
  review: Review;

  reviewButtonLabel: string;
  submittedReview: boolean;
  writeReview: boolean;
  readReview: boolean;
  supplier: Chef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: FoodOrderservice,
    private supplierService: LocalChefService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(params => {
      const ref = params.get("ref");
      const chef = params.get("chef");
      console.log(`ref: ${ref}`);
      console.log(`chef: ${chef}`);
      var query: OrderSearchQuery = new OrderSearchQuery();
      query.chefId = chef;
      query.reference = ref;
      this.orderService.getSupplierOrders(query).subscribe( (resp:SupplierOrders)=>{
        this.order= resp.orders[0];
        if (this.order !== null && this.order !== undefined) {
          console.log('The order: ' + JSON.stringify(this.order))
          this.items = this.order.items;
          this.supplier = this.order.chef;
          this.review = this.order.review;
        } else {
          console.log('No order set on profile order')
        }
      });
    });
    
  }

  getAddress(): string {
    var address: string = ""

    if (this.supplier.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.supplier.address.addressLine1;
    }
    if (this.supplier.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.supplier.address.addressLine2;
    }
    if (this.supplier.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.supplier.address.city;
    }
    if (this.supplier.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.supplier.address.postcode;
    }
    return address;
  }

  showReviewPanel() {
    if (this.review !== null && this.review !== undefined) {
      this.readReview = true;
      this.writeReview = false;
    } else {
      this.readReview = false;
      this.writeReview = true;
    }
    this.submittedReview = false;
  }

 
  overallRating(star: number) {
    this.rating = star;
  }
}
