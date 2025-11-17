import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../api.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.scss']
})
export class JobListComponent implements OnInit {
  
  public jobs$: Observable<Job[]>;

  // --- NEW: Toggle Logic ---
  // This will store the ID of the job we want to show the analysis for.
  // We use "number | null" so it can be empty (no job selected).
  public visibleAnalysisId: number | null = null;
  // -------------------------

  constructor(private apiService: ApiService) {
    this.jobs$ = this.apiService.getJobs();
  }

  ngOnInit(): void { }

  // --- NEW: Toggle Function ---
  // This function will be called when the user clicks the "See AI Analysis" button.
  toggleAnalysis(jobId: number) {
    if (this.visibleAnalysisId === jobId) {
      // If it's already visible, hide it (set to null)
      this.visibleAnalysisId = null;
    } else {
      // If it's hidden, show it (set to the job's ID)
      this.visibleAnalysisId = jobId;
    }
  }
  // ----------------------------
}