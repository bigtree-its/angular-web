import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalChef } from 'src/app/model/localchef';

@Component({
  selector: 'app-chef-card',
  templateUrl: './chef-card.component.html',
  styleUrls: ['./chef-card.component.css']
})
export class ChefCardComponent implements OnInit {

  @Input() chef: LocalChef;
  starSelected: string = "/assets/icons/pointed-star.png";
  star: string = "/assets/icons/star.png";
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  selectChef() {
    this.router.navigate(['/chef', this.chef._id]).then();
  }
}
