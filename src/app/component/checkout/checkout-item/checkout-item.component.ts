import { Component, OnInit, Input } from '@angular/core';
import { BasketItem } from 'src/app/model/basket.model';
import { Router } from '@angular/router';
import { MessengerService } from 'src/app/service/messenger.service';

@Component({
  selector: 'app-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css']
})
export class CheckoutItemComponent implements OnInit {

  @Input() item: BasketItem;
  quantity: number = 0;
  subTotal: number = 0;
  brand: String = "";

  constructor(
    private router: Router,
    private messengerService: MessengerService) { }

  ngOnInit(): void {
    this.quantity = this.item.qty;
    this.calculateSubTotal();
    this.brand = this.item.brand.name;
  }


  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  removeProduct(id: String) {
    this.messengerService.removeItem(id);
  }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1
      this.item.qty = this.quantity;
    }
    this.calculateSubTotal();
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity = this.quantity - 1;
      this.item.qty = this.quantity;
    }
    this.calculateSubTotal();
  }

  private calculateSubTotal() {
    this.subTotal = +(this.quantity * this.item.price).toFixed(2);
    this.messengerService.updateItem(this.item._id, this.item.qty);
  }

  getFraction(n) {
    var s = this.getPrettyPrintPrice(n);
    return s.split('.')[1];
  }

  getPrettyPrintPrice(n: number) {
    var s = String(n);
    if (s.indexOf('.') === -1) {
      s = s + '.00';
    } else if (s.split('.')[1].length === 1) {
      s = s + '0';
    }
    return s;
  }
  getSubTotalFraction() {
    var s = String(this.subTotal);
    return s.slice(s.indexOf('.') + 1);
  }

  getSubTotal() {
    return this.getPrettyPrintPrice(this.subTotal);
  }

}
