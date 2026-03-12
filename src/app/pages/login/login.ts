import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[var(--color-primary)]">Vinted Clone</h1>
          <p class="text-gray-500 mt-2">Log in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" formControlName="email" 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
              placeholder="Enter your email">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" formControlName="password" 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
              placeholder="Enter your password">
          </div>

          @if (error) {
            <div class="text-red-500 text-sm text-center">{{ error }}</div>
          }

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
            class="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <a routerLink="/register" class="text-[var(--color-primary)] font-semibold hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed';
          this.isLoading = false;
        }
      });
    }
  }
}
