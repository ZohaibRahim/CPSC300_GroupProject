import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ApiService } from '../api.service'; 

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrls: ['./job-form.scss']
})
export class JobFormComponent {
  jobForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  isError = false; // <-- NEW: Add a flag to track if the message is an error

  constructor(private fb: FormBuilder, private apiService: ApiService) {
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
    this.submitMessage = ''; // Clear previous message
    this.isError = false;    // Reset error flag

    if (this.jobForm.invalid) {
      this.submitMessage = 'Please fill out all required fields.';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;

    this.apiService.createJob(this.jobForm.value).subscribe({
      next: (savedJob) => {
        console.log('Job saved!', savedJob);
        this.isSubmitting = false;
        this.submitMessage = 'Job application saved!';
        this.isError = false;
        this.jobForm.reset({ status: 'Applied' });
        
        setTimeout(() => this.submitMessage = '', 3000);
      },
      error: (err) => {
        // --- THIS IS THE "HANDLE FAILURE" PART ---
        console.error('Error saving job:', err);
        this.isSubmitting = false;
        // NEW: Display the *actual* error message from the API
        this.submitMessage = `Error: ${err.message}`; 
        this.isError = true;
        // We don't reset the form, so the user can try again
      }
    });
  }

  get f() {
    return this.jobForm.controls;
  }
}