import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ApiService } from '../api.service'; 

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
  isError = false; 

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // Add the new 'jobDescription' control
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      status: ['Applied', Validators.required],
      jobDescription: ['', Validators.required], // <-- NEW: Add control
      notes: ['']
    });
  }

  onSubmit() {
    this.jobForm.markAllAsTouched();
    this.submitMessage = ''; 
    this.isError = false;    

    if (this.jobForm.invalid) {
      this.submitMessage = 'Please fill out all required fields.';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;

    // 'this.jobForm.value' now includes the jobDescription
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
        console.error('Error saving job:', err);
        this.isSubmitting = false;
        this.submitMessage = `Error: ${err.message}`; 
        this.isError = true;
      }
    });
  }

  // Helper function to easily access form controls in the template
  get f() {
    return this.jobForm.controls;
  }
}