import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'; 
import { CommonModule } from '@angular/common'; 
// Removed JobFormComponent since we moved it to the sidebar
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
  
  healthStatus: string = 'Checking...';
  
  // The service is injected as 'apiService'
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

    this.apiService.checkHealth().subscribe({
      next: (response: any) => {
        this.healthStatus = `Online`;
      },
      error: (err: any) => {
        this.healthStatus = `Offline`;
      }
    });
  }
}