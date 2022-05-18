import { Component, Input, OnInit } from '@angular/core';
import { FoodOrderItem } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';

@Component({
  selector: 'app-food-order-item',
  templateUrl: './food-order-item.component.html',
  styleUrls: ['./food-order-item.component.css']
})
export class FoodOrderItemComponent implements OnInit {

  @Input() item: FoodOrderItem;
  @Input() displayImage: boolean = true;
  @Input() displayDeleteOption: boolean = false;
  
  constructor(private foodOrderService: FoodOrderservice) { }

  ngOnInit(): void {
  }

  deleteItem() {
    this.foodOrderService.removeItem(this.item);
  }
}
