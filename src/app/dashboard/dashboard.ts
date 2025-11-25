import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'; 
import { CommonModule } from '@angular/common'; 
// Removed JobFormComponent since it is now on a separate page
import { JobListComponent } from '../job-list/job-list'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    JobListComponent 
  ], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  
  healthStatus: string = 'Checking backend connection...';
  
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.checkHealth().subscribe({
      // FIXED: Added ': any' to satisfy strict mode
      next: (response: any) => {
        this.healthStatus = `✅ Backend Connected (MOCK)! Response: ${JSON.stringify(response)}`;
      },
      error: (err: any) => {
        this.healthStatus = `❌ Error in Mocking: ${err.message}`;
      }
    });
  }
}