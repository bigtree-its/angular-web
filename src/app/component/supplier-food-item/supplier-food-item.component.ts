import { Component, Input, OnInit } from '@angular/core';
import { Food } from 'src/app/model/localchef';

@Component({
  selector: 'app-supplier-food-item',
  templateUrl: './supplier-food-item.component.html',
  styleUrls: ['./supplier-food-item.component.css']
})
export class SupplierFoodItemComponent implements OnInit {


  @Input() food: Food;

  constructor() { }

  ngOnInit(): void {
  }

}
