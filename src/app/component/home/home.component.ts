import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { Carousel, Collection, ProductModel } from 'src/app/model/product.model';
import * as _ from 'underscore';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { BasketService } from 'src/app/service/basket.service';
import { Router } from '@angular/router';
import { ProductQuery } from 'src/app/model/query';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  products: ProductModel[] = [];
  productsMaster: ProductModel[] = [];
  featuredProducts: ProductModel[];
  featuredProduct: ProductModel;
  bestSeller: ProductModel[];
  bestSellerProduct: any;
  carousels: Carousel[];
  activeCarousel: Carousel;
  collections: Collection[];

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    public LocalContextService: LocalContextService,
    private router: Router
  ) { }

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
          this.setAmountAndFraction(this.featuredProduct);
        }
      });


    var bestSellerQuery = new ProductQuery();
    bestSellerQuery.bestSeller = true;
    this.queryProducts(bestSellerQuery);

    var featuredProductQuery = new ProductQuery();
    featuredProductQuery.featured = true;
    this.queryProducts(featuredProductQuery);

    this.productService.getAllProducts().subscribe((result: ProductModel[]) => {
      this.productsMaster = result;
      this.products = result;
      if (
        this.products !== null &&
        this.products !== undefined &&
        this.products.length > 0
      ) {
        this.products.forEach((p) => { this.setAmountAndFraction(p); });
      }
    });

    this.productService.getCarousels().subscribe((result: Carousel[]) => {
      this.carousels = result;
      if (
        this.carousels !== null &&
        this.carousels !== undefined &&
        this.carousels.length > 0
      ) {
        this.carousels.forEach((p) => {
          if (p.active) {
            this.activeCarousel = p;
          }
        });
      }
    });

    this.productService.getCollections().subscribe((result: Collection[]) => {
      this.collections = result;
    });

  }

  private queryProducts(query: ProductQuery) {
    this.productService
      .queryProducts(query)
      .subscribe((result: ProductModel[]) => {
        this.bestSeller = result;
        if (this.bestSeller === null ||
          this.bestSeller === undefined ||
          this.bestSeller.length == 0) {
          this.bestSellerProduct = null;
        } else {
          this.bestSellerProduct = result[0];
          this.setAmountAndFraction(this.bestSellerProduct);
        }
      });
  }

  selectProduct(p: ProductModel) {
    this.router.navigate(['/product', p._id]).then();
  }

  selectProductId(productId: string) {
    console.log('Selecting product: ' + productId);
    this.router.navigate(['/product', productId]).then();
  }

  private setAmountAndFraction(product: ProductModel) {
    if (product !== null && product !== undefined) {
      var price = String(product.salePrice);
      var amount: string = price.split('.')[0];
      if (amount === undefined) {
        amount = '0';
      }
      var fraction: string = price.split('.')[1];
      if (fraction === undefined) {
        fraction = '00';
      } else if (fraction.length === 1) {
        fraction = fraction + '0';
      }
      product.amount = amount;
      product.fraction = fraction;
    }
  }


  private getFeaturedProductName() {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '';
    }
    return this.featuredProduct.name;
  }

  private getFeaturedProductDescription() {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '';
    }
    return this.featuredProduct.description;
  }

  private getFeaturedProductPicture(): String {
    if (this.featuredProduct === undefined || this.featuredProduct === null) {
      return '/assets/icons/featured-product.png';
    }
    return this.featuredProduct.picture.thumbnail;
  }

  addToCart(p: ProductModel) {
    this.basketService.addItemToBasket(p, 1);
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
}
