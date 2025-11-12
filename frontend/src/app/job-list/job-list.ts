import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../api.service'; // Import the service and the Job interface
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.scss']
})
export class JobListComponent implements OnInit {
  // This will hold our "live" stream of jobs from the service
  public jobs$: Observable<Job[]>;

  constructor(private apiService: ApiService) {
    // In the constructor, we connect our local 'jobs$' to the one in the service.
    // The data will flow automatically from here.
    this.jobs$ = this.apiService.getJobs();
  }

  ngOnInit(): void {
    // You can also just assign it here, both work!
    // this.jobs$ = this.apiService.getJobs();
  }
}