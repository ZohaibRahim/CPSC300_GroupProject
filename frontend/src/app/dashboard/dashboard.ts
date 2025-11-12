import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'; 
import { CommonModule } from '@angular/common'; 
// No longer need RouterLink here, so it's removed.
import { JobFormComponent } from '../job-form/job-form'; // <-- IMPORT the new form component

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    JobFormComponent // <-- ADD the new form component to imports
  ], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  
  healthStatus: string = 'Checking backend connection...';
  
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('Dashboard loading. Initiating backend health check (MOCK).');
    
    this.apiService.checkHealth().subscribe({
      next: (response) => {
        this.healthStatus = `✅ Backend Connected (MOCK)! Response: ${JSON.stringify(response)}`;
        console.log('Simulated health check success:', response);
      },
      error: (err) => {
        this.healthStatus = `❌ Error in Mocking: ${err.message}`;
        console.error('Mocking error:', err);
      }
    });
  }
}