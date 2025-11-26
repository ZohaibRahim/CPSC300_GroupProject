import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ResumeResource } from '../api.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resources.html',
  styleUrls: ['./resources.scss']
})
export class ResourcesComponent implements OnInit {
  resources: ResumeResource[] = [];
  isLoading = true;
  
  // Track which resume is currently open in the modal
  selectedResource: ResumeResource | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getResources().subscribe(data => {
      this.resources = data;
      this.isLoading = false;
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