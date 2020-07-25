import { Component, OnInit, Input } from '@angular/core';
import { Basket } from 'src/app/model/basket.model';
import { MessengerService } from 'src/app/service/messenger.service';
import { Address } from 'src/app/model/address';
import { NgForm } from '@angular/forms';
import { PaymentCard } from 'src/app/model/payment-card';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  faSelected = faCheckCircle;
  fabMasterCard = faCcMastercard;
  fabVisa = faCcVisa;
  fabPaypal = faPaypal;

  basket: Basket;
  address: Address = new Address('', '', '', '', '', '', '', '');
  addressList: Address[] = [];
  paymentMethodList: PaymentCard[] = [];
  card: PaymentCard = new PaymentCard('', 'Credit', '', '', '', '');

  shipAddressSameAsBilling: boolean;
  saveAddress: boolean;
  hideAddressForm: boolean;
  hidePaymentForm: boolean;
  showCardSection: boolean;
  type: String = 'Credit';

  constructor(
    private router: Router,
    private messengerService: MessengerService
  ) { }

  ngOnInit(): void {
    this.showCardSection = true;

    this.messengerService.subject$.subscribe(basket => {
      this.basket = basket
    });

    this.messengerService.deliveryAddressSubject$.subscribe(address=>{
      if ( address !== undefined){
        this.address = address;
        this.hideAddressForm = true;
        this.updateAddressList();
      }
    })

    this.messengerService.paymentCardSubject$.subscribe(paymentCard=>{
      if ( paymentCard !== undefined){
        this.card = paymentCard;
        this.hidePaymentForm = true;
        this.updatePaymentList();
      }
    })
  }


  reviewOrder(){
    this.router.navigate(['/review']).then();
  }

  onSubmitAddress(f: NgForm) {
    if (f.valid) {
      if (this.address.address1 === undefined) {
        this.hideAddressForm = false;
      } else {
        this.hideAddressForm = true;
        this.updateAddressList();
      }
    }
  }

  onSubmitPaymentMethod(f: NgForm) {
    this.card.cardType = this.type;
    if (this.card.cardNumber === undefined) {
      this.hidePaymentForm = false;
    } else {
      this.hidePaymentForm = true;
      this.updatePaymentList();
    }
    this.messengerService.submitPaymentCard(this.card);
  }

  private updatePaymentList() {
    let existing: PaymentCard = this.paymentMethodList.find(a => a.cardNumber === this.card.cardNumber);
    if (!existing) {
      this.paymentMethodList.push(this.card);
    }
    else {
      existing.cardNumber = this.card.cardNumber;
      existing.nameOnCard = this.card.nameOnCard;
      existing.expiry = this.card.expiry;
      existing.cvv = this.card.cvv;
      existing.cardType = this.card.cardType;
    }
  }

  private updateAddressList() {
    let existing: Address = this.addressList.find(a => a.postcode === this.address.postcode);
    if (!existing) {
      this.addressList.push(this.address);
    }
    else {
      existing.firstName = this.address.firstName;
      existing.lastName = this.address.lastName;
      existing.email = this.address.email;
      existing.mobile = this.address.mobile;
      existing.address1 = this.address.address1;
      existing.address2 = this.address.address2;
      existing.city = this.address.city;
      existing.country = this.address.country;
      existing.postcode = this.address.postcode;
    }
  }

  selectType(e: String){
    this.type = e;
    this.card.cardType = this.type;
    if ( this.type === 'Paypal'){
      this.showCardSection = false;
    }else{
      this.showCardSection = true;
    }
  }

  cancelAddressForm() {
    this.hideAddressForm = true;
  }
  cancelPaymentForm() {
    this.hidePaymentForm = true;
  }
  
  addNewAddress() {
    alert('Adding new address');
    this.hideAddressForm = false;
    this.address = new Address('', '', '', '', '', '', '', '');

  }
  selectAddress(a:Address, e:any){
    for (let i = 0; i < this.addressList.length; i++) {
      let add: Address = this.addressList[i];
      if (this.addressList[i].postcode === a.postcode) {
        add.selected = e.target.checked;
      } else if ( e.target.checked) {
        add.selected = false;
      }
    }

    this.addressList.forEach(a=> {
      if (a.selected){
        this.messengerService.submitBillingAddress(a);
      }
    });

  }
  editAddress(a: Address) {
    this.address = a;
    this.hideAddressForm = false;
  }

  removeAddress(a: Address) {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i].postcode === a.postcode) {
        this.addressList.splice(i, 1);
      }
    }
  }

  

  addNewPaymentMethod() {
    this.hidePaymentForm = false;
    this.card = new PaymentCard('', '', '', '', '', '');

  }
  editPaymentMethod(p: PaymentCard) {
    this.hidePaymentForm = false;
    this.card = new PaymentCard(p._id, p.cardType, p.nameOnCard,p.cardNumber,p.expiry, p.cvv);
  }

  removePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      if (this.paymentMethodList[i].cardNumber === p.cardNumber) {
        this.paymentMethodList.splice(i, 1);
      }
    }
  }

  usePaymentMethod(p: PaymentCard) {
    for (let i = 0; i < this.paymentMethodList.length; i++) {
      let pay: PaymentCard = this.paymentMethodList[i];
      if (this.paymentMethodList[i].cardNumber === p.cardNumber) {
        pay.selected = true;
        this.messengerService.submitPaymentCard(pay);
      } else {
        pay.selected = false;
      }
    }
  }
  shippingAndBillingAddress(e) {
    this.shipAddressSameAsBilling = e.target.checked;
  }

  saveAddressForFuture(e) {
    this.saveAddress = e.target.checked;
  }

  getBasketTotal() {
    return this.basket.total;
  }

}
