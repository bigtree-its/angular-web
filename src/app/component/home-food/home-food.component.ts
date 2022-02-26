import { Component, OnInit, ViewChild } from '@angular/core';
// import { GoogleMap } from '@angular/google-maps';
// import {} from 'google.maps';

@Component({
  selector: 'app-home-food',
  templateUrl: './home-food.component.html',
  styleUrls: ['./home-food.component.css']
})
export class HomeFoodComponent implements OnInit {

  map: google.maps.Map;

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

  constructor() { }

  ngOnInit(): void {
    this.initMap();
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

  
}
