import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../api.service'; 
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.scss']
})
export class JobListComponent implements OnInit {
  
  public jobs$: Observable<Job[]>;
  public visibleAnalysisId: number | null = null;

  constructor(private apiService: ApiService, private router: Router) {
    this.jobs$ = this.apiService.getJobs();
  }

  ngOnInit(): void { }

  toggleAnalysis(jobId: number) {
    if (this.visibleAnalysisId === jobId) {
      this.visibleAnalysisId = null;
    } else {
      this.visibleAnalysisId = jobId;
    }
  }

  // --- NEW: Action Handlers ---
  onEdit(jobId: number) {
    this.router.navigate(['/edit-job', jobId]);
  }

  onDelete(jobId: number) {
    // Simple confirmation
    if(confirm('Are you sure you want to delete this application?')) {
      this.apiService.deleteJob(jobId).subscribe(() => {
        console.log(`Job ${jobId} deleted.`);
        // The list will auto-refresh because of the BehaviorSubject in ApiService
      });
    }
  }
  // ----------------------------
}