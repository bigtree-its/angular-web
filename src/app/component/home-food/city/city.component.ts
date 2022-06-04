import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/helpers/utils';
import { LocalArea, LocalChef, LocalChefSearchQuery } from 'src/app/model/localchef';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  serviceAreaList: LocalArea[];
  showServiceAreas: boolean;
  showServiceAreaChefs: boolean;
  localChefSearchQuery: LocalChefSearchQuery;
  localChefs: LocalChef[];
  city: string;
  serviceAreaSlug: string;
  serviceArea: LocalArea;

  constructor(private router: Router,
    private utils: Utils,
    private localChefService: LocalChefService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.city = params['c'];
      this.serviceAreaSlug = params['a'];
      console.log('City: ' + this.city + ', Area: ' + this.serviceAreaSlug);
      if (this.utils.isEmpty(this.serviceAreaSlug)) {
        console.log('Fetching service ares for city: ' + this.city);
        this.fetchAllServiceAreas(this.city, false);
      } else {
        if (this.serviceAreaList === null || this.serviceAreaList === undefined || this.serviceAreaList.length === 0) {
          console.log('Fetching all service ares for city: ' + this.city);
          this.fetchAllServiceAreas(this.city, true);
        } else {
          this.serviceAreaList.forEach(serviceArea => {
            if (serviceArea.slug === this.serviceAreaSlug) {
              this.serviceArea = serviceArea;
            }
          });
          console.log('Fetching Chefs for service ares ' + this.serviceArea);
          this.fetchChefsByArea(this.serviceArea);
        }
      }
    });
  }

  fetchChefsByArea(serviceArea: LocalArea) {
    console.log('fetching Chefs for area: '+ serviceArea.slug);
    this.localChefSearchQuery = new LocalChefSearchQuery();
    this.localChefSearchQuery.serviceAreas = serviceArea._id;
    this.localChefService
      .getAllLocalChefs(this.localChefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.localChefs = result;
        console.log('The chefs found: '+ JSON.stringify(this.localChefs));
        this.showServiceAreas = false;
        this.showServiceAreaChefs = true;
      });
  }


  selectServiceArea(selectLocalArea: LocalArea) {
    this.serviceArea = selectLocalArea;
    this.fetchChefsByArea(this.serviceArea);
  }

  fetchAllServiceAreas(city: string, fetchChefs: boolean) {
    this.localChefService.fetchLocalAreas(city)
      // .pipe(first())
      .subscribe(
        (data: LocalArea[]) => {
          this.serviceAreaList = data;
          if ( fetchChefs){
            this.serviceAreaList.forEach(serviceArea => {
              if (serviceArea.slug === this.serviceAreaSlug) {
                this.serviceArea = serviceArea;
              }
            });
            this.fetchChefsByArea(this.serviceArea);
          }else{
            this.showServiceAreas = true;
          }
        },
        (error) => {
          console.log('Address Lookup resulted an error.' + JSON.stringify(error));
        }
      );
  }
}
