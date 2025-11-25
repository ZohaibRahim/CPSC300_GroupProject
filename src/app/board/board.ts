import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../api.service';
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
  
  // The 4 Columns
  applied: Job[] = [];
  interviewing: Job[] = [];
  offer: Job[] = [];
  rejected: Job[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Subscribe to the job list and sort them into columns
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

  // This function runs when you drop a card
  drop(event: CdkDragDrop<Job[]>) {
    if (event.previousContainer === event.container) {
      // Moving within the same column (just reordering)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving to a NEW column!
      const item = event.previousContainer.data[event.previousIndex];
      
      // 1. Visually move it immediately
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // 2. Determine the new status based on the column ID
      const newStatus = event.container.id; // We will set IDs in HTML like 'Applied', 'Offer'
      
      // 3. Update the backend
      this.apiService.updateJob(item.id, { status: newStatus }).subscribe();
    }
  }
}