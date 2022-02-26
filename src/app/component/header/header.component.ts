import { Component, OnInit } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { faUser, faShoppingCart, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/service/account.service';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/service/basket.service';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { CustomerSession, Customer } from 'src/app/model/customer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faShoppingBag = faShoppingCart;
  faMapMarkerAlt = faMapMarkerAlt;

  customerName: string;
  basket: Basket;
  itemCount: number = 0;
  basketTotal: number = 0;
  customerSession: CustomerSession;
  customer: Customer;
  customerPostcode: string;

  searchText: string = "";

  constructor(
    public accountService: AccountService,
    private basketService: BasketService,
    private localContextService: LocalContextService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.localContextService.basketSubject$.subscribe(basket => {
      this.basket = basket
      if (this.basket.items !== null && this.basket.items !== undefined) {
        this.itemCount = basket.items.length;
        console.log('Basket items : ' + this.itemCount);
      }
      this.basketTotal = +basket.total.toFixed(2);
    })

    this.localContextService.customerSessionSubject$.subscribe(customerSession => {
      this.customerSession = customerSession;
      console.log('Customer : ' + JSON.stringify(this.customerSession));
      if (customerSession !== null && customerSession.customer !== null && customerSession.customer !== undefined) {
        this.customer = this.customerSession.customer;
        this.customerName = this.customer.firstName + " " + this.customer.lastName;
        if (this.customer.addresses !== undefined && this.customer.addresses !== null && this.customer.addresses.length > 0) {
          this.customerPostcode = this.customer.addresses[0].postcode;
        }
      } else {
        this.customerName = "Hello"
      }
    })

  }

  isCustomerLoggedIn(): boolean {
    if (this.customer === undefined || this.customer === null || this.customer.firstName == undefined || this.customer.firstName == null) {
      return false;
    }
    return true;
  }

  logout() {
    this.accountService.logout();
    this.customer = undefined;
    this.customerPostcode = undefined;
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  orders() {
    this.router.navigate(['/orders']);
  }

  getcustomerName() {
    if (this.isCustomerLoggedIn()) {
      return this.customer.email;
    } else {
      return "Hello";
    }
  }

  onSubmitSearch() {
    if (this.searchText === undefined || this.searchText === null || this.searchText === "") {
      return;
    }
    this.router.navigate(['/product-finder', this.searchText]).then();
  }
}
