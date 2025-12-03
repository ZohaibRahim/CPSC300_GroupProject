import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../api.service';
import { Router } from '@angular/router'; // <--- Import Router
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class BoardComponent implements OnInit {
  
  // NEW Column
  toApply: Job[] = [];
  applied: Job[] = [];
  interviewing: Job[] = [];
  offer: Job[] = [];
  rejected: Job[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to jobs$ instead of calling getJobs() once
    this.apiService.jobs$.subscribe(jobs => {
      this.filterJobs(jobs);
    });
    
    // Also load jobs initially
    this.apiService.getJobs().subscribe();
  }

  filterJobs(jobs: Job[]) {
    this.toApply = jobs.filter(j => j.status === 'To Apply'); // <-- NEW
    this.applied = jobs.filter(j => j.status === 'Applied');
    this.interviewing = jobs.filter(j => j.status === 'Interviewing');
    this.offer = jobs.filter(j => j.status === 'Offer');
    this.rejected = jobs.filter(j => j.status === 'Rejected');
  }

  drop(event: CdkDragDrop<Job[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id; // Get new status from container ID
      
      // Optimistically update UI first for immediate feedback
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      // Update backend with complete job object
      this.apiService.updateJob(item.id, {
        company: item.company,
        title: item.title,
        status: newStatus,
        notes: item.notes || null,
        jobDescription: item.jobDescription || '',
        aiAnalysis: item.aiAnalysis || null,
        deadline: item.deadline || null
      }).subscribe({
        next: () => {
          // Success - jobs$ subscription will refresh and correct any inconsistencies
        },
        error: (err) => {
          // On error, refresh from backend to revert UI
          console.error('Failed to update job status:', err);
          this.apiService.getJobs().subscribe();
        }
      });
    }
  }

  onCardClick(jobId: number) {
    this.router.navigate(['/edit-job', jobId]);
  }
}