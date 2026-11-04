import { Component, signal } from '@angular/core';

import { Cart } from './components/cart/cart';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [Header, Home, Footer, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly cartOpen = signal(false);
}
