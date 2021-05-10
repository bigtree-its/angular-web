import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionResponse } from 'src/app/model/action-response';
import { Order, OrderItem } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  @Input() order: Order;
  requestedCancellation: boolean = false;
  items: OrderItem[];

  constructor(
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    if (this.order !== null && this.order !== undefined) {
      this.items = this.order.items;
    }
  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  requestCancel(item: OrderItem) {
    this.orderService.cancelItem(this.order, item).subscribe(data => {
      var actionResponse: ActionResponse = data;
      if (actionResponse.status === true) {
        console.log('Successlly requested cancellation');
        this.items.forEach((i) => {
          if (i.id === actionResponse.id) {
            i.cancellationRequested = true;
          }
        });

      } else {
        console.log('Requested cancellation failed');
        this.requestedCancellation = false;
      }
    });

  }
}
