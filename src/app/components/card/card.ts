import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly spiceLevels = [1, 2, 3, 4];
}
