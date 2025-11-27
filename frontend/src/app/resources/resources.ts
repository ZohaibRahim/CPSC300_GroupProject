import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ResumeResource, GuideResource } from '../api.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resources.html',
  styleUrls: ['./resources.scss']
})
export class ResourcesComponent implements OnInit {
  resumes: ResumeResource[] = [];
  guides: GuideResource[] = []; // New property for guides
  isLoading = true;
  
  // Track which resume is currently open in the modal
  selectedResource: ResumeResource | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // ForkJoin allows us to wait for both requests to complete
    // But for simplicity here, we'll just nest the subscriptions.
    
    // 1. Get Resumes
    this.apiService.getResources().subscribe(resumeData => {
      this.resumes = resumeData;
      
      // 2. Get Guides once resumes are loaded
      this.apiService.getGuides().subscribe(guideData => {
        this.guides = guideData;
        this.isLoading = false;
      });
    });
  }

  // Open the modal
  openResume(resource: ResumeResource) {
    this.selectedResource = resource;
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  // Close the modal
  closeModal() {
    this.selectedResource = null;
    // Restore scrolling
    document.body.style.overflow = 'auto';
  }
}