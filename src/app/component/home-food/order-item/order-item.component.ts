import { Component, Input, OnInit } from '@angular/core';
import { FoodOrderItem } from 'src/app/model/localchef';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  @Input() item: FoodOrderItem;

  constructor() { }

  ngOnInit(): void {
  }


  
}
