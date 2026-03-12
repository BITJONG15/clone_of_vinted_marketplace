import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <header class="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">Profile</h1>
        <button class="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
          <mat-icon>settings</mat-icon>
        </button>
      </header>

      @if (authService.currentUser()) {
        <!-- User Info -->
        <div class="bg-white p-6 flex flex-col items-center border-b border-gray-100 shadow-sm">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden mb-4 relative group">
            <mat-icon class="text-4xl">person</mat-icon>
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <mat-icon class="text-white">camera_alt</mat-icon>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">{{ authService.currentUser()?.username }}</h2>
          <div class="flex items-center text-yellow-500 text-sm mt-1">
            <mat-icon class="text-[16px]">star</mat-icon>
            <mat-icon class="text-[16px]">star</mat-icon>
            <mat-icon class="text-[16px]">star</mat-icon>
            <mat-icon class="text-[16px]">star</mat-icon>
            <mat-icon class="text-[16px]">star_half</mat-icon>
            <span class="text-gray-500 ml-1 font-medium">(42 reviews)</span>
          </div>
        </div>

        <!-- Wallet -->
        <div class="p-4">
          <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            
            <div class="relative z-10">
              <p class="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Wallet Balance</p>
              <h3 class="text-4xl font-bold mb-4">${{ balance()?.toFixed(2) || '0.00' }}</h3>
              <div class="flex gap-3">
                <button class="bg-white text-[var(--color-primary)] px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  Withdraw
                </button>
                <button class="bg-white/20 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-colors backdrop-blur-sm">
                  Top up
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu -->
        <div class="bg-white mt-2 shadow-sm">
          <a class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 text-gray-700">
              <mat-icon class="text-gray-400">inventory_2</mat-icon>
              <span class="font-medium">My items</span>
            </div>
            <mat-icon class="text-gray-400">chevron_right</mat-icon>
          </a>
          <a class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 text-gray-700">
              <mat-icon class="text-gray-400">receipt_long</mat-icon>
              <span class="font-medium">My orders</span>
            </div>
            <mat-icon class="text-gray-400">chevron_right</mat-icon>
          </a>
          <a class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 text-gray-700">
              <mat-icon class="text-gray-400">account_balance_wallet</mat-icon>
              <span class="font-medium">Transactions history</span>
            </div>
            <mat-icon class="text-gray-400">chevron_right</mat-icon>
          </a>
          <a class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 text-gray-700">
              <mat-icon class="text-gray-400">help_outline</mat-icon>
              <span class="font-medium">Help Center</span>
            </div>
            <mat-icon class="text-gray-400">chevron_right</mat-icon>
          </a>
          <button (click)="logout()" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-red-500">
            <div class="flex items-center gap-3">
              <mat-icon>logout</mat-icon>
              <span class="font-medium">Log out</span>
            </div>
          </button>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
            <mat-icon class="text-4xl">person_outline</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome to Vinted Clone</h2>
          <p class="text-gray-500 mb-8">Sign in to buy, sell, and connect with the community.</p>
          
          <div class="w-full max-w-xs space-y-3">
            <a routerLink="/login" class="block w-full bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-xl hover:bg-[var(--color-accent)] transition-colors shadow-sm">
              Log In
            </a>
            <a routerLink="/register" class="block w-full bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class Profile implements OnInit {
  authService = inject(AuthService);
  private walletService = inject(WalletService);

  balance = signal<number>(0);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadBalance();
    }
  }

  loadBalance() {
    this.walletService.getBalance().subscribe({
      next: (data) => {
        this.balance.set(data.balance);
      },
      error: (err) => {
        console.error('Failed to load balance', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
