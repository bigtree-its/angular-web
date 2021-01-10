import { Component, OnInit, Input } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { MessengerService } from 'src/app/service/messenger.service';
import { Address } from 'src/app/model/address';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CardType, PaymentCard } from 'src/app/model/payment-card';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/service/basket.service';
import { AccountService } from 'src/app/service/account.service';
import { User } from 'src/app/model/user';
import { Order, OrderItem } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { CardValidator } from 'src/app/helpers/card-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  addressForm: FormGroup;

  faSelected = faCheckCircle;
  fabMasterCard = faCcMastercard;
  fabVisa = faCcVisa;
  fabPaypal = faPaypal;

  basket: Basket;
  address: Address = new Address();
  addressList: Address[] = [];
  
  card: PaymentCard = new PaymentCard();
  paymentMethodList: PaymentCard[] = [];
  cardValidator: CardValidator = new CardValidator();

  shipAddressSameAsBilling: boolean;
  saveAddress: boolean;
  hideAddressForm: boolean;
  hidePaymentForm: boolean;
  showCardSection: boolean;
  type: String = 'Credit';

  expirationMonth: number = 1;
  expirationYear: number = new Date().getFullYear();
  yearsOptions: number[] = [];
  monthsOptions: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  user: User;
  isError: boolean = false;
  message: String;
  cardTpe: string = "";

  constructor(
    private orderService: OrderService,
    private router: Router,
    private basketService: BasketService,
    private accountService: AccountService
  ) {
    this.expirationMonth = 1;
    this.yearsOptions.push(this.expirationYear);

    for (let i = 1; i < 10; i++) {
      this.yearsOptions.push(this.expirationYear + i);
    }
   }

  ngOnInit(): void {
    this.showCardSection = true;
    this.isError = false;
    this.message = "";

    this.basketService.subject$.subscribe(basket => {
      this.basket = basket
    });

    this.accountService.userSubject.subscribe(user => {
      this.user = user;
      if ( this.user !== undefined){
        this.addressList = this.user.addresses;
        if ( this.addressList !== undefined && this.addressList.length > 0){
          this.hideAddressForm = true;
          if ( this.addressList.length == 1){
            var add: Address = this.addressList[0];
            add.selected = true;
            this.basket.address = add;
            this.basketService.updateBasket(this.basket);
          }
        }else{
          this.addNewAddress();
        }

        this.paymentMethodList = this.user.paymentCards;
        if ( this.paymentMethodList !== undefined && this.paymentMethodList.length > 0){
          this.hidePaymentForm = true;
          if ( this.paymentMethodList.length == 1){
            var pay: PaymentCard = this.paymentMethodList[0];
            pay.selected = true;
            this.basket.paymentCard = pay;
            this.basketService.updateBasket(this.basket);
          }
        }else{
          this.addNewPaymentMethod();
        }
      }
    })
  }


  reviewOrder() {
    this.isError = false;
    this.message = "";
    if ( this.basket.address === undefined || this.basket.address === null){
      this.isError = true;
      this.message = "Select delivery address";
    }
    if ( this.basket.paymentCard === undefined || this.basket.paymentCard === null){
      this.isError = true;
      this.message = "Select Payment Card";
    }
    if (!this.isError){
      this.router.navigate(['/review']).then();
    }
  }

  onSubmitAddress(f: NgForm) {
    if (f.valid) {
      if (this.address.lineNumber1 === undefined) {
        this.hideAddressForm = false;
      } else {
        this.hideAddressForm = true;
        this.updateAddressList();
      }
    }
  }

  private updateAddressList() {
    let existing: Address = this.addressList.find(
      (a) => a._id === this.address._id
    );
    if (!existing) {
      this.addressList.push(this.address);
    } else {
      existing.firstName = this.address.firstName;
      existing.lastName = this.address.lastName;
      existing.email = this.address.email;
      existing.mobile = this.address.mobile;
      existing.lineNumber1 = this.address.lineNumber1;
      existing.lineNumber2 = this.address.lineNumber2;
      existing.city = this.address.city;
      existing.country = this.address.country;
      existing.postcode = this.address.postcode;
      this.accountService.userValue.addresses = this.addressList;
      this.updateCurrentUser();
    }
  }

  selectType(e: String) {
    this.type = e;
    // this.card.cardType = this.type;
    if (this.type === 'Paypal') {
      this.showCardSection = false;
    } else {
      this.showCardSection = true;
    }
  }

  cancelAddressForm() {
    this.hideAddressForm = true;
  }
 
  addNewAddress() {
    this.hideAddressForm = false;
    this.address = new Address();
  }

  selectAddressCheckBox(a: Address, e: any) {
    for (let i = 0; i < this.addressList.length; i++) {
      let add: Address = this.addressList[i];
      if (this.addressList[i].postcode === a.postcode) {
        add.selected = e.target.checked;
      } else if (e.target.checked) {
        add.selected = false;
      }
    }
    this.addressList.forEach(a => {
      if (a.selected) {
        this.basket.address = a;
      }
    });

  }

  selectAddress(a: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      let add: Address = this.addressList[i];
      if (add.postcode === a.postcode) {
        add.selected = true;
        this.basket.address = add;
        this.basketService.updateBasket(this.basket);
      } else {
        add.selected = false;
      }
    }
  }
  editAddress(a: Address) {
    this.address = a;
    this.hideAddressForm = false;
  }

  removeAddress(a: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i].postcode === a.postcode) {
        this.addressList.splice(i, 1);
        this.accountService.userValue.addresses = this.addressList;
        this.updateCurrentUser();
      }
    }
    if ( this.addressList.length === 0){
      this.addNewAddress();
    }
  }


  addNewPaymentMethod() {
    this.hidePaymentForm = false;
    this.card = new PaymentCard();
  }

  cancelPaymentForm() {
    this.hidePaymentForm = true;
    this.card = new PaymentCard();
  }


  editPaymentMethod(p: PaymentCard) {
    this.hidePaymentForm = false;
    this.card = p;
  }

  removePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      if (this.paymentMethodList[i].cardNumber === p.cardNumber) {
        this.paymentMethodList.splice(i, 1);
      }
    }
    this.accountService.userValue.paymentCards = this.paymentMethodList;
    console.log(`Payment cards `+ JSON.stringify(this.paymentMethodList));
    this.updateCurrentUser();
  }

  usePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      let pay: PaymentCard = this.paymentMethodList[i];
      if (pay.cardNumber === p.cardNumber) {
        pay.selected = true;
        this.basket.paymentCard = pay;
        this.basketService.updateBasket(this.basket);
      } else {
        pay.selected = false;
      }
    }
    this.accountService.userValue.paymentCards = this.paymentMethodList;
    this.updateCurrentUser();
  }

  onSubmitPaymentMethod(f: NgForm) {
    if (f.valid){
      this.updatePaymentList();
      this.hidePaymentForm = true;
    }
  }

  onKeypressCardNumberEvent(event: any){
    var cardNumber: string  = event.target.value;
    if(cardNumber !== undefined && cardNumber.length > 3){
      var cardTpe = this.cardValidator.cardType(cardNumber);
      if (this.card !== undefined && this.card !== null){
        this.card.cardType = cardTpe;
      }
    }
 }

  private updatePaymentList() {
    var card: PaymentCard = new PaymentCard();
      if ( this.card._id !== undefined && this.card._id !== null){
        let existing: PaymentCard = this.paymentMethodList.find( (card) => card._id === this.card._id);
        if (existing) {
          /** Update card */
          console.log('Card found already: '+ JSON.stringify(existing));
          existing.cardNumber= this.card.cardNumber;
          existing.nameOnCard= this.card.nameOnCard;
          existing.expiryMonth= this.card.expiryMonth;
          existing.expiryYear= this.card.expiryYear;
          existing.cvv= this.card.cvv;
          this.usePaymentMethod(existing);
        }
      } else{
      /** New Card */
      card.cardNumber= this.card.cardNumber;
      card.nameOnCard= this.card.nameOnCard;
      card.expiryMonth= this.card.expiryMonth;
      card.expiryYear= this.card.expiryYear;
      card.cvv= this.card.cvv;
      this.paymentMethodList.push(card);
      this.usePaymentMethod(card);
    }
    
   
  }

  getMaskedCardNumber(card: PaymentCard): string {
    if (card !== undefined && card.cardNumber !== undefined && card.cardNumber.length > 14) {
      var masked = "**** " + card.cardNumber.substr(card.cardNumber.length-4, card.cardNumber.length-1);
      return masked;
    }
    return 'XXXX';
  }

  private updateCurrentUser() {
    this.accountService
      .updateCurrentUser()
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('Updated user response. ' + JSON.stringify(data));
        },
        (error) => {
          console.log('Update user resulted in error.' + JSON.stringify(error));
        }
      );
  }
  
  shippingAndBillingAddress(e) {
    this.shipAddressSameAsBilling = e.target.checked;
  }

  saveAddressForFuture(e) {
    this.saveAddress = e.target.checked;
  }

  getBasketTotal() {
    return this.basket.subTotal;
  }

  
}
