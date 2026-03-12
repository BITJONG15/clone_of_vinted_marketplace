import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FavoriteService, Favorite } from '../../services/favorite.service';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <header class="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm">
        <h1 class="text-xl font-bold text-gray-900">Favorites</h1>
      </header>

      <div class="p-4">
        @if (isLoading()) {
          <div class="flex justify-center py-10">
            <mat-icon class="animate-spin text-[var(--color-primary)]">refresh</mat-icon>
          </div>
        } @else {
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            @for (fav of favorites(); track fav.id) {
              <a [routerLink]="['/product', fav.product_id]" class="block group cursor-pointer relative">
                <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <mat-icon>image</mat-icon>
                  </div>
                </div>
                <div class="px-1">
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-gray-900 truncate pr-2">Product #{{ fav.product_id }}</h3>
                  </div>
                </div>
                <button (click)="removeFavorite(fav.product_id, $event)" class="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-[var(--color-primary)] hover:bg-white hover:text-red-500 transition-colors shadow-sm">
                  <mat-icon class="text-[18px]">favorite</mat-icon>
                </button>
              </a>
            }
          </div>
          
          @if (favorites().length === 0) {
            <div class="text-center py-20 text-gray-500">
              <mat-icon class="text-6xl mb-4 opacity-30">favorite_border</mat-icon>
              <h2 class="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
              <p class="mb-6">Items you favorite will appear here.</p>
              <a routerLink="/tabs/home" class="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[var(--color-accent)] transition-colors inline-block">
                Explore items
              </a>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class Favorites implements OnInit {
  private favoriteService = inject(FavoriteService);

  favorites = signal<Favorite[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        this.favorites.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load favorites', err);
        this.isLoading.set(false);
      }
    });
  }

  removeFavorite(productId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.favoriteService.removeFavorite(productId).subscribe({
      next: () => {
        this.favorites.update(favs => favs.filter(f => f.product_id !== productId));
      },
      error: (err) => {
        console.error('Failed to remove favorite', err);
      }
    });
  }
}
