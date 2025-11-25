import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; // <-- Import Router
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
  isError = false; 

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private router: Router 
  ) {
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      status: ['Applied', Validators.required],
      deadline: [''], // <-- NEW: Add this control (default empty)
      jobDescription: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit() {
    this.jobForm.markAllAsTouched();
    if (this.jobForm.invalid) return;

    this.isSubmitting = true;

    this.apiService.createJob(this.jobForm.value).subscribe({
      next: (savedJob) => {
        this.isSubmitting = false;
        // Automatically go back to the dashboard list after saving
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitMessage = `Error: ${err.message}`; 
        this.isError = true;
      }
    });
  }
  
  get f() { return this.jobForm.controls; }
}