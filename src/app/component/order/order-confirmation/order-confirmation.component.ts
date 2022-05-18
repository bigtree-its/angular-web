import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from 'src/app/model/common-models';
import { Order } from 'src/app/model/order';
import { AccountService } from 'src/app/service/account.service';

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
  private orderSubject: BehaviorSubject<Order>;
  public order: Order;
  public customer: Customer;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('Order'));
    this.customer = JSON.parse(localStorage.getItem('Customer'));
    if (this.order !== null && this.order !== undefined) {
      this.orderReferenceNumber = this.order.reference;
    }

  }

  getFullName() {
    if (this.customer != null && this.customer !== undefined) {
      let firstName = this.customer.firstName.substr(0, 1).toUpperCase() + this.customer.firstName.substr(1);
      let lastName = this.customer.lastName.substr(0, 1).toUpperCase() + this.customer.lastName.substr(1);
      return firstName + ' ' + lastName;
    }
    return ' ';
  }

}
