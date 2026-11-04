import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EMPTY_FILTER } from '../models/product-filter.model';
import { API_URL } from './api.config';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('calls GetAll when no filter is active', () => {
    service.getProducts(EMPTY_FILTER).subscribe();

    const req = http.expectOne(`${API_URL}/Products/GetAll`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('calls GetFiltered with only the active params', () => {
    service.getProducts({ ...EMPTY_FILTER, categoryId: 2, nuts: false }).subscribe();

    const req = http.expectOne((r) => r.url === `${API_URL}/Products/GetFiltered`);
    expect(req.request.params.get('categoryId')).toBe('2');
    expect(req.request.params.get('nuts')).toBe('false');
    expect(req.request.params.has('vegeterian')).toBe(false);
    expect(req.request.params.has('spiciness')).toBe(false);
    req.flush([]);
  });

  it('sends spiciness=0 (does not treat it as empty)', () => {
    service.getProducts({ ...EMPTY_FILTER, spiciness: 0 }).subscribe();

    const req = http.expectOne((r) => r.url === `${API_URL}/Products/GetFiltered`);
    expect(req.request.params.get('spiciness')).toBe('0');
    req.flush([]);
  });
});
