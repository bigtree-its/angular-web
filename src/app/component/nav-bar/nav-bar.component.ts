import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  departments: Department[];
  department: Department;

  constructor( private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.getDepartments().subscribe((result: Department[]) => {
      this.departments = result;
    });
  }
  selectDepartment(d: Department) {
    this.department = d;
    this.router.navigate(['/category-browser', this.department._id]).then();
  }
}
