import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { ProductModel } from 'src/app/model/product.model';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { BasketService } from 'src/app/service/basket.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { ReviewService } from 'src/app/service/review.service';
import { Review } from 'src/app/model/review';
import { first } from 'rxjs/operators';
import { ResponseType, ServerResponse } from 'src/app/model/server-response';
import { ProductQAService } from 'src/app/service/product-qa.service';
import { Customer, CustomerSession, ProductQA, ProductQuestion } from 'src/app/model/common-models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  starSelected: string = "/assets/icons/star-selected.png";
  star: string = "/assets/icons/star.png";

  /** Questions */
  questionForm: FormGroup;
  questionSubmissionLoding = false;
  submittedQuestion = false;

  /** Review Form */
  reviewForm: FormGroup;
  submittedReview: boolean = false;
  submittedResponse: string = "";
  openReviewForm: boolean = false;
  reviewSubmissionLoding = false;
  rating: number = 0;
  reviewResponse: ServerResponse = new ServerResponse();
  errorResponse:ResponseType = ResponseType.Error;
  successResponse:ResponseType = ResponseType.Success;

  postQuestionResponse: ServerResponse = new ServerResponse();
  postQuestionErrorResponse:ResponseType = ResponseType.Error;
  postQuestionSuccessResponse:ResponseType = ResponseType.Success;

  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;

  product: ProductModel = undefined;
  quantity: number = 1;
  mainPicture: String;
  reviews: Review[];
  customer: Customer = new Customer();
  customerSession: CustomerSession;
  qa: ProductQA;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private accountService: AccountService,
    private localContextService: LocalContextService,
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
    private basketService: BasketService,
    private productQAService: ProductQAService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      question: ['']
    });

    this.reviewForm = this.formBuilder.group({
      headline: [''],
      content: ['']
    });

    this.activatedRoute.params.subscribe(params => {
      const entityId = params['id'];
      console.log(`Product Id: ${params['id']}`);
      this.productService.getSingleProduct(entityId).subscribe((product: ProductModel) => {
        this.product = product;
        this.product.amount = this.getAmount();
        this.product.fraction = this.getFraction();
        this.mainPicture = this.product.picture.thumbnail;
      });
      this.reviewService.getReviews(entityId).subscribe((reviews: Review[]) => {
        this.reviews = reviews;
      });
      this.productQAService.getQA(entityId).subscribe((qa: ProductQA) => {
        console.log('QA: '+ JSON.stringify(qa));
        this.qa = qa;
      });
    })

    this.customerSession = this.accountService.getCustomerSession();
    if ( this.customerSession !== null && this.customerSession !== undefined){
      this.customer = this.customerSession.customer;
    }

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
  get getQuestionForm() { return this.questionForm.controls; }


  // convenience getter for easy access to form fields
  get reviewFormControls() { return this.reviewForm.controls; }

  onSubmitReview() {
    
    // stop here if form is invalid
    if (this.reviewForm.invalid) {
      return;
    }
    if ( this.reviewFormControls.headline.value === undefined || this.reviewFormControls.headline.value === null || this.reviewFormControls.headline.value === ""){
      return;
    }
    this.reviewSubmissionLoding = true;
    this.submittedReview = true;
    var review: Review = new Review();
    review.headline = this.reviewFormControls.headline.value;
    review.content = this.reviewFormControls.content.value;
    review.rating = this.rating;
    review.date = new Date();
    review.entity = this.product._id;
    review.customerEmail = this.customer.contact.email;
    review.customerName = this.customer.firstName + this.customer.lastName;
    this.reviewService
    .createReview(review)
    .pipe(first())
    .subscribe(
      (data) => {
        this.reviewResponse.message = "We are processing your review. This may take several days, so we appreciate your patience. We will notify you when this is complete.";
        this.reviewResponse.type = ResponseType.Success;
        this.openReviewForm = false;
        this.reviewSubmissionLoding = false;
      },
      (error) => {
        this.reviewResponse.message = error;
        this.reviewResponse.type = ResponseType.Error;
        this.reviewSubmissionLoding = false;
      }
    );
  }

  onSubmitQuestion() {
    
    // stop here if form is invalid
    if (this.questionForm.invalid) {
      return;
    }
    console.log('Question: '+ this.getQuestionForm.question.value);
    this.questionSubmissionLoding = true;

    var question: ProductQuestion = new ProductQuestion();
    question.question = this.getQuestionForm.question.value;
    question.entity = this.product._id;
    question.date = new Date();
    question.customerEmail = this.customer.contact.email;
    question.customerName = this.customer.firstName + this.customer.lastName;

    this.submittedQuestion = true;
    this.productQAService
    .postQuestion(question)
    .pipe(first())
    .subscribe(
      (data) => {
        this.postQuestionResponse.message = "Thanks for your question. We will notify you when this is answered.";
        this.postQuestionResponse.type = ResponseType.Success;
        this.openReviewForm = false;
        this.questionSubmissionLoding = false;
      },
      (error) => {
        this.postQuestionResponse.message = "There was an issue when posting your question. Please try again later.";
        this.postQuestionResponse.type = ResponseType.Error;
        this.questionSubmissionLoding = false;
      }
    );
  }

  setMainPicture(url: String){
    this.mainPicture = url;
  }

}
