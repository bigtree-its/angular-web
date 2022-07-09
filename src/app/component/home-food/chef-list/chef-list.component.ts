import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalArea, LocalChef, Cuisine, LocalChefSearchQuery } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chef-list',
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css']
})
export class ChefListComponent implements OnInit {

  localChefSearchQuery: LocalChefSearchQuery;
  suppliersFiltered: LocalChef[] = [];
  suppliers: LocalChef[];
  localArea: LocalArea;
  cuisines: Cuisine[];
  selectedCuisines: Cuisine[] = [];
  selectedSlots: string[] = [];
  slots: string[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private supplierService: LocalChefService,
    private foodOrderService: FoodOrderservice,
    private _location: Location) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const areaSlug = params['area'];
      console.log(`Area : ${params['area']}`);
      this.supplierService.getServiceAreabySlug(areaSlug).subscribe((localArea: LocalArea) => {
        this.localArea = localArea;
        this.fetchChefsByArea(localArea);
      });
      this.slots.push("Breakfast");
      this.slots.push("Lunch");
      this.slots.push("Dinner");
      this.slots.push("All Day");
      this.fetchCuisines();
    });
  }

  private fetchCuisines() {
    this.supplierService.getAllCuisines()
      .subscribe(
        (data: Cuisine[]) => {
          this.cuisines = data;
        },
        (error) => {
          console.log('Error while fetching cuisines.' + JSON.stringify(error));
        }
      );
  }

  fetchChefsByArea(localArea: LocalArea) {
    this.localChefSearchQuery = new LocalChefSearchQuery();
    this.localChefSearchQuery.serviceAreas = localArea._id;
    this.supplierService
      .getAllLocalChefs(this.localChefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.suppliers = result;
        this.suppliersFiltered = this.suppliers;
      });
  }

  back() {
    this._location.back();
  }

  selectCuisine(cuisine: Cuisine){

    this.suppliersFiltered = [];
    if (!this.selectedCuisines.includes(cuisine)) {
      this.selectedCuisines.push(cuisine);
    }else{
      for (var i = 0; i < this.selectedCuisines.length; i++) {
        if (this.selectedCuisines[i] === cuisine) {
          this.selectedCuisines.splice(i, 1);
        }
      }
    }
    if ( this.selectedCuisines.length === 0){
      this.suppliersFiltered = this.suppliers;
    }else{
      this.suppliers.forEach(s => {
        this.selectedCuisines.forEach( selectedC=>{
          s.cuisines.forEach(supplierC=>{
            if ( selectedC.name === supplierC.name){
              if (! this.suppliersFiltered.includes(s)){
                this.suppliersFiltered.push(s);
              }
            }
          });
        });
      });
    }
  }

  isCusineSelected(cuisine: Cuisine) {
    return this.selectedCuisines.includes(cuisine);
  }

  clearCuisines(){
    this.selectedCuisines = [];
    this.suppliersFiltered = this.suppliers;
  }

  selectSlot(slot: string){
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots.push(slot);
    }else{
      for (var i = 0; i < this.selectedSlots.length; i++) {
        if (this.selectedSlots[i] === slot) {
          this.selectedSlots.splice(i, 1);
        }
      }
    }
    this.suppliers.forEach(s => {
      this.selectedSlots.forEach( sc=>{
        if (s.slots.includes(sc)) {
          if (! this.suppliersFiltered.includes(s)){
            this.suppliersFiltered.push(s);
          }
        }
      });
    });
  }

  isSlotSelected(slot: string) {
    return this.selectedSlots.includes(slot);
  }

  clearSlots(){
    this.selectedSlots = [];
  }
}
