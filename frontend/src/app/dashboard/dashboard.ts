import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'; 
import { CommonModule } from '@angular/common'; 
import { JobFormComponent } from '../job-form/job-form';
import { JobListComponent } from '../job-list/job-list'; // <-- FIXED: Removed '.component' from the path

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    JobFormComponent,
    JobListComponent // <-- This will now work because the import is fixed
  ], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  
  healthStatus: string = 'Checking backend connection...';
  
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // ... (health check logic is unchanged) ...
    this.apiService.checkHealth().subscribe({
      next: (response) => {
        this.healthStatus = `✅ Backend Connected (MOCK)! Response: ${JSON.stringify(response)}`;
      },
      error: (err) => {
        this.healthStatus = `❌ Error in Mocking: ${err.message}`;
      }
    });
  }
}