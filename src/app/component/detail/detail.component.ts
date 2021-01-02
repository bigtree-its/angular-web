import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { ProductModel, Review } from 'src/app/model/product.model';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { MessengerService } from 'src/app/service/messenger.service';
import { BasketService } from 'src/app/service/basket.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  /** Questions */
  form: FormGroup;
  loading = false;
  submitted = false;

  /** Review Form */
  reviewForm: FormGroup;
  submittedReview: boolean;


  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;

  product: ProductModel = undefined;
  quantity: number = 1;
  mainPicture: String;
  reviews: Review[];
  user: User = new User();

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private basketService: BasketService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      question: ['', Validators.required]
    });

    this.reviewForm = this.formBuilder.group({
      headline: [''],
      content: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'];
      console.log(`Product Id: ${params['id']}`);
      this.productService.getSingleProduct(productId).subscribe((product: ProductModel) => {
        this.product = product;
        this.product.amount = this.getAmount();
        this.product.fraction = this.getFraction();
        this.mainPicture = this.product.picture.thumbnail;
      });
      this.productService.getReviews(productId).subscribe((reviews: Review[]) => {
        this.reviews = reviews;
      });
    })

    this.user = this.accountService.userValue;
    console.log('User on detail page: '+ this.user)
  }

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
    var amount = salePrice.split('.')[0];
    console.log('The amount: ' + amount);
    if (amount === undefined) {
      amount = '00';
    }
    return amount;
  }

  backToResults() {
    this._location.back();
  }

  

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    console.log('Question: '+ this.f.question.value);
    // console.log('Question Email: '+ this.f.email.value);

    this.loading = true;
    
  }

  onSubmitReview() {
    this.submittedReview = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    console.log('Question: '+ this.f.question.value);
    // console.log('Question Email: '+ this.f.email.value);

    this.loading = true;
    
  }
  setMainPicture(url: String){
    this.mainPicture = url;
  }

}
