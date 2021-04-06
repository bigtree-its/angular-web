import { Component, OnInit, Input } from '@angular/core';
import { BasketItem } from 'src/app/model/basket.model';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { BasketService } from 'src/app/service/basket.service';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css'],
})
export class BasketItemComponent implements OnInit {
  @Input() item: BasketItem;
  quantity: number = 0;
  subTotal: number = 0;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private router: Router,
    private LocalContextService: LocalContextService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.quantity = this.item.quantity;
    this.calculateSubTotal();
  }

  selectProduct(id: String) {
    this.router.navigate(['/product', id]).then();
  }

  removeProduct(id: String) {
    this.basketService.removeItem(id);
  }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1;
      this.item.quantity = this.quantity;
      this.calculateSubTotal();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
      this.item.quantity = this.quantity;
      this.calculateSubTotal();
    }
  }

  private calculateSubTotal() {
    this.subTotal = +(this.quantity * this.item.price).toFixed(2);
    this.basketService.updateItem(this.item.productId, this.item.quantity);
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
