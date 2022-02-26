import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer, CustomerSession } from 'src/app/model/customer';
import { AdService } from 'src/app/service/ad.service';
import { LocalContextService } from 'src/app/service/localcontext.service';
import { first } from 'rxjs/operators';
import { ResponseType, ServerResponse } from 'src/app/model/server-response';
import { Property, PropertyEnquiry, PropertyType } from 'src/app/model/property';
import { PropertyEnquiryService } from 'src/app/service/property-enquiry.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  /** Questions */
  questionForm: FormGroup;
  questionSubmissionLoding = false;
  submittedQuestion = false;
  postQuestionResponse: ServerResponse = new ServerResponse();
  postQuestionErrorResponse:ResponseType = ResponseType.Error;
  postQuestionSuccessResponse:ResponseType = ResponseType.Success;
  openReviewForm: boolean = false;
  
  customerSession: CustomerSession;
  customer: Customer;
  property: Property;
  type: PropertyType;
  display_picture: string;
  gallery: string[] = [];
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @ViewChild('googleMap') googleMap: google.maps.Map;

  zoom: number = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 19,
    minZoom: 8,
  }
  markers: any = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private adService: AdService,
    private propertyEnquiryService: PropertyEnquiryService,
    private formBuilder: FormBuilder,
    private localContextService: LocalContextService,
    private _location: Location
  ) { }

  backToResults() {
    this._location.back();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const propertyId = params['id'];
      console.log(`Property Id: ${params['id']}`);
      this.adService.getProperty(propertyId).subscribe((property: Property) => {
        this.property = property;
        console.log('The property : ' + JSON.stringify(this.property));
        this.center = {
          lat: this.property.address.latitude,
          lng: this.property.address.longitude,
        }
        this.addMarker();
        this.display_picture = this.property.coverPhoto;
        this.gallery.push(this.property.coverPhoto);
        this.property.gallery.forEach(p => {
          this.gallery.push(p);
        })
      });
    })

    this.customerSession = this.localContextService.getCustomerSession();
    if ( this.customerSession !== null && this.customerSession !== undefined){
      this.customer = this.customerSession.customer;
    }

    this.questionForm = this.formBuilder.group({
      question: ['']
    });

    // const mapProperties = {
    //   center: new google.maps.LatLng(35.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    // this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    //   center: { lat: -34.397, lng: 150.644 },
    //   zoom: 8,
    // });

    navigator.geolocation.getCurrentPosition((position) => {
      console.log('The current location lat ' + position.coords.latitude);
      console.log('The current location lon ' + position.coords.longitude);
      
    })

  }

    // convenience getter for easy access to form fields
    get getQuestionForm() { return this.questionForm.controls; }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  displayPicture(url: string) {
    this.display_picture = url;
  }
  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;

  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }

  addMarker() {
    var position: any = {
      lat: this.center.lat,
      lng: this.center.lng,
    };

    var marker = new google.maps.Marker({
      position: position,
      map: this.googleMap,
      title: 'markers'
    });
    this.markers.push(marker);

    // this.markers.push({
    //   position: {
    //     lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
    //     lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
    //   },
    //   label: {
    //     color: 'red',
    //     text: 'Marker label ' + (this.markers.length + 1),
    //   },
    //   title: 'Marker title ' + (this.markers.length + 1),
    //   options: { animation: google.maps.Animation.BOUNCE },
    // })
  }

  onSubmitQuestion() {
    
    // stop here if form is invalid
    if (this.questionForm.invalid) {
      return;
    }
    console.log('Question: '+ this.getQuestionForm.question.value);
    this.questionSubmissionLoding = true;

    var question: PropertyEnquiry = new PropertyEnquiry();
    question.enquiry = this.getQuestionForm.question.value;
    question.postcode = this.getQuestionForm.postcode.value;
    question.mobile = this.getQuestionForm.mobile.value;
    question.property = this.property._id;
    question.date = new Date();
    question.email = this.customer.email;
    question.firstName = this.customer.firstName; 
    question.lastName = this.customer.lastName;

    this.submittedQuestion = true;
    this.propertyEnquiryService
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
}
