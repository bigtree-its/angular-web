import { Component, Input, OnInit } from '@angular/core';
import { Extra, Food, FoodOrderItem } from 'src/app/model/localchef';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoodOrderservice } from 'src/app/service/food-order.service';
@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.css'],
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class FoodCardComponent implements OnInit {

  @Input() food: Food;

  quantity: number = 1;
  price: number = 0;
  specialInstruction: string;
  selectedchoice: Extra;
  selectedExtras: Extra[] = [];

  constructor(
    private foodOrderService: FoodOrderservice,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.price = this.food.price;
  }

  openBackDropCustomClass(content) {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  openScrollableContent(longContent) {
    if (this.hasExtras() || this.hasChoices()) {
      this.modalService.open(longContent, { scrollable: true, centered: true });
    } else {
      this.addToOrder();
    }
  }

  hasExtras() {
    return this.food.extras !== null && this.food.extras !== undefined && this.food.extras.length > 0;
  }
  hasChoices() {
    return this.food.choices !== null && this.food.choices !== undefined && this.food.choices.length > 0;
  }

  addToOrder() {
    console.log('Add to Order: ');
    var foodOrderItem: FoodOrderItem = {
      _tempId: Date.now(),
      profuctId: this.food._id,
      image: this.food.image,
      name: this.food.name,
      quantity: this.quantity,
      price: this.food.price,
      subTotal: this.price,
      extras: this.selectedExtras,
      choice: this.selectedchoice,
      specialInstruction: this.specialInstruction
    };
    this.foodOrderService.addToOrder(foodOrderItem);
    this.modalService.dismissAll();
  }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1;
      this.calculatePrice();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
      this.calculatePrice();
    }
  }

  handleChoiceSelection(e) {
    console.log('Choice selected:' + e.target.value);
    this.food.choices.forEach(choice => {
      if (choice.name === e.target.value) {
        if (this.selectedchoice === null || this.selectedchoice === undefined) {
          this.selectedchoice = choice;
          this.price = this.price + (this.selectedchoice.price * this.quantity);
          this.price = +(+this.price).toFixed(2);
        } else {
          // Remore Previously Added Choice
          this.price = this.price - (this.selectedchoice.price * this.quantity);
          this.price = +(+this.price).toFixed(2);
          // Add New Choice
          this.selectedchoice = choice;
          this.price = this.price + (this.selectedchoice.price * this.quantity);
          this.price = +(+this.price).toFixed(2);
        }
      }
    })
  }

  selectExtra(extraClicked: string, e: any) {

    let extra: Extra = this.food.extras.find((b) => b.name === extraClicked);
    if (e.target.checked) {
      this.selectedExtras.push(extra);
      this.price = this.price + (extra.price * this.quantity);
      this.price = +(+this.price).toFixed(2);
    } else {
      for (var i = 0; i < this.selectedExtras.length; i++) {
        var ex = this.selectedExtras[i];
        if (ex.name === extraClicked) {
          this.selectedExtras.splice(i, 1);
          this.price = this.price - (ex.price * this.quantity);
          this.price = +(+this.price).toFixed(2);
        }
      }
    }
  }

  private calculatePrice() {
    var extraTotal = 0;
    for (var i = 0; i < this.selectedExtras.length; i++) {
      extraTotal = extraTotal + this.selectedExtras[i].price;
    }
    if (this.selectedchoice !== null && this.selectedchoice !== undefined) {
      extraTotal = extraTotal + this.selectedchoice.price;
    }
    this.price = (this.price + extraTotal) * this.quantity;
    this.price = +(+this.price).toFixed(2);
  }
}
