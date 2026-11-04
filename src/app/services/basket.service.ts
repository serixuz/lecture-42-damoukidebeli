import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BasketItem, BasketPost } from '../models/basket.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private readonly http = inject(HttpClient);

  addToBasket(item: BasketPost): Observable<BasketPost> {
    return this.http.post<BasketPost>(`${API_URL}/Baskets/AddToBasket`, item);
  }

  changeQnt(item: BasketPost): Observable<BasketPost> {
    return this.http.put<BasketPost>(`${API_URL}/Baskets/UpdateBasket`, item);
  }

  delItem(id: number): Observable<number> {
    return this.http.delete<number>(`${API_URL}/Baskets/DeleteProduct/${id}`);
  }

  getData(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(`${API_URL}/Baskets/GetAll`);
  }
}
