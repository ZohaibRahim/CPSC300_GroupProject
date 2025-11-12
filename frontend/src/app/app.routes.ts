import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; // <-- FIXED: Removed .ts
import { LoginComponent } from './login/login';         // <-- FIXED: Removed .ts

export const routes: Routes = [
  // The path for the main application view
  { path: 'dashboard', component: DashboardComponent },

  // <-- ADD THIS LOGIN ROUTE
  { path: 'login', component: LoginComponent },
  
  // Redirects the default root path ('') to 'dashboard'
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // A wildcard route for any unknown paths
  { path: '**', redirectTo: '/dashboard' } 
];