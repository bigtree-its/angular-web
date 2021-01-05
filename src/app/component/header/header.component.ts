import { Component, OnInit } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/service/account.service';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/service/basket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faShoppingBag = faShoppingCart;

  userName: string;
  basket: Basket;
  itemCount: number = 0;
  basketTotal: number = 0;

  constructor(
    private accountService: AccountService,
    private basketService: BasketService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.basketService.subject$.subscribe(basket => {
      this.basket = basket
      console.log('Basket items : ' + basket.items.length);
      this.itemCount = basket.items.length;
      this.basketTotal = +basket.subTotal.toFixed(2);
    })
    var user = this.accountService.userValue;
    if ( user !== undefined && user !== null){
      this.userName = user.firstName + " "+ user.lastName;
    }else{
      this.userName = "Hello"
    }
  }

  isUserLoggedIn(): boolean {
    if (this.accountService.userValue === undefined || this.accountService.userValue === null) {
      return false;
    }
    return true;
  }

  logout(){
    this.accountService.logout();
  }

  login(){
    this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
  }

  profile(){
    this.router.navigate(['/profile']);
  }

  orders(){
    this.router.navigate(['/orders']);
  }

  getUserName(){
    if ( this.isUserLoggedIn){
      return this.accountService.userValue.email;
    }else{
      return "Hello";
    }
  }

}
