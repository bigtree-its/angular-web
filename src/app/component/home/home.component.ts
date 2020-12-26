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
      this.displayBrands();
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
  getSubCategory(c: Category): void {
    this.productService.getSubCategories(c).subscribe((result: Category[]) => {
      this.subCategoriesMap.set(c._id, result);
      this.selectCategory(c._id);
    });
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
    // let catsByD: Category[] = this.messengerService.getCatsByDepartment(d._id);
    // if (catsByD === undefined || catsByD.length === 0) {
    //   this.productService
    //     .getCategoriesByDepartment(d._id)
    //     .subscribe((result: Category[]) => {
    //       this.handleResponseCategories(result);
    //     });
    // } else {
    //   this.handleResponseCategories(catsByD);
    // }
    this.router.navigate(['/category-browser', this.department._id]).then();
  }

  private handleResponseCategories(result: Category[]) {
    this.categories = result;
    this.menuItems = [];
    this.categories.forEach((c) => {
      let subs: Category[] = this.messengerService.getChildCats(c._id);
      let subsMenu: MenuItem[] = [];
      if (subs !== undefined && subs.length > 0) {
        subs.forEach((sc) => {
          let bSubs: Category[] = this.messengerService.getCatsByParent(sc._id);
          if (bSubs !== undefined && bSubs.length > 0) {
            let bSubsMenu: MenuItem[] = [];
            subs.forEach((bsc) => {
              let subItem: MenuItem = new MenuItem(bsc._id, bsc.name);
              bSubsMenu.push(subItem);
            });
            subsMenu.push(new MenuItem(sc._id, sc.name, bSubsMenu));
          } else {
            subsMenu.push(new MenuItem(sc._id, sc.name));
          }
        });
        this.menuItems.push(new MenuItem(c._id, c.name, subsMenu));
      } else {
        this.menuItems.push(new MenuItem(c._id, c.name));
      }
      this.tree.treeModel.update();
    });
  }

  onEvent = ($event) => this.selectCategory($event.node.id);

  selectCategory(id: string) {
    this.selectedType = undefined;
    this.selectedCategory = this.categories.find((c) => c._id === id);
    let sub: Category[] = this.subCategoriesMap.get(id);
    this.subCategories = sub;
    this.filterProductsByCat(id, true);
  }

  selectType(id: string) {
    this.selectedType = this.categories.find((c) => c._id === id);
    this.filterProductsByType(id, true);
  }

  filterProductsByType(id: string, displayBrands: boolean) {
    var tempList: ProductModel[] = [];
    this.productsMaster
      .filter((p) => p.type === id)
      .forEach((item) => tempList.push(item));
    this.products = tempList;
    if (displayBrands) {
      this.displayBrands();
    }
  }

  selectBrand(id: String, e: any) {
    console.log('Selected category: ' + JSON.stringify(this.selectedCategory));
    let b: Brand = this.brands.find((b) => b._id === id);

    if (e.target.checked) {
      this.selectedBrands.push(b);
    } else {
      for (var i = 0; i < this.selectedBrands.length; i++) {
        if (this.selectedBrands[i]._id === id) {
          this.selectedBrands.splice(i, 1);
        }
      }
    }
    console.log('Chosen Brands: ' + JSON.stringify(this.selectedBrands));
    if (this.selectedBrands.length > 0) {
      var uniqueBrandIds: string[] = _.map(
        _.indexBy(this.selectedBrands, '_id'),
        function (obj, key) {
          return key;
        }
      );
      var tempList: ProductModel[] = [];
      if (this.selectedCategory !== undefined) {
        this.filterProductsByCat(this.selectedCategory._id, false);
      }
      this.products.forEach((p) => {
        if (uniqueBrandIds.indexOf(p.brand._id) !== -1) {
          tempList.push(p);
        }
      });
      this.products = tempList;
    } else {
      if (this.selectedType !== undefined) {
        this.selectType(this.selectedType._id);
      } else if (this.selectedCategory !== undefined) {
        this.filterProductsByCat(this.selectedCategory._id, true);
      } else {
        this.displayAllCategory();
      }
    }
  }

  displayAllCategory() {
    this.products = this.productsMaster;
  }

  filterProductsByCat(id: string, changeBrands: boolean) {
    var tempList: ProductModel[] = [];
    this.productsMaster
      .filter((p) => p.categories.some((c) => c._id == id))
      .forEach((item) => tempList.push(item));
    this.products = tempList;
    if (changeBrands) {
      this.displayBrands();
    }
  }

  displayBrands() {
    this.brands = [];
    this.products.forEach((p) => {
      if (p.brand !== undefined && p.brand !== null) {
        this.brands.push(p.brand);
      }
    });
    //it's a map, all keys are unique.
    //Then I'm just mapping this list back to array
    //What happens here is that indexBy returns a map like this
    //{ 1:{_id:1,name:'one'}, 2:{_id:2,name:'two'} }
    this.brands = _.map(_.indexBy(this.brands, '_id'), function (obj, key) {
      return obj;
    });
    let uniqBrands = _.map(_.indexBy(this.brands, '_id'), function (obj, key) {
      return obj.name;
    });
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
