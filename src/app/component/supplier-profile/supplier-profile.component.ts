import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/helpers/utils';
import { Address, User, UserSession } from 'src/app/model/common-models';
import { Calendar, Cuisine, Food, FoodOrder, LocalArea, LocalChef, LocalChefSearchQuery, SupplierSummary } from 'src/app/model/localchef';
import { AccountService } from 'src/app/service/account.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import { OrderService } from 'src/app/service/order.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from 'src/app/helpers/ngb-date-fr-parser-formatter';


@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class SupplierProfileComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public dailyLabels: Label[] = [];
  public monthLabels: Label[] = [];
  public barChartType: ChartType = 'doughnut';
  public barChartLegend = true;
  public barChartPlugins = [];
  public monthlyData: ChartDataSets[] = [];

  userSession: UserSession;
  user: User;
  supplier: LocalChef;

  partyOrders: boolean;

  public isCollapsed: boolean[] = [];
  displayOrders: boolean;
  orders: FoodOrder[] = [];
  ordersWeekly: FoodOrder[] = [];
  ordersMonthly: FoodOrder[] = [];
  ordersYearly: FoodOrder[] = [];
  totalOrdersWeekly: number;
  totalOrdersMonthly: number;
  totalOrdersYearly: number;
  totalRevenueWeekly: number;
  totalRevenueMonthly: number;
  totalRevenueYearly: number;
  displayMenus: boolean;
  selectedCategory: string;
  itemName: string;
  itemDesc: string;
  itemPrice: number;
  foodOnEdit: Food;
  foods: Food[] = [];
  calendars: Calendar[] = [];
  foodEditPanelTitle: string;
  selectedCategoryForDisplay: string;
  allDays: boolean;
  thisMonth: boolean;
  thisWeek: boolean;
  vegetarian: boolean;
  spice: number = 1;
  calendarsToDisplay: Calendar[] = [];
  weeklyCals: Calendar[] = [];
  MonthlyCals: Calendar[] = [];
  showCalendarEditPanel: boolean;
  calendarOnEdit: Calendar;
  orderByDate: NgbDate;
  deliveryDate: NgbDate;
  collectionDate: NgbDate;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  mobile: string;
  email: string;
  fullName: string;
  telephone: string;
  selectedAreas: LocalArea[] = [];
  selectedCuisines: Cuisine[] = [];
  categories: string[] = [];
  selectedSlots: string[] = [];
  slots: string[] = [];
  selectedServiceModes: string[] = [];
  deliveryMinimum: number;
  freeDeliveryOver: number;
  deliveryCharge: number;
  deliveryDistance: number;
  minimumOrder: number;
  displayProfile: boolean;
  displayDashboard: boolean;
  iCanDeliver: boolean;
  displayEditPanel: boolean;
  editAddress: boolean;
  specials: string[] = [];
  displayEditSpecials: boolean;
  newSpecial: string;
  displayEditCuisines: boolean;
  newCuisine: string;
  cuisines: Cuisine[];
  displayEditCategories: boolean;
  newCategory: string;
  displayEditSlots: boolean;
  displayEditFoods: boolean;
  displayEditFoodItem: boolean;
  delivery: boolean;
  deliveryFee: number;
  packagingFee: number;
  displayEditSettings: boolean;
  minimumPartyOrder: any;
  displayEditLocations: boolean;
  newLocation: string;
  serviceAreas: LocalArea[];
  openOrders: FoodOrder[] = [];
  completedOrders: FoodOrder[] = [];
  ordersInProgress: FoodOrder[] = [];
  displayOpenOrders: boolean;
  displayCompletedOrders: boolean;
  displayOrderCalendar: boolean;
  displayViewOrder: boolean;
  orderInView: FoodOrder;

  constructor(private supplierService: LocalChefService,
    private accountService: AccountService,
    private utils: Utils,
    private ngbCalendar: NgbCalendar,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    this.displayDashboard = true;
    this.slots.push("Breakfast");
    this.slots.push("Lunch");
    this.slots.push("Dinner");
    this.slots.push("All Day");
    this.fetchCuisines();
    this.orderByDate = this.ngbCalendar.getToday();
    this.collectionDate = this.ngbCalendar.getToday();
    this.deliveryDate = this.ngbCalendar.getToday();
    this.accountService.userSessionSubject$.subscribe(userSession => {
      this.userSession = userSession;
      if (userSession !== null && userSession.user !== null && userSession.user !== undefined) {
        this.user = this.userSession.user;
        var query: LocalChefSearchQuery = new LocalChefSearchQuery();
        query.email = this.user.email;
        this.supplierService.getAllLocalChefs(query).subscribe(supplier => {
          this.supplier = supplier[0];
          this.extractData();
        }, err => { });
      } else {
      }
    })

  }

  private extractData() {
    this.extractAddress();
    this.extractContact();
    this.extractServiceArea();
    this.extractCuisine();
    this.extractSpecials();
    this.extractCategories();
    this.extractSlots();
    this.extractSettings();
    this.fetchCalendars();
    this.fetchFoods();
    this.getSupplierProfile();
    this.extractSettings();
  }

  private extractSettings() {
    this.delivery = this.supplier.delivery;
    this.deliveryMinimum = this.supplier.deliveryMinimum;
    this.deliveryDistance = this.supplier.deliveryDistance;
    this.deliveryFee = this.supplier.deliveryFee;
    this.freeDeliveryOver = this.supplier.freeDeliveryOver;
    this.packagingFee = this.supplier.packagingFee;
    this.partyOrders = this.supplier.partyOrders;
    this.minimumOrder = this.supplier.minimumOrder;
    this.minimumPartyOrder = this.supplier.minimumPartyOrder;
  }

  private fetchCuisines() {
    this.supplierService.getAllCuisines()
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

  fetchAllServiceAreas(city: string) {
    if (this.utils.isEmpty(city)) {
      return;
    }
    this.supplierService.fetchLocalAreas(city)
      .subscribe(
        (data: LocalArea[]) => {
          this.serviceAreas = data;
          console.log('The LocalArea List: ' + JSON.stringify(this.serviceAreas));
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  private extractSlots() {
    if (this.supplier.slots === null || this.supplier.slots === undefined || this.supplier.slots.length === 0) {
      this.supplier.slots = this.selectedSlots;
    } else {
      this.selectedSlots = this.supplier.slots;
    }
  }

  private extractCategories() {
    if (this.supplier.categories === null || this.supplier.categories === undefined || this.supplier.categories.length === 0) {
      this.supplier.categories = this.categories;
    } else {
      this.categories = this.supplier.categories;
    }
    this.selectedCategoryForDisplay = this.categories[0];
  }

  private extractSpecials() {
    if (this.supplier.specials === null || this.supplier.specials === undefined || this.supplier.specials.length === 0) {
      this.supplier.specials = this.specials;
    } else {
      this.specials = this.supplier.specials;
    }
  }

  private extractCuisine() {
    if (this.supplier.cuisines === null || this.supplier.cuisines === undefined || this.supplier.cuisines.length === 0) {
      this.supplier.cuisines = this.selectedCuisines;
    } else {
      this.selectedCuisines = this.supplier.cuisines;
    }
  }

  private extractServiceArea() {
    if (this.supplier.serviceAreas === null || this.supplier.serviceAreas === undefined || this.supplier.serviceAreas.length === 0) {
      this.supplier.serviceAreas = this.selectedAreas;
    } else {
      this.selectedAreas = this.supplier.serviceAreas;
    }
  }

  private extractContact() {
    if (this.supplier.contact !== null && this.supplier.contact !== undefined) {
      this.mobile = this.supplier.contact.mobile;
      this.email = this.supplier.contact.email;
      this.fullName = this.supplier.contact.fullName;
      this.telephone = this.supplier.contact.telephone;
    }
  }

  private extractAddress() {
    if (this.supplier.address !== null && this.supplier.address !== undefined) {
      this.addressLine1 = this.supplier.address.addressLine1;
      this.addressLine2 = this.supplier.address.addressLine2;
      this.city = this.supplier.address.city;
      this.postcode = this.supplier.address.postcode;
      this.fetchAllServiceAreas(this.city);
    }
  }

  private getSupplierProfile() {
    this.orderService.getSupplierSummary(this.supplier._id).subscribe((data: SupplierSummary) => {
      if (data !== null && data !== undefined) {
        this.ordersWeekly = data.ordersWeekly;
        this.ordersMonthly = data.ordersMonthly;
        this.ordersYearly = data.ordersYearly;

        this.totalOrdersWeekly = data.totalOrdersWeekly;
        this.totalOrdersMonthly = data.totalOrdersMonthly;
        this.totalOrdersYearly = data.totalOrdersYearly;

        this.totalRevenueWeekly = data.totalRevenueWeekly;
        this.totalRevenueMonthly = data.totalRevenueMonthly;
        this.totalRevenueYearly = data.totalRevenueYearly;


        var yearlyGrouping: Map<string, number> = data.yearlyGrouping;
        var keys: string[] = Object.keys(yearlyGrouping);
        var values = Object.values(yearlyGrouping);
        this.monthLabels.push(...keys);
        this.monthlyData = [
          { data: values, label: 'Revenue' }
        ];
        this.ordersYearly.forEach(e=>{
          if ( e.status === "CREATED"){
            this.openOrders.push(e);
          }
        });
        this.ordersYearly.forEach(e=>{
          if ( e.status === "COMPLETED"){
            this.completedOrders.push(e);
          }
        });
        this.ordersYearly.forEach(e=>{
          if ( e.status === "IN_PROGRESS"){
            this.ordersInProgress.push(e);
          }
        });
      }
    }, err => {
      console.log('Error while fetching orders for supplier ' + err);
    });
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

  fetchFoods() {
    this.supplierService.getAllFoods(this.supplier._id).subscribe((foods: Food[]) => {
      if (!this.utils.isCollectionEmpty(foods)) {
        this.foods = foods;
        this.foods.sort((val1: Food, val2: Food) => {
          return <any>new Date(val1.updatedAt) - <any>new Date(val2.updatedAt);
        });

      }
    }, err => {
      console.log('Unable to fetch Foods for Chef: ' + JSON.stringify(err));
    });
  }


  fetchCalendars() {
    this.supplierService.getCalendars(this.supplier._id, false, false).subscribe((calendars: Calendar[]) => {
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
    this.groupCalendar();
    this.selectThisWeek();
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
    food.chefId = this.supplier._id;
    food.vegetarian = this.vegetarian;
    food.spice = this.spice;
    food._uid = Date.now();

    this.supplierService.createNewFood(food).subscribe((food: Food) => {
      this.fetchFoods();
    }, err => { });
    this.cancelItemEdit();
  }

  private updateFood() {
    this.foodOnEdit.category = this.selectedCategory;
    this.foodOnEdit.name = this.itemName;
    this.foodOnEdit.description = this.itemDesc;
    this.foodOnEdit.price = this.itemPrice;
    this.foodOnEdit.spice = this.spice;
    this.foodOnEdit.vegetarian = this.vegetarian;

    this.supplierService.updateFood(this.foodOnEdit).subscribe((food: Food) => {
      this.fetchFoods();
      this.cancelItemEdit();
    }, err => { });
  }

  onRemoveFood(foodToDelete: Food) {
    this.supplierService.deleteFood(foodToDelete).subscribe(any => {
      this.fetchFoods();
    }, err => { });
  }

  onEditFood(foodToEdit: Food) {
    this.foodOnEdit = foodToEdit;
    this.displayEditFoodItem = true;
    this.foodEditPanelTitle = foodToEdit.name;
    this.selectedCategory = foodToEdit.category;
    this.itemName = foodToEdit.name;
    this.itemDesc = foodToEdit.description;
    this.itemPrice = foodToEdit.price;
    this.vegetarian = foodToEdit.vegetarian;
    this.spice = foodToEdit.spice;
  }

  selectCategoryForDisplay(cat: string) {
    this.selectedCategoryForDisplay = cat;
  }

  isCategorySelected(cat: string) {
    return this.selectedCategoryForDisplay === cat;
  }

  onClickAddNewFood() {
    this.displayEditFoodItem = true;
    this.vegetarian = false;
    this.spice = 1;
    this.foodEditPanelTitle = "Create New Food";
  }

  cancelItemEdit() {
    this.displayEditFoodItem = false;
    this.itemName = "";
    this.itemDesc = "";
    this.itemPrice = 0;
    this.spice = 1;
    this.vegetarian = false;
    this.selectedCategory = "";
    this.foodOnEdit = null;
  }

  clearFoodEdit() {
    this.itemName = "";
    this.itemDesc = "";
    this.itemPrice = 0;
    this.spice = 1;
    this.vegetarian = false;
    this.selectedCategory = "";
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

    this.orderByDate = NgbDate.from({ year: orderBefore.getUTCFullYear(), month: orderBefore.getMonth(), day: orderBefore.getDay() });
    this.deliveryDate = new NgbDate(deliveryBy.getFullYear(), deliveryBy.getMonth(), deliveryBy.getDay());
    this.collectionDate = new NgbDate(collectionBy.getFullYear(), collectionBy.getMonth(), collectionBy.getDay());

  }

  copyCalendar(cal: Calendar){
    this.calendarOnEdit = cal;
    this.showCalendarEditPanel = true;
    var orderBefore = new Date(this.calendarOnEdit.orderBefore);
    var collectionBy = new Date(this.calendarOnEdit.collectionStartDate);
    var deliveryBy = new Date(this.calendarOnEdit.deliveryStartDate);

    this.orderByDate = NgbDate.from({ year: orderBefore.getUTCFullYear(), month: orderBefore.getMonth(), day: orderBefore.getDay() });
    this.deliveryDate = new NgbDate(deliveryBy.getFullYear(), deliveryBy.getMonth(), deliveryBy.getDay());
    this.collectionDate = new NgbDate(collectionBy.getFullYear(), collectionBy.getMonth(), collectionBy.getDay());
  }

  deleteCalendar(calendar: Calendar) {
    this.supplierService.deleteCalendar(calendar)
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
      this.calendarOnEdit.chefId = this.supplier._id;
      this.calendarOnEdit.orderBefore = orderBefore;
      this.calendarOnEdit.collectionStartDate = collectionDate;
      this.calendarOnEdit.collectionEndDate = collectionDate;
      this.calendarOnEdit.deliveryStartDate = deliveryDate;
      this.calendarOnEdit.deliveryEndDate = deliveryDate;
    }
    if (this.calendarOnEdit._id === null || this.calendarOnEdit._id === undefined) {
      this.createNewCalendar();
    } else {
      this.supplierService.updateCalendar(this.calendarOnEdit)
        .subscribe(any => {
          this.fetchCalendars();
        },
          err => { });
    }
    this.cancelCalendarEditing();

  }
  createNewCalendar() {
    this.supplierService.createNewCalendar(this.calendarOnEdit)
      .subscribe(any => {
        this.fetchCalendars();
      },
        err => { });
  }

  showOrders() {
    this.displayOrders = true;
    this.displayMenus = false;
    this.displayProfile = false;
    this.displayDashboard = false;
    this.cancelEditPanel();
  }

  showMenus() {
    this.displayProfile = false;
    this.displayOrders = false;
    this.displayDashboard = false;
    this.displayMenus = true;
    this.cancelEditPanel();
  }

  showProfile() {
    this.displayProfile = true;
    this.displayMenus = false;
    this.displayOrders = false;
    this.displayDashboard = false;
    this.cancelEditPanel();
  }

  showDashboard() {
    this.displayProfile = false;
    this.displayMenus = false;
    this.displayOrders = false;
    this.displayDashboard = true;
    this.cancelEditPanel();
    this.cancelEditPanel();
  }

  handleVegetarian(evt) {
    var target = evt.target;
    if (target.checked) {
      this.vegetarian = true;
    } else {
      this.vegetarian = false;
    }
  }

  handlePartyOrders(evt) {
    var target = evt.target;
    if (target.checked) {
      this.partyOrders = true;
    } else {
      this.partyOrders = false;
    }
  }

  handleDelivery(evt) {
    var target = evt.target;
    if (target.checked) {
      this.delivery = true;
    } else {
      this.delivery = false;
    }
  }

  showAdderssEditPanel() {
    this.displayEditPanel = true;
    this.displayEditFoods = false;
    this.displayEditCategories = false;
    this.displayEditCuisines = false;
    this.editAddress = true;
    this.displayEditSpecials = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
  }

  saveAddress() {
    this.displayEditPanel = false;
    this.editAddress = false;
    if (this.supplier.address === null || this.supplier.address === undefined) {
      this.supplier.address = new Address();
    }
    this.supplier.address.addressLine1 = this.addressLine1;
    this.supplier.address.addressLine2 = this.addressLine2;
    this.supplier.address.city = this.city;
    this.supplier.address.postcode = this.postcode;
    this.updateSupplier();
    this.updateUserAddress();
    this.cancelEditPanel();
  }

  private updateSupplier() {
    this.supplierService.update(this.supplier).subscribe((updated: LocalChef) => {
      this.supplier = updated;
      this.extractData();
    }, err => {
      console.log('Update supplier address failed. Retry again later' + JSON.stringify(err));
    });
  }

  private updateUserAddress() {
    if (this.user.address === null || this.user.address === undefined) {
      this.user.address = new Address();
    }
    this.user.address.addressLine1 = this.addressLine1;
    this.user.address.addressLine2 = this.addressLine2;
    this.user.address.city = this.city;
    this.user.address.postcode = this.postcode;
    this.accountService.updateUser(this.user).subscribe((updated: User) => {
      this.user = updated;
    }, err => {
      console.log('Update User failed. Retry again later' + JSON.stringify(err));
    });
  }




  /** Specials */

  editSpecials() {
    this.displayEditFoods = true;
    this.displayEditCategories = false;
    this.displayEditCuisines = false;
    this.editAddress = false;
    this.displayEditSpecials = true;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
    this.displayEditFoods = false;
  }

  addSpecial() {
    if (this.utils.isEmpty(this.newSpecial)) {
      return;
    }
    if (!this.specials.includes(this.newSpecial)) {
      this.supplier.specials.push(this.newSpecial);
      this.newSpecial = "";
    }
  }

  onRemoveSpecial(special: string) {
    if (this.specials.includes(special)) {
      for (var i = 0; i < this.specials.length; i++) {
        var item = this.specials[i];
        if (item === special) {
          console.log(`Removing special ${special}`);
          this.specials.splice(i, 1);
        }
      }
    }
  }

  saveSpecials() {
    this.cancelEditPanel();
    this.supplier.specials = this.specials;
    this.updateSupplier();
  }

  /** Cuisines */
  editCuisines() {
    this.displayEditPanel = true;
    this.displayEditCuisines = true;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditCategories = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
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

  saveCuisines() {
    this.cancelEditPanel();
    this.supplier.cuisines = this.selectedCuisines;
    this.updateSupplier();
  }

  /** Category */

  editCategories() {
    this.displayEditPanel = true;
    this.displayEditCategories = true;
    this.displayEditCuisines = false;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;

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

  onRemoveCategory(category: string) {
    if (this.categories.includes(category)) {
      for (var i = 0; i < this.categories.length; i++) {
        var item = this.categories[i];
        if (item === category) {
          console.log(`Removing categories ${category}`);
          this.categories.splice(i, 1);
        }
      }
    }
  }

  saveCategories() {
    this.cancelEditPanel();
    this.supplier.categories = this.categories;
    this.updateSupplier();
  }


  /** Slots */
  editSlots() {
    this.displayEditPanel = true;
    this.displayEditCategories = false;
    this.displayEditCuisines = false;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = true;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
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

  onSelectSlot(slot: string) {
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots.push(slot);
    }
  }

  saveSlots() {
    this.cancelEditPanel();
    this.supplier.slots = this.selectedSlots;
    this.updateSupplier();
  }

  /** Foods */
  editFoods() {
    this.displayEditPanel = true;
    this.displayEditFoods = true;
    this.displayEditCategories = false;
    this.displayEditCuisines = false;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
  }

  selectSpiceLevel(level: number){
    this.spice = level;
    console.log('Spice Level: '+ this.spice);
  }


  /** Settings */
  editSettings() {
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditCuisines = false;
    this.displayEditCategories = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = true;
    this.displayEditPanel = true;
    this.displayEditLocations = false;
  }

  saveSettings(){
    this.supplier.minimumOrder = this.minimumOrder;
    this.supplier.minimumPartyOrder = this.minimumPartyOrder;
    this.supplier.delivery = this.delivery;
    this.supplier.deliveryFee = this.deliveryFee;
    this.supplier.packagingFee = this.packagingFee;
    this.supplier.partyOrders = this.partyOrders;
    this.supplier.deliveryDistance = this.deliveryDistance;
    this.supplier.freeDeliveryOver = this.freeDeliveryOver;
    this.updateSupplier();
    this.cancelEditPanel();
  }
  /** Locations */

  editLocations() {
    this.displayEditPanel = true;
    this.displayEditLocations = true;
    this.displayEditCategories = false;
    this.displayEditCuisines = false;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;

  }

  addLocation() {
    var newArea: LocalArea = new LocalArea();
    newArea.name = this.newLocation;
    newArea.city = this.supplier.address.city;
    newArea.slug = this.getSlug(newArea.name, newArea.city);
    if (!this.selectedAreas.includes(newArea)) {
      this.selectedAreas.push(newArea);
    }
  }

  onRemoveArea(area: LocalArea) {
    if (this.selectedAreas.includes(area)) {
      for (var i = 0; i < this.selectedAreas.length; i++) {
        var item = this.selectedAreas[i];
        if (item.slug === area.slug) {
          console.log(`Removing area ${area.slug}`);
          this.selectedAreas.splice(i, 1);
        }
      }
    }
  }

  onSelectArea(area: LocalArea) {
    if (!this.selectedAreas.includes(area)) {
      this.selectedAreas.push(area);
    }
  }

  saveLocations() {
    this.cancelEditPanel();
    this.supplier.serviceAreas = this.selectedAreas;
    this.updateSupplier();
  }

  getSlug(name, city) {
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase() + "-" + city.trim().replace(/[\W_]+/g, "-").toLowerCase()
  }

  cancelEditPanel() {
    this.displayEditPanel = false;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditCuisines = false;
    this.displayEditCategories = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
  }

  selectOrder(order: FoodOrder){
    // this.router.navigate(['/supplier/order'], { queryParams: { ref: order.reference, chef: this.supplier._id }});
    this.displayViewOrder = true;
    this.orderInView = order;
    this.displayEditPanel = true;
    this.editAddress = false;
    this.displayEditSpecials = false;
    this.displayEditCuisines = false;
    this.displayEditCategories = false;
    this.displayEditFoods = false;
    this.displayEditFoodItem = false;
    this.displayEditSlots = false;
    this.displayEditSettings = false;
    this.displayEditLocations = false;
  }

  showOpenOrders(){
    this.showOrders();
    this.displayOpenOrders = true;
    this.displayCompletedOrders = false;
    this.displayOrderCalendar = false;
  }

  showCompletedOrders(){
    this.displayOpenOrders = false;
    this.displayCompletedOrders = true;
    this.displayOrderCalendar = false;
    this.showOrders();
  }

  showOrderCalendar(){
    this.displayOpenOrders = false;
    this.displayCompletedOrders = false;
    this.displayOrderCalendar = true;
    this.showOrders();
  }

}
