import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import {
  ProductModel,
  Category,
  Brand,
  Department,
} from 'src/app/model/product.model';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import * as _ from 'underscore';
import { MenuItem } from 'src/app/model/menu-item';
import { MessengerService } from 'src/app/service/messenger.service';
import { BasketService } from 'src/app/service/basket.service';
import { Router } from '@angular/router';
import { CategoryQuery } from 'src/app/model/query';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: ProductModel[] = [];
  productsMaster: ProductModel[] = [];
  categories: Category[] = [];
  subCategories: Category[] = [];
  subCategoriesMap = new Map();
  categoriesMap = new Map();
  brands: Brand[] = [];
  selectedBrands: Brand[] = [];
  selectedCategory: Category;
  orderL2H: boolean = false;
  orderH2L: boolean = false;
  selectedType: Category;

  menuItems: MenuItem[] = [];
  nodes = [{ name: 'node' }];
  options: ITreeOptions = {
    animateExpand: false,
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  allCats: Category[];
  department: Department;
  departments: Department[];
  featuredProducts: ProductModel[];
  featuredProduct: ProductModel;

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    public messengerService: MessengerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService
      .getFeaturedProduct()
      .subscribe((result: ProductModel[]) => {
        this.featuredProducts = result;
        if (
          this.featuredProducts === null ||
          this.featuredProducts === undefined ||
          this.featuredProducts.length == 0
        ) {
          this.featuredProduct = null;
        } else {
          this.featuredProduct = result[0];
        }
      });
    this.productService.getAllProducts().subscribe((result: ProductModel[]) => {
      this.productsMaster = result;
      this.products = result;
    });

    this.productService.getAllDepartments();
    this.productService.getAllCategories();
    this.selectedBrands = [];
    this.messengerService.departments$.subscribe((d) => {
      this.departments = d;
    });
  }

  selectProduct() {
    this.router.navigate(['/product', this.featuredProduct._id]).then();
  }

  getSubCategories(): void {
    this.categories.forEach((c) => {
      this.productService
        .getSubCategories(c)
        .subscribe((result: Category[]) => {
          this.subCategoriesMap.set(c._id, result);
          var menu: MenuItem = this.menuItems.find((m) => m.id == c._id);
          if (menu !== undefined) {
            var children: MenuItem[] = [];
            result.forEach((c) => {
              children.push({ id: c._id, name: c.name });
            });
            menu.children = children;
            this.tree.treeModel.update();
          }
        });
    });
  }

  getFraction(): string {
    if (this.featuredProduct === null || this.featuredProduct === undefined) {
      return '00';
    }
    var salePrice = String(this.featuredProduct.salePrice);
    var fraction: string = salePrice.split('.')[1];
    if (fraction === undefined) {
      fraction = '00';
    } else if (fraction.length === 1) {
      fraction = fraction + '0';
    }
    return fraction;
  }

  getAmount(): string {
    if (this.featuredProduct === null || this.featuredProduct === undefined) {
      return '00';
    }
    var salePrice = String(this.featuredProduct.salePrice);
    var amount: string = salePrice.split('.')[0];
    if (amount === undefined) {
      amount = '0';
    }
    return amount;
  }

  selectDepartment(d: Department) {
    this.department = d;
    this.router.navigate(['/category-browser', this.department._id]).then();
  }

  getFeaturedProductName() {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '';
    }
    return this.featuredProduct.name;
  }

  getFeaturedProductDescription() {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '';
    }
    return this.featuredProduct.description;
  }

  getFeaturedProductPicture(): String {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '/assets/icons/featured-product.png';
    }
    return this.featuredProduct.picture.thumbnail;
  }

  lowToHigh() {
    this.products = this.products.sort((p1: ProductModel, p2: ProductModel) => {
      return p1.salePrice - p2.salePrice;
    });
    this.orderL2H = true;
    this.orderH2L = false;
  }

  highToLow() {
    this.products = this.products.sort((p1: ProductModel, p2: ProductModel) => {
      return p2.salePrice - p1.salePrice;
    });
    this.orderL2H = false;
    this.orderH2L = true;
  }

  addToCart() {
    this.basketService.addItemToBasket(this.featuredProduct);
  }
}
