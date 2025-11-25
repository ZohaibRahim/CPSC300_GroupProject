import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { ApiService, Job } from '../api.service'; 
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.scss']
})
export class JobListComponent implements OnInit {
  
  // We'll use this purely for the HTML to subscribe to
  public filteredJobs$: Observable<Job[]>;

  // Tracks the toggle state for AI analysis
  public visibleAnalysisId: number | null = null;

  // --- Filters ---
  // BehaviorSubjects allow us to emit new values whenever the user types/selects
  public searchTerm$ = new BehaviorSubject<string>('');
  public statusFilter$ = new BehaviorSubject<string>('All');

  constructor(private apiService: ApiService, private router: Router) {
    // Combine the 3 streams: Jobs Data, Search Term, Status Filter
    this.filteredJobs$ = combineLatest([
      this.apiService.getJobs(),
      this.searchTerm$,
      this.statusFilter$
    ]).pipe(
      map(([jobs, searchTerm, status]) => {
        // 1. Filter by Status first
        let filtered = jobs;
        if (status !== 'All') {
          filtered = filtered.filter(j => j.status === status);
        }

        // 2. Filter by Search Term (Company or Title)
        if (searchTerm.trim() !== '') {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(j => 
            j.company.toLowerCase().includes(lowerTerm) || 
            j.title.toLowerCase().includes(lowerTerm)
          );
        }

        return filtered;
      })
    );
  }

  ngOnInit(): void { }

  // Helpers to update the filters from the UI
  onSearchChange(term: string) {
    this.searchTerm$.next(term);
  }

  onStatusChange(status: string) {
    this.statusFilter$.next(status);
  }

  // --- Existing Actions ---
  toggleAnalysis(jobId: number) {
    this.visibleAnalysisId = (this.visibleAnalysisId === jobId) ? null : jobId;
  }

  onEdit(jobId: number) {
    this.router.navigate(['/edit-job', jobId]);
  }

  onDelete(jobId: number) {
    if(confirm('Are you sure you want to delete this application?')) {
      this.apiService.deleteJob(jobId).subscribe();
    }
  }
}