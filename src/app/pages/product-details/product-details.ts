import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Product } from '../../services/product.service';
import { WalletService } from '../../services/wallet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <button (click)="goBack()" class="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="flex gap-2">
          <button class="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <mat-icon>share</mat-icon>
          </button>
          <button class="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <mat-icon>favorite_border</mat-icon>
          </button>
        </div>
      </header>

      @if (isLoading()) {
        <div class="flex justify-center py-20">
          <mat-icon class="animate-spin text-[var(--color-primary)] text-4xl">refresh</mat-icon>
        </div>
      } @else if (product()) {
        <!-- Image Gallery -->
        <div class="w-full aspect-square bg-gray-200 relative overflow-hidden">
          @if (product()?.image_url) {
            <img [src]="product()?.image_url" [alt]="product()?.title" class="w-full h-full object-cover" referrerpolicy="no-referrer">
          } @else {
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <mat-icon class="text-6xl opacity-50">image</mat-icon>
            </div>
          }
          
          @if (product()?.status !== 'available') {
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <span class="bg-white text-gray-900 text-lg font-bold px-4 py-2 rounded-lg uppercase tracking-wider shadow-lg">
                {{ product()?.status }}
              </span>
            </div>
          }
        </div>

        <!-- Details -->
        <div class="bg-white p-4 mb-2 shadow-sm">
          <div class="flex justify-between items-start mb-2">
            <h1 class="text-2xl font-bold text-gray-900">${{ product()?.price?.toFixed(2) }}</h1>
            <div class="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              <mat-icon class="text-[16px]">visibility</mat-icon>
              <span>124</span>
            </div>
          </div>
          <h2 class="text-lg text-gray-800 mb-4">{{ product()?.title }}</h2>
          
          <div class="space-y-3 text-sm">
            <div class="flex border-b border-gray-100 pb-2">
              <span class="w-1/3 text-gray-500">Brand</span>
              <span class="w-2/3 font-medium text-gray-900">{{ product()?.brand || 'Unbranded' }}</span>
            </div>
            <div class="flex border-b border-gray-100 pb-2">
              <span class="w-1/3 text-gray-500">Size</span>
              <span class="w-2/3 font-medium text-gray-900">{{ product()?.size || 'One Size' }}</span>
            </div>
            <div class="flex border-b border-gray-100 pb-2">
              <span class="w-1/3 text-gray-500">Condition</span>
              <span class="w-2/3 font-medium text-gray-900">{{ product()?.condition || 'Good' }}</span>
            </div>
            <div class="flex border-b border-gray-100 pb-2">
              <span class="w-1/3 text-gray-500">Category</span>
              <span class="w-2/3 font-medium text-gray-900">{{ product()?.category || 'Other' }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white p-4 mb-2 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-2">Description</h3>
          <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{{ product()?.description }}</p>
          <div class="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <mat-icon class="text-[14px]">schedule</mat-icon>
            <span>Listed {{ product()?.created_at | date:'mediumDate' }}</span>
          </div>
        </div>

        <!-- Seller Info -->
        <div class="bg-white p-4 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
              <mat-icon>person</mat-icon>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Seller #{{ product()?.seller_id }}</h4>
              <div class="flex items-center text-yellow-500 text-xs">
                <mat-icon class="text-[14px]">star</mat-icon>
                <mat-icon class="text-[14px]">star</mat-icon>
                <mat-icon class="text-[14px]">star</mat-icon>
                <mat-icon class="text-[14px]">star</mat-icon>
                <mat-icon class="text-[14px]">star_half</mat-icon>
                <span class="text-gray-500 ml-1">(42)</span>
              </div>
            </div>
          </div>
          <button class="text-[var(--color-primary)] font-medium text-sm border border-[var(--color-primary)] px-4 py-1.5 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors">
            Follow
          </button>
        </div>

        <!-- Action Bar -->
        <div class="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 flex gap-3 z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          @if (isOwner()) {
            <button class="flex-1 bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors">
              <mat-icon>edit</mat-icon> Edit Listing
            </button>
          } @else {
            <button [routerLink]="['/chat', product()?.id]" class="flex-1 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <mat-icon>chat_bubble_outline</mat-icon> Message
            </button>
            <button (click)="buyProduct()" [disabled]="product()?.status !== 'available' || isBuying()" 
              class="flex-1 bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              @if (isBuying()) {
                <mat-icon class="animate-spin">refresh</mat-icon> Processing...
              } @else {
                <mat-icon>shopping_bag</mat-icon> Buy Now
              }
            </button>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 text-gray-500">
          <mat-icon class="text-6xl mb-4 opacity-50">error_outline</mat-icon>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p class="mb-6">This item may have been removed or sold.</p>
          <button (click)="goBack()" class="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-medium">
            Go Back
          </button>
        </div>
      }
    </div>
  `
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private walletService = inject(WalletService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  isBuying = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.isLoading.set(false);
      }
    });
  }

  isOwner(): boolean {
    const user = this.authService.currentUser();
    const prod = this.product();
    return !!user && !!prod && user.id === prod.seller_id;
  }

  buyProduct() {
    const prod = this.product();
    if (!prod) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (confirm(`Are you sure you want to buy ${prod.title} for $${prod.price}?`)) {
      this.isBuying.set(true);
      this.walletService.buyProduct(prod.id).subscribe({
        next: () => {
          alert('Purchase successful!');
          this.loadProduct(prod.id);
          this.isBuying.set(false);
        },
        error: (err) => {
          alert(err.error?.message || 'Purchase failed');
          this.isBuying.set(false);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
