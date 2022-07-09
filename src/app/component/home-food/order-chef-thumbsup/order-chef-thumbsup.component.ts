import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupplierOrder } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';

@Component({
  selector: 'app-order-chef-thumbsup',
  templateUrl: './order-chef-thumbsup.component.html',
  styleUrls: ['./order-chef-thumbsup.component.css']
})
export class OrderChefThumbsupComponent implements OnInit {
  
  foodOrder: SupplierOrder;

  constructor(private activatedRoute: ActivatedRoute,
    private foodOrderService: FoodOrderservice
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const orderId = params['id'];
      console.log(`OrderId: ${params['id']}`);
      this.foodOrderService.retrieveOrder(orderId).subscribe((foodOrder: SupplierOrder) => {
        this.foodOrder = foodOrder;
        console.log('The OpenChef Order: '+ JSON.stringify(this.foodOrder))
      });
    });
  }

  confirm(){

  }

  reject(){
    
  }
}
