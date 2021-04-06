import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from 'src/app/model/order';
import { User } from 'src/app/model/user';
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
  public user: User;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('Order'));
    this.user = JSON.parse(localStorage.getItem('User'));
    if (this.order !== null && this.order !== undefined) {
      this.orderReferenceNumber = this.order.reference;
    }

  }

  getFullName() {
    if (this.user != null && this.user !== undefined) {
      let firstName = this.user.firstName.substr(0, 1).toUpperCase() + this.user.firstName.substr(1);
      let lastName = this.user.lastName.substr(0, 1).toUpperCase() + this.user.lastName.substr(1);
      return firstName + ' ' + lastName;
    }
    return ' ';
  }

}
