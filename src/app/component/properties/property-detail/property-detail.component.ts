import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property, PropertyType } from 'src/app/model/property';
import { AdService } from 'src/app/service/ad.service';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  property: Property;
  type: PropertyType;
  display_picture: string;
  gallery: string[] = [];
  @ViewChild('widgetsContent') widgetsContent: ElementRef;


  // zoom:number = 12
  // center: google.maps.LatLngLiteral
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'hybrid',
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   maxZoom: 15,
  //   minZoom: 8,
  // }

  constructor(
    private activatedRoute: ActivatedRoute,
    private adService: AdService,
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
        console.log('The property : ' + JSON.stringify(this.property))
        this.display_picture = this.property.cover_photo;
        this.gallery.push(this.property.cover_photo);
        this.property.gallery.forEach(p => {
          this.gallery.push(p);
        })
      });
    })

    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.center = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //   }
    // })

  }

  // zoomIn() {
  //   if (this.zoom < this.options.maxZoom) this.zoom++
  // }

  // zoomOut() {
  //   if (this.zoom > this.options.minZoom) this.zoom--
  // }

  displayPicture(url: string) {
    this.display_picture = url;
  }
  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;

  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
}
