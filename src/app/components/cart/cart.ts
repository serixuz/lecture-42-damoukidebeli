import { Component, effect, inject, input, output, signal } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketItem } from '../../models/basket.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly open = input(false);
  readonly closed = output<void>();
  protected readonly data = inject(BasketService);
  protected readonly basketItems = signal<BasketItem[]>([]);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.loadBacket();
      }
    });
  }

  removeItem(productId: number) {
    this.data.delItem(productId).subscribe({
      next: () => this.loadBacket(),
      error: (error) => console.error('Couldn\t delete item', error),
    });
  }

  changeQuantity(item: BasketItem, change: number) {
    const quantity = item.quantity + change;

    if (quantity < 1) {
      this.removeItem(item.product.id);
      return;
    }

    this.data
      .changeQnt({
        productId: item.product.id,
        quantity,
        price: item.price,
      })
      .subscribe({
        next: () => this.loadBacket(),
        error: (error) => console.error('Не удалось изменить количество', error),
      });
  }

  loadBacket() {
    this.data.getData().subscribe((data) => {
      this.basketItems.set(data);
    });
  }
}
