import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/helpers/utils';
import { Address, ChefContact, Contact, User, UserSession } from 'src/app/model/common-models';
import { Cuisine, LocalArea, LocalChef } from 'src/app/model/localchef';
import { AccountService } from 'src/app/service/account.service';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-become-a-supplier',
  templateUrl: './become-a-supplier.component.html',
  styleUrls: ['./become-a-supplier.component.css']
})
export class BecomeASupplierComponent implements OnInit {


  currentScreen: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;

  email: string;
  fullName: string;
  mobile: string;
  telephone: string;

  newSpecial: string;
  specials: string[] = [];


  slots: string[] = [];
  selectedSlots: string[] = [];

  newCategory: string;
  categories: string[] = [];

  serviceModes: string[] = [];
  selectedServiceModes: string[] = [];
  deliveryDistance: number;
  deliveryCharge: number;
  deliveryMinimum: number;
  freeDeliveryOver : number;
  delivery: boolean;
  minimumOrder: boolean;

  moduleName: string;
  displayAddressModule: boolean;
  displayContactModule: boolean;
  displayServiceAreaModule: boolean;
  displayCuisinesModule: boolean;
  displaySpecialModule: boolean;
  displaySlotsModule: boolean;
  displayCategoriesModule: boolean;
  displayServiceModeModule: boolean;


  userSession: UserSession;
  supplier: User;

  serviceAreaList: LocalArea[];
  showServiceAreas: boolean;
  showServiceAreaChefs: boolean;
  serviceAreaLookup: string;
  newArea: string;
  selectedAreaList: LocalArea[] = [];

  cuisines: Cuisine[];
  selectedCuisines: Cuisine[] = [];
  newCuisine: string;

  localChef: LocalChef;

  nextButton: string = "Next";
  submissionError: string;

  constructor(private utils: Utils, private accountService: AccountService, private localChefService: LocalChefService, private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    this.displayAddressModule = true;
    this.moduleName = "What is your address?";
    this.userSession = this.accountService.getUserSession();
    if (this.userSession !== undefined && this.userSession !== null) {
      this.supplier = this.userSession.user;
      if (this.supplier.contact === null || this.supplier.contact === undefined) {
        this.supplier.contact = new Contact();
      }
      this.localChefService.getLocalChefByEmail(this.supplier.email)
        .subscribe((res: LocalChef[]) => {
          if (res === null || res === undefined || res.length === 0) {
            this.createNewChef();
          } else {
            this.localChef = res[0];
            if (this.localChef.address !== null && this.localChef.address !== undefined) {
              this.addressLine1 = this.localChef.address.addressLine1;
              this.addressLine2 = this.localChef.address.addressLine2;
              this.city = this.localChef.address.city;
              this.postcode = this.localChef.address.postcode;
            }
            if (this.localChef.contact !== null && this.localChef.contact !== undefined) {
              this.mobile = this.localChef.contact.mobile;
              this.email = this.localChef.contact.email;
              this.fullName = this.localChef.contact.fullName;
              this.telephone = this.localChef.contact.telephone;
            }
            if (this.localChef.serviceAreas === null || this.localChef.serviceAreas === undefined || this.localChef.serviceAreas.length === 0) {
              this.localChef.serviceAreas = this.selectedAreaList;
            } else {
              this.selectedAreaList = this.localChef.serviceAreas;
            }
            if (this.localChef.cuisines === null || this.localChef.cuisines === undefined || this.localChef.cuisines.length === 0) {
              this.localChef.cuisines = this.selectedCuisines;
            } else {
              this.selectedCuisines = this.localChef.cuisines;
            }
          }
        }, err => {
          console.log('Error while fetching Chef. ' + JSON.stringify(err));
        });
    }
    this.fetchCuisines();

    this.slots.push("Breakfast");
    this.slots.push("Lunch");
    this.slots.push("Dinner");

    this.serviceModes.push("Collection");
    this.serviceModes.push("Delivery");
  }

  createNewChef() {
    console.log('Creating new Chef');
    var newChef: LocalChef = new LocalChef();
    newChef.email = this.supplier.email;
    this.localChefService.createNewChef(newChef)
      .subscribe((chef: LocalChef) => {
        this.localChef = chef;
        console.log('New Chef created. ' + JSON.stringify(this.localChef));
      }, err => {
        console.log('Error while creating new Chef. ' + JSON.stringify(err));
      });
  }

  fetchAllServiceAreas(city: string) {
    if (this.utils.isEquals(city, this.serviceAreaLookup) && (this.serviceAreaList !== null && this.serviceAreaList !== undefined)) {
      return;
    }
    this.serviceAreaLookup = city;
    this.localChefService.fetchLocalAreas(city)
      .subscribe(
        (data: LocalArea[]) => {
          this.serviceAreaList = data;
          console.log('The LocalArea List: ' + JSON.stringify(this.serviceAreaList));
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  fetchCuisines() {
    this.localChefService.getAllCuisines()
      .subscribe(
        (data: Cuisine[]) => {
          this.cuisines = data;
          console.log('The Cuisines List: ' + JSON.stringify(this.cuisines));
        },
        (error) => {
          console.log('Error while fetching cuisines.' + JSON.stringify(error));
        }
      );
  }

  //  Address -> Contact -> Area -> Cuisine -> Specials -> Slots -> Categories

  next() {
    if (this.displayAddressModule === true) {
      if (this.utils.isEmpty(this.addressLine1) || this.utils.isEmpty(this.addressLine2) || this.utils.isEmpty(this.city) || this.utils.isEmpty(this.postcode)) {
        return;
      } else {
        this.showContactModule();
      }
    } else if (this.displayContactModule === true) {
      if (this.utils.isEmpty(this.localChef.contact.mobile) || this.utils.isEmpty(this.localChef.contact.telephone)) {
        return;
      } else {
        this.showServiceAreaModule();
      }
    } else if (this.displayServiceAreaModule === true) {
      if (this.selectedAreaList === null || this.selectedAreaList === undefined || this.selectedAreaList.length === 0) {
        return;
      }
      this.showCuisineModule();
    } else if (this.displayCuisinesModule === true) {
      if (this.selectedCuisines === null || this.selectedCuisines === undefined || this.selectedCuisines.length === 0) {
        return;
      }
      this.showSpecialsModule();
    } else if (this.displaySpecialModule === true) {
      console.log('Selected specials ' + this.specials)
      if (this.specials.length === 0) {
        return;
      }
      this.showSlotsModule();
    } else if (this.displaySlotsModule === true) {
      console.log('Selected slots ' + this.selectedSlots)
      if (this.selectedSlots.length === 0) {
        return;
      }
      this.showCategoriesModule();
    } else if (this.displayCategoriesModule === true) {
      console.log('Selected categories ' + this.categories)
      if (this.categories.length === 0) {
        return;
      }
      this.showServiceModeModule();
    } else if (this.displayServiceModeModule === true) {
      console.log('Selected service modes ' + this.selectedServiceModes)
      if (this.selectedServiceModes.length === 0) {
        return;
      }
      this.saveChef();
    }
  }



  //  Address -> Contact -> Area -> Cuisine -> Specials -> Slots -> Categories -> Delivery
  back() {
    if (this.displayAddressModule === true) {
      return;
    } else if (this.displayContactModule === true) {
      this.showAddressModule();
    } else if (this.displayServiceAreaModule === true) {
      this.showContactModule();
    } else if (this.displayCuisinesModule === true) {
      this.showServiceAreaModule();
    } else if (this.displaySpecialModule === true) {
      this.showCuisineModule();
    } else if (this.displaySlotsModule === true) {
      this.showSpecialsModule();
    } else if (this.displayCategoriesModule === true) {
      this.showSlotsModule();
    } else if (this.displayServiceModeModule === true) {
      this.showCategoriesModule();
    }
  }

  private showServiceAreaModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = true;
    this.nextButton = "Next";
    this.moduleName = "Select your Service Area";
  }

  private showCuisineModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = true;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Next";
    this.moduleName = "Select your cuisines";
  }

  private showAddressModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = true;
    this.displayServiceAreaModule = false;
    this.nextButton = "Next";
    this.moduleName = "What is your address?";
  }

  private showContactModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = true;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.moduleName = "What are your contact details?";
    this.nextButton = "Next";
    this.fetchAllServiceAreas(this.city);
  }

  showSpecialsModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = true;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.moduleName = "What are your specials";
    this.nextButton = "Next";
  }

  showSlotsModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = true;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Next";
    this.moduleName = "What slots you can serve?";
  }

  showCategoriesModule() {
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = true;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Next";
    this.moduleName = "What categories your foods can be grouped?";
  }

  showServiceModeModule() {
    this.displayServiceModeModule = true;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Complete";
    this.moduleName = "Service Mode";
  }

  onRemoveArea(area: LocalArea){
    if (this.selectedAreaList.includes(area)) {
      for (var i = 0; i < this.selectedAreaList.length; i++) {
        var item = this.selectedAreaList[i];
        if (item.slug === area.slug) {
          console.log(`Removing area ${area.slug}`);
          this.selectedAreaList.splice(i, 1);
        }
      }
    }
  }

  onSelectArea(area: LocalArea) {
    if (!this.selectedAreaList.includes(area)) {
      this.selectedAreaList.push(area);
    } 
  }

  addArea() {
    var newArea: LocalArea = new LocalArea();
    newArea.name = this.newArea;
    newArea.city = this.localChef.address.city;
    newArea.slug = this.getSlug(newArea.name, newArea.city);
    if (! this.selectedAreaList.includes(newArea)){
      this.selectedAreaList.push(newArea);
    }
  }

  onRemoveCuisine(cuisine: Cuisine){
    if (this.selectedCuisines.includes(cuisine)) {
      for (var i = 0; i < this.selectedCuisines.length; i++) {
        var item = this.selectedCuisines[i];
        if (item.name === cuisine.name) {
          console.log(`Removing cuisine ${cuisine.name}`);
          this.selectedCuisines.splice(i, 1);
        }
      }
    }
  }

  onSelectCuisine(cuisine: Cuisine) {
    if (!this.selectedCuisines.includes(cuisine)) {
      this.selectedCuisines.push(cuisine);
    } 
  }

  addCuisine() {
    var newCuisine: Cuisine = new Cuisine();
    newCuisine.name = this.newCuisine;
    if (! this.selectedCuisines.includes(newCuisine)){
      this.selectedCuisines.push(newCuisine);
    }
  }


    onSelectSlot(slot: string) {
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots.push(slot);
    } else {
      for (var i = 0; i < this.selectedSlots.length; i++) {
        var item = this.selectedSlots[i];
        if (item === slot) {
          console.log(`Removing slot ${slot}`);
          this.selectedSlots.splice(i, 1);
        }
      }
    }
  }

  selectedSlot(slot: string) {
    return this.selectedSlots.includes(slot);
  }

  addCategory() {
    if (this.utils.isEmpty(this.newCategory)) {
      return;
    }
    if (!this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      this.newCategory = "";
    }
  }

  selectedCategory(category: string) {
    return this.categories.includes(category);
  }

  onRemoveCategory(category: string) {
    for (var i = 0; i < this.categories.length; i++) {
      var item = this.categories[i];
      if (item === category) {
        console.log(`Removing category ${category}`);
        this.categories.splice(i, 1);
      }
    }
  }
  /** Specials */
  addSpecial() {
    if (this.utils.isEmpty(this.newSpecial)) {
      return;
    }
    if (!this.specials.includes(this.newSpecial)) {
      this.specials.push(this.newSpecial);
      this.newSpecial = "";
    }
  }

  selectedSpecial(special: string) {
    return this.specials.includes(special);
  }

  onRemoveSpecial(special: string) {
    for (var i = 0; i < this.specials.length; i++) {
      var item = this.specials[i];
      if (item === special) {
        console.log(`Removing special ${special}`);
        this.specials.splice(i, 1);
      }
    }
  }

  /** Service Mode Questionnaire */
  selectedServiceMode(mode: string) {
    return this.selectedServiceModes.includes(mode);
  }

  onSelectServiceMode(mode: string) {
    if (!this.selectedServiceModes.includes(mode)) {
      this.selectedServiceModes.push(mode);
    } else {
      for (var i = 0; i < this.selectedServiceModes.length; i++) {
        var item = this.selectedServiceModes[i];
        if (item === mode) {
          console.log(`Removing mode ${mode}`);
          this.selectedServiceModes.splice(i, 1);
        }
      }
    }
    if (this.selectedServiceModes.includes("Delivery")) {
      this.delivery = true;
    } else {
      this.delivery = false;
    }
  }

  transformDeliveryFee(element) {
    element.target.value = this.currencyPipe.transform(this.deliveryCharge, 'GBP'); 
  }
  transformDeliveryMinimum(element) {
    element.target.value = this.currencyPipe.transform(this.deliveryMinimum, 'GBP'); 
  }
  transformFreeDeliveryOver(element) {
    element.target.value = this.currencyPipe.transform(this.freeDeliveryOver, 'GBP'); 
  }

  saveChef() {
    if (this.localChef !== null) {
      if (this.localChef.address === null) {
        this.localChef.address = new Address();
      }
      if (this.addressValid()) {
        this.localChef.address.addressLine1 = this.addressLine1;
        this.localChef.address.addressLine2 = this.addressLine2;
        this.localChef.address.city = this.city;
        this.localChef.address.postcode = this.postcode;
        this.submissionError = undefined;
      } else {
        this.submissionError = "Address is incomplete."
      }

      if (this.localChef.contact === null) {
        this.localChef.contact = new ChefContact();
      }
      if (this.contactValid()) {
        this.localChef.contact.email = this.email;
        this.localChef.contact.mobile = this.mobile;
        this.localChef.contact.telephone = this.telephone;
        this.localChef.contact.fullName = this.fullName;
      }

      if (this.localChef.cuisines === null || this.localChef.cuisines === undefined) {
        this.localChef.cuisines = this.selectedCuisines;
      }
     
      if (this.localChef.serviceAreas === null || this.localChef.serviceAreas === undefined || this.localChef.serviceAreas.length === 0) {
        this.localChef.serviceAreas = this.selectedAreaList;
      }

      if (this.localChef.specials === null || this.localChef.specials === undefined) {
        this.localChef.specials = [];
      }
      this.localChef.specials.push(...this.specials);

      if (this.localChef.categories === null || this.localChef.categories === undefined) {
        this.localChef.categories = [];
      }
      this.localChef.categories.push(...this.categories);

      if (this.localChef.slots === null || this.localChef.slots === undefined) {
        this.localChef.slots = [];
      }
      this.localChef.slots.push(...this.selectedSlots);

      this.localChef.delivery = this.selectedServiceModes.includes("Delivery");
      this.localChef.deliveryMinimum = this.deliveryMinimum;
      this.localChef.minimumOrder = +(this.minimumOrder);
      this.localChef.deliveryFee = +(this.deliveryCharge);
      this.localChef.freeDeliveryOver = +(this.freeDeliveryOver);

      console.log('Delivery Minimum: ' + this.deliveryMinimum);
      console.log('Parsed Delivery Minimum: ' + +(+this.deliveryMinimum).toFixed(2));

      this.localChefService.update(this.localChef).subscribe((res: LocalChef) => {
        if (res !== null && res !== undefined) {
          this.localChef = res;
          console.error('Update chef completed. ' + JSON.stringify(this.localChef));
        }
      }, err => {
        console.error('Update chef failed. ' + JSON.stringify(err));
      });
    }
  }

  getSlug(name, city) {
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase() + "-" + city.trim().replace(/[\W_]+/g, "-").toLowerCase()
  }

  addressValid() {
    if (this.utils.isEmpty(this.addressLine1) || this.utils.isEmpty(this.addressLine2) || this.utils.isEmpty(this.city) || this.utils.isEmpty(this.postcode)) {
      return false;
    }
    return true;
  }

  contactValid() {
    if (this.utils.isEmpty(this.mobile) || this.utils.isEmpty(this.fullName) || this.utils.isEmpty(this.telephone)) {
      return false;
    }
    return true;
  }

  slotsValid() {
    if (this.selectedSlots.length === 0) {
      return false;
    }
    return true;
  }

  specialsValid() {
    if (this.specials.length === 0) {
      return false;
    }
    return true;
  }

  cuisinesValid() {
    if (this.selectedCuisines.length === 0) {
      return false;
    }
    return true;
  }

  categoriesValid() {
    if (this.categories.length === 0) {
      return false;
    }
    return true;
  }
}
