import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cover-letter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cover-letter.html',
  styleUrls: ['./cover-letter.scss']
})
export class CoverLetterComponent {
  coverLetterForm: FormGroup;
  isGenerating = false;
  generatedLetter = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.coverLetterForm = this.fb.group({
      jobDescription: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit() {
    if (this.coverLetterForm.invalid) return;

    this.isGenerating = true;
    this.generatedLetter = ''; // Clear previous result
    this.errorMessage = '';

    const jobDesc = this.coverLetterForm.value.jobDescription;

    this.apiService.generateCoverLetter(jobDesc).subscribe({
      next: (response) => {
        this.generatedLetter = response.coverLetter;
        this.isGenerating = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to generate cover letter. Please try again.';
        this.isGenerating = false;
      }
    });
  }

  // Helper to copy text to clipboard
  copyToClipboard() {
    navigator.clipboard.writeText(this.generatedLetter);
    alert('Cover letter copied to clipboard!');
  }
}