import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/model/product.model';

@Component({
  selector: 'app-small-item',
  templateUrl: './small-item.component.html',
  styleUrls: ['./small-item.component.css']
})
export class SmallItemComponent implements OnInit {

  @Input() product: ProductModel;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  selectProduct() {
    this.router.navigate(['/product', this.product._id]).then();
  }
}
