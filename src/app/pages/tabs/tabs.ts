import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabs',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="flex flex-col h-screen bg-gray-50">
      <div class="flex-1 overflow-y-auto pb-16">
        <router-outlet></router-outlet>
      </div>
      
      <nav class="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <a routerLink="/tabs/home" routerLinkActive="text-[var(--color-primary)]" [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-accent)] transition-colors">
          <mat-icon>home</mat-icon>
          <span class="text-[10px] mt-1 font-medium">Home</span>
        </a>
        
        <a routerLink="/tabs/favorites" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-accent)] transition-colors">
          <mat-icon>favorite_border</mat-icon>
          <span class="text-[10px] mt-1 font-medium">Favorites</span>
        </a>
        
        <a routerLink="/tabs/sell" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-accent)] transition-colors relative">
          <div class="absolute -top-5 bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg border-4 border-gray-50 flex items-center justify-center">
            <mat-icon>add</mat-icon>
          </div>
          <span class="text-[10px] mt-8 font-medium">Sell</span>
        </a>
        
        <a routerLink="/tabs/messages" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-accent)] transition-colors">
          <mat-icon>chat_bubble_outline</mat-icon>
          <span class="text-[10px] mt-1 font-medium">Messages</span>
        </a>
        
        <a routerLink="/tabs/profile" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-[var(--color-accent)] transition-colors">
          <mat-icon>person_outline</mat-icon>
          <span class="text-[10px] mt-1 font-medium">Profile</span>
        </a>
      </nav>
    </div>
  `
})
export class Tabs {}
