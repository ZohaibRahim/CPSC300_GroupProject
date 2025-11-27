import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AnalysisService, AnalysisResponse } from './analysis.service';
import { ApiService } from '../api.service'; // To get the saved resume
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './analysis.html',
  styleUrls: ['./analysis.scss']
})
export class AnalysisComponent implements OnInit {
  analysisForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  result: AnalysisResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private analysisService: AnalysisService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.analysisForm = this.fb.group({
      jobDescription: ['', [Validators.required, Validators.minLength(50)]],
      resumeText: ['', [Validators.required, Validators.minLength(50)]],
      useAi: [true] // Default to true
    });
  }

  ngOnInit(): void {
    // 1. Auto-load the user's saved master resume
    this.apiService.getResume().pipe(first()).subscribe(resume => {
      if (resume) {
        this.analysisForm.patchValue({ resumeText: resume });
      }
    });

    // 2. Check if a Job Description was passed from the Dashboard/Job List
    const state = history.state;
    if (state && state.jobDescription) {
      this.analysisForm.patchValue({ jobDescription: state.jobDescription });
    }
  }

  onAnalyze() {
    if (this.analysisForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;

    const formData = this.analysisForm.value;

    const requestData = {
      job_description: formData.jobDescription,
      resume_text: formData.resumeText,
      use_ai: formData.useAi
    };

    this.analysisService.analyzeResume(requestData).subscribe({
      next: (response) => {
        this.result = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Analysis failed', err);
        this.errorMessage = 'Could not connect to the AI server. Please ensure the backend is running on port 3000.';
        this.isLoading = false;
      }
    });
  }
}