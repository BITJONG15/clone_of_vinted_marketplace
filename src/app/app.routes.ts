import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { 
    path: 'tabs', 
    loadComponent: () => import('./pages/tabs/tabs').then(m => m.Tabs),
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites').then(m => m.Favorites) },
      { path: 'sell', loadComponent: () => import('./pages/sell/sell').then(m => m.Sell) },
      { path: 'messages', loadComponent: () => import('./pages/messages/messages').then(m => m.Messages) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'product/:id', loadComponent: () => import('./pages/product-details/product-details').then(m => m.ProductDetails) },
  { path: 'chat/:productId', loadComponent: () => import('./pages/chat/chat').then(m => m.Chat) },
  { path: '**', redirectTo: 'tabs/home' }
];
