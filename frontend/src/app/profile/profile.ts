import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { first } from 'rxjs/operators'; // Used to get the *first* value from the service

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Import this for forms
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  resumeForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  isError = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.resumeForm = this.fb.group({
      resumeText: [''] // Just one big text field
    });
  }

  ngOnInit(): void {
    // When the component loads, let's load the user's saved resume
    this.apiService.getResume().pipe(first()).subscribe(savedResume => {
      this.resumeForm.patchValue({ resumeText: savedResume });
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.isError = false;
    this.submitMessage = 'Saving...';

    const newResumeText = this.resumeForm.value.resumeText;

    this.apiService.saveResume(newResumeText).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitMessage = response.message;
        this.isError = false;
        setTimeout(() => this.submitMessage = '', 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitMessage = 'An error occurred. Please try again.';
        this.isError = true;
      }
    });
  }
}