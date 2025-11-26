import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router'; // <-- Import ActivatedRoute
import { ApiService } from '../api.service'; 

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrls: ['./job-form.scss']
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  isError = false; 
  
  // NEW: Track Edit Mode
  isEditMode = false;
  currentJobId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute // <-- Inject Route to read params
  ) {
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      status: ['Applied', Validators.required],
      deadline: [''], 
      jobDescription: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Check if there is an 'id' in the URL
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.isEditMode = true;
      this.currentJobId = Number(idParam);
      this.loadJobData(this.currentJobId);
    }
  }

  loadJobData(id: number) {
    this.apiService.getJob(id).subscribe(job => {
      if (job) {
        // Pre-fill the form with existing data
        this.jobForm.patchValue(job);
      } else {
        // Handle case where ID doesn't exist
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    this.jobForm.markAllAsTouched();
    if (this.jobForm.invalid) return;

    this.isSubmitting = true;

    if (this.isEditMode && this.currentJobId) {
      // --- UPDATE LOGIC ---
      this.apiService.updateJob(this.currentJobId, this.jobForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']); // Go back to list
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // --- CREATE LOGIC (Existing) ---
      this.apiService.createJob(this.jobForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  handleError(err: any) {
    this.isSubmitting = false;
    this.submitMessage = `Error: ${err.message}`;
    this.isError = true;
  }
  
  get f() { return this.jobForm.controls; }
}