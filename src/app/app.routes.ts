import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; 
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
import { JobFormComponent } from './job-form/job-form'; // Import the form component

export const routes: Routes = [
  // Dashboard only shows the list now
  { path: 'dashboard', component: DashboardComponent },
  
  // New dedicated page for adding a job
  { path: 'add-job', component: JobFormComponent },

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } 
];