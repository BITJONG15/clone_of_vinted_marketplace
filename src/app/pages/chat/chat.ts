import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService, Message } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="bg-white px-4 py-3 shadow-sm flex items-center gap-3 z-40 sticky top-0">
        <a routerLink="/tabs/messages" class="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div class="flex items-center gap-3 flex-1">
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
            <mat-icon>person</mat-icon>
          </div>
          <div>
            <h2 class="font-bold text-gray-900">User #{{ partnerId() }}</h2>
            <p class="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <button class="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <mat-icon>more_vert</mat-icon>
        </button>
      </header>

      <!-- Product Snippet -->
      <div class="bg-white px-4 py-2 border-b border-gray-100 flex items-center gap-3 shadow-sm z-30">
        <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden">
          <mat-icon class="text-gray-400 m-3">image</mat-icon>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 truncate">Product #{{ productId() }}</h3>
          <p class="text-sm text-[var(--color-primary)] font-medium">$25.00</p>
        </div>
        <button class="bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[var(--color-accent)] transition-colors">
          Buy
        </button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" #scrollContainer>
        @if (isLoading()) {
          <div class="flex justify-center py-10">
            <mat-icon class="animate-spin text-[var(--color-primary)]">refresh</mat-icon>
          </div>
        } @else {
          @for (msg of messages(); track msg.id) {
            <div class="flex" [class.justify-end]="isMe(msg.sender_id)">
              <div class="max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm"
                   [class.bg-[var(--color-primary)]]="isMe(msg.sender_id)"
                   [class.text-white]="isMe(msg.sender_id)"
                   [class.bg-white]="!isMe(msg.sender_id)"
                   [class.text-gray-800]="!isMe(msg.sender_id)">
                <p class="text-[15px] leading-relaxed">{{ msg.content }}</p>
                <div class="text-[10px] mt-1 text-right"
                     [class.text-white/70]="isMe(msg.sender_id)"
                     [class.text-gray-400]="!isMe(msg.sender_id)">
                  {{ msg.created_at | date:'shortTime' }}
                </div>
              </div>
            </div>
          }
          
          @if (messages().length === 0) {
            <div class="text-center py-10 text-gray-500">
              <mat-icon class="text-4xl mb-2 opacity-50">waving_hand</mat-icon>
              <p>Say hello!</p>
            </div>
          }
        }
      </div>

      <!-- Input Area -->
      <div class="bg-white p-3 border-t border-gray-200">
        <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="flex items-end gap-2">
          <button type="button" class="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-gray-50">
            <mat-icon>add_circle_outline</mat-icon>
          </button>
          
          <div class="flex-1 bg-gray-100 rounded-2xl overflow-hidden border border-transparent focus-within:border-[var(--color-accent)] transition-colors">
            <textarea formControlName="content" rows="1" placeholder="Type a message..."
              class="w-full bg-transparent px-4 py-3 outline-none resize-none max-h-32 min-h-[44px]"
              (input)="adjustTextareaHeight($event)"></textarea>
          </div>
          
          <button type="submit" [disabled]="messageForm.invalid || isSending()"
            class="p-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:bg-gray-300 flex items-center justify-center shadow-sm">
            @if (isSending()) {
              <mat-icon class="animate-spin text-[20px]">refresh</mat-icon>
            } @else {
              <mat-icon class="text-[20px]">send</mat-icon>
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class Chat implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  productId = signal<number | null>(null);
  partnerId = signal<number | null>(null);
  messages = signal<Message[]>([]);
  isLoading = signal(true);
  isSending = signal(false);

  messageForm = this.fb.group({
    content: ['', Validators.required]
  });

  ngOnInit() {
    const pId = this.route.snapshot.paramMap.get('productId');
    if (pId) {
      this.productId.set(Number(pId));
      this.partnerId.set(1); // Mock partner ID for UI
      this.loadMessages();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    const pId = this.productId();
    if (!pId) return;

    this.chatService.getMessages(pId).subscribe({
      next: (data) => {
        this.messages.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.isLoading.set(false);
      }
    });
  }

  isMe(senderId: number): boolean {
    const user = this.authService.currentUser();
    return !!user && user.id === senderId;
  }

  sendMessage() {
    if (this.messageForm.valid && this.productId() && this.partnerId()) {
      this.isSending.set(true);
      const content = this.messageForm.value.content!;
      
      this.chatService.sendMessage({
        receiver_id: this.partnerId()!,
        product_id: this.productId()!,
        content
      }).subscribe({
        next: (msg) => {
          this.messages.update(msgs => [...msgs, msg]);
          this.messageForm.reset();
          this.isSending.set(false);
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Failed to send message', err);
          this.isSending.set(false);
        }
      });
    }
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
