import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from 'src/app/service/basket.service';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/model/product.model';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  faShoppingBasket = faShoppingBasket;
  faStar = faStar;

  currency: string = environment.CURRENCY;
  currencySymbol: string = environment.CURRENCY_SYMBOL;

  selectedValue: number = 1;
  @Input() product: ProductModel;
  productprice: string = "0.00";

  constructor(
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // if ( this.product !== null && this.product !== undefined){
    //   console.log('The product in Constructor of ITEM '+ this.product._id);
    //   var price = this.product.salePrice;
    //   this.productprice = price.toLocaleString("en", {style:"currency", currency: this.currency }).replace(/\d+([,.]\d+)?/g, "");
    //   console.log('The product Price: '+ this.productprice);
    // }
  }

  getFraction(): string {
    var salePrice = String(this.product.salePrice);
    var fraction: string = salePrice.split('.')[1];
    if (fraction === undefined) {
      fraction = '00';
    } else if (fraction.length === 1) {
      fraction = fraction + '0';
    }
    return fraction;
  }

  getAmount(): string {
    var salePrice = String(this.product.salePrice);
    var amount: string = salePrice.split('.')[0];
    if (amount === undefined) {
      amount = '00';
    } 
    return amount;
  }

  selectProduct() {
    this.router.navigate(['/product', this.product._id]).then();
  }

  basketQty(): number {
    return this.basketService.getBasketQty(this.product._id);
  }

  addToCart() {
    if (this.product.stock === 0) {
      return;
    }
    this.basketService.addItemToBasket(this.product, 1);
  }

}
