import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-messages',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <header class="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm">
        <h1 class="text-xl font-bold text-gray-900">Inbox</h1>
      </header>

      <div class="divide-y divide-gray-100">
        <!-- Mock conversations for UI demonstration -->
        <a routerLink="/chat/1" class="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          <div class="relative">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
              <mat-icon>person</mat-icon>
            </div>
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-gray-900 truncate">Seller #12</h3>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-2">2h ago</span>
            </div>
            <p class="text-sm text-gray-600 truncate">Is this still available?</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            <mat-icon class="text-gray-400 m-2">image</mat-icon>
          </div>
        </a>

        <a routerLink="/chat/2" class="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
            <mat-icon>person</mat-icon>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-gray-900 truncate">Buyer #45</h3>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-2">Yesterday</span>
            </div>
            <p class="text-sm text-gray-500 truncate font-medium">I can offer $20</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            <mat-icon class="text-gray-400 m-2">image</mat-icon>
          </div>
        </a>
        
        <div class="p-8 text-center text-gray-500">
          <mat-icon class="text-4xl mb-2 opacity-50">chat_bubble_outline</mat-icon>
          <p>No more messages</p>
        </div>
      </div>
    </div>
  `
})
export class Messages implements OnInit {
  private chatService = inject(ChatService);

  ngOnInit() {
    // Load conversations
  }
}
