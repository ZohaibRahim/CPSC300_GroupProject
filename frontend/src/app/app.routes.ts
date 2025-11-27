import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; 
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
import { JobFormComponent } from './job-form/job-form'; 
import { CoverLetterComponent } from './cover-letter/cover-letter'; 
import { BoardComponent } from './board/board'; 
import { ResourcesComponent } from './resources/resources';
import { UpdatesComponent } from './updates/updates';
import { AnalysisComponent } from './analysis/analysis';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // 1. Login Page
  
  // App Pages
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-job', component: JobFormComponent },
  { path: 'edit-job/:id', component: JobFormComponent },
  { path: 'board', component: BoardComponent },
  { path: 'cover-letter', component: CoverLetterComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'updates', component: UpdatesComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];