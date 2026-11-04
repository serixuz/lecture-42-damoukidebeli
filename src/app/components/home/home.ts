import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { Product } from '../../models/product.model';
import { EMPTY_FILTER, ProductFilter } from '../../models/product-filter.model';
import { BasketService } from '../../services/basket.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Card } from '../card/card';
import { FilterBar } from '../filter-bar/filter-bar';
import { CommonModule } from '@angular/common';

interface ProductsState {
  loading: boolean;
  error: boolean;
  products: Product[];
}

@Component({
  selector: 'app-home',
  imports: [Card, FilterBar, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly basketService = inject(BasketService);

  protected readonly filter = signal<ProductFilter>({ ...EMPTY_FILTER });
  protected readonly notice = signal<string | null>(null);

  protected readonly categories = toSignal(
    this.categoryService.getCategories().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  start = signal(0);
  end = signal(6);

  pagination(num: number): void {
    let startAt = 0;
    let endaT = 6 * num;

    this.start.set(startAt);
    this.end.set(endaT);
  }

  private readonly state = toSignal(
    toObservable(this.filter).pipe(
      switchMap((filter) =>
        this.productService.getProducts(filter).pipe(
          map((products): ProductsState => ({ loading: false, error: false, products })),
          catchError(() => of<ProductsState>({ loading: false, error: true, products: [] })),
          startWith<ProductsState>({ loading: true, error: false, products: [] }),
        ),
      ),
    ),
    { initialValue: { loading: true, error: false, products: [] } as ProductsState },
  );

  protected readonly products = computed(() => this.state().products);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly error = computed(() => this.state().error);

  private noticeTimer?: ReturnType<typeof setTimeout>;

  protected onFilterChange(filter: ProductFilter): void {
    this.filter.set(filter);
  }

  protected selectCategory(categoryId: number | null): void {
    this.filter.update((filter) => ({ ...filter, categoryId }));
  }

  protected addToCart(product: Product): void {
    this.basketService.getData().subscribe((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        this.basketService
          .changeQnt({
            productId: product.id,
            quantity: existing.quantity + 1,
            price: product.price,
          })
          .subscribe({
            next: () => this.showNotice('Product quantity +1'),
            error: () => this.showNotice("Couldn't change quantity"),
          });
      } else {
        this.basketService
          .addToBasket({ quantity: 1, price: product.price, productId: product.id })
          .subscribe({
            next: () => this.showNotice(`${product.name} added to cart`),
            error: () => this.showNotice('Could not add the item to the cart'),
          });
      }
    });
  }

  private showNotice(message: string): void {
    clearTimeout(this.noticeTimer);
    this.notice.set(message);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 2500);
  }
}
