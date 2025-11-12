import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ApiService } from '../api.service'; // We'll use this soon

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // <-- Add this to imports
  ],
  templateUrl: './job-form.html',
  styleUrls: ['./job-form.scss']
})
export class JobFormComponent {
  jobForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // This creates the form and sets validation rules
    // This directly addresses your Week 2 validation task!
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      status: ['Applied', Validators.required], // Default value
      notes: ['']
    });
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.jobForm.markAllAsTouched();

    if (this.jobForm.invalid) {
      this.submitMessage = 'Please fill out all required fields.';
      return; // Stop if the form is invalid
    }

    this.isSubmitting = true;
    this.submitMessage = 'Submitting...';

    // In a real app, you'd call the ApiService here:
    // this.apiService.createJob(this.jobForm.value).subscribe({ ... });

    // For now, we'll just log it and reset
    console.log('Form Submitted!', this.jobForm.value);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitMessage = 'Job application saved (mock)!';
      this.jobForm.reset({ status: 'Applied' }); // Reset form to defaults
    }, 1000);
  }

  // Helper function to easily check for validation errors in the HTML
  get f() {
    return this.jobForm.controls;
  }
}