import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { Property, PropertyQuery, PropertyType } from 'src/app/model/property';
import { AdService } from 'src/app/service/ad.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: Property[];
  orderL2H: boolean = false;
  orderH2L: boolean = false;
  maxBedrooms: number = 5;
  minBedrooms: number = 1;
  marketType: string = "Sale";
  notificationMessage: string = "Properties for Sale";
  types: PropertyType[];
  selectedTypes: PropertyType[] = [];
  propertyQuery: PropertyQuery = new PropertyQuery();

  constructor(private adService: AdService) { }

  ngOnInit(): void {
    this.fetchProperties();

    this.adService
      .getPropertyTypes()
      .subscribe((result: PropertyType[]) => {
        this.types = result;
      });

  }

  handleMarketType(evt, val: string) {
    var target = evt.target;
    if (target.checked) {
      if (val == "sale") {
        this.marketType = "Sale";
      } else if (val == "rent") {
        this.marketType = "Rent";
      }
      this.fetchProperties();
    }
  }

  private fetchProperties() {
    this.propertyQuery.marketType = this.marketType;
    this.adService
      .getProperties(this.propertyQuery)
      .subscribe((result: Property[]) => {
        this.properties = result;
        if ( this.properties === null || this.properties === undefined || this.properties.length === 0){
          this.buildNotificationMessage(); 
        }
      });
  }

  lowFirst() {
    this.properties = this.properties.sort((p1: Property, p2: Property) => {
      return p1.purchase_price - p2.purchase_price;
    });
    this.orderL2H = true;
    this.orderH2L = false;
  }

  highFirst() {
    this.properties = this.properties.sort((p1: Property, p2: Property) => {
      return p2.purchase_price - p1.purchase_price;
    });
    this.orderL2H = false;
    this.orderH2L = true;
  }

  updateMaxBedrooms(val: any) {
    console.log("Max beds: " + val)
    this.maxBedrooms = val;
    if ( val < this.minBedrooms){
      this.minBedrooms = val;
    }
  }
  updateMinBedrooms(val: any) {
    console.log("Min beds: " + val)
    this.minBedrooms = val;
    if ( val > this.maxBedrooms){
      this.maxBedrooms = val;
    }
   
  }

  selectType(type: string, e: any) {
    
    let propertyType: PropertyType = this.types.find((b) => b._id === type);
    console.log('Selected type: ' + propertyType.name);
    if (e.target.checked) {
      this.selectedTypes.push(propertyType);
    } else {
      for (var i = 0; i < this.selectedTypes.length; i++) {
        if (this.selectedTypes[i]._id === type) {
          this.selectedTypes.splice(i, 1);
        }
      }
    }
    console.log('Chosen Types: ' + JSON.stringify(this.selectedTypes));
    if (this.selectedTypes === null || this.selectedTypes === undefined && this.selectedTypes.length === 0) {
      this.propertyQuery.types = null;
    } else {
      this.propertyQuery.types = "";
      this.selectedTypes.forEach((p) => {
        this.propertyQuery.types = (this.propertyQuery.types.length > 0) ? this.propertyQuery.types + "," + p._id : p._id;
      });
    }
    console.log('Query ' + JSON.stringify(this.propertyQuery));
    this.fetchProperties();

  }

  buildNotificationMessage(){
    this.notificationMessage = "";
    if ( this.selectedTypes !== null && this.selectedTypes.length > 0){
      this.selectedTypes.forEach((p) => {
        this.notificationMessage = (this.notificationMessage.length > 0) ? this.notificationMessage + "," + p.name : p.name;
      });
      this.notificationMessage = this.notificationMessage + " For "+ this.marketType ;
    }else{
      this.notificationMessage = "Properties For "+ this.marketType ;
    }
  }
}
