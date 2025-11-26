import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard'; 
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
import { JobFormComponent } from './job-form/job-form'; 
import { CoverLetterComponent } from './cover-letter/cover-letter'; 
import { BoardComponent } from './board/board';
import { ResourcesComponent } from './resources/resources';
import { UpdatesComponent } from './updates/updates';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'board', component: BoardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-job', component: JobFormComponent },
  { path: 'edit-job/:id', component: JobFormComponent },
  { path: 'cover-letter', component: CoverLetterComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'updates', component: UpdatesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } 
];