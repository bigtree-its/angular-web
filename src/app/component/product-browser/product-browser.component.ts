import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import { MenuItem } from 'src/app/model/menu-item';
import { ProductQuery } from 'src/app/model/query';
import {
  Brand,
  Category,
  Department,
  ProductModel,
} from 'src/app/model/product.model';
import { MessengerService } from 'src/app/service/messenger.service';
import { ProductService } from 'src/app/service/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-product-browser',
  templateUrl: './product-browser.component.html',
  styleUrls: ['./product-browser.component.css'],
})
export class ProductBrowserComponent implements OnInit {
  departmentName: string;

  products: ProductModel[] = [];
  productsMaster: ProductModel[] = [];

  brands: Brand[] = [];
  selectedBrands: Brand[] = [];

  categories: Category[] = [];
  subCategories: Category[] = [];
  subCategoriesMap = new Map();
  categoriesMap = new Map();
  selectedCategory: Category;
  selectedType: Category;
  allCats: Category[];

  menuItems: MenuItem[] = [];
  nodes = [{ name: 'node' }];
  options: ITreeOptions = {
    animateExpand: false,
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  department: Department;
  departmentId: any;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private messengerService: MessengerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.departmentId = params['id'];
      console.log(`Department Id: ${params['id']}`);

      this.productService.getDepartment(this.departmentId).subscribe((data)=>{
        this.department = data;
      });

      if (this.departmentId !== undefined) {
        var query = new ProductQuery();
        query.department = this.departmentId;
        this.productService
          .queryProducts(query)
          .subscribe((result: ProductModel[]) => {
            this.productsMaster = result;
            this.products = result;
            this.displayBrands();
          });
        this.productService
          .getAllCategories()
          .subscribe((result: Category[]) => {
            this.handleResponseCategories(result);
          });
      }
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

  private handleResponseCategories(result: Category[]) {
    this.categories = result;
    this.tree.treeModel.dispose;
    console.log('Building Tree from cats ' + this.categories.length);
    this.menuItems = [];
    if (this.categories !== undefined && this.categories.length > 0) {
      var cats: Category[] = this.categories.filter(c=> c.department === this.departmentId);
      console.log('Categories found for department: '+ cats.length);
      if ( cats !== undefined){
        cats.forEach((c) => {
          var menu = new MenuItem(c._id, c.name);
          this.menuItems.push(menu);
          this.createMenuTree(c, menu);
        });
        console.log('Update the tree');
        this.tree.treeModel.update();
      }
    }
  }

  /** Recursively creates Menu from Category Tree */
  private createMenuTree(category: Category, menu: MenuItem) {
    if (category.children !== undefined && category.children !== null && category.children.length > 0) {
      category.children.forEach((childCategory) => {
        console.log('Creating menu for ' + childCategory.name);
        let childMenu: MenuItem = new MenuItem(childCategory._id, childCategory.name);
        if ( menu.children === undefined){
          menu.children = [];
        }
        menu.children.push(childMenu);
        this.createMenuTree(childCategory, childMenu);
      });
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
}
