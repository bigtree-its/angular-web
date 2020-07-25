import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {


  orderReferenceNumber: string;
  customerName: string;
  firstItem: string;
  totalItems: number;

  constructor() { }

  ngOnInit(): void {
  }

}
