import { Component, OnInit } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { faUser, faShoppingCart, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/service/account.service';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/service/basket.service';
import { User, UserSession } from 'src/app/model/common-models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faShoppingBag = faShoppingCart;
  faMapMarkerAlt = faMapMarkerAlt;

  userName: string;
  basket: Basket;
  itemCount: number = 0;
  basketTotal: number = 0;
  userSession: UserSession;
  user: User;
  userPostcode: string;

  searchText: string = "";
  role: string;

  constructor(
    public accountService: AccountService,
    private basketService: BasketService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.basketService.basketSubject$.subscribe(basket => {
      this.basket = basket
      if ( this.basket === null || this.basket === undefined){
        console.log("Basket is null")
      }else{
        if (this.basket.items !== null && this.basket.items !== undefined) {
          this.itemCount = basket.items.length;
          console.log('Basket items : ' + this.itemCount);
        }
        if ( this.basket.total === null || this.basket.total === undefined){
          this.basket.total = 0;
        }
        this.basketTotal = +this.basket.total.toFixed(2);
      }
    })

    this.accountService.userSessionSubject$.subscribe(userSession => {
      this.userSession = userSession;
      if (userSession !== null && userSession.user !== null && userSession.user !== undefined) {
        this.user = this.userSession.user;
        this.role = this.user.role;
        this.userName = this.user.fullName;
        if (this.user.address !== undefined && this.user.address !== null ) {
          this.userPostcode = this.user.address.postcode;
        }
      } else {
        this.accountService.retrieveSession();
      }
    })

  }

  isUserLoggedIn(): boolean {
    if (this.user === undefined || this.user === null || this.user.fullName == undefined || this.user.fullName == null) {
      return false;
    }
    return true;
  }

  logout() {
    this.accountService.logout();
    this.user = undefined;
    this.userPostcode = undefined;
  }
  home() {
    this.router.navigate(['/']);
  }

  becomeChef(){
    console.log('Navigating to supplier reg')
    // this.router.navigate(['/register'], { queryParams: {r: 'Supplier'}});
    this.router.navigateByUrl('/register?r=Supplier');
  }
  login() {
    this.router.navigate(['/login']);
  }

  register() {
    console.log('Navigating to customer reg')
    // this.router.navigate(['/register'], { queryParams: {r: 'Customer'}});
    this.router.navigateByUrl('/register?r=Customer');
  }

  profile() {
    this.router.navigate(['/customer-profile']);
  }

  orders() {
    this.router.navigate(['/orders']);
  }

  getuserName() {
    if (this.isUserLoggedIn()) {
      return this.user.email;
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

  viewProfile(){
    if ( this.userSession !== null && this.userSession !== undefined && this.userSession.user !== null && this.userSession.user !== undefined){
      if ( this.userSession.user.role === "Supplier"){
        this.router.navigate(['/supplier-profile']);
      }else{
        this.router.navigate(['/customer-profile']);
      }
    }
  }
}
