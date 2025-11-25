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
  
  applied: Job[] = [];
  interviewing: Job[] = [];
  offer: Job[] = [];
  rejected: Job[] = [];

  // Inject Router
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getJobs().subscribe(jobs => {
      this.filterJobs(jobs);
    });
  }

  filterJobs(jobs: Job[]) {
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
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const newStatus = event.container.id;
      this.apiService.updateJob(item.id, { status: newStatus }).subscribe();
    }
  }

  // --- NEW: Click Handler ---
  onCardClick(jobId: number) {
    this.router.navigate(['/edit-job', jobId]);
  }
}