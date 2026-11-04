import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';
import { ProductFilter, hasActiveFilter } from '../models/product-filter.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(filter: ProductFilter): Observable<Product[]> {
    if (!hasActiveFilter(filter)) {
      return this.http.get<Product[]>(`${API_URL}/Products/GetAll`);
    }

    let params = new HttpParams();
    if (filter.vegeterian !== null) {
      params = params.set('vegeterian', filter.vegeterian);
    }
    if (filter.nuts !== null) {
      params = params.set('nuts', filter.nuts);
    }
    if (filter.spiciness !== null) {
      params = params.set('spiciness', filter.spiciness);
    }
    if (filter.categoryId !== null) {
      params = params.set('categoryId', filter.categoryId);
    }

    return this.http.get<Product[]>(`${API_URL}/Products/GetFiltered`, { params });
  }
}
