import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/model/property';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent implements OnInit {

  @Input() property: Property;

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  selectProperty() {
    this.router.navigate(['/properties/detail', this.property._id]).then();
  }
}
