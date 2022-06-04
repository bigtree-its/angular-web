import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerOrder, FoodOrderItem, OrderUpdateRequest, Review } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.css']
})
export class CustomerOrderComponent implements OnInit {

  @Input() order: CustomerOrder;
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

  constructor(
    private router: Router,
    private orderService: FoodOrderservice
  ) { }

  ngOnInit(): void {
    if (this.order !== null && this.order !== undefined) {
      console.log('The order: '+ JSON.stringify(this.order))
      this.items = this.order.items;
      this.review = this.order.review;
      this.resolveReview();
    } else {
      console.log('No order set on profile order')
    }
  }

  private resolveReview() {
    if (this.review !== null && this.review !== undefined) {
      this.reviewButtonLabel = "You Reviewed";
    } else {
      this.reviewButtonLabel = "Write Review";
    }
  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  showReviewPanel(){
    if ( this.review !== null && this.review !== undefined){
      this.readReview = true;
      this.writeReview = false;
    }else{
      this.readReview = false;
      this.writeReview = true;
    }
    this.submittedReview = false;
  }

  submitReview(){
    var orderUpdateReq: OrderUpdateRequest = new OrderUpdateRequest();
    orderUpdateReq.reference = this.order.reference;
    orderUpdateReq.customerComments = this.reviewComment;
    orderUpdateReq.customerRating = this.rating;
    this.orderService.updateOrder(orderUpdateReq);
    var review: Review = new Review();
    review.comments = this.reviewComment;
    review.rating = this.rating;
    this.review = review;
    this.resolveReview();
    this.submittedReview = true;
    this.readReview = false;
    this.writeReview = false;
  }

  cancelReview(){
    this.writeReview = false;
  }

  overallRating(star: number){
    this.rating = star;
  }

  requestCancel(item: FoodOrderItem) {
    // this.orderService.cancelItem(this.order, item).subscribe(data => {
    //   var actionResponse: ActionResponse = data;
    //   if (actionResponse.status === true) {
    //     console.log('Successlly requested cancellation');
    //     this.items.forEach((i) => {
    //       if (i.id === actionResponse.id) {
    //         i.cancellationRequested = true;
    //       }
    //     });

    //   } else {
    //     console.log('Requested cancellation failed');
    //     this.requestedCancellation = false;
    //   }
    // });

  }
}
