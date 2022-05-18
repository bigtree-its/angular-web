import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalArea, LocalAreaSearchResponse, LocalChef, LocalChefSearchQuery } from 'src/app/model/localchef';
import { LocalChefService } from 'src/app/service/localchef.service';
// import { GoogleMap } from '@angular/google-maps';
// import {} from 'google.maps';

@Component({
  selector: 'app-home-food',
  templateUrl: './home-food.component.html',
  styleUrls: ['./home-food.component.css']
})
export class HomeFoodComponent implements OnInit {

  localChefs: LocalChef[];
  localChefSearchQuery: LocalChefSearchQuery;
  map: google.maps.Map;
  localAreaSearchText: string;
  serviceAreaList: LocalArea[] = null;
  selectedLocalArea: LocalArea;
  displayAreaSelectionContainer: boolean;
  showServiceAreas: boolean;
  showServiceAreaChefs: boolean;
  // @ViewChild('localAreaSelectionContainer') localAreaSelectionContainer: ElementRef;
  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  // zoom: number = 12;
  // center: google.maps.LatLngLiteral;
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'roadmap',
  //   zoomControl: false,
  //   scrollwheel: true,
  //   disableDoubleClickZoom: true,
  //   maxZoom: 15,
  //   minZoom: 8,
  // }

  constructor(private localChefService: LocalChefService,
    private router: Router) { }

  ngOnInit(): void {
    // this.initMap();
    this.fetchAllServiceAreas();
  }

  fetchAllServiceAreas() {
    this.localChefService.fetchLocalAreas("Glasgow")
      // .pipe(first())
      .subscribe(
        (data: LocalArea[]) => {
          this.serviceAreaList = data;
          this.showServiceAreas = true;
          this.showServiceAreaChefs = false;
          console.log('The LocalArea List: ' + JSON.stringify(this.serviceAreaList));
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  initMap(): void {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 4,
        center: uluru,
      }
    );

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }

  private fetchLocalChefs() {
    this.fetchChefsByArea(this.selectedLocalArea);
  }

  selectServiceArea(serviceArea: LocalArea) {
    // this.fetchChefsByArea(serviceArea);
    this.router.navigate(['/chef-list', serviceArea.slug]).then();

  }
  fetchChefsByArea(serviceArea: LocalArea) {
    this.localChefSearchQuery = new LocalChefSearchQuery();
    this.localChefSearchQuery.serviceAreas = serviceArea._id;
    this.localChefService
      .getAllLocalChefs(this.localChefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.localChefs = result;
        this.serviceAreaList = null;
        this.displayAreaSelectionContainer = false;
        this.showServiceAreas = false;
        this.showServiceAreaChefs = true;
        console.log('Got '+ this.localChefs.length+' chefs on this are');
        // if ( this.localChefs === null || this.localChefs === undefined || this.localChefs.length === 0){
        //   this.buildNotificationMessage(); 
        // }
      });
  }

  getBounds(markers) {
    let north;
    let south;
    let east;
    let west;

    for (const marker of markers) {
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.
      north = north !== undefined ? Math.max(north, marker.position.lat) : marker.position.lat;
      south = south !== undefined ? Math.min(south, marker.position.lat) : marker.position.lat;
      east = east !== undefined ? Math.max(east, marker.position.lng) : marker.position.lng;
      west = west !== undefined ? Math.min(west, marker.position.lng) : marker.position.lng;
    };

    const bounds = { north, south, east, west };

    return bounds;
  }
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  click(event: google.maps.MapMouseEvent) {
    console.log(event)
  }
  zoomIn() {
    // if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    // if (this.zoom > this.options.minZoom) this.zoom--
  }
  onSubmitLocalAreaLookup(localAreaLookupForm: NgForm) {
    this.selectedLocalArea = undefined;
    if (localAreaLookupForm.valid) {
      this.doLocalAreaLookup(this.localAreaSearchText);
    }
  }

  doLocalAreaLookup(searchString: string) {

    if (searchString === null && searchString === undefined) {
      return;
    }
    this.localChefService.fetchLocalAreas(searchString.trim())
      // .pipe(first())
      .subscribe(
        (data: LocalArea[]) => {
          this.serviceAreaList = data;
          this.displayAreaSelectionContainer = true;
          console.log('The LocalArea List: ' + JSON.stringify(this.serviceAreaList));
        },
        (error) => {
          this.displayAreaSelectionContainer = false;
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }

  onSelectLocalArea(selectLocalArea: LocalArea) {
    this.selectedLocalArea = selectLocalArea;
    // this.fetchLocalChefs();
    this.router.navigate(['/chef-list', selectLocalArea.slug]).then();
  }

  clearSearchText() {
    this.localAreaSearchText = "";
    this.displayAreaSelectionContainer = false;
  }

  doSearch() {
    this.doLocalAreaLookup(this.localAreaSearchText);
  }

  onEnter() {
    this.doLocalAreaLookup(this.localAreaSearchText);
  }
}
