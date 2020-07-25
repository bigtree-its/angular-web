import { Component, OnInit, Input } from '@angular/core';
import { MessengerService } from 'src/app/service/messenger.service';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/model/product.model';
import { BasketItem } from 'src/app/model/basket.model';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  faShoppingBasket = faShoppingBasket;
  faStar = faStar;

  selectedValue: number = 1;
  @Input() product: ProductModel;

  constructor(
    private messengerService: MessengerService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    return this.messengerService.getBasketQty(this.product._id);
  }

  addToCart() {

    if (this.product.stock === 0) {
      return;
    }

    let basketItem: BasketItem = {
      _id: this.product._id,
      name: this.product.name,
      image: this.product.picture.thumbnail,
      price: this.product.salePrice,
      brand: this.product.brand,
      qty: this.selectedValue,
      subtotal: +(this.selectedValue * this.product.salePrice).toFixed(2)
    };
    this.messengerService.sendMessage(basketItem);

  }

}
