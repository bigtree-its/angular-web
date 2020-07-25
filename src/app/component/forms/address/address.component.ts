import { Component, OnInit, Input } from '@angular/core';
import { Address } from 'src/app/model/address';
import { NgForm } from '@angular/forms';
import { MessengerService } from 'src/app/service/messenger.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  name: String = '';
  @Input() address = <Address>{}

  constructor(private messengerService: MessengerService) { 
  }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm) {
    if ( f.valid){
      console.log('Address submitted: '+ JSON.stringify(this.address));
      this.messengerService.submitBillingAddress(this.address);
    }
  }

  get diagnostic() { return this.name }

}

