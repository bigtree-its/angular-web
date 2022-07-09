import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, Food, FoodOrder, FoodOrderItem, LocalChef } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import { NavigationService } from 'src/app/service/navigation.service';
import * as _ from 'underscore';


@Component({
  selector: 'app-chef-home',
  templateUrl: './chef-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chef-home.component.css']
})
export class ChefHomeComponent implements OnInit {

  localChef: LocalChef;
  display_picture: string;
  selectedCategory: string;
  gallery: string[] = [];
  starSelected: string = "/assets/icons/star-selected.png";
  star: string = "/assets/icons/star.png";
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  foods: Food[] = [];
  foods_to_display: Food[];
  categoriesMap = new Map();
  categories: string[];
  foodOrder: FoodOrder;
  calendars: Calendar[];
  selectedMenu: string;

  constructor(private activatedRoute: ActivatedRoute,
    private localChefService: LocalChefService,
    private foodOrderService: FoodOrderservice,
    private navigationService: NavigationService,
    private _location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const chefId = params['id'];
      console.log(`Chef Id: ${params['id']}`);
      this.localChefService.getLocalChef(chefId).subscribe((localChef: LocalChef) => {
        this.localChef = localChef;
        this.display_picture = this.localChef.coverPhoto;
        this.gallery.push(this.localChef.coverPhoto);
        this.localChef.gallery.forEach(p => {
          this.gallery.push(p);
        });
        localStorage.setItem("LOCAL-CHEF", JSON.stringify(this.localChef));
        this.fetchFoods(chefId);
        this.fetchCalendars(chefId);
      });
    });

    this.foodOrderService.foodOrderRx$.subscribe(foodOrder => {
      this.foodOrder = foodOrder;
    });

    this.selectedMenu = "allTime";
  }

  private fetchCalendars(chefId: string) {
    this.localChefService.getCalendars(chefId, true, false).subscribe((calendars: Calendar[]) => {
      this.calendars = calendars;
    });
  }

  private fetchFoods(chefId: string) {
    this.localChefService.getAllFoods(chefId).subscribe((foods: Food[]) => {
      this.foods = foods;
      var category = this.localChef.categories[0];
      this.filterFoodsByCat(category);
    });
  }

  filterFoodsByCat(category: string) {
    this.selectedCategory = category;
    this.foods_to_display = [];
    this.foods
      .filter((f) => f.category === category)
      .forEach((item) => this.foods_to_display.push(item));

  }

  increaseQuantity(item: FoodOrderItem) {
    if (item.quantity < 10) {
      item.quantity = item.quantity + 1;
      item.subTotal = (item.subTotal) * item.quantity;
      item.subTotal = +(+item.subTotal).toFixed(2);
    }
  }

  decreaseQuantity(item: FoodOrderItem) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
      item.subTotal = (item.subTotal) * item.quantity;
      item.subTotal = +(+item.subTotal).toFixed(2);
    }
  }
  deleteItem(item: FoodOrderItem) {
    this.foodOrderService.removeItem(item);
  }

  confirmOrder() {
    this.router.navigate(['/checkout'], { queryParams: { s: this.localChef._id }});
  }

  backToResults() {
    this._location.back();
  }

  displayPicture(url: string) {
    this.display_picture = url;
  }

  onSelectCategory(event, category: string) {
    this.filterFoodsByCat(category);
    this.selectedCategory = category;
    // // event.target.style = "border-right: 3px solid #766df4;color: #766df4;text-align: right;";
    // this.categoriesMap.set(category, event.target);
    // this.categoriesMap.forEach((key: string, value: any) => {
    //   if (key !== category) {
    //     value.style = "font-weight: 900;border-right: 3px solid #fff;display: block; margin-bottom: 2px;padding-right: 10px;text-align: right;";
    //   }
    // });
  }

  

  getAddress(): string {
    var address: string = ""

    if (this.localChef.address.addressLine1 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.addressLine1;
    }
    if (this.localChef.address.addressLine2 !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.addressLine2;
    }
    if (this.localChef.address.city !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.city;
    }
    if (this.localChef.address.postcode !== undefined) {
      if (address.length > 0) {
        address = address + ", ";
      }
      address = address + this.localChef.address.postcode;
    }
    return address;
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;

  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }

  back(){
    this.navigationService.back();
  }

  isSelectedCategory(category: string){
    if ( this.selectedCategory === category){
      return true;
    }
    return false;
  }


  isSelected(menuType: string){
    if ( this.selectedMenu === menuType){
      return true;
    }
    return false;
  }

  select(menuType: string){
    this.selectedMenu = menuType;
  }
}
