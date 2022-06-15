import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/helpers/utils';
import { User, UserSession } from 'src/app/model/common-models';
import { Calendar, Cuisine, Food, FoodOrder, LocalArea, LocalChef, LocalChefSearchQuery, SupplierSummary } from 'src/app/model/localchef';
import { AccountService } from 'src/app/service/account.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.css']
})
export class SupplierProfileComponent implements OnInit {
  userSession: UserSession;
  user: User;
  supplier: LocalChef;

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
  foods: Food[];
  calendars: Calendar[] = [];
  showItemEditPanel: boolean;
  foodEditPanelTitle: string;
  selectedCategoryForDisplay: string;
  allDays: boolean;
  thisMonth: boolean;
  thisWeek: boolean;
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
  selectedAreaList: LocalArea[] = [];
  selectedCuisines: Cuisine[] = [];
  categories: string[] = [];
  selectedSlots: string[] = [];
  selectedServiceModes: string[] = [];
  deliveryMinimum: number;
  freeDeliveryOver: number;
  deliveryCharge: number;
  deliveryDistance: number;
  minimumOrder: number;

  constructor(private supplierService: LocalChefService,
    private accountService: AccountService,
    private utils: Utils,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {


    this.accountService.userSessionSubject$.subscribe(userSession => {
      this.userSession = userSession;
      console.log('UserSession : ' + JSON.stringify(this.userSession));
      if (userSession !== null && userSession.user !== null && userSession.user !== undefined) {
        this.user = this.userSession.user;
        var query: LocalChefSearchQuery = new LocalChefSearchQuery();
        query.email = this.user.email;
        this.supplierService.getAllLocalChefs(query).subscribe(supplier => {
          this.supplier = supplier[0];
          console.log('The supplier: ' + JSON.stringify(this.supplier));
          if (this.supplier.address !== null && this.supplier.address !== undefined) {
            this.addressLine1 = this.supplier.address.addressLine1;
            this.addressLine2 = this.supplier.address.addressLine2;
            this.city = this.supplier.address.city;
            this.postcode = this.supplier.address.postcode;
          }
          if (this.supplier.contact !== null && this.supplier.contact !== undefined) {
            this.mobile = this.supplier.contact.mobile;
            this.email = this.supplier.contact.email;
            this.fullName = this.supplier.contact.fullName;
            this.telephone = this.supplier.contact.telephone;
          }
          if (this.supplier.serviceAreas === null || this.supplier.serviceAreas === undefined || this.supplier.serviceAreas.length === 0) {
            this.supplier.serviceAreas = this.selectedAreaList;
          } else {
            this.selectedAreaList = this.supplier.serviceAreas;
          }
          if (this.supplier.cuisines === null || this.supplier.cuisines === undefined || this.supplier.cuisines.length === 0) {
            this.supplier.cuisines = this.selectedCuisines;
          } else {
            this.selectedCuisines = this.supplier.cuisines;
          }
          if (this.supplier.specials === null || this.supplier.specials === undefined || this.supplier.specials.length === 0) {
            this.supplier.specials = [];
          }
          if (this.supplier.categories === null || this.supplier.categories === undefined || this.supplier.categories.length === 0) {
            this.supplier.categories = this.categories;
          } else {
            this.categories = this.supplier.categories;
          }
          if (this.supplier.slots === null || this.supplier.slots === undefined || this.supplier.slots.length === 0) {
            this.supplier.slots = this.selectedSlots;
          } else {
            this.selectedSlots = this.supplier.slots;
          }
          if (this.supplier.delivery) {
            this.selectedServiceModes.push("Delivery");
          }
          this.deliveryMinimum = this.supplier.deliveryMinimum;
          this.freeDeliveryOver = this.supplier.freeDeliveryOver;
          this.deliveryCharge = this.supplier.deliveryFee;
          this.deliveryDistance = this.supplier.deliveryDistance;
          this.minimumOrder = this.supplier.minimumOrder;
          this.fetchCalendars();
          this.fetchFoods();
          this.getOrders();
        }, err => { });
      } else {
      }
    })

  }

  private getOrders() {
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
        
        console.log('Fetched supplier summary : '+ JSON.stringify(data));
      }
    }, err => {
      console.log('Error while fetching orders for supplier '+ err);
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
        console.log('Foods for Chef: ' + JSON.stringify(this.foods));
      }
    }, err => { });
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
    console.log('Calendars for Chef: ' + JSON.stringify(this.calendars));
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
    food._uid = Date.now();

    this.supplierService.createNewFood(food).subscribe((food: Food) => {
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

    this.supplierService.updateFood(this.foodOnEdit).subscribe((food: Food) => {
      console.log("Food Updated. " + JSON.stringify(food));
      this.fetchFoods();
      this.cancelItemEdit();
    }, err => { });
  }

  onRemoveFood(foodToDelete: Food) {
    console.log('Removing food ' + JSON.stringify(foodToDelete));
    this.supplierService.deleteFood(foodToDelete).subscribe(any => {
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
  }

  showMenus() {
    this.displayOrders = false;
    this.displayMenus = true;
  }

}
