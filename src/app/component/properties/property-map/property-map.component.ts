import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-map',
  templateUrl: './property-map.component.html',
  styleUrls: ['./property-map.component.css']
})
export class PropertyMapComponent implements OnInit {

  zoom: number = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }

  constructor() { }

  ngOnInit(): void {

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })

  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }
}
