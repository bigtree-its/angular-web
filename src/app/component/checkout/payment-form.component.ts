import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { Address, PostcodeLookupResult, PostcodeLookupResultAddress } from 'src/app/model/address';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PaymentCard } from 'src/app/model/payment-card';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/service/basket.service';
import { AccountService } from 'src/app/service/account.service';
import { User } from 'src/app/model/user';
import { CardValidator } from 'src/app/helpers/card-validator';
import { GetAddressIOService } from 'src/app/service/get-address-io.service';
import * as _ from 'underscore';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';


@Component({
  selector: 'payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./checkout.component.css']
})
export class PaymentFormComponent implements OnInit, AfterViewInit, OnDestroy {

  addressForm: FormGroup;

  faSelected = faCheckCircle;
  fabMasterCard = faCcMastercard;
  fabVisa = faCcVisa;
  fabPaypal = faPaypal;
  showCardSection: boolean;
  paymentCard: PaymentCard = new PaymentCard();
  paymentMethodList: PaymentCard[] = [];
  cardValidator: CardValidator = new CardValidator();

  shipAddressSameAsBilling: boolean;
  saveAddress: boolean;
  hidePaymentForm: boolean;
  type: String = 'Credit';

  expirationMonth: number = 12;
  expirationYear: number = new Date().getFullYear();
  yearsOptions: number[] = [];
  monthsOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  user: User;
  isError: boolean = false;
  message: String;
  cardTpe: string = "";


  constructor(
    private getAddressIOService: GetAddressIOService,
    private router: Router,
    private basketService: BasketService,
    private accountService: AccountService,
  ) {
    this.expirationMonth = 1;
    this.yearsOptions.push(this.expirationYear);

    for (let i = 1; i < 10; i++) {
      this.yearsOptions.push(this.expirationYear + i);
    }
  }

  ngOnDestroy() {
  }

  onChange({ error }) {
  }

  async onSubmit(form: NgForm) {
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.isError = false;
    this.message = "";

    this.accountService.userSubject.subscribe(user => {
      this.user = user;
      if (this.user !== undefined) {

        this.paymentMethodList = this.user.paymentCards;
        if (this.paymentMethodList !== undefined && this.paymentMethodList.length > 0) {
          this.hidePaymentForm = true;
          if (this.paymentMethodList.length == 1) {
            var pay: PaymentCard = this.paymentMethodList[0];
            pay.selected = true;
          }
        } else {
          this.addNewPaymentMethod();
        }
      }
    })
  }

  onSelectExpiryMonth(expiryMonth) {
    this.expirationMonth = expiryMonth;
    this.paymentCard.expiryMonth = expiryMonth;
  }

  onSelectExpiryYear(expiryYear) {
    this.expirationYear = expiryYear;
    this.paymentCard.expiryYear = expiryYear;
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


  addNewPaymentMethod() {
    this.hidePaymentForm = false;
    this.paymentCard = new PaymentCard();
  }

  cancelPaymentForm() {
    this.hidePaymentForm = true;
    this.paymentCard = new PaymentCard();
  }


  editPaymentMethod(p: PaymentCard) {
    this.hidePaymentForm = false;
    this.paymentCard = p;
  }

  removePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      if (this.paymentMethodList[i].cardNumber === p.cardNumber) {
        this.paymentMethodList.splice(i, 1);
      }
    }
    this.accountService.userValue.paymentCards = this.paymentMethodList;
    console.log(`Payment cards ` + JSON.stringify(this.paymentMethodList));
    this.updateCurrentUser();
  }

  usePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      let pay: PaymentCard = this.paymentMethodList[i];
      if (pay.cardNumber === p.cardNumber) {
        pay.selected = true;
      } else {
        pay.selected = false;
      }
    }
    this.accountService.userValue.paymentCards = this.paymentMethodList;
    this.updateCurrentUser();
  }

  onSubmitPaymentMethod(f: NgForm) {
    if (f.valid) {
      this.updatePaymentList();
      this.hidePaymentForm = true;
    }
  }

  onKeypressCardNumberEvent(event: any) {
    var cardNumber: string = event.target.value;
    if (cardNumber !== undefined && cardNumber.length > 1) {
      var cardTpe = this.cardValidator.cardType(cardNumber);
      if (this.paymentCard !== undefined && this.paymentCard !== null) {
        this.paymentCard.cardType = cardTpe;
      }
    } else {
      this.paymentCard.cardType = undefined;
    }
  }

  private updatePaymentList() {
    var card: PaymentCard = new PaymentCard();
    if (this.paymentCard._id !== undefined && this.paymentCard._id !== null) {
      let existing: PaymentCard = this.paymentMethodList.find((card) => card._id === this.paymentCard._id);
      if (existing) {
        /** Update card */
        console.log('Card found already: ' + JSON.stringify(existing));
        existing.cardNumber = this.paymentCard.cardNumber;
        existing.nameOnCard = this.paymentCard.nameOnCard;
        existing.expiryMonth = this.paymentCard.expiryMonth;
        existing.expiryYear = this.paymentCard.expiryYear;
        existing.cvv = this.paymentCard.cvv;
        this.usePaymentMethod(existing);
      }
    } else {
      /** New Card */
      card.cardNumber = this.paymentCard.cardNumber;
      card.nameOnCard = this.paymentCard.nameOnCard;
      card.expiryMonth = this.paymentCard.expiryMonth;
      card.expiryYear = this.paymentCard.expiryYear;
      card.cvv = this.paymentCard.cvv;
      this.paymentMethodList.push(card);
      this.usePaymentMethod(card);
    }


  }

  getMaskedCardNumber(card: PaymentCard): string {
    if (card !== undefined && card.cardNumber !== undefined && card.cardNumber.length > 14) {
      var masked = "**** " + card.cardNumber.substr(card.cardNumber.length - 4, card.cardNumber.length - 1);
      return masked;
    }
    return 'XXXX';
  }

  private updateCurrentUser() {
    this.accountService
      .updateCurrentCustomer()
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


}
