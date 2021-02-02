import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { ProductModel, Category, Department } from '../model/product.model';
import { MessengerService } from './messenger.service';
import { CategoryQuery, ProductQuery } from '../model/query';

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
  ) {
    console.log('ProductService.Constructor::Start');
    console.log('Api URL: '+ this.SERVER_URL);
    console.log('ProductService.Constructor::End');
  }

  getAllProducts(): Observable<ProductModel[]> {
    console.log('Fetching all products...');
    return this.http.get<ProductModel[]>(this.SERVER_URL + '/products');
  }

  getDepartments(): Observable<Department[]> {
    console.log('Fetching all departments...');
    return this.http.get<Department[]>(this.SERVER_URL + '/departments');
  }

  queryProducts(query: ProductQuery): Observable<ProductModel[]> {
    // HttpParams in Immutable. Call to set returns new Object every time.
    // So need to assign back to same variable
    var params = new HttpParams();
    if ( query.brands !== undefined && query.brands !== null){
      params = params.set('brands', query.brands);
    }
    if ( query.department !== undefined && query.department !== null){
      params = params.set('department', query.department);
    }
    if ( query.featured !== undefined && query.featured !== null){
      params = params.set('featured', "true");
    }
    if ( query.bestSeller !== undefined && query.bestSeller !== null){
      params = params.set('bestseller', "true");
    }
    if ( query.category !== undefined && query.category !== null){
      params = params.set('categories', query.category);
    }
    return this.http.get<ProductModel[]>(this.SERVER_URL + '/products', {params});
  }

  getFeaturedProduct(): Observable<ProductModel[]> {
    console.log('Fetching featured product...');
    return this.http.get<ProductModel[]>(this.SERVER_URL + '/products/featured');
  }

  getAllDepartments(): void {
    console.log('Fetching all departments...');
    this.allDeps$ = this.http.get<Department[]>(
      this.SERVER_URL + '/departments'
    ) as Observable<Department[]>;
    // .pipe( shareReplay({ bufferSize: 1, refCount: true }))
    this.allDeps$.subscribe((d) => {
      this.messengerService.cacheDeps(d);
    });
  }

  getDepartment(departmentId: any): Observable<Department> {
    return this.http.get<Department>(this.SERVER_URL + '/departments/'+ departmentId);
  }

  getAllCategories(): Observable<Category[]>  {
    console.log('Fetching categories');
    var params = new HttpParams().set('tree', "true");
    return this.http.get<Category[]>(this.SERVER_URL + '/categories', {params}) as Observable<Category[]>;
  }

  getCategoriesByDepartment(id: string): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.SERVER_URL + '/categories?department=' + id
    );
  }

  getAllTopCategories(): Observable<Category[]> {
    console.log('Fetching all categories...');
    return this.http.get<Category[]>(this.SERVER_URL + '/categories?top=true');
  }

  getSubCategories(c: Category): Observable<Category[]> {
    console.log('Fetching all sub categories of ' + c.name);
    return this.http.get<Category[]>(
      this.SERVER_URL + '/categories?parent=' + c._id
    );
  }

  getSingleProduct(id: string): Observable<ProductModel> {
    console.log(`Fetching specific product: ${id}`);
    return this.http.get<ProductModel>(this.SERVER_URL + '/products/' + id);
  }

  getProductsByCategory(category: string): Observable<ProductModel> {
    console.log(`Fetching all products by category: ${category}`);
    return this.http.get<ProductModel>(
      this.SERVER_URL + '/products/?category=' + category
    );
  }
}
