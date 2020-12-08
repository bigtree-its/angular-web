import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { ProductModel } from 'src/app/model/product.model';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { MessengerService } from 'src/app/service/messenger.service';
import Swiper from 'swiper';
import { BasketService } from 'src/app/service/basket.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;

  product: ProductModel = undefined;
  quantity: number = 1;
  mainPicture: String;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private messengerService: MessengerService,
    private basketService: BasketService,
    private _location: Location
  ) { }

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity = this.quantity + 1;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity = this.quantity - 1;
    }
  }

  addToCart() {
    if (this.product.stock < 1) {
      return;
    }
    if (this.quantity === 0) {
      return;
    }
    this.basketService.addItemToBasket(this.product);
  }

  getFraction(): string {
    var salePrice = String(this.product.salePrice);
    var fraction: string = salePrice.split('.')[1];
    console.log('The fraction: ' + fraction);
    if (fraction === undefined) {
      fraction = '00';
    } else if (fraction.length === 1) {
      fraction = fraction + '0';
    }
    return fraction;
  }

  getAmount(): string {
    var salePrice = String(this.product.salePrice);
    var amount: string = salePrice.split('.')[0];
    console.log('The amount: ' + amount);
    if (amount === undefined) {
      amount = '00';
    }
    return amount;
  }

  backToResults() {
    this._location.back();
  }

  ngOnInit(): void {
    var slider = this.initSwiper();

    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'];
      console.log(`Product Id: ${params['id']}`);
      this.productService.getSingleProduct(productId).subscribe((product: ProductModel) => {
        this.product = product;
        this.mainPicture = this.product.picture.thumbnail;
        this.product.picture.additional.forEach(element => {
          slider.appendSlide([
            '<div class="swiper-slide">  <img src="' + element + '" alt="" class="product-details-image"> </div>'
          ]);
        });
      });
    })
  }

  setMainPicture(url: String){
    this.mainPicture = url;
  }


  private initSwiper() {
    return new Swiper('.swiper-container', {
      // spaceBetween: 30,
      // centeredSlides: true,
      effect: 'flip',
      grabCursor: true,
      // coverflowEffect: {
      //   rotate: 50,
      //   stretch: 0,
      //   depth: 100,
      //   modifier: 1,
      //   slideShadows: true,
      // },
      // cubeEffect: {
      //   shadow: true,
      //   slideShadows: true,
      //   shadowOffset: 20,
      //   shadowScale: 0.94,
      // },
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
