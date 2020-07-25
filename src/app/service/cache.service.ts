import { Injectable } from '@angular/core';
import { Category, Department } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  allDeps: Department[];
  allCats: Category[];

  public storeDeps(deps: Department[]){
    this.allDeps = deps;
  }

  public storeCats(cats: Category[]){
    this.allCats = cats;
  }

  public getCats(): Category[] {
    return this.allCats;
  }
  public getDeps(): Department[]{
    return this.allDeps;
  }
}
