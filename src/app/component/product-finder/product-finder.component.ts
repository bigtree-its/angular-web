import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand, ProductModel } from 'src/app/model/product.model';
import { ProductQuery } from 'src/app/model/query';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { ProductService } from 'src/app/service/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-product-finder',
  templateUrl: './product-finder.component.html',
  styleUrls: ['./product-finder.component.css']
})
export class ProductFinderComponent implements OnInit {

  keyword: string;
  productsMaster: ProductModel[];
  products: ProductModel[];
  brands: Brand[] = [];
  selectedBrands: Brand[] = [];
  orderL2H: boolean = false;
  orderH2L: boolean = false;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private LocalContextService: LocalContextService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.keyword = params['keyword'];
      console.log(`Finding Products with keyword: ${params['keyword']}`);

      if (this.keyword !== undefined) {
        var query = new ProductQuery();
        query.keyword = this.keyword;
        this.productService
          .queryProducts(query)
          .subscribe((result: ProductModel[]) => {
            this.productsMaster = result;
            this.products = result;
            this.displayBrands();
          });
      }
    });
    this.selectedBrands = [];
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


  selectBrand(id: String, e: any) {
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
      this.products.forEach((p) => {
        if (uniqueBrandIds.indexOf(p.brand._id) !== -1) {
          tempList.push(p);
        }
      });
      this.products = tempList;
    } else {
      this.displayAll();
    }
  }

  displayAll() {
    this.products = this.productsMaster;
  }

  handleChange(evt, val: string) {
    var target = evt.target;
    if (target.checked) {
      if (val == "low") {
        this.lowToHigh();
      } else if (val == "high") {
        this.highToLow();
      }
    }
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

}
