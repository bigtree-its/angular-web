import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { ProductModel } from 'src/app/model/product.model';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { MessengerService } from 'src/app/service/messenger.service';
import { BasketService } from 'src/app/service/basket.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { User } from 'src/app/model/user';
import { ReviewService } from 'src/app/service/review.service';
import { Review } from 'src/app/model/review';
import { first } from 'rxjs/operators';
import { ResponseType, ServerResponse } from 'src/app/model/server-response';

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
  submittedReview: boolean = false;
  submittedResponse: string = "";
  openReviewForm: boolean = false;
  rating: number = 0;
  reviewResponse: ServerResponse = new ServerResponse();
  errorResponse:ResponseType = ResponseType.Error;
  successResponse:ResponseType = ResponseType.Success;

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
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
    private basketService: BasketService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      question: ['']
    });

    this.reviewForm = this.formBuilder.group({
      headline: [''],
      content: ['']
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
      this.reviewService.getReviews(productId).subscribe((reviews: Review[]) => {
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
    if (this.quantity > 1) {
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
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  writeReview(){
    this.openReviewForm = true;
    this.submittedReview = false;
    this.rating = 0;
    this.reviewFormControls.headline.setValue("");
    this.reviewFormControls.content.setValue("");
  }

  cancelReview(){
    this.openReviewForm = false;
    this.submittedReview = false;
    this.rating = 0;
    this.reviewFormControls.headline.setValue("");
    this.reviewFormControls.content.setValue("");
  }

  overallRating(star: number){
    this.rating = star;
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

  // convenience getter for easy access to form fields
  get reviewFormControls() { return this.reviewForm.controls; }

  onSubmitReview() {
    
    // stop here if form is invalid
    if (this.reviewForm.invalid) {
      return;
    }
    window.alert('Headline: '+ this.reviewFormControls.headline.value)
    if ( this.reviewFormControls.headline.value === undefined || this.reviewFormControls.headline.value === null || this.reviewFormControls.headline.value === ""){
      return;
    }
    this.submittedReview = true;
    var review: Review = new Review();
    review.headline = this.reviewFormControls.headline.value;
    review.content = this.reviewFormControls.content.value;
    review.rating = this.rating;
    review.date = new Date();
    review.product = this.product._id;
    review.userEmail = this.accountService.userValue.email;
    review.userName = this.accountService.userValue.firstName + this.accountService.userValue.lastName;
    this.reviewService
    .createReview(review)
    .pipe(first())
    .subscribe(
      (data) => {
        this.reviewResponse.message = "We are processing your review. This may take several days, so we appreciate your patience. We will notify you when this is complete.";
        this.reviewResponse.type = ResponseType.Success;
        this.openReviewForm = false;
      },
      (error) => {
        this.reviewResponse.message = error;
        this.reviewResponse.type = ResponseType.Error;
      }
    );
  }
  setMainPicture(url: String){
    this.mainPicture = url;
  }

}
