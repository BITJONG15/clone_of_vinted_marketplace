import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="pb-20">
      <!-- Header -->
      <header class="bg-white px-4 py-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <div class="flex-1 relative">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</mat-icon>
          <input type="text" placeholder="Search for items" 
            class="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all">
        </div>
        <button class="text-gray-600 hover:text-[var(--color-primary)] transition-colors">
          <mat-icon>filter_list</mat-icon>
        </button>
      </header>

      <!-- Categories -->
      <div class="px-4 py-4 flex gap-3 overflow-x-auto hide-scrollbar">
        @for (cat of categories; track cat) {
          <button class="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Products Grid -->
      <div class="px-4">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Recommended for you</h2>
        
        @if (isLoading()) {
          <div class="flex justify-center py-10">
            <mat-icon class="animate-spin text-[var(--color-primary)]">refresh</mat-icon>
          </div>
        } @else {
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            @for (product of products(); track product.id) {
              <a [routerLink]="['/product', product.id]" class="block group cursor-pointer">
                <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                  @if (product.image_url) {
                    <img [src]="product.image_url" [alt]="product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerpolicy="no-referrer">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                      <mat-icon>image</mat-icon>
                    </div>
                  }
                  @if (product.status !== 'available') {
                    <div class="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span class="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{{ product.status }}</span>
                    </div>
                  }
                </div>
                <div class="px-1">
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-gray-900 truncate pr-2">${{ product.price.toFixed(2) }}</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                      <mat-icon class="text-[18px]">favorite_border</mat-icon>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ product.brand }} • {{ product.size }}</p>
                </div>
              </a>
            }
          </div>
          
          @if (products().length === 0) {
            <div class="text-center py-10 text-gray-500">
              <mat-icon class="text-4xl mb-2 opacity-50">inventory_2</mat-icon>
              <p>No products found.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  isLoading = signal(true);
  
  categories = ['All', 'Women', 'Men', 'Kids', 'Home', 'Entertainment', 'Pet care'];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      }
    });
  }
}
