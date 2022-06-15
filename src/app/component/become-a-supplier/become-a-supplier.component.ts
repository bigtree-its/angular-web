import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/helpers/utils';
import { Address, ChefContact, Contact, User, UserSession } from 'src/app/model/common-models';
import { Calendar, Cuisine, Food, LocalArea, LocalChef } from 'src/app/model/localchef';
import { AccountService } from 'src/app/service/account.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import * as _ from 'underscore';

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

  slots: string[] = [];
  selectedSlots: string[] = [];

  newCategory: string;
  categories: string[] = [];

  serviceModes: string[] = [];
  selectedServiceModes: string[] = [];
  deliveryDistance: number;
  deliveryCharge: number;
  deliveryMinimum: number;
  freeDeliveryOver: number;
  delivery: boolean;
  minimumOrder: number;

  itemName: string;
  itemPrice: number;
  itemDesc: string;

  moduleName: string;
  displayAddressModule: boolean;
  displayContactModule: boolean;
  displayServiceAreaModule: boolean;
  displayCuisinesModule: boolean;
  displaySpecialModule: boolean;
  displaySlotsModule: boolean;
  displayCategoriesModule: boolean;
  displayServiceModeModule: boolean;
  displayMenuModule: boolean;


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
  selectedCategory: string;

  orderByDate: NgbDate;
  collectionDate: NgbDate;
  deliveryDate: NgbDate;

  selectedCategoryForDisplay: string;
  showItemEditPanel: boolean;
  allDays: boolean;
  thisWeek: boolean = true;
  thisMonth: boolean;
  showCalendarEditPanel: boolean;
  calendars: Calendar[];

  public isCollapsed: boolean[] = [];
  weeklyCals: Calendar[] = [];
  MonthlyCals: Calendar[] = [];
  calendarsToDisplay: Calendar[];
  calendarOnEdit: Calendar;
  foods: Food[] = [];
  foodEditPanelTitle: string;
  foodOnEdit: Food;

  clickMyContainer: Function;

  constructor( private router: Router, private ngbCalendar: NgbCalendar, private utils: Utils, private accountService: AccountService, private localChefService: LocalChefService, private currencyPipe: CurrencyPipe) {
  }

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
            if (this.localChef.specials === null || this.localChef.specials === undefined || this.localChef.specials.length === 0) {
              this.localChef.specials = [];
            }
            if (this.localChef.categories === null || this.localChef.categories === undefined || this.localChef.categories.length === 0) {
              this.localChef.categories = this.categories;
            } else {
              this.categories = this.localChef.categories;
            }
            if (this.localChef.slots === null || this.localChef.slots === undefined || this.localChef.slots.length === 0) {
              this.localChef.slots = this.selectedSlots;
            } else {
              this.selectedSlots = this.localChef.slots;
            }
            if (this.localChef.delivery) {
              this.selectedServiceModes.push("Delivery");
            }
            this.deliveryMinimum = this.localChef.deliveryMinimum;
            this.freeDeliveryOver = this.localChef.freeDeliveryOver;
            this.deliveryCharge = this.localChef.deliveryFee;
            this.deliveryDistance = this.localChef.deliveryDistance;
            this.minimumOrder = this.localChef.minimumOrder;
            this.fetchCalendars();
            this.fetchFoods();
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

  fetchFoods() {
    this.localChefService.getAllFoods(this.localChef._id).subscribe((foods: Food[]) => {
      if (!this.utils.isCollectionEmpty(foods)) {
        this.foods = foods;
        this.foods.sort((val1: Food, val2: Food) => {
          return <any>new Date(val1.updatedAt) - <any>new Date(val2.updatedAt);
        });
        console.log('Foods for Chef: ' + JSON.stringify(this.foods));
      }
    }, err => { });
  }


  fetchCalendars() {
    this.localChefService.getCalendars(this.localChef._id, false, false).subscribe((calendars: Calendar[]) => {
      this.calendars = calendars;
      if (this.utils.isCollectionEmpty(this.calendars)) {
        this.calendars = [];
      }
      this.refreshCalendars();
    }, err => { });
  }

  private refreshCalendars() {
    this.calendars.sort((val1: Calendar, val2: Calendar) => {
      return <any>new Date(val1.orderBefore) - <any>new Date(val2.orderBefore);
    });
    console.log('Calendars for Chef: ' + JSON.stringify(this.calendars));
    this.groupCalendar();
    this.selectThisWeek();
  }

  createNewChef() {
    console.log('Creating new Chef');
    var newChef: LocalChef = new LocalChef();
    newChef.email = this.supplier.email;
    this.localChefService.createNewChef(newChef)
      .subscribe((chef: LocalChef) => {
        this.localChef = chef;
        this.fetchCalendars();
        this.fetchFoods();
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
      console.log('Selected specials ' + this.localChef.specials)
      if (this.localChef.specials.length === 0) {
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
    }else if (this.displayMenuModule === true) {
      this.router.navigate(['/supplier-profile']);
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
    else if (this.displayMenuModule === true) {
      this.showServiceModeModule();
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
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
    this.displayMenuModule = false;
    this.nextButton = "Next";
    this.moduleName = "What categories your foods can be grouped?";
  }

  showServiceModeModule() {
    this.displayServiceModeModule = true;
    this.displayMenuModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Next";
    this.moduleName = "Service Mode";
  }

  showMenuModule() {
    this.displayMenuModule = true;
    this.displayServiceModeModule = false;
    this.displayCategoriesModule = false;
    this.displaySlotsModule = false;
    this.displaySpecialModule = false;
    this.displayContactModule = false;
    this.displayCuisinesModule = false;
    this.displayAddressModule = false;
    this.displayServiceAreaModule = false;
    this.nextButton = "Complete";
    this.moduleName = "Your Menu";
    this.selectedCategoryForDisplay = this.categories[0];
  }

  onRemoveArea(area: LocalArea) {
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
    if (!this.selectedAreaList.includes(newArea)) {
      this.selectedAreaList.push(newArea);
    }
  }

  onRemoveCuisine(cuisine: Cuisine) {
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
    if (!this.selectedCuisines.includes(newCuisine)) {
      this.selectedCuisines.push(newCuisine);
    }
  }

  onSelectSlot(slot: string) {
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots.push(slot);
    }
  }

  onRemoveSlot(slot: string) {
    if (this.selectedSlots.includes(slot)) {
      for (var i = 0; i < this.selectedSlots.length; i++) {
        var item = this.selectedSlots[i];
        if (item === slot) {
          console.log(`Removing slot ${slot}`);
          this.selectedSlots.splice(i, 1);
        }
      }
    }
  }

  /** Specials */
  addSpecial() {
    if (this.utils.isEmpty(this.newSpecial)) {
      return;
    }
    if (!this.localChef.specials.includes(this.newSpecial)) {
      this.localChef.specials.push(this.newSpecial);
      this.newSpecial = "";
    }
  }

  onRemoveSpecial(special: string) {
    if (this.localChef.specials.includes(special)) {
      for (var i = 0; i < this.localChef.specials.length; i++) {
        var item = this.localChef.specials[i];
        if (item === special) {
          console.log(`Removing special ${special}`);
          this.localChef.specials.splice(i, 1);
        }
      }
    }

  }

  /** categories */
  addCategory() {
    if (this.utils.isEmpty(this.newCategory)) {
      return;
    }
    if (!this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      this.localChef.categories = this.categories;
      this.newCategory = "";
      console.log('The categories: ' + this.categories);
      console.log('The categories in chef: ' + this.localChef.categories);
    }
  }

  onRemoveCategory(category: string) {
    if (this.categories.includes(category)) {
      for (var i = 0; i < this.categories.length; i++) {
        var item = this.categories[i];
        if (item === category) {
          console.log(`Removing category ${category}`);
          this.categories.splice(i, 1);
          this.localChef.categories = this.categories;
        }
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
  transformMinimumOrder(element) {
    element.target.value = this.currencyPipe.transform(this.minimumOrder, 'GBP');
  }

  transformItemPrice(element) {
    element.target.value = this.currencyPipe.transform(this.itemPrice, 'GBP');
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

      if (this.localChef.categories === null || this.localChef.categories === undefined) {
        this.localChef.categories = this.categories;
      }

      if (this.localChef.slots === null || this.localChef.slots === undefined) {
        this.localChef.slots = this.selectedSlots;
      }

      this.localChef.delivery = this.selectedServiceModes.includes("Delivery");
      this.localChef.deliveryMinimum = +(this.deliveryMinimum);
      this.localChef.minimumOrder = +(this.minimumOrder);
      this.localChef.deliveryFee = +(this.deliveryCharge);
      this.localChef.freeDeliveryOver = +(this.freeDeliveryOver);
      this.localChef.deliveryDistance = this.deliveryDistance;

      console.log('Delivery Minimum: ' + this.deliveryMinimum);
      console.log('Parsed Delivery Minimum: ' + +(+this.deliveryMinimum).toFixed(2));

      this.localChefService.update(this.localChef).subscribe((res: LocalChef) => {
        if (res !== null && res !== undefined) {
          this.localChef = res;
          console.info('Update chef completed. ' + JSON.stringify(this.localChef));
          this.showMenuModule();
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
    if (this.localChef.specials.length === 0) {
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

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  saveFood() {

    if (this.utils.isEmpty(this.itemName) || this.utils.isEmpty(this.itemDesc) || this.utils.isEmpty(this.selectedCategory) || !this.utils.isValid(this.itemPrice)) {
      return;
    }
    if (this.foodOnEdit !== null && this.foodOnEdit !== undefined) {
      this.updateFood();
    } else {
      this.createNewFood();
    }

  }

  createNewFood() {
    if (!this.utils.isCollectionEmpty(this.foods)) {
      for (var i = 0; i < this.foods.length; i++) {
        var item = this.foods[i];
        if (item.name === this.itemName) {
          return;
        }
      }
    }
    var food: Food = new Food();
    food.category = this.selectedCategory;
    food.name = this.itemName;
    food.description = this.itemDesc;
    food.price = this.itemPrice;
    food.chefId = this.localChef._id;
    food._uid = Date.now();

    this.localChefService.createNewFood(food).subscribe((food: Food) => {
      console.log("Food created. " + JSON.stringify(food));
      this.fetchFoods();
    }, err => { });
    this.cancelItemEdit();
  }

  private updateFood() {
    this.foodOnEdit.category = this.selectedCategory;
    this.foodOnEdit.name = this.itemName;
    this.foodOnEdit.description = this.itemDesc;
    this.foodOnEdit.price = this.itemPrice;

    this.localChefService.updateFood(this.foodOnEdit).subscribe((food: Food) => {
      console.log("Food Updated. " + JSON.stringify(food));
      this.fetchFoods();
      this.cancelItemEdit();
    }, err => { });
  }

  onRemoveFood(foodToDelete: Food) {
    console.log('Removing food ' + JSON.stringify(foodToDelete));
    this.localChefService.deleteFood(foodToDelete).subscribe(any => {
      console.log("Food Deleted. ");
      this.fetchFoods();
    }, err => { });
  }

  onEditFood(foodToEdit: Food) {
    this.foodOnEdit = foodToEdit;
    this.showItemEditPanel = true;
    console.log('Editing food ' + JSON.stringify(foodToEdit));
    this.foodEditPanelTitle = foodToEdit.name;
    this.selectedCategory = foodToEdit.category;
    this.itemName = foodToEdit.name;
    this.itemDesc = foodToEdit.description;
    this.itemPrice = foodToEdit.price;
  }

  selectCategoryForDisplay(cat: string) {
    console.log('Currently selected: ' + this.selectedCategoryForDisplay);
    this.selectedCategoryForDisplay = cat;
    console.log('After selection: ' + this.selectedCategoryForDisplay);
  }

  isCategorySelected(cat: string) {
    return this.selectedCategoryForDisplay === cat;
  }

  onClickAddNewFood() {
    this.showItemEditPanel = true;
    this.foodEditPanelTitle = "Create New Food";
  }

  cancelItemEdit() {
    this.showItemEditPanel = false;
    this.itemName = "";
    this.itemDesc = "";
    this.itemPrice = 0;
    this.selectedCategory = "";
    this.foodOnEdit = null;
  }

  selectAllDays() {
    this.allDays = true;
    this.thisMonth = false;
    this.thisWeek = false;
    this.calendarsToDisplay = this.calendars;
  }

  selectThisWeek() {
    this.thisWeek = true;
    this.thisMonth = false;
    this.allDays = false;
    this.calendarsToDisplay = this.weeklyCals;
  }

  isPeriodSelected(period: string) {
    if (period === 'allDays' && this.allDays) {
      return true;
    } else if (period === 'thisWeek' && this.thisWeek) {
      return true;
    } else if (period === 'thisMonth' && this.thisMonth) {
      return true;
    }
  }

  selectThisMonth() {
    this.thisMonth = true;
    this.thisWeek = false;
    this.allDays = false;
    this.calendarsToDisplay = this.MonthlyCals;
  }

  addDays(theDate: Date, days: number): Date {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  groupCalendar() {
    this.weeklyCals = [];
    this.MonthlyCals = [];
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    let today: Date = new Date();
    let dayOfWeekNumber: number = today.getDay();
    let endDays: number = 7 - dayOfWeekNumber;
    var endDate: Date = this.addDays(today, endDays);
    for (var i = 0; i < this.calendars.length; i++) {
      var calendar: Calendar = this.calendars[i];
      if (calendar !== null && calendar !== undefined) {
        let calDate: Date = new Date(calendar.orderBefore);
        if (calDate < endDate && calDate > today) {
          this.weeklyCals.push(calendar);
          this.MonthlyCals.push(calendar);
        } else if (calDate < lastDay && calDate > firstDay) {
          this.MonthlyCals.push(calendar);
        }
      }
    }
    console.log('Weekly Cals: ' + JSON.stringify(this.weeklyCals));
    console.log('Monthly Cals: ' + JSON.stringify(this.MonthlyCals));
  }

  addNewCalendar() {
    this.showCalendarEditPanel = true;
    this.calendarOnEdit = new Calendar();
    this.calendarOnEdit.foods = [];
  }

  cancelCalendarEditing() {
    this.showCalendarEditPanel = false;
    this.calendarOnEdit = null;
  }

  sortCalendar(a: Calendar, b: Calendar) {
    return new Date(a.orderBefore).getTime() - new Date(b.orderBefore).getTime();
  }

  editCalendar(cal: Calendar) {
    this.calendarOnEdit = cal;
    this.showCalendarEditPanel = true;
    var orderBefore = new Date(this.calendarOnEdit.orderBefore);
    var collectionBy = new Date(this.calendarOnEdit.collectionStartDate);
    var deliveryBy = new Date(this.calendarOnEdit.deliveryStartDate);

    console.log('Calendar on edit: ' + JSON.stringify(this.calendarOnEdit))
    this.orderByDate = NgbDate.from({ year: orderBefore.getUTCFullYear(), month: orderBefore.getMonth(), day: orderBefore.getDay() });
    this.deliveryDate = new NgbDate(deliveryBy.getFullYear(), deliveryBy.getMonth(), deliveryBy.getDay());
    this.collectionDate = new NgbDate(collectionBy.getFullYear(), collectionBy.getMonth(), collectionBy.getDay());

  }

  deleteCalendar(calendar: Calendar) {
    this.localChefService.deleteCalendar(calendar)
      .subscribe(
        (any) => {
          this.fetchCalendars();
        },
        err => { });
  }

  onClickAddFoodToCalendar(food: Food) {
    if (this.calendarOnEdit !== null && this.calendarOnEdit !== undefined) {
      var foods: Food[] = this.calendarOnEdit.foods;
      if (this.utils.isCollectionEmpty(foods)) {
        foods = [];
      }
      for (var i = 0; i < foods.length; i++) {
        var item = foods[i];
        if (item.name === food.name) {
          return;
        }
      }
      foods.push(food);
      this.calendarOnEdit.foods = foods;
    }
  }

  onClickRemoveFoodFromCalendar(food: Food) {
    if (this.calendarOnEdit !== null && this.calendarOnEdit !== undefined) {
      var foods: Food[] = this.calendarOnEdit.foods;
      if (this.utils.isCollectionEmpty(foods)) {
        foods = [];
      }
      for (var i = 0; i < foods.length; i++) {
        var item = foods[i];
        if (item.name === food.name) {
          foods.splice(i, 1);
          return;
        }
      }
      foods.push(food);
      this.calendarOnEdit.foods = foods;
    } 
  }

  saveCalendar() {
    let today: Date = new Date();
    var orderBefore: Date = new Date(this.orderByDate.year, this.orderByDate.month - 1, this.orderByDate.day);
    var collectionDate: Date = new Date(this.collectionDate.year, this.collectionDate.month - 1, this.collectionDate.day);
    var deliveryDate: Date = new Date(this.deliveryDate.year, this.deliveryDate.month - 1, this.deliveryDate.day);

    if (this.calendarOnEdit._id === null || this.calendarOnEdit._id === undefined) {
      if (orderBefore > today && collectionDate > orderBefore && deliveryDate > orderBefore) {
        if (!this.utils.isCollectionEmpty(this.calendars)) {
          for (var i = 0; i < this.calendars.length; i++) {
            var calendar: Calendar = this.calendars[i];
            if (calendar !== null && calendar !== undefined) {
              if (new Date(calendar.orderBefore) === orderBefore) {
                return;
              }
            }
          }
        }
      }
      this.calendarOnEdit.chefId = this.localChef._id;
      this.calendarOnEdit.orderBefore = orderBefore;
      this.calendarOnEdit.collectionStartDate = collectionDate;
      this.calendarOnEdit.collectionEndDate = collectionDate;
      this.calendarOnEdit.deliveryStartDate = deliveryDate;
      this.calendarOnEdit.deliveryEndDate = deliveryDate;
    }
    if (this.calendarOnEdit._id === null || this.calendarOnEdit._id === undefined) {
      this.createNewCalendar();
    } else {
      this.localChefService.updateCalendar(this.calendarOnEdit)
        .subscribe(any => {
          this.fetchCalendars();
        },
          err => { });
    }
    this.cancelCalendarEditing();

  }
  createNewCalendar() {
    this.localChefService.createNewCalendar(this.calendarOnEdit)
      .subscribe(any => {
        this.fetchCalendars();
      },
        err => { });
  }
}
