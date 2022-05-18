import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/model/product.model';
import { AccountService } from 'src/app/service/account.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  departments: Department[];
  department: Department;
  searchForm: FormGroup;

  constructor(
    private productService: ProductService,
    public accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.getDepartments().subscribe((result: Department[]) => {
      this.departments = result;
    });
  }
  selectDepartment(d: Department) {
    this.department = d;
    console.log('Selected Department: '+ this.department.name)
    if ( this.department.name === 'LOCAL CHEF'){
      // this.router.navigate(['/properties']).then();
      // this.router.navigate(['/properties/map']).then();
      this.router.navigate(['/local-chef']).then();
    }else if ( this.department.name === 'Properties'){
      this.router.navigate(['/properties']).then();
      // this.router.navigate(['/properties/map']).then();
      // this.router.navigate(['/home-food']).then();
    }else{
      this.router.navigate(['/category-browser', this.department._id]).then();
    }
    
  }

  findProducts(keyword: string) {
    this.router.navigate(['/product-finder', keyword]).then();
  }


}
