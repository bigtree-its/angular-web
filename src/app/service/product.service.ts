import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { ProductModel, Category, Department } from '../model/product.model';
import { MessengerService } from './messenger.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  SERVER_URL = environment.PRODUCT_SERVICE_URL;

  allDeps$: Observable<Department[]>;
  cats$: Observable<Category[]>;

  constructor(
    private http: HttpClient,
    private messengerService: MessengerService
  ) {}

  getAllProducts(): Observable<ProductModel[]> {
    console.log('Fetching all products...');
    return this.http.get<ProductModel[]>(this.SERVER_URL + 'products');
  }

  getFeaturedProduct(): Observable<ProductModel[]> {
    console.log('Fetching featured product...');
    return this.http.get<ProductModel[]>(this.SERVER_URL + 'products/featured');
  }
  getAllDepartments(): void {
    console.log('Fetching all departments...');
    this.allDeps$ = this.http.get<Department[]>(
      this.SERVER_URL + 'departments'
    ) as Observable<Department[]>;
    // .pipe( shareReplay({ bufferSize: 1, refCount: true }))
    this.allDeps$.subscribe((d) => {
      this.messengerService.cacheDeps(d);
    });
  }
  getAllCategories(): void {
    console.log('Fetching all departments...');
    this.cats$ = this.http.get<Category[]>(
      this.SERVER_URL + 'categories'
    ) as Observable<Category[]>;
    // .pipe(shareReplay({ bufferSize: 1, refCount: true }))
    this.cats$.subscribe((c) => {
      this.messengerService.cacheCats(c);
    });
  }

  getCategoriesByDepartment(id: string): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.SERVER_URL + 'categories?department=' + id
    );
  }

  getAllTopCategories(): Observable<Category[]> {
    console.log('Fetching all categories...');
    return this.http.get<Category[]>(this.SERVER_URL + 'categories?top=true');
  }

  getSubCategories(c: Category): Observable<Category[]> {
    console.log('Fetching all sub categories of ' + c.name);
    return this.http.get<Category[]>(
      this.SERVER_URL + 'categories?parent=' + c._id
    );
  }

  getSingleProduct(id: string): Observable<ProductModel> {
    console.log(`Fetching specific product: ${id}`);
    return this.http.get<ProductModel>(this.SERVER_URL + 'products/' + id);
  }

  getProductsByCategory(category: string): Observable<ProductModel> {
    console.log(`Fetching all products by category: ${category}`);
    return this.http.get<ProductModel>(
      this.SERVER_URL + 'products/?category=' + category
    );
  }
}
