import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { ProductModel, Category, Brand, Department } from 'src/app/model/product.model';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import * as _ from 'underscore';
import { MenuItem } from 'src/app/model/menu-item';
import { MessengerService } from 'src/app/service/messenger.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModel[] = []
  productsMaster: ProductModel[] = []
  categories: Category[] = [];
  subCategories: Category[] = [];
  subCategoriesMap = new Map;
  categoriesMap = new Map;
  brands: Brand[] = []
  selectedBrands: Brand[] = []
  selectedCategory: Category;
  orderL2H: boolean = false;
  orderH2L: boolean = false;
  selectedType: Category;

  menuItems: MenuItem[] = [];
  nodes = [{ name: 'node' }];
  options: ITreeOptions = {
    animateExpand: false
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  allCats: Category[];
  department: Department;
  departments: Department[];

  constructor(
    private productService: ProductService,
    public messengerService: MessengerService) {
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((result: ProductModel[]) => {
      this.productsMaster = result;
      this.products = result;
      this.displayBrands();
    });

    this.productService.getAllDepartments();
    this.productService.getAllCategories();
    this.selectedBrands = [];
    this.messengerService.departments$.subscribe(d => {
      this.departments = d;
    });
  }


  getSubCategory(c: Category): void {
    this.productService.getSubCategories(c).subscribe((result: Category[]) => {
      this.subCategoriesMap.set(c._id, result);
      this.selectCategory(c._id);
    });
  }

  getSubCategories(): void {
    this.categories.forEach(c => {
      this.productService.getSubCategories(c).subscribe((result: Category[]) => {
        this.subCategoriesMap.set(c._id, result);
        var menu: MenuItem = this.menuItems.find(m => m.id == c._id);
        if (menu !== undefined) {
          var children: MenuItem[] = [];
          result.forEach(c => {
            children.push({ id: c._id, name: c.name });
          })
          menu.children = children;
          this.tree.treeModel.update();
        }
      });
    });
  }

  selectDepartment(d: Department) {
    this.department = d;
    let catsByD: Category[] = this.messengerService.getCatsByDepartment(d._id);
    if (catsByD === undefined || catsByD.length === 0) {
      this.productService.getCategoriesByDepartment(d._id).subscribe((result: Category[]) => {
        this.handleResponseCategories(result);
      });
    } else {
      this.handleResponseCategories(catsByD);
    }
  }

  private handleResponseCategories(result: Category[]) {
    this.categories = result;   
    this.menuItems = [];
    this.categories.forEach(c => {
      let subs: Category[] = this.messengerService.getChildCats(c._id);
      let subsMenu: MenuItem[] = [];
      if (subs !== undefined && subs.length > 0) {
        subs.forEach(sc => {
          let bSubs: Category[] = this.messengerService.getCatsByParent(sc._id);
          if (bSubs !== undefined && bSubs.length > 0) {
            let bSubsMenu: MenuItem[] = [];
            subs.forEach(bsc => {
              let subItem: MenuItem = new MenuItem(bsc._id, bsc.name);
              bSubsMenu.push(subItem);
            });
            subsMenu.push(new MenuItem(sc._id, sc.name, bSubsMenu));
          } else{
            subsMenu.push(new MenuItem(sc._id, sc.name));
          }
        });
        this.menuItems.push(new MenuItem(c._id, c.name, subsMenu));
      }else{
        this.menuItems.push(new MenuItem(c._id, c.name));
      }
      this.tree.treeModel.update();
    });
    
  } 

  onEvent = ($event) => this.selectCategory($event.node.id);

  selectCategory(id: string) {
    this.selectedType = undefined;
    this.selectedCategory = this.categories.find(c => c._id === id);
    let sub: Category[] = this.subCategoriesMap.get(id);
    this.subCategories = sub;
    this.filterProductsByCat(id, true);
  }

  selectType(id: string) {
    this.selectedType = this.categories.find(c => c._id === id);
    this.filterProductsByType(id, true);
  }

  filterProductsByType(id: string, displayBrands: boolean) {
    var tempList: ProductModel[] = [];
    this.productsMaster
      .filter(p =>
        p.type === id).forEach(item => tempList.push(item));
    this.products = tempList;
    if (displayBrands) {
      this.displayBrands();
    }
  }

  selectBrand(id: String, e: any) {
    console.log('Selected category: ' + JSON.stringify(this.selectedCategory))
    let b: Brand = this.brands.find(b => b._id === id);

    if (e.target.checked) {
      this.selectedBrands.push(b);
    } else {
      for (var i = 0; i < this.selectedBrands.length; i++) {
        if (this.selectedBrands[i]._id === id) {
          this.selectedBrands.splice(i, 1);
        }
      }
    }
    console.log('Chosen Brands: ' + JSON.stringify(this.selectedBrands))
    if (this.selectedBrands.length > 0) {
      var uniqueBrandIds: string[] = _.map(_.indexBy(this.selectedBrands, '_id'), function (obj, key) { return key });
      var tempList: ProductModel[] = [];
      if (this.selectedCategory !== undefined) {
        this.filterProductsByCat(this.selectedCategory._id, false);
      }
      this.products.forEach(p => {
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
      .filter(p =>
        p.categories
          .some(c => c._id == id)
      ).forEach(item => tempList.push(item));
    this.products = tempList;
    if (changeBrands) {
      this.displayBrands();
    }
  }

  displayBrands() {
    this.brands = [];
    this.products.forEach(p => {
      this.brands.push(p.brand);
    })
    //it's a map, all keys are unique.
    //Then I'm just mapping this list back to array
    //What happens here is that indexBy returns a map like this
    //{ 1:{_id:1,name:'one'}, 2:{_id:2,name:'two'} }
    this.brands = _.map(_.indexBy(this.brands, '_id'), function (obj, key) { return obj });
    let uniqBrands = _.map(_.indexBy(this.brands, '_id'), function (obj, key) { return obj.name });
    console.log('Brands to choose: ' + uniqBrands);
  }

  lowToHigh() {
    this.products = this.products.sort((p1: ProductModel, p2: ProductModel) => {
      return p1.salePrice - p2.salePrice;
    })
    this.orderL2H = true;
    this.orderH2L = false;
  }

  highToLow() {
    this.products = this.products.sort((p1: ProductModel, p2: ProductModel) => {
      return p2.salePrice - p1.salePrice;
    })
    this.orderL2H = false;
    this.orderH2L = true;
  }

}
