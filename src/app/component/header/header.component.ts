import { Component, OnInit } from '@angular/core';
import { MessengerService } from 'src/app/service/messenger.service';
import { Basket } from 'src/app/model/basket.model';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from 'src/app/service/product.service';
import { AccountService } from 'src/app/service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faShoppingBag = faShoppingCart;

  basket: Basket;
  itemCount: number = 0;
  basketTotal: number = 0;

  constructor(private messengerService: MessengerService,
    private accountService: AccountService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.messengerService.subject$.subscribe(basket => {
      this.basket = basket
      console.log('Basket items : ' + basket.items.length);
      this.itemCount = basket.items.length;
      this.basketTotal = +basket.total.toFixed(2);
    })
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

  getUserName(){
    if ( this.isUserLoggedIn){
      return this.accountService.userValue.email;
    }else{
      return "Hello";
    }
  }

}
