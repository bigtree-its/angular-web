import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/model/order';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  @Input() order: Order;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

}
