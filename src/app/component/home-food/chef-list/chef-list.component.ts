import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalArea, LocalChef, LocalChefSearchQuery } from 'src/app/model/localchef';
import { FoodOrderservice } from 'src/app/service/food-order.service';
import { LocalChefService } from 'src/app/service/localchef.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chef-list',
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css']
})
export class ChefListComponent implements OnInit {

  localChefSearchQuery: LocalChefSearchQuery;
  localChefs: LocalChef[];
  localArea: any;

  constructor(private activatedRoute: ActivatedRoute,
    private localChefService: LocalChefService,
    private foodOrderService: FoodOrderservice,
    private _location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const areaSlug = params['area'];
      console.log(`Area : ${params['area']}`);
      this.localChefService.getServiceAreabySlug(areaSlug).subscribe((localArea: LocalArea) => {
        this.localArea = localArea;
        this.fetchChefsByArea(localArea);
      });
    });
  }

  fetchChefsByArea(localArea: LocalArea) {
    this.localChefSearchQuery = new LocalChefSearchQuery();
    this.localChefSearchQuery.serviceAreas = localArea._id;
    this.localChefService
      .getAllLocalChefs(this.localChefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.localChefs = result;
        console.log('Got ' + this.localChefs.length + ' chefs on this are');
      });
  }

  backToHome() {
    this._location.back();
  }
}
