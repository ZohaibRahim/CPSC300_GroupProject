import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; 
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile'; // <-- FIXED: Corrected the import

export const routes: Routes = [
  // The path for the main application view
  { path: 'dashboard', component: DashboardComponent },
  
  // The path for authentication
  { path: 'login', component: LoginComponent },

  // --- NEW: Add the Profile route ---
  { path: 'profile', component: ProfileComponent },
  
  // Redirects the default root path ('') to 'dashboard'
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // A wildcard route for any unknown paths
  { path: '**', redirectTo: '/dashboard' } 
];