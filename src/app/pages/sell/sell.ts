import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-sell',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24">
      <header class="bg-white px-4 py-3 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">Sell an item</h1>
        <button (click)="cancel()" class="text-gray-500 hover:text-gray-900">Cancel</button>
      </header>

      <form [formGroup]="sellForm" (ngSubmit)="onSubmit()" class="p-4 space-y-6">
        <!-- Image Upload -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label class="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <div class="flex gap-2 overflow-x-auto pb-2">
            @if (imagePreview) {
              <div class="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                <img [src]="imagePreview" class="w-full h-full object-cover">
                <button type="button" (click)="removeImage()" class="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                  <mat-icon class="text-[16px]">close</mat-icon>
                </button>
              </div>
            }
            <label class="w-24 h-24 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg cursor-pointer hover:bg-[var(--color-primary)]/5 transition-colors">
              <mat-icon>add_a_photo</mat-icon>
              <span class="text-xs mt-1 font-medium">Add photo</span>
              <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
            </label>
          </div>
        </div>

        <!-- Details -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" formControlName="title" placeholder="e.g. White Zara Shirt"
              class="w-full px-3 py-2 border-b border-gray-200 focus:border-[var(--color-accent)] outline-none transition-colors">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea formControlName="description" rows="3" placeholder="Describe your item..."
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"></textarea>
          </div>
        </div>

        <!-- Attributes -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <label class="text-sm font-medium text-gray-700">Category</label>
            <select formControlName="category" class="text-right text-gray-600 bg-transparent outline-none">
              <option value="">Select</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
              <option value="Home">Home</option>
            </select>
          </div>

          <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <label class="text-sm font-medium text-gray-700">Brand</label>
            <input type="text" formControlName="brand" placeholder="e.g. Zara" class="text-right text-gray-600 outline-none w-1/2">
          </div>

          <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <label class="text-sm font-medium text-gray-700">Size</label>
            <input type="text" formControlName="size" placeholder="e.g. M / 38" class="text-right text-gray-600 outline-none w-1/2">
          </div>

          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-gray-700">Condition</label>
            <select formControlName="condition" class="text-right text-gray-600 bg-transparent outline-none">
              <option value="">Select</option>
              <option value="New with tags">New with tags</option>
              <option value="New without tags">New without tags</option>
              <option value="Very good">Very good</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
            </select>
          </div>
        </div>

        <!-- Price -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input type="number" formControlName="price" placeholder="0.00" step="0.01"
              class="w-full pl-8 pr-4 py-3 text-lg font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all">
          </div>
        </div>

        @if (error) {
          <div class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{{ error }}</div>
        }

        <button type="submit" [disabled]="sellForm.invalid || isLoading"
          class="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:opacity-50 shadow-md">
          {{ isLoading ? 'Uploading...' : 'Upload Item' }}
        </button>
      </form>
    </div>
  `
})
export class Sell {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  sellForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    price: ['', [Validators.required, Validators.min(0.1)]],
    category: ['', Validators.required],
    brand: [''],
    size: [''],
    condition: ['', Validators.required]
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  error = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.sellForm.valid) {
      this.isLoading = true;
      this.error = '';

      const formData = new FormData();
      Object.keys(this.sellForm.value).forEach(key => {
        formData.append(key, this.sellForm.value[key as keyof typeof this.sellForm.value]);
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.productService.createProduct(formData).subscribe({
        next: (product) => {
          this.router.navigate(['/product', product.id]);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create product';
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/tabs/home']);
  }
}
