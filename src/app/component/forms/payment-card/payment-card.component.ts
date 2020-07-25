import { Component, OnInit, Input } from '@angular/core';
import { PaymentCard } from 'src/app/model/payment-card';
import { MessengerService } from 'src/app/service/messenger.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent implements OnInit {

  type: String = 'Credit';
  @Input() card: PaymentCard = new PaymentCard('','','','','','');

  constructor(private messengerService: MessengerService) { }

  ngOnInit(): void {
  }

  selectType(e: String){
    this.type = e;
    this.card.cardType = this.type;
    console.log('Selected type:'+ this.type);
  }

  onSubmit(f: NgForm){
    if ( f.valid){
      this.messengerService.submitPaymentCard(this.card);
    }
  }
}
