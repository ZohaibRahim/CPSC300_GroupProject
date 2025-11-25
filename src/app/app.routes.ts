import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; 
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
import { JobFormComponent } from './job-form/job-form'; 
import { CoverLetterComponent } from './cover-letter/cover-letter'; // <--- Import

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-job', component: JobFormComponent },
  
  // --- NEW ROUTE ---
  { path: 'cover-letter', component: CoverLetterComponent },

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } 
];