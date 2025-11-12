import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ApiService } from '../api.service'; // <-- ApiService is already imported

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './job-form.html',
  styleUrls: ['./job-form.scss']
})
export class JobFormComponent {
  jobForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) { // <-- Already injected
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      status: ['Applied', Validators.required],
      notes: ['']
    });
  }

  // --- THIS IS THE UPDATED METHOD ---
  onSubmit() {
    this.jobForm.markAllAsTouched();

    if (this.jobForm.invalid) {
      this.submitMessage = 'Please fill out all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = 'Saving...';

    // --- NEW: Call the ApiService ---
    this.apiService.createJob(this.jobForm.value).subscribe({
      next: (savedJob) => {
        console.log('Job saved!', savedJob);
        this.isSubmitting = false;
        this.submitMessage = 'Job application saved!';
        this.jobForm.reset({ status: 'Applied' }); // Reset form to defaults
        
        // Hide success message after 3 seconds
        setTimeout(() => this.submitMessage = '', 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitMessage = 'Error saving job. Please try again.';
        console.error('Error saving job:', err);
      }
    });
  }

  get f() {
    return this.jobForm.controls;
  }
}